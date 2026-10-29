(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-all-12',
    'brand': 'SocialFlow',
    'mode': 'top',
    'tokens': {
      'bg': '#f3f4f5',
      'panel': '#ffffff',
      'fg': '#1e2938',
      'accent': '#337ab7',
      'font': 'Arial,sans-serif',
      'line': '#bebebe',
      'muted': '#5e6779',
    },
    'nav': 'Inbox    Publish    Analytics    Settings    Help    Sign out',
    'obstruction': [
      'Layout could not be restored',
      'Your previous layout could not be restored. Some panels may be out of place. Click Use default layout to continue using the workspace.',
      'Use default layout',
    ],
    'footer': 'Ready',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'Social');
      header.firstChild.append(
        (() => {
          const s = document.createElement('span');
          s.textContent = 'Flow';
          return s;
        })(),
      );
      const nv = u.el('nav', 'design-nav', header);
      ['Inbox', 'Publish', 'Analytics', 'Settings'].forEach((t, i) =>
        u.el('span', 'nv' + (i === 0 ? ' on' : ''), nv, t),
      );
      const ut = u.el('div', 'design-util', header);
      u.el('span', 'nv help', ut, 'Help');
      u.el('span', 'nv', ut, 'Sign out');
      const sub = u.el('div', 'design-sub', shell);
      const mt = u.el('b', '', sub, 'Mentions');
      u.el('span', 'mbadge', sub, '5');
      ['All', 'Unread', 'Flagged'].forEach((t) => u.el('span', 'sf', sub, t));
      const sq = u.el('div', 'sq', sub);
      u.el('span', '', sq, 'Search posts...');
      sq.insertAdjacentHTML(
        'beforeend',
        '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#555" stroke-width="2"/><path d="M12 12l6 6" stroke="#555" stroke-width="2"/></svg>',
      );
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, '0 of 5 selected'); // Episode choices have independent streams; existing widget draws are unchanged.
      const endR = ctx.rng.fork('chrome/end');
      const referenceEnd = endR.bool(0.5);
      const placement = referenceEnd ? 'footer' : endR.pick(['header', 'link', 'footer']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const label = referenceEnd ? 'Submit' : endR.pick(endLabels);
      const decoyBtn = (parent, text, collide = false) => {
        const b = u.el('button', 'ghost' + (collide ? ' end-xtra' : ''), parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      const fb = u.el('span', 'foot-btns', footer);
      decoyBtn(fb, 'Mark as read');
      decoyBtn(fb, 'Flag');
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const choices = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) decoyBtn(fb, collideR.pick(choices), true);
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? sub : footer;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'end-control end-' + placement, parent, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
      const h2 = u.el('h2', '', el);
      h2.insertAdjacentHTML(
        'beforeend',
        '<svg viewBox="0 0 48 44" width="46" height="42"><path d="M24 3L46 41H2Z" fill="#f5b21a" stroke="#e29a0a" stroke-width="3" stroke-linejoin="round"/><rect x="21.5" y="15" width="5" height="14" rx="2" fill="#fff"/><circle cx="24" cy="34" r="3" fill="#fff"/></svg>',
      );
      h2.append(title);
      const cp = u.el('div', 'overlay-copy', el);
      if (named && copy === named[1]) {
        const i = copy.indexOf('Click ');
        u.el('p', '', cp, copy.slice(0, i).trim() || copy);
        const p2 = u.el('p', '', cp);
        p2.append('Click ');
        u.el('b', '', p2, label);
        p2.append(' to continue using the workspace.');
      } else cp.textContent = copy;
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
      if (named && copy === named[1] && ctx.kind !== 'cookie') {
        const nn = u.el('button', '', actions, 'Not now');
        nn.type = 'button';
        nn.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
