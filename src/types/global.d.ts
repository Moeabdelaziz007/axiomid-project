export {};

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      /* eslint-disable @typescript-eslint/no-explicit-any */
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
      /* eslint-enable @typescript-eslint/no-explicit-any */
    };
  }
}
