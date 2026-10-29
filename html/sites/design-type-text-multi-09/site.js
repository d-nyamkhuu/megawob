(function () {
  'use strict';
  const C = { site: 'design-type-text-multi-09', brand: 'FreightTrack', sub: 'Customer Management System' };
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
      u.el('span', 'ds-corner', top);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-sub', top, C.sub);
      const who = u.el('span', 'ds-who', top);
      u.el('span', '', who, 'Logged in as: jsmith');
      u.el('span', 'ds-sep', who, '|');
      u.el('u', '', who, 'Help');
      u.el('span', 'ds-sep', who, '|');
      u.el('u', '', who, 'Sign Out');
      const size = ctx.size || { width: window.innerWidth, height: window.innerHeight };
      let display = ctx.display || 'header';
      if (display === 'panel' && (size.width < 1260 || size.height < 700)) display = 'header';
      if (display === 'toast' && size.height < 700) display = 'header';
      const mainEnd = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endRng = ctx.rng.fork('chrome/end');
      let placement = 'footer',
        label = 'Submit';
      if (!ctx.finish && !endRng.bool(0.5)) {
        placement = endRng.pick(['header', 'link']);
        label = labelOf(endRng.pick(mainEnd));
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(mainEnd.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = collideRng.pick(options);
      }
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      for (let i = 1; i <= 10; i++) u.el('div', 'ds-idx' + (i === 1 ? ' on' : ''), rail, String(i));
      const content = u.el('div', 'ds-content', body);
      if (display !== 'hidden') {
        const mode = display === 'panel' ? 'panel' : display === 'toast' ? 'toast' : 'header';
        const b = u.el('aside', mode === 'header' ? 'ds-header-note' : 'ds-' + mode, content);
        if (mode === 'panel') u.el('strong', 'ds-panel-title', b, 'Task instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const contact = u.el('section', 'ds-contact', main);
      contact.setAttribute('aria-hidden', 'true');
      u.el('div', 'ds-bar', contact, 'Contact Information (optional)');
      const cb = u.el('div', 'ds-cbody', contact);
      ['Contact name:', 'Phone (optional):', 'Email (optional):'].forEach((t) => {
        const r = u.el('div', 'ds-crow', cb);
        u.el('span', '', r, t);
        u.el('div', 'ds-fake', r);
      });
      const foot = u.el('footer', 'ds-footer', content);
      const l = u.el('button', 'ds-btn', foot, 'Clear Form');
      l.type = 'button';
      l.tabIndex = -1;
      const c = u.el('button', 'ds-btn', foot, 'Cancel');
      c.type = 'button';
      c.tabIndex = -1;
      u.el('span', 'ds-grow', foot);
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      let submit = null;
      const endBtn = (parent, cls, text, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, text);
        if (asLink) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide && (placement === 'header' || placement === 'link')) decoyBtn(who, collide);
      if (!ctx.finish && placement === 'header') submit = endBtn(who, 'ds-top-end', label, false);
      if (collide && placement === 'footer') decoyBtn(foot, collide);
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'ds-btn ds-submit', label, false);
      if (!ctx.finish && placement === 'link') submit = endBtn(foot, 'ds-end-link', label + ' ›', true);
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
