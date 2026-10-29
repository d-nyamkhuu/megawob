(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-login-12',
    'brand': 'Task|Portal',
    'instruction': 'top',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'footer-link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 106 80" width="100%" height="100%"><circle cx="24" cy="24" r="24" fill="#f5f1e8"/><path d="M52 24 A54 54 0 0 1 104 76 L52 76 Z" fill="#161616" transform="translate(0,-2)"/></svg>';
      const br = u.el('span', 'ds-brand', top);
      C.brand.split('|').forEach((t) => u.el('span', '', br, t));
      u.el('span', 'ds-divider', top);
      if (mode === 'top') {
        u.el('div', 'ds-instruction', top, ctx.instruction);
      }
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = u.el('aside', 'ds-brief', main);
        u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      stage.classList.toggle('ds-stage-narrow', mode === 'left' || mode === 'right');
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', top);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      const sh = u.el('span', 'ds-shapes', foot);
      sh.innerHTML =
        '<svg viewBox="0 0 210 56" width="100%" height="100%"><rect x="0" y="1" width="54" height="54" fill="#cf2d2d"/><circle cx="102" cy="28" r="27" fill="#f5f1e8"/><path d="M148 55 L175 4 L202 55 Z" fill="#cf2d2d"/></svg>';
      u.el('span', 'ds-tag', foot, 'SIMPLE TOOLS\nBRIGHTER WORK');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'ds-submit ds-end-' + placement, placement === 'header' ? top : foot, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'ds-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
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
