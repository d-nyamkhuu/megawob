(function () {
  const palette = { bg: '#ebe9e2', panel: '#f2f0e9', fg: '#111', muted: '#333', line: '#555' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The existing settings pane has room for every note mode at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'eink');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const ttl = u.el('div', 'title', head);
      ttl.innerHTML =
        '<svg class="ico" viewBox="0 0 16 16" width="22" height="22" fill="none" stroke="#222" stroke-width="1.2"><rect x="1.5" y="3" width="13" height="11.5"/><path d="M1.5 6.5h13M5 1.5v3M11 1.5v3M4 9h2M7 9h2M10 9h2M4 12h2M7 12h2"/></svg><span>Event Planner &mdash; Riverside Room</span><span class="wc"><i>&minus;</i><i>&#9633;</i><i>&times;</i></span>';
      u.el('div', 'tools', head, 'File    Edit    View    Tools    Help');
      const work = u.el('div', 'work', shell);
      const pane = u.el('section', 'event-settings', work);
      pane.classList.toggle('compact-note', _c.ctx.instruction.length > 65);
      u.el('h2', '', pane, 'Event Settings');
      const facts = u.el('div', 'event-facts', pane);
      facts.innerHTML =
        '<span>Event:</span><span>Team Dinner</span><span>Date:</span><span>Sat, Apr 26, 2025</span><span>Room:</span><span>Riverside Room</span>';
      const actions = u.el('div', 'event-actions', pane);
      const hint = u.el('p', 'save-hint', pane, 'Saves only your\npresentation preferences.');
      Object.assign(_c, { shell, head, work, pane, actions, hint, header: pane });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const ledger = u.el('section', 'guest-ledger', _c.work);
      u.el('h1', '', ledger, 'Guest Ledger');
      const srch = u.el('div', 'search', ledger);
      srch.innerHTML =
        '<svg viewBox="0 0 16 16" width="22" height="22" fill="none" stroke="#222" stroke-width="1.5"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l4.5 4.5"/></svg><span>Search guests...</span>';
      const table = u.el('table', '', ledger);
      table.innerHTML = '<tr><th>#</th><th>Name</th><th>Group</th><th>Meal Preference</th><th>Status</th></tr>';
      [
        'Taylor Kim', 'Jordan Lee', 'Morgan Patel', 'Casey Nguyen', 'Riley Chen',
        'Avery Wilson', 'Jamie Park', 'Quinn Davis', 'Sydney Brooks', 'Drew Martinez',
      ].forEach((t, i) => {
        const row = u.el('tr', '', table);
        [String(i + 1), t, ['Friends', 'Work', 'Family'][i % 3],
          ['Regular', 'Vegetarian', 'Regular', 'Vegan', 'Regular', 'Vegetarian', 'Regular', 'Regular', 'Vegan', 'Regular'][i],
          i % 3 === 2 ? 'Pending' : 'Confirmed',
        ].forEach((t) => u.el('td', '', row, t));
      });
      const pg = u.el('p', 'pager', ledger);
      pg.innerHTML =
        '<span class="cnt">Showing 10 of 24 guests</span><span class="pgr"><b>&#9664;</b><span>Page 1 of 3</span><b>&#9654;</b></span>';
      const preview = u.el('section', 'room-preview', _c.work);
      const ph = u.el('h3', '', preview, 'Room Preview');
      u.el('span', 'collapse', ph, '−');
      preview.innerHTML +=
        '<svg viewBox="0 0 450 205" fill="none" stroke="#222" stroke-width="1.3"><defs><g id="table"><circle r="29"/><g id="chair"><path d="M-8-31v-7q0-4 8-4t8 4v7Z M-8-37q8-3 16 0"/></g><use href="#chair" transform="rotate(60)"/><use href="#chair" transform="rotate(120)"/><use href="#chair" transform="rotate(180)"/><use href="#chair" transform="rotate(240)"/><use href="#chair" transform="rotate(300)"/></g><path id="leaf" d="M0 0Q-9-9 0-17Q9-9 0 0Z M0-2V-13"/></defs><path d="M6 6H444V199H6Z M6 6v88 M6 130v69"/><g transform="translate(-4 -4)"><path d="M9 94Q39 94 39 130H9" fill="#efeee8"/><use href="#table" x="110" y="65"/><use href="#table" x="235" y="65"/><use href="#table" x="162" y="148"/><path d="M323 30h48v95h-48Z M335 51v55 M332 53h6 M332 104h6 M303 142h135v49H303Z"/><text x="347" y="51" fill="#111" stroke="none" transform="rotate(90,347,51)" font-family="Georgia" font-size="19">Buffet</text><g transform="translate(419 34)"><use href="#leaf"/><use href="#leaf" transform="rotate(45)"/><use href="#leaf" transform="rotate(90)"/><use href="#leaf" transform="rotate(135)"/><use href="#leaf" transform="rotate(180)"/><use href="#leaf" transform="rotate(225)"/><use href="#leaf" transform="rotate(270)"/><use href="#leaf" transform="rotate(315)"/><circle r="4"/></g><text x="370" y="162" text-anchor="middle" fill="#111" stroke="none" font-family="Georgia" font-size="18">Riverside Room</text><text x="370" y="183" text-anchor="middle" fill="#111" stroke="none" font-family="Georgia" font-size="17">Capacity: 50</text></g></svg>';
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.pane;
      base(_c);
      _c.body = body;
      const panel = _c.pane.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.pane);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.pane.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      const clock = _c.util.el('span', 'clock', foot, 'Apr 10, 2025    10:24 AM');
      foot.insertBefore(clock, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, 'Notice');
      ctx.util.el('p', '', el, 'Close this notice to continue.');
      const dismiss = ctx.util.el('button', 'dismiss', el, 'Close');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-spinner-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-spinner-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#222'],
      LOW_ACCENTS: ['#222'],
      parts,
    },
  });
})();
