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
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy ? (rng.bool(0.35), true) : false;
      const nav = W >= 1180 ? (rng.bool(0.5), true) : false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const catalogEnd = rng.fork('riverside/end');
      if (!ctx.finish && catalogEnd.bool(0.6)) {
        placement = 'header';
        label = 'Save';
      }
      if (collide && collide.text.toLowerCase() === label.toLowerCase()) collide.text = "I'm done";
      document.body.classList.toggle('catalog-has-footer', wantFooter || placement === 'floating');
      Object.assign(_c, { catalogEnd, collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
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
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        const footCaption = util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        footCaption.textContent = 'Riverside Public Library · Catalog services';
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-align-layout-spacing-03',
    template: 'site/base',
    design: { parts },
  });
})();
