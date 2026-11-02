(function () {
  'use strict';
  const palette = { bg: '#3284e8', panel: '#f0eddf', fg: '#111', muted: '#6d7177', line: '#6a8fbd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original XP task window has room for every note mode.
      _c.display = _c.ctx.display === 'toast' && _c.W < 1260 ? 'header' : (_c.ctx.display || 'header');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const E = _c.util.el;
      document.body.dataset.design = 'xp';
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, 'My Mail');
      const nav = E('nav', 'nav', bar);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const a = E('button', 'chrome-nav', nav, label);
        a.type = 'button';
        a.addEventListener('click', () => env.log('decoy', { label }));
      }
      E('span', 'account', bar, 'Mon Apr 14  10:24 AM');
      const di = E('div', 'desktop-icons', document.body);
      di.innerHTML = '<div><svg viewBox="0 0 50 50"><path d="M4 14h17l5 5h20v25H4Z"/></svg>My Documents</div><div><svg viewBox="0 0 50 50"><path d="M6 5h38v28H6Z M22 33v8h-8v4h25v-4h-8v-8"/></svg>My Computer</div><div><svg viewBox="0 0 50 50"><path d="M11 10h28l-3 35H14Z M7 10h36 M18 5h14"/></svg>Recycle Bin</div>';
      const header = E('div', 'xp-note-host', document.body);
      const toolbar = E('div', 'xp-controls', document.body);
      Object.assign(_c, { header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = 'header';
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'xp-body', document.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = 'toast';
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const E = _c.util.el;
      const footer = E('footer', 'desktop-footer', document.body);
      E('span', 'xp-start', footer, '◆ start');
      E('span', 'xp-task', footer, '✉ My Mail');
      E('span', '', footer, '10:24 AM');
      base(_c);
      footer.appendChild(document.body.querySelector('.ref-foot'));
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const e = ctx.util.el('aside', 'obstruction tour', document.body);
        e.setAttribute('role', 'dialog');
        ctx.util.el('h3', '', e, 'Welcome to My Mail!');
        ctx.util.el('p', '', e, 'Here you can read and manage your email. Take a quick tour to see key features.');
        const skip = ctx.util.el('button', '', e, 'Skip tour');
        skip.type = 'button';
        skip.dataset.dismiss = 'true';
        skip.addEventListener('click', () => ctx.dismiss());
        return { el: e, dismiss: skip };
      }
      const e = ctx.util.el('aside', 'perturb ' + ctx.kind, document.body);
      const texts = {
        cookie: ['Cookie preferences', 'Choose which cookies we may use.', 'Reject optional'],
        toast: ['Mail synchronized', 'Your mailbox is up to date.', 'Dismiss'],
        chat: ['Mail support', 'Need any help today?', 'Close chat'],
        promo: ['Get more from Mail', 'Try the expanded mailbox plan.', 'No thanks'],
        banner: ['Service announcement', 'Scheduled maintenance tonight.', 'Dismiss'],
      };
      const [title, body, label] = texts[ctx.kind];
      ctx.util.el('h3', '', e, title);
      ctx.util.el('p', '', e, body);
      const b = ctx.util.el('button', '', e, label);
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss());
      return { el: e, dismiss: b };
    },
  };
  env.site({
    name: 'design-use-email-important-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'tour' },
    design: {
      THEMES: { 'design-use-email-important-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#d8e1ec'],
      LOW_ACCENTS: ['#d8e1ec'],
      parts,
    },
  });
})();
