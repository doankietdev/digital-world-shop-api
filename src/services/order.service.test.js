import OrderService from "./orderService";
import OrderModel from "../models/orderModel";
import AddressModel from '../models/addressModel'
import { dataGetOrdeOfCurrentUser, dataGetOrdersOfCurrentUser } from "~/mockData/data.test.mock";
import mongooseHelper from "~/helpers/mongooseHelper";
import currencyService from "./currencyService";
import addressService from "./addressService";
import { parseQueryParams } from "~/utils/formatter";

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

  describe("Call getOrdersOfCurrentUser", () => {
    it("should return orders of current user", async () => {
      jest.mock("~/utils/formatter", () => ({
        parseQueryParams: jest.fn().mockReturnValue({
          query: {},
          limit: 10,
          page: 1,
          skip: 0,
          sort: "--updatedAt",
          _currency: "VND",
        }),
      }));
      jest
        .spyOn(OrderModel, "find")
        .mockImplementationOnce(() => ({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  populate: jest.fn().mockReturnValue(dataGetOrdersOfCurrentUser.foundOrders),
                }),
              }),
            }),
          }),
        }))
        .mockImplementationOnce(() => ({
          countDocuments: jest.fn().mockReturnValue(dataGetOrdersOfCurrentUser.foundOrders.length),
        }));

      jest
        .spyOn(currencyService, "getExchangeRate")
        .mockImplementation(() => Promise.resolve(dataGetOrdersOfCurrentUser.exchangeRate));

      jest
        .spyOn(addressService, "getUserAddress")
        .mockImplementationOnce(() => Promise.resolve(dataGetOrdersOfCurrentUser.shippingAddresses[0]))
        .mockImplementationOnce(() => Promise.resolve(dataGetOrdersOfCurrentUser.shippingAddresses[1]))
        .mockImplementationOnce(() => Promise.resolve(dataGetOrdersOfCurrentUser.shippingAddresses[2]))
        .mockImplementationOnce(() => Promise.resolve(dataGetOrdersOfCurrentUser.shippingAddresses[3]))
        .mockImplementationOnce(() => Promise.resolve(dataGetOrdersOfCurrentUser.shippingAddresses[4]));

      const orders = await OrderService.getOrdersOfCurrentUser(1, {});

      expect(JSON.stringify(orders)).toEqual(JSON.stringify(dataGetOrdersOfCurrentUser.totalOrders));
    });

    it("should throw invalid currency", async () => {
      jest.mock("~/utils/formatter", () => ({
        parseQueryParams: jest.fn().mockReturnValue({
          query: {},
          limit: 10,
          page: 1,
          skip: 0,
          sort: "--updatedAt",
          _currency: "VND",
        }),
      }));
      jest
        .spyOn(OrderModel, "find")
        .mockImplementationOnce(() => ({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  populate: jest.fn().mockReturnValue(dataGetOrdersOfCurrentUser.foundOrders),
                }),
              }),
            }),
          }),
        }))
        .mockImplementationOnce(() => ({
          countDocuments: jest.fn().mockReturnValue(dataGetOrdersOfCurrentUser.foundOrders.length),
        }));

      jest.spyOn(currencyService, "getExchangeRate").mockImplementation(() => Promise.resolve(null));

      try {
        await OrderService.getOrdersOfCurrentUser(1, {});
      } catch (error) {
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual("Invalid currency");
      }
    });
  });

  describe("Call updateStatus", () => {
    it("should update status of order", async () => {
      const _id = "66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b";
      jest.spyOn(OrderModel, "findOneAndUpdate").mockImplementation(() => ({
        _id,
        lean: jest.fn().mockReturnValue({ _id }),
      }));
      const order = await OrderService.updateStatus(1, "PAID");
      expect(JSON.stringify(order)).toEqual(JSON.stringify({ _id }));
    });

    it("should throw error order not found", async () => {
      jest.spyOn(OrderModel, "findOneAndUpdate").mockImplementation(() => null);
      try {
        await OrderService.updateStatus(1, "PAID");
      } catch (error) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual("Order not found");
      }
    });

    it("should throw internal server error", async () => {
      jest.spyOn(OrderModel, "findOneAndUpdate").mockImplementation(() => Promise.reject(new Error()));
      try {
        await OrderService.updateStatus(1, "PAID");
      } catch (error) {
        expect(error.statusCode).toEqual(500);
        expect(error.message).toEqual("Update order status failed");
      }
    });
  });

  describe("Call updateStatusById", () => {
    it("should update status of order by id", async () => {
      const _id = "66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b";
      jest.spyOn(OrderModel, "findOneAndUpdate").mockImplementation(() => ({
        _id,
        lean: jest.fn().mockReturnValue({ _id }),
      }));
      const order = await OrderService.updateStatusById("66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b", "PAID");
      expect(JSON.stringify(order)).toEqual(JSON.stringify({ _id }));
    });

    it("should throw error order not found", async () => {
      jest.spyOn(OrderModel, "findOneAndUpdate").mockImplementation(() => null);
      try {
        await OrderService.updateStatusById("66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b", "PAID");
      } catch (error) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual("Order not found");
      }
    });
  })

  describe('Call deleteOrder', () => {
    it('should delete order', async () => {
      const _id = '66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b'
      jest.spyOn(OrderModel, 'findByIdAndDelete').mockImplementation(() => ({
        _id,
        lean: jest.fn().mockReturnValue({ _id })
      }))
      const order = await OrderService.deleteOrder('66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b')
      expect(JSON.stringify(order)).toEqual(JSON.stringify({ _id }))
    })

    it('should throw error order not found', async () => {
      jest.spyOn(OrderModel, 'findByIdAndDelete').mockImplementation(() => null)
      try {
        await OrderService.deleteOrder('66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b')
      } catch (error) {
        expect(error.statusCode).toEqual(404)
        expect(error.message).toEqual('Order not found')
      }
    })

    it('should throw internal server error', async () => {
      jest.spyOn(OrderModel, 'findByIdAndDelete').mockImplementation(() => Promise.reject(new Error()))
      try {
        await OrderService.deleteOrder('66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b')
      } catch (error) {
        expect(error.statusCode).toEqual(500)
        expect(error.message).toEqual('Delete order failed')
      }
    })
  })
  
  describe('Call updateShippingAdrress', () => {
    it('should throw order not found', async () => {
      jest.spyOn(OrderModel, 'findOne').mockImplementation(() => null)
      try {
        await OrderService.updateShippingAddress('66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b', '66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b')
      } catch (error) {
        console.log({ error })
        expect(error.statusCode).toEqual(404)
        expect(error.message).toEqual('Order not found')
      }
    })

    it('should throw address not found', async () => {
      jest.spyOn(OrderModel, 'findOne').mockImplementation(() => ({
        user: '66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b'
      }))
      jest.spyOn(AddressModel, 'findOne').mockImplementation(() => null)
      try {
        await OrderService.updateShippingAddress('66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b', '66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b')
      } catch (error) {
        expect(error.statusCode).toEqual(404)
        expect(error.message).toEqual('Address not found')
      }
    })

    it('should throw error can not update shipping address', async () => {
      jest.spyOn(OrderModel, 'findOne').mockImplementation(() => ({
        user: '66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b',
        status: 'PAID'
      }))
      jest.spyOn(AddressModel, 'findOne').mockImplementation(() => ({}))
      try {
        await OrderService.updateShippingAddress('66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b', '66346b9f-1b7b-4b3b-8b1b-4f2b1b3b4f2b')
      } catch (error) {
        expect(error.statusCode).toEqual(500)
        expect(error.message).toEqual('Something went wrong')
      }
    })
  })
});
