(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-menu-08',
    'brand': 'CampusConnect',
    'mode': 'perimeter',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ffffff',
      'fg': '#000000',
      'accent': '#0000ee',
      'font': "'Times New Roman',Times,serif",
      'line': '#bdbdbd',
      'muted': '#444444',
    },
    'obstruction': null,
  };
  const LINKS = [
    ['Quick Links', ['My Profile', 'Messages', 'Groups', 'Events'], null],
    ['Who to Follow', ['@maria_t', '@chenalex', '@priya_s'], 'Browse people'],
  ];
  const END_FALLBACK = [
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
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('a', 'design-brand', header, D.brand);
      brand.href = '#';
      brand.addEventListener('click', (e) => e.preventDefault());
      const nav = u.el('nav', 'design-nav', header);
      ['Home', 'Find People', 'Settings', 'Help'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        const a = u.el('a', '', nav, t);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: t });
        });
      });
      const body = u.el('div', 'design-body', shell);
      const left = u.el('aside', 'ref-left', body);
      for (const [h, items, more] of LINKS) {
        const box = u.el('section', 'ref-box', left);
        u.el('h3', '', box, h);
        const ul = u.el('div', 'ref-links', box);
        for (const t of items) {
          const a = u.el('a', '', ul, t);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: t });
          });
        }
        if (more) {
          const a = u.el('a', 'more-link', ul, more);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
          });
        }
      }
      const center = u.el('div', 'ref-center', body);
      const note = u.el('section', 'task-note task-note-' + ctx.display, center);
      note.dataset.role = 'instruction';
      if (ctx.instruction.length > 90) note.classList.add('long');
      if (ctx.display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', center);
      const right = u.el('aside', 'ref-right', body);
      const sb = u.el('section', 'ref-box', right);
      u.el('h3', '', sb, 'Search');
      const sw = u.el('div', 'ref-search', sb);
      const inp = u.el('input', '', sw);
      inp.type = 'text';
      inp.setAttribute('aria-label', 'Search');
      const sbtn = u.el('button', 'ref-btn', sw, 'Search');
      sbtn.type = 'button';
      const tr = u.el('section', 'ref-box', right);
      u.el('h3', '', tr, 'Trending on Campus');
      const tl = u.el('div', 'ref-links', tr);
      for (const t of ['#spring', '#finals', '#clubfair', '#hiking']) {
        const a = u.el('a', '', tl, t);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
      }
      const ev = u.el('section', 'ref-box', right);
      u.el('h3', '', ev, 'Upcoming Events');
      const el2 = u.el('div', 'ref-events', ev);
      for (const [d, t] of [
        ['Apr 28', 'Study Group'],
        ['Apr 29', 'Board Game Night'],
        ['May 1', 'Spring Concert'],
      ]) {
        const r = u.el('div', '', el2);
        u.el('span', '', r, d);
        const a = u.el('a', '', r, t);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
      }
      const va = u.el('a', 'more-link', el2, 'View all events');
      va.href = '#';
      va.addEventListener('click', (e) => e.preventDefault());
      const footer = u.el('footer', 'design-footer', shell);
      const back = u.el('button', 'ref-btn back', footer, '← Back to Tasks');
      back.type = 'button';
      back.addEventListener('click', () => env.log('decoy', { what: 'back' }));
      let submit = null;
      let endLabel = 'Submit';
      let placement = 'footer';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : END_FALLBACK;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        endLabel = labelOf(er.pick(labels));
        const evenSeed = (Number(ctx.seed) || 0) % 2 === 0;
        const footerPick = er.bool(0.5) === evenSeed;
        placement = footerPick ? 'footer' : er.pick(['header', 'link']);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = (
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : END_FALLBACK
        ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
        const options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collide = cr.pick(options);
      }
      const end = (parent, cls, label) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, label);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, label) => {
        const b = u.el('button', 'ref-btn end-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      if (!ctx.finish && placement === 'header') {
        const h = end(header, 'header-end', endLabel);
        if (collide) decoy(header, collide);
        submit = h;
      }
      if (!ctx.finish && placement === 'footer') {
        if (collide) decoy(footer, collide);
        submit = end(footer, 'end-control', endLabel);
      }
      if (!ctx.finish && placement === 'link') {
        if (collide) decoy(footer, collide);
        submit = end(footer, 'end-link', endLabel);
      }
      return { stage, submit };
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
