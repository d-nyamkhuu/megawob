// Design of this site on click-control/controls: numbered focus fields, a decorative band, and five visible rows.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-02',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    intro: null,
    parts: {
      focusForm: () => (ctx, form) => {
        ctx.util.el('div', 'form-band', form);
      },
      fieldLabel: () => (ctx, fld, f, i, id) => {
        const label = ctx.util.el('label', '', fld, i + 1 + '.');
        label.htmlFor = id;
        return label;
      },
      fieldAria: () => (f) => f.label,
      decoyLabel: () => (ctx, row, i) => ctx.util.el('label', '', row, i + 1 + '.'),
      extraRows: () => () => 5,
      focusMore: () => () => {},
    },
  },
});
