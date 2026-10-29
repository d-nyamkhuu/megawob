/* Photo Studio application frame. Rotation state remains owned by the rotate task. */
(function () {
  'use strict';
  function icon(parent, glyph, label) {
    const b = env.util.el('button', 'tool-icon', parent);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.innerHTML = glyph;
    return b;
  }
  function drawOverlay(ctx) {
    const u = ctx.util,
      el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const data = {
      chat: [
        'Photo Studio help',
        'Use the rotation handle or Straighten control to adjust this image.',
        'Open guide',
        'Dismiss',
      ],
      cookie: [
        'Privacy settings',
        'Allow optional cookies for this photo workspace?',
        'Accept optional',
        'Reject optional',
      ],
      toast: ['Workspace ready', 'Your photo edits are ready to continue.', null, 'Dismiss'],
      promo: ['Studio update', 'Discover more tools for your images.', 'Learn more', 'Not now'],
      banner: ['Offline workspace', 'Your edits stay in this local practice session.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, data[0]);
    const close = u.el('button', 'bubble-close', el, '×');
    close.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, data[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (data[2]) {
      const b = u.el('button', 'tour-primary', actions, data[2]);
      b.onclick = () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'skip');
    }
    const d = u.el('button', 'tour-dismiss', actions, data[3]);
    d.onclick = () => ctx.dismiss('skip');
    return { el, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-photo-01',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `photo-studio mode-${ctx.display}`;
      const title = u.el('header', 'titlebar', document.body);
      u.el('span', 'brand-mark', title, '△');
      u.el('span', 'app-name', title, 'Photo Studio');
      u.el('span', 'title-spacer', title);
      const actions = u.el('div', 'window-actions', title);
      for (const [n, g] of [
        ['minimize', '−'],
        ['maximize', '□'],
        ['close', '×'],
      ]) {
        const b = u.el('button', 'window-action ' + n, actions, g);
        b.setAttribute('aria-label', n);
      }
      const menu = u.el('nav', 'menu-bar', document.body);
      menu.setAttribute('aria-label', 'Application menu');
      ['File', 'Edit', 'View', 'Image', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const toolbar = u.el('nav', 'toolbar', document.body);
      toolbar.setAttribute('aria-label', 'Image tools');
      [
        ['<svg viewBox="0 0 24 24"><path d="M5 3h11l4 4v14H5zM8 3v6h9V4M8 21v-8h9v8"/></svg>', 'Save'],
        ['<svg viewBox="0 0 24 24"><path d="M3 10 12 3l9 7M5 9v12h14V9M9 21v-7h6v7"/></svg>', 'Open'],
        ['<svg viewBox="0 0 24 24"><path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 1 6 6"/></svg>', 'Undo'],
        ['<svg viewBox="0 0 24 24"><path d="m15 7 5 5-5 5M20 12H10a6 6 0 0 0-6 6"/></svg>', 'Redo'],
        ['<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM8 8l8 8M16 8l-8 8"/></svg>', 'Crop'],
        ['<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 8.5 6M12 6V2m0 0-3 3m3-3 3 3"/></svg>', 'Rotate'],
        ['<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/></svg>', 'Properties'],
        ['<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-5 2v4"/></svg>', 'Adjustments'],
        [
          '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/></svg>',
          'Light',
        ],
        [
          '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18"/></svg>',
          'Contrast',
        ],
        [
          '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
          'More',
        ],
      ].forEach(([g, l], i) => {
        const b = icon(toolbar, g, l);
        if (i === 5) b.classList.add('active');
        if (i === 2 || i === 4 || i === 6 || i === 9) b.classList.add('tool-divider');
      });
      const headnote = u.el('div', 'task-note', title, ctx.instruction);
      if (ctx.display !== 'header') headnote.hidden = true;
      let submit = null;
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end'),
          labels = ctx.content?.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK'];
        const label = r.pick(labels);
        const text = r.bool(0.5)
          ? 'Continue'
          : typeof label === 'string'
            ? label
            : label.label || label.text || String(label);
        const placement = ctx.rng.fork('chrome/end-placement').pick(['toolbar', 'toolbar', 'footer', 'link']);
        submit = u.el(
          'button',
          'submit-button end-' + placement,
          placement === 'footer' ? document.body : toolbar,
          placement === 'link' ? 'All set' : text,
        );
        submit.dataset.role = 'submit';
        submit.title = text;
        submit.setAttribute('aria-label', text);
        submit.onclick = () => ctx.submit();
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const ds = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
            .filter((x) => x !== text);
          if (ds.length) {
            const d = u.el('button', 'end-xtra', toolbar, cr.pick(ds));
            d.type = 'button';
            d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
          }
        }
      }
      const records = u.el('aside', 'record-index', document.body);
      [
        ['lake.jpg', 'Apr 14, 2022', '10:24 AM'],
        ['forest.jpg', 'Apr 12, 2022', '2:17 PM'],
        ['city.jpg', 'Apr 10, 2022', '9:03 AM'],
        ['beach.jpg', 'Apr 8, 2022', '6:41 PM'],
        ['mountain.jpg', 'Apr 5, 2022', '11:28 AM'],
        ['road.jpg', 'Apr 2, 2022', '4:19 PM'],
        ['flowers.jpg', 'Mar 30, 2022', '1:52 PM'],
        ['desert.jpg', 'Mar 27, 2022', '8:07 AM'],
      ].forEach((r, i) => {
        const row = u.el('div', 'record-row' + (!i ? ' selected' : ''), records);
        u.el('span', 'record-name', row, r[0]);
        u.el('span', 'record-date', row, r[1]);
        u.el('span', 'record-time', row, r[2]);
      });
      const stage = u.el('main', 'photo-stage', document.body);
      stage.dataset.role = 'stage';
      const note = u.el('aside', 'panel-note', document.body, ctx.instruction);
      note.hidden = ctx.display !== 'panel';
      const toast = u.el('aside', 'task-note-toast', document.body, ctx.instruction);
      toast.hidden = ctx.display !== 'toast';
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
