import Web3 from 'web3';
export declare function soliditySha3(...values: any[]): string;
/**
 * Signs message using a Web3 account.
 */
export declare class Web3Signer {
    private _web3;
    private _address;
    /**
     * @param web3 Web3 instance to use for signing.
     * @param accountAddress Address of web3 account to sign with.
     */
    constructor(web3: Web3, accountAddress: string);
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    signAsync(msg: string): Promise<Uint8Array>;
}
