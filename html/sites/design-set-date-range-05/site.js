(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This desktop has its own Notes window at every supported size.
      _c.display = _c.ctx.display || 'header';
    },
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
      u.el('span', 'ds-brand', top).innerHTML =
        '<svg viewBox="0 0 28 30"><path d="M17 7c-2-4 1-7 5-7 0 4-2 6-5 7M14 10c-7-6-13 0-11 9 2 8 6 11 10 8 3-2 4 1 7 0 3-2 5-5 5-8-6-2-6-7-2-10-3-3-6-2-9 1"/></svg>';
      const nav = u.el('nav', 'ds-menu', top);
      'File|Edit|Trip|View|Special'.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-clock', top, '10:24 AM');
      u.el('span', 'ds-help', top, '?');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const tb = u.el('div', 'ds-titlebar', content);
      u.el('span', 'ds-close', tb);
      u.el('span', 'ds-wintitle', tb, 'Travel Planner');
      const ph = u.el('div', 'ds-pagehead', content);
      u.el('span', 'ds-brief-icon', ph);
      u.el('span', '', ph, 'Plan Your Trip');
      let panelBody = null;
      if (_c.display === 'panel') {
        const panel = u.el('aside', 'ds-palette', body);
        const pt = u.el('div', 'ds-titlebar', panel);
        u.el('span', 'ds-close', pt);
        u.el('span', 'ds-wintitle', pt, 'Notes');
        panelBody = u.el('div', 'ds-palbody', panel);
        u.el('span', 'ds-doc', panelBody);
      }
      const trash = u.el('div', 'ds-trash', body);
      u.el('span', 'ds-bin', trash);
      u.el('span', '', trash, 'Trash');
      Object.assign(_c, { body, content, toolbar: tb, header: content, panelBody });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.panelBody || _c.body });
    },
    'frame.stage': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
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
    name: 'design-set-date-range-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
