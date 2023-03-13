import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ToastController } from '@ionic/angular';


type Card = {
   name: string,
   level: number,
   tier: number,
   merges: number
}
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
@ViewChild(IonModal)
modal!: IonModal;

name?: string;

deckConfig: any = {
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
};

  deck: any = [];
  activeWeaponStat = 'speed';
  weaponBuff = 0;
  mainDpsBaseDamage = 159;
  buildVersion: string = '100';

  constructor(private toastController: ToastController) {
    let deckConfig: any = localStorage.getItem('dmg_sim');
    let savedDecksVersion: any = localStorage.getItem('dmg_sim_version');
    //console.log('deckConfig', deckConfig, savedDecksVersion);
    if (savedDecksVersion >= this.buildVersion){
      if (deckConfig){
        this.deckConfig = JSON.parse(deckConfig);
      }
    }
  }


  ngOnInit() {
    this.deck = this.deckConfig.cards;
    if (this.deckConfig.amuletStats){
      this.amulets = this.deckConfig.amuletStats;
    }
    if (this.deckConfig.weaponStats){
      this.weapons = this.deckConfig.weaponStats;
    }
    if (this.deckConfig.heroStats){
      this.heroes = this.deckConfig.heroStats;
    }
    console.log('deck-calc', this, this.deckConfig);
  }

  changeBaseDps(ev: any) {
    this.mainDpsBaseDamage = parseInt(ev.target.value);
  }

  changeBaseSpeed(ev: any){
    this.mainDpsBaseSpeed = parseFloat(ev.target.value) || 0;
  }

  getMainDpsBaseDamage() {
    return this.mainDpsBaseDamage;
  }

  changeGadgetBuff(event: any, type: any) {
    this.heroes[this.deckConfig.hero][type] = parseFloat(event.target.value);
  }

  changeSetBonus(event: any) {
    this.deckConfig.hasSetBonus = event.target.checked;
  }
  
  setCards(cards: any) {
    this.deck = cards;
  }

  activeIndex: number = 0;
  isModalOpen = false;

  setCardByImage(isOpen: boolean, index: number) {
    this.isModalOpen = isOpen;
    this.activeIndex = index;
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
      this.deck[this.activeIndex].name = ev.detail.data;
      if (this.deck[this.activeIndex].name == 'witch_statue'){
        this.deck[this.activeIndex].merges = 30;
      }
    }
    this.isModalOpen = false;
  }

  getBasicCards(){
    return Object.keys(this.cards);
  }

  playerBaseCrit = 0.05;

  mainDpsBaseSpeed = 0.6;
  ksTierLevel = "7";
  tiers = [
    1, 2, 3, 4, 5, 6, 7
  ];
  levels = [
    7, 8, 9, 10, 11, 12, 13, 14, 15
  ];

  talents: any = {
    none: { damage: 0, critChance: 0, critDamage: 0 },
    unity: { damage: 615, critChance: 8, critDamage: 35 },
    ronin: { damage: 900, critChance: 0, critDamage: 0 },
  };
  amulets: any = {
    magic: { damage: 29, speed: 0, crit: 0, stat: 'damage' },
    weakness: { damage: 0, speed: 0, crit: 0, stat: 'damage' }
  };

  weapons: any = {
    spear: { damage: 0, speed: 39, crit: 0, stat: 'speed' },
    staff: { damage: 0, speed: 0, crit: 0, stat: 'speed' },
    bow: { damage: 0, speed: 0, crit: 756, stat: 'crit' },
    sword: { damage: 50, speed: 0, crit: 0, stat: 'damage' },
  };

  heroes: any = {
    trainer: { damage: 8, speed: 0, crit: 0, stat: 'damage' },
    gadget: { damage: 22, speed: 20, crit: 3, stat: 'damage', isGold: false },
    jay: { damage: 0, speed: 33, crit: 0, stat: 'speed' },
    trickster: { damage: 40, speed: 0, crit: 0, stat: 'damage' },
    snowflake: { damage: 50, speed: 0, crit: 0, stat: 'damage' },
    zeus: { damage: 10, speed: 15, crit: 6, stat: 'damage' },
    bestie: { damage: 55, speed: 0, crit: 0, stat: 'damage' },
    mermaid: { damage: 50, speed: 0, crit: 7.5, stat: 'crit' },
    none: { damage: 0, speed: 0, crit: 0, stat: 'damage' }
  };

  witchMerges: any = Array(30).fill(0).map((x,i)=>i+1);

  heroList() {
    return Object.keys(this.heroes);
  }
  amuletList() {
    return Object.keys(this.amulets);
  }
  weaponList() {
    return Object.keys(this.weapons);
  }

  cards: any = {
    'banner': { damage: 0, speed: 116, crit: 0 },
    'dryad_rage': { damage: 50, speed: 0, crit: 0, type: 'unit' },
    'dryad_growth': { damage: 0, speed: 0, crit: 0 },
    'harly': { damage: 0, speed: 0, crit: 0 },
    'sword': { damage: 200, speed: 0, crit: 5, type: 'unit' },
    'trapper': {
      damage: 0, speed: 0, crit: 0, type: 'armor', dmgLevels: [
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
    'chemist': { damage: 103, speed: 0, crit: 0, type: 'armor' },
    'scrapper': { damage: 0, speed: 0, crit: 0, type: 'armor' },
    'knight_statue': { damage: 0, speed: 0, crit: 0, critTiers: [5, 7.5, 10, 12.5, 15, 17.5, 20] },
    'witch_statue': { damage: 204, speed: 0, crit: 0, type: 'unit', merges: 15 },
    'grindstone': { damage: 93, speed: 0, crit: 0, type: 'flat' },
  }

  /* ks_speeds
  lvl7
  10+1
  10+10
  10+20
  10+30
  
  lvl8
  10+1
  10+12
  10+23
  10+34
  
  lvl9
  10+2
  10+14
  10+26
  10+38
  */

  changePlayerCrit(ev: any) {
    this.deckConfig.playerCrit = parseInt(ev.target.value);
  }
  changeHero(ev: any) {
    this.deckConfig.hero = ev.target.value;
  }
  changeAmulet(ev: any) {
    this.deckConfig.amulet = ev.target.value;
  }
  changeWeapon(ev: any) {
    this.deckConfig.weapon = ev.target.value;
    //add support for more weapons later
    let statName = this.deckConfig.weapon == 'spear' ? 'speed' : 'damage';
    this.weaponBuff = this.weapons[this.deckConfig.weapon][statName];
  }
  changeWeaponStat(ev: any){
    this.weapons[this.deckConfig.weapon][this.weapons[this.deckConfig.weapon].stat] = parseFloat(ev.target.value); 
    this.deckConfig.weaponStats = this.weapons;
  }
  changeAmuletStat(ev: any){
    this.amulets[this.deckConfig.amulet][this.amulets[this.deckConfig.amulet].stat] = parseFloat(ev.target.value); 
    this.deckConfig.amuletStats = this.amulets;
  }
  changeHeroStat(ev: any) {
    this.heroes[this.deckConfig.hero][this.heroes[this.deckConfig.hero].stat] = parseFloat(ev.target.value); 
    this.deckConfig.heroStats = this.heroes;
  }
  changeGoldTile(ev: any){
    this.heroes[this.deckConfig.hero].isGold = ev.target.checked;
  }
  changeTalentStat(ev: any, type: any) {
    this.talents[this.deckConfig.talent][type] = parseFloat(ev.target.value);
  }

  changeCard(ev: any, card: Card, index: number){
    this.deck[index].name = ev.target.value;
    if (this.deck[index].name == 'witch_statue'){
      this.deck[index].merges = 30;
    }
  }
  changeInquisTier(ev: any) {
    this.deckConfig.inquisTierLevel = parseInt(ev.target.value);
  }
  changeInquisCard(ev: any) {
      this.deckConfig.inquisCardLevel = parseInt(ev.target.value);
  }
  changeCardLevel(ev: any, card: Card) {
    card.level = ev.target.value;
  }
  changeTierLevel(ev: any, card: Card) {
    card.tier = ev.target.value;
  }
  changeWitchMerges(ev: any, card: Card) {
    card.merges = ev.target.value;
  }
  changeTalent(ev: any){
    this.deckConfig.talent = ev.target.value;
  }
  getActiveTalentStat(type: any) {
    if (this.deckConfig.talent){
      return this.talents[this.deckConfig.talent][type];
    } else {
      return 0;
    }
  }

  getCardName(card: Card){
    if (card.level < 15){
      return card.name;
    } else {
      let specialIcons = ['witch_statue'];
      if (specialIcons.indexOf(card.name) > -1){
        return `${card.name}_max`;
      } else {
        return card.name;
      }
    }
  }

  totalArmorBuff() {
    let dmgBuff = 0;
    let cardNames = [];
    for (let card of this.deck) {
      cardNames.push(card.name);
    }
    for (let card of this.deck) {
      let cardInfo = this.cards[card.name];
      if (cardInfo.type && cardInfo.type == 'armor'){
        let cardBuff = cardInfo.damage;
        if (card.name == 'trapper') {
          cardBuff = cardInfo.dmgLevels[card.level - 7];
        }
        dmgBuff = dmgBuff + cardBuff; 
      }
    }
    if (this.deckConfig.hero == 'snowflake'){
      dmgBuff = dmgBuff + this.heroes.snowflake.damage;
    }
    return dmgBuff;
  }

  totalDmgBuff() {
    let dmgBuff = 0;
    let cardNames = [];
    for (let card of this.deck) {
      cardNames.push(card.name);
    }
    for (let card of this.deck) {
      let cardInfo = this.cards[card.name];
      if (cardInfo.type && cardInfo.type == 'unit'){
        let cardBuff = cardInfo.damage;
        if (card.name == 'sword' && cardNames.indexOf('knight_statue') > -1){
          cardBuff = cardBuff / 5;
        }
        if (card.name == 'witch_statue'){
          cardBuff = this.getWitchBuff(card);
        }
        dmgBuff = dmgBuff + cardBuff; 
      }
    }
    
    //heroes
    let activeHeroInfo = this.heroes[this.deckConfig.hero]; 
    let heroBuff = activeHeroInfo.damage;
    if (this.deckConfig.hero == 'gadget' && activeHeroInfo.isGold){
      heroBuff = heroBuff * 2;
    }
    dmgBuff = dmgBuff + heroBuff;
    //amulet
    dmgBuff = dmgBuff + this.amulets[this.deckConfig.amulet].damage;
    if (this.deckConfig.hasSetBonus){
      dmgBuff = dmgBuff * 1.1;
    }
    //weapon
    dmgBuff = dmgBuff + this.weapons[this.deckConfig.weapon].damage;
    if (this.deckConfig.hasSetBonus){
      dmgBuff = dmgBuff * 1.1;
    }

    if (this.deckConfig.talent == 'unity' || this.deckConfig.talent == 'ronin'){
      dmgBuff = dmgBuff + this.talents[this.deckConfig.talent].damage;
    }

    return Math.floor(dmgBuff);
  }

  totalCritDmgBuff() {
    let critDmgBuff = 0;
    if (this.deckConfig.weapon == 'bow'){
      critDmgBuff = critDmgBuff + this.weapons[this.deckConfig.weapon].crit;
    }
    if (this.deckConfig.talent == 'unity'){
      critDmgBuff = critDmgBuff + this.talents[this.deckConfig.talent].critDamage;
    }
    return critDmgBuff;
  }

  totalCritBuff() {
    let critBuff = 0;
    let cardNames = [];
    for (let card of this.deck) {
      cardNames.push(card.name);
    }
    for (let card of this.deck) {
      let cardInfo = this.cards[card.name];
      let cardBuff = cardInfo.crit;
      if (card.name == 'knight_statue') {
        cardBuff = cardInfo.critTiers[card.tier - 1];
      }
      if (card.name == 'sword' && cardNames.indexOf('knight_statue') > -1){
        cardBuff = cardBuff / 5;
      }
      critBuff = critBuff + cardBuff;
    }

    //heroes
    //critBuff = critBuff + this.heroes[this.deckConfig.hero].crit;
    let activeHeroInfo = this.heroes[this.deckConfig.hero]; 
    let heroBuff = activeHeroInfo.crit;
    if (this.deckConfig.hero == 'gadget' && activeHeroInfo.isGold){
      heroBuff = heroBuff * 2;
    }
    critBuff = critBuff + heroBuff;

    //amulet
    critBuff = critBuff + this.amulets[this.deckConfig.amulet].crit;
    //weapon if it's bow it's calculated elsewhere
    if (this.deckConfig.weapon != 'bow'){
      critBuff = critBuff + this.weapons[this.deckConfig.weapon].crit;
    }
    
    if (this.deckConfig.talent == 'unity'){
      critBuff = critBuff + this.talents[this.deckConfig.talent].critChance;
    }

    return critBuff;
  }

  getUnitType(card: Card) {
    let cardInfo = this.cards[card.name];
    return cardInfo.type;
  }

  getSwordDmg(card: Card) {
    let cardNames = [];
    for (let card of this.deck) {
      cardNames.push(card.name);
    }

    let cardInfo = this.cards[card.name];
    //7 = 30 - 3
    //8 = 30 - 1.5
    //9 = 30 
    //10 = 30 + 1.5
    //11 = 30 + 3
    //12 = 30 + 4.5
    let cardBuff = ((cardInfo.damage / 10) + ((card.level - 7) * 1.5)) * 10;
    //console.log('cardBuff', cardBuff);
    if (card.name == 'sword' && cardNames.indexOf('knight_statue') > -1){
      cardBuff = cardBuff / 5;
    }
    return cardBuff;
  }

  getSwordCrit(card: Card) {
    let cardNames = [];
    for (let card of this.deck) {
      cardNames.push(card.name);
    }
    let cardInfo = this.cards[card.name];
    let cardBuff = cardInfo.crit;
    //console.log('getSwordCrit', card, cardBuff);
    if (card.name == 'sword' && cardNames.indexOf('knight_statue') > -1){
      cardBuff = cardBuff / 5;
    }
    return cardBuff;
  }

  getSpeedBuff(card: Card) {
    let speedBuff = 0;
    if (card.name == 'banner'){
      speedBuff = this.getBannerBuff(card);
    } else if (card.name == 'knight_statue'){
      speedBuff = this.getKsSpeed(card);
    } 
    return speedBuff;
  }

  getCritBuff(card: Card) {
    let critBuff = 0;
    if (card.name == 'sword'){
      critBuff = this.getSwordCrit(card);
    } else if (card.name == 'knight_statue'){
      critBuff = this.getKsCrit(card);
    } 
    return critBuff;
  }

  getDmgBuff(card: Card) {
    let dmfBuff = 0;
    if (card.name == 'dryad_rage'){
      dmfBuff = this.getDryadBuff(card);
    } else if (card.name == 'witch_statue'){
      dmfBuff = this.getWitchBuff(card);
    } else if (card.name == 'chemist'){
      dmfBuff = this.getChemistBuff(card);
    } else if (card.name == 'trapper'){
      dmfBuff = this.getTrapperBuff(card);
    } else if (card.name == 'sword'){
      dmfBuff = this.getSwordDmg(card);
    } else if (card.name == 'grindstone'){
      dmfBuff = this.getGrindstoneDmg(card);
    }
    return dmfBuff;
  }

  async saveInfo() {
    localStorage.setItem('dmg_sim_version', this.buildVersion);
    localStorage.setItem('dmg_sim', JSON.stringify(this.deckConfig));
    
    const toast = await this.toastController.create({
      message: 'Configuration Saved',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
    //localStorage.setItem('playerCrit', JSON.stringify(this.playerCrit));
  }

  getGrindstoneDmg(card: Card){
    //=C21+(C22*(C24-1))+(floor(C21 * ((B28-1)*0.5)))
    let baseDamage = 415;
    let bonusDamage = 50;
    let cardMana = 5;
    let totalDamage = baseDamage + (bonusDamage * (cardMana - 1))+(Math.floor(baseDamage * ((card.tier-1)*0.5)));
    return totalDamage;
  }

  dmgWithGrindstone() {
    let grindstoneBuff = 0;
    let witchBuff = 0;
    for (let card of this.deck) {
      if (card.name == 'grindstone') {
        grindstoneBuff = this.getGrindstoneDmg(card);
      }
      if (card.name == 'witch_statue') {
        witchBuff = this.getWitchBuff(card);
      }
    }
    //console.log('witchBuff', witchBuff);
    if (witchBuff > 0){
      grindstoneBuff = grindstoneBuff * ((witchBuff / 100) + 1);
    }
    return grindstoneBuff;
  }

  getDryadBuff(card: Card) {
    let merges = 20;
    let buffPerMerge = 2.5;
    return merges * buffPerMerge;
  }

  getBannerBuff(card: Card) {
    let currentCardLevel = card.level;  
    let minCardLevel = this.levels[0];
    let baseAttackSpeed = 12;
    let tierMultiplier = 0.5;
    let newAttackSpeed = (baseAttackSpeed+((currentCardLevel-minCardLevel)* tierMultiplier))*card.tier;
    return newAttackSpeed;
  }

  getWitchBuff(card: Card) {
    let merges = card.merges;
    let divider = 10;
    let baseBuff = 38;
    let baseBonus = 10;
    let bonusAddon = 4;
    let cardBonus = card.level - 9;
    let dmgIncrease = baseBuff + (baseBonus + (bonusAddon * cardBonus));
    return (dmgIncrease / divider) * merges;
  }

  getChemistBuff(card: Card) {
    let cardInfo = this.cards[card.name];
    return cardInfo.damage;
  }

  getTrapperBuff(card: Card) {
    let cardInfo = this.cards[card.name];
    return cardInfo.dmgLevels[card.level - 7];
  }
  
  getKsCrit(card: Card) {
    let cardInfo = this.cards[card.name];
    return cardInfo.critTiers[card.tier - 1];
  }
  
  getKsSpeed(card: Card) {
    let minLevel = this.levels[0];
    let manaBonus = 10 + (card.level - minLevel);
    let speed =  manaBonus + ((card.level + 3) * card.tier);
    return speed;
  }

  totalSpeedBuff() {
    let speedBuff = 0;
    for (let card of this.deck) {
      let cardInfo = this.cards[card.name];
      let cardBuff = cardInfo.speed;
      if (card.name == 'knight_statue') {

        //console.log('speed', speed, 'speedBonus', speedBonus);
        cardBuff = this.getKsSpeed(card);
      }
      speedBuff = speedBuff + cardBuff;
    }
    //heroes
    //speedBuff = speedBuff + this.heroes[this.deckConfig.hero].speed;
    let activeHeroInfo = this.heroes[this.deckConfig.hero]; 
    let heroBuff = activeHeroInfo.speed;
    if (this.deckConfig.hero == 'gadget' && activeHeroInfo.isGold){
      heroBuff = heroBuff * 2;
    }
    speedBuff = speedBuff + heroBuff;

    //amulet
    speedBuff = speedBuff + this.amulets[this.deckConfig.amulet].speed;
    if (this.deckConfig.hasSetBonus){
      speedBuff = speedBuff * 1.1;
    }
    
    //weapon
    speedBuff = speedBuff + this.weapons[this.deckConfig.weapon].speed;
    if (this.deckConfig.hasSetBonus){
      speedBuff = speedBuff * 1.1;
    }

    return Math.floor(speedBuff);
  }

  totalDamagePerSecond() {
    let critDmgPerSecond = 0;

    let totalCritBuffPercent = (this.totalCritBuff() / 100) + this.playerBaseCrit;

    let totalSpeedBuffPercent = this.totalSpeedBuff() / 100;
    let newAttackSpeed = this.mainDpsBaseSpeed / (totalSpeedBuffPercent + 1);
    //console.log('newAttackSpeed', newAttackSpeed, 'totalSpeedBuff', totalSpeedBuffPercent);

    let totalDamageBuffPercent = this.totalDmgBuff() / 100;
    let totalArmorDestructionBuffPercent = this.totalArmorBuff() / 100;
    let flatBuffAmount = this.dmgWithGrindstone();
    
    let baseAttackDmg = this.getMainDpsBaseDamage();
    //let newAttackDamage = (dmgWithAbsorbs * (1 + totalDamageBuffPercent) + flatBuffAmount) * (1 + totalArmorDestructionBuffPercent);
    let newAttackDamage = (baseAttackDmg * (1 + totalDamageBuffPercent) * (1 + totalArmorDestructionBuffPercent)) + flatBuffAmount;
    let dmgPerSecond = newAttackDamage / newAttackSpeed;

    let hitsPerSecond = 1 / newAttackSpeed;
    let critHitsPerSecond = hitsPerSecond * totalCritBuffPercent;
    let weaponCrit = 0;
    if (this.deckConfig.weapon == 'bow'){
      weaponCrit = this.weapons[this.deckConfig.weapon].crit;
      if (this.deckConfig.hasSetBonus){
        weaponCrit = weaponCrit * 1.1;
      }
    }
    let criticalDamage = newAttackDamage * ((this.deckConfig.playerCrit + weaponCrit) / 100);
    //console.log('criticalDamage', criticalDamage);
    critDmgPerSecond = criticalDamage * critHitsPerSecond;
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

}
