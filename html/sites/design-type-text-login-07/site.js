(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-login-07',
    'brand': 'Account Access',
    'title': '',
    'instruction': 'top',
    'rail': '',
    'menu': 'Home|Accounts|Settings|Help|Sign out',
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
      function instruction(parent) {
        const note = u.el('div', 'ds-instruction', parent);
        ctx.instruction
          .split(/("[^"]*"|“[^”]*”)/g)
          .forEach((part, i) => u.el('span', i % 2 ? 'ds-credential' : '', note, part));
        return note;
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'NEXA');
      const tr = u.el('span', 'ds-toplinks', top);
      const help = u.el('span', '', tr, 'Help');
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      u.el('i', '', tr);
      u.el('span', '', tr, 'Sign In');
      const body = u.el('div', 'ds-body', document.body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'left';
      const left = u.el('aside', 'ds-left', body);
      const eb = u.el('div', 'ds-eyebrow', left);
      u.el('span', '', eb, 'Secure Access');
      u.el('i', '', eb);
      if (mode === 'left') instruction(left);
      else u.el('div', 'ds-spacer', left);
      const eb2 = u.el('div', 'ds-eyebrow ds-eyebrow2', left);
      u.el('span', '', eb2, 'Access your account');
      u.el('i', '', eb2);
      const content = u.el('div', 'ds-content', body);
      u.el('div', 'ds-kicker', content, 'Sign in');
      u.el('h1', 'ds-welcome', content, 'Welcome back');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast' || mode === 'panel') {
        const note = u.el('aside', mode === 'toast' ? 'ds-episode-toast' : 'ds-episode-panel', left);
        u.el('div', 'ds-episode-caption', note, mode === 'toast' ? 'Access request' : 'Instructions');
        instruction(note);
        left.insertBefore(note, eb2);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const hb = u.el('div', 'ds-helpbtn', content, 'Help');
      hb.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      hb.insertAdjacentHTML(
        'afterbegin',
        '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#fff" stroke-width="2"><circle cx="15" cy="15" r="11"/><path d="M12 12a3 3 0 1 1 4 3c-1 .6-1 1.200-1 2"/><circle cx="15" cy="21" r=".6"/></svg>',
      );
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          placement === 'footer' ? 'ds-submit' : placement === 'header' ? 'ds-end-header' : 'ds-end-link',
          placement === 'header' ? tr : foot,
          label,
        );
        if (placement === 'header')
          tr.insertBefore(submit, tr.lastElementChild === submit ? submit.previousElementSibling : tr.lastElementChild);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const decoy = u.el('button', 'ds-end-xtra', tr, text);
          decoy.type = 'button';
          tr.insertBefore(decoy, tr.lastElementChild === decoy ? decoy.previousElementSibling : tr.lastElementChild);
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
