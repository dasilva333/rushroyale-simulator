import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;

  gridRows: any = [
  ];

  tiers = [
    1, 2, 3, 4, 5, 6, 7
  ];
  levels = [
    7, 8, 9, 10, 11, 12, 13, 14, 15
  ];

  talents: any = {
    none: { damage: 0, critChance: 0, critDamage: 0 },
    unity: { damage: 615, critChance: 8, critDamage: 35 },
    ronin: { damage: 800, critChance: 0, critDamage: 0 },
  };

  cards: any = {
    'inquisitor': {
      name: 'Inquisitor', type: 'dps', hasPhases: false, mainDpsBaseDamage: 120, mainDpsBaseSpeed: 0.6, tier: true, level: true, talent: 'none', absorbs: 1,
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
    'boreas': { name: 'Boreas', type: 'dps', hasPhases: true, mainDpsBaseDamage: 120, mainDpsBaseSpeed: 0.09, mainDpsBaseCrit: 0, mainDpsFirstPhase: 4.6, mainDpsSecondPhase: 1.7, mainDpsActivationInterval: 4.7 },
    'sentry': { name: 'Sentry', type: 'dps', hasPhases: true, mainDpsBaseDamage: 456, mainDpsBaseSpeed: 0.09, mainDpsBaseCrit: 0, mainDpsDamageIncrease: 244, mainDpsActivationInterval: 0.95 },
    'crystalmancer': { name: 'Crystal Mancer', type: 'dps', hasPhases: true, mainDpsBaseDamage: 197, mainDpsBaseSpeed: 0.07, mainDpsBaseCrit: 0, mainDpsDamageIncrease: 800, mainDpsActivationInterval: 0.95 },
    'demonhunter': { name: 'Demon Hunter', type: 'dps', hasPhases: false, mainDpsBaseDamage: 1136, mainDpsBaseSpeed: 0.45, mainDpsBaseCrit: 0, demonHunterEmpowered: true, tier: 7, mainDpsDamageIncrease: 75 },
    'generic': { name: 'Generic', type: 'dps', hasPhases: false, mainDpsBaseDamage: 64, mainDpsBaseSpeed: 0.6, mainDpsBaseCrit: 0 },
    'banner': { building: true, level: true, tier: true, damage: 0, speed: 116, crit: 0, name: "Banner" },
    'dryad': { level: false, tier: false, damage: 50, speed: 0, crit: 0, type: 'unit', name: 'Dryad (Rage)', merges: 10, maxMerges: 20 },
    'harly': { level: false, tier: false, damage: 0, speed: 0, crit: 0, name: "Harly", type: 'none' },
    'sword': { level: true, tier: false, damage: 200, speed: 0, crit: 5, type: 'unit', name: 'Sword', merges: 10, maxMerges: 10 },
    'trapper': {
      level: true, tier: false,
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
    'scrapper': { level: false, tier: false, damage: 0, speed: 0, crit: 0, type: 'none', name: 'Scrapper' },
    'knight_statue': { building: true, level: true, tier: true, damage: 0, speed: 0, crit: 0, name: 'Knight Statue', critTiers: [5, 7.5, 10, 12.5, 15, 17.5, 20] },
    'witch_statue': { building: true, level: true, tier: false, damage: 204, speed: 0, crit: 0, type: 'unit', name: 'Witch', merges: 15, maxMerges: 30 },
    'grindstone': { building: true, level: false, tier: true, damage: 415, speed: 0, crit: 0, talents: [], type: 'flat', name: 'Grindstone', maxMerges: 100 },
  }

  isCardOptionsOpen = false;
  isCardPickerOpen = false;
  activeTile: any = { row: 0, column: 0 };
  boardConfig: any = {
    playerCrit: 2923
  };

  constructor(private toastController: ToastController) {
    console.log('tab5', this);
  }

  ngOnInit() {
    let savedBoard: any = localStorage.getItem('board');
    if (savedBoard) {
      this.gridRows = JSON.parse(savedBoard);
    } else {
      this.resetBoard();
    }
  }

  async saveInfo() {
    localStorage.setItem('board', JSON.stringify(this.gridRows));

    const toast = await this.toastController.create({
      message: 'Configuration Saved',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  resetBoard() {
    let cardTemplate = JSON.stringify({ id: '' });
    this.gridRows = [
    ];
    for (let row = 0; row < 3; row++) {
      this.gridRows[row] = [];
      for (let column = 0; column < 5; column++) {
        this.gridRows[row][column] = JSON.parse(cardTemplate);
      }
    }
  }

  getUniqueCardsOnBoard() {
    let uniqueCards = [];
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        let cardId = this.gridRows[row][column].id;
        if (uniqueCards.indexOf(cardId) == -1 && cardId != '') {
          uniqueCards.push(cardId);
        }
      }
    }
    return uniqueCards;
  }


  clickedTile(event: any, row: any, column: any) {
    //event.target.style.backgroundColor = 'lightgreen';
    this.activeTile.row = row;
    this.activeTile.column = column;
    this.isCardPickerOpen = true;
  }

  cancel() {
    this.isCardPickerOpen = false;
    this.isCardOptionsOpen = false;
  }

  clear() {
    this.isCardPickerOpen = false;
    this.isCardOptionsOpen = false;
    this.gridRows[this.activeTile.row][this.activeTile.column] = { id: '' };
  }

  confirm(cardPicked: any) {
    this.modal.dismiss(cardPicked, 'confirm');
  }

  get deckConfig() {
    return this.gridRows[this.activeTile.row][this.activeTile.column];
  }

  dmgWithAbsorbs(activeUnit: any) {
    let firstBonusPerStack = 0.06;
    let secondBonusPerStack = 0.035;
    let firstBonusLimit = 20;
    let newDamage = 0;
    let baseAttackDmg = activeUnit.damageLevels[activeUnit.level] + activeUnit.baseDamage;
    //console.log('baseAttackDmg', baseAttackDmg, activeUnit.baseDamage, activeUnit.damageLevels[activeUnit.level], activeUnit.level, activeUnit);
    if (activeUnit.absorbs <= firstBonusLimit) {
      newDamage = baseAttackDmg + ((baseAttackDmg * firstBonusPerStack) * activeUnit.absorbs);
    } else {
      let firstBonusDmg = ((baseAttackDmg * firstBonusPerStack) * firstBonusLimit);
      let secondBonusDmg = ((baseAttackDmg * secondBonusPerStack) * (activeUnit.absorbs - firstBonusLimit));
      newDamage = baseAttackDmg + firstBonusDmg + secondBonusDmg;
    }
    //soulAbsorbs
    return Math.floor(newDamage);
  }

  changeDeckConfig(event: any, field: string, isCheckbox?: boolean) {
    let value = event.target[isCheckbox ? 'checked' : 'value'];
    let activeUnit = this.gridRows[this.activeTile.row][this.activeTile.column];
    activeUnit[field] = value;
    if (activeUnit.id == 'inquisitor') {
      if (field == 'tier') {
        activeUnit.mainDpsBaseSpeed = parseFloat((activeUnit.baseSpeed - activeUnit.speedTiers[value]).toFixed(4));
      } else if (field == 'level' || field == 'absorbs') {
        activeUnit.mainDpsBaseDamage = this.dmgWithAbsorbs(activeUnit);
      }
    }
  }

  changeBoardConfig(event: any, field: string) {
    this.boardConfig[field] = event.target.value;
  }

  dismissedCardPicker(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      let cardId: any = ev.detail.data;
      let cardTemplate = this.cards[cardId];
      this.gridRows[this.activeTile.row][this.activeTile.column] = JSON.parse(JSON.stringify(cardTemplate))
      this.gridRows[this.activeTile.row][this.activeTile.column].id = cardId;

      this.activeTile.id = cardId;

      setTimeout(() => {
        this.isCardOptionsOpen = true;
      }, 200);
    }
    this.isCardPickerOpen = false;
  }

  dismissedCardOptions(event: Event) {

    this.isCardOptionsOpen = false;
  }

  getCardDisplayName(card: any) {
    let cardInfo;
    if (card && card.name) {
      cardInfo = this.cards[card.name];
    } else {
      cardInfo = this.cards[card];
    }
    return cardInfo.name;
  };

  getFieldMatters(cardId: any, field: string) {
    let hasKey = field in this.cards[cardId] && this.cards[cardId][field] > 0;
    return hasKey;
  }

  getCardsList() {
    let cards = [];
    let uniqueCards = this.getUniqueCardsOnBoard();
    let mainDpsPicked = uniqueCards.length > 0;
    let deckIsFull = uniqueCards.length == 5;
    //console.log('deckIsFull', deckIsFull, this.deck.length);
    let cardsList = Object.keys(this.cards);
    for (let card of cardsList) {
      let cardInfo = this.cards[card];
      if (mainDpsPicked == false) {
        if (cardInfo.type == 'dps') {
          cards.push(card);
        }
      } else if (deckIsFull) {
        //console.log('this.deck.indexOf(card)', this.deck.indexOf(card), card);
        if (uniqueCards.indexOf(card) > -1) {
          //console.log('adding to list ', card)
          cards.push(card);
        }
      }
      else {
        cards.push(card);
      }
    }
    return cards;
  }

  getCardName(cardName: any) {
    return cardName;
    /*
    if (card.level < 15) {
      return card.name;
    } else {
      let specialIcons = ['witch_statue'];
      if (specialIcons.indexOf(card.name) > -1) {
        return `${card.name}_max`;
      } else {
        return card.name;
      }
    }*/
  }

  changeTalentStat(ev: any, type: any) {
    this.talents[this.deckConfig.talent][type] = parseFloat(ev.target.value);
  }

  getActiveTalentStat(type: any) {
    if (this.deckConfig.talent) {
      return this.talents[this.deckConfig.talent][type];
    } else {
      return 0;
    }
  }

  cardMerges(card: any) {
    let maxMerges = card.maxMerges;
    return Array(maxMerges + 1).fill(0).map((x, i) => i);
  }

  getDamageInfoForUnit(tileInfo: any) {
    if (tileInfo.main.name == 'Boreas') {
      let originalSpeed = tileInfo.main.mainDpsBaseSpeed;
      let originalCrit = tileInfo.main.mainDpsBaseCrit;
      let normalPhaseDPS = this.getDamageInfoGeneric(tileInfo);
      let normalPhaseLength = parseFloat(tileInfo.main.mainDpsActivationInterval);
      let normalPhaseTotal = normalPhaseDPS.total * normalPhaseLength;
      //console.log('normalPhaseLength', normalPhaseLength, 'normalPhaseDamage', normalPhaseTotal, normalPhaseDPS);

      // 600% speed increase for first phase
      tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / 7;
      let firstPhaseDPS = this.getDamageInfoGeneric(tileInfo);
      let firstPhaseLength = parseFloat(tileInfo.main.mainDpsFirstPhase);
      let firstPhaseTotal = firstPhaseDPS.total * firstPhaseLength;
      tileInfo.main.mainDpsBaseSpeed = originalSpeed;
      //console.log('firstPhaseLength', firstPhaseLength, 'firstPhaseTotal', firstPhaseTotal, firstPhaseDPS);

      // 600% speed increase and 100% crit for second phase
      tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / 7;
      tileInfo.main.mainDpsBaseCrit = 100;
      let secondPhaseDPS = this.getDamageInfoGeneric(tileInfo);
      let secondPhaseLength = parseFloat(tileInfo.main.mainDpsSecondPhase);
      let secondPhaseTotal = secondPhaseDPS.total * secondPhaseLength;
      tileInfo.main.mainDpsBaseSpeed = originalSpeed;
      tileInfo.main.mainDpsBaseCrit = originalCrit;
      console.log('secondPhaseLength', secondPhaseLength, 'secondPhaseTotal', secondPhaseTotal, secondPhaseDPS);

      let totalPhaseLengthSeconds = normalPhaseLength + firstPhaseLength + secondPhaseLength;
      let total = Math.floor((normalPhaseTotal + firstPhaseTotal + secondPhaseTotal) / totalPhaseLengthSeconds);
      let results = {
        total,
        normalPhaseTotal,
        firstPhaseTotal,
        secondPhaseTotal,
        totalPhaseLengthSeconds
      };
      return results;
    } else if (tileInfo.main.name == 'Sentry') {
      let totalPhaseParts = Math.ceil(tileInfo.main.mainDpsDamageIncrease / 10);
      let totalPhaseLengthSeconds = totalPhaseParts * tileInfo.main.mainDpsActivationInterval;

      //let dpsPhases = [];
      let total = 0;
      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      for (let i = 0; i < totalPhaseParts; i++) {
        //tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * 1.1;
        let step = (i / 10) + 1;
        if (i == totalPhaseParts - 1) {
          //console.log('last one here we go', step);
          step = step + ((tileInfo.main.mainDpsDamageIncrease % 10) / 100);
          //console.log('last now we got this', step);
        }
        //console.log('step', step, i);
        tileInfo.main.mainDpsBaseDamage = originalDamage * step;
        //console.log('tileInfo.main.mainDpsBaseDamage', tileInfo.main.mainDpsBaseDamage);
        let dpsPhase = this.getDamageInfoGeneric(tileInfo);
        //dpsPhases.push(dpsPhase);
        total = total + dpsPhase.total;
      }
      total = total / totalPhaseLengthSeconds;
      tileInfo.main.mainDpsBaseDamage = originalDamage;

      //console.log('dpsPhases', dpsPhases);
      let results = {
        total: Math.floor(total),
        newAttackDamage: 0,
        newAttackSpeed: 0,
        dmgPerSecond: 0,
        critDmgPerSecond: 0,
        hitsPerSecond: 0,
        critHitsPerSecond: 0,
        criticalDamage: 0,
        normalPhaseTotal: 0,
        firstPhaseTotal: 0,
        secondPhaseTotal: 0,
        totalPhaseLengthSeconds
      };
      return results;
    } else {
      return this.getDamageInfoGeneric(tileInfo);
    }
  }

  /*getDamageInfoGeneric(newAttackSpeed: number, newAttackDamage: number,
    armorDestructionBuff: number, critChanceBuff: number, critDamageBuff: number, 
    enchanmentCritDmgBuff: number, totalSpeedBuffs: any, totalDamageBuffs: any) {*/
    
    let dmgPerSecond = 0;
    let critDmgPerSecond = 0;
    let playerBaseCrit = 0.05;

    let totalCritChance = playerBaseCrit;
    let totalArmorBuffs = 0;
    let totalCritDmgBuff = 0;
    //let enchanmentCritDmgBuff = 0;
    //let totalSpeedBuffs: any = [];
    //let totalDamageBuffs: any = [];
    //let newAttackSpeed = tileInfo.main.mainDpsBaseSpeed;
    //let newAttackDamage = tileInfo.main.mainDpsBaseDamage;

    for (let buff of totalSpeedBuffs) {
      newAttackSpeed = newAttackSpeed / (1 + (buff / 100));
    }

    for (let buff of totalDamageBuffs) {
      newAttackDamage = Math.round(newAttackDamage * (1 + (buff / 100)));
    }
    newAttackDamage = (newAttackDamage * (1 + (totalArmorBuffs / 100)));
    dmgPerSecond = newAttackDamage / newAttackSpeed;

    let hitsPerSecond = 1 / newAttackSpeed;
    let critHitsPerSecond = hitsPerSecond * totalCritChance;
    let criticalDamage = Math.floor(newAttackDamage * (((this.boardConfig.playerCrit * (1 + (enchanmentCritDmgBuff / 100))) + totalCritDmgBuff) / 100));

    critDmgPerSecond = Math.floor(criticalDamage * critHitsPerSecond);

    let results = {
      total: Math.floor(dmgPerSecond + critDmgPerSecond),
      newAttackDamage,
      newAttackSpeed,
      dmgPerSecond,
      critDmgPerSecond,
      hitsPerSecond,
      critHitsPerSecond,
      criticalDamage
    }
    return results;
  }

  getAdjacentUnitsForTile(row: number, column: number) {
    let adjacentUnits = [];

    if (row > 0) {
      let adjacentTop: any = this.gridRows[row - 1][column];
      adjacentUnits.push(adjacentTop);
    }
    if (row < 2) {
      let adjacentBottom = this.gridRows[row + 1][column];
      adjacentUnits.push(adjacentBottom);
    }

    if (column > 0) {
      let adjacentLeft = this.gridRows[row][column - 1];
      adjacentUnits.push(adjacentLeft);
    }

    if (column < 5) {
      let adjacentRight = this.gridRows[row][column + 1];
      adjacentUnits.push(adjacentRight);
    }

    return adjacentUnits.filter((unit: any) => unit.id != '');

  }
  damageReport() {
    let mainDamageUnits = [];
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        let cardInfo = this.gridRows[row][column];
        if (cardInfo.type == 'dps') {
          let tileInfo: any = { main: cardInfo, row, column };
          tileInfo.adjacentUnits = this.getAdjacentUnitsForTile(row, column);
          tileInfo.dpsInfo = this.getDamageInfoForUnit(tileInfo);
          mainDamageUnits.push(tileInfo);
        } else if (cardInfo.type == 'flat') {
          let tileInfo: any = { main: cardInfo, row, column };
          console.log('grindstone found', tileInfo);
        }
      }
    }
    console.log('mainDamageUnits', mainDamageUnits);
    return mainDamageUnits;
  }
}
