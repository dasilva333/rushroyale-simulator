import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  buildVersion: any = 105;
  decks = [
    {
      cards: [
        { name: 'scrapper', level: 9, tier: 1 },
        { name: 'dryad_rage', level: 9, tier: 1 },
        { name: 'knight_statue', level: 10, tier: 7 },
        { name: 'harly', level: 9, tier: 7 }
      ],
      hero: 'gadget',
      amulet: 'magic',
      weapon: 'bow',
      talent: 'none',
      absorbs: 0,
      inquisTierLevel: 7,
      inquisCardLevel: 13,
      hasSetBonus: true,
      playerCrit: 2800
    },
    {
      cards: [
        { name: 'scrapper', level: 9, tier: 1 },
        { name: 'dryad_rage', level: 9, tier: 1 },
        { name: 'knight_statue', level: 11, tier: 7 },
        { name: 'trapper', level: 9, tier: 7 }
      ],
      hero: 'gadget',
      amulet: 'magic',
      weapon: 'bow',
      talent: 'none',
      absorbs: 15,
      inquisTierLevel: 7,
      inquisCardLevel: 13,
      hasSetBonus: true,
      playerCrit: 2800
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
