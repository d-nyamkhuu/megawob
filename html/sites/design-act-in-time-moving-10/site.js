(function () {
  'use strict';
  const C = { site: 'design-act-in-time-moving-10' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body,
        rng = ctx.rng.fork('chrome/design10');
      const labelBank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(labelBank) && labelBank.length
          ? labelBank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const oldLabel = labelOf(rng.pick(labels));
      const oldPlacement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'header', 'link']);
      const endR = ctx.rng.fork('chrome/end');
      const placement = ctx.finish
        ? null
        : endR.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon', 'icon']);
      const labelR = ctx.rng.fork('chrome/end/label');
      const label = labelR.bool(0.5) ? oldLabel : labelOf(labelR.pick(labels));
      const display = ctx.display || 'header';
      body.dataset.instruction = display;
      const collideR = ctx.rng.fork('chrome/collide');
      const collide = collideR.bool(0.3)
        ? labelOf(collideR.pick(labels.filter((x) => labelOf(x).toLowerCase() !== label.toLowerCase())))
        : null;
      const top = u.el('header', 'ds-titlebar', body);
      const appIcon = u.el('span', 'ds-app-icon', top);
      appIcon.setAttribute('aria-hidden', 'true');
      u.el('span', 'ds-brand', top, 'Shape Catcher');
      const win = u.el('div', 'ds-window-controls', top);
      [
        ['−', 'Minimize'],
        ['□', 'Maximize'],
        ['×', 'Close'],
      ].forEach(([v, n]) => {
        const b = u.el('button', '', win, v);
        b.type = 'button';
        b.setAttribute('aria-label', n);
      });
      const shell = u.el('div', 'ds-shell', body);
      const rail = u.el('aside', 'ds-index', shell);
      rail.setAttribute('aria-label', 'Task index');
      for (let i = 1; i <= 10; i++) {
        const n = u.el('div', i === 1 ? 'ds-index-current' : '', rail, String(i));
      }
      const page = u.el('div', 'ds-page', shell);
      const row = u.el('div', 'ds-task-row', page);
      const note = u.el('section', 'ds-instruction-card', row);
      if (display !== 'hidden') {
        if (display === 'header') u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      if (display === 'panel') {
        note.classList.add('ds-panel-instruction');
        u.el('div', 'ds-note-label', note, 'Task instructions');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      } else if (display === 'hidden') note.classList.add('ds-note-hidden');
      const stage = u.el('main', 'ds-stage', page);
      const footer = u.el('footer', 'ds-footer', page);
      const pause = u.el('button', 'ds-pill ds-pause', footer, 'Ⅱ　Pause');
      pause.type = 'button';
      pause.dataset.role = 'pause';
      pause.addEventListener('click', () => env.log('pause-click'));
      const tools = u.el('div', 'ds-footer-tools', footer);
      const reset = u.el('button', 'ds-pill ds-reset', tools, '⟳　Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => env.log('reset-click'));
      let submit = null;
      const makeSubmit = (parent, cls, text) => {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'header') {
        submit = makeSubmit(top, 'ds-header-submit', label);
        top.insertBefore(submit, win);
      }
      if (placement === 'icon') {
        submit = makeSubmit(tools, 'ds-icon-submit', '✓');
        submit.setAttribute('aria-label', label);
        submit.title = label;
      }
      if (placement === 'link') submit = makeSubmit(tools, 'ds-end-link', `${label} ›`);
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(tools, 'ds-submit', label);
      if (collide) {
        const d = u.el('button', 'ds-xtra', tools, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const decoyBank = ctx.content && ctx.content.DECOY_LABELS;
      const decoys = Array.isArray(decoyBank) ? decoyBank : [];
      if (decoys.length && rng.bool(0.35)) {
        const text = labelOf(rng.pick(decoys));
        const d = u.el('button', 'ds-xtra', tools, text);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: text }));
      }
      if (display === 'toast') {
        note.classList.add('ds-toast-instruction');
        u.el('span', 'ds-toast-mark', note, 'i');
        u.el('div', 'ds-instruction', note, ctx.instruction);
        const toast = note;
        const close = u.el('button', 'ds-toast-close', toast, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => toast.remove());
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind] || texts.toast);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
