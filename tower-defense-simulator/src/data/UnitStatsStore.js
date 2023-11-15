// src/data/UnitStatsStore.js


import banner from './tontoro/banner.json';
import bladeDancer from './tontoro/blade_dancer.json';
import boreas from './tontoro/boreas.json';
import bruiser from './tontoro/bruiser.json';
import chemist from './tontoro/chemist.json';
import crystalmancer from './tontoro/crystalmancer.json';
import cultist from './tontoro/cultist.json';
import demonHunter from './tontoro/demon_hunter.json';
import dryad from './tontoro/dryad.json';
import enchantedSword from './tontoro/enchanted_sword.json';
import engineer from './tontoro/engineer.json';
import grindstone from './tontoro/grindstone.json';
import harlequin from './tontoro/harlequin.json';
import inquisitor from './tontoro/inquisitor.json';
import knightStatue from './tontoro/knight_statue.json';
import monk from './tontoro/monk.json';
import pyrotechnic from './tontoro/pyrotechnic.json';
import robot from './tontoro/robot.json';
import scrapper from './tontoro/scrapper.json';
import sentry from './tontoro/sentry.json';
import trapper from './tontoro/trapper.json';
import witch from './tontoro/witch.json';

class UnitStatsStore {
    constructor() {
        if (UnitStatsStore.instance) {
            return UnitStatsStore.instance;
        }

        this.unitStats = {
            'Pyrotechnic': pyrotechnic,
            'Inquisitor': inquisitor,
            'Boreas': boreas,
            'Sentry': sentry,
            'Cultist': cultist,
            'BladeDancer': bladeDancer,
            'Crystalmancer': crystalmancer,
            'DemonHunter': demonHunter,
            'Bruiser': bruiser,
            'Chemist': chemist,
            'Dryad': dryad,
            'Sword': enchantedSword,
            'Engineer': engineer,
            'Grindstone': grindstone,
            'Harlequin': harlequin,
            'KnightStatue': knightStatue,
            'Monk': monk,
            'Robot': robot,
            'Scrapper': scrapper,
            'Trapper': trapper,
            'Witch': witch,
            'Banner': banner
            // Add other units here
        };
        

        UnitStatsStore.instance = this;
    }

    getUnitStats(unitName) {
        return UnitStatsStore.instance.unitStats[unitName];
    }
}

export default new UnitStatsStore();
