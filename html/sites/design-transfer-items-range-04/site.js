// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish
          ? null
          : rng.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sampledSidebar = roomy && rng.bool(0.35);
        const sidebar = true;
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (!word && rng.fork('chrome/next-save').bool(0.6)) label = 'Save';
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sampledSidebar, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Product Manager');
        brand.dataset.role = 'brand';
        const menu = util.el('nav', 'next-menu', header);
        for (const item of ['🛒　Products', '📁　Collections', '◆　Pricing', '▦　Inventory', '▮　Reports']) {
          util.el('span', '', menu, item);
        }
        const toolbar = util.el('div', 'next-toolbar', header);
        for (const [icon, label] of [
          ['▧', 'New'],
          ['▰', 'Open'],
          ['♟♟', 'Teams'],
          ['▤', 'Tasks'],
          ['▦', 'Schedule'],
          ['▥', 'Reports'],
        ]) {
          const tool = util.el('div', 'next-tool', toolbar);
          util.el('span', 'next-tool-icon', tool, icon);
          util.el('span', '', tool, label);
        }
        Object.assign(_c, { brand, header, menu, toolbar });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sampledSidebar, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          if (sampledSidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          const side = util.el('aside', 'ref-side', body);
          for (const item of ['Collections', 'Seasonal', 'Featured', 'All products']) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
        }
        Object.assign(_c, { body });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const workspace = util.el('section', 'next-workspace', stage);
        const actions = util.el('div', 'collection-actions', workspace);
        const instruction = _c.header.querySelector('.ref-instruction');
        if (instruction) actions.appendChild(instruction);
        actions.appendChild(_c.headerTools);
        util.el('h1', '', workspace, 'Product Collection');
        util.el('div', 'next-subtitle', workspace, 'Choose the products to include in this collection.');
        const details = util.el('div', 'next-bottom-info', workspace);
        const nameRow = util.el('div', 'collection-name-row', details);
        util.el('span', '', nameRow, 'Collection name:');
        const nameInput = util.el('input', 'collection-name', nameRow);
        nameInput.value = 'Summer Essentials';
        nameInput.setAttribute('aria-label', 'Collection name');
        const category = util.el('div', 'collection-category', details);
        util.el('span', '', category, 'Category:');
        util.el('span', '', category, 'Seasonal');
        const cart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cart.setAttribute('viewBox', '0 0 150 145');
        cart.setAttribute('class', 'collection-cart');
        cart.setAttribute('aria-hidden', 'true');
        cart.innerHTML =
          '<path d="M17 25h17l11 75h69l14-57H39" fill="none" stroke="#8b3028" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 48h71M53 65h61M58 82h51M63 48l4 48M84 48v49M104 48l-4 49" fill="none" stroke="#657e8e" stroke-width="3"/><path d="M48 100h66" stroke="#596d79" stroke-width="5"/><circle cx="59" cy="118" r="10" fill="#65717a"/><circle cx="105" cy="118" r="10" fill="#65717a"/><circle cx="59" cy="118" r="4" fill="#dce8ef"/><circle cx="105" cy="118" r="4" fill="#dce8ef"/>';
        workspace.appendChild(cart);
        const summary = util.el('aside', 'collection-summary', workspace);
        util.el('strong', '', summary, 'Collection Summary');
        util.el('div', '', summary, 'Collection ready');
        util.el('div', '', summary, 'Choose products to build a set');
        const inspector = util.el('aside', 'next-inspector', body);
        util.el('h2', '', inspector, 'Collection Summary');
        util.el('b', '', inspector, 'General');
        util.el('p', '', inspector, 'Name:          Corporate Site');
        util.el('p', '', inspector, 'Code:          CS-001');
        util.el('p', '', inspector, 'Start Date:    Apr 12, 1993');
        util.el('p', '', inspector, 'End Date:      Sep 30, 1993');
        util.el('p', '', inspector, 'Status:        Planning');
        util.el('b', '', inspector, 'Details');
        util.el('p', '', inspector, 'Owner:         Patricia Miller');
        util.el('p', '', inspector, 'Priority:      High');
        util.el('p', '', inspector, 'Category:      Web');
        util.el('p', '', inspector, 'Budget:        $250,000');
        util.el('p', '', inspector, 'Spent:         $0');
        util.el('b', '', inspector, 'Description');
        util.el(
          'div',
          'next-description',
          inspector,
          'Redesign the corporate website to improve brand presence and usability.',
        );
        body.insertBefore(workspace, stage);
        S.frameAlign(_c, stage);
        Object.assign(_c, {
          actions,
          cart,
          category,
          details,
          inspector,
          nameInput,
          nameRow,
          stage,
          summary,
          workspace,
        });
      },
    'frame.toast': (base) =>
      function (_c) {
        base(_c);
        if (_c.display === 'toast') {
          const note = document.body.querySelector('.ref-note');
          if (note) _c.actions.prepend(note);
        }
      },
  };

  env.site({
    name: 'design-transfer-items-range-04',
    template: 'site/base',
    design: { parts },
  });
})();
