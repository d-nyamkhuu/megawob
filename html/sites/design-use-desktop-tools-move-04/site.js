(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-move-04',
    tokens: { bg: '#a9abab', panel: '#c8c8c8', fg: '#111', accent: '#51c5cf', font: '"DejaVu Sans Mono", "Liberation Mono", monospace', line: '#858585', muted: '#333', 'button-fg': '#111' }
  };
  env.site({
    name: D.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util, root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      let display = ctx.display;
      if (document.documentElement.clientWidth < 1180 && (display === 'panel' || display === 'toast')) display = 'header';
      document.body.className = 'instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const heading = u.el('div', 'window-heading', header);
      u.el('span', 'design-brand', heading, 'Workplace Shell - Documents');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', display === 'header' ? heading : body);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      footer.hidden = true;

      let submit = null;
      let placement = null;
      let label = 'Submit';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['header', 'header', 'header', 'header', 'footer', 'link', 'icon']);
        const values = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
        const sampledLabel = labelOf(er.pick(values));
        label = placement === 'header' ? 'Confirm' : placement === 'icon' ? 'Save and exit' : sampledLabel;

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(values.map(labelOf))].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
          if (collide && cr.bool(0.5)) collide.label = 'Submit answer';
        }
        const addActions = (parent, cls) => u.el('div', 'chrome-actions ' + cls, parent);
        const makeDecoy = parent => {
          const b = u.el('button', 'chrome-xtra', parent, collide.label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
        };
        const makeEnd = (parent, cls) => {
          const tag = placement === 'link' ? 'a' : 'button';
          const b = u.el(tag, 'end-control ' + cls, parent, placement === 'icon' ? '✓' : label);
          b.title = label;
          b.setAttribute('aria-label', label);
          b.dataset.role = 'submit';
          if (tag === 'a') {
            b.href = '#';
            b.addEventListener('click', e => e.preventDefault());
          } else b.type = 'button';
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'header' || placement === 'icon') {
          const tools = addActions(header, 'header-actions');
          if (collide) makeDecoy(tools);
          submit = makeEnd(tools, placement === 'icon' ? 'header-end icon-end' : 'header-end');
        } else {
          footer.hidden = false;
          const tools = addActions(footer, 'footer-actions');
          if (collide) makeDecoy(tools);
          submit = makeEnd(tools, placement === 'link' ? 'footer-link' : 'footer-end');
        }
      }
      const controls = u.el('div', 'window-controls', header);
      controls.setAttribute('aria-hidden', 'true');
      u.el('span', 'window-minimize', controls);
      u.el('span', 'window-maximize', controls);
      u.el('span', 'window-close', controls);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['Cookies', 'We use cookies to improve your experience. By continuing to use this site, you agree to our privacy policy.', 'Dismiss'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Need help?', 'Hi! How can we help you today?', 'Close'],
        promo: ['Stay in the loop', 'Get the latest updates, product news and more.', 'Not now'],
        banner: ['New version available!', 'Update now to get the latest features and improvements.', 'Dismiss announcement']
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'chat' || ctx.kind === 'promo') {
        const pictogram = u.el('div', 'overlay-pictogram', el);
        pictogram.innerHTML = ctx.kind === 'chat'
          ? '<svg viewBox="0 0 60 52"><path d="M6 29C-5 5 31-5 50 9c18 15-1 34-25 31L8 49l4-15z" fill="#fff" stroke="#111" stroke-width="2"/><circle cx="18" cy="23" r="3"/><circle cx="29" cy="23" r="3"/><circle cx="40" cy="23" r="3"/></svg>'
          : '<svg viewBox="0 0 60 45"><rect x="3" y="5" width="54" height="36" rx="2" fill="#fff" stroke="#111" stroke-width="3"/><path d="M4 7l26 20L56 7M4 39l16-17m20 0l16 17" fill="none" stroke="#111" stroke-width="2"/></svg>';
        const field = u.el('input', 'overlay-field', actions);
        field.type = 'text';
        field.placeholder = ctx.kind === 'chat' ? 'Type a message…' : 'Your email address';
        field.setAttribute('aria-label', ctx.kind === 'chat' ? 'Message' : 'Email address');
        const decoy = u.el('button', '', actions, ctx.kind === 'chat' ? 'Send' : 'Subscribe');
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent }));
      }
      let dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      if (ctx.kind === 'chat' || ctx.kind === 'promo' || ctx.kind === 'banner') {
        const close = u.el('button', 'overlay-close', el, '×');
        close.type = 'button'; close.title = 'Close'; close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss());
        if (ctx.kind === 'chat' || ctx.kind === 'banner') { dismiss.hidden = true; dismiss = close; }
      }
      const shell = document.querySelector('.site-shell');
      const header = document.querySelector('.design-header');
      const footer = document.querySelector('.design-footer');
      if (shell && header) {
        const box = shell.getBoundingClientRect();
        const bottom = footer && !footer.hidden ? footer.getBoundingClientRect().top : box.bottom;
        if (ctx.kind === 'cookie' || ctx.kind === 'banner') {
          el.style.left = `${box.left + 8}px`;
          el.style.width = `${box.width - 16}px`;
        }
        if (ctx.kind === 'cookie' || ctx.kind === 'chat') el.style.bottom = `${document.documentElement.clientHeight - bottom + 8}px`;
        if (ctx.kind === 'chat') el.style.right = `${document.documentElement.clientWidth - box.right + 8}px`;
        if (ctx.kind === 'banner') el.style.top = `${header.getBoundingClientRect().bottom + 2}px`;
      }
      return { el, dismiss };
    }
  });
})();
