(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-06',
    'brand': 'Campus Caf\u00e9 \u2013 Food Ordering',
    'mode': 'side-left',
    'tokens': {
      'bg': '#fdf8f0',
      'panel': '#fffdf9',
      'fg': '#14123a',
      'accent': '#fa6f5e',
      'font': "'Trebuchet MS','Segoe UI',Arial,sans-serif",
      'line': '#cfcde0',
      'muted': '#555468',
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
      const deco = u.el('div', 'deco', shell);
      for (const c of ['d-circle', 'd-dots', 'd-tri', 'd-dots2', 'd-sun']) {
        u.el('i', c, deco);
      }
      const landscape = u.el('div', 'route-landscape', deco);
      landscape.innerHTML =
        '<svg viewBox="0 0 220 470" fill="none"><path d="M0 143L108 12l112 135v102H0z" fill="#d2ccff"/><path d="M105 146l86-95 29 32v138z" fill="#a499ef"/><path d="M0 169c99-39 188-22 220-7v162c-23 55-94 98-157 126L29 332c144-84 143-104 26-165z" fill="#d7d0ff"/><path d="M0 184c102-56 234-12 184 46C73 296 208 296 24 376" stroke="#fff9ee" stroke-width="30"/><path d="M0 174c127-60 224-12 177 53s68 70-48 125" stroke="white" stroke-width="3" stroke-dasharray="24 8"/><path d="M42 375l31-107 31 107zM66 145l11-40 11 40zM165 155l11-39 11 39z" fill="#554c96"/><g transform="translate(65 173) rotate(8)"><path d="M5 4Q0 3 0 14v49l13 12 109 14q16 1 16-14l-4-43Q132 19 115 17z" fill="#302574" stroke="#52499c" stroke-width="3"/><path d="M13 9l71 10 8 35-79-12z" fill="#51499d"/><path d="M91 23l26 2q7 1 10 12l3 18-31-2z" fill="#403c88"/><path d="M13 16l14 3v24l-14-3zm19 4l14 2v25l-14-3zm19 3l14 2 4 25-18-3zm20 3l11 2 5 25-13-2z" fill="#7771c1"/><path d="M104 29l22-1 3 7-24 3zM2 50l85 16 3 7L2 57z" fill="#ff8575"/><ellipse cx="23" cy="69" rx="7" ry="12" fill="#292255"/><ellipse cx="23" cy="69" rx="3" ry="7" fill="#cfcee9"/><ellipse cx="82" cy="79" rx="7" ry="12" fill="#292255"/><ellipse cx="82" cy="79" rx="3" ry="7" fill="#cfcee9"/><path d="M106 75l8 1m13 1l6-2" stroke="white" stroke-width="4" stroke-linecap="round"/></g></svg>';
      const idx = u.el('nav', 'side-index', shell);
      [
        ['1', 'Search'],
        ['2', 'Results'],
        ['3', 'Passenger'],
        ['4', 'Payment'],
        ['5', 'Submit'],
      ].forEach(([n, l], i) => {
        const it = u.el('div', 'ix' + (i === 0 ? ' on' : ''), idx);
        u.el('b', '', it, n);
        u.el('span', '', it, l);
      });
      const header = u.el('header', 'design-header', shell);
      const br = u.el('div', 'design-brand', header, 'RouteHop');
      u.el('i', 'brand-tri', br);
      const nav = u.el('nav', 'design-nav', header);
      for (const n of ['Trains', 'Coaches', 'Flights', 'Help']) u.el('span', '', nav, n);
      const av = u.el('div', 'user-ico', header);
      av.innerHTML =
        '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="20" cy="20" r="18"/><circle cx="20" cy="16" r="5.5"/><path d="M9 32c2-6 6-8 11-8s9 2 11 8"/></svg>';
      const body = u.el('div', 'design-body instruction-' + ctx.display, shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      u.el('i', 'note-line', note);
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('div', 'order-slot', footer);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placements = ['footer', 'footer', 'header', 'link'];
        const placement = er.pick(placements);
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
        const chosen = er.pick(labels);
        const label =
          typeof chosen === 'string' ? chosen : chosen.label || chosen.text || chosen.name || String(chosen);
        const cr = ctx.rng.fork('chrome/collide');
        let collision = null;
        if (cr.bool(0.3)) {
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collision = { label: cr.pick(pool), where: cr.pick(['header', 'footer']) };
        }
        const headerTools = u.el('div', 'header-tools', header);
        const makeDecoy = (parent, item) => {
          const b = u.el('button', 'end-xtra' + (item.collide ? ' colliding' : ''), parent, item.label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () =>
            env.log('decoy', item.collide ? { label: item.label, collide: true } : { label: item.label }),
          );
        };
        if (collision && collision.where === 'header')
          makeDecoy(headerTools, { label: collision.label, collide: true });
        if (placement === 'header') {
          submit = u.el('button', 'end-control end-header', headerTools, label);
        } else if (placement === 'link') {
          submit = u.el('button', 'end-control end-link', footer, label + ' ›');
        } else {
          submit = u.el('button', 'end-control', footer, label);
        }
        if (collision && collision.where === 'footer') makeDecoy(footer, { label: collision.label, collide: true });
        submit.type = 'button';
        submit.addEventListener('click', () => ctx.submit());
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
