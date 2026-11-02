/* NeXTSTEP-style Lab Control reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Lab Control', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Settings saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['More experiments', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el, '×');
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
      close.onclick = () => ctx.dismiss('close');
      const message = u.el('p', '', el, content[1]);
      const actions = u.el('div', 'tour-actions', el);
      if (content[2]) {
        const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
        primary.onclick = () => {
          if (ctx.kind === 'cookie') ctx.dismiss('accept');
          else { message.textContent = 'Click and drag the knob around its center to turn it to the requested setting.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function titlebar(u, parent, text, cls) {
    const bar = u.el('header', 'nx-title ' + (cls || ''), parent);
    const mini = u.el('i', 'nx-mini', bar);
    const glyph = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, mini);
    u.svg('path', { d: 'M4 9L13 3L20 9L11 15ZM4 12L11 18L20 12M4 15L11 21L20 15', fill: '#b9b9b9', stroke: '#eee', 'stroke-width': .8 }, glyph);
    u.svg('path', { d: 'M13 3V10L20 9M4 9L11 15V21', fill: 'none', stroke: '#555', 'stroke-width': 1 }, glyph);
    u.el('span', 'nx-title-text', bar, text);
    u.el('i', 'nx-close', bar, '×');
    return bar;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Both note containers fit even at the smallest training viewport.
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
      document.body.className = `nextstep instruction-${_c.display}`;
      const menu = u.el('nav', 'nx-menu', document.body);
      u.el('span', 'nx-apple', menu, '');
      u.svg('svg', { width: 16, height: 18, viewBox: '0 0 16 18' }, menu.firstChild);
      menu.firstChild.firstChild.innerHTML = '<path d="M8 4C6 2.7 2 4 2 9c0 4 3 8 5 7 1-.5 2-.5 3 0 1.7.9 3.8-2.5 4.6-4.5-1.8-.8-2.5-3.5-.5-5.3C12.7 2.8 10.5 3 9 4zM9 3C9 1 10 0 11.5 0 11.5 2 10 3 9 3z" fill="#111"/>';
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Windows', 'Help']) u.el('span', '', menu, m);
      u.el('span', 'nx-clock', menu, 'Mon Apr 12   10:24 AM');
      const top = u.el('section', 'nx-win nx-overview', document.body);
      const overviewToolbar = titlebar(u, top, 'Lab Control — Thermal Chamber');
      const tb = u.el('div', 'nx-ov-body', top);
      const left = u.el('div', 'nx-ov-left', tb);
      u.el('h3', '', left, 'Experiment Overview');
      for (const [k, v] of [['Project:', 'Alloy Stress Test'], ['Sample ID:', 'A3-1187'], ['Chamber Mode:', 'Heat Soak'],
        ['Temperature:', '125 °C'], ['Hold Time:', '—'], ['Status:', 'Ready']]) {
        const r = u.el('div', 'nx-kv', left); u.el('span', '', r, k); u.el('span', '', r, v);
      }
      const right = u.el('div', 'nx-ov-right', tb);
      u.el('h3', '', right, _c.display === 'panel' ? 'Task Inspector' : 'Procedure');
      const steps = ['Place sample in chamber.', 'Set temperature to 125 °C.', 'Turn the knob to adjust the setting.', 'Close the chamber door.'];
      steps.forEach((s, i) => {
        const r = u.el('div', 'nx-step', right);
        u.el('span', '', r, (i + 1) + '.'); u.el('span', '', r, s);
      });
      const win = u.el('section', 'nx-win nx-setter', document.body);
      const toolbar = titlebar(u, win, 'Set Timer');
      const page = u.el('div', 'nx-set-body', win);
      Object.assign(_c, { header: toolbar, toolbar, overviewToolbar, page, right });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.page;
      base(_c);
      _c.header = header;
      const note = _c.page.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
      const text = _c.right.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'cube-stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        _c.page.insertBefore(note, _c.stage);
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.page.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.overviewToolbar.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#4a4a4a', panel: '#bdbdbd', fg: '#111111', muted: '#555555', line: '#555555' };
  env.site({
    name: 'design-rotate-object-dial-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-dial-02': palette }, LOW_THEME: palette,
      ACCENTS: ['#333333'], LOW_ACCENTS: ['#333333'], parts,
    },
  });
})();
