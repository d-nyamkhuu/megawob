// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('crm-titlebar');
        const title = util.el('div', 'crm-window-title', header, 'Support Desk');
        title.setAttribute('aria-label', 'Support Desk');
        const stats = util.el('aside', 'crm-stats', null);
        S.frameBrand(_c, header);
        Object.assign(_c, { header, stats, title });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const menu = util.el('nav', 'crm-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Tickets', 'Tools', 'Help']) util.el('span', '', menu, item);
        const toolbar = util.el('div', 'crm-toolbar', document.body);
        for (const [icon, text] of [
          ['＋', 'New Ticket'],
          ['✉', 'Reply'],
          ['♧', 'Assign'],
          ['◇', 'Add Tag'],
          ['▤', 'Delete'],
          ['⟳', 'Refresh'],
        ]) {
          const b = util.el('button', 'crm-tool', toolbar);
          util.el('span', 'crm-tool-icon', b, icon);
          util.el('span', '', b, text);
        }
        Object.assign(_c, { headerTools, menu, submit, toolbar });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { stats, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        body.classList.add('crm-workspace');
        body.appendChild(stats);
        const navrail = util.el('aside', 'crm-navrail', body);
        const navItems = [
          ['♧', 'Inbox', '12'],
          ['▣', 'My Tickets', '8'],
          ['▣', 'All Tickets', '52'],
          ['♙', 'Unassigned', '7'],
          ['☆', 'Starred', '3'],
          ['ⓘ', 'Spam', '1'],
        ];
        navItems.forEach(([icon, text, count], i) => {
          if (i === 5) util.el('div', 'crm-nav-divider', navrail);
          const item = util.el('div', `crm-navitem${i === 2 ? ' selected' : ''}`, navrail);
          util.el('span', 'crm-nav-icon', item, icon);
          util.el('span', '', item, text);
          util.el('span', 'crm-nav-count', item, count);
        });
        util.el('div', 'crm-nav-section', navrail, 'Views');
        [
          ['▣', 'Open Tickets', '32'],
          ['▦', 'Pending Customer', '6'],
          ['▦', 'Due This Week', '9'],
          ['◷', 'Recently Updated', '14'],
        ].forEach(([icon, text, count]) => {
          const item = util.el('div', 'crm-navitem', navrail);
          util.el('span', 'crm-nav-icon', item, icon);
          util.el('span', '', item, text);
          util.el('span', 'crm-nav-count', item, count);
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, navItems, navrail });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const related = util.el('aside', 'crm-related', body);
        util.el('h2', '', related, 'Related Tickets');
        [
          ['TCK-1048', 'Cannot access account'],
          ['TCK-1049', 'Error when exporting data'],
          ['TCK-1050', 'Request for additional seats'],
          ['TCK-1051', 'Billing inquiry'],
          ['TCK-1052', 'Feature request: dark mode'],
          ['TCK-1053', 'Issue with SSO'],
          ['TCK-1054', 'Data not syncing'],
          ['TCK-1055', 'Unable to reset password'],
        ].forEach(([id, subject]) => {
          const row = util.el('div', 'crm-related-row', related);
          util.el('div', 'crm-related-id', row, id);
          util.el('div', 'crm-related-subject', row, subject);
        });
        Object.assign(_c, { related, stage });
      },
  };

  env.site({
    name: 'design-use-data-grid-crm-03',
    template: 'site/base',
    design: { parts },
  });
})();
