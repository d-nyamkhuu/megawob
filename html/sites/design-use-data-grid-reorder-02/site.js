// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  // Small, shaded office icons in the application's original desktop style.
  function officeIcon(key) {
    const paths = {
      '▤': '<path fill="url(#paper)" stroke="#7b90a5" d="M8 3h17l7 7v28H8z"/><path fill="#d5e3f0" stroke="#7b90a5" d="M25 3v8h7"/><path stroke="#9bb0c5" d="M12 16h16M12 21h16M12 26h16M12 31h16"/>',
      '✎': '<path fill="url(#gold)" stroke="#9b6931" d="m7 29 19-23 6 5-19 23-9 4z"/><path fill="#ed8a7c" stroke="#a75c50" d="m26 6 3-3q3-2 6 3l-3 5z"/><path fill="#eed7a0" d="m7 29 6 5-9 4z"/><path fill="#333" d="m5 34 3 2-4 2z"/>',
      '✖': '<path stroke="#8c3726" stroke-width="7" stroke-linecap="round" d="m9 9 22 22M31 9 9 31"/><path stroke="#e45c36" stroke-width="4" stroke-linecap="round" d="m9 8 22 22M31 8 9 30"/>',
      '▣': '<path fill="url(#paper)" stroke="#7b90a5" d="M12 3h17v17H12z"/><rect x="5" y="17" width="31" height="16" rx="4" fill="url(#steel)" stroke="#617c94"/><path fill="url(#paper)" stroke="#7b90a5" d="M12 27h17v11H12z"/><path stroke="#8da3b5" d="M15 31h11M15 34h11"/><circle cx="31" cy="22" r="1.5" fill="#67a9d1"/>',
      '✉': '<rect x="4" y="9" width="32" height="23" rx="2" fill="url(#paper)" stroke="#849aad"/><path fill="none" stroke="#8ca6b9" d="m5 10 15 13 15-13M4 31l11-12M36 31 25 19"/><path stroke="#4d94c9" fill="#80c5ef" d="m27 26 6 5 4-7 1 12-13-1z"/>',
      '▰': '<rect x="5" y="9" width="31" height="27" rx="2" fill="url(#gold)" stroke="#946328"/><path fill="#f6d594" stroke="#aa8145" d="M16 7h10v13H16z"/><path fill="none" stroke="#fff0be" d="M8 12v21h25"/>',
      '✓': '<circle cx="20" cy="20" r="17" fill="url(#green)" stroke="#547a37"/><circle cx="20" cy="20" r="15" fill="none" stroke="#c3d8a9"/><path fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="m11 20 6 6 13-15"/>',
      '▥': '<path fill="url(#steel)" stroke="#4380b2" d="M5 23h7v14H5zm12-9h7v23h-7zM29 4h7v33h-7z"/><path stroke="#d3edff" d="M7 25v10M19 16v19M31 6v29"/>',
      'box':
        '<path fill="url(#gold)" stroke="#a27232" d="m3 12 18-9 17 9v23l-18 6L3 33z"/><path fill="#deb46b" stroke="#a27232" d="m3 12 17 7 18-7M20 19v22M12 7l17 8v9l-5 2v-9L8 10"/><path fill="#a87835" d="m7 23 6 2v7l-6-2z"/>',
      'building':
        '<path fill="url(#gold)" stroke="#946328" d="M4 16 21 3l17 13-4 1v21H8V17z"/><path fill="#e4b863" stroke="#946328" d="m4 16 17-13 17 13-3 2L21 7 7 18z"/><path fill="#80542a" d="M17 26h8v12h-8zM11 19h4v5h-4zM27 19h4v5h-4zM18 13h6v7h-6z"/><path stroke="#946328" d="M4 38h34"/>',
      'people':
        '<circle cx="14" cy="12" r="6" fill="#d9b16f" stroke="#9b713d"/><circle cx="27" cy="9" r="6" fill="#d9b16f" stroke="#9b713d"/><path fill="#77a054" stroke="#4b7331" d="M21 17q15-5 15 17H20z"/><path fill="url(#steel)" stroke="#527790" d="M7 20q14-5 16 16H4z"/>',
    };
    return (
      '<svg viewBox="0 0 42 42" aria-hidden="true"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d7e1e9"/></linearGradient><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#f3d386"/><stop offset="1" stop-color="#c08937"/></linearGradient><linearGradient id="steel" x2="0" y2="1"><stop stop-color="#e9f4fc"/><stop offset="1" stop-color="#6e9dbd"/></linearGradient><linearGradient id="green" x2="0" y2="1"><stop stop-color="#a9ce7e"/><stop offset="1" stop-color="#4b8c37"/></linearGradient></defs>' +
      (paths[key] || paths.building) +
      '</svg>'
    );
  }

  const parts = {
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const menubar = util.el('div', 'organizer-titlebar', document.body);
        util.el('span', 'mac-apple', menubar).innerHTML = '<svg viewBox="0 0 24 26" aria-hidden="true"><path fill="currentColor" d="M16.6 6.4c1.3-1.2 1.3-2.9 1.3-3.4-1.5.1-3.2 1-4.2 2.2-.9 1.1-1.5 2.6-1.4 3.3 1.6.1 3.2-.8 4.3-2.1zM20.3 18.6c-.6 1.3-.9 1.9-1.7 3-1.1 1.6-2.6 3.6-4.5 3.6-1.7 0-2.1-1-4.4-1-2.2 0-2.7 1-4.4 1-1.9 0-3.4-1.8-4.5-3.4C-2.4 15.5-.6 8.4 4 6.8c1.7-.6 3.2-.1 4.5.4 1.2.5 1.6.5 2.8.1 1.6-.6 2.8-.8 4.1-.6 2 .2 3.5 1.1 4.4 2.5-3.7 2.1-3.1 7.2.5 9.4z"/></svg>';
        util.el('strong', 'mac-app', menubar, 'Inventory Pro');
        util.el('span', 'mac-menus', menubar, 'File　 Edit　 View　 Records　 Window　 Help');
        util.el('span', 'mac-status', menubar).innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8" cy="8" r="5.4" fill="none" stroke="currentColor" stroke-width="2"/><path d="m12 12 5 5" stroke="currentColor" stroke-width="2"/></svg><svg viewBox="0 0 22 20" aria-hidden="true"><path d="M2 7q9-8 18 0M5 10q6-5 12 0M8 13q3-2 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="16" r="1.2"/></svg><svg viewBox="0 0 26 18" aria-hidden="true"><rect x="1" y="2" width="22" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="4" width="18" height="10" rx="1" fill="currentColor"/><path d="M24 6v6" stroke="currentColor" stroke-width="2"/></svg><span>Mon Apr 27&nbsp;&nbsp;10:24 AM</span>';
        const titlebar = util.el('div', 'organizer-menubar', document.body);
        util.el('span', 'mac-lights', titlebar).innerHTML = '<i></i><i></i><i></i>';
        const toolbar = util.el('div', 'organizer-toolbar', document.body);
        const tabs = util.el('div', 'mac-tabs', toolbar);
        for (const name of ['Orders', 'Inventory', 'Customers', 'Employees', 'Reports']) {
          const tab = util.el('button', 'mac-tab' + (name === 'Orders' ? ' active' : ''), tabs, name);
          tab.type = 'button';
          tab.addEventListener('click', () => {
            for (const t of tabs.children) t.classList.toggle('active', t === tab);
          });
        }
        const headerTools = util.el('div', 'ref-tools', toolbar);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
          submit.title = 'Save and exit';
          submit.setAttribute('aria-label', 'Save and exit');
        }
        Object.assign(_c, { headerTools, submit, titlebar, toolbar });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const tips = util.el('aside', 'mac-tips', body);
        util.el('div', 'tips-heading', tips).innerHTML = '<span class="tips-bulb"><svg viewBox="0 0 32 38" aria-hidden="true"><path d="M16 2C9.8 2 5 6.8 5 13c0 4.2 2.2 6.9 5.4 9.8 1.3 1.2 1.6 2.4 1.8 4.2h7.6c.2-1.8.5-3 1.8-4.2C24.8 19.9 27 17.2 27 13 27 6.8 22.2 2 16 2zM11.7 30h8.6M12.7 34h6.6" fill="none" stroke="#263c61" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><strong>Tips</strong>';
        const left = util.el('ul', 'tips-list', tips);
        for (const line of ['Click a column header to sort the list.', 'Use the column menu to filter or adjust the column.', 'Drag column headers to reorder columns.']) util.el('li', '', left, line);
        const right = util.el('ul', 'tips-list', tips);
        for (const line of ['Select multiple rows with Shift-click or use the select-all checkbox.', 'Use the toolbar to perform bulk actions on selected orders.', 'Adjust column widths by dragging the column separators.']) util.el('li', '', right, line);
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) body.append(taskPanel);
        Object.assign(_c, { stage, taskPanel });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, headerTools, label, lr, placement, rng, util, wantFooter, word } =
          _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
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
          if (placement !== 'footer' && placement !== 'link') {
            for (const control of [...tools.children]) headerTools.append(control);
            foot.remove();
          }
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-data-grid-reorder-02',
    template: 'site/base',
    design: { parts },
  });
})();
