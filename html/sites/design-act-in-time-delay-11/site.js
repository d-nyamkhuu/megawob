(function () {
  'use strict';
  const C = { site: 'design-act-in-time-delay-11' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const mast = u.el('header', 'ds-top', document.body);
      u.el('div', 'ds-mark', mast, '▤');
      const identity = u.el('div', 'ds-identity', mast);
      u.el('div', 'ds-brand', identity, 'Northbridge Extranet');
      u.el('div', 'ds-tagline', identity, 'SUPPLIER PARTNER NETWORK');
      const account = u.el('div', 'ds-account', mast);
      u.el('div', '', account, 'Welcome, Pat Miller　 |　 Help　 |　 Log Out');
      u.el('div', 'ds-date', account, 'Thu, Apr 15, 1999');
      const nav = u.el('nav', 'ds-menu', document.body);
      ['Home', 'Orders', 'Shipments', 'Invoices', 'Reports', 'Administration'].forEach((t, i) =>
        u.el('span', i === 2 ? 'active' : '', nav, t),
      );
      const content = u.el('div', 'ds-content', document.body);
      let submit = null;
      const title = u.el('div', 'ds-titlebar', content);
      u.el('strong', '', title, 'Shipment Approval');
      u.el('b', '', title, 'Customer: General Industrial Supply　　Account #: 45877');
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['footer', 'footer', 'title', 'link']);
      const pool = ctx.content && ctx.content.END_LABELS;
      const chosen = er.bool(0.5) ? 'Submit' : pool && pool.length ? er.pick(pool) : 'Done';
      const endLabel =
        placement === 'footer' ? 'Submit' : typeof chosen === 'string' ? chosen : chosen.label || chosen.text || 'Done';
      if (!ctx.finish && placement === 'title') {
        submit = u.el('button', 'ds-title-submit', title, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const steps = u.el('div', 'ds-steps', content);
      ['Review Details', 'Confirm', 'Complete'].forEach((t, i) => {
        const s = u.el('div', i === 0 ? 'current' : '', steps);
        u.el('b', '', s, String(i + 1));
        u.el('strong', '', s, t);
      });
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      function instruction(parent, cls) {
        const n = u.el('aside', cls, parent);
        const icon = u.el('div', 'ds-hourglass', n);
        icon.innerHTML =
          '<svg viewBox="0 0 48 58" aria-hidden="true"><path d="M5 3h38M5 55h38M9 5c0 13 4 15 15 24C13 38 9 42 9 53m30-48c0 13-4 15-15 24 11 9 15 13 15 24" fill="none" stroke="#111820" stroke-width="4"/><path d="M15 12h18l-9 12zm0 34h18l-9-12z" fill="#111820"/></svg>';
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      }
      let note = null;
      if (mode === 'header') note = instruction(content, 'ds-header-note');
      const stage = u.el('main', 'ds-stage', content);
      if (mode === 'toast') {
        note = instruction(content, 'ds-toast');
        content.insertBefore(note, stage);
      }
      if (mode === 'panel') {
        note = instruction(content, 'ds-panel-note');
      }
      const data = u.el('section', 'ds-data', content);
      const left = u.el('div', 'ds-data-col', data);
      const panel = (parent, title) => {
        const p = u.el('section', 'ds-gridpanel', parent);
        u.el('h3', '', p, title);
        return p;
      };
      const detail = panel(left, 'Shipment Details');
      [
        ['Shipment ID:', 'SHP-10432'],
        ['Order #:', 'PO-77190'],
        ['Customer:', 'General Industrial Supply'],
        ['Ship Date:', 'Apr 15, 1999'],
        ['Requested Delivery:', 'Apr 20, 1999'],
        ['Ship To:', '1000 Commerce Blvd.\nRiverdale, IL 60827\nUSA'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-detailrow', detail);
        u.el('span', '', r, row[0]);
        u.el('span', '', r, row[1]);
      });
      const approvals = panel(left, 'Approvals');
      const ah = u.el('div', 'ds-approvalrow ds-th', approvals);
      ['Role', 'Name', 'Status', 'Date'].forEach((x) => u.el('b', '', ah, x));
      [
        ['Requestor', 'J. Carter', 'Approved', 'Apr 14, 1999'],
        ['Manager', 'L. Nguyen', 'Approved', 'Apr 14, 1999'],
        ['Finance', 'R. Patel', 'Pending', '—'],
        ['Shipping', '—', 'Pending', '—'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-approvalrow', approvals);
        row.forEach((x, i) => u.el('span', i === 2 ? (x === 'Approved' ? 'good' : 'pending') : '', r, x));
      });
      const right = u.el('div', 'ds-data-col', data);
      const items = panel(right, 'Items in Shipment');
      const ih = u.el('div', 'ds-itemrow ds-th', items);
      ['Line', 'Part Number', 'Description', 'Qty', 'UOM'].forEach((x) => u.el('b', '', ih, x));
      [
        ['1', 'AX-100', 'Valve Assembly', '10', 'EA'],
        ['2', 'BR-200', 'Mounting Bracket', '25', 'EA'],
        ['3', 'CS-305', 'Control Switch', '5', 'EA'],
        ['4', 'DW-410', 'Wiring Harness', '12', 'EA'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-itemrow', items);
        row.forEach((x) => u.el('span', '', r, x));
      });
      const notes = panel(right, 'Notes');
      [
        'The Next button will become enabled at 00:30 on the task clock.',
        'Please review the shipment details while you wait.',
        'You do not need to type anything.',
        'If the Next button does not appear after 00:30, contact your administrator.',
      ].forEach((t) => u.el('p', '', notes, t));
      const foot = u.el('footer', 'ds-footer', content);
      u.el('button', 'ds-back', foot, 'Back');
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'ds-submit', foot, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      } else if (!ctx.finish && placement === 'link') {
        submit = u.el('a', 'ds-endlink', foot, endLabel);
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (!ctx.finish && er.bool(0.3)) {
        const d = u.el('button', 'ds-xtra', foot, 'Help');
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const labels = (
          pool && pool.length ? pool : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        )
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (labels.length) {
          const label = cr.pick(labels);
          const d = u.el('button', 'ds-xtra', foot, label);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label, collide: true }));
          if (submit && submit.parentNode === foot) foot.insertBefore(d, submit);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'promo') {
        document.body.classList.add('ds-tour-open');
        const closeTour = () => {
          document.body.classList.remove('ds-tour-open');
          ctx.dismiss('close');
        };
        const bar = u.el('header', 'ds-tourbar', el);
        u.el('b', '', bar, 'Application Tour');
        const x = u.el('button', 'ds-x', bar, '×');
        x.addEventListener('click', closeTour);
        const body = u.el('div', 'ds-tourbody', el);
        u.el('div', 'ds-infoicon', body, 'i');
        const words = u.el('div', '', body);
        u.el('strong', '', words, 'Take a quick tour?');
        u.el('p', '', words, 'Learn about shipment approval in three short steps.');
        const actions = u.el('div', 'ds-touractions', el);
        const skip = u.el('button', 'ds-skip', actions, 'Skip tour');
        skip.addEventListener('click', closeTour);
        const next = u.el('button', 'ds-nexttour', actions, 'Next >');
        next.addEventListener('click', closeTour);
        u.el('div', 'ds-tourcount', el, '1 of 3');
        return { el, dismiss: skip };
      }
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Take a quick tour?',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
