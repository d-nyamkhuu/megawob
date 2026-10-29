// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const win = util.el('div', 'human-window', document.body);
        const titlebar = util.el('header', 'human-titlebar', win);
        util.el('span', 'human-acorn', titlebar, '●');
        util.el('strong', 'human-appname', titlebar, 'Acorn Services');
        const wincontrols = util.el('div', 'human-window-controls', titlebar);
        for (const [t, c] of [
          ['−', 'min'],
          ['▣', 'max'],
          ['×', 'close'],
        ])
          util.el('span', `human-winbtn ${c}`, wincontrols, t);
        const header = util.el('div', 'ref-task human-menubar', win);
        for (const item of ['File', 'Edit', 'View', 'Help']) util.el('span', 'human-menuitem', header, item);
        S.frameBrand(_c, header);
        Object.assign(_c, { header, titlebar, win, wincontrols });
      },
    'frame.nav': (base, S) =>
      function (_c) {
        const { content, header, local, nav, rng, util } = _c;
        const { K } = S;
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const tabs = util.el('nav', 'portal-tabs', header);
        Object.assign(_c, { tabs });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util, win } = _c;
        const body = util.el('div', 'ref-body', win);
        const directory = util.el('aside', 'portal-directory', body);
        const sidehead = util.el('div', 'human-sidehead', directory);
        util.el('strong', '', sidehead, 'Accounts');
        const add = util.el('button', 'human-add', sidehead, '✚  New Account');
        add.type = 'button';
        const records = [
          ['Naomi Kobayashi', 'naomi@kanaal-media.nl', '🟠'],
          ['Lukas Weber', 'lukas@weber-net.de', '🔵'],
          ['Sophie Martin', 'sophie.martin@cadence.fr', '🟢'],
          ['Daniel Rossi', 'd.rossi@libero.it', '🟡'],
          ['Marta Silva', 'marta@silva.pt', '🟣'],
          ['Johan Svensson', 'johan@svensson.se', '🔵'],
          ['Elena Petrova', 'e.petrova@northwind.ru', '🔴'],
          ['Thomas Nguyen', 'thomas@nguyen.vn', '🟦'],
        ];
        const list = util.el('div', 'human-account-list', directory);
        for (let i = 0; i < records.length; i++) {
          const row = util.el('div', `human-account${i === 0 ? ' selected' : ''}`, list);
          util.el('span', 'human-person', row, records[i][2]);
          const info = util.el('span', 'human-account-info', row);
          util.el('span', '', info, records[i][0]);
          util.el('small', '', info, records[i][1]);
        }
        S.frameSidebar(_c, directory);
        Object.assign(_c, { add, body, directory, list, records, sidehead });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        Object.assign(_c, { stage });
      },
    'frame.panel': (base) =>
      function (_c) {
        base(_c);
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) _c.directory.insertBefore(panel, _c.list);
      },
    'frame.toast': (base) =>
      function (_c) {
        base(_c);
        const note = document.body.querySelector(':scope > .ref-note');
        if (note) _c.directory.insertBefore(note, _c.list);
      },
    'frame.footer': (base) =>
      function (_c) {
        base(_c);
        const foot = document.body.querySelector(':scope > .ref-foot');
        if (foot) _c.win.append(foot);
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util, win } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', win);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const dock = util.el('nav', 'human-dock', win);
        for (const [icon, label, active] of [
          ['♟', 'Accounts', true],
          ['✉', 'Mail'],
          ['▦', 'Calendar'],
          ['▣', 'Contacts'],
          ['☑', 'Tasks'],
        ]) {
          const item = util.el('div', `human-dockitem${active ? ' active' : ''}`, dock);
          util.el('span', 'human-dockicon', item, icon);
          util.el('span', '', item, label);
        }
        Object.assign(_c, { dock, submit });
      },
  };

  env.site({
    name: 'design-complete-wizard-signup-02',
    template: 'site/base',
    design: { parts },
  });
})();
