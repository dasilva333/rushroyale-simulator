import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlertController } from '@ionic/angular';
import { DamageComponent } from './damage/damage.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild(IonModal)
  modal!: IonModal;

  activeIndex: number = 0;

  constructor(private alertController: AlertController, private dmgComponent: DamageComponent) {
    console.log('tab3', this);
    let arrStats = this.morale.split('\n').map((line) => {
      return line.split('\t');
    });
    let objStats: any = {};
    let tiers: any = [];
    for (let stat of arrStats) {
      if (stat[0].indexOf('tier_') > -1){
        let parts = stat[0].split('_');
        parts.shift();
        tiers = parts;
        //console.log('tier marker', parts);
      } else {
        let tmp: any = stat.slice(0);
        
        let header = tmp.shift().toLowerCase().replace(/ /g, '_');
        tmp = tmp.map((t: any) => parseFloat(t));
        
        let lastValue = tmp[tmp.length-1];
        let secondToLastValue = tmp[tmp.length-2];
        let difference = lastValue - secondToLastValue;
        tmp.push(lastValue + difference);
        tmp.push(lastValue + (difference * 2));
        tmp = tmp.map((t: any) => t.toFixed(1));
        objStats[header] = { stats: tmp, tiers };
        
        //console.log('difference', lastValue - secondToLastValue);
      }
    }
    console.log('objStats', objStats);
    this.moraleStats = objStats;
  }
  levels = Array(15).fill(0).map((x, i) => i + 1);

  moraleStats: any = {};
  morale: string = `tier_5_15
Thrower	4.3	5	5.7	6.4	7.1	7.8	8.5	9.1	9.9
Hunter	3.8	4	4.2	4.4	4.6	4.8	5	5.2	5.4
Cold Mage	2.2	2.5	2.8	3.1	3.4	3.7	4	4.3	4.6
Fire Mage	2.2	2.5	2.8	3.1	3.4	3.7	4	4.3	4.6
Lightning Mage	2.2	2.5	2.8	3.1	3.4	3.7	4	4.3	4.6
Poisoner	2.2	2.5	2.8	3.1	3.4	3.7	4	4.3	4.6
Rogue	2.2	2.5	2.8	3.1	3.4	3.7	4	4.3	4.6
Bombadier	2.25	2.5	2.75	3	3.25	3.5	3.75	4	4.25
Archer	1.8	2	2.2	2.4	2.6	2.8	3	3.2	3.4
Alchemist	1.8	2	2.2	2.4	2.6	2.8	3	3.2	3.4
Banner	3	4	5	6	7	8	9	10	11
Priestess	3	3.5	4	4.5	5	5.5	6	6.5	7
Sharpshooter	2.8	3.2	3.6	4	4.4	4.8	5.2	5.6	6
Cauldron	2.5	2.8	3.1	3.4	3.7	4	4.3	4.6	4.9
Sentry	2.2	2.5	2.8	3.1	3.4	3.7	4	4.3	4.6
Zealot	2	2.2	2.4	2.6	2.8	3	3.2	3.4	3.6
Grindstone	1.6	1.8	2	2.2	2.4	2.6	2.8	3	3.2
Chemist	1.7	1.8	1.9	2	2.1	2.2	2.3	2.4	2.5
Mime	2	3	4	5	6	7	8	9	10
Portal Keeper	2	3	4	5	6	7	8	9	10
Crystalmancer	4.5	5	5.5	6	6.5	7	7.5	8	8.5
Portal Mage	2	2.4	2.8	3.2	3.6	4	4.4	4.8	5.2
Vampire	2	2.4	2.8	3.2	3.6	4	4.4	4.8	5.2
Executioner	.5	1	1.5	2	2.5	3	3.5	4	4.5
Catapult	2	2.2	2.4	2.6	2.8	3	3.2	3.4	3.6
Engineer	2	2.2	2.4	2.6	2.8	3	3.2	3.4	3.6
Plague Doctor	2	2.2	2.4	2.6	2.8	3	3.2	3.4	3.6
Pyrotechnic	2	2.2	2.4	2.6	2.8	3	3.2	3.4	3.6
Wind Archer	2	2.2	2.4	2.6	2.8	3	3.2	3.4	3.6
Thunderer	1	1.3	1.6	1.9	2.2	2.5	2.8	3.1	3.4
Reaper	1	1.2	1.4	1.6	1.8	2	2.2	2.4	2.6
tier_7_15
Demonologist	4	5	6	7	8	9	10
Dryad	3	4	5	6	7	8	9
Harlequin	3	4	5	6	7	8	9
Clock of Power	5	5.6	6.2	6.8	7.4	8	8.6
Summoner	2	3	4	5	6	7	8
Frost	3	3.5	4	4.5	5	5.5	6
Statis	2.5	3	3.5	4	4.5	5	5.5
Meteor	3	3.4	3.8	4.2	4.6	5	5.4
Trapper	1.8	2.4	3	3.6	4.2	4.8	5.4
Knight Statue	3.4	3.7	4	4.3	4.6	4.9	5.2
Shaman	2.8	3.2	3.6	4	4.4	4.8	5.2
Hex	2	2.5	3	3.5	4	4.5	5
Demon Hunter	2.8	3	3.2	3.4	3.6	3.8	4
Inquisitor	2.8	3	3.2	3.4	3.6	3.8	4
Corsair	2	2.25	2.5	2.75	3	3.25	3.5
Boreas	1.7	1.8	1.9	2	2.1	2.2	2.3`;

  formations: any = [
    [[7, 7], [3, 1]],
    [[2, 7]],
    [[3, 7]]
  ];
  
  cardLevels: any = [
    15,
    15,
    15,
    15,
    15
  ];

  getMorale(index: any) {
    let cardLevel = this.cardLevels[index];
    let cardName = this.deck[index];
    let moraleStats = this.moraleStats[cardName];
    let morale = 0;
    if (moraleStats){
      let statIndex = cardLevel = moraleStats.tiers[0];
      morale = moraleStats.stats[statIndex];
    }
    return morale;
  }

  getDamageForCardByTier(tier: any, index: any){
    let cardName = this.deck[index];
    let dmg = 1;
    /*if (cardName == 'inquisitor'){
      this.dmgComponent.getDamageForInquis(tier);
    }*/
    return dmg;
  }

  getDamagePerHit(units: any, tier: any, index: any) {
    let dmg = 1;
    let tmp = this.getDamageForCardByTier(tier, index);
    return dmg * units;
  }

  getDamageForTier(tier: any, index: any) {
    //let cardName = this.deck[index];
    let dmg = this.getDamagePerHit(1, tier, index);
    return dmg;
  }

  async addFormation(index: any) {
    const alert = await this.alertController.create({
      header: 'Please enter your info',
      buttons: ['OK'],
      inputs: [
        {
          type: 'number',
          placeholder: '# of Units',
          min: 0,
          max: 15,
        },
        {
          type: 'number',
          placeholder: 'Unit Tier',
          min: 1,
          max: 7,
        },
      ],
    });

    await alert.present();

    let event = await alert.onWillDismiss();

    console.log('event', event.data.values);
    if (!this.formations[index])
      this.formations[index] = [];

    this.formations[index].push(event.data.values);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm(cardPicked: any) {
    this.modal.dismiss(cardPicked, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      //this.message = `Hello, ${ev.detail.data}!`;
      this.deck[this.activeIndex] = ev.detail.data;
    }
    this.isModalOpen = false;
  }

  isModalOpen = false;

  setOpen(isOpen: boolean, index: number) {
    this.isModalOpen = isOpen;
    this.activeIndex = index;
  }

  cards: any = [
    'alchemist',
    'archer',
    'banner',
    'blade_dancer',
    'bombardier',
    'boreas',
    'boreas_max',
    'bruiser',
    'catapult',
    'cauldron',
    'chemist',
    'clock',
    'cold_elemental',
    'cold_mage',
    'cold_mage_max',
    'corsair',
    'crystalmancer',
    'cultists',
    'demonologist',
    'demonologist_max',
    'demon_hunter',
    'dryad',
    'earth_elemental',
    'engineer',
    'engineer_max',
    'executioner',
    'fire_mage',
    'frost',
    'frost_max',
    'gargoyle',
    'grindstone',
    'harly',
    'hex',
    'hunter',
    'hunter_max',
    'inquisitor',
    'inquisitor_max',
    'ivy',
    'knight_statue',
    'lightning_mage',
    'meteor',
    'meteor_max',
    'mime',
    'minotaur',
    'minotaur_max',
    'monk',
    'monk_max',
    'plague_doctor',
    'poisoner',
    'portal_keeper',
    'portal_mage',
    'priestess',
    'priestess_max',
    'pyrotechnic',
    'reaper',
    'reaper_max',
    'robot',
    'robot_max',
    'rogue',
    'rogue_max',
    'scrapper',
    'sentry',
    'shaman',
    'sharpshooter',
    'sharpshooter_max',
    'spirit_master',
    'spirit_master_max',
    'stasis',
    'summoner',
    'sword',
    'sword_max',
    'tesla',
    'tesla_max',
    'thunderer',
    'trapper',
    'vampire',
    'wind_archer',
    'witch',
    'witch_max',
    'witch_statue',
    'zealot',
    'zealot_max'
  ];

  getBasicCards() {
    return this.cards.filter((card: any) => card.indexOf('_max') == -1).sort();
  };

  deck: any = [
    'inquisitor',
    'knight_statue',
    'trapper',
    'dryad',
    'scrapper'
  ];

}
