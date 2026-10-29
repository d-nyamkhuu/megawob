(function () {
  'use strict';
  const C = { site: 'design-type-text-sections-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const globe = u.el('div', 'ds-globe', top, '');
      const title = u.el('div', 'ds-titleblock', top);
      u.el('div', 'ds-brand', title, 'My Account');
      u.el('div', 'ds-subtitle', title, 'Manage your payment information and preferences');
      const summary = u.el('aside', 'ds-summary', top);
      u.el('div', 'ds-chart', summary, '');
      const stats = u.el('div', 'ds-stats', summary);
      u.el('strong', '', stats, 'Account Summary');
      [
        ['Total Payments', '12'],
        ['Saved Cards', '2'],
        ['Invoices', '5'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'ds-stat', stats);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      const content = u.el('div', 'ds-content', document.body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left') {
        const b = briefing(main, 'ds-brief');
        b.style.order = '2';
      }
      const stage = u.el('main', 'aero-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        let placement = 'header',
          label = 'Done';
        if (!canonical) {
          placement = er.pick(['header', 'link', 'icon']);
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool =
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          label = String(er.pick(pool));
        }
        let collide = null;
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
        const addDecoy = (parent, text, cls) => {
          const b = u.el('button', 'ds-xtra ' + (cls || ''), parent, text);
          b.type = 'button';
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
        if (collide) addDecoy(top, collide, 'ds-pq-header');
        if (placement === 'header') {
          submit = endButton(top, 'ds-submit ds-submit-header', label);
        } else if (placement === 'icon') {
          submit = endButton(top, 'ds-submit ds-submit-icon', '✓');
          submit.setAttribute('aria-label', label);
          submit.title = label;
        } else {
          const foot = u.el('footer', 'ds-footer', content);
          submit = endButton(foot, 'ds-submit ds-submit-link', label);
        }
      }
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
