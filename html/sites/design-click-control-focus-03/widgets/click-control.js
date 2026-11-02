// Design of this site on click-control/controls: restores its field-count page sizing.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-03',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      focusStart: () => (ctx, content) => {
        content.closest('.nb-page').style.setProperty('--field-count', ctx.spec.fields.length);
      },
    },
  },
});
