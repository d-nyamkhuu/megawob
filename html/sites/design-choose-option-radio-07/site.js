(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-radio-07',
    'brand': 'Riverton University',
    'title': 'Email Preferences',
    'instruction': 'left',
    'rail': '',
    'menu': 'Office of Communications',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      body.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
      });
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const left = u.el('div', 'ds-left', main);
      const mast = u.el('header', 'ds-mast', left);
      const mb = u.el('div', 'ds-mastbrand', mast);
      u.el('div', 'ds-masthead', mb, 'Riverton Journal');
      const sec = u.el('div', 'ds-sections', mb);
      ['NEWS', '|', 'CULTURE', '|', 'COMMUNITY'].forEach((t) => u.el('span', t === '|' ? 'ds-bar' : '', sec, t));
      const acct = u.el('nav', 'ds-acct', mast);
      ['My Account', '|', 'Help', '|', 'Sign Out'].forEach((t) => u.el('span', '', acct, t));
      let display = ctx.display;
      if ((display === 'panel' && window.innerWidth < 1260) || (display === 'toast' && window.innerHeight < 700))
        display = 'header';
      if (display === 'header') {
        const note = u.el('div', 'ds-header-note', left);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', left);
      const side = u.el('aside', 'ds-brief', main);
      const task = u.el('section', 'ds-academic-task', side);
      if (display === 'panel') {
        u.el('div', 'ds-panel-title', task, 'Instructions');
        u.el('div', 'ds-instruction', task, ctx.instruction);
      }
      u.el('div', 'ds-rule', side);
      const subslot = u.el('div', 'ds-subslot', side);
      if (display === 'toast') {
        const n = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        content.insertBefore(n, main);
      }
      const er = ctx.rng.fork('chrome/end');
      const common = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : common ? 'side' : er.pick(['mast', 'link']);
      const label = common ? 'Submit' : er.pick(ctx.content.END_LABELS) || 'Continue';
      const decoy = ctx.rng.fork('chrome/collide');
      const collide = decoy.bool(0.3)
        ? decoy.pick(
            (ctx.content.END_LABELS || []).filter((x) => String(x).toLowerCase() !== String(label).toLowerCase()),
          )
        : null;
      let submit = null;
      const end = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', collides ? 'ds-xtra ds-pq' : 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      if (placement === 'mast') {
        if (collide) decoyBtn(acct, collide, true);
        submit = end(acct, 'ds-mast-submit', label);
      } else if (collide) decoyBtn(subslot, collide, true);
      if (placement === 'side') submit = end(subslot, 'ds-submit', label);
      if (placement === 'link') submit = end(subslot, 'ds-endlink', label, 'a');
      const reset = u.el('button', 'ds-reset', subslot, 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        const controls = stage.querySelectorAll('input[type=radio]');
        controls.forEach((el) => (el.checked = false));
      });
      u.el('a', 'ds-cancel-link', subslot, 'Cancel').href = '#';
      const links = u.el('nav', 'ds-footer-links', subslot);
      ['Privacy Policy', 'Contact Us', 'Help'].forEach((t) => (u.el('a', '', links, t).href = '#'));
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
