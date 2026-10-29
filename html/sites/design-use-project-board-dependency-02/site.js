// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const TITLES = ['Product Release Planner - Q3 2024'];

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        // Native desktop menu and planner toolbar sit directly below the window title.
        const menu = util.el('nav', 'gtk-menubar', document.body);
        header.after(menu);
        for (const item of ['File', 'Edit', 'View', 'Project', 'Tasks', 'Help']) {
          const m = util.el('span', 'gtk-menu-item', menu, item);
          m.addEventListener('click', () => env.log('decoy', { what: 'menu', label: item }));
        }
        const appbar = util.el('div', 'gtk-toolbar', document.body);
        menu.after(appbar);
        const appActions = [
          [
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2h10l6 6v14H4z" fill="#fff" stroke="#222"/><path d="M14 2v6h6M7 14h10M7 17h10" fill="none" stroke="#222" stroke-width="1.5"/><path d="M18 12v7m-3.5-3.5h7" stroke="#111" stroke-width="2"/></svg>',
            'Add Task',
          ],
          [
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 10 10-10 10L2 12z" fill="#e51b23" stroke="#111"/><path d="M12 6v12M6 12h12" stroke="#fff" stroke-width="1.5"/></svg>',
            'Add Milestone',
          ],
          [
            '<svg viewBox="0 0 28 24" aria-hidden="true"><path d="M10 7 7 4a4 4 0 0 0-6 6l4 4a4 4 0 0 0 6 0l2-2M18 17l3 3a4 4 0 0 0 6-6l-4-4a4 4 0 0 0-6 0l-2 2M8 12l12 0" fill="none" stroke="#222" stroke-width="2"/></svg>',
            'Link Tasks',
          ],
          [
            '<svg viewBox="0 0 28 24" aria-hidden="true"><path d="M10 7 7 4a4 4 0 0 0-6 6l4 4a4 4 0 0 0 6 0l2-2M18 17l3 3a4 4 0 0 0 6-6l-4-4a4 4 0 0 0-6 0l-2 2" fill="none" stroke="#555" stroke-width="2"/><path d="m9 17 10-10" stroke="#c22" stroke-width="2"/></svg>',
            'Unlink',
          ],
          [
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="#fff" stroke="#222" stroke-width="2"/><path d="m15 15 7 7M10 6v8M6 10h8" stroke="#222" stroke-width="2"/></svg>',
            'Zoom In',
          ],
          [
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="#fff" stroke="#222" stroke-width="2"/><path d="m15 15 7 7M6 10h8" stroke="#222" stroke-width="2"/></svg>',
            'Zoom Out',
          ],
          [
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v17H4z" fill="#fff" stroke="#222"/><path d="M4 8h16M8 2v5m8-5v5" stroke="#c22" stroke-width="2"/><path d="M7 12h3v3H7zm6 0h3v3h-3zm-6 5h3v3H7zm6 0h3v3h-3z" fill="#2673c5"/></svg>',
            'Today',
          ],
        ];
        for (const [icon, labelText] of appActions) {
          const action = util.el('button', `gtk-tool${labelText === 'Unlink' ? ' is-disabled' : ''}`, appbar);
          action.type = 'button';
          action.dataset.role = 'xtra';
          const glyph = util.el('span', 'gtk-tool-icon', action);
          glyph.innerHTML = icon;
          util.el('span', '', action, labelText);
          action.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: labelText }));
        }
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { appActions, appbar, header, menu });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'win-rail', body);
        for (const [icon, text] of [
          [
            '<svg viewBox="0 0 32 32"><rect x="3" y="4" width="26" height="24" fill="#ddd" stroke="#111"/><path d="M7 8h18v10H7zM10 20h12M13 24h6" fill="#fff" stroke="#164e98" stroke-width="2"/><path d="m9 11 5 4 4-4" fill="none" stroke="#c22" stroke-width="2"/></svg>',
            'Plan',
          ],
          [
            '<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" fill="#f4e6a2" stroke="#111"/><path d="M4 12h24M12 4v24M20 4v24" stroke="#174b87" stroke-width="2"/><path d="M7 7h3v3H7zm10 8h3v3h-3zm4 8h3v3h-3z" fill="#d11"/></svg>',
            'Board',
          ],
          [
            '<svg viewBox="0 0 32 32"><circle cx="9" cy="10" r="5" fill="#f3ce8b" stroke="#111"/><circle cx="23" cy="10" r="5" fill="#f3ce8b" stroke="#111"/><circle cx="16" cy="6" r="5" fill="#f3ce8b" stroke="#111"/><path d="M2 27v-5a7 7 0 0 1 14 0v5zm14 0v-5a7 7 0 0 1 14 0v5z" fill="#2674bd" stroke="#111"/><path d="M9 16h14" stroke="#e5c33d" stroke-width="3"/></svg>',
            'Team',
          ],
          [
            '<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" fill="#fff" stroke="#111"/><path d="M8 24V17h4v7m3 0V11h4v13m3 0V7h4v17" fill="#31a74a" stroke="#111"/><path d="M7 27h20" stroke="#111"/></svg>',
            'Reports',
          ],
          [
            '<svg viewBox="0 0 32 32"><path d="M19 3a9 9 0 0 0-9 11L3 21l8 8 7-7a9 9 0 0 0 11-9l-6 5-6-6 5-6z" fill="#b9b5a7" stroke="#111" stroke-width="2"/><circle cx="21" cy="10" r="2" fill="#fff"/></svg>',
            'Settings',
          ],
        ]) {
          const item = util.el('div', `win-rail-item${text === 'Plan' ? ' active' : ''}`, rail);
          const glyph = util.el('span', 'win-rail-icon', item);
          glyph.innerHTML = icon;
          util.el('span', '', item, text);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rail });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, util } = _c;
        const panel = util.el('aside', 'ref-panel', body);
        util.el('div', 'ref-panel-title', panel, 'Help & Legend');
        const legend = util.el('div', 'planner-help', panel);
        util.el('b', '', legend, 'Gantt Chart');
        for (const [c, t, kind] of [
          ['#378fe3', 'Task bar (duration)', 'bar'],
          ['#151c46', 'Finish-to-start link', 'arrow'],
          ['#f18427', 'Milestone (date)', 'diamond'],
        ]) {
          const row = util.el('div', 'legend-row', legend);
          const mark = util.el('i', `legend-mark ${kind}`, row);
          mark.style.setProperty('--mark', c);
          util.el('span', '', row, t);
        }
        util.el('b', 'legend-subhead', legend, 'Delivery Board');
        for (const [c, t] of [
          ['#378fe3', 'Engineering'],
          ['#42bb42', 'Design'],
          ['#f56d72', 'Product'],
          ['#ffd21f', 'Marketing'],
          ['#9270f4', 'Support'],
        ]) {
          const row = util.el('div', 'legend-row', legend);
          const mark = util.el('i', 'legend-mark swatch', row);
          mark.style.setProperty('--mark', c);
          util.el('span', '', row, t);
        }
        util.el(
          'div',
          'legend-tip',
          legend,
          'Tip: Select a task and drag the ends to change its dates. Use Link Tasks to create finish-to-start dependencies between tasks.',
        );
        if (display === 'panel') {
          const note = util.el('div', 'legend-instruction', panel);
          util.el('b', '', note, 'Your task');
          util.el('div', '', note, ctx.instruction);
        }
        Object.assign(_c, { legend, panel });
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
        const dockbar = util.el('nav', 'gtk-dock', document.body);
        for (const [icon, text] of [
          ['▣', 'Timeline'],
          ['▦', 'Board'],
          ['♟', 'Teams'],
          ['⬟', 'Releases'],
          ['▥', 'Reports'],
        ]) {
          const tab = util.el('button', `gtk-dock-tab${text === 'Timeline' ? ' active' : ''}`, dockbar);
          tab.type = 'button';
          tab.dataset.role = 'xtra';
          util.el('span', 'gtk-dock-icon', tab, icon);
          util.el('span', '', tab, text);
          tab.addEventListener('click', () => env.log('decoy', { what: 'navigation', label: text }));
        }
        Object.assign(_c, { dockbar, submit });
      },
  };

  env.site({
    name: 'design-use-project-board-dependency-02',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
