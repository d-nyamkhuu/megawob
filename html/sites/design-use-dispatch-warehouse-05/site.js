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
        if (kind === 'promo') {
          const art = util.el('div', 'wh-promo-art', box);
          for (let i = 0; i < 3; i++) util.el('span', `wh-carton wh-carton-${i}`, art);
          util.el('h3', 'wh-overlay-title', box, 'Get the latest warehouse insights');
        }
        if (kind === 'chat') util.el('h3', 'wh-overlay-title', box, 'Warehouse Assistant');
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'wh-newsletter-email', box);
          email.type = 'text';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
        }
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
        if (kind === 'chat') {
          const composer = util.el('div', 'wh-chat-composer', box);
          const field = util.el('input', '', composer);
          field.type = 'text';
          field.placeholder = 'Type a message…';
          field.setAttribute('aria-label', 'Chat message');
          const send = util.el('button', '', composer, '➤');
          send.type = 'button';
          send.setAttribute('aria-label', 'Send chat message');
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Chat send' }));
        }
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end?.getBoundingClientRect();
        if ((kind === 'cookie' || kind === 'chat') && endRect && endRect.top > document.body.clientHeight / 2) {
          el.style.bottom = `${document.body.clientHeight - endRect.top + 12}px`;
        }
        if (kind === 'banner') {
          const header = document.querySelector('.ref-task');
          el.style.top = `${header.getBoundingClientRect().bottom + 4}px`;
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
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
        util.el('span', 'wh-windowtitle', win, 'Warehouse Planner - Storage Assignment');
        const winControls = util.el('div', 'wh-windowcontrols', win);
        util.el('span', '', winControls, '−');
        util.el('span', '', winControls, '□');
        util.el('span', 'wh-close', winControls, '×');
        const menu = util.el('div', 'wh-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Item', 'Bin', 'Tools', 'Window', 'Help']) util.el('span', '', menu, item);
        const strip = util.el('div', 'wh-toolstrip', document.body);
        const tools = [
          ['▧', 'New'], ['📂', 'Open'], ['↻', 'Refresh'], ['＋', 'Move'],
          ['▤', 'Details'], ['▣', 'Labels'], ['▦', 'View'],
        ];
        tools.forEach(([icon, label], i) => {
          if (i === 3 || i === 6) util.el('i', 'wh-tool-divider', strip);
          const button = util.el('div', 'wh-tool-button', strip);
          util.el('span', `wh-tool-icon wh-tool-icon-${i}`, button, icon);
          util.el('span', '', button, label);
        });
        Object.assign(_c, { H, W, display, menu, roomy, tall, win, winControls });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const warehouseNav = util.el('aside', 'wh-window-nav', body);
        const navPaths = [
          'M3 7l9-4 9 4v12l-9 3-9-3zM3 7l9 4 9-4M12 11v11M8 5l9 4',
          'M5 2h10l5 5v15H5zM15 2v6h5M8 11h9M8 15h9M8 19h7',
          'M3 3v19M21 3v19M3 8h18M3 15h18M7 4v4M15 4v4M7 11v4M15 11v4M7 18v4M15 18v4',
          'M2 5h12v13H2zM14 9h5l3 5v4h-8M5 18a2 2 0 1 0 4 0M16 18a2 2 0 1 0 4 0',
          'M3 21h20M5 13h4v8H5zM11 8h4v13h-4zM17 3h4v18h-4z',
        ];
        ['Dispatch', 'Receipts', 'Storage', 'Shipments', 'Reports'].forEach((text, i) => {
          const item = util.el('div', i === 0 ? 'wh-nav-item current' : 'wh-nav-item', warehouseNav);
          const icon = util.svg(
            'svg',
            { viewBox: '0 0 24 24', width: 25, height: 25, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6 },
            item,
          );
          util.svg('path', { d: navPaths[i] }, icon);
          util.el('span', '', item, text);
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, navPaths, warehouseNav });
      },
  };

  env.site({
    name: 'design-use-dispatch-warehouse-05',
    template: 'site/base',
    design: { parts },
  });
})();
