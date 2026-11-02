(function () {
  'use strict';
  const palette = { bg: '#fbfaf7', panel: '#fbfaf7', fg: '#15130f', muted: '#6a665e', line: '#b9b6ae' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four displays have dedicated places in this newspaper layout.
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
      const top = u.el('header', 'ds-top', document.body);
      const mast = u.el('span', 'ds-brand', top);
      u.el('span', 'ds-brand-t', mast, 'The Daily Chronicle');
      u.el('span', 'ds-rule', top);
      u.el('span', 'ds-tag', top, 'LOCAL NEWS  FOR A BRIGHTER TOMORROW');
      u.el('span', 'ds-spacer', top);
      u.el('span', 'ds-date', top, 'Mon, Apr 18, 2011');
      u.el('span', 'ds-rule2', top);
      u.el('a', 'ds-link', top, 'Help');
      u.el('span', 'ds-rule2', top);
      u.el('a', 'ds-link', top, 'Contact Us');
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const toolbar = u.el('div', 'ds-footer', main);
      Object.assign(_c, { top, body, content, main, toolbar, header: main });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const brief = _c.util.el('aside', 'ds-brief', _c.main);
        note.classList.add('ds-instruction');
        brief.appendChild(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.content;
      base(_c);
      _c.body = body;
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        panel.querySelector('.ref-panel-title').textContent = 'Contact desk instructions';
        _c.content.insertBefore(panel, _c.main);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const shelf = document.body.querySelector('.ref-foot');
      shelf.classList.add('ds-shelf');
      const text = shelf.querySelector('.ref-foot-text');
      text.textContent = '© 2011 The Daily Chronicle';
      const tools = shelf.querySelector('.ref-tools');
      const u = _c.util;
      shelf.insertBefore(u.el('span', 'ds-rule2'), tools);
      shelf.insertBefore(u.el('span', '', null, 'All rights reserved.'), tools);
      shelf.insertBefore(u.el('span', 'ds-spacer'), tools);
      u.el('a', 'ds-link', shelf, 'Terms of Use');
      u.el('span', 'ds-rule2', shelf);
      u.el('a', 'ds-link', shelf, 'Privacy Policy');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
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
    name: 'design-fill-form-card-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#a80f17'],
      LOW_ACCENTS: ['#a80f17'],
      parts,
    },
  });
})();
