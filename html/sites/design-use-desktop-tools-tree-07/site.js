(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-07',
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
      'World Explorer Updates',
      'Be the first to know. Get news, tips and updates for World Explorer.',
      'Close',
    ],
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
      u.el('div', 'cd-globe', header);
      u.el('div', 'design-brand', header, 'World Explorer');
      u.el('div', 'design-nav', header, 'CD-ROM COMPANION');
      const body = u.el('div', 'design-body', shell);
      const art = u.el('div', 'cd-art', shell);
      u.el('div', 'cd-sky', art);
      const tag = u.el('div', 'cd-tag', art);
      u.el('span', '', tag, 'Explore');
      u.el('span', '', tag, 'Learn');
      u.el('span', '', tag, 'Discover');
      const right = u.el('div', 'cd-right', shell);
      u.el('h2', 'cd-h', right, 'Activity');
      const actions = u.el('div', 'chrome-actions', right);
      const endRng = ctx.rng.fork('chrome/end'),
        collisionRng = ctx.rng.fork('chrome/collide');
      const labels = ctx.content.END_LABELS || [
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
      const labelText = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const baseline = endRng.bool(0.5);
      const label = baseline
        ? 'Submit'
        : labelText(endRng.pick(labels.filter((x) => labelText(x).trim().toLowerCase() !== 'submit')));
      const placement = baseline ? 'footer' : endRng.pick(['side', 'link']);
      let collide = null;
      if (collisionRng.bool(0.3)) {
        const candidates = [
          ...new Set(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (candidates.length) collide = collisionRng.pick(candidates);
      }
      let submit = null;
      const addEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish && placement === 'side') submit = addEnd(actions, 'end-control end-side', label);
      if (collide) {
        const d = u.el('button', 'chrome-xtra', actions, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const act = u.el('div', 'cd-activity', right);
      u.el('p', '', act, 'Ready.');
      u.el('p', '', act, 'Open folders to locate the file, then click it.');
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display === 'header') {
        u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        const extra = u.el(
          'section',
          'episode-note ' + (ctx.display === 'panel' ? 'episode-panel' : 'episode-toast'),
          right,
        );
        extra.dataset.role = 'instruction';
        u.el('h3', '', extra, ctx.display === 'panel' ? 'Your Task' : 'Task notification');
        u.el('p', '', extra, ctx.instruction);
      }
      const stage = u.el('main', 'stage', body),
        footer = u.el('footer', 'design-footer', right);
      if (!ctx.finish) {
        if (placement === 'footer') submit = addEnd(footer, 'end-control', label);
        else if (placement === 'link') {
          submit = u.el('a', 'end-link', footer, label + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
      } else u.el('div', 'finish-mark', footer, 'World Explorer • Ready');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        named = D.obstruction;
      const texts = {
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
