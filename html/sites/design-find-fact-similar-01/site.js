(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-similar-01',
    brand: 'Vocabulary Exercise',
    title: 'Word Options',
    instruction: 'left',
    rail: '',
    menu: 'File|Edit|Format|Tools|Window|Help',
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
      const u = ctx.util,
        endRng = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const originalEnd = !ctx.finish && endRng.bool(0.5);
      const alternatives = labels.map(textOf).filter((x) => x.trim().toLowerCase() !== 'submit');
      const chosenLabel = originalEnd ? 'Submit' : textOf(endRng.pick(alternatives.length ? alternatives : labels));
      const placement = ctx.finish ? null : originalEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window', top, '−    □    ×');
      let nav = null;
      if (C.menu) {
        nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const display = ctx.display || 'header';
      if (display === 'toast') u.el('div', 'ds-toast-instruction', document.body, ctx.instruction);
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body),
        main = u.el('div', 'ds-main', content);
      if (display === 'header' || display === 'panel') {
        const b = u.el('aside', display === 'panel' ? 'ds-brief ds-brief-panel' : 'ds-brief', main);
        u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      const endButton = (parent, cls, label) => {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, label);
        b.type = cls === 'ds-end-link' ? '' : 'button';
        if (cls === 'ds-end-link') b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = labels.map(textOf).filter((x) => x.trim().toLowerCase() !== chosenLabel.trim().toLowerCase());
        if (pool.length) collide = textOf(collideRng.pick(pool));
      }
      const addDecoy = (parent, label, collides) => {
        const b = u.el('button', 'ds-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
      };
      if (collide) addDecoy(nav || top, collide, true);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'toolbar') submit = endButton(nav || top, 'ds-submit ds-toolbar-submit', chosenLabel);
        else if (placement === 'link') submit = endButton(foot, 'ds-end-link', chosenLabel + ' ›');
        else submit = endButton(foot, 'ds-submit', chosenLabel);
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
