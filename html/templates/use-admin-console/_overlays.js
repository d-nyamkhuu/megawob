/* use-admin-console/_overlays: Context rail, dialogs, redraw and model transitions.
 * Installs the console's existing parts; W is its private live state.
 */
(function () {
  'use strict';
  env.template('use-admin-console/_overlays', () => ({
    install(BASE, W) {
      BASE.related = (parent, scenario) => {
        const box = W.P.section(parent, scenario === 'vm' ? 'Other resources in this group' : 'Recent operations', 'folder');
        W.P.miniTable(box, ['Name', 'Type', 'Status'], [['gateway-prod-01', 'Gateway', 'Available'], ['metrics-collector', 'Compute', 'Running'], ['backup-vault-prod', 'Storage', 'Protected']]);
      };

      BASE.context = (parent, m) => {
        const aside = W.el('aside', 'aa-context', parent); aside.setAttribute('aria-label', 'Resource context');
        const box = (title, glyph) => W.P.contextSection(aside, title, glyph);
        if (W.s.scenario === 'vm') {
          const cost = box('Estimated monthly cost', 'document'); W.el('div', 'aa-price', cost, W.f.helpers.cost(m, W.s)); W.el('p', '', cost, 'USD / 730 compute hours');
          W.P.readonly(cost, [['Pricing plan', 'On demand'], ['SSD storage', `${m.values.disk} GiB`], ['Billing account', 'Production']]);
          W.el('p', '', cost, 'Taxes, snapshots and network traffic are not included.');
        } else if (W.s.scenario === 'iam') {
          const licence = box('Licence allocation', 'users'); const used = Object.values(m.access).filter(a => a.licence !== 'None').length;
          W.el('div', 'aa-price', licence, `${used} / 40`); W.el('p', '', licence, 'Seats allocated in this workspace');
          const meter = W.el('div', 'aa-meter', licence); W.el('i', '', meter).style.width = `${used / 40 * 100}%`;
          W.P.readonly(licence, [['Plan', 'Workspace Plus'], ['Assignment', 'Direct / user level'], ['Renewal', 'Monthly']]);
        } else if (W.s.scenario === 'resetuser') {
          const account = m.selected && W.s.users.find(u => u.id === m.selected), sec = box('Authentication profile', 'shield');
          if (account) { W.el('b', '', sec, account.name); W.el('p', '', sec, account.email); }
          else W.el('p', '', sec, 'Select an account to inspect its credential actions.');
          W.P.readonly(sec, [['Source', 'Northstar Directory'], ['MFA policy', 'Required for members'], ['Recovery channel', 'Organization managed'], ['Audit retention', '365 days']]);
        } else if (W.s.scenario === 'tickets') {
          const sec = box('Assignment groups', 'ticket');
          for (const queue of W.s.options.queue) {
            const count = Object.values(m.queues).filter(q => q === queue).length;
            const row = W.el('div', 'aa-activity', sec); const item = W.el('div', 'aa-grow', row, queue); W.el('small', '', item, 'IT operations / accepting work'); W.el('span', 'aa-tag', row, String(count));
          }
          const sla = box('Workset service levels', 'clock'); W.P.status(sla, `${W.s.tickets.filter(t => t.priority === 'Urgent').length} urgent tickets`, 'warn');
          W.el('p', '', sla, 'Priority is inherited from the requester. Routing does not change due dates.');
        } else {
          const sec = box('Quota policy', 'shield'); W.P.readonly(sec, [['Scope', 'Production subscription'], ['Provider', 'Northstar.Compute'], ['Enforcement', 'Regional'], ['Owner', 'Infrastructure team']]);
          const meter = W.el('div', 'aa-meter', sec); W.el('i', '', meter).style.width = `${Math.min(100, W.s.usage / Number(m.savedLimit) * 100)}%`;
          W.el('p', '', sec, `${W.s.usage} in use / ${m.savedLimit} saved limit`);
        }
        const projects = box('Other projects', 'folder');
        for (const [name, detail] of [['Customer portal', 'Staging / 14 resources'], ['Data services', 'Production / 38 resources'], ['Internal tools', 'Development / 9 resources']]) {
          const row = W.el('div', 'aa-activity', projects); W.P.icon(row, 'folder'); const text = W.el('div', '', row, name); W.el('small', '', text, detail);
        }
        W.P.history(box('Recent activity', 'clock'), [['Policy evaluation completed', 'Production baseline / no changes'], ['Backup schedule verified', 'shared-infrastructure / 18 min ago'], ['Directory sync', 'northstar.example / 24 min ago']]);
      };

      BASE.modal = (m) => {
        if (!m.open && !m.editing && !m.dialog && !W.ui.preview) return;
        const { dialog, title, body } = W.P.dialog(m);
        if (W.ui.preview) {
          title.textContent = W.ui.preview;
          W.P.previewBody(body, m);
          const b = W.P.button(W.P.actions(dialog), 'Close', null, null); b.addEventListener('click', () => { W.ui.preview = null; W.P.draw(W.ctx.model); });
        } else if (m.open) {
          const id = m.open, field = W.s.fields.find(x => x.id === id);
          title.textContent = id.startsWith('queue:') ? `Assignment group / ${id.slice(6)}` : field?.label || ({ licence: 'Product licence', role: 'Directory role', action: 'Security action' })[id];
          W.el('p', '', body, id.startsWith('queue:') ? 'Active groups in IT operations. Changes are recorded in the ticket history.' : field?.hint || 'This assignment applies to the current user only.');
          const current = field ? m.values[id] : id.startsWith('queue:') ? m.queues[id.slice(6)] : id === 'action' ? m.action : m.draftAccess[id];
          const options = W.s.options[id.startsWith('queue:') ? 'queue' : id];
          for (const value of options) W.P.option(body, id, value, current);
        } else if (m.editing) {
          title.textContent = 'Manage access'; const u = W.s.users.find(x => x.id === m.editing); W.P.user(body, u);
          W.P.banner(body, 'Direct assignment', 'Group-based access and inherited policies remain unchanged.');
          W.el('label', 'aa-label', body, 'Directory role'); W.P.picker(body, 'role', m.draftAccess.role);
          W.el('label', 'aa-label', body, 'Product licence'); W.P.picker(body, 'licence', m.draftAccess.licence);
          W.el('p', '', body, 'Role and licence updates may take a few minutes to propagate to connected services.');
          const bar = W.P.actions(dialog); W.P.button(bar, 'Cancel', { nav: 'cancel' }, { nav: 'cancel' }); W.P.button(bar, 'Save changes', { nav: 'saveAccess' }, { nav: 'saveAccess' }, 'primary');
        } else {
          title.textContent = `${m.action}?`; const u = W.s.users.find(x => x.id === m.selected); W.P.user(body, u);
          W.el('p', 'aa-mono', body, `Object ID: ${u.id} / Source: Northstar Directory`);
          W.P.banner(body, 'This action cannot be undone', m.action === 'Reset MFA' ? 'Registered authentication methods will be removed. This user must register new methods at the next sign-in.' : 'The current password will stop working. A temporary credential will be issued through the secure recovery channel.', true);
          W.P.readonly(body, [['Email notification', m.notify ? 'Yes' : 'No'], ['Audit logging', 'Required / 365-day retention'], ['Requested action', m.action]]);
          const bar = W.P.actions(dialog); W.P.button(bar, 'Cancel', { nav: 'cancel' }, { nav: 'cancel' }); W.P.button(bar, m.action, { nav: 'confirm' }, { nav: 'confirm' }, 'danger');
        }
        dialog.setAttribute('aria-label', title.textContent);
        dialog.addEventListener('scroll', () => { if (!W.drawing && dialog.isConnected) W.P.mirrorClipped(); });
      };

      BASE.mirrorClipped = () => {
        if (!W.main || !W.main.isConnected) return;
        const dialog = W.shell.querySelector('.aa-dialog'), clipped = {};
        for (const [id, node] of Object.entries(W.targets)) {
          const pane = dialog?.contains(node) ? dialog : W.main.contains(node) ? W.main : null;
          if (!pane || node === W.main) continue;
          const r = pane.getBoundingClientRect(), box = node.getBoundingClientRect(), y = box.top + box.height / 2;
          const sticky = pane === W.main ? (W.main.querySelector('thead')?.offsetHeight || 0) : 0;
          if (box.top < r.top + sticky + 3 || box.bottom > r.bottom - 3) clipped[id] = Math.round(y - (r.top + sticky + r.bottom) / 2);
        }
        if (JSON.stringify(W.ctx.model.clipped || {}) !== JSON.stringify(clipped)) W.ctx.update({ ...W.ctx.model, clipped });
      };

      BASE.draw = (m) => {
        W.drawing = true; W.shell.replaceChildren(); W.targets = {}; W.P.topbar();
        W.P.frame(); W.P.heading(m); W.P.tabs(m); W.P.toolbar(m);
        const contentRow = W.P.content(); W.main = W.P.main(contentRow);
        W.P.workflow(m);
        if (W.withContext) W.P.context(contentRow, m);
        W.P.notice(m); W.P.facts(m);
        W.P.decorated(W.ctx, m);
        W.main.scrollTop = W.ui.scroll; W.P.modal(W.ctx.model); W.drawing = false; W.P.mirrorClipped();
      };

      BASE.act = (a, redraw = true) => {
        if (W.s.judge?.mode === 'confirm' && ['confirm', 'create', 'saveAccess', 'saveQuota', 'applyRoutes'].includes(a.nav)) { W.ctx.flag('irreversible'); return; }
        W.ui.scroll = 0; W.ctx.update(W.f.helpers.apply(W.ctx.model, W.s, a)); if (redraw) W.P.draw(W.ctx.model);
      };
    },
  }));
})();
