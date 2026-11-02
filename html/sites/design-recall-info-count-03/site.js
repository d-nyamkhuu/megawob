// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        document.body.dataset.display = display;
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const mast = util.el('div', 'chronicle-masthead', header);
        util.el('div', 'chronicle-name', mast, 'The Daily Chronicle');
        const deskline = util.el('div', 'chronicle-desks', mast);
        util.el('span', '', deskline, 'NEWS');
        util.el('span', '', deskline, 'PEOPLE');
        util.el('span', '', deskline, 'PERSPECTIVE');
        util.el('div', 'chronicle-date', mast, 'Monday, April 18, 2011');
        S.frameBrand(_c, header);
        Object.assign(_c, { deskline, header, mast });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const rail = util.el('div', 'chronicle-rail', body);
        body.insertBefore(rail, stage);
        for (const panel of body.querySelectorAll('.ref-side, .ref-panel')) rail.append(panel);
        const summary = util.el('aside', 'chronicle-summary', rail);
        const summarySection = (title, rows) => {
          const section = util.el('section', 'chronicle-summary-section', summary);
          util.el('h2', '', section, title);
          const list = util.el('div', 'chronicle-summary-list', section);
          for (const [label, value] of rows) {
            const row = util.el('div', 'chronicle-summary-row', list);
            util.el('span', '', row, label);
            util.el('span', '', row, value);
          }
        };
        summarySection('Orders', [
          ['All Orders', '48'],
          ['Pending', '12'],
          ['Processing', '15'],
          ['Shipped', '11'],
          ['Refunded', '6'],
        ]);
        summarySection('Sales Channels', [
          ['Online Store', '28'],
          ['Phone Orders', '12'],
          ['In Person', '8'],
        ]);
        summarySection('Payment Methods', [
          ['Credit Card', '26'],
          ['PayPal', '14'],
          ['Bank Transfer', '8'],
        ]);
        const dock = util.el('nav', 'chronicle-dock', document.body);
        for (const [icon, label, active] of [
          [
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 3h22v26H5zM9 7h14v3H9zm0 6h14v2H9zm0 5h14v2H9zm0 5h10v2H9z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M9 7h14v3H9zm0 6h14v2H9zm0 5h14v2H9zm0 5h10v2H9z" fill="currentColor"/></svg>',
            'Dashboard',
            false,
          ],
          [
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 3h15l6 6v20H6z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M20 3v7h7M10 14h13M10 18h13M10 22h13" fill="none" stroke="currentColor" stroke-width="2.3"/></svg>',
            'Orders',
            true,
          ],
          [
            '<svg viewBox="0 0 36 32" aria-hidden="true"><path d="M11 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm14-1a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM1 29c0-6 4-10 10-10s10 4 10 10zm19 0c0-5 3-9 8-9s8 4 8 9z" fill="currentColor"/></svg>',
            'Customers',
            false,
          ],
          [
            '<svg viewBox="0 0 36 32" aria-hidden="true"><path d="M3 27h5V18H3zm8 0h5V11h-5zm8 0h5V15h-5zm8 0h5V4h-5z" fill="currentColor"/></svg>',
            'Reports',
            false,
          ],
          [
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m13 2 6 0 1 4 3 1 3-2 4 5-2 3 1 3 4 2-1 6-4 1-2 3 1 4-6 3-3-3h-3l-3 3-6-3 1-4-2-3-4-1-1-6 4-2 1-3-2-3 4-5 3 2 3-1z" transform="translate(-2 -2) scale(.95)" fill="currentColor"/><circle cx="16" cy="16" r="5" fill="#faf9f7"/></svg>',
            'Settings',
            false,
          ],
        ]) {
          const item = util.el('div', `chronicle-dock-item${active ? ' active' : ''}`, dock);
          const iconEl = util.el('span', 'chronicle-dock-icon', item);
          iconEl.innerHTML = icon;
          util.el('span', '', item, label);
        }
        Object.assign(_c, { dock, stage, summary, summarySection });
      },
  };

  env.site({
    name: 'design-recall-info-count-03',
    template: 'site/base',
    design: { parts },
  });
})();
