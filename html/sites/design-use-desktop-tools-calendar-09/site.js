(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-calendar-09',
    'brand': 'IRIX',
    'mode': 'irix',
    'tokens': {
      'bg': '#9c9eb9',
      'panel': '#a9abc4',
      'fg': '#14142a',
      'accent': '#7d74d4',
      'font': '"Arial Narrow","Helvetica Neue",Arial,sans-serif',
      'line': '#6b6d8e',
      'muted': '#34365a',
      'button-fg': '#fff',
    },
    'nav': 'File|Edit|View|Tools|Options|Help',
    'obstruction': ['IRIX Workspace', 'Dismiss this notice to return to your workspace.', 'Close'],
    'footer': '',
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
      const nav = u.el('nav', 'design-nav', header);
      for (const t of D.nav.split('|')) u.el('span', '', nav, t);
      u.el('div', 'irix-clock', header, 'Tue Apr 15  10:24 AM');
      const sgi = u.el('div', 'irix-sgi', header);
      sgi.innerHTML =
        '<svg viewBox="0 0 32 32" width="30" height="30"><g fill="none" stroke="#19192f" stroke-width="2.4" stroke-linejoin="round"><path d="M15 2L4 8l11 6zM18 2l10 6-10 6zM3 11v12l11-6zM29 11v12l-11-6zM4 26l11 5V19zM28 26l-10 5V19z"/><path d="M5 8l8 2M20 10l7-2M6 14v6M26 14v6M8 26l5 2M20 28l5-2"/></g></svg><i>Silicon Graphics</i>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        const copy = u.el('p', '', note, ctx.instruction);
        const style = getComputedStyle(note);
        const available = note.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        if (available > 0) {
          let size = parseFloat(style.fontSize);
          while (copy.getBoundingClientRect().height > available && size > 12) {
            size -= 1;
            note.style.fontSize = size + 'px';
          }
        }
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['toolbar', 'link']);
      const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      footer.dataset.endPlacement = placement;
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(placement === 'link' ? 'a' : 'button', 'end-control end-' + placement, footer, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const other = cr.pick(labels.filter((x) => x.toLowerCase() !== label.toLowerCase()));
        const decoy = u.el('button', 'chrome-xtra' + (placement === 'link' ? ' xtra-right' : ''), footer, other);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: other, collide: true }));
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
