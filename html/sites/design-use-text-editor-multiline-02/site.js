// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = W >= 760 || navDraw;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('vs-titlebar');
      if (display !== 'header' || nav) {
        rng.pick(TITLES);
        const title = 'ShopEase';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Projects', 'Documents', 'Activity', 'Team', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body vs-workspace', document.body);
      const activity = util.el('aside', 'vs-activity', body);
      for (const icon of ['▣', '⌕', '⑂', '▷', '▦']) util.el('div', 'vs-activity-icon', activity, icon);
      util.el('div', 'vs-activity-settings', activity, '⚙');
      const explorer = util.el('aside', 'vs-explorer', body);
      util.el('div', 'vs-explorer-heading', explorer, 'Project Files');
      util.el('div', 'vs-tree-root', explorer, '⌄　▰　shop-ease');
      const tree = util.el('div', 'vs-tree', explorer);
      for (const [depth, icon, label, cls] of [
        [1,'›　▰','assets',''], [1,'⌄　▰','js',''],
        [2,'　JS','app.js',''], [2,'　JS','cart.js','selected'], [2,'　JS','checkout.js',''], [2,'　JS','products.js',''], [2,'　JS','utils.js',''],
        [1,'›　▰','styles',''], [1,'›　▰','templates',''],
        [1,'　▤','index.html',''], [1,'　▤','package.json','']
      ]) { const row = util.el('div', `vs-tree-row ${cls}`, tree, `${icon}　${label}`); row.style.setProperty('--depth', depth); }
      util.el('div', 'vs-section', explorer, '⌄　OUTLINE');
      util.el('div', 'vs-section', explorer, '⌄　FILES');
      const stats = util.el('div', 'vs-stats', explorer);
      for (const [k,v] of [['Total Files','8'],['HTML','1'],['CSS','1'],['JavaScript','3'],['Images','2'],['Other','1']]) {
        const row = util.el('div', 'vs-stat', stats); util.el('span','',row,k); util.el('span','',row,v);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { activity, body, explorer, stats, tree });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const editor = util.el('section', 'vs-editor', body);
      const tab = util.el('div', 'vs-tab', editor);
      util.el('span','vs-js-icon',tab,'JS');
      util.el('span','',tab,'cart.js');
      util.el('span','vs-tab-close',tab,'×');
      const stage = util.el('main', 'ref-stage', editor);
      S.frameAlign(_c, stage);
      Object.assign(_c, { editor, stage, tab });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const menu = util.el('div', 'vs-menubar', document.body);
      menu.textContent = 'File　 Edit　 Selection　 View　 Go　 Run　 Terminal　 Help';
      header.after(menu);
      Object.assign(_c, { menu, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-text-editor-multiline-02',
    template: 'site/base',
    design: { parts },
  });
})();
