(function () {
  'use strict';
  env.site({
    name: 'design-find-fact-count-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-lights', top, '●  ●  ●');
      u.el('span', 'ds-title', top, 'Document Viewer');
      const content = u.el('div', 'ds-content', document.body);
      const mode = ctx.display;
      const note = (parent, cls) => {
        const n = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      };
      if (mode === 'header') note(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        const n = note(main, 'ds-brief');
        n.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') note(content, 'ds-toast');
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const place = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Finish'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'finish'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (p, t, c) => {
        const b = u.el('button', 'ds-xtra', p, t);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', c ? { label: t, collide: true } : { label: t }));
      };
      const end = (p, cls, t) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, p, t);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const tools = u.el('div', 'ds-tools', top);
      if (collide) decoy(place === 'footer' ? foot : tools, collide, true);
      if (place === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (place === 'footer') submit = end(foot, 'ds-submit', label);
      if (place === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
      if (place !== 'footer' && !collide && cr.bool(0.3)) decoy(foot, 'Ready', false);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This viewer uses cookies for document preferences.',
        toast: 'Document settings updated.',
        chat: 'Need help with this document?',
        promo: 'Discover the new document library.',
        banner: 'Document service maintenance this evening.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
