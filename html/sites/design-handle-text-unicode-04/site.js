(function () {
  'use strict';
  const palette = { bg: '#fbf8f0', panel: '#fffefa', fg: '#101a38', muted: '#313e65', line: '#141c3b' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'memphis');
      const shell = u.el('main', 'shell', document.body);
      const work = u.el('div', 'work', shell);
      const briefing = u.el('aside', 'briefing', work);
      u.el('h1', 'quick-title', briefing, 'Quick Task');
      const header = u.el('div', 'note-slot', briefing);
      u.el('i', 'coral-rule', briefing);
      u.el('div', 'squiggle', briefing, '〜');
      const footer = u.el('footer', 'footer', shell);
      const tip = (cls, svg, html) => {
        const item = u.el('section', 'tip ' + cls, footer);
        const icon = u.el('div', 'tip-icon', item);
        icon.innerHTML = svg;
        u.el('div', 'tip-copy', item).innerHTML = html;
      };
      tip('keyboard', '<svg viewBox="0 0 64 44" aria-hidden="true"><rect x="3" y="3" width="58" height="38" rx="4"/><path d="M10 11h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 0h4v5h-4zM10 21h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 0h4v5h-4zM12 31h39"/></svg>', 'Type or paste<br>the text');
      tip('mouse', '<svg viewBox="0 0 48 64" aria-hidden="true"><path d="M24 3C12 3 5 12 5 25v14c0 13 7 22 19 22s19-9 19-22V25C43 12 36 3 24 3Z"/><path d="M24 4v22"/><path class="coral-stroke" d="m42 7 4-7m2 14 8-3"/></svg>', 'You can also use<br>your mouse');
      tip('wheel', '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M26 3C14 3 8 12 8 25v14c0 13 6 22 18 22s18-9 18-22V25C44 12 38 3 26 3Z"/><path d="M26 4v22M52 18l7 7 7-7M52 47l7-7 7 7"/></svg>', 'Use the scroll wheel<br>if needed');
      const action = u.el('div', 'action-cell episode-action', footer);
      Object.assign(_c, { shell, work, briefing, header, footer, action });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.action;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const center = _c.util.el('section', 'center', _c.work);
      Object.assign(_c, { body: center });
    },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = b;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('instruction', 'episode-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'episode-toast');
        _c.briefing.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').remove();
      _c.action.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.briefing.appendChild(dock);
      const extras = _c.action.querySelectorAll('.ref-xtra');
      if (extras.length) {
        const rail = _c.util.el('div', 'action-extras', _c.action);
        extras.forEach((button) => rail.appendChild(button));
      }
      if (!_c.action.querySelector('button, a')) _c.util.el('span', 'action-ready', _c.action, 'Ready');
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, {
        cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support',
        promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind]);
      ctx.util.el('p', '', el, {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.',
        chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-unicode-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-unicode-04': palette }, LOW_THEME: palette,
      ACCENTS: ['#ff7778'], LOW_ACCENTS: ['#ff7778'], parts,
    },
  });
})();
