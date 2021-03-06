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
var events_1 = __importDefault(require("events"));
var client_1 = require("./client");
var loom_pb_1 = require("./proto/loom_pb");
/**
 * The EvmContract class streamlines interaction with a contract that was
 * deployed on a Loom DAppChain EVM.
 * Each instance of this class is bound to a specific contract, and provides a simple way of calling
 * into and querying that contract.
 *
 * A contract instance can be used to listen to events emitted by the corresponding smart contract,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API.
 */
var EvmContract = /** @class */ (function (_super) {
    __extends(EvmContract, _super);
    /**
     * @param params Parameters.
     * @param params.contractAddr Address of a contract on the Loom DAppChain EVM.
     * @param params.callerAddr: Address of the caller, generated from the public key of the tx signer,
     *                           e.g. `new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))`
     * @param params.client: Client to use to communicate with the contract.
     */
    function EvmContract(params) {
        var _this = _super.call(this) || this;
        _this._client = params.client;
        _this.address = params.contractAddr;
        var emitContractEvent = _this._emitContractEvent.bind(_this);
        _this.on('newListener', function (event) {
            if (event === EvmContract.EVENT && _this.listenerCount(event) === 0) {
                _this._client.on(client_1.ClientEvent.Contract, emitContractEvent);
            }
        });
        _this.on('removeListener', function (event) {
            if (event === EvmContract.EVENT && _this.listenerCount(event) === 0) {
                _this._client.removeListener(client_1.ClientEvent.Contract, emitContractEvent);
            }
        });
        return _this;
    }
    /**
     * Calls a contract method that mutates state.
     * The call into the contract is accomplished by committing a tx to the DAppChain.
     * @param args ABI encoded function signature and input paramters.
     * @returns A promise that will be resolved with return value (if any) of the contract method.
     */
    EvmContract.prototype.callAsync = function (caller, args, output) {
        return __awaiter(this, void 0, void 0, function () {
            var ui8InData, callTx, msgTx, tx;
            return __generator(this, function (_a) {
                ui8InData = Uint8Array.from(args);
                callTx = new loom_pb_1.CallTx();
                callTx.setVmType(loom_pb_1.VMType.EVM);
                callTx.setInput(ui8InData);
                msgTx = new loom_pb_1.MessageTx();
                msgTx.setFrom(caller.MarshalPB());
                msgTx.setTo(this.address.MarshalPB());
                msgTx.setData(callTx.serializeBinary());
                tx = new loom_pb_1.Transaction();
                tx.setId(2);
                tx.setData(msgTx.serializeBinary());
                return [2 /*return*/, this._client.commitTxAsync(caller.local.toString(), tx)];
            });
        });
    };
    /**
     * Calls a method of a contract running on an EVM that doesn't mutate state.
     * This method is usually used to query the current contract state, it doesn't commit any txs.
     * @param args ABI encoded function signature and input paramters.
     * @returns A promise that will be resolved with the return value of the contract method.
     */
    EvmContract.prototype.staticCallAsync = function (caller, args, output) {
        return __awaiter(this, void 0, void 0, function () {
            var ui8InData;
            return __generator(this, function (_a) {
                ui8InData = Uint8Array.from(args);
                return [2 /*return*/, this._client.queryAsync(this.address, ui8InData, loom_pb_1.VMType.EVM, caller)];
            });
        });
    };
    EvmContract.prototype._emitContractEvent = function (event) {
        if (event.contractAddress.equals(this.address)) {
            this.emit(EvmContract.EVENT, event);
        }
    };
    EvmContract.EVENT = 'event';
    return EvmContract;
}(events_1.default));
exports.EvmContract = EvmContract;
//# sourceMappingURL=evm-contract.js.map