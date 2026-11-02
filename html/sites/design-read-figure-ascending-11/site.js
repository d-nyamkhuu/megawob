(function () {
  'use strict';
  const C = { site: 'design-read-figure-ascending-11', scenario: 'ascending' };
  const palette = { bg: '#0c1318', panel: '#111a20', fg: '#d6e1ee', muted: '#99a8b6', line: '#33424b' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('developer', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'dev-nav', document.body);
      u.el('b', '', nav, '</>  DevTools');
      u.el('div', 'active', nav, '●  Tasks');
      ['Playground', 'Snippets', 'Settings'].forEach((x) => u.el('div', '', nav, x));
      u.el('div', 'online', nav, '● Online');
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, '>_  Focus Task');
      u.el('small', '', top, '# ui-perceive/ascending');
      const center = u.el('div', 'center', app);
      const slot = u.el('div', 'instruction-slot', center);
      const foot = u.el('div', 'bottom', app);
      const notes = u.el('aside', 'dev-notes', document.body);
      if (_c.display !== 'panel') u.el('b', '', notes, 'Task');
      u.el('div', 'dev-version', document.body, 'v2.4.1');
      Object.assign(_c, { app, top, center, foot, notes, header: slot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.notes;
      base(_c);
      _c.body = body;
      const title = _c.notes.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.notes.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready.';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        if (C.scenario === 'addition') {
          const ob = u.el('section', 'obstruction newsletter', document.body);
          u.el('h2', '', ob, 'Join Our Newsletter');
          u.el('p', '', ob, 'Get math tips and practice ideas right in your inbox.');
          const signup = u.el('div', 'signup', ob),
            email = u.el('input', '', signup);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
          const sign = u.el('button', '', signup, 'Sign Up');
          sign.onclick = () => {
            sign.textContent = 'Thank you';
          };
          const close = u.el('button', 'obstruction-close', ob);
          close.dataset.referenceDismiss = 'true';
          close.setAttribute('aria-label', 'Close');
          const svg = u.svg('svg', { viewBox: '0 0 28 28' }, close);
          u.svg('path', { d: 'M4 4l20 20M24 4L4 24', fill: 'none', stroke: 'white', 'stroke-width': 2 }, svg);
          close.onclick = ctx.dismiss;
          return { el: ob, dismiss: close };
        } else {
          const ob = u.el('section', 'obstruction announcement', document.body),
            svg = u.svg('svg', { viewBox: '0 0 48 48', class: 'banner-icon' }, ob);
          u.svg(
            'path',
            {
              d: 'M4 18h10L33 9v30l-19-9H4zM11 30l3 12h7l-5-12M39 14l5-3M40 24h7M39 34l5 3',
              fill: 'none',
              stroke: '#b8ee99',
              'stroke-width': 3,
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
            },
            svg,
          );
          const text = u.el('div', '', ob);
          u.el('h2', '', text, 'System Maintenance Tonight');
          u.el(
            'p',
            '',
            text,
            'Scheduled maintenance will occur today from 10:00 PM to 12:00 AM UTC. Some features may be unavailable.',
          );
          const close = u.el('button', '', ob, 'Collapse announcement  ⌃');
          close.dataset.referenceDismiss = 'true';
          close.onclick = ctx.dismiss;
          return { el: ob, dismiss: close };
        }
      }
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el(
        'span',
        '',
        el,
        {
          cookie: 'Store your preferences on this device?',
          toast: 'Workspace synced.',
          chat: 'Need help with this task?',
          promo: 'Explore more practice exercises.',
          banner: 'New practice exercises are available.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, 'Dismiss');
      dismiss.onclick = ctx.dismiss;
      return { el, dismiss };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#79f05f'],
      LOW_ACCENTS: ['#79f05f'],
      parts,
    },
  });
})();
