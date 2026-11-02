(function () {
  'use strict';
  const C = { site: 'design-choose-option-dropdown-08' };
  const LEDGER = [
    ['1001', 'Ceramic Mug', 'Drinkware', '48', '0', 'Apr 12, 2025'],
    ['1002', 'Stainless Water Bottle', 'Drinkware', '32', '10', 'Apr 10, 2025'],
    ['1003', 'Tea Infuser', 'Kitchen', '18', '0', 'Mar 28, 2025'],
    ['1004', 'Travel Tumbler', 'Drinkware', '27', '5', 'Apr 9, 2025'],
    ['1005', 'Cotton Tote Bag', 'Accessories', '64', '0', 'Apr 1, 2025'],
    ['1006', 'Notepad Set', 'Office', '120', '0', 'Mar 20, 2025'],
    ['1007', 'Bamboo Utensil Set', 'Kitchen', '22', '8', 'Apr 5, 2025'],
    ['1008', 'Reusable Straw Pack', 'Accessories', '56', '0', 'Mar 25, 2025'],
  ];
  const LEAF =
    '<svg viewBox="0 0 60 60" width="100%" height="100%"><defs><linearGradient id="leaf" x2=".8" y2="1"><stop stop-color="#a8d959"/><stop offset=".45" stop-color="#69b43a"/><stop offset="1" stop-color="#17763c"/></linearGradient></defs><path d="M25 54C8 52 0 40 2 25C16 26 26 36 25 54Z" fill="url(#leaf)"/><path d="M24 43C8 34 1 22 3 4C21 8 29 20 24 43Z" fill="url(#leaf)"/><path d="M24 43C17 18 34 4 55 2C59 23 44 40 24 43Z" fill="url(#leaf)"/><path d="M25 57Q22 32 48 9M24 43L10 15M23 47L7 33" fill="none" stroke="#dbedb2" stroke-width="1.4"/><path d="M25 57Q24 34 34 24" fill="none" stroke="#2d7835" stroke-width="2.8"/></svg>';
  const ICONS = [
    '<svg viewBox="0 0 40 40"><defs><linearGradient id="bx"><stop stop-color="#e9c792"/><stop offset="1" stop-color="#bc8d4e"/></linearGradient></defs><path d="M5 11L21 5L35 11L34 32L20 37L5 32Z" fill="url(#bx)" stroke="#aa844d"/><path d="M5 11L20 17L35 11M20 17V37" fill="none" stroke="#aa844d"/><path d="M11 9L26 15L25 22L21 24L21 17L29 8" fill="#947a51"/><path d="M9 25L15 27V31L9 29Z" fill="#f0d4a8"/></svg>',
    '<svg viewBox="0 0 40 40"><path d="M9 4H26L33 11V36H9Z" fill="#f4f8ff" stroke="#5197d0" stroke-width="2"/><path d="M26 4V12H33" fill="#d3e4f5" stroke="#5197d0"/><path d="M14 9H22M14 18H28M14 23H28M14 28H25M14 32H28" stroke="#a8bacb" stroke-width="2"/><path d="M14 13H22" stroke="#5797c6" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 40 40"><defs><linearGradient id="ret" x2="0" y2="1"><stop stop-color="#a7d46a"/><stop offset="1" stop-color="#64ae2b"/></linearGradient></defs><path d="M10 13H24A10 10 0 0 1 24 33H12L11 27H23A4 4 0 0 0 23 19H12L13 25L3 14L14 3Z" fill="url(#ret)" stroke="#7eb63c"/><path d="M12 31H24A8 8 0 0 0 29 29" stroke="#d7eca9" fill="none"/></svg>',
    '<svg viewBox="0 0 40 40"><defs><linearGradient id="bars" x2="1" y2="1"><stop stop-color="#c0e5fa"/><stop offset=".5" stop-color="#69b7e4"/><stop offset="1" stop-color="#3e99c6"/></linearGradient></defs><g fill="url(#bars)" stroke="#77b3d4"><rect x="4" y="22" width="8" height="14" rx="1"/><rect x="16" y="14" width="8" height="22" rx="1"/><rect x="28" y="6" width="8" height="30" rx="1"/></g></svg>',
  ];
  const SEARCH =
    '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="10" cy="10" r="6.5" fill="none" stroke="#666" stroke-width="2.2"/><path d="M15 15 L21 21" stroke="#666" stroke-width="2.4"/></svg>';
  const ARROW =
    '<svg viewBox="0 0 60 60" width="100%" height="100%"><circle cx="30" cy="30" r="28" fill="#1f6fd0" stroke="#d6e8fb" stroke-width="3"/><path d="M14 30 H44 M32 17 L45 30 L32 43" stroke="#fff" stroke-width="7" fill="none" stroke-linejoin="round"/></svg>';
  const palette = { bg: '#fff', panel: '#fff', fg: '#1d2a3a', muted: '#6a7686', line: '#c8d9ec' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1260) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const page = u.el('div', 'g-page', document.body);
      function box(cls, x, y, w, h, parent) {
        const e = u.el('div', cls, parent || page);
        e.style.left = 'calc(' + x + ' * var(--u))';
        e.style.top = 'calc(' + y + ' * var(--u))';
        if (w != null) e.style.width = 'calc(' + w + ' * var(--u))';
        if (h != null) e.style.height = 'calc(' + h + ' * var(--u))';
        return e;
      }
      box('g-logo', 34, 8, 56, 66).innerHTML = LEAF;
      box('g-brand', 99, 11, 400, 40).innerHTML = '<span class="gl">GreenLeaf</span> <span class="su">Supplies</span>';
      box('g-tag', 99, 43, 400, 24).textContent = 'Inventory  •  People  •  A Greener Tomorrow';
      box('g-welcome', 1000, 12, 640, 26).innerHTML = 'Welcome, Jordan Taylor <i>|</i> <a>My Account</a> <i>|</i> <a>Help</a> <i>|</i> <a>Sign Out</a>';
      box('g-rule', 0, 115, 1672, 2);
      [ ['Home', 35, 119, false], ['Inventory', 157, 147, true], ['Orders', 307, 150, false], ['Returns', 458, 155, false], ['Reports', 616, 154, false] ].forEach((t) => {
        box('g-tab' + (t[3] ? ' on' : ''), t[1], t[3] ? 75 : 77, t[2], t[3] ? 42 : 39).textContent = t[0];
      });
      const sr = box('g-search', 1312, 75, 325, 34);
      u.el('span', '', sr, 'Search items...');
      u.el('i', '', sr).innerHTML = SEARCH;
      const toolbar = box('g-toptools', 1000, 42, 635, 30);
      const led = box('g-panel', 37, 130, 1180, 356);
      u.el('span', '', box('g-phead', 0, 0, 1180, 40, led), 'Item Ledger');
      const table = u.el('table', '', box('g-ledger', 0, 40, 1180, 310, led));
      const hr = u.el('tr', '', table);
      ['Item #', 'Item Name', 'Category', 'In Stock', 'On Order', 'Last Received'].forEach((t, i) => u.el('th', 'c' + i, hr, t));
      LEDGER.forEach((r, ri) => {
        const tr = u.el('tr', ri === 2 ? 'hl' : '', table);
        r.forEach((t, i) => u.el('td', 'c' + i, tr, t));
      });
      const proc = box('g-panel', 37, 497, 1180, 420);
      u.el('span', '', box('g-phead', 0, 0, 1180, 40, proc), 'Process a Return');
      const header = box('g-instruction-host', 20, 52, 1140, 64, proc);
      if (_c.display === 'header') {
        header.classList.add('g-note');
        u.el('span', 'g-note-ic', header).innerHTML = ARROW;
      } else header.hidden = true;
      const footHost = box('g-foot', 36, 338, 1100, 50, proc);
      const ql = box('g-panel', 1232, 130, 408, 264);
      u.el('span', '', box('g-phead', 0, 0, 408, 42, ql), 'Quick Links');
      ['Add New Item', 'View All Orders', 'Process a Return', 'Inventory Reports'].forEach((t, i) => {
        box('g-qicon', 24, 60 + i * 51.5, 40, 40, ql).innerHTML = ICONS[i];
        u.el('a', '', box('g-qlink', 87, 66 + i * 51.5, 300, 30, ql), t);
      });
      const panelHost = box('g-task-host', 1232, 408, 408, 126);
      if (_c.display !== 'panel') {
        panelHost.classList.add('g-help');
        box('g-help-t', 17, 12, 300, 30, panelHost).textContent = 'Need Help?';
        box('g-help-p', 17, 45, 380, 26, panelHost).textContent = 'Visit our help center for step-by-step guides.';
        u.el('a', '', box('g-help-l', 17, 80, 300, 26, panelHost), 'Go to Help Center');
      }
      const pv = box('g-panel', 1232, 560, 408, 356);
      u.el('span', '', box('g-phead sm', 0, 0, 408, 42, pv), 'Item Preview');
      const photo = u.el('img', '', box('g-img', 16, 86, 150, 215, pv));
      photo.src = 'sites/' + C.site + '/assets/tea-infuser.webp';
      photo.alt = 'Stainless steel mesh tea infuser';
      box('g-pv-t', 175, 66, 220, 30, pv).textContent = 'Tea Infuser';
      ['Item #:  1003', 'Category:  Kitchen', 'In Stock:  18', 'Last Received:  Mar 28, 2025'].forEach((t, i) => {
        box('g-pv-r', 175, 112 + i * 28.5, 230, 26, pv).textContent = t;
      });
      Object.assign(_c, { page, box, proc, header, toolbar, footHost, panelHost });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panelHost;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const compact = _c.display === 'hidden' || _c.display === 'toast';
      const stage = _c.util.el('main', 'ds-stage', _c.proc);
      stage.style.left = '0';
      stage.style.top = 'calc(' + (compact ? 65 : 130) + ' * var(--u))';
      stage.style.width = 'calc(1180 * var(--u))';
      stage.style.height = 'calc(' + (compact ? 351 : 286) + ' * var(--u))';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('g-note', 'g-toast');
        _c.page.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.footHost.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footHost.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-dropdown-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a5fd0'],
      LOW_ACCENTS: ['#1a5fd0'],
      parts,
    },
  });
})();
