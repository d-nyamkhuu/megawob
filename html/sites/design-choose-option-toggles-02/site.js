(function () {
  'use strict';
  const palette = { bg: '#3d4049', panel: '#b7b7b7', fg: '#101010', muted: '#343434', line: '#909090' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const win = u.el('div', 'ns-window', document.body);
      const title = u.el('header', 'ns-titlebar', win);
      const left = u.el('div', 'ns-title-icons', title);
      u.el('span', 'ns-icon ns-icon-grid', left, '▦');
      u.el('span', 'ns-icon', left, '≡');
      u.el('strong', '', title, 'System Preferences');
      const info = u.el('button', 'ns-info', title, 'H');
      info.type = 'button';
      const region = u.el('div', 'ns-region', win);
      const head = u.el('div', 'ns-main-head', region);
      u.el('h1', '', head, 'Privacy & Data');
      Object.assign(_c, { win, title, region, header: head });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const columns = u.el('div', 'ns-columns', _c.region);
      const stage = u.el('main', 'ds-stage', columns);
      const inspector = u.el('aside', 'ns-inspector', columns);
      const about = u.el('div', 'ns-about', inspector);
      u.el('div', 'ns-doc-icon', about, '▤');
      u.el('h2', '', about, 'About These Settings');
      u.el('p', '', about, 'These options control what information is collected and shared from this computer.');
      u.el('h3', '', about, 'Usage Analytics');
      u.el('p', '', about,
        'When enabled, this computer sends anonymous information about how you use applications and system features. The data helps us understand which features are most useful and identify opportunities for improvement. No personal documents or the content of your files are sent.');
      const related = u.el('section', 'ns-related', inspector);
      u.el('h3', '', related, 'Related Settings');
      ['Crash Reports', 'Diagnostics', 'Privacy Overview', 'Data and Your Computer'].forEach((x) => {
        const row = u.el('div', 'ns-related-row', related);
        u.el('span', 'ns-mini-doc', row, '▤');
        u.el('span', '', row, x);
      });
      inspector.classList.toggle('ns-with-panel', _c.display === 'panel');
      Object.assign(_c, { body: columns, stage, inspector });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspector;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.win.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('nav', 'ns-dock', _c.win);
      const items = [
        ['▣', 'General'], ['▣', 'Displays'], ['◖', 'Sound'],
        ['◎', 'Network'], ['♙', 'Privacy & Data'], ['▤', 'Software Update'],
      ];
      items.forEach((x, i) => {
        const t = u.el('div', 'ns-dock-item' + (i === 4 ? ' active' : ''), dock);
        u.el('span', 'ns-dock-icon', t, x[0]);
        u.el('span', '', t, x[1]);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      dock.appendChild(foot);
      Object.assign(_c, { dock, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ns-overlay ns-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This computer uses cookies to remember your preferences.',
        toast: 'Settings have been updated.',
        chat: 'Help Desk — How may we help?',
        promo: 'Discover the latest system tools.',
        banner: 'System maintenance is scheduled tonight.',
      };
      u.el('div', '', el, texts[ctx.kind] || 'System notice');
      const close = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : '×');
      close.type = 'button';
      close.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: close, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-toggles-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-toggles-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#555555'],
      LOW_ACCENTS: ['#555555'],
      parts,
    },
  });
})();
