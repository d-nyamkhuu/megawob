(function () {
  'use strict';
  const palette = { bg: '#d5c8af', panel: '#f5f1e7', fg: '#292218', muted: '#766d5e', line: '#c7bba5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original adjustments pane has room for a note even at narrow widths.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'toast' && _c.H < 700) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const top = u.el('header', 'ds-top', document.body);
      const mark = u.el('div', 'ds-mark', top);
      mark.innerHTML = '<svg viewBox="0 0 44 44" aria-hidden="true"><path d="M12 31C15 18 25 9 34 9c0 12-7 23-19 25m1-3c4-7 9-12 15-17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 34l-3 3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      const brand = u.el('div', 'ds-brand', top);
      u.el('strong', '', brand, 'Evergreen Studio');
      u.el('small', '', brand, 'v1.4.2');
      const nav = u.el('nav', 'ds-nav', top);
      ['Refine', 'Adjust', 'Finish'].forEach((x, i) => {
        if (i) u.el('i', '', nav, '•');
        u.el('span', '', nav, x);
      });
      u.el('div', 'ds-window', top, '−　□　×');
      const header = u.el('div', _c.display === 'header' ? 'ds-header-note' : 'ds-note-host', document.body);
      Object.assign(_c, { top, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-header-action');
      _c.top.classList.toggle('ds-top-has-tools', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-workspace', document.body);
      const stage = u.el('main', 'ds-stage', body);
      const adjustments = u.el('aside', 'ds-adjustments', body);
      Object.assign(_c, { body, stage, adjustments });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.adjustments;
      base(_c);
      _c.body = body;
      const panel = _c.adjustments.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        panel.setAttribute('aria-label', 'Task instructions');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
      const u = _c.util;
      const adjustments = _c.adjustments;
      u.el('h2', '', adjustments, 'Image Adjustments');
      ['Brightness', 'Contrast', 'Saturation', 'Warmth'].forEach((label) => {
        const row = u.el('div', 'ds-adjust-row', adjustments);
        u.el('span', '', row, label);
        const track = u.el('span', 'ds-track', row);
        u.el('i', '', track);
        u.el('b', '', row, '0');
      });
      u.el('div', 'ds-rule', adjustments);
      const filter = u.el('div', 'ds-filter', adjustments);
      u.el('span', '', filter, 'Filter');
      u.el('span', 'ds-filter-value', filter, 'None　▾');
      u.el('div', 'ds-rule', adjustments);
      const preview = u.el('div', 'ds-preview', adjustments);
      u.el('b', '', preview, 'Preview');
      u.el('span', 'ds-check', preview, '✓');
      u.el('span', '', preview, 'Show changes in real time');
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        note.querySelector('.ref-note-x').classList.add('ds-toast-x');
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'ds-footer', document.body);
      const meta = u.el('div', 'ds-filemeta', foot);
      u.el('span', '', meta, 'File:　mountain.jpg');
      u.el('span', '', meta, 'Size:　1920 × 1080');
      u.el('span', '', meta, 'Zoom:　100%');
      const status = u.el('div', 'ds-status', foot);
      u.el('span', 'ds-clockicon', status, '◷');
      const st = u.el('div', '', status);
      u.el('strong', '', st, 'Status:　Waiting...');
      u.el('small', '', st, 'Image workspace ready.');
      const controls = u.el('div', 'ds-footer-actions', foot);
      base(_c);
      controls.appendChild(document.body.querySelector('.ref-foot'));
      Object.assign(_c, { foot, footerActions: controls });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footerActions.appendChild(dock);
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
    name: 'design-act-in-time-delay-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-delay-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a88645'],
      LOW_ACCENTS: ['#a88645'],
      parts,
    },
  });
})();
