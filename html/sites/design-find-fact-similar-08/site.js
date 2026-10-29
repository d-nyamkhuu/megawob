(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-similar-08',
    'brand': 'Word Match',
    'title': 'Word Options',
    'instruction': 'top',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('i', 'ds-icon', top);
      u.el('span', 'ds-brand', top, C.brand);
      const rng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const choices = bank.map(labelOf);
      const label = rng.bool(0.5) ? 'Submit' : rng.pick(choices);
      const placement = rng.pick(['header', 'footer', 'footer', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const pool = choices.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = collideRng.pick(pool);
      }
      const addDecoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const wb = u.el('span', 'ds-wbtns', top);
      ['_', '□', '×'].forEach((t) => u.el('b', '', wb, t));
      let submit = null;
      if (!ctx.finish && placement === 'header') {
        const tools = u.el('span', 'ds-top-tools', top);
        submit = u.el('button', 'ds-top-end', tools, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        if (collide) addDecoy(tools, collide);
      } else if (collide && placement === 'header') addDecoy(top, collide);
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
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      if (
        (mode === 'left' && (document.body.clientWidth < 1260 || document.body.clientHeight < 700)) ||
        (mode === 'toast' && document.body.clientHeight < 700)
      )
        mode = 'top';
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
      const clr = u.el('button', 'ds-btn ds-clear', foot, 'Clear All');
      clr.type = 'button';
      const cnl = u.el('button', 'ds-btn ds-cancel', foot, 'Cancel');
      cnl.type = 'button';
      if (!ctx.finish && placement !== 'header') {
        if (placement === 'link') {
          submit = u.el('a', 'ds-end-link', foot, label + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
        }
        submit.dataset.role = 'submit';
        if (placement === 'footer') submit.addEventListener('click', () => ctx.submit());
        if (collide) addDecoy(foot, collide);
      }
      if (ctx.finish && collide) addDecoy(foot, collide);
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
