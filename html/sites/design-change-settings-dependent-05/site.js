// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const viewportWidth = (_c.ctx.size && _c.ctx.size.width) || window.innerWidth;
      if (_c.display === 'panel' && viewportWidth < 1450) {
        const panel = document.querySelector('.ref-panel');
        if (panel) panel.remove();
        const note = _c.util.el('div', 'ref-instruction', _c.header, _c.ctx.instruction);
        note.classList.add('wrapped-note');
      }
    },
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const brand = _c.header.querySelector('.ref-brand');
      if (brand) brand.textContent = 'SkyDrive';
      if (!_c.header.querySelector('.ref-nav')) {
        const nav = _c.util.el('nav', 'ref-nav', _c.header);
        nav.innerHTML = '<a class="ref-navlink">▱　Files</a><a class="ref-navlink">♟　Shared</a><a class="ref-navlink">◷　Activity</a><a class="ref-navlink current">⚙　Preferences</a>';
        for (const link of nav.children) link.addEventListener('click', (e) => e.preventDefault());
        const note = _c.header.querySelector('.ref-instruction, .ref-spacer');
        if (note) _c.header.insertBefore(nav, note);
      }
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      const global = _c.util.el('div', 'app-global', _c.header);
      global.innerHTML = '<label class="app-file-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/></svg><input aria-label="Search files" placeholder="Search files..."/></label><span class="app-bell" aria-hidden="true">♧</span><span class="app-avatar">JD</span><span class="app-window-controls" aria-hidden="true"><i>─</i><i>□</i><i>×</i></span>';
      _c.header.insertBefore(global, _c.headerTools);
    },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        document.body.classList.add('ref-workbench');
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'app-sidebar', body);
        rail.innerHTML = '<div class="rail-link">▱ <span>All Files</span></div><div class="rail-link">◷ <span>Recent</span></div><div class="rail-link">☆ <span>Starred</span></div><div class="rail-link">▤ <span>Trash</span></div><div class="rail-caption">Spaces</div><div class="rail-link">▦ <span>Personal</span></div><div class="rail-link">♟ <span>Team</span></div><div class="rail-link">◈ <span>Projects</span><span class="rail-chevron">⌄</span></div><div class="rail-link nested">📁 <span>Design</span></div><div class="rail-link nested">📁 <span>Research</span></div><div class="rail-link nested">📁 <span>Marketing</span></div><div class="rail-divider"></div><div class="rail-link">♟ <span>Shared with Me</span></div>';
        const help = util.el('aside', 'wb-help', body);
        util.el('div', 'wb-help-title', help, 'Help');
        util.el(
          'div',
          'wb-help-copy',
          help,
          'Choose a section on the right to view and change settings.\n\nTurn options on or off with the checkboxes. Some settings show additional options when enabled.\n\nUse the search field to quickly find a setting by name.',
        );
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, help, rail });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'account-inspector', body);
        inspector.innerHTML = '<h2>Account</h2><div class="account-person"><span class="account-avatar">JD</span><div><b>Jordan Diaz</b><small>jordan.diaz@skydrive.com</small></div></div><section><h3>Storage</h3><div class="storage-meter"><i></i></div><small>28 GB of 100 GB used</small></section><section><h3>Plan</h3><div class="plan-row"><span>Pro</span><button>Manage Plan</button></div></section><section><h3>Connected Devices</h3><div class="device"><span class="device-icon">▱</span><div><b>MacBook Pro</b><small>This device</small></div><i class="online"></i></div><div class="device"><span class="device-icon">▯</span><div><b>iPhone 16</b><small>Last sync 2 hours ago</small></div><i></i></div><div class="device"><span class="device-icon">▯</span><div><b>iPad</b><small>Last sync 1 day ago</small></div><i></i></div><button class="manage-devices">Manage Devices</button></section>';
        Object.assign(_c, { inspector, stage });
      },
  };

  env.site({
    name: 'design-change-settings-dependent-05',
    template: 'site/base',
    design: { parts },
  });
})();
