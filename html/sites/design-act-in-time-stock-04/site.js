(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-stock-04',
    'brand': 'Maple Grove Online',
    'title': 'Maple Grove Stock Tracker',
    'instruction': 'top',
    'rail': '',
    'menu': 'Quotes|News|Watchlist|Community|Notes|Settings|Help',
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
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
        u.el('span', 'ds-stock-date', nav, 'Mon, Apr 28, 1996  10:24 AM');
      }
      const body = u.el('div', 'ds-body', document.body);
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
      const contentBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endR = ctx.rng.fork('chrome/end');
      const standard = !ctx.finish && endR.bool(0.5);
      const placement = ctx.finish ? null : standard ? 'footer' : endR.pick(['header', 'link']);
      const submitLabel = standard
        ? contentBank.find((x) => labelOf(x).toLowerCase() === 'submit')
          ? labelOf(contentBank.find((x) => labelOf(x).toLowerCase() === 'submit'))
          : 'Submit'
        : labelOf(endR.pick(contentBank));
      const collideR = ctx.rng.fork('chrome/collide');
      const collidePool = contentBank
        .map(labelOf)
        .filter((x) => x.trim().toLowerCase() !== submitLabel.trim().toLowerCase());
      const collide = !!(!ctx.finish && collidePool.length && collideR.bool(0.3));
      const collideLabel = collide ? labelOf(collideR.pick(collidePool)) : null;
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
      let submit = null;
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'ds-submit', foot, submitLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', submitLabel);
        submit.title = submitLabel;
        submit.addEventListener('click', () => ctx.submit());
      }
      if (!ctx.finish && placement !== 'footer') {
        const tools = u.el('div', 'ds-alt-tools', document.body);
        tools.style.top = placement === 'header' ? '24%' : '28%';
        if (placement === 'header') {
          submit = u.el('button', 'ds-submit-alt', tools, submitLabel);
          submit.type = 'button';
        } else {
          submit = u.el('a', 'ds-submit-alt ds-end-link', tools, submitLabel + ' ›');
          submit.href = '#';
        }
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', submitLabel);
        submit.title = submitLabel;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (collide) {
          const d = u.el('button', 'ds-xtra-end', tools, collideLabel);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
        }
      } else if (collide) {
        const d = u.el('button', 'ds-xtra-end', foot, collideLabel);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
        if (submit) foot.insertBefore(d, submit);
      }
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Maple Grove Online 1996');
      u.el('ul', 'ds-quick-values', quick);
      const ins = content.querySelector('.ds-header-note .ds-instruction');
      if (ins) {
        let fs = innerHeight > 820 ? 50 : 31;
        while (fs > 20) {
          ins.style.fontSize = fs + 'px';
          if (ins.getBoundingClientRect().height <= (innerHeight > 820 ? 240 : 190)) break;
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
