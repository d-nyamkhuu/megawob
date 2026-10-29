(function () {
  'use strict';
  const C = { site: 'design-act-in-time-chase-06', briefTitle: 'Tracking Task' };
  const labelOf = (x) => typeof x === 'string' ? x : (x.label || x.text || x.name);

  env.site({
    name: C.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const display = ctx.display || 'header';
      const body = u.el('div', 'ds-body', document.body);
      body.dataset.display = display;
      const left = u.el('aside', 'ds-brief', body);
      u.el('h2', '', left, C.briefTitle);
      if (display === 'header' || display === 'panel') u.el('div', 'ds-instruction', left, ctx.instruction);
      const main = u.el('div', 'ds-main', body);
      const stage = u.el('main', 'ds-stage', main);
      if (display === 'header') u.el('div', 'ds-hero-instruction', main, ctx.instruction);
      if (display === 'toast') {
        const note = u.el('section', 'ds-episode-toast', main);
        u.el('div', 'ds-toast-label', note, 'Tracking task');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      u.el('div', 'ds-pointer', main);
      const right = u.el('aside', 'ds-perimeter', body);
      u.el('div', 'ds-time-label', right, 'Time remaining');
      u.el('div', 'ds-time-value', right, '11.0 s');
      const progress = u.el('div', 'ds-time-meter', right);
      u.el('i', '', progress);
      const pause = u.el('button', 'ds-pause', document.body, 'Pause');
      pause.type = 'button';

      // New choices have independent streams; the task's existing draws stay intact.
      const endRng = ctx.rng.fork('chrome/end');
      const labels = (ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
      const label = referenceEnd ? 'Submit' : endRng.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        let parent;
        if (placement === 'header') {
          right.classList.add('ds-perimeter-with-end');
          parent = u.el('div', 'ds-header-tools', right);
        } else {
          parent = u.el('footer', placement === 'footer' ? 'ds-footer' : 'ds-link-dock', document.body);
        }
        submit = u.el('button', placement === 'link' ? 'ds-end-link' : 'ds-submit' + (placement === 'header' ? ' ds-end-header' : ''), parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const decoyLabel = collideRng.pick(options);
          const decoy = u.el('button', 'ds-xtra', document.body, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
