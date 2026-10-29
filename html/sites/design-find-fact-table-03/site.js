(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-03',
    'title': 'Employee Information Lookup',
    'hint': 'Use the table below to find the requested value.',
    'instruction': 'top',
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
      const burger = u.el('span', 'ds-burger', top);
      for (let i = 0; i < 3; i++) u.el('i', '', burger);
      u.el('span', 'ds-brand', top, C.title);
      u.el('span', 'ds-hint', top, C.hint);
      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endRng.bool(0.5) ? 'footer' : endRng.pick(['header', 'link']);
      const label = placement === 'footer' ? 'Submit' : endRng.pick(ctx.content.END_LABELS) || 'Done';
      const content = u.el('div', 'ds-content', document.body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Instructions');
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
      let submit = null;
      const submitButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = ctx.content.END_LABELS || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        const options = pool.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, String(text));
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: String(text), collide: true }));
      };
      if (collide && placement === 'header') decoy(top, collide);
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        stage.querySelectorAll('input,textarea').forEach((i) => {
          if (i.value) {
            i.value = '';
            i.dispatchEvent(new Event('input', { bubbles: true }));
            i.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });
      if (placement === 'footer') submit = submitButton(foot, 'ds-submit', label);
      if (placement === 'link') submit = submitButton(foot, 'ds-submit ds-endlink', label);
      if (collide && placement !== 'header') decoy(foot, collide);
      if (placement === 'header') submit = submitButton(top, 'ds-submit ds-header-submit', label);
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
