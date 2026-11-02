(function () {
  'use strict';
  const palette = {
    bg: '#dfe5e9', panel: '#f1f4f6', fg: '#172738', muted: '#526574', line: '#bdcbd4',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The reference frame has a dedicated note location in every mode.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const win = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-window-title', win, 'AeroTech Technical Reference  |  Connector Specifications');
      const wc = u.el('span', 'ds-window-controls', win);
      u.el('i', '', wc, '−');
      u.el('i', '', wc, '□');
      u.el('i', 'close', wc, '×');
      const hero = u.el('section', 'ds-hero', document.body);
      u.el('div', 'ds-logo', hero, '◢ AeroTech');
      u.el('div', 'ds-kicker', hero, 'TECHNICAL REFERENCE');
      u.el('div', 'ds-hero-title', hero, 'Connector Specifications');
      u.el('div', 'ds-revision', hero, 'Revision 3.4  |  March 2014');
      u.el('div', 'ds-drawing', hero, '');
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { win, contentPane: content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.win;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Task Note';
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
        _c.contentPane.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.contentPane.appendChild(foot);
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
        cookie: 'Technical reference cookies and site preferences.',
        toast: 'Reference settings saved.',
        chat: 'How can we help with this specification?',
        promo: 'Explore the AeroTech catalog.',
        banner: 'Reference library maintenance notice.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-locate-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-locate-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#174d70'],
      LOW_ACCENTS: ['#174d70'],
      parts,
    },
  });
})();
