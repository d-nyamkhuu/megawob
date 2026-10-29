// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        if (kind === 'banner') document.querySelector('.ref-body')?.before(el);
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => {
            if (how) {
              ctx.dismiss(how);
              if (kind === 'banner') document.querySelector('.af-app')?.humanLayout?.();
            } else env.log('overlay-click', { label });
          });
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        if (kind === 'banner') document.querySelector('.af-app')?.humanLayout?.();
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const windowTitle = util.el('div', 'flow-window-title', document.body);
        const logo = util.el('span', 'flow-window-logo', windowTitle);
        logo.innerHTML =
          '<svg viewBox="0 0 26 26" aria-hidden="true"><g fill="#ee8c41" stroke="#493b2d" stroke-width="1.5"><ellipse cx="13" cy="7" rx="5" ry="6"/><ellipse cx="19" cy="12" rx="5" ry="6" transform="rotate(60 19 12)"/><ellipse cx="16" cy="19" rx="5" ry="6" transform="rotate(135 16 19)"/><ellipse cx="8" cy="18" rx="5" ry="6" transform="rotate(40 8 18)"/><ellipse cx="6" cy="10" rx="5" ry="6" transform="rotate(-40 6 10)"/></g><circle cx="12" cy="13" r="4" fill="#8a6d4f"/></svg>';
        util.el('span', '', windowTitle, 'Relayboard');
        const windowControls = util.el('div', 'flow-window-controls', windowTitle);
        for (const label of ['−', '□', '×']) util.el('span', '', windowControls, label);
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          logo,
          nav,
          placement,
          sidebar,
          wantFooter,
          windowControls,
          windowTitle,
        });
      },
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
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);

        // Workflow details band from Relayboard's record view. Keep the existing
        // instruction node in the band when the episode asks for header display.
        const summary = util.el('section', 'flow-summary', document.body);
        const summaryMain = util.el('div', 'flow-summary-main', summary);
        const appIcon = util.el('div', 'flow-app-icon', summaryMain);
        appIcon.innerHTML =
          '<svg viewBox="0 0 50 60" fill="#fff5d7" stroke="#202420" stroke-width="2.5" stroke-linejoin="round" aria-hidden="true"><path d="M25 18v18M10 45V32h30v13" fill="none"/><rect x="17" y="3" width="17" height="17" rx="1"/><rect x="2" y="43" width="16" height="16" rx="1"/><rect x="33" y="43" width="16" height="16" rx="1"/><circle cx="25" cy="32" r="3" fill="#263139"/></svg>';
        const summaryCopy = util.el('div', 'flow-summary-copy', summaryMain);
        util.el('div', 'flow-title', summaryCopy, 'Support Request Flow');
        const metadata = util.el('div', 'flow-metadata', summaryCopy);
        for (const [label, value] of [
          ['Modified', 'Apr 24, 2006   2:17 PM'],
          ['Owner', 'Support Team'],
          [
            'Description',
            'Routes incoming support requests, normalizes the data, notifies the owner and records the activity.',
          ],
        ]) {
          const row = util.el('div', 'flow-meta-row', metadata);
          util.el('span', 'flow-meta-label', row, label);
          util.el('span', 'flow-meta-value', row, value);
        }
        const status = util.el('div', 'flow-summary-status', summary);
        for (const [label, value] of [
          ['Status', 'Active'],
          ['Triggers', 'New support request (Email)'],
          ['Last run', 'Apr 24, 2006   1:03 PM'],
          ['Runs', '247'],
        ]) {
          const row = util.el('div', 'flow-status-row', status);
          util.el('span', 'flow-status-label', row, label);
          util.el('span', `flow-status-value${label === 'Status' ? ' is-active' : ''}`, row, value);
        }
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote) summaryCopy.appendChild(headerNote);
        Object.assign(_c, { appIcon, headerNote, metadata, status, summary, summaryCopy, summaryMain });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, rng, sidebar, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'flow-rail', body);
        const railItems = [
          [
            'Workflows',
            '<path d="M12 3v6M12 9H6v4m6-4h6v4"/><rect x="8" y="2" width="8" height="7" rx="1"/><rect x="2" y="13" width="8" height="8" rx="1"/><rect x="14" y="13" width="8" height="8" rx="1"/>',
          ],
          [
            'Library',
            '<path d="M3 7 12 3l9 4v17H3z" fill="#bcb2a0"/><path d="m3 7 9 5 9-5"/><path d="M12 12v6" stroke="#f9f8ef" stroke-width="3"/><circle cx="12" cy="14" r="2" fill="#f4f3ec"/>',
          ],
          [
            'Connections',
            '<path d="m3 24 6-7M14 2l-5 6m12 0-6 6" fill="none" stroke-width="2.5"/><path d="m6 7 11 10-4 4q-3 2-6-1l-3-3q-3-3-1-6z" fill="#918a7b"/>',
          ],
          [
            'Activity',
            '<rect x="3" y="2" width="19" height="22" rx="2" fill="#817b6c"/><path d="M9 7h9M9 12h9M9 17h9M6 7h.5M6 12h.5M6 17h.5" stroke="#faf7ec"/>',
          ],
          [
            'Settings',
            '<path d="M10 1h4l1 4 3-1 3 3-1 3 4 1v4l-4 1 1 3-3 3-3-1-1 3h-4l-1-4-3 1-3-3 1-3-4-1v-4l4-1-1-3 3-3 3 1z" fill="#8d8779"/><circle cx="12" cy="12" r="4" fill="#eee9df"/>',
          ],
        ];
        for (const [i, [label, path]] of railItems.entries()) {
          const link = util.el('a', `flow-rail-item${i === 0 ? ' selected' : ''}`, rail);
          link.href = '#';
          link.dataset.role = 'nav';
          const icon = util.el('span', 'flow-rail-icon', link);
          icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
          util.el('span', 'flow-rail-label', link, label);
          link.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
        }
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
        Object.assign(_c, { body, rail, railItems });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-workflow-editor-connect-02',
    template: 'site/base',
    design: { parts },
  });
})();
