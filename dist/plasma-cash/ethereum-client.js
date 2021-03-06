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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bn_js_1 = __importDefault(require("bn.js"));
var crypto_utils_1 = require("../crypto-utils");
var PlasmaCoinState;
(function (PlasmaCoinState) {
    PlasmaCoinState[PlasmaCoinState["Deposited"] = 0] = "Deposited";
    PlasmaCoinState[PlasmaCoinState["Exiting"] = 1] = "Exiting";
    PlasmaCoinState[PlasmaCoinState["Challenged"] = 2] = "Challenged";
    PlasmaCoinState[PlasmaCoinState["Exited"] = 3] = "Exited";
})(PlasmaCoinState = exports.PlasmaCoinState || (exports.PlasmaCoinState = {}));
function marshalChallengeEvent(data) {
    var slot = data.slot, txHash = data.txHash;
    return {
        slot: new bn_js_1.default(slot),
        txHash: txHash
    };
}
exports.marshalChallengeEvent = marshalChallengeEvent;
// TODO: This probably shouldn't be exposed, instead add API to EthereumPlasmaClient to retrieve
// already marshalled event data
function marshalDepositEvent(data) {
    var slot = data.slot, blockNumber = data.blockNumber, denomination = data.denomination, from = data.from, contractAddress = data.contractAddress;
    return {
        slot: new bn_js_1.default(slot),
        blockNumber: new bn_js_1.default(blockNumber),
        denomination: new bn_js_1.default(denomination),
        from: from,
        contractAddress: contractAddress
    };
}
exports.marshalDepositEvent = marshalDepositEvent;
var EthereumPlasmaClient = /** @class */ (function () {
    function EthereumPlasmaClient(web3, plasmaContractAddr) {
        this._web3 = web3;
        var plasmaABI = require("./contracts/plasma-cash-abi.json");
        this._plasmaContract = new this._web3.eth.Contract(plasmaABI, plasmaContractAddr);
    }
    Object.defineProperty(EthereumPlasmaClient.prototype, "plasmaCashContract", {
        /**
         * Web3 contract instance of the Plasma Cash contract on Ethereum.
         */
        get: function () {
            return this._plasmaContract;
        },
        enumerable: true,
        configurable: true
    });
    EthereumPlasmaClient.prototype.getPlasmaCoinAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var slot, from, coin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, from = params.from;
                        return [4 /*yield*/, this._plasmaContract.methods.getPlasmaCoin(slot).call({ from: from })];
                    case 1:
                        coin = _a.sent();
                        return [2 /*return*/, {
                                uid: new bn_js_1.default(coin[0]),
                                depositBlockNum: new bn_js_1.default(coin[1]),
                                denomination: new bn_js_1.default(coin[2]),
                                owner: coin[3],
                                contractAddress: coin[4],
                                state: parseInt(coin[5], 10)
                            }];
                }
            });
        });
    };
    /**
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.startExitAsync = function (params) {
        var slot = params.slot, exitTx = params.exitTx, exitBlockNum = params.exitBlockNum, prevTx = params.prevTx, prevBlockNum = params.prevBlockNum, from = params.from, gas = params.gas, gasPrice = params.gasPrice;
        var prevTxBytes = prevTx ? prevTx.rlpEncode() : '0x';
        var exitTxBytes = exitTx.rlpEncode();
        var bond = this._web3.utils.toWei('0.1', 'ether');
        return this._plasmaContract.methods
            .startExit(slot, prevTxBytes, exitTxBytes, prevTx ? prevTx.proof : '0x', exitTx.proof, exitTx.sig, [prevBlockNum || 0, exitBlockNum])
            .send({ from: from, value: bond, gas: gas, gasPrice: gasPrice });
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.finalizeExitsAsync = function (params) {
        return this._plasmaContract.methods.finalizeExits().send(params);
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.withdrawAsync = function (params) {
        var slot = params.slot, rest = __rest(params, ["slot"]);
        return this._plasmaContract.methods.withdraw(slot).send(rest);
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.withdrawBondsAsync = function (params) {
        return this._plasmaContract.methods.withdrawBonds().send(params);
    };
    /**
     * `Exit Spent Coin Challenge`: Challenge an exit with a spend after the exit's blocks.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeAfterAsync = function (params) {
        var slot = params.slot, challengingBlockNum = params.challengingBlockNum, challengingTx = params.challengingTx, rest = __rest(params, ["slot", "challengingBlockNum", "challengingTx"]);
        var txBytes = challengingTx.rlpEncode();
        return this._plasmaContract.methods
            .challengeAfter(slot, challengingBlockNum, txBytes, challengingTx.proof, challengingTx.sig)
            .send(rest);
    };
    /**
     * `Double Spend Challenge`: Challenge a double spend of a coin with a spend between the exit's blocks.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeBetweenAsync = function (params) {
        var slot = params.slot, challengingBlockNum = params.challengingBlockNum, challengingTx = params.challengingTx, rest = __rest(params, ["slot", "challengingBlockNum", "challengingTx"]);
        var txBytes = challengingTx.rlpEncode();
        return this._plasmaContract.methods
            .challengeBetween(slot, challengingBlockNum, txBytes, challengingTx.proof, challengingTx.sig)
            .send(rest);
    };
    /**
     * `Invalid History Challenge`: Challenge a coin with invalid history.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeBeforeAsync = function (params) {
        var slot = params.slot, challengingTx = params.challengingTx, challengingBlockNum = params.challengingBlockNum, prevTx = params.prevTx, prevBlockNum = params.prevBlockNum, from = params.from, gas = params.gas, gasPrice = params.gasPrice;
        var prevTxBytes = prevTx ? prevTx.rlpEncode() : '0x';
        var challengingTxBytes = challengingTx.rlpEncode();
        var bond = this._web3.utils.toWei('0.1', 'ether');
        return this._plasmaContract.methods
            .challengeBefore(slot, prevTxBytes, challengingTxBytes, prevTx ? prevTx.proof : '0x', challengingTx.proof, challengingTx.sig, [prevBlockNum || 0, challengingBlockNum])
            .send({ from: from, value: bond, gas: gas, gasPrice: gasPrice });
    };
    /**
     * `Response to invalid history challenge`: Respond to an invalid challenge with a later tx
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.respondChallengeBeforeAsync = function (params) {
        var slot = params.slot, challengingTxHash = params.challengingTxHash, respondingBlockNum = params.respondingBlockNum, respondingTx = params.respondingTx, rest = __rest(params, ["slot", "challengingTxHash", "respondingBlockNum", "respondingTx"]);
        var respondingTxBytes = respondingTx.rlpEncode();
        return this._plasmaContract.methods
            .respondChallengeBefore(slot, challengingTxHash, respondingBlockNum, respondingTxBytes, respondingTx.proof, respondingTx.sig)
            .send(rest);
    };
    /**
     * Submits a Plasma block to the Plasma Cash Solidity contract on Ethereum.
     *
     * @returns Web3 tx receipt object.
     *
     * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
     * will be permitted to make this request.
     */
    EthereumPlasmaClient.prototype.debugSubmitBlockAsync = function (params) {
        var block = params.block, from = params.from;
        return this._plasmaContract.methods
            .submitBlock(crypto_utils_1.bytesToHexAddr(block.merkleHash))
            .send({ from: from });
    };
    return EthereumPlasmaClient;
}());
exports.EthereumPlasmaClient = EthereumPlasmaClient;
//# sourceMappingURL=ethereum-client.js.map