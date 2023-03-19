import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  buildVersion: any = 112;
  decks = [
    {
      cards: [
        { name: 'scrapper', level: 9, tier: 1 },
        { name: 'harly', level: 9, tier: 1 },
        { name: 'knight_statue', level: 10, tier: 7 },
        { name: 'dryad_rage', level: 9, tier: 7, merges: 10 }
      ],
      hero: 'gadget',
      amulet: 'magic',
      weapon: 'bow',
      armor: 'jacket',
      talent: 'none',
      absorbs: 0,
      mainDpsUnit: 'Inquisitor',
      inquisTierLevel: 7,
      inquisCardLevel: 13,
      hasSetBonus: true,
      playerCrit: 2800,
      enchantments: ['gust', 'wrath', 'battlethrill']
    },
    {
      cards: [
        { name: 'grindstone', mode: 'st', level: 9, tier: 1 },
        { name: 'dryad_rage', level: 9, tier: 1, merges: 10 },
        { name: 'knight_statue', level: 11, tier: 7 },
        { name: 'trapper', level: 9, tier: 7 }
      ],
      hero: 'gadget',
      amulet: 'magic',
      weapon: 'bow',
      armor: 'jacket',
      talent: 'none',
      absorbs: 15,
      mainDpsUnit: 'Generic',
      mainDpsBaseDamage: 598,
      mainDpsBaseSpeed: 0.6,
      mainDpsBaseCrit: 0,
      hasSetBonus: true,
      playerCrit: 2800,
      enchantments: ['battlethrill2', 'wrath2']
    }/*,
    {
      cards: [
        { name: 'scrapper', level: 9, tier: 1 },
        { name: 'knight_statue', level: 9, tier: 7 },
        { name: 'witch_statue', level: 14, tier: 7, merges: 29 },
        { name: 'trapper', level: 9, tier: 7 }
      ],
      hero: 'gadget',
      amulet: 'magic',
      weapon: 'spear',
      inquisTierLevel: 7,
      hasSetBonus: true
    },
    */
  ];
  
  constructor(private toastController: ToastController) {
    console.log('tab1', this);
    let savedDecks: any = localStorage.getItem('decks');
    let savedDecksVersion: any = localStorage.getItem('decks_version');
    if (savedDecksVersion >= this.buildVersion){
      if (savedDecks){
        this.decks = JSON.parse(savedDecks);
      }
    }
  }

  isManagementOpen: boolean = false;
  importedDeckText: string = '';

  onWillDismiss(ev: any){
    this.isManagementOpen = false;
  }
  cancel(){
    this.isManagementOpen = false;
  }
  openManagement(){
    this.isManagementOpen = true;
  }
  exportDeck(deckIndex: number) {
    let deckText = JSON.stringify(this.decks[deckIndex], null, 4);
    this.dyanmicDownloadByHtmlTag({
      fileName: `deck_export_${ (new Date()).toISOString() }`,
      text: deckText
    });
  }
  importDeck(deckIndex: number) {
    if (this.importedDeckText != ''){
      this.decks[deckIndex] = JSON.parse(this.importedDeckText);
      this.isManagementOpen = false;
    }
  }
  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement
    }
  }
  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  async cloneDeck(sourceDeck: number, targetDeck: number) {
    let sourceDeckObj = JSON.parse(JSON.stringify(this.decks[sourceDeck]));
    this.decks[targetDeck] = sourceDeckObj;
    
    const toast = await this.toastController.create({
      message: `Copied Deck ${sourceDeck + 1} to ${ targetDeck + 1 }`,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  async saveInfo() {
    localStorage.setItem('decks_version', this.buildVersion);
    localStorage.setItem('decks', JSON.stringify(this.decks));

    const toast = await this.toastController.create({
      message: 'Configuration Saved',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
    //localStorage.setItem('playerCrit', JSON.stringify(this.playerCrit));
  }

  
}
