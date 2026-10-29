(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-dropdown-09',
    'num': '03',
    'heading': 'Video settings',
    'sub': 'Configure how videos are played',
    'legend': 'Your task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const page = u.el('div', 'sw-page', document.body);
      const left = u.el('div', 'sw-left', page);
      const head = u.el('header', 'sw-head', left);
      u.el('div', 'sw-num', head, C.num);
      const ht = u.el('div', 'sw-headtext', head);
      u.el('div', 'sw-kicker', ht, C.heading);
      u.el('div', 'sw-sub', ht, C.sub);
      u.el('div', 'sw-rule', left);
      const stage = u.el('main', 'ds-stage', left);
      const right = u.el('aside', 'sw-right', page);
      const mode = ctx.display || 'header';
      const top = u.el('div', 'sw-task' + (mode === 'header' ? ' sw-task-header' : ''), right);
      if (mode === 'panel' || mode === 'header') {
        u.el('div', 'sw-legend', top, C.legend);
        u.el('div', 'ds-instruction', top, ctx.instruction);
      } else if (mode === 'toast') {
        const t = u.el('section', 'ds-toast', document.body);
        u.el('div', 'ds-instruction', t, ctx.instruction);
      }
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['bottom', 'bottom', 'top', 'link']);
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(ctx.content.END_LABELS));
      const acts = u.el('div', 'sw-actions', right);
      let submit = null;
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish && placement === 'top') {
        const tools = u.el('div', 'sw-toptools', top);
        submit = end(tools, 'ds-submit ds-submit-top', label);
      }
      if (!ctx.finish && placement === 'bottom') submit = end(acts, 'ds-submit', label);
      if (!ctx.finish && placement === 'link') submit = end(acts, 'ds-endlink', label + ' ›');
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = ctx.content.END_LABELS.map(labelOf).filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (words.length) {
            const d = u.el('button', 'sw-xtra', placement === 'top' ? top : acts, labelOf(cr.pick(words)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
      }
      const cancel = u.el('button', 'sw-cancel', acts, 'Cancel');
      cancel.type = 'button';
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
