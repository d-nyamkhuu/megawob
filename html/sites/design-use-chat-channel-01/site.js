// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
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
      document.body.classList.toggle('ref-header-note', display === 'header');
      document.body.classList.toggle('ref-panel-note', display === 'panel');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'channel-tips', body);
      util.el('span', 'channel-tips-icon', tips, 'i');
      const tipText = util.el('div', '', tips);
      util.el('b', '', tipText, 'Tips: ');
      util.el('span', '', tipText, 'Use Channel Settings to rename the channel, update the topic, and manage members. You can invite people to this channel and set up breakout rooms when you start a meeting.');

      // The channel-era design uses a compact global dock rather than workspace rails.
      const dock = util.el('nav', 'channel-dock', document.body);
      const dockItems = [['home', 'Home'], ['people', 'Channels'], ['calendar', 'Meetings'], ['file', 'Files'], ['tasks', 'Tasks'], ['help', 'Help']];
      const dockArt = {
        home: '<path d="M3 12c0-5 4-8 10-8s10 3 10 8-4 8-10 8H8l-5 3 1-6z"/>',
        people: '<circle cx="13" cy="7" r="4"/><circle cx="4" cy="10" r="3"/><circle cx="22" cy="10" r="3"/><path d="M6 23v-5c0-5 14-5 14 0v5zM0 22v-5c0-3 5-5 7-2l-3 7zM22 22l-3-7c2-3 7-1 7 2v5z"/>',
        calendar: '<path fill-rule="evenodd" d="M3 5h20v20H3zm3 6v3h3v-3zm5 0v3h3v-3zm5 0v3h3v-3zm-10 5v3h3v-3zm5 0v3h3v-3zm5 0v3h3v-3z"/><path d="M6 2h3v6H6zm11 0h3v6h-3z"/>',
        file: '<path d="M5 2h11l7 7v17H5z"/><path d="M16 2v8h7" fill="none" stroke="#587fa8"/>',
        tasks: '<rect x="3" y="3" width="22" height="22" rx="2"/><path d="m7 13 5 5 9-10" fill="none" stroke="#587fa8" stroke-width="3"/>',
        help: '<circle cx="14" cy="14" r="12"/><path d="M10 10c0-6 10-6 9 0 0 3-5 3-5 7m0 2v3" fill="none" stroke="#587fa8" stroke-width="3"/>',
      };
      for (const [icon, title] of dockItems) {
        const item = util.el('div', 'channel-dock-item', dock);
        const svg = util.svg('svg', { viewBox: '0 0 28 28', width: 28, height: 28, 'aria-hidden': 'true' }, item);
        svg.innerHTML = dockArt[icon];
        util.el('span', '', item, title);
      }
      Object.assign(_c, { dock, dockArt, dockItems, stage, tipText, tips });
    },
  };

  env.site({
    name: 'design-use-chat-channel-01',
    template: 'site/base',
    design: { parts },
  });
})();
