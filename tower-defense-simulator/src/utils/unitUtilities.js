import { availableUnits } from '../data/UnitClasses';

export { availableUnits };

export function rehydrateUnit(unitObject) {
    if (!unitObject) return null;
    const unitRef = availableUnits.find(unit => unit.name === unitObject.name);
    const UnitClass = unitRef.class;
    const UnitComponent = unitRef.component;
    return {component: UnitComponent, class: new UnitClass(unitObject)};
}
