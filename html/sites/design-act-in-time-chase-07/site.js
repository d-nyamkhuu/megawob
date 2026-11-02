(function () {
  'use strict';
  const palette = { bg: '#bdbdbd', panel: '#c6c6c6', fg: '#111111', muted: '#333333', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original notebook supports every display at every viewport.
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
      u.el('span', 'ds-brand', top, 'Pointer Tracking Task  -  OS/2 Workplace Shell');
      const meta = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Options|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      let header = top;
      if (_c.display === 'header') {
        const note = u.el('aside', 'ds-header-note', content);
        const tabs = u.el('div', 'ds-tabs', note);
        ['Task Overview', 'Session Info', 'About'].forEach((t, i) =>
          u.el('div', i ? 'ds-tab' : 'ds-tab active', tabs, t));
        const box = u.el('div', 'ds-overview', note);
        const icon = u.el('div', 'ds-task-icon', box);
        icon.setAttribute('aria-hidden', 'true');
        header = u.el('div', 'ds-overview-copy', box);
        u.el('h2', '', header, 'Task Overview');
      }
      const main = u.el('div', 'ds-main', content);
      const controls = u.el('div', 'ds-app-controls', content);
      ['Start', 'Pause', 'Reset'].forEach((t, i) => {
        const b = u.el('button', i === 0 ? 'disabled' : '', controls, t);
        b.type = 'button';
        if (i === 0) b.disabled = true;
      });
      Object.assign(_c, { header, content, main, controls });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.controls;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('ds-episode-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
      _c.util.el('div', 'ds-stage-tab', _c.stage, 'Tracking Area');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-episode-toast');
        const title = _c.util.el('strong', '', null, 'Task Notice');
        note.prepend(title);
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        _c.content.appendChild(foot);
      }
      const taskbar = _c.util.el('div', 'ds-chase-status', document.body);
      _c.util.el('span', '', taskbar, 'OS/2');
      _c.util.el('span', '', taskbar, '◉  Pointer Tracking Task');
      _c.util.el('span', 'ds-clock-label', taskbar, '10:24 AM');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        const tools = _c.content.querySelector('.ref-foot .ref-tools');
        if (tools) tools.appendChild(dock);
        else _c.content.appendChild(dock);
      }
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
    name: 'design-act-in-time-chase-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-chase-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0875cf'],
      LOW_ACCENTS: ['#0875cf'],
      parts,
    },
  });
})();
