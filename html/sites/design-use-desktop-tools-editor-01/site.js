(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-01',
    'brand': 'My Notes',
    'mode': 'top',
    'tokens': {
      'bg': '#6b3f26',
      'panel': '#fff9e9',
      'fg': '#2d1a10',
      'accent': '#27722f',
      'font': 'Georgia,serif',
      'line': '#bbb8ae',
      'muted': '#5f6a78',
    },
    'nav': 'Save Draft',
    'obstruction': null,
    'footer': 'Save Draft',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'toast' && (window.innerWidth < 1260 || window.innerHeight < 700)) display = 'header';
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        if (display === 'panel') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const save = u.el('button', 'save-draft', footer);
      save.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M3 3h15l3 3v15H3z"/><path d="M7 3h9v6H7z" fill="#d9d0bd"/><rect x="7" y="13" width="10" height="8" fill="#d9d0bd"/></svg>Save Draft';
      save.addEventListener('click', () => env.log('decoy', { what: 'save draft' }));
      const er = ctx.rng.fork('chrome/end');
      const keepDefault = !ctx.finish && er.bool(0.5);
      const pickedPlacement = ctx.finish ? null : keepDefault ? 'footer' : er.pick(['footer', 'header', 'link']);
      const placement = display === 'toast' && pickedPlacement === 'header' ? 'footer' : pickedPlacement;
      document.body.classList.toggle('has-header-submit', placement === 'header');
      const label = keepDefault
        ? 'Submit'
        : ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? er.pick(ctx.content.END_LABELS)
          : er.pick(['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete']);
      const endWord = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'footer-link' ? 'a' : 'button', cls, parent, text);
        b.type = cls === 'footer-link' ? undefined : 'button';
        if (cls === 'footer-link') b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      if (cr.bool(0.3)) {
        const choices = [...new Set(labels.map(endWord))].filter(
          (x) => x.trim().toLowerCase() !== endWord(label).trim().toLowerCase(),
        );
        if (choices.length) collide = cr.pick(choices);
      }
      if (placement === 'footer') submit = makeEnd(footer, 'end-control', endWord(label));
      else if (placement === 'header') submit = makeEnd(shell, 'end-control header-end', endWord(label));
      else submit = makeEnd(footer, 'end-control footer-link', endWord(label));
      if (collide) {
        const parent = footer;
        const b = u.el('button', 'pqs-xtra', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
