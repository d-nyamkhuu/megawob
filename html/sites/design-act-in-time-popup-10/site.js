(function () {
  'use strict';

  const SITE = 'design-act-in-time-popup-10';
  const labels = (ctx) => (ctx.content && ctx.content.END_LABELS) || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];

  env.site({
    name: SITE,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const root = document.body;
      root.className = 'civic-page';
      const body = u.el('div', 'civic-body', root);
      const rail = u.el('aside', 'civic-rail', body);
      const navItems = [['⌂', 'Home'], ['▤', 'Services'], ['▦', 'Appointments'], ['●', 'Help'], ['⚙', 'Settings']];
      navItems.forEach(([icon, name]) => {
        const item = u.el('div', 'civic-nav-item', rail);
        u.el('span', 'civic-nav-icon', item, icon);
        u.el('span', 'civic-nav-label', item, name);
      });

      const content = u.el('div', 'civic-content', body);
      const header = u.el('header', 'civic-header', content);
      u.el('div', 'civic-brand', header, 'Riverton City Services');
      u.el('div', 'civic-tagline', header, 'A stronger community together');

      let display = ctx.display || 'header';
      let note = null;
      if (display !== 'hidden') {
        note = u.el('aside', `civic-task civic-task-${display}`, content);
        u.el('span', 'civic-info', note, 'i');
        u.el('div', 'civic-instruction', note, ctx.instruction);
        if (display === 'panel') u.el('span', 'civic-task-label', note, 'Service request');
      }

      const stage = u.el('main', 'ds-stage civic-stage', content);
      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const label = endRng.bool(0.5) ? 'Submit' : endRng.pick(labels(ctx));
      const tools = u.el('div', 'civic-header-tools', header);
      const decoyRng = ctx.rng.fork('chrome/decoys');
      const decoyLabels = (ctx.content && ctx.content.DECOY_LABELS) || ['Help', 'Save draft', 'Services'];
      const addDecoy = (parent, text, collide) => {
        const b = u.el('button', 'civic-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
      };
      if (decoyRng.bool(0.3)) addDecoy(tools, decoyRng.pick(decoyLabels));
      const collideRng = ctx.rng.fork('chrome/collide');
      const alternatives = labels(ctx).filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
      const collideLabel = !ctx.finish && alternatives.length && collideRng.bool(0.3) ? collideRng.pick(alternatives) : null;
      if (collideLabel && placement !== 'footer') addDecoy(tools, collideLabel, true);
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'civic-end-link' ? 'a' : 'button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        if (b.tagName === 'A') b.href = '#';
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      if (placement === 'header') submit = makeEnd(tools, 'civic-end', label);
      if (placement === 'icon') submit = makeEnd(tools, 'civic-end civic-end-icon', '✓');
      if (placement === 'link') {
        const link = u.el('a', 'civic-end-link', header, `${label} ›`);
        link.href = '#';
        link.dataset.role = 'submit';
        link.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        submit = link;
      }
      const footer = u.el('footer', 'civic-footer', content);
      u.el('span', 'civic-footer-note', footer, 'Riverton City Services · Secure account access');
      if (decoyRng.bool(0.3)) addDecoy(footer, decoyRng.pick(decoyLabels));
      if (collideLabel && placement === 'footer') addDecoy(footer, collideLabel, true);
      if (placement === 'footer') submit = makeEnd(footer, 'civic-end', label);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', `civic-overlay civic-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Your request has been received.', chat: 'How can we help with city services?', promo: 'Explore more Riverton services.', banner: 'Some online services may be unavailable during scheduled maintenance.' };
      u.el('div', 'civic-overlay-text', el, texts[ctx.kind] || texts.banner);
      const dismiss = u.el('button', 'civic-end', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
