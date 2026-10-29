(function () {
  'use strict';
  // The kit schedules and dismisses this notification stack as an initial overlay.
  // Its reserved margin and task anchors remain unchanged when it is cleared.
  function notificationCenter(ctx, shell) {
    const u = ctx.util;
    const pane = u.el('aside', 'reference-overlay toast notification-center', shell);
    pane.setAttribute('aria-label', 'Notifications');
    const heading = u.el('h2', '', pane, 'Notifications (5)');
    const stack = u.el('div', 'notification-stack', pane);
    const rows = [
      ['New message', 'You have a new message\nfrom Team Update.', '10:24 AM'],
      ['Reminder', 'Standup meeting\nin 10 minutes.', '9:18 AM'],
      ['System update', 'A new update is available\nto install.', '8:52 AM'],
      ['Friend request', 'Alex Chen sent you\na friend request.', '8:20 AM'],
      ['Tips', 'Explore new features\nin Social Task Runner.', '7:41 AM'],
    ];
    const clear = () => ctx.dismiss();
    rows.forEach(([title, copy, time], i) => {
      const card = u.el('section', 'notification-card nc-' + i, stack);
      u.el('b', '', card, title);
      u.el('span', 'nc-time', card, time);
      u.el('p', '', card, copy);
      const close = u.el('button', 'notification-close', card, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Dismiss ' + title);
      close.addEventListener('click', () => {
        card.remove();
        heading.textContent = 'Notifications (' + stack.children.length + ')';
        if (!stack.children.length) clear();
      });
    });
    const actions = u.el('div', 'overlay-actions', pane);
    const dismiss = u.el('button', 'primary', actions, 'Dismiss all');
    dismiss.type = 'button';
    dismiss.addEventListener('click', clear);
    return { el: pane, dismiss };
  }
  const D = {
    'site': 'design-use-social-feed-all-11',
    'brand': 'Social Task Runner',
    'mode': 'top',
    'tokens': {
      'bg': '#efede3',
      'panel': '#ffffff',
      'fg': '#00135c',
      'accent': '#0954e8',
      'font': "Tahoma,Verdana,'Segoe UI',sans-serif",
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'File    Edit    View    Tools    Help',
    'obstruction': [
      'Notifications (5)',
      'New message \u00b7 Reminder \u00b7 System update \u00b7 Friend request \u00b7 Tips',
      'Dismiss all',
    ],
    'footer': 'Ready',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'toast' },
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display + (ctx.finish ? ' finish-mode' : '');
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'design-brand', header);
      u.el('span', 'xp-logo', tb);
      u.el('span', '', tb, D.brand);
      const caps = u.el('span', 'xp-caps', tb);
      u.el('i', 'xp-cap min', caps, '_');
      u.el('i', 'xp-cap max', caps, '▢');
      u.el('i', 'xp-cap cls', caps, '✕');
      const nav = u.el('nav', 'design-nav', header);
      for (const label of D.nav.trim().split(/\s+/)) {
        const item = u.el('span', '', nav);
        u.el('u', '', item, label[0]);
        item.append(label.slice(1));
      }
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
        const er = ctx.rng.fork('chrome/end');
        let placement = er.pick(['footer', 'footer', 'footer', 'toolbar', 'status']);
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
        ];
        const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        let label = asLabel(er.pick(labels));
        if (ctx.rng.fork('chrome/end/reference').bool(0.5)) {
          placement = 'footer';
          label = 'Submit';
        }
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const options = [...new Set(labels.map(asLabel))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = { text: asLabel(cr.pick(options)), where: 'toolbar' };
        }
        const parent = placement === 'toolbar' ? nav : footer;
        submit = u.el(
          placement === 'status' ? 'a' : 'button',
          placement === 'status' ? 'end-link' : 'end-control',
          parent,
          label,
        );
        if (placement === 'status') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          if (placement === 'status') e.preventDefault();
          ctx.submit();
        });
        if (collide) {
          const parent = collide.where === 'toolbar' ? nav : footer;
          const b = u.el('button', 'end-xtra', parent, collide.text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide.text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.initial) return notificationCenter(ctx, document.body);
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
      if (ctx.kind === 'toast') {
        el.querySelector('.overlay-copy').remove();
        const stack = u.el('div', 'notification-stack', el);
        for (const [title, copy] of [
          ['New message', 'You have a new message\nfrom Team Update.'],
          ['Reminder', 'Standup meeting\nin 10 minutes.'],
          ['System update', 'A new update is available\nto install.'],
          ['Friend request', 'Alex Chen sent you\na friend request.'],
          ['Tips', 'Explore new features\nin Social Task Runner.'],
        ]) {
          const card = u.el('section', 'notification-card nc-' + stack.children.length, stack);
          u.el('b', '', card, title);
          u.el(
            'span',
            'nc-time',
            card,
            ['10:24 AM', '9:18 AM', '8:52 AM', '8:20 AM', '7:41 AM'][stack.children.length - 1],
          );
          u.el('p', '', card, copy);
          const close = u.el('button', 'notification-close', card, '×');
          close.setAttribute('aria-label', 'Dismiss ' + title);
          close.addEventListener('click', () => {
            card.remove();
            if (!stack.children.length) ctx.dismiss();
          });
        }
      }
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
