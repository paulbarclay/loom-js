import { ITxMiddlewareHandler, Client } from '../client';
/**
 * Wraps data in a NonceTx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export declare class NonceTxMiddleware implements ITxMiddlewareHandler {
    private _client;
    constructor(client: Client);
    Handle(txData: Readonly<Uint8Array>, localAddress: string): Promise<Uint8Array>;
}
