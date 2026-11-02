(function () {
  'use strict';
  const palette = { bg: '#f8f7f5', panel: '#fff', fg: '#101626', muted: '#6d7177', line: '#d6dce6' };

  function styleNote(note, display) {
    if (!note) return;
    note.classList.add('task-note');
    note.dataset.display = display;
    const text = note.querySelector('.ref-panel-text, .ref-note-text');
    if (text) text.classList.add('instruction');
  }

  function reserveNote(_c) {
    const note = document.body.querySelector('.task-note');
    if (!note) return;
    const bounds = note.getBoundingClientRect();
    const s = _c.stage.getBoundingClientRect();
    if (_c.display === 'header') {
      document.body.style.setProperty('--mail-note-extra', Math.max(0, Math.ceil(bounds.bottom + 6 - s.top - s.height * 0.08)) + 'px');
    } else {
      document.body.style.setProperty('--mail-note-reserve', Math.ceil(bounds.height + 24) + 'px');
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.dataset.instruction = _c.display;
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
      document.body.style.setProperty('--mail-note-extra', '0px');
      document.body.style.setProperty('--mail-note-reserve', '0px');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const E = (tag, cls, parent, text) => _c.util.el(tag, cls, parent, text);
      document.body.dataset.design = 'fluent';
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, 'Mail');
      E('span', 'account', bar, 'Mon Apr 14  10:24 AM');
      const controls = E('div', 'window-controls', bar);
      for (const [label, path] of [
        ['Minimize', 'M5 12h14'],
        ['Maximize', 'M6 5h12v14H6z'],
        ['Close', 'M5 5l14 14M19 5L5 19'],
      ]) {
        const b = E('button', '', controls);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + path + '"/></svg>';
      }
      _c.header = bar;
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c.header.querySelector('.ref-instruction'), 'header');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('mail-top-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = document.body;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      styleNote(document.body.querySelector('.ref-panel'), 'panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', document.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      styleNote(document.body.querySelector('.ref-note'), 'toast');
      reserveNote(_c);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('desktop-footer');
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('ready-status');
      status.textContent = 'Ready';
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
    name: 'design-use-email-reply-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-email-reply-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0082ff'],
      LOW_ACCENTS: ['#0082ff'],
      parts,
    },
  });
})();
