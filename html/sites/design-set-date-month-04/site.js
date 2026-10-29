(function () {
  'use strict';
  const C = { site: 'design-set-date-month-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      u.el('div', 'ds-lights', top, '');
      const tabs = u.el('nav', 'ds-menu', top);
      ['Overview', 'Transactions', 'Budgets', 'Reports'].forEach((t, i) =>
        u.el('div', 'ds-tab' + (i === 2 ? ' active' : '') + (i === 1 ? ' quiet' : ''), tabs, t),
      );
      const search = u.el('div', 'ds-search', top, '⌕　Search');
      const main = u.el('div', 'ds-main', content);
      const inspector = u.el('aside', 'ds-inspector', main);
      u.el('h1', '', inspector, 'Marketing Campaign');
      u.el('div', 'ds-category', inspector, '●　Marketing');
      [
        ['Amount (USD)', '$25,000'],
        ['Period', 'Monthly'],
        ['Category', '♧ Marketing'],
        ['Budget Month', '—'],
        ['Notes', 'Q4 campaign across digital and events.'],
      ].forEach((x) => {
        const r = u.el('div', 'ds-inspector-row', inspector);
        u.el('span', '', r, x[0]);
        u.el('b', '', r, x[1]);
      });
      u.el('h3', '', inspector, 'Spending');
      u.el('div', 'ds-progress', inspector);
      u.el('div', 'ds-spent', inspector, '$8,420 of $25,000 (37%)');
      [
        ['Remaining', '$16,580'],
        ['Days left in month', '12'],
      ].forEach((x) => {
        const r = u.el('div', 'ds-inspector-row', inspector);
        u.el('span', '', r, x[0]);
        u.el('b', '', r, x[1]);
      });
      u.el('h3', 'ds-history-head', inspector, 'History');
      const hist = u.el('table', 'ds-history', inspector);
      const head = u.el('thead', '', hist);
      const hr = u.el('tr', '', head);
      ['Date　⌃', 'Description', 'Amount'].forEach((x) => u.el('th', '', hr, x));
      const rows = u.el('tbody', '', hist);
      [
        ['Oct 3, 2026', 'Ad creative', '-$2,400'],
        ['Oct 12, 2026', 'Social media', '-$1,020'],
      ].forEach((data) => {
        const tr = u.el('tr', '', rows);
        data.forEach((x) => u.el('td', '', tr, x));
      });
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
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
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Submit';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) placement = 'footer';
        else {
          const a = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          if (a.length) label = endRng.pick(a);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const endButton = (parent, cls, text, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, text);
        if (asLink) b.href = '#';
        else b.type = 'button';
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
            const text = cr.pick(words),
              d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, 'Budgets');
      [
        ['◷', 'All Budgets', '8'],
        ['♧', 'Marketing', '3'],
        ['⬡', 'Product', '2'],
        ['⚙', 'Operations', '2'],
        ['♧', 'People', '1'],
      ].forEach((x, i) => {
        const r = u.el('div', 'ds-navrow' + (i === 1 ? ' selected' : ''), rail);
        u.el('span', 'ds-navicon', r, x[0]);
        u.el('span', '', r, x[1]);
        u.el('span', 'ds-count', r, x[2]);
      });
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
