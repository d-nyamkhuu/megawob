(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-time-01',
    'brand': 'Library Study Room Reservation',
    'title': 'Reservation Details',
    'instruction': 'top',
    'rail': 'Your Reservation|Need Help?',
    'menu': 'Riverside Community Library',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      u.el('span', 'ds-brand', top, 'Library Study Room Reservation');
      u.el('nav', 'ds-menu', content, 'Riverside Community Library');
      const intro = u.el('div', 'ds-intro', content);
      u.el('div', '', intro, 'Use this form to view or edit your reservation.');
      const main = u.el('div', 'ds-main', content);
      function note(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') note(main, 'ds-brief');
        else {
          const n = note(content, ctx.display === 'toast' ? 'ds-toast' : 'ds-header-note');
          content.insertBefore(n, main);
        }
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Submit';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
        } else {
          const alternatives = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          if (alternatives.length) label = endRng.pick(alternatives);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const endButton = (parent, cls, text, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, text);
        if (asLink) {
          b.href = '#';
        } else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'header') submit = endButton(top, 'ds-end-header', label, false);
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
      if (placement === 'link') submit = endButton(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const text = cr.pick(words);
            const d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, 'Your Reservation');
      u.el('div', 'ds-reservation-values', rail);
      const help = u.el('section', 'ds-help', rail);
      u.el('h2', '', help, 'Need Help?');
      u.el('p', '', help, 'If you have trouble editing your reservation, please ask a librarian at the front desk.');
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
