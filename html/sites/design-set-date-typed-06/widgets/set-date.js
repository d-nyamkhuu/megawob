// Keeps the typed date inside the site's entry form and adds its decorative fields and table.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-06',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  template: 'set-date/calendar',
  design: {
    typedContext: null,
    typedAux: null,
    typedReminder: false,
    parts: {
      buildTyped: (base, S) => (ctx) => {
        const { util } = ctx;
        const { card, geo, P } = S;
        const frow = util.el('div', 'fd-formrow', card);
        geo.body = frow;
        const shown = S.spec.maskShown || S.spec.mask;
        P.buildText(ctx, S.spec.mask, shown, `Format: ${shown}`);
        geo.body = card;

        const dateRow = frow.querySelector('.fd-row');
        dateRow.insertAdjacentHTML(
          'beforeend',
          '<svg class="fd-cal" viewBox="0 0 20 20" fill="none" stroke="#1c2321" stroke-width="1.6"><rect x="2" y="3.5" width="16" height="14" rx="1.5"/><path d="M2 8h16M6 1.5v4M14 1.5v4M6 11h1M10 11h1M14 11h1M6 14h1M10 14h1M14 14h1"/></svg>',
        );
        [
          ['Description', 'e.g., Birthday dinner', 2, ''],
          ['Category', 'Select a category', 3, '▾'],
          ['Amount', '0.00', 4, '$'],
        ].forEach(([label, placeholder, column, icon]) => {
          const box = util.el('div', 'fd-field', frow);
          box.style.gridColumn = String(column);
          util.el('div', 'fd-lab', box, label);
          const field = util.el('div', 'fd-fake' + (icon === '$' ? ' in' : ''), box);
          if (icon === '$') {
            util.el('span', '', field, '$');
            util.el('span', '', field, placeholder).style.color = '#9a9c98';
          } else {
            util.el('span', '', field, placeholder);
            if (icon) util.el('span', '', field, icon).style.color = '#1c2321';
          }
        });
        const actions = util.el('div', 'fd-actions', card);
        util.el('button', 'fd-btn2', actions, 'Add Entry').type = 'button';
        util.el('button', 'fd-btn2 gray', actions, 'Clear').type = 'button';
        const submit = document.querySelector('.ds-submit');
        if (submit) actions.appendChild(submit);
        const table = util.el('div', 'fd-table', card);
        const header = util.el('div', 'fd-th', table);
        ['Date', 'Description', 'Category', 'Amount'].forEach((heading) => util.el('span', '', header, heading));
        util.el('div', 'fd-empty', table, 'No entries yet.');
      },
    },
  },
});
