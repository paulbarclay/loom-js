import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler, Client } from '../client'
import { sign, publicKeyFromPrivateKey, bytesToHex } from '../crypto-utils'

/**
 * Signs transactions.
 */
export class SignedTxMiddleware implements ITxMiddlewareHandler {
  // The private key that should be used to sign txs.
  private _client: Client

  /**
   * Creates middlware that signs txs with the given key.
   * @param privateKey The private key that should be used to sign txs.
   */
  constructor(client: Client) {
    this._client = client
  }

  Handle(txData: Readonly<Uint8Array>, localAddress: string): Promise<Uint8Array> {
    const privateKey = this._client.getPrivateKey(localAddress)
    const sig = sign(txData as Uint8Array, privateKey)
    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)
    signedTx.setPublicKey(publicKeyFromPrivateKey(privateKey))
    return Promise.resolve(signedTx.serializeBinary())
  }
}
