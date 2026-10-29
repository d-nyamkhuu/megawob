(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-transform-04',
    'brand': 'Text Tools',
    'instruction': 'top',
    'nav': 'Tools|Help|Account',
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
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke="#0b1114" stroke-width="3" stroke-linejoin="round"><path d="M6 5h6a7 7 0 0 1 0 14H6z"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-nav', top);
      C.nav.split('|').forEach((t, i) => u.el('span', i === 0 ? 'on' : '', nav, t));
      const contentBank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(contentBank) && contentBank.length
          ? contentBank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end');
      const label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels));
      const placement = ctx.finish
        ? null
        : er.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon', 'footer']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const own = label.trim().toLowerCase();
        const choices = [...new Set(labels.map(labelOf))].filter((x) => x.trim().toLowerCase() !== own);
        if (choices.length) collide = { label: cr.pick(choices), where: cr.pick(['header', 'footer']) };
      }
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      u.el('div', 'ds-eyebrow', content, 'TEXT TRANSFORM');
      u.el('h1', 'ds-title', content, 'Complete the Instruction');
      const mode = ctx.display || 'header';
      const ilen = String(ctx.instruction || '').length,
        fit = ilen > 140 ? Math.sqrt(140 / ilen).toFixed(3) : null;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-header-note' || cls === 'ds-toast') {
          const ic = u.el('span', 'ds-docicon', b);
          ic.innerHTML =
            '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#0b1114" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2.5h8l4.5 4.5v14.5H6zM14 2.5V7h4.5M9 12h6M9 15.5h6M9 19h4"/></svg>';
        } else u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (fit && cls !== 'ds-brief') b.style.setProperty('--fit', fit);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      if (mode === 'panel') briefing(content, 'ds-brief');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const addEnd = (parent, where) => {
        let el;
        if (where === 'link') {
          el = u.el('a', 'ds-endlink', parent, label + ' ›');
          el.href = '#';
        } else {
          el = u.el(
            'button',
            'ds-submit' + (where === 'icon' ? ' ds-icon-submit' : ''),
            parent,
            where === 'icon' ? '✓' : label,
          );
          el.type = 'button';
        }
        el.dataset.role = 'submit';
        el.setAttribute('aria-label', label);
        el.title = label;
        el.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return el;
      };
      const addDecoy = (parent) => {
        const b = u.el('button', 'ds-pq', parent, collide.label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
      };
      const tools = u.el('div', 'ds-top-tools', top);
      if (collide && collide.where === 'header') addDecoy(tools);
      let submit = null;
      if (placement === 'header') submit = addEnd(tools, 'header');
      else if (placement === 'icon') submit = addEnd(tools, 'icon');
      if (collide && collide.where === 'footer') addDecoy(foot);
      if (placement === 'footer' || placement === 'link') submit = addEnd(foot, placement);
      else if (ctx.finish) u.el('span', 'ds-ready', foot, 'READY');
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
