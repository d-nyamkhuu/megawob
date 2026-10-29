// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base) => function (_c) {
      base(_c);
      const r = _c.rng.fork('flash/end');
      _c.placement = _c.ctx.finish ? null : r.pick(['footer', 'footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon']);
      _c.wantFooter = true;
      if (!_c.ctx.finish && r.bool(0.78)) _c.label = 'Finish';
      if (!_c.ctx.finish && _c.display === 'header') _c.placement = 'footer';
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('vs-titlebar');
      header.classList.toggle('flash-long', _c.ctx.instruction.length > 110 && display === 'header');
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header);
      util.el('span', 'flash-logo', brand);
      util.el('span', 'flash-brand-name', brand, 'Code');
      util.el('span', 'flash-brand-end', brand, 'Studio');
      brand.dataset.role = 'brand';
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body vs-workspace', document.body);
      const explorer = util.el('aside', 'vs-explorer', body);
      util.el('div', 'vs-explorer-heading', explorer, 'Workspace');
      const root = util.el('div', 'vs-tree-root', explorer);
      util.el('span', 'flash-arrow', root, '▾');
      util.el('span', 'flash-folder', root);
      util.el('span', '', root, 'Website');
      const tree = util.el('div', 'vs-tree', explorer);
      for (const [depth, icon, label, cls] of [
        [1,'▾ 📁','css','folder'], [2,'▤','main.css','file'], [2,'▤','layout.css','file'],
        [1,'▾ 📁','js','folder'], [2,'▤','app.js','file'], [2,'▤','utils.js','file'],
        [1,'▾ 📁','pages','folder'], [2,'▤','index.html','file'], [2,'▤','about.html','file'],
        [2,'▤','contact.html','file'], [0,'▤','gallery.js','file selected']
      ]) {
        const row = util.el('div', `vs-tree-row ${cls}`, tree);
        if (cls === 'folder') util.el('span', 'flash-arrow', row, '▾');
        util.el('span', cls === 'folder' ? 'flash-folder' : 'flash-file', row);
        util.el('span', 'flash-filename', row, label);
        row.style.setProperty('--depth', depth);
      }
      if (sidebar) {
        const side = util.el('aside', 'ref-side vs-navigation', explorer);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body, explorer, tree });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const editor = util.el('section', 'vs-editor', body);
      const tabs = util.el('div', 'flash-tabs', editor);
      util.el('div', 'flash-tab', tabs, '▤  gallery.js　 ×');
      const settings = util.el('div', 'flash-settings', editor);
      for (const [name, value] of [['Encoding:', 'UTF-8'], ['Language:', 'JavaScript'], ['Line endings:', 'LF']]) {
        const group = util.el('div', 'flash-setting', settings);
        util.el('span', '', group, name);
        util.el('span', 'flash-select', group, value);
      }
      const stage = util.el('main', 'ref-stage', editor);
      S.frameAlign(_c, stage);
      Object.assign(_c, { editor, stage });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const title = _c.body.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;
      const foot = document.querySelector('footer.ref-foot') || util.el('footer', 'ref-foot', document.body);
      if (_c.display === 'header' && _c.headerTools) {
        const footTools = foot.querySelector('.ref-tools');
        if (footTools) while (_c.headerTools.firstChild) footTools.append(_c.headerTools.firstChild);
      }
      const old = foot.querySelector('.ref-foot-text');
      if (old) old.remove();
      const tip = util.el('div', 'flash-tip-label', foot);
      util.el('span', 'flash-bulb', tip);
      util.el('span', '', tip, 'Tips');
      const list = util.el('ul', 'flash-tips', foot);
      for (const t of ['Use the line numbers to navigate quickly.', 'Press Ctrl+F to find text, Ctrl+H to replace.', 'Use Ctrl+ / to toggle a comment.', 'The minimap on the right shows an overview of your code.']) util.el('li', '', list, t);
      foot.prepend(list); foot.prepend(tip);
      util.el('span', 'vs-status-readout', foot, 'Ln 11, Col 36　 │　 UTF-8　 │　 JavaScript　 │　 Spaces: 4');
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
      const menu = util.el('div', 'vs-menubar', header);
      for (const item of ['Files','Edit','Search','View','Project','Tools','Help']) util.el('span', 'flash-menu-tab', menu, item);
      const nav = header.querySelector('.ref-nav');
      if (nav) {
        nav.classList.add('vs-navigation');
        explorer.append(nav);
      }
      Object.assign(_c, { menu, submit });
    },
  };

  env.site({
    name: 'design-use-text-editor-multiline-04',
    template: 'site/base',
    design: { parts },
  });
})();
