(function () {
  'use strict';
  const C = { site: 'design-read-figure-addition-11', scenario: 'addition' },
    u = env.util;
  function windowControls(p) {
    const row = u.el('div', 'window-controls', p);
    for (const kind of ['min', 'max', 'close']) {
      const svg = u.svg('svg', { viewBox: '0 0 20 20' }, row);
      u.svg('path', {
        d: kind === 'min' ? 'M2 12h16' : kind === 'max' ? 'M3 3h14v14H3z' : 'M3 3l14 14M17 3L3 17',
        fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
      }, svg);
    }
  }
  const palette = { bg: '#f1f1f1', panel: '#fff', fg: '#111', muted: '#555', line: '#aaa' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      document.body.className = 'metro instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', 'app-title', top, 'Math Practice');
      const toolbar = u.el('div', 'title-tools', top);
      windowControls(top);
      const center = u.el('div', 'center display-' + _c.display, app);
      Object.assign(_c, { app, top, toolbar, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      if (_c.submit) {
        _c.submit.classList.add('metro-header-end');
        _c.toolbar.classList.add('has-end');
      }
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) panel.querySelector('.ref-panel-title').textContent = 'Task';
    },
    'frame.stage': () => (_c) => {
      _c.stage = u.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.app.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      u.el('footer', 'bottom', _c.app);
      const taskbar = u.el('div', 'taskbar', _c.app);
      const win = u.svg('svg', { viewBox: '0 0 40 40' }, taskbar);
      u.svg('path', {
        d: 'M2 5l16-2v16H2zM21 3l17-2v18H21zM2 22h16v16L2 36zM21 22h17v18l-17-2z', fill: '#1cb4ee',
      }, win);
      u.el('b', '', taskbar, 'Math Practice');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      taskbar.appendChild(foot);
      if (_c.placement === 'footer' || _c.placement === 'link') {
        // Preserve footer membership when the scene reparents its end element.
        _c.submit.classList.add('metro-footer-end', 'ref-foot');
        foot.classList.add('has-end');
      }
      u.el('div', 'clock', taskbar, '10:24 AM   4/16/2012');
      _c.taskbar = taskbar;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.taskbar.insertBefore(dock, _c.taskbar.querySelector('.clock'));
        _c.submit.classList.add('metro-floating-end');
      }
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
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-read-figure-addition-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0675c6'],
      LOW_ACCENTS: ['#0675c6'],
      parts,
    },
  });
})();
