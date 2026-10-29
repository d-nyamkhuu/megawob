(function () {
  'use strict';
  const C = { site: 'design-act-in-time-popup-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      const header = u.el('div', 'ww-instruction', body);
      const show = ctx.display === 'header';
      if (show) u.el('strong', '', header, ctx.instruction);
      else header.classList.add('ww-instruction-empty');
      u.el('span', 'ww-date', header, 'April 27, 1998');
      const mast = u.el('header', 'ww-masthead', body);
      u.el('div', 'ww-globe', mast, '🌎');
      const identity = u.el('div', 'ww-identity', mast);
      u.el('b', '', identity, 'WorldWeb Directory');
      u.el('small', '', identity, 'Your Guide to the Internet');
      const search = u.el('div', 'ww-search', mast);
      u.el('label', '', search, 'Search the Web:');
      const input = u.el('input', '', search);
      input.setAttribute('aria-label', 'Search the Web');
      const sb = u.el('button', '', search, 'Search');
      sb.type = 'button';
      const nav = u.el('nav', 'ww-nav', mast);
      ['Home', 'Help', 'Site Map', 'Contact'].forEach((x, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('a', '', nav, x);
      });
      const board = u.el('div', 'ww-board', body);
      const catsL = [
        ['Arts & Humanities', 'Literature', 'History', 'Philosophy', 'Visual Arts', 'Performing Arts', 'Museums'],
        ['Business & Economy', 'Companies', 'Investing', 'Jobs', 'Real Estate', 'Small Business', 'Economy'],
        ['Computers & Internet', 'Hardware', 'Software', 'Programming', 'Internet', 'Web Design', 'Computer Science'],
        ['Education', 'Colleges & Universities', 'K-12', 'Distance Learning', 'Libraries', 'Reference', 'Scholarships'],
      ];
      const catsR = [
        [
          'Health & Medicine',
          'Diseases & Conditions',
          'Fitness',
          'Mental Health',
          'Nutrition',
          'Medical Research',
          'Pharmaceuticals',
        ],
        ['News & Media', 'World News', 'U.S. News', 'Television', 'Radio', 'Newspapers', 'Magazines'],
        ['Recreation & Sports', 'Outdoors', 'Sports', 'Games', 'Hobbies', 'Travel', 'Autos'],
        ['Society & People', 'Government', 'Law', 'Religion', 'People Finder', 'Nonprofit Organizations', 'Community'],
      ];
      function column(groups) {
        const col = u.el('aside', 'ww-column', board);
        groups.forEach((g) => {
          const card = u.el('section', 'ww-category', col);
          u.el('h2', '', card, g[0]);
          const list = u.el('div', 'ww-links', card);
          g.slice(1).forEach((s) => u.el('a', '', list, s));
        });
        return col;
      }
      const left = column(catsL),
        center = u.el('section', 'ww-center', board),
        right = column(catsR);
      if (ctx.display === 'panel') {
        const p = u.el('aside', 'ww-note-panel', left);
        u.el('b', '', p, 'Task Instructions');
        u.el('span', '', p, ctx.instruction);
        left.insertBefore(p, left.firstChild);
      }
      const stage = u.el('main', 'ds-stage', center);
      const featured = u.el('section', 'ww-featured', center);
      u.el('h2', '', featured, "Today's Featured Links");
      const fl = u.el('div', 'ww-feature-list', featured);
      [
        ['Space Exploration', 'World News', 'Healthy Living'],
        ['Travel Guide', 'Classic Literature', 'Science Resources'],
      ].forEach((group) => {
        const g = u.el('div', '', fl);
        group.forEach((s) => u.el('a', '', g, s));
      });
      if (ctx.display === 'toast') {
        const toast = u.el('aside', 'ww-toast', right);
        toast.textContent = ctx.instruction;
        right.insertBefore(toast, right.firstChild);
      }
      const foot = u.el('footer', 'ww-footer', body);
      const footNav = u.el('div', 'ww-footnav', foot);
      ['Home', 'Help', 'Site Map', 'Contact'].forEach((x, i) => {
        if (i) u.el('i', '', footNav, '|');
        u.el('a', '', footNav, x);
      });
      u.el('span', 'ww-copyright', foot, '© 1998 WorldWeb Directory. All rights reserved.');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const nameOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const original = er.bool(0.5);
        const label = original ? 'Submit' : nameOf(er.pick(labels));
        const place = original ? 'footer' : er.pick(['header', 'link', 'icon']);
        const finishControl = (parent, cls, text) => {
          const b = u.el(cls === 'ww-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          submit = b;
          return b;
        };
        const decoys = [];
        if (cr.bool(0.3)) {
          const pool = [...new Set(labels.map(nameOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (pool.length) decoys.push({ text: nameOf(cr.pick(pool)), collide: true });
        }
        const fillers =
          ctx.content && Array.isArray(ctx.content.DECOY_LABELS)
            ? ctx.content.DECOY_LABELS
            : ['Help', 'Feedback', 'Preview', 'Save draft', 'Share', 'History'];
        const fr = ctx.rng.fork('chrome/filler');
        for (let i = 0, n = fr.int(0, 1); i < n; i++) decoys.push({ text: nameOf(fr.pick(fillers)), collide: false });
        const addDecoys = (parent) =>
          decoys.forEach((d) => {
            const b = u.el('button', 'ww-submit ww-xtra', parent, d.text);
            b.type = 'button';
            b.dataset.role = 'xtra';
            b.addEventListener('click', () =>
              env.log('decoy', d.collide ? { label: d.text, collide: true } : { label: d.text }),
            );
          });
        if (place === 'header') {
          header.classList.add('ww-has-end');
          finishControl(header, 'ww-submit ww-header-submit', label);
        } else if (place === 'link') finishControl(footNav, 'ww-endlink', label);
        else if (place === 'icon') finishControl(foot, 'ww-submit ww-icon-submit', '✓');
        else finishControl(foot, 'ww-submit', label);
        if (place === 'icon') submit.setAttribute('aria-label', label);
        addDecoys(foot);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const offer = ctx.kind === 'promo';
      u.el('b', 'ww-offer-title', el, offer ? 'Special Offer' : 'WorldWeb Directory');
      u.el(
        'p',
        '',
        el,
        offer
          ? 'Try WorldWeb Plus for only $9.95 a month.'
          : {
              cookie: 'We use cookies to remember your preferences.',
              toast: 'Changes synced.',
              chat: 'Hello. How can we help?',
              banner: 'Scheduled maintenance tonight.',
            }[ctx.kind] || 'Welcome to WorldWeb Directory.',
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
