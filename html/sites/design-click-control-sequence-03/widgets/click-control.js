// This design keeps the sequence controls' original positional decoy labels.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-03',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      seqDecoyLabel: (base, S) => (ctx, k, labels, j) => {
        const preferred = ['', '', 'Export', 'Archive', 'Delete', 'Flag'][j];
        if (preferred && !ctx.spec.buttons.some((button) => button.label === preferred)) return preferred;
        return labels[k] || 'Preferences';
      },
    },
  },
});
