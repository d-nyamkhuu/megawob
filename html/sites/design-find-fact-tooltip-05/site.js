(function () {
  'use strict';
  const NAV = ['Products', 'Orders', 'Customers', 'Reports', 'Settings'];
  const CATS = [['All Products', 52], ['Kitchen & Dining', 6], ['Home Decor', 8], ['Bedding', 7], ['Bath', 6], ['Outdoor', 5]];
  const CAT_ICON = [
    '<svg viewBox="0 0 24 24"><path d="M12 2 21 7v10l-9 5-9-5V7zm0 0v10m9-5-9 5-9-5m9 5v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M3 2v7m3-7v7m3-7v7M3 8v2a3 3 0 0 0 6 0V8M6 13v9m12-20c-3 3-4 7-4 11h4v9V2Z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v10h-6v-7H9v7H3z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M3 11h18v9H3zm0 0V7a3 3 0 0 1 6 0v4m0 2h12a3 3 0 0 1 3 3v1M6 20v2m13-2v2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M3 12h18v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6zm18 0H5a2 2 0 0 1 0-4h12a2 2 0 0 0 2-2V4m-1 17 1 2M7 21l-1 2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="m12 2-5 8h3l-5 6h5l-4 5h12l-4-5h5l-5-6h3zM12 21v2" fill="currentColor"/></svg>',
  ];
  const ICON = {
    Products: '<svg viewBox="0 0 24 24"><path d="M2 12 12 2h8l2 2v8L12 22z" fill="currentColor"/><circle cx="17" cy="7" r="1.8" fill="#fff"/></svg>',
    Orders: '<svg viewBox="0 0 24 24"><path d="M2 4h3l3 11h11l2-8H7" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="9" cy="20" r="1.8" fill="currentColor"/><circle cx="18" cy="20" r="1.8" fill="currentColor"/></svg>',
    Customers: '<svg viewBox="0 0 24 24"><circle cx="8" cy="6" r="4" fill="currentColor"/><path d="M0 21v-3c0-7 16-7 16 0v3zm18 0v-4a8 8 0 0 0-2-5c5 0 8 2 8 5v4z" fill="currentColor"/><path d="M16 3a4 4 0 0 1 0 8 6 6 0 0 0 0-8" fill="currentColor"/></svg>',
    Reports: '<svg viewBox="0 0 24 24"><rect x="2" y="11" width="5" height="12" rx="1.8" fill="currentColor"/><rect x="10" y="2" width="5" height="21" rx="1.8" fill="currentColor"/><rect x="18" y="7" width="5" height="16" rx="1.8" fill="currentColor"/></svg>',
    Settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="3 2.4"/><circle cx="12" cy="12" r="5" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="#f4f5fd"/></svg>',
  };
  env.site({
    name: 'design-find-fact-tooltip-05',
    template: 'site/base',
    styles: ['site.css'],
    design: {
      parts: {
        'frame.theme': (base) => function (_c) {
          base(_c);
          document.documentElement.dataset.theme = 'light';
        },
        'frame.header': () =>
          function (_c) {
            const { ctx } = _c;
            if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
            const u = ctx.util;
            const win = u.el('div', 'tt-win', document.body);
            const tb = u.el('header', 'tt-title', win);
            const leaf = u.el('span', 'tt-leaf', tb);
            leaf.innerHTML = '<svg viewBox="0 0 30 30"><path d="M4 25C1 13 10 6 27 3c-1 17-8 25-20 21" fill="#58b567"/><path d="M3 28C8 19 16 13 25 6" fill="none" stroke="#419455" stroke-width="1.5"/><path d="M10 21c6 0 10-3 13-9" fill="none" stroke="#6bc879" stroke-width="1"/></svg>';
            u.el('span', 'tt-name', tb, 'BrightMart Inventory');
            const wc = u.el('span', 'tt-wc', tb);
            wc.innerHTML = '<i class="min"></i><i class="max"></i><i class="cls"></i>';
            const nav = u.el('nav', 'tt-nav', win);
            NAV.forEach((t, i) => {
              const a = u.el('a', 'tt-tab' + (i === 0 ? ' on' : ''), nav);
              a.dataset.role = 'nav';
              a.href = '#';
              a.innerHTML = ICON[t] + '<span>' + t + '</span>';
              a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: t }); });
            });
            const search = u.el('div', 'tt-search', nav);
            search.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15 15l6 6" stroke="currentColor" stroke-width="2.4"/></svg><span>Search products...</span>';
            const body = u.el('div', 'tt-body', win);
            const side = u.el('aside', 'tt-side', body);
            u.el('h2', '', side, 'Products');
            CATS.forEach(([n, c], i) => {
              const a = u.el('a', 'tt-cat' + (i === 1 ? ' on' : ''), side);
              a.dataset.role = 'nav';
              a.href = '#';
              const icon = u.el('i', 'tt-ci', a);
              icon.innerHTML = CAT_ICON[i];
              u.el('span', '', a, n);
              u.el('b', '', a, String(c));
              a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: n }); });
            });
            const main = u.el('section', 'tt-main', body);
            Object.assign(_c, { win, header: nav, body: main, side });
          },
        'frame.nav': () => function () {},
        'frame.body': () => function () {},
        'frame.instruction': (base) => function (_c) {
          const h = _c.header;
          _c.header = _c.body;
          base(_c);
          _c.header = h;
          const note = _c.body.querySelector('.ref-instruction');
          if (note) note.classList.add('tt-note');
        },
        'frame.tools': (base) => function (_c) {
          base(_c);
          _c.headerTools.classList.add('tt-tools');
        },
        'frame.panel': (base) => function (_c) {
          const b = _c.body;
          _c.body = _c.side;
          base(_c);
          _c.body = b;
          const panel = _c.side.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('tt-panel');
            panel.querySelector('.ref-panel-title').classList.add('tt-panel-title');
            panel.querySelector('.ref-panel-text').classList.add('tt-panel-text');
          }
        },
        'frame.stage': (base) => function (_c) {
          base(_c);
          _c.stage.classList.add('tt-stage');
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) _c.side.appendChild(note);
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            foot.classList.add('tt-foot');
            foot.querySelector('.ref-tools').classList.add('tt-tools');
            _c.win.appendChild(foot);
          }
        },
        'frame.floating': (base) => function (_c) {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.win.appendChild(dock);
        },
        fault: (base) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind === 'shift') {
            const body = document.querySelector('.tt-body');
            if (body) body.before(result.el);
          }
          return result;
        },
      },
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') {
        const anchor = document.querySelector('.tt-note') || document.querySelector('.tt-nav');
        if (anchor) el.style.top = Math.ceil(anchor.getBoundingClientRect().bottom + 6) + 'px';
      }
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
