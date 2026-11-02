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
      const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
      const footerHeight = Array.from(document.querySelectorAll('.ref-foot, .ref-float-dock')).reduce((n, e) => n + e.getBoundingClientRect().height, 0);
      if (kind === 'banner' || kind === 'toast' || kind === 'promo') el.style.top = `${headerBottom}px`;
      if (kind === 'cookie' || kind === 'promo') el.style.bottom = `${footerHeight}px`;
      if (kind === 'chat') el.style.bottom = `${footerHeight + 20}px`;
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      // Keep the catalog frame while retaining the template's seeded controls.
      _c.sidebar = _c.roomy;
      _c.nav = _c.W >= 1180;
      document.body.classList.toggle('catalog-has-footer', _c.wantFooter || _c.placement === 'floating');
    },
    'frame.header': (base, S) => function (_c) {
      const { lr, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'catalog-library-art', header);
      util.el('div', 'catalog-header-books', header);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        // Preserve the title draw above for seeded episode stability; this design has a fixed masthead.
        brand.textContent = 'Riverside Public Library';
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, ctx, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.dataset.axis = ctx.spec.axis;
      stage.style.setProperty('--catalog-w', `${ctx.spec.W}px`);
      stage.style.setProperty('--catalog-h', `${ctx.spec.H}px`);
      stage.style.setProperty('--catalog-span', `${ctx.spec.H - 26}px`);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'catalog-tips', body);
      util.el('h2', '', tips, 'Tips');
      const tipList = util.el('ul', '', tips);
      util.el('li', '', tipList, 'Drag a card by its body to move it.');
      util.el('li', '', tipList, ctx.spec.mode === 'equal' ?
        (ctx.spec.axis === 'y' ? 'The top and bottom cards are locked in place.' :
          'The first and last cards are locked in place.') : 'The first card is locked in place.');
      util.el('div', 'catalog-book-stack', tips);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) tips.prepend(taskPanel);
      Object.assign(_c, { stage, taskPanel, tipList, tips });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const caption = document.querySelector('.ref-foot-text');
      if (caption) caption.textContent = 'Riverside Public Library · Catalog services';
    },
  };

  env.site({
    name: 'design-align-layout-spacing-03',
    template: 'site/base',
    design: { parts },
  });
})();
