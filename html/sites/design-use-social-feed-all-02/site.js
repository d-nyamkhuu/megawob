(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-all-02',
    'brand': '01   Follow the Instructions',
    'mode': 'index',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ffffff',
      'fg': '#101010',
      'accent': '#ee262b',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'S O C I A L',
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
      const index = u.el('nav', 'task-index', document.body);
      for (let i = 1; i <= 10; i++) u.el('span', i === 1 ? 'on' : '', index, String(i).padStart(2, '0'));
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'hd-num', header, '01');
      const hm = u.el('div', 'hd-mid', header);
      u.el('div', 'hd-kick', hm, 'SOCIAL');
      u.el('div', 'hd-title', hm, 'Follow the Instructions');
      const task = u.el('div', 'hd-task', header, 'TASK 1 OF 10');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      if (!ctx.finish) {
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
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const base = labels.map(labelOf).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
        let place, label;
        if (er.bool(0.5)) {
          place = 'footer';
          label = base;
        } else {
          place = er.pick(['footer', 'header', 'link']);
          const other = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== base.trim().toLowerCase());
          label = other.length ? labelOf(er.pick(other)) : base;
        }
        const button = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
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
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collide = labelOf(cr.pick(pool));
        }
        if (place === 'header') {
          task.textContent = 'TASK 1 OF 10';
          submit = button(task, 'end-control header-end', label);
        } else if (place === 'link') {
          submit = button(footer, 'end-link', label + ' ›');
        } else submit = button(footer, 'end-control', label);
        if (collide) {
          const parent = place === 'header' ? task : footer;
          const d = u.el('button', 'end-xtra', parent, collide);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
