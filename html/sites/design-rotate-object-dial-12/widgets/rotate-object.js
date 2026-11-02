// Site design on the rotate/dial template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-dial-12', name: 'design', split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    forceReadout: false,
    dialSize: null,
    titleUnits: true,
    unitCaption: false,
    tickUnits: 'px',
    tickRadii: [8, 22, 15, 40],
    stops: [['0%', 'var(--panel)'], ['100%', 'color-mix(in srgb, var(--line) 70%, var(--panel))']],
    bevelStops: null,
    knobStroke: 'var(--line)',
    knobStrokeWidth: 2,
    rimRatio: .88,
    needleScale: null,
    needleCap: 'round',
  },
});
