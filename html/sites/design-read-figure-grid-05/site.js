(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#111111', muted: '#777777', line: '#9bb6cc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      if (!document.body._fragGuard) {
        document.body._fragGuard = true;
        document.body.addEventListener('click', (e) => {
          const a = e.target.closest && e.target.closest('a[href]');
          if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
        });
      }
      document.body.className = 'directory98 portal instruction-' + _c.display;
      // Retain the compact masthead used by the original chrome's own stream.
      const chrome = _c.rng.fork('chrome/end');
      if (!_c.ctx.finish && !chrome.bool(0.5) && chrome.pick(['activity', 'mast']) === 'mast') {
        document.body.classList.add('mast-compact');
      }
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      const globe = u.svg('svg', { width: 64, height: 64, viewBox: '0 0 64 64', class: 'globe' }, brand);
      u.svg('circle', { cx: 32, cy: 32, r: 30, fill: '#2868d7', stroke: '#103f9d', 'stroke-width': 2 }, globe);
      u.svg('path', {
        d: 'M18 9l8 2 3 5-5 4 2 6-7 3-6-5-5 1 2-9zm24-1 7 4-3 5-5 1-4-5zM33 27l8-4 7 4-1 8-6 2-3 10-6 6-4-5 1-9-5-4 2-6zM8 34l8-4 6 5-2 8 5 5-6 6-7-3-4-9zM49 42l8-3-2 8-6 5-4-4z',
        fill: '#59b943',
      }, globe);
      const name = u.el('div', 'brand-copy', brand);
      u.el('strong', '', name, 'WebGuide ’98');
      u.el('span', '', name, 'Your Guide to the World Wide Web');
      const nav = u.el('nav', 'mast-nav', top);
      ['Home', 'Search', 'Sites by Subject', 'Add a Site', 'Help'].forEach((x, i) => {
        if (i) u.el('span', 'divider', nav, '|');
        const a = u.el('a', '', nav, x);
        a.href = '#';
      });
      u.el('div', 'date', top, 'Tuesday, March 3, 1998');
      const center = u.el('section', 'center', app);
      const bar = u.el('div', 'activity-title', center);
      u.el('span', '', bar, 'Interactive Activity');
      const brief = u.el('div', 'brief', center);
      if (_c.display === 'toast') brief.classList.add('brief-notice');
      if (_c.display === 'hidden' || _c.display === 'panel') brief.classList.add('brief-absent');
      u.el('p', 'task-description', center, 'Find the requested point on the coordinate grid below. Click the point to select it.');
      const aside = u.el('aside', 'aside', app);
      function section(title, cls) {
        const box = u.el('section', 'portal-section ' + (cls || ''), aside);
        u.el('h2', '', box, title);
        return box;
      }
      const search = section('Search the Web');
      const form = u.el('div', 'search-row', search);
      const field = u.el('input', '', form);
      field.type = 'text';
      field.setAttribute('aria-label', 'Search the Web');
      const searchButton = u.el('button', 'search-button', form, 'Search');
      searchButton.type = 'button';
      const radios = u.el('div', 'search-types', search);
      ['Web', 'Images', 'News'].forEach((x, i) => {
        const label = u.el('label', '', radios);
        const input = u.el('input', '', label);
        input.type = 'radio';
        input.name = 'portal-search';
        input.checked = i === 0;
        u.el('span', '', label, x);
      });
      const browse = section('Browse by Subject', 'subjects');
      const subjectGrid = u.el('div', 'link-grid', browse);
      ['Arts & Humanities', 'Recreation & Sports', 'Business & Economy', 'Reference', 'Computers & Internet', 'Regional', 'Education', 'Science', 'Entertainment', 'Society & Culture', 'Health', 'Kids', 'News & Media', 'All Categories'].forEach((x) => {
        const a = u.el('a', '', subjectGrid, x);
        a.href = '#';
      });
      const featured = section('Featured Links', 'featured');
      ['Yahoo!', 'AltaVista', 'Lycos', 'Excite', 'About.com', 'MapQuest', 'Weather Channel'].forEach((x) => {
        const a = u.el('a', 'featured-link', featured, x);
        a.href = '#';
      });
      const controls = section('Task Controls', 'task-controls');
      const status = u.el('p', 'control-status', controls, 'No point selected.');
      Object.assign(_c, { app, center, bar, brief, controls, status, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.controls;
      base(_c);
      _c.body = body;
      const panel = _c.controls.querySelector('.ref-panel');
      if (panel) _c.controls.insertBefore(panel, _c.status);
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.brief.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      if (_c.display === 'panel') _c.controls.insertBefore(foot, _c.status);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = _c.ctx.finish ? 'WebGuide directory services' : '';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bar.insertBefore(dock, _c.bar.querySelector('.ref-tools'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-grid-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-grid-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0645ad'],
      LOW_ACCENTS: ['#0645ad'],
      parts,
    },
  });
})();
