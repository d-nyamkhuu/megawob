(function () {
  'use strict';
  const C = { site: 'design-find-fact-locate-10', instruction: 'top', briefTitle: 'Task' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const win = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-window-title', win, 'AeroTech Technical Reference  |  Connector Specifications');
      const wc = u.el('span', 'ds-window-controls', win);
      u.el('i', '', wc, '−');
      u.el('i', '', wc, '□');
      u.el('i', 'close', wc, '×');
      const hero = u.el('section', 'ds-hero', document.body);
      u.el('div', 'ds-logo', hero, '◢ AeroTech');
      u.el('div', 'ds-kicker', hero, 'TECHNICAL REFERENCE');
      u.el('div', 'ds-hero-title', hero, 'Connector Specifications');
      u.el('div', 'ds-revision', hero, 'Revision 3.4  |  March 2014');
      u.el('div', 'ds-drawing', hero, '');
      const content = u.el('div', 'ds-content', document.body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task Note');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left') {
        briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
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
      const baseline = !ctx.finish && er.bool(0.5),
        placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']),
        label = ctx.finish
          ? ''
          : baseline
            ? 'Submit'
            : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (p, t, c) => {
        const b = u.el('button', 'ds-xtra', p, t);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', c ? { label: t, collide: true } : { label: t }));
      };
      const tools = u.el('div', 'ds-tools', win);
      if (collide) decoy(placement === 'footer' ? foot : tools, collide, true);
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
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'Technical reference cookies and site preferences.',
        toast: 'Reference settings saved.',
        chat: 'How can we help with this specification?',
        promo: 'Explore the AeroTech catalog.',
        banner: 'Reference library maintenance notice.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
