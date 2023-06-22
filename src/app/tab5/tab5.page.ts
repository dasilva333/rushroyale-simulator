import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { BoardService } from '../api/board.service';
import { UnitsService } from '../api/units.service';

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

  isItemConfigOpen = false;
  itemConfigType: string = '';
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


  /*
  onItemEntered(event: CdkDragEnter<any>) {
    console.log('onItemEntered', event.item.element.nativeElement);
    event.item.element.nativeElement.classList.add('droppable');
  }
  
  onItemExited(event: CdkDragExit<any>) {
    console.log('onItemExited', event.item.element.nativeElement);
    event.item.element.nativeElement.classList.remove('droppable');
  }
  

  onListEntered(event: MouseEvent) {
    const dropList = event.target as HTMLElement;
    console.log('onListEntered', dropList);
    dropList.classList.add('droppable');
  }
  
  drop(event: CdkDragDrop<any>) {
    const srcIndexes = event.item.data as { rowIndex: number; colIndex: number };
    const targetIndexes = event.container.getSortedItems()[event.currentIndex]?.data as { rowIndex: number; colIndex: number } || null;
  
    console.log('srcIndexes:', srcIndexes);
    console.log('targetIndexes:', targetIndexes);
    console.log('boardService.gridRows:', this.boardService.gridRows);
  
    if (targetIndexes) {
      const { rowIndex: srcRowIndex, colIndex: srcColIndex } = srcIndexes;
      const { rowIndex: targetRowIndex, colIndex: targetColIndex } = targetIndexes;
  
      // Swap the TypeScript objects in the nested arrays
      [
        this.boardService.gridRows[srcRowIndex][srcColIndex],
        this.boardService.gridRows[targetRowIndex][targetColIndex],
      ] = [
        this.boardService.gridRows[targetRowIndex][targetColIndex],
        this.boardService.gridRows[srcRowIndex][srcColIndex],
      ];
    }
  }*/


  activeEditItem = '';

  setItemConfig(configType: any, ev: Event) {
    this.itemConfigType = configType;
    this.activeEditItem = this.boardService.getActiveItem(configType, '');
    this.isItemConfigOpen = !this.isItemConfigOpen;
  }

  heroCancel() {
    this.isItemConfigOpen = false;
  }

  heroClear() {
    this.isItemConfigOpen = false;
    this.calculateDamageReport();
  }

  heroConfirm() {
    //this.modal.dismiss(heroPicked, 'confirm');
    this.isItemConfigOpen = false;
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

  cardCancel() {
    this.isCardPickerOpen = false;
    this.isCardOptionsOpen = false;
  }

  cardClear() {
    this.isCardPickerOpen = false;
    this.isCardOptionsOpen = false;
    this.boardService.gridRows[this.activeTile.row][this.activeTile.column] = { id: '' };
    this.calculateDamageReport();
  }

  cardConfirm(cardPicked: any) {
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

    if (activeUnit.id == 'demonhunter') {
      let demonHunters: any = this.boardService.getUnitsOnBoardById('demonhunter');
      let isEmpowered = this.getDemonHunterTiers() >= 40;
      for (let unit of demonHunters) {
        unit.demonHunterEmpowered = isEmpowered;
      }
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


  dismissedHeroOptions(event: Event) {

  }

  dismissedCardOptions(event: Event, applyToAll: boolean) {

    this.isCardOptionsOpen = false;
    if (applyToAll) {
      for (const [row, col, value] of this.boardService.iterateGrid(this.boardService.gridRows)) {
        if (this.boardService.gridRows[row][col].id == this.activeTile.id) {
          let baseTemplate = JSON.parse(JSON.stringify(this.deckConfig));
          this.boardService.gridRows[row][col] = baseTemplate;
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

  getBoardName(card: any) {
    let filename = '';
    if (card.id == 'demonhunter' && this.getDemonHunterTiers() >= 40) {
      filename = card.id + "_empowered";
    }
    else if (card.id == 'monk' && card.isIntersection[0]) {
      filename = card.id + "_empowered";
    }
    else if (card.id == 'cultists' && card.isEmpowered) {
      filename = card.id + "_empowered";
    }
    else if (card.id == 'bladedancer' && card.hasAdjacentBDs) {
      filename = card.id + "_empowered";
    }

    //tileInfo.main.isConnectedToEmpowered
    else {
      filename = card.id;
    }
    return filename;
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
      const originalSpeed = tileInfo.main.mainDpsBaseSpeed;
      const originalCrit = tileInfo.main.mainDpsBaseCrit;
      const originalDamage = tileInfo.main.mainDpsBaseDamage;

      // Calculate normal phase total damage
      const normalPhaseDPS = this.getDamageInfoGeneric(tileInfo);
      const normalPhaseLength = parseFloat(tileInfo.main.mainDpsActivationInterval);
      const normalPhaseTotal = normalPhaseDPS.total * normalPhaseLength;

      // Calculate first phase total damage
      tileInfo.main.mainDpsBaseSpeed = originalSpeed / 7;
      const firstPhaseDPS = this.getDamageInfoGeneric(tileInfo);
      const firstPhaseLength = parseFloat(tileInfo.main.mainDpsFirstPhase);
      const firstPhaseTotal = firstPhaseDPS.total * firstPhaseLength;
      tileInfo.main.mainDpsBaseSpeed = originalSpeed;

      // Calculate second phase total damage
      tileInfo.main.mainDpsBaseSpeed = originalSpeed / 7;
      tileInfo.main.mainDpsBaseCrit = 100;
      const secondPhaseDPS = this.getDamageInfoGeneric(tileInfo);
      const secondPhaseLength = parseFloat(tileInfo.main.mainDpsSecondPhase);
      let secondPhaseTotal = secondPhaseDPS.total * secondPhaseLength;
      tileInfo.main.mainDpsBaseSpeed = originalSpeed;
      tileInfo.main.mainDpsBaseCrit = originalCrit;

      // Apply talent buffs if active
      if (tileInfo.main.activeTalents.indexOf('precise_shooting') > -1 || tileInfo.main.activeTalents.indexOf('doublet') > -1) {
        let buffedDPS = secondPhaseDPS;
        // 100% speed increase
        if (tileInfo.main.activeTalents.indexOf('doublet') > -1) {
          tileInfo.main.mainDpsBaseSpeed = originalSpeed / 3.5;
          buffedDPS = this.getDamageInfoGeneric(tileInfo);
        }
        // 100% dmg increase
        if (tileInfo.main.activeTalents.indexOf('precise_shooting') > -1) {
          tileInfo.main.mainDpsBaseDamage = originalDamage * 2;
          buffedDPS = this.getDamageInfoGeneric(tileInfo);
        }
        // Calculate second phase total damage with talent buffs
        const buffedSecondPhaseTotal = buffedDPS.total * secondPhaseLength;
        secondPhaseTotal = (secondPhaseTotal * 0.66) + buffedSecondPhaseTotal;
      }
      tileInfo.main.mainDpsBaseDamage = originalDamage;

      // Calculate total damage and phase length
      const totalPhaseLengthSeconds = normalPhaseLength + firstPhaseLength + secondPhaseLength;
      const totalDamage = Math.floor((normalPhaseTotal + firstPhaseTotal + secondPhaseTotal) / totalPhaseLengthSeconds);
      const results = {
        total: totalDamage,
        normalPhaseTotal,
        firstPhaseTotal,
        secondPhaseTotal,
        totalPhaseLengthSeconds
      };
      return results;
    } else if (tileInfo.main.id == 'sentry') {
      const totalPhaseParts = Math.ceil(tileInfo.main.mainDpsDamageIncrease / 10);
      const totalPhaseLengthSeconds = totalPhaseParts * tileInfo.main.mainDpsActivationInterval;
      const originalDamage = tileInfo.main.mainDpsBaseDamage;

      let totalDps = 0;
      for (let i = 0; i < totalPhaseParts; i++) {
        let damageMultiplier = (i / 10) + 1;
        if (i == totalPhaseParts - 1) {
          damageMultiplier += ((tileInfo.main.mainDpsDamageIncrease % 10) / 100);
        }
        tileInfo.main.mainDpsBaseDamage = originalDamage * damageMultiplier;
        const dpsPhase = this.getDamageInfoGeneric(tileInfo);
        totalDps += dpsPhase.total;
      }
      tileInfo.main.mainDpsBaseDamage = originalDamage;

      const results = {
        total: Math.floor(totalDps / totalPhaseLengthSeconds),
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
        totalPhaseLengthSeconds,
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
      const damageIncreasePercent = tileInfo.main.mainDpsDamageIncreaseSteps;
      const damageInfo: any = this.getDamageInfoGeneric(tileInfo);

      const totalPhaseParts = Math.ceil(tileInfo.main.mainDpsDamageIncrease / damageIncreasePercent);
      damageInfo.totalPhaseLengthSeconds = totalPhaseParts * damageInfo.newAttackSpeed;

      let totalHitDamage = 0;
      let originalDamage = damageInfo.newAttackDamage;
      for (let i = 0; i < totalPhaseParts; i++) {
        const currentDmgIncrease = Math.min(tileInfo.main.mainDpsDamageIncrease, damageIncreasePercent * (i + 1));
        const currentDamage = Math.floor(originalDamage * (1 + (currentDmgIncrease / 100)));
        totalHitDamage += currentDamage;
        damageInfo.maxHitDamage = currentDamage;
      }

      const totalCritChance = damageInfo.totalCritChance;
      const numberOfCrits = totalCritChance * totalPhaseParts;
      damageInfo.critDmgPerSecond = Math.floor((numberOfCrits * damageInfo.criticalDamage) / damageInfo.totalPhaseLengthSeconds);
      damageInfo.dmgPerSecond = Math.floor(totalHitDamage / damageInfo.totalPhaseLengthSeconds);
      damageInfo.total = damageInfo.dmgPerSecond + damageInfo.critDmgPerSecond;

      return damageInfo;
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
      tileInfo.main.hasAdjacentBDs = adjacentBDs == 0;
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


      tileInfo.main.isEmpowered = adjacentCultists == 4;
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
      if (tileInfo.main.connections) {
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + ((tileInfo.main.mainDpsDamageIncrease * tileInfo.main.connections) / 100));
      }

      let dpsInfo = this.getDamageInfoGeneric(tileInfo);
      tileInfo.main.mainDpsBaseDamage = originalDamage;
      return dpsInfo;
    } else if (tileInfo.main.id == 'monk') {

      let originalSpeed = tileInfo.main.mainDpsBaseSpeed;
      let originalDamage = tileInfo.main.mainDpsBaseDamage;

      //is tileInfo.main.isIntersection provides an array where first value is for harmony, second is horizontal, third is vertical
      if (tileInfo.main.isIntersection) {
        if (tileInfo.main.isIntersection[0]) {
          let harmonyBuff = tileInfo.main.harmonyTiers[tileInfo.main.tier];
          tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (harmonyBuff / 100));
        }
        if (tileInfo.main.isIntersection[1]) {
          let horizontalBuff = 200;
          tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / (1 + (horizontalBuff / 100));
        }
        if (tileInfo.main.isIntersection[2]) {
          let verticalBuff = 100;
          tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / (1 + (verticalBuff / 100));
        }
      }

      if (tileInfo.main.isActivated) {
        let activatedBuff = 100;
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (activatedBuff / 100));
      }

      let dpsInfo = this.getDamageInfoGeneric(tileInfo);
      tileInfo.main.mainDpsBaseDamage = originalDamage;
      tileInfo.main.mainDpsBaseSpeed = originalSpeed;

      return dpsInfo;
    } else if (tileInfo.main.id == 'bruiser') {

      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      let originalSpeed = tileInfo.main.mainDpsBaseSpeed;

      if (tileInfo.main.enranged) {
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (tileInfo.main.mainDpsDamageIncrease / 100));
        tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / 2;
      }

      let dpsInfo = this.getDamageInfoGeneric(tileInfo);
      tileInfo.main.mainDpsBaseDamage = originalDamage;
      tileInfo.main.mainDpsBaseSpeed = originalSpeed;
      return dpsInfo;
    } else if (tileInfo.main.id == 'robot') {

      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      let originalSpeed = tileInfo.main.mainDpsBaseSpeed;
      let originalCritDamage = tileInfo.main.mainDpsBaseCritDmg;

      if (tileInfo.main.merges >= 10) {
        tileInfo.main.mainDpsBaseSpeed = tileInfo.main.mainDpsBaseSpeed / (1 + (tileInfo.main.mainDpsSpeedIncrease / 100));
      }

      if (tileInfo.main.merges >= 15) {
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (tileInfo.main.mainDpsDamageIncrease / 100));
      }

      if (tileInfo.main.merges >= 20) {
        tileInfo.main.mainDpsBaseCritDmg = this.boardConfig.playerCrit * 1.05;
      }

      console.log('tileInfo', tileInfo);
      let dpsInfo = this.getDamageInfoGeneric(tileInfo);
      tileInfo.main.mainDpsBaseDamage = originalDamage;
      tileInfo.main.mainDpsBaseSpeed = originalSpeed;
      tileInfo.main.mainDpsBaseCritDmg = originalCritDamage;
      return dpsInfo;
    } else if (tileInfo.main.id == 'generic') {

      let originalDamage = tileInfo.main.mainDpsBaseDamage;
      if (tileInfo.main.mainDpsDamageIncrease) {
        tileInfo.main.mainDpsBaseDamage = tileInfo.main.mainDpsBaseDamage * (1 + (tileInfo.main.mainDpsDamageIncrease / 100));
      }

      let dpsInfo = this.getDamageInfoGeneric(tileInfo);
      tileInfo.main.mainDpsBaseDamage = originalDamage;
      return dpsInfo;
    } else {
      return this.getDamageInfoGeneric(tileInfo);
    }
  }

  sumOfArray(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
  }

  getCardInfoByName(name: string) {
    let cardInfo;
    for (const [row, column, value] of this.boardService.iterateGrid(this.boardService.gridRows)) {
      let tmp: any = value;
      if (tmp.name == name) { cardInfo = tmp; }
    }
    return cardInfo;
  }

  getCardInfoById(name: string) {
    let cardInfo;
    for (const [row, column, value] of this.boardService.iterateGrid(this.boardService.gridRows)) {
      let tmp: any = value;
      if (tmp.id == name) { cardInfo = tmp; }
    }
    return cardInfo;
  }

  getSwordDmg(swordStacks: number) {
    let cardNames = this.boardService.getUniqueCardsOnBoard();
    let card = this.getCardInfoByName('Sword') || this.unitsService.cards['sword'];
    if (this.deckConfig.swordLevel) {
      card.level = this.deckConfig.swordLevel;
    }

    let cardBuff = ((card.damage / 10) + ((card.level - 7) * 1.5)) * swordStacks;

    if (cardNames.indexOf('knight_statue') > -1) {
      cardBuff = cardBuff / 5;
    }
    return cardBuff;
  }

  getDemonHunterTiers() {
    return this.sumOfArray(this.boardService.getUnitsOnBoardById('demonhunter').map((t: any) => t.tier));
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
    if (!card) card = this.unitsService.cards['sword'];

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

    // refactor the code so there doesn't have to be a sword on the field to apply the buff
    if (tileInfo.main.swordStacks) {
      let swordCrit = this.getSwordCrit(tileInfo.main.swordStacks);
      critBuffs.push(swordCrit);
    }

    // look for crit buffs in neighboring tiles (only ks)
    for (let neighbor of tileInfo.adjacentUnits) {
      if (neighbor.name == 'Knight Statue') {
        critBuffs.push(this.getKsCrit(neighbor));
      }
    }

    let activeHeroInfo = this.boardService.heroes[this.boardService.activeHero];
    let heroBuff = parseFloat(activeHeroInfo.passive.crit);

    if (activeHeroInfo.hasTiles && tileInfo.main.heroTile) {
      if (this.boardService.activeHero == 'gadget') {
        heroBuff = heroBuff + parseFloat(activeHeroInfo.tiles.crit);
      } else {
        heroBuff = parseFloat(activeHeroInfo.tiles.crit);
      }
    }

    if (heroBuff > 0) {
      critBuffs.push(heroBuff);
    }

    return critBuffs;
  }

  getTotalDamageBuffs(tileInfo: any) {
    const damageBuffs: any = [];

    // damage buffs from neighboring tiles
    this.getDamageBuffsFromNeighbors(tileInfo, damageBuffs);

    // damage buffs from sword stacks
    this.getDamageBuffsFromSwordStacks(tileInfo, damageBuffs);

    // global damage buffs
    this.getGlobalDamageBuffs(damageBuffs);

    // hero damage buffs
    this.getHeroDamageBuffs(tileInfo, damageBuffs);

    // weapon damage buffs
    this.getWeaponDamageBuffs(damageBuffs);

    return damageBuffs;
  }

  getDamageBuffsFromNeighbors(tileInfo: any, damageBuffs: any) {
    for (const neighbor of tileInfo.adjacentUnits) {
      if (neighbor.name === 'Witch') {
        damageBuffs.push(this.getWitchBuff());
      }
      console.log('neighbor', neighbor, neighbor.activeTalents);
      if (neighbor.name == 'Grindstone' && neighbor.activeTalents.indexOf('searing_sparks') > -1){
        let gsDamage: any = parseInt(neighbor.damage);
        let baseChance = 0.04;
        if (neighbor.talents.indexOf('hellgrinder') > -1){
          baseChance = 0.06;
        }
        //increaseing the damage buff from grindstone by 250% and then taking 4% of that damage to represent total DPS over time
        damageBuffs.push({ buff: (gsDamage * 2.5), chance: baseChance });
        //console.log('damageBuffs', gsDamage, baseChance, damageBuffs);
      }
    }
  }

  getDamageBuffsFromSwordStacks(tileInfo: any, damageBuffs: any) {
    if (tileInfo.main.swordStacks) {
      damageBuffs.push(this.getSwordDmg(tileInfo.main.swordStacks));
    }
  }

  getGlobalDamageBuffs(damageBuffs: any) {
    const uniqueCards = this.boardService.getUniqueCardsOnBoard();
    for (const card of uniqueCards) {
      if (card === 'dryad') {
        damageBuffs.push(this.getDryadBuff());
      }
    }
  }

  getHeroDamageBuffs(tileInfo: any, damageBuffs: any) {
    const activeHeroInfo = this.boardService.heroes[this.boardService.activeHero];
    let heroBuff = parseFloat(activeHeroInfo.passive.damage);

    if (activeHeroInfo.hasTiles && tileInfo.main.heroTile) {
      if (this.boardService.activeHero === 'gadget') {
        heroBuff += parseFloat(activeHeroInfo.tiles.damage);
      } else {
        heroBuff = parseFloat(activeHeroInfo.tiles.damage);
      }
    }

    if (heroBuff > 0) {
      damageBuffs.push(heroBuff);
    }
  }

  getWeaponDamageBuffs(damageBuffs: any) {
    const activeWeaponInfo = this.boardService.weapons[this.boardService.activeWeapon];
    if (activeWeaponInfo.stat === 'damage') {
      const weaponFactionBuff = this.boardService.weapons[this.boardService.activeWeapon].faction;
      damageBuffs.push(this.boardService.weapons[this.boardService.activeWeapon].alliance);
      damageBuffs.push(this.boardService.hasSetBonus ? weaponFactionBuff * 1.1 : weaponFactionBuff);
    }
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

  totalCritDmgBuffs(tileInfo: any): any[] {
    const critDmgBuffs: any[] = [];

    const activeWeaponInfo = this.boardService.weapons[this.boardService.activeWeapon];

    if (activeWeaponInfo.stat === 'crit') {
      const weaponFactionBuff = activeWeaponInfo.faction;

      critDmgBuffs.push(activeWeaponInfo.alliance);
      critDmgBuffs.push(this.boardService.hasSetBonus ? weaponFactionBuff * 1.1 : weaponFactionBuff);
    }

    return critDmgBuffs;
  }

  /**
 * Gets the total damage buffs for the given tile.
 *
 * @param {any} tileInfo - The information about the tile.
 * @return {any[]} An array of all the damage buffs for the tile.
 */
  totalSpeedBuff(tileInfo: any) {
    console.log('totalSpeedBuff', tileInfo);
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
    let activeHeroInfo = this.boardService.heroes[this.boardService.activeHero];
    let heroBuff = parseFloat(activeHeroInfo.passive.speed);

    if (activeHeroInfo.hasTiles && tileInfo.main.heroTile) {
      if (this.boardService.activeHero == 'gadget') {
        heroBuff = heroBuff + parseFloat(activeHeroInfo.tiles.speed);
      } else {
        heroBuff = parseFloat(activeHeroInfo.tiles.speed);
      }
    }

    if (heroBuff > 0) {
      speedBuffs.push(heroBuff);
    }

    let activeWeaponInfo = this.boardService.weapons[this.boardService.activeWeapon];
    if (activeWeaponInfo.stat == 'speed') {
      let weaponFactionBuff = this.boardService.weapons[this.boardService.activeWeapon].faction;
      speedBuffs.push(this.boardService.weapons[this.boardService.activeWeapon].alliance);
      speedBuffs.push(this.boardService.hasSetBonus ? weaponFactionBuff * 1.1 : weaponFactionBuff);
    }

    let activeArmorInfo = this.boardService.armor[this.boardService.activeArmor];
    if (activeArmorInfo.stat == 'speed') {
      let armorFactionDebuff = this.boardService.armor[this.boardService.activeArmor].faction;
      speedBuffs.push(this.boardService.armor[this.boardService.activeArmor].alliance * -1);
      speedBuffs.push((this.deckConfig.hasSetBonus ? armorFactionDebuff * 1.1 : armorFactionDebuff) * -1);
    }

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
        if (!witchBuffAdded) {
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
        //tempered steel - critical chance is increased by 1% for every merge rank
        if (talent == 'tempered_steel') {
          critBuff = critBuff + grindstoneUnit.tier;
        } 
        //triple overheat - when this talent is selected they increase damage they deal by 30%
        else if (talent == 'triple_overheat') {
          damageBuffs.push(30);
        }
        //unstable overheat - with each merge the damage bonus increases by 1.5%
        else if (talent == 'unstable_overheat') {
          if (!('merges' in grindstoneUnit)) grindstoneUnit.merges = 0;
          let buffPerStack = 1.5;
          let baseBuff = 10;
          damageBuffs.push(baseBuff + (buffPerStack * grindstoneUnit.merges));
        } 
        //searing sparks - 4% chance that every unit adjacent of it will shoot one shot that has 250% of it's own damage
        else if (talent == 'searing_sparks') {
          //implemented in getDamageBuffsFromNeighbors
        } 
        //fiery sparks - flat 10% damage buff to all adjacent units
        else if (talent == 'fiery_sparks') {
          //add logic to increase the 10% by 25% for every merge or "sparks" property
          if (!('sparks' in grindstoneUnit)) grindstoneUnit.sparks = 0;
          let buffPerStack = 1.25;
          let baseBuff = 10;
          if (grindstoneUnit.activeTalents.indexOf('hellgrinder') > -1) {
            baseBuff = 20;
          } 
          damageBuffs.push(baseBuff + (buffPerStack * grindstoneUnit.sparks));
        }
      }
    }
    return {
      damageBuffs,
      critBuff
    };
  }

  //provided the tileInfo for the damage dealer with a known grindstone connected
  getDamageForGrindstone({ main, row, column }: any) {
    const adjacentUnits = this.getAdjacentUnitsForTile(row, column);
    const ghostUnit = {
      main: {
        ...main,
        name: `${main.name} & Grindstone`,
        mainDpsBaseDamage: 0,
        mainDpsBaseCrit: 0,
      },
      adjacentUnits,
      row,
      column,
      dpsInfo: {},
    };

    const grindstonesConnected = adjacentUnits.filter((neighbor: any) => neighbor.id === 'grindstone');

    const combinedBuffs = grindstonesConnected.reduce((acc: any, gs: any) => {
      const gsBuffs = this.getGrindstoneBuffs(gs);
      acc.baseDamage = Math.max(acc.baseDamage, gs.damage);
      acc.critBuff = Math.max(acc.critBuff, gsBuffs.critBuff);

      const currentMax = this.sumOfArray(acc.damageBuffs);
      const newMax = Math.max(currentMax, this.sumOfArray(gsBuffs.damageBuffs));
      if (newMax > currentMax) {
        acc.damageBuffs = gsBuffs.damageBuffs;
      }

      return acc;
    }, { critBuff: 0, damageBuffs: [], baseDamage: 0 });

    ghostUnit.main.mainDpsBaseDamage = combinedBuffs.baseDamage;

    combinedBuffs.damageBuffs.forEach((buff: any) => {
      ghostUnit.main.mainDpsBaseDamage = Math.round(ghostUnit.main.mainDpsBaseDamage * (1 + (buff / 100)));
    });

    ghostUnit.main.mainDpsBaseCrit = combinedBuffs.critBuff;

    ghostUnit.dpsInfo = this.getDamageInfoForUnit(ghostUnit);

    return ghostUnit;
  }

  getDamageInfoGeneric(tileInfo: any) {
    const playerBaseCritChance = 0.05;
    const totalArmorBuffs = this.sumOfArray(this.totalArmorBuff());
    let totalCritDmgBuff = this.sumOfArray(this.totalCritDmgBuffs(tileInfo));
    const totalSpeedBuffs = this.totalSpeedBuff(tileInfo);
    const totalDamageBuffs = this.getTotalDamageBuffs(tileInfo);

    let newAttackSpeed = tileInfo.main.mainDpsBaseSpeed;
    let newAttackDamage = tileInfo.main.mainDpsBaseDamage;
    let totalCritChance = Math.min(1, playerBaseCritChance + (tileInfo.main.mainDpsBaseCrit / 100) + ((this.sumOfArray(this.getCritChanceBuffs(tileInfo))) / 100));
    if (tileInfo.main.mainDpsBaseCritDmg && tileInfo.main.mainDpsBaseCritDmg > 0) {
      totalCritDmgBuff += tileInfo.main.mainDpsBaseCritDmg;
    }

    for (const buff of totalSpeedBuffs) {
      newAttackSpeed = newAttackSpeed / (1 + (buff / 100));
    }

    for (const buff of totalDamageBuffs) {
      if (typeof buff != 'object'){
        newAttackDamage = Math.round(newAttackDamage * (1 + (buff / 100)));
      }
    }

    newAttackDamage = (newAttackDamage * (1 + (totalArmorBuffs / 100)));
    const dmgPerSecond = newAttackDamage / newAttackSpeed;
    const hitsPerSecond = 1 / newAttackSpeed;
    const critHitsPerSecond = hitsPerSecond * totalCritChance;
    const criticalDamage = Math.floor(newAttackDamage * (((this.boardConfig.playerCrit * (1 + (totalCritDmgBuff / 100))) + totalCritDmgBuff) / 100));
    const critDmgPerSecond = Math.floor(criticalDamage * critHitsPerSecond);

    return {
      total: Math.floor(dmgPerSecond + critDmgPerSecond),
      newAttackDamage,
      newAttackSpeed,
      dmgPerSecond,
      critDmgPerSecond,
      hitsPerSecond,
      critHitsPerSecond,
      criticalDamage,
      totalCritChance
    };
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

    const hasEngineers = this.boardService.getUniqueCardsOnBoard().includes('engineer');
    const connectedEngineers = hasEngineers ? this.unitsService.engineer.countConnectedNodes(this.boardService.gridRows, 'engineer') : null;

    const hasMonks = this.boardService.getUniqueCardsOnBoard().includes('monk');
    const connectedMonks = hasMonks ? this.unitsService.monk.getIntersectionsOptimized2(this.boardService.gridRows, 'monk') : null;

    for (const [row, column, value] of this.boardService.iterateGrid(this.boardService.gridRows)) {
      const cardInfo = value;
      //console.log('calculateDamageReport', cardInfo);
      if (cardInfo.type === 'dps') {
        const tileInfo: any = {
          main: cardInfo,
          row,
          column,
          adjacentUnits: this.getAdjacentUnitsForTile(row, column),
        };
        tileInfo.dpsInfo = this.getDamageInfoForUnit(tileInfo);
        //console.log('tileInfo', tileInfo);

        if (cardInfo.id === 'engineer') {
          cardInfo.connections = connectedEngineers[row][column];
        } else if (cardInfo.id === 'monk') {
          cardInfo.isIntersection = connectedMonks[row][column];
        }

        const damageDealer = {
          row,
          column,
          type: 'individual',
          dpsEntries: [tileInfo],
        };

        if (tileInfo.adjacentUnits.some((unit: any) => unit.id === 'grindstone')) {
          damageDealer.dpsEntries.push(this.getDamageForGrindstone(tileInfo));
        }

        this.damageReport.damageDealers.push(damageDealer);
      }
    }

    this.damageReport.totalDPS = this.damageReport.damageDealers.reduce((memo: any, value: any) => {
      return memo + value.dpsEntries.reduce((sum: any, dpsEntry: any) => sum + dpsEntry.dpsInfo.total, 0);
    }, 0);

    return this.damageReport;
  }

  amuletList() {
    return Object.keys(this.boardService.amulets);
  }
  heroList() {
    return Object.keys(this.boardService.heroes);
  }
  armorList() {
    return Object.keys(this.boardService.armor);
  }
  weaponList() {
    return Object.keys(this.boardService.weapons);
  }

  changeHero(itemName: any) {
    this.boardService.activeHero = itemName;
    this.activeEditItem = itemName;
  }
  changeAmulet(itemName: any) {
    this.boardService.activeAmulet = itemName;
    this.activeEditItem = itemName;
  }
  changeWeapon(itemName: any) {
    this.boardService.activeWeapon = itemName;
    this.activeEditItem = itemName;
  }
  changeArmor(itemName: any) {
    this.boardService.activeArmor = itemName;
    this.activeEditItem = itemName;
  }

  //($event, itemConfigType, activeEditItem, 'crit'
  changeItemStat(ev: any, itemType: any, itemName: any, fieldName: any) {
    this.boardService.setItemStat(itemType, itemName, fieldName, ev.target.value);
  }

}
