(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-algebra-12', task: 'solve-puzzle', scenario: 'algebra', title: 'Math Practice' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      document.body.className = 'responsive center-stage instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top);
      u.el('strong', '', brand, C.title);
      u.el('span', 'subtitle', brand, 'Algebra');
      const timer = u.el('div', 'timer', top);
      u.el('span', 'pause-mark', timer, 'Ⅱ');
      const status = u.el('div', '', timer);
      u.el('b', '', status, 'Timer paused');
      u.el('span', '', status, 'Will start after layout is restored');
      const center = u.el('div', 'center', app),
        canvas = u.el('section', 'task-canvas', center);
      u.el('div', 'brief', canvas, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('div', 'stage', canvas);
      const footer = u.el('footer', 'bottom', app);
      const help = u.el('div', 'perimeter-tool help', footer),
        helpIcon = u.el('span', 'tool-icon', help, '?');
      u.el('span', '', help, 'Help');
      const settings = u.el('div', 'perimeter-tool settings', footer);
      u.el('span', 'tool-icon', settings, '⚙');
      u.el('span', '', settings, 'Settings'); // Keep the original form Submit in half of episodes; all new choices use isolated streams.
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = endRng.bool(0.5),
        placement = original ? 'form' : endRng.pick(['header', 'footer']);
      const endLabel = original ? 'Submit' : endRng.pick(labels.filter((label) => label !== 'Submit'));
      if (!ctx.finish) document.body.classList.add('end-placement-' + placement);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, footer, endLabel);
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      if (collideRng.bool(0.3)) {
        const label = collideRng.pick(
          labels.filter((word) => word.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
        );
        const decoy = u.el('button', 'chrome-xtra', footer, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      settings.addEventListener('click', () => env.log('decoy', { label: 'Settings' }));
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind + (ctx.initial ? ' restore-overlay' : ''), document.body);
      if (ctx.initial) {
        const dialog = u.el('section', 'restore-dialog', el),
          close = u.el('button', 'restore-close', dialog, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close warning');
        close.addEventListener('click', ctx.dismiss);
        u.el('span', 'warning-icon', dialog, '!');
        const copy = u.el('div', 'restore-copy', dialog);
        u.el('b', '', copy, 'Layout could not be restored.');
        u.el(
          'p',
          '',
          copy,
          "We couldn't load your last layout. Your task is still here.\nYou can use the default layout to continue.",
        );
        const recover = u.el('button', 'restore-action', dialog, 'Use default layout');
        recover.type = 'button';
        recover.addEventListener('click', ctx.dismiss);
        return { el, dismiss: recover };
      }
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
