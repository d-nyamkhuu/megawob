// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const TITLES = ['Countries'];

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        rng.bool(0.35);
        const sidebar = true;
        rng.bool(0.5);
        const nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        const gadgets = util.el('div', 'risc-window-gadgets', header);
        for (const [kind, symbol] of [
          ['min', '−'],
          ['max', '□'],
          ['close', '×'],
        ]) {
          util.el('span', `risc-window-gadget risc-gadget-${kind}`, gadgets, symbol);
        }
        if (display !== 'header' || nav || display === 'header') {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'DataHub');
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { gadgets, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util, header } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        const menu = util.el('nav', 'dh-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, item);
        const toolbar = util.el('div', 'dh-toolbar', document.body);
        for (const [icon, label] of [['▯', 'New Report'], ['▱', 'Open'], ['▤', 'Add Data'], ['⟳', 'Refresh'], ['▷', 'Preview']]) {
          const button = util.el('div', 'dh-tool', toolbar);
          util.el('span', 'dh-tool-icon', button, icon);
          util.el('span', '', button, label);
        }
        const actionTools = header.querySelector('.ref-tools');
        if (actionTools) toolbar.appendChild(actionTools);
        document.body.insertBefore(menu, body);
        document.body.insertBefore(toolbar, body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          for (const item of ['Home', 'Reports', 'Data Sources', 'Contacts', 'Settings']) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.classList.toggle('is-active', item === 'Reports');
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
        }
        Object.assign(_c, { body });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        base(_c);
        const { util } = _c;
        const body = document.querySelector('.ref-body');
        const inspector = util.el('section', 'dh-inspector', body);
        util.el('div', 'dh-inspector-icon', inspector, '▤');
        const detail = util.el('div', 'dh-inspector-detail', inspector);
        const lists = document.querySelectorAll('.ref-stage [role="listbox"]');
        const listText = lists[1] ? lists[1].textContent : '';
        const name = listText.split(/\n+/).map((value) => value.trim()).find(Boolean) || 'Column details';
        util.el('strong', '', detail, name);
        util.el('div', 'dh-inspector-description', detail, `Shows the ${name.toLowerCase()} value for this report column.`);
        const metadata = util.el('div', 'dh-inspector-meta', inspector);
        for (const [key, value] of [['Column type', 'Text'], ['Source field', name.toLowerCase().replace(/[^a-z0-9]+/g, '_')], ['Included in report', 'Yes']]) {
          const row = util.el('div', '', metadata);
          util.el('span', '', row, key);
          util.el('b', '', row, value);
        }
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const iconbar = util.el('nav', 'risc-iconbar', document.body);
        const dockItems = [
          ['berry', ''],
          ['files', 'Files'],
          ['apps', 'Applications'],
          ['settings', 'Settings'],
          ['world', 'World'],
          ['help', 'Help'],
        ];
        const artwork = {
          berry:
            '<svg viewBox="0 0 40 40"><path fill="#398b32" d="M12 9 7 3l10 3 3 4 4-5 10-2-6 8z"/><g fill="#e51e25" stroke="#781014" stroke-width="1"><circle cx="14" cy="17" r="7"/><circle cx="25" cy="17" r="7"/><circle cx="19" cy="25" r="8"/><circle cx="13" cy="30" r="5"/><circle cx="26" cy="30" r="5"/></g><g fill="#ffe15a"><circle cx="12" cy="16" r="1"/><circle cx="25" cy="15" r="1"/><circle cx="18" cy="23" r="1"/></g></svg>',
          files:
            '<svg viewBox="0 0 40 40"><path fill="#ffdc42" stroke="#40391d" stroke-width="2" d="M4 10h13l4 5h15v20H4z"/><path fill="#ffe987" stroke="#40391d" stroke-width="2" d="M5 15h31l-4 20H4z"/></svg>',
          apps: '<svg viewBox="0 0 40 40"><path fill="#d8e7ff" stroke="#29384d" stroke-width="2" d="m5 12 15-8 15 8v19l-15 6-15-6z"/><path fill="#fff" stroke="#29384d" stroke-width="2" d="m5 12 15 8 15-8M20 20v17"/><path fill="#e8bd26" d="m14 23 2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z"/></svg>',
          settings:
            '<svg viewBox="0 0 40 40"><g stroke="#222" stroke-width="4" stroke-linecap="round"><path d="m8 8 24 24M32 8 8 32"/></g><g fill="#bbb" stroke="#222" stroke-width="2"><circle cx="8" cy="8" r="5"/><circle cx="32" cy="8" r="5"/><circle cx="8" cy="32" r="5"/><circle cx="32" cy="32" r="5"/></g></svg>',
          world:
            '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#0874be" stroke="#17436c" stroke-width="2"/><path fill="#48c937" d="M8 9 15 6l4 4-2 5 4 3-3 4-5-2-4 4-4-3 1-7zM26 7l7 3 2 6-5 2-1 6-5-2-2-6 3-3zM18 26l7-2 6 4-3 7-9 2-4-6z"/></svg>',
          help: '<svg viewBox="0 0 40 40"><path fill="#f7f7e8" stroke="#333" stroke-width="2" d="M11 5h18v30H11z"/><path fill="#5169c9" d="M15 10h10v4H15z"/><text x="20" y="30" text-anchor="middle" font-size="22" font-weight="bold" fill="#174bce">i</text></svg>',
        };
        for (const [kind, label] of dockItems) {
          const item = util.el('div', `risc-dock-item risc-${kind}${kind === 'world' ? ' is-current' : ''}`, iconbar);
          const icon = util.el('span', 'risc-dock-icon', item);
          icon.innerHTML = artwork[kind];
          if (label) util.el('span', 'risc-dock-label', item, label);
        }
        Object.assign(_c, { artwork, dockItems, iconbar, submit });
      },
  };

  env.site({
    name: 'design-transfer-items-move-05',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
