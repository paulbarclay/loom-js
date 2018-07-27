"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tape_1 = __importDefault(require("tape"));
var index_1 = require("../../index");
var tests_pb_1 = require("../tests_pb");
var helpers_1 = require("../helpers");
function getClientAndContract(createClient) {
    return __awaiter(this, void 0, void 0, function () {
        var privKey, client, contractAddr, _a, contract;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    privKey = index_1.CryptoUtils.generatePrivateKey();
                    client = createClient(privKey);
                    client.txMiddleware = index_1.createDefaultTxMiddleware(client, privKey);
                    contractAddr = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getContractAddressAsync('BluePrint')];
                case 2:
                    contractAddr = _b.sent();
                    if (!contractAddr) {
                        throw new Error();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    throw new Error('Failed to resolve contract address');
                case 4:
                    contract = new index_1.Contract({ contractAddr: contractAddr, client: client });
                    return [2 /*return*/, { client: client, contract: contract }];
            }
        });
    });
}
function testContractCalls(t, createClient) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, client, contract, msgKey, msgValue, msg, retVal, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, contract = _a.contract;
                    msgKey = '123';
                    msgValue = '456';
                    msg = new tests_pb_1.MapEntry();
                    msg.setKey(msgKey);
                    msg.setValue(msgValue);
                    return [4 /*yield*/, contract.callAsync(client.caller, 'SetMsg', msg)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, contract.callAsync(client.caller, 'SetMsgEcho', msg, new tests_pb_1.MapEntry())];
                case 3:
                    retVal = _b.sent();
                    t.ok(retVal, "callAsync('SetMsgEcho', ...) must return a value");
                    if (retVal) {
                        t.equal(retVal.getKey(), msgKey, 'Key in return value must match the one that was sent');
                        t.equal(retVal.getValue(), msgValue, 'Value in return value must match the one that was sent');
                    }
                    msg.setValue('');
                    return [4 /*yield*/, contract.staticCallAsync(client.caller, 'GetMsg', msg, new tests_pb_1.MapEntry())];
                case 4:
                    result = _b.sent();
                    t.ok(result, "staticCallAsync('GetMsg', ...) must return a value");
                    if (result) {
                        t.equal(result.getValue(), msgValue, 'Return value must match previously set value');
                    }
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function getThisTestClient() {
    var privKey = index_1.CryptoUtils.generatePrivateKey();
    return helpers_1.createTestClient(privKey);
}
function testContractEvents(t, createClient) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, client, contract, msgKey, msgValue, msg, listener1InvokeCount, listener2InvokeCount, listener1, listener2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(getThisTestClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, contract = _a.contract;
                    msgKey = '123';
                    msgValue = '456';
                    msg = new tests_pb_1.MapEntry();
                    msg.setKey(msgKey);
                    msg.setValue(msgValue);
                    listener1InvokeCount = 0;
                    listener2InvokeCount = 0;
                    listener1 = function (event) {
                        t.deepEqual(event.contractAddress, contract.address, 'IChainEventArgs.contractAddress matches');
                        t.deepEqual(event.callerAddress, client.caller, 'IChainEventArgs.callerAddress matches');
                        t.ok(event.blockHeight, 'IChainEventArgs.blockHeight is set');
                        t.ok(event.data.length > 0, 'IChainEventArgs.data is set');
                        var dataStr = Buffer.from(event.data).toString('utf8');
                        var dataObj = JSON.parse(dataStr);
                        t.deepEqual(dataObj, { Method: 'SetMsg', Key: msgKey, Value: msgValue }, 'IChainEventArgs.data is correct');
                        listener1InvokeCount++;
                    };
                    contract.once(index_1.Contract.EVENT, listener1);
                    return [4 /*yield*/, contract.callAsync(client.caller, 'SetMsg', msg)];
                case 2:
                    _b.sent();
                    listener2 = function (event) {
                        listener2InvokeCount++;
                    };
                    contract.on(index_1.Contract.EVENT, listener2);
                    return [4 /*yield*/, contract.callAsync(client.caller, 'SetMsg', msg)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, contract.callAsync(client.caller, 'SetMsg', msg)];
                case 4:
                    _b.sent();
                    t.isEqual(listener1InvokeCount, 1, 'Contract.once listener invoked only once');
                    t.isEqual(listener2InvokeCount, 2, 'Contract.on listener invoked multiple times');
                    contract.removeListener(index_1.Contract.EVENT, listener2);
                    return [4 /*yield*/, contract.callAsync(client.caller, 'SetMsg', msg)];
                case 5:
                    _b.sent();
                    t.isEqual(listener2InvokeCount, 2, 'Contract.on listener not invoked after removal');
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('Contract', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                t.comment('Calls via HTTP');
                return [4 /*yield*/, testContractCalls(t, helpers_1.createTestHttpClient)];
            case 1:
                _a.sent();
                t.comment('Calls via WebSocket');
                return [4 /*yield*/, testContractCalls(t, helpers_1.createTestWSClient)];
            case 2:
                _a.sent();
                t.comment('Calls via HTTP/WebSocket');
                return [4 /*yield*/, testContractCalls(t, helpers_1.createTestHttpWSClient)];
            case 3:
                _a.sent();
                t.comment('Events via WebSocket');
                return [4 /*yield*/, testContractEvents(t, helpers_1.createTestHttpWSClient)];
            case 4:
                _a.sent();
                t.comment('Events via HTTP/WebSocket');
                return [4 /*yield*/, testContractEvents(t, helpers_1.createTestHttpWSClient)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                t.fail(err_1);
                return [3 /*break*/, 7];
            case 7:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=contract-tests.js.map