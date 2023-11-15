// src/classes/UnitStatsManager.js

import UnitStatsStore from '../data/UnitStatsStore';

class UnitStatsManager {
    constructor(unitName) {
        this.unitName = unitName;
        this.unitStats = UnitStatsStore.getUnitStats(unitName);
    }

    getSpeedTier(tier) {
        const base = this.unitStats.MergeRanks['Base']['Attack Interval'];
        const stat = this.unitStats.MergeRanks[tier]['Attack Interval']
        return base + stat;
    }

    getDamageLevel(level) {
        return this.unitStats.Levels['Base'].Damage + this.unitStats.Levels[level].Damage;
    }
}

export default UnitStatsManager;
