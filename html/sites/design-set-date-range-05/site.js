(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-range-05',
    'brand': 'Yahoo! Travel',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|Trip|View|Special',
    'briefTitle': 'Your Task',
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
      u.el('span', 'ds-brand', top).innerHTML =
        '<svg viewBox="0 0 28 30"><path d="M17 7c-2-4 1-7 5-7 0 4-2 6-5 7M14 10c-7-6-13 0-11 9 2 8 6 11 10 8 3-2 4 1 7 0 3-2 5-5 5-8-6-2-6-7-2-10-3-3-6-2-9 1"/></svg>';
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', top);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      u.el('span', 'ds-clock', top, '10:24 AM');
      u.el('span', 'ds-help', top, '?');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const tb = u.el('div', 'ds-titlebar', content);
      u.el('span', 'ds-close', tb);
      u.el('span', 'ds-wintitle', tb, 'Travel Planner');
      const ph = u.el('div', 'ds-pagehead', content);
      u.el('span', 'ds-brief-icon', ph);
      u.el('span', '', ph, 'Plan Your Trip');
      const natural = C.instruction;
      const mode = ctx.display;
      let palette = null;
      if (mode === 'panel') {
        palette = u.el('aside', 'ds-palette', body);
        const pt = u.el('div', 'ds-titlebar', palette);
        u.el('span', 'ds-close', pt);
        u.el('span', 'ds-wintitle', pt, 'Notes');
        const pb = u.el('div', 'ds-palbody', palette);
        u.el('span', 'ds-doc', pb);
        u.el('span', '', pb, ctx.instruction);
      }
      const trash = u.el('div', 'ds-trash', body);
      u.el('span', 'ds-bin', trash);
      u.el('span', '', trash, 'Trash');
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-footnote', foot, '');
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      const labelR = ctx.rng.fork('chrome/end');
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
          "I\'m done",
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const label = labelR.pick(['Submit', 'Submit', 'Submit', 'Submit', ...labels.filter((x) => x !== 'Submit')]);
      const placement = labelR.pick(['footer', 'footer', 'title', 'link']);
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'title') {
          submit = makeSubmit(tb, 'ds-submit ds-title-submit', label);
        } else if (placement === 'link') {
          submit = makeSubmit(foot, 'ds-submit ds-link-submit', label + ' ›');
        } else submit = makeSubmit(foot, 'ds-submit', label);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const d = u.el('button', 'ds-xtra', placement === 'title' ? tb : foot, collideR.pick(pool));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
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
