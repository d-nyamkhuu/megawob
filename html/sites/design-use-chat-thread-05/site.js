// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      accent = '#ff7425';
      for (const [k, v] of Object.entries({bg:'#f4f5f7', panel:'#ffffff', fg:'#27364c', muted:'#768092', line:'#d9dde4', accent})) root.style.setProperty(`--${k}`, v);
      root.dataset.theme = name;
      const portraitUrl = new URL('sites/design-use-chat-thread-05/assets/chat-portraits-v2.png', window.location.href);
      root.style.setProperty('--avatar-image', `url("${portraitUrl.href}")`);
      Object.assign(_c, { accent, content, name, portraitUrl, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      let wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = true;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      if (!ctx.finish && rng.fork('rivermere/end').bool(0.55)) {
        placement = 'footer'; label = 'Confirm'; wantFooter = true;
      }
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
        const brand = util.el('div', 'ref-brand', header, 'Rivermere');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Messages', 'Meetings', 'Files', 'People']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const search = util.el('div', 'rv-search', header, '⌕  Search Rivermere');
      const native = util.el('div', 'rv-native', header);
      util.el('span', 'rv-help', native, '?');
      util.el('span', 'rv-account', native, 'CH');
      util.el('span', 'rv-window', native, '—');
      util.el('span', 'rv-window', native, '□');
      util.el('span', 'rv-window', native, '×');
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        util.el('div', 'ref-side-heading', side, 'CHANNELS');
        for (const item of ['#  announcements', '#  general', '#  product', '#  engineering', '#  field-notes', '#  design', '#  marketing', '#  customer-success', '#  random']) {
          const a = util.el('a', 'ref-sidelink ref-channel', side, item);
          if (item.includes('field-notes')) a.classList.add('ref-selected');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        util.el('div', 'ref-side-heading', side, 'DIRECT MESSAGES');
        for (const [i, item] of ['Avery Chen', 'Ben Patel', 'Priya Shah', 'Marcus Lee', 'Elena Park', 'Timur Abdullaev', 'Daniel Kim', 'Sara Nguyen'].entries()) {
          const a = util.el('a', 'ref-sidelink ref-dm', side);
          const presence = util.el('span', 'rv-presence', a);
          presence.style.background = i === 2 ? '#ffb322' : [3,6,7].includes(i) ? '#9ba1aa' : '#68bd65';
          util.el('span', '', a, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const related = util.el('aside', 'ref-related', body);
      Object.assign(_c, { stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-chat-thread-05',
    template: 'site/base',
    design: { parts },
  });
})();
