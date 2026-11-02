(function () {
  'use strict';
  const palette = { bg: '#f2f5f8', panel: '#fff', fg: '#172b44', muted: '#687b92', line: '#d6dee6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note region even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const E = _c.util.el;
      document.body.dataset.design = 'breeze';
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, 'Mail - KDE Mail');
      const n = E('nav', 'nav', bar);
      for (const label of ['Mail', 'Contacts', 'Calendar', 'Tasks', 'Notes', 'Settings']) {
        const a = E('button', 'chrome-nav', n, label);
        a.type = 'button';
        a.addEventListener('click', () => env.log('decoy', { label }));
      }
      E('span', 'account', bar, '');
      _c.header = bar;
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note', 'instruction');
        note.dataset.display = 'header';
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = document.body;
      const E = _c.util.el;
      const summary = E('aside', 'mail-summary', document.body);
      E('h2', 'summary-heading', summary, 'Mailbox');
      const counts = [['▱', 'Inbox', '8'], ['▤', 'Drafts', '2'], ['➤', 'Sent', '124'], ['▤', 'Trash', '16']];
      for (const [icon, label, count] of counts) {
        const row = E('div', 'summary-row', summary);
        E('span', 'summary-icon', row, icon);
        E('span', '', row, label);
        E('span', 'summary-count', row, count);
      }
      const storage = E('section', 'storage', summary);
      E('h2', 'summary-heading', storage, 'Storage');
      E('div', 'storage-track', storage);
      E('div', 'storage-copy', storage, '2.4 GB of 15 GB (16%)');
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = 'panel';
        note.querySelector('.ref-panel-title').classList.add('note-title');
        note.querySelector('.ref-panel-text').classList.add('instruction');
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
        note.querySelector('.ref-note-text').classList.add('instruction');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
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
    name: 'design-use-email-reply-all-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-email-reply-all-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1688ed'],
      LOW_ACCENTS: ['#1688ed'],
      parts,
    },
  });
})();
