(function () {
  'use strict';
  const palette = { bg: '#008c91', panel: '#c0c0c0', fg: '#000000', muted: '#555555', line: '#dfdfdf' };
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
      const appIcon = u.el('span', 'ds-app-icon', top);
      appIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h5v18H4zM15 3h5v18h-5z"/><path d="M6.5 5v6M4 8h5M17.5 5v6M15 8h5"/></svg>';
      u.el('span', 'ds-brand', top, 'Meal Planner');
      const win = u.el('div', 'ds-window-controls', top);
      u.el('button', '', win, '−'); u.el('button', '', win, '□'); u.el('button', '', win, '×');
      const content = u.el('div', 'ds-content', shell);
      const menu = u.el('nav', 'ds-menubar', content);
      for (const s of ['File', 'Edit', 'View', 'Plan', 'Recipes', 'Grocery List', 'Tools', 'Help']) u.el('span', 'ds-menuitem', menu, s);
      const toolbar = u.el('nav', 'ds-toolbar', content);
      const iconSvg = [
        '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="23"/><path d="M9 3v6M23 3v6M4 11h24v3H4z" style="fill:#b00000"/><path d="M8 17h4v4H8zM15 17h4v4h-4zM22 17h3v4h-3zM8 23h4v3H8zM15 23h4v3h-4z" style="fill:#000080"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 6q7-3 13 2v21q-6-5-13-2zM29 6q-7-3-13 2v21q6-5 13-2z"/><path d="M7 11q4-1 7 2M7 16q4-1 7 2M25 11q-4-1-7 2M25 16q-4-1-7 2"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 5h4l3 16h16l4-12H9"/><circle cx="13" cy="26" r="2"/><circle cx="24" cy="26" r="2"/><path d="M12 10h16M14 14h13M16 18h9"/></svg>',
        '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="3" width="22" height="26"/><path d="M11 9l2 2 4-4M19 9h5M11 17l2 2 4-4M19 17h5M11 24h2M19 24h5"/></svg>'
      ];
      [['Meal Plan', 0], ['Recipes', 1], ['Groceries', 2], ['Preferences', 3]].forEach(([label, i], index) => {
        const b = u.el('div', 'ds-tool' + (index === 0 ? ' active' : ''), toolbar);
        const icon = u.el('span', 'ds-tool-icon', b); icon.innerHTML = iconSvg[i];
        u.el('span', '', b, label);
      });
      Object.assign(_c, { shell, content, toolbar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const rail = u.el('aside', 'ds-rail', _c.shell);
      const plans = u.el('section', 'ds-planlist', rail);
      u.el('h2', 'ds-panelhead', plans, 'Meal Plans');
      const list = u.el('div', 'ds-list', plans);
      ['August 30, 2027', 'September 13, 2027', 'September 20, 2027', 'September 27, 2027', 'October 4, 2027', 'October 11, 2027', 'October 18, 2027', 'October 25, 2027', 'November 1, 2027', 'November 8, 2027'].forEach((x, i) => u.el('div', 'ds-planrow' + (!i ? ' selected' : ''), list, x));
      const detail = u.el('section', 'ds-details', rail);
      u.el('h2', 'ds-panelhead', detail, 'Plan Details');
      [['Week:', 'August 30, 2027'], ['Status:', 'Draft'], ['Meals:', '0'], ['Notes:', '']].forEach(([a, b]) => {
        const row = u.el('div', 'ds-detailrow', detail); u.el('span', '', row, a); u.el('span', '', row, b);
      });
      Object.assign(_c, { body: main, main, rail, plans });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const panel = _c.rail.querySelector('.ref-panel');
      if (panel) _c.rail.insertBefore(panel, _c.plans);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util, main = _c.main;
      _c.stage = u.el('main', 'ds-stage', main);
      u.el('h2', 'ds-area-title', main, 'Meal Plan');
      const details = u.el('div', 'ds-static-details', main);
      const form = u.el('section', 'ds-static-form', details);
      [['Plan name:', 'Weekly Meals', 'text'], ['Number of people:', '4', 'number']].forEach(([label, value, kind]) => {
        const row = u.el('div', 'ds-static-row', form); u.el('label', '', row, label);
        const field = u.el('div', 'ds-static-field' + (kind === 'number' ? ' number' : ''), row, value);
        if (kind === 'number') u.el('span', 'ds-spin-arrows', field, '▲\n▼');
      });
      const notes = u.el('div', 'ds-static-row notes', form); u.el('label', '', notes, 'Notes:');
      u.el('div', 'ds-static-field ds-notes-field', notes);
      const meals = u.el('section', 'ds-meals-static', details);
      u.el('h2', 'ds-meals-title', meals, 'Meals');
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
        const row = u.el('div', 'ds-meal-row', meals); u.el('span', '', row, day + ':');
        const field = u.el('div', 'ds-meal-field', row); u.el('span', 'ds-meal-arrow', field, '▼');
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
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
      const u = ctx.util; const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body); el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close'); dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-set-date-week-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-week-03': palette }, LOW_THEME: palette,
      ACCENTS: ['#000080'], LOW_ACCENTS: ['#000080'], parts
    }
  });
})();
