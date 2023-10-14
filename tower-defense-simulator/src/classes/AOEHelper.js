import waveData from '../data/waves.json';

class AoEHelper {
    static aoeRadius = 75;
    static trackLength = 1090;
    
    static getAdjustedFlowRate(waveIndex) {
        console.log('waveData', waveData, waveIndex);
        const wave = waveData[waveIndex - 1];
        if (!wave) {
            console.log(`Invalid wave index: ${waveIndex}`);
            return 0;
        }
        const flowRate = wave.totalUnits / wave.totalTime;
        console.log('Flow rate:', flowRate);
        const totalSlowEffect = this.getTotalSlowEffect();
        console.log('Total slow effect:', totalSlowEffect);
        const adjustedFlowRate = flowRate / (1 + totalSlowEffect);
        console.log('Adjusted flow rate:', adjustedFlowRate);

        return adjustedFlowRate;
    }

    static getTotalSlowEffect() {
        // Hardcoded slow factor for now
        return 0.3; 
    }

    static getEffectiveAoELength(aoeLength, overlapPercentage) {
        const effectiveLength = aoeLength * (1 - overlapPercentage);
        console.log('Effective AoE Length:', effectiveLength);
        return effectiveLength;
    }

    static getUnitsAffected(aoeLength, unitWidth) {
        // Adjust the gap between units based on the slowing effect
        const adjustedGap = unitWidth / (1 + this.getTotalSlowEffect());
        const effectiveAoELength = this.getEffectiveAoELength(aoeLength, 0);
        const unitsAffected = effectiveAoELength / (unitWidth + adjustedGap);
        return unitsAffected;
    }

    static calculateAoEDamage(aoeLength, waveIndex, baseDamage, unitWidth = 40) {
        const adjustedFlowRate = this.getAdjustedFlowRate(waveIndex);
        const unitsAffected = this.getUnitsAffected(aoeLength, unitWidth);
        const totalDamage = unitsAffected * baseDamage;
        console.log('Total AoE damage:', totalDamage);
        
        return totalDamage;
    }
    
    // Add other helper methods as necessary
}

export default AoEHelper;
