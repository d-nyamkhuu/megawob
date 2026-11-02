(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#000' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const page = u.el('div', 'ds-page', document.body);
      page.classList.add('ds-display-' + _c.display);
      const work = u.el('section', 'ds-workbench', page);
      const toolbar = u.el('div', 'ds-footer', work);
      Object.assign(_c, { page, work, toolbar, header: work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction');
        _c.work.insertBefore(note, _c.toolbar);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const time = u.el('div', 'ds-time', _c.work);
      time.append('Time remaining: ');
      u.el('b', 'ds-time-value', time, '');
      time.append(' seconds');
      _c.work.insertBefore(time, _c.toolbar);
      const info = u.el('aside', 'ds-inspector', _c.page);
      u.el('h2', '', info, 'Task Info');
      // The unchanged widget writes its legacy goal here; it is never displayed.
      const sink = u.el('span', 'ds-goal-text', info);
      sink.hidden = true;
      const noteSlot = u.el('div', 'ds-note-slot', info);
      const state = u.el('div', 'ds-task-state', info);
      Object.assign(_c, { body: info, noteSlot, state });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'ds-stage', _c.work);
      _c.work.insertBefore(stage, _c.toolbar);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.work.insertBefore(note, _c.work.querySelector('.ds-time'));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
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
      const text = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, text[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-act-in-time-moving-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-moving-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#9900b5'],
      LOW_ACCENTS: ['#9900b5'],
      parts,
    },
  });
})();
