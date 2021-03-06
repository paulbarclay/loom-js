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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rpc_websockets_1 = require("rpc-websockets");
var events_1 = require("events");
var debug_1 = __importDefault(require("debug"));
var json_rpc_client_1 = require("./json-rpc-client");
var log = debug_1.default('ws-rpc-client');
/**
 * Sends JSON-RPC messages via web sockets.
 */
var WSRPCClient = /** @class */ (function (_super) {
    __extends(WSRPCClient, _super);
    /**
     *
     * @param url
     * @param opts Options object
     * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
     * @param opts.reconnectInterval Number of milliseconds to wait before attempting to reconnect
     *                               (in case the connection drops out).
     * @param opts.maxReconnects Maximum number of times to reconnect, defaults to infinity.
     */
    function WSRPCClient(url, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.url = url;
        _this._isSubcribed = false;
        _this._rpcId = 0;
        _this._getNextRequestId = function () { return (++_this._rpcId).toString(); };
        _this._onEventMessage = function (message) {
            var msgStr = message instanceof ArrayBuffer ? Buffer.from(message).toString() : message;
            var msg = JSON.parse(msgStr);
            // Events from native loomchain have the id equals 0
            // Events from EVM have the id from the evmsubscribe command
            if (msg.id === '0' || /^0x.+$/.test(msg.id)) {
                _this.emit(json_rpc_client_1.RPCClientEvent.Message, _this.url, msg);
            }
        };
        var _a = opts.autoConnect, autoConnect = _a === void 0 ? true : _a, _b = opts.requestTimeout, requestTimeout = _b === void 0 ? 15000 : _b, // 15s
        reconnectInterval = opts.reconnectInterval, _c = opts.maxReconnects, maxReconnects = _c === void 0 ? 0 : _c, // 0 means there is no limit
        _d = opts.generateRequestId, // 0 means there is no limit
        generateRequestId = _d === void 0 ? _this._getNextRequestId : _d;
        _this._client = new rpc_websockets_1.Client(url, {
            autoconnect: autoConnect,
            reconnect: true,
            reconnect_interval: reconnectInterval,
            max_reconnects: maxReconnects
        }, generateRequestId);
        _this.requestTimeout = requestTimeout;
        console.log("WS-RPC-CLIENT: timeout:" + requestTimeout);
        _this.on('newListener', function (event) {
            if (event === json_rpc_client_1.RPCClientEvent.Message && _this.listenerCount(event) === 0) {
                // rpc-websockets is just going to throw away the event messages from the DAppChain because
                // they don't conform to it's idea of notifications or events... fortunately few things in
                // javascript are truly private... so we'll just handle those event message ourselves ;)
                ;
                _this._client.socket.on('message', _this._onEventMessage);
                if (_this._client.ready) {
                    log('Subscribe for events');
                    _this._client
                        .call('subevents', { topics: null }, _this.requestTimeout)
                        .then(function () {
                        _this._isSubcribed = true;
                        _this.emit(json_rpc_client_1.RPCClientEvent.Subscribed, _this.url, true);
                    })
                        .catch(function (err) { return _this.emit(json_rpc_client_1.RPCClientEvent.Error, _this.url, err); });
                }
            }
        });
        _this.on('removeListener', function (event) {
            if (event === json_rpc_client_1.RPCClientEvent.Message && _this.listenerCount(event) === 0) {
                ;
                _this._client.socket.removeListener('message', _this._onEventMessage);
                if (_this._client.ready) {
                    log('Unsubscribed for events');
                    _this._client
                        .call('unsubevents', { topics: null }, _this.requestTimeout)
                        .then(function () {
                        _this._isSubcribed = false;
                        _this.emit(json_rpc_client_1.RPCClientEvent.Subscribed, _this.url, false);
                    })
                        .catch(function (err) {
                        _this.emit(json_rpc_client_1.RPCClientEvent.Error, _this.url, err);
                    });
                }
            }
        });
        _this._client.on('open', function () {
            _this.emit(json_rpc_client_1.RPCClientEvent.Connected, _this.url);
            if (_this.listenerCount(json_rpc_client_1.RPCClientEvent.Message) > 0) {
                _this._client
                    .call('subevents', { topics: null }, _this.requestTimeout)
                    .then(function () {
                    _this._isSubcribed = true;
                    _this.emit(json_rpc_client_1.RPCClientEvent.Subscribed, _this.url, true);
                })
                    .catch(function (err) { return _this.emit(json_rpc_client_1.RPCClientEvent.Error, _this.url, err); });
            }
        });
        _this._client.on('close', function () {
            if (_this.listenerCount(json_rpc_client_1.RPCClientEvent.Message) > 0) {
                _this._isSubcribed = false;
                _this.emit(json_rpc_client_1.RPCClientEvent.Subscribed, _this.url, false);
            }
            _this.emit(json_rpc_client_1.RPCClientEvent.Disconnected, _this.url);
        });
        _this._client.on('error', function (err) { return _this.emit(json_rpc_client_1.RPCClientEvent.Error, _this.url, err); });
        return _this;
    }
    Object.defineProperty(WSRPCClient.prototype, "isSubscribed", {
        get: function () {
            return this._isSubcribed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gracefully closes the underlying web socket connection.
     */
    WSRPCClient.prototype.disconnect = function () {
        this._client.reconnect = false;
        this._client.close(0);
    };
    /**
     * Waits for a connection to be established to the server (if it isn't already).
     * @returns A promise that will be resolved when a connection is established.
     */
    WSRPCClient.prototype.ensureConnectionAsync = function () {
        var _this = this;
        if (this._client.ready) {
            console.log("WS-RPC: client is ready");
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            var ms = new Date().getMilliseconds();
            console.log("WS-RPC: client is NOT ready at " + ms);
            var timeout = setTimeout(function () {
                var newMs = new Date().getMilliseconds();
                console.log("WS-RPC timeout has passed at " + newMs + ".");
                reject(new Error('[WSRPCClient] Timeout while waiting for connection'));
            }, _this.requestTimeout);
            console.log("timeout length: " + timeout.ref.length + ". requestTimeout: " + _this.requestTimeout);
            _this._client.once('open', function () {
                console.log("WS-RPC: client resolved connection");
                clearTimeout(timeout);
                resolve();
            });
        });
    };
    /**
     * Sends a JSON-RPC message.
     * @param method RPC method name.
     * @param params Parameter object or array.
     * @returns A promise that will be resolved with the value of the result field (if any) in the
     *          JSON-RPC response message.
     */
    WSRPCClient.prototype.sendAsync = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Sending RPC msg to " + this.url + ", method " + method);
                        return [4 /*yield*/, this.ensureConnectionAsync()];
                    case 1:
                        _a.sent();
                        log("Sending RPC msg to " + this.url + ", method " + method);
                        return [2 /*return*/, this._client.call(method, params, this.requestTimeout)];
                }
            });
        });
    };
    return WSRPCClient;
}(events_1.EventEmitter));
exports.WSRPCClient = WSRPCClient;
//# sourceMappingURL=ws-rpc-client.js.map