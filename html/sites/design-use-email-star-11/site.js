(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#6d7177', line: '#aaa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design reserves the same note region for every visible display.
      _c.display = _c.ctx.display || 'header';
      document.body.dataset.design = 'academic';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const bar = u.el('header', 'desktop-bar', document.body);
      u.el('span', 'brand', bar, 'Campus Mail');
      const nav = u.el('nav', 'nav', bar);
      const a = u.el('button', 'chrome-nav', nav, 'Riverton University');
      a.type = 'button';
      a.addEventListener('click', () => env.log('decoy', { label: 'Riverton University' }));
      u.el('span', 'account', bar, 'Help  |  My Account  |  Sign Out');
      const noteBox = u.el('div', 'note-region', document.body);
      Object.assign(_c, { bar, noteBox, header: noteBox });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'mail-frame', document.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteBox;
      base(_c);
      _c.body = body;
      const note = _c.noteBox.querySelector('.ref-panel-text');
      if (note) note.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.noteBox.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('instruction');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('desktop-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Complete the task above.';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      // Match the original note's fitting without changing its reserved region.
      for (const note of _c.noteBox.querySelectorAll('.ref-instruction,.ref-panel,.ref-note')) {
        let f = parseFloat(getComputedStyle(note).fontSize);
        while (note.scrollHeight > note.clientHeight + 1 && f > 12) {
          f -= 0.5;
          note.style.fontSize = f + 'px';
        }
      }
    },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const e = ctx.util.el('aside', 'obstruction announcement', document.body);
        e.setAttribute('role', 'dialog');
        ctx.util.el('h3', '', e, 'Campus System Maintenance This Weekend');
        ctx.util.el('p', '', e, 'Email may be slower than usual from Sat 8:00 PM to Sun 6:00 AM.');
        const a = ctx.util.el('a', 'announcement-details', e, 'See full details.');
        a.href = '#';
        a.addEventListener('click', (ev) => ev.preventDefault());
        const b = ctx.util.el('button', '', e, 'Collapse announcement');
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
    name: 'design-use-email-star-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-use-email-star-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#e3e3e3'],
      LOW_ACCENTS: ['#e3e3e3'],
      parts,
    },
  });
})();
