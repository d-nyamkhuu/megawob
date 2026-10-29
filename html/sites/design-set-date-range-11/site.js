(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-range-11',
    'brand': 'Yahoo! Travel',
    'instruction': 'top',
    'rail': '',
    'menu': 'Web|Images|Directory|News|Groups|Mail|More \u00bb',
    'briefTitle': 'Your Task',
  };
  env.site({
    name: C.site,
    initialOverlay: { kind: 'banner' },
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endBank = ctx.content && ctx.content.END_LABELS;
      const baseline = er.bool(0.5);
      const placement = baseline ? 'footer' : er.pick(['header', 'link']);
      const endLabel = baseline
        ? 'Submit'
        : labelOf(
            er.pick(
              endBank && endBank.length
                ? endBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
            ),
          );
      const cr = ctx.rng.fork('chrome/collide');
      const endWords =
        endBank && endBank.length
          ? endBank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const collideOptions = [...new Set(endWords.map(labelOf))].filter(
        (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
      );
      const collide = cr.bool(0.3) && collideOptions.length ? labelOf(cr.pick(collideOptions)) : null;
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
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
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
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      const endButton = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'a') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') submit = endButton(top, 'ds-submit ds-end-header', endLabel);
        else if (placement === 'link') submit = endButton(foot, 'ds-endlink', endLabel, 'a');
        else submit = endButton(foot, 'ds-submit', endLabel);
      }
      if (collide) {
        const d = u.el('button', 'ds-xtra', foot, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const el = u.el('section', 'ds-initial ds-initial-notifications', document.body);
        el.dataset.role = 'overlay';
        u.el('h2', '', el, 'New Notifications (5)');
        u.el(
          'p',
          '',
          el,
          'You have 3 new messages. Today in News: Market closes higher. New message in your group. Check out today’s top travel destinations. Special offers on hotels this week!',
        );
        const dismiss = u.el('button', '', el, 'Dismiss all');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => {
          ctx.dismiss('close');
          env.log('reference-obstruction-dismiss', { kind: 'notifications' });
        });
        return { el, dismiss, ttlSteps: 0 };
      }
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
