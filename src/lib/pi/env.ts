/**
 * Pi Network environment loader (server-only).
 *
 * This module centralises every interaction with the L0 authority's Pi
 * Network configuration so that:
 *   1. The Pi platform API key and wallet seed are never imported from a
 *      client component (the `server-only` import below crashes the build if
 *      they ever are).
 *   2. Missing required variables fail fast at boot instead of producing
 *      cryptic 500s in a payment handler.
 *   3. The sandbox vs. mainnet decision is made in one place.
 *
 * The Pi domain-ownership proof for axiomid.app lives at
 * `public/validation-key.txt` and is NOT a secret; it is a hash issued by
 * the Pi Developer Portal that anyone can fetch.
 */

import "server-only";

export interface PiEnv {
  /** Server-side Pi Platform API key (Pi Developer Portal). */
  apiKey: string;
  /**
   * Optional Stellar-format seed for the server-side Pi wallet used to sign
   * app-to-user payments. Empty string when the app only consumes
   * user-to-app payments.
   */
  walletPrivateSeed: string;
  /** Whether to route Pi SDK calls through the sandbox network. */
  sandbox: boolean;
  /** Base URL of the deployed app, e.g. `https://axiomid.app`. */
  siteUrl: string;
}

let cached: PiEnv | null = null;

function readRequired(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `[axiomid:pi] Missing required environment variable: ${name}. ` +
        `Set it locally in .env.local or in the Vercel project settings.`,
    );
  }
  return value;
}

function readOptional(name: string, fallback = ""): string {
  const raw = process.env[name];
  return raw == null ? fallback : raw.trim();
}

/**
 * Returns the Pi environment for this process. Throws if any required
 * variable is missing. Safe to call from route handlers, server actions
 * and server components.
 */
export function getPiEnv(): PiEnv {
  if (cached) return cached;

  cached = {
    apiKey: readRequired("PI_API_KEY"),
    walletPrivateSeed: readOptional("PI_WALLET_PRIVATE_SEED"),
    sandbox: readOptional("NEXT_PUBLIC_PI_SANDBOX", "false") === "true",
    siteUrl: readOptional("NEXT_PUBLIC_SITE_URL", "https://axiomid.app"),
  };

  return cached;
}

/**
 * Test-only helper that clears the cached env so subsequent reads pick up
 * fresh values. Never call this from production code.
 */
export function __resetPiEnvCacheForTests(): void {
  cached = null;
}
