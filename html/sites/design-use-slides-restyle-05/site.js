// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Nature & You'];

  const SUITE_TABS = ['Documents', 'Spreadsheets', 'Presentations', 'Mail', 'Contacts', 'Calendar'];

  const DECKS = ['Quarterly Review', 'Product Plan', 'Marketing Strategy', 'Team Update', 'Customer Feedback',
    'Sales Forecast', 'Website Redesign', 'Operations Plan', 'Board Meeting', 'Project Atlas'];

  const parts = {
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'promo') {
        const box = result.el.querySelector('.ref-ov-box');
        const art = ctx.util.el('div', 'glass-promo-art', box); art.setAttribute('aria-hidden', 'true');
        ctx.util.el('h2', 'glass-promo-title', box, 'Join Our Community');
        const email = ctx.util.el('input', 'glass-promo-email', box); email.type = 'email'; email.placeholder = 'Your email address'; email.setAttribute('aria-label', 'Email address');
      }
      if (ctx.kind === 'chat') {
        const head = ctx.util.el('div', 'glass-chat-head', result.el);
        ctx.util.el('strong', '', head, 'Nature & You Support');
        ctx.util.el('small', '', head, 'Online');
        result.el.prepend(head);
        head.appendChild(result.dismiss);
        ctx.util.el('div', 'glass-chat-message', result.el, 'I have a question about this presentation.');
        const input = ctx.util.el('input', 'glass-chat-input', result.el); input.placeholder = 'Type a message…'; input.setAttribute('aria-label', 'Support message');
      }
      if (ctx.kind === 'cookie' || ctx.kind === 'promo') {
        const box = ctx.kind === 'promo' ? result.el.querySelector('.ref-ov-box') : result.el;
        const close = ctx.util.el('button', 'ref-ov-closer', box, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      return result;
    },
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      _c.glassOriginalFooter = _c.wantFooter;
      if (!_c.ctx.finish && _c.rng.fork('glass/primary-end').bool(0.5)) {
        _c.placement = 'footer';
        _c.wantFooter = true;
        _c.label = _c.word ? _c.word('apply') : 'Apply';
        if (_c.collide && _c.collide.text.trim().toLowerCase() === _c.label.trim().toLowerCase()) {
          const alternatives = _c.content.END_LABELS.filter((text) => text.toLowerCase() !== _c.label.toLowerCase());
          _c.collide.text = _c.rng.fork('glass/end-alternative').pick(alternatives);
        }
      }
    },
    'frame.footer': (base, S) => function (_c) {
      const originalRng = _c.rng;
      if (_c.wantFooter && !_c.glassOriginalFooter) _c.rng = originalRng.fork('glass/footer-copy');
      try { return base(_c); } finally { _c.rng = originalRng; }
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = (display !== 'header' || nav) ? rng.pick(TITLES) : TITLES[0];
      const brand = util.el('div', 'ref-brand', header, title);
      brand.dataset.role = 'brand';
      const lights = util.el('div', 'mac-lights', header);
      for (const color of ['red', 'yellow', 'green']) util.el('span', `mac-light ${color}`, lights);
      const doc = util.el('div', 'mac-document', header);
      doc.innerHTML = '<svg viewBox="0 0 28 32" width="27" height="30" aria-hidden="true"><path d="M9 2h12l5 5v23H9z" fill="#168eff"/><path d="M21 2v6h5" fill="#a9dfff"/><rect x="2" y="10" width="13" height="17" rx="2" fill="white"/><path d="M5 15h7M5 18h7M5 21h4" stroke="#6795b9" stroke-width="1.5"/><path d="M8 10V7h10v15h-3" fill="none" stroke="#1675c2" stroke-width="1.4"/></svg>';
      util.el('span', 'mac-edited', header, '—  Edited');
      const frameActions = util.el('div', 'mac-actions', header);
      for (const [label, paths] of [
        ['Search','<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>'],
        ['Share','<path d="M8 8H5v13h14V8h-3M12 16V2m-4 4 4-4 4 4"/>'],
        ['Sidebar','<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M9 4v16M5 8h1m-1 4h1m-1 4h1"/>']
      ]) {
        const button = util.el('button', 'mac-action', frameActions);
        button.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
        button.type = 'button'; button.title = label; button.setAttribute('aria-label', label);
      }
      const utilityLinks = util.el('nav', 'ref-utility-links', header);
      for (const item of ['Ideas', 'People', 'Results']) {
        const link = util.el('a', '', utilityLinks, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'utility', label: item }); });
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const [i, item] of SUITE_TABS.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: navItems[i] || item }); });
        }
      }
      if (!nav) {
        const n = util.el('nav', 'ref-nav', header);
        SUITE_TABS.forEach((item) => {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        });
      }
      Object.assign(_c, { brand, header, title, utilityLinks });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sideItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const [i, item] of DECKS.entries()) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          if (i === 1) a.classList.add('ref-selected');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: sideItems[i] || item }); });
        }
      }
      if (!sidebar) {
        const side = util.el('aside', 'ref-side', body);
        DECKS.forEach((item, i) => {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          if (i === 1) a.classList.add('ref-selected');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        });
      }
      Object.assign(_c, { body });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-slides-restyle-05',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
