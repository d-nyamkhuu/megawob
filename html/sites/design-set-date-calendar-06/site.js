(function () {
  'use strict';
  const C = { 'site': 'design-set-date-calendar-06', 'brand': 'Contoso Orders', 'title': 'Order Summary' };
  const TRUCK =
    '<svg viewBox="0 0 140 104" width="100%" height="100%"><path d="M5 0h78q5 0 5 5v78H0V5q0-5 5-5zM94 23h22q4 0 6 4l18 29v27H94z" fill="#60788f"/><path d="M103 32h13l13 20h-26z" fill="#dde5ee"/><circle cx="29" cy="88" r="16" fill="#60788f" stroke="#dde5ee" stroke-width="5"/><circle cx="112" cy="88" r="16" fill="#60788f" stroke="#dde5ee" stroke-width="5"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endR = ctx.rng.fork('chrome/end');
      const endBank = Array.isArray(ctx.content && ctx.content.END_LABELS)
        ? ctx.content.END_LABELS
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submitLabel = labelOf(endBank.find((x) => labelOf(x) === 'Submit') || 'Submit');
      const others = endBank.filter((x) => labelOf(x) !== submitLabel);
      const endOptions = [
        submitLabel,
        submitLabel,
        submitLabel,
        submitLabel,
        submitLabel,
        ...(others.length ? others.slice(0, 5) : [submitLabel]),
      ];
      const endLabel = labelOf(endR.pick(endOptions));
      const placement = ctx.finish
        ? null
        : endR.pick([
            'footer',
            'footer',
            'footer',
            'footer',
            'footer',
            'footer',
            'footer',
            'footer',
            'footer',
            'header',
            'link',
          ]);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = endBank.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) collide = collideR.pick(pool);
      }
      const tb = u.el('header', 'ds-titlebar', document.body);
      const logo = u.el('span', 'ds-logo', tb);
      logo.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 18 18"><rect x="0" y="0" width="18" height="18" rx="1" fill="#fff"/><path d="M6 1l1 7H1m8-7v7h8M8 9v8m-7-7h6l2 4" stroke="#1763ad" stroke-width="1" fill="none"/></svg>';
      u.el('span', 'ds-apptitle', tb, C.brand);
      const wc = u.el('span', 'ds-wc', tb);
      u.el('i', 'ds-min', wc);
      u.el('i', 'ds-max', wc);
      const cl = u.el('i', 'ds-close', wc);
      cl.textContent = '✕';
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide && placement === 'header') decoyBtn(tb, collide);
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = endBtn(tb, 'ds-submit ds-header-submit', endLabel);
      const ov = u.el('section', 'ds-overview', document.body);
      u.el('h1', 'ds-ovtitle', ov, C.title);
      const kv = u.el('div', 'ds-kv', ov);
      [
        ['Order number', 'SO-10428', 0],
        ['Customer', 'Northwind Traders', 0],
        ['Items', '4', 0],
      ].forEach((r) => {
        u.el('span', 'k', kv, r[0]);
        u.el('span', 'v', kv, r[1]);
      });
      const kv2 = u.el('div', 'ds-kv ds-kv2', ov);
      [
        ['Subtotal', '$892.00', 0],
        ['Shipping', '$35.00', 0],
        ['Total', '$927.00', 1],
      ].forEach((r) => {
        u.el('span', 'k', kv2, r[0]);
        u.el('span', 'v' + (r[2] ? ' b' : ''), kv2, r[1]);
      });
      const tr = u.el('div', 'ds-truck', ov);
      tr.innerHTML = TRUCK;
      const ps = u.el('div', 'ds-prep', ov);
      u.el('div', 'h', ps, 'Preparing for delivery');
      u.el('div', 't', ps, 'Complete the details below to schedule delivery.');
      const work = u.el('div', 'ds-work', document.body);
      if (ctx.display !== 'hidden') {
        const n = u.el(
          'aside',
          ctx.display === 'toast' ? 'ds-toast' : ctx.display === 'panel' ? 'ds-panel-note' : 'ds-header-note',
          work,
        );
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', work);
      const foot = u.el('footer', 'ds-footer', work);
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      if (collide && placement !== 'header') decoyBtn(foot, collide);
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'ds-submit', endLabel);
      if (!ctx.finish && placement === 'link') submit = endBtn(foot, 'ds-endlink', endLabel + ' ›');
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
