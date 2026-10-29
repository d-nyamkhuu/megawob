(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-coupon-03',
    brand: 'CampusMart - Shop',
    tokens: {
      bg: '#c9cdd0',
      panel: '#f5f5f5',
      fg: '#111820',
      accent: '#bfc9ed',
      line: '#9da2a7',
      muted: '#50565c',
      font: 'Arial,sans-serif',
    },
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'os2 instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const title = u.el('div', 'title-row', header);
      u.el('span', 'app-icon', title, '▤');
      u.el('div', 'design-brand', title, D.brand);
      const controls = u.el('div', 'window-controls', title);
      ['−', '□', '×'].forEach((x) => u.el('span', '', controls, x));
      u.el('nav', 'menu-row', header, 'File     Edit     View     Search     Go     Favorites     Help');
      const toolbar = u.el('nav', 'toolbar-row', header);
      const icons = [
        '<svg viewBox="0 0 32 32"><path d="M3 15 16 4l13 11M7 14v14h18V14M13 28v-9h6v9"/><path d="M5 15 16 6l11 9"/></svg>',
        '<svg viewBox="0 0 32 32"><circle cx="13" cy="13" r="9"/><path d="m20 20 9 9"/></svg>',
        '<svg viewBox="0 0 32 32"><path d="M3 9h10l3 4h13v15H3zM3 9V5h10l3 4"/></svg>',
        '<svg viewBox="0 0 32 32"><path d="M3 6h4l3 16h16l4-12H9"/><circle cx="13" cy="27" r="2"/><circle cx="24" cy="27" r="2"/><path d="M12 14h15M13 18h13"/></svg>',
        '<svg viewBox="0 0 32 32"><path d="M8 3h12l6 6v20H8zM20 3v7h6M12 15h10M12 19h10M12 23h10"/></svg>',
      ];
      [['Home'], ['Search'], ['Categories'], ['Bag'], ['Orders']].forEach(([l], i) => {
        const b = u.el('div', 'tool ' + (i === 3 ? 'selected' : ''), toolbar);
        const icon = u.el('span', 'tool-icon', b);
        icon.innerHTML = icons[i];
        u.el('span', '', b, l);
      });
      const sub = u.el('nav', 'tab-row', header);
      ['Welcome', 'Search', 'Products', 'Bag', 'Offers', 'Help'].forEach((x, i) =>
        u.el('div', 'notebook-tab ' + (i === 3 ? 'active' : ''), sub, x),
      );
      if (ctx.display === 'header' && ctx.instruction)
        u.el('div', 'header-task', header, ctx.instruction).dataset.role = 'instruction';
      const body = u.el('div', 'design-body', shell);
      const stage = u.el('main', 'stage', body);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display === 'panel' && ctx.instruction) {
        u.el('b', 'tips-title', note, 'Task note');
        u.el('p', 'food-task', note, ctx.instruction);
      }
      if (ctx.display === 'toast' && ctx.instruction) {
        const t = u.el('div', 'task-toast', shell, ctx.instruction);
        t.dataset.role = 'instruction';
      }
      const tips = u.el('aside', 'tips-rail', body);
      u.el('h3', '', tips, '💡  Shopping Tips');
      [
        'Enter a coupon code in the box above and click Apply.',
        'Active offers are shown in green.',
        'Expired offers are listed below.',
        'You can change quantities or remove items from your bag.',
        'Shipping is calculated during checkout.',
      ].forEach((x) => {
        const row = u.el('div', 'tip-row', tips);
        u.el('span', 'bullet', row, '•');
        u.el('span', '', row, x);
      });
      const footer = u.el('footer', 'design-footer', shell);
      const endRng = ctx.rng.fork('chrome/end'),
        labels = ctx.content?.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const norm = (x) => (typeof x === 'string' ? x : x?.label || x?.text || String(x));
      const label = norm(endRng.pick(labels));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control', footer, label);
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const other = Array.from(new Set(labels.map(norm))).find((x) => x !== label);
        if (other) {
          const b = u.el('button', 'xtra-control', footer, other);
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: other, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        texts = {
          cookie: ['Privacy preferences', 'This site uses cookies to remember your settings.', 'Dismiss'],
          toast: ['Notice', 'Your shopping bag is ready.', 'Dismiss'],
          chat: ['Shopping help', 'How can we help you today?', 'Close'],
          promo: ['CampusMart offers', 'See this week’s special offers.', 'Close'],
          banner: ['CampusMart', 'Free standard shipping on qualifying orders.', 'Dismiss'],
        };
      const [title, copy, label] = texts[ctx.kind],
        el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
