(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-prefs-04', brand: 'MyWorkspace', mode: 'desktop',
    tokens: { bg: '#ffffff', panel: '#ffffff', fg: '#151521', accent: '#0095ff', font: 'Arial, "Helvetica Neue", sans-serif', line: '#cdd1d6', muted: '#8d929b', 'button-fg': '#151521' },
    nav: '▣  Files       ▤  Editor       ◉  Tasks       ▦  Calendar       ▰  Terminal',
    obstruction: null, footer: ''
  };
  env.site({
    name: D.site, styles: ['site.css', 'yosemite.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util, root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const titlebar = u.el('div', 'desktop-titlebar', header);
      u.el('span', 'window-dots', titlebar, '●  ●  ●');
      const title = u.el('div', 'design-brand', titlebar, D.brand + '  ▾');
      title.title = 'Workspace menu';
      title.addEventListener('click', () => document.querySelector('.at-appmenu')?.click());
      const toolbar = u.el('div', 'desktop-toolbar', header);
      const nav = u.el('nav', 'design-nav', toolbar);
      for (const [icon, label] of [['▰','Files'],['✎','Editor'],['◉','Tasks'],['▦','Calendar'],['▣','Terminal']]) {
        const tab = u.el('div', 'desktop-tab', nav);
        u.el('span', 'desktop-tab-icon', tab, icon);
        u.el('span', '', tab, label);
      }
      const search = u.el('div', 'desktop-search', toolbar, '⌕　Search');
      const gear = u.el('button', 'desktop-gear', toolbar, '⚙');
      gear.type = 'button';
      gear.title = 'Settings';
      gear.addEventListener('click', () => document.querySelector('.at-rail .end')?.click());
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
          const tools = addActions(toolbar, 'header-actions');
          if (collide && collide.where === 'header') makeDecoy(tools);
          submit = makeEnd(tools, 'header-end');
        } else if (placement === 'link') {
          if (collide && collide.where === 'header') makeDecoy(addActions(toolbar, 'header-actions'));
          const tools = addActions(footer, 'footer-actions');
          if (collide && collide.where === 'footer') makeDecoy(tools);
          submit = makeEnd(tools, 'footer-link');
        } else {
          if (collide && collide.where === 'header') makeDecoy(addActions(toolbar, 'header-actions'));
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
