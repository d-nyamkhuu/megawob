/* use-project-board/_shell: Workspace shell, display content and navigation parts.
 * install(BASE, W) retains the workspace's design parts; W is its live per-page state. */
(function () {
  'use strict';
  function install(BASE, W) {
    BASE.icon = (parent, name) => {
      const svg = W.u.svg('svg', { class: 'pj-icon', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, parent);
      svg.innerHTML = W.D.icons[name]; return svg;
    };

    BASE.button = (parent, label, name, cls = '') => {
      const b = W.u.el('button', `pj-btn ${cls}`, parent); b.type = 'button';
      if (name) W.P.icon(b, name); if (label) W.u.el('span', '', b, label);
      return b;
    };

    BASE.avatar = (parent, owner, color) => {
      const el = W.u.el('span', 'pj-avatar', parent, owner.split(' ').map((p) => p[0]).slice(0, 2).join(''));
      el.style.setProperty('--task', color || 'var(--accent)'); el.title = owner; return el;
    };

    BASE.frame = (ctx) => {
      W.root = W.u.el('section', `pj-app${W.size.width < W.D.compactAt ? ' pj-compact' : ''}`, ctx.stage);
      W.root.setAttribute('aria-label', W.D.workspaceLabel);
      return W.root;
    };

    BASE.sidebar = () => {
      W.sidebar = W.u.el('nav', 'pj-sidebar', W.root); W.sidebar.setAttribute('aria-label', 'Workspace navigation');
      W.nav = W.u.el('div', 'pj-sidebar-scroll', W.sidebar);
      const brand = W.u.el('div', 'pj-brand', W.nav); W.P.icon(W.u.el('span', 'pj-brand-mark', brand), 'project'); W.u.el('span', '', brand, W.D.brand);
    };

    BASE.content = () => {
      const extraTitles = W.C.sample(W.rng, W.D.backlogTitles, 14, W.cs);
      W.related = Array.from({ length: 14 }, (_, i) => ({ id: `background-${i}`,
        title: extraTitles[i % extraTitles.length] + (i >= extraTitles.length ? ` ${i + 1}` : ''),
        owner: W.C.personName(W.rng, W.cs).full, color: W.D.relatedColors[i % W.D.relatedColors.length], points: W.rng.pick([1, 2, 3, 5]),
        start: W.rng.int(1, W.s.days - 4), duration: W.rng.int(2, 4), state: W.P.statusOf(i + 1), related: true }));
      W.active = W.s.items.map((it, i) => ({ ...it, state: W.P.statusOf(i), related: false, number: 101 + i }));
      W.all = [...W.active, ...W.related];
      W.todayDay = W.rng.int(5, Math.min(W.s.days, 16));
    };

    BASE.statusOf = (i) => {
      return W.D.statuses[i % W.D.statuses.length];
    };

    BASE.stateColor = (state) => {
      return W.D.stateColors[state];
    };

    BASE.navItem = (label, name, count, current = false) => {
      const b = W.u.el('button', `pj-nav${current ? ' active' : ''}`, W.nav); b.type = 'button';
      W.P.icon(b, name); W.u.el('span', 'pj-navtext', b, label); if (count) W.u.el('span', 'pj-count', b, String(count));
      b.onclick = () => W.P.drawer(label); return b;
    };

    BASE.navigation = () => {
      W.P.navItem('Home', 'home'); W.P.navItem('My work', 'tasks', 12); W.P.navItem('Inbox', 'inbox', 3);
      const favorites = W.u.el('div', 'pj-nav-heading', W.nav, 'Projects'); W.P.icon(favorites, 'plus');
      W.P.navItem(W.s.project, 'project', null, true);
      for (const name of ['Cedar customer hub', 'Spring service audit', 'Atlas knowledge base']) W.P.navItem(name, 'project');
      W.u.el('div', 'pj-nav-heading', W.nav, 'Teams');
      W.P.navItem('Delivery team', 'people', 8); W.P.navItem('Product', 'people'); W.P.navItem('Platform', 'people');
      W.u.el('div', 'pj-nav-heading', W.nav, 'Workspace'); W.P.navItem('Project portfolio', 'folder'); W.P.navItem('Archived work', 'folder', 4);
      const profile = W.u.el('div', 'pj-sidebar-foot', W.sidebar); W.P.avatar(profile, W.s.items[0].owner); const profileText = W.u.el('div', '', profile);
      W.u.el('div', '', profileText, W.s.items[0].owner.split(' ')[0]); W.u.el('div', 'pj-muted', profileText, 'Delivery workspace');
    };

    BASE.heading = () => {
      W.main = W.u.el('div', 'pj-main', W.root);
      const head = W.u.el('div', 'pj-head', W.main), heading = W.u.el('div', 'pj-grow', head);
      W.u.el('div', 'pj-muted', heading, 'Workspace / Projects / Delivery team'); W.u.el('div', 'pj-title', heading, W.s.project);
      const saved = W.u.el('div', 'pj-saved', head); W.P.icon(saved, 'check'); W.u.el('span', '', saved, 'Saved');
      W.notifications = W.P.button(head, '', 'bell', 'icon pj-bell'); W.notifications.setAttribute('aria-label', 'Notifications, 3 unread');
      W.details = W.P.button(head, '', 'info', 'icon'); W.details.setAttribute('aria-label', 'Project details');
    };

    BASE.tabs = () => {
      const tabs = W.u.el('div', 'pj-tabs', W.main);
      for (const [label, glyph] of [['Overview', 'project'], ['Board', 'board'], ['Timeline', 'timeline'], ['Activity', 'clock']]) {
        const current = label === (W.isBoard ? 'Board' : 'Timeline');
        const b = W.u.el('button', `pj-tab${current ? ' active' : ''}`, tabs); b.type = 'button'; W.P.icon(b, glyph); W.u.el('span', '', b, label);
        if (current) b.setAttribute('aria-current', 'page'); else b.onclick = () => W.P.drawer(label);
      }
    };

    BASE.toolbar = () => {
      const tools = W.u.el('div', 'pj-tools', W.main), toolbar = W.u.el('div', 'pj-toolbar', tools);
      W.findBtn = W.P.button(toolbar, '', 'search'); W.findBtn.setAttribute('aria-label', 'Find work'); W.u.el('span', 'pj-find-label', W.findBtn, 'Find');
      W.filterBtn = W.P.button(toolbar, 'Filter', 'filter'); W.groupBtn = W.P.button(toolbar, W.isBoard ? 'Team' : 'Section', 'group');
      W.clearBtn = W.P.button(toolbar, 'Reset view', 'close'); W.clearBtn.style.display = 'none';
      W.u.el('span', 'pj-grow', toolbar);
      W.today = W.P.button(toolbar, W.isBoard ? 'Sprint 12' : 'Today', 'calendar');
      W.zoomButtons = {};
      if (!W.isBoard) {
        const z = W.u.el('div', 'pj-zoom', toolbar);
        for (const label of ['Day', 'Week', 'Month']) {
          const b = W.u.el('button', label === W.zoom ? 'active' : '', z, label); b.type = 'button'; W.zoomButtons[label] = b;
          b.onclick = () => { W.zoom = label; Object.entries(W.zoomButtons).forEach(([k, el]) => el.classList.toggle('active', k === W.zoom)); W.P.refreshView(); };
        }
      }

      W.els.tools = tools;
    };

    BASE.viewMeta = () => {
      const viewMeta = W.u.el('div', 'pj-view-meta', W.els.tools);
      W.P.avatar(viewMeta, W.active[0].owner); W.P.avatar(viewMeta, W.active[1].owner, W.active[1].color);
      W.u.el('span', 'pj-grow', viewMeta, `${W.s.items.length} current items / ${W.related.length} related / Team access`);
      W.policies = W.P.button(viewMeta, 'Policies', 'info');
    };

    BASE.body = () => {
      W.body = W.u.el('div', 'pj-body', W.main); W.body.setAttribute('aria-label', W.isBoard ? 'Project board' : 'Project timeline');
      W.hint = W.u.el('div', 'pj-hint', W.main); W.foot = W.u.el('div', 'pj-foot', W.main);
      W.normalHint = W.isBoard ? (W.s.scenario === 'wip' ? 'Current sprint WIP: In progress limited to 2. Next-sprint backlog is excluded.' : 'Current sprint / Product and Platform / Next-sprint backlog below')
        : `Calendar days / Today: ${W.s.month} ${W.todayDay} / Finish-to-start dependencies / Related work included`;
    };
  }
  env.template('use-project-board/_shell', () => ({ install }));
})();
