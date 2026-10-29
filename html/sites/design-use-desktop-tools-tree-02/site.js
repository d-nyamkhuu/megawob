(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-02',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#285184',
      'panel': '#ccccd2',
      'fg': '#0a1038',
      'accent': '#f5da48',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
      'button-fg': '#000',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': [
      'IRIX Workspace News',
      'Be the first to know. Get news, tips and updates from the Silicon Graphics team.',
      'Close',
    ],
    'footer': '',
  };
  const bank = (content, key, fallback) =>
    content && Array.isArray(content[key]) && content[key].length ? content[key] : fallback;
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      const display = ctx.display || 'header';
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body),
        header = u.el('header', 'design-header', shell);
      const lg = u.el('div', 'design-brand', header);
      u.el('span', 'o2', lg, 'O₂');
      u.el('span', 'sg', lg, 'Silicon Graphics');
      const irix = u.el('div', 'design-nav', header);
      irix.innerHTML =
        '<svg viewBox="0 0 40 40" width="40" height="40"><g stroke="#2a2a60" stroke-width="2" fill="none"><circle cx="20" cy="20" r="6"/><path d="M20 2v8M20 30v8M2 20h8M30 20h8M7 7l6 6M27 27l6 6M33 7l-6 6M13 27l-6 6"/></g></svg><span>IRIX</span>';
      const body = u.el('div', 'design-body', shell),
        note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      if (display === 'panel') note.classList.add('instruction-panel-note');
      if (display === 'toast') note.classList.add('instruction-toast-note');
      const stage = u.el('main', 'stage', body),
        footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, '9 items  |  3 folders, 6 files');
      const er = ctx.rng.fork('chrome/end'),
        labels = bank(ctx.content, 'END_LABELS', [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ]).map(labelOf);
      const standard = labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
      const primary = er.bool(0.5),
        placement = primary ? 'footer' : er.pick(['header-icon', 'footer-link', 'footer']);
      const label = primary
        ? standard
        : er.pick(labels.filter((x) => x.trim().toLowerCase() !== standard.trim().toLowerCase()));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      const logDecoy = (button, text, isCollision) => {
        button.type = 'button';
        button.dataset.role = 'xtra';
        button.addEventListener('click', () =>
          env.log('decoy', isCollision ? { label: text, collide: true } : { label: text }),
        );
      };
      let submit = null;
      const fr = u.el('span', 'footer-btns', footer);
      if (!ctx.finish) {
        if (collide) {
          const d = u.el('button', 'xtra-control', fr, collide);
          logDecoy(d, collide, true);
        }
        if (placement === 'header-icon') {
          const b = u.el('button', 'end-control header-end', header, label);
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', () => ctx.submit());
          submit = b;
        } else if (placement === 'footer-link') {
          const a = u.el('a', 'end-link', fr, label + ' ›');
          a.href = '#';
          a.title = label;
          a.setAttribute('aria-label', label);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          submit = a;
        } else {
          submit = u.el('button', 'end-control', fr, label);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        }
      }
      const quit = u.el('button', 'quit-btn', fr, 'Quit');
      quit.type = 'button';
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        named = D.obstruction,
        texts = {
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
