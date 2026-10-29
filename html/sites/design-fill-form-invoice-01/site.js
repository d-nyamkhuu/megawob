(function () {
  'use strict';
  const icons = [
    '<path d="M2 11 13 1l11 10-3 2V24h-6v-8h-4v8H5V13z"/>',
    '<path d="M6 1h10l6 6v17H6z"/><path d="M10 10h8M10 15h8M10 20h6" fill="none" stroke="#f4f7fb" stroke-width="2"/>',
    '<rect x="3" y="15" width="5" height="10" rx="2"/><rect x="11" y="8" width="5" height="17" rx="2"/><rect x="19" y="2" width="5" height="23" rx="2"/>',
    '<path d="m10 1-1 4-4 2-4 1 1 5-1 4 4 1 3 4 2 4 5-1 3-3 4-1 3-4-3-4V9l-4-2-2-4z"/><circle cx="13" cy="13" r="4" fill="#f0f5fa"/>',
    '<circle cx="13" cy="13" r="12"/><path d="M9 9c0-5 9-5 8 0-.5 3-4 2-4 6M13 19v2" stroke="#f4f7fb" stroke-width="2.5" fill="none"/>'
  ];
  env.site({
    name: 'design-fill-form-invoice-01', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = x => typeof x === 'string' ? x : x.label || x.text || x.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['header', 'rail-link']);
      const label = referenceEnd ? 'Submit' : endRng.pick(endLabels.filter(x => x !== 'Submit'));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      ['Home', 'Tasks', 'Reports', 'Settings', 'Help'].forEach((text, i) => {
        const item = u.el('div', 'ds-command', rail);
        item.innerHTML = '<svg viewBox="0 0 26 26" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', item, text);
      });
      const content = u.el('div', 'ds-content', body);
      let headerTools = null;
      if (ctx.display !== 'hidden') {
        const note = u.el('aside', 'ds-header-note' + (ctx.display === 'toast' ? ' ds-toast' : ''), content);
        u.el('span', 'ds-info', note, 'i');
        u.el('div', 'ds-instruction', note, ctx.instruction);
        if (!ctx.finish && placement === 'header') headerTools = u.el('div', 'ds-header-tools', note);
      } else if (!ctx.finish && placement === 'header') {
        headerTools = u.el('header', 'ds-end-toolbar', content);
      }
      const stage = u.el('main', 'ds-stage', content);
      const actions = u.el('footer', 'ds-footer', content);
      const clear = u.el('button', 'ds-invoice-clear', actions, 'Clear');
      clear.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? headerTools : placement === 'rail-link' ? rail : actions;
        submit = u.el('button', 'ds-submit' + (placement === 'rail-link' ? ' ds-end-link' : ''), parent, label);
        submit.type = 'button'; submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const choices = endLabels.filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        const decoyLabel = collideRng.pick(choices);
        const decoy = u.el('button', 'ds-xtra', rail, decoyLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', {label: decoyLabel, collide: true}));
      }
      return {stage, submit};
    },
    overlay(ctx) {
      const u = ctx.util;
      const box = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      box.dataset.role = 'overlay';
      const text = {cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.'};
      u.el('div', '', box, text[ctx.kind]);
      const dismiss = u.el('button', '', box, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return {el: box, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0};
    }
  });
})();
