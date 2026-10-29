(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-08',
    'obstruction': null,
    'tokens': {
      'bg': '#b9bbbb',
      'panel': '#e7e7e9',
      'fg': '#111',
      'accent': '#008f9f',
      'font': "'Liberation Mono','Courier New',monospace",
      'line': '#a8a9af',
      'muted': '#4a4a4a',
    },
    'tabs': ['Tickets', 'Itinerary', 'Travel Info', 'Preferences', 'Notes'],
  };
  const TAB_ICONS = [
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8" stroke-linejoin="round"><path d="M2 18L18 2l5 1 2 5 5 2-1 5-16 16-4-5-5-2z"/><path d="M7 18L19 6l7 7-13 13z"/><path d="M11 18l7-7 4 3-7 7z"/><path d="M15 16l3-3"/></svg>',
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8"><path d="M6 2h21v28H6zM3 4v26M10 5h3v3h-3zM10 11h3v3h-3zM10 17h3v3h-3zM10 23h3v3h-3z"/><path d="M16 6h8M16 12h8M16 18h8M16 24h8"/></svg>',
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.5"><circle cx="16" cy="16" r="14"/><path fill="#111" d="M5 9l6-6 5 2-3 5 3 4-4 4 1 8-5-3-2-5-3-3zM21 4l6 5-4 2-1 4 4 2-3 8-3 3-2-8-4-3 3-5 4-1z"/></svg>',
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8" stroke-linejoin="round"><path d="M3 26l15-15a9 9 0 0 1 9-10l-4 5 3 4 5-2a9 9 0 0 1-11 9L7 30z"/><circle cx="6" cy="26" r="1"/></svg>',
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8"><path d="M6 2h20l3 4v24H6zM3 4v26M23 2v5h6M10 6h3v3h-3zM10 12h3v3h-3zM10 18h3v3h-3zM10 24h3v3h-3z"/><path d="M16 7h7M16 13h9M16 19h9M16 25h9"/></svg>',
  ];
  const APP_ICON =
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"><path d="M4 5l19-3 5 21-7 6-16-4z"/><path d="M9 3l16 4-3 22-15-3z"/><path d="M12 8v12l4 2 4-3V9l-4-2zM8 23l8 3M24 22l4-2"/><path d="M14 10v8M18 11v5" stroke-width="1"/></svg>';
  const PRINT_ICON =
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8"><path d="M10 2h15v9H10zM5 10h23l3 6v11H3V15zM8 20h18v10H8z"/><path d="M9 15h15M11 24h12M11 27h12"/><circle cx="27" cy="17" r="1" fill="#111"/></svg>';
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'os2 instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'os2-logo', header, 'OS/2');
      u.el('div', 'design-brand', header, 'OS/2 Workplace  Shell');
      u.el('div', 'design-clock', header, 'Mon Apr 25, 1994  10:18 AM');
      u.el('div', 'hdr-ico print', header).innerHTML = PRINT_ICON;
      u.el('span', 'help-button', u.el('div', 'hdr-ico help', header), '?');
      const body = u.el('div', 'design-body', shell);
      const win = u.el('div', 'os2-win', body);
      const tb = u.el('div', 'os2-title', win);
      u.el('span', 'tb-ico', tb).innerHTML = APP_ICON;
      u.el('span', 'tb-text', tb, 'Travel Planner - Tickets');
      const tc = u.el('span', 'tb-ctl', tb);
      for (const g of ['_', '▢', '×']) u.el('i', '', tc, g);
      const tabs = u.el('div', 'os2-tabs', win);
      D.tabs.forEach((t, i) => {
        const e = u.el('div', 'os2-tab' + (i === 0 ? ' on' : ''), tabs);
        const ic = u.el('span', 'tab-ico', e);
        ic.innerHTML = TAB_ICONS[i];
        u.el('span', 'tab-name', e, t);
      });
      const page = u.el('section', 'os2-page', win);
      const note = u.el(
        'div',
        'task-note' + (ctx.display === 'panel' ? ' note-panel' : ctx.display === 'toast' ? ' note-toast' : ''),
        page,
      );
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        const task = u.el('p', 'food-task', note, ctx.instruction);
        task.style.fontSize = `clamp(13px,${Math.min(2.6, 130 / ctx.instruction.length)}vw,43px)`;
      }
      const sub = u.el('div', 'page-sub', page);
      u.el('span', 'page-caption', sub, 'Available Tickets');
      const th = u.el('div', 'os2-thead', page);
      for (const h of ['Operator', 'Route', 'Duration', 'Price (USD)', 'Select']) u.el('span', '', th, h);
      const stage = u.el('main', 'stage', page);
      const footer = u.el('footer', 'design-footer', page);
      for (const [label, cls] of [
        ['Details...', 'dt-btn'],
        ['Clear Selection', 'clear-btn'],
        ['Buy ticket', 'buy-btn'],
      ]) {
        const b = u.el('button', cls, footer, label);
        b.type = 'button';
      }
      const endR = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish ? null : endR.pick(['default', 'default', 'header', 'link']);
      const defaultLabel = labels.map(labelOf).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
      const endLabel = placement === 'default' ? defaultLabel : labelOf(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (pool.length) collide = labelOf(collideR.pick(pool));
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'chrome-xtra' + (isCollide ? ' collide' : ''), parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      if (collide) decoyBtn(sub, collide, true);
      if (!ctx.finish && placement === 'header') submit = u.el('button', 'end-control toolbar-end', sub, endLabel);
      if (!ctx.finish && placement === 'link') submit = u.el('button', 'end-control link-end', sub, endLabel + ' ›');
      if (!ctx.finish && placement === 'default') submit = u.el('button', 'end-control', footer, endLabel);
      if (submit) {
        submit.type = 'button';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', () => ctx.submit());
      }
      const bar = u.el('div', 'os2-taskbar', shell);
      const start = u.el('div', 'tbtn start', bar);
      u.el('span', 'os2-logo', start, 'OS/2');
      u.el('span', '', start, 'Start');
      for (const [i, t] of ['Travel Planner', 'Templates', 'Shredder'].entries()) {
        const b = u.el('div', 'tbtn win' + (i === 0 ? ' on' : ''), bar);
        const ic = u.el('span', 'taskbar-icon', b);
        ic.innerHTML =
          i === 0
            ? APP_ICON
            : i === 1
              ? TAB_ICONS[1]
              : '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="2"><path d="M7 8h18l-2 22H9zM5 7h22M11 3h10l4 4H7zM12 11v15M16 11v15M20 11v15"/></svg>';
        u.el('span', '', b, t);
      }
      const tray = u.el('div', 'os2-tray', bar);
      u.el('div', 'tray-monitor', tray).innerHTML =
        '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8"><rect x="4" y="3" width="23" height="22" rx="2"/><path d="M7 6h17v15H7zM9 28h14M15 25v3"/></svg>';
      u.el('div', 'tray-key', tray).innerHTML =
        '<svg viewBox="0 0 48 28" fill="#ddd" stroke="#111" stroke-width="1.6"><path d="M5 10h8l4 4-4 5H5l-4-5zM17 14h28"/></svg>';
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
