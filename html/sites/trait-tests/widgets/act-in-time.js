env.traitTests.derive('act-in-time', [
  { name: 'moving-triangles', base: 'arena', scenarios: ['moving'],
    traits: { moving: { shapes: ['circle', 'square', 'triangle'], items: 9 } } },
  // Upright board (traits.orient 'vertical'): moving's lanes are columns, chase sweeps a tall board.
  { name: 'vertical', base: 'arena', scenarios: ['chase', 'moving'], traits: { orient: 'vertical' } },
  // A fixed hold timer (traits.countdown { hold }): a reference showing 00:18 on its countdown.
  { name: 'countdown-hold', base: 'arena', scenarios: ['countdown'], traits: { countdown: { hold: 18000 } } },
]);
