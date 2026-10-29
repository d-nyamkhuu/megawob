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
      let copy = box;
      if (kind === 'promo') {
        const art = util.el('div', 'lh-envelope-art', box);
        const svg = util.svg('svg', { viewBox:'0 0 160 160', 'aria-hidden':'true' }, art);
        util.svg('circle', { cx:80, cy:85, r:67, fill:'#f3f5ff' }, svg);
        util.svg('circle', { cx:80, cy:87, r:45, fill:'#b9c4ff' }, svg);
        const envelope = util.svg('g', { transform:'rotate(-12 80 85)' }, svg);
        util.svg('rect', { x:42, y:54, width:77, height:66, rx:9, fill:'#647bff' }, envelope);
        util.svg('path', { d:'M47 64h67v47H47z', fill:'#fff' }, envelope);
        util.svg('path', { d:'m45 63 35 28 36-28M46 114l24-24m47 24L93 90', fill:'none', stroke:'#acb7ff', 'stroke-width':3 }, envelope);
        util.svg('path', { d:'m59 18 5 12m17-16 1 13m20-8-6 11', fill:'none', stroke:'#f7cd46', 'stroke-width':5, 'stroke-linecap':'round' }, svg);
        copy = util.el('div', 'lh-promo-copy', box);
        util.el('h3', '', copy, 'Stay in the know');
      }
      if (kind === 'chat') util.el('strong', 'lh-chat-heading', box, 'Need help?');
      util.el('div', 'ref-ov-text', copy, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', copy);
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
      if (kind === 'chat') util.el('div', 'lh-chat-compose', box, 'Type a message…');
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = ctx.size?.width || ctx.size?.w || window.innerWidth;
      const H = ctx.size?.height || ctx.size?.h || window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, display, local, lr, rng, roomy, tall, util, word } = _c;
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
      document.body.dataset.instruction = display;
      const rail = util.el('aside', 'lh-rail', document.body);
      const iconPaths = {
        LearnHub: 'M2 8 12 3l10 5-10 5L2 8Zm4 3v6c4 3 8 3 12 0v-6M22 8v9',
        Home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
        Courses: 'M5 3h15v18H5a3 3 0 0 1 0-6h15M5 3a3 3 0 0 0-3 3v12M8 6h4v5H8m7-5h2m-9 8h9',
        Assignments: 'M5 3h14a1 1 0 0 1 1 1v17H4V4a1 1 0 0 1 1-1Zm3 4h8M8 11h8m-8 4h5',
        Grades: 'M5 3h14v18H5V3Zm3 5h2m3 0h3m-8 4h2m3 0h3m-8 4h2m3 0h3',
        People: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-3a6 6 0 0 1 12 0v3H2Zm14-17a4 4 0 0 1 0 8m1 3a5 5 0 0 1 5 5v1h-5',
        Calendar: 'M3 5h18v16H3V5Zm4-3v6m10-6v6M3 10h18m-14 3h1m3 0h1m3 0h1m-9 4h1m3 0h1',
        Inbox: 'M4 3h16l1 18H3L4 3Zm-1 12h5l2 3h4l2-3h5M7 7h10M7 11h7',
        Files: 'M5 2h9l6 6v14H5V2Zm9 0v6h6',
        Rubrics: 'M3 3h18v18H3V3Zm7 0v18M6 7h1m6 0h5m-12 5h1m6 0h5m-12 5h1m6 0h5',
        Modules: 'M6 5h15M6 12h15M6 19h12M2 4h1v2H2V4Zm0 7h1v2H2v-2Zm0 7h1v2H2v-2Zm18 0h2v2h-2v-2Z',
        Settings: 'm9 3 1-2h4l1 2 3 2 2 1v4l-2 1-1 3 1 2-3 3-2-1h-3l-2 1-3-3 1-2-1-3-2-1V6l2-1 3-2Zm3 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
      };
      const railIcon = (parent, name) => {
        const svg = util.svg('svg', { viewBox:'0 0 24 24', 'aria-hidden':'true' }, parent);
        if (name === 'LearnHub') {
          svg.setAttribute('viewBox', '0 1 24 22');
          util.svg('path', { d:'M0 7 12 1l12 6-12 6L0 7Z' }, svg);
          util.svg('path', { d:'M4 10v8l8 4 8-4v-8l-8 4-8-4Z' }, svg);
          util.svg('path', { d:'M23 7v12', style:'fill:none;stroke:#505d70;stroke-width:1.5' }, svg);
        } else util.svg('path', { d:iconPaths[name] }, svg);
      };
      const railBrand = util.el('div', 'lh-brand', rail);
      railIcon(railBrand, 'LearnHub');
      util.el('strong', '', railBrand, 'LearnHub');
      const railNav = util.el('nav', 'lh-rail-nav', rail);
      for (const text of ['Home', 'Courses', 'Assignments', 'Grades', 'People', 'Calendar', 'Inbox', 'Files', 'Rubrics', 'Modules', 'Settings']) {
        const item = util.el('a', `lh-rail-item${text === 'Courses' ? ' active' : ''}`, railNav);
        railIcon(item, text);
        util.el('span', '', item, text);
        item.addEventListener('click', () => env.log('decoy', { what:'navigation', label:text }));
      }
      Object.assign(_c, { collide, cr, decoys, iconPaths, label, nav, placement, rail, railBrand, railIcon, railNav, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const lhHead = util.el('div', 'lh-head', header);
      const crumbs = util.el('div', 'lh-crumbs', lhHead);
      for (const text of ['English 101', '›', 'Rubrics', '›', 'Analytical Essay']) util.el('span', '', crumbs, text);
      util.el('div', 'lh-title', lhHead, 'Analytical Essay Rubric');
      const lhTabs = util.el('div', 'lh-tabs', lhHead);
      for (const tab of ['Students', 'Rubric', 'Details']) util.el('span', tab === 'Students' ? 'lh-tab active' : 'lh-tab', lhTabs, tab);
      S.frameBrand(_c, header);
      Object.assign(_c, { crumbs, header, lhHead, lhTabs });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, lhHead, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', lhHead, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
    },
    'frame.toast': (base, S) => function (_c) {
      const { W, closeLabel, ctx, display, lhHead, util } = _c;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
        lhHead.style.minHeight = `${Math.max(W <= 1100 ? 129 : W <= 1400 ? 144 : 169, note.getBoundingClientRect().height + 80)}px`;
      }
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      document.body.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-course-admin-rubric-02',
    template: 'site/base',
    design: { parts },
  });
})();
