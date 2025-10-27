const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ username: "testuser", password: "123456", email: "test@mail.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should login user", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should request password reset", async () => {
    const res = await request(app)
      .post("/api/reset-password")
      .send({ email: "test@mail.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should create a new token", async () => {
    const res = await request(app)
      .post("/api/create-token")
      .send({ name: "TestToken", symbol: "TTK", desc: "Test desc", userAddress: "0x123", paymentMethod: "normal" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should confirm password reset", async () => {
    // önce reset isteği yapıp token al
    const reqRes = await request(app)
      .post("/api/reset-password")
      .send({ email: "test@mail.com" });

    expect(reqRes.statusCode).toBe(200);
    const token = reqRes.body.token;
    expect(typeof token).toBe("string");

    const res = await request(app)
      .post("/api/reset-password/confirm")
      .send({ token, newPassword: "newpass123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should list all tokens", async () => {
    const res = await request(app)
      .get("/api/tokens");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tokens)).toBe(true);
  });

  it("should deny access to admin endpoint for non-admin user", async () => {
    // JWT veya session ile admin olmayan bir kullanıcıyı simüle etmelisin
    const res = await request(app)
      .get("/api/admin/some-action");
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Yetkisiz erişim/i);
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "wrongpass" });
    expect(res.statusCode).toBe(401); // veya 200 ve success: false
    expect(res.body.success).toBe(false);
  });

  it("should fail register with missing fields", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ username: "testuser" }); // eksik password ve email
    expect(res.statusCode).toBe(400); // veya 200 ve success: false
    expect(res.body.success).toBe(false);
  });
});