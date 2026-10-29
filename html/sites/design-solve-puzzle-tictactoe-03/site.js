(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-tictactoe-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        content = ctx.content || {},
        w = window.innerWidth,
        h = window.innerHeight;
      let display = ctx.display || 'header';
      if (display === 'panel' && w < 1260) display = 'header';
      if (display === 'toast' && h < 700) display = 'header';
      document.body.className = 'soft-board instruction-' + display;
      const app = u.el('main', 'app', document.body),
        center = u.el('div', 'center', app);
      if (display === 'header') u.el('div', 'brief', center, ctx.instruction);
      else if (display === 'panel') u.el('div', 'instruction-panel', center, ctx.instruction);
      else if (display === 'toast') u.el('div', 'instruction-toast', center, ctx.instruction);
      const stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const bank = (key, fallback) => (Array.isArray(content[key]) && content[key].length ? content[key] : fallback),
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        ends = bank('END_LABELS', [
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
        ]);
      let placement = null,
        label = null;
      if (!ctx.finish) {
        placement = endRng.pick(['footer', 'footer', 'footer', 'header', 'link']);
        label = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(ends));
        if (label === 'Submit' && placement !== 'footer' && endRng.bool(0.5))
          label = labelOf(endRng.pick(ends.filter((x) => labelOf(x).toLowerCase() !== 'submit')));
      }
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [...new Set(ends.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (choices.length) collision = labelOf(collideRng.pick(choices));
      }
      if (placement === 'header') {
        const b = u.el('button', 'submit header-submit', center, label);
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', ctx.submit);
        submit = b;
      }
      if (placement === 'link') {
        const b = u.el('a', 'end-link', footer, label + ' ›');
        b.href = '#';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = b;
      } else if (placement === 'footer') {
        const b = u.el('button', 'submit', footer, label);
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', ctx.submit);
        submit = b;
      }
      if (collision) decoyBtn(footer, collision, true);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
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
