(function () {
  'use strict';
  const palette = { bg: '#e7edf4', panel: '#ffffff', fg: '#172238', muted: '#64748b', line: '#dce4ed' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four note locations belong to the original travel window.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'ds-window', document.body);
      const top = u.el('header', 'ds-top', win);
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-app-icon', brand, '✈');
      u.el('span', '', brand, 'Travel');
      const meta = u.el('div', 'ds-window-meta', top);
      const windowControls = u.el('div', 'ds-window-buttons', meta);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', 'ds-window-control', windowControls, t);
        b.type = 'button';
      });
      const header = u.el('div', 'ds-header-note', win);
      header.hidden = _c.display !== 'header';
      if (_c.display === 'header') u.el('span', 'ds-note-mark', header, 'Task');
      Object.assign(_c, { win, top, meta, windowControls, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.meta;
      base(_c);
      _c.header = header;
      _c.meta.insertBefore(_c.headerTools, _c.windowControls);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', _c.win);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      // Keep the original stage before the summary while the template draws its note.
      const stage = u.el('main', 'ds-stage', main);
      const summary = u.el('aside', 'ds-summary', main);
      const sh = u.el('div', 'ds-summary-head', summary);
      u.el('span', 'ds-summary-icon', sh, '▮');
      u.el('strong', '', sh, 'Trip Summary');
      const rows = [
        ['✈', 'Flights', '0 selected'],
        ['▢', 'Dates', 'Apr 16 – Apr 23, 2024'],
        ['♙', 'Travelers', '1 adult'],
        ['♧', 'Class', 'Economy'],
        ['⌖', 'City', '—'],
      ];
      for (const [ic, k, v] of rows) {
        const row = u.el('div', 'ds-summary-row', summary);
        u.el('span', 'ds-summary-ico', row, ic);
        u.el('span', 'ds-summary-label', row, k);
        u.el('span', 'ds-summary-value', row, v);
      }
      Object.assign(_c, { body, main, stage, summary });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.summary;
      base(_c);
      _c.body = body;
      const panel = _c.summary.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        const title = panel.querySelector('.ref-panel-title');
        title.classList.add('ds-note-mark');
        title.textContent = 'Task';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const status = _c.util.el('div', 'ds-status', _c.win);
      _c.util.el('span', 'ds-ready', status, '●  Ready');
      _c.util.el('span', 'ds-status-copy', status, '');
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction', 'ds-instruction-toast');
        _c.win.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.win.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const nav = _c.util.el('nav', 'ds-nav', foot);
      [
        ['✈', 'Flights'], ['♧', 'Hotels'], ['▱', 'Cars'], ['▣', 'Trips'], ['⚙', 'Settings'],
      ].forEach(([ic, n], i) => {
        const item = _c.util.el('div', 'ds-nav-item' + (i === 0 ? ' active' : ''), nav);
        _c.util.el('span', '', item, ic);
        _c.util.el('span', '', item, n);
      });
      foot.insertBefore(nav, foot.firstChild);
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
    name: 'design-act-in-time-debounce-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-debounce-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1684f8'],
      LOW_ACCENTS: ['#1684f8'],
      parts,
    },
  });
})();
