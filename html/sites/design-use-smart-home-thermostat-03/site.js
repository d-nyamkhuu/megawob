// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function olIcon(name) {
    const art = {
      Home: '<path fill="#e7e9ea" d="M4 17 18 4l14 13h-3v16H7V17z"/><path fill="#f9e397" d="M15 23h7v10h-7z"/><path fill="none" d="m2 18 16-15 16 15M25 10V5h4v9"/>',
      Lighting:
        '<path fill="#ffe49a" d="M11 24C11 18 6 17 7 10a11 11 0 0 1 22 0c1 7-4 8-4 14z"/><path fill="#9aaec7" d="M12 24h12v5H12zM15 29h6v4h-6z"/>',
      Music:
        '<path fill="#060b13" stroke="none" d="M14 5 32 1v24c0 7-11 9-11 3 0-4 5-6 8-5V9l-12 3v17c0 7-12 9-12 3 0-4 6-7 9-5z"/>',
      Video:
        '<path fill="#a8bdd7" d="M4 3h28v30H4z"/><path fill="#090e17" d="M11 3h14v30H11z"/><path stroke="#eef0f4" stroke-width="3" d="M6 7h3m-3 7h3m-3 7h3m-3 7h3M27 7h3m-3 7h3m-3 7h3m-3 7h3"/>',
      Scenes:
        '<path fill="#ccd3dc" d="M13 4h20v21H13z"/><path fill="#a1b7d3" d="M3 12h20v20H3z"/><path fill="none" d="M9 18h9v8"/>',
      Rooms:
        '<path fill="#a4bbda" d="M7 2h22v32H7z"/><path fill="#d0d9e5" d="m9 4 13 5v24L9 32z"/><path d="M18 18v3"/>',
      Settings:
        '<path fill="#c9d1db" d="m14 2 8 0 1 5 4 2 5-1 3 7-4 3v4l3 3-3 7-5-2-4 2-1 4h-8l-1-5-4-2-5 1-3-7 4-3v-4l-3-3 3-7 5 2 4-2z"/><circle cx="18" cy="18" r="7" fill="#97aac2"/>',
      Thermostat:
        '<path fill="#f1f2f3" d="M14 23V6a4 4 0 0 1 8 0v17a7 7 0 1 1-8 0z"/><path fill="#cf3c3c" stroke="none" d="M17 10h2v15a4 4 0 1 1-2 0z"/>',
    };
    return (
      '<svg viewBox="0 0 36 38" aria-hidden="true" fill="none" stroke="#0b111b" stroke-width="2.1" stroke-linejoin="round">' +
      (art[name] || art.Home) +
      '</svg>'
    );
  }

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
        if (kind === 'promo') {
          util.el('div', 'ol-promo-art', box);
          util.el('strong', 'ol-overlay-title', box, 'Stay in the know');
        }
        if (kind === 'chat') util.el('strong', 'ol-overlay-title', box, 'Chat with Support');
        if (kind === 'banner') {
          const header = document.querySelector('.ref-task');
          const menu = document.querySelector('.ol-menubar');
          el.style.top =
            (header && header.offsetHeight
              ? header.getBoundingClientRect().bottom
              : menu.getBoundingClientRect().bottom) + 'px';
        }
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
        if (kind === 'chat') {
          const input = util.el('input', 'ol-chat-input', box);
          input.placeholder = 'Type a message…';
          input.setAttribute('aria-label', 'Message support');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const winbar = util.el('div', 'ol-titlebar', document.body);
        util.el('span', 'ol-appicon', winbar, '⌂');
        util.el('strong', '', winbar, 'HearthView 1.2 – Home & Media Console');
        const windowTools = util.el('div', 'ol-window-buttons', winbar);
        windowTools.innerHTML = '<span>−</span><span>□</span><span>×</span>';
        const menubar = util.el('div', 'ol-menubar', document.body);
        ['File', 'Edit', 'View', 'Controls', 'Services', 'Help'].forEach((x) => util.el('span', '', menubar, x));
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          menubar,
          nav,
          placement,
          sidebar,
          wantFooter,
          winbar,
          windowTools,
        });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, display, endBtn, header, label, menubar, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        if (display !== 'header') menubar.append(headerTools);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'ol-rail', body);
        [
          ['⌂', 'Home'],
          ['♟', 'Lighting'],
          ['♫', 'Music'],
          ['▤', 'Video'],
          ['▱', 'Scenes'],
          ['▯', 'Rooms'],
          ['⚙', 'Settings'],
        ].forEach(([ic, label], i) => {
          const item = util.el('div', `ol-rail-item${i === 0 ? ' selected' : ''}`, rail);
          util.el('span', 'ol-rail-icon', item).innerHTML = olIcon(label);
          util.el('span', '', item, label);
        });
        const overview = util.el('section', 'ol-overview', body);
        util.el('h2', '', overview, 'Home Overview');
        const overviewBody = util.el('div', 'ol-overview-body', overview);
        const houseArt = util.el('div', 'ol-house', overviewBody, '');
        const houseImage = util.el('img', 'ol-house-image', houseArt);
        houseImage.src = 'sites/design-use-smart-home-thermostat-03/assets/cottage-v2.webp';
        houseImage.alt = 'Willow Creek House';
        const houseFacts = util.el('div', 'ol-house-facts', overviewBody);
        util.el('strong', '', houseFacts, 'Willow Creek House');
        util.el('span', '', houseFacts, '3 rooms');
        util.el('span', '', houseFacts, '5 lights');
        util.el('span', '', houseFacts, '1 media device');
        util.el('span', '', houseFacts, '2 active scenes');
        const status = util.el('div', 'ol-status', overviewBody);
        util.el('strong', '', status, 'Quick Status');
        [
          ['🌡', 'Thermostat', 'Heating'],
          ['♟', 'Lights On', '3 of 5'],
          ['♫', 'Music Queue', '6 tracks'],
          ['▤', 'Video', 'Paused'],
        ].forEach((row) => {
          const line = util.el('div', 'ol-status-line', status);
          util.el('span', 'ol-status-icon', line).innerHTML = olIcon(
            { 'Thermostat': 'Thermostat', 'Lights On': 'Lighting', 'Music Queue': 'Music', 'Video': 'Video' }[row[1]],
          );
          util.el('span', '', line, row[1]);
          util.el('span', '', line, row[2]);
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, houseArt, houseFacts, houseImage, overview, overviewBody, rail, status });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, overviewBody, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          overviewBody.classList.add('ol-overview-with-task');
          const panel = util.el('aside', 'ref-panel', overviewBody);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const workspace = util.el('div', 'nestora-workspace', body);
        const stage = util.el('main', 'ref-stage', workspace);
        Object.assign(_c, { stage, workspace });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, stage, util, workspace } = _c;
        S.frameAlign(_c, stage);
        const rooms = util.el('aside', 'nestora-rooms', workspace);
        util.el('h2', '', rooms, 'Rooms & Devices');
        const roomSearch = util.el('div', 'nestora-search', rooms, '⌕  Search rooms or devices…');
        roomSearch.setAttribute('aria-hidden', 'true');
        const roomRows = [
          ['▱', 'Bedroom', 'Thermostat · Lights', '22°C'],
          ['▰', 'Living Room', 'Thermostat · Lights · TV', '21°C'],
          ['♜', 'Kitchen', 'Lights · Smart Plug', '20°C'],
          ['▣', 'Office', 'Thermostat · Lights', '21°C'],
          ['♧', 'Bathroom', 'Lights · Smart Plug', '23°C'],
          ['▯', 'Hallway', 'Lights', '21°C'],
        ];
        roomRows.forEach((row, i) => {
          const item = util.el('div', `nestora-room${i === 0 ? ' active' : ''}`, rooms);
          util.el('span', 'nestora-room-icon', item, row[0]);
          const copy = util.el('span', 'nestora-room-copy', item);
          util.el('strong', '', copy, row[1]);
          util.el('small', '', copy, row[2]);
          util.el('span', 'nestora-room-temp', item, row[3]);
          util.el('span', 'nestora-chevron', item, '›');
        });
        const companions = util.el('div', 'nestora-companions', body);
        const lights = util.el('section', 'nestora-card nestora-lights', companions);
        util.el('h3', '', lights, 'Kitchen Lighting');
        const lightControl = util.el('div', 'nestora-light-control', lights);
        util.el('div', 'nestora-color-wheel', lightControl);
        const lightRight = util.el('div', 'nestora-light-right', lightControl);
        util.el('div', 'nestora-brightness', lightRight, '☼　━━━━━━━━━━　75%');
        util.el('div', 'nestora-swatches', lightRight, '●　●　●　●　●');
        const lightVisual = util.el('div', 'nestora-light-visual', lightControl);
        lightVisual.innerHTML =
          '<span class="ol-bulb">' +
          olIcon('Lighting') +
          '</span><span class="ol-light-name">Overhead Light</span><span class="ol-range"><i></i></span><span class="ol-color"></span><span class="ol-menu">▼</span>';
        const queue = util.el('section', 'nestora-card nestora-queue', companions);
        util.el('h3', '', queue, 'Music Queue');
        util.el('a', 'nestora-seeall', queue, 'See All');
        const queueHead = util.el('div', 'nestora-table-head', queue);
        ['#', 'Title', 'Artist', 'Length'].forEach((x) => util.el('span', '', queueHead, x));
        const queueTools = util.el('div', 'ol-queue-tools', queue);
        ['▲', '▼', 'Add…', 'Remove', 'Move Up', 'Move Down'].forEach((label) => {
          const b = util.el('button', '', queueTools, label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label }));
        });
        [
          ['Morning Light', 'The Rivertones', '3:52'],
          ['Harbor View', 'Maple Road', '4:18'],
          ['Ember', 'Larkspur', '5:06'],
          ['Tall Buildings', 'The Apertures', '4:21'],
          ['Quiet Fields', 'Norah Keane', '3:49'],
          ['Turning Pages', 'The Rivertones', '4:03'],
        ].forEach((song, i) => {
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
        util.el('h3', '', video, 'Video Player – Meadowlands');
        const player = util.el('div', 'nestora-player', video);
        const still = util.el('img', 'ol-video-still', player);
        still.src = 'sites/design-use-smart-home-thermostat-03/assets/meadowlands.webp';
        still.alt = 'Alpine lake and mountains';
        const transport = util.el('div', 'ol-video-controls', video);
        transport.innerHTML =
          '<div class="ol-video-line"><span>Paused</span><span>12:36 / 58:14</span></div><div class="ol-video-seek ol-range"><i></i></div><div class="ol-transport"><button title="Play">▶</button><button title="Previous">◀◀</button><button title="Next">▶▶</button><span class="ol-volume-icon">◖))</span><span class="ol-volume ol-range"><i></i></span></div>';
        transport.querySelectorAll('button').forEach((b) => {
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: b.title }));
        });
        Object.assign(_c, {
          companions,
          lightControl,
          lightRight,
          lightVisual,
          lights,
          player,
          queue,
          queueHead,
          queueTools,
          roomRows,
          roomSearch,
          rooms,
          still,
          transport,
          video,
        });
      },
  };

  env.site({
    name: 'design-use-smart-home-thermostat-03',
    template: 'site/base',
    design: { parts },
  });
})();
