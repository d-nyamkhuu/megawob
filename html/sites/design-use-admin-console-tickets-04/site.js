// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const glyph = (parent, path) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.7'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', path);
        svg.append(p); parent.append(svg);
      };
      const titlebar = util.el('div', 'app-titlebar', header);
      glyph(util.el('span', 'app-mark', titlebar), 'M5 13v-2a7 7 0 0 1 14 0v2M5 12H3v7h4v-7H5Zm14 0h2v7h-4v-7h2ZM19 19c0 3-3 3-6 3');
      util.el('strong', 'app-name', titlebar, 'IT Service Console');
      const search = util.el('div', 'app-search', titlebar);
      glyph(search, 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z');
      util.el('span', '', search, 'Search tickets, users, or assets...');
      glyph(util.el('span', 'app-bell', titlebar), 'M18 8a6 6 0 0 0-12 0c0 7-2 7-2 9h16c0-2-2-2-2-9M10 21h4');
      util.el('span', 'app-avatar', titlebar, 'AP');
      const menubar = util.el('nav', 'app-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Tickets', 'Reports', 'Tools', 'Help']) util.el('span', 'app-menu-item', menubar, item);
      const actionbar = util.el('div', 'app-actionbar', header);
      for (const [icon, label] of [
        ['M4 3h16v18H4zM8 7h8M8 11h5M8 15h3','New Ticket'],
        ['M3 5h7l2-2 2 2h7v13h-8l-4 3v-3H3z','Reply'],
        ['M15 21v-3a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v3M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8M19 15v6M16 18h6','Assign'],
        ['M4 2h16v20H4zM8 7h8M8 11h6M8 15h3','Add Note'],
        ['M3 12V4h8l10 10-8 8L3 12ZM7 8h.01','Tags'],
        ['m8 10 4 4 4-4','More'],
      ]) {
        const action = util.el('span', 'app-action', actionbar);
        if (label !== 'More') glyph(util.el('span', 'app-action-icon', action), icon);
        util.el('span', '', action, label);
        if (label === 'More') glyph(util.el('span', 'app-action-icon', action), icon);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { actionbar, glyph, header, menubar, search, titlebar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, ctx, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      // The routing legend uses the episode's own wording in every display mode.
      stage.ticketInstruction = ctx.instruction;
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, root, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      root.style.setProperty('--desk-header-height', `${header.getBoundingClientRect().height}px`);
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-admin-console-tickets-04',
    template: 'site/base',
    design: { parts },
  });
})();
