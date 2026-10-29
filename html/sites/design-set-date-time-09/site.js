(function () {
  'use strict';
  const C = { site: 'design-set-date-time-09' };
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
      const viewportWidth = (ctx.size && (ctx.size.width || ctx.size.w)) || document.documentElement.clientWidth;
      let display = ctx.display;
      if (display === 'panel' && viewportWidth < 1180) display = 'header';
      const note = (parent, cls) => {
        const el = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', el, ctx.instruction);
        return el;
      };
      let headNote = null;
      if (display !== 'hidden' && display !== 'panel') {
        headNote = note(content, display === 'toast' ? 'ds-toast' : 'ds-header-note');
        content.insertBefore(headNote, main);
      }

      const stage = u.el('main', 'ds-stage', main);
      const rides = u.el('div', 'ds-rides', main);
      rides.setAttribute('aria-hidden', 'true');
      u.el('div', 'ds-rides-h', rides, 'Ride type');
      const rideRow = u.el('div', 'ds-rides-r', rides);
      [
        ['Standard', 'Everyday rides'],
        ['XL', 'More room'],
        ['Premium', 'Top rated'],
      ].forEach((r, i) => {
        const card = u.el('div', 'ds-ride' + (i ? '' : ' on'), rideRow);
        card.innerHTML =
          '<svg viewBox="0 0 48 48"><path fill="currentColor" d="M10 7h28c2 0 3 1 4 4l4 13v18c0 2-1 3-3 3h-3c-2 0-3-1-3-3v-3H11v3c0 2-1 3-3 3H5c-2 0-3-1-3-3V24l4-13c1-3 2-4 4-4z"/><path fill="white" d="M12 11h24l3 11H9z"/><circle fill="white" cx="10" cy="30" r="3.6"/><circle fill="white" cx="38" cy="30" r="3.6"/><path stroke="white" stroke-width="1.5" d="M18 34h12"/></svg>';
        const text = u.el('div', '', card);
        u.el('b', '', text, r[0]);
        u.el('span', '', text, r[1]);
      });
      const map = u.el('div', 'ds-map', main);
      map.setAttribute('aria-hidden', 'true');

      const footer = u.el('footer', 'ds-footer', content);
      const endR = ctx.rng.fork('chrome/end');
      const collideR = ctx.rng.fork('chrome/collide');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = labelOf(endR.pick(labels));
      const placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'header', 'link']);
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (options.length) collide = labelOf(collideR.pick(options));
      }
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'ds-pq', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const endBtn = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          submit = headNote
            ? endBtn(headNote, 'ds-submit ds-header-submit', label)
            : endBtn(content, 'ds-submit ds-header-submit', label);
        } else if (placement === 'link') submit = endBtn(footer, 'ds-submit ds-footer-link', label + ' ›', 'a');
        else submit = endBtn(footer, 'ds-submit', label);
      }
      if (collide) {
        if (placement === 'header' && headNote) decoyBtn(headNote, collide);
        else decoyBtn(footer, collide);
      }
      const cancel = u.el('button', 'ds-cancel', footer, 'Cancel');
      cancel.type = 'button';

      const rail = u.el('aside', 'ds-rail', body);
      if (display === 'panel') {
        rail.classList.add('ds-panel-active');
        u.el('h2', '', rail, 'Instructions');
        note(rail, 'ds-panel-note');
      } else {
        u.el('h2', '', rail, 'Your Reservation');
        u.el('div', 'ds-reservation-values', rail);
        const help = u.el('section', 'ds-help', rail);
        u.el('h2', '', help, 'Need Help?');
        u.el('p', '', help, 'If you have trouble editing your reservation, please ask a librarian at the front desk.');
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
