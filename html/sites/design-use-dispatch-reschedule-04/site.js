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
        if (kind === 'banner') {
          const appHeader = document.querySelector('.ref-task');
          if (appHeader) appHeader.after(el);
        }
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
        if (kind === 'chat') {
          const compose = util.el('div', 'office-chat-compose', box);
          util.el('span', '', compose, 'Type a message…');
          const send = util.el('button', '', compose, '➤');
          send.type = 'button';
          send.setAttribute('aria-label', 'Send message');
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send message' }));
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appMark = util.el('span', 'office-appmark', header);
        appMark.setAttribute('aria-hidden', 'true');
        appMark.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>';
        // Static Office-era ribbon frame. These are visual toolbar affordances; task actions
        // remain the draggable cards rendered by the use-dispatch widget below the header.
        const ribbonTabs = util.el('div', 'office-tabs', header);
        ribbonTabs.setAttribute('aria-hidden', 'true');
        for (const [i, tab] of ['Home', 'Plan', 'View', 'Data', 'Tools'].entries()) {
          const t = util.el('span', i === 0 ? 'office-tab office-tab-active' : 'office-tab', ribbonTabs, tab);
        }
        const ribbon = util.el('div', 'office-ribbon', header);
        ribbon.setAttribute('aria-hidden', 'true');
        const glyph = (body) =>
          `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><defs><linearGradient id="office-blue" x2="0" y2="1"><stop stop-color="#f1fbff"/><stop offset="1" stop-color="#73b2de"/></linearGradient><linearGradient id="office-green" x2="0" y2="1"><stop stop-color="#c9f2ad"/><stop offset="1" stop-color="#65b971"/></linearGradient></defs>${body}</svg>`;
        const icons = {
          dispatch: glyph(
            '<path d="M6 2h15l5 5v21H6zM21 2v6h5"/><circle cx="23" cy="24" r="6" fill="#9bd87c"/><path d="m20 24 2 2 4-5"/>',
          ),
          add: glyph('<path d="M13 4h6v9h9v6h-9v9h-6v-9H4v-6h9z"/>'),
          delete: glyph('<path d="M7 9h18l-1 18H8zM5 5h22v3H5zM12 3h8v2h-8z"/><path d="m13 12 6 10m0-10-6 10"/>'),
          left: glyph('<path d="M14 5 3 16l11 11v-7h15v-8H14z"/>'),
          right: glyph('<path d="m18 5 11 11-11 11v-7H3v-8h15z"/>'),
          clock: glyph('<circle cx="16" cy="17" r="11"/><path d="M16 9v8l5 3M13 2h6M16 2v4M5 5 3 8M27 5l2 3"/>'),
          optimize: glyph(
            '<circle cx="15" cy="15" r="11"/><ellipse cx="15" cy="15" rx="5" ry="11"/><path d="M4 15h22M7 8h16M7 22h16"/><path fill="#9acb70" d="m25 17 2 2 3-1 1 4-2 2 1 3-4 2-2-2-3 1-2-4 2-2-1-3z"/><circle cx="25" cy="24" r="2" fill="#eef8e6"/>',
          ),
          map: glyph(
            '<path d="m3 7 8-4 10 4 8-4v22l-8 4-10-4-8 4z"/><path d="M11 3v22m10-18v22"/><path d="M16 8a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4zm0 5h.01"/>',
          ),
          load: glyph('<path d="M5 3h23v25H5zM5 9h23M10 3v6M23 3v6M9 13h15M9 17h15M9 21h10"/>'),
          report: glyph('<path d="M6 3h14l7 7v19H6zM20 3v8h7M10 16h13M10 21h13M10 26h9"/>'),
          filter: glyph('<path d="M3 5h26L19 17v9l-6 3V17z"/>'),
          group: glyph('<path d="M4 5h24v5H4zm0 9h24v5H4zm0 9h24v5H4z"/><path d="M9 7h.01M9 16h.01M9 25h.01"/>'),
          check: glyph('<path d="m5 16 7 7L27 7"/>'),
        };
        const ribbonGroups = [
          [
            'Dispatch',
            [
              [icons.dispatch, 'New\nDispatch'],
              [icons.add, 'Add\nDelivery'],
              [icons.delete, 'Delete\nDelivery'],
            ],
          ],
          [
            'Edit',
            [
              [icons.left, 'Move Left'],
              [icons.right, 'Move Right'],
            ],
          ],
          [
            'Planning',
            [
              [icons.clock, 'Auto\nBalance'],
              [icons.optimize, 'Optimize\nRoutes'],
            ],
          ],
          [
            'View',
            [
              [icons.map, 'View Map'],
              [icons.load, 'Driver Load'],
              [icons.report, 'Reports'],
            ],
          ],
          [
            'Options',
            [
              [icons.filter, 'Filter'],
              [icons.group, 'Group By'],
              [icons.check, 'Show Unassigned'],
            ],
          ],
        ];
        for (const [title, actions] of ribbonGroups) {
          const group = util.el('div', 'office-group', ribbon);
          const items = util.el('div', 'office-actions', group);
          for (const [icon, label] of actions) {
            const item = util.el('div', 'office-action', items);
            const pictogram = util.el('span', 'office-icon', item);
            pictogram.innerHTML = icon;
            util.el('span', 'office-label', item, label);
          }
          util.el('div', 'office-group-title', group, title);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { appMark, glyph, header, icons, ribbon, ribbonGroups, ribbonTabs });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        let instructionPanel = null;
        Object.assign(_c, { headerTools, instructionPanel, submit });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        let { instructionPanel } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          instructionPanel = panel;
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        Object.assign(_c, { instructionPanel });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, glyph, instructionPanel, label, placement, stage, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // Read-only desktop summaries mirror the task's existing visible values.
        // They never change the model, destinations, or drag listeners.
        const railArt = [
          '<path d="M2 7h17v15H2zM19 11h6l5 6v5H19z"/><circle cx="8" cy="24" r="3"/><circle cx="25" cy="24" r="3"/>',
          '<path d="M7 2h14l6 6v22H7zM21 2v7h6M11 14h12M11 19h12M11 24h10"/>',
          '<path d="M2 8h17v14H2zM19 12h6l5 6v4H19z"/><circle cx="8" cy="24" r="3"/><circle cx="25" cy="24" r="3"/>',
          '<circle cx="11" cy="8" r="5"/><circle cx="24" cy="10" r="4"/><path d="M2 29v-6a9 9 0 0 1 18 0v6zM22 19a7 7 0 0 1 8 7v3h-7"/>',
          '<circle cx="16" cy="16" r="14"/><ellipse cx="16" cy="16" rx="6" ry="14"/><path d="M2 16h28M5 8h22M5 24h22"/>',
          '<path d="M3 2v27h27M9 23V13h4v10zM17 23V5h4v18zM25 23V10h4v13z"/>',
        ];
        const refreshReadouts = () => {
          const summary = stage.querySelector('.ad-context');
          if (!summary) return;
          [...stage.querySelectorAll('.ad-rail button')].slice(0, 6).forEach((button, index) => {
            if (button.dataset.officeNav) return;
            const caption = ['Dispatch', 'Deliveries', 'Vehicles', 'Drivers', 'Map', 'Reports'][index];
            button.dataset.officeNav = caption;
            button.classList.add('office-rail-entry');
            if (index === 0) button.classList.add('office-nav-active');
            const symbol = util.el('span', 'office-nav-symbol', button);
            symbol.innerHTML = glyph(railArt[index]);
            util.el('span', 'office-nav-caption', button, caption);
            button.setAttribute('aria-label', caption);
          });
          const daily = [...stage.querySelectorAll('.ad-lane-head')]
            .map((head) => head.textContent.match(/(\d+)\s*\/\s*(\d+)\s*kg/))
            .filter(Boolean);
          const load = daily.reduce((sum, match) => sum + Number(match[1]), 0);
          const capacity = daily.reduce((sum, match) => sum + Number(match[2]), 0);
          const percent = capacity ? Math.round((100 * load) / capacity) : 0;
          const signature = `${load}/${capacity}`;
          if (
            daily.length &&
            (summary.dataset.officeSummary !== signature || !summary.querySelector('.office-summary-metrics'))
          ) {
            summary.dataset.officeSummary = signature;
            let metrics = summary.querySelector('.office-summary-metrics');
            if (!metrics) metrics = util.el('div', 'office-summary-metrics', summary);
            metrics.replaceChildren();
            for (const [caption, value] of [
              ['Total Load', `${load.toLocaleString('en-US')} kg`],
              ['Total Capacity', `${capacity.toLocaleString('en-US')} kg`],
              ['Utilization', `${percent}%`],
            ]) {
              const metric = util.el('div', 'office-summary-metric', metrics);
              util.el('span', '', metric, caption);
              util.el('strong', '', metric, value);
              if (caption === 'Utilization') {
                const meter = util.el('div', 'office-summary-meter', metric);
                const fill = util.el('i', '', meter);
                fill.style.width = `${Math.min(100, percent)}%`;
              }
            }
          }
          const reference = stage.querySelector('.ad-reference');
          const backlog = stage.querySelector('.ad-lane:first-child .ad-lane-head');
          const waiting = backlog && backlog.textContent.match(/(\d+)\s*waiting/);
          const referenceText = reference
            ? reference.textContent.trim().replace(/^Dispatch reference:\s*/i, 'Dispatch Ref: ')
            : '';
          const captionKey = `${referenceText}/${waiting ? waiting[1] : '0'}`;
          let caption = summary.querySelector('.office-summary-caption');
          if (!caption) caption = util.el('div', 'office-summary-caption', summary);
          if (caption.dataset.caption !== captionKey) {
            caption.dataset.caption = captionKey;
            caption.replaceChildren();
            util.el('div', '', caption, referenceText);
            util.el('div', '', caption, `Unassigned Deliveries: ${waiting ? waiting[1] : '0'}`);
          }
          const inspector = stage.querySelector('.ad-inspector');
          const properties = inspector && inspector.querySelector('.ad-pairs');
          if (!properties) return;
          const fields = [...properties.children];
          const loadLabel = fields.findIndex((field) => field.textContent.trim() === 'Load');
          const weight = loadLabel >= 0 && fields[loadLabel + 1] ? fields[loadLabel + 1].textContent.trim() : '';
          const delivery = inspector.querySelector('.ad-inspect-title');
          const deliveryName = delivery ? delivery.textContent.trim() : 'Delivery';
          const key = `${deliveryName}/${weight}`;
          let extras = inspector.querySelector('.office-delivery-extras');
          if (!extras) {
            extras = util.el('div', 'office-delivery-extras');
            const section = properties.closest('.ad-section');
            if (section) section.after(extras);
            else inspector.append(extras);
          }
          if (extras.dataset.delivery !== key) {
            extras.dataset.delivery = key;
            extras.replaceChildren();
            util.el('h3', '', extras, 'Vehicle Requirement');
            const vehicle = util.el('div', 'office-vehicle', extras);
            util.el('span', 'office-truck', vehicle, '▰');
            util.el('span', '', vehicle, 'Standard Truck');
            util.el('h3', '', extras, 'Items');
            const table = util.el('table', 'office-items', extras);
            const head = util.el('tr', '', util.el('thead', '', table));
            util.el('th', '', head, 'Item');
            util.el('th', '', head, 'Weight (kg)');
            const row = util.el('tr', '', util.el('tbody', '', table));
            util.el('td', '', row, deliveryName);
            util.el('td', '', row, weight.replace(/\s*kg\s*$/, '') || '—');
          }
          if (instructionPanel) {
            const propertySection = properties.closest('.ad-section');
            if (propertySection && propertySection.nextElementSibling !== instructionPanel)
              propertySection.after(instructionPanel);
            if (instructionPanel.nextElementSibling !== extras) instructionPanel.after(extras);
          }
        };
        Object.assign(_c, { railArt, submit });
      },
  };

  env.site({
    name: 'design-use-dispatch-reschedule-04',
    template: 'site/base',
    design: { parts },
  });
})();
