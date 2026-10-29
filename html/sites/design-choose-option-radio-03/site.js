(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-radio-03',
    'brand': 'Riverton University',
    'title': 'Email Preferences',
    'instruction': 'left',
    'rail': '',
    'menu': 'Office of Communications',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const over = u.el('header', 'ds-over', document.body);
      over.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
      });
      u.el('i', 'ds-blob ds-blob-l', over);
      u.el('i', 'ds-blob ds-blob-c', over);
      u.el('i', 'ds-blob ds-blob-t', over);
      u.el('i', 'ds-dots ds-dots-t', over);
      u.el('h1', 'ds-order-title', over, 'Your Order');
      const pic = u.el('div', 'ds-pic', over);
      pic.innerHTML =
        '<svg viewBox="0 0 100 100"><path d="M36 30c0-18 28-18 28 0" fill="none" stroke="#1d2a2a" stroke-width="5"/><rect x="22" y="26" width="56" height="66" rx="22" fill="#6fb09a"/><rect x="30" y="58" width="40" height="26" rx="8" fill="#5c9c88" stroke="#3f7766" stroke-width="2"/><rect x="42" y="38" width="14" height="10" rx="2" fill="#8a5a3a"/><rect x="14" y="40" width="8" height="40" rx="4" fill="#26323a"/><rect x="78" y="40" width="8" height="40" rx="4" fill="#26323a"/></svg>';
      const prod = u.el('div', 'ds-prod', over);
      u.el('b', '', prod, 'Everyday Backpack');
      u.el('span', '', prod, 'Sage Green');
      u.el('span', '', prod, 'Qty: 1');
      u.el('strong', '', prod, '$49.00');
      const del = u.el('div', 'ds-delto', over);
      u.el('b', '', del, 'Delivery to');
      u.el('span', '', del, 'Jordan Lee');
      u.el('span', '', del, '123 Maple Ave');
      u.el('span', '', del, 'Riverside, CA 92507');
      u.el('a', '', del, 'Edit').href = '#';
      const sum = u.el('div', 'ds-sum', over);
      u.el('b', '', sum, 'Order Summary');
      [
        ['Subtotal', '$49.00'],
        ['Shipping', '$5.00'],
        ['Tax', '$4.46'],
      ].forEach((r) => {
        const d = u.el('div', 'ds-sumrow', sum);
        u.el('span', '', d, r[0]);
        u.el('span', '', d, r[1]);
      });
      const tot = u.el('div', 'ds-sumrow ds-total', sum);
      u.el('span', '', tot, 'Total');
      u.el('span', '', tot, '$58.46');
      const body = u.el('div', 'ds-body', document.body);
      body.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
      });
      const content = u.el('div', 'ds-content', body);
      u.el('i', 'ds-tri-l', content);
      u.el('i', 'ds-tri-r', content);
      u.el('i', 'ds-dots ds-dots-b', content);
      const main = u.el('div', 'ds-main', content);
      const side = u.el('aside', 'ds-brief', main);
      const identity = u.el('div', 'ds-university', side);
      u.el('a', '', identity, 'Riverton University').href = '#';
      u.el('div', '', identity, 'Office of Communications');
      const task = u.el('section', 'ds-academic-task', side);
      u.el('h2', '', task, 'Task');
      u.el('p', '', task, 'Update your email preferences for university news and events.');
      if (ctx.display !== 'hidden' && ctx.display !== 'toast') u.el('div', 'ds-instruction', task, ctx.instruction);
      const help = u.el('section', 'ds-academic-help', side);
      u.el('h3', '', help, 'Need help?');
      u.el('p', '', help, 'If you have questions, please contact the Communications Office at ');
      u.el('a', '', help, 'news@riverton.edu').href = '#';
      const stage = u.el('main', 'ds-stage', main);
      if (ctx.display === 'toast') {
        const n = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        content.insertBefore(n, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const originalEnd = er.bool(0.5);
      const placement = originalEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = originalEnd ? 'Submit' : er.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? foot : placement === 'header' ? over : content;
        submit = u.el(
          'button',
          placement === 'link' ? 'ds-endlink' : 'ds-submit' + (placement === 'header' ? ' ds-endheader' : ''),
          parent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el(
            'button',
            'ds-xtra' + (!ctx.finish && placement === 'header' ? ' ds-xtra-near-end' : ''),
            over,
            label,
          );
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const reset = u.el('button', 'ds-reset', foot, 'Back');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        const controls = stage.querySelectorAll('input[type=radio]');
        controls.forEach((el) => (el.checked = false));
      });
      u.el('a', 'ds-cancel-link', foot, 'Cancel').href = '#';
      const links = u.el('nav', 'ds-footer-links', foot);
      ['Privacy Policy', 'Contact Us', 'Help'].forEach((t) => (u.el('a', '', links, t).href = '#'));
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
