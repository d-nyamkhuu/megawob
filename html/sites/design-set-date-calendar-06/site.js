(function () {
  'use strict';
  const C = { site: 'design-set-date-calendar-06', brand: 'Contoso Orders', title: 'Order Summary' };
  const TRUCK =
    '<svg viewBox="0 0 140 104" width="100%" height="100%"><path d="M5 0h78q5 0 5 5v78H0V5q0-5 5-5zM94 23h22q4 0 6 4l18 29v27H94z" fill="#60788f"/><path d="M103 32h13l13 20h-26z" fill="#dde5ee"/><circle cx="29" cy="88" r="16" fill="#60788f" stroke="#dde5ee" stroke-width="5"/><circle cx="112" cy="88" r="16" fill="#60788f" stroke="#dde5ee" stroke-width="5"/></svg>';
  const palette = { bg: '#10568f', panel: '#ffffff', fg: '#0b2037', muted: '#60718a', line: '#bcc6d2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes share the dedicated space above the form, even on small viewports.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const tb = u.el('header', 'ds-titlebar', document.body);
      const logo = u.el('span', 'ds-logo', tb);
      logo.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 18 18"><rect x="0" y="0" width="18" height="18" rx="1" fill="#fff"/><path d="M6 1l1 7H1m8-7v7h8M8 9v8m-7-7h6l2 4" stroke="#1763ad" stroke-width="1" fill="none"/></svg>';
      u.el('span', 'ds-apptitle', tb, C.brand);
      const wc = u.el('span', 'ds-wc', tb);
      u.el('i', 'ds-min', wc);
      u.el('i', 'ds-max', wc);
      u.el('i', 'ds-close', wc, '✕');
      const ov = u.el('section', 'ds-overview', document.body);
      u.el('h1', 'ds-ovtitle', ov, C.title);
      const kv = u.el('div', 'ds-kv', ov);
      [
        ['Order number', 'SO-10428', 0],
        ['Customer', 'Northwind Traders', 0],
        ['Items', '4', 0],
      ].forEach((r) => {
        u.el('span', 'k', kv, r[0]);
        u.el('span', 'v', kv, r[1]);
      });
      const kv2 = u.el('div', 'ds-kv ds-kv2', ov);
      [
        ['Subtotal', '$892.00', 0],
        ['Shipping', '$35.00', 0],
        ['Total', '$927.00', 1],
      ].forEach((r) => {
        u.el('span', 'k', kv2, r[0]);
        u.el('span', 'v' + (r[2] ? ' b' : ''), kv2, r[1]);
      });
      u.el('div', 'ds-truck', ov).innerHTML = TRUCK;
      const ps = u.el('div', 'ds-prep', ov);
      u.el('div', 'h', ps, 'Preparing for delivery');
      u.el('div', 't', ps, 'Complete the details below to schedule delivery.');
      const work = u.el('div', 'ds-work', document.body);
      const noteHost = u.el('div', 'ds-note-host', work);
      Object.assign(_c, { titlebar: tb, work, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.titlebar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#0088ff'],
      LOW_ACCENTS: ['#0088ff'],
      parts,
    },
  });
})();
