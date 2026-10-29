(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-flight-04',
    'tokens': {
      'bg': '#f5efe2',
      'panel': '#f9f4ea',
      'fg': '#073047',
      'accent': '#1f5468',
      'font': "Georgia,'Bookman Old Style',serif",
      'line': '#d9cfbd',
      'muted': '#426474',
    },
    'obstruction': null,
  };
  const PLANE =
    '<svg viewBox="0 0 64 48" width="100%" height="100%"><path d="M5 26 10 24 21 28 31 25 19 4 25 3 43 22 55 18Q66 16 62 22L42 30 32 47 27 48 30 33 18 36 12 43 8 43 10 33Z" fill="currentColor"/></svg>';
  const USER =
    '<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="8" r="4.6" fill="currentColor"/><path d="M3.5 21c0-5 4-7.5 8.5-7.5s8.5 2.500 8.500 7.500z" fill="currentColor"/></svg>';
  const GEAR =
    '<svg viewBox="0 0 24 24" width="26" height="26"><path fill="currentColor" d="M10.300 2h3.400l.5 2.700 1.600.7 2.300-1.500 2.400 2.400-1.500 2.300.7 1.600 2.700.5v3.400l-2.700.5-.7 1.600 1.500 2.300-2.400 2.400-2.300-1.500-1.600.7-.5 2.700h-3.400l-.5-2.700-1.600-.7-2.300 1.500-2.400-2.400 1.500-2.300-.7-1.600L2 13.700v-3.400l2.700-.5.7-1.600-1.500-2.300 2.400-2.400 2.300 1.500 1.600-.7zM12 8.500a3.500 3.500 0 100 7 3.500 3.500 0 000-7z"/></svg>';
  const SCENE =
    '<svg class="scene" viewBox="0 0 400 560" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">' +
    '<circle cx="290" cy="82" r="30" fill="#ecc9b4" opacity=".7"/>' +
    '<g fill="#6f9aa6"><path transform="translate(55 95) scale(1.5)" d="M2 18 L8 16 L40 24 L90 4 L102 5 L88 28 L112 34 C122 38 118 42 110 42 L70 40 L50 56 L40 56 L48 38 L20 36 L8 42 L4 42 L6 32 Z" opacity=".95"/></g>' +
    '<path d="M0 372 L40 350 L120 336 L200 352 L270 322 L400 340 L400 420 L0 420 Z" fill="#9db8bc" opacity=".8"/>' +
    '<g fill="#7fa3ab"><circle cx="40" cy="352" r="26"/><circle cx="85" cy="368" r="30"/><circle cx="62" cy="330" r="20"/><circle cx="330" cy="348" r="26"/><circle cx="370" cy="360" r="24"/></g>' +
    '<path d="M358 160 L368 250 L346 250 Z" fill="#6f9aa6"/><rect x="350" y="250" width="14" height="110" fill="#7fa3ab"/>' +
    '<g fill="#a64550"><path d="M170 372 L190 345 L238 345 L258 372 Z"/><rect x="176" y="372" width="76" height="46"/><path d="M285 380 L305 350 L350 350 L370 380 Z"/><rect x="290" y="380" width="74" height="40"/></g>' +
    '<g fill="#e9e2d2"><rect x="196" y="384" width="9" height="12"/><rect x="218" y="384" width="9" height="12"/><rect x="306" y="390" width="9" height="12"/><rect x="330" y="390" width="9" height="12"/></g>' +
    '<rect x="0" y="420" width="400" height="140" fill="#b6ccd0" opacity=".55"/>' +
    '<g stroke="#8fb0b6" stroke-width="3" opacity=".7"><path d="M10 450h120M150 470h200M40 500h160M230 520h150M0 540h90"/></g></svg>';
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'ledger-air instruction-' + ctx.display;
      const W = ctx.size ? ctx.size.width : document.documentElement.clientWidth,
        H = ctx.size ? ctx.size.height : document.documentElement.clientHeight;
      let display = ctx.display || 'header';
      if ((display === 'panel' && W < 1260) || (display === 'toast' && (W < 1260 || H < 700))) display = 'header';
      document.body.className = 'ledger-air instruction-' + display;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const keep = er.bool(0.5);
      const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = keep ? 'Submit' : alternatives.length ? alternatives[er.int(0, alternatives.length - 1)] : 'Done';
      const placement = keep ? 'footer' : er.pick(['header', 'icon']);
      let collide = null;
      if (cr.bool(0.3)) {
        const choices = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (choices.length) collide = choices[cr.int(0, choices.length - 1)];
      }
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('span', 'brand-plane', header);
      logo.innerHTML = PLANE;
      u.el('div', 'design-brand', header, 'Ledger Air');
      const nav = u.el('nav', 'design-nav', header);
      for (const n of ['Flights', 'My Trips', 'Help']) u.el('span', '', nav, n);
      const headerTools = u.el('div', 'header-tools', header);
      if (collide) {
        const d = u.el('button', 'ledger-xtra', headerTools, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const ic = u.el('div', 'head-icons', header);
      u.el('span', '', ic).innerHTML = USER;
      u.el('span', '', ic).innerHTML = GEAR;
      let submit = null;
      const end = (parent, cls, text, accessible) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', accessible || label);
        b.title = accessible || label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish && placement === 'header') submit = end(headerTools, 'end-control head-end', label);
      if (!ctx.finish && placement === 'icon') submit = end(headerTools, 'end-control icon-end', '✓', label);
      const body = u.el('div', 'design-body', shell);
      const art = u.el('div', 'art', body);
      art.innerHTML = SCENE;
      const ledger = u.el('section', 'ledger', body);
      const note = u.el('div', 'task-note', ledger);
      note.dataset.role = 'instruction';
      note.classList.add('note-' + display);
      if (display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('main', 'stage', ledger);
      const footer = u.el('footer', 'design-footer', body);
      footer.classList.toggle('finish-mode', !!ctx.finish);
      u.el('h3', 'pv-title', footer, 'Trip Preview');
      const pv = u.el('div', 'pv-body', footer);
      const pi = u.el('span', 'pv-plane', pv);
      pi.innerHTML = PLANE;
      const pt = u.el('div', 'pv-text', pv);
      u.el('b', '', pt, 'No flight selected');
      u.el('span', '', pt, 'Choose a flight and click Book to see your trip details here.');
      const tot = u.el('div', 'pv-total', footer);
      u.el('span', '', tot, 'Total (est.)');
      u.el('b', '', tot, '$0');
      if (!ctx.finish && placement === 'footer') submit = end(footer, 'end-control', label);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
