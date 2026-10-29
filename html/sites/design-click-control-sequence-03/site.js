(function () {
  'use strict';
  const ROWS = [
    ['1', '2024-11-01', 'Office Supplies', 'Office', '-$48.20', 'Posted'],
    ['2', '2024-11-02', 'Client Payment', 'Income', '$1,250.00', 'Posted'],
    ['3', '2024-11-03', 'Cloud Hosting', 'Tech', '-$89.99', 'Posted'],
    ['4', '2024-11-04', 'Travel Expense', 'Travel', '-$320.00', 'Pending'],
    ['5', '2024-11-05', 'Software License', 'Tech', '-$120.00', 'Posted'],
    ['6', '2024-11-06', 'Marketing Ads', 'Marketing', '-$215.40', 'Posted'],
    ['7', '2024-11-07', 'Consulting Fee', 'Income', '$980.00', 'Posted'],
    ['8', '2024-11-08', 'Team Lunch', 'Meals', '-$67.35', 'Pending'],
  ];
  const HEAD = ['#', 'Date', 'Description', 'Category', 'Amount', 'Status'];
  const FILTERS = [
    ['Date range', 'Last 30 days'],
    ['Category', 'All'],
    ['Status', 'All'],
  ];
  env.site({
    name: 'design-click-control-sequence-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref neo';
      const shell = u.el('main', 'shell', document.body);
      const note = u.el('div', 'instruction', shell, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.instruction.length > 48) note.classList.add('long-instruction');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const ledger = u.el('section', 'panel ledger', shell);
      const lh = u.el('div', 'panel-head', ledger);
      u.el('span', '', lh, 'LEDGER (Transactions)');
      u.el('small', '', lh, '8 items');
      const tbl = u.el('table', '', u.el('div', 'panel-body', ledger));
      const thead = u.el('thead', '', tbl);
      const hr = u.el('tr', '', thead);
      HEAD.forEach((h, i) => {
        const th = u.el('th', i === 4 ? 'num' : '', hr, h);
      });
      const tb = u.el('tbody', '', tbl);
      ROWS.forEach((r) => {
        const tr = u.el('tr', '', tb);
        r.forEach((c, i) => u.el('td', i === 4 ? 'num' : '', tr, c));
      });
      const filters = u.el('section', 'panel filters', shell);
      const filterHead = u.el('div', 'panel-head', filters, 'FILTERS');
      const fb = u.el('div', 'filter-body', filters);
      FILTERS.forEach((f) => {
        const g = u.el('div', 'fgroup', fb);
        u.el('label', '', g, f[0]);
        const s = u.el('div', 'fake-select', g);
        u.el('span', '', s, f[1]);
        u.el('i', '', s);
      });
      const actions = u.el('section', 'panel actions', shell);
      const actionsHead = u.el('div', 'panel-head', actions, 'ACTIONS');
      const ab = u.el('div', 'actions-body', actions);
      const stage = u.el('div', 'stage', ab);
      const row = u.el('div', 'submit-row', ab);
      const dec = u.el('button', 'fake-btn', row, 'Refresh');
      dec.type = 'button';
      dec.addEventListener('click', () => env.log('decoy', { label: 'Refresh' }));
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const placement = ctx.finish ? 'action' : endR.pick(['action', 'action', 'filters', 'actions']);
      if (ctx.finish || placement !== 'action') row.classList.add('solo-control');
      const endLabels = ctx.content && ctx.content.END_LABELS;
      const labels =
        endLabels && endLabels.length
          ? endLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const submitLabel =
        labels.find(
          (x) =>
            String(x.label || x.text || x.name || x)
              .trim()
              .toLowerCase() === 'submit',
        ) || 'Submit';
      const otherLabels = labels.filter(
        (x) =>
          String(x.label || x.text || x.name || x)
            .trim()
            .toLowerCase() !== 'submit',
      );
      const endLabel =
        !ctx.finish && endR.bool(0.5) && submitLabel
          ? submitLabel
          : otherLabels.length
            ? endR.pick(otherLabels)
            : submitLabel;
      const collision = ctx.finish
        ? null
        : collideR.bool(0.3)
          ? collideR.pick(
              (endLabels && endLabels.length
                ? endLabels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
              ).filter(
                (x) =>
                  String(x.label || x.text || x)
                    .trim()
                    .toLowerCase() !==
                  String(endLabel.label || endLabel.text || endLabel)
                    .trim()
                    .toLowerCase(),
              ),
            )
          : null;
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endParent = placement === 'filters' ? filterHead : placement === 'actions' ? actionsHead : row;
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, endParent, labelText(endLabel));
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      if (collision) {
        const host = placement === 'filters' ? actionsHead : filterHead;
        const b = u.el('button', 'fake-btn collide', host, labelText(collision));
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: labelText(collision), collide: true }));
      }
      const prev = u.el('section', 'panel preview', shell);
      u.el('div', 'panel-head', prev, 'PREVIEW');
      const pb = u.el('div', 'preview-body', prev);
      u.el('p', '', pb, 'No transaction selected.\nSelect a row from the ledger\nto see details here.');
      pb.insertAdjacentHTML(
        'beforeend',
        '<svg aria-hidden="true" viewBox="0 0 80 96"><path d="M9 3h47l20 20v64q0 6-6 6H9q-6 0-6-6V9q0-6 6-6Z"/><path d="M56 3v20h20" fill="#808080"/><path d="M21 38h38M21 52h38M21 66h25" fill="none"/></svg>',
      );
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
