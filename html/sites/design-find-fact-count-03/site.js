(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-count-03',
    brand: 'Harborview Documentation - Document Viewer',
    rail: '1. Harborview Overview|2. Installation Guide|3. Configuration|4. Network Setup|5. User Accounts|6. Security Notes|7. Maintenance|8. Troubleshooting|9. Release Notes|10. License Agreement|11. Glossary|12. Index',
  };
  const palette = { bg: '#d4d3d0', panel: '#e7e7e5', fg: '#11131c', muted: '#777875', line: '#858582' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', top, '▧');
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window-controls', top, '−  □  ×');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'ds-railhead', rail, 'Documents');
      C.rail.split('|').forEach((t, i) => {
        const row = u.el('div', i === 0 ? 'ds-docrow selected' : 'ds-docrow', rail);
        u.el('span', 'ds-fileicon', row, '▯');
        u.el('span', '', row, t);
      });
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ds-ready');
      ready.textContent = 'Ready';
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-count-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#800d19'],
      LOW_ACCENTS: ['#800d19'],
      parts,
    },
  });
})();
