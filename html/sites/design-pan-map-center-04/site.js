// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
        if (kind === 'banner' || kind === 'promo') el.style.top = headerBottom + 'px';
        if (kind === 'chat') util.el('strong', 'riverton-chat-title', box, 'Need help?');
        if (kind === 'promo') {
          const hero = util.el('div', 'riverton-promo-hero', box);
          hero.innerHTML =
            '<svg viewBox="0 0 640 165" width="640" height="165" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="rv-sky" x2="0" y2="1"><stop stop-color="#63b9ef"/><stop offset="1" stop-color="#d4f3ff"/></linearGradient></defs><path fill="url(#rv-sky)" d="M0 0h640v165H0z"/><path d="M0 110l70-49 54 22 68-47 78 57 80-40 85 30 65-60 140 90v52H0z" fill="#6298b3"/><path d="M0 125l80-30 89 15 63-33 88 39 80-42 90 21 65-20 85 50v40H0z" fill="#407e8c"/><path fill="#49a7cb" d="M0 123h640v42H0z"/><path d="M0 125q100-50 200-7l-32 20H0z" fill="#96bc77"/><g fill="#fff5d8" stroke="#846557"><path d="M20 103h25v21H20z M52 98h28v27H52z M90 110h26v18H90z M123 101h29v26h-29z"/><path d="M17 103l16-14 15 14M49 98l17-15 17 15M87 110l16-13 16 13M120 101l17-13 18 13" fill="#b55c42"/></g></svg>';
          util.el('strong', 'riverton-promo-title', box, 'Discover Riverton');
        }
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
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = (W >= 1180 && rng.bool(0.5)) || true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        document.body.dataset.instruction = display;
        const windowControls = util.el('div', 'riverton-window-controls', header);
        for (const [symbol, title] of [
          ['−', 'Minimize'],
          ['□', 'Maximize'],
          ['×', 'Close'],
        ]) {
          const control = util.el('span', 'riverton-window-control', windowControls, symbol);
          control.title = title;
        }
        const menu = util.el('div', 'riverton-menu', header);
        for (const label of ['File', 'View', 'Places', 'Tools', 'Help']) util.el('span', '', menu, label);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Riverton Map');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const navIcons = [
            '<circle cx="20" cy="20" r="17" fill="#41b9ef" stroke="#0754b5"/><path d="M8 8l9-4 4 7-5 6-8-2 2 8 8 3 3 10 8-8-2-7 7-6-4-9-5 1-4-4" fill="#c8efae"/>',
            '<circle cx="16" cy="15" r="12" fill="#b7e5ff" stroke="#184c96" stroke-width="3"/><circle cx="16" cy="15" r="8" fill="#e5f7ff" stroke="#69a8db"/><path d="M25 24l10 11" stroke="#184c96" stroke-width="8" stroke-linecap="round"/>',
            '<path d="M3 13h14V3l18 17-18 17V27H3z" fill="#76bf56" stroke="#3e853c"/><path d="M4 14h7v12H4z" fill="#dbe9d4" stroke="#849bb2"/>',
            '<path d="M20 2l5 12 13 1-10 9 3 14-11-7-12 7 3-14-10-9 14-1z" fill="#ffcf38" stroke="#e58a03" stroke-width="1.6"/>',
            '<path d="M10 3h20v14H10z" fill="#e4f4ff" stroke="#2462ac" stroke-width="2"/><rect x="3" y="14" width="34" height="18" rx="4" fill="#9dc9ef" stroke="#2462ac" stroke-width="2"/><path d="M10 25h20v12H10z" fill="white" stroke="#2462ac" stroke-width="2"/>',
          ];
          for (const label of ['Map', 'Search', 'Directions', 'My Places', 'Print']) {
            const a = util.el('a', 'ref-navlink', n, label);
            const icon = util.el('span', 'riverton-nav-icon', a);
            icon.innerHTML = `<svg viewBox="0 0 40 40" width="40" height="40">${navIcons[['Map', 'Search', 'Directions', 'My Places', 'Print'].indexOf(label)]}</svg>`;
            a.prepend(icon);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label });
            });
          }
        }
        Object.assign(_c, { header, menu, windowControls });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const card = util.el('div', 'riverton-taskcard', panel);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', card, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', card, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-pan-map-center-04',
    template: 'site/base',
    design: { parts },
  });
})();
