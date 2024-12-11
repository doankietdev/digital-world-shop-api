import app from "~/app";
import request from "supertest";

describe("Cart API", () => {
  let mockCart;
  let currentCartQuantity = 0;
  let alterVariantId = "";
  beforeEach(async () => {
    mockCart = {
      productId: "667283d7322b41490e8f7569",
      variantId: "667283d7322b41490e8f756a",
      quantity: 1,
    };
  });

  it("Call /api/v2/add-to-cart", async () => {
    const response = await request(app)
      .post("/api/v2/carts/add-to-cart")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.accessToken}`)
      .set("X-Client-Id", global.clientId)
      .set("X-User-Id", global.user?._id)
      .send(mockCart);

    const foundProduct = response.body.metadata.cart.products.find(
      (product) => product.product._id === mockCart.productId && product.variantId === mockCart.variantId
    );

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBe("Add product to cart successfully");
    expect(response.body.metadata.cart.userId).toBe(global.user?._id);
    expect(response.body.metadata.cart.countProducts).toBeGreaterThanOrEqual(mockCart.quantity);
    expect(foundProduct).toBeDefined();
  });

  it("Call /api/v2/get-user-cart", async () => {
    const response = await request(app)
      .get("/api/v2/carts/get-user-cart")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.accessToken}`)
      .set("X-Client-Id", global.clientId)
      .set("X-User-Id", global.user?._id);

    const foundProduct = response.body.metadata.cart.products.find(
      (item) => item.product._id === mockCart.productId && item.variantId === mockCart.variantId
    );

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBe("Get cart successfully");
    expect(response.body.metadata.cart.userId).toBe(global.user?._id);
    expect(foundProduct).toBeDefined();
    currentCartQuantity = foundProduct.quantity;
  });

  it("Call /api/v2/update-product-quantity", async () => {
    const requestBody = {
      ...mockCart,
      oldQuantity: currentCartQuantity,
    };

    const response = await request(app)
      .post("/api/v2/carts/update-product-quantity")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.accessToken}`)
      .set("X-Client-Id", global.clientId)
      .set("X-User-Id", global.user?._id)
      .send(requestBody);

    const foundProduct = response.body.metadata.cart.products.find(
      (item) => item.product._id === mockCart.productId && item.variantId === mockCart.variantId
    );

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBe("Update product quantity to cart successfully");
    expect(response.body.metadata.cart.userId).toBe(global.user?._id);
    expect(foundProduct).toBeDefined();
    expect(foundProduct.quantity).toBe(requestBody.quantity);

    const currentVariantId = foundProduct.variantId;
    const alterVariants = foundProduct.product.variants.filter((variant) => variant._id !== currentVariantId);
    alterVariantId = alterVariants[0]._id;
  });

  it("Call /api/v2/update-variant", async () => {
    const requestBody = {
      productId: mockCart.productId,
      variantId: alterVariantId,
      oldVariantId: mockCart.variantId,
    };

    const response = await request(app)
      .post("/api/v2/carts/update-variant")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.accessToken}`)
      .set("X-Client-Id", global.clientId)
      .set("X-User-Id", global.user?._id)
      .send(requestBody);

    const foundProduct = response.body.metadata.cart.products.find(
      (item) => item.product._id === requestBody.productId && item.variantId === requestBody.variantId
    );

    mockCart = { ...mockCart, variantId: alterVariantId };
    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBe("Update variant to cart successfully");
    expect(response.body.metadata.cart.userId).toBe(global.user?._id);
    expect(foundProduct).toBeDefined();
  });

  it("Call /api/v2/carts/delete-products", async () => {
    const requestBody = {
      products: [
        {
          productId: mockCart.productId,
          variantId: mockCart.variantId,
        },
      ],
    };

    const response = await request(app)
      .post("/api/v2/carts/delete-products")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.accessToken}`)
      .set("X-Client-Id", global.clientId)
      .set("X-User-Id", global.user?._id)
      .send(requestBody);

    const foundProduct = response.body.metadata.cart.products.find(
      (item) => item.product._id === mockCart.productId && item.variantId === mockCart.variantId
    );

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toBe("Delete products from cart successfully");
    expect(response.body.metadata.cart.userId).toBe(global.user?._id);
    expect(foundProduct).toBeUndefined();
  });
});
