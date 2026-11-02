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
      if (kind === 'banner') document.querySelector('.ref-task').after(el);
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
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display === 'header' && !nav) util.el('div', 'ref-brand', header, 'Form Builder');
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // retain the original seeded draw
        const title = 'Form Builder';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      util.el('div', 'ref-document-title', header);
      const menu = util.el('div', 'ref-menu-bar', header);
      for (const text of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help']) util.el('span', '', menu, text);
      const toolbar = util.el('div', 'ref-editor-toolbar', header);
      for (const [tool, text, paths] of [
        ['section', 'Add section', ['M5 2h10l5 5v15H5Z', 'M15 2v6h5M8 12h9M8 16h2m3 0h4M8 19h2m3 0h4']],
        ['duplicate', 'Duplicate', ['M8 6h13v16H8Z', 'M17 2H3v16']],
        ['delete', 'Delete', ['M5 7h14v15H5Z', 'M3 4h18M9 4V2h6v2M9 10v9m3-9v9m3-9v9']],
      ]) {
        const b = util.el('button', 'ref-toolbar-item', toolbar);
        b.dataset.tool = tool;
        const svg = util.svg('svg', {viewBox:'0 0 24 24', width:22, height:22, class:'ref-toolbar-icon', fill:'none', stroke:'currentColor', 'stroke-width':1.7, 'stroke-linejoin':'round', 'aria-hidden':'true'}, b);
        for (const d of paths) util.svg('path', {d}, svg);
        util.el('span', '', b, text);
        if (text !== 'Delete') b.addEventListener('click', () => env.log('decoy', {label:text}));
      }
      Object.assign(_c, { menu, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const overview = util.el('aside', 'ref-overview', body);
      util.el('div', 'ref-overview-head', overview, 'Survey Overview');
      util.el('div', 'ref-overview-line', overview, 'Title　　Andersson Snickeri · Member feedback');
      util.el('div', 'ref-overview-line', overview, 'Status　　Draft');
      util.el('div', 'ref-overview-line', overview, 'Created　　Feb 20, 1997');
      util.el('div', 'ref-overview-line', overview, 'Last edited　 Feb 20, 1997');
      util.el('div', 'ref-overview-rule', overview);
      util.el('div', 'ref-overview-subhead', overview, 'Sections　　　3');
      util.el('div', 'ref-overview-line', overview, 'Questions　　 8');
      util.el('div', 'ref-overview-line', overview, 'Estimated time　4 minutes');
      util.el('div', 'ref-overview-rule', overview);
      util.el('div', 'ref-overview-subhead', overview, 'Response summary');
      util.el('div', 'ref-overview-line', overview, 'Total responses　　 0');
      util.el('div', 'ref-overview-line', overview, 'Completed　　　　 0');
      util.el('div', 'ref-overview-line', overview, 'Partial　　　　　 0');
      util.el('div', 'ref-overview-rule', overview);
      util.el('div', 'ref-overview-subhead', overview, 'Response policy');
      util.el('div', 'ref-overview-line', overview, 'Collect email addresses　 No');
      util.el('div', 'ref-overview-line', overview, 'One response per person　No');
      util.el('div', 'ref-overview-line', overview, 'Scheduled closing　　　Not set');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, overview });
    },
  };

  env.site({
    name: 'design-use-form-builder-settings-03',
    template: 'site/base',
    design: { parts },
  });
})();
