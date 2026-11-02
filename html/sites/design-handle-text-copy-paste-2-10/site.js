(function () {
  'use strict';
  const palette = { bg: '#f7f9fb', panel: '#fff', fg: '#101d31', muted: '#526176', line: '#d7dfe7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The briefing column has space for every note mode at every viewport.
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
      document.body.className = 'ref modernist dock';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, 'Text Task');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      u.el('div', 'tools', head, 'FOCUS / COPY / PASTE / SUBMIT');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const briefing = u.el('div', 'briefing', center);
      Object.assign(_c, { shell, head, work, center, briefing, header: briefing });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.briefing;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.briefing.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
      const clear = u.el('button', 'clear-answer', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = document.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-handle-text-copy-paste-2-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-copy-paste-2-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0789e8'],
      LOW_ACCENTS: ['#0789e8'],
      parts,
    },
  });
})();
