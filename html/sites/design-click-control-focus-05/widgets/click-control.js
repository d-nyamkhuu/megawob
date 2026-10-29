// Design of this site on the click-control/controls template (templates/click-control/controls.js): numbered labels set as two
// spans, and the intro and the read-only fields grouped in a block below the form.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-05',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    intro: null,
    parts: {
      fieldLabel: () => (ctx, fld, f, i, id) => {
        const lab = ctx.util.el('label', '', fld);
        ctx.util.el('span', 'field-number', lab, i + 1 + '.');
        ctx.util.el('span', 'field-name', lab, f.label);
        lab.htmlFor = id;
        return lab;
      },
      decoyLabel: () => (ctx, row, i, text) => {
        const label = ctx.util.el('label', '', row);
        ctx.util.el('span', 'field-number', label, i + 1 + '.');
        ctx.util.el('span', 'field-name', label, text);
        return label;
      },
      focusMore: (base) => (ctx, form) => {
        const supplementary = ctx.util.el('div', 'supplementary', form);
        ctx.util.el('p', 'form-intro', supplementary, 'Please complete the form below. Fields marked with * are required.');
        base(ctx, supplementary);
      },
    },
  },
});
