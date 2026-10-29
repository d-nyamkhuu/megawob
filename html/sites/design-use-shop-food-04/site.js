(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-food-04',
    'brand': "Tony's Pizza House - Order Online",
    'mode': 'side-left',
    'tokens': {
      'bg': '#cbd0d6',
      'panel': '#e9ecf0',
      'fg': '#101923',
      'accent': '#88a9cd',
      'font': "Tahoma,Verdana,'DejaVu Sans',sans-serif",
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'File    Edit    View    Options    Help',
    'obstruction': null,
    'footer': '',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        content = ctx.content || {};
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'side-left instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'sun-symbol', header, '');
      u.el('div', 'design-brand', header, D.brand);
      const wc = u.el('div', 'window-controls', header);
      u.el('i', 'wb min', wc, '');
      u.el('i', 'wb max', wc, '');
      u.el('i', 'wb cls', wc, '');
      const nav = u.el('nav', 'design-nav', header);
      for (const t of ['File', 'Edit', 'View', 'Help']) u.el('span', '', nav, t);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      u.el('div', 'note-icon', note, '');
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') {
          const copy = u.el('div', 'task-panel-copy', note);
          u.el('strong', 'task-panel-title', copy, 'Task details');
          u.el('p', 'food-task', copy, ctx.instruction);
        } else u.el('p', 'food-task', note, ctx.instruction);
      }
      u.el('span', 'basket-state', note).hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      for (const [label, cls] of [
        ['↶  Clear basket', 'clear-basket'],
        ['▣  Print order', 'print-order'],
        ['▤  Save order…', 'save-order'],
      ]) {
        const b = u.el('button', cls, footer, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      const orderSlot = u.el('div', 'order-slot', footer);
      const status = u.el('div', 'status-bar', shell);
      const ready = u.el('span', 'status-ready', status, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels =
          Array.isArray(content.END_LABELS) && content.END_LABELS.length
            ? content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const original = er.bool(0.5);
        const placement = original ? 'footer' : er.pick(['footer', 'header', 'header', 'status', 'status']);
        const submitLabel = labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || 'Submit';
        const otherLabels = labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
        const label = original || !otherLabels.length ? labelOf(submitLabel) : labelOf(er.pick(otherLabels));
        const endBtn = (parent, cls, text) => {
          const b = u.el('button', 'end-control ' + cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collide = cr.pick(pool);
        }
        if (collide) {
          const b = u.el('button', 'chrome-xtra', nav, collide);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
        if (placement === 'footer') submit = endBtn(footer, 'end-footer', label);
        else if (placement === 'header') submit = endBtn(nav, 'end-nav', label);
        else submit = endBtn(status, 'end-status', label);
      }
      const sb = u.el('span', 'sb-r', status, 'Num Lock');
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'status-toast', status, ctx.instruction);
        toast.dataset.role = 'instruction';
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
