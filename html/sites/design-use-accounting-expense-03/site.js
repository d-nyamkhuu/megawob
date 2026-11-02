// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#edf3fc', panel: '#f7f9fc', fg: '#101b38', muted: '#506583', line: '#b4c5dc' },
    dark: { bg: '#edf3fc', panel: '#f7f9fc', fg: '#101b38', muted: '#506583', line: '#b4c5dc' },
    warm: { bg: '#edf3fc', panel: '#f7f9fc', fg: '#101b38', muted: '#506583', line: '#b4c5dc' },
  };

  const ACCENTS = ['#1688ff', '#1688ff', '#1688ff', '#1688ff', '#1688ff', '#1688ff'];

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      if (kind === 'banner') document.body.insertBefore(el, document.querySelector('.ref-body'));
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
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = ctx.size ? ctx.size.width : window.innerWidth;
      const H = ctx.size ? ctx.size.height : window.innerHeight;
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
      const titlebar = util.el('div', 'aqua-titlebar', document.body);
      const lights = util.el('div', 'aqua-lights', titlebar);
      for (const color of ['red', 'yellow', 'green']) util.el('i', color, lights);
      util.el('div', 'aqua-window-title', titlebar, 'LedgerWorks');
      const search = util.el('div', 'aqua-search', titlebar, '⌕  Search');
      search.setAttribute('aria-hidden', 'true');
      Object.assign(_c, { collide, cr, decoys, label, lights, nav, placement, search, sidebar, titlebar, wantFooter });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'aqua-inspector', body);
      util.el('div', 'aqua-inspector-title', inspector, 'Receipt Inspector');
      const fileInfo = util.el('section', '', inspector);
      util.el('h3', '', fileInfo, 'File Info');
      for (const [key, value] of [['File Name:', 'receipt.jpg'], ['Kind:', 'JPEG image'], ['Size:', '412 KB'], ['Created:', 'Mar 3, 2004 8:31 AM'], ['Modified:', 'Mar 3, 2004 8:31 AM']]) {
        const row = util.el('div', 'aqua-inspector-row', fileInfo); util.el('span', '', row, key); util.el('span', key === 'File Name:' ? 'aqua-inspector-filename' : '', row, value);
      }
      const info = util.el('section', '', inspector);
      util.el('h3', '', info, 'Image');
      for (const [key, value] of [['Dimensions:', '1700 × 2200'], ['Color Space:', 'RGB'], ['Resolution:', '300 dpi']]) {
        const row = util.el('div', 'aqua-inspector-row', info); util.el('span', '', row, key); util.el('span', '', row, value);
      }
      const notes = util.el('section', 'aqua-inspector-notes', inspector);
      util.el('h3', '', notes, 'Notes');
      const notesBox = util.el('textarea', '', notes);
      notesBox.setAttribute('aria-label', 'Receipt notes');
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) inspector.insertBefore(taskPanel, fileInfo);
      Object.assign(_c, { fileInfo, info, inspector, notes, notesBox, stage, taskPanel });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const dock = util.el('nav', 'aqua-dock', document.body);
      const dockItems = [['⌂','Overview'],['♜','Bank Feed'],['⇄','Reconcile'],['▣','Ledger'],['▤','Journal'],['▧','Expenses'],['✉','Payables'],['▥','Reports']];
      const dockPaths = [
        ['M3 18L20 3l17 15-4 1-3-3v21H10V16l-4 4z','M15 37V25h10v12M16 15h8v6h-8zM28 5v8'],
        ['M3 15L20 4l17 11zM6 34h28v4H6z','M9 17v15m7-15v15m8-15v15m7-15v15M5 16h30'],
        ['M4 9h20V4l11 10-11 9v-6H4z','M36 29H16v-6L5 32l11 7v-5h20'],
        ['M10 4l21 5v28l-21-5zM10 4L6 7v27l4-2','M13 8l15 3v21l-15-3M16 13h3m-3 5h3'],
        ['M5 5h25v32H5z','M9 10h14M9 15h13M9 20h9M9 25h8M20 30l3-8L35 5l4 3-13 19z'],
        ['M9 8l17-4 7 25-20 6z','M5 15l19-5 8 24-20 5zM10 18l13-3m-11 7l12-3m-11 7l13-3m-11 7l7-2'],
        ['M3 9h34v26H3z','M3 10l17 14 17-14M3 35l12-14m22 14L25 21'],
        ['M6 5v32h32','M12 20h5v14h-5zM22 12h5v22h-5zM32 7h5v27h-5z'],
      ];
      for (const [index, [icon, text]] of dockItems.entries()) {
        const item = util.el('div', `aqua-dock-item${text === 'Expenses' ? ' selected' : ''}`, dock);
        const art = util.el('span', 'aqua-dock-icon', item);
        const svg = util.svg('svg', {viewBox:'0 0 42 42', 'aria-hidden':'true'}, art);
        const defs = util.svg('defs', {}, svg), gradient = util.svg('linearGradient', {id:'dock-blue-' + index, x1:'0', x2:'1', y1:'0', y2:'1'}, defs);
        util.svg('stop', {offset:'0', 'stop-color':'#f9fcff'}, gradient); util.svg('stop', {offset:'.5', 'stop-color':'#b6d5f7'}, gradient); util.svg('stop', {offset:'1', 'stop-color':'#5590ce'}, gradient);
        dockPaths[index].forEach((d, n) => util.svg('path', {d, fill:n === 0 ? 'url(#dock-blue-' + index + ')' : 'none', stroke:'#204e7e', 'stroke-width':'1.3', 'stroke-linejoin':'round'}, svg));
        util.el('span', 'aqua-dock-label', item, text);
      }
      Object.assign(_c, { dock, dockItems, dockPaths, submit });
    },
  };

  env.site({
    name: 'design-use-accounting-expense-03',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
