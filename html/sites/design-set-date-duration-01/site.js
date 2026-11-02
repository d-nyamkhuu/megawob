(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#66707d', line: '#bbc2c9' };
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
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      u.el('span', 'ds-brand', top, 'Campus Parking');
      const nav = u.el('nav', 'ds-menu', top);
      for (const [i, label] of ['Home', 'Permits', 'Parking Lots', 'Visits', 'Vehicles', 'Reports', 'Help'].entries()) {
        if (i) u.el('span', 'ds-separator', nav, '|');
        const a = u.el('a', '', nav, label);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: 'nav', label });
        });
      }
      const intro = u.el('div', 'ds-intro', content);
      u.el('h1', '', intro, 'Add Parking Visit');
      Object.assign(_c, { shell: body, content, top, intro, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.intro;
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
      const u = _c.util;
      const context = u.el('section', 'ds-context-form', _c.body);
      const fields = [
        ['Date', 'Apr 12, 1995'],
        ['Lot', 'North Campus'],
        ['Space', 'B-27'],
        ['Vehicle', 'ACM 315 (Faculty)'],
      ];
      for (const [label, value] of fields) {
        const row = u.el('div', 'ds-static-row', context);
        u.el('span', '', row, label + ':');
        u.el('div', '', row, value);
      }
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const notes = u.el('div', 'ds-static-row ds-notes-row', _c.body);
      u.el('span', '', notes, 'Notes:');
      u.el('div', 'ds-notes-box', notes);
      const rail = u.el('aside', 'ds-rail', _c.shell);
      u.el('h2', '', rail, 'Recent Parking Visits');
      const table = u.el('table', 'ds-records', rail);
      const thead = u.el('thead', '', table);
      const hr = u.el('tr', '', thead);
      for (const x of ['Date', 'Time In', 'Lot', 'Space', 'Vehicle']) u.el('th', '', hr, x);
      const tbody = u.el('tbody', '', table);
      const rows = [
        ['Apr 12, 1995', '08:14', 'North', 'B-12', 'ACM 102'],
        ['Apr 12, 1995', '09:03', 'West', 'C-08', 'STU 417'],
        ['Apr 12, 1995', '09:26', 'North', 'A-19', 'FAC 220'],
        ['Apr 11, 1995', '14:37', 'East', 'E-06', 'ACM 315'],
        ['Apr 11, 1995', '10:12', 'North', 'B-27', 'VIS 908'],
        ['Apr 10, 1995', '16:05', 'West', 'D-14', 'STU 417'],
        ['Apr 10, 1995', '11:48', 'North', 'A-03', 'ACM 102'],
        ['Apr 9, 1995', '13:22', 'East', 'E-11', 'FAC 220'],
        ['Apr 9, 1995', '09:15', 'North', 'B-27', 'ACM 315'],
        ['Apr 8, 1995', '15:46', 'West', 'C-02', 'VIS 908'],
        ['Apr 8, 1995', '08:33', 'North', 'A-19', 'STU 417'],
        ['Apr 7, 1995', '12:01', 'East', 'D-08', 'ACM 102'],
        ['Apr 7, 1995', '09:27', 'North', 'B-12', 'FAC 220'],
        ['Apr 6, 1995', '14:18', 'West', 'C-08', 'ACM 315'],
        ['Apr 6, 1995', '10:41', 'North', 'A-03', 'VIS 908'],
      ];
      for (const row of rows) {
        const tr = u.el('tr', '', tbody);
        for (const x of row) u.el('td', '', tr, x);
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
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
    name: 'design-set-date-duration-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-duration-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#222222'],
      LOW_ACCENTS: ['#222222'],
      parts,
    },
  });
})();
