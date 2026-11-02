(function () {
  'use strict';
  const C = { site: 'design-act-in-time-stock-09', brand: 'MarketTrade', menu: 'File|Edit|View|Tools|Help' };
  const palette = { bg: '#dcecf9', panel: '#f8fbff', fg: '#14294b', muted: '#536d8a', line: '#b7cbe0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.ctx.display === 'panel' && _c.W < 1440) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const lights = u.el('span', 'ds-window-controls', top);
      u.el('i', 'ds-red', lights, '●'); u.el('i', 'ds-yellow', lights, '●'); u.el('i', 'ds-green', lights, '●');
      u.el('span', 'ds-app-icon', top, '↗');
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach(t => u.el('span', '', nav, t));
      u.el('span', 'ds-search', top, '⌕  Search Symbols');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      for (let i = 1; i <= 20; i++) u.el('div', i === 1 ? 'active' : '', rail, String(i));
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instr-header');
        const text = _c.util.el('div', 'ds-instruction');
        text.textContent = note.textContent;
        note.replaceChildren(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-end-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instr-panel');
        note.querySelector('.ref-panel-title').classList.add('ds-note-label');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
        _c.body.classList.remove('ref-panel-right');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instr-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        note.querySelector('.ref-note-x').classList.add('ds-note-close');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.classList.toggle('ds-footer-quiet', _c.ctx.finish || _c.placement === 'header' || _c.placement === 'icon');
      _c.content.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('ds-footer-status');
      status.textContent = 'Market data · Connected';
      // The original status follows the controls.
      foot.appendChild(status);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
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
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1685ed'], LOW_ACCENTS: ['#1685ed'], parts,
    },
  });
})();
