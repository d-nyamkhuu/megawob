// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo' || kind === 'chat')
          util.el('div', 'win-overlay-title', box, kind === 'promo' ? 'Home & Media Console' : 'Help');
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.dataset.display = display;
        const classicIcon = (parent, name) => {
          const svg = util.svg(
            'svg',
            {
              viewBox: '0 0 32 32',
              class: 'win-icon',
              'aria-hidden': 'true',
              stroke: '#111',
              'stroke-width': 1.6,
              'stroke-linejoin': 'round',
            },
            parent,
          );
          const shapes = {
            home: '<path fill="#ffe136" d="M5 14h22v15H5z"/><path fill="#df8c24" d="m2 15 14-13 14 13h-5L16 7l-9 8z"/><path fill="#fff" d="M8 16h6v6H8z"/><path fill="#985413" d="M18 19h6v10h-6z"/><path fill="#aaa" d="M22 3h4v8l-4-4z"/>',
            room: '<path fill="#1235d9" d="M6 5h20v14H6z"/><path fill="#4288ff" d="M7 7h17v12H7z"/><path fill="#1549e8" d="M3 17h6v6h14v-6h6v11H3z"/><path fill="#aaa" d="M5 28h3v3H5zm19 0h3v3h-3z"/>',
            bulb: '<path fill="#ffff9c" d="M16 2C5 2 3 13 10 20l2 6h8l2-6C29 13 27 2 16 2Z"/><path fill="#ccc" d="M12 24h8v5h-8z"/><path d="M12 26h8m-8 2h8m-6 3h4"/><path fill="none" stroke="#fff" stroke-width="3" d="M9 12q0-6 6-6"/>',
            music:
              '<path fill="#aa33df" d="M13 4 27 1v21c-1 7-13 6-10 0 1-3 4-4 6-3V8l-6 2v15c-1 7-13 6-10 0 1-3 4-4 6-3z"/><path fill="none" stroke="#edbfff" d="m16 5 8-2v3l-8 2"/>',
            calendar:
              '<path fill="#fff" d="M3 4h26v26H3z"/><path fill="#df3020" d="M3 4h26v5H3z"/><path stroke="#000080" stroke-width="3" d="M7 13h3m3 0h3m3 0h3m3 0h1M7 18h3m3 0h3m3 0h3m3 0h1M7 23h3m3 0h3m3 0h3"/><path d="M8 2v5m8-5v5m8-5v5"/>',
            refresh:
              '<path fill="#16b858" d="M27 4v10H17l4-4C12 3 5 11 7 17H2C-1 5 14-2 24 6zM5 28V18h10l-4 4c9 7 16-1 14-7h5c3 12-12 19-22 11z"/>',
            sun: '<circle fill="#ffff00" cx="16" cy="16" r="8"/><path stroke="#ffe600" stroke-width="2" d="M16 1v4m0 22v4M1 16h4m22 0h4M5 5l3 3m16 16 3 3M5 27l3-3M24 8l3-3"/>',
            cup: '<path fill="#fff" d="M5 6h19v4H5z"/><path fill="#1759ef" d="M5 10h19v14H8z"/><path fill="none" stroke="#111" stroke-width="3" d="M24 10c10-3 9 13 0 11M4 27h23"/><path stroke="#91bbff" d="M9 12v9"/>',
            bed: '<path fill="#dfb746" d="M2 4h3v25H2zM27 12h3v17h-3z"/><path fill="#1647eb" d="M5 13h22v11H5z"/><path fill="#fff" d="M6 9h7v8H6z"/><path fill="#64a4ff" d="M14 12h12v8H14z"/>',
            screen:
              '<path fill="#ccc" d="M3 2h26v22H3z"/><path fill="#1644e4" d="M6 5h20v16H6z"/><path fill="#aaa" d="M13 24h6v4h6v3H7v-3h6z"/><path stroke="#8ecbff" d="M7 19 23 6"/>',
            plant:
              '<path fill="#b07a13" d="M10 22h12l-2 8h-8z"/><path fill="none" stroke="#217321" stroke-width="3" d="M16 25V7m0 13L7 10m9 6 10-8"/><ellipse fill="#25c44d" cx="7" cy="11" rx="5" ry="7" transform="rotate(-30 7 11)"/><ellipse fill="#25c44d" cx="25" cy="10" rx="5" ry="7" transform="rotate(30 25 10)"/><ellipse fill="#26b644" cx="16" cy="6" rx="4" ry="5"/>',
            film: '<path fill="#000040" d="M2 2h28v28H2z"/><path fill="#fff" d="M5 5h4v4H5zm0 8h4v5H5zm0 9h4v5H5zM23 5h4v4h-4zm0 8h4v5h-4zm0 9h4v5h-4z"/><path fill="#ccc" d="M12 6h8v20h-8z"/>',
          };
          svg.innerHTML = shapes[name] || shapes.home;
          if (name === 'bulb') svg.setAttribute('preserveAspectRatio', 'none');
          return svg;
        };
        const titlebar = util.el('div', 'win-titlebar', document.body);
        classicIcon(titlebar, 'home');
        util.el('span', '', titlebar, 'Home & Media Console');
        const winbuttons = util.el('span', 'win-buttons', titlebar);
        for (const glyph of ['−', '□', '×']) util.el('span', '', winbuttons, glyph);
        const menubar = util.el('nav', 'win-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Controls', 'Devices', 'Media', 'Help'])
          util.el('span', '', menubar, item);
        const toolbar = util.el('div', 'win-toolbar', document.body);
        for (const [icon, label] of [
          ['home', 'Home'],
          ['room', 'Rooms'],
          ['bulb', 'Lights'],
          ['music', 'Media'],
          ['calendar', 'Schedules'],
          ['refresh', 'Refresh'],
        ]) {
          const tool = util.el('div', 'win-tool', toolbar);
          classicIcon(tool, icon);
          util.el('span', '', tool, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { classicIcon, header, menubar, titlebar, toolbar, winbuttons });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, toolbar, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', toolbar);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        if (display === 'header') toolbar.append(header);
        Object.assign(_c, { headerTools, submit });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, classicIcon, util } = _c;
        const workspace = util.el('div', 'nestora-workspace', body);
        const stage = util.el('main', 'ref-stage', workspace);
        S.frameAlign(_c, stage);
        const rooms = util.el('aside', 'nestora-rooms', workspace);
        util.el('h2', '', rooms, 'Rooms');
        const roomSearch = util.el('div', 'nestora-search', rooms, '⌕  Search rooms or devices…');
        roomSearch.setAttribute('aria-hidden', 'true');
        const roomRows = [
          ['sun', 'Sunroom', 'Thermostat · Lights', '22°C'],
          ['room', 'Living Room', 'Thermostat · Lights · TV', '21°C'],
          ['cup', 'Kitchen', 'Lights · Smart Plug', '20°C'],
          ['bed', 'Bedroom', 'Thermostat · Lights', '21°C'],
          ['screen', 'Office', 'Thermostat · Lights', '23°C'],
          ['plant', 'Patio', 'Lights', '21°C'],
        ];
        roomRows.forEach((row, i) => {
          const item = util.el('div', `nestora-room${i === 0 ? ' active' : ''}`, rooms);
          classicIcon(util.el('span', 'nestora-room-icon', item), row[0]);
          const copy = util.el('span', 'nestora-room-copy', item);
          util.el('strong', '', copy, row[1]);
          util.el('small', '', copy, row[2]);
          util.el('span', 'nestora-room-temp', item, row[3]);
          util.el('span', 'nestora-chevron', item, '›');
        });
        const companions = util.el('div', 'nestora-companions', body);
        const lights = util.el('section', 'nestora-card nestora-lights', companions);
        const lightTitle = util.el('h3', '', lights);
        classicIcon(lightTitle, 'bulb');
        lightTitle.append('Lighting');
        const lightControl = util.el('div', 'nestora-light-control', lights);
        util.el('div', 'nestora-light-legend', lightControl, 'Sunroom Lights');
        classicIcon(util.el('div', 'nestora-bulb', lightControl), 'bulb');
        const lightRight = util.el('div', 'nestora-light-right', lightControl);
        const brightness = util.el('div', 'nestora-brightness', lightRight);
        util.el('span', 'nestora-slider', brightness);
        util.el('span', 'nestora-percent', brightness, '70%');
        const swatches = util.el('div', 'nestora-swatches', lightRight);
        util.el('span', 'nestora-color-label', swatches, 'Color:');
        for (const color of ['#fff', '#ffe600', '#ef8b00', '#dc2020', '#009c32', '#1262d5', '#071db7', '#a000b5']) {
          const chip = util.el('span', 'nestora-swatch', swatches);
          chip.style.backgroundColor = color;
        }
        const queue = util.el('section', 'nestora-card nestora-queue', companions);
        const queueTitle = util.el('h3', '', queue);
        classicIcon(queueTitle, 'music');
        queueTitle.append('Music Queue');
        const table = util.el('div', 'nestora-table', queue);
        const tableHead = util.el('div', 'nestora-table-head', table);
        for (const label of ['#', 'Title', 'Artist', 'Length']) util.el('span', '', tableHead, label);
        [
          ['Morning Light', 'The Rivertones', '3:24'],
          ['Green Fields', 'Maple Road', '4:08'],
          ['Summer Air', 'The Rivertones', '3:52'],
          ['Window Seat', 'Harbor Lane', '4:31'],
          ['Clear Skies', 'The Rivertones', '3:19'],
        ].forEach((song, i) => {
          const item = util.el('div', `nestora-song${i === 0 ? ' selected' : ''}`, table);
          util.el('span', 'nestora-song-num', item, `${i + 1}`);
          const info = util.el('span', 'nestora-song-info', item);
          util.el('strong', '', info, song[0]);
          util.el('small', '', info, song[1]);
          util.el('span', 'nestora-song-time', item, song[2]);
        });
        const queueActions = util.el('div', 'nestora-queue-actions', queue);
        for (const label of ['Move Up', 'Move Down', 'Delete']) util.el('button', '', queueActions, label);
        const playback = util.el('div', 'nestora-playback', queue);
        for (const label of ['▶  Play', 'Ⅱ  Pause', '■  Stop']) util.el('button', '', playback, label);
        const volume = util.el('div', 'nestora-volume', playback);
        util.el('span', '', volume, '◖))');
        util.el('span', 'nestora-volume-track', volume);
        util.el('span', '', volume, '60%');
        const video = util.el('section', 'nestora-card nestora-video', companions);
        const videoTitle = util.el('h3', '', video);
        classicIcon(videoTitle, 'film');
        videoTitle.append('Video Player');
        const player = util.el('div', 'nestora-player', video);
        util.el('div', 'nestora-landscape', player);
        const videoInfo = util.el('div', 'nestora-video-info', player);
        util.el('strong', '', videoInfo, 'Lakeside');
        util.el('span', '', videoInfo, 'Chapter 3 of 8');
        util.el('small', '', videoInfo, '00:12:46 / 00:56:20');
        util.el('div', 'nestora-progress', player);
        const videoControls = util.el('div', 'nestora-video-controls', player);
        for (const label of ['▶', 'Ⅱ', '■', '◀ Previous', 'Next ▶']) util.el('button', '', videoControls, label);
        const tips = util.el('aside', 'win-tips', body);
        util.el('h2', '', tips, 'Tips & Information');
        for (const [title, copy] of [
          [
            'Temperature Control',
            'Use the dial to set the desired temperature for the selected room, then choose Heat or Cool. The current room temperature, humidity and operating status are shown below the controls.',
          ],
          ['Lighting Control', "Adjust the slider to set brightness and choose a color for the room's lights."],
          [
            'Music Queue',
            'Select a track and use the buttons to reorder the queue. Double-click a track to play it now.',
          ],
          ['Video Player', 'Use the controls below the timeline to play, pause, or skip between chapters.'],
        ]) {
          const section = util.el('section', '', tips);
          util.el('strong', '', section, title);
          util.el('div', '', section, copy);
        }
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) tips.insertBefore(taskPanel, tips.children[1]);
        Object.assign(_c, {
          brightness,
          companions,
          lightControl,
          lightRight,
          lightTitle,
          lights,
          playback,
          player,
          queue,
          queueActions,
          queueTitle,
          roomRows,
          roomSearch,
          rooms,
          stage,
          swatches,
          table,
          tableHead,
          taskPanel,
          tips,
          video,
          videoControls,
          videoInfo,
          videoTitle,
          volume,
          workspace,
        });
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
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            dock.prepend(foot.querySelector('.ref-tools'));
            foot.remove();
          }
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-smart-home-thermostat-04',
    template: 'site/base',
    design: { parts },
  });
})();
