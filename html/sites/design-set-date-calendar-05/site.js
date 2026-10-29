(function () {
  'use strict';
  const C = {
    site: 'design-set-date-calendar-05',
    notes: [
      'Click the calendar field to open the date picker.',
      'Select the requested date in the calendar.',
      'Leave all other fields as they are.',
    ],
  };
  const PAW =
    '<svg viewBox="0 0 64 64" width="100%" height="100%"><g fill="currentColor"><path d="M18 43c1-5 7-15 14-15s13 10 14 15c2 10-8 7-14 6s-16 5-14-6Z"/><ellipse cx="12" cy="29" rx="5" ry="7" transform="rotate(-20 12 29)"/><ellipse cx="25" cy="17" rx="5.5" ry="8" transform="rotate(-12 25 17)"/><ellipse cx="40" cy="17" rx="5.5" ry="8" transform="rotate(12 40 17)"/><ellipse cx="53" cy="29" rx="5" ry="7" transform="rotate(20 53 29)"/></g></svg>';
  const HOUSE =
    '<svg viewBox="0 0 64 64" width="100%" height="100%"><defs><linearGradient id="homeblue" x2="0" y2="1"><stop stop-color="#75d7f2"/><stop offset="1" stop-color="#20b8ed"/></linearGradient></defs><path d="M43 17V9h7v15" fill="none" stroke="#70c8bd" stroke-width="2.6" stroke-linejoin="round"/><path d="M4 30 32 7l28 23M9 28v25m46-25v25" fill="none" stroke="#8ac642" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><g fill="url(#homeblue)"><path d="M17 48c1-4 6-13 14-13s12 9 13 13c1 8-8 4-13 4s-15 4-14-4Z"/><ellipse cx="16" cy="34" rx="3.5" ry="5.5" transform="rotate(-18 16 34)"/><ellipse cx="25" cy="28" rx="3.8" ry="6"/><ellipse cx="35" cy="29" rx="3.8" ry="6"/><ellipse cx="44" cy="36" rx="3.5" ry="5.5" transform="rotate(20 44 36)"/></g></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      const logo = u.el('div', 'ds-logo', top);
      const ic = u.el('span', 'ds-logo-ic', logo);
      ic.innerHTML = HOUSE;
      const lt = u.el('span', 'ds-logo-t', logo);
      u.el('b', '', lt, 'Happy Homes');
      u.el('i', '', lt, 'Adoption Portal');
      const nav = u.el('nav', 'ds-menu', top);
      ['Find a pet', 'Your application', 'Resources', 'Contact'].forEach((t, i) =>
        u.el('span', i === 1 ? 'on' : '', nav, t),
      );
      const pw = u.el('span', 'ds-top-paw', top);
      pw.innerHTML = PAW;
      const sheet = u.el('div', 'ds-sheet', content);
      const stage = u.el('main', 'ds-stage', sheet);
      const foot = u.el('footer', 'ds-footer', sheet);
      const draft = u.el('button', 'ds-cancel', foot, 'Save draft');
      draft.type = 'button';
      draft.addEventListener('click', () => env.log('decoy', { label: 'Save draft' }));
      const rail = u.el('aside', 'ds-rail', body);
      const hello = u.el('div', 'ds-hello', rail, 'Hello, Alex ');
      hello.insertAdjacentHTML(
        'beforeend',
        '<svg width="14" height="10" viewBox="0 0 14 10"><path d="m2 2 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
      );
      if (ctx.display !== 'hidden') {
        const b = u.el('div', 'ds-brief ds-display-' + ctx.display, rail);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const nt = u.el('div', 'ds-notes', rail);
      u.el('h3', '', nt, 'Action notes:');
      C.notes.forEach((t, i) => {
        const r = u.el('div', 'ds-note', nt);
        u.el('span', 'ds-num', r, String(i + 1));
        const text =
          i === 0
            ? 'Click the calendar icon next to the date field.'
            : i === 1 && ctx.display !== 'hidden'
              ? ctx.instruction
              : t;
        u.el('span', '', r, text);
      });
      const rp = u.el('span', 'ds-rail-paw', rail);
      rp.innerHTML = PAW;
      const endR = ctx.rng.fork('chrome/end');
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
      const common = !ctx.finish && endR.bool(0.5);
      const placement = ctx.finish ? null : common ? 'footer' : endR.pick(['footer', 'rail', 'link']);
      const labelValue = common ? 'Submit' : endR.pick(labels);
      const label =
        typeof labelValue === 'string' ? labelValue : labelValue.label || labelValue.text || String(labelValue);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
          .filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (pool.length) collide = collideR.pick(pool);
      }
      const endBtn = (parent, cls, text, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
        b.type = 'button';
        if (isLink) b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', isCollide ? 'ds-xtra ds-pq' : 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      if (collide) decoyBtn(foot, collide, true);
      if (!ctx.finish && placement === 'rail') submit = endBtn(rail, 'ds-submit ds-rail-submit', label);
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'ds-submit', label);
      if (!ctx.finish && placement === 'link') submit = endBtn(foot, 'ds-endlink', label + ' ›', true);
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
