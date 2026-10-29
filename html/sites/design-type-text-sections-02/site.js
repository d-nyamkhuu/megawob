(function () {
  'use strict';
  const C = {
    site: 'design-type-text-sections-02',
    brand: 'Amber Grove Studio  -  Customer Management',
    menu: ['File', 'Edit', 'View', 'Tools', 'Help'],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, '♟  ' + C.brand);
      const win = u.el('div', 'ds-window-controls', top);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'ds-win ds-win-' + i, win, x));
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const customers = u.el('div', 'ds-customer-head', rail);
      u.el('b', '', customers, '♟  Customers');
      const search = u.el('div', 'ds-search', rail, 'Search customers...  ⌕');
      const list = u.el('div', 'ds-customer-list', rail);
      u.el('div', 'ds-list-head', list, 'Name                                      Customer #');
      [
        'Nguyen, Lan',
        'Patel, Rohan',
        'Chen, Mei',
        'Garcia, Luis',
        'Smith, Emma',
        'Kowalski, Anna',
        'Davis, Michael',
        'Martinez, Sofia',
        'Brown, Chloe',
        'Wilson, Daniel',
        'Taylor, Olivia',
        'Anderson, Jack',
        'Thomas, Grace',
        'Moore, Ethan',
        'Jackson, Amelia',
      ].forEach((n, i) =>
        u.el('div', 'ds-customer' + (i === 0 ? ' selected' : ''), list, n + '              C10' + (428 + i)),
      );
      const help = u.el('section', 'ds-help', rail);
      u.el('b', '', help, '●  Customer Information');
      u.el(
        'p',
        '',
        help,
        'Manage customer details, contact information and order history. Select a customer from the list to view and edit their information.',
      );
      const content = u.el('div', 'ds-content', body);
      const head = u.el('section', 'ds-record-head', content);
      u.el('div', 'ds-avatar', head, '♟');
      const ident = u.el('div', 'ds-identity', head);
      u.el('h1', '', ident, 'Nguyen, Lan');
      u.el('div', '', ident, 'Customer # C10428');
      const meta = u.el('div', 'ds-meta', head);
      u.el('div', '', meta, 'Member since:  14.03.2011');
      u.el('div', '', meta, 'Total orders:  6');
      const natural = 'header';
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      const main = u.el('div', 'ds-main', content);
      const note = (parent, cls, title) => {
        const b = u.el('aside', cls, parent);
        if (title) u.el('h2', '', b, title);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      };
      if (mode === 'header') note(content, 'ds-header-note');
      if (mode === 'panel') note(rail, 'ds-panel-note', 'Task');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const n = note(content, 'ds-toast');
        content.insertBefore(n, main);
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      const items = [
        ['♟', 'Customers'],
        ['🛒', 'Orders'],
        ['▣', 'Products'],
        ['▥', 'Reports'],
        ['⚙', 'Settings'],
      ];
      items.forEach((it, i) => {
        const a = u.el('div', 'ds-dock-item' + (!i ? ' active' : ''), foot);
        u.el('span', 'ds-dock-icon', a, it[0]);
        u.el('span', '', a, it[1]);
      });
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          canonical = er.bool(0.5);
        let placement = 'footer',
          label = 'Done';
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const p = ctx.content && ctx.content.END_LABELS;
          label = String(
            er.pick(
              Array.isArray(p) && p.length
                ? p
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
            ),
          );
        }
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const p = ctx.content && ctx.content.END_LABELS;
          const pool = (
            Array.isArray(p) && p.length
              ? p
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const opts = [...new Set(pool)].filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (opts.length) collide = cr.pick(opts);
        }
        const decoy = (parent, text, cls) => {
          const b = u.el('button', 'ds-xtra ' + (cls || ''), parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', { label: text, collide: true });
        };
        const end = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = () => ctx.submit();
          return b;
        };
        if (placement === 'header') {
          if (collide) decoy(top, collide, 'ds-pq-header');
          submit = end(top, 'ds-submit ds-submit-header', label);
        } else {
          if (collide) decoy(foot, collide, 'ds-pq-link');
          submit = end(foot, 'ds-submit ds-submit-link', label);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const t = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, t[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
