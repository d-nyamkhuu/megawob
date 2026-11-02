(function () {
  'use strict';
  const palette = { bg: '#c6e5d8', panel: '#e1f0e8', fg: '#092d28', muted: '#31574f', line: '#91b8aa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve this frame's compact-screen note fallbacks.
      let mode = _c.ctx.display || 'header';
      if (mode === 'panel' && (_c.W < 1180 || _c.H < 680)) mode = 'header';
      if (mode === 'toast' && (_c.W < 1100 || _c.H < 680)) mode = 'header';
      _c.display = mode;
      document.body.dataset.simonbrief = mode;
      document.body.classList.toggle('ref-has-note', mode === 'toast');
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
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-mark', brand, '▦');
      u.el('b', '', brand, 'WorkSuite');
      u.el('i', 'ds-divider', brand, '');
      u.el('span', '', brand, 'Training & Assessment');
      const meta = u.el('div', 'ds-meta', top);
      ['User: Alex Chen', 'Role: Trainee', 'Session: TS-4821', 'Help', 'Sign Out'].forEach((text) => u.el('span', '', meta, text));
      const shell = u.el('div', 'ds-frame', document.body);
      const tabs = u.el('nav', 'ds-tabs', shell);
      [['1', 'Task'], ['2', 'Results'], ['3', 'Resources']].forEach((x, i) => {
        const t = u.el('div', 'ds-tab' + (i === 0 ? ' active' : ''), tabs);
        u.el('b', '', t, x[0]);
        u.el('span', '', t, x[1]);
      });
      u.el('strong', 'ds-program', tabs, 'Cognitive Skills Program');
      const bar = u.el('div', 'ds-titlebar', shell);
      u.el('b', '', bar, 'Sequence Recall');
      u.el('span', '', bar, 'Exercise 1 of 3');
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { shell, tabs, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction', 'ds-instruction-header');
        note.setAttribute('role', 'note');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-instruction', 'ds-instruction-panel');
        panel.setAttribute('role', 'note');
        panel.querySelector('.ref-panel-title').textContent = 'Task Instructions';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction', 'ds-instruction-toast');
        note.setAttribute('role', 'note');
        _c.content.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ds-ready');
      ready.textContent = _c.ctx.finish ? 'Session ready' : 'Assessment workspace';
      if (_c.ctx.finish) foot.dataset.finish = 'true';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.shell.appendChild(dock);
        _c.shell.classList.add('ds-floating');
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
    name: 'design-act-in-time-simon-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#197958'],
      LOW_ACCENTS: ['#197958'],
      parts,
    },
  });
})();
