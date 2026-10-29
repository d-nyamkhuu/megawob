// This sequence design wraps long button labels and logs clicks on decorative decoys.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-04',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      seqButton: (base) => (ctx, s, e, i) => {
        const b = base(ctx, s, e, i);
        if (e.label.length > 8) {
          b.style.fontSize = `clamp(10px,${14 / e.label.length}vw,31px)`;
          b.style.whiteSpace = 'normal';
        }
        return b;
      },
      seqDecoyMade: () => (ctx, el, label) => {
        el.addEventListener('click', () => env.log('decoy', { label }));
      },
    },
  },
});
