(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-food-10',
    'brand': 'GoodBite Kitchen',
    'mode': 'side-left',
    'tokens': {
      'bg': '#cbd0d6',
      'panel': '#e9ecf0',
      'fg': '#101923',
      'accent': '#88a9cd',
      'font': 'Segoe UI,Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'File    Edit    View    Options    Help',
    'obstruction': null,
    'footer': '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'side-left instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const icon = u.el('div', 'sun-symbol', header);
      icon.innerHTML =
        '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><rect x="2" y="2" width="16" height="16"/><path d="M2 6h16M5 4h1m2 0h1m2 0h1M5 9h10v6H5z"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      const controls = u.el('div', 'window-controls', header);
      for (const [cls, path] of [
        ['min', 'M4 10h16'],
        ['max', 'M5 4h14v14H5z'],
        ['close', 'M5 4l14 14M19 4L5 18'],
      ]) {
        const c = u.el('span', cls, controls);
        c.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="' +
          path +
          '"/></svg>';
      }
      const tools = u.el('div', 'tool-col', shell);
      for (const [g, l] of [
        ['🍴', 'Food'],
        ['♥', 'Favourites'],
        ['⚙', 'Settings'],
      ]) {
        const t = u.el('div', 'tool-item' + (l === 'Food' ? ' on' : ''), tools);
        const gi = u.el('div', 'tool-g', t);
        gi.innerHTML =
          l === 'Food'
            ? '<svg viewBox="0 0 32 40" fill="currentColor"><path d="M5 2h2v10h2V2h2v10h2V2h2v13l-4 4v19H7V19l-4-4V2zm20 0h3v36h-5V23h-3V12c0-6 2-10 5-10z"/></svg>'
            : l === 'Favourites'
              ? '<svg viewBox="0 0 32 40" fill="currentColor"><path d="M16 32C-8 16 2 0 16 11 30 0 40 16 16 32z"/></svg>'
              : '<svg viewBox="0 0 32 40" fill="currentColor"><path d="M13 4h6l1 5 4 2 4-2 3 5-4 3v5l4 3-3 5-4-2-4 2-1 5h-6l-1-5-4-2-4 2-3-5 4-3v-5l-4-3 3-5 4 2 4-2z"/><circle cx="16" cy="20" r="5" fill="#304451"/></svg>';
        u.el('div', 'tool-l', t, l);
      }
      const nav = u.el('nav', 'design-nav', header, D.nav);
      u.el('span', 'sun-logo', nav, '▧ Sun');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Your task:');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      u.el(
        'p',
        'brief-help',
        note,
        'Use the menu on the right to select items and quantities. Add items to your basket. When you are ready, click Place order.',
      );
      const ns = u.el('p', 'brief-status', note);
      u.el('strong', '', ns, 'Note:');
      u.el('span', 'basket-state', ns, 'The basket is not complete yet.');
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
      const endRng = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS;
      const keepDefault = endRng.bool(0.5);
      const otherEndLabels = labels.filter(
        (x) =>
          String(typeof x === 'string' ? x : x.label || x.text || x.name || x)
            .trim()
            .toLowerCase() !== 'submit',
      );
      const endLabel = keepDefault ? 'Submit' : String(endRng.pick(otherEndLabels));
      const placement = keepDefault ? 'footer' : endRng.pick(['header', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collideLabel = null;
      if (collideRng.bool(0.3)) {
        const own = endLabel.trim().toLowerCase();
        const choices = labels
          .map((x) => String(typeof x === 'string' ? x : x.label || x.text || x.name || x))
          .filter((x) => x.trim().toLowerCase() !== own);
        if (choices.length) collideLabel = collideRng.pick(choices);
      }
      if (collideLabel) {
        const b = u.el('button', 'pqd-xtra', nav, collideLabel);
        b.type = 'button';
        b.style.cssText =
          'float:right;margin:0 8px;padding:2px 8px;border:1px solid #9aaaba;background:#d8e1e9;color:#26384a;font:inherit';
        b.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'end-control', footer, endLabel);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'link') {
          submit = u.el('a', 'end-control end-link', footer, endLabel + '  ›');
          submit.href = '#';
          submit.style.cssText =
            'display:flex;align-items:center;justify-content:center;text-decoration:none;color:#111;border:0;background:transparent;font:700 24px Arial';
          submit.setAttribute('aria-label', endLabel);
          submit.title = endLabel;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = u.el('button', 'end-control end-toolbar', nav, endLabel);
          submit.type = 'button';
          submit.style.cssText =
            'float:right;margin:0 10px;padding:2px 12px;height:34px;min-width:90px;border:1px solid #e5edf5;border-radius:0;background:#1976c9;color:#fff;font:600 16px Arial';
          submit.addEventListener('click', () => ctx.submit());
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
