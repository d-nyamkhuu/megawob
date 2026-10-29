(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-similar-02',
    'brand': 'Vocabulary Exercise',
    'title': 'Word Options',
    'instruction': 'left',
    'rail': '',
    'menu': 'File|Edit|Format|Tools|Window|Help',
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
      const win = u.el('div', 'ds-win', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-brand', top, 'Word Study');
      const nav = u.el('nav', 'ds-menu', top);
      ['Home', 'Exercises', 'Word List', 'Help'].forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('a', '', nav, t);
      });
      const pal = u.el('aside', 'ds-pal', document.body);
      const pt = u.el('div', 'ds-pal-t', pal, 'Quick Notes');
      u.el('span', '', pt, '×');
      u.el('div', 'ds-pal-b', pal, 'Synonym means a word with a similar meaning.');
      u.el('a', 'ds-pal-l', pal, 'Word List');
      const body = u.el('div', 'ds-body', win);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = 'top';
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
      const fnav = u.el('nav', 'ds-fnav', foot);
      ['Home', 'Exercises', 'Word List', 'Help'].forEach((t, i) => {
        if (i) u.el('i', '', fnav, '|');
        u.el('a', '', fnav, t);
      });
      u.el('span', '', foot, '© 1995 Word Study');
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['header', 'link']);
      const label = original ? 'Submit' : er.pick(endWords);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit ds-end-' + placement,
          placement === 'header' ? top : foot,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = endWords.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const text = cr.pick(choices);
          const decoy = u.el('button', 'ds-xtra', pal, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      [nav, fnav].forEach((n) =>
        n
          .querySelectorAll('a')
          .forEach((a) => a.addEventListener('click', () => env.log('decoy', { label: a.textContent }))),
      );
      pal.querySelector('.ds-pal-l').addEventListener('click', () => env.log('decoy', { label: 'Word List' }));
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
