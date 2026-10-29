(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-calendar-07',
    'brand': 'CalDesk',
    'mode': 'dock',
    'tokens': {
      'bg': '#271e3a',
      'panel': '#271e3a',
      'fg': '#f1edf8',
      'accent': '#fa6272',
      'font': "'Segoe UI Variable','Segoe UI',Inter,Arial,sans-serif",
      'line': '#3d3354',
      'muted': '#a89fbd',
      'button-fg': '#1d1020',
    },
    'nav': 'File    Edit    View    Help',
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
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      document.body.dataset.display = ctx.display;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const lg = u.el('span', 'design-logo', header);
      lg.innerHTML =
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M12 12v5M9.5 14.5h5"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      const nav = u.el('nav', 'design-nav', header);
      for (const t of D.nav.split(/\s{2,}/)) u.el('span', '', nav, t);
      const wc = u.el('span', 'win-ctl', header);
      wc.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 8h10"/></svg><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3.5" y="5" width="7.5" height="7.5"/><path d="M5.5 5V3.5h7V10.5H11"/></svg><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      let placement = 'dock',
        label = 'Submit';
      if (!ctx.finish && !endRng.bool(0.5)) {
        placement = endRng.pick(['header', 'hint']);
        const labels =
          Array.isArray(ctx.content && ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
        label = endRng.pick(labels);
        if (typeof label !== 'string') label = label.label || label.text || label.name || String(label);
      }
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', 'end-control ' + cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish)
        submit = endBtn(
          placement === 'header' ? header : footer,
          placement === 'header' ? 'header-end' : placement === 'hint' ? 'hint-end' : '',
          label,
        );
      if (!ctx.finish && collideRng.bool(0.3)) {
        const bank =
          Array.isArray(ctx.content && ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
        const same = (x) =>
          (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)).trim().toLowerCase() ===
          label.trim().toLowerCase();
        const choices = bank.filter((x) => !same(x));
        if (choices.length) {
          const raw = collideRng.pick(choices),
            word = typeof raw === 'string' ? raw : raw.label || raw.text || raw.name || String(raw),
            parent = collideRng.pick([header, footer]),
            b = u.el('button', 'chrome-xtra', parent, word);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: word, collide: true }));
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
