(function () {
  'use strict';
  const palette = { bg: '#eef5f1', panel: '#f5faf7', fg: '#1d303b', muted: '#294b43', line: '#c3d8d1' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('notebook07', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'nb-top', app);
      u.el('strong', 'nb-brand', top, 'WorkBench');
      u.el('span', 'nb-divider', top, '│');
      u.el('span', 'nb-product', top, 'Notebook');
      const nav = u.el('nav', 'nb-nav', top);
      ['Projects', 'Notes', 'Tools', 'Help'].forEach((x) => u.el('span', '', nav, x));
      u.el('span', 'nb-user', top, 'JS');
      const ws = u.el('div', 'nb-workspace', app);
      const left = u.el('aside', 'nb-brief', ws);
      const sec = u.el('section', 'nb-brief-section', left);
      const h = u.el('h2', '', sec);
      u.el('span', 'nb-index', h, '1');
      u.el('span', '', h, 'Task Brief');
      sec.hidden = _c.display === 'hidden';
      Object.assign(_c, { app, ws, left, header: sec });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('nb-instruction', 'nb-note-header');
    },
    'frame.tools': (base) => (_c) => {
      // Header tools occupy the notebook's toolbar, above the generator panel.
      const toolbar = _c.util.el('div', 'nb-toolbar');
      const header = _c.header;
      _c.header = toolbar;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.submit.classList.add('nb-top-end');
      _c.toolbar = toolbar;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const groups = [
        ['Details', ['Use the Generate button on the right to create a new number.', 'The notebook keeps your number tools together in one workspace (tabs 01, 02, 03, and 04).']],
        ['Goal', 'Complete the task using the controls on the right.'],
      ];
      groups.forEach((g, i) => {
        const sec = u.el('section', 'nb-brief-section', _c.left);
        const h = u.el('h2', '', sec);
        u.el('span', 'nb-index', h, String(i + 2));
        u.el('span', '', h, g[0]);
        if (Array.isArray(g[1])) {
          const ul = u.el('ul', '', sec);
          g[1].forEach((text) => u.el('li', '', ul, text));
        } else u.el('p', '', sec, g[1]);
      });
      const right = u.el('section', 'nb-right', _c.ws);
      right.appendChild(_c.toolbar);
      const tabs = u.el('nav', 'nb-tabs', right);
      [['01', 'Random Number'], ['02', 'Calculator'], ['03', 'Data'], ['04', 'Reports']].forEach((t, i) => {
        const tab = u.el('div', 'nb-tab' + (i === 0 ? ' active' : ''), tabs);
        u.el('b', '', tab, t[0]);
        u.el('span', '', tab, t[1]);
      });
      const panel = u.el('section', 'nb-panel', right);
      u.el('h1', 'nb-panel-title', panel, 'Random Number Generator');
      Object.assign(_c, { body: _c.ws, right, panel });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) note.classList.add('nb-instruction');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('div', 'stage', _c.panel);
      const info = u.el('div', 'nb-info', _c.right);
      const recent = u.el('section', 'nb-card', info);
      u.el('h2', '', recent, 'Recent Numbers');
      const table = u.el('div', 'nb-table', recent);
      ['#　　 Value　　 Generated At', '1　　 4　　 10:24:12 AM', '2　　 8　　 10:24:07 AM',
        '3　　 6　　 10:24:03 AM', '4　　 2　　 10:23:58 AM', '5　　 4　　 10:23:54 AM'].forEach((x) => u.el('div', '', table, x));
      const about = u.el('section', 'nb-card', info);
      u.el('h2', '', about, 'About');
      u.el('p', '', about, 'Each time you press Generate, a new random whole number from 1 to 10 is shown.');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        note.classList.add('nb-instruction', 'nb-note-toast');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.right.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = '';
        if (_c.submit && (_c.placement === 'footer' || _c.placement === 'link')) _c.submit.classList.add('nb-bottom-end');
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.right.appendChild(dock);
      if (_c.submit && _c.placement === 'floating') _c.submit.classList.add('nb-floating-end');
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
    name: 'design-solve-puzzle-generate-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#165541'], LOW_ACCENTS: ['#165541'], parts,
    },
  });
})();
