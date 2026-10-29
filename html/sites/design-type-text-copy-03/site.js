(function () {
  'use strict';
  const C = { site: 'design-type-text-copy-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        win = u.el('div', 'cb-window', document.body);
      const title = u.el('header', 'cb-titlebar', win);
      u.el('span', 'cb-appicon', title, '▦');
      u.el('span', 'cb-title', title, 'ClearBooks Pro - Orders');
      const controls = u.el('span', 'cb-win-controls', title);
      ['−', '□', '×'].forEach((x, i) => {
        const b = u.el('span', 'cb-win-btn cb-w' + i, controls, x);
      });
      const menu = u.el('nav', 'cb-menubar', win);
      ['File', 'Edit', 'View', 'Records', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'cb-toolbar', win);
      [
        ['▤', 'New Order'],
        ['✎', 'Edit'],
        ['✖', 'Delete'],
        ['▤', 'Print'],
        ['✉', 'Send by Email'],
      ].forEach((it, i) => {
        const b = u.el('div', 'cb-tool' + ([2, 3].includes(i) ? ' cb-tool-sep' : ''), toolbar);
        u.el('b', '', b, it[0]);
        u.el('span', '', b, it[1]);
        if (i === 3) u.el('small', '', b, '▾');
      });
      const search = u.el('div', 'cb-search', toolbar);
      u.el('b', '', search, '⌕');
      u.el('span', '', search, 'Search orders');
      const content = u.el('div', 'cb-content', win);
      let mode = ctx.display;
      if (mode === 'header') {
        const n = u.el('div', 'cb-header-note', content, ctx.instruction);
      }
      const summary = u.el('section', 'cb-summary', content);
      u.el('div', 'cb-docicon', summary, '▤');
      const details = u.el('div', 'cb-summary-main', summary);
      const heading = u.el('div', 'cb-record-heading', details);
      u.el('strong', '', heading, 'Order');
      u.el('span', '', heading, 'OR-10426');
      const facts = u.el('div', 'cb-facts', details);
      [
        ['Customer', 'Riverside Supplies'],
        ['Contact', 'Daniel Carter'],
        ['Billing address', 'Unit 4, Riverside Business Park'],
        ['', 'Bristol   BS1 6PL'],
      ].forEach((a) => {
        const r = u.el('div', 'cb-fact', facts);
        u.el('span', '', r, a[0]);
        u.el('b', '', r, a[1]);
      });
      const dates = u.el('div', 'cb-datefacts', summary);
      [
        ['Order date', '14 Apr 2009'],
        ['Status', 'Completed'],
        ['Payment terms', '30 days'],
        ['Due date', '14 May 2009'],
      ].forEach((a) => {
        const r = u.el('div', 'cb-fact', dates);
        u.el('span', '', r, a[0]);
        u.el('b', '', r, a[1]);
      });
      const totals = u.el('div', 'cb-totals', summary);
      [
        ['Total (GBP)', '1,250.00'],
        ['VAT', '250.00'],
        ['Order total', '1,250.00'],
      ].forEach((a, i) => {
        const r = u.el('div', 'cb-total' + (i === 2 ? ' cb-grand' : ''), totals);
        u.el('span', '', r, a[0]);
        u.el('b', '', r, a[1]);
      });
      const main = u.el('div', 'cb-workspace', content);
      const stage = u.el('main', 'ds-stage cb-stage', main);
      const related = u.el('section', 'cb-related' + (mode === 'panel' ? ' with-task-note' : ''), main);
      u.el('h3', '', related, 'Related payments');
      if (mode === 'panel') {
        const note = u.el('aside', 'cb-task-panel', related);
        u.el('strong', '', note, 'Task note');
        u.el('div', '', note, ctx.instruction);
      }
      const table = u.el('div', 'cb-table', related),
        head = u.el('div', 'cb-row cb-row-head', table);
      ['Date', 'Payment reference', 'Amount (GBP)', 'Method'].forEach((t) => u.el('span', '', head, t));
      [
        ['20 Mar 2009', 'PAY-001983', '250.00', 'Bank Transfer'],
        ['28 Mar 2009', 'PAY-001997', '500.00', 'Bank Transfer'],
        ['06 Apr 2009', 'PAY-002011', '250.00', 'Cheque'],
      ].forEach((row) => {
        const r = u.el('div', 'cb-row', table);
        row.forEach((t) => u.el('span', '', r, t));
      });
      for (let i = 0; i < 9; i++) {
        const r = u.el('div', 'cb-row cb-empty', table);
        for (let j = 0; j < 4; j++) u.el('span', '', r, '');
      }
      u.el('div', 'cb-scrollbar', related);
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast cb-toast', content);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer cb-dock', win);
      const nav = u.el('div', 'cb-dock-nav', foot);
      [
        ['◴', 'Dashboard'],
        ['♟♟', 'Customers'],
        ['▤', 'Orders'],
        ['▧', 'Invoices'],
        ['◉', 'Payments'],
        ['⬡', 'Products'],
        ['▥', 'Reports'],
      ].forEach((it, i) => {
        const x = u.el('div', 'cb-dock-item' + (i === 2 ? ' active' : ''), nav);
        u.el('b', '', x, it[0]);
        u.el('span', '', x, it[1]);
      });
      let submit = null,
        placement = null,
        label = 'Submit',
        collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          canonical = er.bool(0.5);
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool =
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          label = String(er.pick(pool));
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const options = [...new Set(pool)].filter(
            (x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = cr.pick(options);
        }
        const addDecoy = (parent, text) => {
          const b = u.el('button', 'ds-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        const endButton = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (canonical) submit = endButton(foot, 'ds-submit', label);
        else if (placement === 'header') {
          if (collide) addDecoy(toolbar, collide);
          submit = endButton(toolbar, 'ds-submit ds-submit-header', label);
        } else {
          if (collide) addDecoy(foot, collide);
          submit = endButton(foot, 'ds-submit ds-submit-link', label);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
