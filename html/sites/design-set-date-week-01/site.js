(function () {
  'use strict';
  const palette = { bg: '#30251b', panel: '#f4f1e9', fg: '#17130f', muted: '#82786c', line: '#b6b0a5' };
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
      const shell = u.el('div', 'ds-body', document.body);
      const top = u.el('header', 'ds-top', shell);
      u.el('span', 'ds-app-icon', top, '▥');
      u.el('span', 'ds-brand', top, 'Weekly Reports');
      const controls = u.el('div', 'ds-window-controls', top);
      for (const [t, c] of [['−', 'min'], ['□', 'max'], ['×', 'close']]) {
        const b = u.el('button', 'ds-win ' + c, controls, t);
        b.type = 'button';
        b.tabIndex = -1;
      }
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { shell, top, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.header;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-panel-note');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const records = u.el('section', 'ds-records', _c.body);
      const table = u.el('div', 'ds-record-head', records);
      u.el('span', 'ds-record-icon', table, '');
      u.el('span', '', table, 'Week');
      u.el('span', '', table, 'Title');
      const rows = [
        ['Jan 1, 2029', 'Product Development'],
        ['Jan 8, 2029', 'Product Development'],
        ['Jan 15, 2029', 'Product Development'],
        ['Jan 22, 2029', 'Marketing'],
        ['Jan 29, 2029', 'Marketing'],
      ];
      for (const [date, title] of rows) {
        const row = u.el('div', 'ds-record-row', records);
        u.el('span', 'ds-file-icon', row, '▤');
        u.el('span', '', row, date);
        u.el('span', '', row, title);
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.body.appendChild(foot);
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
    name: 'design-set-date-week-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#68472d'],
      LOW_ACCENTS: ['#68472d'],
      parts,
    },
  });
})();
