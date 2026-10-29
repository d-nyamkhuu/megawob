(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-01',
    'brand': 'RouteFinder 2014 \u2013 Bus Tickets',
    'mode': 'rail',
    'tokens': {
      'bg': '#122b3d',
      'panel': '#163245',
      'fg': '#d3e9fc',
      'accent': '#7eb7df',
      'font': 'Arial,sans-serif',
      'line': '#3d5c70',
      'muted': '#a5c0d3',
    },
    'nav': 'File    Edit    View    Tools    Help',
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
      const brand = u.el('div', 'design-brand', header, D.brand);
      brand.insertAdjacentHTML(
        'afterbegin',
        '<svg class="brand-bus" viewBox="0 0 24 28" aria-hidden="true"><rect x="2" y="1" width="20" height="23" rx="4" fill="#39789f" stroke="#215472"/><rect x="5" y="4" width="14" height="10" rx="1" fill="#d4eafa"/><rect x="5" y="18" width="5" height="2" fill="#d4eafa"/><rect x="16" y="18" width="3" height="2" fill="#d4eafa"/><path d="M5 24v2m14-2v2" stroke="#215472" stroke-width="3"/></svg>',
      );
      const controls = u.el('div', 'window-controls', header);
      for (const [cls, label] of [
        ['minimize', '−'],
        ['maximize', '□'],
        ['close', '×'],
      ])
        u.el('span', cls, controls, label);
      const menu = u.el('nav', 'design-nav', header);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const item = u.el('span', '', menu);
        u.el('u', '', item, label[0]);
        item.append(label.slice(1));
      }
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') {
          note.classList.add('panel-note');
          u.el('h2', '', note, 'Task note');
        } else if (ctx.display === 'toast') {
          note.classList.add('toast-note');
        }
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const endRng = ctx.rng.fork('chrome/end');
      const baseEnd = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : baseEnd ? 'footer' : endRng.pick(['header', 'link']);
      const rawEnds =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endLabels = rawEnds.map((x) =>
        typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x),
      );
      let endLabel = 'Submit';
      if (!ctx.finish && !baseEnd) {
        const alternatives = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
        if (alternatives.length) endLabel = endRng.pick(alternatives);
      }
      let submit = null;
      const addEnd = (parent, cls, label, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, label);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = addEnd(footer, 'end-control', baseEnd ? 'Submit' : endLabel, false);
        else if (placement === 'link') submit = addEnd(footer, 'end-link', endLabel + ' ›', true);
        else submit = addEnd(header, 'end-control end-header', endLabel, false);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const same = (x) => String(x).trim().toLowerCase() === String(endLabel).trim().toLowerCase();
        const opts = [...new Set(endLabels.filter((x) => !same(x)))];
        if (opts.length) {
          const label = collideRng.pick(opts);
          const parent = placement === 'header' ? header : footer;
          const b = u.el('button', placement === 'header' ? 'end-xtra end-xtra-header' : 'end-xtra', parent, label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const rail = u.el('nav', 'command-rail', body);
      for (const name of ['Search', 'Tickets', 'Passengers', 'Payment', 'Confirmation']) {
        const IC = {
          'Search':
            '<circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13.5 13.5L19 19" stroke="currentColor" stroke-width="2.2"/>',
          'Tickets':
            '<path d="M3 14L14 3l2 2c-1 1-1 3 0 4s3 1 4 0l2 2L11 22l-2-2c1-1 1-3 0-4s-3-1-4 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
          'Passengers':
            '<circle cx="8" cy="7" r="3.2" fill="currentColor"/><path d="M2 18c0-4 3-6 6-6s6 2 6 6z" fill="currentColor"/><circle cx="15" cy="8" r="2.5" fill="currentColor"/><path d="M15 12c3 0 5 2 5 5h-4z" fill="currentColor"/>',
          'Payment':
            '<rect x="2" y="4" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="2" y="8" width="18" height="3" fill="currentColor"/>',
          'Confirmation':
            '<circle cx="11" cy="11" r="9" fill="currentColor"/><path d="M6.5 11.5l3 3 6-6.5" fill="none" stroke="#163245" stroke-width="2.2"/>',
        }[name];
        const b = u.el('button', 'command-item', rail);
        b.innerHTML =
          '<svg viewBox="0 0 22 22" width="26" height="26" style="vertical-align:middle;margin-right:16px">' +
          IC +
          '</svg>' +
          name;
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: name }));
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
