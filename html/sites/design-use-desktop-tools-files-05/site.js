(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-files-05', brand: 'WorkSpace', mode: 'dock',
    tokens: { bg: '#0b1018', panel: '#121a24', fg: '#e6ebf2', accent: '#6fdc6f', font: 'Inter,"Segoe UI",Arial,sans-serif', line: '#243040', muted: '#8d99a8', 'button-fg': '#06210b' },
    nav: 'Terminal    Edit    Settings    Help',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'], footer: ''
  };
  const parts = {
    frame: (base, S) => function (ctx) {
      const u = ctx.util, root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const NAVS = ['Files', 'Terminal', 'Notes', 'Calendar', 'Preferences'];
      const ICO = {
        Files: '<svg viewBox="0 0 24 24"><path d="M2 5h7l2 2h11v12H2z" fill="#6fdc6f"/></svg>',
        Terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6l6 6-6 6M12 19h8"/></svg>',
        Notes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h8l4 4v14H6zM9 12h6M9 16h6"/></svg>',
        Calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>',
        Preferences: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="m9 2-1 3-3-1-2 3 2 2-1 3-2 1 1 4 3 0 2 2 0 3 4 1 1-3 3-1 2 1 3-3-2-2 1-3 2-1-1-4-3 0-2-2 0-3z"/><circle cx="12" cy="12" r="3.5"/></svg>'
      };
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML = '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="8" height="8" rx="2" fill="#d1e3e9"/><rect x="14" y="2" width="8" height="8" rx="2" fill="#477f43" stroke="#86dd79"/><rect x="2" y="14" width="8" height="8" rx="2" fill="#7ce778"/><rect x="14" y="14" width="8" height="8" rx="3" fill="#223c29" stroke="#64b95d"/></svg><span>WorkSpace</span>';
      const body = u.el('div', 'design-body', shell);
      const side = u.el('nav', 'side-nav', body);
      NAVS.forEach(n => { const a = u.el('div', 'side-item' + (n === 'Files' ? ' on' : ''), side); a.innerHTML = ICO[n] + '<span>' + n + '</span>'; });
      const note = u.el('section', 'task-note', ctx.display === 'panel' ? side : header);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') u.el('h2', '', note, 'Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const dock = u.el('div', 'dock', footer);
      NAVS.forEach(n => { const a = u.el('div', 'dock-item', dock); a.innerHTML = ICO[n] + '<span>' + n + '</span>'; });

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
    overlay: (base, S) => function (ctx) {
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
  };
  env.site({ name: D.site, template: 'site/base', design: { parts } });
})();
