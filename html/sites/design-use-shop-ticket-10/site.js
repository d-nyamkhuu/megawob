(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-10',
    'brand': 'Campus Caf\u00e9 \u2013 Food Ordering',
    'mode': 'side-left',
    'tokens': {
      'bg': '#cbd0d6',
      'panel': '#fbf8ee',
      'fg': '#2b2119',
      'accent': '#2f5f95',
      'font': 'Georgia,serif',
      'line': '#d7ccae',
      'muted': '#6b604d',
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
      const note = u.el('section', 'task-note', shell);
      note.dataset.role = 'instruction';
      const nh = u.el('div', 'note-head', note);
      nh.innerHTML =
        '<svg viewBox="0 0 40 40" fill="none" stroke="#4a3a2c" stroke-width="1.5"><circle cx="20" cy="20" r="17"/><circle cx="20" cy="20" r="11"/><path d="M20 3v34M3 20h34M8 8l24 24M32 8L8 32" stroke-width="1"/><path d="M20 6l3 14-3 14-3-14z" fill="#4a3a2c"/></svg>';
      u.el('h2', '', nh, 'Your Task');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const sk = u.el('div', 'note-sketch', note);
      sk.innerHTML = '<img src="sites/design-use-shop-ticket-10/assets/landscape.svg" alt="">';
      const hand = u.el('div', 'note-hand', note);
      hand.innerHTML = 'Good journeys<br>lead to great days.';
      if (ctx.display === 'hidden' || ctx.display === 'header') note.hidden = true;
      const book = u.el('div', 'book', shell);
      const header = u.el('header', 'design-header', book);
      const br = u.el('div', 'design-brand', header);
      br.innerHTML =
        '<svg viewBox="0 0 64 48" fill="none" stroke="#f7efda" stroke-width="1.5"><g transform="rotate(-15 32 24)"><path d="M8 8h47l3 9-4 4 4 5-3 12H8l-3-9 4-4-4-6z" fill="#5c4b35" stroke="#655039" stroke-width="3"/><path d="M11 11h41l2 7-3 4 3 5-2 8H11l-2-7 3-5-3-5z"/><ellipse cx="32" cy="23" rx="13" ry="6"/><path d="M22 26l20-7" stroke-width="3"/></g></svg>';
      br.append('Bus Tickets');
      u.el('div', 'tagline', header, 'Same roads. A brighter tomorrow.');
      const hm = u.el('img', 'header-mountain', header);
      hm.src = 'sites/design-use-shop-ticket-10/assets/landscape.svg';
      hm.alt = '';
      const stage = u.el('main', 'stage', book);
      const footer = u.el('footer', 'design-footer', book);
      const fb = u.el('div', 'foot-bus', footer);
      fb.innerHTML = '<img src="sites/design-use-shop-ticket-10/assets/bus-sketch.svg" alt="">';
      {
        const b = u.el('button', 'clear-sel', footer, 'Clear Selection');
        b.type = 'button';
      }
      const ts = u.el('div', 'tool-strip', book);
      ts.innerHTML =
        '<span class="on"><svg viewBox="0 0 24 24" fill="currentColor"><g transform="rotate(-25 12 12)"><path d="M3 5h18v4a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4z"/><path d="M9 9h6v4H9z" fill="#6c4c2e"/></g></svg></span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/></svg></span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M12 14h2M17 14h1M7 18h2M12 18h2M17 18h1"/></svg></span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 1h6l1 4 3-1 3 5-3 3 3 3-3 5-3-1-1 4H9l-1-4-3 1-3-5 3-3-3-3 3-5 3 1z" fill="currentColor" stroke="#392619" stroke-width=".6"/><circle cx="12" cy="12" r="4" fill="#392619" stroke="currentColor"/></svg></span>';
      const bank = (key, fallback) =>
        ctx.content && Array.isArray(ctx.content[key]) && ctx.content[key].length ? ctx.content[key] : fallback;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endR = ctx.rng.fork('chrome/end');
      const endLabels = bank('END_LABELS', ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']);
      const original = endR.bool(0.5);
      const placement = ctx.finish ? null : original ? 'footer' : endR.pick(['header', 'link']);
      const label = original
        ? 'Submit'
        : labelOf(endR.pick(endLabels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit')));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const opts = [...new Set(endLabels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (opts.length) collide = { label: collideR.pick(opts), where: collideR.pick(['header', 'header', 'footer']) };
      }
      const decoyR = ctx.rng.fork('chrome/decoys');
      const filler = decoyR.sample(
        bank('DECOY_LABELS', [
          'Help',
          'Feedback',
          'Preview',
          'Save draft',
          'Reset view',
          'Share',
          'Export',
          'History',
        ]).map(labelOf),
        decoyR.int(0, 2),
      );
      const decoyBtn = (parent, text, colliding) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', colliding ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (ctx.display === 'header') {
        const hi = u.el('div', 'header-instruction', header, ctx.instruction);
        hi.dataset.role = 'instruction';
      }
      if (placement === 'footer') submit = makeEnd(footer, 'end-control', label);
      else if (placement === 'header') submit = makeEnd(header, 'end-control header-end', label);
      else if (placement === 'link') submit = makeEnd(footer, 'end-link', label + ' ›');
      for (const d of filler) decoyBtn(footer, d, false);
      if (collide) {
        decoyBtn(collide.where === 'header' ? header : footer, collide.label, true);
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
