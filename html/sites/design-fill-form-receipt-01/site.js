(function () {
  'use strict';
  const C = { site: 'design-fill-form-receipt-01', menu: 'File|Edit|View|Tools|Help' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        er = ctx.rng.fork('chrome/end'),
        labels = ctx.content?.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
        val = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)),
        apply = labels.find((x) => val(x).toLowerCase() === 'apply'),
        end = val(
          apply && er.bool(0.5) ? apply : er.pick(labels.filter((x) => val(x).toLowerCase() !== 'apply')) || labels[0],
        ),
        variation = er.int(0, 3),
        placement = ctx.finish ? null : ['toolbar', 'icon', 'footer', 'link'][variation];
      let collide = null;
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const options = labels.map(val).filter((x) => x.toLowerCase() !== end.toLowerCase());
        if (options.length) collide = cr.pick(options);
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, '▧  Expense Manager');
      const controls = u.el('span', 'ds-window-controls', top);
      u.el('span', '', controls, '−');
      u.el('span', '', controls, '□');
      u.el('span', '', controls, '×');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((x) => u.el('span', '', nav, x));
      const body = u.el('div', 'ds-body', document.body),
        rail = u.el('aside', 'ds-rail', body);
      [
        ['▤', 'Expenses'],
        ['▥', 'Reports'],
        ['▧', 'Receipts'],
        ['⚙', 'Settings'],
      ].forEach(([i, t], n) => {
        const x = u.el('div', 'ds-rail-item' + (!n ? ' active' : ''), rail);
        u.el('b', '', x, i);
        u.el('span', '', x, t);
      });
      const content = u.el('div', 'ds-content', body);
      let display = ctx.display || 'header';
      if (display === 'panel' && innerWidth < 1260) display = 'header';
      if (display === 'toast' && innerHeight < 700) display = 'header';
      function note(parent, cls) {
        const x = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', x, ctx.instruction);
        return x;
      }
      if (display === 'header') note(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const side = u.el('aside', 'ds-summary', main);
      if (display === 'panel') {
        const n = note(side, 'ds-brief');
        n.insertBefore(u.el('h2', '', n, 'Task'), n.firstChild);
      }
      u.el('h2', '', side, 'Documents');
      [
        ['Total Receipts', '12'],
        ['Processed', '3'],
        ['Remaining', '9'],
      ].forEach(([a, b], i) => {
        const row = u.el('div', 'ds-stat', side);
        u.el('span', '', row, a);
        u.el('b', '', row, b);
      });
      u.el('h3', '', side, 'Categories');
      [
        ['Meals & Entertainment', '6'],
        ['Travel', '3'],
        ['Office Supplies', '2'],
        ['Other', '1'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'ds-category', side);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      if (display === 'toast') note(content, 'ds-toast');
      let submit = null;
      const make = (parent, cls, label, tag = 'button') => {
        const b = u.el(tag, cls, parent, label);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (p, label) => {
        const b = u.el('button', 'ds-end-xtra', p, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      };
      let toolbar = null;
      if (placement === 'toolbar' || collide) {
        toolbar = u.el('div', 'ds-toolbar', content);
        if (placement === 'toolbar') submit = make(toolbar, 'ds-toolbar-end', end);
        if (collide) decoy(toolbar, collide);
      }
      const footer = u.el('footer', 'ds-footer', content);
      u.el('span', '', footer, 'Ready');
      if (placement === 'footer') submit = make(footer, 'ds-submit', end);
      if (placement === 'link') submit = make(footer, 'ds-status-end', end, 'a');
      if (placement === 'icon')
        submit = make(toolbar || (toolbar = u.el('div', 'ds-toolbar', content)), 'ds-icon-end', '✓');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const text = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, text[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
