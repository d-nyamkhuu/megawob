(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-one-07',
    'tokens': {
      'bg': '#fbfaf6',
      'panel': '#fdfcf9',
      'fg': '#1c1c1c',
      'accent': '#b3171c',
      'font': "Georgia,'Times New Roman',serif",
      'line': '#d6d3cc',
      'muted': '#6b6860',
    },
    'obstruction': null,
  };
  const T = (u, p, c, t) => u.el(c[0], c[1], p, t);
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = 'mag instruction-' + ctx.display;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const placement = er.bool(0.5) ? 'footer' : er.pick(['header', 'link']);
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = placement === 'footer' ? 'Submit' : labelOf(er.pick(labels));
      let collide = null;
      if (cr.bool(0.3)) {
        const same = (x) => String(x).trim().toLowerCase() === String(label).trim().toLowerCase();
        const pool = [...new Set(labels.map(labelOf).filter((x) => x && !same(x)))];
        if (pool.length) collide = { label: cr.pick(pool), where: cr.pick(['header', 'footer']) };
      }
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'mag-header', shell);
      const brand = u.el('div', 'mag-brand', header);
      u.el('span', 'mag-logo', brand, 'Chatter');
      u.el('span', 'mag-tag', brand, 'People. Posts. Conversations.');
      const sf = u.el('div', 'mag-search', header);
      const si = u.el('input', 'mag-search-in', sf);
      si.type = 'text';
      si.placeholder = 'Search posts, people...';
      const sb = u.el('button', 'mag-search-btn', sf, 'Search');
      sb.type = 'button';
      sb.addEventListener('click', () => env.log('decoy', { what: 'Search' }));
      const nav = u.el('nav', 'mag-nav', header);
      ['Home', 'Profile', 'Settings', 'Sign out'].forEach((l, i) => {
        if (i) u.el('span', 'mag-sep', nav, '|');
        const a = u.el('a', '', nav, l);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: l });
        });
      });
      const decoy = (parent, text) => {
        const b = u.el('button', 'mag-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (collide && collide.where === 'header') decoy(nav, collide.label);
      let headSubmit = null;
      if (!ctx.finish && placement === 'header') {
        headSubmit = u.el('button', 'end-control mag-header-end', header, label);
        headSubmit.type = 'button';
        headSubmit.addEventListener('click', () => ctx.submit());
      }
      const body = u.el('div', 'mag-body', shell);
      const left = u.el('aside', 'mag-left', body);
      const me = u.el('div', 'mag-box', left);
      u.el('div', 'mag-hello', me, 'Good afternoon,');
      u.el('div', 'mag-me', me, 'Alex');
      u.el('hr', '', me);
      u.el('div', 'mag-handle', me, '@alexr');
      for (const [k, v] of [
        ['Followers', '128'],
        ['Following', '96'],
        ['Messages', '4'],
      ]) {
        const r = u.el('div', 'mag-stat', me, k + ' ');
        u.el('b', '', r, v);
      }
      const tr = u.el('div', 'mag-box', left);
      u.el('h3', '', tr, 'Trending Topics');
      for (const t of ['citylife', 'monday', 'goodnews', 'travel', 'books']) u.el('div', 'mag-link', tr, '# ' + t);
      u.el('div', 'mag-more', tr, 'More topics →');
      const center = u.el('main', 'mag-center', body);
      const note = u.el('section', 'task-note', center);
      note.dataset.role = 'instruction';
      note.style.setProperty('--instruction-size', ctx.instruction.length < 90 ? '2.5rem' : '2.2rem');
      const th = u.el('div', 'mag-title', note);
      u.el('h1', '', th, 'Your Task');
      u.el('span', 'mag-date', th, 'April 14, 2008');
      if (ctx.display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const hid = u.el('div', '', center);
      hid.hidden = true;
      for (const c of ['action', 'target-author', 'post-starts-with', 'status']) u.el('span', 'detail-' + c, hid, '');
      const stage = u.el('div', 'stage', center);
      const right = u.el('aside', 'mag-right', body);
      const wf = u.el('div', 'mag-box', right);
      u.el('h3', '', wf, 'Who to follow');
      for (const [n, h] of [
        ['danielc', '@danielc'],
        ['priya_s', '@priya_s'],
        ['mikep', '@mikep'],
      ]) {
        const r = u.el('div', 'mag-who', wf);
        u.el('span', 'mag-face', r);
        const t = u.el('div', '', r);
        u.el('b', '', t, n);
        u.el('div', 'mag-wh', t, h);
        u.el('div', 'mag-follow', t, 'Follow');
      }
      u.el('div', 'mag-more', wf, 'Find more people →');
      const pp = u.el('div', 'mag-box', right);
      u.el('h3', '', pp, 'Popular Posts');
      for (const t of [
        'A perfect spring weekend',
        'Reading recommendations?',
        'Best coffee in town',
        'Small joys',
        'Weekend hike photos',
      ])
        u.el('div', 'mag-link', pp, t);
      u.el('div', 'mag-more', pp, 'More posts →');
      const footer = u.el('footer', 'mag-footer', shell);
      u.el('span', 'mag-copy', footer, '© 2008 Chatter');
      const act = u.el('div', 'mag-submit', footer);
      let submit = null;
      if (!ctx.finish && placement !== 'header') {
        if (placement === 'link') {
          submit = u.el('a', 'mag-end-link', act, label + ' →');
          submit.href = '#';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = u.el('button', 'end-control', act, label);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        }
      }
      if (collide && collide.where === 'footer') decoy(act, collide.label);
      const fl = u.el('nav', 'mag-flinks', footer);
      ['Help', 'Terms', 'Privacy'].forEach((l, i) => {
        if (i) u.el('span', 'mag-sep', fl, '|');
        u.el('span', '', fl, l);
      });
      return { stage, submit: submit || headSubmit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
