(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-stock-01',
    'brand': 'Stock Watcher',
    'title': 'Place Order',
    'instruction': 'top',
    'rail': '',
    'menu': 'Watch|Charts|Orders|Notes|Settings',
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
      const endWords =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const defaultEnd = endRng.bool(0.5);
      const placement = defaultEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const label = defaultEnd ? 'Submit' : labelOf(endRng.pick(endWords));
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide = collideRng.bool(0.3);
      let collideLabel = null;
      if (collide) {
        const choices = [
          ...new Set(endWords.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collideLabel = labelOf(collideRng.pick(choices));
      }
      let toolbarSubmit = null;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
        if (!ctx.finish && placement === 'toolbar') {
          toolbarSubmit = u.el('button', 'ds-end-toolbar', nav, label);
          toolbarSubmit.type = 'button';
          toolbarSubmit.dataset.role = 'submit';
          toolbarSubmit.title = label;
          toolbarSubmit.setAttribute('aria-label', label);
          toolbarSubmit.addEventListener('click', () => ctx.submit());
        }
        if (collideLabel) {
          const b = u.el('button', 'ds-end-xtra', nav, collideLabel);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
        }
        u.el('span', 'ds-stock-date', nav, 'Apr 26, 2018  10:24 AM');
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
      let submit = toolbarSubmit || null;
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'ds-submit', foot, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (!ctx.finish && placement === 'link') {
        submit = u.el('a', 'ds-end-link', foot, label + ' ›');
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      if (submit && placement !== 'toolbar') foot.insertBefore(clear, submit);
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, '▤ Quick Notes');
      u.el('ul', 'ds-quick-values', quick);
      const ins = content.querySelector('.ds-header-note .ds-instruction');
      if (ins) {
        let fs = innerHeight > 820 ? 50 : 31;
        while (fs > 20) {
          ins.style.fontSize = fs + 'px';
          if (ins.getBoundingClientRect().height <= (innerHeight > 820 ? 62 : 40)) break;
          fs -= 1;
        }
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
