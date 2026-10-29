env.traitTests.derive('draw-shape', [
  { name: 'guides', base: 'canvas', scenarios: ['trace', 'circle'], traits: { guide: ['wave', 'both'] } },
  // Board geometry: aspect (every scenario) and placement (the figure in a part of the board; connect / erase ignore it).
  { name: 'narrow-left', base: 'canvas', traits: { aspect: [0.8, 1.1], placement: 'left' } },
  { name: 'wide-bottom', base: 'whiteboard', traits: { aspect: 2.4, placement: 'bottom' } },
  { name: 'square-center', base: 'chalkboard', traits: { aspect: 1, placement: 'center' } },
  { name: 'panel-rect', base: 'canvas', traits: { aspect: 2, placement: { x: 0.5, y: 0.05, w: 0.45, h: 0.7 } } },
  { name: 'atlas-right', base: 'atlas', traits: { aspect: [1.2, 1.6], placement: 'right' } },
]);
