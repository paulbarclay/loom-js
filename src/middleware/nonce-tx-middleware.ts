import debug from 'debug'
import { NonceTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler, Client } from '../client'
import { bytesToHex, publicKeyFromPrivateKey } from '../crypto-utils'

const log = debug('nonce-tx-middleware')

/**
 * Wraps data in a NonceTx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export class NonceTxMiddleware implements ITxMiddlewareHandler {
  private _client: Client

  constructor(client: Client) {
    this._client = client
  }

  async Handle(txData: Readonly<Uint8Array>, localAddress: string): Promise<Uint8Array> {
    const privateKey = this._client.getPrivateKey(localAddress)
    const publicKey = publicKeyFromPrivateKey(privateKey)
    const key = bytesToHex(publicKey)
    const nonce = await this._client.getNonceAsync(key)

    log(`Next nonce ${nonce + 1}`)

    const tx = new NonceTx()
    tx.setInner(txData as Uint8Array)
    tx.setSequence(nonce + 1)
    return tx.serializeBinary()
  }
}
