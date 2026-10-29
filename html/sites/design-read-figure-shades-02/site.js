(function () {
  'use strict';
  const C = { 'site': 'design-read-figure-shades-02', 'style': 'civic', 'layout': 'bands' };
  env.site({
    name: C.site,
    styles: ['site.css', 'civic.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      u.el('b', '', brand, 'Civic Services');
      u.el('small', '', brand, 'A more accessible community for everyone');
      const nav = u.el('nav', 'menu', top);
      for (const t of ['Home', 'Services', 'Help', 'Sign in']) u.el('span', '', nav, t);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      if (ctx.display === 'hidden') brief.hidden = true;
      u.el('div', 'sub', center, 'Choose all that apply. You can select more than one.');
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      const tip = u.el('div', 'tip', footer);
      const ic = u.svg('svg', { width: 68, height: 46, viewBox: '0 0 68 46', class: 'kb' }, tip);
      u.svg(
        'rect',
        { x: 2, y: 3, width: 64, height: 40, rx: 5, fill: 'none', stroke: '#2b3f5c', 'stroke-width': 3 },
        ic,
      );
      u.svg(
        'path',
        {
          d: 'M10 13h4M20 13h4M30 13h4M40 13h4M50 13h4M10 21h4M20 21h4M30 21h4M40 21h4M50 21h4M10 30h4M20 30h25M50 30h4',
          fill: 'none',
          stroke: '#2b3f5c',
          'stroke-width': 3,
        },
        ic,
      );
      const tipText = u.el('span', '', tip, 'Tip: You can also use your keyboard to select tiles');
      u.el('br', '', tipText);
      u.el('span', '', tipText, '(Tab to move, Space to select).');
      let submit = null;
      if (!ctx.finish) {
        const ends = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const common = !er.bool(0.5);
        const label = common
          ? 'Submit'
          : labelText(er.pick(ends.filter((x) => labelText(x).trim().toLowerCase() !== 'submit')));
        const placement = common ? 'footer' : er.pick(['header', 'link']);
        const end = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.classList.add('submit');
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        const decoy = (parent, text) => {
          const b = u.el('button', 'end-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        };
        if (placement === 'header') {
          submit = end(nav, 'header-submit', label);
        } else if (placement === 'link') {
          submit = end(footer, 'end-link', label + ' ›');
        } else {
          submit = end(footer, 'submit', label);
        }
        if (cr.bool(0.3)) {
          const pool = ends.map(labelText).filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) decoy(placement === 'header' ? footer : nav, labelText(cr.pick(pool)));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This site stores preferences on your device.',
        toast: 'Your request has been saved.',
        chat: 'Need help with this form?',
        promo: 'Try the new service guide.',
        banner: 'An updated service guide is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
