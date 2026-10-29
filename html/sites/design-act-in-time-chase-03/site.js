(function () {
  'use strict';
  const C = { site: 'design-act-in-time-chase-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const display = ctx.display || 'header';
      document.body.dataset.instruction = display;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-apple', top, '');
      const menu = u.el('nav', 'ds-menuitems', top);
      ['File', 'Edit', 'Task', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      u.el('span', 'ds-time', top, '10:24 AM');
      const title = u.el('div', 'ds-titlebar', document.body);
      u.el('span', 'ds-title', title, 'Pointer Practice');
      const controls = u.el('div', 'ds-window-controls', title);
      ['', '', ''].forEach(() => u.el('i', '', controls));
      const note = u.el('section', 'ds-header-note', document.body);
      if (display === 'header') u.el('div', 'ds-instruction', note, ctx.instruction);
      const readout = u.el('div', 'ds-readout', note);
      if (display === 'panel' || display === 'toast') {
        const box = u.el('section', display === 'panel' ? 'ds-episode-panel' : 'ds-episode-toast', document.body);
        if (display === 'panel') u.el('strong', 'ds-episode-heading', box, 'Task');
        u.el('div', 'ds-episode-copy', box, ctx.instruction);
      }
      const content = u.el('div', 'ds-content', document.body);
      const stage = u.el('main', 'ds-stage', content);

      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endRng.pick(['corner', 'corner', 'corner', 'titlebar', 'link']);
      const labelOf = (x) => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      let label = 'Submit';
      if (!ctx.finish && placement !== 'corner' && !endRng.bool(0.5)) {
        const labels = ctx.content && ctx.content.END_LABELS;
        label = Array.isArray(labels) && labels.length ? labelOf(endRng.pick(labels)) : 'Done';
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels = (Array.isArray(bank) && bank.length ? bank : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map(labelOf);
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collision = collideRng.pick(options);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'corner') submit = endButton(content, 'ds-submit', label);
        else if (placement === 'titlebar') submit = endButton(title, 'ds-title-submit', label);
        else {
          const link = endButton(content, 'ds-end-link', label + ' ›');
          link.title = label;
          submit = link;
        }
        if (collision) decoy(placement === 'link' ? title : content, collision);
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
        banner: 'Scheduled maintenance tonight.'
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
