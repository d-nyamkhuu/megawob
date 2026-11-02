// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winControls = util.el('div', 'sap-win-controls', header);
      for (const [mark, kind] of [['−','min'],['□','max'],['×','close']]) {
        const control = util.el('span', `sap-win-button sap-win-${kind}`, winControls, mark);
        control.setAttribute('aria-hidden', 'true');
      }
      const menus = util.el('nav', 'sap-menu-strip', header);
      for (const label of ['Menu', 'Edit', 'Favorites', 'Extras', 'System', 'Help']) util.el('span', '', menus, label);
      const toolbar = util.el('div', 'sap-toolbar-strip', header);
      util.el('span', 'sap-tb-label', toolbar, 'Transaction code:');
      util.el('span', 'sap-tb-gap', toolbar);
      for (const [icon, label, tone] of [['⇨','Execute','go'],['☆','Create shortcut','star'],['▤','More','doc']]) {
        const button = util.el('span', 'sap-tb-btn', toolbar);
        util.el('i', `sap-tb-icon sap-tb-${tone}`, button, icon);
        util.el('span', '', button, label);
        if (label === 'More') util.el('i', 'sap-tb-chev', button, '▾');
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menus, toolbar, winControls });
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
      const summary = util.el('section', 'sap-summary', document.body);
      const head = util.el('div', 'sap-insp-head', summary);
      util.el('strong', '', head, 'Properties');
      util.el('i', 'sap-insp-ico', head, '⚲');
      util.el('i', 'sap-insp-ico', head, '⌃');
      const facts = util.el('div', 'sap-summary-facts', summary);
      for (const [title, rows] of [
        ['System', [['Client', '100'], ['User', 'DEMOUSER'], ['Language', 'EN'], ['System', 'ECC'], ['MANDT', '100']]],
        ['Session', [['Client', '100'], ['Logon time', '2024.08.26 10:15:23'], ['Terminal', 'DSK001'], ['Data source', 'PRD']]],
      ]) {
        const section = util.el('div', 'sap-sec', facts);
        util.el('strong', '', section, title);
        for (const [key, value] of rows) {
          const row = util.el('div', 'sap-fact', section);
          util.el('span', '', row, key);
          util.el('b', '', row, value);
        }
      }
      const details = util.el('div', 'sap-summary-details', summary);
      util.el('strong', '', details, 'Details');
      for (const key of ['Transaction code', 'Program', 'Screen number', 'Transaction text']) util.el('span', '', details, key);
      Object.assign(_c, { details, facts, headerTools, submit, summary });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      // The workspace stays empty (only the command field) until the command holds a value; mid-task starts open it.
      const activate = () => body.classList.add('sap-active');
      for (const type of ['input', 'change', 'keydown', 'pointerdown', 'mousedown', 'click']) document.addEventListener(type, activate, true);
      const customerList = util.el('section', 'sap-customer-list', body);
      util.el('strong', '', customerList, 'Customer List (987)');
      const columns = util.el('div', 'sap-list-head', customerList);
      util.el('span', '', columns, 'Customer ID');
      util.el('span', '', columns, 'Customer Name');
      const rows = [
        ['R5178', 'Alpine Systems'], ['R5179', 'Beacon Industries'], ['R5180', 'Coastal Electric'],
        ['R5181', 'Danforth Trading'], ['R5182', 'Evergreen Solutions'], ['R5183', 'Fairfield Manufacturing'],
        ['R5184', 'Glenwood Products'], ['R5185', 'Harbor View Ltd'], ['R5186', 'Imperial Chemical'],
        ['R5187', 'Jefferson Motors'], ['R5188', 'Kingston Supplies'], ['R5189', 'Lakeside Equipment'],
        ['R5190', 'Midland Tools'], ['R5191', 'Northern Plastics'], ['R5192', 'Oakridge Services'],
        ['R5193', 'Pioneer Distributors'], ['R5194', 'Quantum Components'], ['R5195', 'Redwood Textiles'],
        ['R5196', 'Summit Technologies'], ['R5197', 'Trident Metals'],
      ];
      for (const [id, name] of rows) {
        const row = util.el('div', 'sap-list-row', customerList);
        util.el('span', '', row, id);
        util.el('span', '', row, name);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { columns, customerList, rows, stage });
    },
  };

  env.site({
    name: 'design-use-legacy-app-sapgui-05',
    template: 'site/base',
    design: { parts },
  });
})();
