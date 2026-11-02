(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#363d4d', muted: '#7e899d', line: '#e5e8ed' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const { ctx, util } = _c;
      const E = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
      document.body.dataset.design = 'minimal';
      const bar = E('header', 'desktop-bar', document.body);
      const brand = E('span', 'brand', bar);
      brand.innerHTML = '<svg class="brand-envelope" viewBox="0 0 42 32" aria-hidden="true"><defs><linearGradient id="envelope-green" x2="0" y2="1"><stop stop-color="#4bc286"/><stop offset="1" stop-color="#2eb16c"/></linearGradient></defs><rect x="1" y="1" width="40" height="30" rx="3" fill="url(#envelope-green)"/><path d="m4 5 17 13L38 5" fill="none" stroke="white" stroke-width="2.6"/></svg>';
      E('span', '', brand, 'Mail');
      const searchBox = E('label', 'header-search', bar);
      searchBox.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg>';
      const headerSearch = E('input', '', searchBox);
      headerSearch.type = 'search';
      headerSearch.placeholder = 'Search email';
      headerSearch.setAttribute('aria-label', 'Search email');
      const account = E('div', 'account', bar);
      const avatar = E('span', 'account-avatar', account);
      avatar.innerHTML = '<svg viewBox="0 0 38 38" aria-hidden="true"><circle cx="19" cy="15" r="6"/><path d="M9 29c0-9 20-9 20 0"/></svg>';
      E('span', '', account, ctx.spec?.me?.name || 'Jordan Lee');
      const down = E('span', 'account-chevron', account);
      down.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5"/></svg>';
      Object.assign(_c, { bar, header: document.body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'mail-frame-body', document.body);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = 'toast';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    'frame.end': (base) => (_c) => {
      const taskNote = document.querySelector('.task-note');
      if (taskNote) {
        const stage = _c.stage;
        const limit = stage.getBoundingClientRect().top + stage.clientHeight * 0.173 - 6;
        let size = parseFloat(getComputedStyle(taskNote).fontSize);
        while (taskNote.getBoundingClientRect().bottom > limit && size > 17) {
          taskNote.style.fontSize = --size + 'px';
        }
        const r = taskNote.getBoundingClientRect();
        taskNote.style.left = Math.round(r.left) + 'px';
        taskNote.style.top = Math.round(r.top) + 'px';
        taskNote.style.width = Math.round(r.width) + 'px';
        taskNote.style.height = Math.round(r.height) + 'px';
      }
      return base(_c);
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
    name: 'design-use-email-important-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-email-important-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#29b164'],
      LOW_ACCENTS: ['#29b164'],
      TITLES: ['Mail'],
      parts,
    },
  });
})();
