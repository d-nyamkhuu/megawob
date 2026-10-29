(function () {
  'use strict';
  const C = { site: 'design-set-date-segmented-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('div', 'ds-lights', top);
      u.el('div', 'ds-window-title', top, 'New Task');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('main', 'ds-content', body);
      const sheet = u.el('div', 'ds-sheet', content);
      const stage = u.el('section', 'ds-stage', content);
      u.el('label', 'ds-field-label', sheet, 'Title');
      u.el('div', 'ds-fake-input ds-title-input', sheet);
      u.el('label', 'ds-field-label ds-due-label', sheet, 'Due date');
      u.el('label', 'ds-field-label ds-desc-label', sheet, 'Description');
      u.el('div', 'ds-fake-input ds-description', sheet);
      u.el('label', 'ds-field-label ds-priority-label', sheet, 'Priority');
      const priority = u.el('div', 'ds-fake-input ds-priority', sheet, 'Normal');
      u.el('span', 'ds-select-chevron', priority, '⌄');
      const rail = u.el('aside', 'ds-rail', body);
      const tips = u.el('section', 'ds-tips', rail);
      u.el('h2', '', tips, 'Date entry tips');
      u.el(
        'p',
        '',
        tips,
        'Enter the month, day and year in the fields, or use the up and down arrows to change the date.',
      );
      u.el('p', '', tips, 'You can also type the number directly into a field.');
      const divider = u.el('div', 'ds-divider', tips);
      u.el('div', 'ds-subheading', tips, 'Date format');
      u.el('p', 'ds-example', tips, 'MM / DD / YYYY');
      u.el('div', 'ds-subheading ds-example-heading', tips, 'Example');
      u.el('p', 'ds-example', tips, '10 / 04 / 2026');
      let note = null;
      if (ctx.display === 'header') {
        note = u.el('div', 'ds-header-note', document.body);
        document.body.insertBefore(note, body);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      } else if (ctx.display === 'panel') {
        note = u.el('section', 'ds-panel-note', tips);
        u.el('div', 'ds-instruction', note, ctx.instruction);
        tips.insertBefore(note, tips.firstChild);
      } else if (ctx.display === 'toast') {
        note = u.el('aside', 'ds-toast', document.body);
        u.el('div', 'ds-instruction', note, ctx.instruction);
        const x = u.el('button', 'ds-toast-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => note.remove());
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Finish';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
        } else {
          const alternatives = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          if (alternatives.length) label = endRng.pick(alternatives);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const endButton = (parent, cls, text, asLink) => {
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
      if (placement === 'header') submit = endButton(top, 'ds-end-header', label, false);
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
      if (placement === 'link') submit = endButton(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const text = cr.pick(words);
            const d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
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
