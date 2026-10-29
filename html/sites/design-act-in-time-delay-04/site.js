(function () {
  'use strict';
  const C = { site: 'design-act-in-time-delay-04', instruction: 'header' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        shell = u.el('div', 'ds-shell', document.body),
        head = u.el('header', 'ds-header', shell);
      const note = u.el('div', 'ds-instruction-area', head);
      const mode = ctx.display;
      if (mode === 'header') u.el('div', 'ds-instruction', note, ctx.instruction);
      const timer = u.el('aside', 'ds-timer', head);
      u.el('span', 'ds-clock-icon', timer, '◷');
      const timerCopy = u.el('div', 'ds-timer-copy', timer);
      u.el('div', 'ds-timer-label', timerCopy, 'Time until start');
      u.el('strong', 'ds-timer-value', timerCopy, '00:00:15');
      u.el('div', 'ds-timer-state', timerCopy, 'Waiting for task to begin...');
      // Keep notes in the overview, outside the task's seeded click targets.
      if (mode === 'panel') {
        const panel = u.el('aside', 'ds-mode-note ds-panel-note', note);
        u.el('div', 'ds-note-heading', panel, 'Task instructions');
        u.el('div', '', panel, ctx.instruction);
      }
      if (mode === 'toast') {
        const toast = u.el('aside', 'ds-mode-note ds-toast-note', note);
        u.el('div', 'ds-note-heading', toast, 'Task notification');
        u.el('div', '', toast, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', shell);
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ];
        const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const keepDefault = endRng.bool(0.5);
        const label = keepDefault ? 'Submit' : labelText(endRng.pick(labels));
        const placement = keepDefault ? 'footer' : endRng.pick(['floating', 'link']);
        const foot = u.el('footer', 'ds-footer', shell);
        if (placement === 'footer') {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'floating') {
          submit = u.el('button', 'ds-submit ds-submit-float', shell, label);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', () => ctx.submit());
        } else {
          submit = u.el('a', 'ds-submit-link', foot, label + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
        submit.setAttribute('aria-label', label);
        submit.title = label;
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const own = label.trim().toLowerCase();
          const alternatives = [...new Set(labels.map(labelText))].filter((x) => x.trim().toLowerCase() !== own);
          if (alternatives.length) {
            const decoy = u.el('button', 'ds-xtra', foot, collideRng.pick(alternatives));
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
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
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 1 : 0 };
    },
  });
})();
