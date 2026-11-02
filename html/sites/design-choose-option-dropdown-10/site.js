(function () {
  'use strict';
  const palette = { bg: '#0a1116', panel: '#151f26', fg: '#dce8f5', muted: '#8a9eb2', line: '#2b3e4b' };
  const paths = {
    logo: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5ZM2 12h20M12 2v20M7 7h10v10H7V7Z',
    search: 'M20 20l-5-5M16 9a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
    bell: 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3ZM10 21h4M12 2v2',
    Edit: 'm4 16-1 5 5-1L20 8l-5-5L4 16ZM13 5l5 5',
    Comment: 'M3 4h18v13H10l-5 4v-4H3V4Z',
    Assign: 'M5 21v-3a7 7 0 0 1 14 0v3M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    Label: 'M3 3h9l9 9-9 9-9-9V3ZM7 7h.01',
    Priority: 'M12 2v20M5 6h14M3 12h18M7 18h10',
    Move: 'm8 5-7 7 7 7M1 12h22M16 5l7 7-7 7',
    More: 'M4 12h.01M12 12h.01M20 12h.01',
    doc: 'M4 2h10l6 6v14H4V2ZM14 2v7h6M8 13h8M8 17h8',
  };
  function icon(el, key) {
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + paths[key] + '"/></svg>';
  }
  function heading(u, parent) {
    const legend = u.el('h2', 'ds-task-legend', parent);
    icon(u.el('i', '', legend), 'doc');
    u.el('span', '', legend, 'Create Issue');
    const pj = u.el('div', 'ds-project', parent);
    u.el('span', '', pj, 'Project');
    u.el('b', '', pj, 'Website Redesign      ⌄');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses the same full-width note card at every viewport.
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
      icon(u.el('span', 'ds-logo', top), 'logo');
      u.el('span', 'ds-brand', top, 'Tracker');
      const tabs = u.el('span', 'ds-tabs', top);
      ['Issues', 'Boards', 'Roadmap', 'Reports', 'Automation'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
      const search = u.el('span', 'ds-search', top);
      icon(u.el('i', '', search), 'search');
      u.el('span', '', search, 'Search issues...');
      u.el('kbd', '', search, 'Ctrl K');
      icon(u.el('span', 'ds-bell', top), 'bell');
      u.el('span', 'ds-avatar', top, 'JD');
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      let header = u.el('div', 'ds-note-slot');
      if (_c.display === 'header') {
        header = u.el('aside', 'ds-header-note', content);
        heading(u, header);
      } else if (_c.display === 'hidden' || _c.display === 'toast') {
        heading(u, u.el('div', 'ds-sceneheading', content));
      }
      Object.assign(_c, { header, body, content, top });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      const nb = u.el('span', 'ds-newissue', nav);
      u.el('span', '', nb, '＋  New Issue');
      u.el('span', 'ds-split', nb, '⌄');
      ['Edit', 'Comment', 'Assign', 'Label', 'Priority', 'Move', 'More'].forEach((t) => {
        const g = u.el('span', 'ds-tool', nav);
        icon(u.el('i', '', g), t);
        u.el('em', '', g, t);
        if (t === 'Priority' || t === 'Move') u.el('span', 'ds-toolchev', g, '⌄');
      });
      _c.toolbar = nav;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.body);
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        heading(_c.util, panel);
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
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
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ds-ready');
      ready.textContent = 'Ready to submit';
      const status = _c.util.el('span', 'ds-noblock', null, 'No blocking issues');
      ready.after(status);
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
    name: 'design-choose-option-dropdown-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#63ef70'],
      LOW_ACCENTS: ['#63ef70'],
      parts,
    },
  });
})();
