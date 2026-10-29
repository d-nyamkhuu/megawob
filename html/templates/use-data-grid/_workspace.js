/* use-data-grid/_workspace: grid workspace parts; S holds the live episode state and resolved design parts. */
(function () {
  'use strict';

  function showUtility(S, title, lines) {
    if (S.utility) S.utility.remove();
    S.utility = S.P.el('aside', 'to-utility', S.shell);
    S.P.el('h3', '', S.utility, title);
    const close = S.P.el('button', 'to-close', S.utility); S.P.icon(close, 'close'); close.setAttribute('aria-label', 'Close panel');
    close.addEventListener('click', () => { S.utility.remove(); S.utility = null; });
    for (const line of lines) S.P.el('p', '', S.utility, line);
    S.ctx.log('workspace-panel', { title });
  }

  function navItem(S, label, image, count, current = false, project = false) {
    const b = S.P.el('button', (current ? 'active' : '') + (project ? ' to-project' : ''), S.nav);
    b.type = 'button'; b.title = label; S.P.icon(b, image); S.P.el('span', 'nav-label', b, label);
    if (count !== null) S.P.el('span', 'nav-count', b, String(count));
    b.addEventListener('click', () => S.P.showUtility(label, [label + ' / Team workspace', 'Shared with the operations team', 'Last updated by ' + S.actor]));
  }

  function appbar(S) {
    S.shell = S.P.el('section', 'to-workspace', S.ctx.stage);
    S.shell.setAttribute('aria-label', 'Operations workspace');
    S.appbar = S.P.el('div', 'to-appbar', S.shell);
    S.brand = S.P.el('span', 'to-brand', S.appbar, S.D.brand); S.P.icon(S.brand, 'app');
    S.org = S.P.el('button', 'to-btn ghost', S.appbar, S.workspaceName); S.P.icon(S.org, 'down', false);
    S.globalSearch = S.P.el('button', 'to-btn to-global', S.appbar, 'Search workspace'); S.P.icon(S.globalSearch, 'search');
    S.notifications = S.P.el('button', 'to-btn ghost', S.appbar, '3'); S.P.icon(S.notifications, 'bell'); S.notifications.title = 'Notifications';
    S.user = S.P.el('span', 'to-avatar', S.appbar, S.actor.split(' ').map(x => x[0]).slice(0,2).join('')); S.user.title = S.actor;
    S.utility = null;
    S.org.addEventListener('click', () => S.P.showUtility('Workspaces', [S.workspaceName + ' / Operations', 'Regional service team / Member', 'Customer onboarding / Read only']));
    S.globalSearch.addEventListener('click', () => S.P.showUtility('Recent items', ['Quarterly account review', 'Regional service report', 'New hire access checklist']));
    S.notifications.addEventListener('click', () => S.P.showUtility('Notifications', [S.actor + ' mentioned you in the team handover.', 'Weekly export is ready to download.', 'The customer onboarding view was shared with your team.']));
  }

  function navigation(S) {
    S.nav = S.P.el('nav', 'to-nav' + (S.expanded ? ' expanded' : ''), S.shell);
    if (!S.navW) S.nav.hidden = true;
    S.nav.setAttribute('aria-label', 'Workspace navigation');
    S.P.navItem('Overview', 'app', null);
    S.P.navItem('Records', 'records', null, true);
    S.P.navItem('Customers', 'users', null);
    S.P.navItem('Reports', 'chart', null);
    S.P.navItem('Activity', 'clock', null);
    S.P.el('small', '', S.nav, 'Saved views');
    S.P.navItem('Pinned records', 'records', S.spec.rows.length, false, true);
    S.P.navItem('All records', 'records', S.wr.int(840, 1920), false, true);
    S.P.navItem('My queue', 'mail', S.wr.int(18, 43), false, true);
    S.P.navItem('Needs review', 'flag', S.wr.int(7, 16), false, true);
    S.P.navItem('Recently updated', 'clock', S.wr.int(48, 93), false, true);
    if (S.H >= 500) {
      S.P.el('small', '', S.nav, 'Projects');
      S.P.navItem('Onboarding', 'folder', null, false, true);
      S.P.navItem('Renewals', 'folder', null, false, true);
      S.P.navItem('Regional accounts', 'folder', null, false, true);
    }
    S.P.navItem('Settings', 'settings', null);
  }

  function contextPanel(S) {
    if (S.contextual) {
      const context = S.P.el('aside', 'to-context', S.shell);
      S.P.el('h4', '', context, 'Workspace overview');
      S.P.el('strong', '', context, 'Operations team');
      S.P.el('p', '', context, 'Shared records and saved views for account operations.');
      S.P.el('h4', '', context, 'Recent activity');
      for (const [what, when] of [['Weekly export completed', '12 minutes ago'], ['Regional accounts shared', '38 minutes ago'], ['View settings updated', '1 hour ago']]) {
        const f = S.P.el('div', 'to-feed', context, what); S.P.el('small', '', f, when);
      }
      S.P.el('p', '', context, 'Team handover at 16:00. Check pending reviews before the end of your shift.');
    }
  }

  function card(S) {
    S.card = S.P.el('div', 'to-card', S.shell);
    Object.assign(S.card.style, { left: S.left + 'px', top: S.top + 'px', width: S.cardW + 'px', height: S.cardH + 'px' });
    S.card.classList.add('zebra', 'showdots');
    if (S.wr.bool(0.25)) S.card.classList.add('upper');
    if (S.cardW < 1000 || S.spec.ood) S.card.classList.add('dense');
  }

  function heading(S) {
    // ---- head
    S.head = S.P.el('div', 'to-head', S.card);
    S.object = S.P.el('div', 'to-object', S.head); S.P.icon(S.object, 'records');
    S.title = S.P.el('h2', '', S.object, S.spec.title);
    S.title.dataset.role = 'title';
    S.count = S.P.el('span', 'to-chip', S.head, '');
    S.P.el('div', 'sp', S.head);
    S.decoys = S.rng.sample(S.D.decoys, S.cardW > 700 ? 2 : 1);
    for (const d of S.decoys) {
      const b = S.P.el('button', 'to-btn', S.head, d);
      b.type = 'button';
      b.dataset.role = 'xtra';
      S.P.icon(b, d === 'Export' || d === 'Import' ? 'export' : d === 'Columns' || d === 'Refresh' ? 'settings' : 'users');
      b.addEventListener('click', () => S.P.showUtility(d, [d === 'Export' ? 'Scheduled export delayed: delivery destination unavailable. Records remain available here.' : 'Team workspace / ' + S.spec.title, 'Access: Operations team', 'Managed by ' + S.actor]));
    }
    S.nb = S.P.el('button', 'to-btn pri', S.head, `New ${S.spec.entity}`);
    S.P.icon(S.nb, 'plus');
    S.nb.type = 'button';
    S.nb.dataset.role = 'xtra';
    S.nb.addEventListener('click', () => S.P.showUtility(`New ${S.spec.entity}`, ['Record creation is managed by the intake team.', 'Use the team intake workspace for new requests.']));
  }

  function tabs(S) {
    S.tabs = S.P.el('div', 'to-tabs', S.card);
    S.currentView = S.P.el('button', 'active', S.tabs, 'Pinned records'); S.P.icon(S.currentView, 'records');
    S.views = S.P.el('button', '', S.tabs, 'Shared views'); S.P.icon(S.views, 'down', false);
    S.views.addEventListener('click', () => S.P.showUtility('Shared views', ['Needs review / Operations team', 'Regional accounts / Account services', 'Recently updated / All members']));
    S.activityTab = S.P.el('button', '', S.tabs, 'Activity');
    S.activityTab.addEventListener('click', () => S.P.showUtility('Record activity', ['Latest changes are saved to the workspace.', 'Weekly export completed 12 minutes ago.', S.actor + ' updated the view configuration.']));
    S.P.el('span', 'scope', S.tabs, 'Team workspace / ' + S.spec.entities);
  }

  function stream(S) {
    S.stream = S.P.el('div', 'to-stream', S.card);
    S.stream.hidden = S.cardH - S.FIXED - S.rowH * S.spec.pageSize < 95;
    S.P.el('h4', '', S.stream, 'Team updates');
    for (const [text, time] of [['Weekly records export completed', '12 min ago'], [S.actor + ' updated a shared view', '38 min ago'], ['Regional accounts review scheduled', '1 hour ago']]) {
      const line = S.P.el('div', 'to-stream-row', S.stream); S.P.icon(line, 'clock'); S.P.el('span', '', line, text); S.P.el('span', '', line, time);
    }
  }

  function workspaceData(S) {
    S.wr = S.rng.fork('workspace');
    S.company = env.content.pick(S.wr, env.content.COMPANIES, { csplit: S.spec.csplit });
    S.workspaceName = typeof S.company === 'string' ? S.company : S.company.name;
    S.actor = env.content.personName(S.wr, { csplit: S.spec.csplit }).full;
    S.expanded = S.W >= S.D.expandedAt;
    S.contextual = S.W >= S.D.contextAt && S.H >= S.D.contextHeight;
    S.navW = S.spec.scenario === 'resize' && S.W < 850 ? 0 : S.expanded ? S.D.navWidth : S.D.railWidth;
    S.contextW = S.contextual ? S.D.contextWidth : 0;
  }

  function fit(S) {
    S.cardW = S.W - S.D.cardInsetX - S.navW - S.contextW;
    S.cardH = S.H - S.D.cardInsetY;
    S.left = S.navW;
    S.top = S.D.cardTop;
    S.FIXED = S.D.fixedHeight;
    S.rowH = Math.max(S.D.rowMin, Math.min(S.D.rowMax, Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
  }

  env.template('use-data-grid/_workspace', () => ({ showUtility, navItem, appbar, navigation, contextPanel, card, heading, tabs, stream, workspaceData, fit }));
})();
