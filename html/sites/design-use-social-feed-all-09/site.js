(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-all-09',
    'brand': 'Social Desk',
    'mode': 'bottom',
    'tokens': {
      'bg': '#f1eee0',
      'panel': '#f1eee0',
      'fg': '#111111',
      'accent': '#111111',
      'font': "Georgia,'Times New Roman',serif",
      'line': '#111111',
      'muted': '#333333',
    },
    'nav': 'File    Edit    View    Special    Help',
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
      const endRng = ctx.rng.fork('chrome/end');
      const endWords = (ctx.content && ctx.content.END_LABELS) || [
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
      const wordText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const nonSubmit = endWords.map(wordText).filter((x) => x.trim().toLowerCase() !== 'submit');
      const commonEnd = endRng.bool(0.5);
      const endLabel = commonEnd ? 'Submit' : nonSubmit.length ? endRng.pick(nonSubmit) : 'Submit';
      const placement = commonEnd ? 'bottom' : endRng.pick(['menu', 'titlebar']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collidePool = endWords
        .map(wordText)
        .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = !ctx.finish && collidePool.length && collideRng.bool(0.3) ? collideRng.pick(collidePool) : null;
      const header = u.el('header', 'design-header', shell);
      const apple = u.el('span', 'menu-apple', header);
      apple.innerHTML =
        '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#111" d="M16.5 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.15-2.8.85-3.5.85-.75 0-1.85-.8-3.05-.8-1.55 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.35 1.2 0 1.6-.75 3-.75s1.8.75 3.05.7c1.25 0 2.05-1.15 2.8-2.25.9-1.3 1.25-2.55 1.3-2.6-.05 0-2.5-.95-2.5-3.8zM14.2 5.8c.65-.8 1.1-1.9.95-3-.95.05-2.1.65-2.75 1.45-.6.7-1.1 1.8-.95 2.9 1.05.1 2.1-.5 2.75-1.35z"/></svg>';
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) {
        const b = u.el('span', 'menu-item', header, m);
        b.tabIndex = 0;
        b.addEventListener('click', () => {
          env.log('decoy', { what: m });
          if (m === 'Edit') header.classList.toggle('edit-open');
        });
        b.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') b.click();
        });
      }
      const makeEnd = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide) {
        const d = u.el('button', 'end-xtra', header, collide);
        d.type = 'button';
        d.setAttribute('aria-label', collide);
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish && placement === 'menu') var menuSubmit = makeEnd(header, 'end-menu');
      const clockIcon = u.el('span', 'menu-clock-icon', header);
      clockIcon.innerHTML =
        '<svg viewBox="1296 7 34 27"><image href="sites/design-use-social-feed-all-09/assets/lisa-details.webp" width="1672" height="941"/></svg>';
      u.el('span', 'menu-clock', header, 'Mon Apr 16, 1984    9:27 AM');
      const win = u.el('div', 'lisa-window', shell);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'tb-box', tb);
      u.el('span', 'tb-lines', tb);
      u.el('span', 'tb-title', tb, D.brand);
      if (!ctx.finish && placement === 'titlebar') var titleSubmit = makeEnd(tb, 'end-titlebar');
      u.el('span', 'tb-lines', tb);
      u.el('span', 'tb-box zoom', tb);
      const body = u.el('div', 'design-body', win);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      const nh = u.el('h2', '', note);
      nh.innerHTML =
        '<svg viewBox="49 116 43 51"><image href="sites/design-use-social-feed-all-09/assets/lisa-details.webp" width="1672" height="941"/></svg><span>Task Briefing</span>';
      if (ctx.display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      u.el('div', 'brief-rule', note);
      u.el(
        'div',
        'brief-copy',
        note,
        'Scan the posts on the right. ' +
          ctx.instruction +
          ' Ignore posts that do not match.',
      );
      const stage = u.el('main', 'stage', body);
      const lower = u.el('section', 'office-lower', win);
      const tools = u.el('div', 'tool-strip', lower);
      const icons = {
        write:
          '<svg viewBox="0 0 48 52" width="54" height="58" fill="none" stroke="#111" stroke-width="3"><path d="M6 4h26l6 6v36H6z"/><path d="M12 16h18M12 24h18M12 32h10"/><path d="M26 42l16-18 5 5-16 18-8 2z" fill="#f1eee0"/></svg>',
        reply:
          '<svg viewBox="0 0 48 44" width="58" height="52"><path fill="#9a9a94" d="M20 2L2 20l18 16V26c12 0 20 4 26 16-2-16-10-26-26-28z"/></svg>',
        trash:
          '<svg viewBox="0 0 48 56" width="52" height="60" fill="none" stroke="#111" stroke-width="3"><path d="M6 10h36M18 10V4h12v6M10 10l3 44h22l3-44M19 18v30M24 18v30M29 18v30"/></svg>',
      };
      const tl = [
        ['write', 'Write Reply', ''],
        ['reply', 'Reply', ' disabled'],
        ['trash', 'Ignore Post', ''],
      ];
      for (const [k, label, cls] of tl) {
        const b = u.el('button', 'tool' + cls, tools);
        b.type = 'button';
        const crop = { write: '155 769 73 73', reply: '493 770 82 70', trash: '852 762 59 76' }[k];
        b.innerHTML =
          '<svg viewBox="' +
          crop +
          '"><image href="sites/design-use-social-feed-all-09/assets/lisa-details.webp" width="1672" height="941"/></svg><span>' +
          label +
          '</span>';
        if (!cls) b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      const actionbar = u.el('div', 'office-final-actions', lower);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'bottom') submit = makeEnd(actionbar, 'end-control');
        else submit = placement === 'menu' ? menuSubmit : titleSubmit;
      }
      const clear = u.el('button', 'clear-task', header, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
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
