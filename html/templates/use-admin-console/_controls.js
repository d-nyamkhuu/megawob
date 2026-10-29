/* use-admin-console/_controls: Shared controls, tables and service navigation.
 * Installs the console's existing parts; W is its private live state.
 */
(function () {
  'use strict';
  env.template('use-admin-console/_controls', () => ({
    install(BASE, W) {
      BASE.icon = (parent, name, cls = '') => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', `aa-icon ${cls}`); svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', W.D.icons[name] || W.D.icons.document);
        svg.append(path); parent.append(svg); return svg;
      };

      BASE.button = (parent, label, target, action, cls = '', glyph) => {
        const b = W.el('button', `aa-button ${cls}`, parent); b.type = 'button';
        if (glyph) W.P.icon(b, glyph); if (label) W.el('span', '', b, label);
        if (target) W.put(target, b); if (action) b.addEventListener('click', () => W.P.act(action)); return b;
      };

      BASE.preview = (parent, label, glyph, title = label, cls = '') => {
        const b = W.P.button(parent, label, null, null, cls, glyph);
        if (!label) b.setAttribute('aria-label', title); b.title = title;
        b.addEventListener('click', () => { W.ui.preview = title; W.ui.scroll = W.main?.scrollTop || 0; W.P.draw(W.ctx.model); }); return b;
      };

      BASE.picker = (parent, id, value) => {
        const b = W.P.button(parent, value || 'Choose an option', { pick: id }, { pick: id }, 'aa-picker'); W.P.icon(b, 'down'); return b;
      };

      BASE.status = (parent, text, tone = '') => {
        const x = W.el('span', `aa-status ${tone}`, parent); W.el('i', 'aa-dot', x); W.el('span', '', x, text); return x;
      };

      BASE.banner = (parent, title, text, warn = false) => {
        const box = W.el('div', `aa-banner${warn ? ' warn' : ''}`, parent); W.P.icon(box, warn ? 'warning' : 'info');
        const content = W.el('div', '', box); if (title) W.el('strong', '', content, title); W.el('span', '', content, text); return box;
      };

      BASE.section = (parent, title, glyph) => {
        const box = W.el('section', 'aa-section', parent), head = W.el('div', 'aa-section-head', box);
        if (glyph) W.P.icon(head, glyph); W.el('span', '', head, title); return W.el('div', 'aa-section-body', box);
      };

      BASE.readonly = (parent, pairs) => {
        const grid = W.el('div', 'aa-readonly', parent);
        for (const [label, value] of pairs) { W.el('span', '', grid, label); const val = W.el('b', '', grid, value); if (label.includes('policy')) W.P.icon(val, 'lock'); }
      };

      BASE.actions = (parent = W.workspace) => W.el('div', 'aa-actions', parent);

      BASE.miniTable = (parent, labels, rows) => {
        const t = W.el('table', 'aa-mini-table', parent), tr = W.el('tr', '', W.el('thead', '', t));
        labels.forEach(label => W.el('th', '', tr, label)); const body = W.el('tbody', '', t);
        rows.forEach(row => { const r = W.el('tr', '', body); row.forEach(value => W.el('td', '', r, value)); }); return t;
      };

      BASE.history = (parent, entries) => {
        for (const [text, detail] of entries) W.P.activity(parent, text, detail);
      };

      BASE.pager = (records, m) => {
        const p = W.el('div', 'aa-pager', W.workspace);
        W.el('span', 'aa-grow aa-muted', p, `${m.page * m.pageSize + 1}-${Math.min(records.length, m.page * m.pageSize + m.pageSize)} of ${records.length} records`);
        const pages = Math.ceil(records.length / m.pageSize);
        for (let i = 0; i < pages; i++) W.P.button(p, String(i + 1), { page: i }, { page: i }, m.page === i ? 'current' : '');
        if (pages < 6 && !W.tiny) W.el('span', 'aa-muted', p, `${m.pageSize} / page`);
      };

      BASE.table = (parent, labels, cls) => {
        const t = W.el('table', `aa-table ${cls || ''}`, parent), tr = W.el('tr', '', W.el('thead', '', t));
        for (const [label, css] of labels) W.el('th', css || '', tr, label);
        return W.el('tbody', '', t);
      };

      BASE.user = (parent, u, target) => {
        const row = W.el('div', 'aa-user', parent);
        W.el('span', 'aa-avatar', row, u.name.split(' ').map(x => x[0]).slice(0, 2).join(''));
        const info = W.el('div', 'aa-user-info', row);
        if (target) W.P.button(info, u.name, target, { row: u.id }, 'aa-link'); else W.el('b', '', info, u.name);
        W.el('small', 'aa-email', info, u.email); return row;
      };

      BASE.sidebar = (frame) => {
        const rail = W.el('nav', 'aa-sidebar', frame); rail.setAttribute('aria-label', 'Administration services');
        const groups = [
          ['Workspace', [['Overview', 'grid', ''], ['Resource groups', 'folder', '12']]],
          ['Manage', [['Virtual machines', 'compute', '24', 'vm'], ['Users & access', 'users', String(W.s.users.length), 'iam'],
            ['User security', 'shield', '3', 'resetuser'], ['Service desk', 'ticket', String(W.s.tickets.length), 'tickets'], ['Limits & quotas', 'quota', '18', 'quota']]],
          ['Operations', [['Virtual networks', 'network', '7'], ['Storage volumes', 'disk', '31'], ['Activity log', 'clock', ''], ['Billing & usage', 'document', '']]],
          ['Governance', [['Policies', 'shield', '6'], ['Settings', 'settings', '']]],
        ];
        for (const [label, links] of groups) {
          W.el('div', 'aa-side-label', rail, label);
          for (const [name, glyph, count, scenario] of links) {
            const b = W.P.preview(rail, name, glyph, name, `aa-side-link${W.s.scenario === scenario ? ' on' : ''}`);
            if (count) W.el('small', '', b, count);
            if (W.s.scenario === scenario) b.setAttribute('aria-current', 'page');
          }
        }
        const foot = W.el('div', 'aa-side-footer', rail); W.P.status(foot, 'Service health: normal');
        W.el('b', '', foot, 'Plan: Enterprise Standard'); W.el('span', '', foot, 'Support ID NS-2048');
      };

      BASE.topbar = () => {
        const top = W.el('div', 'aa-top', W.shell); W.P.icon(top, 'logo', 'aa-logo'); W.el('span', 'aa-brand', top, W.D.brand);
        W.el('i', 'aa-separator', top); W.P.preview(top, 'Production', 'folder', 'Organization & projects', 'ghost aa-tenant');
        const search = W.el('label', 'aa-global-search', top); W.P.icon(search, 'search');
        const input = W.el('input', '', search); input.type = 'search'; input.placeholder = W.D.searchPlaceholder; input.setAttribute('aria-label', W.D.searchPlaceholder); input.value = W.ui.search;
        input.addEventListener('input', () => { W.ui.search = input.value; });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') { W.ui.preview = 'Search results'; W.P.draw(W.ctx.model); } });
        if (!W.narrow) W.el('kbd', '', search, 'Search');
        W.el('span', 'aa-grow', top); const bell = W.P.preview(top, '', 'bell', 'Notifications', 'icon ghost'); W.el('i', 'aa-dot', bell);
        W.P.preview(top, '', 'help', 'Help & support', 'icon ghost');
        W.el('span', 'aa-avatar', top, 'AD').title = 'Admin session / northstar.example';
      };
    },
  }));
})();
