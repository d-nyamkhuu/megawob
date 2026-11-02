(function () {
  'use strict';
  const palette = { bg: '#c8cbd1', panel: '#e2e5eb', fg: '#101622', muted: '#536074', line: '#9ba5b4' };
  const icons = [
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#9b6337" d="M2 8h11l3 3h14v17H2z"/><path fill="#d7b37d" d="M3 13h25v14H3z"/><path fill="#eee0c3" d="M5 15h21v10H5z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#755334" d="M14 21h4v9h-4z"/><path fill="#2c7540" d="M16 1 5 15h7L3 23h11v4h4v-4h11l-9-8h7z"/><path fill="#4a9a54" d="m16 4-8 10h6l-8 7h9z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#888d94" stroke="#353a40" d="M4 28V8l8-5 7 4 8-4v25l-8 3-7-3z"/><path fill="#d8d9d5" d="M7 10h4v5H7zm0 8h4v5H7zm8-8h4v5h-4zm0 8h4v5h-4zm8-8h2v13h-2z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="13" cy="25" rx="10" ry="4" fill="#b98708" stroke="#4b3a0a"/><path fill="#edc52f" stroke="#4b3a0a" d="M3 20v5c0 2 4 4 10 4s10-2 10-4v-5z"/><ellipse cx="13" cy="20" rx="10" ry="4" fill="#ffe15a" stroke="#4b3a0a"/><ellipse cx="23" cy="12" rx="8" ry="3" fill="#ffe15a" stroke="#4b3a0a"/><path fill="#d7a616" stroke="#4b3a0a" d="M15 12v6c0 2 3 3 8 3s8-1 8-3v-6z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#d3cc7b" stroke="#39434b" stroke-width="1.5" d="m3 7 8-4 10 4 8-4v22l-8 4-10-4-8 4z"/><path fill="none" stroke="#385f87" stroke-width="2" d="m11 3 0 22m10-18v22M4 20l7-7 6 3 6-8 6 3"/><path fill="#cc5b35" d="m19 10 4-4 4 4-4 4z"/></svg>',
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#efeee8" stroke="#52575e" stroke-width="2" d="M5 2h17l6 6v22H5z"/><path fill="#b9cce0" d="M21 2v7h7"/><path stroke="#58616b" stroke-width="1.5" d="M9 13h14M9 17h14M9 21h14M9 25h14"/></svg>',
  ];
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original toast is an inline card and also fits short viewports.
      if (_c.ctx.display === 'toast') _c.display = 'toast';
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
      u.el('button', 'ds-appmenu', top, '☰');
      u.el('span', 'ds-brand', top, 'Parks Information Guide');
      u.el('span', 'ds-window', top, '↙　▣　×');
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const outer = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', outer);
      ['Guide', 'Parks', 'Facilities', 'Fees', 'Maps', 'Index'].forEach((t, i) => {
        const a = u.el('div', i === 0 ? 'on' : '', rail);
        u.el('span', 'ds-navicon', a).innerHTML = icons[i];
        u.el('span', '', a, t);
      });
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
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
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = '';
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
        cookie: 'This guide uses cookies.',
        toast: 'Changes synced.',
        chat: 'How can we help?',
        promo: 'Explore Parks Guide.',
        banner: 'County Parks Department notice.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-locate-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#7598d7'],
      LOW_ACCENTS: ['#7598d7'],
      parts,
    },
  });
})();
