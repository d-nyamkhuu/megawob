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
      const sidebar = true;
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
      if (display !== 'header' || nav) {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, '▣  TeamChat - Acme Corp');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['File', 'Edit', 'View', 'Go', 'Channel', 'Meeting', 'Tools', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
        const toolbar = util.el('div', 'ref-toolbar', header);
        for (const [icon, item] of [['▢','New Chat'], ['♟','New Meeting'], ['▣','Share Screen'], ['♟','Add People'], ['▥','Channels'], ['☑','Preferences']]) {
          const b = util.el('button', 'ref-tool-button', toolbar, `${icon}　${item}`);
          b.type = 'button'; b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: item }));
        }
        const tabs = util.el('div', 'ref-tabs', header);
        for (const item of ['# general', '# field-notes', '# product', '# design', '# marketing', '+']) {
          const a = util.el('a', `ref-tab${item === '# field-notes' ? ' ref-tab-active' : ''}`, tabs, item);
          a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'channel', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        util.el('div', 'ref-side-workspace', side, 'Rivermere Designs');
        for (const item of ['Threads', 'Mentions', 'Saved', 'More']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        util.el('div', 'ref-side-heading', side, 'Channels');
        for (const item of ['#  general', '#  announcements', '#  design-lab', '#  marketing', '#  product', '#  random']) {
          const a = util.el('a', 'ref-sidelink ref-channel', side, item);
          if (item.includes('design-lab')) a.classList.add('ref-selected');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        util.el('div', 'ref-side-heading', side, 'Direct messages');
        for (const item of ['●  Avery Chen', '●  Jordan Patel', '●  Shirin Tehrani', '●  Taylor Kim', '●  Morgan Lee']) {
          const a = util.el('a', 'ref-sidelink ref-dm', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        const tip = util.el('div', 'ref-tip', side);
        util.el('strong', '', tip, '☼  Tips');
        util.el('div', '', tip, '• Click a message’s reply icon to view or add to a thread.');
        util.el('div', '', tip, '• Threads keep discussions organized and out of the main channel.');
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'ref-stats', body);
      util.el('strong', '', stats, 'Channel Details');
      util.el('div', 'ref-channel-title', stats, '▣　# field-notes');
      util.el('div', 'ref-channel-desc', stats, 'Field research, site visits, and customer observations');
      util.el('div', 'ref-stat-row', stats, '♧　8 members');
      util.el('div', 'ref-stat-row', stats, '▤　12 files');
      util.el('div', 'ref-stat-row', stats, '↗　3 links');
      util.el('div', 'ref-stat-row', stats, '⚙　Channel settings');
      util.el('hr', '', stats);
      util.el('strong', '', stats, 'Members (8)');
      for (const person of ['Alex Chen','Sofía Vo','Daniel Park','Priya Desai','Marcus Lee','Elena Ruiz','Tomás Rivera','Nina Patel']) util.el('div', 'ref-member', stats, `●　${person}`);
      util.el('hr', '', stats);
      util.el('strong', '', stats, 'Upcoming Meeting');
      util.el('div', 'ref-stat-row', stats, '▦　Field Notes Sync');
      util.el('div', 'ref-stat-row', stats, '　　 Today 2:00 PM – 2:30 PM');
      util.el('hr', '', stats);
      util.el('strong', '', stats, 'Channel Activity (Last 7 Days)');
      util.el('div', 'ref-stat-row', stats, '☏　24 messages');
      util.el('div', 'ref-stat-row', stats, '▤　5 files');
      util.el('div', 'ref-stat-row', stats, '♧　3 new members');

      Object.assign(_c, { stage, stats });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-chat-thread-03',
    template: 'site/base',
    design: { parts },
  });
})();
