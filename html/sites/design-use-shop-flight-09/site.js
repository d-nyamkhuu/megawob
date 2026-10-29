(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-flight-09',
    brand: 'SkyFind',
    tokens: {
      bg: '#ffffff',
      panel: '#ffffff',
      fg: '#222a33',
      accent: '#2a78c2',
      font: "'Helvetica Neue',Helvetica,Arial,sans-serif",
      line: '#cfd5db',
      muted: '#6b7480',
    },
    nav: ['Flights', 'Hotels', 'Cars', 'My Trips'],
    obstruction: null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        endR = ctx.rng.fork('chrome/end'),
        placeR = ctx.rng.fork('chrome/end-placement'),
        collideR = ctx.rng.fork('chrome/collide');
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && (window.innerWidth < 1260 || window.innerHeight < 700))
        display = 'header';
      document.body.className = 'instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body),
        header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      const nav = u.el('nav', 'design-nav', header);
      for (const n of D.nav) u.el('span', '', nav, n);
      const util = u.el('div', 'design-util', header);
      u.el('span', '', util, 'Help');
      u.el('i', '', util);
      u.el('span', '', util, 'Sign In');
      const body = u.el('div', 'design-body', shell),
        wb = u.el('div', 'workbench', body);
      const note = u.el('section', 'task-note', wb);
      note.dataset.role = 'instruction';
      if (display === 'header') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('main', 'stage', wb),
        insp = u.el('aside', 'inspector', body);
      u.el('h3', 'insp-h', insp, 'Trip Details');
      if (display === 'panel') {
        const p = u.el('section', 'episode-instruction panel-instruction', insp);
        p.dataset.role = 'instruction';
        u.el('b', '', p, 'Task instructions');
        u.el('p', '', p, ctx.instruction);
      } else if (display === 'toast') {
        const p = u.el('section', 'episode-instruction toast-instruction', insp);
        p.dataset.role = 'instruction';
        u.el('b', '', p, 'Task');
        u.el('p', '', p, ctx.instruction);
      }
      const kv = u.el('div', 'insp-kv', insp);
      for (const k of ['From', 'To', 'Date', 'Passengers']) {
        u.el('span', '', kv, k);
        u.el('span', '', kv, k === 'Passengers' ? '1 Adult' : '—');
      }
      u.el('hr', '', insp);
      const none = u.el('div', 'insp-none', insp);
      u.el('b', '', none, 'No flight selected');
      u.el('span', '', none, 'Choose a flight from the results on the left to see details here.');
      const ps = u.el('div', 'insp-sum', insp);
      u.el('h3', 'insp-h', ps, 'Price Summary');
      const rows = u.el('div', 'insp-rows', ps);
      for (const k of ['Fare', 'Taxes & Fees']) {
        u.el('span', '', rows, k);
        u.el('span', '', rows, '—');
      }
      u.el('hr', '', rows);
      u.el('b', '', rows, 'Total (USD)');
      u.el('span', '', rows, '—');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const words = labels.map(labelOf),
        defaultEnd = words.find((x) => x.trim().toLowerCase() === 'submit') || words[0];
      const otherEnds = words.filter((x) => x.trim().toLowerCase() !== defaultEnd.trim().toLowerCase());
      const label = endR.pick([...Array(Math.max(1, otherEnds.length)).fill(defaultEnd), ...otherEnds]);
      const placement = ctx.finish ? null : label === defaultEnd ? 'inspector' : placeR.pick(['header', 'link']);
      let collide = null;
      if (collideR.bool(0.3)) {
        const options = [...new Set(words)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = labelOf(collideR.pick(options));
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide && placement === 'header') decoy(util, collide, true);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') submit = endBtn(util, 'end-control header-end', label);
        else if (placement === 'link') submit = endBtn(u.el('div', 'insp-foot link-foot', insp), 'end-link', label);
        else submit = endBtn(u.el('div', 'insp-foot', insp), 'end-control', label);
        if (collide && placement !== 'header') decoy(u.el('div', 'chrome-xtras', util), collide, true);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        texts = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help with this workspace?', 'Close'],
          promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
          banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
        };
      const [title, copy, label] = texts[ctx.kind],
        el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
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
