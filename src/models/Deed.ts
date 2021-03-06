import { PublicKey } from "@solana/web3.js"

export class Deed {
    public publicKey: PublicKey;
    public owner: PublicKey;
    public lastSeen: number;
    public leftToBeShared: number;
    public withdrawalPeriod: number;
    public alreadyRedeemed: number;

    constructor (publicKey: PublicKey, accountData: any) {
        this.publicKey = publicKey
        this.owner = accountData.owner
        this.lastSeen = accountData.lastSeen
        this.leftToBeShared = accountData.leftToBeShared
        this.withdrawalPeriod = accountData.withdrawalPeriod
        this.alreadyRedeemed = accountData.alreadyRedeemed
    }

    get key() {
        return this.publicKey.toBase58()
    }

    get owner_display() {
        const owner = this.owner.toBase58()
        return owner.slice(0,4) + '..' + owner.slice(-4)
    }
    
}