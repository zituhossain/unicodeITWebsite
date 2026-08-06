import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/contact/route";

const valid = { name: "Ada Lovelace", company: "Analytical Engines", email: "ada@example.com", whatsappCountry: "US", whatsappDialCode: "+1", whatsappNumber: "2015550123", service: "Software Development", budget: "$2K – $5K", message: "We need a new identity and website.", website: "" };
const request = (body: unknown, headers: Record<string, string> = {}) => new Request("http://localhost:3000/api/contact", { method: "POST", headers: { "content-type": "application/json", origin: "http://localhost:3000", ...headers }, body: JSON.stringify(body) });

afterEach(() => { vi.unstubAllGlobals(); delete process.env.CONTACT_FORM_WEBHOOK_URL; delete process.env.CONTACT_FORM_WEBHOOK_SECRET; delete process.env.CONTACT_FORM_ALLOWED_ORIGIN; });

describe("POST /api/contact", () => {
  it("rejects invalid data", async () => { const response = await POST(request({ ...valid, email: "not-an-email" })); expect(response.status).toBe(422); expect(await response.json()).toEqual({ ok: false, errorCode: "VALIDATION_FAILED" }); });
  it("silently accepts honeypot submissions", async () => { const response = await POST(request({ ...valid, website: "spam.example" })); expect(response.status).toBe(200); expect(await response.json()).toEqual({ ok: true }); });
  it("reports missing webhook configuration", async () => { const response = await POST(request(valid)); expect(response.status).toBe(503); expect((await response.json()).errorCode).toBe("DELIVERY_NOT_CONFIGURED"); });
  it("delivers and signs valid submissions", async () => { process.env.CONTACT_FORM_WEBHOOK_URL = "https://hooks.example.test/aexo"; process.env.CONTACT_FORM_WEBHOOK_SECRET = "secret"; const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 })); vi.stubGlobal("fetch", fetchMock); const response = await POST(request(valid)); expect(response.status).toBe(200); const options = fetchMock.mock.calls[0][1] as RequestInit; expect((options.headers as Record<string, string>)["x-aexo-signature"]).toMatch(/^sha256=[a-f0-9]{64}$/); });
  it("accepts a short non-empty message", async () => { process.env.CONTACT_FORM_WEBHOOK_URL = "https://hooks.example.test/aexo"; vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 }))); const response = await POST(request({ ...valid, message: "sfad" })); expect(response.status).toBe(200); });
  it("returns safe delivery errors", async () => { process.env.CONTACT_FORM_WEBHOOK_URL = "https://hooks.example.test/aexo"; vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 }))); expect((await POST(request(valid))).status).toBe(502); });
  it("maps webhook timeouts", async () => { process.env.CONTACT_FORM_WEBHOOK_URL = "https://hooks.example.test/aexo"; vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("timed out", "TimeoutError"))); const response = await POST(request(valid)); expect(await response.json()).toEqual({ ok: false, errorCode: "DELIVERY_TIMEOUT" }); });
});
