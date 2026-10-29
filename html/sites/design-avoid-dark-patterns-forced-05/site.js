(function () {
  'use strict';
  const leaf = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M23 41C12 39 5 30 7 17c9 1 17 6 19 18Z" fill="#277c5b"/><path d="M25 41C23 20 29 7 40 4c10 18 4 31-15 37Z" fill="#69c4bd"/><path d="M23 39C19 29 13 22 7 18M25 39c2-13 7-23 14-32" fill="none" stroke="#e7f8ef" stroke-width="1.5"/></svg>';
  const icons = {
    Home:'<svg viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v10h-6v-7H9v7H3z"/></svg>',
    Meditate:'<svg viewBox="0 0 24 24"><path d="M12 4c4 5 4 8 0 12-4-4-4-7 0-12ZM3 10c5 0 8 3 9 9-6 0-9-3-9-9Zm18 0c-5 0-8 3-9 9 6 0 9-3 9-9ZM6 21h12"/></svg>',
    Sleep:'<svg viewBox="0 0 24 24"><path d="M20 16A9 9 0 0 1 8 4 9 9 0 1 0 20 16Z"/></svg>',
    Move:'<svg viewBox="0 0 24 24"><circle cx="15" cy="4" r="2"/><path d="m12 8 4 2 4 1M12 8l-3 5 4 2-2 6M9 13l-5 2m9 0 5 5"/></svg>',
    Library:'<svg viewBox="0 0 24 24"><path d="M3 4h7v16H3zM13 4h5l3 16h-5z"/></svg>',
    Plans:'<svg viewBox="0 0 24 24"><path d="m2 8 4 3 3-6 3 6 3-6 3 6 4-3-2 12H4z"/></svg>',
    Account:'<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2z"/></svg>',
    Browse:'<svg viewBox="0 0 24 24"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/></svg>',
    Sessions:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m10 7 7 5-7 5z"/></svg>',
    Community:'<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 20v-2a6 6 0 0 1 12 0v2zM16 14a6 6 0 0 1 6 6"/></svg>'
  };
  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c, W = window.innerWidth, H = window.innerHeight;
      let display = ctx.display || 'header';
      if (display === 'panel' && W < 1260) display = 'header';
      if (display === 'toast' && H < 700) display = 'header';
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('hus-header-note', display === 'header');
      Object.assign(_c, { W, H, display, roomy: W >= 1260, tall: H >= 700 });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task hus-header', document.body);
      const logo = util.el('div', 'hus-logo', header); logo.innerHTML = leaf;
      logo.setAttribute('aria-hidden', 'true');
      const brand = util.el('div', 'hus-brand', header);
      util.el('strong', '', brand, 'Hushwell');
      util.el('small', '', brand, 'A calmer, brighter you');
      const icons = util.el('div', 'hus-header-icons', header);
      util.el('button', 'hus-icon', icons, '⌕').setAttribute('aria-label', 'Search');
      util.el('button', 'hus-icon', icons, '♙').setAttribute('aria-label', 'Account');
      if (_c.display === 'header') util.el('div', 'ref-instruction', header, _c.ctx.instruction);
      Object.assign(_c, { header });
    },
    'frame.nav': () => function () {},
    'frame.instruction': () => function () {},
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body hus-body', document.body);
      const side = util.el('aside', 'breeze-game-nav hus-side', body);
      util.el('div', 'hus-window-dots', side);
      const logo = util.el('div', 'hus-side-brand', side);
      util.el('span', 'hus-mark', logo).innerHTML = leaf; util.el('b', '', logo, 'Hushwell');
      for (const [icon, label] of [['⌂','Home'],['♧','Meditate'],['☾','Sleep'],['♧','Move'],['◫','Library'],['♛','Plans'],['♙','Account']]) {
        const item = util.el('div', `breeze-game-nav-item${label === 'Plans' ? ' active' : ''}`, side);
        util.el('span', 'breeze-icon', item).innerHTML = icons[label] || icon; util.el('span', '', item, label);
      }
      const summary = util.el('section', 'breeze-summary hus-summary', side);
      util.el('strong', '', summary, 'Your progress');
      const ring = util.el('div', 'hus-ring', summary);
      util.el('b', '', ring, '3'); util.el('span', '', ring, 'sessions\nthis week');
      ring.setAttribute('aria-hidden', 'true');
      for (const [icon, label, value] of [['♨','Mindful minutes','42'],['♧','Streak','3 days'],['◇','Badges','5']]) {
        const row = util.el('div', 'hus-stat', summary);
        util.el('span', '', row, icon + '　' + label); util.el('b', '', row, value);
      }
      Object.assign(_c, { body, gameNav: side, summary });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('hus-side-note');
        _c.gameNav.insertBefore(note, _c.summary);
        _c.body.classList.remove('ref-panel-right');
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage hus-stage', body);
      const dock = util.el('nav', 'hus-dock', document.body);
      for (const [icon, label, active] of [['⌂','Home',true],['▦','Browse',false],['⊙','Sessions',false],['♧','Community',false]]) {
        const tab = util.el('div', `hus-dock-item${active ? ' active' : ''}`, dock);
        util.el('b', '', tab).innerHTML = icons[label] || icon; util.el('span', '', tab, label);
      }
      Object.assign(_c, { stage });
    },
    'frame.toast': (base, S) => function (_c) {
      if (_c.display !== 'toast') return;
      const { util, ctx } = _c;
      const note = util.el('div', 'ref-note hus-toast', document.body);
      util.el('div', 'ref-note-text', note, ctx.instruction);
      const x = util.el('button', 'ref-note-x', note, '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close');
      x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
    },
    'frame.footer': (base, S) => function (_c) {
      const { util, placement, label, endBtn, decoyBtn, decoys, collide, wantFooter, rng } = _c;
      let submit = _c.submit;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot hus-footer', document.body);
        util.el('span', 'ref-foot-text', foot, 'Hushwell · A calmer, brighter you');
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys[0]) decoyBtn(tools, decoys[0]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };
  env.site({ name: 'design-avoid-dark-patterns-forced-05', template: 'site/base', design: { parts } });
})();
