(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-loading-03',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = ctx.util,
        root = document.body;
      let submit = null,
        placement = 'footer',
        label = 'Confirm';
      const link = (p, t, cls) => u.el('a', cls || '', p, t);
      const button = (p, txt, cls, fn) => {
        const b = u.el('button', cls || '', p, txt);
        b.type = 'button';
        b.addEventListener('click', fn);
        return b;
      };
      const page = u.el('div', 'catalog-page', root),
        rail = u.el('aside', 'catalog-rail', page);
      u.el('div', 'campus-photo', rail);
      const nav = u.el('nav', 'rail-links', rail);
      [
        'Search Catalog',
        'Advanced Search',
        'Browse Subjects',
        'New Arrivals',
        'Journal Titles',
        'Reserves',
        'My Account',
      ].forEach((t, i) => link(nav, t, i === 0 ? 'selected' : ''));
      const secondary = u.el('nav', 'rail-secondary', rail);
      ['Library Home', 'Hours', 'Using the Catalog', 'Research Help'].forEach((t) => link(secondary, t, ''));
      const content = u.el('div', 'catalog-content', page),
        head = u.el('header', 'catalog-head', content),
        identity = u.el('div', 'identity', head);
      u.el('div', 'uni-title', identity, 'Riverton University Library');
      u.el('div', 'uni-subtitle', identity, 'Online Catalog');
      const topnav = u.el('nav', 'topnav', head);
      ['Home', 'Help', 'About', 'Contact'].forEach((t, i) => {
        if (i) u.el('span', 'nav-divider', topnav, '|');
        link(topnav, t, '');
      });
      const mode = ctx.display || 'header';
      let note = null;
      if (mode === 'header') {
        note = u.el('div', 'task-note task-note-header', content, ctx.instruction);
      }
      const banner = u.el('section', 'intro-banner', content);
      u.el('h1', '', banner, 'Find Books, Journals, and More');
      u.el(
        'p',
        '',
        banner,
        'Search our collection of books, journals, maps, audiovisual materials and electronic resources.',
      );
      const books = u.el('div', 'books-photo', banner);
      if (mode === 'panel') u.el('aside', 'task-note task-note-panel', content, ctx.instruction);
      if (mode === 'toast') u.el('aside', 'task-note task-note-toast', content, ctx.instruction);
      const stats = u.el('div', 'catalog-stats', content);
      [
        'Total items in catalog: 352,416',
        'Books: 278,993',
        'Journals: 56,204',
        'Audio/Visual: 12,379',
        'Maps: 4,840',
      ].forEach((t, i) => {
        if (i) u.el('span', 'stats-sep', stats, '|');
        u.el('span', '', stats, t);
      });
      const stage = u.el('main', 'catalog-stage', content);
      const foot = u.el('footer', 'catalog-footer', content);
      if (!ctx.finish) {
        const fallback = [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
            "I'm done",
          ],
          labels =
            ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : fallback,
          labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
          er = ctx.rng.fork('chrome/end'),
          base = er.bool(0.5);
        label = base ? 'Confirm' : labelOf(er.pick(labels));
        placement = base ? 'footer' : er.pick(['footer', 'header', 'link']);
        if (placement === 'header') submit = button(head, label, 'end-control end-header', () => ctx.submit());
        else if (placement === 'link') {
          submit = link(foot, label, 'end-link');
          submit.href = 'javascript:void(0)';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else submit = button(foot, label, 'end-control', () => ctx.submit());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (pool.length)
            button(foot, cr.pick(pool), 'end-xtra', (e) =>
              env.log('decoy', { label: e.currentTarget.textContent, collide: true }),
            );
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'catalog-overlay catalog-overlay-' + ctx.kind, document.body);
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
