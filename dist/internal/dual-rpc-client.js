"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var json_rpc_client_1 = require("./json-rpc-client");
var ws_rpc_client_1 = require("./ws-rpc-client");
var http_rpc_client_1 = require("./http-rpc-client");
/**
 * Sends JSON-RPC messages via HTTP or WebSocket, and listens to events via WebSocket.
 */
var DualRPCClient = /** @class */ (function (_super) {
    __extends(DualRPCClient, _super);
    /**
     * @param opts.httpUrl HTTP URL to send requests to.
     * @param opts.wsUrl WebSocket URL to connect to.
     * @param opts.protocol Primary protocol to use to send requests, defaults to HTTP.
     * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
     */
    function DualRPCClient(opts) {
        var _this = _super.call(this, opts.wsUrl, opts) || this;
        var _a = opts.protocol, protocol = _a === void 0 ? json_rpc_client_1.JSONRPCProtocol.HTTP : _a, requestTimeout = opts.requestTimeout, _b = opts.generateRequestId, generateRequestId = _b === void 0 ? _this._getNextRequestId : _b;
        _this._http = new http_rpc_client_1.HTTPRPCClient(opts.httpUrl, { requestTimeout: requestTimeout, generateRequestId: generateRequestId });
        _this._protocol = protocol;
        return _this;
    }
    /**
     * Sends a JSON-RPC message.
     * @param method RPC method name.
     * @param params Parameter object or array.
     * @returns A promise that will be resolved with the value of the result field (if any) in the
     *          JSON-RPC response message.
     */
    DualRPCClient.prototype.sendAsync = function (method, params) {
        if (this._protocol === json_rpc_client_1.JSONRPCProtocol.HTTP) {
            return this._http.sendAsync(method, params);
        }
        else {
            return this.sendAsync(method, params);
        }
    };
    return DualRPCClient;
}(ws_rpc_client_1.WSRPCClient));
exports.DualRPCClient = DualRPCClient;
//# sourceMappingURL=dual-rpc-client.js.map