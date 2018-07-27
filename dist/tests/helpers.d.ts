import { Client } from '../index';
export declare function getTestUrls(): {
    wsWriteUrl: string;
    wsReadUrl: string;
    httpWriteUrl: string;
    httpReadUrl: string;
};
/**
 * Creates a client for tests, the default read/write URLs can be overriden by setting the env vars
 * TEST_LOOM_DAPP_WRITE_URL and TEST_LOOM_DAPP_READ_URL. These env vars can be set by modifying
 * the .env.test (see .env.test.example for default values).
 */
export declare function createTestClient(privateKey: Uint8Array): Client;
export declare function createTestHttpClient(privateKey: Uint8Array): Client;
export declare function createTestWSClient(privateKey: Uint8Array): Client;
export declare function createTestHttpWSClient(privateKey: Uint8Array): Client;
export declare function waitForMillisecondsAsync(ms: number): Promise<{}>;
