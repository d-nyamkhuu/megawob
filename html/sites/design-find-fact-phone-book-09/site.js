(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-09',
    'brand': 'Contact Book',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': '',
    'menu': '',
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
      const endR = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const keepDefault = !endR.bool(0.5);
      const placement = keepDefault ? 'footer' : endR.pick(['header', 'link']);
      const endLabel = keepDefault ? 'Submit' : asLabel(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(labels.map(asLabel))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = asLabel(collideR.pick(options));
      }
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      u.el('i', '', logo);
      u.el('i', '', logo);
      const bt = u.el('span', 'ds-brandbox', top);
      u.el('span', 'ds-brand', bt, 'My Contact Book');
      u.el('span', 'ds-tag', bt, 'People  •  Keep in Touch  •  A Brighter Day');
      const sb = u.el('div', 'ds-sbox', top);
      const searchInput = u.el('input', 'ds-contact-search', sb);
      searchInput.type = 'text';
      searchInput.placeholder = 'Search contacts...';
      searchInput.setAttribute('aria-label', 'Search contacts');
      const searchButton = u.el('button', 'ds-search-go', sb);
      searchButton.type = 'button';
      searchButton.title = 'Search contacts';
      searchButton.setAttribute('aria-label', 'Search contacts');
      searchButton.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
      const makeEnd = (parent, cls, label) => {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, label);
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
      };
      const decoy = (parent, label, collides) => {
        const b = u.el('button', 'ds-end-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
        return b;
      };
      let submit = null;
      if (placement === 'header' && !ctx.finish) {
        if (collide) decoy(top, collide, true);
        submit = makeEnd(top, 'ds-submit ds-submit-header', endLabel);
      }
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
      const natural = C.instruction;
      const compact = document.body.clientWidth < 1100;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? compact
                ? 'top'
                : 'left'
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
      if (mode !== 'left' && mode !== 'right') {
        const side = u.el('aside', 'ds-side', main);
        u.el('div', 'ds-side-h', side, 'Contact Details');
        const sb2 = u.el('div', 'ds-side-b', side);
        u.el('div', 'ds-avatar', sb2);
        u.el('div', 'ds-side-t', sb2, 'No contact selected');
        u.el('div', 'ds-side-s', sb2, 'Choose a contact from the list to view their details here.');
      }
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'My Contact Book  |  Stay Connected');
      if (!ctx.finish) {
        const clr = u.el('button', 'ds-clear', foot, 'Clear Selection');
        clr.type = 'button';
        if (collide && placement !== 'header') decoy(foot, collide, true);
        if (placement === 'footer') submit = makeEnd(foot, 'ds-submit', endLabel);
        else if (placement === 'link') submit = makeEnd(foot, 'ds-end-link', endLabel + '  ›');
        foot.appendChild(clr);
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
