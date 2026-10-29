(function () {
  'use strict';
  const C = { site: 'design-find-fact-join-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      const u = ctx.util;
      const win = u.el('div', 'window', document.body);
      const title = u.el('header', 'titlebar', win);
      const lights = u.el('div', 'lights', title);
      ['red', 'yellow', 'green'].forEach((c) => u.el('i', c, lights));
      u.el('span', 'app-icon', title, '♧');
      u.el('strong', 'app-title', title, 'Staff Directory');
      const nav = u.el('nav', 'menu', win);
      ['File', 'Edit', 'View', 'Record', 'Window', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const toolbar = u.el('div', 'toolbar', win);
      const actions = [
        ['＋', 'New'],
        ['▤', 'Open'],
        ['▤', 'Delete'],
        ['⌕', 'Search'],
        ['☷', 'Filter'],
        ['↕', 'Sort'],
      ];
      actions.forEach((a, i) => {
        if (i === 3) {
          const divider = u.el('i', 'tool-divider', toolbar);
        }
        const b = u.el('button', 'tool', toolbar);
        u.el('b', '', b, a[0]);
        u.el('span', '', b, a[1]);
      });
      const topSearch = u.el('div', 'global-search', toolbar);
      u.el('span', '', topSearch, '⌕');
      u.el('span', '', topSearch, 'Search people...');
      const content = u.el('div', 'content', win);
      const main = u.el('div', 'main', content);
      const task = u.el('section', 'task-column', main);
      const natural =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      let mode = natural;
      if ((mode === 'panel' || mode === 'toast') && window.innerWidth < 1260) mode = 'header';
      function note(parent, cls) {
        const n = u.el('div', cls, parent);
        u.el('span', 'note-mark', n, '✦');
        u.el('div', 'instruction', n, ctx.instruction);
        return n;
      }
      if (mode === 'header') note(task, 'header-note');
      const workarea = u.el('div', 'workarea', task);
      const stage = u.el('main', 'ds-stage', workarea);
      if (mode === 'panel') note(workarea, 'panel-note');
      const footer = u.el('footer', 'footer', task);
      u.el('span', 'status', footer, '');
      const sidebar = u.el('aside', 'sidebar', main);
      const sh = u.el('div', 'side-heading', sidebar);
      u.el('span', 'people-icon', sh, '♧');
      u.el('strong', '', sh, 'All Staff (10)');
      const sbox = u.el('div', 'side-search', sidebar);
      u.el('span', '', sbox, '⌕');
      u.el('span', '', sbox, 'Search staff...');
      const list = u.el('div', 'staff-list', sidebar);
      const people = [
        ['PS', 'Priya Shah', 'Project Manager', 'S001', '#b6e8fb'],
        ['DK', 'Daniel Kim', 'Data Analyst', 'S002', '#a8e8bd'],
        ['AY', 'Amina Yusuf', 'HR Specialist', 'S003', '#ffc2a8'],
        ['LO', 'Luis Ortega', 'IT Support', 'S004', '#d9bdff'],
        ['KN', 'Kamau Ndiaye', 'Business Analyst', 'S005', '#a9c9ff'],
        ['CW', 'Chen Wei', 'Data Engineer', 'S006', '#a9e7d7'],
        ['SR', 'Sofia Rossi', 'Recruiter', 'S007', '#f4b2d0'],
        ['NP', 'Noah Patel', 'Systems Administrator', 'S008', '#ffdc83'],
        ['EW', 'Emma Wilson', 'Product Designer', 'S009', '#d9bdff'],
        ['HT', 'Hiro Tanaka', 'Research Analyst', 'S010', '#a5e4e9'],
      ];
      people.forEach((p) => {
        const row = u.el('div', 'staff-row', list);
        u.el('span', 'avatar', row, p[0]).style.background = p[4];
        const txt = u.el('div', 'staff-text', row);
        u.el('span', 'staff-name', txt, p[1]);
        u.el('span', 'staff-role', txt, p[2]);
        u.el('span', 'staff-id', row, p[3]);
      });
      if (mode === 'toast') {
        const t = note(content, 'toast-note');
        content.insertBefore(t, main);
      }
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
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5),
        placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Apply'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'apply'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text, coll) => {
        const b = u.el('button', 'xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', coll ? { label: text, collide: true } : { label: text }));
      };
      let submit = null;
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide) decoy(footer, collide, true);
      if (placement === 'footer') submit = end(footer, 'submit', label);
      if (placement === 'header') submit = end(title, 'header-submit', label);
      if (placement === 'link') {
        submit = u.el('a', 'end-link', footer, label + ' ›');
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'overlay overlay-' + ctx.kind, document.body);
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
