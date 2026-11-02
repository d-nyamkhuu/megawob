(function () {
  'use strict';
  const palette = { bg: '#a9aaa6', panel: '#d7d5cc', fg: '#111111', muted: '#41413e', line: '#85847e' };
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'JCA Trading - Demo Account');
      u.el('span', 'ds-window-controls', top, '−  □  ×');
      const menu = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Tools|Window'.split('|').forEach((t) => u.el('span', '', menu, t));
      u.el('span', 'ds-help', menu, 'Help');
      const content = u.el('div', 'ds-content');
      Object.assign(_c, { menu, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const h = _c.header;
      if (_c.display === 'header') _c.header = _c.util.el('aside', 'ds-header-note', h);
      base(_c);
      _c.header = h;
      const text = h.querySelector('.ref-instruction');
      if (text) text.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      'Trade|Watchlist|Orders|Account|Settings|Help'.split('|').forEach((t, i) => {
        const item = u.el('div', '', rail, t);
        item.dataset.icon = ['▰', '▤', '▧', '♙', '⚙', '?'][i];
      });
      body.appendChild(_c.content);
      const main = u.el('div', 'ds-main', _c.content);
      Object.assign(_c, { body: main });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-act-in-time-stock-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-stock-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c5261b'],
      LOW_ACCENTS: ['#c5261b'],
      parts,
    },
  });
})();
