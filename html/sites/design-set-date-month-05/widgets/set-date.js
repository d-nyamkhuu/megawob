// Design on templates/set-date/base.js: the base site's set-date widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-date',
  site: 'design-set-date-month-05',
  name: 'design',
  split: 'train',
  scenarios: ['month'],
  template: 'set-date/base',
  design: { parts: {
    renderCard: (base, S) => function (ctx, look) {
      const result = base(ctx, look);
      const card = S.card;
      const first = card.querySelector('.fd-row');
      const type = ctx.util.el('div', 'fd-row fd-report-type', null);
      ctx.util.el('div', 'fd-label', type, 'Report type:');
      ctx.util.el('div', 'fd-static fd-choice', type, 'Sales Summary');
      card.insertBefore(type, first);
      const details = ctx.util.el('div', 'fd-row fd-details', card);
      ctx.util.el('div', 'fd-label', details, 'Include details:');
      const value = ctx.util.el('label', 'fd-details-value', details);
      const check = ctx.util.el('input', '', value);
      check.type = 'checkbox';
      ctx.util.el('span', '', value, 'Yes');
      S.sizePop(Math.min(350, S.control.offsetWidth), 316);
      return result;
    },
    fieldRow: (base, S) => function (parent, label, help, util) {
      const row = util.el('div', 'fd-row', parent);
      util.el('label', 'fd-label' + (label.length > 13 ? ' fd-label-long' : ''), row, label + ':');
      return { row, help: help === null ? null : util.el('div', 'fd-help', null, help) };
    },
    staticRow: (base, S) => function (parent, values, util) {
      const row = util.el('div', 'fd-row fd-ex', parent);
      util.el('div', 'fd-label', row, values[0].replace(/:$/, '') + ':');
      util.el('div', 'fd-static fd-choice', row, values[1]);
    },
  } },
});
