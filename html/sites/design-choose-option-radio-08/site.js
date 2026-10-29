(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-radio-08' };
  const GEAR =
    '<svg viewBox="0 0 16 16" width="100%" height="100%"><circle cx="8" cy="8" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 1.5v2.4M8 12.1v2.4M1.5 8h2.4M12.1 8h2.4M3.4 3.4l1.7 1.7M10.9 10.9l1.7 1.7M3.4 12.6l1.7-1.7M10.9 5.1l1.7-1.7" stroke="currentColor" stroke-width="2.2"/></svg>';
  const ROWS = [
    ['Projects', '3', '20', '100', 'Unlimited'],
    ['Team Members', '1', '5', '25', 'Unlimited'],
    ['Storage', '1 GB', '10 GB', '100 GB', '1 TB'],
    ['Priority Support', '—', '—', '✓', '✓'],
    ['Custom Branding', '—', '—', '✓', '✓'],
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
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
          "I'm done",
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const baseline = !ctx.finish && endR.bool(0.5);
      const endLabel = baseline ? 'Submit' : labels[endR.int(0, labels.length - 1)] || 'Done';
      const placement = baseline ? 'footer' : ['titlebar', 'link'][endR.int(0, 1)];
      let collide = null,
        collideWhere = placement === 'titlebar' ? 'titlebar' : 'footer';
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = labels.filter((x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase());
        if (pool.length) collide = pool[collideR.int(0, pool.length - 1)];
      }
      const tb = u.el('div', 'ds-titlebar', document.body);
      const ic = u.el('span', 'ds-appicon', tb);
      ic.innerHTML = GEAR;
      u.el('span', 'ds-apptitle', tb, 'Account Setup');
      const wc = u.el('span', 'ds-wctl', tb);
      u.el('i', 'ds-min', wc);
      u.el('i', 'ds-max', wc);
      const cl = u.el('i', 'ds-close', wc, '✕');
      const makeEnd = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const makeDecoy = (parent, label) => {
        const b = u.el('button', 'ds-pq', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      let submit = null;
      if (!ctx.finish && placement === 'titlebar') {
        tb.classList.add('ds-has-end');
        if (collide && collideWhere === 'titlebar') {
          const d = makeDecoy(tb, collide);
          tb.insertBefore(d, wc);
        }
        submit = makeEnd(tb, 'ds-title-end', endLabel);
        tb.insertBefore(submit, wc);
      }
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      let instructionBox = null;
      if (ctx.display !== 'hidden' && ctx.display !== 'toast') {
        instructionBox = u.el('div', 'ds-instruction', main);
        u.el('span', 'ds-info', instructionBox, 'i');
        u.el('span', 'ds-itext', instructionBox, ctx.instruction);
      }
      const side = u.el('aside', 'ds-brief', main);
      if (instructionBox && ctx.display === 'panel') {
        instructionBox.classList.add('ds-panel-note');
        side.appendChild(instructionBox);
      }
      const help = u.el('div', 'ds-helplink', side);
      u.el('span', 'ds-q', help, '?');
      u.el('span', '', help, 'Help');
      if (instructionBox && ctx.display === 'panel') side.insertBefore(instructionBox, help.nextSibling);
      u.el('h2', '', side, 'Plan Details');
      u.el('p', 'ds-plansub', side, 'Compare the features included in each plan.');
      const tbl = u.el('table', 'ds-table', side);
      const thr = u.el('tr', '', u.el('thead', '', tbl));
      ['Feature', 'Starter', 'Pro', 'Business', 'Enterprise'].forEach((t) => u.el('th', '', thr, t));
      const tbd = u.el('tbody', '', tbl);
      ROWS.forEach((r) => {
        const tr = u.el('tr', '', tbd);
        r.forEach((t) => u.el('td', '', tr, t));
      });
      if (ctx.display === 'toast') {
        const n = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        content.insertBefore(n, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const gi = u.el('span', 'ds-gear', foot);
      gi.innerHTML = GEAR;
      u.el('span', 'ds-step', foot, 'Step 1 of 2');
      const back = u.el('button', 'ds-back', foot, 'Back');
      back.type = 'button';
      const next = u.el('button', 'ds-next', foot, 'Next');
      next.type = 'button';
      u.el('i', 'ds-fsep', foot);
      if (!ctx.finish && placement === 'link') {
        if (collide && collideWhere === 'footer') makeDecoy(foot, collide);
        const link = u.el('a', 'ds-end-link', foot, endLabel + ' ›');
        link.href = '#';
        link.dataset.role = 'submit';
        link.title = endLabel;
        link.setAttribute('aria-label', endLabel);
        link.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = link;
      }
      if (!ctx.finish && placement === 'footer') {
        if (collide && collideWhere === 'footer') makeDecoy(foot, collide);
        submit = makeEnd(foot, 'ds-submit', endLabel);
      }
      const reset = u.el('button', 'ds-reset', foot, 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        const controls = stage.querySelectorAll('input[type=radio]');
        controls.forEach((el) => (el.checked = false));
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
