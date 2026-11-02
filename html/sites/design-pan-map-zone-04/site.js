// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      if (kind === 'banner' || kind === 'promo') {
        const header = document.querySelector('.ref-task');
        if (header) el.style.top = `${Math.ceil(header.getBoundingClientRect().bottom)}px`;
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowTitle = util.el('div', 'mag-titlebar', document.body);
      util.el('span', 'mag-app-icon', windowTitle, '▧');
      util.el('span', '', windowTitle, 'Map & Delivery Zones');
      const winButtons = util.el('span', 'mag-window-buttons', windowTitle);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winButtons, glyph);
      const menu = util.el('nav', 'mag-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Zones', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'mag-toolbar', document.body);
      for (const [glyph, label] of [['✋', 'Pan'], ['📍', 'Add Pin'], ['⬡', 'Draw Zone'], ['×', 'Delete Point'], ['▤', 'Clear Zone']]) {
        const b = util.el('span', 'mag-tool', toolbar);
        const icon = util.el('b', '', b);
        const shapes = {
          Pan: '<path d="M7 13V6a1.5 1.5 0 0 1 3 0v6-8a1.5 1.5 0 0 1 3 0v8-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v10l-3 5H9l-5-6c-2-3 0-4 2-2l1 1"/>',
          'Add Pin': '<path fill="#d72c16" d="M12 3a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5Z"/><circle cx="12" cy="8" r="2" fill="white"/><path d="M12 17v6"/>',
          'Draw Zone': '<path d="m5 4 12-1 4 5-2 12-13 1-4-7 1-7Z"/>',
          'Delete Point': '<path d="m6 6 12 12M18 6 6 18"/>',
          'Clear Zone': '<path d="M5 7h14M9 7V3h6v4M7 7l1 15h9l1-15M11 10v9m3-9v9"/>'
        };
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${shapes[label]}</svg>`;
        util.el('span', '', b, label);
      }
      Object.assign(_c, { collide, cr, decoys, label, menu, nav, placement, sidebar, toolbar, wantFooter, winButtons, windowTitle });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'OrbitMap');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const summary = util.el('section', 'mag-summary', document.body);
      const sumMain = util.el('div', 'mag-summary-main', summary);
      util.el('h1', '', sumMain, 'Delivery Areas');
      const statLeft = util.el('div', 'mag-stats', sumMain);
      for (const [a, b] of [['Active Zone', 'None'], ['Area', '—'], ['Stops', '0'], ['Last Updated', '—']]) {
        const row = util.el('div', '', statLeft); util.el('span', '', row, a); util.el('span', '', row, b);
      }
      const statMiddle = util.el('div', 'mag-summary-col', summary);
      util.el('h2', '', statMiddle, 'Addresses in View');
      for (const [a, b] of [['Total Places', '20'], ['Addresses', '16'], ['Parks & Other', '4']]) {
        const row = util.el('div', '', statMiddle); util.el('span', '', row, a); util.el('span', '', row, b);
      }
      const statRight = util.el('div', 'mag-summary-col', summary);
      util.el('h2', '', statRight, 'Map View');
      for (const [a, b] of [['Center', 'Riverside, Mapleton'], ['Zoom Level', '15'], ['View Size', '3.2 km × 1.8 km']]) {
        const row = util.el('div', '', statRight); util.el('span', '', row, a); util.el('span', '', row, b);
      }
      Object.assign(_c, { headerTools, statLeft, statMiddle, statRight, submit, sumMain, summary });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'orbit-rail', body);
      for (const [icon, label] of [['◫', 'Map'], ['♧', 'Deliveries'], ['♙', 'Customers'],
        ['♧', 'Places'], ['⬡', 'Zones'], ['▥', 'Reports'], ['⚙', 'Settings']]) {
        const a = util.el('a', `orbit-rail-link${label === 'Map' ? ' active' : ''}`, rail);
        util.el('span', 'orbit-rail-icon', a, icon);
        util.el('span', '', a, label);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
  };

  env.site({
    name: 'design-pan-map-zone-04',
    template: 'site/base',
    design: { parts },
  });
})();
