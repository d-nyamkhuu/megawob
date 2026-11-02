// The compact forum frame, styled as a design on the shared site template.
(function () {
  'use strict';

  const palette = {
    bg: '#dde8f4', panel: '#f4f8fd', fg: '#14233a', accent: '#6f8db5',
    font: 'Arial,Helvetica,sans-serif', line: '#a9bdd6', muted: '#555f6e',
  };

  function forumLink(util, parent, text, cls) {
    const link = util.el('a', cls, parent, text);
    link.href = '#';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      env.log('decoy', { what: text });
    });
    return link;
  }

  function styleTools(parent) {
    for (const button of parent.querySelectorAll('.ref-xtra')) button.classList.add('forum-xtra');
    for (const button of parent.querySelectorAll('[data-role="submit"]')) {
      button.classList.add('end-control');
      if (button.classList.contains('ref-endlink')) button.classList.add('end-link');
    }
  }

  function markNote(note, ctx) {
    note.dataset.role = 'instruction';
    note.dataset.instruction = ctx.instruction;
  }

  env.site({
    name: 'design-use-social-feed-some-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'look.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css'],
    design: {
      THEMES: { forum: palette }, LOW_THEME: palette,
      ACCENTS: [palette.accent], LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = 'forum instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util, ctx } = _c;
          const shell = util.el('div', 'site-shell', document.body);
          const left = util.el('aside', 'forum-left', shell);
          util.el('div', 'forum-brand', left, 'Community Forum');
          util.el('div', 'forum-tag', left, 'Discussions. Ideas. People.');
          const center = util.el('div', 'forum-center', shell);
          const note = util.el('section', 'task-note', center);
          markNote(note, ctx);
          const right = util.el('aside', 'forum-right', shell);
          util.el('span', '', right, 'Welcome, guest  |  ');
          forumLink(util, right, 'Log In', '');
          Object.assign(_c, { shell, left, center, right, note, header: center });
        },
        'frame.nav': () => (_c) => {
          const { util, left } = _c;
          const nav = util.el('nav', 'forum-nav', left);
          for (const text of ['Home', 'Forums', 'Members', 'Help']) {
            forumLink(util, nav, text, text === 'Forums' ? 'on' : '');
          }
        },
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.note });
          _c.note.hidden = _c.display !== 'header';
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('forum-tools');
          styleTools(_c.headerTools);
        },
        'frame.body': () => (_c) => {
          _c.body = _c.center;
        },
        'frame.panel': (base) => (_c) => {
          base({ ..._c, body: _c.left });
          const panel = _c.left.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('task-note', 'forum-note-panel');
            markNote(panel, _c.ctx);
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.center);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('task-note', 'forum-note-toast');
            markNote(note, _c.ctx);
            _c.right.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const bar = document.querySelector('.ref-foot') || _c.util.el('footer', '', _c.center);
          bar.classList.add('forum-bar');
          _c.center.append(bar);
          styleTools(bar);
          _c.bar = bar;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            styleTools(dock);
            _c.bar.append(dock);
          }
        },
        // The inherited shift banner belongs inside the fixed-height forum column.
        fault: (base) => (ctx) => {
          const result = base(ctx);
          if (ctx.kind === 'shift') ctx.stage.closest('.forum-center').prepend(result.el);
          return result;
        },
      },
    },
  });
})();
