// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) => function (_c) {
      const { body, display, endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }

      // Acme Analytics shell: keep the episode controls and task stage inside the
      // reference design's top navigation and companion tips card.
      document.body.classList.add('material-you');
      const brand = header.querySelector('.ref-brand') || util.el('div', 'ref-brand', header);
      brand.textContent = 'Acme Analytics';
      brand.dataset.role = 'brand';
      let tabs = header.querySelector('.ref-nav');
      if (!tabs) tabs = util.el('nav', 'ref-nav', header);
      const tabNames = ['Dashboard', 'Reports', 'Data', 'Settings'];
      const currentTabs = [...tabs.querySelectorAll('.ref-navlink')];
      for (let i = 0; i < tabNames.length; i++) {
        let a = currentTabs[i];
        if (!a) {
          a = util.el('a', 'ref-navlink', tabs);
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: a.textContent }); });
        }
        a.textContent = tabNames[i];
        a.classList.toggle('active', tabNames[i] === 'Data');
      }
      currentTabs.slice(tabNames.length).forEach((a) => a.remove());
      const monogram = util.el('div', 'acme-mark', header);
      monogram.setAttribute('aria-hidden', 'true');
      const avatar = util.el('div', 'acme-avatar', header, 'J');
      avatar.setAttribute('aria-hidden', 'true');
      const tips = util.el('aside', 'acme-tips', body);
      const tipsHeading = util.el('div', 'acme-tips-heading', tips);
      const tipIcon = (parent, kind) => {
        const span = util.el('span', 'acme-tip-icon', parent);
        span.setAttribute('aria-hidden', 'true');
        const shapes = {
          bulb: '<path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4.2 12.6c.7.5 1.2 1.4 1.2 2.4h6c0-1 .5-1.9 1.2-2.4A7 7 0 0 0 12 2Z"/><path d="M12 5v3m-4 1 2 2m6-2-2 2"/>',
          pointer: '<path d="M5 3v18l5-5 4 6 3-2-4-6h7L5 3Z"/>',
          right: '<path d="m9 5 7 7-7 7"/>', right2: '<path d="m5 5 7 7-7 7m7-14 7 7-7 7"/>',
          left: '<path d="m15 5-7 7 7 7"/>', left2: '<path d="m19 5-7 7 7 7M12 5l-7 7 7 7"/>',
          mouse: '<rect x="5" y="2.5" width="14" height="19" rx="7"/><path d="M12 3v6m-7 0h14"/>'
        };
        span.innerHTML = `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${shapes[kind]}</svg>`;
      };
      tipIcon(tipsHeading, 'bulb');
      util.el('strong', '', tipsHeading, 'Tips');
      const tipRows = [
        ['pointer', 'Select one or more items in the list. Use Ctrl-click to toggle items or Shift-click to select a range.'],
        ['right', 'Click > to move the selected items to the Visible columns list.'],
        ['right2', 'Click >> to move all items to the right that match the current filter.'],
        ['left', 'Click < to move the selected items back to the Available list.'],
        ['left2', 'Click << to move all items back that match the current filter.'],
        ['mouse', 'You can also double-click an item or drag and drop it into the other list.'],
      ];
      for (const [icon, text] of tipRows) {
        const row = util.el('div', 'acme-tip-row', tips);
        tipIcon(row, icon);
        util.el('span', 'acme-tip-copy', row, text);
      }
      if (display === 'header') header.classList.add('has-instruction');
      Object.assign(_c, { avatar, brand, currentTabs, monogram, submit, tabNames, tabs, tipIcon, tipRows, tips, tipsHeading });
    },
  };

  env.site({
    name: 'design-transfer-items-multi-03',
    template: 'site/base',
    design: { parts },
  });
})();
