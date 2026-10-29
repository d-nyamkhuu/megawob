(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-01',
    'brand': 'Text Finder',
    'title': 'Document Viewer',
    'instruction': 'top',
    'rail': 'Home|Documents|Settings|Help',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
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
      const requestedMode = ctx.display || 'header';
      const mode =
        (requestedMode === 'panel' && document.documentElement.clientWidth < 1260) ||
        (requestedMode === 'toast' && document.documentElement.clientHeight < 700)
          ? 'header'
          : requestedMode;
      content.dataset.display = mode;
      const endRng = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'header', 'link']);
      const baseLabel = labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || labels[0];
      const referenceLabel = endRng.bool(0.85);
      const otherLabels = labels.filter((x) => labelOf(x) !== labelOf(baseLabel));
      const label =
        placement === 'footer' && referenceLabel
          ? labelOf(baseLabel)
          : labelOf(endRng.pick(otherLabels.length ? otherLabels : labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(collideRng.pick(options));
      }
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', mode === 'panel' ? 'ds-main ds-panel-mode' : 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const headActions =
        placement === 'header' || (collide && placement !== 'footer') ? u.el('div', 'ds-head-actions', content) : null;
      function decoy(parent, text) {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      }
      let submit = null;
      if (headActions && collide) decoy(headActions, collide);
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      if (collide && placement === 'footer') decoy(foot, collide);
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'ds-submit', foot, label);
        } else if (placement === 'link') {
          submit = u.el('a', 'ds-submit ds-submit-link', foot, label + ' ›');
          submit.href = '#';
        } else {
          submit = u.el('button', 'ds-submit ds-submit-header', headActions, label);
        }
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
