(function () {
  'use strict';
  const palette = { bg: '#1c61a0', panel: '#d9d9d9', fg: '#111', muted: '#6d7177', line: '#8a8a8a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if ((_c.display === 'panel' || _c.display === 'toast') && (_c.W < 1260 || _c.H < 700)) _c.display = 'header';
      document.body.dataset.instrmode = _c.display;
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
      document.body.dataset.design = 'beos';
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, 'BeMail');
      const nav = E('nav', 'nav', bar);
      for (const label of ['File', 'Edit', 'Message', 'Window', 'Help']) {
        const a = E('button', 'chrome-nav', nav, label);
        a.type = 'button';
        a.addEventListener('click', () => env.log('decoy', { label }));
      }
      E('span', 'account', bar, 'Mon Apr 14  10:24 AM');
      const header = E('div', 'note-host', document.body);
      const toolbar = E('div', 'site-tools', document.body);
      Object.assign(_c, { header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = document.body; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', document.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.dataset.display = _c.display;
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
      const E = _c.util.el;
      const ob = E('aside', 'obstruction stale', document.body);
      ob.setAttribute('role', 'dialog');
      E('h3', '', ob, 'Unsaved layout changes');
      const p = E('p', '', ob, 'You have moved a panel. Continue without saving?');
      p.style.whiteSpace = 'pre-line';
      const b = E('button', '', ob, 'Continue without saving');
      b.type = 'button';
      b.dataset.dismiss = 'true';
      b.addEventListener('click', () => {
        ob.remove();
        env.log('overlay-dismiss', { kind: 'stale', how: 'button' });
      });
      for (const n of document.querySelectorAll('.task-note')) {
        let f = parseFloat(getComputedStyle(n).fontSize);
        while (n.scrollHeight > n.clientHeight + 1 && f > 12) {
          f -= 0.5;
          n.style.fontSize = f + 'px';
        }
      }
      for (const e of document.body.querySelectorAll('.task-note,.obstruction')) {
        const r = e.getBoundingClientRect();
        Object.assign(e.style, { left: Math.round(r.left) + 'px', top: Math.round(r.top) + 'px', width: Math.round(r.width) + 'px', height: Math.round(r.height) + 'px', right: 'auto', bottom: 'auto' });
      }
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
    name: 'design-use-email-star-reply-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-email-star-reply-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ddd'],
      LOW_ACCENTS: ['#ddd'],
      parts,
    },
  });
})();
