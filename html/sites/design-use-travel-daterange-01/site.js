// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const frameIcon = (parent, name) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true'); svg.classList.add('gtk-svg');
        const paths = {
          globe: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M2 12h20', 'M12 2c3 3 3 17 0 20', 'M12 2c-3 3-3 17 0 20'],
          plane: ['M2 16l8-3 2-10 2-1 2 10 6 2v2l-7-1-2 5-2 1-1-6-8-1Z'],
          bed: ['M3 18V6h2v6h14a2 2 0 0 1 2 2v4h-2v-2H5v2H3Z', 'M7 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M10 8h7a2 2 0 0 1 2 2v2H10V8Z'],
          car: ['M4 11l2-5h12l2 5 2 2v5h-2v2h-2v-2H6v2H4v-2H2v-5l2-2Z', 'M7 8l-1 3h12l-1-3H7Z', 'M6 14h2', 'M16 14h2'],
          bag: ['M3 8h18v13H3z', 'M8 8V4h8v4'],
          user: ['M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2', 'M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'],
        }[name] || [];
        for (const d of paths) { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); svg.append(p); }
        parent.append(svg); return svg;
      };
      const titlebar = util.el('div', 'gtk-titlebar', document.body);
      const appicon = util.el('span', 'gtk-globe', titlebar);
      frameIcon(appicon, 'globe');
      util.el('strong', 'gtk-title', titlebar, 'GlobeTrek Travel');
      const win = util.el('div', 'gtk-window-buttons', titlebar);
      for (const [label, glyph, cls] of [['Minimize', '−', ''], ['Maximize', '□', ''], ['Close', '×', 'close']]) {
        const b = util.el('button', `gtk-winbtn ${cls}`, win, glyph);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Bookings', 'Tools', 'Help']) util.el('span', '', menubar, label);
      const tabbar = util.el('nav', 'gtk-tabs', document.body);
      for (const [label, icon, active] of [['Flights', 'plane', false], ['Hotels', 'bed', true], ['Cars', 'car', false], ['My Itinerary', 'bag', false]]) {
        const tab = util.el('button', `gtk-tab${active ? ' active' : ''}`, tabbar);
        tab.type = 'button'; frameIcon(tab, icon); util.el('span', '', tab, label);
        tab.addEventListener('click', () => env.log('decoy', { what: 'tab', label }));
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appicon, frameIcon, header, menubar, tabbar, titlebar, win });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, menubar, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      menubar.append(headerTools);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, frameIcon, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const summary = util.el('aside', 'gtk-summary', body);
      const summaryTitle = util.el('div', 'gtk-summary-title', summary);
      frameIcon(summaryTitle, 'bag');
      util.el('strong', '', summaryTitle, 'Your Itinerary');
      const passengers = util.el('section', 'gtk-summary-passengers', summary);
      const passengerTitle = util.el('strong', 'gtk-passenger-title', passengers);
      frameIcon(passengerTitle, 'user');
      util.el('span', '', passengerTitle, 'Passengers');
      const passengerRow = util.el('div', 'gtk-passenger-row', passengers);
      frameIcon(passengerRow, 'user');
      util.el('span', '', passengerRow, 'Louis Leroy');
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) summary.append(taskPanel);
      for (const [icon, label] of [['plane', 'Flights'], ['bed', 'Hotels'], ['car', 'Cars']]) {
        const row = util.el('div', 'gtk-count-row', summary);
        frameIcon(row, icon); util.el('strong', '', row, label); util.el('span', 'gtk-count', row, '0');
      }
      Object.assign(_c, { passengerRow, passengerTitle, passengers, stage, summary, summaryTitle, taskPanel });
    },
  };

  env.site({
    name: 'design-use-travel-daterange-01',
    template: 'site/base',
    design: { parts },
  });
})();
