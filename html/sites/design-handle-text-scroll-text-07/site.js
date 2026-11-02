(function () {
  'use strict';
  const palette = { bg: '#dce7f2', panel: '#ffffff', fg: '#102b4b', muted: '#344b64', line: '#9bb4ce' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'ref extranet board';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Read & Respond');
      u.el('div', 'sub', head, '');
      u.el('div', 'who', head, 'Home   |   Help   |   Log Out');
      u.el('div', 'date', head, '');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      center.dataset.display = _c.display;
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
      _c.header = _c.work;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('top-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) panel.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
      _c.util.el('footer', 'footer', _c.shell);
      const clear = _c.util.el('button', 'clear', _c.work, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = _c.stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.prepend(button);
        _c.work.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.work.appendChild(dock);
    },
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
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-scroll-text-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-scroll-text-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1c568c'],
      LOW_ACCENTS: ['#1c568c'],
      parts,
    },
  });
})();
