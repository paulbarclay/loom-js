import { ITxMiddlewareHandler, Client } from '../client';
/**
 * Signs transactions.
 */
export declare class SignedTxMiddleware implements ITxMiddlewareHandler {
    private _client;
    /**
     * Creates middlware that signs txs with the given key.
     * @param privateKey The private key that should be used to sign txs.
     */
    constructor(client: Client);
    Handle(txData: Readonly<Uint8Array>, localAddress: string): Promise<Uint8Array>;
}
