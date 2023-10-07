import BaseUnit from './BaseUnit';

class SupportUnit extends BaseUnit {
    constructor(config) {
        super(config);  // Pass the configuration to the parent class
    }

    calculateDPS() {
        // For support units, the damage per second is always 0.
        return 0;
    }
}

export default SupportUnit;
