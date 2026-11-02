(function () {
  'use strict';
  const C = { site: 'design-choose-option-tree-02', brand: 'Personal Organizer', menu: 'File|Edit|View|Tools|Help' };
  const palette = { bg: '#008080', panel: '#c0c0c0', fg: '#090909', muted: '#333333', line: '#777777' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'ds-window', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-appicon', top, '◧');
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window-controls', top, '_  □  ×');
      const nav = u.el('nav', 'ds-menu', win);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const toolbar = u.el('div', 'ds-toolbar', win);
      [
        ['▤', 'New'], ['📂', 'Open'], ['▧', 'Print'], ['✂', 'Cut'],
        ['▣', 'Copy'], ['▤', 'Paste'], ['👥', 'Contacts'],
      ].forEach((x, i) => {
        if (i === 3 || i === 6) u.el('i', 'ds-tool-sep', toolbar);
        const b = u.el('button', 'ds-tool', toolbar, x[0]);
        b.type = 'button';
        b.title = x[1];
      });
      const body = u.el('div', 'ds-body', win);
      const rail = u.el('aside', 'ds-rail', body);
      [['👥', 'Contacts'], ['▦', 'Calendars'], ['☑', 'Tasks'], ['🧺', 'Recipes']].forEach((x) => {
        const item = u.el('div', 'ds-navitem', rail);
        u.el('b', '', item, x[0]);
        u.el('span', '', item, x[1]);
      });
      const contentRoot = u.el('div', 'ds-content', body);
      Object.assign(_c, { win, toolbar, contentRoot, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentRoot;
      base(_c);
      _c.header = header;
      const note = _c.contentRoot.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-header-note', _c.contentRoot);
        note.classList.add('ds-instruction');
        box.appendChild(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.contentRoot;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.contentRoot;
      base(_c);
      _c.body = body;
      const panel = _c.contentRoot.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.contentRoot);
      const stage = u.el('main', 'ds-stage', main);
      const summary = u.el('aside', 'ds-summary', main);
      u.el('h2', '', summary, 'Selection summary');
      const sum = u.el('div', 'ds-summary-box', summary);
      [
        'Contacts', 'Calendars', 'Tasks', 'Notes', 'Favorites', 'Vegetarian',
        'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Low sodium',
      ].forEach((x) => {
        const row = u.el('div', 'ds-sumrow', sum);
        u.el('span', '', row, x + ':');
        u.el('b', '', row, '0');
      });
      Object.assign(_c, { main, stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentRoot.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentRoot.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This application stores your preferences.',
        toast: 'Changes saved.',
        chat: 'How can we help?',
        promo: 'Discover more organizer tools.',
        banner: 'System notice.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
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
      THEMES: { 'design-choose-option-tree-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      TITLES: [C.brand],
      parts,
    },
  });
})();
