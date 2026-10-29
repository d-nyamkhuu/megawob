(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-arithmetic-05', task: 'solve-puzzle', scenario: 'arithmetic' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'amiga instruction-' + ctx.display;
      const u = ctx.util;
      let placement = 'bottom',
        label = 'Submit',
        collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          endLabels = ctx.content.END_LABELS;
        if (er.bool(0.5)) {
          placement = 'bottom';
          label = 'Submit';
        } else {
          placement = er.pick(['bottom', 'toolbar', 'link']);
          label = String(er.pick(endLabels));
        }
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = ctx.content.END_LABELS.filter(
          (x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (choices.length) collide = String(cr.pick(choices));
      }
      document.body.classList.add('end-' + placement);
      const bar = u.el('header', 'workbench-bar', document.body);
      u.el('span', 'workbench-mark', bar, '▧');
      u.el('strong', '', bar, 'Amiga Workbench');
      ['File', 'Edit', 'Options', 'Window', 'Help'].forEach((x) => u.el('span', 'wb-menu-item', bar, x));
      u.el('time', '', bar, '14:27');
      u.el('button', 'disk-icon', bar, '◩');
      const index = u.el('aside', 'aside-index', document.body);
      u.el('div', 'index-spacer', index, '1');
      for (let i = 1; i <= 10; i++) u.el('div', 'index-item' + (i === 1 ? ' current' : ''), index, String(i));
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', '', top, 'Math Practice');
      const controls = u.el('div', 'native-window-controls', top);
      if (collide) {
        const decoy = u.el('button', 'wb-end-xtra', controls, collide);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      for (const [kind, text] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ])
        u.el('span', 'window-gadget ' + kind, controls, text);
      const center = u.el('div', 'center', app);
      let brief = null;
      if (ctx.display !== 'hidden')
        brief = u.el(
          'div',
          'brief ' + (ctx.display === 'panel' ? 'brief-panel' : ctx.display === 'toast' ? 'brief-toast' : ''),
          center,
          ctx.instruction,
        );
      const stage = u.el('section', 'stage', center);
      const bottom = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'submit ' + (placement === 'link' ? 'end-link' : placement === 'toolbar' ? 'end-toolbar' : 'end-bottom'),
          bottom,
          label,
        );
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
        const clear = u.el('button', 'clear-button', app, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          const input = app.querySelector('.answer input');
          if (input) {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
          }
        });
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
