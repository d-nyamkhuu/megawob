(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#66707d', line: '#bbc2c9' };
  function menu(u, parent, cls) {
    const nav = u.el('nav', cls, parent);
    ['Home', 'Exercises', 'Word List', 'Help'].forEach((text, i) => {
      if (i) u.el('i', '', nav, '|');
      const a = u.el('a', '', nav, text);
      a.addEventListener('click', () => env.log('decoy', { label: text }));
    });
    return nav;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This document has room for its original inline cards at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
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
      const win = u.el('div', 'ds-win', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-brand', top, 'Word Study');
      menu(u, top, 'ds-menu');
      const pal = u.el('aside', 'ds-pal', document.body);
      const pt = u.el('div', 'ds-pal-t', pal, 'Quick Notes');
      u.el('span', '', pt, '×');
      u.el('div', 'ds-pal-b', pal, 'Synonym means a word with a similar meaning.');
      const link = u.el('a', 'ds-pal-l', pal, 'Word List');
      link.addEventListener('click', () => env.log('decoy', { label: 'Word List' }));
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { win, top, content, body, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = h;
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.top.classList.toggle('ds-has-tools', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = b;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const nav = menu(_c.util, foot, 'ds-fnav');
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = '© 1995 Word Study';
      foot.appendChild(text);
      Object.assign(_c, { foot, fnav: nav });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.fnav);
    },
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
    name: 'design-find-fact-similar-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-similar-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
