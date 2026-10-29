(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-fix-error-04',
    'task': 'solve-puzzle',
    'scenario': 'fix-error',
    'style': 'risc',
    'title': 'People',
    'menu': 'New     Edit     Delete          Find     Print     Card',
    'note': '',
    'layout': 'risc-layout',
    'subtitle': '',
    'aside': '',
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
        top = u.el('header', 'top', app),
        icon = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32', class: 'title-icon' }, top);
      u.svg('circle', { cx: 11, cy: 9, r: 5, fill: '#b7d5ea', stroke: '#111', 'stroke-width': 2 }, icon);
      u.svg('circle', { cx: 22, cy: 9, r: 5, fill: '#b7d5ea', stroke: '#111', 'stroke-width': 2 }, icon);
      u.svg(
        'path',
        {
          d: 'M2 28v-5c0-6 4-9 9-9s9 3 9 9v5M17 16c7-3 13 1 13 8v4',
          fill: '#9ab4ca',
          stroke: '#111',
          'stroke-width': 2,
        },
        icon,
      );
      u.el('span', '', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'win-' + kind, wc, kind === 'min' ? '_' : kind === 'max' ? '□' : '×');
        b.type = 'button';
      }
      const tools = u.el('nav', 'menu', app);
      ['New', 'Edit', 'Delete', 'Find', 'Print', 'Card'].forEach((label, i) => {
        const item = u.el('div', 'tool tool-' + i, tools);
        u.el('span', 'tool-icon', item, ['＋', '✎', '▤', '⌕', '▣', '☷'][i]);
        u.el('span', 'tool-label', item, label);
      });
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        work = u.el('div', 'work', center),
        index = u.el('section', 'contact-index', work),
        ih = u.el('div', 'index-head', index, 'Contacts'),
        cols = u.el('div', 'index-cols', index);
      u.el('span', '', cols, 'Name');
      u.el('span', '', cols, 'Company');
      const list = u.el('div', 'contact-list', index);
      [
        ['Adams, Ruth', 'Blue Sky Travel'],
        ['Baker, Tom', 'Riverside Books'],
        ['Carter, Elaine', 'Northfield School'],
        ['Davies, Mark', 'Pixel Press'],
        ['Ellis, Jo', 'Sunrise Catering'],
        ['Foster, Helen', 'Maple Computers'],
        ['Grant, Peter', 'Hillview Clinic'],
        ['Hughes, Laura', 'Clover Design'],
        ['Irwin, Simon', 'Riverside Books'],
        ['Jones, Claire', 'Blue Sky Travel'],
        ['King, Robert', 'Eastwood Motors'],
        ['Lewis, Daniel', 'Maple Computers'],
        ['Morris, Anne', 'Westbridge Gallery'],
        ['Nelson, Chris', 'Hillview Clinic'],
        ['Owen, Victoria', 'Clover Design'],
        ['Parker, Steven', 'Sunrise Catering'],
      ].forEach((row, i) => {
        const r = u.el('div', 'contact-row' + (i === 0 ? ' current' : ''), list);
        u.el('span', '', r, row[0]);
        u.el('span', '', r, row[1]);
      });
      const stage = u.el('section', 'stage', work),
        aside = u.el('aside', 'aside', document.body),
        footer = u.el('footer', 'bottom', app);
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
