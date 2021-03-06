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
var bn_js_1 = __importDefault(require("bn.js"));
var plasma_cash_tx_1 = require("./plasma-cash-tx");
var solidity_helpers_1 = require("./solidity-helpers");
// TODO: Maybe come up with a better name?
/**
 * Manages Plasma Cash related interactions between an Ethereum network (Ganache, Mainnet, etc.)
 * and a Loom DAppChain from the point of view of a single entity. An entity has two identities, one
 * on Ethereum, and one on the DAppChain, each identity has its own private/public key pair.
 */
var Entity = /** @class */ (function () {
    function Entity(web3, params) {
        this._web3 = web3;
        this._ethAccount = params.ethAccount;
        this._ethPlasmaClient = params.ethPlasmaClient;
        this._dAppPlasmaClient = params.dAppPlasmaClient;
        this._defaultGas = params.defaultGas;
        this._childBlockInterval = params.childBlockInterval;
    }
    Object.defineProperty(Entity.prototype, "ethAddress", {
        get: function () {
            return this._ethAccount.address;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "plasmaCashContract", {
        get: function () {
            return this._ethPlasmaClient.plasmaCashContract;
        },
        enumerable: true,
        configurable: true
    });
    Entity.prototype.transferTokenAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var slot, prevBlockNum, denomination, newOwner, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, prevBlockNum = params.prevBlockNum, denomination = params.denomination, newOwner = params.newOwner;
                        tx = new plasma_cash_tx_1.PlasmaCashTx({
                            slot: slot,
                            prevBlockNum: prevBlockNum,
                            denomination: denomination,
                            newOwner: newOwner.ethAddress,
                            prevOwner: this.ethAddress
                        });
                        return [4 /*yield*/, tx.signAsync(new solidity_helpers_1.Web3Signer(this._web3, this.ethAddress))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._dAppPlasmaClient.sendTxAsync(tx)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Entity.prototype.getPlasmaCoinAsync = function (slot) {
        return this._ethPlasmaClient.getPlasmaCoinAsync({ slot: slot, from: this.ethAddress });
    };
    Entity.prototype.submitPlasmaBlockAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blockNum, block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._dAppPlasmaClient.debugFinalizeBlockAsync()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._dAppPlasmaClient.getCurrentPlasmaBlockNumAsync()];
                    case 2:
                        blockNum = _a.sent();
                        return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaBlockAtAsync(blockNum)];
                    case 3:
                        block = _a.sent();
                        return [4 /*yield*/, this._ethPlasmaClient.debugSubmitBlockAsync({ block: block, from: this.ethAddress })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, blockNum];
                }
            });
        });
    };
    Entity.prototype.submitPlasmaDepositAsync = function (deposit) {
        return this._dAppPlasmaClient.debugSubmitDepositAsync(deposit);
    };
    Entity.prototype.startExitAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var slot, prevBlockNum, exitBlockNum, exitTx_1, exitBlock, exitTx, prevBlock, prevTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, prevBlockNum = params.prevBlockNum, exitBlockNum = params.exitBlockNum;
                        if (!(exitBlockNum.modn(this._childBlockInterval) !== 0)) return [3 /*break*/, 2];
                        exitTx_1 = new plasma_cash_tx_1.PlasmaCashTx({
                            slot: slot,
                            prevBlockNum: new bn_js_1.default(0),
                            denomination: 1,
                            newOwner: this.ethAddress
                        });
                        return [4 /*yield*/, exitTx_1.signAsync(new solidity_helpers_1.Web3Signer(this._web3, this.ethAddress))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._ethPlasmaClient.startExitAsync({
                                slot: slot,
                                exitTx: exitTx_1,
                                exitBlockNum: exitBlockNum,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                    case 2: return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaBlockAtAsync(exitBlockNum)];
                    case 3:
                        exitBlock = _a.sent();
                        exitTx = exitBlock.findTxWithSlot(slot);
                        if (!exitTx) {
                            throw new Error("Invalid exit block: missing tx for slot " + slot.toString(10) + ".");
                        }
                        return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaBlockAtAsync(prevBlockNum)];
                    case 4:
                        prevBlock = _a.sent();
                        prevTx = prevBlock.findTxWithSlot(slot);
                        if (!prevTx) {
                            throw new Error("Invalid prev block: missing tx for slot " + slot.toString(10) + ".");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.startExitAsync({
                                slot: slot,
                                prevTx: prevTx,
                                exitTx: exitTx,
                                prevBlockNum: prevBlockNum,
                                exitBlockNum: exitBlockNum,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    Entity.prototype.finalizeExitsAsync = function () {
        return this._ethPlasmaClient.finalizeExitsAsync({
            from: this.ethAddress,
            gas: this._defaultGas
        });
    };
    Entity.prototype.withdrawAsync = function (slot) {
        return this._ethPlasmaClient.withdrawAsync({
            slot: slot,
            from: this.ethAddress,
            gas: this._defaultGas
        });
    };
    Entity.prototype.withdrawBondsAsync = function () {
        return this._ethPlasmaClient.withdrawBondsAsync({
            from: this.ethAddress,
            gas: this._defaultGas
        });
    };
    Entity.prototype.challengeAfterAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var slot, challengingBlockNum, challengingBlock, challengingTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, challengingBlockNum = params.challengingBlockNum;
                        return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaBlockAtAsync(challengingBlockNum)];
                    case 1:
                        challengingBlock = _a.sent();
                        challengingTx = challengingBlock.findTxWithSlot(slot);
                        if (!challengingTx) {
                            throw new Error("Invalid challenging block: missing tx for slot " + slot.toString(10) + ".");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.challengeAfterAsync({
                                slot: slot,
                                challengingBlockNum: challengingBlockNum,
                                challengingTx: challengingTx,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    Entity.prototype.challengeBetweenAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var slot, challengingBlockNum, challengingBlock, challengingTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, challengingBlockNum = params.challengingBlockNum;
                        return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaBlockAtAsync(challengingBlockNum)];
                    case 1:
                        challengingBlock = _a.sent();
                        challengingTx = challengingBlock.findTxWithSlot(slot);
                        if (!challengingTx) {
                            throw new Error("Invalid challenging block: missing tx for slot " + slot.toString(10) + ".");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.challengeBetweenAsync({
                                slot: slot,
                                challengingBlockNum: challengingBlockNum,
                                challengingTx: challengingTx,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    Entity.prototype.challengeBeforeAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var slot, prevBlockNum, challengingBlockNum, challengingTx_1, exitBlock, challengingTx, prevBlock, prevTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, prevBlockNum = params.prevBlockNum, challengingBlockNum = params.challengingBlockNum;
                        if (!(challengingBlockNum.modn(this._childBlockInterval) !== 0)) return [3 /*break*/, 2];
                        challengingTx_1 = new plasma_cash_tx_1.PlasmaCashTx({
                            slot: slot,
                            prevBlockNum: new bn_js_1.default(0),
                            denomination: 1,
                            newOwner: this.ethAddress
                        });
                        return [4 /*yield*/, challengingTx_1.signAsync(new solidity_helpers_1.Web3Signer(this._web3, this.ethAddress))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._ethPlasmaClient.challengeBeforeAsync({
                                slot: slot,
                                challengingTx: challengingTx_1,
                                challengingBlockNum: challengingBlockNum,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                    case 2: return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaBlockAtAsync(challengingBlockNum)];
                    case 3:
                        exitBlock = _a.sent();
                        challengingTx = exitBlock.findTxWithSlot(slot);
                        if (!challengingTx) {
                            throw new Error("Invalid exit block: missing tx for slot " + slot.toString(10) + ".");
                        }
                        return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaBlockAtAsync(prevBlockNum)];
                    case 4:
                        prevBlock = _a.sent();
                        prevTx = prevBlock.findTxWithSlot(slot);
                        if (!prevTx) {
                            throw new Error("Invalid prev block: missing tx for slot " + slot.toString(10) + ".");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.challengeBeforeAsync({
                                slot: slot,
                                prevTx: prevTx,
                                challengingTx: challengingTx,
                                prevBlockNum: prevBlockNum,
                                challengingBlockNum: challengingBlockNum,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    Entity.prototype.respondChallengeBeforeAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var slot, challengingTxHash, respondingBlockNum, respondingBlock, respondingTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, challengingTxHash = params.challengingTxHash, respondingBlockNum = params.respondingBlockNum;
                        return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaBlockAtAsync(respondingBlockNum)];
                    case 1:
                        respondingBlock = _a.sent();
                        respondingTx = respondingBlock.findTxWithSlot(slot);
                        if (!respondingTx) {
                            throw new Error("Invalid responding block: missing tx for slot " + slot.toString(10) + ".");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.respondChallengeBeforeAsync({
                                slot: slot,
                                challengingTxHash: challengingTxHash,
                                respondingBlockNum: respondingBlockNum,
                                respondingTx: respondingTx,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map