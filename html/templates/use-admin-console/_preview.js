/* use-admin-console/_preview: Read-only previews and context activity.
 * Installs the console's existing parts; W is its private live state.
 */
(function () {
  'use strict';
  env.template('use-admin-console/_preview', () => ({
    install(BASE, W) {
      BASE.previewBody = (body, m) => {
        if (W.ui.preview === 'Notifications') W.P.history(body, [['Maintenance window announced', 'Private gateway updates / next scheduled maintenance'], ['Monthly usage report is ready', 'Production subscription / billing centre'], ['Access review due', 'Operations pilot / policy AP-17']]);
        else if (W.ui.preview === 'Organization & projects') W.P.miniTable(body, ['Project', 'Environment', 'Status'], [['Infrastructure', 'Production', 'Active'], ['Customer portal', 'Staging', 'Active'], ['Data services', 'Production', 'Active'], ['Internal tools', 'Development', 'Active']]);
        else if (W.ui.preview === 'Groups' || W.ui.preview === 'Access reviews') {
          W.el('p', '', body, 'Inherited membership / organization managed. Individual role edits do not change these groups.');
          W.P.miniTable(body, ['Group', 'Membership', 'Review'], [['Infrastructure operators', 'Assigned / 16 members', 'Current'], ['All employees', 'Dynamic / 128 members', 'Current'], ['Finance approvers', 'Assigned / 9 members', 'Due in 12 days']]);
        } else if (W.ui.preview === 'Licences') {
          W.el('p', '', body, 'Subscription inventory / Production billing account');
          W.P.miniTable(body, ['Product', 'Allocated here', 'Purchased'], ['Workspace Basic', 'Workspace Plus'].map(name => [name, String(Object.values(m.access).filter(a => a.licence === name).length), '40 seats']));
        } else if (W.ui.preview === 'Authentication methods') {
          W.P.banner(body, 'Registration policy', 'Members must register a verified method. Password and MFA resets are managed from Accounts.');
          W.P.miniTable(body, ['Method', 'Policy', 'Registration'], [['Authenticator app', 'Enabled', 'Organization managed'], ['Security key', 'Enabled', 'Optional'], ['SMS recovery', 'Restricted', 'Recovery only']]);
        } else if (W.ui.preview === 'Sign-in activity') {
          W.P.miniTable(body, ['Application', 'Authentication', 'Result'], [['Admin console', 'MFA / managed device', 'Success'], ['Workspace web', 'Password + authenticator', 'Success'], ['Legacy mail client', 'Basic authentication', 'Blocked by policy']]);
        } else if (W.ui.preview === 'Queue overview') {
          W.P.miniTable(body, ['Assignment group', 'Tickets in workset', 'Availability'], W.s.options.queue.map(q => [q, String(Object.values(m.queues).filter(x => x === q).length), 'Accepting work']));
        } else if (W.ui.preview === 'Resolved') {
          W.el('p', '', body, 'Closed incidents / read only / outside the open ticket workset');
          W.P.miniTable(body, ['Number', 'Short description', 'Resolution'], [['HD-2681', 'Provision replacement headset', 'Hardware replaced'], ['HD-2687', 'Guest access expired', 'Account updated'], ['HD-2692', 'Invoice copy requested', 'Information provided']]);
        } else if (W.ui.preview === 'Knowledge') {
          W.P.history(body, [['Account recovery checklist', 'Identity desk / runbook KB-104'], ['Private network diagnostics', 'Network operations / runbook KB-217'], ['Standard incident categories', 'IT operations / classification guide']]);
        } else if (W.ui.preview === 'Monitoring' || W.ui.preview === 'Usage trends') {
          W.P.status(body, 'Telemetry connected');
          W.P.miniTable(body, ['Metric', 'Current', 'Observation'], W.ui.preview === 'Monitoring'
            ? [['CPU utilization', '2.4%', 'Within baseline'], ['Memory available', '78%', 'Within baseline'], ['Disk latency', '1.8 ms', 'Within baseline']]
            : [['Allocated resources', String(W.s.usage), 'Current subscription usage'], ['Regional capacity', 'Available', 'On-demand allocation'], ['Throttled requests', '0', 'Last reporting window']]);
        } else if (W.ui.preview === 'Tags') {
          W.P.miniTable(body, ['Key', 'Value', 'Source'], [['environment', m.values.tag, 'Resource'], ['organization', 'northstar', 'Inherited'], ['cost-centre', 'IT-204', 'Inherited']]);
        } else if (W.ui.preview === 'View filters' || W.ui.preview === 'Saved views') {
          W.P.banner(body, 'Managed workspace view', 'This view is scoped to the current workset. Organization-wide records are available in their own project contexts.');
          W.P.miniTable(body, ['Filter', 'Value', 'Source'], [['Project', 'IT operations / Production', 'Saved view'], ['Directory', 'northstar.example', 'Organization'], ['Scope', W.s.scenario === 'tickets' ? 'Open incidents' : 'Operations pilot', 'Workspace']]);
        } else if (W.ui.preview === 'Export options') {
          W.el('p', '', body, 'Export preview / current workspace / comma-separated values');
          W.P.readonly(body, [['Scope', W.s.scenario === 'tickets' ? `${W.s.tickets.length} open tickets` : `${W.s.users.length} member accounts`], ['Format', 'CSV / UTF-8'], ['Sensitive data', 'Credentials excluded'], ['Audit policy', 'Export activity is logged']]);
        }
        else if (W.ui.preview === 'Search results') {
          W.el('p', '', body, `Results for "${W.ui.search || 'resources'}" in Production`);
          for (const name of ['gateway-prod-01', 'shared-infrastructure', 'metrics-collector', 'backup-vault-prod'].filter(x => !W.ui.search || x.includes(W.ui.search.toLowerCase()))) {
            const row = W.el('div', 'aa-preview-row', body, name); W.el('small', '', row, 'Related inventory / managed by Infrastructure');
          }
          if (W.ui.search && !['gateway-prod-01', 'shared-infrastructure', 'metrics-collector', 'backup-vault-prod'].some(x => x.includes(W.ui.search.toLowerCase()))) W.P.banner(body, 'No matching resources', 'Try a resource name or resource group. The current task remains in its service workspace.');
        } else {
          W.el('p', '', body, `${W.ui.preview} / Production subscription / read-only overview`);
          W.P.history(body, [['Configuration is organization managed', 'Owner: Infrastructure team / Production baseline'], ['Last administrative operation', 'Status: Completed / audit retained for 365 days']]);
          W.P.miniTable(body, ['Resource', 'Scope', 'Status'], [['gateway-prod-01', 'shared-infrastructure', 'Available'], ['metrics-collector', 'observability', 'Healthy'], ['backup-vault-prod', 'storage', 'Protected']]);
        }
      };

      BASE.contextSection = (aside, title, glyph) => {
        const sec = W.el('section', 'aa-context-section', aside), head = W.el('h4', '', sec); if (glyph) { W.P.icon(head, glyph); head.style.display = 'flex'; head.style.gap = '6px'; } W.el('span', '', head, title); return sec;
      };

      BASE.activity = (parent, text, detail) => {
        const row = W.el('div', 'aa-activity', parent); W.P.icon(row, 'clock'); const body = W.el('div', '', row, text); W.el('small', '', body, detail); return row;
      };
    },
  }));
})();
