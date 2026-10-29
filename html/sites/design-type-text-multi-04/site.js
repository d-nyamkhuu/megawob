(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-multi-04',
    'brand': 'New Contact',
    'title': 'Contact Information',
    'instruction': 'right',
    'rail': '',
    'menu': 'File|Edit|View|Help',
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
      const endRng = ctx.rng.fork('chrome/end');
      const labelPool = (ctx.content && ctx.content.END_LABELS) || [
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
      let endLabel = 'Submit';
      if (!ctx.finish && !endRng.bool(0.5)) {
        const alternatives = labelPool.filter(
          (x) => (typeof x === 'string' ? x : x.label || x.text || x.name) !== 'Submit',
        );
        const picked = endRng.pick(alternatives.length ? alternatives : labelPool);
        endLabel = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [
          ...new Set(
            labelPool
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
              .filter((x) => x && x.toLowerCase() !== endLabel.toLowerCase()),
          ),
        ];
        if (options.length) collision = collideRng.pick(options);
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const topTools = u.el('span', 'ds-toptools', top);
      const wb = u.el('span', 'ds-wbtns', top);
      u.el('i', '', wb);
      u.el('i', '', wb);
      u.el('i', '', wb);
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
              ? 'right'
              : ctx.display === 'header'
                ? 'top'
                : C.instruction;
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
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (collision) decoy(topTools, collision);
      let submit = null;
      if (!ctx.finish) {
        const place = endRng.pick(['footer', 'footer', 'footer', 'header', 'link']);
        if (place === 'header') {
          submit = u.el('button', 'ds-submit ds-submit-header', topTools, endLabel);
        } else if (place === 'link') {
          submit = u.el('a', 'ds-submit ds-submit-link', foot, endLabel + ' ›');
          submit.href = '#';
        } else submit = u.el('button', 'ds-submit', foot, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
