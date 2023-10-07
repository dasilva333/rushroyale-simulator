import { availableUnits } from '../data/UnitClasses';

export { availableUnits };

export function rehydrateUnit(unitObject) {
    if (!unitObject) return null;
    const UnitClass = availableUnits.find(unit => unit.name === unitObject.name).class;
    return new UnitClass(unitObject);
}
