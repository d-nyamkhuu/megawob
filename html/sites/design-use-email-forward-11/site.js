(function () {
  'use strict';
  const palette = { bg: '#11191f', panel: '#141d23', fg: '#e5edf6', muted: '#8391a0', line: '#34424d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const E = _c.util.el;
      document.body.dataset.design = 'developer';
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, 'TaskHub | Mail');
      const nav = E('nav', 'nav', bar);
      const a = E('button', 'chrome-nav', nav, 'Task ready');
      a.type = 'button';
      a.addEventListener('click', () => env.log('decoy', { label: 'Task ready' }));
      E('span', 'account', bar, 'Help  |  My Account  |  Sign Out');
      const noteHost = E('div', 'mail-note-host', document.body);
      Object.assign(_c, { bar, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note', 'instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = document.body; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = _c.display;
        note.querySelector('.ref-panel-text').classList.add('instruction');
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
        note.dataset.display = _c.display;
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'desktop-footer', document.body);
      for (const text of ['Quick Tools', 'Search', 'Add Note', 'Calculator', 'Contacts']) {
        _c.util.el('span', '', footer, text);
      }
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const ob = ctx.util.el('aside', 'obstruction notifications', document.body);
        ob.setAttribute('role', 'dialog');
        ob.dataset.role = 'overlay';
        ctx.util.el('h3', '', ob, 'Notifications');
        const cards = [
          ['Build complete', 'UI build finished successfully.', '2m ago'],
          ['New comment', 'Priya commented on Design Doc.', '7m ago'],
          ['Weekly report', 'Your weekly report is ready.', '14m ago'],
          ['Calendar update', 'Team sync moved to 3 PM.', '28m ago'],
        ];
        const shapes = [
          [
            ['path', { d: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9' }],
            ['path', { d: 'M10 21h4' }],
          ],
          [
            ['circle', { cx: 12, cy: 12, r: 9 }],
            ['path', { d: 'M12 11v5' }],
            ['path', { d: 'M12 8h.01' }],
          ],
          [
            ['rect', { x: 3, y: 5, width: 18, height: 14, rx: 1 }],
            ['path', { d: 'm3 7 9 6 9-6' }],
          ],
          [
            ['rect', { x: 3, y: 5, width: 18, height: 16, rx: 1 }],
            ['path', { d: 'M7 3v4M17 3v4M3 10h18' }],
          ],
        ];
        cards.forEach(([title, body, time], i) => {
          const card = ctx.util.el('div', 'notification-card', ob);
          const badge = ctx.util.el('span', 'notification-icon icon-' + i, card);
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('aria-hidden', 'true');
          for (const [tag, attrs] of shapes[i]) {
            const part = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (const [key, value] of Object.entries(attrs)) part.setAttribute(key, value);
            svg.appendChild(part);
          }
          badge.appendChild(svg);
          const copy = ctx.util.el('div', 'notification-copy', card);
          ctx.util.el('strong', '', copy, title);
          ctx.util.el('span', '', copy, body);
          ctx.util.el('span', 'notification-time', card, time);
        });
        const b = ctx.util.el('button', '', ob, 'Dismiss all');
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
    name: 'design-use-email-forward-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'toast' },
    design: {
      THEMES: { 'design-use-email-forward-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a7f86e'],
      LOW_ACCENTS: ['#a7f86e'],
      parts,
    },
  });
})();
