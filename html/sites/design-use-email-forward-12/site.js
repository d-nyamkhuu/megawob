(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#6d7177', line: '#111' };
  function fitNote(_c) {
    const text = _c.noteBox.querySelector('.ref-instruction,.ref-panel-text,.ref-note-text');
    if (!text) return;
    text.classList.add('instruction');
    text.dataset.display = _c.display;
    const style = getComputedStyle(_c.noteBox);
    const available = _c.noteBox.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    let font = parseFloat(style.fontSize);
    while (text.scrollHeight > available && font > 12) text.style.fontSize = --font + 'px';
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const E = _c.util.el;
      document.body.dataset.design = 'macrecover';
      const bar = E('header', 'desktop-bar', document.body);
      const apple = E('span', 'apple-mark', bar);
      apple.innerHTML = '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M16 5c1-2 1-4 1-5-3 0-5 2-5 5 1 0 3 0 4-1ZM20 7c-3-2-5-1-8 0-3-2-6-2-8 0-5 4-3 12 1 17 2 3 4 1 7 1s5 2 7-1c2-2 3-5 4-7-5-2-6-7-3-10Z"/></svg>';
      E('span', 'brand', bar, 'File   Edit   View   Message   Window   Help');
      E('span', 'account', bar, 'Mon Apr 4  10:24 AM');
      const noteBox = E('aside', 'task-note', document.body);
      noteBox.dataset.display = _c.display;
      noteBox.hidden = _c.display === 'hidden';
      const title = E('div', 'note-title', noteBox);
      E('span', 'title-label', title, 'Task');
      if (!noteBox.hidden) {
        const rect = noteBox.getBoundingClientRect();
        Object.assign(noteBox.style, {
          left: Math.round(rect.left) + 'px', top: Math.round(rect.top) + 'px',
          width: Math.round(rect.width) + 'px', height: Math.round(rect.height) + 'px',
          right: 'auto', bottom: 'auto',
        });
      }
      const toolbar = E('div', 'site-tools', document.body);
      Object.assign(_c, { header: noteBox, noteBox, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      fitNote(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = document.body; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteBox;
      base(_c);
      _c.body = body;
      fitNote(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', document.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteBox.appendChild(note);
      fitNote(_c);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) foot.classList.add('site-footer');
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const ob = E('aside', 'obstruction layout-error', document.body);
        ob.setAttribute('role', 'dialog');
        const warning = E('span', 'warning-icon', ob);
        warning.innerHTML =
          '<svg viewBox="0 0 76 68" aria-hidden="true"><path d="M35 5Q38 0 41 5L72 57Q76 64 69 64H7Q0 64 4 57Z"/><path d="M37 21h3l-1 21h-1Z"/><circle cx="39" cy="51" r="2"/></svg>';
        E('h3', '', ob, 'Layout could not be restored.');
        const p = E('p', '', ob, 'The previous ');
        p.style.whiteSpace = 'pre-line';
        E('strong', '', p, 'window layout');
        p.append(document.createTextNode(' could not be restored.\nSome panes may be hidden or out of place.'));
        const b = E('button', '', ob, 'Use default layout');
        b.type = 'button';
        b.dataset.dismiss = 'true';
        b.addEventListener('click', () => ctx.dismiss());
        return { el: ob, dismiss: b };
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
    name: 'design-use-email-forward-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { macrecover: palette }, LOW_THEME: palette,
      ACCENTS: ['#fff'], LOW_ACCENTS: ['#fff'], parts,
    },
  });
})();
