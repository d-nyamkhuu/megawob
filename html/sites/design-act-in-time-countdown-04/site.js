(function () {
  'use strict';
  const palette = { bg: '#f5f4f2', panel: '#f5f4f2', fg: '#080808', muted: '#555', line: '#8f8f8f' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-lock', top, '▣');
      u.el('span', 'ds-brand', top, 'Store Pickup Reservation');
      const meta = u.el('div', 'ds-window-meta', top);
      const toolbar = u.el('div', 'ds-toolbar', meta);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', 'ds-winbtn', meta, t);
        b.type = 'button';
      });
      const header = u.el('div', 'ds-note-slot', document.body);
      Object.assign(_c, { header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      if (_c.display === 'header') _c.header.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-layout', document.body);
      const work = u.el('div', 'ds-work', body);
      const side = u.el('aside', 'ds-side', body);
      if (_c.display !== 'panel') u.el('h2', '', side, 'Pickup information');
      const blocks = [
        ['⌖', 'Riverton Store', '125 Market St, Riverton'],
        ['▤', 'Store hours', 'Mon – Sat, 9:00 – 18:00\nSun, 10:00 – 16:00'],
        ['▱', 'Bring your order number', 'We’ll hold your item at the pickup desk.'],
      ];
      blocks.forEach(([icon, title, txt]) => {
        const row = u.el('div', 'ds-info', side);
        u.el('span', 'ds-icon', row, icon);
        const copy = u.el('div', '', row);
        u.el('b', '', copy, title);
        u.el('span', '', copy, txt);
      });
      u.el('h2', 'ds-tips-title', side, 'Helpful tips');
      [
        ['◷', 'Your item is reserved for a short time while you choose a slot.'],
        ['▦', 'Pickup is available on the selected day during the store’s open hours.'],
        ['▢', 'Choose how many bags you’ll need for your items.'],
      ].forEach(([ic, txt]) => {
        const row = u.el('div', 'ds-tip', side);
        u.el('span', 'ds-icon', row, ic);
        u.el('span', '', row, txt);
      });
      Object.assign(_c, { body, work, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.work.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.work.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-act-in-time-countdown-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-countdown-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#080808'],
      LOW_ACCENTS: ['#080808'],
      parts,
    },
  });
})();
