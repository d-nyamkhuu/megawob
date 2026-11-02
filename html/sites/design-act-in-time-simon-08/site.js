(function () {
  'use strict';
  const palette = { bg: '#f4f0e5', panel: '#292e1d', fg: '#303222', muted: '#4b4a36', line: '#a58a51' };
  const styleControls = (root, header) => {
    root.querySelectorAll('.ref-submit, .ref-endlink').forEach((button) => {
      button.classList.add('ds-submit');
      if (header) button.classList.add('ds-submit-head');
      if (button.classList.contains('ref-endlink')) button.classList.add('ds-submit-link');
    });
    root.querySelectorAll('.ref-xtra').forEach((button) => button.classList.add('ds-xtra'));
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.dataset.simonbrief = _c.display;
      document.body.dataset.finish = String(!!_c.ctx.finish);
    },
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
      const header = u.el('header', 'ds-top', document.body);
      const mark = u.el('div', 'ds-mark', header);
      u.el('span', 'ds-leaf', mark, '❧');
      u.el('span', 'ds-brand', mark, 'MEMORY\nPATTERN');
      u.el('div', 'ds-kicker', header, 'A QUICK\nMEMORY CHALLENGE');
      const round = u.el('div', 'ds-round', header);
      u.el('span', '', round, 'ROUND');
      u.el('strong', '', round, '1 / 5');
      const band = u.el('section', 'ds-center', document.body);
      Object.assign(_c, { header, band });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.band;
      base(_c);
      _c.header = header;
      const note = _c.band.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => (_c) => { _c.body = _c.band; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-instruction', 'ds-panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction', 'ds-toast');
        _c.band.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('ds-footer');
      footer.querySelector('.ref-foot-text').remove();
      const seq = _c.util.el('div', 'ds-sequence');
      _c.util.el('span', '', seq, 'SEQUENCE');
      _c.util.el('strong', '', seq, '1 / 5');
      footer.prepend(seq);
      footer.querySelector('.ref-tools').classList.add('ds-foot-mark');
      styleControls(footer, false);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.footer.appendChild(dock);
        styleControls(dock, false);
      }
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
    name: 'design-act-in-time-simon-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-simon-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a58a51'],
      LOW_ACCENTS: ['#a58a51'],
      parts,
    },
  });
})();
