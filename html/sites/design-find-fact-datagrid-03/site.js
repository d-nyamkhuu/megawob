(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-datagrid-03',
    brand: 'Acme Supply Co.',
    title: 'Orders',
    briefTitle: 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const right = u.el('div', 'ds-tools', top);
      let mode = ctx.display;
      if (mode === 'toast' && window.innerHeight < 700) mode = 'header';
      if (mode === 'panel' && window.innerWidth < 1120) mode = 'header';
      if (mode === 'header') u.el('div', 'ds-instruction ds-header-note', top, ctx.instruction);
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.bool(0.75) ? 'header' : er.pick(['footer', 'link', 'icon']);
      const label = ctx.finish ? '' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const p = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (p.length) collide = cr.pick(p);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide) decoy(right, collide);
      let submit = null;
      if (placement === 'header') submit = end(right, 'ds-submit', label);
      const main = u.el('div', 'ds-main', document.body);
      const stage = u.el('main', 'ds-stage', main);
      const inspector = u.el('aside', 'ds-inspector', main);
      if (mode === 'panel') {
        u.el('div', 'ds-taskpanel', inspector, ctx.instruction);
      }
      u.el('h2', '', inspector, 'Order Details');
      const rows = ['Order Number', 'Customer', 'Order Date', 'Item Count', 'Total Value'];
      const summary = u.el('div', 'ds-summary', inspector);
      rows.forEach((x) => {
        const row = u.el('div', 'ds-detail', summary);
        u.el('span', '', row, x);
        u.el('span', '', row, '—');
      });
      u.el('div', 'ds-divider', inspector);
      u.el('h3', 'ds-items-title', inspector, 'Items');
      const items = u.el('div', 'ds-items', inspector);
      const th = u.el('div', 'ds-item-head', items);
      ['#', 'Item', 'Quantity', 'Unit Price', 'Total'].forEach((x) => u.el('span', '', th, x));
      u.el('div', 'ds-empty', items, 'Select an order to see its items here.');
      if (mode === 'toast') {
        const note = u.el('div', 'ds-toast', document.body);
        u.el('div', 'ds-instruction', note, ctx.instruction);
        const close = u.el('button', 'ds-close', note, '×');
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => {
          note.style.visibility = 'hidden';
        });
      }
      let foot = null;
      if (placement === 'footer' || placement === 'link') {
        foot = u.el('footer', 'ds-footer', document.body);
        if (placement === 'footer') submit = end(foot, 'ds-submit', label);
        else {
          const a = u.el('a', 'ds-endlink', foot, label + ' ›');
          a.href = '#';
          a.dataset.role = 'submit';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          submit = a;
        }
      }
      if (placement === 'icon') submit = end(right, 'ds-submit ds-icon', '✓');
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
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
