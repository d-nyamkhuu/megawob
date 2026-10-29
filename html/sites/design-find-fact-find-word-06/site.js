(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-06',
    'brand': 'Word Finder',
    'tagline': 'Read carefully. Find the right word.',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': '',
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
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = endRng.pick(['link', 'footer', 'header', 'footer']);
      const endLabel = placement === 'footer' ? 'Submit' : endRng.pick(endLabels.filter((x) => x !== 'Submit'));
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide = collideRng.bool(0.3)
        ? collideRng.pick(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const top = u.el('header', 'ds-top', document.body);
      const tl = u.el('div', 'ds-titles', top);
      u.el('span', 'ds-brand', tl, C.brand);
      u.el('span', 'ds-tag', tl, C.tagline);
      const aside = u.el('div', 'ds-aside', top);
      u.el('span', '', aside, 'A QUIETER\nWAY TO LEARN');
      u.el('i', '', aside);
      const headerTools = u.el('div', 'ds-end-tools', top);
      if (collide) {
        const decoy = u.el('button', 'ds-xtra', headerTools, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
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
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const tools = u.el('div', 'ds-tools', foot);
      const tk = (cls, txt, p) => {
        const b = u.el('span', cls, p || tools);
        return b;
      };
      const t1 = u.el('span', 'ds-tool-lead', tools);
      u.el('b', 'ds-book', t1);
      u.el('span', '', t1, 'Text Tools');
      u.el('i', 'ds-sep', tools);
      [
        ['A−', 'Smaller Text'],
        ['A+', 'Larger Text'],
        ['≡', 'Reset View'],
      ].forEach((a) => {
        const b = u.el('span', 'ds-tbtn', tools);
        u.el('b', '', b, a[0]);
        u.el('span', '', b, a[1]);
      });
      u.el('i', 'ds-sep', tools);
      const hp = u.el('span', 'ds-help', tools);
      u.el('b', '', hp, '?');
      u.el('span', '', hp, 'Help');
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? headerTools : foot;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'ds-endlink' : 'ds-submit',
          parent,
          endLabel,
        );
        if (placement === 'link') {
          submit.href = '#';
          foot.insertBefore(submit, tools);
          foot.classList.add('ds-footer-alt');
        } else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
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
