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
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Code Editor');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body vs-workspace', document.body);
      const activity = util.el('aside', 'vs-activity', body);
      activity.style.display = 'none';
      const explorer = util.el('aside', 'vs-help', body);
      explorer.style.display = 'none';
      const tabs = util.el('div', 'vs-help-tabs', explorer);
      util.el('span', 'vs-help-tab on', tabs, 'Help');
      util.el('span', 'vs-help-tab', tabs, 'Symbols');
      const pane = util.el('div', 'vs-help-pane', explorer);
      util.el('h2', '', pane, 'Indentation');
      util.el('p', '', pane, 'Indentation uses spaces to define blocks of code. In Python, a larger indent indicates a block inside a statement such as a function, for loop or if statement.');
      util.el('hr', '', pane);
      util.el('p', '', pane, 'To indent lines:');
      const u1 = util.el('ul', '', pane);
      util.el('li', '', u1, 'Select the lines, then press Tab.');
      util.el('li', '', u1, 'Each indent adds 2 spaces in this file.');
      util.el('p', '', pane, 'To unindent lines:');
      const u2 = util.el('ul', '', pane);
      util.el('li', '', u2, 'Select the lines, then press Shift+Tab.');
      util.el('li', '', u2, 'Each unindent removes 2 spaces.');
      util.el('hr', '', pane);
      util.el('p', '', pane, 'Examples:');
      util.el('pre', '', pane, 'for i in range(3):\n    print(i)');
      if (sidebar) {
        const side = util.el('aside', 'ref-side vs-navigation', pane);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      explorer.style.display = '';
      Object.assign(_c, { activity, body, explorer });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const editor = util.el('section', 'vs-editor', body);
      const wt = util.el('div', 'vs-wintitle', editor);
      for (const c of ['r', 'y', 'g']) util.el('i', 'vs-dot ' + c, wt);
      util.el('span', 'vs-wintitle-text', wt, 'fibonacci.py');
      const stage = util.el('main', 'ref-stage', editor);
      S.frameAlign(_c, stage);
      body.append(_c.explorer);
      Object.assign(_c, { editor, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;
      const foot = document.querySelector('footer.ref-foot') || util.el('footer', 'ref-foot', document.body);
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        const dock0 = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock0, 'ref-submit ref-float', label);
      }
      const menu = util.el('div', 'vs-menubar', header);
      util.el('b', 'vs-apple', menu, '');
      for (const m of ['File', 'Edit', 'View', 'Search', 'Project', 'Window', 'Help']) util.el('span', 'vs-menu', menu, m);
      util.el('span', 'vs-clock', menu, '10:24 AM');
      const dock = util.el('nav', 'vs-dock', document.body);
      for (const [i, n] of ['Editor', 'Project', 'Search', 'Source Control', 'Settings'].entries()) {
        const d = util.el('div', 'vs-dock-item' + (i === 0 ? ' on' : ''), dock);
        const ico = util.el('i', 'vs-dock-ico', d);
        const g = ['<path d="M5 2h10l5 5v15H5z" fill="#fff"/><path d="M15 2v5h5M8 11h9M8 14h9M8 17h9"/>',
          '<path d="M2 6h8l2 3h10v12H2z" fill="#7fa6e8"/><path d="M2 10h20"/>',
          '<circle cx="10" cy="10" r="7" fill="#dff0ff"/><path d="M15 15l7 7" stroke-width="4"/>',
          '<rect x="2" y="2" width="12" height="9" fill="#fff"/><rect x="10" y="12" width="12" height="9" fill="#7fa6e8"/>',
          '<circle cx="12" cy="12" r="8" fill="#9fb2de"/><circle cx="12" cy="12" r="3" fill="#fff"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>'][i];
        ico.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2a3a5a" stroke-width="1.6" stroke-linejoin="round">' + g + '</svg>';
        util.el('span', '', d, n);
      }
      const nav = header.querySelector('.ref-nav');
      if (nav) { nav.classList.add('vs-navigation'); _c.explorer.querySelector('.vs-help-pane').append(nav); }
      Object.assign(_c, { menu, submit });
    },
  };

  env.site({
    name: 'design-use-text-editor-multiline-05',
    template: 'site/base',
    design: { parts },
  });
})();
