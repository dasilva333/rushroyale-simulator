let unitCounter = 0;

class BaseUnit {
    static defaultImage = "";  // Default empty image path

    constructor(name, rateOfFire, damagePerHit) {
        this.id = unitCounter++;     // Automatically generate a unique ID
        this.name = name;             
        this.rateOfFire = rateOfFire;
        this.damagePerHit = damagePerHit;
    }

    // Getter to construct the complete image path
    static get baseImage() {
        return `board/${this.defaultImage}`;
    }

    // Calculating DPS (Damage Per Second)
    calculateDPS() {
        return this.rateOfFire * this.damagePerHit;
    }
}

export default BaseUnit;
