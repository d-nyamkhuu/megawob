(function () {
  'use strict';
  const palette = { bg: '#77b8f0', panel: '#eef4fa', fg: '#10152b', muted: '#6d7177', line: '#abc3dd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has room for all note modes above the mail panes.
      _c.display = _c.ctx.display || 'header';
      document.body.dataset.episodeDisplay = _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const E = _c.util.el;
      document.body.dataset.design = 'aqua';
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, 'Mail   File   Edit   View   Message   Format   Window   Help');
      E('span', 'account', bar, 'Mon Apr 14  10:24 AM');
      const dots = E('div', 'traffic-lights', document.body);
      dots.innerHTML = '<i></i><i></i><i></i>';
      const header = E('div', 'chrome-notes', document.body);
      const toolbar = E('div', 'chrome-tools', document.body);
      toolbar.classList.toggle('chrome-tools-left', _c.display === 'toast');
      Object.assign(_c, { bar, header, toolbar });
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
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'mail-workspace', document.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = 'panel';
        note.querySelector('.ref-panel-title').textContent = 'Task';
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
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('desktop-footer');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      // Keep the native notes inside the reserved strip above the task panes.
      const note = _c.header.querySelector('.task-note');
      if (!note) return;
      const s = _c.stage.getBoundingClientRect();
      const top = _c.bar.getBoundingClientRect().bottom + 2;
      const bottom = s.top + s.height * 0.1 - 2;
      const tools = _c.headerTools.getBoundingClientRect();
      const hasTools = _c.headerTools.children.length > 0;
      const left = note.getBoundingClientRect().left;
      const besideTools = hasTools && note.dataset.display !== 'toast';
      const available = besideTools ? Math.max(200, tools.left - left - 8) : window.innerWidth * 0.98;
      if (note.dataset.display === 'header') note.style.width = available + 'px';
      else if (besideTools) note.style.maxWidth = available + 'px';
      let f = parseFloat(getComputedStyle(note).fontSize);
      while (note.getBoundingClientRect().height > bottom - top && f > 12) {
        f -= 0.5;
        note.style.fontSize = f + 'px';
      }
      if (note.getBoundingClientRect().height > bottom - top && note.dataset.display !== 'header') {
        note.dataset.display = 'header';
        note.style.left = '1%';
        note.style.right = 'auto';
        note.style.width = available + 'px';
        note.style.fontSize = '12px';
      }
      const r = note.getBoundingClientRect();
      note.style.top = Math.max(top, Math.min(r.top, bottom - r.height)) + 'px';
      const fixed = note.getBoundingClientRect();
      note.style.left = Math.round(fixed.left) + 'px';
      note.style.top = Math.round(fixed.top) + 'px';
      note.style.width = Math.ceil(fixed.width) + 'px';
      note.style.height = Math.ceil(fixed.height) + 'px';
      note.style.right = 'auto';
      note.style.bottom = 'auto';
    },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const e = ctx.util.el('aside', 'obstruction consent', document.body);
        e.setAttribute('role', 'dialog');
        ctx.util.el('h3', '', e, 'Help Make Mail Better');
        ctx.util.el(
          'p',
          '',
          e,
          'Allow Apple to collect anonymous usage data to help improve Mail. No personal information is sent.',
        );
        const b = ctx.util.el('button', '', e, 'Reject optional');
        b.type = 'button';
        b.dataset.dismiss = 'true';
        b.addEventListener('click', () => ctx.dismiss('reject'));
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
    name: 'design-use-email-nl-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'cookie' },
    design: {
      THEMES: { 'design-use-email-nl-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1274ed'],
      LOW_ACCENTS: ['#1274ed'],
      parts,
    },
  });
})();
