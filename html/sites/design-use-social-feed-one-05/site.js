(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-one-05',
    'brand': 'NetTalk - Home',
    'mode': 'bottom',
    'tokens': {
      'bg': '#c9c9c9',
      'panel': '#f3f3f3',
      'fg': '#111111',
      'accent': '#3b78c4',
      'font': "'Courier New',monospace",
      'line': '#9a9a9a',
      'muted': '#555555',
    },
    'obstruction': null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const endPool = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const placement = ctx.finish
        ? null
        : endRng.pick(['bottom', 'bottom', 'bottom', 'bottom', 'toolbar', 'iconbar', 'link']);
      const endLabel =
        placement === 'bottom' && endRng.bool(0.85)
          ? 'Submit'
          : endRng.pick(endPool.filter((x) => String(x).toLowerCase() !== 'submit'));
      const collideOptions = [...new Set(endPool)].filter(
        (x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase(),
      );
      const collide = collideOptions.length && collideRng.bool(0.3) ? collideRng.pick(collideOptions) : null;
      document.body.className = D.mode + ' instruction-' + ctx.display + ' end-' + (placement || 'finish');
      const shell = u.el('div', 'site-shell', document.body);
      const bar = u.el('header', 'ro-menubar', shell);
      const gear =
        '<svg viewBox="0 0 32 32" fill="none" stroke="#111" stroke-width="1.5"><path fill="#ddd" d="M12 2h8v5l5-2 4 7-4 3 5 3-4 7-5-2-1 6h-8l-1-5-5 2-4-7 4-3-4-3 4-7 5 2z"/><circle cx="16" cy="16" r="8" fill="#fff"/><path fill="#49bd49" d="M12 2h8v7h-8z"/><path fill="#e45581" d="M23 10l5 3-3 7-5-3z"/><path fill="#f8dc3e" d="M4 15h7v7H4z"/><circle cx="16" cy="16" r="5" fill="#eff5ff"/></svg>';
      u.el('span', 'ro-logo', bar).innerHTML = gear;
      for (const m of ['RISC OS', 'File', 'Edit', 'View', 'Special', 'Help']) u.el('span', 'ro-menu', bar, m);
      u.el('span', 'ro-clock', bar, 'Mon 12 Jun 1989   10:24');
      const body = u.el('div', 'design-body', shell);
      const win = u.el('section', 'ro-window', body);
      const tb = u.el('div', 'ro-titlebar', win);
      u.el('span', 'ro-back', tb, '☰');
      u.el('span', 'ro-title', tb, D.brand);
      u.el('span', 'ro-close', tb, '×');
      const tools = u.el('div', 'ro-tools', win);
      const ic = {
        Home: '<path fill="#eee" d="M5 10v11h14V10z"/><path fill="#b77968" d="M2 11L12 2l10 9z"/><path fill="#e2bad0" d="M10 21v-7h4v7"/><path d="M17 6V3h3v6"/>',
        Explore:
          '<circle fill="#ddd" cx="10" cy="10" r="7"/><circle fill="#cfcfcf" cx="10" cy="10" r="5"/><path d="M15 15l7 7"/>',
        Notifications: '<path fill="#ccc" d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21h4M11 4V2h2v2"/>',
        Messages:
          '<rect fill="#ddd" x="2" y="5" width="20" height="16"/><path d="M2 5l10 10L22 5M2 21l7-8M22 21l-7-8"/>',
        Bookmarks: '<path fill="#eee" d="M4 2h10v17H4z"/><path fill="#eee" d="M8 5h8l4 4v14H8z"/><path d="M16 5v4h4"/>',
        Profile: '<circle fill="#ccc" cx="12" cy="7" r="4"/><path fill="#ccc" d="M4 21c0-5 4-7 8-7s8 2 8 7z"/>',
      };
      for (const k of Object.keys(ic)) {
        const b = u.el('button', 'ro-tool' + (k === 'Home' ? ' on' : ''), tools);
        b.type = 'button';
        b.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' + ic[k] + '</svg>';
        u.el('span', '', b, k);
        b.addEventListener('click', () => env.log('decoy', { what: k }));
      }
      const stage = u.el('main', 'stage', win);
      const side = u.el('aside', 'ro-margin', body);
      const note = u.el('section', 'task-note', side);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, ctx.display === 'panel' ? 'Instructions' : ctx.display === 'toast' ? 'Message' : 'Task');
      if (ctx.display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const details = u.el('div', 'task-details', side);
      u.el('h3', '', details, 'Action notes');
      const fields = u.el('dl', 'task-detail-fields', details);
      for (const [label, value] of [
        ['Action:', 'Use the requested post action.'],
        ['Target Author:', ''],
        ['Post Starts With:', ''],
        ['Status:', 'Not completed'],
      ]) {
        u.el('dt', '', fields, label);
        u.el('dd', 'detail-' + label.split(':')[0].replaceAll(' ', '-').toLowerCase(), fields, value);
      }
      const caution = u.el('dd', 'detail-caution', null, 'Do not change other actions.');
      fields.querySelector('.detail-action').after(caution);
      const actionbar = u.el('div', 'office-final-actions', side);
      const makeEnd = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', String(endLabel));
        b.title = String(endLabel);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'bottom') submit = makeEnd(actionbar, 'end-control', String(endLabel));
        else if (placement === 'toolbar') {
          submit = makeEnd(tb, 'end-control end-toolbar', String(endLabel));
          tb.insertBefore(submit, tb.querySelector('.ro-close'));
        } else if (placement === 'link') submit = makeEnd(actionbar, 'end-control end-link', String(endLabel) + ' ›');
      }
      if (collide) {
        const decoy = u.el('button', 'pqd-xtra', actionbar, String(collide));
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: String(collide), collide: true }));
      }
      const clear = u.el('button', 'clear-task', actionbar, 'Clear');
      clear.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
      const icons = u.el('footer', 'ro-iconbar', shell);
      const dock = {
        Apps: gear,
        Disc: '<svg viewBox="0 0 32 32" fill="#ddd" stroke="#111" stroke-width="2"><path d="M3 7h26v23H3zM5 5h22v7H5zM7 18h18M7 24h18"/><path fill="#ffffdf" d="M7 6l9 4 9-4"/></svg>',
        NetTalk:
          '<svg viewBox="0 0 32 32" fill="#aaa" stroke="#111" stroke-width="2"><rect x="5" y="2" width="22" height="22"/><rect fill="#8cbae3" x="9" y="6" width="14" height="14"/><path d="M13 24v4h6v-4M7 30h18"/></svg>',
        Tools:
          '<svg viewBox="0 0 32 32" fill="#ddd" stroke="#111" stroke-width="2"><path d="M3 3h26v5H3zM12 8v12H6v8h6v-8h8v8h6v-8h-6V8"/></svg>',
        Filer:
          '<svg viewBox="0 0 32 32" fill="#ddd" stroke="#111" stroke-width="2"><path d="M3 5h12l3 5h11v20H3z"/></svg>',
      };
      for (const [n, on] of [
        ['Apps', 0],
        ['Disc', 0],
        ['NetTalk', 1],
        ['Tools', 0],
        ['Filer', 0],
      ]) {
        const i = u.el('span', 'ro-icon' + (on ? ' on' : ''), icons);
        u.el('i', '', i).innerHTML = dock[n];
        u.el('span', '', i, n);
      }
      if (placement === 'iconbar') submit = makeEnd(icons, 'end-control end-iconbar', String(endLabel));
      const wb = u.el('span', 'ro-icon ro-waste', icons);
      u.el('i', '', wb).innerHTML =
        '<svg viewBox="0 0 32 32" fill="#cdd5df" stroke="#111" stroke-width="2"><path d="M8 8h16l-2 22H10zM6 5h20v4H6zM11 2h10v3M13 12v14M19 12v14M9 18h14"/></svg>';
      u.el('span', '', wb, 'Wastebin');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
