(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-08',
    'brand': 'Text Editor',
    'mode': 'bottom',
    'tokens': {
      'bg': '#f1f1ef',
      'panel': '#f1f1ef',
      'fg': '#000',
      'accent': '#000',
      'font': '"Times New Roman",serif',
      'line': '#999',
      'muted': '#444',
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
      let display = ctx.display;
      if ((display === 'panel' || display === 'toast') && window.innerHeight < 600) display = 'header';
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML =
        '<svg viewBox="0 0 22 26" fill="none" stroke="#000" stroke-width="1.6"><path d="M3 1.5h11l5 5v18H3z"/><path d="M14 1.5v5h5M7 12h8M7 16h8M7 20h8" stroke-width="1.2"/></svg>';
      u.el('span', '', brand, D.brand);
      u.el('div', 'win-ctl', header).innerHTML = '<span></span><span></span><span></span>';
      const menu = u.el('nav', 'design-menu', shell);
      for (const m of ['File', 'Edit', 'Format', 'View', 'Help']) u.el('span', '', menu, m);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      note.dataset.mode = display;
      if (display !== 'hidden') {
        if (display === 'panel') u.el('strong', 'task-note-label', note, 'Task note');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const reset = u.el('button', 'foot-btn', footer, 'Reset');
      reset.type = 'button';
      u.el('span', 'sp', footer);
      const cancel = u.el('button', 'foot-btn', footer, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const er = ctx.rng.fork('chrome/end');
      const common = !ctx.finish && er.bool(0.52);
      const placement = ctx.finish ? null : common ? 'footer' : er.pick(['toolbar', 'link']);
      const label = common ? 'Submit' : er.pick(labels);
      const endBtn = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const cr = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (pool.length) collision = { label: cr.pick(pool), where: cr.pick(['toolbar', 'footer']) };
      }
      if (collision && collision.where === 'toolbar') decoy(menu, collision.label);
      if (placement === 'toolbar') submit = endBtn(menu, 'toolbar-end', label);
      if (placement === 'footer') submit = endBtn(footer, 'end-control', label);
      if (placement === 'link') submit = endBtn(footer, 'end-link', label, 'a');
      if (collision && collision.where === 'footer') decoy(footer, collision.label);
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
