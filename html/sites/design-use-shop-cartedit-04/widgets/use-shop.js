// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-cartedit-04',
  name: 'design',
  split: 'train',
  scenarios: ['cartedit'],
  template: 'use-shop/base',
  design: {
    parts: {
      // Drawings for this design's products, checked before the template's.
      'productDrawing': (base) => (text, kind, ink, pale) => {
        if (/roller/.test(text)) return `<g transform="rotate(-17 80 64)"><rect x="27" y="39" width="106" height="50" rx="19" fill="${ink}"/><path d="M36 42v44m12-47v48m12-49v50m12-50v50m12-50v50m12-50v50m12-49v48m12-45v42" stroke="${pale}" stroke-width="3" opacity=".75"/><ellipse cx="30" cy="64" rx="8" ry="24" fill="${pale}" stroke="${ink}" stroke-width="4"/></g>`;
        if (/pickleball|paddle/.test(text)) return `<g transform="rotate(28 80 64)"><path d="M48 25q32-13 50 13 13 20-4 43L70 108q-9 9-18 0L26 81Q10 59 24 41Z" fill="#252525" stroke="${ink}" stroke-width="5"/><path d="m56 83 22 24-12 12-22-24Z" fill="${ink}"/><path d="M95 31q31-10 43 17 8 20-9 39l-24 23q-9 8-17-1L66 82q-14-20 0-37Z" fill="#333" stroke="#bd5a48" stroke-width="5"/><circle cx="35" cy="97" r="7" fill="#efce36"/><circle cx="48" cy="108" r="7" fill="#efce36"/><circle cx="132" cy="97" r="7" fill="#efce36"/></g>`;
        if (/snorkel|goggle|mask/.test(text)) return `<path d="M20 59q20-31 58-13 39-18 62 13l-7 30q-4 12-17 9L93 84q-13-7-28 0L39 98q-14 5-17-9Z" fill="#d8e0e2" stroke="${ink}" stroke-width="7"/><path d="M28 61q19-24 47-9v27Q56 73 40 91Zm57-9q31-17 48 9l-12 30Q105 73 85 79Z" fill="#6d9ab2" stroke="#222" stroke-width="4"/><path d="M112 58q21-23 15-43" fill="none" stroke="#222" stroke-width="7"/><path d="M124 14q13 4 13 16" fill="none" stroke="${ink}" stroke-width="5"/>`;
        if (/backpack|rucksack/.test(text)) return `<path d="M59 32q1-18 21-18t21 18" fill="none" stroke="${ink}" stroke-width="7"/><path d="M49 34q31-15 62 0l13 61q-1 12-13 12H49q-12 0-13-12Z" fill="${ink}"/><path d="M49 65h62v29H49Z" fill="#68734b" stroke="${pale}" stroke-width="3"/><path d="M64 45v53m33-53v53M48 75h64" stroke="${pale}" stroke-width="3"/><rect x="72" y="72" width="16" height="9" rx="2" fill="#ddd"/>`;
        if (/glove/.test(text)) return `<path d="M49 99 34 58q-3-10 5-12 7-2 11 8l8 17-10-39q-2-10 6-12 8-1 10 8l8 34-3-44q0-10 8-10t8 10l1 44 6-34q2-9 10-7 7 2 5 11l-4 34 10-18q5-8 12-3 6 5 1 13l-19 37q-9 17-25 17H67q-12 0-18-13Z" fill="${ink}" stroke="#333" stroke-width="3"/>`;
        if (/kettlebell/.test(text)) return `<path d="M57 51V39q0-25 23-25t23 25v12" fill="none" stroke="#333" stroke-width="12"/><path d="M45 56q4-14 35-14t35 14l10 43q2 14-14 14H49q-16 0-14-14Z" fill="${ink}"/><path d="M49 65h62" stroke="${pale}" stroke-width="4"/>`;
        return base(text, kind, ink, pale);
      },
      'shoppingLineProduct': (base, S) => function (view, m, l, status, p, row) {
        const { util, cash, art } = view;
        const top = util.el('div', 'ax-line-top', row);
        art(top, false, p);
        const info = util.el('div', '', top);
        util.el('b', '', info, p.name);
        util.el('div', 'ax-muted', info, `${p.sku} · ${cash(p.price)} each`);
        util.el('span', 'ax-line-price', top, cash(p.price * l.qty));
        util.el('span', 'ax-tag', top, status === 'cart' ? 'In stock' : status === 'saved' ? 'Saved' : 'Removed');
      },
      'shoppingLineActions': (base, S) => function (view, m, l, status, p, row) {
        const { ctx, util, s, cash, link, qty, paint } = view;
        if (s.scenario === 'cartedit') {
          const actions = util.el('div', 'ax-actions', row);
          if (status !== 'removed') qty(actions, l.qty, `line:${l.id}`);
          if (status === 'cart') {
            const apply = util.el('button', 'as-btn sm ax-update', actions, 'Update');
            apply.type = 'button';
            apply.setAttribute('aria-label', `Update quantity for ${p.name}`);
            apply.addEventListener('click', () => paint(ctx.model));
          }
          if (status === 'cart') {
            link(actions, 'Save for later', `line:${l.id}:saved`);
            link(actions, 'Remove', `line:${l.id}:removed`);
          } else link(actions, status === 'saved' ? 'Move to bag' : 'Undo remove', `line:${l.id}:cart`);
        } else util.el('div', 'ax-muted', row, `Quantity ${l.qty} · ${cash(p.price * l.qty)}`);
      },
      'shoppingCartFooter': (base, S) => function (view, m) {
        const { iconLabel, serviceDetails } = S;
        const { util, pane } = view;
        if (!m.lines.some((l) => l.status === 'saved')) iconLabel(util, pane, 'heart', 'Saved for later: no items yet');
        serviceDetails(util, pane, 'Buying as a gift?', 'Gift receipts hide the price. Packaging and delivery options are available before you pay.');
      },
      'shoppingSummaryAfter': (base, S) => function (view, m) {
        const { recommendations } = S;
        const { ctx, util, s, cash, summary, link, art } = view;
        if (s.scenario === 'cartedit') {
          const saved = util.el('section', 'ax-inspector-panel ax-saved-panel', summary);
          util.el('h3', '', saved, `Saved for Later (${m.lines.filter((l) => l.status === 'saved').length})`);
          const savedLines = m.lines.filter((l) => l.status === 'saved');
          if (!savedLines.length) util.el('div', 'ax-saved-empty', saved, 'No saved items yet.');
          savedLines.forEach((l) => {
            const p = s.products[l.id], row = util.el('div', 'ax-saved-line', saved);
            art(row, false, p);
            const info = util.el('div', 'ax-saved-info', row);
            util.el('b', '', info, p.name);
            util.el('span', '', info, `${cash(p.price)} · Qty ${l.qty}`);
            link(info, 'Move to bag', `line:${l.id}:cart`);
          });
          recommendations(ctx, summary, 'You Might Also Like');
        }
      },
      'SHOPPING_STATUSES': () => (['cart', 'removed']),
    },
  },
});
