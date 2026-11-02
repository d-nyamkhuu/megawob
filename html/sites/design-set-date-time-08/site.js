(function () {
  'use strict';
  const C = {
    site: 'design-set-date-time-08',
    app: 'Instrument Calibration Utility',
    nav: ['Calibration', 'Scheduling', 'Devices', 'Reports', 'Preferences'],
  };
  const ICON_APP =
    '<svg width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="appblue"><stop stop-color="#b6d4ef"/><stop offset=".5" stop-color="#376fa5"/><stop offset="1" stop-color="#183b74"/></linearGradient></defs><rect x="2" y="1" width="20" height="18" fill="#eee" stroke="#444"/><rect x="4" y="3" width="16" height="13" fill="url(#appblue)" stroke="#555"/><path d="M12 4v12M7 7h5M12 10h5M10 16l-3 6h12l-3-6" fill="#aaa" stroke="#34485c"/><path d="M7 4v10M16 5v13" stroke="#cb6557"/><path d="M3 20h6v3H3z" fill="#526775"/><path d="M18 17l4 5-5 1" fill="#83283a" stroke="#333"/></svg>';
  const ICON_COMP =
    '<svg width="46" height="46" viewBox="0 0 46 46"><defs><linearGradient id="screen" x2="1" y2="1"><stop stop-color="#a8c5e0"/><stop offset=".5" stop-color="#5c87b5"/><stop offset="1" stop-color="#295685"/></linearGradient><linearGradient id="case" x2="0" y2="1"><stop stop-color="#f8f8f5"/><stop offset="1" stop-color="#b3b5b4"/></linearGradient></defs><rect x="5" y="2" width="36" height="29" rx="2" fill="url(#case)" stroke="#333"/><rect x="8" y="5" width="30" height="23" fill="#333"/><rect x="10" y="7" width="26" height="19" fill="url(#screen)"/><path d="M18 32h10l2 5H16z" fill="#aaa" stroke="#555"/><path d="M10 38h26l6 6H4z" fill="url(#case)" stroke="#444"/><path d="M8 41h29M7 3h31" stroke="#fff"/></svg>';
  const ICON_HOME =
    '<svg width="46" height="46" viewBox="0 0 46 46"><defs><linearGradient id="folder" x2="0" y2="1"><stop stop-color="#bdc4a4"/><stop offset="1" stop-color="#899277"/></linearGradient></defs><path d="M3 8h14l6 5h19v29H3z" fill="#7f8c6c" stroke="#303b2e" stroke-width="1.5"/><path d="M4 18l6-6h11l4 5h17v25H4z" fill="url(#folder)" stroke="#343d30" stroke-width="1.5"/><path d="M5 19h35M6 21v19" stroke="#d2d4bd"/><path d="M23 22l-10 9h4v9h13v-9h4z" fill="#b9bda4" stroke="#7b826b"/><path d="M22 32h4v8h-4z" fill="#879174"/></svg>';
  const ICON_TRASH =
    '<svg width="46" height="46" viewBox="0 0 46 46"><defs><linearGradient id="metal"><stop stop-color="#737877"/><stop offset=".25" stop-color="#eee"/><stop offset=".5" stop-color="#c3c5c2"/><stop offset="1" stop-color="#585e5d"/></linearGradient></defs><path d="M6 9h34l-4 31q-13 9-26 0z" fill="url(#metal)" stroke="#303635" stroke-width="1.5"/><ellipse cx="23" cy="9" rx="17" ry="6" fill="#c8cbc8" stroke="#333"/><ellipse cx="23" cy="9" rx="13" ry="3.5" fill="#5b605d" stroke="#eee"/><path d="M11 14l2 24M15 15l1 25" stroke="#fff"/><path d="M34 15l-2 25" stroke="#666"/></svg>';
  const palette = { bg: '#c9c8c4', panel: '#e6e5e1', fg: '#1c1c1c', muted: '#4a4a4a', line: '#8c8b87' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The desktop has a dedicated note area at every supported size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const body = document.body;
      const top = u.el('header', 'dk-top', body);
      const gl = u.el('span', 'dk-globe', top);
      gl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 1l8 4 3 8-6 9-9 1-7-8 2-9z" fill="#c4b686" stroke="#222"/><circle cx="12" cy="12" r="8" fill="#4784ae" stroke="#333"/><path d="M7 5l5 2-2 5 7 2-3 5-5-2-3-6z" fill="#c29f70" stroke="#682936"/><path d="M4 17l5 4 10-3M6 3l9 2 5 6" fill="none" stroke="#eee"/></svg>';
      u.el('span', 'dk-mi', top, 'Applications');
      u.el('span', 'dk-mi', top, 'Places');
      u.el('span', 'dk-mi', top, 'System');
      u.el('span', 'dk-sp', top);
      const tray = u.el('span', 'dk-tray', top);
      tray.innerHTML = '<svg viewBox="0 0 64 28"><path d="M5 10h6l8-7v22l-8-7H5z" fill="#ddd" stroke="#333" stroke-width="1.5"/><path d="M22 8q9 6 0 12M25 4q14 10 0 20" fill="none" stroke="#333" stroke-width="2"/><path d="M37 0v28" stroke="#777"/><ellipse cx="51" cy="6" rx="9" ry="4" fill="#abc6d3" stroke="#333"/><path d="M43 10l15 1-4 6h-8zM48 19l-3 5m9-5 3 5" fill="#aec2cd" stroke="#333" stroke-width="2"/><circle cx="47" cy="16" r="2"/><circle cx="54" cy="16" r="2"/></svg>';
      u.el('span', 'dk-clock', top, 'Wed Apr 14, 2004  2:17 PM');
      const icons = u.el('div', 'dk-icons', body);
      [[ICON_COMP, 'Computer'], [ICON_HOME, "user's Home"], [ICON_TRASH, 'Wastebasket']].forEach(([s, t]) => {
        const i = u.el('div', 'dk-icon', icons);
        i.innerHTML = s;
        u.el('span', '', i, t);
      });
      const win = u.el('section', 'dk-win', body);
      const toolbar = u.el('div', 'dk-title', win);
      u.el('span', 'dk-tic', toolbar).innerHTML = ICON_APP;
      u.el('span', 'dk-ttl', toolbar, C.app);
      const wb = u.el('span', 'dk-wb', toolbar);
      ['_', '□', '✕'].forEach((t) => u.el('i', '', wb, t));
      const header = u.el('aside', 'dk-note dk-note-header', body);
      header.hidden = _c.display !== 'header';
      if (_c.display === 'header') u.el('div', 'dk-nh', header, 'Task');
      Object.assign(_c, { win, toolbar, wb, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.insertBefore(_c.headerTools, _c.wb);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'dk-client', _c.win);
      const nav = u.el('nav', 'dk-nav', body);
      C.nav.forEach((n, i) => u.el('div', 'dk-navi' + (i === 1 ? ' on' : ''), nav, n));
      const pane = u.el('div', 'dk-pane', body);
      const hd = u.el('div', 'dk-hd', pane);
      u.el('h1', '', hd, 'Schedule Calibration');
      u.el('span', 'dk-model', hd, 'Model IC-3200');
      u.el('div', 'dk-lead', pane);
      Object.assign(_c, { body, pane });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: document.body });
      const panel = document.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('dk-note', 'dk-note-panel');
        panel.querySelector('.ref-panel-title').classList.add('dk-nh');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.pane);
      const opt = u.el('div', 'dk-opt', _c.pane);
      u.el('div', 'dk-ot', opt, 'Additional Options');
      const o1 = u.el('label', 'dk-chk on', opt);
      u.el('i', '', o1, '✓');
      u.el('span', '', o1, 'Run system diagnostics before calibration');
      const o2 = u.el('label', 'dk-chk', opt);
      u.el('i', '', o2);
      u.el('span', '', o2, 'Send notification when complete');
      u.el('div', 'ds-reservation-values', document.body).style.display = 'none';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('dk-note', 'dk-note-toast');
        const title = _c.util.el('div', 'dk-nh', note, 'Task');
        note.insertBefore(title, note.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('dk-foot');
      _c.win.appendChild(foot);
      const u = _c.util;
      const bar = u.el('footer', 'dk-bar', document.body);
      u.el('span', 'dk-bi', bar);
      const tk = u.el('span', 'dk-task', bar);
      u.el('span', '', tk).innerHTML = ICON_APP;
      u.el('span', '', tk, C.app);
      u.el('span', 'dk-sp', bar);
      u.el('span', 'dk-sw', bar);
      u.el('span', 'dk-bclock', bar, '2:17 PM');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
      THEMES: { 'design-set-date-time-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6e0f1f'],
      LOW_ACCENTS: ['#6e0f1f'],
      parts,
    },
  });
})();
