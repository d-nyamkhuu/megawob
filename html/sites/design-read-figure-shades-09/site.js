(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-shades-09',
    title: 'Colour Match',
    bar: ['Files', 'Edit', 'View', 'Tools', 'Help'],
    rail: ['Tasks', 'Settings', 'Log'],
  };
  // Small outlined desktop sprites, drawn locally so the frame remains network-free.
  const sprites = {
    'ico-folder':
      '<path fill="#b9a71d" d="M3 7V3h12l3 4h15v26H3z"/><path fill="#fff45a" d="M3 8h30v25H3z"/><path stroke="#fff" d="M5 10h26M5 10v21"/>',
    'ico-edit':
      '<path fill="#fafafa" d="M6 1h23v32H6z"/><path d="M10 5h15M10 9h13M10 13h11M10 17h8M10 21h6M10 25h8"/><path fill="#d6a633" d="m16 25 1-6L31 5l4 4-14 14z"/><path fill="#eee" d="m16 25 1-6 4 4z"/><path stroke="#fff" d="m20 20 12-12"/>',
    'ico-view':
      '<path fill="#cf8838" d="m22 22 10 10 3-3-10-10z"/><path fill="#9edbef" d="M27 13a12 12 0 1 1-24 0 12 12 0 0 1 24 0z"/><circle cx="15" cy="13" r="9" fill="#b4e6ef"/><path stroke="#fff" d="M9 6 6 12v5M10 4h7"/><path fill="#689598" d="m7 25-5 7 3 2 6-8z"/>',
    'ico-tools':
      '<path fill="#c8c9c4" d="m23 2-7 7v7L2 29q-2 5 3 6l16-15 8-1 5-7-8 2-4-5 5-7z"/><path stroke="#fff" d="m5 29 14-13M19 7l2-3"/><circle cx="6" cy="30" r="1" fill="#333"/>',
    'ico-help':
      '<path fill="#1356c7" d="M8 5Q18-4 27 5q7 9-5 16l-2 5h-6v-7l8-7q3-7-6-6l-3 6-6-2z"/><path stroke="#7fb6ff" d="M11 5q9-5 14 2M17 19l6-6"/><path fill="#1765db" d="M14 30h7v6h-7z"/>',
    'ico-leaf':
      '<path fill="#09951d" d="m18 1 4 13 7-3 6 5-9 7-6-1-1 12h-3l-1-12-8 1-6-8 8-3 7 3z"/><path d="m18 7-1 24M5 16l12 4 13-4"/><path fill="#65d84e" d="m17 10-2 7 4 1 2-3z"/>',
    'ico-house':
      '<path fill="#59821e" d="M2 18h13v17H2z"/><path fill="#a8b656" d="M5 12h8v23H5z"/><path fill="#e6e7dc" d="m16 13 11 2 7 9v11H15z"/><path fill="#c4c5b7" d="m20 18 7 1 4 7-6 6-8-3z"/><path fill="#538e34" d="m10 15 3-10 5-4 5 5-2 7-6 3z"/><path fill="#d7bd74" d="m14 5 5-1 2 4-5 3z"/><path fill="#fff" d="m24 21 5 1-4 4 5 3-6 1-4-5z"/><path d="M8 19v12M4 25h9M20 16l-1 9M28 31v3"/>',
    'ri-tasks':
      '<path fill="#c4b641" d="M4 2h29v33H4z"/><path fill="#faf9dd" d="M7 5h23v27H7z"/><path d="M15 9h12M15 14h12M15 19h11M15 24h12M15 29h10"/><path fill="#e24d40" d="M9 8h3v3H9zM9 13h3v3H9zM9 18h3v3H9zM9 23h3v3H9zM9 28h3v3H9z"/>',
    'ri-log':
      '<path fill="#fafafa" d="M4 1h30v34H4z"/><path d="M9 7h18M9 12h18M9 17h18M9 22h18M9 27h12"/><path fill="#a4c9da" d="M28 1v5h6M28 29v6h6"/>',
    'ri-settings':
      '<path fill="#8999b0" d="m14 2 5-1 2 5 4 1 4-3 4 4-3 4 1 5 5 2-1 5-5 1-2 4 1 5-5 2-3-4h-5l-3 4-5-2 1-5-3-4-5-1-1-5 5-2 1-5-3-4 4-4 4 3 4-1z"/><circle fill="#d4d6d5" cx="18" cy="19" r="10"/><circle fill="#73acd0" cx="18" cy="19" r="6"/><path stroke="#fff" d="m9 12 5-4 7 1"/>',
    'ri-waste':
      '<path stroke="#fff" d="M0 36h36"/><path fill="#a5aab0" d="m7 6 3 27h17l3-27z"/><path fill="#e8e8dc" d="M5 3h27v5H5z"/><path d="M10 1h16v3M12 10l2 18M18 10v19M24 10l-2 18M10 15h18M10 23h17"/>',
  };
  function drawIcons(root) {
    for (const [cls, shape] of Object.entries(sprites))
      for (const node of root.querySelectorAll('.' + cls))
        node.innerHTML =
          '<svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#161711" stroke-width="1.5" stroke-linejoin="miter">' +
          shape +
          '</svg>';
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'riscos instruction-' + ctx.display;
      const u = ctx.util;
      const app = u.el('main', 'app', document.body);
      const bar = u.el('header', 'iconbar', app);
      const brand = u.el('div', 'ib-item brand', bar);
      u.el('i', 'ib-ico ico-house', brand);
      u.el('span', '', brand, 'RISC OS');
      const ico = { Files: 'ico-folder', Edit: 'ico-edit', View: 'ico-view', Tools: 'ico-tools', Help: 'ico-help' };
      for (const m of C.bar) {
        const it = u.el('div', 'ib-item mid', bar);
        u.el('i', 'ib-ico ' + ico[m], it);
        u.el('span', '', it, m);
      }
      u.el('div', 'ib-spacer', bar);
      u.el('i', 'ib-ico ico-leaf', bar);
      u.el('span', 'clock', bar, '10:24');
      const rail = u.el('nav', 'rail', app);
      C.rail.forEach((r, i) => {
        const b = u.el('div', 'rail-item' + (i === 0 ? ' on' : ''), rail);
        u.el('i', 'ri-ico ri-' + r.toLowerCase(), b);
        u.el('span', '', b, r);
      });
      u.el('div', 'rail-fill', rail);
      const w = u.el('div', 'rail-item waste', rail);
      u.el('i', 'ri-ico ri-waste', w);
      u.el('span', '', w, 'Waste');
      const win = u.el('section', 'win', app);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'tb-gad', tb, '−');
      u.el('span', 'tb-title', tb, C.title);
      u.el('span', 'tb-close', tb, '✕');
      const center = u.el('div', 'center mode-' + ctx.display, win);
      if (ctx.display === 'header') u.el('div', 'brief', center, ctx.instruction);
      if (ctx.display === 'panel') u.el('div', 'instruction-panel', center, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', win);
      u.el('span', 'sel', footer, 'Selected:  0');
      u.el('div', 'ft-spacer', footer);
      u.el('button', 'clear', footer, 'Clear').type = 'button';
      let submit = null;
      if (ctx.display === 'toast') u.el('div', 'toast-note', center, ctx.instruction);
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end'),
          labels = ctx.content.END_LABELS;
        const labelText = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
        const common = !r.bool(0.5),
          submitLabel = labels.find((x) => labelText(x).trim().toLowerCase() === 'submit');
        const alternatives = labels.filter((x) => labelText(x).trim().toLowerCase() !== 'submit');
        const label = common
          ? labelText(submitLabel || 'Submit')
          : labelText(r.pick(alternatives.length ? alternatives : labels));
        const placement = common ? 'footer' : r.pick(['footer', 'toolbar', 'link']);
        const makeEnd = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', ctx.submit);
          return b;
        };
        if (placement === 'footer') submit = makeEnd(footer, 'submit', label);
        else if (placement === 'link') submit = makeEnd(footer, 'submit end-link', label + ' ›');
        else {
          submit = makeEnd(tb, 'submit title-submit', label);
          tb.insertBefore(submit, tb.lastChild);
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = cr.pick(pool),
              where = cr.pick(['footer', 'footer', 'toolbar']);
            const parent = where === 'footer' ? footer : tb;
            const d = u.el('button', 'xtra', parent, text);
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      drawIcons(app);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
