/* use-admin-console/_records: Record rows, picker options and dialog controls.
 * Installs the console's existing parts; W is its private live state.
 */
(function () {
  'use strict';
  env.template('use-admin-console/_records', () => ({
    install(BASE, W) {
      BASE.directoryRow = (body, u, m) => {
        const tr = W.el('tr', m.selected === u.id ? 'selected' : '', body); const cb = W.el('td', 'aa-checkcell', tr); W.el('i', 'aa-checkmark', cb);
        const td = W.el('td', '', tr); W.P.user(td, u, { row: u.id });
        if (!W.compact) W.el('td', 'aa-muted', tr, u.team);
        const access = W.el('td', '', tr); W.el('span', '', access, m.access[u.id].role); W.el('small', '', access, m.access[u.id].licence);
        const st = W.el('td', '', tr); W.P.status(st, m.resets[u.id] ? 'Updated' : 'Enabled');
        if (!W.compact) W.el('small', '', st, 'Directory synced');
      };

      BASE.ticketRow = (body, t, m) => {
        const tr = W.el('tr', '', body), cb = W.el('td', 'aa-checkcell', tr); W.el('i', 'aa-checkmark', cb);
        const title = W.el('td', '', tr); W.el('span', 'aa-mono', title, t.id); W.el('small', '', title, t.title);
        if (!W.compact) W.el('small', '', title, t.requester);
        const cat = W.el('td', '', tr, t.category); const priority = W.el('small', '', cat); W.P.status(priority, t.priority, t.priority === 'Urgent' ? 'warn' : 'neutral');
        if (!W.compact) { const sla = W.el('td', '', tr); W.P.status(sla, t.priority === 'Urgent' ? '42m remaining' : 'Within SLA', t.priority === 'Urgent' ? 'warn' : ''); W.el('small', '', sla, 'Open'); }
        W.P.picker(W.el('td', '', tr), `queue:${t.id}`, m.queues[t.id]);
      };

      BASE.folder = (box, name, i, m) => {
        const b = W.P.button(box, '', i === 0 ? { depth: m.depth + 1 } : null, i === 0 ? { depth: m.depth + 1 } : null, 'aa-folder', i === 0 ? 'folder' : ['clock', 'document', 'shield'][i - 1]);
        const text = W.el('span', '', b, name); W.el('small', '', text, i === 0 ? 'Service configuration, usage and regional capacity' : ['Read recent administrative operations', 'Payment details and invoice settings', 'Inherited organization controls'][i - 1]);
        W.P.icon(b, 'chevron'); if (i > 0) b.addEventListener('click', () => { W.ui.preview = name; W.P.draw(W.ctx.model); });
      };

      BASE.option = (body, id, value, current) => {
        const b = W.P.button(body, '', { option: [id, value] }, { set: [id, value] }, `aa-option${current === value ? ' selected' : ''}`);
        const text = W.el('span', 'aa-grow', b, value);
        const description = id === 'role' ? ({ Reader: 'Read configuration and activity. No changes allowed.', Operator: 'Manage assigned resources. Cannot grant access.', Administrator: 'Manage resources and directory access.' })[value]
          : id === 'licence' ? ({ None: 'No paid productivity services', 'Workspace Basic': 'Email and web applications', 'Workspace Plus': 'Collaboration, desktop apps and advanced security' })[value]
            : id.startsWith('queue:') ? 'Active / accepts new incidents' : id === 'disk' ? 'Encrypted SSD / platform-managed keys' : id === 'image' ? 'Verified publisher / x86_64 / Gen 2' : id === 'network' ? 'Private subnet / baseline firewall policy' : '';
        if (description) W.el('small', '', text, description); if (current === value) W.P.icon(b, 'check');
      };

      BASE.resetControls = (m, active) => {
        const d = W.el('div', 'aa-detail', W.workspace), row = W.el('div', 'aa-detail-row', d);
        W.P.icon(row, 'shield'); W.el('b', '', row, active ? active.name : 'Account security'); W.P.picker(row, 'action', m.action);
        const label = W.el('label', '', row), check = W.put({ field: 'notify' }, W.el('input', '', label)); check.type = 'checkbox'; check.checked = m.notify;
        check.addEventListener('change', () => W.P.act({ set: ['notify', check.checked] })); W.el('span', '', label, 'Email notification');
        const b = W.P.button(row, 'Review reset', { nav: 'reset' }, { nav: 'reset' }, 'primary'); b.disabled = !active;
        W.el('div', 'aa-sub', d, active ? `${active.email} / Credential changes are recorded in the audit log.` : 'Select a user to manage password and authentication methods.');
      };

      BASE.dialog = (m) => {
        const overlay = W.el('div', 'aa-overlay', W.shell), dialog = W.el('div', 'aa-dialog', overlay);
        dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true');
        const head = W.el('div', 'aa-dialog-head', dialog); W.P.icon(head, m.dialog ? 'shield' : m.editing ? 'users' : W.ui.preview ? 'document' : 'settings');
        const title = W.el('h3', 'aa-grow', head);
        const close = W.P.button(head, '', null, null, 'icon ghost', 'close'); close.setAttribute('aria-label', 'Close dialog');
        close.addEventListener('click', () => { if (W.ui.preview) { W.ui.preview = null; W.P.draw(W.ctx.model); } else if (m.open) W.P.act({ pick: m.open }); else W.P.act({ nav: 'cancel' }); });
        const body = W.el('div', 'aa-dialog-body', dialog);
        return { dialog, title, body };
      };
    },
  }));
})();
