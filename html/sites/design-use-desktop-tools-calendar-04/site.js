(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-calendar-04',
    'brand': 'ACME',
    'mode': 'notebook',
    'tokens': {
      'bg': '#0b2f5c',
      'panel': '#f2f4f8',
      'fg': '#0a1038',
      'accent': '#8ec3f0',
      'font': 'Tahoma,Verdana,Arial,sans-serif',
      'line': '#b3bccb',
      'muted': '#3a4352',
      'button-fg': '#000',
    },
    'tabs': ['Calendar', 'Documents', 'Projects', 'Tasks', 'Contacts', 'Reports', 'Administration'],
    'links': ['Help', 'My Account', 'Contact Us', 'Log Out'],
    'obstruction': ['ACME Partner Bulletin', 'Extranet maintenance is scheduled for this weekend.', 'Close'],
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
      u.el('div', 'design-sub', header, 'Business Partner Extranet');
      const links = u.el('nav', 'design-links', header);
      D.links.forEach((l, i) => {
        if (i) u.el('span', 'sep', links, '|');
        const a = u.el('span', 'lnk', links, l);
      });
      u.el('div', 'design-date', header, 'Mon, Apr 12, 1999');
      const tabs = u.el('nav', 'nb-tabs', shell);
      D.tabs.forEach((t, i) => {
        const b = u.el('div', 'nb-tab' + (i === 0 ? ' on' : ''), tabs, t);
        u.el('i', 'ring', tabs).style.setProperty('--i', i);
      });
      for (let i = D.tabs.length; i < 14; i++) u.el('i', 'ring', tabs).style.setProperty('--i', i);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') u.el('h2', '', note, 'Task instruction');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
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
      const label = labelOf(er.pick(labels));
      let placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'footer', 'note', 'note-link']);
      if ((placement === 'note' || placement === 'note-link') && (ctx.display === 'hidden' || ctx.display === 'toast'))
        placement = 'footer';
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'note' || placement === 'note-link') {
          submit = u.el(
            placement === 'note-link' ? 'a' : 'button',
            placement === 'note-link' ? 'end-link' : 'end-control',
            note,
            placement === 'note-link' ? label + ' ›' : label,
          );
          if (submit.tagName === 'BUTTON') submit.type = 'button';
          else submit.href = '#';
        } else {
          submit = u.el('button', 'end-control', footer, label);
          submit.type = 'button';
        }
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      } else footer.classList.add('empty');
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const decoy = u.el('button', 'chrome-xtra', shell, labelOf(cr.pick(pool)));
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
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
