(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-09',
    'brand': 'New Listing',
    'menu': 'File|Edit|View|Go|Tools|Windows|Help',
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
      const bar = u.el('header', 'nx-bar', document.body);
      const apple = u.el('span', 'nx-apple', bar);
      apple.innerHTML =
        '<svg viewBox="0 0 16 18" width="16" height="18"><path fill="#fff" d="M11 0c0 1.5-1 3-2.600 3.300C8.300 1.700 9.600.2 11 0zM8 4.500c.8 0 1.700-.6 3-.6 1.200 0 2.500.6 3.300 1.800-2.800 1.600-2.400 5.500.4 6.600-.7 1.700-1.700 3.700-3.100 3.700-1.100 0-1.500-.7-2.600-.7s-1.600.7-2.600.7C4.600 16 2 12 2 8.600 2 5.800 4 4 6 4c1.100 0 1.500.5 2 .5z"/></svg>';
      const nav = u.el('nav', 'nx-menu', bar);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'nx-clock', bar, 'Mon Mar 1   10:24 AM');
      const desk = u.el('div', 'nx-desk', document.body);
      const win = u.el('section', 'nx-win', desk);
      const tb = u.el('div', 'nx-title', win);
      u.el('i', '', tb);
      u.el('i', '', tb);
      u.el('span', '', tb, C.brand);
      const endRng = ctx.rng.fork('chrome/end');
      const labelBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endChoices = labelBank.map(labelText);
      const endLabel = endRng.bool(0.5)
        ? 'Submit'
        : endRng.pick(endChoices.filter((x) => x.toLowerCase() !== 'submit'));
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'title', 'link']);
      const doc = u.el('div', 'nx-doc', win);
      u.el('h1', 'nx-h1', doc, 'Property Details');
      if (ctx.display === 'header') u.el('div', 'ds-instruction ds-mode-header', doc, ctx.instruction);
      const stat = u.el('div', 'nx-static', doc);
      const f1 = u.el('div', 'nx-f nx-wide', stat);
      u.el('label', '', f1, 'Title');
      u.el('div', 'nx-text', f1, 'Riverside Apartment');
      const f2 = u.el('div', 'nx-f', stat);
      u.el('label', '', f2, 'Property type');
      const pop = u.el('div', 'nx-pop', f2);
      u.el('span', '', pop, 'Apartment');
      u.el('b', '', pop, '▼');
      const f3 = u.el('div', 'nx-f', stat);
      u.el('label', '', f3, 'Max guests');
      const sp = u.el('div', 'nx-spin', f3);
      u.el('span', '', sp, '4');
      const arrows = u.el('b', '', sp);
      u.el('i', '', arrows, '▲');
      u.el('i', '', arrows, '▼');
      const main = u.el('div', 'nx-main', doc);
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'nx-foot', doc);
      u.el('span', 'nx-btn', foot, 'Cancel');
      u.el('span', 'nx-btn', foot, 'Save Draft');
      let submit = null;
      const makeSubmit = (parent, cls, label) => {
        const b = u.el('button', 'nx-btn ' + cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const decoyBtn = (parent, label, collide) => {
        const b = u.el('button', 'nx-btn nx-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide = collideRng.bool(0.3);
      let collideLabel = null;
      if (collide) {
        const options = labelBank
          .map(labelText)
          .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collideLabel = collideRng.pick(options);
      }
      const decoyBank =
        ctx.content && Array.isArray(ctx.content.DECOY_LABELS) && ctx.content.DECOY_LABELS.length
          ? ctx.content.DECOY_LABELS
          : ['Help', 'Feedback', 'Preview', 'Save draft', 'Reset view', 'Share', 'Export', 'History'];
      const fillRng = ctx.rng.fork('chrome/decoy');
      const fillers = fillRng.sample(decoyBank.map(labelText), fillRng.int(0, 2));
      if (!ctx.finish && placement === 'title') submit = makeSubmit(tb, 'nx-title-submit', endLabel);
      if (collideLabel && placement === 'title') decoyBtn(tb, collideLabel, true);
      fillers.slice(0, placement === 'footer' ? 1 : 2).forEach((x) => decoyBtn(foot, x, false));
      if (collideLabel && placement !== 'title') decoyBtn(foot, collideLabel, true);
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(foot, 'nx-submit', endLabel);
      if (!ctx.finish && placement === 'link') {
        const a = u.el('a', 'nx-endlink', foot, endLabel + ' ›');
        a.href = '#';
        a.dataset.role = 'submit';
        a.setAttribute('aria-label', endLabel);
        a.title = endLabel;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = a;
      }
      const margin = u.el('aside', 'nx-margin', desk);
      if (ctx.display !== 'hidden' && ctx.display !== 'header') {
        const note = u.el('div', 'ds-instruction ds-mode-' + ctx.display, margin);
        if (ctx.display === 'panel') u.el('b', 'ds-note-label', note, 'Task notes');
        u.el('span', '', note, ctx.instruction);
      }
      u.el('h3', '', margin, 'Action notes:');
      const ol = u.el('ol', '', margin);
      [
        'Review the property details.',
        'Select the correct must-have amenities using the checkboxes.',
      ].forEach((t) => u.el('li', '', ol, t));
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
