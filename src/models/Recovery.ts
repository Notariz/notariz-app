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

    get key() {
        return this.publicKey.toBase58()
    }

    get owner_display() {
        const owner = this.owner.toBase58()
        return owner.slice(0,4) + '..' + owner.slice(-4)
    }
}