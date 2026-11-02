(function () {
  'use strict';
  const palette = { bg: '#eef1f8', panel: '#fff', fg: '#172033', muted: '#647086', line: '#d8dfeb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original workspace has dedicated note locations at every size.
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
      document.body.classList.add('geo-app');
      document.documentElement.style.setProperty('--font', 'Arial, "Segoe UI", sans-serif');
      const shell = u.el('div', 'window-shell', document.body);
      const titlebar = u.el('header', 'window-titlebar', shell);
      titlebar.innerHTML =
        '<span class="brand-pin">●</span><span class="brand">GeoPlanner</span><div class="window-controls"><button type="button">−</button><button type="button">□</button><button type="button">×</button></div>';
      titlebar.querySelectorAll('button').forEach((b) =>
        (b.onclick = () => env.log('window-control', { label: b.textContent })));
      const toolbar = u.el('nav', 'app-tabs', shell);
      for (const [i, t] of ['Map', 'Layers', 'Places', 'Measurements', 'Draw', 'Imagery', 'Settings'].entries()) {
        const b = u.el('button', 'app-tab' + (i === 0 ? ' active' : ''), toolbar, t);
        b.type = 'button';
        b.onclick = () => {
          toolbar.querySelectorAll('.app-tab').forEach((x) => x.classList.remove('active'));
          b.classList.add('active');
        };
      }
      const workspace = u.el('div', 'workspace', shell);
      const aside = u.el('aside', 'inspector', workspace);
      const mapHost = u.el('div', 'map-host map-host-' + _c.display, workspace);
      const main = u.el('main', 'map-pane', mapHost);
      main.dataset.role = 'stage';
      Object.assign(_c, { shell, toolbar, workspace, aside, main, mapHost, header: mapHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note', 'header-note', 'instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const card = (title, icon) => {
        const c = u.el('section', 'inspector-card', _c.aside);
        const h = u.el('h2', 'card-heading', c);
        h.innerHTML = '<span>' + icon + '</span>' + title;
        return c;
      };
      const project = card('Project Area', '◇');
      const summary = [
        ['▦', 'All Features', '24'],
        ['📍', 'Pins', '4'],
        ['⬟', 'Areas', '0'],
        ['⌁', 'Lines', '3'],
        ['☆', 'Points of Interest', '12'],
      ];
      summary.forEach(([ic, label, count]) => {
        const row = u.el('div', 'summary-row', project);
        u.el('span', 'summary-icon', row, ic);
        u.el('span', 'summary-label', row, label);
        u.el('span', 'summary-count', row, count);
      });
      const layers = card('Layers', '◇');
      [
        ['Streets', '14', '#d9dde0', true],
        ['Buildings', '6', '#dfe3e6', true],
        ['Parks', '3', '#b9dda7', true],
        ['Water', '1', '#addcf5', true],
        ['Terrain', '0', '#d8d2c7', false],
      ].forEach(([name, count, color, on]) => {
        const row = u.el('div', 'layer-row', layers);
        const c = u.el('input', '', row);
        c.type = 'checkbox';
        c.checked = on;
        c.tabIndex = -1;
        const sw = u.el('span', 'layer-swatch', row);
        sw.style.background = color;
        u.el('span', 'layer-label', row, name);
        u.el('span', 'layer-count', row, count);
        u.el('span', 'layer-menu', row, '•••');
      });
      _c.body = _c.workspace;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note', 'panel-note');
        _c.aside.prepend(note);
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.main; },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'toast-note');
        _c.mapHost.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('app-footer');
      _c.shell.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('footer-status');
      status.textContent = 'Map data · Riverton district';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        k = ctx.kind,
        el = u.el('section', 'obstruction obstruction-' + k, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Privacy preferences',
          toast: 'Map updated',
          chat: 'GeoPlanner support',
          promo: 'Explore GeoPlanner Plus',
          banner: 'Map service notice',
        }[k] || 'GeoPlanner';
      u.el('strong', '', box, title);
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional cookies help improve GeoPlanner.',
          toast: 'Your map workspace is ready.',
          chat: 'How can we help with your map?',
          promo: 'Discover more ways to explore your area.',
          banner: 'Map data refreshed today.',
        }[k] || '',
      );
      const close = u.el('button', 'dismiss', box, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close');
      close.onclick = () => ctx.dismiss('close');
      return { el, dismiss: close, ttlSteps: k === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-draw-shape-polygon-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-polygon-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1474ee'],
      LOW_ACCENTS: ['#1474ee'],
      parts,
    },
  });
})();
