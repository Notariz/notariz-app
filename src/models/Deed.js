import dayjs from "dayjs"

export class Deed {
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.owner = accountData.owner
        this.lastSeen = accountData.lastSeen.toString()
        this.leftToBeShared = accountData.leftToBeShared
        this.withdrawalPeriod = accountData.withdrawalPeriod.toString()
    }

    get key() {
        return this.publicKey.toBase58()
    }

    get owner_display() {
        const owner = this.owner.toBase58()
        return owner.slice(0,4) + '..' + owner.slice(-4)
    }

    get last_seen () {
        return dayjs.unix(this.timestamp).format('lll')
    }
    
}