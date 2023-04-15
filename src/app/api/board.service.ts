import { Injectable } from '@angular/core';

import { AlertController, IonModal, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  savedBoards: any = {};
  activeSavedBoard: any = 0;
  gridRows: any = [
  ];
  _calculateDamageReport: any; //ref

  constructor(private toastController: ToastController, 
    private alertController: AlertController) { }

  init(calculateDamageReport: any) {
    this._calculateDamageReport = calculateDamageReport;
    
    this.resetBoard();

    let savedBoards: any = localStorage.getItem('saved_boards');
    if (savedBoards) {
      this.savedBoards = JSON.parse(savedBoards);
      if (this.getSavedBoardsKeys().length){
        let boardIndex: any = localStorage.getItem('saved_board_index');
        if (boardIndex){
          this.activeSavedBoard = boardIndex;
          this.setSavedBoard(boardIndex);
        }
      }
    }
  }

  getSavedBoardsKeys() {
    return Object.keys(this.savedBoards);
  }

  setSavedBoard(index: any) {
    let savedBoard: any = localStorage.getItem(`saved_board_${index}`);
    this.activeSavedBoard = index.toString();
    localStorage.setItem('saved_board_index', index.toString());
    this.gridRows.splice(0);
    this.gridRows = [...JSON.parse(savedBoard)];
    this._calculateDamageReport();
  }

  changeSavedBoard(event: any) {
    this.setSavedBoard(event.target.value);
    //console.log('saved board', event.target.value);
  }

  async deleteSavedBoard(index: any) {
    delete this.savedBoards[index];
    localStorage.removeItem(`saved_boards_${index}`);
    localStorage.setItem('saved_boards', JSON.stringify(this.savedBoards));
    
    if (this.getSavedBoardsKeys().length > 0){
      this.setSavedBoard(0);
    } 

    const toast = await this.toastController.create({
      message: 'Board Config Deleted',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  async updateSavedBoard(boardIndex: any){
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
    if (event.role == 'confirm'){
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

  resetBoard() {
    let cardTemplate = JSON.stringify({ id: '' });
    for (let row = 0; row < 3; row++) {
      this.gridRows[row] = [];
      for (let column = 0; column < 5; column++) {
        this.gridRows[row][column] = JSON.parse(cardTemplate);
      }
    }
    console.log('gridRows', this.gridRows);
    this._calculateDamageReport();
  }

  getUniqueCardsOnBoard() {
    let uniqueCards = [];
    if (this.gridRows.length > 0){
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 5; column++) {
          let cardId = this.gridRows[row][column].id;
          if (uniqueCards.indexOf(cardId) == -1 && cardId != '') {
            uniqueCards.push(cardId);
          }
        }
      }
    }
    return uniqueCards;
  }

  getUnitsOnBoardById(searchCardId: any) {
    let unitsOnBoard = [];
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        let cardId = this.gridRows[row][column].id;
        if (searchCardId == cardId) {
          unitsOnBoard.push(cardId);
        }
      }
    }
    return unitsOnBoard;
  }

}
