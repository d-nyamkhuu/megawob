const BINS_RECTS = {
  single: [{ x: 0.58, y: 0.25, w: 0.34, h: 0.5 }],
  collect: [{ x: 0.04, y: 0.06, w: 0.34, h: 0.5 }, { x: 0.62, y: 0.06, w: 0.34, h: 0.5 }],
  sort: [{ x: 0.6, y: 0.04, w: 0.36, h: 0.29 }, { x: 0.6, y: 0.355, w: 0.36, h: 0.29 }, { x: 0.6, y: 0.67, w: 0.36, h: 0.29 }],
};
env.traitTests.derive('sort-into-bins', [
  { name: 'central-12', base: 'boxes', scenarios: ['single', 'collect'], traits: { layout: 'central', itemCount: 12 } },
  { name: 'rows-above', base: 'boxes', scenarios: ['single', 'collect', 'sort'], traits: { layout: 'rows', itemsAt: 'above' } },
  // palette (collect): blue targets, black and outline-only distractors; the reference boxes widget draws color 'black' and fill 'outline'.
  { name: 'palette', base: 'boxes', scenarios: ['collect'], traits: { palette: { target: 'blue', distractors: ['black', 'outline'] } } },
  { name: 'palette-central', base: 'boxes', scenarios: ['collect'], traits: { palette: { target: 'blue', distractors: ['black', 'outline'] }, layout: 'central', itemCount: 12 } },
  { name: 'items-left', base: 'boxes', scenarios: ['single', 'collect', 'sort'], traits: { itemsAt: 'left' } },
  { name: 'items-right-grid', base: 'boxes', scenarios: ['collect', 'sort'], traits: { itemsAt: 'right', orient: 'grid' } },
  { name: 'column-below', base: 'boxes', scenarios: ['collect', 'sort'], traits: { layout: 'rows', orient: 'column' } },
  { name: 'declared-rows', base: 'boxes', scenarios: ['single', 'collect', 'sort'], traits: { layout: 'rows', containers: BINS_RECTS } },
  { name: 'declared-scatter', base: 'boxes', scenarios: ['collect', 'sort'],
    traits: { containers: { collect: [{ x: 0.3, y: 0.3, w: 0.4, h: 0.45 }], sort: [{ x: 0.04, y: 0.5, w: 0.4, h: 0.44 }, { x: 0.56, y: 0.05, w: 0.4, h: 0.44 }] } } },
]);
