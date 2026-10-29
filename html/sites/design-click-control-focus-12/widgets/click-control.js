// Design of this site on click-control/controls: labels a single real field as “Textbox:”.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-12',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      fieldLabel: (base, S) => (ctx, fld, f, i, id) => {
        const label = ctx.util.el('label', '', fld, S.spec.fields.length === 1 ? 'Textbox:' : i + 1 + '.  ' + f.label + ':');
        label.htmlFor = id;
        return label;
      },
    },
  },
});
