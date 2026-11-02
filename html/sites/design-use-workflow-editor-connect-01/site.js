// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          if (display !== 'header' || nav) rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Relayboard');
          brand.dataset.role = 'brand';
        }
        {
          const n = util.el('nav', 'ref-nav', header);
          if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['Home', 'Workflows', 'Templates', 'Integrations', 'Reports', 'People', 'Account']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
          const search = util.el('div', 'ref-search', header);
          const field = util.el('input', '', search);
          field.placeholder = 'Search workflows';
          field.setAttribute('aria-label', 'Search workflows');
          const go = util.el('button', '', search, 'Go');
          go.type = 'button';
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, rng, sidebar, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        {
          const side = util.el('aside', 'ref-side', body);
          if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
          util.el('div', 'ref-directory-title', side, 'Workflows');
          const list = util.el('div', 'ref-directory-list', side);
          for (const [i, item] of [
            'Order Processing',
            'Customer Onboarding',
            'Support Escalation',
            'Invoice Reminders',
            'Lead Nurture',
            'Product Feedback',
            'Trial to Paid',
            'Account Renewal',
            'Shipping Notifications',
            'Partner Registration',
            'Weekly Report',
            'Data Sync',
            'Inactive Accounts',
            'Winback Campaign',
            'Event Follow Up',
            'Survey Responses',
            'Bug Tracking',
            'Feature Requests',
            'Internal Approvals',
            'IT Service Desk',
          ].entries()) {
            const a = util.el('a', `ref-sidelink${i === 0 ? ' selected' : ''}`, list, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
        }
        Object.assign(_c, { body });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-workflow-editor-connect-01',
    template: 'site/base',
    design: { parts },
  });
})();
