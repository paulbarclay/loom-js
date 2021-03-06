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
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = __importDefault(require("debug"));
var client_1 = require("./client");
var helpers_1 = require("./helpers");
var loom_pb_1 = require("./proto/loom_pb");
var evm_pb_1 = require("./proto/evm_pb");
var address_1 = require("./address");
var crypto_utils_1 = require("./crypto-utils");
var _1 = require(".");
var log = debug_1.default('loom-provider');
var error = debug_1.default('loom-provider:error');
var numberToHexLC = function (num) {
    return crypto_utils_1.numberToHex(num).toLowerCase();
};
/**
 * Web3 provider that interacts with EVM contracts deployed on Loom DAppChains.
 */
var LoomProvider = /** @class */ (function () {
    /**
     * Constructs the LoomProvider to bridges communication between Web3 and Loom DappChains
     *
     * @param client Client from LoomJS
     * @param privateKey Account private key
     */
    function LoomProvider(client, privateKey) {
        var _this = this;
        console.log("LP: PROVIDER CONSTRUCTOR: " + client.readUrl + " / " + client.writeUrl + " key: " + privateKey + " ");
        this._client = client;
        this.notificationCallbacks = new Array();
        this.accounts = new Map();
        this.accountsAddrList = new Array();
        this._client.addListener(client_1.ClientEvent.Contract, function (msg) {
            return _this._onWebSocketMessage(msg);
        });
        this.addDefaultEvents();
        this.addAccounts([privateKey]);
    }
    /**
     * Creates new accounts by passing the private key array
     *
     * Accounts will be available on public properties accounts and accountsAddrList
     *
     * @param accountsPrivateKey Array of private keys to create new accounts
     */
    LoomProvider.prototype.addAccounts = function (accountsPrivateKey) {
        var _this = this;
        accountsPrivateKey.forEach(function (accountPrivateKey) {
            var publicKey = crypto_utils_1.publicKeyFromPrivateKey(accountPrivateKey);
            var accountAddress = address_1.LocalAddress.fromPublicKey(publicKey).toString();
            console.log("LP ADD ACCOUNT: " + accountAddress);
            _this.accountsAddrList.push(accountAddress);
            _this.accounts.set(accountAddress, accountPrivateKey);
            _this._client.addAccount(accountPrivateKey);
            log("New account added " + accountAddress);
        });
    };
    // PUBLIC FUNCTION TO SUPPORT WEB3
    LoomProvider.prototype.on = function (type, callback) {
        switch (type) {
            case 'data':
                this.notificationCallbacks.push(callback);
                break;
            case 'connect':
                this._client.addListener(client_1.ClientEvent.Connected, callback);
                break;
            case 'end':
                this._client.addListener(client_1.ClientEvent.Disconnected, callback);
                break;
            case 'error':
                this._client.addListener(client_1.ClientEvent.Error, callback);
                break;
        }
    };
    LoomProvider.prototype.addDefaultEvents = function () {
        var _this = this;
        this._client.addListener(client_1.ClientEvent.Disconnected, function () {
            // reset all requests and callbacks
            _this.reset();
        });
    };
    LoomProvider.prototype.removeListener = function (type, callback) {
        switch (type) {
            case 'data':
                this.notificationCallbacks = [];
                break;
            case 'connect':
                this._client.removeListener(client_1.ClientEvent.Connected, callback);
                break;
            case 'end':
                this._client.removeListener(client_1.ClientEvent.Disconnected, callback);
                break;
            case 'error':
                this._client.removeListener(client_1.ClientEvent.Error, callback);
                break;
        }
    };
    LoomProvider.prototype.removeAllListeners = function (type, callback) {
        var _this = this;
        if (type === 'data') {
            this.notificationCallbacks.forEach(function (cb, index) {
                if (cb === callback) {
                    _this.notificationCallbacks.splice(index, 1);
                }
            });
        }
    };
    LoomProvider.prototype.reset = function () {
        this.notificationCallbacks = [];
    };
    LoomProvider.prototype.disconnect = function () {
        this._client.disconnect();
    };
    // Adapter function for sendAsync from truffle provider
    LoomProvider.prototype.sendAsync = function (payload, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!callback) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.send(payload, callback)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.send(payload, function (err, result) {
                                if (err)
                                    reject(err);
                                else
                                    resolve(result);
                            });
                        })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Should be used to make async request
     * This method is used internally by web3, so we adapt it to be used with loom contract
     * when we are wrapping the evm on a DAppChain
     * @param payload JSON payload generated by web3 which will be translated to loom transaction/call
     * @param callback Triggered on end with (err, result)
     */
    LoomProvider.prototype.send = function (payload, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var isArray, functionToExecute, f, result, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log('Request payload', JSON.stringify(payload, null, 2));
                        isArray = Array.isArray(payload);
                        if (isArray) {
                            payload = payload[0];
                        }
                        functionToExecute = function (method) {
                            switch (method) {
                                case 'eth_accounts':
                                    return _this._ethAccounts;
                                case 'eth_blockNumber':
                                    return _this._ethBlockNumber;
                                case 'eth_call':
                                    return _this._ethCall;
                                case 'eth_estimateGas':
                                    return _this._ethEstimateGas;
                                case 'eth_gasPrice':
                                    return _this._ethGasPrice;
                                case 'eth_getBlockByHash':
                                    return _this._ethGetBlockByHash;
                                case 'eth_getBlockByNumber':
                                    return _this._ethGetBlockByNumber;
                                case 'eth_getCode':
                                    return _this._ethGetCode;
                                case 'eth_getFilterChanges':
                                    return _this._ethGetFilterChanges;
                                case 'eth_getLogs':
                                    return _this._ethGetLogs;
                                case 'eth_getTransactionByHash':
                                    return _this._ethGetTransactionByHash;
                                case 'eth_getTransactionReceipt':
                                    return _this._ethGetTransactionReceipt;
                                case 'eth_newBlockFilter':
                                    return _this._ethNewBlockFilter;
                                case 'eth_newFilter':
                                    return _this._ethNewFilter;
                                case 'eth_newPendingTransactionFilter':
                                    return _this._ethNewPendingTransactionFilter;
                                case 'eth_sendTransaction':
                                    return _this._ethSendTransaction;
                                case 'eth_subscribe':
                                    return _this._ethSubscribe;
                                case 'eth_uninstallFilter':
                                    return _this._ethUninstallFilter;
                                case 'eth_unsubscribe':
                                    return _this._ethUnsubscribe;
                                case 'net_version':
                                    return _this._netVersion;
                                default:
                                    throw Error("Method \"" + payload.method + "\" not supported on this provider");
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        f = functionToExecute(payload.method).bind(this);
                        console.log("LP: " + payload.method);
                        return [4 /*yield*/, f(payload)];
                    case 2:
                        result = _a.sent();
                        callback(null, this._okResponse(payload.id, result, isArray));
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        error(err_1);
                        callback(err_1, null);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // PRIVATE FUNCTIONS EVM CALLS
    LoomProvider.prototype._ethAccounts = function () {
        if (this.accountsAddrList.length === 0) {
            throw Error('No account available');
        }
        return this.accountsAddrList;
    };
    LoomProvider.prototype._ethBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blockNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.getBlockHeightAsync()];
                    case 1:
                        blockNumber = _a.sent();
                        return [2 /*return*/, crypto_utils_1.numberToHex(blockNumber)];
                }
            });
        });
    };
    LoomProvider.prototype._ethCall = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._callStaticAsync(payload.params[0])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result ? crypto_utils_1.bytesToHexAddrLC(result) : '0x0'];
                }
            });
        });
    };
    LoomProvider.prototype._ethEstimateGas = function () {
        // Loom DAppChain doesn't estimate gas, because gas isn't necessary
        return null; // Returns null to afford with Web3 calls
    };
    LoomProvider.prototype._ethGasPrice = function () {
        // Loom DAppChain doesn't use gas price, because gas isn't necessary
        return null; // Returns null to afford with Web3 calls
    };
    LoomProvider.prototype._ethGetBlockByHash = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var blockHash, isFull, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockHash = payload.params[0];
                        isFull = payload.params[1] || true;
                        return [4 /*yield*/, this._client.getEvmBlockByHashAsync(blockHash, isFull)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this._createBlockInfo(result, isFull)];
                }
            });
        });
    };
    LoomProvider.prototype._ethGetBlockByNumber = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var blockNumberToSearch, isFull, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockNumberToSearch = payload.params[0];
                        isFull = payload.params[1] || true;
                        return [4 /*yield*/, this._client.getEvmBlockByNumberAsync(blockNumberToSearch, isFull)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this._createBlockInfo(result, isFull)];
                }
            });
        });
    };
    LoomProvider.prototype._ethGetCode = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var address, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = new address_1.Address(this._client.chainId, address_1.LocalAddress.fromHexString(payload.params[0]));
                        return [4 /*yield*/, this._client.getEvmCodeAsync(address)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error('No code returned on eth_getCode');
                        }
                        return [2 /*return*/, crypto_utils_1.bytesToHexAddrLC(result)];
                }
            });
        });
    };
    LoomProvider.prototype._ethGetFilterChanges = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.getEvmFilterChangesAsync(payload.params[0])];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, []];
                        }
                        if (result instanceof evm_pb_1.EthBlockHashList) {
                            return [2 /*return*/, result
                                    .getEthBlockHashList_asU8()
                                    .map(function (hash) { return crypto_utils_1.bytesToHexAddrLC(hash); })];
                        }
                        else if (result instanceof evm_pb_1.EthTxHashList) {
                            return [2 /*return*/, result
                                    .getEthTxHashList_asU8()
                                    .map(function (hash) { return crypto_utils_1.bytesToHexAddrLC(hash); })];
                        }
                        else if (result instanceof evm_pb_1.EthFilterLogList) {
                            return [2 /*return*/, result
                                    .getEthBlockLogsList()
                                    .map(function (log) { return _this._createLogResult(log); })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LoomProvider.prototype._ethGetLogs = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._getLogs(payload.params[0])];
            });
        });
    };
    LoomProvider.prototype._ethGetTransactionByHash = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._getTransaction(payload.params[0])];
            });
        });
    };
    LoomProvider.prototype._ethGetTransactionReceipt = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._getReceipt(payload.params[0])];
            });
        });
    };
    LoomProvider.prototype._ethNewBlockFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.newBlockEvmFilterAsync()];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error('New block filter unexpected result');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    LoomProvider.prototype._ethNewFilter = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.newEvmFilterAsync(payload.params[0])];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error('Cannot create new filter on eth_newFilter');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    LoomProvider.prototype._ethNewPendingTransactionFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.newPendingTransactionEvmFilterAsync()];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error('New pending transaction filter unexpected result');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    LoomProvider.prototype._ethSendTransaction = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!payload.params[0].to) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._callAsync(payload.params[0])];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._deployAsync(payload.params[0])];
                    case 3:
                        result = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, crypto_utils_1.bytesToHexAddrLC(result)];
                }
            });
        });
    };
    LoomProvider.prototype._ethSubscribe = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var method, filterObject, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = payload.params[0];
                        filterObject = payload.params[1] || {};
                        return [4 /*yield*/, this._client.evmSubscribeAsync(method, filterObject)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error('Subscribe filter failed');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    LoomProvider.prototype._ethUninstallFilter = function (payload) {
        return this._client.uninstallEvmFilterAsync(payload.params[0]);
    };
    LoomProvider.prototype._ethUnsubscribe = function (payload) {
        return this._client.evmUnsubscribeAsync(payload.params[0]);
    };
    LoomProvider.prototype._netVersion = function () {
        // Fixed network version 474747
        return '474747';
    };
    // PRIVATE FUNCTIONS IMPLEMENTATIONS
    LoomProvider.prototype._deployAsync = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var caller, address, hasHexPrefix, data, deployTx, msgTx, tx, ret, response, responseData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        caller = new address_1.Address(this._client.chainId, address_1.LocalAddress.fromHexString(payload.from));
                        address = new address_1.Address(this._client.chainId, address_1.LocalAddress.fromHexString('0x0000000000000000000000000000000000000000'));
                        hasHexPrefix = payload.data.substring(0, 2) === '0x';
                        data = Buffer.from(payload.data.slice(hasHexPrefix ? 2 : 0), 'hex');
                        deployTx = new loom_pb_1.DeployTx();
                        deployTx.setVmType(loom_pb_1.VMType.EVM);
                        deployTx.setCode(crypto_utils_1.bufferToProtobufBytes(data));
                        msgTx = new loom_pb_1.MessageTx();
                        msgTx.setFrom(caller.MarshalPB());
                        msgTx.setTo(address.MarshalPB());
                        msgTx.setData(deployTx.serializeBinary());
                        tx = new loom_pb_1.Transaction();
                        tx.setId(1);
                        tx.setData(msgTx.serializeBinary());
                        return [4 /*yield*/, this._commitTransaction(payload.from, tx)];
                    case 1:
                        ret = _a.sent();
                        response = loom_pb_1.DeployResponse.deserializeBinary(crypto_utils_1.bufferToProtobufBytes(ret));
                        responseData = loom_pb_1.DeployResponseData.deserializeBinary(crypto_utils_1.bufferToProtobufBytes(response.getOutput_asU8()));
                        return [2 /*return*/, responseData.getTxHash_asU8()];
                }
            });
        });
    };
    LoomProvider.prototype._callAsync = function (payload) {
        var caller = new address_1.Address(this._client.chainId, address_1.LocalAddress.fromHexString(payload.from));
        var address = new address_1.Address(this._client.chainId, address_1.LocalAddress.fromHexString(payload.to));
        var data = Buffer.from(payload.data.substring(2), 'hex');
        //console.log(`LP CALL: caller:${caller} address:${address} data:${data}`)
        var callTx = new loom_pb_1.CallTx();
        callTx.setVmType(loom_pb_1.VMType.EVM);
        callTx.setInput(crypto_utils_1.bufferToProtobufBytes(data));
        var msgTx = new loom_pb_1.MessageTx();
        msgTx.setFrom(caller.MarshalPB());
        msgTx.setTo(address.MarshalPB());
        msgTx.setData(callTx.serializeBinary());
        var tx = new loom_pb_1.Transaction();
        tx.setId(2);
        tx.setData(msgTx.serializeBinary());
        return this._commitTransaction(payload.from, tx);
    };
    LoomProvider.prototype._callStaticAsync = function (payload) {
        var caller = new address_1.Address(this._client.chainId, address_1.LocalAddress.fromHexString(payload.from));
        var address = new address_1.Address(this._client.chainId, address_1.LocalAddress.fromHexString(payload.to));
        var data = Buffer.from(payload.data.substring(2), 'hex');
        //console.log(`LP static call: caller:${caller} address:${address} data:${payload.data}`)
        return this._client.queryAsync(address, data, loom_pb_1.VMType.EVM, caller);
    };
    LoomProvider.prototype._createBlockInfo = function (blockInfo, isFull) {
        var _this = this;
        var blockNumber = numberToHexLC(blockInfo.getNumber());
        var transactionHash = crypto_utils_1.bytesToHexAddrLC(blockInfo.getHash_asU8());
        var parentHash = crypto_utils_1.bytesToHexAddrLC(blockInfo.getParentHash_asU8());
        var logsBloom = crypto_utils_1.bytesToHexAddrLC(blockInfo.getLogsBloom_asU8());
        var timestamp = blockInfo.getTimestamp();
        var transactions = blockInfo.getTransactionsList_asU8().map(function (transaction) {
            if (isFull) {
                return _this._createReceiptResult(evm_pb_1.EvmTxReceipt.deserializeBinary(crypto_utils_1.bufferToProtobufBytes(transaction)));
            }
            else {
                return crypto_utils_1.bytesToHexAddrLC(transaction);
            }
        });
        return {
            blockNumber: blockNumber,
            transactionHash: transactionHash,
            parentHash: parentHash,
            logsBloom: logsBloom,
            timestamp: timestamp,
            transactions: transactions
        };
    };
    LoomProvider.prototype._createReceiptResult = function (receipt) {
        var transactionHash = crypto_utils_1.bytesToHexAddrLC(receipt.getTxHash_asU8());
        var transactionIndex = numberToHexLC(receipt.getTransactionIndex());
        var blockHash = crypto_utils_1.bytesToHexAddrLC(receipt.getBlockHash_asU8());
        var blockNumber = numberToHexLC(receipt.getBlockNumber());
        var contractAddress = crypto_utils_1.bytesToHexAddrLC(receipt.getContractAddress_asU8());
        var logs = receipt.getLogsList().map(function (logEvent, index) {
            var logIndex = numberToHexLC(index);
            return {
                logIndex: logIndex,
                address: contractAddress,
                blockHash: blockHash,
                blockNumber: blockNumber,
                transactionHash: crypto_utils_1.bytesToHexAddrLC(logEvent.getTxHash_asU8()),
                transactionIndex: transactionIndex,
                type: 'mined',
                data: crypto_utils_1.bytesToHexAddrLC(logEvent.getEncodedBody_asU8()),
                topics: logEvent.getTopicsList().map(function (topic) { return topic.toLowerCase(); })
            };
        });
        return {
            transactionHash: transactionHash,
            transactionIndex: transactionIndex,
            blockHash: blockHash,
            blockNumber: blockNumber,
            contractAddress: contractAddress,
            gasUsed: numberToHexLC(receipt.getGasUsed()),
            cumulativeGasUsed: numberToHexLC(receipt.getCumulativeGasUsed()),
            logs: logs,
            status: numberToHexLC(receipt.getStatus())
        };
    };
    LoomProvider.prototype._getTransaction = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var data, transaction, hash, nonce, transactionIndex, blockHash, blockNumber, from, to, value, gasPrice, gas, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = Buffer.from(txHash.substring(2), 'hex');
                        return [4 /*yield*/, this._client.getEvmTxByHashAsync(crypto_utils_1.bufferToProtobufBytes(data))];
                    case 1:
                        transaction = _a.sent();
                        if (!transaction) {
                            throw Error('Transaction cannot be empty');
                        }
                        hash = crypto_utils_1.bytesToHexAddrLC(transaction.getHash_asU8());
                        nonce = numberToHexLC(transaction.getNonce());
                        transactionIndex = numberToHexLC(transaction.getTransactionIndex());
                        blockHash = crypto_utils_1.bytesToHexAddrLC(transaction.getBlockHash_asU8());
                        blockNumber = numberToHexLC(transaction.getBlockNumber());
                        from = crypto_utils_1.bytesToHexAddrLC(transaction.getFrom_asU8());
                        to = crypto_utils_1.bytesToHexAddrLC(transaction.getTo_asU8());
                        value = numberToHexLC(transaction.getValue());
                        gasPrice = numberToHexLC(transaction.getGasPrice());
                        gas = numberToHexLC(transaction.getGas());
                        input = '0x0';
                        return [2 /*return*/, {
                                hash: hash,
                                nonce: nonce,
                                blockHash: blockHash,
                                blockNumber: blockNumber,
                                transactionIndex: transactionIndex,
                                from: from,
                                to: to,
                                value: value,
                                gasPrice: gasPrice,
                                gas: gas,
                                input: input
                            }];
                }
            });
        });
    };
    LoomProvider.prototype._getReceipt = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var data, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = Buffer.from(txHash.substring(2), 'hex');
                        return [4 /*yield*/, this._client.getEvmTxReceiptAsync(crypto_utils_1.bufferToProtobufBytes(data))];
                    case 1:
                        receipt = _a.sent();
                        if (!receipt) {
                            throw Error('Receipt cannot be empty');
                        }
                        return [2 /*return*/, this._createReceiptResult(receipt)];
                }
            });
        });
    };
    LoomProvider.prototype._createLogResult = function (log) {
        return {
            removed: log.getRemoved(),
            logIndex: numberToHexLC(log.getLogIndex()),
            transactionIndex: crypto_utils_1.numberToHex(log.getTransactionIndex()),
            transactionHash: crypto_utils_1.bytesToHexAddrLC(log.getTransactionHash_asU8()),
            blockHash: crypto_utils_1.bytesToHexAddrLC(log.getBlockHash_asU8()),
            blockNumber: crypto_utils_1.numberToHex(log.getBlockNumber()),
            address: crypto_utils_1.bytesToHexAddrLC(log.getAddress_asU8()),
            data: crypto_utils_1.bytesToHexAddrLC(log.getData_asU8()),
            topics: log.getTopicsList().map(function (topic) { return String.fromCharCode.apply(null, topic); })
        };
    };
    LoomProvider.prototype._getLogs = function (filterObject) {
        return __awaiter(this, void 0, void 0, function () {
            var logsListAsyncResult, logList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.getEvmLogsAsync(filterObject)];
                    case 1:
                        logsListAsyncResult = _a.sent();
                        if (!logsListAsyncResult) {
                            return [2 /*return*/, []];
                        }
                        logList = evm_pb_1.EthFilterLogList.deserializeBinary(crypto_utils_1.bufferToProtobufBytes(logsListAsyncResult));
                        return [2 /*return*/, logList.getEthBlockLogsList().map(function (log) {
                                return _this._createLogResult(log);
                            })];
                }
            });
        });
    };
    LoomProvider.prototype._onWebSocketMessage = function (msgEvent) {
        if (msgEvent.data && msgEvent.id !== '0') {
            log("Socket message arrived " + JSON.stringify(msgEvent));
            this.notificationCallbacks.forEach(function (callback) {
                var JSONRPCResult = {
                    jsonrpc: '2.0',
                    method: 'eth_subscription',
                    params: {
                        subscription: msgEvent.id,
                        result: {
                            transactionHash: crypto_utils_1.bytesToHexAddrLC(msgEvent.transactionHashBytes),
                            logIndex: '0x0',
                            transactionIndex: '0x0',
                            blockHash: '0x0',
                            blockNumber: '0x0',
                            address: msgEvent.contractAddress.local.toString(),
                            type: 'mined',
                            data: crypto_utils_1.bytesToHexAddrLC(msgEvent.data),
                            topics: msgEvent.topics
                        }
                    }
                };
                callback(JSONRPCResult);
            });
        }
    };
    LoomProvider.prototype._commitTransaction = function (fromPublicAddr, txTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKey, publicKey, middleware, caller;
            return __generator(this, function (_a) {
                privateKey = this.accounts.get(fromPublicAddr);
                if (!privateKey) {
                    throw Error("Account not found for address " + fromPublicAddr);
                }
                publicKey = _1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                middleware = helpers_1.createDefaultTxMiddleware(this._client, privateKey);
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                return [2 /*return*/, this._client.commitTxAsync(caller.local.toString(), txTransaction, { middleware: middleware })];
            });
        });
    };
    // Basic response to web3js
    LoomProvider.prototype._okResponse = function (id, result, isArray) {
        if (result === void 0) { result = 0; }
        if (isArray === void 0) { isArray = false; }
        var response = { id: id, jsonrpc: '2.0', result: result };
        var ret = isArray ? [response] : response;
        log('Response payload', JSON.stringify(ret, null, 2));
        return ret;
    };
    return LoomProvider;
}());
exports.LoomProvider = LoomProvider;
//# sourceMappingURL=loom-provider.js.map