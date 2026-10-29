// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      // This design uses a persistent horizontal app bar and a slim counts inspector.
      const sidebar = false;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'beos-titlebar', document.body);
      document.body.insertBefore(winbar, header);
      util.el('div', 'beos-appmark', winbar, '♟♟');
      util.el('strong', 'beos-title', winbar, 'TeamTalk');
      const wincontrols = util.el('div', 'beos-window-controls', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', wincontrols, glyph);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, '▦  TeamHub');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Chat', 'Teams', 'Meetings', 'Files', 'Calendar']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
        const search = util.el('div', 'chat-search', header, '⌕　 Search messages, people, or files');
        const bell = util.el('div', 'chat-bell', header, '♧');
        const account = util.el('div', 'chat-account', header, '♧　 JD');
        const windowControls = util.el('div', 'chat-window-controls', header);
        for (const glyph of ['−', '□', '×']) util.el('span', '', windowControls, glyph);
      }
      const menu = util.el('div', 'beos-menubar', document.body);
      document.body.insertBefore(menu, header);
      for (const item of ['Channel', 'Edit', 'View', 'Go', 'Meeting', 'Tools', 'Help']) util.el('span', '', menu, item);
      Object.assign(_c, { header, menu, winbar, wincontrols });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'beos-rail', body);
      const railItems = [['◉','Chat'], ['▣','Meetings'], ['♟','People'], ['▰','Files'], ['▤','Channels'], ['▦','Notes'], ['⚙','Settings']];
      railItems.forEach(([icon, title], i) => {
        const item = util.el('div', `beos-rail-item${i === 0 ? ' active' : ''}`, rail);
        util.el('span', 'beos-rail-icon', item, icon);
        util.el('span', '', item, title);
      });
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'chat-stats', body);
      for (const [icon, value] of [['♙', '18'], ['▤', ''], ['⚑', '0'], ['↗', '12']]) {
        const row = util.el('div', 'chat-stat', stats);
        util.el('span', '', row, icon);
        if (value) util.el('span', '', row, value);
      }
      const inspector = util.el('aside', 'beos-inspector', body);
      const tabs = util.el('div', 'beos-inspector-tabs', inspector);
      for (const label of ['About', 'Members (8)', 'Files', 'Meetings']) util.el('span', '', tabs, label);
      const summary = util.el('div', 'beos-channel-summary', inspector);
      util.el('b', 'beos-hash', summary, '#');
      const summaryText = util.el('div', '', summary);
      util.el('strong', '', summaryText, 'Channel overview');
      util.el('div', 'beos-summary-sub', summaryText, 'Site updates, observations, and follow-ups from the field team.');
      const details = util.el('section', 'beos-detail', inspector);
      util.el('strong', 'beos-section-title', details, 'Details');
      [['Type:', 'Public Channel'], ['Created:', 'Mar 3, 1999'], ['Created by:', 'Daniel Cho'], ['Members:', '8'], ['Messages:', '142'], ['Pins:', '0']].forEach(([a,b]) => {
        const row = util.el('div', 'beos-detail-row', details); util.el('span', '', row, a); util.el('span', '', row, b);
      });
      const desc = util.el('section', 'beos-detail', inspector);
      util.el('strong', 'beos-section-title', desc, 'Description');
      util.el('div', 'beos-inset', desc, 'On-site updates, trail conditions, photos, and action items.');
      const notify = util.el('section', 'beos-detail', inspector);
      util.el('strong', 'beos-section-title', notify, 'Notifications');
      util.el('div', 'beos-checkline', notify, '☑　Notify me about new messages');
      const actions = util.el('section', 'beos-actions', inspector);
      util.el('strong', 'beos-section-title', actions, 'Channel Actions');
      ['▲　 Pin a message…', '♟　 Manage channel…', '⚙　 Channel settings…'].forEach((label) => util.el('div', 'beos-action', actions, label));
      Object.assign(_c, { actions, desc, details, inspector, notify, stage, stats, summary, summaryText, tabs });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-chat-pinreact-03',
    template: 'site/base',
    design: { parts },
  });
})();
