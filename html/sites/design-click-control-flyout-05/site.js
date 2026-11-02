// Design on templates/site/ui-click-hover-menu-01.js: GTK Clearlooks inventory window with a floating dialog.
(function () {
  'use strict';
  const ROWS = [
    ['Acoustic Guitar', 'Guitars', 'Yamaha', '$299.00', '12'], ['Electric Guitar', 'Guitars', 'Fender', '$499.00', '8'],
    ['Classical Guitar', 'Guitars', 'Cordoba', '$329.00', '6'], ['Bass Guitar', 'Guitars', 'Ibanez', '$449.00', '3'],
    ['Drum Sticks', 'Drums', 'Vic Firth', '$199.00', '15'], ['Snare Drum', 'Drums', 'Pearl', '$899.00', '4'],
    ['Keyboard', 'Keyboards', 'Casio', '$129.00', '20'], ['Digital Piano', 'Keyboards', 'Roland', '$349.00', '7'],
    ['Microphone', 'Live Sound', 'Shure', '$549.00', '5'], ['Mixer', 'Live Sound', 'Behringer', '$1,099.00', '3'],
    ['Speaker', 'Live Sound', 'JBL', '$249.00', '9'], ['Guitar Strap', 'Accessories', 'Fender', '$379.00', '6'],
    ['Tuner', 'Accessories', 'Korg', '$89.00', '18'], ['Guitar Cable', 'Accessories', 'Planet Waves', '$219.00', '11'],
    ['Drum Throne', 'Drums', 'Gibraltar', '$599.00', '4'], ['Music Stand', 'Accessories', 'Hercules', '$199.00', '10'],
    ['Headphones', 'Live Sound', 'Sony', '$199.00', '8'], ['Violin', 'Strings', 'Yamaha', '$449.00', '5'],
    ['Cello', 'Strings', 'Stentor', '$899.00', '2'], ['Trumpet', 'Brass', 'Bach', '$499.00', '4'],
    ['Trombone', 'Brass', 'Conn', '$349.00', '6'], ['Clarinet', 'Woodwinds', 'Buffet', '$299.00', '7'],
    ['Flute', 'Woodwinds', 'Gemeinhardt', '$279.00', '3'],
  ];
  const RECENT = [
    ['Drum Sticks', 'Drums', '$12.99'], ['Microphone', 'Live Sound', '$89.00'], ['Keyboard Stand', 'Keyboards', '$49.00'],
    ['Acoustic Guitar Strings', 'Accessories', '$7.99'], ['Electric Guitar', 'Guitars', '$499.00'],
    ['Guitar Strap', 'Accessories', '$19.99'], ['Bass Guitar', 'Basses', '$349.00'], ['Keyboard', 'Keyboards', '$299.00'],
    ['Guitar Tuner', 'Accessories', '$24.99'], ['Drum Throne', 'Drums', '$89.00'],
  ];
  // Reference pixel box (1672x941) of the dialog window.
  const DX = 201, DY = 207, DW = 1270, DH = 615;
  const place = (el, x, y, w, h) => {
    el.style.left = ((x - DX) / DW * 100) + '%';
    el.style.top = ((y - DY) / DH * 100) + '%';
    if (w) el.style.width = (w / DW * 100) + '%';
    if (h) el.style.height = (h / DH * 100) + '%';
  };
  const controls = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';

  env.site({
    name: 'design-click-control-flyout-05',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Melody Lane Music Store - Inventory',
        'theme': 'gtk',
        'layout': 'tool',
        'tools': 'x',
        'foot': 'A|B|C|D',
      },
      parts: {
        'frame.7': (base, S) => function (_c) {
          _c.u.el('div', 'tools', _c.head);
        },
        'frame.8': (base, S) => function (_c) {
          const u = _c.u;
          const tbl = u.el('section', 'inv', _c.shell);
          const head = u.el('div', 'inv-row inv-head', tbl);
          ['Name', 'Category', 'Brand', 'Price', 'In Stock'].forEach((h) => u.el('span', '', head, h));
          ROWS.forEach((r) => {
            const row = u.el('div', 'inv-row', tbl);
            r.forEach((c) => u.el('span', '', row, c));
          });
          const dlg = u.el('section', 'dlg', _c.shell);
          const tb = u.el('div', 'dlg-title', dlg, 'Add New Item');
          u.el('span', 'window-controls', tb).innerHTML = controls;
          const lab = (t, y) => place(u.el('span', 'dlg-lab', dlg, t), 229, y - 14, 140, 28);
          lab('Department:', 304); lab('Name:', 367); lab('Brand:', 426); lab('Model:', 483);
          lab('Price:', 544); lab('In Stock:', 607); lab('Description:', 667);
          [[346, 'dlg-in'], [404, 'dlg-in'], [463, 'dlg-in']].forEach(([y, c]) => place(u.el('span', c, dlg), 376, y, 434, 42));
          place(u.el('span', 'dlg-in dlg-dollar', dlg, '$'), 376, 523, 270, 42);
          place(u.el('span', 'dlg-in dlg-spin', dlg, '0'), 376, 586, 114, 42);
          place(u.el('span', 'dlg-in dlg-area', dlg), 376, 649, 434, 145);
          place(u.el('span', 'dlg-sep', dlg), 836, 268, 1, 538);
          place(u.el('span', 'dlg-h', dlg, 'Recent Items'), 857, 278, 300, 30);
          const rt = u.el('div', 'dlg-tbl', dlg);
          place(rt, 857, 313, 590, 458);
          const rh = u.el('div', 'dlg-trow dlg-thead', rt);
          ['Name', 'Category', 'Price'].forEach((h) => u.el('span', '', rh, h));
          RECENT.forEach((r) => {
            const rr = u.el('div', 'dlg-trow', rt);
            r.forEach((c) => u.el('span', '', rr, c));
          });
          u.el('div', 'dlg-trow', rt).innerHTML = '<span></span><span></span><span></span>';
        },
        'frame.22': (base, S) => function (_c) {
          if (_c.ctx.display === 'panel') _c.shell.appendChild(_c.note);
        },
      },
    },
  });
})();
