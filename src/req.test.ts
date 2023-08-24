import { describe, expect, it } from "vitest"
import { Req } from "./req.js"

describe("req.request", () => {
  it("should send a GET request", async () => {
    const req = new Req()
    const res = await req.request("http://localhost/method", { method: "GET" })
    expect(res).toStrictEqual({ method: "GET", success: true })
  })

  it("should send a POST request", async () => {
    const req = new Req()
    const res = await req.request("http://localhost/method", { method: "POST" })
    expect(res).toStrictEqual({ method: "POST", success: true })
  })

  it("should respect the baseURL", async () => {
    const req = new Req()
    req.baseURL = "http://localhost"
    const res = await req.request("/method", { method: "GET" })
    expect(res).toStrictEqual({ method: "GET", success: true })
  })
})

describe.each(["options", "head", "post", "put", "patch", "delete"])(
  "req.%s",
  (method) => {
    it(`should send a ${method.toUpperCase()} request`, async () => {
      const req = new Req()
      const res = await (req as any)[method]("http://localhost/method")
      expect(res).toStrictEqual({ method: method.toUpperCase(), success: true })
    })
  },
)

describe("req.post", () => {
  it("should send a POST request with a body", async () => {
    const req = new Req()
    const res = await req.post("http://localhost/body", { foo: "bar" })
    expect(res).toStrictEqual({
      body: { foo: "bar" },
      method: "POST",
      success: true,
    })
  })
})
