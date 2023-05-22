import { Injectable } from '@angular/core';
import { EngineerService } from '../api/engineer.service';
import { GrindstoneService } from './grindstone.service';
import { MonkService } from './monk.service';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  engineer: EngineerService;
  grindstone: GrindstoneService;
  monk: MonkService;

  tiers = [
    1, 2, 3, 4, 5, 6, 7
  ];
  levels = [
    7, 8, 9, 10, 11, 12, 13, 14, 15
  ];

  talents: any = {
    none: { damage: 600, critChance: 0, critDamage: 0 },
    unity: { damage: 615, critChance: 8, critDamage: 35 },
    ronin: { damage: 800, critChance: 0, critDamage: 0 },
  };

  cards: any = {
    'inquisitor': {
      name: 'Inquisitor', type: 'dps', hasPhases: false, mainDpsBaseDamage: 120, mainDpsBaseSpeed: 0.6,
      mainDpsBaseCrit: 0, tier: true, level: true, talent: 'none', absorbs: 1, mainDpsDamageIncrease: 600,
      mainDpsDamageIncreaseSteps: 15, mainDpsBaseCritDmg: 0,
      baseDamage: 120, baseSpeed: 0.6, speedTiers: {
        1: 0,
        2: 0.3,
        3: 0.4,
        4: 0.45,
        5: 0.48,
        6: 0.5,
        7: 0.51
      }, damageLevels: {
        7: 320,
        8: 338,
        9: 359,
        10: 383,
        11: 410,
        12: 442,
        13: 478,
        14: 520,
        15: 568
      }
    },
    'boreas': {
      name: 'Boreas', type: 'dps', hasPhases: true, mainDpsBaseDamage: 120, mainDpsBaseSpeed: 0.09,
      activeTalents: [], mainDpsBaseCrit: 0, mainDpsFirstPhase: 4.6, mainDpsSecondPhase: 1.7, mainDpsActivationInterval: 4.7,
      level: true, tier: true, baseSpeed: 0.6, baseDamage: 20, speedTiers: {
        1: 0,
        2: 0.3,
        3: 0.4,
        4: 0.45,
        5: 0.48,
        6: 0.5,
        7: 0.51
      }, damageLevels: {
        7: 100,
        8: 103,
        9: 107,
        10: 111,
        11: 116,
        12: 122,
        13: 128,
        14: 136,
        15: 145
      }
    },
    'sentry': {
      name: 'Sentry', type: 'dps', hasPhases: true, mainDpsBaseDamage: 456, mainDpsBaseSpeed: 0.09, mainDpsBaseCrit: 0,
      mainDpsDamageIncrease: 244, mainDpsActivationInterval: 0.95
    },
    'cultists': {
      name: 'Cultist', type: 'dps', hasPhases: false, mainDpsBaseDamage: 1021, mainDpsBaseSpeed: 0.11, mainDpsBaseCrit: 17,
      mainDpsDamageIncrease: 300, sacrifices: 0, damagePerSacrifice: 0.05, level: true, tier: true, baseSpeed: 0.8, baseDamage: 333, speedTiers: {
        1: 0,
        2: 0.4,
        3: 0.53,
        4: 0.6,
        5: 0.64,
        6: 0.67,
        7: 0.69
      }, damageLevels: {
        7: 0,
        8: 50,
        9: 108,
        10: 174,
        11: 250,
        12: 338,
        13: 439,
        14: 555,
        15: 688
      }
    },
    'bladedancer': {
      name: 'Blade Dancer', type: 'dps', hasPhases: false, mainDpsBaseDamage: 1301, mainDpsBaseSpeed: 0.14, mainDpsBaseCrit: 0,
      mainDpsDamageIncrease: 0, dmgIncrease: [
        0,
        0,
        200,
        250,
        291,
        332,
        375,
        416,
        450
      ], level: true, tier: true, baseSpeed: 1, baseDamage: 215, speedTiers: {
        1: 0,
        2: 0.5,
        3: 0.67,
        4: 0.75,
        5: 0.8,
        6: 0.83,
        7: 0.86
      }, damageLevels: {
        7: 300,
        8: 345,
        9: 401,
        10: 468,
        11: 549,
        12: 647,
        13: 766,
        14: 911,
        15: 1086
      }
    },
    'crystalmancer': {
      name: 'Crystal Mancer', type: 'dps', hasPhases: false, mainDpsBaseDamage: 197, mainDpsBaseSpeed: 0.07, mainDpsBaseCrit: 0,
      mainDpsDamageIncreaseSteps: 10, mainDpsDamageIncrease: 800, mainDpsActivationInterval: 0.95
    },
    'demonhunter': {
      name: 'Demon Hunter', type: 'dps', hasPhases: false, mainDpsBaseDamage: 1136, mainDpsBaseSpeed: 0.45,
      mainDpsBaseCrit: 0, demonHunterEmpowered: true, mainDpsDamageIncrease: 75,
      level: true, tier: true, baseSpeed: 0.45, baseDamage: 201, speedTiers: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0
      }, damageLevels: {
        7: 200,
        8: 242,
        9: 294,
        10: 357,
        11: 433,
        12: 525,
        13: 636,
        14: 772,
        15: 935
      }
    },
    'engineer': { name: 'Engineer', type: 'dps', hasPhases: false, mainDpsBaseDamage: 971, mainDpsBaseSpeed: 0.07, mainDpsBaseCrit: 0, mainDpsDamageIncrease: 21, connections: 0 },
    'monk': {
      name: 'Monk', type: 'dps', hasPhases: false, baseSpeed: 0.6, baseDamage: 350, mainDpsBaseDamage: 350, mainDpsBaseSpeed: 0.6, mainDpsBaseCrit: 0, baseHarmony: 150, isActivated: false,
      level: true, tier: true, speedTiers: {
        1: 0,
        2: 0.3,
        3: 0.4,
        4: 0.45,
        5: 0.48,
        6: 0.5,
        7: 0.51
      }, harmonyTiers: {
        1: 0,
        2: 37.5,
        3: 75,
        4: 112.5,
        5: 150,
        6: 187.5,
        7: 225
      }, damageLevels: {
        7: 0,
        8: 63,
        9: 137,
        10: 225,
        11: 328,
        12: 450,
        13: 594,
        14: 764,
        15: 965
      }
    },
    'generic': { name: 'Generic', type: 'dps', hasPhases: false, mainDpsBaseDamage: 64, mainDpsBaseSpeed: 0.6, mainDpsBaseCrit: 0, mainDpsDamageIncrease: 0 },
    'banner': { building: true, level: true, tier: true, damage: 0, speed: 116, crit: 0, name: "Banner" },
    'dryad': { damage: 50, speed: 0, crit: 0, type: 'unit', name: 'Dryad', merges: 10, maxMerges: 20 },
    'harly': { hasOptions: false, damage: 0, speed: 0, crit: 0, name: "Harly", type: 'none' },
    'sword': { level: true, tier: false, damage: 200, speed: 0, crit: 5, type: 'unit', name: 'Sword', maxMerges: 10 },
    'trapper': {
      level: true,
      damage: 0, speed: 0, crit: 0, type: 'armor', name: 'Trapper', dmgLevels: [
        100,
        110, //level 8
        120,
        130,
        140,
        150,
        160,
        170,
        180
      ]
    },
    'chemist': { level: true, tier: true, damage: 103, speed: 0, crit: 0, type: 'armor', name: 'Chemist' },
    'scrapper': { hasOptions: false, damage: 0, speed: 0, crit: 0, type: 'none', name: 'Scrapper' },
    'knight_statue': { building: true, level: true, tier: true, damage: 0, speed: 0, crit: 0, name: 'Knight Statue', critTiers: [5, 7.5, 10, 12.5, 15, 17.5, 20] },
    'witch_statue': {
      building: true, type: 'dps', damage: 204, speed: 0, crit: 0, name: 'Witch', merges: 15, maxMerges: 30,
      hasPhases: false, mainDpsBaseDamage: 100, mainDpsBaseSpeed: 1, mainDpsBaseCrit: 0,
      level: true, tier: true, baseSpeed: 1, baseDamage: 100, speedTiers: {
        1: 0,
        2: 0.5,
        3: 0.67,
        4: 0.75,
        5: 0.8,
        6: 0.83,
        7: 0.86
      }, damageLevels: {
        7: 100,
        8: 116,
        9: 136,
        10: 159,
        11: 187,
        12: 218,
        13: 255,
        14: 299,
        15: 350
      }

    },
    'grindstone': {
      building: true, level: false, tier: true, damage: 415, speed: 0, crit: 0, talents: [{
        label: 'Lv13. Unstable Overheat',
        type: 'checkbox',
        value: 'unstable_overheat',
      },
      {
        label: 'Lv13. Triple Overheat',
        type: 'checkbox',
        value: 'triple_overheat',
      },
      {
        type: 'checkbox',
        value: 'tempered_steel',
        label: 'Lv15. Tempered Steel',
      }], activeTalents: [], type: 'flat', name: 'Grindstone', maxMerges: 100
    },
  }

  constructor(private engineerService: EngineerService, private grindstoneService: GrindstoneService, private monkService: MonkService) {
    this.engineer = this.engineerService;
    this.grindstone = this.grindstoneService;
    this.monk = this.monkService;
  }


}
