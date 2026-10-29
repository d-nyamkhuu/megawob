(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shades-10',
    'task': 'read-figure',
    'scenario': 'shades',
    'style': 'electron',
    'title': 'Math Notebook',
    'menu': 'Notebook    Problems    Draw    Highlight    Erase',
    'note': 'Notes',
    'layout': 'stagger',
    'subtitle': '',
    'aside':
      'Quick Notes:\n\n1. Count the blocks in each group.\n2. Add the two numbers.\n3. Type the total into the textbox.',
  };
  env.site({
    name: C.site,
    styles: ['home.css'],
    frame(ctx) {
      document.body.className = 'home instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const iconMarkup = [
        '<path d="M3 12L15 2l12 10-3 3-9-8-9 8z" fill="#bd382c"/><path d="M6 13v16h19V13l-10-8z" fill="#eee"/><path d="M11 19h7v10h-7z" fill="#3894b5"/><path d="M20 3h4v7h-4z" fill="#eee"/><path d="M8 15h3v4H8zM21 15h2v4h-2z" fill="#81c4db"/>',
        '<rect x="5" y="4" width="21" height="26" rx="1" fill="#fffef0"/><path d="M10 3h11v5H10z" fill="#d4d5ad"/><path d="M9 12h13M9 16h13M9 20h13M9 24h11" stroke="#225d6c"/>',
        '<path d="M2 20l7-4 7 4v10H2z" fill="#ec8bbb"/><path d="M18 18l7-4 6 5v11H18z" fill="#f38d25"/><path d="M8 23l8-5 9 5v9H8z" fill="#235fc7"/><path d="M6 12V8l4-3 4 3v7l-4 4zM23 13V8l4-3 4 3v8l-4 3z" fill="#efc29b"/><path d="M12 18v-5l4-3 5 3v6l-5 4z" fill="#edbc92"/><path d="M5 10l2-5 6-1 3 7M22 10l1-6 6-1 3 8M11 16l1-6 7-1 4 7" fill="none"/>',
        '<path d="M2 8h28v20H2z" fill="#fffef5"/><path d="M3 9l13 12L29 9M3 27l9-11m17 11-9-11" fill="none"/>',
        '<circle cx="16" cy="16" r="15" fill="#175fcb"/><path d="M8 3l9 1-2 5-5 2-2 6-5-1-1-6zM22 8l7 5-3 7-4 1-1 8-5-2 1-9 5-4z" fill="#279429"/><path d="M8 3l-3 9 1 11 7 7M22 3l4 11-1 11M2 15h28" opacity=".35" fill="none"/>',
        '<path d="M16 1l4 10 11 1-8 8 3 11-10-6-10 6 3-11-8-8 11-1z" fill="#ffe334"/>',
      ];
      const mk = (p, names, offset) => {
        const n = u.el('nav', 'nav', p);
        names.forEach((t, i) => {
          const a = u.el('a', '', n);
          a.href = '#';
          a.addEventListener('click', (e) => e.preventDefault());
          const s = u.svg(
            'svg',
            {
              viewBox: '0 0 34 34',
              'shape-rendering': 'crispEdges',
              fill: 'none',
              stroke: '#171717',
              'stroke-width': 1.6,
              'stroke-linejoin': 'miter',
            },
            a,
          );
          s.innerHTML = iconMarkup[offset + i];
          u.el('span', '', a, t);
        });
      };
      const tree = (p) => {
        const s = u.svg('svg', { viewBox: '0 0 50 64', class: 'tree', 'shape-rendering': 'crispEdges' }, p);
        u.svg('path', { d: 'M23 44h6v18h-6z', fill: '#795e36', stroke: '#111' }, s);
        u.svg(
          'path',
          {
            d: 'M25 1l-2 5-3-1 2 5-7 1 5 3-5 3-5-1 4 4-5 3 9-1-5 5-7-1 4 4-6 3 11 1-7 4-5-1 4 4-6 3 8 2-3 3 15-2 4 2 3-2 15 2-3-4 8-1-5-3 2-3-7 1-4-4 11-1-6-3 3-4-7 1-5-5 10 1-5-3 3-4-6 1-5-3 6-3-8-1 1-4-3 1z',
            fill: '#174126',
            stroke: '#101c12',
            'stroke-width': 2,
          },
          s,
        );
        u.svg(
          'path',
          {
            d: 'M23 7l3 1m-7 7 6-1m-8 5 8 1m-11 6 10-2m-13 8 14-3m-15 9 14-3m-16 8 15-4m-10 7 11-3m3-27 5 2m-5 5 8 2m-9 4 10 3m-10 4 12 4m-12 2 9 3m-13-33 1 34',
            fill: 'none',
            stroke: '#4b7846',
            'stroke-width': 2,
          },
          s,
        );
      };
      mk(top, ['Home', 'Guestbook', 'Community'], 0);
      const mast = u.el('div', 'mast', top);
      tree(mast);
      const mt = u.el('div', '', mast);
      u.el('b', '', mt, 'Maple Grove Online');
      u.el('span', '', mt, 'A Small Town on the Web');
      tree(mast);
      mk(top, ['Mail', 'Links', 'My Page'], 3);
      const center = u.el('div', 'center', app);
      const wt = u.el('div', 'wtitle', center);
      u.el('i', '', wt);
      u.el('span', '', wt, 'Color Puzzle');
      u.el('small', '', wt, 'Have Fun! ');
      u.el('span', 'smile', wt, '☺');
      const brief = u.el('div', 'brief ' + ctx.display, center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['link', 'footer', 'footer', 'header', 'footer', 'icon']);
      const sampledLabel = ctx.finish ? '' : labelOf(er.pick(bank));
      const label = placement === 'footer' ? 'Submit' : sampledLabel;
      const decoyRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && decoyRng.bool(0.3)) {
        const options = [...new Set(bank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(decoyRng.pick(options));
      }
      const button = (parent, cls, text, isSubmit) => {
        const tag = cls === 'end-link' ? 'a' : 'button';
        const b = u.el(tag, cls, parent, text);
        if (tag === 'a') b.href = '#';
        else b.type = 'button';
        if (isSubmit) {
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          b.dataset.role = 'xtra';
          b.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { label: text, collide: true });
          });
        }
        return b;
      };
      let submit = null;
      if (collide) {
        const parent = placement === 'header' || placement === 'icon' ? wt : footer;
        button(parent, 'xtra', collide, false);
      }
      if (!ctx.finish) {
        if (placement === 'footer') submit = button(footer, 'submit', label, true);
        else if (placement === 'link') submit = button(footer, 'end-link', label + ' ›', true);
        else if (placement === 'header') submit = button(wt, 'submit title-submit', label, true);
        else submit = button(wt, 'submit title-submit icon-submit', '✓', true);
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
