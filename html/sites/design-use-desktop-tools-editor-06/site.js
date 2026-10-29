(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-06',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#141517',
      'panel': '#25282c',
      'fg': '#e8eaed',
      'accent': '#5aa0ff',
      'font': "'Segoe UI',Arial,sans-serif",
      'line': '#3a3e44',
      'muted': '#a4a9b0',
      'button-fg': '#fff',
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
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const ic = u.el('span', 'tb-icon', header);
      u.el('span', 'tb-title', header, 'Untitled Document - Text Editor');
      const wc = u.el('span', 'tb-win', header);
      u.el('i', 'min', wc);
      u.el('i', 'max', wc);
      u.el('i', 'cls', wc, '✕');
      const body = u.el('div', 'design-body', shell);
      const left = u.el('div', 'ed-left', body);
      const menu = u.el('nav', 'ed-menu', left);
      for (const m of ['File', 'Edit', 'Format', 'View', 'Help']) u.el('span', '', menu, m);
      const stage = u.el('main', 'stage', left);
      const aside = u.el('aside', 'ed-aside', body);
      u.el('h2', 'ed-task-h', aside, 'Task');
      const note = u.el('section', 'task-note', aside);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true; // New episode choices have independent streams; the widget RNG is unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'aside' : er.pick(['toolbar', 'footer']);
      const label = referenceEnd ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        const decoyLabel = cr.pick(options);
        const decoy = u.el('button', 'chrome-xtra', menu, decoyLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control end-' + placement, placement === 'toolbar' ? menu : aside, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, 'Ln 4, Col 1');
      u.el('span', 'footer-cell', footer, 'UTF-8');
      u.el('span', 'footer-cell', footer, 'Plain Text');
      if (submit && placement === 'footer') footer.append(submit);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const focused = document.activeElement;
      const dismissOverlay = () => {
        ctx.dismiss();
        if (focused && focused.isConnected && focused !== document.body) focused.focus({ preventScroll: true });
      };
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
        accept.addEventListener('click', dismissOverlay);
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
      dismiss.addEventListener('click', dismissOverlay);
      return { el, dismiss };
    },
  });
})();
