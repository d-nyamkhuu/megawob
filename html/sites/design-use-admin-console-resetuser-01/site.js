// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      // Keep the seeded theme draws stable, while this Aqua reference design stays blue and light.
      for (const [k, v] of Object.entries(THEMES.light)) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#1685d4');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'aqua-titlebar', document.body);
      const dots = util.el('span', 'aqua-window-dots', titlebar);
      for (const color of ['red', 'yellow', 'green']) util.el('i', `aqua-dot aqua-dot-${color}`, dots);
      util.el('strong', 'aqua-window-title', titlebar, 'Northstar Admin Console');
      Object.assign(_c, { collide, cr, decoys, dots, label, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('nav', 'aqua-tabs', header);
      for (const label of ['Dashboard', 'Users', 'Groups', 'Computing', 'Storage', 'Applications', 'Reports']) {
        const tab = util.el('a', 'aqua-tab', tabs, label);
        tab.href = '#';
        tab.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      const globalSearch = util.el('div', 'aqua-global-search', header);
      util.el('span', '', globalSearch, '⌕');
      util.el('span', '', globalSearch, 'Search users…');
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Northstar Admin Console');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { globalSearch, header, tabs });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sampledSide = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const sideLabels = ['User Accounts', 'Groups', 'Roles', 'Licences', 'Service Desk', 'Audit Log', 'Settings', 'System Status'];
        const sideItems = sideLabels.slice(0, sampledSide.length);
        util.el('div', 'aqua-side-heading', side, 'Directory');
        for (let i = 0; i < sideItems.length; i++) {
          if (i === 4) util.el('div', 'aqua-side-heading', side, 'Support');
          if (i === 6) util.el('div', 'aqua-side-heading', side, 'Administration');
          const item = sideItems[i];
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const underlay = util.el('div', 'aqua-underlay', stage);
      const underHead = util.el('div', 'aqua-under-head', underlay);
      util.el('strong', '', underHead, '👥  User Accounts');
      const search = util.el('div', 'aqua-under-search', underHead);
      util.el('span', '', search, 'Search:');
      util.el('span', 'aqua-well', search, '');
      util.el('span', 'aqua-select', search, 'All Teams　⌄');
      util.el('span', 'aqua-select', search, 'Active Accounts　⌄');
      const table = util.el('div', 'aqua-under-table', underlay);
      const columns = ['Name', 'Email Address', 'Team', 'Status', 'Last Sign In'];
      const headRow = util.el('div', 'aqua-under-row aqua-under-labels', table);
      for (const name of columns) util.el('span', '', headRow, name);
      for (const row of ['Aaliyah Patel　　 aaliyah.patel@northstar.example　　 Engineering　　 Active　　 14 Mar 2001, 09:12',
        'Aaron Kim　　　　 aaron.kim@northstar.example　　　　 Product　　　　 Active　　 12 Mar 2001, 16:03',
        'Bella Nguyen　　 bella.nguyen@northstar.example　　 Marketing　　　 Active　　 11 Mar 2001, 10:27',
        'Carlos Mendez　 carlos.mendez@northstar.example　 Engineering　　 Active　　 13 Mar 2001, 08:45',
        'Darius Jefferson　 darius-jefferson.5@northstar.example　 Sales　　　　　 Active　　 10 Mar 2001, 17:21',
        'Elena Rossi　　　 elena.rossi@northstar.example　　　 Finance　　　　 Active　　 13 Mar 2001, 11:06',
        'Fatima Al-Sayed　 fatima.al-sayed@northstar.example　 Customer Success　 Active　 14 Mar 2001, 09:58',
        'George Chen　　 george.chen@northstar.example　　 Engineering　　 Active　　 09 Mar 2001, 14:33',
        'Hannah Brooks　 hannah.brooks@northstar.example　 Product　　　　 Active　　 13 Mar 2001, 18:20',
        'Ivan Petrov　　　 ivan.petrov@northstar.example　　　 Engineering　　 Active　　 12 Mar 2001, 13:14']) {
        const parts = row.trim().split(/\s{2,}/);
        const line = util.el('div', 'aqua-under-row', table);
        for (const value of parts) util.el('span', '', line, value);
      }
      S.frameAlign(_c, stage);

      Object.assign(_c, { columns, headRow, search, stage, table, underHead, underlay });
    },
  };

  env.site({
    name: 'design-use-admin-console-resetuser-01',
    template: 'site/base',
    design: { parts },
  });
})();
