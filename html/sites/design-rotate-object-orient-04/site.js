/* The Daily Chronicle newspaper-tool design. Task state belongs to the rotate task. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Reader tip', 'Take a quick look at how the puzzle works.', 'Show me', 'Skip'],
      cookie: ['Your privacy', 'Allow optional cookies on this site?', 'Accept optional', 'Reject optional'],
      toast: ['Puzzle saved', 'Your progress is ready to continue.', null, 'Dismiss'],
      promo: ['Subscribe', 'Get more puzzles in the Sunday edition.', 'Show details', 'Not now'],
      banner: ['Notice', 'This edition works offline.', null, 'Dismiss'],
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
        else { message.textContent = 'Drag the round handle to turn the arrow.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#faf8f5', panel: '#fbf9f6', fg: '#1a1a1a', muted: '#666666', line: '#bdb8b0' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = `chronicle instruction-${_c.display}`;
      const mast = u.el('header', 'masthead', document.body);
      u.el('div', 'logo', mast, 'The Daily Chronicle');
      u.el('div', 'tagline', mast, 'FACTS TODAY. A BRIGHTER TOMORROW.');
      u.el('div', 'dateline', mast, 'Mon, Apr 18, 2011');
      u.el('span', 'rule-v', mast);
      u.el('a', 'login', mast, 'Log In');
      u.el('a', 'signup', mast, 'Sign Up');
      const index = u.el('ol', 'side-index', document.body);
      for (let i = 1; i <= 15; i++) u.el('li', i === 1 ? 'on' : '', index, String(i));
      const page = u.el('section', 'sheet', document.body);
      u.el('div', 'kicker', page, 'PUZZLES');
      u.el('h2', 'headline', page, 'Rotate the Arrow');
      const toolbar = u.el('div', 'sheet-toolbar', page);
      const help = u.el('div', 'help', toolbar, 'Need help?');
      u.el('span', 'help-q', help, '?');
      u.el('p', 'task-helper', page, 'Adjust the arrow to match the instruction.');
      Object.assign(_c, { page, toolbar, header: page });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'sections', document.body);
      ['Home', 'U.S.', 'World', 'Business', 'Technology', 'Science', 'Health', 'Opinion', 'Arts', 'Life']
        .forEach((t) => _c.util.el('a', '', nav, t));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.page;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'cube-stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.page.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.page.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.page.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-orient-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-orient-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b01c22'],
      LOW_ACCENTS: ['#b01c22'],
      parts,
    },
  });
})();
