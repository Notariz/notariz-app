import { PublicKey } from "@solana/web3.js"

export class Recovery {
    public publicKey: PublicKey;
    public upstreamDeed: PublicKey;
    public owner: PublicKey;
    public receiver: PublicKey; 
    
    constructor (publicKey: PublicKey, accountData: any) {
        this.publicKey = publicKey
        this.upstreamDeed = accountData.upstreamDeed
        this.owner = accountData.owner
        this.receiver = accountData.receiver
    }
}