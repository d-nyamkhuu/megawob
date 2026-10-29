// Neighborly's leather organizer, on the shared site frame. The widget owns the feed and rail.
(function () {
  'use strict';

  // Keep instruction decorations local; visibility and content come from the template sections.
  function decorateNote(_c, note, text, mode) {
    const { util } = _c;
    note.classList.add('task-note');
    if (mode) note.classList.add(mode + '-note');
    note.dataset.role = 'instruction';
    const check = util.el('span', 'task-check', note, '✓');
    note.prepend(check);
    text.classList.add('task-copy');
  }

  const parts = {
    'frame.theme': (base, S) => (_c) => {
      const { ctx } = _c;
      const { rng, util, content } = ctx;
      const root = document.documentElement;
      for (const [key, value] of Object.entries(S.THEMES.paper)) root.style.setProperty('--' + key, value);
      root.style.setProperty('--accent', S.ACCENTS[0]);
      root.dataset.theme = 'paper';
      Object.assign(_c, { rng, util, content, root });
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This separate task window has room for every display mode, even at 1024 × 640.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'twin instruction-' + _c.display;
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      const shell = util.el('div', 'site-shell', document.body);
      util.el('div', 'plant', shell);
      const book = util.el('div', 'book', shell);
      util.el('div', 'book-spine', book);
      util.el('div', 'book-motto', book, 'Good conversations build brighter days.');
      const win = util.el('section', 'task-win', shell);
      const header = util.el('div', 'win-bar', win);
      util.el('span', 'win-dot', header);
      util.el('span', 'win-title', header, 'Task');
      util.el('span', 'win-ctl', header, '–  ×');
      const pane = util.el('div', 'win-pane', win);
      const note = util.el('section', '', pane);
      const sticky = util.el('div', 'sticky-note', shell);
      util.el('span', '', sticky, 'Small actions create big change.');
      Object.assign(_c, { shell, book, win, header, pane, note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.note });
      const text = _c.note.querySelector('.ref-instruction');
      if (text) decorateNote(_c, _c.note, text);
      else _c.note.remove();
    },
    'frame.body': () => (_c) => {
      const { util, pane } = _c;
      util.el('h3', '', pane, 'Activity');
      const progress = util.el('div', 'progress-row', pane);
      util.el('div', 'progress-fill', util.el('div', 'progress-bar', progress));
      util.el('span', 'progress-value', progress, '0 active');
      util.el('h3', '', pane, 'Tips');
      const tips = util.el('ul', 'tips', pane);
      for (const text of ['Each post has its own action buttons.', 'Click an active button again to undo it.']) {
        util.el('li', '', tips, text);
      }
      const actions = util.el('div', 'win-actions', pane);
      Object.assign(_c, { body: pane, actions });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.pane.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').remove();
        decorateNote(_c, panel, panel.querySelector('.ref-panel-text'), 'panel');
        _c.actions.before(panel);
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.book);
      Object.assign(_c, { stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        decorateNote(_c, note, note.querySelector('.ref-note-text'), 'toast');
        _c.actions.before(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        _c.actions.append(...foot.querySelector('.ref-tools').children);
        foot.remove();
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.actions.append(...dock.children);
        dock.remove();
      }
    },
    'frame.end': (base) => (_c) => {
      const { win, headerTools, actions, submit, placement } = _c;
      win.dataset.endPlacement = placement || 'none';
      for (const decoy of win.querySelectorAll('.ref-xtra')) {
        decoy.classList.add('chrome-xtra');
        actions.append(decoy);
      }
      if (submit) {
        submit.classList.add('end-control', 'end-' + (placement === 'header' || placement === 'icon' ? 'toolbar' : placement));
      }
      if (!headerTools.children.length) headerTools.remove();
      if (!actions.children.length) actions.classList.add('quiet-actions');
      return base(_c);
    },
    overlay: () => function (ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };

  env.site({
    name: 'design-use-social-feed-all-06',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: {
        paper: { bg: '#4a2a1a', panel: '#f6efdc', fg: '#2a2118', line: '#d9cdb0', muted: '#6f6250',
          font: "Georgia,'Times New Roman',serif" },
      },
      ACCENTS: ['#1f3f7a'],
      parts,
    },
  });
})();
