import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
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
    7: 320,
    8: 338,
    9: 359,
    10: 383,
    11: 410,
    12: 442,
    13: 478,
    14: 520,
    15: 568
  };
  inquisBaseDamage = 120;

  constructor(private alertController: AlertController) { }


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
    if (type == 'crit') {
      this.deckConfig.mainDpsBaseCrit = this.deckConfig.mainDpsBaseCrit * ((this.mainDpsIncrease[type] / 100) + 1);
    } else if (type == 'speed') {
      this.deckConfig.mainDpsBaseSpeed = this.deckConfig.mainDpsBaseSpeed / ((this.mainDpsIncrease[type] / 100) + 1);
    } else if (type == 'damage') {
      this.deckConfig.mainDpsBaseDamage = this.deckConfig.mainDpsBaseDamage * ((this.mainDpsIncrease[type] / 100) + 1);
    }
    //console.log('this.deckConfig.mainDpsBaseCrit', this.deckConfig.mainDpsBaseCrit);
  }

  addEnchantment(ev: any) {
    if (ev.target.value != '') {
      if (this.deckConfig.enchantments.length < 3) {
        this.deckConfig.enchantments.push(ev.target.value);
      }
      //console.log('ev.target.selectedIndex', ev.target);
      this.activeEnchantment = ev.target.value;
      setTimeout(() => {
        this.activeEnchantment = '';
      }, 21);
    }
  }

  removeEnchantment(enchantmentId: any) {
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

  changeDeckConfig(event: any, field: string, isCheckbox?: boolean) {
    this.deckConfig[field] = event.target[isCheckbox ? 'checked': 'value'];
  }

  changeSetBonus(event: any) {
    this.deckConfig.hasSetBonus = event.target.checked;
  }

  changedSoulAbsorbs(event: any) {
    this.deckConfig.absorbs = event.target.value;
  }

  dmgWithAbsorbs() {
    let firstBonusPerStack = 0.06;
    let secondBonusPerStack = 0.035;
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
      if (this.deck[this.activeIndex].name == 'sword') {
        this.deck[this.activeIndex].merges = 10;
      }
      if (this.deck[this.activeIndex].name == 'grindstone') {
        this.deck[this.activeIndex].damage = 415;
        this.deck[this.activeIndex].merges = 0;
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
    ronin: { damage: 800, critChance: 0, critDamage: 0 },
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
    gadget: { damage: 22, speed: 20, crit: 3, baseDamage: 15, baseSpeed: 10, baseCrit: 2, stat: 'damage', isGold: false },
    jay: { damage: 0, speed: 33, crit: 0, stat: 'speed' },
    trickster: { damage: 40, speed: 0, crit: 0, stat: 'damage' },
    snowflake: { damage: 50, speed: 0, crit: 0, stat: 'damage' },
    zeus: { damage: 10, speed: 15, crit: 6, stat: 'damage' },
    bestie: { damage: 55, speed: 0, crit: 0, stat: 'damage' },
    mermaid: { damage: 50, speed: 0, crit: 7.5, stat: 'crit' },
    none: { damage: 0, speed: 0, crit: 0, stat: 'damage' }
  };

  cardMerges(card: Card) {
    let maxMerges = 0;
    if (card.name == 'dryad_rage') {
      maxMerges = 20;
    } else if (card.name == 'witch_statue') {
      maxMerges = 30;
    } else if (card.name == 'sword') {
      maxMerges = 10;
    } else if (card.name == 'grindstone') {
      maxMerges = 100;
    }
    //changeWitchMerges
    return Array(maxMerges + 1).fill(0).map((x, i) => i);
  }

  enchantmentList() {
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
    'banner': { level: true, tier: true, damage: 0, speed: 116, crit: 0, name: "Banner" },
    'dryad_rage': { level: false, tier: false, damage: 50, speed: 0, crit: 0, type: 'unit', name: 'Dryad (Rage)', merges: 10 },
    'dryad_growth': { level: false, tier: false, damage: 0, speed: 0, crit: 0, name: 'Dryad (Growth)' },
    'harly': { level: false, tier: false, damage: 0, speed: 0, crit: 0, name: "Harly", type: 'none' },
    'sword': { level: true, tier: false, damage: 200, speed: 0, crit: 5, type: 'unit', name: 'Sword', merges: 10 },
    'trapper': {
      level: true, tier: false,
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
    'chemist': { level: true, tier: true, damage: 103, speed: 0, crit: 0, type: 'armor', name: 'Chemist' },
    'scrapper': { level: false, tier: false, damage: 0, speed: 0, crit: 0, type: 'none', name: 'Scrapper' },
    'knight_statue': { level: true, tier: true, damage: 0, speed: 0, crit: 0, name: 'Knight Statue', critTiers: [5, 7.5, 10, 12.5, 15, 17.5, 20] },
    'witch_statue': { level: true, tier: false, damage: 204, speed: 0, crit: 0, type: 'unit', name: 'Witch', merges: 15 },
    'grindstone': { level: false, tier: true, damage: 93, speed: 0, crit: 0, mode: 'mt', type: 'flat', name: 'Grindstone' },
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
    if (this.deck[index].name == 'sword') {
      this.deck[index].merges = 10;
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
    } else if (this.deckConfig.mainDpsUnit == 'Boreas') {
      this.deckConfig.mainDpsBaseDamage = 120;
      this.deckConfig.mainDpsBaseSpeed = 0.09;
      this.deckConfig.mainDpsBaseCrit = 0;
      this.deckConfig.mainDpsFirstPhase = 4.6;
      this.deckConfig.mainDpsSecondPhase = 1.7;
      this.deckConfig.mainDpsActivationInterval = 4.7;
    } else if (this.deckConfig.mainDpsUnit == 'Sentry') {
      this.deckConfig.mainDpsBaseDamage = 456;
      this.deckConfig.mainDpsBaseSpeed = 0.09;
      this.deckConfig.mainDpsBaseCrit = 0;
      this.deckConfig.mainDpsDamageIncrease = 244;
      this.deckConfig.mainDpsActivationInterval = 0.95;

    } else if (this.deckConfig.mainDpsUnit == 'CrystalMancer') {
      this.deckConfig.mainDpsBaseDamage = 197;
      this.deckConfig.mainDpsBaseSpeed = 0.07;
      this.deckConfig.mainDpsBaseCrit = 0;
      this.deckConfig.mainDpsDamageIncrease = 800;
      this.deckConfig.mainDpsActivationInterval = 0.95;

    } else if (this.deckConfig.mainDpsUnit == 'DemonHunter') {
      this.deckConfig.mainDpsBaseDamage = 1136;
      this.deckConfig.mainDpsBaseSpeed = 0.45;
      this.deckConfig.mainDpsBaseCrit = 0;
      this.deckConfig.mainDpsTierLevel = 7;
      this.deckConfig.demonHunterEmpowered = true;

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
  async changeGrindstoneOptions() {
    const alert = await this.alertController.create({
      header: 'Select talents used',
      buttons: ['Set Talents'],
      inputs: [
        {
          label: 'Lv13. Unstable Overheat',
          type: 'checkbox',
          value: 'unstable_overheat',
        },
        {
          label: 'Lv13. Triple Overheat',
          type: 'checkbox',
          value: 'triple_overheat',
        },
        {
          type: 'checkbox',
          value: 'tempered_steel',
          label: 'Lv15. Tempered Steel',
        },
        {
          type: 'checkbox',
          value: 'adjacent_ks',
          label: 'Adjacent Knight Statue',
        },
        {
          type: 'checkbox',
          value: 'adjacent_witch',
          label: 'Adjacent Witch',
        },
      ],
    });

    await alert.present();
    const results = await alert.onDidDismiss();
    let talentsSelected = results.data.values;
    for (let card of this.deck) {
      if (card.name == 'grindstone') {
        card.talents = talentsSelected;
      }
    }
    console.log('results ', results);
  }

  changeTalent(ev: any) {
    this.deckConfig.talent = ev.target.value;
  }

  getGrindstoneTalents() {
    let talents = [];
    for (let card of this.deck) {
      if (card.name == 'grindstone' && card.talents) {
        talents = card.talents;
      }
    }
    return talents;
  }
  getActiveTalentStat(type: any) {
    if (this.deckConfig.talent) {
      return this.talents[this.deckConfig.talent][type];
    } else {
      return 0;
    }
  }

  getCardTierMatters(card: any) {
    let cardInfo;
    if (card && card.name) {
      cardInfo = this.cards[card.name];
    } else {
      cardInfo = this.cards[card];
    }
    return [cardInfo.level, cardInfo.tier];
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
        if (card.name == 'chemist') {
          cardBuff = this.getChemistBuff(card);
        }
        dmgBuffs.push(cardBuff);
      }
    }
    if (this.deckConfig.hero == 'snowflake') {
      dmgBuffs.push(this.heroes.snowflake.damage);
    }

    return dmgBuffs;
  }

  totalDmgBuff(includeTalent: boolean, isGrindstone?: boolean) {
    let cardNames = [];
    let dmgBuffs = [];
    let isForGS = isGrindstone ? true : false;
    //console.log('isForGS', isForGS);
    let grindstoneTalents = this.getGrindstoneTalents();
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
        if (card.name == 'witch_statue' 
        && (cardNames.indexOf('grindstone') == -1 || !isForGS || (isForGS && grindstoneTalents.indexOf('adjacent_witch') == -1))
        ) {
          cardBuff = this.getWitchBuff(card);
        }
        if (card.name == 'dryad_rage') {
          cardBuff = this.getDryadBuff(card);
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
    if (this.weapons[this.deckConfig.weapon].stat == 'damage') {
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
    if (this.deckConfig.enchantments.length) {
      for (let enchantment of this.deckConfig.enchantments) {
        if (this.enchantments[enchantment].stat == 'damage') {
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
      /*if (card.name == 'grindstone') {
        cardBuff = this.getGrindstoneCrit(card);
      }*/
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

    if (this.deckConfig.mainDpsUnit == 'Generic' || this.deckConfig.mainDpsUnit == 'Boreas') {
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
    if (!card.merges) card.merges = 10;
    let cardBuff = ((cardInfo.damage / 10) + ((card.level - 7) * 1.5)) * card.merges;
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

  getGrindstoneCrit() {
    let talents = [];
    let cardTier = 0;
    let ksCard = null;
    for (let card of this.deck) {
      if (card.name == 'grindstone' && card.talents) {
        talents = card.talents;
        cardTier = card.tier;
      }
      if (card.name == 'knight_statue') {
        ksCard = card;
      }
    }
    let critBuff = 0;
    if (talents.indexOf('tempered_steel') > -1) {
      critBuff = cardTier;
    }
    if (talents.indexOf('adjacent_ks') > -1) {
      critBuff = critBuff + this.getKsCrit(ksCard);
    }
    //console.log('getGrindstoneCrit', critBuff);
    return critBuff;
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
    } else if (card.name == 'grindstone') {
      critBuff = this.getGrindstoneCrit();
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

  setGrindstoneDmg(ev: any, card: any) {
    card.damage = ev.target.value;
  }

  getGrindstoneDmg(card: any) {
    //=C21+(C22*(C24-1))+(floor(C21 * ((B28-1)*0.5)))
    let talents = this.getGrindstoneTalents();
    let totalDamage = card.damage; // + (bonusDamage * (cardMana - 1)) + (Math.floor(baseDamage * ((card.tier - 1) * 0.5)));
    /*
    let isMultigrinder = talents.indexOf('multigrinder') > -1;
    let baseDamage = card.mode == 'st' || isMultigrinder ? 415 : 89;
    let bonusDamage = card.mode == 'st' || isMultigrinder ? 50 : 10;
    
    let cardMana = 5;
    let totalDamage = baseDamage + (bonusDamage * (cardMana - 1)) + (Math.floor(baseDamage * ((card.tier - 1) * 0.5)));
*/

    if (talents.indexOf('triple_overheat') > -1) {
      totalDamage = totalDamage * 1.3;
    }

    if (talents.indexOf('unstable_overheat') > -1) {
      let buffPerStack = 1.5;
      let baseBuff = 10;
      if (!card.merges) card.merges = 0;
      totalDamage = totalDamage * (1 + ((baseBuff = (buffPerStack * card.merges)) / 100));
    }

    return Math.ceil(totalDamage);
  }

  dmgWithGrindstone() {
    let grindstoneBuff = 0;
    /*let witchBuff = 0;
    let dryadBuff = 0;*/
    for (let card of this.deck) {
      if (card.name == 'grindstone') {
        grindstoneBuff = this.getGrindstoneDmg(card);
      }
      /*if (card.name == 'witch_statue') {
        witchBuff = this.getWitchBuff(card);
      }
      if (card.name == 'dryad_rage') {
        dryadBuff = this.getDryadBuff(card);
      }*/
    }
    //console.log('witchBuff', witchBuff);
    /*if (witchBuff > 0) {
      grindstoneBuff = grindstoneBuff * ((witchBuff / 100) + 1);
    }
    if (dryadBuff > 0) {
      grindstoneBuff = grindstoneBuff * ((dryadBuff / 100) + 1);
    }*/
    return Math.round(grindstoneBuff);
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
    /*
    let cardInfo = this.cards[card.name];
    return cardInfo.damage;
    */
    let baseDmg = 40;
    let multiplier = 0.5;
    let bonus = 4.5;
    let cardLevel = card.level;
    let tierLevel = card.tier;

    let totalDamage = baseDmg + (multiplier * (cardLevel - 6)) + ((multiplier * (cardLevel - 6)) + bonus) * (tierLevel - 1);
    return totalDamage + bonus;
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
    if (this.deckConfig.enchantments.length) {
      for (let enchantment of this.deckConfig.enchantments) {
        if (this.enchantments[enchantment].stat == 'speed') {
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
    if (this.deckConfig.mainDpsUnit == 'Boreas') {
      let originalSpeed = this.deckConfig.mainDpsBaseSpeed;
      let originalCrit = this.deckConfig.mainDpsBaseCrit;
      let normalPhaseDPS = this.oldTotalDamagePerSecond(includeTalent);
      let normalPhaseLength = parseFloat(this.deckConfig.mainDpsActivationInterval);
      let normalPhaseTotal = normalPhaseDPS.total * normalPhaseLength;
      //console.log('normalPhaseLength', normalPhaseLength, 'normalPhaseDamage', normalPhaseTotal, normalPhaseDPS);

      // 600% speed increase for first phase
      this.deckConfig.mainDpsBaseSpeed = this.deckConfig.mainDpsBaseSpeed / 7;
      let firstPhaseDPS = this.oldTotalDamagePerSecond(includeTalent);
      let firstPhaseLength = parseFloat(this.deckConfig.mainDpsFirstPhase);
      let firstPhaseTotal = firstPhaseDPS.total * firstPhaseLength;
      this.deckConfig.mainDpsBaseSpeed = originalSpeed;
      //console.log('firstPhaseLength', firstPhaseLength, 'firstPhaseTotal', firstPhaseTotal, firstPhaseDPS);

      // 600% speed increase and 100% crit for second phase
      this.deckConfig.mainDpsBaseSpeed = this.deckConfig.mainDpsBaseSpeed / 7;
      this.deckConfig.mainDpsBaseCrit = 100;
      let secondPhaseDPS = this.oldTotalDamagePerSecond(includeTalent);
      let secondPhaseLength = parseFloat(this.deckConfig.mainDpsSecondPhase);
      let secondPhaseTotal = secondPhaseDPS.total * secondPhaseLength;
      this.deckConfig.mainDpsBaseSpeed = originalSpeed;
      this.deckConfig.mainDpsBaseCrit = originalCrit;
      console.log('secondPhaseLength', secondPhaseLength, 'secondPhaseTotal', secondPhaseTotal, secondPhaseDPS);

      let total = Math.floor((normalPhaseTotal + firstPhaseTotal + secondPhaseTotal) / (normalPhaseLength + firstPhaseLength + secondPhaseLength));
      let results = {
        total,
        newAttackDamage: 0,
        newAttackSpeed: 0,
        dmgPerSecond: 0,
        critDmgPerSecond: 0,
        hitsPerSecond: 0,
        critHitsPerSecond: 0,
        criticalDamage: 0,
        normalPhaseTotal,
        firstPhaseTotal,
        secondPhaseTotal,
        totalPhaseLengthSeconds: 0
      };
      return results;
    } else if (this.deckConfig.mainDpsUnit == 'Sentry') {
      let totalPhaseParts = Math.ceil(this.deckConfig.mainDpsDamageIncrease / 10);
      let totalPhaseLengthSeconds = totalPhaseParts * this.deckConfig.mainDpsActivationInterval;

      let dpsPhases = [];
      let total = 0;
      let originalDamage = this.deckConfig.mainDpsBaseDamage;
      for (let i = 0; i < totalPhaseParts; i++) {
        //this.deckConfig.mainDpsBaseDamage = this.deckConfig.mainDpsBaseDamage * 1.1;
        let step = (i / 10) + 1;
        if (i == totalPhaseParts - 1) {
          //console.log('last one here we go', step);
          step = step + ((this.deckConfig.mainDpsDamageIncrease % 10) / 100);
          //console.log('last now we got this', step);
        }
        console.log('step', step, i);
        this.deckConfig.mainDpsBaseDamage = originalDamage * step;
        console.log('this.deckConfig.mainDpsBaseDamage', this.deckConfig.mainDpsBaseDamage);
        let dpsPhase = this.oldTotalDamagePerSecond(includeTalent);
        dpsPhases.push(dpsPhase);
        total = total + dpsPhase.total;
      }
      total = total / totalPhaseLengthSeconds;
      this.deckConfig.mainDpsBaseDamage = originalDamage;

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
    } else if (this.deckConfig.mainDpsUnit == 'CrystalMancer') {
      this.deckConfig.mainDpsDamageIncrease = 800;
      let totalPhaseParts = Math.ceil(this.deckConfig.mainDpsDamageIncrease / 10);
      let totalPhaseLengthSeconds = totalPhaseParts * this.deckConfig.mainDpsBaseSpeed;
      let total = 0;
      let originalDamage = this.deckConfig.mainDpsBaseDamage;
      for (let i = 0; i < totalPhaseParts; i++) {
        let step = ((i + 1) / 10) + 1;
        this.deckConfig.mainDpsBaseDamage = originalDamage * step;
        total = total + this.deckConfig.mainDpsBaseDamage;
      }
      //console.log('total', total);
      total = total / totalPhaseLengthSeconds;
      this.deckConfig.mainDpsBaseDamage = originalDamage;

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
    } else if (this.deckConfig.mainDpsUnit == 'DemonHunter') {
      let originalDamage = this.deckConfig.mainDpsBaseDamage;
      if (this.deckConfig.demonHunterEmpowered){
        this.deckConfig.mainDpsBaseDamage = this.deckConfig.mainDpsBaseDamage * 1.75;
      }
      this.deckConfig.mainDpsBaseDamage = this.deckConfig.mainDpsBaseDamage * this.deckConfig.mainDpsTierLevel;
      let results = this.oldTotalDamagePerSecond(includeTalent);
      this.deckConfig.mainDpsBaseDamage = originalDamage;

      return results;
    }
    else {
      return this.oldTotalDamagePerSecond(includeTalent);
    }
  }

  gsDamagePerSecond(includeTalent: boolean) {
    let dmgPerSecond = 0;
    let critDmgPerSecond = 0;

    let grindstoneCrit = this.getGrindstoneCrit();
    let totalCritBuffPercent = ((this.sumOfArray(this.totalCritBuff(includeTalent)) + grindstoneCrit) / 100) + this.playerBaseCrit;

    //console.log('totalCritBuffPercent', totalCritBuffPercent, grindstoneCrit);

    let totalSpeedBuffs = this.totalSpeedBuff();
    let newAttackSpeed = 0;
    let newBaseDamage = 0;
    newAttackSpeed = this.deckConfig.mainDpsBaseSpeed;
    newBaseDamage = this.dmgWithGrindstone();
    for (let buff of totalSpeedBuffs) {
      newAttackSpeed = newAttackSpeed / (1 + (buff / 100));
    }

    //let flatBuffAmount = this.dmgWithGrindstone();
    //console.log('flatBuffAmount', flatBuffAmount);
    let totalDamageBuffs = this.totalDmgBuff(includeTalent, true);
    //let totalArmorBuffs = this.sumOfArray(this.totalArmorBuff());
    let newAttackDamage = newBaseDamage; //;
    console.log('gsDamageBuffs', newAttackDamage, totalDamageBuffs);
    for (let buff of totalDamageBuffs) {
      //console.log('newAttackDamage-0', newAttackDamage, buff);
      newAttackDamage = Math.round(newAttackDamage * (1 + (buff / 100)));
      //console.log('newAttackDamage-1', newAttackDamage, buff);
    }
    //newAttackDamage =  (newAttackDamage * (1 + (totalArmorBuffs/100))); // + flatBuffAmount;

    dmgPerSecond = newAttackDamage / newAttackSpeed;

    let hitsPerSecond = 1 / newAttackSpeed;
    let critHitsPerSecond = hitsPerSecond * totalCritBuffPercent;

    let totalCritDmgBuff = this.sumOfArray(this.totalCritDmgBuff(includeTalent));
    let enchanmentCritDmgBuff = 0;
    if (this.deckConfig.enchantments.length) {
      for (let enchantment of this.deckConfig.enchantments) {
        if (this.enchantments[enchantment].stat == 'crit') {
          enchanmentCritDmgBuff = enchanmentCritDmgBuff + this.enchantments[enchantment].buff;
        }
      }
    }
    let criticalDamage = Math.floor(newAttackDamage * (((this.deckConfig.playerCrit * (1 + (enchanmentCritDmgBuff / 100))) + totalCritDmgBuff) / 100));
    //console.log('criticalDamage', criticalDamage);
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
      deckConfig: JSON.parse(JSON.stringify(this.deckConfig)),
      normalPhaseTotal: 0,
      firstPhaseTotal: 0,
      secondPhaseTotal: 0,
      totalPhaseLengthSeconds: 0
    };
    return results;
  }

  oldTotalDamagePerSecond(includeTalent: boolean) {
    let dmgPerSecond = 0;
    let critDmgPerSecond = 0;

    let totalCritBuffPercent = (this.sumOfArray(this.totalCritBuff(includeTalent)) / 100) + this.playerBaseCrit;

    let totalSpeedBuffs = this.totalSpeedBuff();
    let newAttackSpeed = 0;
    let newBaseDamage = 0;
    if (this.deckConfig.mainDpsUnit == 'Inquisitor') {
      newAttackSpeed = (this.inquisBaseSpeed - this.inquisAttackSpeedTiers[this.deckConfig.inquisTierLevel]);
      newBaseDamage = this.dmgWithAbsorbs();
    } else {
      newAttackSpeed = this.deckConfig.mainDpsBaseSpeed;
      newBaseDamage = this.deckConfig.mainDpsBaseDamage;
    }
    for (let buff of totalSpeedBuffs) {
      newAttackSpeed = newAttackSpeed / (1 + (buff / 100));
    }

    //let flatBuffAmount = this.dmgWithGrindstone();
    //console.log('flatBuffAmount', flatBuffAmount);
    let totalDamageBuffs = this.totalDmgBuff(includeTalent);
    let totalArmorBuffs = this.sumOfArray(this.totalArmorBuff());
    let newAttackDamage = newBaseDamage; //;
    //console.log('totalDamageBuffs', flatBuffAmount, totalDamageBuffs);
    for (let buff of totalDamageBuffs) {
      //console.log('newAttackDamage-0', newAttackDamage, buff);
      newAttackDamage = Math.round(newAttackDamage * (1 + (buff / 100)));
      //console.log('newAttackDamage-1', newAttackDamage, buff);
    }
    newAttackDamage = (newAttackDamage * (1 + (totalArmorBuffs / 100))); // + flatBuffAmount;

    dmgPerSecond = newAttackDamage / newAttackSpeed;

    let hitsPerSecond = 1 / newAttackSpeed;
    let critHitsPerSecond = hitsPerSecond * totalCritBuffPercent;

    let totalCritDmgBuff = this.sumOfArray(this.totalCritDmgBuff(includeTalent));
    let enchanmentCritDmgBuff = 0;
    if (this.deckConfig.enchantments.length) {
      for (let enchantment of this.deckConfig.enchantments) {
        if (this.enchantments[enchantment].stat == 'crit') {
          enchanmentCritDmgBuff = enchanmentCritDmgBuff + this.enchantments[enchantment].buff;
        }
      }
    }
    let criticalDamage = Math.floor(newAttackDamage * (((this.deckConfig.playerCrit * (1 + (enchanmentCritDmgBuff / 100))) + totalCritDmgBuff) / 100));
    //console.log('criticalDamage', criticalDamage);
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
      deckConfig: JSON.parse(JSON.stringify(this.deckConfig)),
      normalPhaseTotal: 0,
      firstPhaseTotal: 0,
      secondPhaseTotal: 0,
      totalPhaseLengthSeconds: 0
    }
    return results;
  }

}
