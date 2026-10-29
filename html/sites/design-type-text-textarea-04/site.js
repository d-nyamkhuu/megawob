(function () {
  'use strict';
  env.site({
    name: 'design-type-text-textarea-04',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = ctx.util;
      const win = u.el('div', 'motif-window', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'motif-appicon', top, '▤');
      u.el('span', 'ds-brand', top, 'ParcelNote  -  Inventory');
      u.el('span', 'motif-winctrl', top, '−　□　×');
      const menu = u.el('nav', 'ds-menu', win);
      'File|Edit|View|Records|Tools|Help'.split('|').forEach((x) => u.el('span', '', menu, x));
      const tool = u.el('div', 'motif-toolbar', win);
      [
        ['▱', 'New'],
        ['📂', 'Open'],
        ['▣', 'Print'],
        ['⌕', 'Find'],
        ['▤', 'Notes'],
      ].forEach(([i, t]) => {
        const b = u.el('button', 'motif-tool', tool, i);
        b.type = 'button';
        b.title = t;
      });
      const area = u.el('div', 'motif-area', win);
      const task = u.el('section', 'motif-task', area);
      const caption = u.el('h2', 'motif-caption', task, 'Item Details');
      const main = u.el('div', 'ds-main', task);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      function note(parent, cls) {
        const n = u.el('aside', cls, parent);
        u.el('span', 'motif-note-label', n, 'Task');
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      }
      if (mode === 'header') note(caption, 'motif-note');
      if (mode === 'panel') task.insertBefore(note(task, 'motif-note'), main);
      if (mode === 'toast') note(win, 'motif-toast');
      const stage = u.el('main', 'ds-stage', main);
      const side = u.el('section', 'motif-side', area);
      u.el('h2', 'motif-caption', side, 'Items');
      const table = u.el('div', 'motif-table', side);
      [
        ['Name', 'Category', 'Quantity'],
        ['Backpack', 'Outdoor', '8'],
        ['Basketball', 'Sports', '5'],
        ['Board Game', 'Toys', '12'],
        ['Camping Tent', 'Outdoor', '4'],
        ['Charger Cable', 'Electronics', '20'],
        ['Coffee Mug', 'Kitchen', '16'],
        ['Hand Cream 75 ml', 'Personal Care', '23'],
        ['Headphones', 'Electronics', '9'],
        ['Notebook', 'Stationery', '30'],
        ['Soft Activity Book', 'Toys', '14'],
        ['Thermos Bottle', 'Outdoor', '6'],
        ['Ukulele, Concert Size', 'Musical Instruments', '3'],
        ['Watercolor Set', 'Stationery', '11'],
        ['Wood Glue 250 ml', 'DIY', '18'],
      ].forEach((row, i) => {
        const r = u.el('div', 'motif-row' + (!i ? ' motif-th' : ''), table);
        if (i)
          u.el(
            'span',
            'motif-icon',
            r,
            ['♧', '◉', '▣', '△', '⌁', '☕', '♜', '♬', '▣', '▱', '♜', '♬', '▰', '♙'][i - 1] || '◈',
          );
        row.forEach((c) => u.el('span', '', r, c));
      });
      const foot = u.el('footer', 'ds-footer', win);
      [
        ['▧', 'Inventory'],
        ['▤', 'Orders'],
        ['♟', 'Customers'],
        ['▱', 'Suppliers'],
        ['▥', 'Reports'],
      ].forEach(([i, t], n) => {
        const b = u.el('button', 'motif-dock' + (!n ? ' selected' : ''), foot, '');
        u.el('span', 'motif-dockicon', b, i);
        u.el('span', '', b, t);
        b.type = 'button';
      });
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        let placement = null,
          label = 'Done';
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool =
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          label = String(er.pick(pool));
        }
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const opts = [...new Set(pool)].filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (opts.length) collide = cr.pick(opts);
        }
        const b = u.el('button', 'motif-end', tool, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        submit = b;
        if (collide) {
          const d = u.el('button', 'motif-xtra', tool, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
