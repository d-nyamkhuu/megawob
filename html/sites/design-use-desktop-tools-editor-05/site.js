(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-05',
    'brand': 'Campus Notes',
    'mode': 'doc',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ffffff',
      'fg': '#000000',
      'accent': '#0000ee',
      'font': "'Times New Roman',Times,serif",
      'line': '#9a9a9a',
      'muted': '#444444',
      'button-fg': '#000',
    },
    'nav': 'Home|Help|Save Draft|Log Out',
    'obstruction': ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
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
      D.nav.split('|').forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('a', '', nav, t);
      });
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note task-note-' + ctx.display, body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') u.el('strong', 'task-note-title', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const rr = ctx.rng.fork('chrome/end');
        const chosen = rr.pick(['footer', 'footer', 'footer', 'header', 'link']);
        const placement = ctx.display === 'hidden' && chosen === 'header' ? 'footer' : chosen;
        const labels = ctx.content && ctx.content.END_LABELS;
        const labelValue =
          labels && labels.length
            ? rr.pick(labels)
            : rr.pick(['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']);
        const label =
          typeof labelValue === 'string'
            ? labelValue
            : labelValue.label || labelValue.text || labelValue.name || String(labelValue);
        const end =
          placement === 'link'
            ? u.el('a', 'end-control end-link', footer, label)
            : u.el('button', 'end-control end-' + placement, placement === 'header' ? note : footer, label);
        end.type = end.tagName === 'BUTTON' ? 'button' : undefined;
        if (end.tagName === 'A') end.href = '#';
        end.dataset.role = 'submit';
        end.title = label;
        end.setAttribute('aria-label', label);
        end.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = end;
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const labels = ctx.content && ctx.content.END_LABELS;
        const pool =
          labels && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const own = (submit.textContent || '').trim().toLowerCase();
        const choices = pool
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && x.trim().toLowerCase() !== own);
        if (choices.length) {
          const decoy = u.el('button', 'end-xtra', footer, collideRng.pick(choices));
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
        }
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
