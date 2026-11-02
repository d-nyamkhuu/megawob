// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) => function (_c) {
      const { body, display, endBtn, header, label, placement, stage, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', header);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }

      // 2012 Metro desktop frame: keep all episode controls while dressing them as
      // the Team Management application shown in the design reference.
      document.body.classList.add('metro-desktop');
      header.classList.add('metro-titlebar');
      const appMark = util.el('span', 'metro-app-mark', header, '●');
      appMark.setAttribute('aria-hidden', 'true');
      util.el('div', 'metro-app-name', header, 'Team Management');
      const win = util.el('div', 'metro-window-controls', header);
      util.el('span', '', win, '−');
      util.el('span', '', win, '□');
      util.el('span', '', win, '×');
      const sheet = util.el('section', 'metro-sheet', body);
      sheet.appendChild(stage);
      const inspector = util.el('aside', 'metro-inspector', body);
      const panel = body.querySelector(':scope > .ref-panel');
      if (panel) inspector.appendChild(panel);
      util.el('div', 'metro-inspector-title', inspector, 'Team Details');
      const detail = (label, value, cls = '') => {
        const row = util.el('div', `metro-detail ${cls}`.trim(), inspector);
        util.el('span', 'metro-detail-label', row, label);
        util.el('span', 'metro-detail-value', row, value);
      };
      detail('Name', 'Product Launch');
      detail('Description', 'Cross-functional team for the product launch initiative.', 'description');
      detail('Department', 'Product', 'section-start');
      detail('Type', 'Project Team');
      detail('Start Date', 'Jun 3, 2012');
      detail('End Date', 'Dec 31, 2012');
      detail('Members', '0', 'section-start');
      const dock = util.el('nav', 'metro-dock', document.body);
      for (const [icon, label] of [['♟','Teams'], ['▣','Projects'], ['●','People'], ['▥','Reports'], ['⚙','Settings']]) {
        const a = util.el('a', `metro-dock-item${label === 'Teams' ? ' active' : ''}`, dock);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        util.el('span', 'metro-dock-icon', a, icon);
        util.el('span', '', a, label);
      }
      if (display === 'header') header.classList.add('has-instruction');
      Object.assign(_c, { appMark, detail, dock, inspector, sheet, submit, win });
    },
  };

  env.site({
    name: 'design-transfer-items-multi-02',
    template: 'site/base',
    design: { parts },
  });
})();
