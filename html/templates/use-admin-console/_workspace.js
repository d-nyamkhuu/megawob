/* use-admin-console/_workspace: Workspace headings, command bars, frame and scroll pane.
 * Installs the console's existing parts; W is its private live state.
 */
(function () {
  'use strict';
  env.template('use-admin-console/_workspace', () => ({
    install(BASE, W) {
      BASE.heading = (m) => {
        const head = W.el('header', 'aa-header', W.workspace), crumbs = W.el('div', 'aa-breadcrumbs', head);
        [W.D.brand, W.s.scenario === 'tickets' ? 'IT operations' : 'Production', 'Administration'].forEach((label, i) => { if (i) W.P.icon(crumbs, 'chevron'); W.el('span', '', crumbs, label); });
        const row = W.el('div', 'aa-heading-row', head); W.P.icon(row, W.D.glyphs[W.s.scenario]); W.el('h2', '', row, W.D.titles[W.s.scenario]);
        const chip = W.el('span', 'aa-chip', row, W.s.scenario === 'vm' ? 'Production' : W.s.scenario === 'tickets' ? 'Open workset' : 'Standard policy');
        if (W.s.scenario === 'resetuser') W.P.icon(chip, 'lock');
        W.el('span', 'aa-grow', row); if (!W.tiny) W.P.preview(row, '', 'more', 'Page actions', 'ghost icon');
        W.el('div', 'aa-sub', head, W.ui.refreshed ? 'Resource status refreshed / connected to Northstar Directory' : W.s.scenario === 'vm' ? 'Compute resources / shared-infrastructure' : W.s.scenario === 'quota' ? 'Service usage and subscription limits' : W.s.scenario === 'tickets' ? 'Incidents assigned to the IT operations workspace' : 'Operations pilot / northstar.example / Member accounts');
      };

      BASE.tabs = (m) => {
        const tabs = W.el('div', 'aa-tabs', W.workspace);
        const tabNames = W.s.scenario === 'vm' ? ['Configuration', 'Monitoring', 'Activity log', 'Tags'] : W.s.scenario === 'iam' ? ['All users', 'Groups', 'Licences', 'Access reviews']
          : W.s.scenario === 'resetuser' ? ['Accounts', 'Authentication methods', 'Sign-in activity'] : W.s.scenario === 'tickets' ? ['Open tickets', 'Queue overview', 'Resolved', 'Knowledge'] : ['Configuration', 'Usage trends', 'Change history'];
        tabNames.forEach((name, i) => {
          const b = i ? W.P.preview(tabs, name, null, name, 'aa-tab') : W.P.button(tabs, name, null, null, 'aa-tab on');
          if (i === 0) b.setAttribute('aria-current', 'page');
        });
      };

      BASE.toolbar = (m) => {
        const tools = W.el('div', 'aa-toolbar', W.workspace);
        W.P.preview(tools, W.s.scenario === 'tickets' ? 'Open incidents' : W.s.scenario === 'vm' ? 'shared-infrastructure' : W.s.scenario === 'quota' ? 'Production' : 'Operations pilot', 'folder', 'Saved views');
        W.P.preview(tools, 'Filter', 'filter', 'View filters');
        const refresh = W.P.button(tools, '', null, null, 'icon', 'refresh'); refresh.setAttribute('aria-label', 'Refresh status'); refresh.title = 'Refresh status';
        refresh.addEventListener('click', () => { W.ui.refreshed = true; W.ui.scroll = W.main.scrollTop; W.P.draw(W.ctx.model); });
        const scope = W.el('span', 'aa-scope aa-grow', tools); if (!W.compact) { W.P.icon(scope, 'lock'); W.el('span', '', scope, 'Organization managed'); }
        if (!W.tiny) W.P.preview(tools, 'Export', 'export', 'Export options', 'aa-toolbar-extra');
      };

      BASE.workflow = (m) => {
        if (W.s.judge?.mode === 'ambiguous' && !['iam', 'resetuser'].includes(W.s.scenario)) {
          W.el('h3', '', W.main, 'Account context'); W.P.banner(W.main, 'Multiple accounts match this name', 'Resource ownership uses the account email. No resource changes have been made.');
          for (const u of W.s.users.slice(0, 2)) { const card = W.P.section(W.main, u.id, 'users'); W.P.user(card, u); W.el('p', 'aa-sub', card, `${u.team} / Member / Directory synced`); }
        } else if (W.s.scenario === 'vm') W.P.vm(m); else if (['iam', 'resetuser'].includes(W.s.scenario)) W.P.directory(m); else if (W.s.scenario === 'tickets') W.P.tickets(m); else W.P.quota(m);
      };

      BASE.notice = (m) => {
        if (m.notice) { const notice = W.el('div', `aa-notice${m.notice.startsWith('Enter') ? ' error' : ''}`, W.workspace); notice.setAttribute('role', 'status'); W.P.icon(notice, m.notice.startsWith('Enter') ? 'warning' : 'check'); W.el('span', '', notice, m.notice); }
      };

      BASE.facts = (m) => {
        const foot = W.el('div', 'aa-facts', W.workspace); W.P.icon(foot, 'shield');
        for (const fact of W.f.facts(m, W.s)) { const item = W.el('span', '', foot); W.el('b', '', item, `${fact.label}: `); W.el('span', fact.label.includes('reference') || fact.label === 'Resource ID' ? 'aa-mono' : '', item, fact.value); }
      };

      BASE.frame = () => {
        const frame = W.el('div', 'aa-frame', W.shell); W.P.sidebar(frame); W.workspace = W.el('div', 'aa-workspace', frame);
        return frame;
      };

      BASE.content = () => {
        return W.el('div', 'aa-content-row', W.workspace);
      };

      BASE.main = (parent) => {
        const pane = W.put({ pane: true }, W.el('div', `aa-main${['iam', 'resetuser', 'tickets'].includes(W.s.scenario) ? ' table' : ''}`, parent));
        pane.addEventListener('scroll', () => { if (!W.drawing && pane === W.main && pane.isConnected) { W.ui.scroll = pane.scrollTop; W.P.mirrorClipped(); } });
        return pane;
      };
    },
  }));
})();
