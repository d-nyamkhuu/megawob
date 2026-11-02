// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const HOME_ICONS = {
    bulb: '<path d="M9 18h6m-5 3h4M8.2 14.5a7 7 0 1 1 7.6 0c-1.1.8-1.3 1.5-1.3 3.5h-5c0-2-.2-2.7-1.3-3.5Z"/>',
    temperature:
      '<path d="M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0Z"/><path d="M12 6v11"/><circle cx="12" cy="18" r="1.5"/>',
    play: '<path d="m9 6 10 6-10 6Z" fill="currentColor" stroke="none"/>',
    media: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4Z"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="17" rx="1"/><path d="M3 10h18M7 2v6m10-6v6M7 14h1m4 0h1m4 0h1M7 18h1"/>',
    music:
      '<path d="M9 18V5l11-3v14M9 8l11-3"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>',
    home: '<path d="M2 11 12 2l10 9h-4v11h-5v-8h-3v8H5V11Z" fill="currentColor" stroke="none"/>',
    settings:
      '<path d="m9 3 1-2h4l1 3 3 1 3-1 2 4-2 2v4l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-4L1 8l2-4 3 1Z"/><circle cx="12" cy="12" r="4"/>',
    humidity: '<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13Z"/><path d="M8 14c0 3 1 4 3 4"/>',
    cloud: '<path d="M6 19a4 4 0 0 1-1-8 6 6 0 0 1 11-2 5 5 0 1 1 2 10Z"/>',
    activity: '<path d="M4 21v-7m5 7V8m5 13V2m5 19V10"/>',
    video: '<rect x="2" y="5" width="20" height="15" rx="1"/><path d="M5 8v9m14-9v9m1-6h2m-2 3h2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
    snow: '<path d="M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4-1-1-4M18 19l-1-4 4-1M3 14l4 1-1 4M18 5l-1 4 4 1"/>',
    leaf: '<path d="M4 17C0 6 12 4 22 3c-1 12-5 18-14 15M4 22 17 9" fill="currentColor"/>',
    previous: '<path d="M5 5v14m14-14L6 12l13 7Z" fill="currentColor"/>',
    next: '<path d="M19 5v14M5 5l13 7-13 7Z" fill="currentColor"/>',
    shuffle: '<path d="M2 6h3c5 0 7 12 12 12h5m-4-4 4 4-4 4M2 18h3c2 0 4-3 6-6m3-4 3-2h5m-4-4 4 4-4 4"/>',
    repeat: '<path d="m17 2 4 4-4 4M3 12V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-2v3a3 3 0 0 1-3 3H3"/>',
    fullscreen: '<path d="M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6"/>',
  };

  function homeIcon(util, parent, name) {
    const icon = util.el('span', 'home-icon', parent);
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (HOME_ICONS[name] || HOME_ICONS.bulb) +
      '</svg>';
    return icon;
  }

  function landscape(util, parent, lake) {
    const art = util.el('div', 'home-art' + (lake ? ' lake' : ''), parent);
    let trees = '';
    if (!lake)
      for (let i = 0; i < 11; i++) {
        const x = i * 11 + 2,
          h = 14 + ((i * 7) % 22);
        trees +=
          '<path d="M' +
          x +
          ' 90v-' +
          h +
          'm-7 ' +
          (h - 2) +
          ' 7-' +
          (h - 5) +
          ' 7 ' +
          (h - 5) +
          'm-13-9 6-' +
          (h - 8) +
          ' 6 ' +
          (h - 8) +
          '" stroke="#102629" fill="#102629"/>';
      }
    art.innerHTML =
      '<svg viewBox="0 0 144 90" preserveAspectRatio="none"><defs><linearGradient id="sky-' +
      lake +
      '" x2="0" y2="1"><stop stop-color="' +
      (lake ? '#8c9ab7' : '#64878d') +
      '"/><stop offset="1" stop-color="' +
      (lake ? '#f1c6b3' : '#d4d2b9') +
      '"/></linearGradient><linearGradient id="water-' +
      lake +
      '" x2="0" y2="1"><stop stop-color="#152e41"/><stop offset=".55" stop-color="#e4afaa"/><stop offset="1" stop-color="#6e7898"/></linearGradient></defs><path fill="url(#sky-' +
      lake +
      ')" d="M0 0h144v90H0Z"/><path fill="#8fa3a5" d="M0 42 13 35 21 40 34 33 49 42 64 28 83 40 107 30 123 38 144 31v59H0Z"/><path fill="#587380" d="m0 48 19-8 17 12 25-17 18 15 32-20 13 14 20-7v53H0Z"/><path fill="#304d5d" d="m0 51 29-20 24 21 15-6 16 10 29-16 31 9v41H0Z"/>' +
      (lake
        ? '<path fill="url(#water-true)" d="M0 55h144v35H0Z"/><path fill="#304d5d" opacity=".85" d="m0 55 29 19 24-18 15 6 16-6 29 14 31-15Z"/>'
        : '<path fill="#638b8f" d="m0 65 34-7 30 8 42-15 38 10v29H0Z"/>') +
      trees +
      '</svg>';
    return art;
  }

  function lowerCards(util, body, room) {
    const lower = util.el('div', 'home-lower', body);
    const card = (title, icon, cls) => {
      const box = util.el('section', 'home-lower-card ' + cls, lower);
      const head = util.el('div', 'home-card-heading', box);
      homeIcon(util, head, icon);
      util.el('span', '', head, title);
      return box;
    };
    const climate = card('Thermostat', 'temperature', 'home-climate');
    const temp = util.el('div', 'home-temperature', climate);
    const minus = util.el('button', 'home-step', temp, '−');
    minus.type = 'button';
    const number = util.el('div', 'home-temperature-number', temp);
    const readout = util.el('strong', '', number, '21.0');
    util.el('sup', '', number, ' °C');
    util.el('div', 'home-temperature-room', number, 'Living Room');
    const plus = util.el('button', 'home-step', temp, '+');
    plus.type = 'button';
    minus.addEventListener('click', () => {
      readout.textContent = (Number(readout.textContent) - 0.5).toFixed(1);
    });
    plus.addEventListener('click', () => {
      readout.textContent = (Number(readout.textContent) + 0.5).toFixed(1);
    });
    const modes = util.el('div', 'home-climate-modes', climate);
    for (const [label, icon] of [
      ['Auto', 'leaf'],
      ['Heat', 'sun'],
      ['Cool', 'snow'],
    ]) {
      const b = util.el('button', 'home-mode' + (label === 'Auto' ? ' active' : ''), modes);
      b.type = 'button';
      homeIcon(util, b, icon);
      util.el('span', '', b, label);
      b.addEventListener('click', () => {
        for (const c of modes.children) c.classList.remove('active');
        b.classList.add('active');
      });
    }
    const schedule = card('Schedule', 'calendar', 'home-schedule');
    for (const [time, name, device] of [
      ['06:30', 'Wake Up', room + ' Light'],
      ['22:00', 'Good Night', 'All Lights'],
    ]) {
      const row = util.el('div', 'home-schedule-row', schedule);
      util.el('span', 'home-schedule-time', row, time);
      const detail = util.el('div', '', row);
      util.el('strong', '', detail, name);
      util.el('small', '', detail, device);
      const toggle = util.el('button', 'home-toggle on', row);
      toggle.type = 'button';
      toggle.setAttribute('aria-label', name);
      toggle.setAttribute('aria-pressed', 'true');
      toggle.addEventListener('click', () =>
        toggle.setAttribute('aria-pressed', String(toggle.classList.toggle('on'))),
      );
    }
    const mediaCard = (video) => {
      const box = card(video ? 'Video' : 'Now Playing', video ? 'video' : 'music', video ? 'home-video' : 'home-music');
      const intro = util.el('div', 'home-media-intro', box);
      landscape(util, intro, video);
      const text = util.el('div', 'home-media-text', intro);
      util.el('strong', '', text, video ? 'The Water Beyond' : 'Golden Fields');
      util.el('small', '', text, video ? 'S1 E3 · Mountain Lake' : 'The Aurora Plain');
      if (!video) util.el('small', '', text, 'Dusk Sessions');
      const timeline = util.el('div', 'home-media-timeline', box);
      util.el('i', '', timeline);
      util.el('b', '', timeline);
      const times = util.el('div', 'home-media-times', box);
      util.el('span', '', times, video ? '12:18' : '1:24');
      util.el('span', '', times, video ? '42:07' : '4:36');
      const transport = util.el('div', 'home-transport', box);
      for (const icon of video
        ? ['back10', 'play', 'forward10', 'fullscreen']
        : ['shuffle', 'previous', 'play', 'next', 'repeat']) {
        const b = util.el(
          'button',
          'home-transport-button' + (icon === 'play' && !video ? ' main-play' : ''),
          transport,
        );
        b.type = 'button';
        b.setAttribute('aria-label', icon);
        if (icon.includes('10'))
          b.innerHTML =
            '<svg class="home-ten" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 4a12 12 0 1 1-7 2m7-2 5-3m-5 3 4 4"/><text x="8" y="22" fill="currentColor" stroke="none" font-size="12">10</text></svg>';
        else homeIcon(util, b, icon);
        if (icon === 'play')
          b.addEventListener('click', () => {
            const playing = b.classList.toggle('playing');
            b.innerHTML = playing ? '<span class="home-pause">Ⅱ</span>' : '';
            if (!playing) homeIcon(util, b, 'play');
          });
      }
    };
    mediaCard(false);
    mediaCard(true);
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
        const { display, placement, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'hidden' || placement === 'header' || placement === 'icon')
          homeIcon(util, header, 'home').classList.add('home-header-icon');
        S.frameBrand(_c, header);
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { display, placement, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        document.body.dataset.instruction = display;
        document.body.dataset.endPlacement = placement || 'none';
        const status = util.el('aside', 'home-status', body);
        util.el('strong', 'home-status-title', status, 'Home Status');
        util.el('div', 'home-online', status, '●  All Systems Online');
        for (const [icon, count, label] of [
          ['bulb', '4', 'Lights On'],
          ['temperature', '3', 'Rooms'],
          ['media', '1', 'Media Active'],
          ['calendar', '2', 'Schedules'],
        ]) {
          const row = util.el('div', 'home-count', status);
          homeIcon(util, util.el('span', 'home-count-icon', row), icon);
          const val = util.el('span', 'home-count-value', row);
          util.el('b', '', val, count);
          util.el('small', '', val, label);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, status });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, display, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const summary = util.el('aside', 'home-summary', body);
        const conditions = util.el('section', 'home-summary-card', summary);
        const summaryTitle = (parent, icon, title) => {
          const h = util.el('div', 'home-summary-title', parent);
          homeIcon(util, h, icon);
          util.el('span', '', h, title);
        };
        const summaryRow = (parent, icon, label, value) => {
          const row = util.el('div', 'home-summary-row', parent);
          homeIcon(util, row, icon);
          util.el('span', '', row, label);
          util.el('strong', value === 'Good' ? 'good' : '', row, value);
        };
        summaryTitle(conditions, 'temperature', 'Room Conditions');
        summaryRow(conditions, 'temperature', 'Temperature', '20.5 °C');
        summaryRow(conditions, 'humidity', 'Humidity', '45%');
        summaryRow(conditions, 'cloud', 'Air Quality', 'Good');
        const activity = util.el('section', 'home-summary-card home-activity', summary);
        summaryTitle(activity, 'activity', 'Today’s Activity');
        summaryRow(activity, 'bulb', 'Lights On', '4 / 8');
        summaryRow(activity, 'temperature', 'Rooms Online', '3 / 3');
        summaryRow(activity, 'music', 'Media Active', '1 / 2');
        summaryRow(activity, 'calendar', 'Schedules', '2 / 4');
        lowerCards(util, body, (ctx.spec && ctx.spec.room) || 'Bedroom');
        if (display === 'panel') summary.prepend(body.querySelector('.ref-panel'));
        Object.assign(_c, { activity, conditions, stage, summary, summaryRow, summaryTitle });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        const dock = util.el('nav', 'home-dock', document.body);
        for (const [icon, text] of [
          ['home', 'Home'],
          ['bulb', 'Lights'],
          ['temperature', 'Climate'],
          ['music', 'Media'],
          ['calendar', 'Schedule'],
          ['settings', 'Settings'],
        ]) {
          const item = util.el('div', text === 'Home' ? 'home-dock-item active' : 'home-dock-item', dock);
          homeIcon(util, util.el('span', 'home-dock-icon', item), icon);
          util.el('span', '', item, text);
        }
        Object.assign(_c, { dock, submit });
      },
  };

  env.site({
    name: 'design-use-smart-home-lightcolor-01',
    template: 'site/base',
    design: { parts },
  });
})();
