(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#111', muted: '#6d7177', line: '#e4e4e4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every original note mode uses the reserved strip above the mailbox.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const E = _c.util.el;
      document.body.dataset.design = 'swiss';
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, '');
      E('span', 'account', bar, 'Help  |  My Account  |  Sign Out');
      const header = E('div', 'swiss-task-area', document.body);
      const toolbar = E('div', 'swiss-toolbar', document.body);
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
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'swiss-body', document.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note', 'episode-panel');
        note.dataset.display = 'panel';
        note.querySelector('.ref-panel-title').textContent = 'Task';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'episode-toast');
        note.dataset.display = 'toast';
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'desktop-footer', document.body);
      for (const t of ['Mail', 'Calendar', 'Files', 'Settings']) _c.util.el('span', '', footer, t);
      const actions = _c.util.el('div', 'swiss-actions', footer);
      actions.appendChild(_c.toolbar);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        if (_c.placement === 'footer' || _c.placement === 'link') footer.appendChild(foot);
        else actions.appendChild(foot);
        const status = foot.querySelector('.ref-foot-text');
        if (status) status.textContent = 'Ready';
      }
      _c.footer = footer;
      _c.actions = actions;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) dock.classList.add('swiss-floating');
    },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const e = ctx.util.el('aside', 'obstruction update', document.body);
        e.setAttribute('role', 'dialog');
        ctx.util.el('h3', '', e, 'A newer version is available');
        ctx.util.el('p', '', e, 'Get the latest features and security updates for a better experience.');
        const b = ctx.util.el('button', '', e, 'Remind me later');
        b.type = 'button';
        b.dataset.dismiss = 'true';
        b.addEventListener('click', () => ctx.dismiss());
        return { el: e, dismiss: b };
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
    name: 'design-use-email-reply-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'toast' },
    design: {
      THEMES: { 'design-use-email-reply-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ee281b'],
      LOW_ACCENTS: ['#ee281b'],
      parts,
    },
  });
})();
