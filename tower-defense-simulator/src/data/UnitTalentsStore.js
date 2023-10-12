import InquisitorTalents from './talents/Inquisitor.json';
import DemonHunterTalents from './talents/DemonHunter.json';
import CrystalmancerTalents from './talents/Crystalmancer.json';
import MonkTalents from './talents/Monk.json';
import BoreasTalents from './talents/Boreas.json';
import KnightStatueTalents from './talents/Knight_Statue.json';

class UnitTalentsStore {
    constructor() {
        if (UnitTalentsStore.instance) {
            return UnitTalentsStore.instance;
        }

        this.availableTalents = [
            InquisitorTalents,
            DemonHunterTalents,
            CrystalmancerTalents,
            MonkTalents,
            BoreasTalents,
            KnightStatueTalents
        ];
        this.selectedTalents = {}; // Initialize selectedTalents

        UnitTalentsStore.instance = this;
    }

    setSelectedTalents(unitName, talents) {
        this.selectedTalents[unitName] = talents;
    }

    isTalentSelected(unitName, talentName) {
        return this.selectedTalents[unitName] && this.selectedTalents[unitName][talentName] && this.selectedTalents[unitName][talentName].selected;
    }

    getTalents(unitName) {
        return this.availableTalents.find(t => t.name === unitName)?.talents || [];
    }

    getDefaultTalentState(unitName) {
        const unitTalentData = this.availableTalents.find(t => t.name === unitName);
        if (!unitTalentData) return {};

        let defaultState = {};
        unitTalentData.talents.forEach(talentGroup => {
            talentGroup.forEach((talent, index) => {
                defaultState[talent.name] = { selected: index === 0 };
                if (talent.extraFields) {
                    talent.extraFields.forEach(field => {
                        defaultState[talent.name][field.name] = field.default;
                    });
                }
            });
        });
        return defaultState;
    }
}

const talentsStore = new UnitTalentsStore();
export default talentsStore;
