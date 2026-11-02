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
        if (kind === 'banner') document.querySelector('.ref-task').insertAdjacentElement('afterend', el);
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') util.el('div', 'ref-promo-title', box, 'Stay in the Loop');
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
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('ref-panel-mode', display === 'panel');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('ref-window-title');
        util.el('span', 'ref-app-mark', header, '⌂');
        util.el('span', 'ref-window-name', header, 'Home & Media Console');
        const windowButtons = util.el('div', 'ref-window-buttons', header);
        for (const symbol of ['−', '□', '×']) util.el('span', '', windowButtons, symbol);
        S.frameBrand(_c, header);
        Object.assign(_c, { header, windowButtons });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const menu = util.el('nav', 'ref-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Controls', 'Tools', 'Help'])
          util.el('span', 'ref-menuitem', menu, item);
        const quick = util.el('div', 'ref-quickbar', document.body);
        for (const [icon, title] of [
          [
            '<svg viewBox="0 0 32 32"><path d="M3 15 16 4l13 11v13H19v-9h-6v9H3z" fill="#f8fbff" stroke="#173f70" stroke-width="2"/><path d="m2 15 14-12 14 12" fill="none" stroke="#173f70" stroke-width="3"/></svg>',
            'Home',
          ],
          [
            '<svg viewBox="0 0 32 32"><path d="M11 20c0-4-4-5-4-10a9 9 0 0 1 18 0c0 5-4 6-4 10z" fill="#ffe27a" stroke="#624c16" stroke-width="2"/><path d="M12 23h8m-7 4h6" stroke="#534a35" stroke-width="2"/></svg>',
            'Lights',
          ],
          [
            '<svg viewBox="0 0 32 32"><path d="M14 5a4 4 0 0 1 8 0v14a8 8 0 1 1-8 0z" fill="#f4f7fb" stroke="#253f60" stroke-width="2"/><path d="M18 9v15" stroke="#d63836" stroke-width="4"/><circle cx="18" cy="24" r="4" fill="#d63836"/></svg>',
            'Climate',
          ],
          [
            '<svg viewBox="0 0 32 32"><path d="M12 24V6l16-3v19M12 12l16-3" fill="none" stroke="#102d68" stroke-width="4"/><path d="M13 24V6l14-2v18" fill="none" stroke="#417ce0" stroke-width="2"/><ellipse cx="8" cy="25" rx="5" ry="4" fill="#3268c6" stroke="#102d68"/><ellipse cx="23" cy="23" rx="5" ry="4" fill="#3268c6" stroke="#102d68"/></svg>',
            'Media',
          ],
          [
            '<svg viewBox="0 0 32 32"><rect x="4" y="3" width="24" height="27" fill="#1e335b" stroke="#101d3d" stroke-width="2"/><path d="M11 5h10v10H11zm0 12h10v10H11z" fill="#a7c9ee"/><path d="M6 5h3v4H6zm0 7h3v4H6zm0 7h3v4H6zm0 7h3v2H6zm17-21h3v4h-3zm0 7h3v4h-3zm0 7h3v4h-3zm0 7h3v2h-3z" fill="#e7f2ff"/></svg>',
            'Video',
          ],
          [
            '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#fff" stroke="#263d59" stroke-width="2"/><path d="M16 8v9l6 4" fill="none" stroke="#263d59" stroke-width="2.5"/></svg>',
            'Schedules',
          ],
        ]) {
          const item = util.el('div', 'ref-quickitem', quick);
          util.el('span', 'ref-quickicon', item).innerHTML = icon;
          util.el('span', '', item, title);
        }
        Object.assign(_c, { menu, quick });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        // The console remains visible behind the editor, like a desktop utility app.
        const consoleBg = util.el('div', 'home-console-bg', body);
        const scenes = util.el('section', 'home-scenes', consoleBg);
        util.el('h2', '', scenes, 'Scheduled Scenes');
        const sceneTable = util.el('table', '', scenes);
        sceneTable.innerHTML =
          '<thead><tr><th>Name</th><th>Time</th><th>Days</th></tr></thead><tbody><tr><td>Morning</td><td>06:30</td><td>Mon, Tue, Wed, Thu, Fri</td></tr><tr><td>Evening</td><td>18:00</td><td>Mon, Tue, Wed, Thu, Fri</td></tr><tr><td>Movie Night</td><td>20:00</td><td>Sat, Sun</td></tr><tr><td>Bedtime</td><td>22:30</td><td>Every day</td></tr><tr><td>Away</td><td>All day</td><td>Every day</td></tr><tr><td>Focus time</td><td>07:35</td><td>Mon, Tue, Thu, Sat, Sun</td></tr><tr><td>Relax</td><td>19:00</td><td>Mon, Wed, Fri</td></tr></tbody>';
        const sceneActions = util.el('div', 'home-panel-actions', scenes);
        for (const label of ['Add...', 'Edit...', 'Delete']) util.el('button', '', sceneActions, label);
        const rooms = util.el('section', 'home-rooms', consoleBg);
        util.el('h2', '', rooms, 'Room Controls');
        for (const [room, temp, devices] of [
          [
            'Living Room',
            21,
            [
              ['Ceiling light', 'ceiling', 50],
              ['Reading lamp', 'lamp', 26],
              ['Media speaker', 'speaker', 26],
            ],
          ],
          ['Hallway', 18, [['Hall light', 'ceiling', 80]]],
        ]) {
          const article = util.el('article', '', rooms);
          util.el('b', '', article, room);
          const temperature = util.el('div', 'home-temperature', article);
          util.el('span', '', temperature, 'Temperature:');
          const readout = util.el('span', 'home-temp-value', temperature, temp + ' °C');
          util.el('span', 'home-spin', readout, '▴\n▾');
          for (const [name, kind, value] of devices) {
            const device = util.el('div', 'home-device', article);
            util.el('span', 'device-art ' + kind, device);
            const control = util.el('div', 'home-device-control', device);
            util.el('span', '', control, name);
            const slider = util.el('div', 'home-slider', control);
            slider.style.setProperty('--value', value + '%');
            util.el('span', 'home-slider-knob', slider);
            const symbol = util.el('span', 'home-slider-symbol', device);
            symbol.innerHTML =
              kind === 'speaker'
                ? '<svg viewBox="0 0 32 32"><path d="M3 12h5l8-7v22l-8-7H3z" fill="#7da3cd" stroke="#142b4f" stroke-width="1.6"/><path d="M20 10q7 6 0 12m4-16q11 10 0 20" fill="none" stroke="#142b4f" stroke-width="1.8"/></svg>'
                : '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="5" fill="#7b96ba" stroke="#213951" stroke-width="1.5"/><path d="M16 2v6m0 16v6M2 16h6m16 0h6M6 6l4 4m12 12 4 4M6 26l4-4M22 10l4-4" stroke="#213951" stroke-width="1.5"/></svg>';
          }
        }
        const queue = util.el('section', 'home-queue', consoleBg);
        util.el('h2', '', queue, 'Music Queue');
        queue.innerHTML +=
          '<table><tr><th>#</th><th>Title</th><th>Artist</th><th>Album</th><th>Length</th></tr><tr><td>1</td><td>Sunlit Roads</td><td>The Maple Keys</td><td>Horizons</td><td>3:24</td></tr><tr><td>2</td><td>Quiet Mind</td><td>Amara</td><td>Still Life</td><td>4:13</td></tr><tr><td>3</td><td>River &amp; Stone</td><td>The Maple Keys</td><td>Horizons</td><td>5:02</td></tr><tr><td>4</td><td>Paper Planes</td><td>Lunar West</td><td>Night Drive</td><td>3:56</td></tr><tr><td>5</td><td>Further On</td><td>Amara</td><td>Still Life</td><td>4:28</td></tr></table>';
        const queueActions = util.el('div', 'home-queue-actions', queue);
        for (const label of ['Add...', 'Remove', 'Move Up', 'Move Down']) {
          const b = util.el('button', '', queueActions, label);
          b.disabled = label.startsWith('Move');
        }
        const player = util.el('section', 'home-video', consoleBg);
        util.el('h2', '', player, 'Video Player');
        player.innerHTML +=
          '<div class="home-video-inner"><div class="home-landscape"></div><div class="home-video-controls"><b>The Quiet Valley</b><p>12:17 / 52:36</p><div class="home-progress"><i></i></div><div class="home-transport"><button>▶</button><button>■</button><button>Ⅰ◀</button><button>▶Ⅰ</button><span>◖))</span><div class="home-slider" style="--value:38%"><span class="home-slider-knob"></span></div></div></div></div>';
        Object.assign(_c, { consoleBg, player, queue, queueActions, rooms, sceneActions, sceneTable, scenes });
      },
  };

  env.site({
    name: 'design-use-smart-home-scene-01',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
