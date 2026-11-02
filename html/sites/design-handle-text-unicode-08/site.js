(function () {
  'use strict';
  const palette = { bg: '#f8f6e9', panel: '#fffdf4', fg: '#123665', muted: '#35567f', line: '#143b70' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This board has its own instruction locations, including at narrow sizes.
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
      document.body.classList.add('ref', 'pixelcraft', 'board');
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.instruction = _c.display;
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, _c.display === 'hidden' ? 'Simple Text Utility' : '');
      const work = u.el('div', 'work', shell);
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
        _c.shell.classList.toggle('long-instruction', note.textContent.length > 150);
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
      _c.shell.classList.toggle('has-top-tools', !!_c.headerTools.children.length);
      _c.shell.style.setProperty('--top-tools-width', `${_c.headerTools.getBoundingClientRect().width}px`);
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('div', 'stage', _c.center); },
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
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      _c.foot = foot;
      const copy = _c.util.el('button', 'copy-action', foot, 'Copy');
      copy.type = 'button';
      copy.addEventListener('click', () => {
        const source = _c.stage.querySelector('.ut-text');
        if (source) {
          const range = document.createRange();
          range.selectNodeContents(source);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand('copy');
        }
      });
      const clear = _c.util.el('button', 'clear-text', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = _c.stage.querySelector('.ut-input');
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
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-unicode-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { pixelcraft: palette },
      LOW_THEME: palette,
      ACCENTS: ['#087f84'],
      LOW_ACCENTS: ['#087f84'],
      parts,
    },
  });
})();
