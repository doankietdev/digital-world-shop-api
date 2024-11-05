import app from "~/app";
import request from "supertest";
import { getCredentials } from "../credentials";

describe("Cart API", () => {
  let USER, CLIENT_ID, ACCESS_TOKEN, REFRESH_TOKEN;
  let mockAddCart;
  beforeEach(async () => {
    // Prepare test data
    const credentials = await getCredentials();
    USER = credentials?.user;
    CLIENT_ID = credentials?.clientId;
    ACCESS_TOKEN = credentials?.accessToken;
    REFRESH_TOKEN = credentials?.refreshToken;
    // Mock data
    mockAddCart = {
      productId: "667283d7322b41490e8f7569",
      variantId: "667283d7322b41490e8f756a",
      quantity: 1,
    };
  });

  it("Call /api/v2/add-to-cart", async () => {
    const response = await request(app)
      .post("/api/v2/carts/add-to-cart?_currency=USD")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${ACCESS_TOKEN}`)
      .set("X-Client-Id", CLIENT_ID)
      .set("X-User-Id", USER._id)
      .send(mockAddCart);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe("Add product to cart successfully");
      expect(response.body.metadata.cart.userId).toBe(USER._id);
      expect(response.body.metadata.cart.countProducts).toBeGreaterThanOrEqual(mockAddCart.quantity);
      const hasProductInCart = response.body.metadata.cart.products.find(product => product.product._id === mockAddCart.productId && product.variantId === mockAddCart.variantId);
      expect(hasProductInCart).toBeTruthy();
  });

  it("Call /api/v2/add-products-to-cart", async () => {
    // Test case
  });

  it("Call /api/v2/update-product-quantity", async () => {
    // Test case
  });

  it("Call /api/v2/update-variant", async () => {
    // Test case
  });

  it("Call /api/v2/delete-products", async () => {
    // Test case
  });

  it("Call /api/v2/get-user-cart", async () => {
    // Test case
  });
});
