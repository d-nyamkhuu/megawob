// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const fullGrid = W >= 1450;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, fullGrid, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && (rng.bool(0.35), true);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Native Workplace Shell window frame: app title, menu row and compact toolbar.
      const osTitle = util.el('div', 'os-title', header);
      util.el('span', 'os-appicon', osTitle, '▣');
      util.el('strong', 'os-apptitle', osTitle, 'Acme Supply Co.');
      const osWindow = util.el('div', 'os-window-controls', osTitle);
      for (const mark of ['−', '□', '×']) util.el('span', 'os-window-button', osWindow, mark);
      const links = util.el('nav', 'academic-links', osTitle);
      for (const text of ['Home', 'Help', 'Log Out']) {
        const a = util.el('a', '', links, text);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: text }); });
      }
      const osMenu = util.el('nav', 'os-menu', header);
      for (const label of ['File', 'Edit', 'View', 'Products', 'Tools', 'Reports', 'Window', 'Help']) {
        util.el('span', 'os-menu-item', osMenu, label);
      }
      const osBar = util.el('div', 'os-toolbar', header);
      for (const [icon, label] of [['▧','New'], ['✎','Edit'], ['▤','Delete'], ['▣','Print'], ['▧','Export'], ['◉','Adjust Stock'], ['⚒','More⌄']]) {
        const item = util.el('span', 'os-tool-item', osBar);
        util.el('b', 'os-tool-icon', item, icon);
        util.el('span', '', item, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, links, osBar, osMenu, osTitle, osWindow });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, osBar, rng, roomy, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      body.appendChild(osBar);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const item of ['Orders', 'Inventory', 'Suppliers', 'Customers', 'Employees', 'Reports']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      if (roomy) {
        const directory = util.el('aside', 'warehouse-index', body);
        util.el('h2', 'warehouse-title', directory, 'Warehouses');
        const table = util.el('table', 'warehouse-table', directory);
        const head = util.el('tr', '', table);
        for (const label of ['Code', 'Name', 'Country']) util.el('th', '', head, label);
        for (const row of [
          ['NYC', 'New York', 'USA'], ['LON', 'London', 'UK'], ['PAR', 'Paris', 'France'],
          ['BER', 'Berlin', 'Germany'], ['ROM', 'Rome', 'Italy'], ['MAD', 'Madrid', 'Spain'],
          ['BEI', 'Beirut', 'Lebanon'], ['CAI', 'Cairo', 'Egypt'], ['DXB', 'Dubai', 'UAE'],
          ['SIN', 'Singapore', 'Singapore'],
        ]) {
          const tr = util.el('tr', '', table);
          const code = util.el('td', '', tr);
          const a = util.el('a', '', code, row[0]);
          a.href = '#';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'warehouse-index', label: row[0] }); });
          util.el('td', '', tr, row[1]);
          util.el('td', '', tr, row[2]);
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-data-grid-filter-02',
    template: 'site/base',
    design: { parts },
  });
})();
