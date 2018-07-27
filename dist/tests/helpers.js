"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
function getTestUrls() {
    return {
        wsWriteUrl: process.env.TEST_LOOM_DAPP_WS_WRITE_URL || 'ws://127.0.0.1:46657/websocket',
        wsReadUrl: process.env.TEST_LOOM_DAPP_WS_READ_URL || 'ws://127.0.0.1:9999/queryws',
        httpWriteUrl: process.env.TEST_LOOM_DAPP_HTTP_WRITE_URL || 'http://127.0.0.1:46658/rpc',
        httpReadUrl: process.env.TEST_LOOM_DAPP_HTTP_READ_URL || 'http://127.0.0.1:46658/query'
    };
}
exports.getTestUrls = getTestUrls;
/**
 * Creates a client for tests, the default read/write URLs can be overriden by setting the env vars
 * TEST_LOOM_DAPP_WRITE_URL and TEST_LOOM_DAPP_READ_URL. These env vars can be set by modifying
 * the .env.test (see .env.test.example for default values).
 */
function createTestClient(privateKey) {
    var client = new index_1.Client('default', getTestUrls().wsWriteUrl, getTestUrls().wsReadUrl);
    client.addAccount(privateKey);
    return client;
}
exports.createTestClient = createTestClient;
function createTestHttpClient(privateKey) {
    var writer = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().httpWriteUrl }] });
    var reader = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().httpReadUrl }] });
    var client = new index_1.Client('default', writer, reader);
    client.addAccount(privateKey);
    return client;
}
exports.createTestHttpClient = createTestHttpClient;
function createTestWSClient(privateKey) {
    var writer = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().wsWriteUrl }] });
    var reader = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().wsReadUrl }] });
    var client = new index_1.Client('default', writer, reader);
    client.addAccount(privateKey);
    return client;
}
exports.createTestWSClient = createTestWSClient;
function createTestHttpWSClient(privateKey) {
    var writer = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().httpWriteUrl }] });
    var reader = index_1.createJSONRPCClient({
        protocols: [{ url: getTestUrls().httpReadUrl }, { url: getTestUrls().wsReadUrl }]
    });
    var client = new index_1.Client('default', writer, reader);
    client.addAccount(privateKey);
    return client;
}
exports.createTestHttpWSClient = createTestHttpWSClient;
function waitForMillisecondsAsync(ms) {
    return new Promise(function (res) { return setTimeout(res, ms); });
}
exports.waitForMillisecondsAsync = waitForMillisecondsAsync;
//# sourceMappingURL=helpers.js.map