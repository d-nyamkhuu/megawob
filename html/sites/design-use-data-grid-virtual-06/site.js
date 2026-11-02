// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  const shapes = {
    home:'<path d="M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10"/>',
    support:'<path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12H2v7h4v-7Zm16 0h2v7h-4v-7Zm0 7c0 3-4 3-6 3"/>',
    inbox:'<path d="M4 4h16l2 15H2L4 4Zm-1 9h5l2 3h4l2-3h5"/>',
    person:'<circle cx="12" cy="7" r="4"/><path d="M3 21c0-8 18-8 18 0H3Z"/>',
    table:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M7 7h2m3 0h6M7 12h2m3 0h6M7 17h2m3 0h6"/>',
    bars:'<path d="M5 21V13m7 8V7m7 14V2"/>',
    bank:'<path d="m2 7 10-5 10 5H2Zm1 14h18M5 9v10m5-10v10m4-10v10m5-10v10"/>',
    book:'<path d="M12 4v17M2 3c4-1 7 0 10 2 3-2 6-3 10-2v17c-4-1-7 0-10 2-3-2-6-3-10-2V3Z"/>',
    gear:'<path d="m9 2-1 3-3 1-3 3 2 3-1 3 3 3 3-1 3 2 3-2 3 1 3-3-1-3 2-3-3-3-3-1-1-3H9Z"/><circle cx="12" cy="11" r="4"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name] || shapes.person}</svg>`;
  env.site({
    name: 'design-use-data-grid-virtual-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { LOW_THEME, THEMES } = S;
          const { root } = _c;
          _c.name = 'light';
          _c.accent = '#0878ff';
          for (const [k, v] of Object.entries(_c.name === 'low' ? LOW_THEME : THEMES[_c.name])) root.style.setProperty(`--${k}`, v);
        },
        'frame.33': (base, S) => function (_c) {
          const { TITLES } = S;
          const { rng, util } = _c;
          const win = util.el('div', 'ref-window', document.body);
          const header = util.el('header', 'ref-task', win);
          rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, '');
          brand.dataset.role = 'brand';
          Object.assign(_c, { brand, header, win });
        },
        'frame.34': () => () => {},
        'frame.45': (base, S) => function (_c) {
          const { util, win } = _c;
          const body = util.el('div', 'ref-body', win);
          const sidebar = util.el('aside', 'sand-sidebar', win);
          const logo = util.el('div', 'sand-logo', sidebar);
          logo.innerHTML = '<span class="sand-sun">☼</span><span>Sandridge</span>';
          for (const [label, name, badge] of [['Support','support',''],['Inbox','inbox','12'],['My Tickets','person',''],['Unassigned','person','3'],['All Tickets','table',''],['Customers','person',''],['Reports','bars','']]) {
            const item = util.el('button', `sand-nav-item${label === 'Support' || label === 'All Tickets' ? ' current' : ''}`, sidebar);
            item.type = 'button'; item.innerHTML = icon(name);
            util.el('span', '', item, label);
            if (badge) util.el('span', 'sand-badge', item, badge);
          }
          const dock = util.el('nav', 'sand-dock', win);
          for (const [label, name] of [['Home','home'],['Customers','bank'],['Support','support'],['Analytics','bars'],['Knowledge Base','book'],['Settings','gear']]) {
            const item = util.el('button', label === 'Support' ? 'active' : '', dock);
            item.type = 'button'; item.innerHTML = icon(name); util.el('span', '', item, label);
          }
          util.el('span', 'sand-avatar', dock, 'JD');
          Object.assign(_c, { body });
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.51': () => () => {},
        'frame.52': () => () => {},
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.55': () => () => {},
        'frame.56': () => () => {},
        'frame.57': () => () => {},
        'frame.58': () => () => {},
        'frame.59': () => () => {},
        'frame.60': () => () => {},
        'frame.61': () => () => {},
        'frame.62': () => () => {},
        'frame.63': () => () => {},
        'frame.64': () => () => {},
        'frame.65': () => () => {},
        'frame.66': () => () => {},
        'frame.67': () => () => {},
        'frame.68': () => () => {},
        'frame.69': () => () => {},
        'frame.70': () => () => {},
        'frame.77': (base, S) => function (_c) {
          const { decoyBtn, decoys, endBtn, lr, rng, util, wantFooter, win, word } = _c;
          if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', win);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (_c.collide && _c.collide.where === 'footer') decoyBtn(tools, _c.collide.text, true);
        if (_c.placement === 'footer') _c.submit = endBtn(tools, 'ref-submit', _c.label);
        if (_c.placement === 'link') _c.submit = endBtn(tools, 'ref-endlink', `${_c.label} ›`);
      }
        },
        'overlay.6': (base, S) => function (_c) {
          const { el, kind, util } = _c;
          if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
          const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
          Object.assign(_c, { box });
        },
      },
    },
  });
})();
