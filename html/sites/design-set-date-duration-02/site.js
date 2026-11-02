(() => {
  'use strict';
  const palette = { bg: '#f7f6f1', panel: '#fbfaf6', fg: '#171512', muted: '#69665f', line: '#aaa79f' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const title = u.el('header', 'ds-top', content);
      u.el('span', 'ds-brand', title, 'Workout Log');
      const win = u.el('div', 'ds-window', title);
      u.el('span', '', win, '−');
      u.el('span', '', win, '□');
      u.el('span', 'ds-close', win, '×');
      const menu = u.el('nav', 'ds-menu', content);
      ['File', 'Edit', 'View', 'Workout', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const toolbar = u.el('div', 'ds-toolbar', content);
      [
        ['▤', 'New'], ['✎', 'Edit'], ['✕', 'Delete'], ['▥', 'View⌄'], ['▤', 'Print'],
      ].forEach(([icon, label]) => {
        const b = u.el('button', 'ds-tool', toolbar);
        u.el('b', '', b, icon);
        u.el('span', '', b, label);
      });
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { shell, content, toolbar, main, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction', note);
        text.textContent = note.firstChild.textContent;
        note.firstChild.remove();
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = _c.main;
      const side = u.el('aside', 'ds-library', main);
      const summary = u.el('div', 'ds-summary', side);
      u.el('h2', '', summary, 'Workouts');
      [
        ['All Workouts', '24'], ['Running', '8'], ['Cycling', '6'],
        ['Strength Training', '5'], ['Yoga', '3'], ['Other', '2'],
      ].forEach(([a, b], i) => {
        const row = u.el('div', 'ds-category' + (!i ? ' selected' : ''), summary);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      u.el('div', 'ds-rule', side);
      [['This Month', '6'], ['Last Month', '8'], ['This Year', '24']].forEach(([a, b]) => {
        const row = u.el('div', 'ds-category ds-filter', side);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      u.el('div', 'ds-rule', side);
      const goals = u.el('div', 'ds-category ds-filter', side);
      u.el('span', '', goals, 'Goals');
      u.el('span', '', goals, '2');
      const list = u.el('section', 'ds-list', main);
      const head = u.el('div', 'ds-listhead', list);
      ['Date', 'Type', 'Duration'].forEach((x) => u.el('span', '', head, x));
      const records = [
        ['Apr 21, 2008', 'Running', '30 min'], ['Apr 19, 2008', 'Strength', '45 min'],
        ['Apr 16, 2008', 'Cycling', '60 min'], ['Apr 14, 2008', 'Running', '35 min'],
        ['Apr 12, 2008', 'Yoga', '60 min'], ['Apr 9, 2008', 'Strength', '40 min'],
        ['Apr 7, 2008', 'Running', '50 min'], ['Apr 5, 2008', 'Cycling', '90 min'],
        ['Apr 2, 2008', 'Running', '30 min'], ['Mar 30, 2008', 'Strength', '45 min'],
        ['Mar 28, 2008', 'Yoga', '60 min'], ['Mar 25, 2008', 'Running', '40 min'],
        ['Mar 22, 2008', 'Cycling', '75 min'], ['Mar 20, 2008', 'Strength', '40 min'],
        ['Mar 18, 2008', 'Running', '35 min'], ['Mar 15, 2008', 'Yoga', '60 min'],
        ['Mar 12, 2008', 'Cycling', '60 min'], ['Mar 10, 2008', 'Running', '45 min'],
      ];
      records.forEach((r, i) => {
        const row = u.el('div', 'ds-record' + (i === 6 ? ' active' : ''), list);
        r.forEach((x) => u.el('span', '', row, x));
      });
      Object.assign(_c, { body: main, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
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
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-set-date-duration-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-duration-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#bd211e'],
      LOW_ACCENTS: ['#bd211e'],
      parts,
    },
  });
})();
