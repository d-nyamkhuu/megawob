(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-10',
    'brand': 'Oakridge',
    'sub': 'Workspace',
    'tokens': {
      'bg': '#f7f6f0',
      'panel': '#faf9f6',
      'fg': '#10110b',
      'accent': '#ae891f',
      'font': "Georgia,'Times New Roman',serif",
      'line': '#d1cbb9',
      'muted': '#625f58',
      'button-fg': '#fff',
    },
    obstruction: ['Oakridge Notes', 'A short note from the Oakridge team about this workspace.', 'Close'],
  };
  const P = (d) =>
    '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#2f2f1c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    d +
    '</svg>';
  const IC = {
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    folder: '<path d="M3 5h7l2 3h9v13H3z" fill="#dfc16a" stroke="#9f7b16"/><path d="M3 9h18" stroke="#9f7b16"/>',
    upload: '<path d="M12 18V5M6 11l6-6 6 6M5 20h14"/>',
    download: '<path d="M12 4v13M6 11l6 6 6-6M5 20h14"/>',
    cut: '<circle cx="7" cy="18" r="3"/><circle cx="17" cy="18" r="3"/><path d="M8.5 15.5L17 3M15.5 15.5L7 3"/>',
    copy: '<rect x="9" y="9" width="11" height="12" rx="1"/><path d="M5 15V4h10"/>',
    paste: '<rect x="5" y="5" width="14" height="16" rx="1"/><path d="M9 3h6v4H9z"/>',
    del: '<path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h1M4 12h1M4 18h1"/>',
    grid: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>',
    sort: '<path d="M7 20V5M4 8l3-3 3 3M17 4v15M14 16l3 3 3-3"/>',
    gear: '<path d="M10 2h4l.6 3 2 .9 2.6-1.5 2 3.5-2.2 2 .2 2.2 2.4 1.8-2 3.5-2.8-1-1.8 1.2-.4 3.4h-4l-.6-3-2-.9-2.6 1.5-2-3.5 2.2-2-.2-2.2L1 9.1l2-3.5 2.8 1 1.8-1.2z"/><circle cx="12" cy="12" r="3"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 .3c0 1.7-2.5 2-2.5 3.7M12 17v.5"/>',
    leaf: '<path d="M10 11C5 9 4 4 9 1c4 4 4 7 1 10" fill="#96894b" stroke="none"/><path d="M10 21C3 21 1 14 1 9c7 0 10 5 9 12M10 20C9 8 15 5 23 3c-1 12-5 18-13 17" fill="#4f5737" stroke="none"/><path d="M10 22 18 8M10 21 4 12M10 12 9 5M12 17 19 14" stroke="#e9e7d4" stroke-width=".6"/>',
    book: '<path d="M3 5h7a2 2 0 012 2v13a2 2 0 00-2-2H3zM21 5h-7a2 2 0 00-2 2v13a2 2 0 012-2h7z"/>',
  };
  const GROUPS = [
    [
      'File',
      [
        ['New File', 'file'],
        ['New Folder', 'folder'],
        ['Upload', 'upload'],
        ['Download', 'download'],
      ],
    ],
    [
      'Edit',
      [
        ['Cut', 'cut'],
        ['Copy', 'copy'],
        ['Paste', 'paste'],
        ['Delete', 'del'],
      ],
    ],
    [
      'View',
      [
        ['List View', 'list'],
        ['Grid View', 'grid'],
      ],
    ],
    [
      'Sort',
      [
        ['Sort A–Z', 'sort'],
        ['Sort Z–A', 'sort'],
      ],
    ],
    [
      'More',
      [
        ['Preferences', 'gear'],
        ['Help', 'help'],
      ],
    ],
  ];
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      let display = ctx.display || 'header';
      document.body.className = 'q-shell q-display-' + display + (display === 'hidden' ? ' q-hidden' : '');
      const shell = u.el('div', 'site-shell', document.body);
      shell.classList.add('q-display-' + display);
      const header = u.el('header', 'q-header', shell);
      const br = u.el('div', 'q-brand', header);
      br.innerHTML = P(IC.leaf)
        .replace('width="30" height="30"', 'width="38" height="38"')
        .replace(/#2f2f1c/, '#4a5a20');
      u.el('span', 'q-name', br, D.brand);
      u.el('span', 'q-sub', br, D.sub);
      const right = u.el('div', 'q-right', header);
      u.el('span', '', right, 'Project Explorer');
      u.el('i', 'q-sep', right);
      const av = u.el('span', 'q-av', right, 'JD');
      u.el('span', 'q-chev', right, '⌵').textContent = '⌄';
      const rib = u.el('nav', 'q-ribbon', shell);
      for (const [g, items] of GROUPS) {
        const grp = u.el('div', 'q-group', rib);
        const row = u.el('div', 'q-items', grp);
        for (const [n, ic] of items) {
          const b = u.el('div', 'q-tool', row);
          b.innerHTML = P(IC[ic]);
          u.el('span', '', b, n);
        }
        u.el('div', 'q-gname', grp, g);
      }
      let headerNote = null;
      if (display === 'header') {
        headerNote = u.el('div', 'q-header-note', shell);
        headerNote.dataset.role = 'instruction';
        u.el('span', 'q-note-kicker', headerNote, 'Project note');
        u.el('span', 'q-header-copy', headerNote, ctx.instruction);
      }
      const body = u.el('div', 'design-body', shell);
      if (display === 'panel') {
        const panel = u.el('aside', 'q-task-panel', body);
        u.el('div', 'q-panel-title', panel, 'Project note');
        u.el('div', 'q-panel-copy', panel, ctx.instruction);
      }
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'q-footer', shell);
      const st = u.el('div', 'q-status', footer);
      u.el('i', 'q-dot', st);
      u.el('span', '', st, 'Ready');
      u.el('em', '', st, '|');
      u.el('span', '', st, 'Project: learning-project');
      u.el('em', '', st, '|');
      u.el('span', '', st, '0 files open');
      const note = u.el('section', 'task-note' + (display === 'toast' ? ' q-note-toast' : ''), footer);
      note.dataset.role = 'instruction';
      if (display === 'toast') {
        const ic = u.el('span', 'q-bk', note);
        ic.innerHTML = P(IC.book).replace('width="30" height="30"', 'width="26" height="26"');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
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
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const common = !ctx.finish && er.bool(0.5);
      const alternatives = labels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
      const endLabel = common ? 'Submit' : alternatives.length ? er.pick(alternatives) : er.pick(labels);
      const placement = ctx.finish ? null : common ? 'footer' : er.pick(['footer', 'toolbar', 'link']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [...new Set(labels)].filter(
          (x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase(),
        );
        if (choices.length) collide = cr.pick(choices);
      }
      let submit = null;
      const act = u.el('div', 'q-actions', footer);
      const end = (parent, cls, text, icon) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (placement === 'toolbar') submit = end(right, 'end-control q-toolbar-end', endLabel);
      if (placement === 'footer') submit = end(act, 'end-control', endLabel);
      if (placement === 'link') submit = end(act, 'q-end-link', endLabel + ' ›');
      if (collide) {
        const decoy = u.el('button', 'q-xtra', act, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
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
