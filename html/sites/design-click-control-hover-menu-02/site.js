// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-hover-menu-02',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Acme Admin Console',
        'theme': 'qt',
        'layout': 'dock',
        'tools': 'File    Edit    View    Tools    Help',
        'foot': 'Task List|Status|Notes|Actions',
        'overview': '12 Servers|348 Devices|512 Users|3 Open issues',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, shell, u } = _c;
            const actionbar = u.el('div', 'actionbar', head);
            ['⌂|Home', '⟳|Refresh', '＋|New', '▤|Delete', '⚙|Settings'].forEach((x, i) => {
              const b = u.el('div', 'action-item' + (i === 3 ? ' disabled' : ''), actionbar);
              const z = x.split('|');
              u.el('b', '', b, z[0]);
              u.el('span', '', b, z[1]);
            });
            u.el('div', 'searchbox', actionbar, '⌕　 Search...');
            if (cfg.overview) {
              const ov = u.el('section', 'overview', shell);
              cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
            }
            const dash = u.el('section', 'dashboard-data', shell);
            dash.innerHTML = `<section class="activity"><h2>Recent Activity</h2><table><thead><tr><th>Time　⌄</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody><tr><td>Apr 24, 2018 10:14</td><td>jcarter</td><td>Login</td><td>Successful login from 192.168.1.24</td></tr><tr><td>Apr 24, 2018 09:58</td><td>mlopez</td><td>Device added</td><td>Laptop-0276 (Windows 10)</td></tr><tr><td>Apr 24, 2018 09:41</td><td>apatel</td><td>Settings changed</td><td>Updated password policy</td></tr><tr><td>Apr 24, 2018 09:12</td><td>kwilson</td><td>User created</td><td>New user: dnguyen</td></tr><tr><td>Apr 24, 2018 08:55</td><td>dnguyen</td><td>Login</td><td>Successful login from 10.0.0.52</td></tr><tr><td>Apr 24, 2018 08:33</td><td>mlopez</td><td>Application deployed</td><td>Accounting 3.2.1</td></tr><tr><td>Apr 24, 2018 08:20</td><td>jcarter</td><td>Device removed</td><td>Tablet-1042</td></tr><tr><td>Apr 24, 2018 07:51</td><td>apatel</td><td>Settings changed</td><td>Updated network settings</td></tr></tbody></table></section><section class="issues"><h2>Open Issues</h2><table><thead><tr><th>ID</th><th>Title</th><th>Priority</th><th>Status</th></tr></thead><tbody><tr><td>INC-4182</td><td>Email delivery delays</td><td class="high">High</td><td>Open</td></tr><tr><td>INC-4176</td><td>VPN connection failures</td><td class="medium">Medium</td><td>Open</td></tr><tr><td>INC-4169</td><td>File sync errors</td><td class="medium">Medium</td><td>Open</td></tr></tbody></table></section>`;
            const work = u.el('div', 'work', shell);
            Object.assign(_c, { actionbar, dash, work });
          },
        'frame.9': () => () => {},
      },
    },
  });
})();
