(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-week-03',
    brand: 'Personal Organizer',
    nav: 'Home      View      Tools',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
  };
  const palette = { bg: '#dce9f8', panel: '#fff', fg: '#142d56', muted: '#506984', line: '#a8c8eb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'office instruction-' + _c.display;
      document.documentElement.style.setProperty('--button-fg', '#142d56');
      document.documentElement.style.setProperty('--font', 'Segoe UI, Tahoma, Arial,sans-serif');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', title, '▣   ' + D.brand);
      u.el('div', 'window-controls', title, '—   □   ×');
      u.el('nav', 'design-nav', shell, D.nav);
      const ribbon = u.el('div', 'ribbon', shell);
      ribbon.innerHTML =
        '<div class="rgroup"><b>▦</b><span>New<br>Appointment</span><b>✎</b><span>New All Day<br>Event</span></div><div class="rgroup"><b class="red">×</b><span>Delete</span><b>✉</b><span>Forward</span></div><div class="rgroup views"><b>▤</b><span>Day</span><b class="selected">▦</b><span class="selected">Week</span><b>▤</b><span>Month</span><b>▤</b><span>Timeline</span></div><div class="rgroup"><b>‹</b><span>Previous<br>Week</span><b>›</b><span>Next<br>Week</span><b>▦</b><span>Go To<br>Today</span></div><div class="rgroup arrange"><span>▣ &nbsp; Work Week</span><span class="toggle">▣ &nbsp; Show Weekends</span><span>▤ &nbsp; Time Scale</span></div><div class="rgroup"><b>▦</b><span>Color By<br>Category</span></div><div class="rgroup last"><b>♧</b><span>Find</span></div>';
      const body = u.el('div', 'design-body', shell);
      Object.assign(_c, { shell, title, body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      const legend = _c.util.el('div', 'appointment-index', _c.shell);
      legend.innerHTML =
        '<b>Appointments　⌄</b><span><i class="c1"></i>Team Meeting</span><span><i class="c2"></i>Project Review</span><span><i class="c3"></i>Lunch with Sarah</span><span><i class="c4"></i>Gym</span><span><i class="c5"></i>Doctor Visit</span><span><i class="c6"></i>Call with Client</span><span><i class="c2"></i>Lunch Break</span><span><i class="c7"></i>Report Draft</span><span><i class="c6"></i>Family Dinner</span><span><i class="c2"></i>Hiking</span><span><i class="c3"></i>Dentist</span>';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const dock = _c.util.el('div', 'app-dock');
      dock.innerHTML =
        '<span>✉　Mail</span><span class="active">▦　Calendar</span><span>♙　Contacts</span><span>☑　Tasks</span><span>▤　Notes</span><span>▰　Folders</span>';
      foot.prepend(dock);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('footer-label');
      status.textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffc83d'],
      LOW_ACCENTS: ['#ffc83d'],
      parts,
    },
  });
})();
