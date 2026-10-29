(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-food-08',
    'brand': 'Harbor Grille',
    'mode': 'side-left',
    'tokens': {
      'bg': '#cbd0d6',
      'panel': '#e9ecf0',
      'fg': '#101923',
      'accent': '#88a9cd',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'Good Food. Simple Times.',
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
      document.body.classList.toggle('finish-mode', !!ctx.finish);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const fork = u.el('div', 'sun-symbol', header);
      fork.innerHTML =
        '<svg viewBox="0 0 30 80" fill="none" stroke="#d8eafa" stroke-width="4" stroke-linecap="round"><path d="M5 3v24q0 12 10 12t10-12V3M12 3v25M19 3v25M15 39v38"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'window-controls', header, '−  ×');
      const nav = u.el('nav', 'design-nav', header, D.nav);
      u.el('span', 'sun-logo', nav, '▧ Sun');
      const body = u.el('div', 'design-body', shell);
      const rings = u.el('div', 'binder-rings', body);
      for (let i = 0; i < 12; i++) u.el('i', 'binder-ring', rings);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Order Briefing');
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
      // New choices stay on independent streams so the food and existing frame draws are unchanged.
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['header', 'link']);
      const endLabel = original ? 'Submit' : er.pick(labels);
      shell.dataset.end = ctx.finish ? 'none' : placement;
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'end-control end-' + placement,
          placement === 'footer' ? footer : shell,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool),
            decoy = u.el('button', 'notebook-xtra', shell, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      // Compact viewports use the original banner; wider pages have room for a note card.
      const compact = shell.clientWidth < 1260 || shell.clientHeight < 700;
      shell.dataset.note = compact && ['panel', 'toast'].includes(ctx.display) ? 'header' : ctx.display;
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
