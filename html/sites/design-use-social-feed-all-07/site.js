// Metro panorama frame; site/base owns control variation and runtime overlays.
(function () {
  'use strict';

  const palette = {
    bg: '#f4f5f6', panel: '#ffffff', fg: '#1a1a1a', line: '#e6e8ea', muted: '#6b6f73',
    font: "'Segoe UI','Segoe UI Light','Lato','Calibri','Carlito',Arial,sans-serif",
  };

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const { ctx, W, H } = _c;
      let display = ctx.display;
      if ((display === 'panel' && W < 1100) || (display === 'toast' && H < 650)) display = 'header';
      _c.display = display;
      document.body.className = 'bottom instruction-' + display;
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      const shell = util.el('div', 'site-shell', document.body);
      const header = util.el('header', 'design-header', shell);
      util.el('div', 'design-brand', header, 'Chatter');
      const nav = util.el('nav', 'design-nav', header);
      for (const [i, text] of ['Home', 'Discover', 'Notifications', 'Me'].entries()) {
        const item = util.el('span', 'nav-item' + (i === 0 ? ' on' : ''), nav, text);
        item.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
      }
      const controls = util.el('div', 'window-controls', header);
      controls.innerHTML =
        '<svg viewBox="0 0 12 12" width="18" height="18"><path d="M1 6h10" stroke="#fff" stroke-width="1" fill="none"/></svg><svg viewBox="0 0 12 12" width="18" height="18"><rect x="1.5" y="1.5" width="9" height="9" stroke="#fff" stroke-width="1" fill="none"/></svg><svg viewBox="0 0 12 12" width="18" height="18"><path d="M1 1l10 10M11 1L1 11" stroke="#fff" stroke-width="1" fill="none"/></svg>';
      const body = util.el('div', 'design-body ref-body', shell);
      const note = util.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      Object.assign(_c, { shell, header, body, note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const { ctx, display, note, util } = _c;
      note.hidden = display !== 'header';
      base({ ..._c, header: note });
      const copy = note.querySelector('.ref-instruction');
      if (copy) {
        copy.style.fontSize = 'clamp(26px,' + Math.min(3.83, 220 / String(ctx.instruction).length) + 'vw,64px)';
        copy.replaceChildren();
        for (const part of String(ctx.instruction).split(/([#@]\w+)/)) {
          if (/^[#@]\w/.test(part)) util.el('span', 'task-tag', copy, part);
          else copy.append(part);
        }
      }
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        // The widget clears its stage; keep the instruction alongside it.
        panel.classList.add('task-panel');
        panel.querySelector('.ref-panel-title').classList.add('task-panel-title');
        panel.querySelector('.ref-panel-text').classList.add('task-panel-copy');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const toast = document.querySelector('.ref-note');
      if (toast) {
        toast.classList.add('task-toast');
        _c.body.append(toast);
      }
    },
    'frame.end': (base) => (_c) => {
      const { headerTools, placement, shell, submit, util } = _c;
      const footer = util.el('footer', 'design-footer', shell);
      if (submit) {
        const inHeader = placement === 'header' || placement === 'icon';
        submit.className = inHeader ? 'end-header' : placement === 'link' ? 'end-link' : 'end-control';
        (inHeader ? headerTools : footer).append(submit);
      }
      for (const decoy of document.querySelectorAll('.ref-foot .ref-xtra')) headerTools.prepend(decoy);
      document.querySelectorAll('.ref-foot, .ref-float-dock').forEach((node) => node.remove());
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-social-feed-all-07',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { metro: palette }, LOW_THEME: palette,
      ACCENTS: ['#0063b1'], LOW_ACCENTS: ['#0063b1'], LANGS: ['en'],
      parts,
    },
  });
})();
