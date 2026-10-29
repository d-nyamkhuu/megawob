env.traitTests.derive('set-date', [
  { name: 'split-cals', base: 'calendar', scenarios: ['range'], traits: { splitCals: true } },
  { name: 'range-inline', base: 'calendar', scenarios: ['range'], traits: { inline: true } },
  { name: 'time-dropdowns', base: 'calendar', scenarios: ['time'], traits: { timeControls: ['dropdowns'] } },
  // sceneRows: 8 unscored rows around the field (the calendar widget draws spec.scene.extra above and below it).
  { name: 'scene-rows', base: 'calendar', scenarios: ['calendar', 'typed', 'time', 'range', 'duration'], traits: { sceneRows: 8 } },
  { name: 'typed-either', base: 'calendar', scenarios: ['typed'], traits: { typedFormat: 'either' } },
]);
