import DURATION_UNITS from "./definitions/duration";
import LENGTH_UNITS from "./definitions/length";
import MASS_UNITS from "./definitions/mass";

let UNITS = null;

export function getUnitDefinitions() {
  if (!UNITS) {
    UNITS = {};

    [DURATION_UNITS, LENGTH_UNITS, MASS_UNITS].forEach(units =>
      units.forEach(unit => {
        unit.symbols.forEach(symbol => {
          UNITS[symbol] = unit;
        });
      })
    );
  }

  return UNITS;
}

export default class Unit {
  constructor(value, unit) {
    this.value = value;
    this.unit = unit;
  }

  to(otherSymbolOrUnit) {
    const other = Unit.build(this.value * this.unit.si, otherSymbolOrUnit);
    if (other) {
      other.value /= other.unit.si;
      return other;
    }
  }

  toString() {
    return +this.value.toFixed(2) + " " + this.unit.symbols[0];
  }

  static build(value, symbolOrUnit) {
    value = Number(value);
    if (isNaN(value) || !symbolOrUnit) {
      return;
    }

    if (typeof symbolOrUnit === "string") {
      const units = getUnitDefinitions();
      symbolOrUnit = units[symbolOrUnit.toLowerCase()];
    }

    if (symbolOrUnit) {
      return new Unit(value, symbolOrUnit);
    }
  }
}
