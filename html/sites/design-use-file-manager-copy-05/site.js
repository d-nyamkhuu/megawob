// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Reference'];

  function recentArtwork(kind) {
    const folder = '<path d="M5 15h14l5 5h26v29H5z" fill="#119cff"/><path d="M5 20h45v29H5z" fill="#36b2ff"/><path d="M6 16h13l5 5H6z" fill="#6bc8ff"/>';
    const symbols = {
      PDF: '<rect x="14" y="17" width="26" height="29" rx="3" fill="#f32622"/><path d="M20 38c9-6 10-19 8-15-2 4 1 13 7 12-9-3-17 9-15 3" fill="none" stroke="white" stroke-width="1.8"/>',
      GIF: '<rect x="13" y="19" width="29" height="23" rx="3" fill="#56c6ae"/><circle cx="24" cy="26" r="5" fill="#ffd151"/><path d="m13 36 10-10 9 8 5-5 5 9v4H13" fill="#1795c9"/><text x="27" y="51" text-anchor="middle" fill="#778092" font-size="7" font-weight="700">GIF</text>',
      IMG: '<rect x="14" y="20" width="27" height="25" rx="3" fill="#67c4ff"/><circle cx="32" cy="27" r="4" fill="#b6e9ff"/><path d="m15 40 8-12 6 8 5-5 7 12v2H15" fill="#2387ea"/>',
      DOC: '<rect x="19" y="18" width="23" height="30" rx="2" fill="#3290e8"/><path d="M24 24h14m-14 5h14m-14 5h14m-14 5h14" stroke="#c8e4ff" stroke-width="2"/><rect x="10" y="24" width="22" height="21" rx="2" fill="#1466bd"/><text x="21" y="39" text-anchor="middle" fill="white" font-size="14" font-family="Arial" font-weight="bold">W</text>',
      PPT: '<circle cx="30" cy="33" r="15" fill="#f2815b"/><path d="M30 18v15h15a15 15 0 0 0-15-15" fill="#dc5028"/><rect x="9" y="24" width="22" height="21" rx="2" fill="#c64520"/><text x="20" y="39" text-anchor="middle" fill="white" font-size="14" font-family="Arial" font-weight="bold">P</text>',
      XLS: '<rect x="20" y="18" width="23" height="30" rx="2" fill="#28a572"/><path d="M24 23h15m-15 6h15m-15 6h15m-15 6h15m-10-18v18m5-18v18" stroke="#bce8d3" stroke-width="1"/><rect x="9" y="25" width="22" height="21" rx="2" fill="#087948"/><text x="20" y="40" text-anchor="middle" fill="white" font-size="14" font-family="Arial" font-weight="bold">X</text>'
    };
    return '<svg viewBox="0 0 55 62" aria-hidden="true">' + (kind === 'DIR' ? folder : '<path d="M10 5h25l12 13v37H10z" fill="#fff" stroke="#dce3e9"/><path d="M35 5v13h12" fill="#ebeff3"/>' + symbols[kind]) + '</svg>';
  }

  const parts = {
    'frame.header': (base) => function (_c) {
      base(_c);
      const { ctx, display, header, util, W } = _c;
      const compact = W < 1450;
      const lineWidth = Math.max(60, Math.floor((W * .96 - 80) / 7.2));
      const noteHeight = display === 'header' ? Math.max(44, Math.ceil(ctx.instruction.length / lineWidth) * 20 + 16) : 0;
      document.body.classList.toggle('glass-compact', compact);
      document.body.style.setProperty('--app-header', (compact ? 108 : 72) + noteHeight + 'px');
      document.body.style.setProperty('--note-height', noteHeight + 'px');
      let brand = header.querySelector('.ref-brand');
      if (!brand) brand = util.el('div', 'ref-brand', header);
      brand.replaceChildren();
      const lights = util.el('div', 'glass-lights', brand);
      for (const tone of ['red', 'yellow', 'green']) util.el('span', 'glass-light ' + tone, lights);
      const tab = util.el('div', 'glass-title-tab', brand);
      util.el('span', 'glass-title-icon', tab);
      util.el('span', 'glass-folder-name', tab, 'Reference');
      util.el('div', 'glass-navigation', header);
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel && _c.side) _c.side.prepend(panel);
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note && _c.side) _c.side.appendChild(note);
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.header.appendChild(dock);
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      // Keep the shared frame's seeded navigation draw while drawing the recent index.
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      const side = util.el('aside', 'ref-side gnome-rail', body);
      const recentList = util.el('div', 'recent-list', side);
      const railItems = [
        ['Kalliope_Leaverequest_Q4.gif', 'Reference · 10:24 AM', 'GIF'],
        ['Campaign_Plan_Q4.pdf', 'Reference · 9:18 AM', 'PDF'],
        ['Cedar_Vale_BrandGuide.pdf', 'Reference · Yesterday', 'PDF'],
        ['Kalliope_Hero.png', 'Assets · Yesterday', 'IMG'],
        ['Client - Cedar Vale', 'Languages · Yesterday', 'DIR'],
        ['Q4_Messaging.docx', 'Docs · Oct 14, 2025', 'DOC'],
        ['Product_Shots', 'Assets · Oct 14, 2025', 'DIR'],
        ['Cedar Vale Logo.png', 'Logos · Oct 13, 2025', 'IMG'],
        ['Release_Notes_Q4.pdf', 'Docs · Oct 13, 2025', 'PDF'],
        ['Staging', 'Marketing · Oct 10, 2025', 'DIR'],
        ['Kalliope_Overview.pptx', 'Presentations · Oct 9, 2025', 'PPT'],
        ['Timeline_Q4.xlsx', 'Docs · Oct 8, 2025', 'XLS'],
      ];
      for (const [item, meta, kind] of railItems) {
        const a = util.el('a', 'ref-sidelink recent-file', recentList);
        a.dataset.role = 'nav';
        const icon = util.el('span', 'recent-icon recent-' + kind.toLowerCase(), a);
        icon.innerHTML = recentArtwork(kind);
        const text = util.el('span', 'recent-copy', a);
        util.el('span', 'recent-name', text, item);
        util.el('span', 'recent-meta', text, meta);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
      }
      Object.assign(_c, { body, railItems, side });
    },
  };

  env.site({
    name: 'design-use-file-manager-copy-05',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
