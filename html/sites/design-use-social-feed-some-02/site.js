(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-some-02',
    'brand': 'SocialNow',
    'mode': 'side-right',
    'tokens': {
      'bg': '#f0f1f3',
      'panel': '#ffffff',
      'fg': '#172235',
      'accent': '#3584e4',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'For You    Following    Discover',
    'obstruction': null,
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
      const topbar = u.el('div', 'gn-top', shell);
      u.el('span', '', topbar, 'Activities');
      u.el('span', 'gn-app', topbar, D.brand);
      u.el('span', 'gn-clock', topbar, 'Mon Apr 28  10:14 AM');
      const tray = u.el('span', 'gn-tray', topbar);
      tray.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="3"/><path d="M7 9h10M7 15h10M8 6l8 12"/></svg><svg viewBox="0 0 24 24"><path d="M3 8q9-8 18 0M6 12q6-6 12 0M9 16q3-3 6 0"/><circle cx="12" cy="20" r="1"/></svg><svg viewBox="0 0 24 24"><path d="M4 9h4l5-5v16l-5-5H4zM16 8q5 4 0 8M19 5q7 7 0 14"/></svg><svg viewBox="0 0 24 24"><rect x="7" y="5" width="10" height="16" rx="1"/><path d="M10 5V2h4v3M12 9v8"/></svg>';
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('div', 'gn-logo', header);
      u.el('div', 'design-brand', header, D.brand);
      const sb = u.el('div', 'gn-search', header);
      sb.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><span>Search posts, people, or topics...</span>';
      const wc = u.el('div', 'gn-wc', header);
      u.el('span', '', wc, '–');
      u.el('span', '', wc, '□');
      u.el('span', '', wc, '✕');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      shell.dataset.endPlacement = ctx.finish ? 'none' : placement;
      const tools = u.el('div', 'gn-end-tools', header);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control end-' + placement, placement === 'header' ? tools : footer, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool);
          const decoy = u.el('button', 'gn-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      footer.hidden = ctx.finish || placement === 'header';
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
