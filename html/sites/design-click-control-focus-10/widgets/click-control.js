// Design of this site on click-control/controls: numbers the real fields and keeps a compact set of numbered decoys.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-10',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      fieldLabel: () => (ctx, fld, f, i, id) => {
        const lab = ctx.util.el('label', '', fld, i + 1 + '.');
        lab.title = f.label;
        lab.htmlFor = id;
        return lab;
      },
      fieldAria: () => (f, i) => i + 1 + '. ' + f.label,
      focusExtras: () => (ctx, form) => {
        const { spec, util } = ctx;
        for (let i = spec.fields.length; i < (spec.fields.length === 1 ? 1 : 5); i++) {
          const row = util.el('div', 'uc-field xtra-field', form);
          util.el('label', '', row, i + 1 + '.');
          const input = util.el('input', 'uc-input', row);
          input.type = 'text';
          input.readOnly = true;
          input.tabIndex = -1;
        }
      },
    },
  },
});
