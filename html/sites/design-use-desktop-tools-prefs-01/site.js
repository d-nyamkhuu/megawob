(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-prefs-01', brand: 'DeskMate', mode: 'desktop',
    tokens: { bg: '#fff', panel: '#fff', fg: '#111', accent: '#111', font: '"Courier New",monospace', line: '#111', muted: '#333', 'button-fg': '#111' },
    nav: 'File    Edit    View    Tools    Window    Help',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'], footer: ''
  };
  env.site({
    name: D.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util, root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const titleline = u.el('div', 'titleline', header);
      u.el('span', 'app-mark', titleline, '▤');
      u.el('div', 'design-brand', titleline, D.brand);
      u.el('div', 'window-controls', titleline, '□ □ ×');
      u.el('nav', 'design-nav', header, D.nav);
      const toolbar = u.el('div', 'desktop-toolbar', shell);
      for (const [icon, label] of [['▯','New'],['▱','Open'],['▣','Save'],['✂','Cut'],['▤','Copy'],['▣','Paste'],['▥','Delete'],['⌕','Find'],['▦','Preferences']]) {
        const item = u.el('div', 'toolbar-item', toolbar);
        u.el('b', '', item, icon); u.el('span', '', item, label);
      }
      const body = u.el('div', 'desktop-body', shell);
      const left = u.el('aside', 'workspace-left', body);
      const tree = u.el('section', 'workspace-tree', left);
      u.el('h2', '', tree, 'Workspace');
      u.el('div', 'tree-content', tree, '▾ ▣ DeskMate\n　▸ ▰ Documents\n　　└ ▤ Notes.txt\n　　└ ▤ Plans.txt\n　　└ ▤ Budget.txt\n　▸ ▰ Projects\n　　└ ▤ App Ideas.txt\n　　└ ▤ Readme.txt\n　▸ ▰ Calendar\n　　└ ▦ Daily\n　　└ ▦ Weekly\n　▸ ▰ Utilities\n　　└ ▧ Terminal\n　　└ ▧ Calculator');
      const cal = u.el('section', 'workspace-calendar', left);
      u.el('h2', '', cal, 'Calendar - April 1988');
      u.el('div', 'calendar-content', cal, '◀　　 April 1988　　 ▶\nSun  Mon  Tue  Wed  Thu  Fri  Sat\n　　 　　 　　 　　 　　  1　 2\n 3　 4　 5　 6　 7　 8　 9\n10　11　12　13　14　15　16\n17　18　19　20　21　22　23\n24　25　26　27　28　29　30');
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const center = u.el('div', 'workspace-center', body);
      const tabs = u.el('div', 'document-tab', center, '▤　Notes.txt　×');
      const stage = u.el('main', 'desktop-stage', center);
      const terminal = u.el('section', 'workspace-terminal', center);
      u.el('h2', '', terminal, 'Terminal');
      u.el('pre', '', terminal, "Welcome to DeskMate.\nType 'help' for a list of commands.\n\n> ▋");
      const inspector = u.el('aside', 'workspace-inspector', body);
      u.el('h2', '', inspector, 'File Info');
      u.el('div', 'inspector-file', inspector, '▤　Notes.txt\n\nKind:　　 Text Document\nSize:　　 2 KB\nModified: Apr 14, 1988  9:12 AM\nCreated:　Apr 10, 1988  4:36 PM');
      u.el('div', 'inspector-attrs', inspector, 'Attributes:\n☒ Locked\n□ Read only');
      u.el('div', 'inspector-comments', inspector, 'Comments:\nGeneral notes and ideas\nfor the project.');
      u.el('div', 'inspector-related', inspector, 'Related Files:\n▤ Plans.txt\n▤ Budget.txt\n▤ App Ideas.txt\n▤ Readme.txt');
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');

      let submit = null;
      let placement = null;
      let label = 'Submit';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['footer', 'footer', 'header', 'link']);
        const values = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
        if (placement !== 'footer') label = labelOf(er.pick(values));

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(values.map(labelOf))].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
        }
        const addActions = (parent, cls) => u.el('div', 'chrome-actions ' + cls, parent);
        const makeDecoy = parent => {
          const b = u.el('button', 'chrome-xtra', parent, collide.label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
        };
        const makeEnd = (parent, cls) => {
          const tag = placement === 'link' ? 'a' : 'button';
          const b = u.el(tag, 'end-control ' + cls, parent, label);
          if (tag === 'a') {
            b.href = '#';
            b.addEventListener('click', e => e.preventDefault());
          } else b.type = 'button';
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'header') {
          const tools = addActions(header, 'header-actions');
          if (collide && collide.where === 'header') makeDecoy(tools);
          submit = makeEnd(tools, 'header-end');
        } else if (placement === 'link') {
          if (collide && collide.where === 'header') makeDecoy(addActions(header, 'header-actions'));
          const tools = addActions(footer, 'footer-actions');
          if (collide && collide.where === 'footer') makeDecoy(tools);
          submit = makeEnd(tools, 'footer-link');
        } else {
          if (collide && collide.where === 'header') makeDecoy(addActions(header, 'header-actions'));
          if (collide && collide.where === 'footer') {
            const tools = addActions(footer, 'footer-actions');
            makeDecoy(tools);
            submit = makeEnd(tools, 'footer-end');
          } else submit = makeEnd(footer, 'footer-end');
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util, named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement']
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  });
})();
