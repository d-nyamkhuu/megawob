(function () {
  'use strict';
  const palette = { bg: '#c5c3bd', panel: '#d1cfca', fg: '#111', muted: '#555', line: '#858580' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'ds-window', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-appicon', top, '▣');
      u.el('span', 'ds-brand', top, 'Inventory Manager');
      const wc = u.el('span', 'ds-window-controls', top);
      ['−', '□', '×'].forEach((x) => u.el('b', '', wc, x));
      const menu = u.el('nav', 'ds-menu', win);
      ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const bar = u.el('div', 'ds-toolbar', win);
      [
        ['▤', 'New'], ['▰', 'Open'], ['✎', 'Edit'], ['✖', 'Delete'], ['◉◉', 'Find'], ['▣', 'Refresh'],
      ].forEach((p, i) => {
        if (i === 4) u.el('i', 'ds-separator', bar);
        const b = u.el('button', '', bar);
        u.el('strong', '', b, p[0]);
        u.el('span', '', b, p[1]);
      });
      const area = u.el('div', 'ds-area', win);
      const content = u.el('div', 'ds-content', area);
      Object.assign(_c, { win, bar, area, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const stats = u.el('aside', 'ds-stats', _c.area);
      const sections = [
        ['Inventory Summary', ['Total products:|12', 'In stock:|10', 'Low stock:|2', 'Out of stock:|0']],
        ['Categories', ['Fitness|5', 'Strength|3', 'Recovery|2', 'Hydration|1', 'Gear|1']],
        ['Recent Updates', ['2004-06-14|Updated DB-5500', '2004-06-13|Added ET-6003', '2004-06-12|Revised YM-2200', '2004-06-11|Updated stock levels']],
      ];
      sections.forEach(([title, rows]) => {
        const sec = u.el('section', 'ds-stat-section', stats);
        u.el('h2', '', sec, title);
        const body = u.el('div', 'ds-stat-rows', sec);
        rows.forEach((row) => {
          const fields = row.split('|');
          const line = u.el('div', '', body);
          u.el('span', '', line, fields[0]);
          u.el('span', '', line, fields[1]);
        });
      });
      _c.body = _c.area;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.area.querySelector('.ref-panel');
      if (note) note.classList.add('ds-panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-status');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.win.appendChild(foot);
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
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      d.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-tooltip-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#650d25'], LOW_ACCENTS: ['#650d25'], parts,
    },
  });
})();
