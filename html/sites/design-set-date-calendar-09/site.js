(function () {
  'use strict';
  const C = { 'site': 'design-set-date-calendar-09' };
  const ROWS = [
    ['100428', 'Ridgeway Schools', 'Science Kit', '5', '$24.00', 'Shipped', '07/28/2023'],
    ['100429', 'Lakeside Books', 'Atlas', '10', '$16.50', 'Processing', '07/29/2023'],
    ['100430', 'Maple Grove Clinic', 'First Aid Set', '8', '$12.00', 'Shipped', '07/30/2023'],
    ['100431', 'Turner Hardware', 'Tool Set', '4', '$27.75', 'Processing', '07/31/2023'],
    ['100432', 'Bayview University', 'Microscope', '2', '$89.00', 'Shipped', '08/01/2023'],
    ['100433', 'Pinecrest Library', 'World History CD', '6', '$14.95', 'Processing', '08/02/2023'],
    ['100434', 'Summit Outdoors', 'Compass', '12', '$9.50', 'Shipped', '08/03/2023'],
    ['100435', 'Clearview Elementary', 'Globe', '3', '$34.00', 'Processing', '08/04/2023'],
    ['100436', 'Harbor Medical', 'Stethoscope', '7', '$22.90', 'Shipped', '08/05/2023'],
    ['100437', 'Westlake College', 'Reference Set', '4', '$49.95', 'Processing', '08/06/2023'],
  ];
  const HEAD = ['Order #', 'Customer', 'Item', 'Qty', 'Unit Price', 'Status', 'Order Date'];
  const NAV = [
    ['house', 'Products'],
    ['people', 'Customers'],
    ['orders', 'Orders'],
    ['reports', 'Reports'],
    ['help', 'Help'],
  ];
  const ICONS = {
    house: '<path d="M2 12 14 2l12 10-3 3-9-8-9 8z"/><path d="M6 13v13h16V13M11 26V16h6v10"/>',
    people:
      '<circle cx="9" cy="8" r="5"/><circle cx="21" cy="9" r="4"/><path d="M1 26v-5c0-9 16-9 16 0v5zM18 16c7-3 10 3 10 7v3h-9"/>',
    orders: '<path d="M4 2h18v25H4z"/><path d="M8 6h10M8 10h10M8 14h10M8 18h10M8 22h8"/><path d="M23 2h3v20h-3"/>',
    reports: '<path d="M2 25h26v3H2zM5 14h5v10H5zM13 7h5v17h-5zM21 1h5v23h-5z"/>',
    help: '<circle cx="15" cy="15" r="13"/><path d="M11 10c0-6 10-6 10 0 0 4-6 3-6 8M15 22v2"/>',
  };
  const globe =
    '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="sea" cx="32%" cy="26%" r="76%"><stop stop-color="#87d0e8"/><stop offset=".5" stop-color="#277caf"/><stop offset="1" stop-color="#092a63"/></radialGradient><linearGradient id="land"><stop stop-color="#d5dc82"/><stop offset=".5" stop-color="#80b267"/><stop offset="1" stop-color="#356b48"/></linearGradient><clipPath id="earth"><circle cx="50" cy="50" r="46"/></clipPath></defs><circle cx="50" cy="50" r="47" fill="url(#sea)" stroke="#151c30" stroke-width="2"/><g clip-path="url(#earth)" fill="url(#land)" stroke="#355b47" stroke-width="1.1"><path d="M8 21 19 13 31 11 37 15 35 22 27 24 30 30 24 36 18 34 18 43 11 45 13 52 21 49 24 53 31 54 34 61 27 61 22 56 14 56 8 48z"/><path d="M27 60 39 58 46 63 43 72 38 80 36 91 30 86 31 76 26 69z"/><path d="M35 4 45 5 47 11 41 17 34 14z"/><path d="M51 15 57 10 64 14 65 21 71 21 74 13 86 20 94 30 90 39 82 38 79 45 73 40 69 46 65 40 59 35 54 36 50 30 54 26 48 24z"/><path d="M55 39 64 37 71 45 68 52 72 58 65 67 59 69 56 60 50 51 49 44z"/><path d="M77 51 82 54 83 64 79 62 76 57zM83 72 95 70 98 79 90 83 81 80zM71 71 73 75 71 80 69 75z"/></g><circle cx="50" cy="50" r="46" fill="none" stroke="#acc0a2" stroke-width=".7"/></svg>';
  const TABS = ['Orders', 'Customers', 'Products', 'Shipping', 'Account'];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const root = u.el('div', 'gg-root', document.body);
      const top = u.el('header', 'gg-top', root);
      u.el('div', 'gg-globe', top).innerHTML = globe;
      const tt = u.el('div', 'gg-titles', top);
      u.el('div', 'gg-title', tt, 'Global Goods');
      u.el('div', 'gg-sub', tt, 'ORDER MANAGER');
      u.el('div', 'gg-tag', top, 'Worldwide Supplies for a Brighter Tomorrow');
      const nav = u.el('nav', 'gg-nav', top);
      for (const [i, t] of NAV) {
        const b = u.el('div', 'gg-navbtn', nav);
        u.el('span', 'gg-navico', b).innerHTML = '<svg viewBox="0 0 30 30" aria-hidden="true">' + ICONS[i] + '</svg>';
        u.el('span', '', b, t);
      }
      const tabs = u.el('div', 'gg-tabs', root);
      TABS.forEach((t, i) => u.el('span', 'gg-tab-label', u.el('div', 'gg-tab' + (i === 0 ? ' on' : ''), tabs), t));
      u.el('div', 'gg-sheet', root);
      const led = u.el('section', 'gg-ledger', root);
      u.el('h2', 'gg-h', led, 'Order Ledger');
      const tbl = u.el('table', 'gg-table', led);
      const hr = u.el('tr', '', u.el('thead', '', tbl));
      HEAD.forEach((h) => u.el('th', '', hr, h));
      const tb = u.el('tbody', '', tbl);
      for (const r of ROWS) {
        const tr = u.el('tr', '', tb);
        r.forEach((c, i) => u.el('td', i === 3 || i === 4 ? 'num' : '', tr, c));
      }
      const np = u.el('section', 'gg-new', root);
      u.el('h2', 'gg-h', np, 'New Order');
      const stage = u.el('main', 'ds-stage', root);
      if (ctx.display !== 'hidden') {
        const n = u.el('aside', 'gg-banner gg-note-' + ctx.display, root);
        if (ctx.display === 'panel') u.el('div', 'gg-note-caption', n, 'Scheduling Note');
        const text = u.el('div', 'ds-instruction', n, ctx.instruction);
        if (ctx.instruction.length > 95) text.classList.add('gg-long-note');
      }
      const bt = u.el('div', 'gg-btns', root);
      ['Add Order', 'Edit Order', 'Delete Order'].forEach((t) => {
        const b = u.el('button', 'gg-btn', bt, t);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const placement = er.pick(['toolbar', 'footer', 'link', 'footer']);
      const classic = placement === 'footer';
      const endLabel = classic ? 'Submit' : er.pick(labels.filter((t) => t !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'ds-submit gg-end-' + placement, root, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const label = cr.pick(labels.filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase()));
        const b = u.el('button', 'gg-btn gg-pq', root, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      const pv = u.el('section', 'gg-prev', root);
      u.el('h2', 'gg-ph', pv, 'Order Preview');
      const pb = u.el('div', 'gg-pbody', pv);
      ['Customer', 'Item', 'Quantity', 'Unit Price', 'Delivery Date'].forEach((k) => {
        const r = u.el('div', 'gg-prow', pb);
        u.el('span', '', r, k);
        u.el('span', '', r, '—');
      });
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
