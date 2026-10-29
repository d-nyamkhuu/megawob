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
        let display = ctx.display || 'hidden';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, display, header, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // Oceanic Supply Frutiger Aero order-management frame.
        const oldControls = [...document.querySelectorAll('.ref-tools button, .ref-tools a')];
        header.replaceChildren();
        header.className = 'ref-task window-title';
        const mast = util.el('div', 'ocean-mast', header);
        util.el('span', 'ocean-globe', mast, '');
        const identity = util.el('div', 'ocean-identity', mast);
        util.el('strong', '', identity, 'Oceanic Supply');
        util.el('span', '', identity, 'Business Management');
        const search = util.el('div', 'ocean-global-search', mast, '⌕　 Search orders, customers, products…');
        util.el('div', 'ocean-user', mast, '♟　Laura Chen　⌄');
        const modulebar = util.el('nav', 'modulebar', header);
        for (const [label, active] of [
          ['Dashboard', false],
          ['Orders', true],
          ['Customers', false],
          ['Inventory', false],
          ['Reports', false],
          ['Administration', false],
        ]) {
          const item = util.el('span', `module-item${active ? ' active' : ''}`, modulebar);
          util.el('span', '', item, label);
        }
        if (display === 'header') util.el('div', 'ref-instruction app-header-note', header, ctx.instruction);

        // Keep the task stage and put a compact order summary beside it.
        for (const child of [...body.children]) if (child !== stage) child.remove();
        body.classList.add('inventory-layout');
        const stats = util.el('aside', 'order-stats', body);
        const summary = util.el('section', 'stats-card', stats);
        util.el('h2', '', summary, '▮  Order Summary');
        for (const [name, value, color] of [
          ['Total Orders', '142', 'blue'],
          ['Pending', '28', 'orange'],
          ['Processing', '54', 'blue'],
          ['Shipped', '48', 'green'],
          ['Cancelled', '12', 'red'],
        ]) {
          const row = util.el('div', 'stats-row', summary);
          util.el('span', '', row, name);
          util.el('b', color, row, value);
        }
        const chart = util.el('section', 'stats-card status-card', stats);
        util.el('h2', '', chart, '▤  Orders by Status');
        const chartBody = util.el('div', 'chart-body', chart);
        util.el('div', 'pie-chart', chartBody, '');
        const legend = util.el('div', 'chart-legend', chartBody);
        for (const [label, value, color] of [
          ['Pending', '28 (19%)', 'orange'],
          ['Processing', '54 (38%)', 'blue'],
          ['Shipped', '48 (34%)', 'green'],
          ['Cancelled', '12 (8%)', 'red'],
        ]) {
          const row = util.el('div', 'legend-row', legend);
          util.el('i', color, row);
          util.el('span', '', row, label);
          util.el('small', '', row, value);
        }
        const recent = util.el('section', 'stats-card recent-card', stats);
        util.el('h2', '', recent, '▣  Recent Orders');
        for (const [id, who, price] of [
          ['SO-10428', 'Sophie Martin', '$1,125.75'],
          ['SO-10427', 'Hiro Tanaka', '$450.00'],
          ['SO-10426', 'Lukas Weber', '$980.40'],
          ['SO-10425', 'Priya Nair', '$327.00'],
          ['SO-10424', 'DeShawn Freeman', '$1,560.00'],
        ]) {
          const row = util.el('div', 'recent-row', recent);
          const orderLink = util.el('a', '', row, id);
          orderLink.href = '#';
          orderLink.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'recent-order', label: id });
          });
          util.el('span', '', row, who);
          util.el('b', '', row, price);
        }
        if (display === 'panel') {
          const note = util.el('aside', 'inventory-task-note', body);
          util.el('strong', '', note, 'Your task');
          util.el('div', '', note, ctx.instruction);
          stats.prepend(note);
        }
        Object.assign(_c, {
          chart,
          chartBody,
          identity,
          legend,
          mast,
          modulebar,
          oldControls,
          recent,
          search,
          stage,
          stats,
          summary,
        });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, mast, oldControls, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // The end control remains separate from any instruction note and always reachable.
        let appFooter = document.querySelector('.ref-foot');
        if (!appFooter) appFooter = util.el('footer', 'ref-foot', document.body);
        const controls = new Set([...oldControls, ...document.querySelectorAll('.ref-tools button, .ref-tools a')]);
        appFooter.replaceChildren();
        util.el('span', 'ref-foot-text', appFooter, 'Oceanic Supply  •  All changes saved');
        const appFooterTools = util.el('div', 'ref-tools app-footer-tools ocean-actions', mast);
        for (const control of controls) appFooterTools.appendChild(control);
        Object.assign(_c, { appFooter, appFooterTools, submit });
      },
  };

  env.site({
    name: 'design-use-data-grid-multirow-03',
    template: 'site/base',
    design: { parts },
  });
})();
