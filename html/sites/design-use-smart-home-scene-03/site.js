// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
    dark: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
    warm: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
  };

  const ACCENTS = ['#1762b2', '#1762b2', '#1762b2', '#1762b2', '#1762b2', '#1762b2'];

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        if (kind === 'banner') el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px';
        if (kind === 'promo') el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px';
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
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const icon = (node, kind) => {
          const paths = {
            Home: '<path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 0 1 3 19.5z"/>',
            Climate: '<path d="M12 3v11a4 4 0 1 0 4 4 4 4 0 0 0-3-3.87V3a1 1 0 0 0-2 0z"/><path d="M12 18h2"/>',
            Lights:
              '<path d="M8 15c0-2-3-3.2-3-7a7 7 0 0 1 14 0c0 3.8-3 5-3 7z"/><path d="M9 18h6m-5 3h4"/><circle cx="12" cy="8" r="1"/>',
            Schedules: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16m-8 3v4l3 2"/>',
            Media: '<path d="M9 5v13a3 3 0 1 1-2-2.8V4l14-2v14a3 3 0 1 1-2-2.8V5z"/>',
            Video:
              '<path d="m3 6 17-4 1 5-18 4zM3 11h18v11H3z"/><path d="m8 5 2 3m5-4 2 3m-7 8 5 2-5 2z" fill="#080b0a"/>',
            Settings:
              '<path d="m19 13 2 1-2 4-2-1a8 8 0 0 1-2 1l-.3 2h-5L9 18a8 8 0 0 1-2-1l-2 1-2-4 2-1a8 8 0 0 1 0-2l-2-1 2-4 2 1a8 8 0 0 1 2-1l.3-2h5L15 6a8 8 0 0 1 2 1l2-1 2 4-2 1a8 8 0 0 1 0 2z"/><circle cx="12" cy="12" r="3" fill="#080b0a" stroke="#080b0a"/>',
            Night: '<path d="M19 15A8 8 0 0 1 9 5a8 8 0 1 0 10 10z"/>',
            'Focus time':
              '<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/>',
            Relax: '<path d="M20 4C10 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M4 21c3-6 7-9 12-12"/>',
          };
          node.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[kind] || paths.Home}</svg>`;
        };
        const W = ctx.size ? ctx.size.width : window.innerWidth;
        const H = ctx.size ? ctx.size.height : window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.instruction = display;
        Object.assign(_c, { H, W, display, icon, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('ref-window-title');
        util.el('span', 'ref-app-mark', header, '');
        const wordmark = util.el('div', 'hm-wordmark', header);
        util.el('strong', 'ref-window-name', wordmark, 'HOMELYNK');
        util.el('span', 'hm-subtitle', wordmark, 'Smart Home & Media');
        const weather = util.el('div', 'hm-weather', header);
        const sun = util.el('b', '', weather);
        sun.innerHTML =
          '<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#ee990b" stroke-width="4" stroke-linecap="round"><path d="M32 3v6m0 46v6M3 32h6m46 0h6M11 11l5 5m32 32 5 5m0-42-5 5M16 48l-5 5"/></g><circle cx="32" cy="32" r="18" fill="#f4a315"/><path d="M19 34a16 16 0 0 1 22-17" fill="none" stroke="#ffc754" stroke-width="3"/></svg>';
        util.el('span', '', weather, '21°C');
        util.el('small', '', weather, 'Indoor');
        const date = util.el('div', 'hm-date', header);
        util.el('span', '', date, 'Mon, Apr 22');
        util.el('span', '', date, '10:24 AM');
        S.frameBrand(_c, header);
        Object.assign(_c, { date, header, sun, weather, wordmark });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, icon, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const menu = util.el('nav', 'ref-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Controls', 'Tools', 'Help'])
          util.el('span', 'ref-menuitem', menu, item);
        const quick = util.el('div', 'ref-quickbar', document.body);
        for (const [icon, title] of [
          ['⌂', 'Home'],
          ['☼', 'Lights'],
          ['🌡', 'Climate'],
          ['♫', 'Media'],
          ['▣', 'Video'],
          ['◷', 'Schedules'],
        ]) {
          const item = util.el('div', 'ref-quickitem', quick);
          util.el('span', 'ref-quickicon', item, icon);
          util.el('span', '', item, title);
        }

        // Bauhaus home dashboard summary band above the live schedule task.
        const summary = util.el('section', 'hm-summary', document.body);
        const room = util.el('article', 'hm-card hm-room', summary);
        util.el('h2', '', room, 'Living Room');
        util.el('div', 'hm-temp', room, '21°');
        util.el('div', 'hm-comfort', room, '🍃　Comfort mode');
        const music = util.el('article', 'hm-card hm-music', summary);
        util.el('h2', '', music, 'Now Playing');
        util.el('div', 'hm-album', music, '');
        const song = util.el('div', 'hm-song', music);
        util.el('strong', '', song, 'Golden Hours');
        util.el('span', '', song, 'The Lanterns');
        util.el('div', 'hm-progress', song);
        util.el('small', '', song, '1:28 / 4:32');
        const transport = util.el('div', 'hm-controls', song);
        transport.innerHTML =
          '<svg viewBox="0 0 30 30"><path d="M6 5v20M24 5 9 15l15 10Z"/></svg><svg class="hm-play" viewBox="0 0 30 30"><path d="m5 2 22 13L5 28Z"/></svg><svg viewBox="0 0 30 30"><path d="M24 5v20M6 5l15 10L6 25Z"/></svg>';
        const video = util.el('article', 'hm-card hm-video', summary);
        util.el('h2', '', video, 'Video');
        const landscape = util.el('div', 'hm-landscape', video);
        util.el('span', '', landscape, '▶');
        const videoControls = util.el('div', 'hm-video-time', landscape);
        util.el('small', '', videoControls, '0:00 / 12:14');
        util.el('i', '', videoControls);
        util.el('b', 'hm-cc', videoControls, 'CC');
        util.el('b', 'hm-fullscreen', videoControls, '⛶');
        const scenes = util.el('article', 'hm-card hm-scenes', summary);
        util.el('h2', '', scenes, 'Quick Scenes');
        const sceneGrid = util.el('div', 'hm-scene-grid', scenes);
        for (const [ico, text] of [
          ['⌂', 'Home'],
          ['☾', 'Night'],
          ['☼', 'Focus time'],
          ['♧', 'Relax'],
        ]) {
          const tile = util.el('div', `hm-scene${text === 'Focus time' ? ' selected' : ''}`, sceneGrid);
          const glyph = util.el('b', '', tile);
          icon(glyph, text);
          util.el('span', '', tile, text);
        }
        Object.assign(_c, {
          landscape,
          menu,
          music,
          quick,
          room,
          sceneGrid,
          scenes,
          song,
          summary,
          transport,
          video,
          videoControls,
        });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, summary, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
          summary.append(panel);
        }
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, icon, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const dock = util.el('nav', 'hm-dock', document.body);
        for (const [ico, text] of [
          ['⌂', 'Home'],
          ['♧', 'Climate'],
          ['♟', 'Lights'],
          ['▣', 'Schedules'],
          ['♫', 'Media'],
          ['▧', 'Video'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', `hm-dock-item${text === 'Schedules' ? ' active' : ''}`, dock);
          const glyph = util.el('b', '', item);
          icon(glyph, text);
          util.el('span', '', item, text);
        }
        Object.assign(_c, { dock, stage });
      },
  };

  env.site({
    name: 'design-use-smart-home-scene-03',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
