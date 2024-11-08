import app from "~/app";
import request from "supertest";

describe("Order API", () => {
  let mockOrder;
  beforeEach(async () => {
    mockOrder = {
        orderId: '672e51be3e71357eb3f7112e'
    }
  });

  it("Call /api/v1/orders/:orderId/get-order-of-current-user", async () => {
    const response = await request(app)
      .get(`/api/v1/orders/${mockOrder.orderId}/get-order-of-current-user`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.accessToken}`)
      .set("X-Client-Id", global.clientId)
      .set("X-User-Id", global.user?._id)

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBe("Get order of current user successfully");
    expect(response.body.metadata.order._id).toEqual(mockOrder.orderId);
    expect(response.body.metadata.order.shippingAddress).toBeDefined();
    expect(response.body.metadata.order.paymentMethod).toBeDefined();
    expect(response.body.metadata.order.shippingFee).toBeDefined();
    expect(response.body.metadata.order.status).toBeDefined();
    expect(response.body.metadata.order.totalProductsPrice).toBeDefined();
    expect(response.body.metadata.order.totalPayment).toBeDefined();
  });

  it("Call /api/v1/orders/get-orders-of-current-user", async () => {
    const response = await request(app)
      .get("/api/v1/orders/get-orders-of-current-user")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.accessToken}`)
      .set("X-Client-Id", global.clientId)
      .set("X-User-Id", global.user?._id);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBe("Get orders of current user successfully");
    expect(response.body.metadata.page).toBeDefined();
    expect(response.body.metadata.limit).toBeDefined();
    expect(response.body.metadata.totalPages).toBeDefined();

    expect(response.body.metadata.totalItems).toBeDefined();
  });

//   it("Call /api/v1/orders/:orderId/update-status", async () => {
//     const requestBody = {
//         status: "completed",
//     };

//     const response = await request(app)
//       .post(`/api/v1/orders/${mockOrder.orderId}/update-status`)
//       .set("Content-Type", "application/json")
//       .set("Authorization", `Bearer ${global.accessToken}`)
//       .set("X-Client-Id", global.clientId)
//       .set("X-User-Id", global.user?._id)a
//       .send(requestBody);

//     expect(response.status).toBe(200);
//     expect(response.body.statusCode).toBe(200);
//   });

//   it("Call /api/v1/orders/:orderId", async () => {
//     const response = await request(app)
//       .delete(`/api/v1/orders/${mockOrder.orderId}`)
//       .set("Content-Type", "application/json")
//       .set("Authorization", `Bearer ${global.accessToken}`)
//       .set("X-Client-Id", global.clientId)
//       .set("X-User-Id", global.user?._id)

//     expect(response.status).toBe(200);
//   });
});
