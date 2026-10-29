// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        if (roomy) rng.bool(0.35);
        const sidebar = true;
        if (W >= 1180) rng.bool(0.5);
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Acme Supply Co.');
          util.el('span', 'brand-sub', header, 'Inventory & Orders');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['Dashboard', 'Orders', 'Inventory', 'Customers', 'Reports', 'Settings']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, rng, sidebar, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          rng.sample(content.NAV_ITEMS, rng.int(4, 7));
          util.el('div', 'help-title', side, '▾  Help & Tips');
          util.el('strong', 'help-sub', side, 'Working with the table');
          const tips = util.el('div', 'help-copy', side);
          tips.innerHTML =
            '<p>•　Click a column header to sort ascending or descending.</p><p>•　Use the filter menu (▼) to show only matching records.</p><p>•　Select multiple rows with Shift-click or click the top checkbox to select all.</p><p>•　Use the toolbar for actions on selected records.</p><p>•　Drag column headers to reorder and drag the column edge to resize.</p><hr><strong>Icons & Indicators</strong><p><span class="status-dot shipped">●</span>　Shipped<br><span class="status-dot processing">●</span>　Processing<br><span class="status-dot hold">●</span>　On Hold<br><span class="status-dot cancelled">●</span>　Cancelled</p><hr><strong>Pagination</strong><p>Use the controls below the table to move between pages. The record summary shows the number of records on this page and the total number of records.</p>';
        }
        Object.assign(_c, { body });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.end': (base, S) =>
      function (_c) {
        const { body, header, headerTools, util } = _c;
        // Reserve space for every frame element before the widget is rendered.
        const rail = util.el('div', 'acme-rail', document.body);
        const nav = header.querySelector('.ref-nav');
        const instruction = header.querySelector('.ref-instruction');
        const toolbar = util.el('div', 'acme-toolbar', document.body);
        if (instruction) toolbar.append(instruction);
        if (headerTools.childElementCount) toolbar.append(headerTools);
        rail.append(header);
        const panel = body.querySelector('.ref-panel');
        const note = document.body.querySelector(':scope > .ref-note');
        const side = body.querySelector('.ref-side');
        if (panel) rail.append(panel);
        if (note) rail.append(note);
        if (side) rail.append(side);
        const endbar = util.el('div', 'acme-endbar', document.body);
        const foot = document.body.querySelector(':scope > .ref-foot');
        const dock = document.body.querySelector(':scope > .ref-float-dock');
        if (foot) endbar.append(foot);
        if (dock) endbar.append(dock);
        if (nav) document.body.append(nav);
        return base(_c);
      },
  };

  env.site({
    name: 'design-use-data-grid-cellEdit-03',
    template: 'site/base',
    design: { parts },
  });
})();
