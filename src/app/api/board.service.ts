import { Injectable } from '@angular/core';

import { AlertController, IonModal, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  savedBoards: {[index: string]: string} = {};
  activeSavedBoard = '0';
  gridRows: any[][] = [];
  _calculateDamageReport?: any;

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

  getSavedBoardsKeys() {
    return Object.keys(this.savedBoards);
  }

  setSavedBoard(index: string) {
    const savedBoard = localStorage.getItem(`saved_board_${index}`);
    this.activeSavedBoard = index;
    localStorage.setItem('saved_board_index', this.activeSavedBoard);
    this.gridRows = JSON.parse(savedBoard!) ?? [];
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
