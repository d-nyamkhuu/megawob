(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-search-08',
    'brand': 'ShopEase',
    'mode': 'side-left',
    'tokens': {
      'bg': '#f3f4f7',
      'panel': '#ffffff',
      'fg': '#1b1b1f',
      'accent': '#0f6cdf',
      'font': "'Segoe UI',Calibri,Carlito,Arial,sans-serif",
      'line': '#e3e4e8',
      'muted': '#5c6068',
    },
    'obstruction': null,
    'footer': '',
  };
  const BAG =
    '<svg viewBox="0 0 32 36" width="32" height="36"><defs><linearGradient id="bag-blue"><stop stop-color="#00b4ff"/><stop offset="1" stop-color="#0070ed"/></linearGradient></defs><path d="M3 11h25v21H3z" rx="3" fill="url(#bag-blue)"/><path d="M10 12V8a6 6 0 0 1 12 0v4" fill="none" stroke="#0074ed" stroke-width="2.4"/><path d="M12 13v19M23 12l-2 20" stroke="#d6f5ff" stroke-width="1.3"/><path d="M4 12h23v5H4z" fill="#0780ee" opacity=".6"/></svg>';
  const USER =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#222" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7z"/></svg>';
  const GEAR =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#151b24" stroke-width="1.6" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M10 2h4l.6 3 2 .9 2.7-1.1 2 3.4-2.2 1.9.2 2.2 2.2 1.8-2 3.4-2.8-.9-1.8 1.2-.7 3H10l-.6-3-2-1-2.7 1-2-3.4 2.2-1.9-.2-2.2L2.5 8.5l2-3.4 2.8.9 1.9-1z"/></svg>';
  const FILTERS = [
    ['Category', ["Men's", "Women's", 'Unisex']],
    ['Size', ['6', '7', '8', '9', '10', '11', '12']],
    ['Brand', ['Nike', 'Adidas', 'New Balance', 'ASICS', 'Brooks', 'HOKA', 'Puma']],
  ];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      let display = ctx.display || 'header';
      if ((display === 'panel' && window.innerWidth < 1260) || (display === 'toast' && window.innerHeight < 700))
        display = 'header';
      document.body.className = 'side-left instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML = BAG;
      u.el('span', '', brand, D.brand);
      u.el('span', 'hdr-gap', header);
      const endRng = ctx.rng.fork('chrome/end'),
        endBank = ctx.content && ctx.content.END_LABELS;
      const endWords = (
        Array.isArray(endBank) && endBank.length
          ? endBank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      ).map(labelOf);
      let placement, endLabel;
      if (endRng.bool(0.5)) {
        placement = 'task';
        endLabel = 'Submit';
      } else {
        placement = endRng.pick(['header', 'footer', 'link']);
        endLabel = endRng.pick(endWords);
      }
      const makeEnd = (parent, cls, label, tag = 'button') => {
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
      const headerTools = u.el('div', 'chrome-tools', header);
      const si = u.el('span', 'hdr-link', header);
      si.innerHTML = USER + '<span>Sign in</span>';
      const se = u.el('span', 'hdr-link', header);
      se.innerHTML = GEAR + '<span>Settings</span>';
      const body = u.el('div', 'design-body', shell);
      const left = u.el('aside', 'sp-left', body);
      u.el('h3', '', left, 'Filters');
      for (const [t, items] of FILTERS) {
        u.el('h4', '', left, t);
        for (const it of items) {
          const l = u.el('div', 'sp-check', left);
          u.el('i', '', l);
          u.el('span', '', l, it);
        }
      }
      u.el('a', 'sp-clear', left, 'Clear all filters');
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (display === 'header') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('main', 'stage', body);
      const right = u.el('aside', 'sp-right', body);
      const c1 = u.el('div', 'sp-card', right);
      u.el('h3', '', c1, 'Sort by');
      const sel = u.el('div', 'sp-select', c1);
      u.el('span', '', sel, 'Relevance');
      u.el('span', '', sel, '⌄');
      const c2 = u.el('div', 'sp-card', right);
      u.el('h3', '', c2, 'Price range');
      const sl = u.el('div', 'sp-slider', c2);
      u.el('b', '', sl);
      u.el('b', '', sl);
      const pl = u.el('div', 'sp-plab', c2);
      u.el('span', '', pl, '$0');
      u.el('span', '', pl, '$300+');
      const c3 = u.el('div', 'sp-card sp-task', right);
      u.el('h3', '', c3, 'Your task');
      if (display === 'panel') u.el('p', 'instruction-panel', c3, ctx.instruction);
      const visibleInstruction = ctx.display === 'hidden' ? '' : ctx.plainInstruction || ctx.instruction;
      const query = (visibleInstruction.match(/["“]([^"”]+)["”]/) || [])[1];
      const rank = visibleInstruction.match(/(?:#|result\s+)(\d+)|\b(\d+)(?:st|nd|rd|th)\b/i) || [];
      const ordinal = rank[1] || rank[2];
      const suffix = ordinal
        ? /1$/.test(ordinal) && ordinal !== '11'
          ? 'st'
          : /2$/.test(ordinal) && ordinal !== '12'
            ? 'nd'
            : /3$/.test(ordinal) && ordinal !== '13'
              ? 'rd'
              : 'th'
        : '';
      [
        query ? 'Search for "' + query + '"' : 'Enter your search',
        ordinal ? 'Find the ' + ordinal + suffix + ' search result' : 'Find the requested result',
        ordinal ? 'Click the ' + ordinal + suffix + ' result' : 'Click the requested result',
      ].forEach((s, i) => {
        const r = u.el('div', 'sp-step' + (i ? '' : ' on'), c3);
        u.el('b', '', r, String(i + 1));
        u.el('span', '', r, s);
      });
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'task') submit = makeEnd(c3, 'end-control', endLabel);
        else if (placement === 'link') submit = makeEnd(c3, 'end-link', endLabel + ' ›', 'a');
        else if (placement === 'header') submit = makeEnd(headerTools, 'end-control end-header', endLabel);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const candidates = [
          ...new Set(endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (candidates.length)
          collide = { label: collideRng.pick(candidates), where: placement === 'header' ? 'footer' : 'header' };
      }
      if (collide && collide.where === 'header') {
        const decoy = u.el('button', 'end-xtra', headerTools, collide.label);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
      }
      if (display === 'toast') {
        const toast = u.el('section', 'instruction-toast-card', shell);
        u.el('p', '', toast, ctx.instruction);
      }
      const tb = u.el('footer', 'design-footer', shell);
      tb.innerHTML =
        '<svg class="taskbar-icon" viewBox="0 0 32 32"><defs><linearGradient id="win-blue" x2="1" y2="1"><stop stop-color="#00d1ff"/><stop offset="1" stop-color="#006de5"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="2" fill="url(#win-blue)"/><path d="M16 2v28M2 16h28" stroke="#b9e9ff"/></svg><svg class="taskbar-icon" viewBox="0 0 32 32" fill="none" stroke="#303744" stroke-width="2.2"><circle cx="14" cy="13" r="10"/><path d="M21 21l8 9M7 21l-6 8"/></svg><svg class="taskbar-icon" viewBox="0 0 32 32"><path d="M2 9V5h11l3 4" fill="#efa800"/><rect x="2" y="9" width="28" height="21" rx="2" fill="#ffcc37"/><path d="M2 16h28v12H2z" fill="#ffc21b"/><path d="M9 23h14v7H9z" fill="#078be5"/></svg><svg class="taskbar-icon" viewBox="0 0 32 32"><defs><linearGradient id="edge-blue" x2="1" y2="1"><stop stop-color="#10c8e6"/><stop offset="1" stop-color="#0761db"/></linearGradient></defs><circle cx="16" cy="16" r="15" fill="url(#edge-blue)"/><path d="M5 18C4 5 22 0 28 10c3 6-3 12-9 10 6-6-1-10-6-7-3 2-3 6-1 8" fill="#35cf8b"/><path d="M4 17c1 10 19 17 26 4-4 4-16 4-17-2-1-6 8-8 11-4-3-8-16-7-20 2" fill="#006bc5"/><path d="M12 18c1 6 9 7 16 4-5 8-17 5-20 0" fill="#004b9a"/></svg><svg class="taskbar-icon" viewBox="0 0 32 32"><path d="M10 9V5h12v4" fill="none" stroke="#109dec" stroke-width="2"/><rect x="2" y="9" width="28" height="22" rx="3" fill="#0060af"/><path d="M2 9h28v4H2z" fill="#168adb"/><path d="M11 16h5v5h-5z" fill="#ffbf00"/><path d="M18 16h5v5h-5z" fill="#00b1ff"/><path d="M11 23h5v5h-5z" fill="#f35e33"/><path d="M18 23h5v5h-5z" fill="#88c400"/></svg><div class="tb-tray"><svg viewBox="0 0 80 24" fill="none" stroke="#323b44" stroke-width="1.6"><path d="M3 14l6-6 6 6M29 7q9-6 18 0M32 10q6-4 12 0M35 13q3-2 6 0M37 17h2M59 7h15v11H59zM75 10h3v5"/><path d="M62 10h9v5h-9z" fill="#616872"/></svg></div><div class="tb-clock">10:24 AM<br>3/3/2024</div>';
      // Reuse only the five application-icon crops, never the reference's UI or task text.
      tb.querySelectorAll('.taskbar-icon').forEach((icon, i) => {
        icon.setAttribute('viewBox', [707, 765, 820, 875, 931][i] + ' 898 36 36');
        icon.innerHTML =
          '<image href="sites/design-use-shop-search-08/assets/shoe-source.webp" width="1672" height="941"/>';
      });
      if (!ctx.finish && placement === 'footer') submit = makeEnd(tb, 'end-control end-footer', endLabel);
      if (collide && collide.where === 'footer') {
        const decoy = u.el('button', 'end-xtra footer-xtra', tb, collide.label);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
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
