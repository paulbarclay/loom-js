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
Object.defineProperty(exports, "__esModule", { value: true });
var contract_1 = require("../contract");
var address_1 = require("../address");
var plasma_cash_tx_1 = require("./plasma-cash-tx");
var plasma_cash_block_1 = require("./plasma-cash-block");
var big_uint_1 = require("../big-uint");
var plasma_cash_pb_1 = require("../proto/plasma_cash_pb");
var DAppChainPlasmaClient = /** @class */ (function () {
    function DAppChainPlasmaClient(params) {
        var dAppClient = params.dAppClient, callerAddress = params.callerAddress, _a = params.contractName, contractName = _a === void 0 ? 'plasmacash' : _a;
        this._dAppClient = dAppClient;
        this._callerAddress = callerAddress;
        this._plasmaContractName = contractName;
    }
    DAppChainPlasmaClient.prototype._resolvePlasmaContractAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._plasmaContract) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dAppClient.getContractAddressAsync(this._plasmaContractName)];
                    case 1:
                        addr = _a.sent();
                        if (!addr) {
                            throw new Error('Failed to resolve Plasma Cash contract address.');
                        }
                        this._plasmaContract = new contract_1.Contract({
                            contractAddr: addr,
                            contractName: this._plasmaContractName,
                            client: this._dAppClient
                        });
                        _a.label = 2;
                    case 2: return [2 /*return*/, this._plasmaContract];
                }
            });
        });
    };
    /**
     * Retrieves the latest finalized Plasma block number from the DAppChain.
     */
    DAppChainPlasmaClient.prototype.getCurrentPlasmaBlockNumAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, req, resp, blockHeight;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.GetCurrentBlockRequest();
                        return [4 /*yield*/, contract.staticCallAsync(this._callerAddress, 'GetCurrentBlockRequest', req, new plasma_cash_pb_1.GetCurrentBlockResponse())];
                    case 2:
                        resp = _a.sent();
                        blockHeight = resp.getBlockHeight();
                        if (!blockHeight) {
                            throw new Error('Invalid response: missing block height.');
                        }
                        return [2 /*return*/, big_uint_1.unmarshalBigUIntPB(blockHeight)];
                }
            });
        });
    };
    /**
     * Retrieves a Plasma block from the DAppChain.
     *
     * @param blockNum Height of the block to be retrieved.
     */
    DAppChainPlasmaClient.prototype.getPlasmaBlockAtAsync = function (blockNum) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, req, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.GetBlockRequest();
                        req.setBlockHeight(big_uint_1.marshalBigUIntPB(blockNum));
                        return [4 /*yield*/, contract.staticCallAsync(this._callerAddress, 'GetBlockRequest', req, new plasma_cash_pb_1.GetBlockResponse())];
                    case 2:
                        resp = _a.sent();
                        return [2 /*return*/, plasma_cash_block_1.unmarshalPlasmaBlockPB(resp.getBlock())];
                }
            });
        });
    };
    /**
     * Transfers a Plasma token from one entity to another.
     */
    DAppChainPlasmaClient.prototype.sendTxAsync = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tx.sig) {
                            throw new Error('PlasmaCashTx must be signed before being sent to DAppChain');
                        }
                        return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.PlasmaTxRequest();
                        req.setPlasmatx(plasma_cash_tx_1.marshalPlasmaTxPB(tx));
                        return [4 /*yield*/, contract.callAsync(this._callerAddress, 'PlasmaTxRequest', req)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Requests that the DAppChain prepares a Plasma block for submission to Ethereum.
     *
     * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
     * will be permitted to make this request.
     */
    DAppChainPlasmaClient.prototype.debugFinalizeBlockAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.SubmitBlockToMainnetRequest();
                        return [4 /*yield*/, contract.callAsync(this._callerAddress, 'SubmitBlockToMainnet', req)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Submits a Plasma deposit from Ethereum to the DAppChain.
     *
     * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
     * will be permitted to make this request.
     */
    DAppChainPlasmaClient.prototype.debugSubmitDepositAsync = function (deposit) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, ownerAddr, tokenAddr, req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        ownerAddr = new address_1.Address('eth', address_1.LocalAddress.fromHexString(deposit.from));
                        tokenAddr = new address_1.Address('eth', address_1.LocalAddress.fromHexString(deposit.contractAddress));
                        req = new plasma_cash_pb_1.DepositRequest();
                        req.setSlot(deposit.slot.toString(10));
                        req.setDepositBlock(big_uint_1.marshalBigUIntPB(deposit.blockNumber));
                        req.setDenomination(big_uint_1.marshalBigUIntPB(deposit.denomination));
                        req.setFrom(ownerAddr.MarshalPB());
                        req.setContract(tokenAddr.MarshalPB());
                        return [4 /*yield*/, contract.callAsync(this._callerAddress, 'DepositRequest', req)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DAppChainPlasmaClient;
}());
exports.DAppChainPlasmaClient = DAppChainPlasmaClient;
//# sourceMappingURL=dappchain-client.js.map