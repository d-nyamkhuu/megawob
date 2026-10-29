(function () {
  'use strict';
  const C = { site: 'design-act-in-time-chase-10' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const brief = u.el('aside', 'ds-brief', main);
      const hero = u.el('section', 'ds-brief-hero', brief);
      u.el('div', 'ds-eyebrow', hero, 'Attention Check');
      const instruction = u.el('div', 'ds-instruction', hero, ctx.instruction);
      const how = u.el('section', 'ds-how', brief);
      u.el('h2', '', how, 'How it works');
      const steps = u.el('ol', '', how);
      [
        'A circle will move around in the area on the right.',
        'Move your mouse so the pointer stays inside the circle.',
        'Keep the pointer inside for at least 7.2 of the next 9 seconds.',
      ].forEach((t) => u.el('li', '', steps, t));
      const progress = u.el('section', 'ds-progress', brief);
      u.el('h2', '', progress, 'Progress');
      u.el('p', '', progress, 'You must keep the pointer inside the circle for at least 7.2 seconds to succeed.');
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const reset = u.el('button', 'ds-reset', foot, 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => window.location.reload());
      const display = ctx.display || 'header';
      body.dataset.display = display;
      if (display === 'panel') {
        instruction.classList.add('ds-instruction-panel');
        progress.classList.add('ds-progress-panel');
        progress.appendChild(instruction);
      } else if (display === 'toast') {
        instruction.classList.add('ds-instruction-toast');
        hero.appendChild(instruction);
      } else if (display === 'hidden') {
        instruction.remove();
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const label = er.bool(0.5) ? 'Submit' : String(er.pick(ctx.content.END_LABELS));
        const placement = ctx.rng.fork('chrome/end-placement').pick(['footer', 'footer', 'hero', 'link']);
        const collideRng = ctx.rng.fork('chrome/collide');
        const collide = collideRng.bool(0.3)
          ? String(
              collideRng.pick(ctx.content.END_LABELS.filter((x) => String(x).toLowerCase() !== label.toLowerCase())),
            )
          : null;
        const makeDecoy = (parent, text, colliding) => {
          const b = u.el('button', 'ds-xtra' + (colliding ? ' ds-xtra-pq' : ''), parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () =>
            env.log('decoy', colliding ? { label: text, collide: true } : { label: text }),
          );
          return b;
        };
        if (collide && placement !== 'hero') makeDecoy(foot, collide, true);
        if (placement === 'hero') {
          hero.classList.add('ds-has-end');
          const area = u.el('div', 'ds-hero-actions', hero);
          if (collide) makeDecoy(area, collide, true);
          submit = u.el('button', 'ds-submit ds-submit-hero', area, label);
        } else if (placement === 'link') {
          submit = u.el('a', 'ds-end-link', foot, label + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', () => ctx.submit());
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
