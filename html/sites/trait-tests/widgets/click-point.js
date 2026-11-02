(function () {
  const placed = ['center', 'midpoint', 'bisect', 'right-angle', 'path-mid', 'dense'];
  env.traitTests.derive('click-point', [
    { name: 'arc', base: 'board', scenarios: ['center'], traits: { shapes: ['arc'] } },
    { name: 'horizontal', base: 'cad', scenarios: ['midpoint', 'bisect', 'right-angle'], traits: { orient: 'horizontal', exclusion: 7 } },
    // Board geometry: aspect (every scenario) and placement (the figure confined to a part of the board; axis / map ignore it).
    { name: 'wide', base: 'board', traits: { aspect: [1.9, 2.2] } },
    { name: 'square-left', base: 'cad', scenarios: placed, traits: { aspect: 1, placement: 'left' } },
    { name: 'placement-right', base: 'board', traits: { placement: 'right' } },
    { name: 'center-narrow', base: 'board', scenarios: placed, traits: { aspect: [1, 1.3], placement: 'center' } },
    { name: 'panel-rect', base: 'cad', scenarios: placed, traits: { aspect: 2, placement: { x: 0.45, y: 0.05, w: 0.5, h: 0.6 } } },
  ]);
})();
