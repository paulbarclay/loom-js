import { Client, createJSONRPCClient } from '../index'

export function getTestUrls() {
  return {
    wsWriteUrl: process.env.TEST_LOOM_DAPP_WS_WRITE_URL || 'ws://127.0.0.1:46657/websocket',
    wsReadUrl: process.env.TEST_LOOM_DAPP_WS_READ_URL || 'ws://127.0.0.1:9999/queryws',
    httpWriteUrl: process.env.TEST_LOOM_DAPP_HTTP_WRITE_URL || 'http://127.0.0.1:46658/rpc',
    httpReadUrl: process.env.TEST_LOOM_DAPP_HTTP_READ_URL || 'http://127.0.0.1:46658/query'
  }
}

/**
 * Creates a client for tests, the default read/write URLs can be overriden by setting the env vars
 * TEST_LOOM_DAPP_WRITE_URL and TEST_LOOM_DAPP_READ_URL. These env vars can be set by modifying
 * the .env.test (see .env.test.example for default values).
 */
export function createTestClient(privateKey: Uint8Array): Client {
  const client = new Client('default', getTestUrls().wsWriteUrl, getTestUrls().wsReadUrl)
  client.addAccount(privateKey);
  return client
}

export function createTestHttpClient(privateKey: Uint8Array): Client {
  const writer = createJSONRPCClient({ protocols: [{ url: getTestUrls().httpWriteUrl }] })
  const reader = createJSONRPCClient({ protocols: [{ url: getTestUrls().httpReadUrl }] })
  const client = new Client('default', writer, reader)
  client.addAccount(privateKey)
  return client
}

export function createTestWSClient(privateKey: Uint8Array): Client {
  const writer = createJSONRPCClient({ protocols: [{ url: getTestUrls().wsWriteUrl }] })
  const reader = createJSONRPCClient({ protocols: [{ url: getTestUrls().wsReadUrl }] })
  const client = new Client('default', writer, reader)
  client.addAccount(privateKey)
  return client
}

export function createTestHttpWSClient(privateKey: Uint8Array): Client {
  const writer = createJSONRPCClient({ protocols: [{ url: getTestUrls().httpWriteUrl }] })
  const reader = createJSONRPCClient({
    protocols: [{ url: getTestUrls().httpReadUrl }, { url: getTestUrls().wsReadUrl }]
  })
  const client = new Client('default', writer, reader)
  client.addAccount(privateKey)
  return client
}

export function waitForMillisecondsAsync(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}
