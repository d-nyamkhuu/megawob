(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-popup-01',
    brand: 'FormHub',
    instruction: 'top',
    rail: '01|02|03|04|05|06|07|08|09|10',
    menu: 'HELP|SETTINGS|CONTACT',
    briefTitle: 'Instructions',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      document.body.dataset.instructionMode = mode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer' + (ctx.finish ? ' ds-finish' : ''), content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const endR = ctx.rng.fork('chrome/end');
        const collideR = ctx.rng.fork('chrome/collide');
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const referenceEnd = endR.bool(0.5);
        const label = referenceEnd
          ? labels.map(labelOf).find((x) => x === 'Submit') || 'Submit'
          : labelOf(endR.pick(labels));
        const placement = referenceEnd ? 'footer' : endR.pick(['header', 'link']);
        const decoy = (parent, text) => {
          const b = u.el('button', 'ds-xtra ds-pq', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        };
        const end = (parent, cls, text, link) => {
          const b = u.el(link ? 'a' : 'button', cls, parent, text);
          b.type = 'button';
          if (link) b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'header') {
          const action = u.el('div', 'ds-head-action', top);
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length && collideR.bool(0.3)) decoy(action, collideR.pick(pool));
          submit = end(action, 'ds-submit ds-head-submit', label, false);
        } else if (placement === 'link') {
          submit = end(foot, 'ds-endlink', label + ' ›', true);
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length && collideR.bool(0.3)) decoy(top, collideR.pick(pool));
        } else {
          submit = end(foot, 'ds-submit', label, false);
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length && collideR.bool(0.3)) decoy(top, collideR.pick(pool));
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
