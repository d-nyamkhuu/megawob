env.traitTests.derive('resize-element', [
  { name: 'geometry', base: 'panel', scenarios: ['numeric', 'ghost'],
    traits: { geometry: { start: { w: [200, 240], h: [250, 290] }, target: { w: [260, 320], h: [300, 360] }, portrait: true, grow: true } } },
]);
