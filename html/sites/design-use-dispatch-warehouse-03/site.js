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
      if (kind === 'banner') document.body.insertBefore(el, document.querySelector('.ref-body'));
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
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.dataset.instruction = display;

      // Period desktop application frame: Windows title strip and menu row.
      const win = util.el('div', 'wh-windowbar', document.body);
      util.el('span', 'wh-appicon', win, '▧');
      util.el('span', 'wh-windowtitle', win, 'Warehouse Planner - East Distribution Center');
      const winControls = util.el('div', 'wh-windowcontrols', win);
      util.el('span', '', winControls, '−');
      util.el('span', '', winControls, '□');
      util.el('span', 'wh-close', winControls, '×');
      const menu = util.el('div', 'wh-menubar', document.body);
      const navItems = [
        ['Shipments', '<path d="M4 13h19l4-6h7v15H4z"/><path d="M8 13V8h12v5M27 13V7h4l4 6"/><circle cx="11" cy="25" r="3.5"/><circle cx="29" cy="25" r="3.5"/>'],
        ['Storage', '<path d="M14 2h13v15H14zM4 19h14v16H4zM22 19h14v16H22zM18 2v6h5V2M8 19v6h6v-6M26 19v6h6v-6M8 31h5M26 31h5M18 13h5"/>'],
        ['Receiving', '<path d="M10 4h18l5 5v26H10zM28 4v6h5M15 16h13M15 21h13M15 26h10"/><path d="M4 17v15M1 29l3 3 3-3"/>'],
        ['Dispatch', '<path d="M9 5h20v31H9zM15 3h8v5h-8zM14 15h3M20 15h5M14 22h3M20 22h5M14 29l3 3 7-8"/>'],
        ['Reports', '<path d="M5 35h31M8 31V20h6v11M18 31V12h6v19M28 31V5h6v26"/>'],
        ['Configuration', '<path d="M25 5a10 10 0 0 0-12 12L4 26l10 10 9-9a10 10 0 0 0 12-12l-6 6-7-7z"/><circle cx="13" cy="29" r="1.5"/>'],
      ];
      for (const [label, drawing] of navItems) {
        const item = util.el('span', 'wh-navitem', menu);
        const icon = util.el('span', 'wh-nav-icon', item);
        icon.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true">${drawing}</svg>`;
        util.el('span', 'wh-nav-label', item, label);
      }
      Object.assign(_c, { H, W, display, menu, navItems, roomy, tall, win, winControls });
    },
  };

  env.site({
    name: 'design-use-dispatch-warehouse-03',
    template: 'site/base',
    design: { parts },
  });
})();
