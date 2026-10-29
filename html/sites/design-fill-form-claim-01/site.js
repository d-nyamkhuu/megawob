(function () {
  'use strict';
  const C = { site: 'design-fill-form-claim-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        header = u.el('header', 'claim-header', document.body);
      u.el('strong', 'claim-title', header, 'Insurance Claims');
      const endR = ctx.rng.fork('chrome/end'),
        bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const save = labels.find((x) => labelOf(x).toLowerCase() === 'save');
      const endLabel = endR.bool(0.5) && save ? labelOf(save) : labelOf(endR.pick(labels));
      const placement = ctx.finish ? null : endR.pick(['header', 'header', 'footer', 'link']);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const opts = [...new Set(labels.map(labelOf))].filter((x) => x.toLowerCase() !== endLabel.toLowerCase());
        if (opts.length) collide = collideR.pick(opts);
      }
      const makeEnd = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'claim-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = makeEnd(header, 'claim-save', endLabel);
      if (collide && placement === 'header') decoy(header, collide);
      const display = ctx.display || 'hidden';
      if (display === 'header') {
        const note = u.el('div', 'claim-note-header', header, ctx.instruction);
        header.insertBefore(note, header.children[1] || null);
      }
      const body = u.el('div', 'claim-body', document.body),
        stage = u.el('main', 'claim-stage', body);
      const related = u.el('aside', 'claim-related', body);
      const rh = u.el('div', 'claim-related-heading', related);
      u.el('b', 'claim-number', rh, '03');
      u.el('strong', '', rh, 'Related Claims');
      const rules = u.el('div', 'claim-rule', related);
      if (display === 'panel') {
        const note = u.el('div', 'claim-note-panel', related, ctx.instruction);
        related.insertBefore(note, rh);
      }
      const list = u.el('div', 'claim-list', related);
      const rr = ctx.rng.fork('chrome/related'),
        dates = [
          'Apr 12, 2016',
          'Mar 3, 2016',
          'Feb 18, 2016',
          'Jan 27, 2016',
          'Jan 14, 2016',
          'Dec 30, 2015',
          'Dec 12, 2015',
          'Nov 28, 2015',
          'Nov 7, 2015',
          'Oct 21, 2015',
        ];
      const records = dates.map((date, i) => {
        const p = ctx.content.personName(rr, { csplit: ctx.spec.csplit });
        return [`CLM-${10027 - i}`, `${p.first} ${p.last}`, date, i ? 'Closed' : 'Open'];
      });
      records.forEach((x, i) => {
        const row = u.el('div', 'claim-row' + (!i ? ' selected' : ''), list);
        const top = u.el('div', 'claim-row-top', row);
        u.el('strong', '', top, x[0]);
        u.el('span', '', top, x[2]);
        const low = u.el('div', 'claim-row-bottom', row);
        u.el('span', '', low, x[1]);
        u.el('span', 'claim-badge ' + (!i ? 'open' : 'closed'), low, x[3]);
      });
      if (display === 'toast') u.el('div', 'claim-note-toast', document.body, ctx.instruction);
      const footer = u.el('footer', 'claim-footer', document.body);
      u.el('span', '', footer, '');
      if (!ctx.finish && placement === 'footer') {
        footer.classList.add('has-end');
        submit = makeEnd(footer, 'claim-footer-end', endLabel);
      }
      if (!ctx.finish && placement === 'link') submit = makeEnd(header, 'claim-link-end', endLabel, 'a');
      if (collide && placement !== 'header') decoy(header, collide);
      document.body.style.setProperty('--claim-header-h', header.getBoundingClientRect().height + 'px');
      document.body.style.setProperty('--claim-footer-h', footer.getBoundingClientRect().height + 'px');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const close = () => {
        const backdrop = document.querySelector('.claim-overlay-backdrop');
        if (backdrop) backdrop.remove();
        ctx.dismiss('close');
      };
      if (ctx.kind === 'promo') u.el('div', 'claim-overlay-backdrop', document.body);
      const el = u.el('section', 'claim-overlay claim-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') document.body.insertBefore(el, document.querySelector('.claim-body'));
      const symbol = u.el('span', 'claim-overlay-symbol', el);
      const copy = u.el('div', 'claim-overlay-copy', el);
      if (ctx.kind === 'cookie') {
        symbol.innerHTML =
          '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#e9bd7b"/><g fill="#82613f"><circle cx="10" cy="9" r="2.4"/><circle cx="21" cy="10" r="2"/><circle cx="16" cy="17" r="2.5"/><circle cx="8" cy="21" r="1.7"/><circle cx="22" cy="23" r="2.2"/></g></svg>';
        u.el(
          'span',
          '',
          copy,
          'We use cookies to improve your experience, analyze site usage, and assist in our marketing efforts.',
        );
        u.el('a', 'claim-learn-more', el, 'Learn more');
      } else if (ctx.kind === 'promo') {
        symbol.innerHTML =
          '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M10 50L60 13L110 50V111H10Z" fill="#ffb522"/><path d="M27 26H94V86H27Z" fill="#e9f2ff"/><path d="M35 39H85M35 49H85M35 59H78" stroke="#2474e4" stroke-width="4"/><path d="M10 50L60 83L110 50V111H10Z" fill="#ffc133"/><path d="M10 111L60 73L110 111" fill="#ffa91b"/><path d="M60 5V0M25 16L19 10M96 16L103 9" stroke="#ffbf00" stroke-width="5"/></svg>';
        u.el('strong', '', copy, 'Stay in the loop');
        u.el('p', '', copy, 'Get the latest product updates, tips, and insurance insights delivered to your inbox.');
        const email = u.el('input', 'claim-promo-email', el);
        email.type = 'text';
        email.placeholder = 'Enter your email address';
        email.setAttribute('aria-label', 'Newsletter email address');
        const actions = u.el('div', 'claim-promo-actions', el);
        const subscribe = u.el('button', '', actions, 'Subscribe');
        subscribe.type = 'button';
        const later = u.el('button', '', actions, 'Maybe later');
        later.type = 'button';
        later.addEventListener('click', close);
      } else if (ctx.kind === 'banner') {
        symbol.innerHTML =
          '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 12H12L27 6V25L12 20H5Z" fill="#0055d9"/><path d="M11 20L14 29H8L6 20" fill="#0055d9"/><path d="M29 12V19M13 12V20" stroke="#6aa4f2" stroke-width="2"/></svg>';
        u.el('strong', '', copy, 'Scheduled maintenance');
        u.el('p', '', copy, 'Some features may be unavailable during scheduled maintenance.');
      } else if (ctx.kind === 'chat') {
        symbol.textContent = '?';
        u.el('strong', '', copy, 'How can we help?');
        u.el('p', '', copy, 'Send us a message. Our team is here to help.');
      } else {
        symbol.textContent = '✓';
        u.el('span', '', copy, 'Changes saved.');
      }
      const dismiss = u.el(
        'button',
        'claim-overlay-dismiss',
        el,
        ['cookie', 'banner'].includes(ctx.kind) ? 'Dismiss' : '×',
      );
      dismiss.type = 'button';
      dismiss.setAttribute('aria-label', 'Close');
      dismiss.addEventListener('click', close);
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
