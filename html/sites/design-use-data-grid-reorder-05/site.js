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
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const titlebar = util.el('div', 'organizer-titlebar', document.body);
        util.el('span', 'organizer-mark', titlebar).innerHTML = officeIcon('building');
        util.el('strong', '', titlebar, 'Acme Office Supply');
        util.el('span', 'organizer-window-controls', titlebar, '—　□　×');
        util.el(
          'div',
          'organizer-menubar',
          document.body,
          'File　 Edit　 View　 Orders　 Customers　 Reports　 Tools　 Help',
        );
        const toolbar = util.el('div', 'organizer-toolbar', document.body);
        for (const [icon, label] of [
          ['▤', 'New Order'],
          ['✎', 'Edit'],
          ['✖', 'Delete'],
          ['▣', 'Print'],
          ['✉', 'Send'],
          ['▰', 'Mark Shipped'],
          ['✓', 'Apply Payment'],
          ['▥', 'Export'],
        ]) {
          const item = util.el('span', 'organizer-tool', toolbar);
          util.el('b', '', item).innerHTML = officeIcon(icon);
          util.el('span', '', item, label);
        }
        toolbar.append(headerTools);
        util.el('div', 'organizer-record-tools', toolbar);
        Object.assign(_c, { headerTools, submit, titlebar, toolbar });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const pageHead = util.el('header', 'acme-page-head', body);
        util.el('a', 'acme-wordmark', pageHead, 'Acme Supply Co.');
        const pageLinks = util.el('nav', 'acme-page-links', pageHead);
        for (const [i, label] of ['Home', 'Help', 'Sign Out'].entries()) {
          if (i) util.el('span', 'acme-link-sep', pageLinks, '|');
          const link = util.el('a', '', pageLinks, label);
          link.href = '#';
          link.addEventListener('click', e => e.preventDefault());
        }
        const rail = body.querySelector('.ref-side');
        if (rail) {
          rail.replaceChildren();
          const logo = util.el('div', 'acme-ship-logo', rail);
          logo.innerHTML = '<svg viewBox="0 0 90 94" aria-hidden="true"><path d="M43 8h13v30h13v25H29V26h14zM32 27l11-10m4 0 15 10M37 34h6m7 0h7m-20 9h7m7 0h7" fill="#ddd" stroke="#111" stroke-width="4"/><path d="M12 68q9-8 18 0t18 0q9-8 18 0t18 0M10 78q9-8 18 0t18 0q9-8 18 0t18 0" fill="none" stroke="#00e" stroke-width="5"/><path d="M12 59l11-17 12 17" fill="#111"/></svg>';
          for (const label of ['Orders','Customers','Products','Employees','Reports']) {
            const link = util.el('a', 'acme-rail-link', rail, label);
            link.href = '#';
            link.addEventListener('click', e => e.preventDefault());
          }
        }
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const customers = util.el('aside', 'organizer-customers', body);
        util.el('h2', '', customers, 'Customers');
        const relatedSearch = util.el('input', 'organizer-search', customers);
        relatedSearch.placeholder = 'Search customers...';
        relatedSearch.setAttribute('aria-label', 'Search related records');
        util.el('div', 'organizer-index', customers);
        util.el('div', 'organizer-detail', customers);
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) customers.append(taskPanel);
        customers.dataset.icon = 'people';
        window.organizerOfficeIcon = officeIcon;
        Object.assign(_c, { customers, relatedSearch, stage, taskPanel });
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
    name: 'design-use-data-grid-reorder-05',
    template: 'site/base',
    design: { parts },
  });
})();
