(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-single-09',
    'brand': ['Task', 'App'],
    'nav': ['Home', 'Tasks', 'Help'],
    'links': ['Privacy', 'Terms', 'Contact'],
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
      const brand = u.el('span', 'ds-brand', top);
      u.el('span', 'ds-brand-a', brand, C.brand[0]);
      u.el('span', 'ds-brand-b', brand, C.brand[1]);
      const nav = u.el('nav', 'ds-nav', top);
      C.nav.forEach((t, i) => u.el('span', i === 0 ? 'on' : '', nav, t));
      const endRng = ctx.rng.fork('chrome/end'),
        endLabels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ];
      const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const keepDefault = endRng.bool(0.5);
      const altLabels = endLabels.map(asLabel).filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel = keepDefault ? 'Submit' : altLabels.length ? asLabel(endRng.pick(altLabels)) : 'Submit';
      const placement = keepDefault ? 'actions' : endRng.pick(['header', 'footer']);
      function endButton(parent, cls) {
        const b = u.el(placement === 'footer' ? 'a' : 'button', cls, parent, endLabel);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const pool = [
          ...new Set(endLabels.map(asLabel).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (pool.length) collide = asLabel(collideRng.pick(pool));
      }
      const content = u.el('div', 'ds-content', document.body);
      const mode = ctx.display || 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-panel-note') u.el('div', 'ds-panel-title', b, 'Task instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      if (mode === 'panel') briefing(content, 'ds-panel-note');
      if (mode === 'toast') briefing(content, 'ds-toast');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const actions = u.el('div', 'ds-actions', content);
      let submit = null;
      const clear = u.el('button', 'ds-clear', actions, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const inp = stage.querySelector('input,textarea');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.focus();
        }
      });
      if (!ctx.finish && placement === 'actions') submit = endButton(actions, 'ds-submit');
      if (!ctx.finish && placement === 'header') submit = endButton(top, 'ds-submit ds-top-submit');
      const foot = u.el('footer', 'ds-footer', document.body);
      u.el('span', 'ds-copy', foot, '© 2012 TaskApp');
      const fl = u.el('span', 'ds-flinks', foot);
      C.links.forEach((t) => u.el('span', '', fl, t));
      if (!ctx.finish && placement === 'footer') submit = endButton(fl, 'ds-submit ds-footer-submit');
      if (collide) {
        const parent = placement === 'footer' ? fl : placement === 'header' ? top : actions;
        const d = u.el('button', parent === top ? 'ds-pq ds-top-xtra' : 'ds-pq', parent, collide);
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
