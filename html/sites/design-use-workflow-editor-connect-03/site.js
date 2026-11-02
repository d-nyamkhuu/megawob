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
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
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
        const header = document.querySelector('.ref-task');
        const headerBottom = header ? header.getBoundingClientRect().bottom : 48;
        const lowerControls = [...document.querySelectorAll('.ref-foot, .ref-float-dock')].reduce(
          (height, item) => height + item.getBoundingClientRect().height,
          0,
        );
        if (kind === 'banner') {
          el.style.top = headerBottom + 'px';
        } else if (kind === 'cookie') el.style.bottom = lowerControls + 'px';
        else if (kind === 'chat') el.style.bottom = lowerControls + 20 + 'px';
        else if (kind === 'toast') el.style.top = headerBottom + 12 + 'px';
        else if (kind === 'promo') {
          el.style.top = headerBottom + 'px';
          el.style.bottom = lowerControls + 'px';
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
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
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, display, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // The reference editor keeps its reusable step palette beside the graph.
        // Keep these as inert design controls; task actions remain on the canvas.
        const palette = util.el('aside', 'flow-palette', body);
        util.el('div', 'flow-pane-title', palette, 'Steps');
        const searchRow = util.el('div', 'flow-search', palette);
        const magnifier = util.el('span', 'flow-search-icon', searchRow);
        const searchIcon = util.svg(
          'svg',
          {
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 2.3,
            'stroke-linecap': 'round',
          },
          magnifier,
        );
        util.svg('path', { d: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0' }, searchIcon);
        const search = util.el('span', 'flow-search-text', searchRow, 'Search steps...');
        const steps = [
          ['♧', 'Trigger', 'Start your workflow', 'green'],
          ['⚙', 'Action', 'Perform a task', 'blue'],
          ['◇', 'Condition', 'Branch the flow', 'orange'],
          ['▤', 'Transform', 'Change data format', 'purple'],
          ['▤', 'Storage', 'Save or retrieve data', 'blue'],
          ['✉', 'Notification', 'Send a message', 'yellow'],
          ['Ⅱ', 'Flow control', 'Delay or control flow', 'green'],
        ];
        const stepPaths = [
          'M9 8a4 4 0 1 1 6-1M10 5l-5 9a4 4 0 1 0 5 5m-3-4h10a4 4 0 1 0-1-5m-3-3 5 9M8 18l5-9',
          'M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
          'M12 2 22 12 12 22 2 12z',
          'M5 2h9l5 5v15H5zM14 2v6h5M8 11h8M8 15h8M8 18h5',
          'M3 5c0-5 18-5 18 0v14c0 5-18 5-18 0zM3 5c0 5 18 5 18 0M3 10c0 5 18 5 18 0M3 15c0 5 18 5 18 0',
          'M2 5h20v15H2zM2 6l10 8L22 6',
          'M7 2h10a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4M9 7v10M15 7v10',
        ];
        for (const [icon, title, detail, tone] of steps) {
          const card = util.el('div', `flow-step ${tone}`, palette);
          const symbol = util.el('span', 'flow-step-icon', card);
          const svg = util.svg(
            'svg',
            {
              viewBox: '0 0 24 24',
              fill: title === 'Action' ? 'currentColor' : 'none',
              'fill-rule': 'evenodd',
              stroke: 'currentColor',
              'stroke-width': 1.7,
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
            },
            symbol,
          );
          util.svg('path', { d: stepPaths[steps.findIndex((s) => s[1] === title)] }, svg);
          const copy = util.el('span', 'flow-step-copy', card);
          util.el('strong', '', copy, title);
          util.el('small', '', copy, detail);
        }
        const help = util.el('aside', 'flow-help', body);
        util.el('div', 'flow-pane-title', help, 'Quick Help');
        const helpSection = (title, lines) => {
          const section = util.el('section', 'flow-help-section', help);
          util.el('strong', '', section, title);
          for (const line of lines) util.el('p', '', section, line);
        };
        if (display !== 'panel')
          helpSection('Creating a workflow', [
            'Drag steps from the palette onto the canvas and connect them using the ports. Click a step to view and edit its settings.',
          ]);
        helpSection('Connections', [
          'Draw a line from an output port\nto an input port to create a\ndirected connection. Data flows\nfrom outputs to inputs (left to\nright).',
        ]);
        helpSection('Ports', [
          'Green ports output data.\nBlue ports accept input.\nSome steps have multiple\noutputs, such as conditions.',
        ]);
        const tips = util.el('section', 'flow-help-section flow-tips', help);
        util.el('strong', '', tips, 'Tips');
        const tipList = util.el('ul', '', tips);
        for (const tip of [
          'You can pan the canvas\nby dragging with the hand tool.',
          'Use the mouse wheel to zoom.',
          'Keep related steps close\nfor clarity.',
        ])
          util.el('li', '', tipList, tip);
        const instructionPanel = document.querySelector('.ref-panel');
        if (instructionPanel) help.insertBefore(instructionPanel, help.children[1]);
        Object.assign(_c, {
          help,
          helpSection,
          instructionPanel,
          magnifier,
          palette,
          search,
          searchIcon,
          searchRow,
          stage,
          stepPaths,
          steps,
          tipList,
          tips,
        });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          // Retain the original localization draw without the unrelated site status line.
          if (word)
            lr.pick([
              `© 2024 Example Co. ${word('footRights')}`,
              word('footSaved'),
              word('footHelp'),
              `v4.2.1 · ${word('footStatus')}`,
            ]);
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const foot = document.querySelector('.ref-foot');
        if (foot && !foot.querySelector('button, a')) foot.remove();
        Object.assign(_c, { foot, submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-workflow-editor-connect-03',
    template: 'site/base',
    design: { parts },
  });
})();
