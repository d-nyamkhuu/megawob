// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  // Local outline icons: no font glyphs or external assets are needed by the desktop frame.
  function fluentIcon(parent, name) {
    const paths = {
      database: ['M4 5c0-4 16-4 16 0s-16 4-16 0', 'M4 5v14c0 4 16 4 16 0V5', 'M4 10c0 4 16 4 16 0', 'M4 15c0 4 16 4 16 0'],
      refresh: ['M21 9a9 9 0 1 0 0 7', 'M21 3v6h-6'],
      file: ['M5 2h9l5 5v15H5Z', 'M14 2v6h5'],
      edit: ['m4 16 12-12 4 4L8 20l-5 1Z', 'm13 7 4 4'],
      delete: ['M4 6h16', 'M9 6V3h6v3', 'M6 6v15h12V6', 'M10 10v7', 'M14 10v7'],
      logs: ['M5 2h11l4 4v16H5Z', 'M15 2v5h5', 'M9 7h3', 'M9 11h7', 'M9 15h7', 'M9 19h5'],
      save: ['M4 3h13l4 4v14H3V3Z', 'M7 3v7h10V3', 'M7 21v-8h10v8', 'M14 4v4'],
      play: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20', 'm10 7 6 5-6 5Z'],
      flag: ['M4 22V3', 'M4 4h8l2 2h7v10h-8l-2-2H4'],
      folder: ['M3 6h7l2 2h9v13H3Z', 'M3 9h18'],
      home: ['m2 11 10-9 10 9', 'M5 9v12h5v-7h4v7h5V9'],
      branch: ['M6 7v10', 'M6 13h6a5 5 0 0 0 5-5', 'M6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4', 'M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4', 'M17 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4'],
      chart: ['M3 13h4v9H3Z', 'M10 8h4v14h-4Z', 'M17 3h4v19h-4Z'],
      table: ['M3 4h18v17H3Z', 'M3 10h18', 'M3 15h18', 'M9 4v17', 'M15 10v11'],
      cloud: ['M6 20a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 0 1 0 12Z'],
      chevron: ['m8 10 4 4 4-4'],
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'fl-icon'); svg.setAttribute('aria-hidden', 'true');
    for (const d of paths[name] || paths.file) {
      const p = document.createElementNS(svg.namespaceURI, 'path'); p.setAttribute('d', d); svg.append(p);
    }
    parent.append(svg); return svg;
  }

  const parts = {
    'frame.theme': (base, S) => function (_c) {
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
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // This design is the fixed dark developer workspace shown in its reference.
      root.style.setProperty('--bg', '#f4f6f8');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--fg', '#252a32');
      root.style.setProperty('--muted', '#68717e');
      root.style.setProperty('--line', '#d2d8e0');
      root.style.setProperty('--accent', '#0878d1');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, navDraw, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        if (display !== 'header' || navDraw) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'DevStudio – AcmeApp');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (navDraw) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['File', 'Edit', 'View', 'Go', 'Run', 'Tools', 'Window', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const ribbon = util.el('div', 'fl-ribbon', header);
      for (const [text, icon, arrow, separator] of [
        ['Connect', 'database', true, true], ['Refresh', 'refresh', false, false],
        ['New', 'file', true, true], ['Edit', 'edit', false, false],
        ['Delete', 'delete', false, true], ['Logs', 'logs', false, false],
        ['Jobs', 'play', false, false], ['Feature Flags', 'flag', true, false],
      ]) {
        const b = util.el('button', `fl-command${separator ? ' fl-separated' : ''}`, ribbon);
        b.type = 'button'; fluentIcon(b, icon); util.el('span', '', b, text);
        if (arrow) fluentIcon(b, 'chevron');
        b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: text }));
      }
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, ribbon, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'fl-rail', body);
      for (const [text, icon, depth] of [
        ['AcmeApp', 'folder', 0], ['Overview', 'home', 0], ['Source Control', 'branch', 0],
        ['Pipelines', 'play', 0], ['Observability', 'chart', 0], ['Databases', 'database', 0],
        ['acme', 'database', 1], ['accounts', 'table', 2], ['orders', 'table', 2],
        ['users', 'table', 2], ['products', 'table', 2], ['Feature Management', 'flag', 0],
        ['Environments', 'cloud', 0],
      ]) {
        const b = util.el('button', `fl-rail-item fl-depth-${depth}${text === 'accounts' ? ' active' : ''}`, rail);
        b.type = 'button'; fluentIcon(b, icon); util.el('span', '', b, text);
        if (text === 'Databases' || text === 'acme') fluentIcon(b, 'chevron');
        b.addEventListener('click', () => env.log('decoy', { what: 'navigation', label: text }));
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-dbrow-02',
    template: 'site/base',
    design: { parts },
  });
})();
