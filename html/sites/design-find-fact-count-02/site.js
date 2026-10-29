(function () {
  'use strict';
  const C = { site: 'design-find-fact-count-02', instruction: 'top', briefTitle: 'Task' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body),
        brand = u.el('div', 'ds-brand', top);
      u.el('span', 'globe', brand, '◉');
      const name = u.el('div', 'brand-name', brand);
      u.el('strong', '', name, 'HarborView');
      u.el('small', '', name, 'PARTNER EXTRANET');
      u.el('div', 'user-links', top, 'Welcome, Alex Carter　 |　 Partner Site　 |　 Help　 |　 Log Out');
      const tabs = u.el('nav', 'ds-menu', document.body);
      ['Home', 'Products', 'Orders', 'Resources', 'Support'].forEach((t, i) =>
        u.el('span', i === 3 ? 'active' : '', tabs, t),
      );
      const body = u.el('div', 'ds-body', document.body),
        rail = u.el('aside', 'ds-rail', body);
      ['▤|Documents', '♧|Partners', '◇|Orders', '▤|Products', '▥|Reports', '▣|Training', '⚙|Admin'].forEach((s, i) => {
        const a = u.el('div', i === 0 ? 'selected' : '', rail);
        const p = s.split('|');
        u.el('b', '', a, p[0]);
        u.el('span', '', a, p[1]);
      });
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel' && document.documentElement.clientWidth > 1280
              ? 'left'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left') {
        const note = briefing(main, 'ds-brief');
      }
      const summary = u.el('aside', 'resource-side', main),
        tree = u.el('section', 'resource-tree', summary);
      u.el('h2', '', tree, 'Resource Library');
      const rows = [
        '📁  All Documents (48)',
        '▾ 📁  Product Info (12)',
        '　▤  Overview (3)',
        '　▤  Specifications (4)',
        '　▤  Release Notes (5)',
        '⊞ 📁  Sales & Marketing (8)',
        '⊞ 📁  Partner Program (6)',
        '⊞ 📁  Technical (10)',
        '⊞ 📁  Policies (7)',
        '⊞ 📁  Archived (5)',
      ];
      rows.forEach((x, i) => u.el('div', i < 2 ? 'tree-strong' : '', tree, x));
      const summaryBox = u.el('section', 'side-box', summary);
      u.el('h2', '', summaryBox, 'Document Summary');
      [
        ['Total documents', '48'],
        ['PDF files', '20'],
        ['Word files', '12'],
        ['HTML files', '10'],
        ['Other files', '6'],
      ].forEach((r) => {
        const row = u.el('div', 'stat-row', summaryBox);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const links = u.el('section', 'side-box quick', summary);
      u.el('h2', '', links, 'Quick Links');
      ['Product Catalog', 'Partner Guide', 'Pricing Sheet', 'Contact Support'].forEach((x) =>
        u.el('div', '', links, '▤　' + x),
      );
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
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
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const placement = ctx.finish ? null : er.bool(0.5) ? 'footer' : er.pick(['header', 'link']),
        label = ctx.finish ? '' : placement === 'footer' ? 'OK' : er.pick(labels.filter((x) => x !== 'Submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) collide = cr.pick(labels.filter((x) => x.toLowerCase() !== label.toLowerCase()));
      const decoy = (p, t) => {
        const b = u.el('button', 'ds-xtra', p, t);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: t, collide: true });
      };
      const end = (p, cls, t) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, p, t);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      const tools = u.el('div', 'ds-tools', top);
      if (collide) decoy(placement === 'footer' ? foot : tools, collide);
      if (placement === 'header') submit = end(tools, 'ds-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'This site uses cookies.',
          toast: 'Changes saved.',
          chat: 'How can we help?',
          promo: 'Partner update',
          banner: 'Service announcement',
        }[ctx.kind],
      );
      const b = u.el('button', '', el, 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
