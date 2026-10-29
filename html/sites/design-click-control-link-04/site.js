(function () {
  'use strict';
  const cats = [
    ['Arts & Humanities', 'book', ['Literature', 'Museums', 'Music', 'Performing Arts', 'Visual Arts']],
    ['Computers & Internet', 'pc', ['Hardware', 'Software', 'Programming', 'Internet Services', 'Web Design']],
    ['Business & Economy', 'coins', ['Companies', 'Careers', 'Investing', 'Real Estate', 'Small Business']],
    ['Society & Culture', 'people', ['People', 'Government', 'Law', 'Education', 'Environment']],
    ['Science', 'globe', ['Biology', 'Chemistry', 'Physics', 'Space', 'Mathematics']],
    ['Travel & Recreation', 'palm', ['Destinations', 'Outdoors', 'Sports', 'Hobbies', 'Maps']],
  ];
  const globe =
    '<svg viewBox="0 0 64 64" shape-rendering="crispEdges"><defs><radialGradient id="ocean" cx="28%" cy="22%" r="80%"><stop stop-color="#c5f2ff"/><stop offset=".4" stop-color="#388de0"/><stop offset="1" stop-color="#003994"/></radialGradient></defs><circle cx="32" cy="32" r="29" fill="url(#ocean)" stroke="#001b47" stroke-width="2"/><path d="m24 6 9-2 6 4-2 5-5 1-2 8-8 2-4 7-7-2-1-8 6-4 2-6 7 1Zm2 27 8 2 1 6 5 2-6 8-2 7-5-3-1-9-7-7 2-6Zm20-20 5 3 3 9-6 3 1 4 7 5-3 10-7 3-4-8-6-1-1-9 8-4-3-7Z" fill="#269b36" stroke="#075626" stroke-width="1.2"/><path d="M13 15h6v-4h5v7h-5v5h-6Zm13-8h6v6h-6Z" fill="#a9ec93"/><path d="M9 32h47M31 4q-18 26 1 55M35 4q17 27 0 55M9 19q23 10 46 0M9 46q23-10 45 0" stroke="#0b5493" opacity=".4" fill="none"/><path d="m11 15 5-5 9-4" stroke="#efffff" stroke-width="3" fill="none"/></svg>';
  const icons = {
    book: '<svg viewBox="0 0 40 32"><path d="M2 4h16q2 0 2 3v22q0-2-2-2H2Z M38 4H22q-2 0-2 3v22q0-2 2-2h16Z" fill="#fff6dc" stroke="#a02010" stroke-width="3"/><path d="M6 10h10M6 15h10M24 10h10M24 15h10" stroke="#a02010"/></svg>',
    pc: '<svg viewBox="0 0 40 32"><rect x="7" y="1" width="26" height="20" rx="2" fill="#bbb" stroke="#222" stroke-width="2"/><rect x="11" y="5" width="18" height="12" fill="#1860d0"/><rect x="4" y="23" width="32" height="7" fill="#ccc" stroke="#222" stroke-width="2"/></svg>',
    coins:
      '<svg viewBox="0 0 40 32"><g fill="#f0b020" stroke="#7a4a00" stroke-width="2"><ellipse cx="12" cy="9" rx="9" ry="4"/><ellipse cx="28" cy="13" rx="9" ry="4"/><ellipse cx="14" cy="20" rx="10" ry="4"/><ellipse cx="29" cy="25" rx="9" ry="4"/><ellipse cx="13" cy="27" rx="9" ry="3.5"/></g></svg>',
    people:
      '<svg viewBox="0 0 40 32"><g stroke="#222" stroke-width="1.5"><circle cx="12" cy="9" r="5" fill="#f0c090"/><circle cx="26" cy="8" r="5" fill="#e0a070"/><circle cx="19" cy="12" r="5" fill="#f5d0a0"/><rect x="3" y="15" width="14" height="15" rx="4" fill="#d02020"/><rect x="22" y="14" width="15" height="16" rx="4" fill="#1060c0"/><rect x="12" y="18" width="14" height="12" rx="4" fill="#f0a010"/></g></svg>',
    globe:
      '<svg viewBox="0 0 40 32"><circle cx="20" cy="16" r="14" fill="#2070d0" stroke="#124" stroke-width="2"/><path d="M10 10q6-4 10 0t-2 8-8 2Q8 14 10 10ZM24 18q6-2 8 4-4 5-8 3Z" fill="#3a9a40"/></svg>',
    palm: '<svg viewBox="0 0 48 48" shape-rendering="crispEdges"><path d="m25 15 7 2-2 13-4 15H16l6-8 3-12Z" fill="#a26d32" stroke="#15180b" stroke-width="2"/><path d="m25 23 5 3m-7 4 6 3m-8 3 6 3" stroke="#e1ad63"/><path d="M25 17 16 8 7 9 2 15l9-3 10 7L8 17 3 24l9-3 10 1-8 7 1 6 7-11 4-4 8 13 3-1-6-13 10 4 4-1-8-8-9 1 7-7 9 4-3-7-8-2-8 10-6-10-9 1-4 6 10-3Z" fill="#199a37" stroke="#08260c" stroke-width="2"/><path d="m6 13 10-3 9 8 10-10m-9 10 12 2m-13 0-9 9" fill="none" stroke="#74cf50"/></svg>',
  };
  icons.globe = globe;
  icons.book =
    '<svg viewBox="0 0 48 48" shape-rendering="crispEdges"><path d="M2 8h18l4 5 4-5h17v34H27l-3 3-4-3H2Z" fill="#ce2416" stroke="#160b04" stroke-width="2"/><path d="m6 5 12 1 6 6 5-6 13-1v32l-13 1-5 4-6-4-12-1Z" fill="#d0ac6d" stroke="#211709" stroke-width="2"/><path d="m10 7 8 2 5 5v23l-6-4-7-1Zm18 7 5-5 6-1v24l-7 2-4 4Z" fill="#f1dbac"/><path d="M24 13v26M10 13l7 2m-7 3 7 2m-7 3 7 2m-7 3 7 2M32 11v21M35 10v21" stroke="#7f603a"/><path d="M3 43h17m8 0h17" stroke="#ff5c3c"/></svg>';
  icons.pc =
    '<svg viewBox="0 0 48 48" shape-rendering="crispEdges"><defs><linearGradient id="screen" x2="1" y2="1"><stop stop-color="#7bc8ff"/><stop offset=".5" stop-color="#0054be"/><stop offset="1" stop-color="#00235f"/></linearGradient></defs><path d="M8 2h31l2 2v28H6V5Z" fill="#c2beaa" stroke="#171915" stroke-width="2"/><path d="M10 6h27v21H10Z" fill="#16191d"/><path d="M13 9h21v15H13Z" fill="url(#screen)"/><path d="m15 10 9 0-9 10m4-10 9 0-13 13" stroke="#77b8ed" opacity=".5"/><path d="M9 29h27M19 33v4h12v-4M5 37h36l4 6-2 3H4l-3-3Z" fill="#a7a596" stroke="#171915" stroke-width="2"/><path d="M8 40h29m-31 3h35" stroke="#eee9d4"/></svg>';
  icons.coins =
    '<svg viewBox="0 0 48 48" shape-rendering="crispEdges"><g stroke="#201800" stroke-width="2" fill="#e6ae16"><path d="M25 6h20v31H25ZM3 17h20v25H3Z"/><ellipse cx="35" cy="6" rx="10" ry="4" fill="#ffdd56"/><path d="M25 13q10 6 20 0m-20 6q10 6 20 0m-20 6q10 6 20 0m-20 6q10 6 20 0" fill="none"/><ellipse cx="13" cy="17" rx="10" ry="4" fill="#ffe36a"/><path d="M3 23q10 6 20 0m-20 6q10 6 20 0m-20 6q10 6 20 0" fill="none"/><path d="M18 32h20v11H18Z"/><ellipse cx="28" cy="32" rx="10" ry="4" fill="#ffe36a"/><path d="M18 38q10 6 20 0" fill="none"/></g><path d="M6 21v17m22-28v17m-6 9v5" stroke="#fff198" stroke-width="2"/></svg>';
  icons.people =
    '<svg viewBox="0 0 48 48" shape-rendering="crispEdges"><g stroke="#141b21" stroke-width="1.6"><path d="M1 29q7-8 15 0v16H1Zm31 0q7-8 15 0v16H32Z" fill="#178e39"/><path d="M7 21v-9l7-3 5 5-2 9m14-1v-9l6-3 6 5v7" fill="#6c4131"/><path d="M7 17h10v10H7Zm26 0h9v10h-9Z" fill="#d79a5b"/><path d="M14 25V11l4-8h9l6 8v14Z" fill="#a45a1d"/><path d="M19 10h9v16h-9Z" fill="#ffc570"/><path d="M11 29q12-10 25 0v18H11Z" fill="#0079c6"/><path d="M16 33v14m15-14v14M6 32v12m36-12v12" fill="none"/><path d="m22 27 2 7 3-7" fill="#fff"/></g></svg>';
  env.site({
    name: 'design-click-control-link-04',
    styles: ['portal.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref portal';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'wf-head', shell);
      const logo = u.el('div', 'wf-logo', head);
      logo.innerHTML = globe;
      const tt = u.el('div', 'wf-brand', head);
      const t1 = u.el('div', 'wf-name1', tt);
      t1.innerHTML = '<b>Web</b>Finder';
      u.el('div', 'wf-name2', tt, 'The Internet Directory');
      u.el('div', 'wf-tag', head, 'Find It. Explore It.™');
      const nav = u.el('nav', 'wf-nav', head);
      ['Home', 'Help', 'About', 'Contact'].forEach((s, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('span', 'wf-a', nav, s);
      });
      u.el('div', 'wf-date', head, 'Tue, Apr 14, 1998');
      const work = u.el('div', 'work', shell);
      const left = u.el('section', 'wf-left', work);
      u.el('h1', 'wf-strip big', left, 'Browse Our Categories');
      const grid = u.el('div', 'wf-cats', left);
      cats.forEach((c) => {
        const cell = u.el('div', 'wf-cat', grid);
        const ic = u.el('div', 'wf-icon', cell);
        ic.innerHTML = icons[c[1]];
        const body = u.el('div', 'wf-catbody', cell);
        const hd = u.el('div', 'wf-cathead', body);
        u.el('span', 'wf-a', hd, c[0]);
        c[2].concat(['More...']).forEach((s) => {
          const r = u.el('div', 'wf-sub', body);
          u.el('span', 'wf-a', r, s);
        });
      });
      const sb = u.el('div', 'wf-search', left);
      u.el('h2', 'wf-strip', sb, 'Search the WebFinder Directory');
      const sr = u.el('div', 'wf-srow', sb);
      u.el('div', 'wf-input', sr);
      const sel = u.el('div', 'wf-select', sr, 'All Categories');
      u.el('span', '', sel, '⌄');
      u.el('div', 'wf-btn', sr, 'Search');
      const right = u.el('section', 'wf-right', work);
      const taskbox = u.el('div', 'wf-task', right);
      u.el('h2', 'wf-strip', taskbox, 'Your Task');
      const center = u.el('div', 'center', right);
      const note = u.el('div', 'instruction', taskbox);
      note.textContent = ctx.instruction;
      note.dataset.display = ctx.display;
      if (ctx.display === 'header') {
        note.classList.add('wf-task-instruction');
      } else if (ctx.display === 'toast') {
        note.className = 'instruction wf-toast-instruction';
        right.insertBefore(note, center);
      } else if (ctx.display === 'hidden') note.remove();
      if (ctx.display === 'hidden' || ctx.display === 'toast') taskbox.remove();
      if (ctx.display === 'panel') taskbox.classList.add('wf-panel-task');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'wf-foot', shell);
      const fl = u.el('span', '', foot);
      fl.append('© 1998 WebFinder  |  ');
      u.el('span', 'wf-a', fl, 'Terms of Use');
      fl.append('  |  ');
      u.el('span', 'wf-a', fl, 'Privacy Policy');
      u.el('span', '', foot, 'A Brighter Web Together');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const keep = er.bool(0.5);
        const place = keep ? 'shelf' : ctx.rng.fork('chrome/end-place').pick(['header', 'link']);
        const bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const label = keep ? 'Submit' : labelOf(er.pick(bank));
        const decoyR = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (decoyR.bool(0.3)) {
          const options = [...new Set(bank.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = labelOf(decoyR.pick(options));
        }
        const make = (parent, cls, text, active) => {
          const el = u.el(active && cls === 'wf-endlink' ? 'a' : 'button', cls, parent, text);
          if (el.tagName === 'BUTTON') el.type = 'button';
          else el.href = '#';
          if (active) {
            el.setAttribute('aria-label', label);
            el.title = label;
          }
          el.addEventListener('click', (e) => {
            e.preventDefault();
            if (active) ctx.submit();
            else env.log('decoy', { label: text, collide: true });
          });
          return el;
        };
        if (place === 'header') submit = make(head, 'submit wf-header-submit', label, true);
        else {
          const bar = u.el('div', 'wf-submitbar', right);
          if (place === 'link') submit = make(bar, 'wf-endlink', label, true);
          else submit = make(bar, 'submit', label, true);
        }
        if (collide) {
          const parent = place === 'header' ? head : right;
          const d = make(parent, place === 'header' ? 'wf-pq wf-pq-head' : 'wf-pq', collide, false);
          d.dataset.role = 'xtra';
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
