(function () {
  'use strict';
  const palette = { bg: '#e5ebf1', panel: '#ffffff', fg: '#0c1220', muted: '#536171', line: '#cdd5df' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ipad', 'instruction-' + _c.display);
      if (_c.ctx.finish) document.body.classList.add('finish');
      if (_c.display === 'hidden') document.body.classList.add('no-note');
      if (!_c.ctx.finish) document.body.classList.add('ep-end-toolbar');
      const root = u.el('main', 'app', document.body);
      const head = u.el('header', 'top', root);
      const title = u.el('div', 'app-title', head);
      u.el('strong', '', title, 'Contacts');
      const toolbar = u.el('div', 'toolbar', head);
      Object.assign(_c, { shell: root, header: head, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const workspace = u.el('div', 'workspace', _c.shell);
      const side = u.el('aside', 'contact-list', workspace);
      u.el('h1', '', side, 'Contacts');
      const search = u.el('div', 'search', side);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', '', search, 'Search');
      const people = [
        'Jordan Taylor', 'Morgan Smith', 'Alex Kim', 'Priya Rao',
        'Daniel Lee', 'Sophia Chen', 'James Miller', 'Emma Wilson',
      ];
      people.forEach((name, i) => {
        const row = u.el('div', 'contact-row' + (i === 0 ? ' active' : ''), side);
        u.el('i', 'avatar ' + (i ? 'muted' : ''), row,
          name.split(' ').map((x) => x[0]).join(''));
        u.el('span', '', row, name);
      });
      const stage = u.el('section', 'stage', workspace);
      const summary = u.el('aside', 'summary', workspace);
      u.el('h2', '', summary, 'Contact Summary');
      [
        ['♟', 'Total Contacts', '8'], ['●', 'Customers', '5'],
        ['▦', 'Partners', '2'], ['★', 'Leads', '1'],
      ].forEach(([ic, label, n]) => {
        const row = u.el('div', 'stat', summary);
        u.el('span', 'stat-icon', row, ic);
        u.el('span', '', row, label);
        u.el('b', '', row, n);
      });
      Object.assign(_c, { body: workspace, stage, summary });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.summary;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => () => {},
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('nav', 'dock', _c.shell);
      [
        ['♟', 'Contacts'], ['▢', 'Calendar'], ['✓', 'Tasks'], ['⚙', 'Settings'],
      ].forEach(([ic, label], i) => {
        const item = u.el('div', 'dock-item' + (!i ? ' selected' : ''), dock);
        u.el('span', 'dock-icon', item, ic);
        u.el('span', '', item, label);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        dock.appendChild(foot);
        if (foot.querySelector('.ref-submit, .ref-endlink, .ref-xtra')) dock.classList.add('has-tools');
        if (foot.querySelector('.ref-endlink')) dock.classList.add('has-endlink');
      }
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      b.addEventListener('click', ctx.dismiss);
      return { el, dismiss: b };
    },
  };
  env.site({
    name: 'design-solve-puzzle-fix-error-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-fix-error-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2678ed'],
      LOW_ACCENTS: ['#2678ed'],
      parts,
    },
  });
})();
