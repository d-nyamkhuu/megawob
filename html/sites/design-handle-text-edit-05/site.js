// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-edit-05',
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {
        'title': 'WorkTrack',
        'theme': 'gloss',
        'layout': 'workspace',
        'tools': 'Projects|Milestones|Tasks|Discussions|Files',
        'rail': 'Home|Projects|Tasks|Calendar|Documents|People|Reports|Settings',
        'side':
          'Task Details|ID:　　PL-104|Project:　　Product Launch|Status:　　In Progress|Priority:　　Medium|Start Date:　　May 12, 2005|Due Date:　　May 27, 2005|% Complete:　　40|People|Owner:　　Alex Chen|Assignee:　　Dana Roberts|Tags|rollout, planning, regional|Related Documents|Rollout Overview.doc|Regional Analysis.xls|Training Plan.doc|Support Resources.pdf',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, u } = _c;
            if (cfg.tools) {
              const nav = u.el('nav', 'tools', head);
              cfg.tools.split('|').forEach((v, i) => {
                const a = u.el('span', 'nav-link' + (i === 0 ? ' active' : ''), nav, v);
              });
              const search = u.el('div', 'nav-search', nav);
              search.innerHTML = '<span>Search projects, tasks, people...</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';
            }
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.rail) {
              const rail = u.el('nav', 'rail', work);
              cfg.rail.split('|').forEach((s, i) => {
                const row = u.el('div', i === 1 ? 'active' : '', rail);
                const S0 = '<svg viewBox="0 0 24 24" aria-hidden="true">';
                const icons = [
                  S0 + '<path d="M3 12 12 4l9 8h-3v8h-4v-5h-4v5H6v-8z" fill="#4a86c5" stroke="#2c5d94" stroke-width="1"/></svg>',
                  S0 + '<rect x="2" y="5" width="20" height="14" rx="1.5" fill="#3f9a3f" stroke="#256b2a"/><path d="M2 9h20" stroke="#bfe6b3" stroke-width="2"/></svg>',
                  S0 + '<rect x="3" y="3" width="18" height="18" rx="2" fill="#fff" stroke="#2f5f93" stroke-width="2"/><path d="m7 12 4 4 7-8" fill="none" stroke="#2f5f93" stroke-width="2.5"/></svg>',
                  S0 + '<rect x="3" y="4" width="18" height="17" rx="2" fill="#fff" stroke="#4b6f9c" stroke-width="1.5"/><path d="M3 4h18v5H3z" fill="#4b78ad"/><text x="12" y="18" font-size="8" text-anchor="middle" fill="#2c4d78" font-family="Arial">31</text></svg>',
                  S0 + '<path d="M5 2h10l4 4v16H5z" fill="#fff" stroke="#5a7ea8" stroke-width="1.4"/><path d="M8 11h8M8 14h8M8 17h6" stroke="#7d9cc2"/></svg>',
                  S0 + '<circle cx="8" cy="8" r="3.5" fill="#3f78b8"/><circle cx="17" cy="9" r="3" fill="#6f9bd0"/><path d="M2 20c0-5 12-5 12 0zM13 20c0-4 9-4 9 0z" fill="#3f78b8"/></svg>',
                  S0 + '<path d="M4 20V11h4v9zM10 20V4h4v16zM16 20v-7h4v7z" fill="#3d6ea8"/></svg>',
                  S0 + '<circle cx="12" cy="12" r="6" fill="none" stroke="#4d6783" stroke-width="4" stroke-dasharray="3 1.6"/><circle cx="12" cy="12" r="5" fill="#4d6783"/></svg>',
                ];
                u.el('span', 'rail-icon', row).innerHTML = icons[i];
                u.el('span', '', row, s);
              });
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { center, ctx, note, stage, u } = _c;
            const list = u.el('section', 'project-list', center);
            const heading = u.el('h2', '', list, 'Projects');
            u.el('div', 'project-column', list, 'Name ▴');
            ['Customer Portal','Marketing Site Redesign','Product Launch','Operations Upgrade','Facilities Expansion','Partner Program','HR Systems','Q3 Planning','Research Initiative','Mobile Applications','Data Warehouse','IT Security','Compliance Audit','Brand Refresh','Vertical Solutions'].forEach((name, i) => {
              const row = u.el('div', 'project-row' + (i === 2 ? ' selected' : ''), list);
              const folder = u.el('span', 'folder-icon', row);
              folder.innerHTML = '<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M1.5 3.5h8l2.1 2.2h10.9v11.8H1.5z" fill="#eebf54" stroke="#a66a18" stroke-width="1.2"/><path d="M2 7h20l-2 10.5H2z" fill="#f7d47c" stroke="#b47a22" stroke-width="1"/><path d="M3 8h17" stroke="#fff0bd" stroke-width="1"/></svg>';
              u.el('span', '', row, name);
            });
            list.insertBefore(heading, list.firstChild);
            if (ctx.display === 'panel') note.classList.add('instruction-panel');
            Object.assign(_c, { projectList: list });
          },
        'frame.24': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.side) {
              _c.aside = u.el('aside', 'inspector', work);
              cfg.side.split('|').forEach((s, i) => {
                const header = ['Task Details','People','Tags','Related Documents'].includes(s);
                const row = u.el(header ? 'h2' : 'p', header ? 'inspector-head' : (i >= 14 ? 'attachment' : ''), _c.aside);
                if (i >= 14) {
                  const ext = s.trim().split('.').pop();
                  const col = ext === 'xls' ? '#2e8b3e' : ext === 'pdf' ? '#d33a2c' : '#2f5fa8';
                  const letter = ext === 'xls' ? 'X' : ext === 'pdf' ? 'A' : 'W';
                  row.innerHTML =
                    '<svg class="paperclip" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2h10l4 4v16H5z" fill="#fff" stroke="' + col + '" stroke-width="1.5"/><path d="M15 2v4h4" fill="none" stroke="' + col + '"/><text x="11" y="17" font-size="9" font-weight="bold" text-anchor="middle" fill="' + col + '" stroke="none" font-family="Arial">' + letter + '</text></svg><span class="attachment-name">' +
                    s.trim() +
                    '</span>';
                } else row.textContent = s;
              });
            }
          },
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.31': () => () => {},
        'frame.32': () => () => {},
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.43': () => () => {},
      },
    },
  });
})();
