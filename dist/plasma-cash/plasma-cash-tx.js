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
var address_1 = require("../address");
var big_uint_1 = require("../big-uint");
var crypto_utils_1 = require("../crypto-utils");
var solidity_helpers_1 = require("./solidity-helpers");
var plasma_cash_pb_1 = require("../proto/plasma_cash_pb");
var PlasmaCashTx = /** @class */ (function () {
    function PlasmaCashTx(params) {
        this.slot = params.slot;
        this.prevBlockNum = params.prevBlockNum;
        this.denomination = new bn_js_1.default(params.denomination);
        this.newOwner = params.newOwner;
        this.prevOwner = params.prevOwner;
        this.sigBytes = params.sig;
        this.proofBytes = params.proof;
    }
    PlasmaCashTx.prototype.rlpEncode = function () {
        var data = [
            this.slot.toArrayLike(Buffer, 'be'),
            this.prevBlockNum.toNumber(),
            this.denomination.toNumber(),
            this.newOwner
        ];
        console.log("This is screwed up");
        return '0x'; //+ rlp.encode(data).toString('hex')
    };
    Object.defineProperty(PlasmaCashTx.prototype, "sig", {
        /**
         * Hex encoded signature of the tx, prefixed by "0x".
         */
        get: function () {
            return '0x' + (this.sigBytes ? crypto_utils_1.bytesToHex(this.sigBytes) : '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlasmaCashTx.prototype, "proof", {
        /**
         * Hex encoded merkle proof of the tx, prefixed by "0x".
         */
        get: function () {
            return '0x' + (this.proofBytes ? crypto_utils_1.bytesToHex(this.proofBytes) : '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlasmaCashTx.prototype, "hash", {
        /**
         * Hex encoded hash of the tx, prefixed by "0x".
         */
        get: function () {
            if (this.prevBlockNum.cmp(new bn_js_1.default(0)) === 0) {
                return solidity_helpers_1.soliditySha3({ type: 'uint64', value: this.slot });
            }
            return solidity_helpers_1.soliditySha3({ type: 'bytes', value: this.rlpEncode() });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Signs the tx.
     * @param signer Signer to use for signing the tx.
     */
    PlasmaCashTx.prototype.signAsync = function (signer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, signer.signAsync(this.hash)];
                    case 1:
                        _a.sigBytes = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PlasmaCashTx;
}());
exports.PlasmaCashTx = PlasmaCashTx;
function unmarshalPlasmaTxPB(rawTx) {
    if (!rawTx.hasNewOwner()) {
        throw new Error('Invalid PlasmaTx: missing new owner');
    }
    var tx = new PlasmaCashTx({
        slot: new bn_js_1.default(rawTx.getSlot()),
        prevBlockNum: rawTx.hasPreviousBlock()
            ? big_uint_1.unmarshalBigUIntPB(rawTx.getPreviousBlock())
            : new bn_js_1.default(0),
        denomination: rawTx.hasDenomination()
            ? big_uint_1.unmarshalBigUIntPB(rawTx.getDenomination())
            : new bn_js_1.default(0),
        newOwner: address_1.Address.UmarshalPB(rawTx.getNewOwner()).local.toString(),
        sig: rawTx.getSignature_asU8(),
        proof: rawTx.getProof_asU8()
    });
    var sender = rawTx.getSender();
    if (sender) {
        tx.prevOwner = address_1.Address.UmarshalPB(sender).local.toString();
    }
    return tx;
}
exports.unmarshalPlasmaTxPB = unmarshalPlasmaTxPB;
function marshalPlasmaTxPB(tx) {
    var owner = new address_1.Address('eth', address_1.LocalAddress.fromHexString(tx.newOwner));
    var pb = new plasma_cash_pb_1.PlasmaTx();
    // TODO: protoc TypeScript plugin does't seem to understand annotations in .proto so the type
    // definition is wrong for the slot, it's actually a string that represents a 64-bit number...
    // should fix the plugin or use a different one.
    pb.setSlot(tx.slot.toString(10));
    pb.setPreviousBlock(big_uint_1.marshalBigUIntPB(tx.prevBlockNum));
    pb.setDenomination(big_uint_1.marshalBigUIntPB(tx.denomination));
    pb.setNewOwner(owner.MarshalPB());
    if (tx.prevOwner) {
        var sender = new address_1.Address('eth', address_1.LocalAddress.fromHexString(tx.prevOwner));
        pb.setSender(sender.MarshalPB());
    }
    if (tx.sigBytes) {
        pb.setSignature(crypto_utils_1.bufferToProtobufBytes(tx.sigBytes));
    }
    if (tx.proofBytes) {
        pb.setProof(crypto_utils_1.bufferToProtobufBytes(tx.proofBytes));
    }
    return pb;
}
exports.marshalPlasmaTxPB = marshalPlasmaTxPB;
//# sourceMappingURL=plasma-cash-tx.js.map