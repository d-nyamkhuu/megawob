(function () {
  'use strict';
  const palette = { bg: '#5f85ae', panel: '#d1d1d1', fg: '#111', muted: '#6d7177', line: '#777' };
  const fitNote = (note) => {
    if (!note) return;
    let f = parseFloat(getComputedStyle(note).fontSize);
    while (note.scrollHeight > note.clientHeight + 1 && f > 12) {
      f -= 0.5;
      note.style.fontSize = f + 'px';
    }
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original desktop has a dedicated note card even in compact modes.
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
      document.body.dataset.design = 'risc';
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, 'RISC OS');
      E('span', 'account', bar, 'Mon Apr 14  10:24 AM');
      const toolbar = E('div', 'desktop-tools', document.body);
      const header = E('aside', 'header-note', document.body);
      header.hidden = _c.display !== 'header';
      if (_c.display === 'header') {
        header.classList.add('task-note');
        header.dataset.display = 'header';
      }
      Object.assign(_c, { header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      fitNote(_c.header);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'desktop-body', document.body);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = 'panel';
        fitNote(note);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', document.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = 'toast';
        fitNote(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'desktop-footer', document.body);
      for (const t of ['Disc', 'Apps', 'Edit', 'Draw', 'Calc', 'Files', 'Net']) _c.util.el('span', '', footer, t);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      Object.assign(_c, { footer, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.kind === 'survey') {
        const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const ob = E('aside', 'obstruction survey', document.body);
        ob.setAttribute('role', 'dialog');
        const content = E('div', 'survey-content', ob);
        E('p', '', content, 'How satisfied are you with Mail?');
        for (const [i, label] of [
          'Very satisfied',
          'Satisfied',
          'Neutral',
          'Dissatisfied',
          'Very dissatisfied',
        ].entries()) {
          const l = E('label', '', content);
          const r = E('input', '', l);
          r.type = 'radio';
          r.name = 'satisfaction';
          r.checked = i === 2;
          E('span', '', l, ' ' + label);
        }
        E('p', '', content, 'Additional comments:');
        E('textarea', '', content);
        E('h3', '', ob, 'Quick Survey');
        const b = E('button', '', ob, 'Close survey');
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
    name: 'design-use-email-star-reply-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'survey' },
    design: {
      THEMES: { 'design-use-email-star-reply-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2d63c7'],
      LOW_ACCENTS: ['#2d63c7'],
      parts,
    },
  });
})();
