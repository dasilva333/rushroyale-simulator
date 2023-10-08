import BaseUnit from './BaseUnit';

class SupportUnit extends BaseUnit {
    constructor(config) {
        super(config);  // Pass the configuration to the parent class
    }

    getUnitBuffs(key, config){
        return 0;
    }
}

export default SupportUnit;
