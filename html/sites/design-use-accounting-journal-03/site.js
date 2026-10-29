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
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        util.el('div', 'draft-promo-art', box, '✉');
        const input = util.el('input', 'draft-promo-email', box);
        input.type = 'text';
        input.placeholder = 'Enter your email address';
        input.setAttribute('aria-label', 'Email address');
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
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.toggle('with-instruction', display === 'header');
      const windowControls = util.el('div', 'draft-window-controls', document.body);
      windowControls.setAttribute('aria-hidden', 'true');
      for (const text of ['−', '□', '×']) util.el('span', '', windowControls, text);
      const ruler = util.el('div', 'draft-ruler', document.body);
      ruler.setAttribute('aria-hidden', 'true');
      for (const text of ['0', '320', '640', '960', '1280']) util.el('span', '', ruler, text);
      const readout = util.el('div', 'draft-readout', document.body, 'X: 1184   Y: 56\nW: 336   H: 624');
      readout.setAttribute('aria-hidden', 'true');
      const verticalRuler = util.el('div', 'draft-vertical-ruler', document.body);
      verticalRuler.setAttribute('aria-hidden', 'true');
      for (const text of ['0', '180', '360', '540', '720', '840']) util.el('span', '', verticalRuler, text);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, readout, ruler, verticalRuler, windowControls });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dockParent = document.querySelector('.ref-foot') || document.body;
        const dock = util.el('div', 'ref-float-dock', dockParent);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // Keep all episode draws above, while removing navigation from this tool window.
      header.querySelector('.ref-nav')?.remove();
      body.querySelector('.ref-side')?.remove();
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-accounting-journal-03',
    template: 'site/base',
    design: { parts },
  });
})();
