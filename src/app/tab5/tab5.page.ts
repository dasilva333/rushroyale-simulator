import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Observable, Observer } from 'rxjs';
import { BoardService } from '../api/board.service';
import { UnitsService } from '../api/units.service';
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

  damageReport: any = {
    damageDealers: [],
    total: 0
  };

  isCardOptionsOpen = false;
  isCardPickerOpen = false;
  activeTile: any = { row: 0, column: 0 };
  boardConfig: any = {
    playerCrit: 2923
  };


  constructor(
    public unitsService: UnitsService,
    public boardService: BoardService) {
    console.log('tab5', this);
  }

  ngOnInit() {
    this.boardService.init(this.calculateDamageReport.bind(this));
    this.calculateDamageReport();
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
    this.boardService.gridRows[this.activeTile.row][this.activeTile.column] = { id: '' };
    this.calculateDamageReport();
  }

  confirm(cardPicked: any) {
    this.modal.dismiss(cardPicked, 'confirm');
  }

  get deckConfig() {
    return this.boardService.gridRows[this.activeTile.row][this.activeTile.column];
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
    let activeUnit = this.boardService.gridRows[this.activeTile.row][this.activeTile.column];
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

    if (field == 'tier' && activeUnit.speedTiers) {
      activeUnit.mainDpsBaseSpeed = parseFloat((activeUnit.baseSpeed - activeUnit.speedTiers[value]).toFixed(4));
    }

    if (activeUnit.id == 'inquisitor') {
      if (field == 'level' || field == 'absorbs') {
        activeUnit.mainDpsBaseDamage = this.dmgWithAbsorbs(activeUnit);
      } else if (field == 'talent') {
        if (value != '') {
          activeUnit.mainDpsDamageIncrease = this.unitsService.talents[value].damage;
          activeUnit.mainDpsBaseCrit = this.unitsService.talents[value].critChance;
          activeUnit.mainDpsBaseCritDmg = this.unitsService.talents[value].critDamage;
        }
      }
    } else {
      if (field == 'level' && activeUnit.damageLevels) {
        activeUnit.mainDpsBaseDamage = activeUnit.damageLevels[activeUnit.level] + activeUnit.baseDamage;
      }
    }

    if (activeUnit.id == 'boreas') {
      let talent = event.target.value;
      // if the talent is enabled
      if (value) {
        if (!activeUnit._mainDpsActivationInterval) {
          activeUnit._mainDpsActivationInterval = activeUnit.mainDpsActivationInterval;
          activeUnit._mainDpsSecondPhase = activeUnit.mainDpsSecondPhase;
          activeUnit._mainDpsFirstPhase = activeUnit.mainDpsFirstPhase;
        }

        if (talent == 'second_breath') {
          activeUnit.mainDpsFirstPhase = (activeUnit.mainDpsFirstPhase * 3).toFixed(1);
          activeUnit.mainDpsSecondPhase = (activeUnit.mainDpsSecondPhase * 4).toFixed(1);
          activeUnit.mainDpsActivationInterval = (activeUnit.mainDpsActivationInterval * 3).toFixed(1);
        } else if (talent == 'doublet' || talent == 'precise_shooting') {
          activeUnit.mainDpsFirstPhase = (activeUnit.mainDpsFirstPhase * 3).toFixed(1);
          activeUnit.mainDpsSecondPhase = (activeUnit.mainDpsSecondPhase * 3).toFixed(1);
          activeUnit.mainDpsActivationInterval = (activeUnit.mainDpsActivationInterval * 3).toFixed(1);
        }
      }
      // if the talent is disabled
      else {
        activeUnit.mainDpsFirstPhase = activeUnit._mainDpsFirstPhase;

        activeUnit.mainDpsSecondPhase = activeUnit._mainDpsSecondPhase;

        activeUnit.mainDpsActivationInterval = activeUnit._mainDpsActivationInterval;
      }
      console.log('field', field, 'value', value);
    }
  }

  changeBoardConfig(event: any, field: string) {
    this.boardConfig[field] = event.target.value;
  }

  dismissedCardPicker(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      let cardId: any = ev.detail.data;
      let cardTemplate = this.getCardInfoById(cardId) || this.unitsService.cards[cardId];
      this.boardService.gridRows[this.activeTile.row][this.activeTile.column] = JSON.parse(JSON.stringify(cardTemplate))
      this.boardService.gridRows[this.activeTile.row][this.activeTile.column].id = cardId;
      this.boardService.gridRows[this.activeTile.row][this.activeTile.column].swordStacks = 0;

      this.activeTile.id = cardId;

      this.calculateDamageReport();

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
          if (this.boardService.gridRows[row][column].id == this.activeTile.id) {
            let baseTemplate = JSON.parse(JSON.stringify(this.deckConfig));
            this.boardService.gridRows[row][column] = baseTemplate;
          }
        }
      }
    }
    this.calculateDamageReport();
  }

  getCardDisplayName(card: any) {
    let cardInfo;
    if (card && card.name) {
      cardInfo = this.unitsService.cards[card.name];
    } else {
      cardInfo = this.unitsService.cards[card];
    }
    return cardInfo.name;
  };

  getFieldMatters(cardId: any, field: string) {
    let cardTemplate = this.getCardInfoById(cardId) || this.unitsService.cards[cardId];
    let hasKey = field in cardTemplate && (cardTemplate[field] > -1 || cardTemplate[field] != '');
    return hasKey;
  }

  getCardsList() {
    let cards = [];
    let uniqueCards = this.boardService.getUniqueCardsOnBoard();
    let mainDpsPicked = uniqueCards.length > 0;
    let deckIsFull = uniqueCards.length == 5;
    //console.log('deckIsFull', deckIsFull, this.deck.length);
    let cardsList = Object.keys(this.unitsService.cards);
    for (let card of cardsList) {
      let cardInfo = this.unitsService.cards[card];
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
  }

  changeTalentStat(ev: any, type: any) {
    this.unitsService.talents[this.deckConfig.talent][type] = parseFloat(ev.target.value);
  }

  getActiveTalentStat(type: any) {
    if (this.deckConfig.talent) {
      return this.unitsService.talents[this.deckConfig.talent][type];
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
      let originalDamage = tileInfo.main.mainDpsBaseDamage;
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

      if (tileInfo.main.activeTalents.indexOf('precise_shooting') > -1 || tileInfo.main.activeTalents.indexOf('doublet') > -1) {
        // 100% speed increase
        if (tileInfo.main.activeTalents.indexOf('doublet') > -1) {
          tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / 2;
        }
        // 100% dmg increase
        if (tileInfo.main.activeTalents.indexOf('precise_shooting') > -1) {
          tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * 2;
        }
        let buffedThird2ndPhase = this.getDamageInfoGeneric(tileInfo);
        //take the DPS info and take 2/3 from it (to simulate 2 out of 3 phases)
        secondPhaseTotal = (secondPhaseTotal * 0.66) + buffedThird2ndPhase.total;
      }
      tileInfo.main.mainDpsBaseDamage = originalDamage;
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
        let actualDamage = Math.floor(originalDamage * (1 + (dmgIncrease / 100)));
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
    } else if (tileInfo.main.id == 'bladedancer') {
      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      let originalSpeed = tileInfo.main.mainDpsBaseSpeed;

      let numberOfUnits = this.boardService.getUnitsOnBoardById(tileInfo.main.id).length;
      //console.log('numberOfUnits', numberOfUnits, numberOfUnits >= tileInfo.main.dmgIncrease.length - 1, tileInfo.main.dmgIncrease.length);
      if (numberOfUnits >= tileInfo.main.dmgIncrease.length - 1) {
        tileInfo.main.mainDpsDamageIncrease = tileInfo.main.dmgIncrease[tileInfo.main.dmgIncrease.length - 1];
      } else {
        tileInfo.main.mainDpsDamageIncrease = tileInfo.main.dmgIncrease[numberOfUnits];
      }

      tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (tileInfo.main.mainDpsDamageIncrease / 100));
      let adjacentBDs = tileInfo.adjacentUnits.filter((unit: any) => unit.id == 'bladedancer').length;
      //console.log('adjacentBDs', adjacentBDs);
      if (adjacentBDs == 0) {
        tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / 2.5;
      }
      //console.log('tileInfo.main.mainDpsBaseSpeed', tileInfo.main.mainDpsBaseSpeed, adjacentBDs);
      let baseDps: any = this.getDamageInfoGeneric(tileInfo);

      tileInfo.main.mainDpsBaseSpeed = originalSpeed;
      tileInfo.main.mainDpsBaseDamage = originalDamage;
      return baseDps;
      //console.log('blade dancers on board', cardInfo, numberOfUnits, cardInfo.mainDpsDamageIncrease );
    } else if (tileInfo.main.id == 'cultists') {
      let originalSpeed = tileInfo.main.mainDpsBaseSpeed;
      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      let originalCrit = tileInfo.main.mainDpsBaseCrit;

      let adjacentCultists = tileInfo.adjacentUnits.filter((unit: any) => unit.id == 'cultists').length;
      let attackSpeedIncrease = adjacentCultists + 1;
      tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / attackSpeedIncrease;
      let isConnectedToEmpowered = false;
      for (let neighbor of tileInfo.adjacentUnits) {
        if (neighbor.id == 'cultists') {
          // check if this neighbor is empowered by seeing if this neighbor is connected to 3 other cultists
          //console.log('neighbor', neighbor);
          let neighbors = this.getAdjacentUnitsForTile(neighbor.row, neighbor.column);
          let cultistNeighbors = neighbors.filter((unit: any) => unit.id == 'cultists').length;
          if (cultistNeighbors == 4) {
            isConnectedToEmpowered = true;
          }
        }
      }

      if (isConnectedToEmpowered) {
        //take the crit chance from the user's input
      } else {
        tileInfo.main.mainDpsBaseCrit = 0;
      }

      if (adjacentCultists == 4) {
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (tileInfo.main.mainDpsDamageIncrease / 100));
        //console.log('center cultist dmg', tileInfo.main.mainDpsBaseDamage);
      }
      if (tileInfo.main.sacrifices > 0) {
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (tileInfo.main.sacrifices * tileInfo.main.damagePerSacrifice));
      }

      let dpsInfo = this.getDamageInfoGeneric(tileInfo);

      tileInfo.main.mainDpsBaseCrit = originalCrit;
      tileInfo.main.mainDpsBaseSpeed = originalSpeed;
      tileInfo.main.mainDpsBaseDamage = originalDamage;

      return dpsInfo;
    } else if (tileInfo.main.id == 'engineer') {

      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      if (tileInfo.main.connections){
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + ((tileInfo.main.mainDpsDamageIncrease*tileInfo.main.connections)/100));
      }
      
      let dpsInfo = this.getDamageInfoGeneric(tileInfo);
      tileInfo.main.mainDpsBaseDamage = originalDamage;
      return dpsInfo;
    }  else if (tileInfo.main.id == 'generic') {

      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      if (tileInfo.main.mainDpsDamageIncrease){
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (tileInfo.main.mainDpsDamageIncrease/100));
      }
      
      let dpsInfo = this.getDamageInfoGeneric(tileInfo);
      tileInfo.main.mainDpsBaseDamage = originalDamage;
      return dpsInfo;
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
        let tmp = this.boardService.gridRows[row][column];
        if (tmp.name == name) { cardInfo = tmp; }
      }
    }
    return cardInfo;
  }

  getCardInfoById(name: string) {
    let cardInfo;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        let tmp = this.boardService.gridRows[row][column];
        if (tmp.id == name) { cardInfo = tmp; }
      }
    }
    return cardInfo;
  }

  getSwordDmg(swordStacks: number) {
    let cardNames = this.boardService.getUniqueCardsOnBoard();
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
    let minCardLevel = this.unitsService.levels[0];
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
    let uniqueCards = this.boardService.getUniqueCardsOnBoard();

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
    let minLevel = this.unitsService.levels[0];
    let manaBonus = 10 + (card.level - minLevel);
    let speed = manaBonus + ((card.level + 3) * card.tier);
    return speed;
  }

  getCritChanceBuffs(tileInfo: any) {
    let critBuffs = [];

    // look for global damage buffs (sword)
    let uniqueCards = this.boardService.getUniqueCardsOnBoard();
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
    let uniqueCards = this.boardService.getUniqueCardsOnBoard();
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
    let uniqueCards = this.boardService.getUniqueCardsOnBoard();
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
    if (speedBuffs.length > 1) {
      speedBuffs = [Math.max.apply(null, speedBuffs)];
    }
    //console.log('speedBuffs', speedBuffs);
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
    let witchBuffAdded = false;
    // gs can have it's crit and damage buffed but not it's speed bc that's a result of the damage dealer
    for (let building of buildingBuffs) {
      if (building.id == 'witch_statue') {
        if (!witchBuffAdded){
          damageBuffs.push(this.getWitchBuff());
          witchBuffAdded = true;
        }
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
      console.log('gsBuffs', gsBuffs);
      //take the greater value of the base damage Math.max(combinedBuff.baseDamage, connectedGs.main.damage)
      combinedBuffs.baseDamage = Math.max(combinedBuffs.baseDamage, gsNeighbors.damage);

      //take the greater value of the crit buff Math.max(combinedBuff.critBuff, connectedGs.critBuff)
      combinedBuffs.critBuff = Math.max(combinedBuffs.critBuff, gsBuffs.critBuff);

      //take the greater value of the dmg buff Math.max(this.sumArray(combinedBuff.damageBuff), this.sumArray(connectedGs.damageBuff));
      let currentMax = this.sumOfArray(combinedBuffs.damageBuffs);
      let newMax = Math.max(currentMax, this.sumOfArray(gsBuffs.damageBuffs));
      console.log('currentMax', currentMax, 'newMax', newMax);
      if (newMax > currentMax) {
        combinedBuffs.damageBuffs = gsBuffs.damageBuffs;
      }
    }

    console.log('combinedBuffs', combinedBuffs);

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
    if (tileInfo.main.mainDpsBaseCritDmg && tileInfo.main.mainDpsBaseCritDmg > 0) {
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
      let adjacentTop: any = this.boardService.gridRows[row - 1][column];
      if (adjacentTop) {
        adjacentTop.row = row - 1;
        adjacentTop.column = column;
        adjacentUnits.push(adjacentTop);
      }
    }
    if (row < 2) {
      let adjacentBottom = this.boardService.gridRows[row + 1][column];
      if (adjacentBottom) {
        adjacentBottom.row = row + 1;
        adjacentBottom.column = column;
        adjacentUnits.push(adjacentBottom);
      }
    }

    if (column > 0) {
      let adjacentLeft = this.boardService.gridRows[row][column - 1];
      if (adjacentLeft) {
        adjacentLeft.row = row;
        adjacentLeft.column = column - 1;
        adjacentUnits.push(adjacentLeft);
      }
    }

    if (column < 5) {
      let adjacentRight = this.boardService.gridRows[row][column + 1];
      if (adjacentRight) {
        adjacentRight.row = row;
        adjacentRight.column = column + 1;
        adjacentUnits.push(adjacentRight);
      }
    }

    return adjacentUnits.filter((unit: any) => unit.id != '');

  }

  calculateDamageReport() {
    this.damageReport.damageDealers = [];

    
    let connectedEngineers = null;
    if (this.boardService.getUniqueCardsOnBoard().indexOf('engineer') > -1){
      connectedEngineers = this.unitsService.engineer.countConnectedNodes(this.boardService.gridRows, 'engineer');
      console.log('connectedEngineers', connectedEngineers);
    }

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        let cardInfo = this.boardService.gridRows[row][column];
        if (cardInfo.type == 'dps') {
          let damageDealer: any = { row, column, type: 'individual', dpsEntries: [] };
          let tileInfo: any = { main: cardInfo, row, column };

          tileInfo.adjacentUnits = this.getAdjacentUnitsForTile(row, column);

          if (cardInfo.id == 'engineer'){
            cardInfo.connections = connectedEngineers[row][column];
          }

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
