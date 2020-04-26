import { withPluginApi } from "discourse/lib/plugin-api";
import Unit, { getUnitDefinitions } from "../lib/units";

/**
 * Builds a regex to match all units (like "42.1 kgs").
 *
 * @return {RegExp}
 */
function buildUnitsRegex() {
  const units = Object.keys(getUnitDefinitions())
    .sort((a, b) => b.length - a.length)
    .join("|");

  return new RegExp("([0-9.,]+)\\s*(" + units + ")s?", "gi");
}

function getHtmlTooltip(value, unit) {
  const source = Unit.build(value, unit);
  if (!source) {
    return;
  }

  // Convert to all other units of same type
  let targets = Object.values(getUnitDefinitions())
    .map(target => {
      if (source.unit.type === target.type) {
        return source.to(target);
      }
    })
    .filter(Boolean);

  // Select the best conversion per scale
  const byScale = {};
  targets.forEach(target => {
    let otherTarget = byScale[target.unit.scale];
    if (
      !otherTarget ||
      // biggest / closest under 1
      (otherTarget.value < 1 && otherTarget.value < target.value) ||
      // smallest over 1
      (target.value >= 1 && otherTarget.value > target.value)
    ) {
      byScale[target.unit.scale] = target;
    }
  });
  targets = Object.values(byScale);

  // Add source unit if it is not there yet
  if (!targets.some(t => t.unit === source.unit)) {
    targets.unshift(source);
  }

  // It does not make sense showing tooltip if no conversion happened
  if (targets.length <= 1) {
    return;
  }

  // Keep source unit at the beginning
  targets = targets.sort(x => (x.unit === source.unit ? -1 : 1));

  return targets.map(t => t.toString()).join(" &harr; ");
}

function addTooltipsToNode(regex, node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    for (let i = 0; i < node.childNodes.length; ++i) {
      const oldLength = node.childNodes.length;
      if (addTooltipsToNode(regex, node.childNodes[i])) {
        // Skip nodes inserted recursively
        i += node.childNodes.length - oldLength;
      }
    }
    return;
  }

  const newValue = node.nodeValue.replace(regex, (string, value, unit) => {
    const tooltip = getHtmlTooltip(value, unit);
    return tooltip
      ? `<span class='units' data-html-tooltip="${tooltip}">${string}</span>`
      : string;
  });

  if (node.nodeValue !== newValue) {
    $(node).replaceWith(newValue);
    return true;
  }
}

export default {
  name: "discourse-units",

  initialize() {
    const regex = buildUnitsRegex();

    withPluginApi("0.8.40", api => {
      api.decorateCooked($elem => addTooltipsToNode(regex, $elem[0]), {
        id: "discourse-units"
      });
    });
  }
};
