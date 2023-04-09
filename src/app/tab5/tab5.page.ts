import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Observable, Observer } from 'rxjs';
declare var jQuery: any;
@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;

  infoMode: boolean = false;
  gridRows: any = [
  ];

  damageReport: any = {
    damageDealers: [],
    total: 0
  };

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
    'boreas': { name: 'Boreas', type: 'dps', hasPhases: true, mainDpsBaseDamage: 120, mainDpsBaseSpeed: 0.09, mainDpsBaseCrit: 0, mainDpsFirstPhase: 4.6, mainDpsSecondPhase: 1.7, mainDpsActivationInterval: 4.7 },
    'sentry': { name: 'Sentry', type: 'dps', hasPhases: true, mainDpsBaseDamage: 456, mainDpsBaseSpeed: 0.09, mainDpsBaseCrit: 0, mainDpsDamageIncrease: 244, mainDpsActivationInterval: 0.95 },
    'crystalmancer': { name: 'Crystal Mancer', type: 'dps', hasPhases: false, mainDpsBaseDamage: 197, mainDpsBaseSpeed: 0.07, mainDpsBaseCrit: 0, 
    mainDpsDamageIncreaseSteps: 10, mainDpsDamageIncrease: 800, mainDpsActivationInterval: 0.95 },
    'demonhunter': { name: 'Demon Hunter', type: 'dps', hasPhases: false, mainDpsBaseDamage: 1136, mainDpsBaseSpeed: 0.45, mainDpsBaseCrit: 0, demonHunterEmpowered: true, tier: 7, mainDpsDamageIncrease: 75 },
    'generic': { name: 'Generic', type: 'dps', hasPhases: false, mainDpsBaseDamage: 64, mainDpsBaseSpeed: 0.6, mainDpsBaseCrit: 0 },
    'banner': { building: true, level: true, tier: true, damage: 0, speed: 116, crit: 0, name: "Banner" },
    'dryad': { level: false, tier: false, damage: 50, speed: 0, crit: 0, type: 'unit', name: 'Dryad', merges: 10, maxMerges: 20 },
    'harly': { hasOptions: false, level: false, tier: false, damage: 0, speed: 0, crit: 0, name: "Harly", type: 'none' },
    'sword': { level: true, tier: false, damage: 200, speed: 0, crit: 5, type: 'unit', name: 'Sword', maxMerges: 10 },
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
    'scrapper': { hasOptions: false, level: false, tier: false, damage: 0, speed: 0, crit: 0, type: 'none', name: 'Scrapper' },
    'knight_statue': { building: true, level: true, tier: true, damage: 0, speed: 0, crit: 0, name: 'Knight Statue', critTiers: [5, 7.5, 10, 12.5, 15, 17.5, 20] },
    'witch_statue': { building: true, level: true, tier: false, damage: 204, speed: 0, crit: 0, type: 'unit', name: 'Witch', merges: 15, maxMerges: 30 },
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
    this.calculateDamaeReport();
  }

  // dragMode() {
  //   jQuery(".column").sortable({
  //     connectWith: ".column",
  //     handle: "img",

  //     placeholder: "portlet-placeholder ui-corner-all"
  //   });
  // }

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
    this.calculateDamaeReport();
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
    //console.log('clickedTile');
    this.activeTile.row = row;
    this.activeTile.column = column;
    if (this.deckConfig.id == '') {
      this.isCardPickerOpen = true;
    } else {
      this.activeTile.id = this.deckConfig.id;
      this.isCardOptionsOpen = true;
    }
  }

  cancel() {
    this.isCardPickerOpen = false;
    this.isCardOptionsOpen = false;
  }

  clear() {
    this.isCardPickerOpen = false;
    this.isCardOptionsOpen = false;
    this.gridRows[this.activeTile.row][this.activeTile.column] = { id: '' };
    this.calculateDamaeReport();
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
    if (field == 'activeTalents') {
      let valueIndex = activeUnit[field].indexOf(event.target.value);
      if (value && valueIndex == -1) {
        activeUnit[field].push(event.target.value);
      } else if (!value && valueIndex > -1) {
        activeUnit[field].splice(valueIndex, 1);
      }
    } else {
      activeUnit[field] = value;
    }

    if (activeUnit.id == 'inquisitor') {
      if (field == 'tier') {
        activeUnit.mainDpsBaseSpeed = parseFloat((activeUnit.baseSpeed - activeUnit.speedTiers[value]).toFixed(4));
      } else if (field == 'level' || field == 'absorbs') {
        activeUnit.mainDpsBaseDamage = this.dmgWithAbsorbs(activeUnit);
      } else if (field == 'talent'){
        if (value != ''){
          activeUnit.mainDpsDamageIncrease = this.talents[value].damage;
          activeUnit.mainDpsBaseCrit = this.talents[value].critChance;
          activeUnit.mainDpsBaseCritDmg = this.talents[value].critDamage;
        }
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
      let cardTemplate = this.getCardInfoById(cardId) || this.cards[cardId];
      this.gridRows[this.activeTile.row][this.activeTile.column] = JSON.parse(JSON.stringify(cardTemplate))
      this.gridRows[this.activeTile.row][this.activeTile.column].id = cardId;
      this.gridRows[this.activeTile.row][this.activeTile.column].swordStacks = 0;

      this.activeTile.id = cardId;
      
      this.calculateDamaeReport();

      if (cardTemplate && ('hasOptions' in cardTemplate && cardTemplate.hasOptions !== false) || !('hasOptions' in cardTemplate)) {
        setTimeout(() => {
          this.isCardOptionsOpen = true;
        }, 200);
      }
    }
    this.isCardPickerOpen = false;
  }

  dismissedCardOptions(event: Event, applyToAll: boolean) {

    this.isCardOptionsOpen = false;
    if (applyToAll) {
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 5; column++) {
          if (this.gridRows[row][column].id == this.activeTile.id) {
            let baseTemplate = JSON.parse(JSON.stringify(this.deckConfig));
            this.gridRows[row][column] = baseTemplate;
          }
        }
      }
    }
    this.calculateDamaeReport();
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
    let cardTemplate = this.getCardInfoById(cardId) || this.cards[cardId];
    let hasKey = field in cardTemplate && (cardTemplate[field] > -1 || cardTemplate[field] != '');
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
    if (tileInfo.main.id == 'boreas') {
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
      //console.log('secondPhaseLength', secondPhaseLength, 'secondPhaseTotal', secondPhaseTotal, secondPhaseDPS);

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
    } else if (tileInfo.main.id == 'sentry') {
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
    } else if (tileInfo.main.id == 'demonhunter') {
      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      if (tileInfo.main.demonHunterEmpowered) {
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (tileInfo.main.mainDpsDamageIncrease / 100));
      }
      tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * tileInfo.main.tier;
      let results = this.getDamageInfoGeneric(tileInfo);
      tileInfo.main.mainDpsBaseDamage = originalDamage;

      return results;
    } else if ((tileInfo.main.id == 'inquisitor' && tileInfo.main.talent != '') || tileInfo.main.id == 'crystalmancer') {
      let damageIncrease = tileInfo.main.mainDpsDamageIncreaseSteps; //percent
      //figure out the base dps to get the buffed speed
      let baseDps: any = this.getDamageInfoGeneric(tileInfo);;
      // figure out how many hits it takes to get to max dmg increase
      let totalPhaseParts = Math.ceil(tileInfo.main.mainDpsDamageIncrease / damageIncrease);
      // use the buffed speed to figure out how long it'll take to get to max speed
      baseDps.totalPhaseLengthSeconds = totalPhaseParts * baseDps.newAttackSpeed;
      //console.log('baseDps', baseDps, 'totalPhaseParts', totalPhaseParts);
      let totalHitDamage = 0;
      //let totalPhaseLength = 0;
      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      for (let i = 0; i < totalPhaseParts; i++) {
        let dmgIncrease = Math.min(tileInfo.main.mainDpsDamageIncrease, damageIncrease * (i + 1));
        let actualDamage = Math.floor(originalDamage * (1 + (dmgIncrease/100)));
        totalHitDamage = totalHitDamage + actualDamage;
      }
      // the number of crits done within the phase parts (aka the 54 hits required to get to 800%)
      let numberOfCrits = baseDps.totalCritChance * totalPhaseParts;
      // crit dmg per second is # of crits x crit hit dmg then divided by the phase length or how long it took to get those crits
      baseDps.critDmgPerSecond = Math.floor((numberOfCrits * baseDps.criticalDamage) / baseDps.totalPhaseLengthSeconds);
      // dmg per second is the total damage done divided by the time it took to do that damage
      baseDps.dmgPerSecond = Math.floor(totalHitDamage / baseDps.totalPhaseLengthSeconds);
      // total is the sum of both regular hits per second and crits per second
      baseDps.total = baseDps.dmgPerSecond + baseDps.critDmgPerSecond; 
      //console.log('totalHitDamage', totalHitDamage, 'totalPhaseLength', baseDps.totalPhaseLengthSeconds);

      return baseDps;
    } else {
      return this.getDamageInfoGeneric(tileInfo);
    }
  }

  sumOfArray(arrBuffs: any) {
    return arrBuffs.reduce((memo: any, value: any) => {
      memo = memo + value;
      return memo;
    }, 0)
  }

  getCardInfoByName(name: string) {
    let cardInfo;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        let tmp = this.gridRows[row][column];
        if (tmp.name == name) { cardInfo = tmp; }
      }
    }
    return cardInfo;
  }

  getCardInfoById(name: string) {
    let cardInfo;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        let tmp = this.gridRows[row][column];
        if (tmp.id == name) { cardInfo = tmp; }
      }
    }
    return cardInfo;
  }

  getSwordDmg(swordStacks: number) {
    let cardNames = this.getUniqueCardsOnBoard();
    let card = this.getCardInfoByName('Sword');

    let cardBuff = ((card.damage / 10) + ((card.level - 7) * 1.5)) * swordStacks;

    if (cardNames.indexOf('knight_statue') > -1) {
      cardBuff = cardBuff / 5;
    }
    return cardBuff;
  }

  getWitchBuff() {
    let card = this.getCardInfoByName('Witch');
    let merges = card.merges;
    let divider = 10;
    let baseBuff = 38;
    let baseBonus = 10;
    let bonusAddon = 4;
    let cardBonus = card.level - 9;
    let dmgIncrease = baseBuff + (baseBonus + (bonusAddon * cardBonus));
    return parseFloat(((dmgIncrease / divider) * merges).toFixed(2));
  }

  getDryadBuff() {
    let card = this.getCardInfoByName('Dryad');
    let merges = card.merges || 0;
    let buffPerMerge = 2.5;
    return merges * buffPerMerge;
  }


  getChemistBuff() {
    let card = this.getCardInfoByName('Chemist');
    let baseDmg = 40;
    let multiplier = 0.5;
    let bonus = 4.5;
    let cardLevel = card.level;
    let tierLevel = card.tier;

    let totalDamage = baseDmg + (multiplier * (cardLevel - 6)) + ((multiplier * (cardLevel - 6)) + bonus) * (tierLevel - 1);
    return totalDamage + bonus;
  }

  getTrapperBuff() {
    let cardInfo = this.getCardInfoByName('Trapper');
    let totalDamage = cardInfo.dmgLevels[cardInfo.level - 7];
    return totalDamage;
  }


  getBannerBuff(card?: any) {
    if (!card) card = this.getCardInfoByName('Banner');
    let currentCardLevel = card.level;
    let minCardLevel = this.levels[0];
    let baseAttackSpeed = 12;
    let tierMultiplier = 0.5;
    let newAttackSpeed = (baseAttackSpeed + ((currentCardLevel - minCardLevel) * tierMultiplier)) * card.tier;
    return newAttackSpeed;
  }

  getSwordCrit(swordStacks: number, card?: any) {
    if (!card) card = this.getCardInfoByName('Sword');

    //console.log('sword card', card);
    //you only get the crit buff on the 10th stack
    let swordCrit = swordStacks == 10 ? card.crit : 0;
    let uniqueCards = this.getUniqueCardsOnBoard();

    // you only get 1% if there's a ks in the deck
    if (uniqueCards.indexOf('knight_statue') > -1) {
      swordCrit = swordCrit / 5;
    }
    return swordCrit;
  }

  getKsCrit(card?: any) {
    if (!card) card = this.getCardInfoByName('Knight Statue');
    return card.critTiers[card.tier - 1];
  }

  getKsSpeed(card?: any) {
    if (!card) card = this.getCardInfoByName('Knight Statue');
    let minLevel = this.levels[0];
    let manaBonus = 10 + (card.level - minLevel);
    let speed = manaBonus + ((card.level + 3) * card.tier);
    return speed;
  }

  getCritChanceBuffs(tileInfo: any) {
    let critBuffs = [];

    // look for global damage buffs (sword)
    let uniqueCards = this.getUniqueCardsOnBoard();
    for (let card of uniqueCards) {
      if (card == 'sword') {
        let swordCrit = this.getSwordCrit(tileInfo.main.swordStacks);
        critBuffs.push(swordCrit);
      }
    }

    // look for crit buffs in neighboring tiles (only ks)
    for (let neighbor of tileInfo.adjacentUnits) {
      if (neighbor.name == 'Knight Statue') {
        critBuffs.push(this.getKsCrit(neighbor));
      }
    }

    return critBuffs;
  }

  getTotalDamageBuffs(tileInfo: any) {
    let damageBuffs: any = [];
    // look for damage buffs in neighboring tiles
    for (let neighbor of tileInfo.adjacentUnits) {
      if (neighbor.name == 'Witch') {
        damageBuffs.push(this.getWitchBuff());
      }
    }
    // look for global damage buffs
    let uniqueCards = this.getUniqueCardsOnBoard();
    for (let card of uniqueCards) {
      if (card == 'dryad') {
        damageBuffs.push(this.getDryadBuff());
      } else if (card == 'sword') {
        damageBuffs.push(this.getSwordDmg(tileInfo.main.swordStacks));
      }
    }
    //heroes, weapons, amulets, enchantments go here

    return damageBuffs;
  }

  totalArmorBuff() {
    let dmgBuffs = [];

    // look for global damage buffs
    let uniqueCards = this.getUniqueCardsOnBoard();
    for (let card of uniqueCards) {
      if (card == 'trapper') {
        dmgBuffs.push(this.getTrapperBuff());
      } if (card == 'chemist') {
        dmgBuffs.push(this.getChemistBuff());
      }
    }

    //TODO: Add snowflake here

    return dmgBuffs;
  }

  totalSpeedBuff(tileInfo: any) {

    let speedBuffs: any = [];
    // look for damage buffs in neighboring tiles
    for (let neighbor of tileInfo.adjacentUnits) {
      if (neighbor.name == 'Banner') {
        speedBuffs.push(this.getBannerBuff(neighbor));
      } else if (neighbor.name == 'Knight Statue') {
        speedBuffs.push(this.getKsSpeed(neighbor));
      }
    }

    //heroes, weapons, amulets, enchantments go here

    return speedBuffs;
  }

  getGrindstoneBuffs(grindstoneUnit: any) {
    /* find buffs to grindstone (ks and witch) */
    let neighborUnits = this.getAdjacentUnitsForTile(grindstoneUnit.row, grindstoneUnit.column);
    let buildingBuffs = neighborUnits.filter((unit: any) => (unit.id == 'witch_statue' || unit.id == 'knight_statue'));
    //console.log('gs buildingBuffs', buildingBuffs);
    let critBuff = 0;
    let damageBuffs = [];
    // gs can have it's crit and damage buffed but not it's speed bc that's a result of the damage dealer
    for (let building of buildingBuffs) {
      if (building.id == 'witch_statue') {
        damageBuffs.push(this.getWitchBuff());
      } else if (building.id == 'knight_statue') {
        // if the user sets up two neighboring KS it'll pick the one with the highest stats
        critBuff = Math.max(critBuff, this.getKsCrit(building));
      }
    }
    // gs can have it's crit and damage buffed by talents
    if (grindstoneUnit.activeTalents.length) {
      for (let talent of grindstoneUnit.activeTalents) {
        if (talent == 'tempered_steel') {
          //console.log('tempered steel found', tileInfo.main.tier);
          critBuff = critBuff + grindstoneUnit.tier;
        } else if (talent == 'triple_overheat') {
          //console.log('tempered steel found', tileInfo.main.tier);
          damageBuffs.push(30);
        } else if (talent == 'unstable_overheat') {
          if (!('merges' in grindstoneUnit)) grindstoneUnit.merges = 0;
          let buffPerStack = 1.5;
          let baseBuff = 10;
          damageBuffs.push(baseBuff + (buffPerStack * grindstoneUnit.merges));
        }
      }
    }
    return {
      damageBuffs,
      critBuff
    };
  }

  //provided the tileInfo for the damage dealer with a known grindstone connected
  getDamageForGrindstone(tileInfo: any) {
    let ghostUnit: any = {
      main: JSON.parse(JSON.stringify(tileInfo.main)),
      adjacentUnits: this.getAdjacentUnitsForTile(tileInfo.row, tileInfo.column),
      row: tileInfo.row,
      column: tileInfo.column,
    };

    ghostUnit.main.name = `${ghostUnit.main.name} & Grindstone`;

    let combinedBuffs: any = { critBuff: 0, damageBuffs: [], baseDamage: 0 };
    // find all the grindstones connected to the damage dealer
    let otherGrindstonesConnected = ghostUnit.adjacentUnits
      .filter((neighbor: any) => neighbor.id == 'grindstone');

    // loop over all the connected grindstones
    for (let gsNeighbors of otherGrindstonesConnected) {
      let gsBuffs = this.getGrindstoneBuffs(gsNeighbors);
      //console.log('gsBuffs', gsBuffs);
      //take the greater value of the base damage Math.max(combinedBuff.baseDamage, connectedGs.main.damage)
      combinedBuffs.baseDamage = Math.max(combinedBuffs.baseDamage, gsNeighbors.damage);

      //take the greater value of the crit buff Math.max(combinedBuff.critBuff, connectedGs.critBuff)
      combinedBuffs.critBuff = Math.max(combinedBuffs.critBuff, gsBuffs.critBuff);

      //take the greater value of the dmg buff Math.max(this.sumArray(combinedBuff.damageBuff), this.sumArray(connectedGs.damageBuff));
      let currentMax = this.sumOfArray(combinedBuffs.damageBuffs);
      let newMax = Math.max(currentMax, this.sumOfArray(gsBuffs.damageBuffs));
      if (newMax > currentMax) {
        combinedBuffs.damageBuffs = gsBuffs.damageBuffs;
      }
    }

    //console.log('combinedBuffs', combinedBuffs);

    ghostUnit.main.mainDpsBaseDamage = combinedBuffs.baseDamage;

    //apply the buffs from combinedBuffs to the ghostUnit object  
    for (let buff of combinedBuffs.damageBuffs) {
      ghostUnit.main.mainDpsBaseDamage = Math.round(ghostUnit.main.mainDpsBaseDamage * (1 + (buff / 100)));
    }

    // set the base crit to any adjacent knight statue stats
    ghostUnit.main.mainDpsBaseCrit = combinedBuffs.critBuff;

    //console.log('ghostUnit', ghostUnit);

    ghostUnit.dpsInfo = this.getDamageInfoForUnit(ghostUnit);

    //console.log('ghostUnit', ghostUnit);

    return ghostUnit;
  }

  getDamageInfoGeneric(tileInfo: any) {
    let dmgPerSecond = 0;
    let critDmgPerSecond = 0;
    let playerBaseCrit = 0.05;
    let totalArmorBuffs = this.sumOfArray(this.totalArmorBuff());
    let totalCritDmgBuff = 0;
    let enchanmentCritDmgBuff = 0;
    let totalSpeedBuffs = this.totalSpeedBuff(tileInfo);

    let totalDamageBuffs = this.getTotalDamageBuffs(tileInfo);

    let newAttackSpeed = tileInfo.main.mainDpsBaseSpeed;
    let newAttackDamage = tileInfo.main.mainDpsBaseDamage;
    if (tileInfo.main.mainDpsBaseCritDmg && tileInfo.main.mainDpsBaseCritDmg > 0){
      totalCritDmgBuff = tileInfo.main.mainDpsBaseCritDmg;
    }
    //crit chance can never exceed 100%
    let totalCritChance = Math.min(1, playerBaseCrit + (tileInfo.main.mainDpsBaseCrit / 100) + ((this.sumOfArray(this.getCritChanceBuffs(tileInfo))) / 100));

    //console.log('totalCritChance', playerBaseCrit, tileInfo.main.mainDpsBaseCrit, totalCritChance);
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
      criticalDamage,
      totalCritChance
    }
    return results;
  }

  getAdjacentUnitsForTile(row: number, column: number) {
    let adjacentUnits = [];

    if (row > 0) {
      let adjacentTop: any = this.gridRows[row - 1][column];
      if (adjacentTop) {
        adjacentTop.row = row - 1;
        adjacentTop.column = column;
        adjacentUnits.push(adjacentTop);
      }
    }
    if (row < 2) {
      let adjacentBottom = this.gridRows[row + 1][column];
      if (adjacentBottom) {
        adjacentBottom.row = row + 1;
        adjacentBottom.column = column;
        adjacentUnits.push(adjacentBottom);
      }
    }

    if (column > 0) {
      let adjacentLeft = this.gridRows[row][column - 1];
      if (adjacentLeft) {
        adjacentLeft.row = row;
        adjacentLeft.column = column - 1;
        adjacentUnits.push(adjacentLeft);
      }
    }

    if (column < 5) {
      let adjacentRight = this.gridRows[row][column + 1];
      if (adjacentRight) {
        adjacentRight.row = row;
        adjacentRight.column = column + 1;
        adjacentUnits.push(adjacentRight);
      }
    }

    return adjacentUnits.filter((unit: any) => unit.id != '');

  }

  calculateDamaeReport() {
    this.damageReport.damageDealers = [];

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        let cardInfo = this.gridRows[row][column];
        if (cardInfo.type == 'dps') {
          let damageDealer: any = { row, column, type: 'individual', dpsEntries: [] };
          let tileInfo: any = { main: cardInfo, row, column };

          tileInfo.adjacentUnits = this.getAdjacentUnitsForTile(row, column);
          tileInfo.dpsInfo = this.getDamageInfoForUnit(tileInfo);
          damageDealer.dpsEntries.push(tileInfo);

          let hasGrindstones = tileInfo.adjacentUnits.filter((unit: any) => unit.id == 'grindstone').length > 0;
          if (hasGrindstones) {
            damageDealer.dpsEntries.push(this.getDamageForGrindstone(tileInfo));
          }

          this.damageReport.damageDealers.push(damageDealer);
        }
      }
    }

    this.damageReport.totalDPS = this.damageReport.damageDealers.reduce((memo: any, value: any) => {
      for (let dpsEntry of value.dpsEntries) {
        memo = memo + dpsEntry.dpsInfo.total;
      }
      return memo;
    }, 0);

    //console.log('mainDamageUnits', mainDamageUnits);

    return this.damageReport;
  }
}
