(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-radio-09',
    'brand': 'Riverton University',
    'title': 'Email Preferences',
    'instruction': 'left',
    'rail': '',
    'menu': 'Office of Communications',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      body.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
      });
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top2', content);
      const br = u.el('div', 'ds-brand2', top);
      br.innerHTML =
        '<svg width="34" height="44" viewBox="0 0 34 44" fill="none" stroke="#3d4630" stroke-width="1.4"><path d="M17 43V3M17 23C11 16 10 9 17 1C24 9 23 16 17 23ZM17 36C7 34 3 26 2 16C12 17 18 25 17 36ZM17 36C27 34 31 26 32 16C22 17 16 25 17 36ZM3 17L17 32L31 17"/></svg>';
      const bt = u.el('div', 'ds-brandtxt', br);
      u.el('div', 'ds-brandname', bt, 'Willow & Oak');
      u.el('div', 'ds-brandtag', bt, 'HOME · LIFE · A LITTLE BRIGHTER');
      const steps = u.el('nav', 'ds-steps', top);
      ['CART', 'DELIVERY', 'PAYMENT', 'REVIEW'].forEach((t, i) => {
        if (i) u.el('span', 'ds-sep', steps, '›');
        u.el('span', 'ds-step' + (i === 1 ? ' cur' : ''), steps, t);
      });
      const endR = ctx.rng.fork('chrome/end');
      const keepDefault = endR.bool(0.5);
      const placement = ctx.finish ? null : keepDefault ? 'footer' : endR.pick(['footer', 'header', 'link']);
      const supplied = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(supplied) && supplied.length
          ? supplied
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const defaultLabel = labels.find((x) => String(x).trim().toLowerCase() === 'submit') || labels[0];
      const label = keepDefault ? defaultLabel : endR.pick(labels);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = labels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (pool.length) collide = collideR.pick(pool);
      }
      const logDecoy = (parent, text) => {
        const b = u.el('button', 'ds-pq', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const main = u.el('div', 'ds-main', content);
      if (ctx.display !== 'hidden' && ctx.display !== 'toast') {
        const ban = u.el('section', 'ds-banner' + (ctx.display === 'panel' ? ' ds-panel-note' : ''), main);
        if (ctx.display === 'panel') u.el('div', 'ds-panel-kicker', ban, 'DELIVERY NOTE');
        u.el('div', 'ds-instruction', ban, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (ctx.display === 'toast') {
        const n = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        content.insertBefore(n, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      let headSubmit = null;
      const makeEnd = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish && placement === 'header') headSubmit = makeEnd(steps, 'ds-submit ds-head-submit', label, false);
      if (collide && placement === 'header') logDecoy(steps, collide);
      if (collide && placement !== 'header') logDecoy(foot, collide);
      const back = u.el('a', 'ds-back ds-reset', foot, '⟵  Back');
      back.href = '#';
      const reset = u.el('button', 'ds-save', foot, 'Save for later');
      reset.type = 'button';
      if (!ctx.finish && placement !== 'header')
        submit = makeEnd(
          foot,
          placement === 'link' ? 'ds-endlink' : 'ds-submit',
          placement === 'link' ? label + ' ›' : label,
          placement === 'link',
        );
      return { stage, submit: submit || headSubmit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
