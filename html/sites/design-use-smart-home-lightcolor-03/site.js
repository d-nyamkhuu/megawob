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
      const titlebar = document.querySelector('.ref-task');
      if (kind === 'banner' || kind === 'toast') el.style.top = (titlebar.getBoundingClientRect().bottom + (kind === 'toast' ? 12 : 0)) + 'px';
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
    'frame.placement': (base, S) => function (_c) {
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
      const menu = util.el('div', 'gem-menu', document.body);
      const atari = util.svg('svg', { viewBox:'0 0 26 26', class:'gem-mark', 'aria-hidden':'true' }, menu);
      util.svg('path', { d:'M12 1v24M8 1v10c0 6-3 10-7 12M16 1v10c0 6 3 10 8 12', fill:'none', stroke:'currentColor', 'stroke-width':3 }, atari);
      for (const item of ['Desk', 'File', 'Edit', 'View', 'Control', 'Help']) util.el('span', 'gem-menu-item', menu, item);
      util.el('span', 'gem-clock', menu, '▣　Mon  Apr 28  10:24');
      Object.assign(_c, { atari, collide, cr, decoys, label, menu, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winTools = util.el('div', 'gem-window-tools', header);
      for (const [mark, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close window']]) {
        const control = util.el('button', 'gem-window-control', winTools, mark);
        control.type = 'button';
        control.setAttribute('aria-label', label);
        control.title = label;
        control.addEventListener('click', (e) => e.preventDefault());
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, winTools });
    },
    'frame.body': (base, S) => function (_c) {
      const { display, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.dataset.instruction = display;
      const status = util.el('aside', 'home-status', body);
      util.el('strong', 'home-status-title', status, 'Home Status');
      util.el('div', 'home-online', status, '●  All Systems Online');
      for (const [icon, count, label] of [['♧', '4', 'Lights On'], ['♙', '3', 'Rooms'], ['▷', '1', 'Media Active'], ['▦', '2', 'Schedules']]) {
        const row = util.el('div', 'home-count', status);
        util.el('span', 'home-count-icon', row, icon);
        const val = util.el('span', 'home-count-value', row);
        util.el('b', '', val, count);
        util.el('small', '', val, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, status });
    },
    'frame.toast': (base, S) => function (_c) {
      const { body, closeLabel, ctx, display, util } = _c;
      const media = util.el('section', 'home-media-strip', body);
      const queue = util.el('section', 'home-media-pane home-queue-pane', media);
      util.el('div', 'home-media-title', queue, 'Music Queue');
      const tracks = util.el('div', 'home-track-list', queue);
      for (const [n, title, time] of [['1','Sunlit Terrace','3:42'],['2','Harbor Lights','4:18'],['3','Willow Creek','5:06'],['4','Night Drive','4:33'],['5','Cedar Road','3:27']]) {
        const row = util.el('div', 'home-track-row', tracks);
        util.el('span', 'home-track-number', row, n);
        util.el('span', 'home-track-name', row, title);
        util.el('span', 'home-track-time', row, time);
      }
      const queueControls = util.el('div', 'home-play-controls', queue);
      const transport = (parent, kind) => {
        const control = util.el('span', 'home-play-button', parent);
        const svg = util.svg('svg', { viewBox:'0 0 24 24', 'aria-hidden':'true' }, control);
        const paths = { previous:'M5 4h3v16H5ZM18 4v16L7 12Z', play:'M6 2v20l15-10Z', next:'M16 4h3v16h-3ZM6 4l11 8-11 8Z', stop:'M5 5h14v14H5ZM8 8v8h8V8Z' };
        util.svg('path', { d:paths[kind], fill:'currentColor', 'fill-rule':'evenodd' }, svg);
      };
      for (const kind of ['previous','play','next']) transport(queueControls, kind);
      const scroll = util.el('div', 'home-queue-scrollbar', queue);
      util.el('span', 'home-scroll-arrow', scroll, '▲');
      util.el('span', 'home-scroll-thumb', scroll);
      util.el('span', 'home-scroll-arrow', scroll, '▼');
      const video = util.el('section', 'home-media-pane home-video-pane', media);
      util.el('div', 'home-media-title', video, 'Video Player');
      util.el('div', 'home-video-name', video, 'Riverstone');
      util.el('div', 'home-video-picture', video);
      const timeline = util.el('div', 'home-video-timeline', video);
      util.el('span', 'home-video-track', timeline);
      util.el('span', 'home-video-time', timeline, '12:36 / 45:20');
      const videoControls = util.el('div', 'home-play-controls home-video-controls', video);
      for (const kind of ['previous','play','next','stop']) transport(videoControls, kind);
      const summary = util.el('aside', 'home-summary', body);
      const conditions = util.el('section', 'home-summary-card', summary);
      util.el('div', 'home-summary-title', conditions, '♙  Room Conditions');
      util.el('div', 'home-summary-row', conditions, 'Temperature                 20.5 °C');
      util.el('div', 'home-summary-row', conditions, 'Humidity                         45%');
      util.el('div', 'home-summary-row', conditions, 'Air Quality                     Good');
      const activity = util.el('section', 'home-summary-card home-activity', summary, '▮  Today’s Activity');
      util.el('div', 'home-summary-row', activity, 'Lights On                          4 / 8');
      util.el('div', 'home-summary-row', activity, 'Rooms Online                   3 / 3');
      util.el('div', 'home-summary-row', activity, 'Media Active                    1 / 2');
      util.el('div', 'home-summary-row', activity, 'Schedules                        2 / 4');
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('span', 'gem-note-info', note, 'i');
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
      Object.assign(_c, { activity, conditions, media, queue, queueControls, scroll, summary, timeline, tracks, transport, video, videoControls });
    },
    'frame.footer': (base, S) => function (_c) {
      const { body, collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const dock = util.el('nav', 'home-dock', body);
      const railPaths = {
        Home: 'M2 11 12 2l10 9M4 9v13h6v-8h5v8h5V9M5 7V3h3v2',
        Lights: 'M8 17C8 12 4 12 5 7a7 7 0 0 1 14 0c1 5-3 5-3 10ZM8 17h8v3H8ZM10 22h4',
        Climate: 'M9 15V5a3 3 0 0 1 6 0v10a5 5 0 1 1-6 0ZM12 6v12m-1 1h2',
        Schedules: 'M3 5h18v17H3ZM3 10h18M7 2v6m10-6v6M7 13h2m3 0h2m3 0h1M7 17h2m3 0h2m3 0h1',
        Music: 'M9 18V5l11-3v14M9 8l11-3M9 18c0 3-7 4-7 1s7-4 7-1m11-2c0 3-7 4-7 1s7-4 7-1',
        Video: 'M3 2h18v20H3ZM7 2v20M17 2v20M3 7h4m10 0h4M3 12h4m10 0h4M3 17h4m10 0h4',
      };
      for (const [icon, text] of [['◆','Home'], ['♧','Lights'], ['♙','Climate'], ['▦','Schedules'], ['♫','Music'], ['▤','Video']]) {
        const item = util.el('div', text === 'Home' ? 'home-dock-item active' : 'home-dock-item', dock);
        const glyph = util.svg('svg', { viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.8, class:'home-dock-icon', 'aria-hidden':'true' }, item);
        util.svg('path', { d:railPaths[text] }, glyph);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { dock, railPaths, submit });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) body.style.setProperty('--gem-panel-height', (taskPanel.getBoundingClientRect().height + 24) + 'px');
      Object.assign(_c, { submit, taskPanel });
    },
  };

  env.site({
    name: 'design-use-smart-home-lightcolor-03',
    template: 'site/base',
    design: { parts },
  });
})();
