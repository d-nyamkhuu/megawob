// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        // AcmeWorks Web 2.0 frame for this design. The task widget remains responsible
        // for the policy and request controls in the stage.
        const mast = util.el('div', 'acme-mast', document.body);
        const logo = util.el('div', 'acme-logo', mast);
        util.el('span', 'acme-mark', logo, '●');
        const wordmark = util.el('div', 'acme-wordmark', logo);
        util.el('strong', '', wordmark, 'AcmeWorks');
        util.el('small', '', wordmark, 'People  •  Teams  •  Results');
        const userlinks = util.el('div', 'acme-userlinks', mast);
        util.el('span', '', userlinks, 'Sarah Chen　 |　 HR Operations　 |　 Help　 |　 Sign Out');
        const search = util.el('div', 'acme-search', mast);
        const searchbox = util.el('span', '', search, 'Search people...');
        util.el('b', '', search, '⌕');
        const tabs = util.el('nav', 'acme-tabs', mast);
        for (const [label, active] of [
          ['Home', false],
          ['People', false],
          ['Recruiting', false],
          ['Time Off', true],
          ['Performance', false],
          ['Reports', false],
          ['Admin', false],
        ]) {
          util.el('span', `acme-tab${active ? ' active' : ''}`, tabs, label);
        }
        const summary = util.el('div', 'acme-summary', document.body);
        util.el('div', 'acme-calendar', summary, '▦');
        const titlebox = util.el('div', 'acme-summary-title', summary);
        util.el('strong', '', titlebox, 'Time Off');
        util.el('span', '', titlebox, 'Manage leave requests and employee balances');
        const metric = (label, value, sub) => {
          const box = util.el('div', 'acme-metric', summary);
          util.el('span', '', box, label);
          util.el('strong', '', box, value);
          util.el('small', '', box, sub);
        };
        metric('Open Requests', '6', 'requiring review');
        metric('Employees on Leave', '8', 'this month');
        metric('Team Coverage', '92%', 'forecast (next 4 weeks)');
        const tips = util.el('div', 'acme-tips', document.body);
        util.el('strong', '', tips, '💡　Tips');
        util.el(
          'span',
          '',
          tips,
          '•　Approve requests that meet the leave policy and keep team coverage at or above the policy minimum.　 •　Deny requests that fall on blackout dates, exceed the employee’s balance, or would leave the team below the coverage requirement.　 •　Check the dates, remaining balance after the request, and team coverage forecast for each request.',
        );
        const winbar = util.el('div', 'qt-titlebar', document.body);
        winbar.textContent = '▣  PeopleOps - Acme Corporation';
        const winbuttons = util.el('span', 'qt-window-buttons', winbar);
        winbuttons.textContent = '−  □  ×';
        const menubar = util.el('div', 'qt-menubar', document.body);
        menubar.textContent = 'File　 Edit　 View　 People　 Tools　 Reports　 Help';
        const rail = util.el('nav', 'qt-rail', document.body);
        for (const [icon, label] of [
          ['⌂', 'Home'],
          ['♧', 'Recruiting'],
          ['♟', 'People'],
          ['▣', 'Time Off'],
          ['▥', 'Performance'],
          ['▤', 'Compensation'],
          ['▤', 'Reporting'],
          ['⚙', 'Admin'],
        ]) {
          const item = util.el('div', `qt-rail-item${label === 'People' ? ' selected' : ''}`, rail);
          util.el('span', 'qt-rail-icon', item, icon);
          util.el('span', '', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, {
          header,
          logo,
          mast,
          menubar,
          metric,
          rail,
          search,
          searchbox,
          summary,
          tabs,
          tips,
          titlebox,
          userlinks,
          winbar,
          winbuttons,
          wordmark,
        });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const sidebarColumn = util.el('div', 'acme-sidebar', body);
        const leavePolicy = util.el('aside', 'acme-policy', sidebarColumn);
        util.el('h2', '', leavePolicy, 'Leave Policy');
        const policySection = (heading, lines) => {
          const section = util.el('section', '', leavePolicy);
          util.el('strong', '', section, heading);
          for (const line of lines) util.el('div', 'acme-policy-line', section, line);
          return section;
        };
        policySection('Entitlement & Balances', [
          'Annual Leave　　　　　　 20 days per year',
          'Sick Leave　　　　　　　 10 days per year',
          'Carryover　　　　　　　 Up to 5 days',
          'Balances shown include approved requests through today.',
        ]);
        policySection('Coverage Requirement', [
          'Check the current leave policy above the request queue for the required team availability.',
        ]);
        policySection('Blackout Dates', [
          'The current review’s blackout dates appear in the leave policy above the request queue.',
        ]);
        policySection('Request Rules', ['•　Minimum request length: 1 day', '•　Maximum consecutive days: 15 days']);
        S.frameSidebar(_c, sidebarColumn);
        Object.assign(_c, { body, leavePolicy, policySection, sidebarColumn });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        base(_c);
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) _c.sidebarColumn.prepend(panel);
      },
  };

  env.site({
    name: 'design-use-hr-timeoff-02',
    template: 'site/base',
    design: { parts },
  });
})();
