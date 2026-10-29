(function () {
  'use strict';
  const C = { site: 'design-set-date-calendar-11', brand: 'Riverside Council' };
  const ALERT =
    '<svg viewBox="0 0 72 72" width="100%" height="100%"><circle cx="36" cy="36" r="36" fill="#e1141c"/><rect x="31" y="14" width="10" height="29" rx="4" fill="#fff"/><circle cx="36" cy="54" r="5.5" fill="#fff"/></svg>';
  const CHEV_UP =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15l7-7 7 7"/></svg>';
  const CHEV_DOWN =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l7 7 7-7"/></svg>';
  const INFO =
    '<svg viewBox="0 0 32 32" width="100%" height="100%"><circle cx="16" cy="16" r="16" fill="#1559d6"/><rect x="14" y="14" width="4" height="11" rx="1" fill="#fff"/><circle cx="16" cy="9" r="2.4" fill="#fff"/></svg>';
  const EXT =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#e1141c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      const u = ctx.util;
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['footer', 'header', 'footer', 'link']);
      const referenceEnd = placement === 'footer';
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      function decoy(button, label, collides) {
        button.dataset.role = 'xtra';
        button.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
      }
      function end(parent, cls) {
        const button = u.el('button', cls, parent, endLabel);
        button.type = 'button';
        button.dataset.role = 'submit';
        button.title = endLabel;
        button.setAttribute('aria-label', endLabel);
        button.addEventListener('click', () => ctx.submit());
        return button;
      }
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('aside', 'ds-left', body);
      const logo = u.el('div', 'ds-logo', left);
      u.el('div', 'ds-logo-bar', logo);
      u.el('div', 'ds-logo-t', logo, 'Riverside');
      u.el('div', 'ds-logo-t ds-logo-t2', logo, 'Council');
      const app = u.el('div', 'ds-app', left);
      u.el('div', 'ds-app-bar', app);
      u.el('div', 'ds-app-t', app, 'Application for Adoption');
      const nav = u.el('nav', 'ds-nav', body);
      decoy(u.el('span', '', nav, 'Help'), 'Help');
      decoy(u.el('span', '', nav, 'Contact'), 'Contact');
      u.el('span', 'ds-avatar', nav, 'JL');
      const nc = u.el('span', 'ds-nchev', nav);
      nc.innerHTML = CHEV_DOWN;
      const content = u.el('div', 'ds-content', body);
      const intro = u.el('div', 'ds-intro', content);
      u.el('div', 'ds-num', intro, '02');
      u.el('div', 'ds-vrule', intro);
      const ht = u.el('div', 'ds-htext', intro);
      u.el('div', 'ds-h1', ht, 'Child details');
      u.el('div', 'ds-h1sub', ht, 'Tell us about the child you wish to adopt.');
      const main = u.el('div', 'ds-main', content);
      function note(parent, cls) {
        const b = u.el('aside', cls, parent);
        const i = u.el('span', 'ds-info', b);
        i.innerHTML = INFO;
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (ctx.display !== 'hidden' && ctx.display !== 'panel') {
        const n = note(content, ctx.display === 'toast' ? 'ds-toast' : 'ds-header-note');
        content.insertBefore(n, main);
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      if (!ctx.finish && placement === 'footer') submit = end(foot, 'ds-submit');
      if (!ctx.finish && placement === 'header') submit = end(nav, 'ds-submit ds-submit-header');
      const cancel = u.el('button', 'ds-cancel', foot, 'Save and come back');
      cancel.type = 'button';
      decoy(cancel, 'Save and come back');
      if (collide) {
        const b = u.el('button', 'ds-cancel ds-end-xtra', foot, collide);
        b.type = 'button';
        decoy(b, collide, true);
      }
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'ds-rbar', rail);
      u.el('h2', '', rail, 'Your progress');
      u.el('div', 'ds-step', rail, 'Step 2 of 4');
      const pb = u.el('div', 'ds-pbar', rail);
      u.el('div', 'ds-pfill', pb);
      if (!ctx.finish && placement === 'link') submit = end(rail, 'ds-submit ds-submit-link');
      if (ctx.display === 'panel') note(rail, 'ds-brief ds-panel-note');
      u.el('div', 'ds-reservation-values', rail);
      const help = u.el('section', 'ds-help', rail);
      u.el('h2', '', help, 'Need help?');
      u.el(
        'p',
        '',
        help,
        "If you're unsure about any of these details, you can save your application and come back later.",
      );
      const lk = u.el('a', 'ds-link', help, 'View guidance');
      const li = u.el('span', 'ds-lico', lk);
      li.innerHTML = EXT;
      decoy(lk, 'View guidance');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.kind === 'banner') {
        const el = u.el('section', 'ds-ribbon ds-announcement-overlay', document.body);
        el.dataset.role = 'overlay';
        const icon = u.el('span', 'ds-alert', el);
        icon.innerHTML = ALERT;
        const text = u.el('div', 'ds-rtext', el);
        u.el('div', 'ds-rtitle', text, 'System maintenance this weekend');
        u.el(
          'div',
          'ds-rsub',
          text,
          'Some features may be temporarily unavailable from Sat 26 Sep, 20:00 to Sun 27 Sep, 08:00 (BST).',
        );
        const dismiss = u.el('button', 'ds-collapse', el, 'Collapse announcement');
        dismiss.type = 'button';
        const chev = u.el('span', 'ds-cico', dismiss);
        chev.innerHTML = CHEV_UP;
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
      }
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
