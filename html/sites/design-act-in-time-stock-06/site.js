(function () {
  'use strict';
  const C = { site: 'design-act-in-time-stock-06', brand: 'MarketTrade', menu: 'Markets|Watchlist|Account' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const rng = ctx.rng;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-user-icon', top, '●');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      const viewport = document.documentElement;
      if (
        (mode === 'panel' && (viewport.clientWidth < 1260 || viewport.clientHeight < 700)) ||
        (mode === 'toast' && viewport.clientHeight < 700)
      )
        mode = 'header';
      document.body.classList.toggle('ds-panel-mode', mode === 'panel');
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-header-note') u.el('b', 'ds-task-label', b, 'TASK');
        if (cls === 'ds-brief') {
          u.el('h2', 'ds-task-label', b, 'TASK');
        }
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const footer = u.el('footer', 'ds-footer', content);
      let submit = null;
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      let label = rng.fork('chrome/end-label').bool(0.55) ? 'Submit' : rng.fork('chrome/end-label-value').pick(labels);
      let placement = ctx.finish ? null : rng.fork('chrome/end-placement').pick(['footer', 'footer', 'header', 'link']);
      const endRng = rng.fork('chrome/end');
      const referenceEnd = endRng.bool(0.5);
      if (referenceEnd) label = 'Submit';
      if (!ctx.finish) placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
      document.body.classList.toggle('ds-end-header', placement === 'header');
      document.body.classList.toggle('ds-no-footer-end', placement === 'header' || ctx.finish);
      let tools = null;
      if (placement === 'header') {
        top.insertBefore(nav, top.children[1]);
        tools = u.el('div', 'ds-header-tools', top);
      }
      const collideRng = rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = labels.filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      function end(parent, cls, text) {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      if (placement === 'header' && !ctx.finish) {
        submit = end(tools, 'ds-submit ds-header-submit', label);
      }
      if (collide && placement === 'header') {
        const d = u.el('button', 'ds-xtra', tools, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (placement === 'link' && !ctx.finish) {
        submit = end(footer, 'ds-submit ds-end-link', label);
      }
      if (placement === 'footer' && !ctx.finish) {
        submit = end(footer, 'ds-submit', label);
      }
      if (collide && placement !== 'header') {
        const d = u.el('button', 'ds-xtra', footer, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
