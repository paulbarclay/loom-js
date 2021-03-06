"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middleware_1 = require("./middleware");
var crypto_utils_1 = require("./crypto-utils");
/**
 * Creates the default set of tx middleware required to successfully commit a tx to a Loom DAppChain.
 * @param client The client the middleware is being created for.
 * @param privateKey Private key that should be used to sign txs.
 * @returns Set of middleware.
 */
function createDefaultTxMiddleware(client, privateKey) {
    var pubKey = crypto_utils_1.publicKeyFromPrivateKey(privateKey);
    return [new middleware_1.NonceTxMiddleware(client), new middleware_1.SignedTxMiddleware(client)];
}
exports.createDefaultTxMiddleware = createDefaultTxMiddleware;
//# sourceMappingURL=helpers.js.map