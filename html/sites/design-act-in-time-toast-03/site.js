(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-toast-03',
    brand: 'Nimbus Mail',
    title: 'Settings',
    instruction: 'right',
    rail: 'Account|Security|Devices|Privacy|Notifications|Appearance|Apps',
    menu: 'Home|Mail|Calendar|Contacts|Files|Settings',
    briefTitle: 'Task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => {
        const n = u.el('span', '', nav, t);
        if (t === 'Settings') n.className = 'active';
      });
      const meta = u.el('div', 'ds-window-meta', top);
      ['⌕', '♧', '?', 'JD', '−', '□', '×'].forEach((t) => u.el('span', 'ds-tool', meta, t));
      let submit = null,
        placement = null,
        label = 'Submit';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent);
        b.textContent = label;
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const fallback = [
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
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const original = er.bool(0.5);
        label = original ? 'Submit' : labelOf(er.pick(labels));
        placement = original ? 'shelf' : er.pick(['shelf', 'title', 'status']);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'ds-pq', meta, String(cr.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        if (placement === 'title') {
          submit = makeSubmit(meta, 'ds-submit ds-submit-title');
          submit.textContent = '✓';
        }
      }
      const body = u.el('div', 'ds-body', document.body),
        rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, 'Settings');
      C.rail.split('|').forEach((t, i) => {
        const x = u.el('div', i === 0 ? 'selected' : '', rail, t);
      });
      const content = u.el('div', 'ds-content', body),
        main = u.el('div', 'ds-main', content),
        mode =
          (ctx.display === 'panel' || ctx.display === 'toast') && window.innerWidth <= 1100
            ? 'header'
            : ctx.display || 'header';
      if (mode === 'header') {
        u.el('div', 'ds-header-note', content, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      let brief = null;
      if (mode === 'panel') {
        brief = u.el('aside', 'ds-brief', main);
        u.el('h2', '', brief, 'Task');
        u.el('div', 'ds-instruction', brief, ctx.instruction);
      } else if (mode === 'toast') {
        const b = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction ds-instruction-toast', b, ctx.instruction);
      }
      const side = u.el('aside', 'ds-summary', main);
      u.el('h3', '', side, 'Recent sign-ins');
      [
        ['▱', 'Windows PC', 'Seattle, WA', 'Today, 9:14 AM'],
        ['▯', 'iPhone', 'Seattle, WA', 'Apr 27, 2026, 6:32 PM'],
        ['▱', 'Windows PC', 'Portland, OR', 'Apr 24, 2026, 11:03 AM'],
      ].forEach((a) => {
        const r = u.el('div', 'ds-signin', side);
        u.el('b', '', r, a[0]);
        const d = u.el('div', '', r);
        u.el('strong', '', d, a[1]);
        u.el('small', '', d, a[2]);
        u.el('time', '', r, a[3]);
      });
      u.el('h3', 'ds-summary-title', side, 'Security summary');
      [
        ['♢', 'Two-step verification', 'On'],
        ['▣', 'Trusted devices', '4 devices'],
        ['⚿', 'App passwords', '1 password'],
      ].forEach((a) => {
        const r = u.el('div', 'ds-security', side);
        u.el('b', '', r, a[0]);
        const d = u.el('div', '', r);
        u.el('strong', '', d, a[1]);
        u.el('small', '', d, a[2]);
      });
      const foot = u.el('footer', 'ds-footer', content);
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(meta, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(foot, 'ds-submit ds-submit-status');
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
