(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-login-04',
    'brand': 'Global Explorer',
    'tagline': 'World Knowledge at Your Fingertips',
    'nav': 'DISCOVER|LEARN|EXPLORE',
    'tabs': 'Welcome|Maps|Culture|Wildlife|History|Activities|Reference',
    'instruction': 'top',
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
      const globe = u.el('div', 'ds-globe', top);
      const ids = u.el('div', 'ds-ids', top);
      u.el('div', 'ds-brand', ids, C.brand);
      u.el('div', 'ds-tagline', ids, C.tagline);
      const nav = u.el('nav', 'ds-nav', top);
      C.nav.split('|').forEach((t, i) => {
        if (i) u.el('i', '', nav, '');
        u.el('span', '', nav, t);
      });
      const book = u.el('div', 'ds-book', document.body);
      const rail = u.el('aside', 'ds-rail', book);
      C.tabs.split('|').forEach((t, i) => u.el('div', 'ds-tab t' + i + (i === 0 ? ' on' : ''), rail, t));
      const page = u.el('div', 'ds-page', book);
      const map = u.el('div', 'ds-map', page);
      map.innerHTML =
        '<svg viewBox="0 0 610 600" xmlns="http://www.w3.org/2000/svg"><defs><filter id="map-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .63 0 0 0 0 .55 0 0 0 0 .38 -5 0 0 0 4.5"/></filter><mask id="map-only"><rect width="610" height="600" fill="white"/><g fill="black"><rect x="0" y="99" width="495" height="8"/><rect x="0" y="192" width="410" height="163"/><rect x="0" y="396" width="180" height="63"/><rect x="0" y="494" width="180" height="63"/></g></mask></defs><g mask="url(#map-only)"><image href="sites/design-type-text-login-04/assets/notebook-reference.webp" x="-1040" y="-135" width="1672" height="941" filter="url(#map-ink)"/></g></svg>';
      const body = u.el('div', 'ds-body', page);
      const content = u.el('div', 'ds-content', body);
      u.el('h1', 'ds-title', content, 'Member Login');
      u.el('p', 'ds-lead', content, 'Sign in to access maps, articles and more.');
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? window.innerWidth < 1180
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
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const endR = ctx.rng.fork('chrome/end');
      const labels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const defaultLabel = labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
      const keepDefault = endR.bool(0.5);
      const otherLabels = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const submitLabel = keepDefault
        ? defaultLabel
        : otherLabels.length
          ? endR.pick(otherLabels)
          : labels.length
            ? endR.pick(labels)
            : defaultLabel;
      const placement = keepDefault ? 'footer' : endR.pick(['footer', 'title', 'link']);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const candidates = [...new Set(labels)].filter(
          (x) => x.trim().toLowerCase() !== submitLabel.trim().toLowerCase(),
        );
        if (candidates.length)
          collide = { label: collideR.pick(candidates), where: placement === 'title' ? 'footer' : 'title' };
      }
      let submit = null;
      const makeEnd = (parent, asLink) => {
        const b = u.el(
          asLink ? 'a' : 'button',
          asLink ? 'ds-submit ds-endlink' : 'ds-submit',
          parent,
          asLink ? submitLabel + ' ›' : submitLabel,
        );
        if (asLink) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', submitLabel);
        b.title = submitLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent) => {
        const b = u.el('button', 'ds-xtra', parent, collide.label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
      };
      if (ctx.finish || placement === 'title') foot.classList.add('ds-footer-empty');
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(foot, false);
        else if (placement === 'link') submit = makeEnd(foot, true);
        else submit = makeEnd(content.querySelector('.ds-title'), false);
      }
      if (collide) {
        const parent = collide.where === 'title' ? content.querySelector('.ds-title') : foot;
        decoy(parent);
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
