(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-03',
    'brand': 'Contact Book',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': 'Contacts|Calendar|Notes|Settings',
    'menu': '',
    'briefTitle': 'Instructions',
  };
  // Small, deliberately stepped clip-art badges, shared with the contact rows.
  const art = {
    sunflower:
      '<path fill="#35782d" d="M31 36h5v25h-5zM16 46h8l8 7v5H22zM36 48l12-7h7l-9 14H36z"/><path fill="#f8bd23" d="M27 4h9v8l7-6 7 6-5 8h10v9h-9l6 8-7 7-8-7v10h-9V37l-8 7-7-7 7-8H9v-9h10l-7-7 7-7 8 7z"/><path fill="#915322" d="M25 15h14l6 6v11l-7 7H25l-7-7V21z"/><path fill="#472e13" stroke="none" d="M25 21h4v4h-4zm10 0h4v4h-4zm-5 7h4v4h-4zm-6 4h3v3h-3zm12-1h3v4h-3z"/>',
    house:
      '<path fill="#467d42" d="M2 48h6v-9h8v9h39v-8h8v10h5v12H2z"/><path fill="#e9e8d9" d="M16 27h37v33H16z"/><path fill="#c5c9c4" d="M39 27h14v33H39z"/><path fill="#e52621" d="M10 31v-5h5v-5h5v-5h5v-5h14V5h7v9h5v6h5v6h5v5z"/><path fill="#7c0908" d="M40 14h6v6h5v6h5v5H39z"/><path fill="#315e84" d="M22 34h7v10h-7zm19 0h6v10h-6zM31 46h8v15h-8z"/><path fill="#f4f1d9" d="M24 35h2v7h-2zm19 0h2v7h-2z"/><path fill="#283626" d="M10 60h49v4H10z"/>',
    flower:
      '<path fill="#46863c" d="M31 28h4v32h-4zM16 43h8v5h8v5h-9v-4h-7zM35 44h7v-6h7v9h-7v5h-7z"/><path fill="#7d38ac" d="M25 9h6V4h7v5h6v8h-5v7H28v-6h-6v-7zM9 28h6v-5h7v5h5v9h-5v5h-9v-5H7z"/><path fill="#bd83e2" d="M27 9h5v7h-7zm10 0h5v7h-5zM11 28h5v7h-5z"/><path fill="#f6d44c" d="M31 13h6v6h-6zM16 31h5v6h-5z"/><path fill="#405f2a" d="M22 60h23v3H22z"/>',
    sun: '<path fill="#ffd52e" d="M24 6h5v8h-5zm0 44h5v8h-5zM1 30h8v5H1zm45 0h8v5h-8zM8 10h5v7H8zm34 0h5v7h-5zM8 46h5v7H8zm34 0h5v7h-5z"/><path fill="#ffe142" d="M18 18h20v5h5v18h-5v6H18v-6h-5V23h5z"/><path fill="#ffc32b" stroke="none" d="M33 22h5v18h-5v6H20v-5h10v-7h3z"/>',
    book: '<g transform="rotate(-12 35 34)"><path fill="#e6d5a3" d="M12 9h44v51H12z"/><path fill="#343456" d="M9 5h46v49H9z"/><path fill="#9391d2" d="M17 4h42v49H17z"/><path fill="#242957" d="M9 5h10v49H9z"/><path fill="#ffe89e" d="M28 17h22v26H28z"/><path fill="#98743b" stroke="none" d="M36 22h8v5h-2v7h4v5H32v-5h4v-5h-2v-5z"/><path stroke="#eac546" d="M6 12h10M6 22h10M6 32h10M6 42h10M6 50h10"/></g>',
    note: '<path fill="#c2c0a6" d="M12 9h40v51H12z"/><path fill="#fffef4" d="M16 7h35v50H16z"/><path fill="#c4c9d4" d="M20 3h4v10h-4zm10 0h4v10h-4zm10 0h4v10h-4z"/><path stroke="#2c405d" stroke-width="2" d="M22 20h22M22 28h22M22 36h16M22 44h12"/><path fill="#ffdc39" d="M35 44l20-24 5 5-21 23-7 3z"/><path fill="#e7a21b" d="M55 20l4-4 5 5-4 4z"/>',
    tree: '<path fill="#93643b" d="M28 40h10v20h6v3H22v-3h6z"/><path fill="#298b1e" d="M27 4h11v7h7v9h7v10h5v12h-9v7H18v-7H9V31h6v-9h6V11h6z"/><path fill="#54b035" stroke="none" d="M27 12h7v7h-7zm-7 16h6v8h-6zm17-4h6v8h-6z"/>',
    cat: '<path fill="#dfb679" d="M17 11l12 8h14l10-8v29l-6 10H22l-8-11z"/><path fill="#fff3ce" d="M23 31h25v13H23zM21 49h25v11H21z"/><path fill="#222" d="M24 24h4v5h-4zm17 0h4v5h-4zM31 35h7v4h-7z"/>',
    bike: '<g fill="none" stroke-width="3"><circle cx="16" cy="45" r="12"/><circle cx="51" cy="45" r="12"/><path d="M16 45l13-22 11 22H16l23-17 12 17M24 21h11M39 16h10v7"/></g>',
    openbook:
      '<path fill="#aa2827" d="M7 15h23l5 4 5-4h23v43H7z"/><path fill="#fffbe7" d="M10 9h17l8 5 8-5h17v42H43l-8 5-8-5H10z"/><path fill="none" d="M35 15v39M15 19h11M15 27h11M15 35h11M43 19h11M43 27h11M43 35h11"/>',
    music:
      '<path fill="#7053dd" d="M25 14l29-7v41h-7V20l-16 4v31h-7V14z"/><ellipse fill="#7053dd" cx="19" cy="54" rx="9" ry="6"/><ellipse fill="#7053dd" cx="43" cy="47" rx="9" ry="6"/>',
    paw: '<g fill="#111"><ellipse cx="32" cy="45" rx="15" ry="12"/><ellipse cx="15" cy="28" rx="6" ry="9"/><ellipse cx="27" cy="18" rx="6" ry="9"/><ellipse cx="41" cy="18" rx="6" ry="9"/><ellipse cx="53" cy="28" rx="6" ry="9"/></g>',
  };
  const detail = {
    house:
      '<g stroke="none"><path fill="#fff" d="M18 32h3v24h-3zM30 34h5v8h-5z"/><path fill="#a5b7c6" d="M42 48h5v9h-5zM19 59h7v3h-7z"/><path fill="#aa110d" d="M23 16h4v5h-4zm6-5h4v5h-4zm18 10h5v4h-5z"/><path fill="#ff7973" d="M17 24h4v4h-4zm5-6h4v4h-4z"/><path fill="#73a958" d="M5 49h5v5H5zm53-1h4v7h-4z"/><path fill="#6e7275" d="M27 62h18v3H27z"/></g>',
    flower:
      '<g stroke="none"><path fill="#d7a4ed" d="M26 8h3v5h-3zm8-3h3v5h-3zm5 8h3v4h-3zM9 29h3v4H9zm9-5h3v4h-3z"/><path fill="#61237b" d="M27 19h4v4h-4zm10 0h3v4h-3zM20 35h4v4h-4z"/><path fill="#91a64b" d="M32 30h2v10h-2zM20 46h5v3h-5zm20-3h5v3h-5z"/></g>',
    tree: '<g stroke="none"><path fill="#216215" d="M39 14h5v9h5v10h5v7H43v6H33v-6h6v-8h-4v-5h4z"/><path fill="#73b542" d="M28 8h6v4h-6zM23 20h6v4h-6zM16 32h7v5h-7z"/><path fill="#135013" d="M24 42h4v4h-4zm19-7h4v5h-4z"/><path fill="#c1945e" d="M30 50h3v9h-3z"/></g>',
    cat: '<path stroke="#76502d" fill="none" d="M18 17l5 6M47 23l4-7M19 28l6 3M49 28l-6 3M18 36h7M44 36h7M22 52l5 4M43 52l-4 4"/><path fill="#fff1cc" stroke="none" d="M27 22h5v8h-5zm9 0h5v8h-5zM25 56h5v4h-5zm11 0h5v4h-5z"/><path fill="#171717" stroke="none" d="M28 25h3v4h-3zm9 0h3v4h-3z"/>',
    sun: '<path fill="#ffe04a" stroke-width="1" d="M15 3h3v6h-3zM37 5h3v6h-3zM4 19h6v3H4zM46 19h6v3h-6zM2 42h6v3H2zM46 43h6v3h-6zM15 54h3v6h-3zM36 54h3v6h-3z"/><path fill="#fff785" stroke="none" d="M19 20h9v3h-6v8h-4z"/>',
    book: '<g transform="rotate(-12 35 34)"><path stroke="#a6a6bc" d="M13 55h37M16 58h34"/><path fill="#b0ace4" stroke="none" d="M20 6h35v3H20z"/><path fill="#515286" stroke="none" d="M55 10h3v40h-3z"/><path stroke="#0c1026" d="M7 17h7M7 27h7M7 37h7M7 47h7"/></g>',
    note: '<path stroke="#acb7cd" d="M19 16v35M49 10v43M18 54h29"/><path stroke="#55564d" d="M20 6v6M30 6v6M40 6v6"/><path stroke="#fff5a7" d="M38 43l17-20"/>',
  };
  env.communityBadge = (kind) =>
    '<svg viewBox="' +
    ({ flower: '4 0 48 68', sun: '0 0 56 64', tree: '5 0 56 68', note: '8 0 58 65' }[kind] || '0 0 70 68') +
    '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="image-rendering:pixelated;shape-rendering:crispEdges" fill="none" stroke="#161913" stroke-width="1.7" stroke-linejoin="miter">' +
    (art[kind] || art.flower) +
    (detail[kind] || '') +
    '</svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('div', 'ds-left', body);
      const right = u.el('div', 'ds-right', body);
      const badge = (parent, kind, cls) => {
        const b = u.el('span', 'ds-badge ' + (cls || ''), parent);
        b.innerHTML = env.communityBadge(kind);
        return b;
      };
      const head = u.el('div', 'ds-mast', left);
      const hl = u.el('div', 'ds-mast-l', head);
      badge(hl, 'house');
      u.el('span', '', hl, 'Home\nSweet\nHome');
      badge(head, 'flower', 'ds-flower');
      const mc = u.el('div', 'ds-mast-c', head);
      u.el('div', 'ds-mast-t', mc, 'Riverside Village Online');
      u.el('div', 'ds-mast-s', mc, 'Neighbors ~ Friends ~ A Brighter Tomorrow');
      badge(head, 'flower', 'ds-flower');
      const hr = u.el('div', 'ds-mast-r', head);
      badge(hr, 'sun');
      u.el('span', '', hr, 'Good\nPeople\nStronger\nCommunities');
      const nav = u.el('nav', 'ds-nav', left);
      ['Home', 'About Our Community', 'Photo Gallery', 'Contact Book'].forEach((t, i) => {
        if (i) u.el('span', 'ds-sep', nav, '|');
        u.el('span', i === 3 ? 'ds-cur' : '', nav, t);
      });
      const ph = u.el('div', 'ds-ph', left);
      badge(ph, 'book', 'ds-ph-i');
      const pt = u.el('div', '', ph);
      u.el('div', 'ds-ph-t', pt, 'Community Contact Book');
      u.el('div', 'ds-ph-s', pt, 'Friends, neighbors and local contacts');
      const display = ctx.display || 'header';
      const stage = u.el('main', 'ds-stage', left);
      const tag = u.el('div', 'ds-tag', left);
      badge(tag, 'tree');
      u.el('span', '', tag, 'A Friendlier Neighborhood for a Brighter Tomorrow');
      badge(tag, 'tree');
      let note = null;
      if (display !== 'hidden') {
        note = u.el('aside', 'ds-note-box ds-note-' + display, right);
        if (display === 'panel') u.el('div', 'ds-note-heading', note, 'Instructions');
        badge(note, 'note', 'ds-note-i');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const placements = ['link', 'bottom', 'top', 'bottom'];
      const placement = ctx.finish ? null : endRng.pick(placements);
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
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
      const label = endRng.bool(0.5)
        ? 'Submit'
        : endRng.pick(endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit'));
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish && placement === 'link') submit = endButton(nav, 'ds-end-link');
      if (!ctx.finish && placement === 'top') submit = endButton(right, 'ds-submit ds-submit-top');
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const choices = endLabels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          .filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (choices.length) collide = collideRng.pick(choices);
      }
      if (collide) {
        const b = u.el('button', 'ds-pq', nav, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish && placement === 'bottom') submit = endButton(right, 'ds-submit');
      u.el('div', 'ds-fill', right);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
