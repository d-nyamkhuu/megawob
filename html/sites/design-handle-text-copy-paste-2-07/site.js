(function () {
  'use strict';
  const palette = { bg: '#e9e7dc', panel: '#f3f1e7', fg: '#090909', muted: '#292929', line: '#111111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a task pane even at the smallest supported size.
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
      document.body.classList.add('ref', 'lisa', 'station');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, '●');
      u.el('span', 'menu-labels', title, 'File     Edit     Document     Window     Help');
      u.el('div', 'tools', head, 'Mon Apr 21   10:24 AM');
      const work = u.el('div', 'work', shell);
      const left = u.el('aside', 'left-brief', work);
      const heading = u.el('h1', 'brief-title', left, 'Task');
      heading.hidden = _c.display === 'hidden';
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, work, left, center, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.left.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('station-toptools');
    },
    'frame.body': () => (_c) => {
      Object.assign(_c, { body: _c.work });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      const note = _c.left.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
      const rule = _c.util.el('div', 'brief-rule', _c.left);
      rule.hidden = _c.display === 'hidden';
      _c.util.el('p', 'brief-copy', _c.left,
        'The entries are on the right. Each line is numbered, and the number is separate from the content. Copy only the requested text (do not include the line number) and paste it into the “Answer” field.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
      if (!_c.ctx.finish) {
        const clear = _c.util.el('button', 'station-clear', _c.center, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          const input = _c.center.querySelector('.ut-input');
          if (!input || input.disabled) return;
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.left.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.center.appendChild(foot);
        // Keep secondary controls in the document toolbar, clear of Answer/Clear.
        for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.prepend(button);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.left.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', `perturb ${ctx.kind}`, document.body);
      ctx.util.el('strong', '', el, { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind]);
      ctx.util.el('p', '', el, { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-copy-paste-2-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-copy-paste-2-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts,
    },
  });
})();
