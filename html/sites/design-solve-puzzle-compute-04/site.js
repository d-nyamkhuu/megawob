(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-compute-04',
    task: 'solve-puzzle',
    scenario: 'compute',
    style: 'human',
    title: 'Account Records',
    menu: '',
    note: 'Record Details',
    layout: 'inspector',
    subtitle: '',
    aside: '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const endR = ctx.rng.fork('chrome/end'),
        endLabels = (
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x))),
        endPlacement = endR.bool(0.5) ? 'form' : endR.pick(['toolbar', 'link']),
        endLabel = endPlacement === 'form' ? 'Submit' : endR.pick(endLabels);
      document.body.classList.add('ep-end-' + endPlacement);
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 48, height: 48, viewBox: '0 0 48 48', class: 'title-icon' }, top);
      u.svg('rect', { x: 4, y: 4, width: 40, height: 40, fill: '#bd8b20', stroke: '#ffe08a', 'stroke-width': 3 }, icon);
      u.svg(
        'path',
        { d: 'M10 13h22l6 5v18H10zM7 18h25v16H7zM14 10h21v7', fill: '#e5c46b', stroke: '#5a3810', 'stroke-width': 2 },
        icon,
      );
      u.el('span', '', top, C.title);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', footer, endLabel);
        submit.type = 'button';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', ctx.submit);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [...new Set(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
        if (pool.length) {
          const where = collideR.pick(['toolbar', 'link']),
            box = u.el('div', 'ep-xtras ' + (where === 'link' ? 'link-xtras' : 'toolbar-xtras'), document.body),
            text = collideR.pick(pool),
            decoy = u.el('button', 'ep-xtra', box, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
