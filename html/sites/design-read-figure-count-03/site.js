(function () {
  'use strict';
  const palette = { bg: '#f4f9fc', panel: '#eef4fb', fg: '#07164d', muted: '#3f628a', line: '#8aa3c2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a dedicated side card and room for its corner notice.
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
      document.body.className = 'forum wb instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Visual Task');
      const center = u.el('div', 'center', app);
      if (_c.display !== 'header') center.style.gridTemplateRows = 'minmax(0,1fr)';
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', document.body);
      const pan = (t, cls) => {
        const p = u.el('section', 'pan ' + cls, aside);
        u.el('h3', '', p, t);
        return u.el('div', 'pb', p);
      };
      const det = pan('Task Details', 'pd');
      [
        ['Task ID:', 'C-1047'],
        ['Task type:', 'Visual Count'],
        ['Target:', 'See task note'],
        ['Input:', 'Answer below'],
        ['Deadline:', 'Not timed'],
      ].forEach((r) => {
        const d = u.el('div', 'drow', det);
        u.el('span', '', d, r[0]);
        u.el('span', '', d, r[1]);
      });
      const ins = pan('Instructions', 'pi');
      if (_c.display === 'header') {
        const ol = u.el('ol', '', ins);
        [
          'Read the task note above.',
          'Review the figure carefully.',
          'Enter or select your answer below.',
          'Finish when your answer is ready.',
        ].forEach((t) => u.el('li', '', ol, t));
      }
      const nt = pan('Notes', 'pn');
      [
        ['Admin', '10:14 AM', 'Your workspace is ready.', 0],
        ['User', '10:16 AM', 'Got it.', 1],
        ['Admin', '10:17 AM', 'Let me know if you have any questions.', 2],
      ].forEach((n) => {
        const w = u.el('div', 'note d' + n[3], nt);
        if (n[3]) u.el('i', '', w);
        const bx = u.el('div', 'nbox', w);
        const h = u.el('div', 'nh', bx);
        u.el('b', '', h, n[0]);
        u.el('span', '', h, n[1]);
        u.el('div', 'nt', bx, n[2]);
      });
      if (_c.display === 'hidden' || _c.display === 'toast') aside.classList.add('forum-no-instructions');
      Object.assign(_c, { body: _c.center, aside, ins });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.ins;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('forum-task-toast');
        const title = _c.util.el('b', '', null, 'Task notice');
        note.prepend(title);
        _c.aside.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const bottom = _c.util.el('footer', 'bottom', _c.app);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) bottom.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
    name: 'design-read-figure-count-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-count-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6384ad'],
      LOW_ACCENTS: ['#6384ad'],
      parts,
    },
  });
})();
