// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const HOME_ICONS = {
    bed: '<path d="M2 18V8h20v10M2 14h20M4 8V5h16v3M2 18v3m20-3v3" fill="#7094b9"/><path d="M4 8h7v5H4zm9 0h7v5h-7Z" fill="#e2edf7"/>',
    sofa: '<path d="M3 10V6h18v4M1 10h5v7h12v-7h5v10H1Zm2 10v2m18-2v2" fill="#9eb5ce"/><path d="M6 10h12v7H6Z" fill="#d3e0ec"/>',
    cup: '<path d="M5 4h11v17H5ZM16 7h4v9h-4" fill="#d4dce3"/><ellipse cx="10.5" cy="4" rx="5.5" ry="2" fill="#798797"/>',
    office: '<path d="M2 9h20v4H2Zm2 4v8m16-8v8M9 3h6v7H9Zm1 12h4v5h-4Zm2-5v5m-5 7 5-2 5 2" fill="#8ba3bb"/>',
    door: '<path d="M5 1h15v22H5Z" fill="#6f7f91"/><path d="M7 3h10v18H7Z" fill="#9aa9b9"/><circle cx="15" cy="14" r="1" fill="#e7edf2"/>',
    film: '<path d="M4 2h16v20H4Zm4 1v18m8-18v18M4 7h4m-4 5h4m-4 5h4M16 7h4m-4 5h4m-4 5h4" fill="#cbd6e5"/>',
    speaker: '<path d="M2 9h5l7-6v18l-7-6H2Z" fill="#43516c"/><path d="M17 7q5 5 0 10m3-13q8 8 0 16"/>',
    monitor: '<path d="M1 3h22v16H1Z" fill="#557fb7"/><path d="M4 5h16v11H4Z" fill="#7eaeeb"/><path d="M12 19v3m-6 0h12"/>',
    bulb: '<path d="M9 18h6m-5 3h4M8.2 14.5a7 7 0 1 1 7.6 0c-1.1.8-1.3 1.5-1.3 3.5h-5c0-2-.2-2.7-1.3-3.5Z"/>',
    temperature:
      '<path d="M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0Z"/><path d="M12 6v11"/><circle cx="12" cy="18" r="1.5"/>',
    play: '<path d="m9 6 10 6-10 6Z" fill="currentColor" stroke="none"/>',
    media: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4Z"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="17" rx="1"/><path d="M3 10h18M7 2v6m10-6v6M7 14h1m4 0h1m4 0h1M7 18h1"/>',
    music:
      '<path d="M9 18V5l11-3v14M9 8l11-3"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>',
    home: '<path d="M3 10 12 1l10 9-3 1v11H5V11Z" fill="#dfeefa"/><path d="m1 11 11-11 11 11M17 2V0h3v5"/><path d="M9 22v-8h6v8" fill="#7ca6d7"/><path d="M6 10h3v4H6Zm10 0h3v4h-3Z" fill="#6d97c5"/>',
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
    endLabel: base => (rng, content) => {
      const sampled = base(rng, content);
      return rng.fork('console/end-label').bool(.5) ? 'Done' : sampled;
    },
    'frame.placement': base => _c => {
      base(_c);
      if (_c.placement === 'floating') _c.placement = 'header';
    },
    'frame.toast': base => _c => {
      base(_c);
      if (_c.display === 'toast') _c.status.append(document.querySelector('.ref-note'));
    },
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
        if (kind === 'banner') el.style.setProperty('--banner-top', document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px');
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, placement, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        homeIcon(util, header, 'home').classList.add('home-header-icon');
        S.frameBrand(_c, header);
        util.el('div', 'console-brand', header, 'HomeHub Console');
        util.el('div', 'console-clock', header, 'Mon, Apr 21, 2003  10:24 AM');
        Object.assign(_c, { header });
      },
    'frame.nav': base => _c => {
      base(_c);
      const old = _c.header.querySelector('.ref-nav');
      if (old) old.remove();
      const nav = _c.util.el('nav', 'console-tabs', _c.header);
      for (const text of ['Home', 'Media', 'Automation', 'Devices', 'Library', 'Settings']) {
        const tab = _c.util.el('a', text === 'Home' ? 'selected' : '', nav, text);
        tab.href = '#';
        tab.addEventListener('click', e => { e.preventDefault(); env.log('decoy', { what: 'nav', label: text }); });
      }
    },
    'frame.body': (base, S) =>
      function (_c) {
        const { display, placement, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        document.body.dataset.instruction = display;
        document.body.dataset.endPlacement = placement || 'none';
        const status = util.el('aside', 'home-status', body);
        const room = (_c.ctx.spec && _c.ctx.spec.room) || 'Bedroom';
        const group = (title, icon, rows, cls) => {
          const box = util.el('section', 'console-group ' + cls, status);
          const head = util.el('div', 'console-group-title', box);
          homeIcon(util, head, icon); util.el('strong', '', head, title);
          for (const [name, symbol] of rows) {
            const row = util.el('div', 'console-room' + (name === room ? ' selected' : ''), box);
            homeIcon(util, row, symbol); util.el('span', '', row, name);
          }
        };
        const rooms = ['Living Room', 'Kitchen', 'Bedroom', 'Office', 'Guest Room', 'Hallway'];
        if (!rooms.includes(room)) rooms[2] = room;
        group('Rooms', 'home', rooms.map((name, i) => [name, ['sofa', 'cup', 'bed', 'office', 'bed', 'door'][i]]), 'console-rooms');
        group('Media', 'music', [['Music Queue', 'music'], ['Now Playing', 'play'], ['Video Library', 'film'], ['Now Playing', 'video']], 'console-media');
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, status });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, display, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const summary = util.el('aside', 'console-inspector', body);
        const heading = util.el('div', 'console-inspector-title', summary);
        homeIcon(util, heading, 'bed'); util.el('strong', '', heading, 'Room Properties');
        const room = (ctx.spec && ctx.spec.room) || 'Bedroom';
        const name = room + ' Ceiling Bulb';
        const table = (title, rows, cls) => {
          const box = util.el('section', 'console-table ' + (cls || ''), summary);
          util.el('div', 'console-section-title', box, title);
          for (const [label, value, key] of rows) {
            const row = util.el('div', 'console-table-row', box);
            util.el('span', '', row, label);
            util.el('span', (key ? 'inspect-' + key : '') + (value === 'Connected' ? ' connected' : ''), row, value);
          }
        };
        table('Room', [['Name:', room], ['Temperature:', '21 °C'], ['Status:', 'Normal']], 'room-properties');
        const devices = util.el('section', 'console-devices', summary);
        util.el('div', 'console-section-title', devices, 'Devices in Room');
        for (const [label, icon] of [[name, 'bulb'], ['Thermostat', 'temperature'], [room + ' Speaker', 'speaker'], [room + ' TV', 'monitor']]) {
          const row = util.el('div', 'console-device' + (icon === 'bulb' ? ' selected' : ''), devices);
          homeIcon(util, row, icon); util.el('span', '', row, label); util.el('span', 'connected', row, 'Connected');
        }
        table('Selected Device', [['Name:', name], ['Type:', 'Color Bulb'], ['Room:', room], ['Status:', 'Connected'], ['Current Hue:', '', 'hue'], ['Current Brightness:', '', 'brightness'], ['Firmware:', '1.2.4'], ['Last Seen:', 'Apr 21, 2003 10:24 AM']], 'selected-device');
        if (display === 'panel') {
          const panel = body.querySelector('.ref-panel');
          panel.querySelector('.ref-panel-title').textContent = 'Task Note';
          _c.status.append(panel);
        }
        Object.assign(_c, { stage, summary });
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
    name: 'design-use-smart-home-lightcolor-05',
    template: 'site/base',
    design: { parts },
  });
})();
