import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

type Card = {
  name: string,
  level: number,
  tier: number,
  merges: number,
  mode: string
}
@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;

  @Input() name?: string;

  @Input() deckConfig: any = [];

  deck: any = [];
  activeWeaponStat = 'speed';
  weaponBuff = 0;
  armorBuff = 0;

  inquisDamageLevels: any = {
    9: 320,
    10: 344,
    11: 371,
    12: 403,
    13: 439,
    14: 481,
    15: 529
  };
  inquisBaseDamage = 159;

  constructor() {
  }

  enchantmentPopoverOptions = {
    header: 'Enchantment',
    subHeader: 'Tap to add',
    message: 'Preview your damage while active',
  };

  activeEnchantment = '';
  mainDpsIncrease: any = {
    damage: 0,
    crit: 0,
    speed: 0
  };

  increaseBaseStat(ev: any, type: any) {
    this.mainDpsIncrease[type] = ev.detail.value;
    
    //console.log('this.deckConfig.mainDpsBaseCrit', this.deckConfig.mainDpsBaseCrit);
    if (type == 'crit'){
      this.deckConfig.mainDpsBaseCrit = this.deckConfig.mainDpsBaseCrit * ((this.mainDpsIncrease[type] / 100) + 1);
    } else if (type == 'speed'){
      this.deckConfig.mainDpsBaseSpeed = this.deckConfig.mainDpsBaseSpeed / ((this.mainDpsIncrease[type] / 100) + 1);
    } else if (type == 'damage'){
      this.deckConfig.mainDpsBaseDamage = this.deckConfig.mainDpsBaseDamage * ((this.mainDpsIncrease[type] / 100) + 1);
    }
    //console.log('this.deckConfig.mainDpsBaseCrit', this.deckConfig.mainDpsBaseCrit);
  }

  addEnchantment(ev: any) {
    if (ev.target.value != ''){
      if (this.deckConfig.enchantments.length < 3){
        this.deckConfig.enchantments.push(ev.target.value);
      }
      //console.log('ev.target.selectedIndex', ev.target);
      this.activeEnchantment = ev.target.value;
      setTimeout(() => {
        this.activeEnchantment = '';
      }, 21);
    }
  }

  removeEnchantment(enchantmentId: any){
    this.deckConfig.enchantments.splice(this.deckConfig.enchantments.indexOf(enchantmentId), 1);
  }

  ngOnInit() {
    this.deck = this.deckConfig.cards;
    if (this.deckConfig.amuletStats) {
      this.amulets = this.deckConfig.amuletStats;
    }
    if (this.deckConfig.weaponStats) {
      this.weapons = this.deckConfig.weaponStats;
    }
    if (this.deckConfig.heroStats) {
      this.heroes = this.deckConfig.heroStats;
    }
    console.log('deck-calc', this, this.deckConfig);
  }

  getInquisBaseDamage() {
    return this.inquisDamageLevels[this.deckConfig.inquisCardLevel] + this.inquisBaseDamage;
  }

  changeSetBonus(event: any) {
    this.deckConfig.hasSetBonus = event.target.checked;
  }

  changedSoulAbsorbs(event: any) {
    this.deckConfig.absorbs = event.target.value;
  }

  dmgWithAbsorbs() {
    let firstBonusPerStack = 0.06;
    let secondBonusPerStack = 0.025;
    let firstBonusLimit = 20;
    let newDamage = 0;
    let baseAttackDmg = this.getInquisBaseDamage();
    if (this.deckConfig.absorbs <= firstBonusLimit) {
      newDamage = baseAttackDmg + ((baseAttackDmg * firstBonusPerStack) * this.deckConfig.absorbs);
    } else {
      let firstBonusDmg = ((baseAttackDmg * firstBonusPerStack) * firstBonusLimit);
      let secondBonusDmg = ((baseAttackDmg * secondBonusPerStack) * (this.deckConfig.absorbs - firstBonusLimit));
      newDamage = baseAttackDmg + firstBonusDmg + secondBonusDmg;
    }
    //soulAbsorbs
    return Math.floor(newDamage);
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
      if (this.deck[this.activeIndex].name == 'witch_statue') {
        this.deck[this.activeIndex].merges = 30;
      }
      if (this.deck[this.activeIndex].name == 'dryad_rage') {
        this.deck[this.activeIndex].merges = 20;
      }
    }
    this.isModalOpen = false;
  }

  getBasicCards() {
    return Object.keys(this.cards);
  }

  inquisAttackSpeedTiers: any = {
    1: 0,
    2: 0.3,
    3: 0.4,
    4: 0.45,
    5: 0.48,
    6: 0.5,
    7: 0.51
  };


  playerBaseCrit = 0.05;

  inquisBaseSpeed = 0.6;
  ksTierLevel = "7";
  tiers = [
    1, 2, 3, 4, 5, 6, 7
  ];
  levels = [
    7, 8, 9, 10, 11, 12, 13, 14, 15
  ];

  enchantments: any = {
    gust: { name: 'Gust', stat: 'speed', duration: 10, buff: 5 },
    wrath: { name: 'Wrath', stat: 'damage', duration: 20, buff: 10 },
    wrath2: { name: 'Wrath II', stat: 'damage', duration: 20, buff: 15 },
    battlethrill: { name: 'Battle Thrill', stat: 'crit', duration: 10, buff: 3 },
    battlethrill2: { name: 'Battle Thrill II', stat: 'crit', duration: 10, buff: 10 }
  };

  talents: any = {
    none: { damage: 0, critChance: 0, critDamage: 0 },
    unity: { damage: 615, critChance: 8, critDamage: 35 },
    ronin: { damage: 900, critChance: 0, critDamage: 0 },
  };

  amulets: any = {
    magic: { alliance: 21, faction: 20, stat: 'damage', name: 'Magic/Growth' },
    weakness: { alliance: 0, faction: 0, stat: 'none', name: 'None' }
  };

  weapons: any = {
    spear: { alliance: 25, faction: 24, stat: 'speed' },
    staff: { alliance: 25, faction: 24, stat: 'none' },
    bow: { alliance: 370, faction: 350, stat: 'crit' },
    sword: { alliance: 25, faction: 24, stat: 'damage' },
  };

  armor: any = {
    none: { alliance: 0, faction: 0, stat: 'none' },
    jacket: { alliance: 7.5, faction: 7.5, stat: 'speed' },
    chainmail: { alliance: 0, faction: 0, stat: 'damage' },
    knights_armor: { alliance: 0, faction: 0, stat: 'crit' }
  };

  heroes: any = {
    trainer: { damage: 8, speed: 0, crit: 0, stat: 'damage' },
    gadget: { damage: 22, speed: 20, crit: 3, baseDamage: 15, baseSpeed: 10, baseCrit:2, stat: 'damage', isGold: false },
    jay: { damage: 0, speed: 33, crit: 0, stat: 'speed' },
    trickster: { damage: 40, speed: 0, crit: 0, stat: 'damage' },
    snowflake: { damage: 50, speed: 0, crit: 0, stat: 'damage' },
    zeus: { damage: 10, speed: 15, crit: 6, stat: 'damage' },
    bestie: { damage: 55, speed: 0, crit: 0, stat: 'damage' },
    mermaid: { damage: 50, speed: 0, crit: 7.5, stat: 'crit' },
    none: { damage: 0, speed: 0, crit: 0, stat: 'damage' }
  };

  cardMerges(card: Card){
    let maxMerges = 0;
    if (card.name == 'dryad_rage'){
      maxMerges = 20;
    } else if (card.name == 'witch_statue'){
      maxMerges = 30;
    }
    return Array(maxMerges).fill(0).map((x, i) => i + 1);
  }

  enchantmentList(){
    return Object.keys(this.enchantments);
  }

  heroList() {
    return Object.keys(this.heroes);
  }
  amuletList() {
    return Object.keys(this.amulets);
  }
  weaponList() {
    return Object.keys(this.weapons);
  }
  armorList() {
    return Object.keys(this.armor);
  }


  cards: any = {
    'banner': { levelTierMatters: true, damage: 0, speed: 116, crit: 0, name: "Banner" },
    'dryad_rage': { levelTierMatters: false, damage: 50, speed: 0, crit: 0, type: 'unit', name: 'Dryad (Rage)', merges: 10 },
    'dryad_growth': { levelTierMatters: false, damage: 0, speed: 0, crit: 0, name: 'Dryad (Growth)' },
    'harly': { levelTierMatters: false, damage: 0, speed: 0, crit: 0, name: "Harly", type: 'none' },
    'sword': { levelTierMatters: false, damage: 200, speed: 0, crit: 5, type: 'unit', name: 'Sword' },
    'trapper': {
      levelTierMatters: true, 
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
    'chemist': { levelTierMatters: true, damage: 103, speed: 0, crit: 0, type: 'armor', name: 'Chemist' },
    'scrapper': { levelTierMatters: false, damage: 0, speed: 0, crit: 0, type: 'none', name: 'Scrapper' },
    'knight_statue': { levelTierMatters: true, damage: 0, speed: 0, crit: 0, name: 'Knight Statue', critTiers: [5, 7.5, 10, 12.5, 15, 17.5, 20] },
    'witch_statue': { levelTierMatters: true, damage: 204, speed: 0, crit: 0, type: 'unit', name: 'Witch', merges: 15 },
    'grindstone': { levelTierMatters: true, damage: 93, speed: 0, crit: 0, mode: 'mt', type: 'flat', name: 'Grindstone' },
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
    this.weaponBuff = this.weapons[this.deckConfig.weapon][this.weapons[this.deckConfig.weapon].stat];
  }
  changeArmor(ev: any) {
    this.deckConfig.armor = ev.target.value;
    this.armorBuff = this.armor[this.deckConfig.weapon][this.armor[this.deckConfig.armor].stat];
  }
  changeWeaponStat(ev: any, type: any) {
    this.weapons[this.deckConfig.weapon][type] = parseFloat(ev.target.value);
    this.deckConfig.weaponStats = this.weapons;
  }
  changeArmorStat(ev: any, type: any) {
    this.armor[this.deckConfig.armor][type] = parseFloat(ev.target.value);
    this.deckConfig.armorStats = this.armor;
  }
  changeAmuletStat(ev: any, type: any) {
    this.amulets[this.deckConfig.amulet][type] = parseFloat(ev.target.value);
    this.deckConfig.amuletStats = this.amulets;
  }
  changeHeroStat(ev: any, type: any) {
    this.heroes[this.deckConfig.hero][type] = parseFloat(ev.target.value);
    //this.heroes[this.deckConfig.hero][this.heroes[this.deckConfig.hero].stat] = parseFloat(ev.target.value); 
    this.deckConfig.heroStats = this.heroes;
  }
  changeGoldTile(ev: any) {
    this.heroes[this.deckConfig.hero].isGold = ev.target.checked;
  }
  changeTalentStat(ev: any, type: any) {
    this.talents[this.deckConfig.talent][type] = parseFloat(ev.target.value);
  }

  changeCard(ev: any, card: Card, index: number) {
    this.deck[index].name = ev.target.value;
    if (this.deck[index].name == 'witch_statue') {
      this.deck[index].merges = 30;
    }
    if (this.deck[index].name == 'dryad_rage') {
      this.deck[index].merges = 20;
    }
  }

  changeBaseCrit(ev: any) {
    this.deckConfig.mainDpsBaseCrit = parseFloat(ev.target.value) || 0;
  }

  changeBaseDps(ev: any) {
    this.deckConfig.mainDpsBaseDamage = parseInt(ev.target.value) || 0;
  }

  changeBaseSpeed(ev: any) {
    this.deckConfig.mainDpsBaseSpeed = parseFloat(ev.target.value) || 0;
  }

  getMainDpsBaseDamage() {
    return this.deckConfig.mainDpsBaseDamage;
  }

  changeDpsUnit(ev: any) {
    this.deckConfig.mainDpsUnit = ev.target.value;
    if (this.deckConfig.mainDpsUnit == 'Inquisitor') {
      this.deckConfig.inquisTierLevel = 7;
      this.deckConfig.inquisCardLevel = 13;
    } else if (this.deckConfig.mainDpsUnit == 'Generic') {
      this.deckConfig.mainDpsBaseDamage = 598;
      this.deckConfig.mainDpsBaseSpeed = 0.6;
      this.deckConfig.mainDpsBaseCrit = 0;
      
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
  changeGrindstoneMode(ev: any, card: Card) {
    card.mode = ev.target.value;
  }
  changeTalent(ev: any) {
    this.deckConfig.talent = ev.target.value;
  }
  getActiveTalentStat(type: any) {
    if (this.deckConfig.talent) {
      return this.talents[this.deckConfig.talent][type];
    } else {
      return 0;
    }
  }

  getCardTierMatters(card: any){
    let cardInfo;
    if (card && card.name) {
      cardInfo = this.cards[card.name];
    } else {
      cardInfo = this.cards[card];
    }
    return cardInfo.levelTierMatters;
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

  getCardName(card: Card) {
    if (card.level < 15) {
      return card.name;
    } else {
      let specialIcons = ['witch_statue'];
      if (specialIcons.indexOf(card.name) > -1) {
        return `${card.name}_max`;
      } else {
        return card.name;
      }
    }
  }

  totalArmorBuff() {
    let dmgBuffs = [];
    let cardNames = [];
    for (let card of this.deck) {
      cardNames.push(card.name);
    }
    for (let card of this.deck) {
      let cardInfo = this.cards[card.name];
      if (cardInfo.type && cardInfo.type == 'armor') {
        let cardBuff = cardInfo.damage;
        if (card.name == 'trapper') {
          cardBuff = cardInfo.dmgLevels[card.level - 7];
        }
        dmgBuffs.push(cardBuff);
      }
    }
    if (this.deckConfig.hero == 'snowflake') {
      dmgBuffs.push(this.heroes.snowflake.damage);
    }

    return dmgBuffs;
  }

  totalDmgBuff(includeTalent: boolean) {
    let cardNames = [];
    let dmgBuffs = [];
    for (let card of this.deck) {
      cardNames.push(card.name);
    }
    for (let card of this.deck) {
      let cardInfo = this.cards[card.name];
      if (cardInfo.type && cardInfo.type == 'unit') {
        let cardBuff = cardInfo.damage;
        if (card.name == 'sword' && cardNames.indexOf('knight_statue') > -1) {
          cardBuff = cardBuff / 5;
        }
        if (card.name == 'witch_statue') {
          cardBuff = this.getWitchBuff(card);
        }
        dmgBuffs.push(cardBuff);
      }
    }

    //heroes
    let activeHeroInfo = this.heroes[this.deckConfig.hero];
    let heroBuff = parseFloat(activeHeroInfo.damage);
    if (this.deckConfig.hero == 'gadget' && activeHeroInfo.isGold) {
      heroBuff = heroBuff + activeHeroInfo.baseDamage;
    }
    dmgBuffs.push(heroBuff);

    //amulet
    let amuletFactionBuff = this.amulets[this.deckConfig.amulet].faction;
    dmgBuffs.push(this.amulets[this.deckConfig.amulet].alliance);
    dmgBuffs.push(this.deckConfig.hasSetBonus ? amuletFactionBuff * 1.1 : amuletFactionBuff);

    //weapon
    if (this.weapons[this.deckConfig.weapon].stat == 'damage'){
      let weaponFactionBuff = this.weapons[this.deckConfig.weapon].faction;
      dmgBuffs.push(this.weapons[this.deckConfig.weapon].alliance);
      dmgBuffs.push(this.deckConfig.hasSetBonus ? weaponFactionBuff * 1.1 : weaponFactionBuff);
    }

    //armor
    if (this.armor[this.deckConfig.armor].stat == 'damage') {
      let armorFactionDebuff = this.armor[this.deckConfig.armor].faction;
      dmgBuffs.push(this.armor[this.deckConfig.armor].alliance * -1);
      dmgBuffs.push((this.deckConfig.hasSetBonus ? armorFactionDebuff * 1.1 : armorFactionDebuff) * -1);
    }

    //enchantments
    if (this.deckConfig.enchantments.length){
      for (let enchantment of this.deckConfig.enchantments){
        if (this.enchantments[enchantment].stat == 'damage'){
          dmgBuffs.push(this.enchantments[enchantment].buff);
        }
      }
    }

    if (includeTalent && (this.deckConfig.talent == 'unity' || this.deckConfig.talent == 'ronin')) {
      dmgBuffs.push(this.talents[this.deckConfig.talent].damage);
    }

    return dmgBuffs
  }

  sumOfArray(arrBuffs: any) {
    return arrBuffs.reduce((memo: any, value: any) => {
      memo = memo + value;
      return memo;
    }, 0)
  }

  totalCritDmgBuff(includeTalent: boolean) {
    let critDmgBuffs = [];
    if (this.deckConfig.weapon == 'bow') {
      critDmgBuffs.push(this.weapons[this.deckConfig.weapon].alliance);
      let bowFactionBuff = this.weapons[this.deckConfig.weapon].faction;
      critDmgBuffs.push(this.deckConfig.hasSetBonus ? bowFactionBuff * 1.1 : bowFactionBuff);
    }

        //armor
        if (this.armor[this.deckConfig.armor].stat == 'crit') {
          let armorFactionDebuff = this.armor[this.deckConfig.armor].faction;
          critDmgBuffs.push(this.armor[this.deckConfig.armor].alliance * -1);
          critDmgBuffs.push((this.deckConfig.hasSetBonus ? armorFactionDebuff * 1.1 : armorFactionDebuff) * -1);
        }
    //enchantments
    /*if (this.deckConfig.enchantments.length){
      for (let enchantment of this.deckConfig.enchantments){
        if (this.enchantments[enchantment].stat == 'crit'){
          critDmgBuffs.push(this.enchantments[enchantment].buff);
        }
      }
    }*/

    if (includeTalent && this.deckConfig.talent == 'unity') {
      critDmgBuffs.push(this.talents[this.deckConfig.talent].critDamage);
    }
    return critDmgBuffs;
  }

  totalCritBuff(includeTalent: boolean) {
    let critBuffs = [];
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
      if (card.name == 'sword' && cardNames.indexOf('knight_statue') > -1) {
        cardBuff = cardBuff / 5;
      }
      critBuffs.push(cardBuff);
      //critBuff = critBuff + cardBuff;
    }

    //heroes
    //critBuff = critBuff + this.heroes[this.deckConfig.hero].crit;
    let activeHeroInfo = this.heroes[this.deckConfig.hero];
    let heroBuff = parseFloat(activeHeroInfo.crit);
    if (this.deckConfig.hero == 'gadget' && activeHeroInfo.isGold) {
      heroBuff = heroBuff + activeHeroInfo.baseCrit;
    }
    critBuffs.push(heroBuff);

/*    //enchantments
    if (this.deckConfig.enchantments.length){
      for (let enchantment of this.deckConfig.enchantments){
        if (this.enchantments[enchantment].stat == 'crit'){
          critBuffs.push(this.enchantments[enchantment].buff);
        }
      }
    }*/
    
    if (includeTalent && this.deckConfig.talent == 'unity') {
      critBuffs.push(this.talents[this.deckConfig.talent].critChance);
    }

    if (this.deckConfig.mainDpsUnit == 'Generic') {
      critBuffs.push(this.deckConfig.mainDpsBaseCrit);
    }

    return critBuffs;
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
    if (card.name == 'sword' && cardNames.indexOf('knight_statue') > -1) {
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
    if (card.name == 'sword' && cardNames.indexOf('knight_statue') > -1) {
      cardBuff = cardBuff / 5;
    }
    return cardBuff;
  }

  getSpeedBuff(card: Card) {
    let speedBuff = 0;
    if (card.name == 'banner') {
      speedBuff = this.getBannerBuff(card);
    } else if (card.name == 'knight_statue') {
      speedBuff = this.getKsSpeed(card);
    }
    return speedBuff;
  }

  getCritBuff(card: Card) {
    let critBuff = 0;
    if (card.name == 'sword') {
      critBuff = this.getSwordCrit(card);
    } else if (card.name == 'knight_statue') {
      critBuff = this.getKsCrit(card);
    }
    return critBuff;
  }

  getDmgBuff(card: Card) {
    let dmfBuff = 0;
    if (card.name == 'dryad_rage') {
      dmfBuff = this.getDryadBuff(card);
    } else if (card.name == 'witch_statue') {
      dmfBuff = this.getWitchBuff(card);
    } else if (card.name == 'chemist') {
      dmfBuff = this.getChemistBuff(card);
    } else if (card.name == 'trapper') {
      dmfBuff = this.getTrapperBuff(card);
    } else if (card.name == 'sword') {
      dmfBuff = this.getSwordDmg(card);
    } else if (card.name == 'grindstone') {
      dmfBuff = this.getGrindstoneDmg(card);
    }
    return dmfBuff;
  }

  getGrindstoneDmg(card: Card) {
    //=C21+(C22*(C24-1))+(floor(C21 * ((B28-1)*0.5)))
    let baseDamage = card.mode == 'st' ? 415 : 89;
    let bonusDamage = card.mode == 'st' ? 50 : 10;
    let cardMana = 5;
    let totalDamage = baseDamage + (bonusDamage * (cardMana - 1)) + (Math.floor(baseDamage * ((card.tier - 1) * 0.5)));
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
    if (witchBuff > 0) {
      grindstoneBuff = grindstoneBuff * ((witchBuff / 100) + 1);
    }
    return grindstoneBuff;
  }

  getDryadBuff(card: Card) {
    let merges = card.merges || 0;
    let buffPerMerge = 2.5;
    return merges * buffPerMerge;
  }

  getBannerBuff(card: Card) {
    let currentCardLevel = card.level;
    let minCardLevel = this.levels[0];
    let baseAttackSpeed = 12;
    let tierMultiplier = 0.5;
    let newAttackSpeed = (baseAttackSpeed + ((currentCardLevel - minCardLevel) * tierMultiplier)) * card.tier;
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
    let speed = manaBonus + ((card.level + 3) * card.tier);
    return speed;
  }

  totalSpeedBuff() {
    let speedBuffs = [];
    for (let card of this.deck) {
      let cardInfo = this.cards[card.name];
      let cardBuff = cardInfo.speed;
      if (card.name == 'knight_statue') {

        //console.log('speed', speed, 'speedBonus', speedBonus);
        cardBuff = this.getKsSpeed(card);
      }
      speedBuffs.push(cardBuff);
    }
    //heroes
    //speedBuff = speedBuff + this.heroes[this.deckConfig.hero].speed;
    let activeHeroInfo = this.heroes[this.deckConfig.hero];
    let heroBuff = parseFloat(activeHeroInfo.speed);
    if (this.deckConfig.hero == 'gadget' && activeHeroInfo.isGold) {
      heroBuff = heroBuff + activeHeroInfo.baseSpeed;
    }
    speedBuffs.push(heroBuff);


    //weapon
    if (this.weapons[this.deckConfig.weapon].stat == 'speed') {
      let weaponFactionBuff = this.weapons[this.deckConfig.weapon].faction;
      speedBuffs.push(this.weapons[this.deckConfig.weapon].alliance);
      speedBuffs.push(this.deckConfig.hasSetBonus ? weaponFactionBuff * 1.1 : weaponFactionBuff);

    }

    //enchantments
    if (this.deckConfig.enchantments.length){
      for (let enchantment of this.deckConfig.enchantments){
        if (this.enchantments[enchantment].stat == 'speed'){
          speedBuffs.push(this.enchantments[enchantment].buff);
        }
      }
    }

    //armor
    if (this.armor[this.deckConfig.armor].stat == 'speed') {
      let armorFactionDebuff = this.armor[this.deckConfig.armor].faction;
      speedBuffs.push(this.armor[this.deckConfig.armor].alliance * -1);
      speedBuffs.push((this.deckConfig.hasSetBonus ? armorFactionDebuff * 1.1 : armorFactionDebuff) * -1);
    }
    return speedBuffs;
  }

  totalDamagePerSecond(includeTalent: boolean) {
    let dmgPerSecond = 0;
    let critDmgPerSecond = 0;

    let totalCritBuffPercent = (this.sumOfArray(this.totalCritBuff(includeTalent)) / 100) + this.playerBaseCrit;

    let totalSpeedBuffPercent = this.sumOfArray(this.totalSpeedBuff()) / 100;
    let newAttackSpeed = 0;
    let newBaseDamage = 0;
    if (this.deckConfig.mainDpsUnit == 'Inquisitor') {
      newAttackSpeed = (this.inquisBaseSpeed - this.inquisAttackSpeedTiers[this.deckConfig.inquisTierLevel]) / (totalSpeedBuffPercent + 1);
      newBaseDamage = this.dmgWithAbsorbs();
    } else {
      newAttackSpeed = this.deckConfig.mainDpsBaseSpeed / (totalSpeedBuffPercent + 1);
      newBaseDamage = this.deckConfig.mainDpsBaseDamage;
    }
    //console.log('newAttackSpeed', newAttackSpeed, 'totalSpeedBuff', totalSpeedBuffPercent);

    let flatBuffAmount = this.dmgWithGrindstone();
    let totalDamageBuffs = this.totalDmgBuff(includeTalent);
    let totalArmorBuffs = this.sumOfArray(this.totalArmorBuff());
    let newAttackDamage = newBaseDamage;
    for (let buff of totalDamageBuffs) {
      newAttackDamage = newAttackDamage * (1 + (buff / 100));
    }
    newAttackDamage = (newAttackDamage * (1 + (totalArmorBuffs/100))) + flatBuffAmount;

    dmgPerSecond = newAttackDamage / newAttackSpeed;

    let hitsPerSecond = 1 / newAttackSpeed;
    let critHitsPerSecond = hitsPerSecond * totalCritBuffPercent;

    let totalCritDmgBuff = this.sumOfArray(this.totalCritDmgBuff(includeTalent));
    let enchanmentCritDmgBuff = 0;
    if (this.deckConfig.enchantments.length){
      for (let enchantment of this.deckConfig.enchantments){
        if (this.enchantments[enchantment].stat == 'crit'){
          enchanmentCritDmgBuff = enchanmentCritDmgBuff + this.enchantments[enchantment].buff;
        }
      }
    }
    let criticalDamage = newAttackDamage * (((this.deckConfig.playerCrit * (1 + (enchanmentCritDmgBuff/100))) + totalCritDmgBuff) / 100);
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
