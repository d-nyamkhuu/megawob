(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-files-04', brand: 'Tracker', mode: 'side-left',
    tokens: { bg: '#1c5b91', panel: '#d0d0d0', fg: '#111', accent: '#ffc900', font: 'Arial,sans-serif', line: '#888', muted: '#555', 'button-fg': '#111' },
    nav: 'File    Edit    View    Go    Window    Help',
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
      const brand = u.el('div', 'design-brand', header);
      u.el('span', 'tracker-folder', brand);
      u.el('span', '', brand, D.brand);
      u.el('div', 'window-controls', header, '－　□　×');
      u.el('nav', 'design-nav', shell, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      u.el('h2', '', note, 'Files and Folders');
      u.el('p', '', note, 'Use Tracker to manage the files and folders on your system.');
      u.el('hr', '', note);
      const hints = [
        ['', 'Double-click a folder to open it.'], ['', 'Double-click a file to open it in its default application.'],
        ['', 'Click the triangle to show or hide a folder’s contents.'], ['', 'Right-click for more options.'],
        ['', 'Use the arrow keys to navigate. Press Return to open.']
      ];
      for (const [icon, copy] of hints) { const row = u.el('div', 'help-row', note); u.el('span', 'help-icon', row, icon); u.el('span', '', row, copy); }
      if (ctx.display === 'panel') { const p = u.el('div', 'task-instruction panel-instruction', note); p.dataset.role = 'instruction'; u.el('b', '', p, 'Your Task'); u.el('span', '', p, ctx.instruction); }
      if (ctx.display === 'header') { const p = u.el('div', 'task-instruction header-instruction', header, ctx.instruction); p.dataset.role = 'instruction'; }
      if (ctx.display === 'toast') { const p = u.el('div', 'task-instruction toast-instruction', shell, ctx.instruction); p.dataset.role = 'instruction'; }
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || '');

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
