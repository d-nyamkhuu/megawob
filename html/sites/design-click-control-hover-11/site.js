(function () {
  'use strict';
  const cfg = {
    theme: 'mac',
    layout: 'macwide',
    title: 'Pointer Task',
    side: 'Notifications',
    notes: [
      'The blue square will move to different positions within the area.',
      'Keep the mouse over it (continuous or in multiple visits) until the total is reached.',
      'The timer starts after any notifications are dismissed.',
    ],
    cards: [
      ['Software Update Available', '10:20 AM', 'A new version is ready to install.', 'doc'],
      ['New Mail', '10:18 AM', 'You have 3 unread messages.', 'mail'],
      ['Disk Almost Full', '10:16 AM', 'Only 200 MB remaining.', 'warn'],
      ['Reminder', '10:14 AM', 'Team meeting at 11:00 AM.', 'note'],
      ['Printer Offline', '10:12 AM', 'Check your connection.', 'print'],
    ],
  };
  const ICONS = {
    doc: '<svg viewBox="0 0 40 40"><path d="M9 3h15l7 7v27H9Z" fill="#e9f0fc" stroke="#111" stroke-width="2"/><path d="M24 3v7h7" fill="#ddd" stroke="#111" stroke-width="2"/><path d="M13 16h14M13 21h14M13 26h14M13 31h14" stroke="#111" stroke-width="1.6"/></svg>',
    mail: '<svg viewBox="0 0 40 40"><rect x="3" y="9" width="34" height="23" fill="#fff" stroke="#111" stroke-width="2"/><path d="M3 9l17 14L37 9M3 32l12-12M37 32 25 20" fill="none" stroke="#111" stroke-width="2"/></svg>',
    warn: '<svg viewBox="0 0 40 40"><path d="M17 6Q20 0 23 6L38 32Q40 36 35 36H5Q0 36 3 31Z" fill="#efd15c" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/><path d="M20 14v11" stroke="#111" stroke-width="4"/><circle cx="20" cy="30" r="2.4" fill="#111"/></svg>',
    note: '<svg viewBox="0 0 40 40"><path d="M5 4h27v34H5Z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M9 11h19M9 16h17M9 21h15M9 26h12M9 31h12" stroke="#111" stroke-width="1.6"/><path d="M36 3 23 26l-1 6 5-4L39 5Z" fill="#fff" stroke="#111" stroke-width="2"/></svg>',
    print:
      '<svg viewBox="0 0 40 40"><path d="M11 4h18v10H11Z" fill="#fff" stroke="#111" stroke-width="2"/><rect x="3" y="14" width="34" height="16" rx="2" fill="#9399ba" stroke="#111" stroke-width="2"/><path d="M5 18h30M6 22h3" stroke="#414967"/><rect x="9" y="25" width="22" height="11" fill="#fff" stroke="#111" stroke-width="2"/><path d="M13 29h14M13 32h14" stroke="#111"/></svg>',
  };
  env.site({
    name: 'design-click-control-hover-11',
    styles: ['site.css', 'mac.css'],
    initialOverlay: { kind: 'banner', p: 1 },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
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
      const sampledLabel = labelOf(endRng.pick(labels));
      const endLabel = endRng.fork('reference-label').bool(0.5) ? 'Submit' : sampledLabel;
      const placement = ctx.finish ? null : endRng.pick(['side', 'side', 'side', 'header', 'notes']);
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) collide = collideRng.pick(pool);
      }
      const shell = u.el('main', 'shell', document.body);
      const bar = u.el('header', 'menubar', shell);
      const apple = u.el('span', 'apple', bar);
      apple.innerHTML =
        '<svg viewBox="0 0 24 28"><defs><linearGradient id="appleRainbow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#58aa39" offset="0%"/><stop stop-color="#58aa39" offset="25%"/><stop stop-color="#f3d22d" offset="25%"/><stop stop-color="#f3d22d" offset="42%"/><stop stop-color="#ed8b24" offset="42%"/><stop stop-color="#ed8b24" offset="57%"/><stop stop-color="#c63542" offset="57%"/><stop stop-color="#c63542" offset="72%"/><stop stop-color="#934790" offset="72%"/><stop stop-color="#934790" offset="86%"/><stop stop-color="#397ab5" offset="86%"/></linearGradient></defs><path d="M12 8C7 4 1 9 3 16c2 8 5 10 8 8 1-.5 2-.5 3 0 3 2 6-2 7-6-5-2-5-6-1-8-2-4-5-4-8-2Z" fill="url(#appleRainbow)" stroke="#444"/><path d="M12 7c-1-4 2-6 5-6 0 3-2 5-5 6" fill="#62a23d" stroke="#555"/></svg>';
      ['File', 'Edit', 'View', 'Special', 'Help'].forEach((l) => u.el('span', 'mi', bar, l));
      u.el('span', 'clock', bar, '10:24 AM');
      const tray = u.el('span', 'tray', bar);
      tray.innerHTML =
        '<svg viewBox="0 0 30 34"><path d="M6 3h19M6 30h19M9 4c0 8 12 9 12 13S9 23 9 29M22 4c0 8-12 9-12 13s12 6 12 12" fill="#dcdfef" stroke="#17192d" stroke-width="2"/><path d="m19 8-7 9 7 9H11l7-9-5-9Z" fill="#7168a1"/><path d="m8 6 15-3M6 31l19-3" stroke="#181a24" stroke-width="2"/></svg>';
      const work = u.el('div', 'work', shell);
      const win = u.el('section', 'win main-win', work);
      const tb = u.el('div', 'tbar', win);
      ['x', '', ''].forEach((t) => u.el('i', 'box', tb, t === 'x' ? '' : ''));
      u.el('span', 'stripes', tb);
      u.el('span', 'ttl', tb, cfg.title);
      u.el('span', 'stripes', tb);
      let submit = null;
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish && placement === 'header') submit = endButton(tb, 'end-header');
      const body = u.el('div', 'wbody', win);
      const note = u.el('div', 'instruction', body, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', body);
      const notes = u.el('div', 'notes', body);
      u.el('div', '', notes, 'Notes:');
      const ul = u.el('ul', '', notes);
      cfg.notes.forEach((t) => u.el('li', '', ul, t));
      if (!ctx.finish && placement === 'notes') submit = endButton(notes, 'end-notes');
      const side = u.el('aside', 'win side-win', work);
      const tb2 = u.el('div', 'tbar', side);
      u.el('i', 'box', tb2);
      u.el('span', 'ttl l', tb2, 'Notifications (0)');
      u.el('span', 'stripes', tb2);
      u.el('i', 'box close-box', tb2);
      const sb = u.el('div', 'sbody', side);
      if (collide) {
        const decoy = u.el('button', 'end-xtra', tb, collide);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish && placement === 'side') u.el('hr', '', sb);
      if (!ctx.finish && placement === 'side') submit = endButton(sb, 'submit');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        host = document.querySelector('.sbody');
      const el = u.el('section', 'notification-overlay', host);
      el.setAttribute('aria-label', 'Notifications');
      const list = u.el('div', 'cards', el);
      let dismiss;
      const title = document.querySelector('.side-win .ttl');
      if (title) title.textContent = 'Notifications (5)';
      const refresh = () => {
        const count = list.children.length;
        const title = document.querySelector('.side-win .ttl');
        if (title) title.textContent = 'Notifications (' + count + ')';
      };
      cfg.cards.forEach((c) => {
        const card = u.el('div', 'card', list);
        const ic = u.el('span', 'cicon', card);
        ic.innerHTML = ICONS[c[3]];
        const tx = u.el('div', 'ctext', card);
        const h = u.el('div', 'chead', tx);
        u.el('b', '', h, c[0]);
        u.el('span', '', h, c[1]);
        u.el('div', 'cmsg', tx, c[2]);
        const x = u.el('button', 'cx', card, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Dismiss ' + c[0]);
        x.addEventListener('click', () => {
          card.remove();
          refresh();
          if (!list.children.length) ctx.dismiss();
        });
      });
      dismiss = u.el('button', 'dismissall', el, 'Dismiss all');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => {
        list.textContent = '';
        refresh();
        ctx.dismiss();
      });
      return { el, dismiss };
    },
  });
})();
