// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        // This reference design uses one cool gray Bootstrap-era palette across episodes.
        root.style.setProperty('--bg', '#eef1f4');
        root.style.setProperty('--panel', '#ffffff');
        root.style.setProperty('--fg', '#171e2c');
        root.style.setProperty('--muted', '#8993a3');
        root.style.setProperty('--line', '#c5cdd8');
        root.style.setProperty('--accent', '#0865cd');
        root.dataset.theme = 'light';
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
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
        const titlebar = util.el('div', 'be-titlebar', document.body);
        util.el('span', 'be-file-icon', titlebar, '▯');
        util.el('strong', '', titlebar, 'Order Manager');
        util.el('div', 'be-window-controls', titlebar, '−　□　×');
        const menubar = util.el('nav', 'be-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Record', 'Tools', 'Window', 'Help'])
          util.el('span', '', menubar, item);
        const toolbar = util.el('div', 'be-toolbar', document.body);
        const actions = [
          ['▯', 'New'],
          ['📂', 'Open'],
          ['▤', 'Print'],
          ['🔎', 'Find'],
          ['▤', 'Delete'],
        ];
        for (const [icon, label] of actions) {
          const item = util.el('div', 'be-tool', toolbar);
          util.el('span', 'be-tool-icon', item, icon);
          util.el('span', '', item, label);
        }
        Object.assign(_c, {
          actions,
          collide,
          cr,
          decoys,
          label,
          menubar,
          nav,
          placement,
          sidebar,
          titlebar,
          toolbar,
          wantFooter,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) rng.pick(TITLES);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        const brand = util.el('div', 'ref-brand', header, 'Company Records');
        brand.dataset.role = 'brand';
        Object.assign(_c, { brand, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, rng, sidebar, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        Object.assign(_c, { body });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const list = util.el('aside', 'be-orders', body);
        util.el('h2', '', list, 'Orders');
        const table = util.el('div', 'be-order-table', list);
        util.el('div', 'be-order-head', table, '#　　 Customer　　　 Date');
        const people = [
          'Chen, L.　　 2024-04-02',
          'Patel, R.　　 2024-04-03',
          'Garcia, M.　 2024-04-03',
          'Miller, K.　 2024-04-04',
          'Davis, S.　　 2024-04-05',
          'Kim, H.　　 2024-04-05',
          'Wilson, T.　 2024-04-06',
          'Brown, A.　 2024-04-06',
          'Martinez, J. 2024-04-07',
          'Taylor, P.　 2024-04-08',
          'Anderson, R. 2024-04-08',
          'Thomas, B.　 2024-04-09',
          'Moore, D.　 2024-04-09',
          'Martin, C.　 2024-04-10',
          'Lee, W.　　 2024-04-11',
        ];
        people.forEach((person, i) =>
          util.el('div', `be-order-row${i === 0 ? ' selected' : ''}`, table, `${1001 + i}　 ${person}`),
        );
        util.el('div', 'be-order-total', list, '15 orders');
        Object.assign(_c, { list, people, table });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, rng, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const stats = util.el('aside', 'be-stats', body);
        util.el('h2', '', stats, 'Order 1001');
        util.el('div', 'be-statline', stats, 'Customer　　 Chen, L.');
        util.el('div', 'be-statline', stats, 'Date　　　　 2024-04-02');
        util.el('div', 'be-statline', stats, 'Status　　　 Shipped');
        util.el('hr', '', stats);
        util.el('h2', '', stats, 'Counts');
        util.el('div', 'be-statline', stats, 'Total orders　　　 15');
        util.el('div', 'be-statline', stats, 'Shipped　　　　 12');
        util.el('div', 'be-statline', stats, 'Pending　　　　　2');
        util.el('div', 'be-statline', stats, 'Returns　　　　　1');
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        stage.style.justifyContent = 'stretch';
        stage.style.alignItems = 'stretch';
        Object.assign(_c, { stage, stats });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-recall-info-crossref-04',
    template: 'site/base',
    design: { parts },
  });
})();
