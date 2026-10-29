(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-02',
    'brand': 'Text Finder',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': 'Contacts|Calendar|Notes|Settings',
    'menu': '',
    'briefTitle': 'Instructions',
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
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].forEach((n, i) =>
        u.el('div', n === 13 ? 'on' : '', rail, String(n)),
      );
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-steps', top, 'LOOK  /  READ  /  ANSWER');
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      body.classList.add('ds-mode-' + mode);
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
      const endRng = ctx.rng.fork('chrome/end');
      const contentLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (!endRng.bool(0.5)) {
          placement = 'footer';
          label = endLabel(contentLabels.find((x) => endLabel(x).toLowerCase() === 'submit') || 'Submit');
        } else {
          placement = endRng.pick(['header', 'link', 'header']);
          label = endLabel(endRng.pick(contentLabels));
        }
      }
      let submit = null;
      function makeSubmit(parent, cls, text) {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      if (placement === 'header') submit = makeSubmit(top, 'ds-top-submit', label);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = contentLabels.map(endLabel).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = endLabel(collideRng.pick(pool));
      }
      if (collide) {
        const decoy = u.el('button', 'ds-pq', top, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
      }
      if (placement === 'footer' || placement === 'link') {
        const foot = u.el('footer', 'ds-footer', content);
        submit =
          placement === 'footer' ? makeSubmit(foot, 'ds-submit', label) : makeSubmit(foot, 'ds-endlink', label + ' ›');
      }
      if (placement === 'header') body.classList.add('ds-end-header');
      if (ctx.finish) body.classList.add('ds-finish');
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
