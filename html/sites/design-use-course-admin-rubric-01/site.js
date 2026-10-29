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
      // Keep notices below the masthead and clear of the episode's end control.
      const headRect = document.querySelector('.ref-task').getBoundingClientRect();
      const end = document.querySelector('[data-role="submit"]');
      const endRect = end && end.getBoundingClientRect();
      const endAtBottom = endRect && endRect.top > window.innerHeight / 2;
      if (kind === 'banner') {
        document.querySelector('.ref-body').before(el);
        el.style.top = `${headRect.bottom}px`;
      }
      if (kind === 'toast') el.style.top = `${headRect.bottom + 12}px`;
      if (kind === 'cookie' && endAtBottom) el.style.right = `${window.innerWidth - endRect.left + 18}px`;
      if (kind === 'chat' && endAtBottom) el.style.bottom = `${window.innerHeight - endRect.top + 14}px`;
      if (kind === 'promo') {
        const stageRect = document.querySelector('.ref-stage').getBoundingClientRect();
        el.style.left = `${stageRect.left + stageRect.width / 2}px`;
        el.style.top = `${headRect.bottom + Math.max(15, (stageRect.height - 230) / 2)}px`;
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      // Keep all seeded frame draws above, but present a single newspaper masthead.
      const masthead = header.querySelector('.ref-brand') || util.el('div', 'ref-brand', header);
      masthead.replaceChildren();
      util.el('span', 'ref-college', masthead, 'Riverside College');
      const course = util.el('span', 'ref-course', masthead);
      util.el('span', '', course, 'ENGLISH 101');
      util.el('span', '', course, 'Course Administration');
      Object.assign(_c, { course, masthead });
    },
  };

  env.site({
    name: 'design-use-course-admin-rubric-01',
    template: 'site/base',
    design: { parts },
  });
})();
