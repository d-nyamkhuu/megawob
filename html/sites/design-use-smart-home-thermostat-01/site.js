// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const drawIcon = (parent, name) => {
        const paths = {
          home: 'M2 10 12 2l10 8M4 8v14h16V8',
          devices: 'M9 18h6m-5 4h4M8 15C0 7 8-1 15 4c5 4 1 8-1 11v3H9v-3Z',
          automation: 'M4 5h16v17H4zM4 10h16M8 2v6m8-6v6M8 14h2m4 0h2',
          media: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM10 7l7 5-7 5Z',
          settings: 'M9 3h6l1 4 4 1v8l-4 1-1 4H9l-1-4-4-1V8l4-1 1-4M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
          search: 'M16 16l6 6M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
          music: 'M9 18V5l11-2v13M9 9l11-2M9 18c0 2-6 3-6 0s6-3 6 0m11-2c0 2-6 3-6 0s6-3 6 0',
          volume: 'M3 9h5l6-5v16l-6-5H3zM18 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14',
          expand: 'M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6',
        };
        const svg = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, parent);
        util.svg('path', { d: paths[name] }, svg);
      };
      const homeBrand = util.el('div', 'nestora-header-brand', header);
      drawIcon(util.el('span', 'nestora-mark', homeBrand), 'home');
      util.el('strong', '', homeBrand, 'Nestora');
      const homeNav = util.el('nav', 'nestora-primary-nav', header);
      for (const [icon, label] of [['home', 'Home'], ['devices', 'Devices'], ['automation', 'Automation'], ['media', 'Media'], ['settings', 'Settings']]) {
        const a = util.el('a', 'nestora-primary-link', homeNav);
        drawIcon(util.el('span', 'nestora-primary-icon', a), icon);
        util.el('span', '', a, label);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      const topSearch = util.el('div', 'nestora-top-search', header);
      drawIcon(topSearch, 'search');
      util.el('span', '', topSearch, 'Search devices, media, and more…');
      topSearch.setAttribute('aria-hidden', 'true');
      util.el('span', 'nestora-profile', header, 'J').setAttribute('aria-hidden', 'true');
      S.frameBrand(_c, header);
      Object.assign(_c, { drawIcon, header, homeBrand, homeNav, topSearch });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') {
        util.el('div', 'ref-instruction nestora-header-note', document.body, ctx.instruction);
        util.el('div', 'ref-spacer', header);
      }
      else util.el('div', 'ref-spacer', header);
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        side.remove();
      }
      let taskPanel = null;
      if (display === 'panel') {
        const panel = taskPanel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const workspace = util.el('div', 'nestora-workspace', body);
      const stage = util.el('main', 'ref-stage', workspace);
      Object.assign(_c, { body, stage, taskPanel, workspace });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, drawIcon, stage, taskPanel, util, workspace } = _c;
      S.frameAlign(_c, stage);
      const rooms = util.el('aside', 'nestora-rooms', workspace);
      util.el('h2', '', rooms, 'Rooms & Devices');
      const roomSearch = util.el('div', 'nestora-search', rooms);
      drawIcon(roomSearch, 'search');
      util.el('span', '', roomSearch, 'Search rooms or devices…');
      roomSearch.setAttribute('aria-hidden', 'true');
      const roomRows = [
        ['bed', 'Bedroom', 'Thermostat · Lights', '22°C'],
        ['sofa', 'Living Room', 'Thermostat · Lights · TV', '21°C'],
        ['kitchen', 'Kitchen', 'Lights · Smart Plug', '20°C'],
        ['screen', 'Office', 'Thermostat · Lights', '21°C'],
        ['bath', 'Bathroom', 'Lights · Smart Plug', '23°C'],
        ['door', 'Hallway', 'Lights', '21°C'],
      ];
      const roomIcon = (parent, kind) => {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.8');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        const paths = {
          bed: ['M3 18v-7h18v7', 'M3 14h18', 'M5 11V7h5a3 3 0 0 1 3 3v1', 'M3 18v2', 'M21 18v2'],
          sofa: ['M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3', 'M4 11h16a2 2 0 0 1 2 2v4H2v-4a2 2 0 0 1 2-2Z', 'M4 17v2', 'M20 17v2'],
          kitchen: ['M5 3v7', 'M2.5 3v4a2.5 2.5 0 0 0 5 0V3', 'M5 9v12', 'M15 3v18', 'M15 3c3 2 4 5 4 8h-4'],
          screen: ['M3 4h18v13H3z', 'M8 21h8', 'M12 17v4'],
          bath: ['M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z', 'M5 12V6a3 3 0 0 1 6 0', 'M7 20v1', 'M17 20v1'],
          door: ['M6 3h12v18H6z', 'M9 5h6v16H9z', 'M13 13h.01'],
        }[kind];
        for (const d of paths) { const path = document.createElementNS(ns, 'path'); path.setAttribute('d', d); svg.appendChild(path); }
        parent.appendChild(svg);
      };
      roomRows.forEach((row, i) => {
        const item = util.el('div', `nestora-room${i === 0 ? ' active' : ''}`, rooms);
        const icon = util.el('span', 'nestora-room-icon', item);
        roomIcon(icon, row[0]);
        const copy = util.el('span', 'nestora-room-copy', item);
        util.el('strong', '', copy, row[1]);
        util.el('small', '', copy, row[2]);
        util.el('span', 'nestora-room-temp', item, row[3]);
        util.el('span', 'nestora-chevron', item, '›');
      });
      if (taskPanel) workspace.appendChild(taskPanel);
      const companions = util.el('div', 'nestora-companions', body);
      const lights = util.el('section', 'nestora-card nestora-lights', companions);
      const lightsTitle = util.el('h3', '', lights);
      drawIcon(lightsTitle, 'devices');
      util.el('span', '', lightsTitle, 'Living Room Lights');
      const lightControl = util.el('div', 'nestora-light-control', lights);
      util.el('div', 'nestora-color-wheel', lightControl);
      const lightRight = util.el('div', 'nestora-light-right', lightControl);
      const brightness = util.el('div', 'nestora-brightness', lightRight);
      util.el('span', '', brightness, '☼');
      util.el('div', 'nestora-brightness-track', brightness);
      util.el('span', '', brightness, '75%');
      const swatches = util.el('div', 'nestora-swatches', lightRight);
      for (const color of ['#fffaf0', '#ffebbb', '#71c6ff', '#32e49b', '#c93df5']) util.el('span', '', swatches).style.background = color;
      const queue = util.el('section', 'nestora-card nestora-queue', companions);
      const queueTitle = util.el('h3', '', queue);
      drawIcon(queueTitle, 'music');
      util.el('span', '', queueTitle, 'Music Queue');
      util.el('a', 'nestora-seeall', queue, 'See All');
      [['Morning Light', 'The Hollow Trees', '3:24'], ['Coastal Drive', 'Azure Fields', '4:12'],
       ['Maple Sky', 'Lenora', '3:58'], ['Falling Forward', 'The Prismatics', '4:01']].forEach((song, i) => {
        const item = util.el('div', 'nestora-song', queue);
        util.el('span', 'nestora-grip', item, '⠿');
        util.el('span', 'nestora-song-num', item, `${i + 1}`);
        util.el('span', `nestora-album album-${i}`, item);
        const info = util.el('span', 'nestora-song-info', item);
        util.el('strong', '', info, song[0]);
        util.el('small', '', info, song[1]);
        util.el('span', 'nestora-song-time', item, song[2]);
      });
      const video = util.el('section', 'nestora-card nestora-video', companions);
      const videoTitle = util.el('h3', '', video);
      drawIcon(videoTitle, 'media');
      util.el('span', '', videoTitle, 'Video');
      const player = util.el('div', 'nestora-player', video);
      util.el('strong', '', player, 'The Quiet Path');
      util.el('small', '', player, 'S1 E3 · 28:17');
      util.el('span', 'nestora-play', player, '▶');
      util.el('div', 'nestora-progress', player);
      const videoControls = util.el('div', 'nestora-video-controls', player);
      util.el('span', 'nestora-video-time', videoControls, '06:32 / 28:17');
      drawIcon(videoControls, 'volume');
      util.el('span', 'nestora-captions-icon', videoControls, 'CC');
      drawIcon(videoControls, 'expand');
      Object.assign(_c, { brightness, companions, lightControl, lightRight, lights, lightsTitle, player, queue, queueTitle, roomIcon, roomRows, roomSearch, rooms, swatches, video, videoControls, videoTitle });
    },
    'frame.footer': (base, S) => function (_c) {
      const { body, collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        const footerCopy = word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText;
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        if (!tools.childElementCount) foot.remove();
      }
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        const foot = body.parentElement.querySelector('.ref-foot');
        if (foot) {
          for (const control of Array.from(foot.querySelector('.ref-tools').children)) dock.appendChild(control);
          foot.remove();
        }
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      Object.assign(_c, { submit });
    },
    'frame.panel': (base, S) => function (_c) {
    },
    'frame.floating': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-smart-home-thermostat-01',
    template: 'site/base',
    design: { parts },
  });
})();
