(function () {
  'use strict';
  const palette = { bg: '#c9c7c1', panel: '#c4c2bc', fg: '#111', muted: '#555', line: '#555' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('m91', 'brief-left', 'instruction-' + _c.display);
      const win = u.el('main', 'm-win', document.body);
      const tb = u.el('header', 'm-title', win);
      u.el('i', 'm-sys', tb);
      u.el('span', 'm-ttext', tb, 'Shape Identifier');
      const wc = u.el('div', 'm-wc', tb);
      ['min', 'max', 'close'].forEach((k) => u.el('i', 'm-wb ' + k, wc));
      const body = u.el('div', 'm-body');
      const left = u.el('div', 'm-left', body);
      let header = u.el('div', 'm-task-slot');
      if (_c.display === 'header') {
        const task = u.el('section', 'm-panel m-task', left);
        u.el('h3', '', task, 'Task');
        header = u.el('div', 'm-inset m-taskin', task);
      }
      Object.assign(_c, { win, body, left, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const mb = u.el('nav', 'm-menu', _c.win);
      ['File', 'Edit', 'Options', 'Help'].forEach((t) => u.el('span', t === 'Help' ? 'on' : '', mb, t));
      const dd = u.el('div', 'm-drop', _c.win);
      ['Contents', 'Tutorial', 'About...'].forEach((t) => u.el('span', '', dd, t));
      const help = mb.querySelector('.on');
      help.tabIndex = 0;
      help.setAttribute('role', 'button');
      help.setAttribute('aria-expanded', 'true');
      const toggleHelp = () => {
        dd.hidden = !dd.hidden;
        help.setAttribute('aria-expanded', String(!dd.hidden));
      };
      help.addEventListener('click', toggleHelp);
      help.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleHelp();
        }
      });
      dd.addEventListener('click', () => {
        dd.hidden = true;
        help.setAttribute('aria-expanded', 'false');
      });
      _c.toolbar = mb;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      _c.win.appendChild(_c.body);
      const fig = u.el('section', 'm-panel m-fig', _c.left);
      u.el('h3', '', fig, 'Figure and Choices');
      const fin = u.el('div', 'm-inset m-figin', fig);
      const right = u.el('aside', 'm-right', _c.body);
      let noteSlot = right;
      if (_c.display === 'toast') {
        noteSlot = u.el('section', 'm-panel m-note-panel m-note-toast', right);
        u.el('h3', '', noteSlot, 'Task notice');
      }
      Object.assign(_c, { fin, right, noteSlot });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
      const note = _c.right.querySelector('.ref-panel');
      if (note) {
        note.classList.add('m-panel', 'm-note-panel');
        const title = note.querySelector('.ref-panel-title');
        title.textContent = 'Instructions';
        note.querySelector('.ref-panel-text').classList.add('m-inset', 'm-note-text');
      }
      const u = _c.util;
      const p = u.el('section', 'm-panel m-fb', _c.right);
      u.el('h3', '', p, 'Feedback');
      const fb = u.el('div', 'm-feed', p);
      u.el('div', 'm-feedtext', fb, 'No answer yet.');
      const sb = u.el('div', 'm-sbar', fb);
      u.el('i', '', sb);
      u.el('i', '', sb);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.fin);
      _c.bottom = _c.util.el('div', 'bottom', _c.fin);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('m-inset', 'm-note-text');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.bottom.appendChild(foot);
      const u = _c.util;
      const st = u.el('footer', 'm-status', _c.win);
      u.el('span', '', st, 'Ready.');
      u.el('span', 'm-cell', st, 'INS');
      u.el('span', 'm-cell', st, '10:24 AM');
      _c.status = st;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.status.insertBefore(dock, _c.status.querySelector('.m-cell'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-identify-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#233f8a'],
      LOW_ACCENTS: ['#233f8a'],
      parts,
    },
  });
})();
