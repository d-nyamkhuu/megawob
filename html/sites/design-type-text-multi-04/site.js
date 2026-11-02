(function () {
  'use strict';
  const palette = { bg: '#eeece7', panel: '#eeece7', fg: '#111', muted: '#666', line: '#c9c6bd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original contact window has a dedicated right pane even at 1024px.
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
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'New Contact');
      const topTools = u.el('span', 'ds-toptools', top);
      const wb = u.el('span', 'ds-wbtns', top);
      u.el('i', '', wb);
      u.el('i', '', wb);
      u.el('i', '', wb);
      const content = u.el('div', 'ds-content');
      Object.assign(_c, { header: topTools, contentPane: content });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Help'.split('|').forEach((t) => _c.util.el('span', '', nav, t));
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentPane;
      base(_c);
      _c.header = header;
      const note = _c.contentPane.querySelector('.ref-instruction');
      if (note) {
        const inner = _c.util.el('div', 'ds-instruction');
        while (note.firstChild) inner.appendChild(note.firstChild);
        note.appendChild(inner);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-body', document.body);
      body.appendChild(_c.contentPane);
      const main = _c.util.el('div', 'ds-main', _c.contentPane);
      main.classList.toggle('ds-toast-mode', _c.display === 'toast');
      Object.assign(_c, { body: main });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
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
    name: 'design-type-text-multi-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-multi-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#477ba8'],
      LOW_ACCENTS: ['#477ba8'],
      parts,
    },
  });
})();
