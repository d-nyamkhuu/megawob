(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-calendar-08',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#008080',
      'panel': '#c0c0c0',
      'fg': '#000000',
      'accent': '#000080',
      'font': "'MS Sans Serif','Microsoft Sans Serif',Tahoma,Arial,sans-serif",
      'line': '#808080',
      'muted': '#404040',
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
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const icons = u.el('div', 'desk-icons', body);
      const IC = [
        ['My Computer', '#dfe6f0'],
        ['My Documents', '#f2d74a'],
        ['Network Neighborhood', '#9fb4d8'],
        ['Recycle Bin', '#b8c4b8'],
        ['Briefcase', '#e8e0b0'],
      ];
      for (const [n, c] of IC) {
        const it = u.el('div', 'desk-icon', icons);
        const g = u.el('i', '', it);
        g.style.background = c;
        u.el('span', '', it, n);
      }
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'tb-start', footer, 'Start');
      u.el('span', 'tb-task on', footer, 'Calendar - Daily View');
      u.el('span', 'tb-task', footer, 'New Event');
      u.el('span', 'tb-clock', footer, '10:23 AM');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = ctx.content && ctx.content.END_LABELS;
        const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
        let placement = 'dialog',
          endLabel =
            labels && labels.length
              ? labelOf(labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || 'Submit')
              : 'Submit';
        if (er.bool(0.5)) {
          placement = er.pick(['taskbar', 'menubar']);
          const picked = labels && labels.length ? er.pick(labels) : 'Done';
          endLabel = labelOf(picked);
        }
        const makeEnd = (parent, tag, cls, label) => {
          const b = u.el(tag, cls, parent, label);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.setAttribute('aria-label', endLabel);
          b.title = endLabel;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        submit = makeEnd(
          footer,
          placement === 'menubar' ? 'a' : 'button',
          'end-control ' + placement + '-end',
          endLabel,
        );
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (
            labels && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          )
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (pool.length) {
            const decoy = u.el('button', 'end-control pq-xtra', footer, cr.pick(pool));
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
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
