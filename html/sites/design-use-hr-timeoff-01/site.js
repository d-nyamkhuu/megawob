// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function desktopIcon(name) {
    const person = (x, y, color) =>
      `<g transform="translate(${x} ${y})"><ellipse cx="8" cy="6" rx="5" ry="6" fill="url(#${name}-skin)"/><path d="M2 15Q8 10 14 15L16 27Q8 31 0 27Z" fill="${color}"/><path d="M7 14h2v13H7z" fill="#ffffff88" stroke="none"/></g>`;
    const art = {
      home: '<path d="M7 16V7q0-3 4-3t4 3v5" fill="#dbeaf4"/><path d="M5 19 21 5l16 14-4 4-12-11L9 23Z" fill="url(#home-gold)"/><path d="M9 21v17h24V21L21 12Z" fill="#fff4bb"/><path d="M13 24h6v7h-6zm10 2h6v12h-6z" fill="url(#home-blue)"/><path d="M8 38h26"/>',
      recruiting: person(1, 7, '#78ae60') + person(22, 7, '#7dae59') + person(11, 11, 'url(#recruiting-blue)'),
      people: person(3, 8, 'url(#people-gold)') + person(21, 8, '#79b05a'),
      calendar:
        '<rect x="6" y="9" width="31" height="30" rx="2" fill="#edf4fa"/><path d="M6 10h31v9H6z" fill="url(#calendar-blue)"/><rect x="11" y="5" width="3" height="10" rx="1" fill="#d9e6f2"/><rect x="28" y="5" width="3" height="10" rx="1" fill="#d9e6f2"/><path d="M9 21h25" stroke="#9cacc1"/><text x="11" y="35" font-family="Arial" font-size="19" font-weight="bold" fill="#153d70" stroke="none">17</text>',
      chart:
        '<path d="M5 38h33M8 36V13h5v23zm11 0V7h5v29zm11 0V4h5v32z" fill="url(#chart-blue)"/><path d="M19 12h5v24h-5" fill="url(#chart-gold)"/><path d="M9 13V9m12-2V4m11 0V2" stroke="#9bb3d2"/>',
      coins:
        '<g fill="url(#coins-gold)"><path d="M5 23v13c0 5 15 5 15 0V23zm18-12v24c0 5 15 5 15 0V11z"/><ellipse cx="12.5" cy="23" rx="7.5" ry="3.5"/><ellipse cx="30.5" cy="11" rx="7.5" ry="3.5"/><path d="M5 28q7 5 15 0M5 32q7 5 15 0m3-15q7 5 15 0m-15 5q7 5 15 0m-15 5q7 5 15 0m-15 5q7 5 15 0"/></g>',
      files:
        '<rect x="6" y="5" width="25" height="31" rx="1" fill="#c4d5e8"/><rect x="10" y="8" width="25" height="31" fill="#f7fafc"/><path d="M14 4h16l9 9v29H14z" fill="#f7fafc"/><path d="M30 4v10h9M18 19h16m-16 5h16m-16 5h16m-16 5h16M18 8h7m-7 5h7"/>',
      gear: '<path d="m17 3 8 0 1 5 4 2 4-3 5 6-3 4 1 5 5 1-1 8-5 1-3 4 1 5-7 3-3-4-5-1-4 4-6-5 2-5-1-4-5-2 1-7 5-1 2-4-2-5 6-4 3 3Z" fill="url(#gear-blue)"/><circle cx="22" cy="23" r="8" fill="#dbe5ef"/><circle cx="22" cy="23" r="4" fill="#728aa8"/>',
    };
    return `<svg viewBox="0 0 46 46" aria-hidden="true" fill="none" stroke="#29466d" stroke-width="1.5" stroke-linejoin="round"><defs><linearGradient id="${name}-blue" x2="0" y2="1"><stop stop-color="#ecf6ff"/><stop offset=".5" stop-color="#91b9df"/><stop offset="1" stop-color="#5586b7"/></linearGradient><linearGradient id="${name}-gold" x2="0" y2="1"><stop stop-color="#fff7a5"/><stop offset=".5" stop-color="#ffcf49"/><stop offset="1" stop-color="#e6a52b"/></linearGradient><linearGradient id="${name}-skin" x2="0" y2="1"><stop stop-color="#f7fbff"/><stop offset="1" stop-color="#8fb5d5"/></linearGradient></defs>${art[name]}</svg>`;
  }

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          const art = util.el('div', 'qt-news-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M10 53 60 12l50 41v54H10Z" fill="#8fbbef"/><path d="M23 25h74v68H23Z" fill="#e6f0fb"/><path d="M34 40h51M34 52h51M34 64h39" fill="none" stroke="#9bbce0" stroke-width="6"/><path d="M10 53 60 88 110 53v54H10Z" fill="#5798ee"/><path d="m10 107 39-31 11 12 11-12 39 31" fill="#73acf7"/></svg>';
          util.el('h3', 'qt-overlay-heading', box, 'Stay in the loop');
        } else if (kind === 'chat') {
          util.el('h3', 'qt-overlay-heading', box, 'Need help?');
        } else if (kind === 'banner') {
          util.el('h3', 'qt-overlay-heading', box, 'PeopleOps announcement');
          const title = document.querySelector('.qt-sheet-title');
          if (title) title.after(el);
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo' || kind === 'chat') {
          const input = util.el('input', 'qt-overlay-input', box);
          input.type = kind === 'promo' ? 'email' : 'text';
          input.placeholder = kind === 'promo' ? 'Enter your email address' : 'Type a message…';
          input.setAttribute('aria-label', input.placeholder);
        }
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const winbar = util.el('div', 'qt-titlebar', document.body);
        util.el('span', 'qt-app-icon', winbar, '◈');
        util.el('span', '', winbar, 'PeopleOps - Acme Corporation');
        const winbuttons = util.el('span', 'qt-window-buttons', winbar);
        for (const symbol of ['−', '□', '×']) util.el('span', 'qt-window-control', winbuttons, symbol);
        const menubar = util.el('div', 'qt-menubar', document.body);
        menubar.textContent = 'File　 Edit　 View　 People　 Tools　 Reports　 Help';
        const rail = util.el('nav', 'qt-rail', document.body);
        for (const [icon, label] of [
          ['home', 'Home'],
          ['recruiting', 'Recruiting'],
          ['people', 'People'],
          ['calendar', 'Time Off'],
          ['chart', 'Performance'],
          ['coins', 'Compensation'],
          ['files', 'Reporting'],
          ['gear', 'Admin'],
        ]) {
          const item = util.el('div', `qt-rail-item${label === 'People' ? ' selected' : ''}`, rail);
          const graphic = util.el('span', 'qt-rail-icon', item);
          graphic.innerHTML = desktopIcon(icon);
          util.el('span', '', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { header, menubar, rail, winbar, winbuttons });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { display, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        document.body.dataset.instruction = display;
        S.frameSidebar(_c, body);
        Object.assign(_c, { body });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const employeeDock = util.el('section', 'qt-employee-dock', body);
        const employeeTitle = util.el('div', 'qt-dock-title', employeeDock);
        util.el('strong', '', employeeTitle, 'Employees');
        const employeeTools = util.el('div', 'qt-dock-tools', employeeDock);
        util.el('span', '', employeeTools, 'View:');
        util.el('span', 'qt-dock-select', employeeTools, 'All Employees　⌄');
        util.el('span', '', employeeTools, 'Department:');
        util.el('span', 'qt-dock-select', employeeTools, 'All　⌄');
        util.el('span', 'qt-dock-search-label', employeeTools, 'Search:');
        const employeeSearch = util.el('input', 'qt-dock-search', employeeTools);
        employeeSearch.setAttribute('aria-label', 'Search employees');
        const employeeTable = util.el('div', 'qt-dock-table', employeeDock);
        for (const [i, row] of [
          ['Name', 'Department', 'Title', 'Manager', 'Status'],
          ['Alex Carter', 'Engineering', 'Software Engineer', 'Maria Lopez', 'Active'],
          ['Daniel Kim', 'Engineering', 'DevOps Engineer', 'Maria Lopez', 'Active'],
          ['Elena Garcia', 'Engineering', 'QA Engineer', 'Maria Lopez', 'Active'],
          ['Marcus Lee', 'Design', 'UX Designer', 'Jordan Patel', 'Active'],
          ['Priya Singh', 'Product', 'Product Manager', 'Jordan Patel', 'Active'],
          ['Sophia Nguyen', 'Marketing', 'Marketing Specialist', 'Chris Wong', 'Active'],
        ].entries()) {
          const tr = util.el(
            'div',
            `qt-dock-row${i === 1 ? ' selected' : ''}${i === 0 ? ' headings' : ''}`,
            employeeTable,
          );
          for (const cell of row) util.el('span', '', tr, cell);
        }
        Object.assign(_c, { employeeDock, employeeSearch, employeeTable, employeeTitle, employeeTools, stage });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, employeeTools, endBtn, label, lr, placement, rng, util, wantFooter, word } =
          _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot qt-dock-footer', employeeTools);
          employeeTools.insertBefore(foot, employeeTools.querySelector('.qt-dock-search-label'));
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-hr-timeoff-01',
    template: 'site/base',
    design: { parts },
  });
})();
