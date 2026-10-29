(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-move-01',
    brand: 'Workspace',
    mode: 'vista',
    tokens: {
      bg: '#2584bd',
      panel: '#fff',
      fg: '#111',
      accent: '#2679b9',
      font: '"Segoe UI",Tahoma,Arial,sans-serif',
      line: '#a7bfd1',
      muted: '#61718d',
      'button-fg': '#001f60',
    },
    nav: 'File     Edit     View     Tools     Help',
    obstruction: ['Workspace update', 'Your workspace is ready to use.', 'Close'],
    footer: 'Files        Editor        Calendar        Command Line        Preferences',
  };
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
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const dock = u.el('span', 'footer-label', footer);
      dock.innerHTML =
        '<span class="dock-item active"><i class="dock-icon files"><svg viewBox="0 0 48 48"><path d="M5 10h15l5 5h18v25H5z" fill="#f4cc48" stroke="#b68818"/><path d="M9 17h30v20H9z" fill="#d9ecfa" stroke="#6a9fc1"/><path d="M14 21h19v18H14z" fill="#f7fbff" stroke="#91b3c7"/></svg></i><b>Files</b></span><span class="dock-item"><i class="dock-icon editor"><svg viewBox="0 0 48 48"><path d="M8 14h29v28H8z" fill="#faf7e8" stroke="#8a7d5a"/><path d="M13 9h27v29" fill="#d9eafa" stroke="#6d91ab"/><path d="M14 21h18M14 27h18M14 33h13" stroke="#7e91a1"/></svg></i><b>Editor</b></span><span class="dock-item"><i class="dock-icon calendar"><svg viewBox="0 0 48 48"><rect x="7" y="8" width="34" height="34" rx="3" fill="#f8fbff" stroke="#557d9c"/><path d="M7 15h34" stroke="#477da3" stroke-width="5"/><path d="M15 5v8M33 5v8" stroke="#315d7e" stroke-width="3"/><path d="M14 22h5v5h-5zm9 0h5v5h-5zm9 0h5v5h-5zm-18 9h5v5h-5zm9 0h5v5h-5z" fill="#8db4d0"/></svg></i><b>Calendar</b></span><span class="dock-item"><i class="dock-icon terminal"><svg viewBox="0 0 48 48"><rect x="5" y="7" width="38" height="34" rx="3" fill="#202a34" stroke="#8da9bb" stroke-width="3"/><path d="m12 17 7 6-7 6m12 2h11" fill="none" stroke="#e3eff6" stroke-width="3"/><path d="M9 10h30" stroke="#7db4d4" stroke-width="2"/></svg></i><b>Command Line</b></span><span class="dock-item"><i class="dock-icon preferences"><svg viewBox="0 0 48 48"><path d="m24 4 4 3 5-1 2 5 5 2-1 5 4 4-3 5 1 5-5 2-2 5-5-1-5 4-4-4-5 1-2-5-5-2 1-5-4-4 3-5-1-5 5-2 2-5 5 1z" fill="#d7e5ef" stroke="#66859b" stroke-width="2"/><circle cx="24" cy="24" r="8" fill="#f5f9fc" stroke="#66859b" stroke-width="3"/></svg></i><b>Preferences</b></span>';

      let submit = null;
      let placement = null;
      let label = 'Submit';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['footer', 'footer', 'header', 'link']);
        const values =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        if (placement !== 'footer') label = labelOf(er.pick(values));

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(values.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
        }
        const addActions = (parent, cls) => u.el('div', 'chrome-actions ' + cls, parent);
        const makeDecoy = (parent) => {
          const b = u.el('button', 'chrome-xtra', parent, collide.label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
        };
        const makeEnd = (parent, cls) => {
          const tag = placement === 'link' ? 'a' : 'button';
          const b = u.el(tag, 'end-control ' + cls, parent, label);
          if (tag === 'a') {
            b.href = '#';
            b.addEventListener('click', (e) => e.preventDefault());
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
      const u = ctx.util,
        named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
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
    },
  });
})();
