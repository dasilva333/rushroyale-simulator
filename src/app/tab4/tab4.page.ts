import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  levels = [
    7, 8, 9, 10, 11, 12, 13, 14, 15
  ];
  tiers = [
    1, 2, 3, 4, 5, 6, 7
  ];
  activeCounters: any = [

  ];
  negateAmount = "1";
  
  counters: any = {
    banner: {
      tier: 7,
      cardLevel: 15
    },
    knight_statue: {
      tier: 7,
      cardLevel: 15
    },
    spear: {
      buff: 50
    },
    gadget: {
      buff: 21
    },
    jay: {
      buff: 34.3
    },
    zeus: {
      buff: 15
    }
  }
  activeClockLevel = 7;
  
  maxClockTiles = 14;
  tiles: any = Array(15).fill(0).map((x,i)=>i+1);

  changeCounterBuff(ev: any, counter: any) {
    this.counters[counter].buff = parseInt(ev.target.value);   
  }

  changeNegateAmount(ev: any) {
    this.negateAmount = ev.target.value;
  }

  getTotalBuffs() {
    let totalBuff = this.activeCounters.reduce((memo: any, counter: any) => {
      let itemBuff = this.getItemBuff(counter, 7);
      memo = memo + itemBuff;
      return memo;
    }, 0);
    return totalBuff;
  }

  getNegatedTotal() {
    let x = this.getTotalBuffs() * parseFloat(this.negateAmount);
    //console.log('x', x, this.negateAmount);
    return x;
  }

  getItemBuff(counter: any, tier: any){
    if (counter == 'banner'){
      return this.getBannerBuff(tier);
    } else if (counter == 'knight_statue'){
      return this.getKsSpeed(tier);
    } else {
      return this.counters[counter].buff;
    }
  }

  getKsSpeed(tier: any) {
    let cardLevel = this.counters.knight_statue.cardLevel;
    let minLevel = this.levels[0];
    let manaBonus = 10 + (cardLevel - minLevel);
    let speed =  manaBonus + ((cardLevel + 3) * tier);
    return speed;
  }

  getBannerBuff(tier: any) {
    /*
      tier 1
      level 4 10.5
      level 5 11
      level 6 11.5
      level 7 12

      tier 2
      level 7 10.5+13.5
      l 8 10.5+14.5
      l 9 10.5+15.5

      tier 3
      l 1 10.5+2.5
      l 2 10.5+15.5
      l 9 10.5+28.5
    */
    let currentCardLevel = this.counters.banner.cardLevel;  
    let minCardLevel = this.levels[0];
    let baseAttackSpeed = 12;
    let tierMultiplier = 0.5;
    let newAttackSpeed = (baseAttackSpeed+((currentCardLevel-minCardLevel)* tierMultiplier))*tier;
    return newAttackSpeed;
  }

  getClockNeeded(buff: number) {
    let clocksNeeded = [];
    let translatedBuff = buff; // * parseFloat(this.negateAmount)
    for (let tier of this.tiers) {
      if (clocksNeeded.length < 3) {
        let tierOneClock = Math.abs(this.getAttackSpeedReduction(this.activeClockLevel, tier));
        
        let numclocksNeeded = Math.ceil(translatedBuff / tierOneClock);
        if (numclocksNeeded < this.maxClockTiles) {
          if (clocksNeeded.length == 1) {
            let lastNum = parseInt(clocksNeeded[0].split(' ')[0]);
            if (lastNum != numclocksNeeded) {

              clocksNeeded.push(`${numclocksNeeded}x T${tier}s`);
            }
          } else {

            clocksNeeded.push(`${numclocksNeeded}x T${tier}s`);
          }
        }
      }
    }
    if (clocksNeeded.length == 0){
      clocksNeeded.push(`Level ${this.activeClockLevel} Clock can't negate ${translatedBuff}%`);
    }
    return clocksNeeded;
  }

  getAttackSpeedReduction(cardLevel: any, minTierLevel: any) {
    let clockMultiplier = 0.15;
    let clockMaxManaReduction = 4;
    let clockBaseAttackSpeedReduction = 2;
    let baseTierBonus = clockMaxManaReduction + (minTierLevel - 1);
    let cardTierBonus = (minTierLevel + 1) * clockMultiplier * (cardLevel - this.levels[0]);
    let combinedBonus = (baseTierBonus + cardTierBonus);
    //console.log('results', 'baseTierBonus', baseTierBonus, 'cardTierBonus', cardTierBonus, 'combinedBonus', combinedBonus);
    let attackSpeedReduction = (clockBaseAttackSpeedReduction + combinedBonus) * -1;
    return attackSpeedReduction;
  }

  changeCounterCardLevel(ev: any, counter: any) {
    this.counters[counter].cardLevel = parseInt(ev.target.value);
  }

  changeClockTiles(ev: any) {
    this.maxClockTiles = parseInt(ev.target.value);
  }
  changeClockLevel(ev: any) {
    this.activeClockLevel = ev.target.value;
  }

  setActiveCounter(ev: any, counter: string) {
    let counterIndex = this.activeCounters.indexOf(counter);
    if (counterIndex == -1) {
      this.activeCounters.push(counter);
    } else {
      this.activeCounters.splice(counterIndex, 1);
    }
    ev.target.style.opacity = counterIndex == -1 ? 1 : 0.5;
  }

  /*
    level 7: 1
    level 8: 1.15
    level 9: 1.3
    level 10: 1.45
  */
  /*

  tier 2 level 7: 5
  tier 2 level 8: 5.45 (0.45)
  tier 2 level 9: 5.9 (0.45)
  level 10: 6.35 (0.45)

  tier 3 level 8: 6.6 (0.6)
  tier 3 level 9: 7.2 (0.6)
  tier 3 level 10: 7.8 (0.6)

  tier 4 level 8 7.75 (0.75)
  tier 4 level 9 8.5 (0.75)
  tier4 level 10 9.25 (0.75)

  level 7 base -2 max mana
  tier 1 -2-4
  2 -2-5
  3 -2-6

    level 8 base -2.3 max mana 
    tier 1 -2.3-4
    2 -2.3-5.15
    3 6.3
    4 7.45
    5 8.6
    6 9.75 (1.15)
    7 10.9 (1.15)

    level 9 base -2.3 max mana
    tier 1 -2.3-4.3 (1.3)
    2 -2.3-5.6 (1.3)
    3 -2.3-6.9 (1.3)

  */
}
