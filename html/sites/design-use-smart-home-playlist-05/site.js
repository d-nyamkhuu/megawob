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
        '<rect x="2" y="4" width="20" height="18" rx="1" fill="#f9fcff"/><path d="M2 4h20v5H2Z" fill="#84bbe8"/><path d="M7 2v5m10-5v5" stroke-width="2"/><path d="M6 12h3m3 0h3m3 0h1M6 16h3m3 0h3m3 0h1M6 19h3m3 0h3" stroke="#367dba" stroke-width="2"/>',
      settings:
        '<path d="m10 2 1 3h3l1-3 3 2-1 3 2 2 3-1 1 4-3 1-1 3 2 2-3 3-2-2-3 1-1 3-4-1v-3l-3-2-3 1-1-4 3-1V9L2 7l2-3 3 1 2-3Z" fill="#9fc9ec"/><circle cx="12" cy="12" r="4" fill="#eef8ff"/>',
      bulb: '<path d="M6 14a8 8 0 1 1 12 0c-2 2-2 3-2 5H8c0-2 0-3-2-5Z" fill="#d9edfc"/><path d="M8 18h8v3H8zm1 3h6l-1 2h-4Z" fill="#8aaed1"/>',
      levels: '<path d="M3 16h5v6H3Z" fill="#dbebf8"/><path d="M10 8h5v14h-5Z" fill="#b4d5ef"/><path d="M17 3h5v19h-5Z" fill="#7ab5e4"/>',
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
      plan: '<path d="M5 2h11l4 4v16H5Z" fill="#f7fbff" stroke="#0a4c9a"/><path d="M16 2v4h4M8 9h9M8 13h9M8 17h9" fill="none" stroke="#0a4c9a" stroke-width="1.4"/>',
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
    'frame.placement': (base) => function (_c) {
      base(_c);
      const endWords = _c.content && _c.content.END_LABELS;
      if (!_c.ctx.finish && Array.isArray(endWords) && endWords.includes('Finish') && _c.ctx.rng.fork('aqua/end').bool(0.5)) {
        _c.placement = 'header';
        _c.wantFooter = false;
        _c.label = 'Finish';
        if (_c.collide && _c.collide.text === 'Finish') _c.collide = null;
      }
    },
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
        const dots = util.el('span', 'hh-traffic', titlebar);
        for (const color of ['red', 'yellow', 'green']) util.el('span', `hh-dot hh-dot-${color}`, dots);
        util.el('span', 'hh-title', titlebar, 'Home & Media Console');
        const windowButtons = util.el('span', 'hh-window-buttons', titlebar);
        for (const symbol of ['−', '□', '×']) util.el('span', '', windowButtons, symbol);
        const ribbon = titlebar;
        Object.assign(_c, { closeLabel, frame, local, lr, ribbon, titlebar, windowButtons, word });
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

        const band = util.el('div', 'hh-band', body);
        const panel = (icon, name, cls) => {
          const box = util.el('section', `hh-utility ${cls}`, band);
          const h = util.el('h2', 'hh-utility-title', box);
          nativeIcon(h, icon);
          util.el('span', '', h, name);
          return util.el('div', 'hh-utility-body', box);
        };
        const room = panel('levels', 'Living Room', 'hh-room');
        const reading = util.el('div', 'hh-reading', room);
        util.el('span', 'hh-reading-value', reading, '72°');
        const stepper = util.el('div', 'hh-temp-stepper', reading);
        util.el('span', 'hh-temp-up', stepper);
        util.el('span', 'hh-temp-down', stepper);
        util.el('div', 'hh-target', room, 'Target: 72°');
        const modes = util.el('div', 'hh-mode-buttons', room);
        for (const mode of ['Off','Heat','Cool']) util.el('button', mode === 'Cool' ? 'active' : '', modes, mode).type = 'button';
        const lights = panel('bulb', 'Lights', 'hh-light-panel');
        const sliderLine = util.el('div', 'hh-slider-line', lights);
        util.el('span', 'hh-sun', sliderLine, '☼');
        const slider = util.el('div', 'hh-slider', sliderLine);
        util.el('i', '', slider);
        util.el('span', '', sliderLine, '75%');
        const whites = util.el('div', 'hh-mode-buttons', lights);
        for (const mode of ['Warm White','Daylight','Soft Blue']) util.el('button', mode === 'Warm White' ? 'active' : '', whites, mode).type = 'button';
        const schedule = panel('calendar', 'Schedules', 'hh-schedule');
        const scheduleWell = util.el('div', 'hh-schedule-well', schedule);
        for (const [time, action, repeat] of [['6:00 AM','Morning Lights','Every day'],['8:00 AM','Set Thermostat 70°','Weekdays'],['6:00 PM','Evening Lights','Every day'],['10:00 PM','All Off','Every day']]) {
          const row = util.el('div', 'hh-schedule-row', scheduleWell);
          util.el('span', '', row, time); util.el('span', '', row, action); util.el('span', '', row, repeat);
        }
        const playing = panel('music', 'Now Playing', 'hh-now-playing');
        const song = util.el('div', 'hh-playing-song', playing);
        const art = util.el('div', 'hh-album-picture', song); art.dataset.art = '0';
        const details = util.el('div', 'hh-playing-details', song);
        util.el('strong', '', details, 'River Glen');
        util.el('span', '', details, 'The Maple Keys');
        util.el('em', '', details, 'Hearth and Horizon');
        const volumeLine = util.el('div', 'hh-volume-line', playing);
        util.el('span', '', volumeLine, '◖))');
        const volume = util.el('div', 'hh-slider', volumeLine); util.el('i', '', volume);
        util.el('span', '', volumeLine, '◖))');
        const work = util.el('div', 'hh-workarea', body);
        work.appendChild(stage);
        env.homeConsoleIcon = nativeIcon;
        Object.assign(_c, { band, stage, work });
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
        // The title bar holds the episode note and native toolbar controls.
        ribbon.appendChild(header);
        ribbon.appendChild(headerTools);
        header.classList.toggle('hh-with-instruction', display === 'header');
        // The widget places a panel-mode task card above Listening plan after render.
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-smart-home-playlist-05',
    template: 'site/base',
    design: { parts },
  });
})();
