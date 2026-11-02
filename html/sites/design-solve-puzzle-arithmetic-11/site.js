(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#080808', muted: '#666', line: '#888' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('academic', 'document', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const groups = [
        ['File', ['New', 'Open', 'Save']],
        ['Edit', ['Cut', 'Copy', 'Paste']],
        ['Insert', ['Image', 'Link']],
        ['Format', ['Bold', 'Italic', 'Underline']],
        ['Tools', ['Calculator', 'Spelling']],
        ['Help', ['Contents']],
      ];
      const icons = ['▧', '📂', '▣', '✂', '▤', '▣', '▧', '🔗', 'B', 'I', 'U', '▦', 'ABC', '?'];
      let ix = 0;
      groups.forEach((g, gi) => {
        const section = u.el('div', 'ribbon-group group-' + gi, top);
        u.el('b', 'ribbon-heading', section, g[0]);
        const row = u.el('div', 'ribbon-items', section);
        g[1].forEach((label) => {
          const item = u.el('div', 'ribbon-item', row);
          u.el('span', 'ribbon-icon icon-' + label.toLowerCase(), item, icons[ix++]);
          const link = u.el('a', '', item, label);
          link.href = '#';
          link.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { label });
          });
        });
      });
      const center = u.el('div', 'center', app);
      u.el('h1', 'document-title', center, 'Math Practice');
      u.el('p', 'document-desc', center, 'Solve the problem below. Show your work if needed.');
      Object.assign(_c, { app, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('status-ready');
      ready.textContent = 'Ready';
      _c.util.el('b', 'status-task', foot, 'Math Practice');
      _c.util.el('span', 'status-zoom', foot, '1:1');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.status-task'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay update-reminder ' + ctx.kind, document.body),
        bar = u.el('div', 'update-titlebar', el);
      u.el('span', '', bar, 'Software Update');
      const close = u.el('button', 'update-close', bar, '×');
      close.addEventListener('click', ctx.dismiss);
      const body = u.el('div', 'update-body', el);
      u.el('span', 'globe', body, '🌎');
      const copy = u.el('div', 'update-copy', body);
      u.el('strong', '', copy, 'A newer version of this application is available.');
      u.el('p', '', copy, 'We recommend updating for improved security and performance.');
      const actions = u.el('div', 'update-actions', el);
      const update = u.el('button', '', actions, 'Update now');
      update.addEventListener('click', () => env.log('decoy', { label: 'Update now' }));
      const later = u.el('button', 'remind-later', actions, 'Remind me later');
      later.addEventListener('click', ctx.dismiss);
      const details = u.el('button', '', actions, 'View details');
      details.addEventListener('click', () => env.log('decoy', { label: 'View details' }));
      return { el, dismiss: later };
    },
  };
  env.site({
    name: 'design-solve-puzzle-arithmetic-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-solve-puzzle-arithmetic-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#101caa'],
      LOW_ACCENTS: ['#101caa'],
      parts,
    },
  });
})();
