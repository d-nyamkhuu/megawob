(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-04',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#575757',
      'panel': '#ccccd2',
      'fg': '#000000',
      'accent': '#333333',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
      'button-fg': '#000',
    },
    'nav': 'Terminal    Edit    Settings    Help',
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
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide'),
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ];
      const standard = endR.bool(0.4),
        placement = standard ? 'footer' : endR.pick(['title', 'link', 'icon']),
        endLabel = standard ? 'Submit' : labelOf(endR.pick(labels));
      let collide = null;
      if (collideR.bool(0.3)) {
        const opts = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (opts.length) collide = { label: collideR.pick(opts), where: 'footer' };
      }
      const shell = u.el('div', 'nx-shell', document.body);
      const header = u.el('header', 'nx-menubar', shell);
      const cube = u.el('span', 'nx-cube', header);
      cube.innerHTML =
        '<svg viewBox="0 0 48 48" width="44" height="44"><path d="M7 10L31 3l11 25-25 17L5 24z" fill="#050505" stroke="#aaa"/><path d="M7 10l21 11 14 7M28 21L31 3M28 21L17 45" fill="none" stroke="#999"/><g fill="white" font-family="Arial" font-weight="bold" font-size="12" transform="rotate(-23 22 14)"><text x="9" y="14">NeXT</text><text x="10" y="24" font-size="10">NeXT</text></g></svg>';
      ['File', 'Edit', 'Format', 'Find', 'Window', 'Help'].forEach((t) => u.el('span', 'nx-mi', header, t));
      u.el('span', 'nx-clock', header, 'Mon Apr 26  10:24 AM');
      const idx = u.el('nav', 'nx-index', shell);
      for (let i = 1; i <= 20; i++) {
        const s = u.el('span', i === 1 ? 'on' : '', idx, String(i));
      }
      const win = u.el('div', 'nx-window', shell);
      const tbar = u.el('div', 'nx-title', win);
      u.el('i', 'nx-box x', tbar);
      u.el('i', 'nx-box m', tbar);
      u.el('b', '', tbar, 'Untitled — Text Editor');
      let titleEnd = null;
      if (!ctx.finish && placement === 'title') {
        tbar.classList.add('has-end');
        titleEnd = u.el('button', 'nx-end-title', tbar, endLabel);
        titleEnd.type = 'button';
        titleEnd.addEventListener('click', () => ctx.submit());
      }
      u.el('i', 'nx-box z', tbar);
      const body = u.el('div', 'nx-body', win);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'nx-footer', win);
      u.el('span', 'footer-label', footer, 'Line 1, Column 1');
      u.el('span', 'nx-zoom', footer, '100% ▾');
      let submit = titleEnd;
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'end-control', footer, endLabel);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'link') {
          submit = u.el('a', 'nx-end-link', footer, endLabel + ' ›');
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else if (placement === 'icon') {
          submit = u.el('button', 'nx-end-icon', footer, '✓');
          submit.type = 'button';
          submit.setAttribute('aria-label', endLabel);
          submit.title = endLabel;
          submit.addEventListener('click', () => ctx.submit());
        }
        if (collide) {
          const parent = collide.where === 'title' ? tbar : footer,
            d = u.el('button', 'nx-pq', parent, collide.label);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
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
