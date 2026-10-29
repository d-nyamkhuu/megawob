env.traitTests.derive('rotate-object', [
  { name: 'ell-match', base: 'stage', scenarios: ['orient'], traits: { shapes: ['ell'], modes: ['match'] } },
  // grip 'hub': the reference stage widget draws a hub grip at the pivot (locate({ hub: true }) = the pivot, a press there sets the angle from the pointer).
  { name: 'hub-grip', base: 'stage', scenarios: ['orient'], traits: { grip: 'hub' } },
]);
