// Design of this site on click-control/controls: adds the form intro and numbered field captions.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-06',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    intro: 'Please complete the form below. Fields marked with * are required.',
    extras: ['First Name *', 'Last Name *', 'Email Address', 'Phone Number'],
    parts: {
      fieldLabel: (base) => (ctx, fld, f, i, id) => {
        const lab = ctx.util.el('label', '', fld);
        ctx.util.el('span', 'field-ordinal', lab, i + 1 + '.');
        ctx.util.el('span', 'field-caption', lab, f.label + ':');
        lab.htmlFor = id;
        return lab;
      },
    },
  },
});
