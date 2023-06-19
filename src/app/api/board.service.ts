import { Injectable } from '@angular/core';

import { AlertController, IonModal, ToastController } from '@ionic/angular';
interface IBoardService {
  heroes: { [key: string]: any };
  amulets: { [key: string]: any };
  weapons: { [key: string]: any };
  armor: { [key: string]: any };
}
@Injectable({
  providedIn: 'root'
})
export class BoardService {

  savedBoards: { [index: string]: string } = {};
  activeSavedBoard = '0';
  gridRows: any[][] = [];
  _calculateDamageReport?: any;
  hasSetBonus = false;

  amulets: any = {
    magic: { alliance: 21, faction: 20, stat: 'damage', name: 'Magic' },
    growth: { alliance: 21, faction: 20, stat: 'damage', name: 'Growth' },
    weakness: { alliance: 0, faction: 0, stat: 'none', name: 'Weakness' }
  };

  weapons: any = {
    spear: { alliance: 25, faction: 24, stat: 'speed' },
    staff: { alliance: 25, faction: 24, stat: 'none' },
    bow: { alliance: 15, faction: 15, stat: 'crit' },
    sword: { alliance: 25, faction: 24, stat: 'damage' },
  };

  armor: any = {
    robes: { alliance: 0, faction: 0, stat: 'none' },
    jacket: { alliance: 7.5, faction: 7.5, stat: 'speed' },
    chainmail: { alliance: 0, faction: 0, stat: 'damage' },
    knights_armor: { alliance: 0, faction: 0, stat: 'crit' }
  };

  heroes: any = {
    bestie: {
      hasTiles: true,
      tiles: { damage: 55, speed: 0, crit: 0 },
      passive: { damage: 0, speed: 0, crit: 0 }
    },
    gadget: {
      hasTiles: true,
      tiles: { damage: 15, speed: 10, crit: 2 },
      passive: { damage: 22, speed: 20, crit: 3 }
    },
    jay: {
      hasTiles: true,
      tiles: { damage: 0, speed: 33, crit: 0 },
      passive: { damage: 0, speed: 0, crit: 0 }
    },
    mermaid: {
      hasTiles: true,
      tiles: { damage: 50, speed: 0, crit: 7.5 },
      passive: { damage: 0, speed: 0, crit: 0 }
    },
    snowflake: {
      hasTiles: false,
      tiles: { damage: 0, speed: 0, crit: 0 },
      passive: { damage: 50, speed: 0, crit: 0 }
    },
    trainer: {
      hasTiles: false,
      tiles: { damage: 0, speed: 0, crit: 0 },
      passive: { damage: 8, speed: 0, crit: 0 }
    },
    trickster: {
      hasTiles: false,
      tiles: { damage: 0, speed: 0, crit: 0 },
      passive: { damage: 40, speed: 0, crit: 0 }
    },
    zeus: {
      hasTiles: true,
      tiles: { damage: 10, speed: 15, crit: 6 },
      passive: { damage: 0, speed: 0, crit: 0 }
    },
  };

  constructor(private toastController: ToastController,
    private alertController: AlertController) { }

  init(calculateDamageReport: any) {
    this._calculateDamageReport = calculateDamageReport;

    this.resetBoard();

    let savedBoards: any = localStorage.getItem('saved_boards');
    if (savedBoards) {
      this.savedBoards = JSON.parse(savedBoards);
      if (this.getSavedBoardsKeys().length) {
        let boardIndex: any = localStorage.getItem('saved_board_index');
        if (boardIndex) {
          this.activeSavedBoard = boardIndex;
          this.setSavedBoard(boardIndex);
        }
      }
    }
  }

  getActiveItem(itemType: keyof IBoardService, _defaultValue: string) {
    let keyNames = Object.keys(this[itemType]);
    return keyNames.reduce((memo: any, itemName: any) => {
      let item = this[itemType][itemName];
      if (item.active) {
        memo = itemName;
      }
      return memo;
    }, keyNames[0]);
  }

  setActiveItem(itemType: keyof IBoardService, activeID: any) {
    let itemNames = Object.keys(this[itemType]);
    for (let itemName of itemNames) {
      this[itemType][itemName].active = itemName == activeID;
    }
  }

  getItemStat(itemType: keyof IBoardService, activeID: string, stat: any) {
    let activeItem = this[itemType][activeID];
    if (itemType == 'heroes') {
      //console.log('getItemStat', activeItem, arguments);
      return this[itemType][activeID][activeItem.hasTiles == true ? 'tiles' : 'passive'][stat];
    } else {
      return this[itemType][activeID][stat];
    }
  }

  setItemStat(itemType: keyof IBoardService, activeID: string, stat: any, newValue: any) {
    let activeItem = this[itemType][activeID];
    if (itemType == 'heroes') {
      return this[itemType][activeID][activeItem.hasTiles == true ? 'tiles' : 'passive'][stat] = newValue;
    } else {
      return this[itemType][activeID][stat] = newValue;
    }
  }

