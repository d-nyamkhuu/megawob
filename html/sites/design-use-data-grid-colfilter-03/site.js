// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('irix-shelf');
      const irixBrand = util.el('div', 'irix-brand', header, '◈ IRIX');
      const irixNav = util.el('nav', 'irix-nav', header);
      for (const item of ['Operations', 'Tickets', 'Inventory', 'Employees', 'Reports', 'Administration']) {
        const a = util.el('a', `irix-navitem${item === 'Tickets' ? ' selected' : ''}`, irixNav, item);
        a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const irixClock = util.el('div', 'irix-clock', header, 'Mon Apr 21 1997　10:24 AM');
      util.el('span', 'irix-icon', header, '▣');
      util.el('span', 'irix-icon', header, '?');
      util.el('span', 'irix-icon cube', header, '⬡');
      const windowControls = util.el('div', 'breeze-window-controls', header);
      for (const [icon, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const control = util.el('button', 'breeze-window-control', windowControls, icon);
        control.type = 'button';
        control.title = label;
        control.setAttribute('aria-label', label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, irixBrand, irixClock, irixNav, windowControls });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const menuBar = util.el('nav', 'breeze-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        util.el('span', 'breeze-menu-item', menuBar, item);
      }
      Object.assign(_c, { headerTools, menuBar, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('irix-desktop');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const customers = util.el('aside', 'breeze-customers', body);
      util.el('div', 'breeze-customers-title', customers, 'Customers');
      const customerSearch = util.el('div', 'breeze-customer-search', customers);
      util.el('span', 'breeze-search-icon', customerSearch, '⌕');
      util.el('span', 'breeze-search-hint', customerSearch, 'Search customers…');
      const customerList = util.el('div', 'breeze-customer-list', customers);
      for (const [initials, person, email, hue] of [
        ['DC', 'Daniel Carter', 'daniel.carter@acmecorp.com', '#cfe1ff'],
        ['PS', 'Priya Shah', 'priya.shah@acmecorp.com', '#d2eee6'],
        ['MS', 'Miguel Santos', 'miguel.santos@acmecorp.com', '#d0edf5'],
        ['EC', 'Emily Chen', 'emily.chen@acmecorp.com', '#f5d7df'],
        ['JW', 'James Wilson', 'james.wilson@acmecorp.com', '#d5eafa'],
        ['LK', 'Laura Kim', 'laura.kim@acmecorp.com', '#d5eee5'],
        ['RT', 'Robert Taylor', 'robert.taylor@acmecorp.com', '#e4d8fb'],
        ['SL', 'Sophia Lee', 'sophia.lee@acmecorp.com', '#d6ebf5'],
        ['DB', 'David Brown', 'david.brown@acmecorp.com', '#d8eee5'],
        ['OM', 'Olivia Martinez', 'olivia.martinez@acmecorp.com', '#d1e3ff'],
      ]) {
        const row = util.el('div', 'breeze-customer-row', customerList);
        const avatar = util.el('span', 'breeze-customer-avatar', row, initials);
        avatar.style.backgroundColor = hue;
        const info = util.el('div', 'breeze-customer-info', row);
        util.el('div', 'breeze-customer-name', info, person);
        util.el('div', 'breeze-customer-email', info, email);
      }
      const dock = util.el('nav', 'breeze-dock', document.body);
      for (const [icon, label] of [['●', 'Tickets'], ['▣', 'Knowledge Base'], ['●', 'Customers'], ['▥', 'Reports'], ['⚙', 'Settings']]) {
        const tab = util.el('a', `breeze-dock-tab${label === 'Tickets' ? ' active' : ''}`, dock);
        tab.href = '#';
        util.el('span', 'breeze-dock-icon', tab, icon);
        util.el('span', 'breeze-dock-label', tab, label);
        tab.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      Object.assign(_c, { customerList, customerSearch, customers, dock, stage });
    },
  };

  env.site({
    name: 'design-use-data-grid-colfilter-03',
    template: 'site/base',
    design: { parts },
  });
})();
