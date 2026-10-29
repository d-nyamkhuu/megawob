(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-autocomplete-10',
    'brand': 'Travel Planner',
    'instruction': 'top',
    'briefTitle': 'Instructions',
  };
  const P = (n) => 'calc(var(--u)*' + n + ')';
  const ICONS = {
    new: '<path d="M8 3h16l8 8v26H8z" fill="#fff" stroke="#8a97a8" stroke-width="2"/><path d="M24 3v8h8" fill="#dde5ef" stroke="#8a97a8" stroke-width="2"/><path d="M13 18h14M13 23h14M13 28h14" stroke="#b5c0cf" stroke-width="2"/>',
    open: '<path d="M3 12h13l3 3h16v20H3z" fill="#e8b84a" stroke="#b8862a" stroke-width="2"/><path d="M8 20h32l-5 15H3z" fill="#fbd778" stroke="#b8862a" stroke-width="2"/>',
    save: '<rect x="5" y="5" width="30" height="30" rx="3" fill="#2f6fcb" stroke="#1a4a96" stroke-width="2"/><rect x="11" y="5" width="18" height="11" fill="#e6eefb"/><rect x="11" y="22" width="18" height="13" fill="#e6eefb"/><rect x="23" y="7" width="3" height="7" fill="#2f6fcb"/>',
    find: '<circle cx="17" cy="17" r="11" fill="#e8f2fb" stroke="#6b7684" stroke-width="3"/><path d="M25 25l12 12" stroke="#4b5360" stroke-width="5" stroke-linecap="round"/>',
    add: '<circle cx="16" cy="12" r="7" fill="#4d82c9"/><path d="M3 34c0-10 26-10 26 0z" fill="#4d82c9"/><rect x="26" y="22" width="12" height="12" rx="2" fill="#3fa84a"/><path d="M32 25v6M29 28h6" stroke="#fff" stroke-width="2.5"/>',
    edit: '<path d="M8 33l2-8L28 5l7 7L17 30z" fill="#f3b640" stroke="#a9701b" stroke-width="2"/><path d="M8 33l2-8 6 6z" fill="#f4dcb0"/><path d="M26 7l7 7" stroke="#d65a5a" stroke-width="3"/>',
    remove: '<path d="M8 8l24 24M32 8L8 32" stroke="#d52a24" stroke-width="8" stroke-linecap="round"/>',
    print:
      '<rect x="11" y="4" width="18" height="12" fill="#fff" stroke="#8a97a8" stroke-width="2"/><rect x="4" y="15" width="32" height="14" rx="3" fill="#8a929c" stroke="#5c6570" stroke-width="2"/><rect x="10" y="25" width="20" height="11" fill="#fff" stroke="#8a97a8" stroke-width="2"/>',
    email:
      '<rect x="4" y="8" width="32" height="24" fill="#fafbfd" stroke="#8a97a8" stroke-width="2"/><path d="M4 9l16 13L36 9" fill="none" stroke="#8a97a8" stroke-width="2"/>',
    cal: '<rect x="5" y="6" width="30" height="30" rx="2" fill="#fff" stroke="#4c75b8" stroke-width="2"/><rect x="5" y="6" width="30" height="8" fill="#4c75b8"/><path d="M10 19h4v4h-4zM18 19h4v4h-4zM26 19h4v4h-4zM10 27h4v4h-4zM18 27h4v4h-4zM26 27h4v4h-4z" fill="#6d93cf"/>',
    gear: '<circle cx="20" cy="20" r="10" fill="#8f9bab" stroke="#5f6b7a" stroke-width="3" stroke-dasharray="5 3"/><circle cx="20" cy="20" r="7" fill="#aab4c2" stroke="#5f6b7a" stroke-width="2"/><circle cx="20" cy="20" r="3" fill="#e9eef5"/>',
    user: '<circle cx="20" cy="12" r="8" fill="#4d82c9"/><path d="M5 38c0-14 30-14 30 0z" fill="#4d82c9"/>',
    globe:
      '<circle cx="20" cy="20" r="16" fill="#3d8fd6" stroke="#2a68a8" stroke-width="2"/><path d="M10 14c6-4 8 2 6 6s4 4 2 10M26 10c4 2 8 6 6 10" fill="#5fb15a" stroke="#5fb15a" stroke-width="4"/>',
    doc: '<path d="M9 3h16l7 7v27H9z" fill="#fff" stroke="#6d93cf" stroke-width="2"/><path d="M14 17h13M14 23h13M14 29h13" stroke="#6d93cf" stroke-width="2"/>',
    bed: '<path d="M3 12v22M37 22v12M3 28h34" stroke="#3f74b8" stroke-width="4"/><rect x="7" y="16" width="12" height="8" fill="#6d93cf"/><path d="M21 22h14v6H21z" fill="#6d93cf"/>',
    car: '<path d="M5 24l4-10h22l4 10v8H5z" fill="#3f74b8" stroke="#2a5594" stroke-width="2"/><path d="M11 16h18l3 7H8z" fill="#cfe0f5"/><circle cx="12" cy="32" r="4" fill="#223"/><circle cx="28" cy="32" r="4" fill="#223"/>',
    plane:
      '<path d="M3 22l30-14c3-1 4 1 2 3L19 25l-3 10-3-9z" fill="#3f74b8"/><path d="M16 20l-9 3" stroke="#3f74b8" stroke-width="2"/>',
  };
  Object.assign(ICONS, {
    open: '<path d="M2 8h13l4 4h17v24H2z" fill="url(#gold)" stroke="#ac8a42" stroke-width="1.3"/><path d="M4 14h30v16H4z" fill="#fff4c9" stroke="#e0bf6e"/><path d="M7 18h33l-6 18H2z" fill="url(#gold)" stroke="#ad8331" stroke-width="1.5"/>',
    save: '<rect x="2" y="3" width="36" height="35" rx="2" fill="url(#deepblue)" stroke="#174b88" stroke-width="1.5"/><path d="M8 4h24v15H8z" fill="url(#silver)" stroke="#244d7f"/><path d="M25 5h4v11h-4z" fill="#707783"/><path d="M8 25h24v13H8z" fill="url(#paper)" stroke="#244d7f"/><path d="M13 28h6v10h-6z" fill="#808c9e"/>',
    find: '<circle cx="16" cy="16" r="14" fill="url(#silver)" stroke="#657080" stroke-width="1.5"/><circle cx="16" cy="16" r="11" fill="url(#paper)" stroke="#5b626b" stroke-width="1.7"/><path d="M27 27l10 10" stroke="#565b61" stroke-width="6" stroke-linecap="round"/><path d="M26 26l10 10" stroke="#a6abb0" stroke-width="1.2"/>',
    edit: '<path d="M6 37l3-11L29 3q3-3 6 0l3 3q3 3 0 6L17 33z" fill="url(#gold)" stroke="#af8742" stroke-width="1.3"/><path d="M6 37l3-11 8 7z" fill="#eadbc0"/><path d="M6 37l2-6 4 4z" fill="#45505d"/><path d="M28 5l8 7" stroke="#df5d4b" stroke-width="7"/><path d="M26 9l8 7" stroke="#dbdfe3" stroke-width="3"/><path d="M3 39h32" stroke="#8394a1" opacity=".4"/>',
    doc: '<path d="M6 1h19l10 10v28H6z" fill="url(#paper)" stroke="#55799f" stroke-width="1.6"/><path d="M25 1v11h10" fill="url(#silver)" stroke="#55799f"/><path d="M11 17h19M11 22h19M11 27h19M11 32h19" stroke="#8c9fae" stroke-width="1.5"/>',
    bed: '<path d="M2 4v31M38 14v21" stroke="#356da3" stroke-width="3"/><rect x="3" y="20" width="35" height="10" rx="2" fill="url(#blue)" stroke="#356da3"/><rect x="7" y="8" width="9" height="10" rx="2" fill="url(#paper)" stroke="#356da3"/><path d="M19 10h13q6 0 6 7v3H19z" fill="url(#blue)" stroke="#356da3"/>',
    car: '<path d="M5 22l5-14h20l5 14" fill="url(#blue)" stroke="#356da3" stroke-width="1.5"/><path d="M12 11h16l3 10H9z" fill="url(#paper)" stroke="#356da3"/><rect x="2" y="21" width="36" height="13" rx="4" fill="url(#blue)" stroke="#356da3" stroke-width="1.6"/><path d="M6 33v5M34 33v5" stroke="#345c81" stroke-width="5" stroke-linecap="round"/><path d="M13 28h14" stroke="#2b5172" stroke-width="2"/><circle cx="8" cy="27" r="3" fill="#f0f7ff"/><circle cx="32" cy="27" r="3" fill="#f0f7ff"/>',
    add: '<circle cx="17" cy="11" r="8" fill="url(#blue)" stroke="#457198"/><path d="M3 34v-5c0-9 28-9 28 0v5z" fill="url(#blue)" stroke="#457198"/><path d="M29 20v7h-7v7h7v7h7v-7h7v-7h-7v-7z" transform="translate(-3 -4)" fill="url(#green)" stroke="#40802d" stroke-width="1.5"/>',
    user: '<circle cx="20" cy="11" r="9" fill="url(#blue)" stroke="#457198" stroke-width="1.5"/><path d="M3 38v-6c0-13 34-13 34 0v6z" fill="url(#blue)" stroke="#457198" stroke-width="1.5"/>',
    gear: '<path d="M17 2h6l1 5 4 2 5-3 4 5-3 4 1 4 5 1v6l-5 1-2 4 3 4-5 4-4-3-4 1-1 5h-6l-1-5-4-2-4 3-4-5 3-4-1-4-5-1v-6l5-1 2-4-3-4 5-4 4 3 4-1z" transform="translate(1 -1) scale(.94)" fill="url(#silver)" stroke="#65778b" stroke-width="1.5"/><circle cx="20" cy="20" r="7" fill="#edf5fc" stroke="#65778b" stroke-width="2"/>',
    remove:
      '<path d="M9 4l11 11L31 4l6 6-11 11 11 11-6 6-11-11L9 38l-6-6 11-11L3 10z" fill="url(#red)" stroke="#a84a36" stroke-width="1.3"/>',
    cal: '<rect x="3" y="4" width="34" height="35" rx="2" fill="url(#paper)" stroke="#527091" stroke-width="1.5"/><path d="M3 6h34v9H3z" fill="url(#blue)"/><path d="M10 2v8M30 2v8" stroke="#546679" stroke-width="2.5"/><path d="M9 19h5v5H9zM19 19h5v5h-5zM29 19h4v5h-4zM9 29h5v5H9zM19 29h5v5h-5zM29 29h4v5h-4z" fill="#7e9bc6"/>',
    plane:
      '<path d="M3 10l13 5L31 2c3-3 8-1 5 3L24 20l1 14-4 4-5-12-7 7-4-1 5-9-9-8z" fill="url(#blue)" stroke="#456d93" stroke-width="1.3"/>',
    globe:
      '<circle cx="20" cy="20" r="18" fill="url(#blue)" stroke="#456d93" stroke-width="1.5"/><path d="M8 7l7-2 3 5-4 5-4-1-2 4-5-2M22 5l8 4-3 4-4-2-2 5 5 5 7 2-4 9-5 3-3-9-5-4 2-5M7 28l6 3 1 5" fill="#e5f4ff"/><ellipse cx="20" cy="20" rx="9" ry="18" fill="none" stroke="#c5e1f3" stroke-width=".5"/>',
    print:
      '<rect x="10" y="2" width="20" height="15" fill="url(#paper)" stroke="#75879b"/><rect x="2" y="15" width="36" height="19" rx="3" fill="url(#silver)" stroke="#596775" stroke-width="1.5"/><path d="M4 18h32v10H4z" fill="#70777e"/><rect x="9" y="27" width="22" height="13" fill="url(#paper)" stroke="#75879b"/><path d="M13 31h14M13 34h14M13 37h14" stroke="#8da6bd"/>',
    email:
      '<rect x="1" y="9" width="38" height="27" fill="url(#paper)" stroke="#8392ad" stroke-width="1.5"/><path d="M2 10l18 17 18-17M2 35l12-12M38 35L26 23" fill="none" stroke="#8392ad" stroke-width="1.5"/>',
  });
  function icon(u, parent, name, cls) {
    const s = u.el('span', cls || 'ds-ico', parent);
    const defs =
      '<defs><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#ffe69c"/><stop offset=".5" stop-color="#f9d271"/><stop offset="1" stop-color="#dca734"/></linearGradient><linearGradient id="deepblue" x2="1" y2="0"><stop stop-color="#417bcc"/><stop offset=".5" stop-color="#8bb8ee"/><stop offset="1" stop-color="#245cb2"/></linearGradient><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#a9ddfa"/><stop offset=".45" stop-color="#64a7e3"/><stop offset="1" stop-color="#2375c7"/></linearGradient><linearGradient id="silver" x2="0" y2="1"><stop stop-color="#eaf2f8"/><stop offset=".5" stop-color="#bdcbd9"/><stop offset="1" stop-color="#8d9bad"/></linearGradient><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e4ebf2"/></linearGradient><linearGradient id="green" x2="0" y2="1"><stop stop-color="#b8e97d"/><stop offset="1" stop-color="#4eac36"/></linearGradient><linearGradient id="red" x2="0" y2="1"><stop stop-color="#fa9b85"/><stop offset="1" stop-color="#d32a19"/></linearGradient></defs>';
    s.innerHTML = '<svg viewBox="0 0 40 40" width="100%" height="100%">' + defs + ICONS[name] + '</svg>';
    return s;
  }
  const fallbackEnds = [
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
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const root = u.el('div', 'ds-win', document.body);
      const top = u.el('header', 'ds-top', root);
      const appi = u.el('span', 'ds-appicon', top);
      appi.innerHTML =
        '<svg viewBox="0 0 30 30"><path d="M8 24C3 10 8 3 15 3s12 7 7 21" fill="none" stroke="#fff5d4" stroke-width="3"/><circle cx="15" cy="12" r="5" fill="#fff2d2"/><path d="M6 26c0-12 18-12 18 0" fill="#faf4d5"/><path d="M11 20l4 7 4-7" fill="#66bbd7"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wb = u.el('span', 'ds-winbtns', top);
      u.el('i', '', wb, '–');
      u.el('i', '', wb, '□');
      u.el('i', 'x', wb, '×');
      const nav = u.el('nav', 'ds-menu', root);
      const office = u.el('span', 'ds-office', nav);
      office.innerHTML =
        '<svg viewBox="0 0 36 28"><path d="M8 5h16v18H8z" fill="#f6faff"/><path d="M11 2h9v6h-9zM12 10h8v2h-8zM12 14h8v2h-8z" fill="#91bce6"/><path d="M3 17l6-5 6 5h-4v7H7v-7z" fill="#fff"/><path d="M27 10h8l-4 5z" fill="#fff"/></svg>';
      ['Home', 'Insert', 'View', 'Tools'].forEach((t, i) => u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), nav, t));
      const rib = u.el('div', 'ds-ribbon', root);
      [
        [
          'File',
          [
            ['New', 'new'],
            ['Open', 'open'],
            ['Save', 'save'],
          ],
          [0, 0, 0],
        ],
        [
          'Manage',
          [
            ['Find\nTrips', 'find'],
            ['Add\nTraveler', 'add'],
            ['Edit\nDetails', 'edit'],
            ['Remove', 'remove'],
          ],
          [0, 0, 0, 0],
        ],
        [
          'Share',
          [
            ['Print', 'print'],
            ['Email', 'email'],
            ['View\nCalendar', 'cal'],
          ],
          [0, 0, 0],
        ],
        ['Settings', [['Options', 'gear']], [0]],
      ].forEach((g) => {
        const grp = u.el('div', 'ds-group g-' + g[0].toLowerCase(), rib);
        const row = u.el('div', 'ds-grow', grp);
        g[1].forEach((b) => {
          const btn = u.el('span', 'ds-rbtn', row);
          icon(u, btn, b[1]);
          u.el('span', '', btn, b[0]);
        });
        u.el('div', 'ds-gname', grp, g[0]);
      });
      const body = u.el('div', 'ds-body', root);
      const left = u.el('aside', 'ds-side ds-left', body);
      u.el('div', 'ds-sidehead', left, 'Quick Tools');
      [
        ['Dates', 'cal'],
        ['Travelers', 'user'],
        ['Destinations', 'globe'],
        ['Trip Options', 'doc'],
      ].forEach((t) => {
        const r = u.el('div', 'ds-sideitem', left);
        icon(u, r, t[1]);
        u.el('span', '', r, t[0]);
      });
      const content = u.el('div', 'ds-content', body);
      const right = u.el('aside', 'ds-side ds-right', body);
      u.el('div', 'ds-sidehead', right, 'Helpful Links');
      [
        ['Flight Schedules', 'doc'],
        ['Hotel Search', 'bed'],
        ['Car Rentals', 'car'],
      ].forEach((t) => {
        const r = u.el('div', 'ds-sideitem link', right);
        icon(u, r, t[1]);
        u.el('span', '', r, t[0]);
      });
      u.el('h2', 'ds-ptitle', content, 'Plan a Trip');
      const pb = u.el('div', 'ds-pbrand', content);
      icon(u, pb, 'plane');
      u.el('span', '', pb, 'Travel Planner');
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      if (mode === 'panel') {
        left.classList.add('panel-mode');
        const p = u.el('aside', 'ds-panel-note', left);
        u.el('div', 'ds-panel-title', p, 'Trip Instructions');
        u.el('div', 'ds-instruction', p, ctx.instruction);
      }
      // static form rows (decorative; the live widget sits in the stage above them)
      const rows = u.el('div', 'ds-rows', content);
      function lab(t, x, y) {
        const l = u.el('div', 'ds-flabel', rows, t);
        l.style.left = P(x);
        l.style.top = P(y);
        return l;
      }
      lab('Trip Type:', 81, 181);
      lab('From:', 81, 233);
      lab('Departure Date:', 81, 360);
      lab('Return Date:', 81, 426);
      lab('Passengers:', 81, 498);
      lab('Class:', 607, 498);
      const rt = u.el('div', 'ds-radio on', rows, 'Round Trip');
      rt.style.left = P(301);
      rt.style.top = P(180);
      const ow = u.el('div', 'ds-radio', rows, 'One Way');
      ow.style.left = P(467);
      ow.style.top = P(180);
      function box(x, y, w, t, cls) {
        const b = u.el('div', 'ds-fake ' + (cls || ''), rows, t);
        b.style.left = P(x);
        b.style.top = P(y);
        b.style.width = P(w);
        return b;
      }
      box(301, 231, 427, 'New York (JFK)', 'dd');
      box(301, 360, 427, '', 'date');
      box(301, 426, 427, 'MM/DD/YYYY', 'date ph');
      icon(u, box(728, 359, 50, '', 'calbtn'), 'cal');
      icon(u, box(728, 426, 50, '', 'calbtn'), 'cal');
      box(301, 498, 153, '1', 'dd');
      box(722, 500, 207, 'Economy', 'dd');
      const stage = u.el('main', 'ds-stage', content);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        u.el('button', 'ds-toast-close', note, '×').addEventListener('click', () => {
          note.style.visibility = 'hidden';
          env.log('note-close');
        });
      }
      u.el('div', 'ds-rule', content);
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Clear');
      cancel.type = 'button';
      const endR = ctx.rng.fork('chrome/end');
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : fallbackEnds;
      const ends = endBank.map(labelOf);
      const referenceEnd = endR.bool(0.5);
      const label = referenceEnd
        ? 'Submit'
        : endR.pick(
            ends.filter((x) => x.toLowerCase() !== 'submit').length
              ? ends.filter((x) => x.toLowerCase() !== 'submit')
              : ends,
          );
      const placementPick = endR.pick(['footer', 'footer', 'ribbon', 'link']);
      const placement = referenceEnd ? 'footer' : placementPick === 'link' ? 'link' : 'ribbon';
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
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
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const options = [...new Set(ends)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideR.pick(options);
      }
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(foot, 'ds-submit', label);
        if (placement === 'ribbon') submit = makeEnd(rib, 'ds-ribbon-submit', label);
        if (placement === 'link') submit = makeEnd(content, 'ds-end-link', label + ' ›');
      }
      if (collide) {
        const d = u.el('button', 'ds-pq', rib, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        if (!ctx.finish && placement === 'ribbon') d.classList.add('ds-pq-below');
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
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