  get activeHero() {
    return this.getActiveItem('heroes', 'trainer');
  }
  set activeHero(activeHero) {
    this.setActiveItem('heroes', activeHero);
  }
  get activeArmor() {
    return this.getActiveItem('armor', 'robes');
  }
  set activeArmor(activeHero) {
    this.setActiveItem('armor', activeHero);
  }
  get activeWeapon() {
    return this.getActiveItem('weapons', 'spear');
  }
  set activeWeapon(activeHero) {
    this.setActiveItem('weapons', activeHero);
  }
  get activeAmulet() {
    return this.getActiveItem('amulets', 'growth');
  }
  set activeAmulet(activeHero) {
    this.setActiveItem('amulets', activeHero);
  }


  getSavedBoardsKeys() {
    return Object.keys(this.savedBoards);
  }

  setSavedBoard(index: string) {
    this.activeSavedBoard = index;
    localStorage.setItem('saved_board_index', this.activeSavedBoard);

    const savedBoard = localStorage.getItem(`saved_board_${index}`);
    this.gridRows = JSON.parse(savedBoard!) ?? [];

    const savedHeroes = localStorage.getItem(`saved_heroes_${index}`);
    this.heroes = JSON.parse(savedHeroes!) ?? this.heroes;
    
    const savedWeapons = localStorage.getItem(`saved_weapons_${index}`);
    this.weapons = JSON.parse(savedWeapons!) ?? this.weapons;
    
    const savedArmor = localStorage.getItem(`saved_armor_${index}`);
    this.armor = JSON.parse(savedArmor!) ?? this.armor;
    
    const savedAmulets = localStorage.getItem(`saved_amulets_${index}`);
    this.amulets = JSON.parse(savedAmulets!) ?? this.amulets;

    this._calculateDamageReport?.();
  }


  changeSavedBoard(event: any) {
    this.setSavedBoard(event.target.value);
    //console.log('saved board', event.target.value);
  }

  async deleteSavedBoard(index: any) {
    delete this.savedBoards[index];
    localStorage.removeItem(`saved_boards_${index}`);
    localStorage.setItem('saved_boards', JSON.stringify(this.savedBoards));

    if (this.getSavedBoardsKeys().length > 0) {
      this.setSavedBoard('0');
    }

    const toast = await this.toastController.create({
      message: 'Board Config Deleted',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  async updateSavedBoard(boardIndex: any) {
    localStorage.setItem('saved_board_index', boardIndex.toString());
    localStorage.setItem('saved_board_' + boardIndex, JSON.stringify(this.gridRows));
    localStorage.setItem('saved_heroes_' + boardIndex, JSON.stringify(this.heroes));
    localStorage.setItem('saved_weapons_' + boardIndex, JSON.stringify(this.weapons));
    localStorage.setItem('saved_amulets_' + boardIndex, JSON.stringify(this.amulets));
    localStorage.setItem('saved_armor_' + boardIndex, JSON.stringify(this.armor));

    const toast = await this.toastController.create({
      message: 'Board Config Updated',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  async saveInfo() {
    const alert = await this.alertController.create({
      header: 'Save Board',
      subHeader: 'Give your board a name',
      //message: 'This is an alert!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          role: 'confirm'
        }
      ],
      inputs: [
        {
          placeholder: 'Name',
        },
      ]
    });

    await alert.present();

    let event = await alert.onWillDismiss();
    //console.log('event', event);
    if (event.role == 'confirm') {
      let deckName = event.data.values[0];
      //console.log('deckName', deckName);


      let boardIndex = this.getSavedBoardsKeys().length;
      this.savedBoards[boardIndex] = deckName;
      this.activeSavedBoard = boardIndex.toString();

      this.updateSavedBoard(boardIndex);
      localStorage.setItem('saved_boards', JSON.stringify(this.savedBoards));

      const toast = await this.toastController.create({
        message: 'Board Config Saved',
        duration: 1500,
        position: 'top'
      });

      await toast.present();
    }
  }

  resetBoard(): void {

    const getCardTemplate = () => ({ id: '' });
    this.gridRows = Array.from({ length: 3 }, () =>
      Array.from({ length: 5 }, () => ({ ...getCardTemplate() }))
    );
    //console.log('gridRows', this.gridRows);
    this._calculateDamageReport?.();
  }

  *iterateGrid<T>(grid: T[][]): Generator<[number, number, T]> {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        yield [row, col, grid[row][col]];
      }
    }
  }

  getUniqueCardsOnBoard() {
    let uniqueCards = [];
    if (this.gridRows.length > 0) {
      for (const [row, column, value] of this.iterateGrid(this.gridRows)) {
        let tmp: any = value;
        let cardId = tmp.id;
        if (uniqueCards.indexOf(cardId) == -1 && cardId != '') {
          uniqueCards.push(cardId);
        }
      }
    }
    return uniqueCards;
  }

  getUnitsOnBoardById(searchCardId: any) {
    const units: any = [];
    for (const [row, column, unit] of this.iterateGrid(this.gridRows)) {
      if (unit && unit.id === searchCardId) {
        units.push(unit);
      }
    };
    return units;
  }

}
