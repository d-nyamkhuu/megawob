// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'cookie') util.el('strong', 'hh-overlay-heading', box, 'We use cookies');
      if (kind === 'chat') util.el('strong', 'hh-overlay-heading', box, 'Need help?');
      if (kind === 'promo') {
        util.el('div', 'hh-promo-art', box);
        util.el('div', 'hh-promo-eyebrow', box, 'STAY IN THE LOOP');
        util.el('strong', 'hh-overlay-heading', box, 'Get the latest from Hearthly');
      }
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'chat' || kind === 'promo') {
        const field = util.el('input', 'hh-overlay-field', box);
        field.type = kind === 'promo' ? 'email' : 'text';
        field.placeholder = kind === 'promo' ? 'you@domain.com' : 'Type a message…';
      }
      if (kind === 'banner') {
        const work = document.querySelector('.ref-body');
        if (work) work.before(el);
      }
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
    'frame.lang': (base, S) => function (_c) {
      const { ctx, rng, util } = _c;
      // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const lr = rng.fork('chrome/lang');
      const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
      const closeLabel = word ? word('close') : 'Close';

      // Hearthly's native desktop navigation and inspector.
      const iconPaths = {
        home: 'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10',
        bulb: 'M8 17h8M9 21h6M8 14C1 7 7 1 12 2c6 0 10 7 4 12l-1 3H9Z',
        climate: 'M10 4a2 2 0 0 1 4 0v10a5 5 0 1 1-4 0ZM12 7v10',
        music: 'M9 18V5l12-3v13M9 8l12-3M9 18c0 4-7 5-7 1s7-5 7-1Zm12-3c0 4-7 5-7 1s7-5 7-1Z',
        calendar: 'M3 5h18v16H3ZM7 2v6M17 2v6M3 11h18',
        settings: 'm10 2 4 0 1 4 3-1 3 4-3 3 3 3-3 4-3-1-1 4h-4l-1-4-3 1-3-4 3-3-3-3 3-4 3 1ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
        sofa: 'M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M3 10h3v7h12v-7h3v10H3ZM5 20v2M19 20v2',
        play: 'M9 7v10l8-5ZM22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
      };
      const icon = (parent, name) => {
        const svg = env.util.svg('svg', {viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.8, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'aria-hidden':'true'}, parent);
        env.util.svg('path', {d:iconPaths[name]}, svg);
      };
      const frame = util.el('div', 'hh-frame', document.body);
      const titlebar = util.el('div', 'hh-titlebar', frame);
      const house = util.el('span', 'hh-home-icon', titlebar);
      house.innerHTML = '<svg viewBox="0 0 28 30"><path fill="#b8a58e" d="M2 3h23v23H2z"/><path fill="#d67650" d="M3 12 15 1l11 12-3 3L15 7 6 16Z"/><path fill="#474952" d="M6 13 15 5l9 8v15H6Z"/><path fill="#f4e9bc" d="M10 15h3v4h-3zm7 0h3v4h-3z"/><path fill="#c5c4c1" d="M14 22h5v6h-5z"/></svg>';
      util.el('span', 'hh-title', titlebar, 'Hearthly');
      util.el('span', 'hh-window-buttons', titlebar, '−　□　×');
      const ribbon = util.el('div', 'hh-ribbon', frame);
      for (const [symbol, label] of [['home','Home'],['bulb','Lights'],['climate','Climate'],['music','Media'],['calendar','Automations'],['settings','Settings']]) {
        const item = util.el('div', 'hh-ribbon-item', ribbon);
        icon(util.el('span', 'hh-ribbon-icon', item), symbol);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { closeLabel, frame, house, icon, iconPaths, local, lr, ribbon, titlebar, word });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('hh-note-row');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { W, collide, decoyBtn, decoys, display, endBtn, header, label, placement, titlebar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (display === 'hidden' && W >= 1400 && headerTools.getBoundingClientRect().width <= 245) {
        titlebar.appendChild(headerTools);
        headerTools.classList.add('hh-native-tools');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, icon, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // The queue and the persistent room inspector share the work area.
      const work = util.el('div', 'hh-workarea', body);
      work.appendChild(stage);
      const lower = util.el('div', 'hh-lower', work);
      const controls = util.el('section', 'hh-home-controls', lower);
      const roomHeading = util.el('h2', '', controls);
      icon(roomHeading, 'sofa');
      util.el('span', '', roomHeading, 'Living Room');
      const temperature = util.el('div', 'hh-control-content', controls);
      const temp = util.el('div', 'hh-temperature', temperature);
      const tempLine = util.el('div', 'hh-temp-line', temp);
      util.el('span', '', tempLine, '70°');
      const stepper = util.el('div', 'hh-stepper', tempLine);
      for (const direction of ['up','down']) {
        const b = util.el('button', '', stepper); b.type = 'button';
        const svg = env.util.svg('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':2.7}, b);
        env.util.svg('path', {d:direction === 'up' ? 'm6 15 6-8 6 8' : 'm6 9 6 8 6-8'}, svg);
      }
      util.el('div', 'hh-target', temp, 'Target: 70°');
      const modes = util.el('div', 'hh-modes', temp);
      for (const mode of ['Off', 'Heat', 'Cool', 'Auto']) {
        const button = util.el('button', mode === 'Cool' ? 'selected' : '', modes, mode);
        button.type = 'button';
      }
      const lights = util.el('div', 'hh-light-controls', temperature);
      const lightHead = util.el('div', 'hh-light-head', lights);
      const lightTitle = util.el('strong', 'hh-control-label', lightHead);
      icon(lightTitle, 'bulb');
      util.el('span', '', lightTitle, 'Lights');
      const toggle = util.el('span', 'hh-toggle on', lightHead);
      util.el('span', '', toggle);
      const lightInfo = util.el('div', 'hh-lights-row', lights);
      util.el('span', 'hh-light-swatch', lightInfo);
      const lightText = util.el('span', 'hh-light-text', lightInfo);
      util.el('strong', '', lightText, 'Warm White');
      util.el('span', '', lightText, '2700 K');
      const lightRange = util.el('div', 'hh-lights-bottom', lights);
      util.el('span', 'hh-sun', lightRange, '☼');
      const range = util.el('span', 'hh-range', lightRange);
      util.el('span', '', range);
      util.el('span', 'hh-percent', lightRange, '75%');
      lower.appendChild(lights);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) lower.insertBefore(taskPanel, lights);
      const video = util.el('section', 'hh-video', lower);
      const videoHead = util.el('h2', '', video);
      const playingTitle = util.el('span', 'hh-playing-title', videoHead);
      icon(playingTitle, 'play');
      util.el('span', '', playingTitle, 'Now Playing');
      util.el('span', 'hh-more', videoHead, '•••');
      util.el('div', 'hh-video-art', video);
      const videoControls = util.el('div', 'hh-video-controls', video);
      util.el('strong', '', videoControls, 'Valley Roads');
      util.el('span', 'hh-video-artist', videoControls, 'Cedar Grove');
      util.el('span', 'hh-video-time', videoControls, '0:00 / 7:12');
      const videoProgress = util.el('div', 'hh-video-progress', video);
      util.el('span', '', videoProgress);
      const player = util.el('div', 'hh-player-buttons', video);
      for (const name of ['previous','play','next']) {
        const button = util.el('span', name === 'play' ? 'play' : '', player);
        const svg = env.util.svg('svg', {viewBox:'0 0 24 24',fill:'currentColor'}, button);
        env.util.svg('path', {d:name === 'previous' ? 'M4 4h3v16H4ZM20 4 8 12l12 8Z' : name === 'next' ? 'M17 4h3v16h-3ZM4 4l12 8-12 8Z' : 'M6 3v18l15-9Z'}, svg);
      }
      Object.assign(_c, { controls, lightHead, lightInfo, lightRange, lightText, lightTitle, lights, lower, modes, player, playingTitle, range, roomHeading, stage, stepper, taskPanel, temp, tempLine, temperature, toggle, video, videoControls, videoHead, videoProgress, work });
    },
  };

  env.site({
    name: 'design-use-smart-home-playlist-03',
    template: 'site/base',
    design: { parts },
  });
})();
