(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-week-03',
    brand: 'Personal Organizer',
    mode: 'office',
    tokens: {
      bg: '#dce9f8',
      panel: '#fff',
      fg: '#142d56',
      accent: '#ffc83d',
      font: 'Segoe UI, Tahoma, Arial,sans-serif',
      line: '#a8c8eb',
      muted: '#506984',
      'button-fg': '#142d56',
    },
    nav: 'Home      View      Tools',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
    footer: '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, '▣   ' + D.brand);
      u.el('div', 'window-controls', header, '—   □   ×');
      const menu = u.el('nav', 'design-nav', shell, D.nav);
      const ribbon = u.el('div', 'ribbon', shell);
      ribbon.innerHTML =
        '<div class="rgroup"><b>▦</b><span>New<br>Appointment</span><b>✎</b><span>New All Day<br>Event</span></div><div class="rgroup"><b class="red">×</b><span>Delete</span><b>✉</b><span>Forward</span></div><div class="rgroup views"><b>▤</b><span>Day</span><b class="selected">▦</b><span class="selected">Week</span><b>▤</b><span>Month</span><b>▤</b><span>Timeline</span></div><div class="rgroup"><b>‹</b><span>Previous<br>Week</span><b>›</b><span>Next<br>Week</span><b>▦</b><span>Go To<br>Today</span></div><div class="rgroup arrange"><span>▣ &nbsp; Work Week</span><span class="toggle">▣ &nbsp; Show Weekends</span><span>▤ &nbsp; Time Scale</span></div><div class="rgroup"><b>▦</b><span>Color By<br>Category</span></div><div class="rgroup last"><b>♧</b><span>Find</span></div>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const legend = u.el('div', 'appointment-index', shell);
      legend.innerHTML =
        '<b>Appointments　⌄</b><span><i class="c1"></i>Team Meeting</span><span><i class="c2"></i>Project Review</span><span><i class="c3"></i>Lunch with Sarah</span><span><i class="c4"></i>Gym</span><span><i class="c5"></i>Doctor Visit</span><span><i class="c6"></i>Call with Client</span><span><i class="c2"></i>Lunch Break</span><span><i class="c7"></i>Report Draft</span><span><i class="c6"></i>Family Dinner</span><span><i class="c2"></i>Hiking</span><span><i class="c3"></i>Dentist</span>';
      const footer = u.el('footer', 'design-footer', shell);
      const dock = u.el('div', 'app-dock', footer);
      dock.innerHTML =
        '<span>✉　Mail</span><span class="active">▦　Calendar</span><span>♙　Contacts</span><span>☑　Tasks</span><span>▤　Notes</span><span>▰　Folders</span>';
      u.el('span', 'footer-label', footer, D.footer || 'Ready');

      let submit = null;
      let placement = null;
      let label = 'Submit';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['footer', 'footer', 'header', 'link']);
        const values =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        if (placement !== 'footer') label = labelOf(er.pick(values));

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(values.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
        }
        const addActions = (parent, cls) => u.el('div', 'chrome-actions ' + cls, parent);
        const makeDecoy = (parent) => {
          const b = u.el('button', 'chrome-xtra', parent, collide.label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
        };
        const makeEnd = (parent, cls) => {
          const tag = placement === 'link' ? 'a' : 'button';
          const b = u.el(tag, 'end-control ' + cls, parent, label);
          if (tag === 'a') {
            b.href = '#';
            b.addEventListener('click', (e) => e.preventDefault());
          } else b.type = 'button';
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'header') {
          const tools = addActions(header, 'header-actions');
          if (collide && collide.where === 'header') makeDecoy(tools);
          submit = makeEnd(tools, 'header-end');
        } else if (placement === 'link') {
          if (collide && collide.where === 'header') makeDecoy(addActions(header, 'header-actions'));
          const tools = addActions(footer, 'footer-actions');
          if (collide && collide.where === 'footer') makeDecoy(tools);
          submit = makeEnd(tools, 'footer-link');
        } else {
          if (collide && collide.where === 'header') makeDecoy(addActions(header, 'header-actions'));
          if (collide && collide.where === 'footer') {
            const tools = addActions(footer, 'footer-actions');
            makeDecoy(tools);
            submit = makeEnd(tools, 'footer-end');
          } else submit = makeEnd(footer, 'footer-end');
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
