// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  // Small, deterministic native-style icons, shared by the ribbon and room index.
  function nativeIcon(parent, key) {
    const artwork = {
      home: '<path d="M5 11v11h6v-7h4v7h4V11l-7-6Z" fill="#f8fbfc"/><path d="M17 5V2h3v6" fill="#d99136"/><path d="M2 11 12 2l10 9-2 2-8-7-8 7Z" fill="#edb44d"/>',
      music:
        '<path d="M8 17V4l13-2v14h-3V6L11 7v11Z" fill="url(#hh-blue)"/><ellipse cx="6.8" cy="19" rx="3.7" ry="2.7" fill="url(#hh-blue)"/><ellipse cx="17.8" cy="17" rx="3.4" ry="2.6" fill="url(#hh-blue)"/>',
      video:
        '<rect x="2" y="2" width="20" height="20" fill="url(#hh-blue)"/><path d="M7 3h10v18H7Z" fill="#dbeaf9"/><path d="M7 12h10"/><path d="M3.5 4h2v3h-2zm0 5h2v3h-2zm0 5h2v3h-2zm0 5h2v2h-2zm15-15h2v3h-2zm0 5h2v3h-2zm0 5h2v3h-2zm0 5h2v2h-2z" fill="white" stroke="none"/>',
      calendar:
        '<rect x="2" y="4" width="20" height="18" rx="1" fill="#f9fcff"/><path d="M2 4h20v5H2Z" fill="#e75f30"/><path d="M7 2v5m10-5v5" stroke-width="2"/><path d="M6 12h3m3 0h3m3 0h1M6 16h3m3 0h3m3 0h1M6 19h3m3 0h3" stroke="#367dba" stroke-width="2"/>',
      settings:
        '<path d="m10 2 1 3h3l1-3 3 2-1 3 2 2 3-1 1 4-3 1-1 3 2 2-3 3-2-2-3 1-1 3-4-1v-3l-3-2-3 1-1-4 3-1V9L2 7l2-3 3 1 2-3Z" fill="#9fc9ec"/><circle cx="12" cy="12" r="4" fill="#eef8ff"/>',
      bulb: '<path d="M6 14a8 8 0 1 1 12 0c-2 2-2 3-2 5H8c0-2 0-3-2-5Z" fill="url(#hh-yellow)"/><path d="M8 18h8v3H8zm1 3h6l-1 2h-4Z" fill="#afc9df"/>',
      thermometer:
        '<path d="M9 4a3 3 0 0 1 6 0v11a5 5 0 1 1-6 0Z" fill="white"/><path d="M12 6v12" stroke="#ef3d25" stroke-width="2"/><circle cx="12" cy="18" r="2.5" fill="#ef3d25" stroke="none"/><path d="M17 5h3m-3 4h3m-3 4h3"/>',
      speakers:
        '<rect x="7" y="3" width="10" height="18" rx="4" fill="url(#hh-blue)"/><rect x="2" y="8" width="5" height="10" rx="2" fill="#3f9fe5"/><rect x="17" y="8" width="5" height="10" rx="2" fill="#3f9fe5"/><circle cx="12" cy="9" r="2" fill="#d4eeff"/>',
      screen:
        '<rect x="2" y="3" width="20" height="15" rx="1" fill="#153a58"/><path d="M4 5h16v11H4Z" fill="url(#hh-blue)"/><path d="M12 18v3m-5 1h10" stroke-width="2"/>',
      photos:
        '<rect x="3" y="3" width="18" height="19" fill="#f9fbfc"/><circle cx="9" cy="8" r="2" fill="#71b8d6"/><path d="m5 19 5-7 3 3 3-5 4 9Z" fill="#9db8b8"/>',
      clock: '<circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 5v7h6" stroke-width="2"/>',
      list: '<rect x="2" y="3" width="20" height="4" rx="1" fill="url(#hh-blue)"/><rect x="2" y="10" width="20" height="4" rx="1" fill="url(#hh-blue)"/><rect x="2" y="17" width="20" height="4" rx="1" fill="url(#hh-blue)"/><path d="M7 3v4m0 3v4m0 3v4"/>',
      star: '<path d="m12 2 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="#ffd253"/>',
      plan: '<rect x="4" y="2" width="16" height="20" rx="1" fill="url(#hh-blue)"/><path d="M6 4h12v8H6Z" fill="#fff"/><path d="M7 6h10m-10 3h8M7 15h8m-8 3h4" stroke="#c8efff" stroke-width="1.7"/><path d="M15 17h3v4h-3Z" fill="#fff"/>',
      expand: '<path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5" stroke-width="2.5" fill="none"/>',
      volume:
        '<path d="M3 9h4l5-5v16l-5-5H3Z" fill="#173d64"/><path d="M16 7q7 5 0 10m3-14q10 9 0 18" fill="none" stroke-width="2"/>',
      captions:
        '<path d="M2 4h20v15h-5l-2 3-2-3H2Z" fill="#f3f9fc"/><path d="M5 8h3m3 0h3m3 0h2M5 12h3m3 0h3m3 0h2M6 16h12" fill="none" stroke-width="2"/>',
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'hh-native-icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML =
      '<defs><linearGradient id="hh-blue" x2=".3" y2="1"><stop stop-color="#6dc9ff"/><stop offset=".45" stop-color="#2499ee"/><stop offset="1" stop-color="#065ca7"/></linearGradient><radialGradient id="hh-yellow"><stop stop-color="#fffdeb"/><stop offset=".7" stop-color="#ffe68c"/><stop offset="1" stop-color="#efb529"/></radialGradient></defs><g stroke="#163347" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">' +
      (artwork[key] || artwork.home) +
      '</g>';
    parent.appendChild(svg);
    return svg;
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
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end && end.getBoundingClientRect();
        const screenHeight = document.documentElement.clientHeight;
        const protectedBottom = endRect && endRect.top > screenHeight / 2 ? screenHeight - endRect.top + 10 : 10;
        if (kind === 'cookie' || kind === 'chat') el.style.bottom = protectedBottom + 'px';
        if (kind === 'banner') {
          el.style.top = document.querySelector('.hh-frame').getBoundingClientRect().bottom + 'px';
          document.body.appendChild(el);
        }
        if (kind === 'promo') {
          el.style.top = document.querySelector('.hh-frame').getBoundingClientRect().bottom + 'px';
          el.style.bottom = protectedBottom + 'px';
        }
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          util.el('div', 'hh-promo-art', box);
          util.el('h2', 'hh-promo-title', box, 'Stay in the Loop');
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
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.lang': (base, S) =>
      function (_c) {
        const { ctx, rng, util } = _c;
        // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const lr = rng.fork('chrome/lang');
        const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
        const closeLabel = word ? word('close') : 'Close';

        // Native desktop frame for the 2008 Hearth & Home console design.
        const frame = util.el('div', 'hh-frame', document.body);
        const titlebar = util.el('div', 'hh-titlebar', frame);
        nativeIcon(util.el('span', 'hh-home-icon', titlebar), 'home');
        util.el('span', 'hh-title', titlebar, 'Hearth & Home Console');
        const windowButtons = util.el('span', 'hh-window-buttons', titlebar);
        for (const symbol of ['−', '□', '×']) util.el('span', '', windowButtons, symbol);
        const menu = util.el('div', 'hh-menu', frame);
        for (const label of ['File', 'Edit', 'View', 'Controls', 'Tools', 'Help']) util.el('span', '', menu, label);
        const ribbon = util.el('div', 'hh-ribbon', frame);
        for (const [icon, label] of [
          ['home', 'Home'],
          ['music', 'Music'],
          ['video', 'Video'],
          ['calendar', 'Schedule'],
          ['settings', 'Settings'],
        ]) {
          const item = util.el('div', 'hh-ribbon-item', ribbon);
          nativeIcon(util.el('span', 'hh-ribbon-icon', item), icon);
          util.el('span', '', item, label);
        }
        Object.assign(_c, { closeLabel, frame, local, lr, menu, ribbon, titlebar, windowButtons, word });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('hh-note-row');
        S.frameBrand(_c, header);
        Object.assign(_c, { header });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // The console's persistent room/media index and the two home-monitor panels.
        // These are presentation-only; the playlist widget retains all task controls.
        const index = util.el('aside', 'hh-index', body);
        const groups = [
          [
            'home',
            'Rooms',
            ['home', 'Living Room', 'home', 'Kitchen', 'home', 'Bedroom', 'home', 'Office', 'home', 'Patio'],
          ],
          ['bulb', 'Devices', ['thermometer', 'Thermostat', 'bulb', 'Lights', 'speakers', 'Speakers', 'screen', 'TV']],
          ['music', 'Media', ['music', 'Now Playing', 'list', 'Music Queue', 'video', 'Video', 'photos', 'Photos']],
          ['clock', 'Automation', ['calendar', 'Schedules', 'star', 'Scenes', 'settings', 'Rules']],
        ];
        for (const [symbol, title, entries] of groups) {
          const group = util.el('section', 'hh-navgroup', index);
          const heading = util.el('div', 'hh-navheading', group);
          nativeIcon(heading, symbol);
          util.el('span', '', heading, title);
          for (let i = 0; i < entries.length; i += 2) {
            const link = util.el(
              'div',
              `hh-navitem${title === 'Media' && entries[i + 1] === 'Music Queue' ? ' selected' : ''}`,
              group,
            );
            nativeIcon(util.el('span', 'hh-navicon', link), entries[i]);
            util.el('span', '', link, entries[i + 1]);
          }
        }
        const work = util.el('div', 'hh-workarea', body);
        work.appendChild(stage);
        const lower = util.el('div', 'hh-lower', work);
        const controls = util.el('section', 'hh-home-controls', lower);
        const controlsTitle = util.el('h2', '', controls);
        nativeIcon(controlsTitle, 'home');
        util.el('span', '', controlsTitle, 'Home Controls');
        const temperature = util.el('div', 'hh-control-content', controls);
        const temp = util.el('div', 'hh-temperature', temperature);
        util.el('strong', 'hh-control-label', temp, 'Temperature');
        const tempLine = util.el('div', 'hh-temp-line', temp);
        util.el('span', '', tempLine, '72° F');
        const stepper = util.el('div', 'hh-temp-stepper', tempLine);
        util.el('span', 'hh-temp-up', stepper);
        util.el('span', 'hh-temp-down', stepper);
        util.el('div', 'hh-target', temp, 'Target:　72°　⌄');
        const lights = util.el('div', 'hh-light-controls', temperature);
        util.el('strong', 'hh-control-label', lights, 'Living Room Lights');
        const lightRow = util.el('div', 'hh-lights-row', lights);
        const bulb = util.el('div', 'hh-bulb', lightRow);
        util.el('span', '', bulb);
        const colors = util.el('div', 'hh-colors', lightRow);
        for (const color of ['#fdfefe', '#ffe16b', '#ff8718', '#14ec19', '#0860ff']) {
          const swatch = util.el('div', 'hh-color', colors);
          swatch.style.setProperty('--bulb-color', color);
        }
        const lightBottom = util.el('div', 'hh-lights-bottom', lights);
        util.el('span', 'hh-light-on', lightBottom, 'On');
        util.el('span', 'hh-sun', lightBottom, '☼');
        const brightness = util.el('div', 'hh-brightness', lightBottom);
        util.el('span', '', brightness);
        util.el('i', '', brightness);
        util.el('span', 'hh-sun', lightBottom, '☼');
        const video = util.el('section', 'hh-video', lower);
        const videoTitle = util.el('h2', '', video);
        nativeIcon(videoTitle, 'video');
        util.el('span', '', videoTitle, 'Now Playing Video');
        util.el('div', 'hh-video-art', video);
        const transport = util.el('div', 'hh-video-controls', video);
        util.el('span', 'hh-video-play', transport, '▶');
        util.el('span', 'hh-video-time', transport, '0:00 / 12:34');
        const progress = util.el('div', 'hh-video-progress', transport);
        util.el('i', '', progress);
        nativeIcon(util.el('span', 'hh-volume-icon', transport), 'volume');
        const volume = util.el('div', 'hh-video-volume', transport);
        util.el('i', '', volume);
        nativeIcon(util.el('span', 'hh-captions', transport), 'captions');
        nativeIcon(util.el('span', 'hh-fullscreen', transport), 'expand');

        // Reuse the same SVG vocabulary in the task pane without altering its controls.
        env.homeConsoleIcon = nativeIcon;
        Object.assign(_c, {
          brightness,
          bulb,
          colors,
          controls,
          controlsTitle,
          groups,
          index,
          lightBottom,
          lightRow,
          lights,
          lower,
          progress,
          stage,
          stepper,
          temp,
          tempLine,
          temperature,
          transport,
          video,
          videoTitle,
          volume,
          work,
        });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, display, endBtn, header, headerTools, label, placement, ribbon, stage, util, work } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // Use the console's ribbon for episode actions; an instruction gets its own line.
        ribbon.appendChild(header);
        ribbon.appendChild(headerTools);
        header.classList.toggle('hh-with-instruction', display === 'header');
        if (display === 'panel') {
          const panel = body.querySelector('.ref-panel');
          if (panel) {
            const upper = util.el('div', 'hh-upper', work);
            work.insertBefore(upper, stage);
            upper.appendChild(stage);
            upper.appendChild(panel);
          }
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-smart-home-playlist-01',
    template: 'site/base',
    design: { parts },
  });
})();
