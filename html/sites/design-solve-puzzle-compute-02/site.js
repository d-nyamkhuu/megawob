(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-compute-02', task: 'solve-puzzle', scenario: 'compute' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'bauhaus ' + C.scenario + ' instruction-' + ctx.display;
      const er = ctx.rng.fork('chrome/end'),
        labels = (
          (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ]
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x))),
        placement = er.bool(0.5) ? 'form' : er.pick(['toolbar', 'link']),
        label = placement === 'form' ? 'Confirm' : er.pick(labels);
      document.body.classList.add('ep-end-' + placement);
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('strong', 'brand', top, 'NEXA');
      const nav = u.el('nav', 'menu', top);
      for (const item of ['Orders', 'Products', 'Customers', 'Reports'])
        u.el('span', item === 'Orders' ? 'active' : '', nav, item);
      u.el('span', 'search', top, '⌕');
      u.el('span', 'avatar', top, '●');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center),
        stats = u.el('section', 'stats', center);
      const data = [
        ['All Orders', '12', '#96999b'],
        ['Shipped', '5', '#53b875'],
        ['Processing', '4', '#f5c644'],
        ['Cancelled', '3', '#df302d'],
      ];
      for (const [name, n, color] of data) {
        const box = u.el('div', 'stat', stats);
        u.el('b', '', box, name);
        u.el('strong', '', box, n);
        const dot = u.el('i', '', box);
        dot.style.background = color;
      }
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', footer, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (pool.length) {
          const where = cr.pick(['toolbar', 'link']),
            box = u.el('div', 'ep-xtras ' + (where === 'link' ? 'link-xtras' : 'toolbar-xtras'), top),
            word = cr.pick(pool),
            d = u.el('button', 'ep-xtra', box, word);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: word, collide: true }));
        }
      }
      if (ctx.display === 'hidden') brief.style.display = 'none';
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
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      d.addEventListener('click', ctx.dismiss);
      return { el, dismiss: d };
    },
  });
})();
