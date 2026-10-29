(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-time-03',
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
      const tl = u.el('div', 'ds-titles', top);
      u.el('h1', 'ds-brand', tl, 'Schedule a Pickup');
      u.el('div', 'ds-sub', tl, 'Provide the details below to schedule your pickup.');
      const stp = u.el('div', 'ds-steps', top);
      u.el('div', 'ds-stepof', stp, 'Step 2 of 3');
      const trk = u.el('div', 'ds-track', stp);
      [
        ['1', 'Details', 'done'],
        ['2', 'Pickup', 'cur'],
        ['3', 'Review', ''],
      ].forEach((s) => {
        const it = u.el('div', 'ds-step ' + s[2], trk);
        u.el('span', 'ds-dot', it, s[0]);
        u.el('span', 'ds-stl', it, s[1]);
      });
      const main = u.el('div', 'ds-main', content);
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endRng.pick(['footer', 'header', 'link', 'footer']);
      const endLabel = placement === 'footer' ? 'Submit' : labelOf(endRng.pick(labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const own = endLabel.trim().toLowerCase();
        const choices = [...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== own))];
        if (choices.length) collide = labelOf(collideRng.pick(choices));
      }
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
      let submit = null;
      function endControl(parent, cls, text) {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
        b.type = cls === 'ds-end-link' ? undefined : 'button';
        if (cls === 'ds-end-link') b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      if (placement === 'footer') submit = endControl(foot, 'ds-submit', endLabel);
      if (placement === 'header') submit = endControl(top, 'ds-submit ds-top-submit', endLabel);
      if (placement === 'link') submit = endControl(foot, 'ds-end-link', endLabel + ' ›');
      if (collide) {
        const d = u.el('button', 'ds-xtra', foot, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, 'Pickup Summary');
      u.el('div', 'ds-reservation-values', rail);
      const help = u.el('section', 'ds-help', rail);
      u.el('h2', '', help, 'Help');
      const hp = u.el('p', '', help, 'Need to make a change?');
      u.el('br', '', hp);
      hp.append(document.createTextNode('Update the information on the left.'));
      const cq = u.el('section', 'ds-cq', rail);
      u.el('h2', '', cq, 'Common Questions');
      [
        'Can I change the pickup time?',
        'What items can be picked up?',
        'Do I need to be home?',
        'How do I cancel?',
      ].forEach((t) => u.el('a', '', cq, t));
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
