import request from "supertest";
import app from "~/app";

describe("Auth API", () => {
  it("should sign in successfully", async () => {
    const response = await request(app)
      .post("/api/v1/auth/sign-in")
      .set("Content-Type", "application/json")
      .send({
        email: "daclamtrannguyen@gmail.com",
        password: "Password@123",
      });
    expect(response.status).toBe(200);
    expect(response.body?.metadata).toHaveProperty("user");
    expect(response.body?.metadata?.user?.email).toEqual('daclamtrannguyen@gmail.com');
    expect(response.body?.metadata).toHaveProperty('accessToken');
    expect(response.body?.metadata).toHaveProperty('refreshToken');
  });

  // Add more tests as needed
});
