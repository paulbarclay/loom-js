"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loom_pb_1 = require("../proto/loom_pb");
var crypto_utils_1 = require("../crypto-utils");
/**
 * Signs transactions.
 */
var SignedTxMiddleware = /** @class */ (function () {
    /**
     * Creates middlware that signs txs with the given key.
     * @param privateKey The private key that should be used to sign txs.
     */
    function SignedTxMiddleware(client) {
        this._client = client;
    }
    SignedTxMiddleware.prototype.Handle = function (txData, localAddress) {
        var privateKey = this._client.getPrivateKey(localAddress);
        var sig = crypto_utils_1.sign(txData, privateKey);
        var signedTx = new loom_pb_1.SignedTx();
        signedTx.setInner(txData);
        signedTx.setSignature(sig);
        signedTx.setPublicKey(crypto_utils_1.publicKeyFromPrivateKey(privateKey));
        return Promise.resolve(signedTx.serializeBinary());
    };
    return SignedTxMiddleware;
}());
exports.SignedTxMiddleware = SignedTxMiddleware;
//# sourceMappingURL=signed-tx-middleware.js.map