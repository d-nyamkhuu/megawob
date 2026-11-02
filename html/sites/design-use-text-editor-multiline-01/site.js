// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('vs-titlebar');
      if (display !== 'header' || nav) {
        rng.pick(TITLES);
        const title = 'ProjectSite — app.js — Visual Studio Code';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body vs-workspace', document.body);
      const activity = util.el('aside', 'vs-activity', body);
      for (const icon of ['▣', '⌕', '⑂', '▷', '▦']) util.el('div', 'vs-activity-icon', activity, icon);
      util.el('div', 'vs-activity-settings', activity, '⚙');
      const explorer = util.el('aside', 'vs-explorer', body);
      util.el('div', 'vs-explorer-heading', explorer, 'EXPLORER');
      util.el('div', 'vs-tree-root', explorer, '⌄　▰　ProjectSite');
      const tree = util.el('div', 'vs-tree', explorer);
      for (const [depth, icon, label, cls] of [
        [1,'⌄　▰','assets',''], [2,'›　▰','css',''], [2,'›　▰','images',''], [2,'⌄　▰','js',''],
        [3,'　JS','app.js','selected'], [3,'　JS','gallery.js',''], [3,'　JS','utils.js',''], [1,'›　▰','views',''],
        [1,'‹　','index.html',''], [1,'ⓘ　','README.md',''], [1,'{}　','package.json','']
      ]) { const row = util.el('div', `vs-tree-row ${cls}`, tree, `${icon}　${label}`); row.style.setProperty('--depth', depth); }
      util.el('div', 'vs-section', explorer, '⌄　OUTLINE');
      util.el('div', 'vs-section', explorer, '⌄　FILES');
      const stats = util.el('div', 'vs-stats', explorer);
      for (const [k,v] of [['Total Files','8'],['HTML','1'],['CSS','1'],['JavaScript','3'],['Images','2'],['Other','1']]) {
        const row = util.el('div', 'vs-stat', stats); util.el('span','',row,k); util.el('span','',row,v);
      }
      if (sidebar) {
        const side = util.el('aside', 'ref-side vs-navigation', explorer);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { activity, body, explorer, stats, tree });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const editor = util.el('section', 'vs-editor', body);
      const stage = util.el('main', 'ref-stage', editor);
      S.frameAlign(_c, stage);
      Object.assign(_c, { editor, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;
      const foot = document.querySelector('footer.ref-foot') || util.el('footer', 'ref-foot', document.body);
      const status = util.el('span', 'vs-status-readout', foot, 'Ln 1, Col 1　 Spaces: 2　 UTF-8　 LF　 JavaScript');
      foot.prepend(status);
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, explorer, header, label, placement, util } = _c;
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
      const nav = header.querySelector('.ref-nav');
      if (nav) {
        nav.classList.add('vs-navigation');
        explorer.append(nav);
      }
      Object.assign(_c, { menu, submit });
    },
  };

  env.site({
    name: 'design-use-text-editor-multiline-01',
    template: 'site/base',
    design: { parts },
  });
})();
