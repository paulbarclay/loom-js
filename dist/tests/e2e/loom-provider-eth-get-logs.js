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
var helpers_1 = require("../helpers");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *
 *   constructor() {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 */
var contractData = '608060405234801561001057600080fd5b50600a600081905550610114806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606c575b600080fd5b606a600480360381019080803590602001909291905050506094565b005b348015607757600080fd5b50607e60df565b6040518082815260200191505060405180910390f35b806000819055507f2afa03c814297ffc234ff967b6f0863d3c358be243103f20217c8d3a4d39f9c060005434604051808381526020018281526020019250505060405180910390a150565b600080549050905600a165627a7a72305820deed812a797567167162d0af3ae5f0528c39bea0620e32b28e243628cd655dc40029';
function newTransactionToSetState(loomProvider, fromAddr) {
    return __awaiter(this, void 0, void 0, function () {
        var contractDeployResult, contractAddress, ethSendTransactionResult, ethGetTransactionReceiptResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
                case 1:
                    contractDeployResult = _a.sent();
                    contractAddress = contractDeployResult.contractAddress;
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 1,
                            method: 'eth_sendTransaction',
                            params: [
                                {
                                    to: contractAddress,
                                    from: fromAddr,
                                    data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000002',
                                    gas: '0x0',
                                    gasPrice: '0x0',
                                    value: '0x0'
                                }
                            ]
                        })
                        // Transaction receipt in order to obtain the topic of the event NewValueSet
                    ];
                case 2:
                    ethSendTransactionResult = _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 2,
                            method: 'eth_getTransactionReceipt',
                            params: [ethSendTransactionResult.result]
                        })];
                case 3:
                    ethGetTransactionReceiptResult = _a.sent();
                    return [2 /*return*/, { ethGetTransactionReceiptResult: ethGetTransactionReceiptResult, contractAddress: contractAddress }];
            }
        });
    });
}
function testGetLogsPendingState(t, loomProvider, fromAddr) {
    return __awaiter(this, void 0, void 0, function () {
        var newSetTransaction, ethGetLogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newTransactionToSetState(loomProvider, fromAddr)
                    // Filtering to get logs
                ];
                case 1:
                    newSetTransaction = _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 3,
                            method: 'eth_getLogs',
                            params: [
                                {
                                    address: newSetTransaction.contractAddress,
                                    fromBlock: '0x1',
                                    toBlock: 'pending',
                                    topics: [newSetTransaction.ethGetTransactionReceiptResult.result.logs[0].topics[0]]
                                }
                            ]
                        })];
                case 2:
                    ethGetLogs = _a.sent();
                    t.equal(ethGetLogs.result.length, 1, 'Should return one log for the pending block');
                    return [2 /*return*/];
            }
        });
    });
}
function testGetLogsLatest(t, loomProvider, fromAddr) {
    return __awaiter(this, void 0, void 0, function () {
        var newSetTransaction, ethGetLogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newTransactionToSetState(loomProvider, fromAddr)
                    // Await a little to block to be ready
                ];
                case 1:
                    newSetTransaction = _a.sent();
                    // Await a little to block to be ready
                    return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1500)
                        // Filtering to get logs
                    ];
                case 2:
                    // Await a little to block to be ready
                    _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 4,
                            method: 'eth_getLogs',
                            params: [
                                {
                                    address: newSetTransaction.contractAddress,
                                    fromBlock: '0x1',
                                    toBlock: 'latest',
                                    topics: [newSetTransaction.ethGetTransactionReceiptResult.result.logs[0].topics[0]]
                                }
                            ]
                        })];
                case 3:
                    ethGetLogs = _a.sent();
                    t.equal(ethGetLogs.result.length, 1, 'Should return one log for the latest block');
                    return [2 /*return*/];
            }
        });
    });
}
function testGetLogsAny(t, loomProvider, fromAddr) {
    return __awaiter(this, void 0, void 0, function () {
        var ethGetLogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newTransactionToSetState(loomProvider, fromAddr)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1500)
                        // Filtering to get logs
                    ];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 5,
                            method: 'eth_getLogs',
                            params: []
                        })];
                case 3:
                    ethGetLogs = _a.sent();
                    t.equal(ethGetLogs.result.length, 1, 'Should return one log for anything filter');
                    return [2 /*return*/];
            }
        });
    });
}
function testGetLogsAnyPending(t, loomProvider, fromAddr) {
    return __awaiter(this, void 0, void 0, function () {
        var ethGetLogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newTransactionToSetState(loomProvider, fromAddr)
                    // Filtering to get logs
                ];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 6,
                            method: 'eth_getLogs',
                            params: [{ toBlock: 'pending' }]
                        })];
                case 2:
                    ethGetLogs = _a.sent();
                    t.equal(ethGetLogs.result.length, 1, 'Should return one log for anything pending filter');
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('LoomProvider.getEVMLogsAsync', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var privKey, client, fromAddr, loomProvider, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient(privKey);
                fromAddr = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                client.on('error', function (msg) { return console.error('Error on client:', msg); });
                return [4 /*yield*/, testGetLogsPendingState(t, loomProvider, fromAddr)];
            case 1:
                _a.sent();
                return [4 /*yield*/, testGetLogsLatest(t, loomProvider, fromAddr)];
            case 2:
                _a.sent();
                return [4 /*yield*/, testGetLogsAny(t, loomProvider, fromAddr)];
            case 3:
                _a.sent();
                return [4 /*yield*/, testGetLogsAnyPending(t, loomProvider, fromAddr)];
            case 4:
                _a.sent();
                client.disconnect();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 6];
            case 6:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=loom-provider-eth-get-logs.js.map