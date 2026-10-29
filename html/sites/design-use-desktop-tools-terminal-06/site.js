// NetGuide portal chrome on the shared site frame.
(function () {
  'use strict';

  const theme = {
    bg: '#285184', panel: '#ccccd2', fg: '#0a1038', accent: '#f5da48',
    font: 'Arial,sans-serif', line: '#c8cdd5', muted: '#5f6a78', 'button-fg': '#000',
  };
  const parts = {
    'frame.layout': () => (_c) => {
      const W = window.innerWidth, H = window.innerHeight;
      const display = _c.ctx.display || 'header';
      document.body.className = 'bottomless instruction-' + display;
      Object.assign(_c, { W, H, display, roomy: W >= 1260, tall: H >= 700 });
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      // The portal reserves its bottom utility strip for every end-control variant.
      if (_c.placement === 'header' || _c.placement === 'floating') _c.placement = 'footer';
      Object.assign(_c, { nav: false, sidebar: false });
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const gl = u.el('div', 'ng-globe', header);
      gl.innerHTML =
        '<svg viewBox="0 0 60 78" width="100%" height="100%"><defs><radialGradient id="sea"><stop stop-color="#83b9ff"/><stop offset="1" stop-color="#2265d1"/></radialGradient></defs><ellipse cx="29" cy="70" rx="23" ry="3" fill="#888ca0"/><path d="M28 50v20m-13 1h30M12 8C-7 31 5 61 29 64" fill="none" stroke="#1b224a" stroke-width="3"/><circle cx="30" cy="29" r="26" fill="url(#sea)" stroke="#101b39" stroke-width="1.6"/><path d="M16 6l8 2-2 5 5 2-4 4-7-2-5 5-5-2 2-7zM29 5l10 2-2 6 6 2 5 6-3 7-9-2-3 4-5-3 2-6-5-5zM12 25l8 1 3 7 6 1-2 7-5 3-2 9-5-7-2-8-5-5zM35 33l10-4 8 6-4 7-7 1-4-4-5 1zM39 46l8 2 2 4-8 2z" fill="#56b632" stroke="#243c30" stroke-width="1.2"/><g fill="none" stroke="#17264c" stroke-width=".8"><ellipse cx="30" cy="29" rx="12" ry="26"/><path d="M30 3v52M5 20q25 9 49 0M5 38q25-9 49 0M10 12q20 9 40 0M10 46q20-9 40 0"/></g><path d="M9 7l4 4m31 42 5 6M23 72h17" stroke="#121735" stroke-width="2"/></svg>';
      const hb = u.el('div', 'ng-brandcol', header);
      const hr = u.el('div', 'ng-row1', hb);
      u.el('div', 'design-brand', hr, 'NetGuide');
      const tg = u.el('div', 'ng-tag', hr);
      tg.innerHTML = 'The Web Directory<br>for Everyone';
      const nv = u.el('nav', 'design-nav', hb);
      for (const t of [
        'Web Sites',
        'News',
        'Reference',
        'Shopping',
        'People',
        'Maps',
        'Computers',
        'Health',
        'Recreation',
        'More...',
      ]) {
        u.el('a', '', nv, t);
      }
      const sb = u.el('div', 'ng-search', header);
      u.el('div', '', sb, 'Search the Web:');
      const sr = u.el('div', 'ng-srow', sb);
      u.el('span', 'ng-inp', sr);
      u.el('span', 'ng-sbtn', sr, 'Search');
      u.el('div', 'ng-date', header, 'Apr 24, 1998');
      const body = u.el('div', 'design-body ref-body', shell);
      Object.assign(_c, { shell, header, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const note = _c.util.el('section', 'task-note', _c.body);
      note.dataset.role = 'instruction';
      note.hidden = _c.display !== 'header';
      if (!note.hidden) base({ ..._c, header: note });
    },
    'frame.tools': () => () => {},
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const { body, display } = _c;
      if (display === 'panel') {
        base(_c);
        const note = body.querySelector('.ref-panel');
        note.classList.add('task-note');
        note.dataset.role = 'instruction';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.footer': () => (_c) => {
      const { shell, util, decoyBtn, decoys, collide, endBtn, placement, label } = _c;
      const footer = util.el('footer', 'design-footer', shell);
      util.el('span', 'footer-label', footer, '');
      for (const text of decoys) decoyBtn(footer, text);
      if (collide) decoyBtn(footer, collide.text, true);
      let submit = null;
      if (placement) {
        submit = endBtn(footer, placement === 'link' ? 'ref-endlink' : 'end-control',
          placement === 'icon' ? '✓' : placement === 'link' ? label + ' ›' : label);
        submit.classList.add('end-control');
        if (placement === 'link') submit.classList.add('end-link');
        if (placement === 'icon') submit.classList.add('end-icon');
      }
      _c.submit = submit;
    },
    'frame.floating': () => () => {},
  };

  env.site({
    name: 'design-use-desktop-tools-terminal-06',
    template: 'site/base',
    design: {
      THEMES: { netguide: theme }, LOW_THEME: theme,
      ACCENTS: ['#f5da48'], LOW_ACCENTS: ['#f5da48'],
      parts,
    },
  });
})();
