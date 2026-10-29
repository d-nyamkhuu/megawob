(function () {
  'use strict';
  const C = { site: 'design-read-figure-greatest-09' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'modernist instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('strong', 'brand', top, 'NUMCORE');
      const nav = u.el('nav', 'menu', top);
      ['Focus', 'Practice', 'Improve'].forEach((label, i) => {
        if (i) u.el('span', 'slash', nav, '/');
        u.el('span', 'nav-item', nav, label);
      });
      u.el('i', 'status-dot', top);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide'),
        labels = (ctx.content && ctx.content.END_LABELS) || [
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
        ],
        labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let label = 'Submit',
        placement = 'footer';
      if (!ctx.finish && !endRng.bool(0.5)) {
        label = labelText(endRng.pick(labels));
        placement = endRng.pick(['header', 'link']);
      }
      const makeEnd = (parent, cls, text) => {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text, collides) => {
        const b = u.el('button', collides ? 'end-xtra pq-xtra' : 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
      };
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(labelText))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = collideRng.pick(options);
      }
      if (!ctx.finish && placement === 'header') {
        if (collide) decoy(top, collide, true);
        submit = makeEnd(top, 'submit header-submit', label);
      } else if (!ctx.finish) {
        if (collide) decoy(footer, collide, true);
        if (placement === 'footer') submit = makeEnd(footer, 'submit', label);
        else {
          const link = u.el('div', 'end-link-dock', app);
          submit = makeEnd(link, 'submit end-link', label);
        }
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
