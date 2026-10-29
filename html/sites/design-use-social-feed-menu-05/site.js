(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-menu-05',
    'brand': 'Social Task Manager',
    'mode': 'bottom',
    'tokens': {
      'bg': '#d9e7f5',
      'panel': '#f8fbff',
      'fg': '#072c60',
      'accent': '#188de0',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'Home    View    Tools    Help',
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
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide'),
        endBank = (ctx.content && ctx.content.END_LABELS) || [
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
        ],
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        candidateLabel = labelOf(endR.pick(endBank)),
        placement = ctx.finish
          ? null
          : endR.pick(['classic', 'classic', 'classic', 'classic', 'toolbar', 'tray', 'toolbar']),
        label = placement === 'classic' ? 'Submit' : candidateLabel;
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [...new Set(endBank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (pool.length) collide = labelOf(collideR.pick(pool));
      }
      const win = u.el('div', 'win', shell);
      const tb = u.el('div', 'win-title', win);
      const bubble =
        '<svg viewBox="0 0 30 30" fill="none"><path d="M5 2h20a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H13l-7 5v-5H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" fill="#e8dcc0" stroke="#ad9671"/><circle cx="11" cy="13" r="2" fill="#372b1c"/><circle cx="20" cy="13" r="2" fill="#372b1c"/><path d="M18 14l-3 3" stroke="#372b1c" stroke-width="2"/></svg>';
      u.el('span', 'ico', tb).innerHTML = bubble;
      u.el('span', '', tb, 'Chatter');
      u.el('span', 'ctl', tb).innerHTML =
        '<svg viewBox="0 0 20 20"><path d="M3 14h14" stroke="#eee6db" stroke-width="1.4"/></svg><svg viewBox="0 0 20 20"><rect x="4" y="4" width="13" height="13" fill="none" stroke="#eee6db" stroke-width="1.4"/></svg><svg viewBox="0 0 20 20"><path d="M4 4l12 12M16 4L4 16" stroke="#eee6db" stroke-width="1.4"/></svg>';
      const stage = u.el('main', 'stage', win);
      const note = u.el('section', 'task-note', shell);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Your Task');
      if (ctx.display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      if (ctx.display === 'panel') note.classList.add('episode-panel');
      if (ctx.display === 'toast') note.classList.add('episode-toast');
      let submit = null;
      const wireEnd = (b) => {
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'classic') submit = wireEnd(u.el('button', 'end-control', shell, label));
        else if (placement === 'toolbar') submit = wireEnd(u.el('button', 'episode-end episode-toolbar', tb, label));
        else submit = wireEnd(u.el('button', 'episode-end episode-tray', shell, label));
      }
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'tb-orb', footer).innerHTML =
        '<svg viewBox="0 0 32 32"><path d="M3 4q7-3 12 0v11q-5-3-12 0z" fill="#dc7742"/><path d="M17 4q6 3 12 0v11q-6 3-12 0z" fill="#70ad66"/><path d="M3 17q7-3 12 0v11q-5-3-12 0z" fill="#5c9fd2"/><path d="M17 17q6 3 12 0v11q-6 3-12 0z" fill="#efc952"/></svg>';
      u.el('span', 'tb-folder', footer).innerHTML =
        '<svg viewBox="0 0 34 31"><path d="M1 2h12l3 4h16v23H1z" fill="#d4aa58" stroke="#efcf80"/><path d="M2 9h30v20H2z" fill="#efd082"/><path d="M12 17h12v12H12z" fill="#5f98b4"/><path d="M15 18h6v5h-6z" fill="#ddebf1"/></svg>';
      const app = u.el('span', 'tb-app', footer);
      u.el('i', '', app).innerHTML = bubble;
      u.el('span', '', app, 'Chatter');
      if (collide) {
        const d = u.el('button', 'episode-xtra', footer, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      u.el('span', 'tb-tray', footer).innerHTML =
        '<svg viewBox="0 0 24 24" fill="#eee"><path d="M3 8h5l6-5v18l-6-5H3z"/><path d="M17 8v8" stroke="#eee" stroke-width="2"/></svg><svg viewBox="0 0 24 24" fill="#eee"><path d="M2 8h5l6-5v18l-6-5H2z"/><path d="M16 7q7 5 0 10M19 3q10 9 0 18" fill="none" stroke="#eee" stroke-width="1.5"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="#eee" stroke-width="1.6"><path d="M2 3h20v15H2zM8 22h8M12 18v4M5 14l4-4 3 2 6-6"/></svg>';
      const clk = u.el('div', 'tb-clock', footer);
      u.el('div', '', clk, '10:24 AM');
      u.el('div', '', clk, 'Apr 12, 2011');
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
