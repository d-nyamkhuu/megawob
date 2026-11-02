(function () {
  'use strict';
  const palette = { bg: '#e9dcc0', panel: '#fbf4e5', fg: '#302d2a', muted: '#82745f', line: '#b7a587' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes share the organizer's answer card, including small screens.
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
      document.body.className = 'ref organizer rail';
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.endPlacement = _c.placement || 'none';
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, 'Reading Snippet');
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      ['Notes', 'Tasks', 'Library', 'Tags', 'Settings'].forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
      _c.foot = foot;
      const clear = _c.util.el('button', 'clear-action', _c.shell, 'Clear');
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
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-copy-paste-2-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { organizer: palette },
      LOW_THEME: palette,
      ACCENTS: ['#326b99'],
      LOW_ACCENTS: ['#326b99'],
      parts,
    },
  });
})();
