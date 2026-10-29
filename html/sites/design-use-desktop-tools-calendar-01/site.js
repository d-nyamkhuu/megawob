(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-calendar-01',
    'brand': 'Notebook',
    'mode': 'side-right',
    'tokens': {
      'bg': '#eeeeeb',
      'panel': '#ffffff',
      'fg': '#171b23',
      'accent': '#f78008',
      'font': 'monospace',
      'line': '#d1cec5',
      'muted': '#626675',
    },
    'nav': 'File    Edit    View    Go    Window    Help',
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
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('span', 'nb-logo', header);
      logo.innerHTML =
        '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#f78008" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      const nav = u.el('nav', 'design-nav', header);
      for (const t of D.nav.split(/\s{2,}/)) u.el('span', '', nav, t);
      const wc = u.el('div', 'nb-wc', header);
      wc.innerHTML =
        '<svg viewBox="0 0 20 20" width="20" height="20" stroke="#ddd" stroke-width="1.6" fill="none"><path d="M3 10h14"/></svg><svg viewBox="0 0 20 20" width="20" height="20" stroke="#ddd" stroke-width="1.6" fill="none"><rect x="3.5" y="3.5" width="13" height="13"/></svg><svg viewBox="0 0 20 20" width="20" height="20" stroke="#ddd" stroke-width="1.6" fill="none"><path d="M3.5 3.5l13 13M16.5 3.5l-13 13"/></svg>';
      const sb = u.el('aside', 'nb-side', shell);
      const I = {
        c: '<rect x="3.5" y="5" width="15" height="13" rx="2"/><path d="M3.5 9h15M8 3v4M14 3v4"/>',
        n: '<path d="M5 2.5h7l3.5 3.5v11.5H5z"/>',
        t: '<rect x="3.5" y="3.5" width="14" height="14" rx="2"/><path d="M7 10.5l2.5 2.5L14 8"/>',
        s: '<circle cx="9" cy="9" r="6"/><path d="M13.5 13.5L18 18"/>',
      };
      [
        ['c', 'Calendar', 1],
        ['n', 'Notes'],
        ['t', 'Tasks'],
        ['s', 'Search'],
      ].forEach(([k, t, on]) => {
        const it = u.el('div', 'nb-item' + (on ? ' on' : ''), sb);
        const ic = u.el('span', '', it);
        ic.innerHTML =
          '<svg viewBox="0 0 22 22" width="22" height="22" fill="none" stroke="#666" stroke-width="1.4">' +
          I[k] +
          '</svg>';
        u.el('span', '', it, t);
      });
      u.el('hr', '', sb);
      u.el('div', 'nb-cal-h', sb, 'My Calendars');
      [
        ['Personal', 1],
        ['Work', 0],
      ].forEach(([t, on]) => {
        const it = u.el('div', 'nb-check' + (on ? ' on' : ''), sb);
        u.el('i', '', it);
        u.el('span', '', it, t);
      });
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') {
          const h = u.el('h2', '', note, 'Task');
          h.innerHTML =
            '<svg viewBox="0 0 20 20" width="22" height="22"><path d="M11 2l7 7-2 1-3-1-3 3 .5 4-1.5 1-3.5-3.5L1 18l-.5-.5 4.5-5.5L1.500 8.500 3 7l4 .5 3-3-1-3z" fill="#f56a0d"/></svg><span>Task</span>';
        }
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
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
          mode = er.pick(['form', 'form', 'form', 'header', 'icon']);
        let label = 'Submit';
        if (mode !== 'form') {
          const picked = er.pick(labels);
          label = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
        }
        submit = u.el(
          'button',
          'end-control' + (mode === 'header' ? ' end-header' : mode === 'icon' ? ' end-icon' : ''),
          footer,
          mode === 'icon' ? '✓' : label,
        );
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x))),
            options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const d = u.el('button', 'nb-xtra', header, cr.pick(options));
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
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
