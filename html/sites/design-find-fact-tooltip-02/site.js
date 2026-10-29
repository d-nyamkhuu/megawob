(function () {
  'use strict';
  const C = { site: 'design-find-fact-tooltip-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = ctx.util,
        root = document.body;
      const top = u.el('header', 'ds-top', root),
        brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-globe', brand, '◎');
      const word = u.el('div', 'ds-wordmark', brand);
      u.el('strong', '', word, 'GlobalMart');
      u.el('small', '', word, 'SUPPLIER DIRECTORY & INVENTORY');
      const right = u.el('div', 'ds-headright', top),
        links = u.el('div', 'ds-quicklinks', right);
      ['Help', 'Site Map', 'Contact'].forEach((x) => u.el('span', '', links, x));
      const search = u.el('div', 'ds-search', right);
      u.el('b', '', search, 'Search:');
      const input = u.el('input', '', search);
      input.setAttribute('aria-label', 'Search');
      u.el('button', '', search, 'Go');
      const nav = u.el('nav', 'ds-menu', root);
      ['Suppliers', 'Products', 'Orders', 'Shipments', 'Reports'].forEach((x) => u.el('span', '', nav, x));
      const body = u.el('div', 'ds-body', root),
        content = u.el('div', 'ds-content', body);
      const natural = ctx.display === 'header' ? 'top' : 'hidden',
        mode =
          ctx.display === 'panel'
            ? 'left'
            : ctx.display === 'toast'
              ? 'toast'
              : ctx.display === 'hidden'
                ? 'hidden'
                : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('b', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const banner = u.el('section', 'ds-overview', content);
      const art = u.el('div', 'ds-art', banner);
      u.el('div', 'ds-art-lines', art);
      const copy = u.el('div', 'ds-overview-copy', banner);
      u.el('h1', '', copy, 'Office Supplies');
      u.el(
        'p',
        '',
        copy,
        'Everyday products for a productive workplace. Browse our inventory of supplies from trusted global suppliers.',
      );
      const cols = u.el('div', 'ds-cats', copy);
      [
        ['Writing & Correction', 'Paper & Notebooks', 'Filing & Storage'],
        ['Desk Accessories', 'Kitchen & Breakroom', 'Technology Supplies'],
      ].forEach((a) => {
        const col = u.el('div', '', cols);
        a.forEach((x) => u.el('a', '', col, x));
      });
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left') {
        briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', root);
      const names = ['Home', 'Inventory', 'Suppliers', 'Orders', 'Reports', 'Preferences'];
      names.forEach((x, i) => {
        const item = u.el('div', i === 1 ? 'ds-dockitem on' : 'ds-dockitem', foot);
        u.el('b', '', item, ['◆', '⬡', '♟', '▤', '▮', '◎'][i]);
        u.el('span', '', item, x);
      });
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
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
      const p = ctx.finish ? null : er.bool(0.5) ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : p === 'footer'
          ? 'Submit'
          : er.pick(labels.filter((x) => x.toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const tools = u.el('div', 'ds-tools', top);
      if (collide) decoy(tools, collide);
      if (p === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (p === 'footer') submit = end(foot, 'ds-submit', label);
      if (p === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
