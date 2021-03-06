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
var ethereumjs_util_1 = __importDefault(require("ethereumjs-util"));
var web3_1 = __importDefault(require("web3"));
var web3 = new web3_1.default();
function soliditySha3() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    var _a;
    return (_a = web3.utils).soliditySha3.apply(_a, values);
}
exports.soliditySha3 = soliditySha3;
/**
 * Signs message using a Web3 account.
 */
var Web3Signer = /** @class */ (function () {
    /**
     * @param web3 Web3 instance to use for signing.
     * @param accountAddress Address of web3 account to sign with.
     */
    function Web3Signer(web3, accountAddress) {
        this._web3 = web3;
        this._address = accountAddress;
    }
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    Web3Signer.prototype.signAsync = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var signature, sig, mode, r, s, v;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3.eth.sign(msg, this._address)];
                    case 1:
                        signature = _a.sent();
                        sig = signature.slice(2);
                        mode = 1 // Geth
                        ;
                        r = ethereumjs_util_1.default.toBuffer('0x' + sig.substring(0, 64));
                        s = ethereumjs_util_1.default.toBuffer('0x' + sig.substring(64, 128));
                        v = parseInt(sig.substring(128, 130), 16);
                        if (v === 0 || v === 1) {
                            v += 27;
                        }
                        else {
                            mode = 0; // indicate that msg wasn't prefixed before signing (MetaMask doesn't prefix!)
                        }
                        return [2 /*return*/, Buffer.concat([ethereumjs_util_1.default.toBuffer(mode), r, s, ethereumjs_util_1.default.toBuffer(v)])];
                }
            });
        });
    };
    return Web3Signer;
}());
exports.Web3Signer = Web3Signer;
//# sourceMappingURL=solidity-helpers.js.map