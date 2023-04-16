interface Card {
    id?: string;
    row?: number;
    column?: number;
    name: string;
    type: string;
    hasPhases: boolean;
    mainDpsBaseDamage: number;
    mainDpsBaseSpeed: number;
    mainDpsBaseCrit: number;
    swordStacks?: number;
    tier?: boolean;
    level?: boolean;
    talent?: string;
    absorbs?: number;
    baseDamage?: number;
    baseSpeed?: number;
    mainDpsDamageIncrease?: number;
    mainDpsDamageIncreaseSteps?: number;
    mainDpsBaseCritDmg?: number;
    activeTalents?: any[];
    mainDpsFirstPhase?: number;
    _mainDpsFirstPhase?: number;
    mainDpsSecondPhase?: number;
    _mainDpsSecondPhase?: number;
    mainDpsActivationInterval?: number;
    _mainDpsActivationInterval?: number;
    
    sacrifices?: number;
    damagePerSacrifice?: number;
    dmgIncrease?: number[];
    speedTiers: {
      [key: number]: number;
    };
    damageLevels: {
      [key: number]: number;
    };
  }
  