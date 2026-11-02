(function () {
  'use strict';
  const palette = { bg: '#187d35', panel: '#dedede', fg: '#111', muted: '#555', line: '#111' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const desktop = u.el('div', 'gem-desktop', document.body);
      const menu = u.el('header', 'gem-menu', desktop);
      u.el('b', 'gem-mark', menu, '♟');
      ['Desk', 'File', 'Edit', 'Record', 'View', 'Options', 'Help'].forEach((x) => u.el('span', '', menu, x));
      u.el('time', '', menu, 'Mon 12 May 1986　14:27');
      const icons = u.el('aside', 'gem-icons', desktop);
      [
        ['▤', 'DISK A'],
        ['▤', 'DISK B'],
        ['♜', 'TRASH'],
      ].forEach(([a, b]) => {
        const i = u.el('div', 'gem-icon', icons);
        u.el('b', '', i, a);
        u.el('span', '', i, b);
      });
      const win = u.el('section', 'gem-window', desktop);
      const title = u.el('div', 'gem-title', win);
      u.el('b', '', title, '−');
      u.el('strong', '', title, 'Personal Records');
      u.el('span', '', title, '⊡　+');
      const toolbar = u.el('nav', 'gem-nav', win);
      [
        ['▤', 'People'],
        ['▣', 'Departments'],
        ['♟', 'Groups'],
        ['▤', 'Reports'],
        ['⚒', 'Settings'],
      ].forEach(([a, b], i) => {
        const n = u.el('div', 'gem-nav-item' + (!i ? ' active' : ''), toolbar);
        u.el('b', '', n, a);
        u.el('span', '', n, b);
      });
      Object.assign(_c, { desktop, win, toolbar, header: win });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      // The window itself is the flex body; the note panel lives on the desktop.
      _c.body = _c.win;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.desktop;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage gem-stage', _c.body);
      const list = u.el('section', 'gem-list', stage);
      u.el('h3', '', list, 'People (23)');
      const head = u.el('div', 'gem-list-head', list);
      u.el('span', '', head, 'Name　　▲');
      u.el('span', '', head, 'Department');
      const rows = u.el('div', 'gem-rows', list);
      [
        ['Bondarenko, Iryna', 'Sales'],
        ['Kowalski, Piotr', 'Engineering'],
        ['Melnyk, Oksana', 'Administration'],
        ['Petrov, Alexei', 'Engineering'],
        ['Smith, John', 'Sales'],
        ['Ivanova, Elena', 'Finance'],
        ['Garcia, Miguel', 'Support'],
        ['Müller, Hans', 'Engineering'],
        ['Dupont, Claire', 'Marketing'],
        ['Rossi, Marco', 'Sales'],
        ['Tanaka, Yuki', 'Support'],
        ['Nguyen, Lan', 'Finance'],
        ['O’Connor, Seamus', 'Engineering'],
        ['Novak, Jana', 'Administration'],
        ['Silva, Carlos', 'Support'],
        ['Chen, Li', 'Sales'],
        ['Patel, Asha', 'Finance'],
        ['Andersson, Erik', 'Engineering'],
        ['Sato, Kenji', 'Marketing'],
        ['Moreau, Luc', 'Support'],
        ['Popescu, Andrei', 'Administration'],
        ['Wilson, Emma', 'Sales'],
        ['Khan, Amir', 'Engineering'],
      ].forEach((r, i) => {
        const row = u.el('div', 'gem-row' + (i === 2 ? ' selected' : ''), rows);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.desktop.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('gem-status');
      _c.win.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = '1 person selected';
      const tools = foot.querySelector('.ref-tools');
      const person = _c.util.el('span', '', null, 'Melnyk, Oksana　 |　 Administration');
      const record = _c.util.el('span', '', null, 'Record 3 of 23');
      foot.insertBefore(person, tools);
      foot.insertBefore(record, tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        ctx.kind === 'cookie'
          ? 'This desk uses local preferences.'
          : ctx.kind === 'chat'
            ? 'Help desk　How can we help?'
            : ctx.kind === 'promo'
              ? 'New features are available.'
              : 'System notice',
      );
      const dismiss = u.el('button', '', el, 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: 0 };
    },
  };
  env.site({
    name: 'design-type-text-sections-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-sections-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
