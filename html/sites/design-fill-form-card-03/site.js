(function () {
  'use strict';
  const C = {
    site: 'design-fill-form-card-03',
    title: 'CONTACT FORM',
    fillTitle: 'FILL FROM PROFILE',
    fillText: 'Contact information is organized alongside the profile preview.',
    rail: 'PEOPLE',
  };
  const ICONS = {
    person:
      '<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="7.5" r="4" fill="currentColor"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7z" fill="currentColor"/></svg>',
    group:
      '<svg viewBox="0 0 28 24" width="30" height="26"><circle cx="9" cy="7" r="3.8" fill="currentColor"/><circle cx="20" cy="8" r="3.2" fill="currentColor"/><path d="M1 20c0-5 4-7 8-7s8 2 8 7zM17 14c5-1.5 10 1 10 6h-8z" fill="currentColor"/></svg>',
    gear: '<svg viewBox="0 0 24 24" width="27" height="27"><path fill="currentColor" fill-rule="evenodd" d="M10 1h4l.7 3 2 .9 2.6-1.6 2.8 2.8-1.6 2.6.9 2 3 .7v4l-3 .7-.9 2 1.6 2.6-2.8 2.8-2.6-1.6-2 .9-.7 3h-4l-.7-3-2-.9-2.6 1.6-2.8-2.8 1.6-2.6-.9-2-3-.7v-4l3-.7.9-2L3.9 6.1l2.8-2.8 2.6 1.6 2-.9zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>',
  };
  const palette = { bg: '#eff2f8', panel: '#eff2f8', fg: '#10151d', muted: '#55606f', line: '#b8c0cc' };
  const parts = {
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
      const blue = u.el('section', 'k-blue', document.body);
      u.el('h1', 'k-title', blue, C.title);
      const toolbar = u.el('div', 'ds-footer', blue);
      Object.assign(_c, { blue, toolbar, header: blue });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const rail = u.el('aside', 'k-rail', document.body);
      u.el('div', 'k-rail-h', rail, C.rail);
      [
        ['Contact Form', 'person', true],
        ['Directory', 'group', false],
        ['Settings', 'gear', false],
      ].forEach(([t, k, on]) => {
        const it = u.el('div', 'k-nav' + (on ? ' on' : ''), rail);
        const ic = u.el('span', 'k-ico', it);
        ic.innerHTML = ICONS[k];
        u.el('span', '', it, t);
        it.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const fill = u.el('section', 'k-fill', document.body);
      u.el('div', 'k-fill-h', fill, C.fillTitle);
      u.el('p', '', fill, C.fillText);
      _c.rail = rail;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.blue; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const title = _c.rail.querySelector('.ref-panel-title');
      if (title) title.textContent = 'TASK NOTE';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.blue);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.rail.appendChild(note);
        const title = _c.util.el('div', 'k-note-h', note, 'CURRENT TASK');
        note.prepend(title);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
      ACCENTS: ['#0a4fe0'],
      LOW_ACCENTS: ['#0a4fe0'],
      parts,
    },
  });
})();
