import OrderService from "./orderService";
import OrderModel from "../models/orderModel";
import { dataGetOrdeOfCurrentUser } from "~/mockData/data.test.mock";
import mongooseHelper from "~/helpers/mongooseHelper";
import currencyService from "./currencyService";
import addressService from "./addressService";

describe("Order Service", () => {
  describe("Call getById", () => {
    it("should return order by id", async () => {
      const _id = "66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b";
      jest.spyOn(OrderModel, "findOne").mockImplementation(() => {
        return {
          _id,
          lean: jest.fn().mockReturnValue({ _id }),
        };
      });
      const order = await OrderService.getById(1);
      expect(JSON.stringify(order)).toEqual(JSON.stringify({ _id }));
    });
  });

  describe("Call getOrderOfCurrentUser", () => {
    it("should return order of current user", async () => {
      jest.spyOn(OrderModel, "findOne").mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue(dataGetOrdeOfCurrentUser.foundOrder),
        }),
      }));

      jest
        .spyOn(currencyService, "getExchangeRate")
        .mockImplementation(() => Promise.resolve(dataGetOrdeOfCurrentUser.exchangeRate));

      jest
        .spyOn(mongooseHelper, "convertMongooseObjectToVanillaObject")
        .mockImplementation(() => dataGetOrdeOfCurrentUser.orderConverted);

      jest.spyOn(addressService, "getUserAddress").mockImplementation(() => dataGetOrdeOfCurrentUser.shippingAddress);

      const order = await OrderService.getOrderOfCurrentUser(1, 1, "USD");

      expect(JSON.stringify(order)).toEqual(JSON.stringify(dataGetOrdeOfCurrentUser.orderCurrency));
    });

    it("should throw error order not found", async () => {
      jest.spyOn(OrderModel, "findOne").mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue(null),
        }),
      }));

      try {
        await OrderService.getOrderOfCurrentUser(1, 1, "USD");
      } catch (error) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual("Order not found");
      }
    });

    it("should throw error invalid currency", async () => {
      jest.spyOn(OrderModel, "findOne").mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue(dataGetOrdeOfCurrentUser.foundOrder),
        }),
      }));

      jest.spyOn(currencyService, "getExchangeRate").mockImplementation(() => Promise.resolve(null));

      try {
        await OrderService.getOrderOfCurrentUser(1, 1, "USD");
      } catch (error) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Invalid currency");
      }
    });
  });
});
