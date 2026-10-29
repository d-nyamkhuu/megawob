// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function stationeryIcon(kind) {
    const paths = {
      paper: '<path d="M5 2h9l5 5v15H5zM14 2v5h5M8 11h8M8 15h8"/>',
      box: '<path d="m3 7 9-5 9 5v11l-9 5-9-5zM3 7l9 5 9-5M12 12v11M8 4l9 5"/>',
      cart: '<path d="M2 3h4l3 13h12l2-10H7M10 20h.1M20 20h.1"/>',
      truck: '<path d="M2 5h13v13H2zM15 10h4l4 5v3h-8M6 18a2 2 0 1 0 .1 0M18 18a2 2 0 1 0 .1 0"/>',
      check: '<circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 6-7"/>',
      back: '<path d="m8 4-6 6 6 6M3 10h12a7 7 0 0 1 0 14"/>',
      gear: '<path d="m9 2 6 0 1 4 4 1 2 5-3 3 0 4-5 3-3-3-4 0-3-5 2-4z"/><circle cx="12" cy="12" r="3"/>',
      clipboard: '<path d="M7 4H4v18h16V4h-3M8 2h8v5H8zM7 11h10M7 15h10M7 19h7"/>',
      people:
        '<circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2zM17 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6"/>',
      chart: '<path d="M3 21h19M5 18h4V9H5zM11 18h4V4h-4zM17 18h4v-6h-4z"/>',
      folder: '<path d="M2 6h8l2 3h10v12H2z"/>',
      building: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M8 10h2m4 0h2"/>',
      list: '<path d="M8 5h13M8 12h13M8 19h13"/><circle cx="3.5" cy="5" r=".8"/><circle cx="3.5" cy="12" r=".8"/><circle cx="3.5" cy="19" r=".8"/>',
      warning: '<path d="M12 3 2 21h20zM12 9v5m0 3v1"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
      archive: '<path d="M3 4h18v5H3zM5 9v12h14V9M9 13h6"/>',
      book: '<path d="M2 5q5-3 10 1 5-4 10-1v15q-5-2-10 2-5-4-10-2zM12 6v16"/>',
      window: '<path d="M2 3h20v18H2zM2 8h20M5 5.5h1m3 0h1"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[kind] || paths.paper}</svg>`;
  }

  const parts = {
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, display, header, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const headerControls = [...header.querySelectorAll('.ref-submit, .ref-xtra, .ref-endlink')];
        header.replaceChildren(...headerControls);
        header.className = 'ref-task window-title';
        if (display === 'header') util.el('div', 'ref-instruction app-header-note', header, ctx.instruction);
        for (const child of [...body.children]) if (child !== stage) child.remove();
        body.classList.add('inventory-layout');
        const leftRail = util.el('aside', 'inventory-rail', body);
        const brand = util.el('div', 'brand', leftRail);
        const logo = util.el('span', 'brand-mark', brand);
        logo.innerHTML = stationeryIcon('box');
        util.el('strong', '', brand, 'Acme Supply');
        const nav = util.el('nav', 'side-nav', leftRail);
        for (const [icon, label, active] of [['cart','Orders',true],['box','Inventory'],['people','Customers'],['chart','Reports']]) {
          const item = util.el('div', `rail-item${active ? ' selected' : ''}`, nav);
          const glyph = util.el('span', 'rail-icon', item); glyph.innerHTML = stationeryIcon(icon);
          util.el('span', '', item, label);
        }
        util.el('h2', 'stats-heading', leftRail, 'Quick Stats');
        for (const [icon,title,value,trend,up] of [
          ['paper','Total Orders','1,482','+12%',true],['truck','Pending Shipment','246','+8%',false],
          ['check','Delivered (30d)','1,012','+16%',true],['back','Returns (30d)','34','+3%',false],
        ]) {
          const stat = util.el('div','stat-card',leftRail);
          const glyph = util.el('span','stat-icon',stat); glyph.innerHTML = stationeryIcon(icon);
          const copy = util.el('div','stat-copy',stat); util.el('span','',copy,title); util.el('strong','',copy,value);
          util.el('span',`stat-trend ${up?'positive':'negative'}`,stat,`${up?'▲':'▲'} ${trend}`);
        }
        body.insertBefore(leftRail, stage);
        const dock = util.el('nav','bottom-dock',body);
        for (const [icon,label,active] of [['cart','Orders',true],['box','Inventory'],['people','Customers'],['chart','Reports'],['gear','Settings']]) {
          const item = util.el('div',`dock-item${active?' active':''}`,dock);
          const glyph = util.el('span','dock-icon',item); glyph.innerHTML = stationeryIcon(icon); util.el('span','',item,label);
        }
        if (display === 'panel') {
          const note = util.el('aside','inventory-task-note',body); util.el('strong','',note,'Your task'); util.el('div','',note,ctx.instruction);
          body.insertBefore(note,stage);
        }
        Object.assign(_c, { leftRail, stage });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          const floatDock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(floatDock, 'ref-submit ref-float', label);
        }
        const appFooter = util.el('footer','ref-foot',document.body);
        if (placement === 'footer') submit = endBtn(appFooter,'ref-submit',label);
        else if (placement === 'link') submit = endBtn(appFooter,'ref-endlink',`${label} ›`);
        Object.assign(_c, { appFooter, submit });
      },
  };

  env.site({
    name: 'design-use-data-grid-multirow-05',
    template: 'site/base',
    design: { parts },
  });
})();
