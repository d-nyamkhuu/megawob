(function () {
  'use strict';
  const palette = { bg: '#e9f4fb', panel: '#fff', fg: '#102747', muted: '#526e91', line: '#bfd6e9' };
  const groups = [
    ['Clipboard', [['✂', 'Cut'], ['▣', 'Copy'], ['▤', 'Paste']]],
    ['Find & Select', [['⌕', 'Find'], ['ab↔ac', 'Replace'], ['▧', 'Select All']]],
    ['Text Options', [['A', 'Font'], ['▤', 'Word Wrap'], ['☷', 'Line Numbers']]],
    ['Zoom', [['⊖', 'Zoom Out'], ['⊕', 'Zoom In'], ['100%⌄', '']]],
    ['Settings', [['⚙', 'Preferences']]],
  ];
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
      document.body.classList.add('ref', 'aqua', 'dock');
      document.body.classList.toggle('aqua-note-header', _c.display === 'header' && !_c.ctx.finish);
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, 'Text Utility');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      // Both ribbon rows are part of the original window chrome.
      for (let row = 0; row < 2; row++) {
        const tabs = u.el('nav', 'ribbon-tabs', head);
        ['Home', 'Edit', 'View', 'Tools', 'Help'].forEach((x, i) => u.el('div', i === 0 ? 'selected' : '', tabs, x));
        const ribbon = u.el('div', 'ribbon', head);
        groups.forEach((g) => {
          const group = u.el('section', 'ribbon-group', ribbon);
          const acts = u.el('div', 'ribbon-actions', group);
          g[1].forEach((a) => {
            const b = u.el('div', 'ribbon-action', acts);
            u.el('span', 'ribbon-icon', b, a[0]);
            u.el('span', 'ribbon-label', b, a[1]);
          });
          u.el('span', 'ribbon-caption', group, g[0]);
        });
      }
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'aqua-header-note');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('aqua-toptools');
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('div', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast', 'aqua-toast');
        note.dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const note = document.body.querySelector('.ref-note');
      if (note) foot.prepend(note);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      const clear = _c.util.el('button', 'clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = document.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        }
      });
      foot.insertBefore(clear, foot.querySelector('.ref-tools'));
      _c.foot = foot;
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
    name: 'design-handle-text-copy-paste-2-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-copy-paste-2-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1684e8'], LOW_ACCENTS: ['#1684e8'], parts,
    },
  });
})();
