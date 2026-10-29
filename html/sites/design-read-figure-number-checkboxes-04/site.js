(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-number-checkboxes-04',
    task: 'read-figure',
    scenario: 'number-checkboxes',
    style: 'editorial',
    title: 'PIXEL PRACTICE',
    menu: 'NUMBER PATTERNS',
    note: '',
    layout: 'twin-pane',
    subtitle: '',
    aside: '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', 'brand', top, C.title);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center);
      const note = u.el('div', 'instruction-copy', brief, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
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
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const referenceEnd = er.bool(0.5);
        const label = referenceEnd ? 'Submit' : labelOf(er.pick(labels));
        const alternatePlacement = er.pick(['header', 'shelf-link']);
        const placement = referenceEnd ? 'footer' : alternatePlacement;
        const makeEnd = (parent, cls, text) => {
          const b = u.el(cls === 'shelf-link' ? 'a' : 'button', cls, parent, text);
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
          document.body.classList.add('has-header-end');
          const tools = u.el('div', 'header-tools', top);
          submit = makeEnd(tools, 'submit header-submit', label);
        } else if (placement === 'shelf-link') submit = makeEnd(footer, 'shelf-link', label + ' ›');
        else {
          submit = makeEnd(footer, 'submit', label);
        }
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'pq-xtra', footer, labelOf(cr.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
      }
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
