(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-files-03',
    brand: '📁  Workspace',
    mode: 'plain-files',
    tokens: {
      bg: '#fff',
      panel: '#fff',
      fg: '#000',
      accent: '#0755c7',
      font: '"Times New Roman",Times,serif',
      line: '#111',
      muted: '#444',
      'button-fg': '#000',
    },
    nav: 'File     Edit     View     Go     Tools     Help',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
    footer: '',
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
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML =
        '<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M1 3h8l2 3h12v13H1z"/></svg><span>Workspace</span>';
      const winControls = u.el('div', 'window-controls', header);
      for (const mark of ['−', '□', '×']) u.el('span', '', winControls, mark);
      u.el('nav', 'design-nav', header, D.nav);
      const toolbar = u.el('div', 'file-toolbar', shell);
      const icons = [
        '<path d="M3 6h6l2 2h10v10H3z"/><path d="M8 11v5m-3-3h6"/>',
        '<path d="M7 3h9l4 4v14H7z"/><path d="M16 3v5h4M4 7v14h12"/>',
        '<path d="m5 4 14 16M19 4 5 20"/>',
        '<path d="M6 3h10l4 4v14H6z"/><path d="M16 3v5h4M9 12h8m-8 3h8"/>',
        '<path d="M5 5h14v14H5z"/><path d="m8 8 8 8m0-8-8 8"/>',
        '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6"/>',
        '<path d="M4 5h16M4 12h16M4 19h16"/><path d="M8 3v4m8-4v4m-8 3v4m8-4v4m-8 3v4m8-4v4"/>',
      ];
      for (const [i, label] of ['New Folder', 'Copy', 'Cut', 'Paste', 'Delete', 'Find', 'Views'].entries()) {
        const b = u.el('button', 'file-tool', toolbar);
        const icon = u.el('span', 'file-tool-icon', b);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[i]}</svg>`;
        u.el('span', '', b, label);
      }
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');

      let submit = null;
      let placement = null;
      let label = 'Submit';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['header', 'header', 'header', 'footer', 'link']);
        const values =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        if (placement !== 'footer') {
          const confirms = values.filter((x) => labelOf(x).toLowerCase() === 'confirm');
          label = labelOf(er.pick(confirms.length ? [...values, ...confirms, ...confirms] : values));
        }

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
