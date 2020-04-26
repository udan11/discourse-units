export default [
  // Metric
  {
    type: "length",
    scale: "metric",
    symbols: ["mm", "millimeter"],
    si: 1 / 1000
  },

  {
    type: "length",
    scale: "metric",
    symbols: ["cm", "centimeter"],
    si: 1 / 100
  },

  {
    type: "length",
    scale: "metric",
    symbols: ["m", "meter"],
    si: 1
  },

  {
    type: "length",
    scale: "metric",
    symbols: ["km", "kilometer"],
    si: 1000
  },

  // Imperial
  {
    type: "length",
    scale: "imperial",
    symbols: ["in", "inch", '"'],
    si: 1 / 39.3701
  },

  {
    type: "length",
    scale: "imperial",
    symbols: ["yd", "yard"],
    si: 1 / 1.09361
  },

  {
    type: "length",
    scale: "imperial",
    symbols: ["ft", "foot", "feet", "'"],
    si: 1 / 3.28084
  },

  {
    type: "length",
    scale: "imperial",
    symbols: ["mi", "miles"],
    si: 1609.34
  }
];
