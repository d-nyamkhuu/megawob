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
      if (kind === 'promo' || kind === 'chat') {
        util.el('div', 'mac-overlay-heading', box, kind === 'promo' ? '✉  Get product updates' : '▱  Need help?');
      }
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo' || kind === 'chat') {
        const input = util.el('input', 'mac-overlay-input', box);
        input.type = 'text';
        input.placeholder = kind === 'promo' ? 'your@email.com' : 'Type a message…';
        input.setAttribute('aria-label', kind === 'promo' ? 'Email address' : 'Chat message');
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.floating': (base, S) => function (_c) {
      const { display, endBtn, header, headerTools, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      header.classList.toggle('mac-has-instruction', display === 'header');
      header.classList.toggle('mac-has-tools', headerTools.children.length > 0);
      const closeBox = util.el('div', 'mac-window-close', header, '✥');
      closeBox.setAttribute('aria-hidden', 'true');
      util.el('div', 'mac-window-title', header, 'Delivery Planner');
      const apple = util.svg('svg', {viewBox:'0 0 24 27', width:25, height:28, class:'mac-apple', 'aria-hidden':'true'}, document.body);
      util.svg('path', {d:'M15 6c0-3 2-5 5-6 0 3-2 5-5 6M12 8C7 4 2 8 2 14c0 6 4 12 7 12 2 0 3-2 5-1 5 3 8-5 9-7-5-2-5-7-1-9-3-4-6-3-10-1Z',fill:'#000'}, apple);
      Object.assign(_c, { apple, closeBox, submit });
    },
  };

  env.site({
    name: 'design-use-dispatch-reschedule-02',
    template: 'site/base',
    design: { parts },
  });
})();
