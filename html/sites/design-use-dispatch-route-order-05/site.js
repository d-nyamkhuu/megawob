// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = (W >= 1180 && rng.bool(0.5)) || true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      if (!ctx.finish && rng.fork('chrome/continue').bool(0.55)) label = word ? word('continue') : 'Continue';
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'ol-titlebar', header);
      const mark = util.el('span', 'ol-mark', titlebar);
      const truck = util.svg('svg', { viewBox:'0 0 34 25', width:34, height:25, 'aria-hidden':'true' }, mark);
      util.svg('path', { d:'M2 4h20v14H2zM22 9h6l4 5v4H22z', fill:'#f2b600', stroke:'#111', 'stroke-width':'2' }, truck);
      util.svg('path', { d:'M24 10h4l3 4h-7z', fill:'#a9d7ee', stroke:'#111', 'stroke-width':'1' }, truck);
      for (const x of [8,26]) util.svg('circle', { cx:x, cy:20, r:3.3, fill:'#222', stroke:'#eee', 'stroke-width':'1' }, truck);
      const titleText = util.el('span', 'ol-window-title', titlebar, 'Route Planner - Riverside Logistics');
      const winControls = util.el('div', 'ol-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'ol-window-control', winControls, glyph);
      const menubar = util.el('div', 'ol-menubar', header);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', menubar, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', menubar);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const [i, item] of ['File', 'Edit', 'View', 'Route', 'Tools', 'Reports', 'Help'].entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      Object.assign(_c, { header, mark, menubar, titleText, titlebar, winControls });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, header, placement, util, wantFooter } = _c;
      let submit = null;
      const toolbar = util.el('div', 'ol-toolbar', header);
      const tools = [
        ['New',0,'M5 2h17v28H5z','white'],['Open',0,'M2 9h28l-4 18H2z','#f6c621'],
        ['Add Stop',1,'M7 2h16v26H7z','white'],['Delete Stop',1,'M7 2h16v26H7z','white'],
        ['Move Up',1,'M16 1L5 15h7v15h8V15h7z','#0074e9'],['Move Down',1,'M12 1h8v15h7L16 30 5 16h7z','#0074e9'],
        ['Map',2,'M2 5l9-3 10 3 9-3v23l-9 3-10-3-9 3z','#d9e7b0'],['Print',2,'M7 2h18v9H7zM3 12h26v12H3zM7 22h18v9H7z','white']
      ];
      for (const [text, group, path, fill] of tools) {
        const b = util.el('button', 'ol-tool ol-group-' + group, toolbar);
        b.type = 'button';
        const icon = util.svg('svg', { viewBox:'0 0 32 32', width:33, height:33, class:'ol-tool-icon', 'aria-hidden':'true' }, b);
        util.svg('path', { d:path, fill, stroke:'#111', 'stroke-width':'1.8', 'stroke-linejoin':'round' }, icon);
        if (text === 'Add Stop') util.svg('path', { d:'M18 18v12M12 24h12', stroke:'#139b2b', 'stroke-width':'4' }, icon);
        if (text === 'Delete Stop') util.svg('path', { d:'M12 16l14 13M26 16L12 29', stroke:'#c40000', 'stroke-width':'4' }, icon);
        if (text === 'New') util.svg('path', { d:'M7 5h13M8 26h11', stroke:'#8c8c8c', 'stroke-width':'1' }, icon);
        if (text === 'Map') util.svg('path', { d:'M11 3v22M21 6v21M3 21l8-12 10 9 8-11', fill:'none', stroke:'#267fc4', 'stroke-width':'1.5' }, icon);
        if (text === 'Print') util.svg('path', { d:'M8 25h16M8 28h16M5 16h22', stroke:'#555', 'stroke-width':'1' }, icon);
        util.el('span', '', b, text);
        b.addEventListener('click', () => {
          if (text === 'Map') document.querySelector('.ol-tab[data-tab="map"]')?.click();
          else env.log('decoy', { label: text });
        });
      }
      const headerTools = util.el('div', 'ref-tools', toolbar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit, toolbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const jobs = util.el('aside', 'ol-jobs', body);
      const tabs = util.el('div', 'ol-tabs', jobs);
      for (const [key, text] of [['stops','Stops'],['map','Map'],['details','Details']]) {
        const tab = util.el('button', 'ol-tab', tabs, text);
        tab.type = 'button'; tab.dataset.tab = key;
        tab.addEventListener('click', () => { jobs.dataset.tab = key; });
      }
      jobs.dataset.tab = 'stops';
      const jobsHead = util.el('div', 'ol-jobs-head', jobs);
      const jobsTable = util.el('table', 'ol-jobs-table', jobs);
      const jobsHeader = util.el('tr', '', util.el('thead', '', jobsTable));
      for (const text of ['Name', 'Type', 'Load (kg)', 'Distance (from prev)']) util.el('th', '', jobsHeader, text);
      const jobsBody = util.el('tbody', '', jobsTable);
      const map = util.el('div', 'ol-map', jobs);
      map.innerHTML = '<svg viewBox="0 0 550 430" preserveAspectRatio="none" aria-hidden="true"><rect width="550" height="430" fill="#dce5be"/><path d="M290 440 Q340 363 404 381 Q442 349 479 363 Q511 323 550 310 L550 430Z" fill="#a8d0f4"/><path d="M0 20L55 47L68 89L62 124L99 180L113 230L158 273L153 326L205 349L265 337L310 388" fill="none" stroke="#79a9df" stroke-width="2"/><path d="M0 345L60 326L110 360L182 330L241 335L300 306L362 273L414 276L480 243L550 225" fill="none" stroke="#aeb3ac" stroke-width="2"/><path d="M256 0L270 69L255 128L239 190L245 234L260 279L270 344L285 430M430 0L400 72L420 127L410 198L458 247L452 315L490 430M0 178L91 158L173 175L244 150L309 166L392 154L550 191" fill="none" stroke="#b0b7a7" stroke-width="2"/><path d="M270 340L185 280L97 195L192 93L300 30L390 135L322 270L270 340" fill="none" stroke="#7385a2" stroke-width="2.4"/></svg>';
      util.el('div', 'ol-map-points', map);
      util.el('div', 'ol-map-north', map, 'N\n▲');
      util.el('div', 'ol-map-scale', map, '0       5       10                 20 km');
      const details = util.el('div', 'ol-side-details', jobs);
      Object.assign(_c, { jobs, jobsBody, jobsHead, jobsHeader, jobsTable, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, util } = _c;
      const foot = util.el('footer', 'ref-foot', document.body);
      util.el('span', 'ref-foot-text', foot, 'Ready');
      const tools = util.el('div', 'ref-tools', foot);
      if (decoys.length > 1) decoyBtn(tools, decoys[1]);
      if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
      let { submit } = _c;
      if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
      if (placement === 'link') submit = endBtn(tools, 'ref-endlink', label);
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dispatch-route-order-05',
    template: 'site/base',
    design: { parts },
  });
})();
