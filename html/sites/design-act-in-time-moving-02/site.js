(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-moving-02',
    app: 'Shape Sprint',
    menu: ['File', 'Edit', 'Game', 'Window', 'Help'],
  };
  const APPLE =
    '<svg viewBox="0 0 16 18" width="15" height="17"><path fill="#1d3b63" d="M11.2 9.5c0-1.7 1.4-2.5 1.5-2.6-.8-1.2-2.1-1.4-2.5-1.4-1.1-.1-2.1.6-2.6.6s-1.4-.6-2.300-.6c-1.200 0-2.300.7-2.900 1.700-1.200 2.100-.3 5.300.9 7 .6.800 1.300 1.800 2.200 1.700.9 0 1.200-.6 2.300-.6s1.300.6 2.300.5c.9 0 1.500-.8 2.100-1.700.7-1 .9-1.900.9-2-.1 0-1.700-.7-1.700-2.600zM9.500 4.300c.5-.6.8-1.400.7-2.200-.7 0-1.500.5-2 1.100-.4.500-.8 1.300-.7 2.100.8.100 1.500-.4 2-1z"/></svg>';
  const palette = { bg: '#387bc8', panel: '#c6daf0', fg: '#111111', muted: '#202649', line: '#7e9dc7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Overview and the toast strip have space even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const bar = u.el('header', 'ds-menubar', document.body);
      const ap = u.el('span', 'ds-apple', bar);
      ap.innerHTML = APPLE;
      u.el('b', '', bar, C.app);
      C.menu.forEach((t) => u.el('span', 'ds-mi', bar, t));
      const icons = u.el('span', 'ds-system', bar);
      icons.innerHTML =
        '<svg viewBox="0 0 24 26" aria-label="Bluetooth"><circle cx="12" cy="13" r="10"/><path d="M12 1v24M7 7l11 11-6 5V3l6 5L7 19"/></svg><svg viewBox="0 0 30 24" aria-label="Wi-Fi"><path d="M2 7Q15 -3 28 7M6 11Q15 3 24 11M10 15Q15 10 20 15"/><circle cx="15" cy="19" r="1.5" fill="currentColor"/></svg><svg viewBox="0 0 34 24" aria-label="Battery"><rect x="1" y="4" width="28" height="16" rx="3"/><path d="M32 8v8"/><path fill="currentColor" stroke="none" d="M5 7h20v10H5z"/></svg>';
      u.el('span', 'ds-clock', bar, 'Mon 10:24 AM');
      const wallpaper = u.el('div', 'ds-wallpaper', document.body);
      wallpaper.innerHTML =
        '<svg viewBox="0 0 1672 941" preserveAspectRatio="none"><path fill="#78b7e9" opacity=".20" d="M0 0h1672v58L0 30z"/><path fill="#75b6e9" opacity=".17" d="M0 216 0 451 208 607 0 470z"/><path fill="#8cc9f3" opacity=".13" d="M0 451 0 640 342 890 474 890z"/><path fill="#74b7ed" opacity=".19" d="M0 615 0 732 216 890 338 890z"/><path fill="#7dbce9" opacity=".16" d="M184 890 403 941h492L541 890z"/><path fill="#5fa5df" opacity=".13" d="M1104 890 1672 590v135L1367 890z"/><path fill="#82c2ed" opacity=".17" d="M1555 0h117v237l-117 68-81-49z"/><path fill="#8ac8f1" opacity=".19" d="M1672 288v177l-132-83z"/><path fill="none" stroke="#9dd4f7" stroke-width="2" opacity=".16" d="M0 451 338 707M0 615 405 890M184 890 541 890M1672 288 1540 382M1672 590 1104 890"/></svg>';
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-titlebar', win);
      const lights = u.el('span', 'ds-lights', tb);
      ['r', 'y', 'g'].forEach((c) => u.el('i', 'ds-l-' + c, lights));
      u.el('span', 'ds-wtitle', tb, C.app);
      const titleTools = u.el('div', 'ds-title-tools', tb);
      const ov = u.el('section', 'ds-panel ds-overview', win);
      u.el('div', 'ds-phead', ov, 'Overview');
      const ovb = u.el('div', 'ds-ovbody', ov);
      Object.assign(_c, { win, ov, titleTools, header: ovb });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titleTools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.win;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const bp = _c.util.el('section', 'ds-panel ds-boardpanel', _c.body);
      _c.util.el('div', 'ds-phead', bp, 'Motion Board');
      _c.stage = _c.util.el('main', 'ds-stage', bp);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.win.insertBefore(note, _c.ov);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = u.el('footer', 'ds-footer', _c.win);
      const score = u.el('span', 'ds-score', foot);
      u.el('span', '', score, 'Score:');
      u.el('span', 'ds-score-value', score, '0');
      const footerTools = u.el('div', 'ds-footer-tools', foot);
      footerTools.appendChild(document.body.querySelector('.ref-foot'));
      _c.footerTools = footerTools;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footerTools.appendChild(dock);
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
      ACCENTS: ['#246edf'],
      LOW_ACCENTS: ['#246edf'],
      parts,
    },
  });
})();
