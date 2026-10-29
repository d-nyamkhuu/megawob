(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-dropdown-05', 'brand': 'HomeNest', 'title': 'Return an Item' };
  const BAG =
    '<svg viewBox="0 0 40 48" width="40" height="48"><defs><linearGradient id="bag-blue" x2="0" y2="1"><stop stop-color="#218bff"/><stop offset="1" stop-color="#0066f0"/></linearGradient></defs><path d="M12 16V11a8 8 0 0 1 16 0v5" fill="none" stroke="#1680ff" stroke-width="2.5"/><path d="M6 13h28a3 3 0 0 1 3 3l1 27a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3l1-27a3 3 0 0 1 3-3" fill="url(#bag-blue)"/><path d="M12 24c4 2 6 2 8-1 2 3 4 3 8 1v7c0 7-3 10-8 10s-8-3-8-10z" fill="#fff"/></svg>';
  const SEARCH =
    '<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="#444" stroke-width="1.4" stroke-linecap="round"><circle cx="7" cy="7" r="4.8"/><path d="M10.6 10.6L14 14"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const ends = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['footer', 'footer', 'title', 'link']);
      const label = labelOf(er.pick(ends));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const opts = [...new Set(ends.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (opts.length) collide = { text: cr.pick(opts), where: cr.pick(['title', 'footer']) };
      }
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', top);
      brand.insertAdjacentHTML('beforeend', BAG);
      u.el('span', '', brand, C.brand);
      const search = u.el('div', 'ds-search', top);
      search.insertAdjacentHTML('beforeend', SEARCH);
      u.el('span', '', search, 'Search orders, products, or help...');
      const win = u.el('div', 'ds-win', top);
      ['M2 8h14', 'M3 3h11v11H3z M5 1h11v11', 'M2 2l12 12M14 2L2 14'].forEach((d) => {
        const icon = u.el('span', 'ds-wc', win);
        icon.innerHTML =
          '<svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1"><path d="' +
          d +
          '"/></svg>';
      });
      const user = u.el('div', 'ds-user', top);
      u.el('span', 'ds-avatar', user, 'JD');
      u.el('span', '', user, 'Jordan Diaz');
      const chev = u.el('span', 'ds-user-chev', user);
      chev.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor"><path d="m2 5 6 6 6-6"/></svg>';
      const body = u.el('div', 'ds-body', document.body);
      const doc = u.el('div', 'ds-doc', body);
      u.el('h1', 'ds-h1', doc, C.title);
      u.el('p', 'ds-sub', doc, 'Tell us what you’re returning and why. We’ll guide you through the next steps.');
      const mode = ctx.display;
      if (mode === 'header') u.el('div', 'ds-header-note', doc, ctx.instruction);
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
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
      let titleTools = null;
      if (placement === 'title' || (collide && collide.where === 'title')) {
        titleTools = u.el('div', 'ds-title-tools', doc);
        if (collide && collide.where === 'title') decoyBtn(titleTools, collide.text, true);
      }
      let titleSubmit = null;
      if (placement === 'title' && !ctx.finish) titleSubmit = endBtn(titleTools, 'ds-submit ds-title-submit', label);
      const main = u.el('div', 'ds-main', doc);
      const deco = u.el('div', 'ds-deco', main);
      const stage = u.el('main', 'ds-stage', main);
      const f1 = u.el('div', 'ds-static ds-s-order', deco);
      u.el('span', 'ds-sl', f1, 'Order number');
      u.el('span', 'ds-sbox', f1, 'HN-7843921');
      u.el('span', 'ds-placed', f1, 'Placed on Mar 3, 2024');
      const f2 = u.el('div', 'ds-static ds-s-reason', deco);
      u.el('span', 'ds-sl', f2, 'Reason for return');
      const f3 = u.el('div', 'ds-static ds-s-details', deco);
      u.el('span', 'ds-sl', f3, 'Additional details');
      u.el('span', 'ds-area', f3, 'Add any other details (optional)');
      u.el('span', 'ds-count', f3, '0 / 500');
      const f4 = u.el('div', 'ds-static ds-s-method', deco);
      u.el('span', 'ds-sl', f4, 'Return method');
      const r1 = u.el('span', 'ds-radio on', f4);
      u.el('i', '', r1);
      u.el('b', '', r1, 'Prepaid return label');
      u.el('em', '', r1, 'We’ll email you a label to print.');
      const r2 = u.el('span', 'ds-radio', f4);
      u.el('i', '', r2);
      u.el('b', '', r2, 'In-store return');
      u.el('em', '', r2, 'Return at any HomeNest store.');
      const qty = u.el('div', 'ds-static ds-s-qty', deco);
      u.el('span', 'ds-sl', qty, 'Quantity');
      const q = u.el('span', 'ds-sbox ds-q', qty, '1');
      q.insertAdjacentHTML(
        'beforeend',
        '<svg viewBox="0 0 18 26" width="18" height="26" fill="none" stroke="#586373" stroke-width="1.5"><path d="m4 10 5-5 5 5m-10 6 5 5 5-5"/></svg>',
      );
      u.el('span', 'ds-of', qty, 'of 1');
      const foot = u.el('footer', 'ds-footer', main);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(foot, 'ds-submit', label);
        else if (placement === 'link') submit = endBtn(foot, 'ds-endlink', label + ' ›');
        if (collide && collide.where === 'footer') decoyBtn(foot, collide.text, true);
      }
      const margin = u.el('aside', 'ds-margin', body);
      if (mode === 'panel') {
        u.el('div', 'ds-yt', margin, 'Your task');
        u.el('div', 'ds-instruction', margin, ctx.instruction);
        u.el('hr', '', margin);
      }
      if (mode !== 'hidden') {
        u.el('div', 'ds-yt ds-notes', margin, 'Notes');
        const ul = u.el('ul', 'ds-nl', margin);
        [
          'Select the correct item from the dropdown list.',
          'Do not change any other fields.',
          ctx.finish ? 'Then finish the task.' : 'Then use the action control.',
        ].forEach((t) => u.el('li', '', ul, t));
      }
      if (mode === 'toast') {
        const b = u.el('aside', 'ds-toast', document.body);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      return { stage, submit: ctx.finish ? null : placement === 'title' ? titleSubmit : submit };
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
