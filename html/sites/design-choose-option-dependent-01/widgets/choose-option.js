// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario (it was scaffolded
// from it), with a contact form drawn below the widget (the scaffold's wrapper wrapped the sub-widget's render).
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dependent-01',
  name: 'design',
  split: 'train',
  scenarios: ['dependent'],
  template: 'choose-option/base',
  design: {
    widget: 'widgets',
    parts: {
      'widgets.render': (base) => function (ctx) {
        const result = base(ctx);
        const u = ctx.util, stage = ctx.stage, form = u.el('section', 'ds-contact-form', stage);
        const row = (parent, items, wide) => {
          const r = u.el('div', 'ds-form-row' + (items.length > 1 ? ' split' : ''), parent);
          items.forEach(([k, v]) => {
            const f = u.el('label', 'ds-form-field' + (wide ? ' wide' : ''), r);
            u.el('b', '', f, k + ':');
            u.el('span', 'ds-form-value', f, v);
          });
        };
        row(form, [['First Name', 'Maria'], ['Last Name', 'Diaz']]);
        row(form, [['Company', 'Soluciones S.A.']], true);
        row(form, [['Phone', '(55) 555-0187'], ['Email', 'maria.diaz@soluciones.mx']]);
        u.el('div', 'ds-form-separator', form);
        return result;
      },
    },
  },
});
