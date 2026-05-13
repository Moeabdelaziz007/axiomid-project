/**
 * @jest-environment node
 */

// `server-only` throws when imported outside a server context. Jest's node
// environment is a server context, but we still stub the module defensively
// so the test never depends on Next.js internals.
jest.mock("server-only", () => ({}));

import { getPiEnv, __resetPiEnvCacheForTests } from "../env";

const ORIGINAL_ENV = process.env;

describe("getPiEnv", () => {
  beforeEach(() => {
    jest.resetModules();
    __resetPiEnvCacheForTests();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.PI_API_KEY;
    delete process.env.PI_WALLET_PRIVATE_SEED;
    delete process.env.NEXT_PUBLIC_PI_SANDBOX;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws a descriptive error when PI_API_KEY is missing", () => {
    expect(() => getPiEnv()).toThrow(/PI_API_KEY/);
  });

  it("returns the parsed env when all required values are present", () => {
    process.env.PI_API_KEY = "test-api-key";
    process.env.PI_WALLET_PRIVATE_SEED = "SABCDEF";
    process.env.NEXT_PUBLIC_PI_SANDBOX = "true";
    process.env.NEXT_PUBLIC_SITE_URL = "https://staging.axiomid.app";

    const env = getPiEnv();

    expect(env).toEqual({
      apiKey: "test-api-key",
      walletPrivateSeed: "SABCDEF",
      sandbox: true,
      siteUrl: "https://staging.axiomid.app",
    });
  });

  it("defaults sandbox to false and siteUrl to https://axiomid.app", () => {
    process.env.PI_API_KEY = "test-api-key";

    const env = getPiEnv();

    expect(env.sandbox).toBe(false);
    expect(env.siteUrl).toBe("https://axiomid.app");
    expect(env.walletPrivateSeed).toBe("");
  });

  it("caches the resolved env across calls", () => {
    process.env.PI_API_KEY = "first";
    const first = getPiEnv();
    process.env.PI_API_KEY = "second";
    const second = getPiEnv();
    expect(first).toBe(second);
    expect(second.apiKey).toBe("first");
  });
});
