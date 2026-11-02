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
      const reservedBottom = parseFloat(document.documentElement.style.getPropertyValue('--fj-footer-height')) || 0;
      if (kind === 'cookie') el.style.bottom = reservedBottom + 'px';
      if (kind === 'chat') el.style.bottom = (reservedBottom + 16) + 'px';
      if (kind === 'promo') el.style.bottom = reservedBottom + 'px';
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        el.style.top = (header ? header.getBoundingClientRect().bottom : 0) + 'px';
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      const message = util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      if (kind === 'chat') {
        const title = util.el('div', 'finance-chat-title', message, 'Chat with us');
        message.prepend(title);
        const composer = util.el('div', 'finance-chat-compose', box);
        const input = util.el('input', '', composer); input.placeholder = 'Type a message…'; input.setAttribute('aria-label', 'Chat message');
        const send = util.el('button', '', composer, '➤'); send.type = 'button'; send.setAttribute('aria-label', 'Send chat message');
        send.addEventListener('click', () => { if (input.value.trim()) { env.log('chat-message', { text: input.value }); input.value = ''; } });
      }
      if (kind === 'promo') {
        const art = util.el('div', 'finance-envelope', box);
        const svg = util.svg('svg', { viewBox: '0 0 180 180', 'aria-hidden': 'true' }, art);
        util.svg('circle', { cx:90, cy:90, r:85, fill:'#f0f7ff' }, svg);
        util.svg('path', { d:'M30 74L90 25l60 49v76H30z', fill:'#007aff' }, svg);
        util.svg('rect', { x:48,y:42,width:84,height:91,rx:7,fill:'white',stroke:'#bad9ff','stroke-width':3 }, svg);
        util.svg('path', { d:'M60 62h58M60 78h58M60 94h44', stroke:'#bad9ff','stroke-width':4 }, svg);
        util.svg('path', { d:'M30 75l60 47 60-47v75H30z', fill:'#0075ed' }, svg);
        util.svg('path', { d:'M30 150l60-49 60 49', fill:'#1286ff' }, svg);
        box.prepend(art);
        const title = util.el('h2', 'finance-promo-title', message, 'Get accounting tips in your inbox'); message.prepend(title);
        const email = util.el('input', 'finance-promo-email', box); email.type = 'text'; email.placeholder = 'Enter your email'; email.setAttribute('aria-label', 'Email address'); box.insertBefore(email, row);
        const close = util.el('button', 'finance-promo-close', box, '×'); close.type = 'button'; close.setAttribute('aria-label', word ? word('close') : 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
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
      const { ctx, root } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      root.style.setProperty('--fj-rail-density', String(Math.min(W / 1672, H / 941)));
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.floating': (base, S) => function (_c) {
      const { W, ctx, display, endBtn, label, placement, root, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const rail = util.el('nav', 'finance-rail', document.body);
      rail.setAttribute('aria-label', 'Workspace navigation');
      const icons = [
        'M5 20V13m7 7V4m7 16V8',
        'M3 8l9-5 9 5zM5 11v8m5-8v8m5-8v8m5-8v8M2 22h20',
        'M5 2h9l5 5v15H5zM14 2v6h5M8 12h8m-8 4h5',
        'M2 5h20v15H2zM2 10h20M6 15h3m6 0h3',
        'M2 3h3l4 14h11l3-10H6M10 22h.01M19 22h.01',
        'M12 5C8 2 4 3 2 4v17c4-2 7-1 10 1m0-17c4-3 7-2 10-1v17c-4-2-7-1-10 1zM12 5v17',
        'M5 20V13m7 7V7m7 13V2',
        'M9 3h6l1 4 4 1 2 5-3 3v4l-5 2-3-3H7l-4-4 2-4-1-4zM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
      ];
      ['Home', 'Banking', 'Sales', 'Expenses', 'Purchases', 'Accounting', 'Reports', 'Settings'].forEach((text, i) => {
        const item = util.el('button', 'finance-nav' + (i === 5 ? ' active' : ''), rail);
        item.type = 'button';
        const svg = util.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, item);
        util.svg('path', { d: icons[i] }, svg);
        util.el('span', '', item, text);
        item.addEventListener('click', () => env.log('decoy', { what: 'navigation', label: text }));
      });
      document.body.classList.toggle('finance-header-note', display === 'header');
      document.body.classList.toggle('finance-toast-note', display === 'toast');
      document.body.classList.toggle('finance-hidden', display === 'hidden');
      document.body.classList.toggle('finance-finish', !!ctx.finish);
      const sideNote = document.querySelector('.ref-panel, .ref-note');
      if (sideNote) {
        sideNote.classList.add('finance-pending-note');
        document.body.appendChild(sideNote);
      }
      root.style.setProperty('--fj-rail-width', (W * .0755) + 'px');
      const bottomDock = document.querySelector('.ref-float-dock, .ref-foot:has(button), .ref-foot:has(a)');
      root.style.setProperty('--fj-footer-height', bottomDock ? bottomDock.getBoundingClientRect().height + 'px' : '0px');
      Object.assign(_c, { bottomDock, icons, rail, sideNote, submit });
    },
  };

  env.site({
    name: 'design-use-accounting-journal-04',
    template: 'site/base',
    design: { parts },
  });
})();
