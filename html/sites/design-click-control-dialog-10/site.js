(function () {
  'use strict';
  const nav = ['Home', 'Help', 'Site Map', 'Contact Us'];
  const earth =
    '<svg viewBox="0 0 100 100"><defs><radialGradient id="sea" cx=".65" cy=".26" r=".85"><stop stop-color="#04d3ff"/><stop offset=".48" stop-color="#0054d6"/><stop offset=".8" stop-color="#001999"/><stop offset="1" stop-color="#030965"/></radialGradient><radialGradient id="land" cx=".6" cy=".2" r=".9"><stop stop-color="#9be500"/><stop offset=".6" stop-color="#46b300"/><stop offset="1" stop-color="#086027"/></radialGradient><radialGradient id="shine" cx=".15" cy=".28" r=".7"><stop stop-color="white" stop-opacity=".7"/><stop offset=".4" stop-color="white" stop-opacity="0"/></radialGradient><clipPath id="sphere"><circle cx="50" cy="50" r="48"/></clipPath></defs><circle cx="50" cy="50" r="48" fill="url(#sea)"/><g clip-path="url(#sphere)" fill="url(#land)" stroke="#459300" stroke-width=".35"><path d="m33 4 9-3 10 3-5 5-8 1-3 6-8-1 2-6zM53 4l14 1 7 7-4 5 8 4 8-1 9 16-5 10-8-2-4-9-6 2-4-6-7 4-6-4 3-8-7-1-5-6 6-2zM43 16l4 1-3 5-4 1-3 7-4 1-1-5 4-5zM49 27l6 4 1 5 8 1 2 8 6 2 2 11-5 8-3 14-7 4-2-8-4-4-2-11-7-5-6-2-2-9 4-9 7 1zM28 31l3 3-4 5-5-2-2 8-6-2 1-8 5-8zM29 56l6 3-2 7 6 3 2 8 7 2 1 8-4 8-4-4-3-9-7-4-5-9zM78 58l5 1-2 7-4 1zM82 77l10-1 8 11-7 6-9-2-5-6zM48 94l14 1 5 4H38z"/><path d="m20 11 7-4-2 7-7 5-4 8-5 2 5-10zM68 10l6 4-2 3-4-2zM45 29l3-2 3 3-1 3-5-1z"/></g><g clip-path="url(#sphere)" fill="none" stroke="#68baff" stroke-opacity=".2" stroke-width=".6"><ellipse cx="50" cy="50" rx="23" ry="48"/><ellipse cx="50" cy="50" rx="40" ry="48"/><path d="M4 35q46-17 92 0M3 57q47 15 94 0M13 78q37 13 74 0"/></g><circle cx="50" cy="50" r="48" fill="url(#shine)" stroke="#102b9a" stroke-width="1"/></svg>';
  env.site({
    name: 'design-click-control-dialog-10',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref portal';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const globe = u.el('span', 'globe', head);
      globe.innerHTML = earth;
      const logo = u.el('div', 'logo', head);
      const lt = u.el('div', 'logo-t', logo);
      u.el('b', '', lt, 'WorldWeb');
      u.el('span', '', lt, ' Directory');
      u.el('div', 'logo-s', logo, 'Your Guide to the Internet');
      const meta = u.el('div', 'meta', head);
      u.el('div', 'date', meta, 'Tuesday, June 23, 1998');
      const links = u.el('div', 'toplinks', meta);
      nav.forEach((n, i) => {
        if (i) u.el('i', '', links, '|');
        u.el('a', '', links, n);
      });
      const bar = u.el('div', 'searchbar', shell);
      u.el('label', '', bar, 'Search the Web:');
      u.el('span', 'sbox', bar);
      u.el('span', 'sbtn', bar, 'Search');
      const r1 = u.el('span', 'radio', bar);
      u.el('i', 'on', r1);
      u.el('span', '', r1, 'Web');
      const r2 = u.el('span', 'radio', bar);
      u.el('i', '', r2);
      u.el('span', '', r2, 'Directory');
      const work = u.el('div', 'work', shell);
      const stage = u.el('div', 'stage', work);
      const foot = u.el('footer', 'footer', shell);
      const taskbox = u.el('div', 'taskbox', foot);
      if (ctx.display === 'hidden') taskbox.classList.add('task-hidden');
      if (ctx.display === 'panel') taskbox.classList.add('task-panel');
      if (ctx.display === 'toast') taskbox.classList.add('task-toast');
      u.el('div', 'tasklbl', taskbox, 'Task:');
      const note = u.el('div', 'instruction', taskbox, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      let placement = null,
        label = 'Submit',
        collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['dock', 'dock', 'dock', 'search', 'header']);
        const endBank =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(endBank));
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = [
            ...new Set(endBank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (pool.length) collide = cr.pick(pool);
        }
      }
      const endControl = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const decoy = (parent, text, colliding) => {
        const b = u.el('button', colliding ? 'end-xtra collide' : 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, ...(colliding ? { collide: true } : {}) }));
        return b;
      };
      let submit = null;
      if (collide) decoy(links, collide, true);
      if (!ctx.finish && placement === 'header') submit = endControl(links, 'header-end', label);
      const tools = u.el('div', 'dock-tools', foot);
      const ic = {
        Home: '<path d="m5 15 11-9 11 9v15H5Z" fill="#fff" stroke="#111" stroke-width="1.4"/><path d="M23 6h4v10h-4" fill="#a8bbc8" stroke="#111" stroke-width="1.3"/><path d="m2 15 14-12 14 12-2 2L16 7 4 17Z" fill="#dc3335" stroke="#111" stroke-width="1.3"/><path d="M8 16h6v14H8Z" fill="#9cd6e8" stroke="#111"/><path d="M19 14h5v7h-5Z" fill="#b8d9ff" stroke="#111"/><path d="M6 16v12M9 17v10M20 15v4" stroke="#fff"/>',
        Favorites:
          '<path d="m16 2 4.3 9 10 1.5-7.3 7 1.7 10L16 25 7.3 29.5l1.7-10-7.3-7L12 11Z" fill="#ffe76a" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/><path d="m16 5-3 8-8 1 6 5-1 7" fill="none" stroke="#fff5c3" stroke-width="1.3"/><path d="m19 13 9 1-6 6 1 7" fill="none" stroke="#c3941c"/>',
        'My Stuff':
          '<path d="M3 9q0-2 2-2h5l3-4h6q2 0 2 2v4h8v20H3Z" fill="#fff49a" stroke="#111" stroke-width="1.5"/><path d="M4 10h24v18H4Z" fill="#ffdf45"/><path d="M5 11h21M5 11v15" fill="none" stroke="#fff7b8"/><path d="M27 11v16H5" fill="none" stroke="#b29a29"/>',
        History:
          '<circle cx="16" cy="16" r="13" fill="#1f5fd0" stroke="#223" stroke-width="1.500"/><path d="M8 10c5-4 9 0 7 5s-5 3-6 8-3-8-1-13ZM19 8c5 0 8 5 5 9s-5-4-5-9Z" fill="#3ca040"/>',
        Help: '<path d="M6 2h14l7 7v21H6Z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M20 2v8h7M8 4v24h16" fill="none" stroke="#888"/><path d="M11 13c-1-7 13-7 11 0-1 4-5 3-5 8h-3c-1-5 4-5 4-8 0-3-4-3-4 0Z" fill="#54d6e1" stroke="#172e3a" stroke-width="1"/><path d="M14 24h3v3h-3Z" fill="#54d6e1" stroke="#172e3a"/>',
      };
      Object.keys(ic).forEach((k) => {
        const b = u.el('span', 'dock-btn', tools);
        const s = u.el('i', '', b);
        s.innerHTML = k === 'History' ? earth : '<svg viewBox="0 0 32 32">' + ic[k] + '</svg>';
        u.el('span', '', b, k);
      });
      if (!ctx.finish && placement === 'dock') {
        submit = endControl(foot, 'submit', label);
      } else if (!ctx.finish && placement === 'search') {
        submit = endControl(bar, 'search-end', label);
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
