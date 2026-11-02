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
        const header = document.querySelector('.ref-task').getBoundingClientRect();
        const stage = document.querySelector('.ref-stage').getBoundingClientRect();
        const pageW = document.documentElement.clientWidth,
          pageH = document.documentElement.clientHeight;
        if (kind === 'banner')
          Object.assign(el.style, {
            top: header.bottom + 'px',
            left: header.left + 'px',
            right: 'auto',
            width: header.width + 'px',
          });
        if (kind === 'cookie')
          Object.assign(el.style, {
            left: stage.left + 12 + 'px',
            right: 'auto',
            bottom: pageH - stage.bottom + 12 + 'px',
            width: Math.min(680, stage.width - 24) + 'px',
          });
        if (kind === 'chat')
          Object.assign(el.style, { right: pageW - stage.right + 12 + 'px', bottom: pageH - stage.bottom + 12 + 'px' });
        if (kind === 'promo')
          Object.assign(el.style, {
            inset: 'auto',
            left: stage.left + 'px',
            top: stage.top + 'px',
            width: stage.width + 'px',
            height: stage.height + 'px',
          });
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
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebarRoll = roomy && rng.bool(0.35);
        const sidebar = true;
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarRoll, wantFooter });
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
        const appTitle = util.el('div', 'map-app-title', header, 'City Explorer');
        const appMenu = util.el('nav', 'map-app-menu', header);
        for (const label of ['File', 'Edit', 'View', 'Map', 'Places', 'Route', 'Tools', 'Help'])
          util.el('span', '', appMenu, label);
        const appTools = util.el('div', 'map-app-toolbar', header);
        const toolPaths = {
          Pan: 'M8 12V5a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-6a2 2 0 0 1 4 0v10c0 7-4 9-8 9-3 0-5-2-7-5l-3-5a2 2 0 0 1 3-2l3 3',
          'Add Stop': 'M12 22S4 14 4 8a8 8 0 1 1 16 0c0 6-8 14-8 14Z M12 5a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
          'Move Stop': 'M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4',
          'Remove Stop': 'M4 6h16M9 6V3h6v3M6 6l1 16h10l1-16M10 10v8M14 10v8',
          'Search Places': 'M10 2a8 8 0 1 0 0 16a8 8 0 1 0 0-16M16 16l6 6',
          'Clear Route': 'M3 19l5-4m3-3 3-4m3-3 4-2M4 18h1v1H4ZM10 13h1v1h-1ZM16 6h1v1h-1ZM20 2h1v1h-1Z',
          Places: 'M12 22S4 14 4 8a8 8 0 1 1 16 0c0 6-8 14-8 14Z M12 5a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
          Parks: 'M12 2L7 9h2l-5 7h6v6h4v-6h6l-5-7h2Z',
          Districts: 'M2 9l10-6 10 6H2ZM5 11v9M10 11v9M15 11v9M20 11v9M2 22h20',
          'Major Roads': 'M2 12h20',
          Streets: 'M2 12h20',
        };
        const toolIcon = (node, label) => {
          const ns = 'http://www.w3.org/2000/svg',
            svg = document.createElementNS(ns, 'svg'),
            path = document.createElementNS(ns, 'path');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('width', '20');
          svg.setAttribute('height', '20');
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
          svg.setAttribute('stroke-width', '1.8');
          svg.setAttribute('stroke-linecap', 'round');
          svg.setAttribute('stroke-linejoin', 'round');
          path.setAttribute('d', toolPaths[label]);
          svg.appendChild(path);
          node.appendChild(svg);
        };
        const appActions = [
          ['☞', 'Pan'],
          ['●', 'Add Stop'],
          ['✥', 'Move Stop'],
          ['▤', 'Remove Stop'],
          ['⌕', 'Search Places'],
          ['⤨', 'Clear Route'],
        ];
        for (const [icon, label] of appActions) {
          const button = util.el('button', `map-app-tool${label === 'Pan' ? ' selected' : ''}`, appTools);
          button.type = 'button';
          button.setAttribute('aria-label', label);
          button.title = label;
          toolIcon(util.el('span', 'map-app-icon', button), label);
          util.el('span', '', button, label);
          button.addEventListener('click', () => {
            const wanted = label.toLowerCase();
            const candidates = [...document.querySelectorAll('.ref-stage button, .ref-stage [role="button"]')];
            const read = (node) =>
              `${node.innerText || node.textContent || ''} ${node.getAttribute('aria-label') || ''} ${node.title || ''}`.toLowerCase();
            const target =
              candidates.find((node) => read(node).includes(wanted)) ||
              (label === 'Pan' ? candidates.find((node) => /pan/.test(read(node))) : null);
            if (target) target.click();
            env.log('route-toolbar-proxy', { action: label });
          });
        }
        Object.assign(_c, { appActions, appMenu, appTitle, appTools, headerTools, submit, toolIcon, toolPaths });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          const railItems = ['Map', 'Itinerary', 'Places', 'Search', 'Preferences'];
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          for (const item of railItems) {
            const a = util.el('a', 'ref-sidelink', side, item);
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
        const { body, toolIcon, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const summary = util.el('section', 'map-summary', body);
        const waypoints = util.el('div', 'map-summary-card map-summary-waypoints', summary);
        util.el('strong', '', waypoints, 'Waypoints');
        for (let i = 1; i <= 4; i++) {
          const row = util.el('div', 'map-summary-row', waypoints);
          util.el('span', 'map-stop-number', row, String(i));
          util.el('span', '', row, `Stop ${i}`);
          util.el('span', 'map-stop-grip', row, '⠿');
        }
        const controls = util.el('div', 'map-summary-card map-summary-controls', summary);
        util.el('strong', '', controls, 'Route Controls');
        const controlRow = util.el('div', 'map-summary-buttons', controls);
        const routeAction = (label) => {
          const button = util.el('button', '', controlRow);
          toolIcon(button, label);
          util.el('span', '', button, label);
          button.type = 'button';
          button.addEventListener('click', () => {
            const wanted = label.toLowerCase();
            const candidates = [...document.querySelectorAll('.ref-stage button, .ref-stage [role="button"]')].filter(
              (node) => !node.closest('.map-summary'),
            );
            const textOf = (node) =>
              `${node.innerText || node.textContent || ''} ${node.getAttribute('aria-label') || ''} ${node.title || ''}`.toLowerCase();
            let target = candidates.find((node) => textOf(node).includes(wanted));
            if (!target && (wanted === 'add stop' || wanted === 'move stop')) {
              target = candidates.find((node) => /edit route|route edit/.test(textOf(node)));
            }
            if (target) {
              target.click();
              env.log('route-toolbar-proxy', { action: label });
              return;
            }
          });
        };
        for (const label of ['Add Stop', 'Move Stop', 'Remove Stop', 'Clear Route']) routeAction(label);
        const inventory = util.el('div', 'map-summary-card map-summary-items', summary);
        util.el('strong', '', inventory, 'Map Items');
        for (const [label, count] of [
          ['Places', 20],
          ['Parks', 6],
          ['Districts', 5],
          ['Major Roads', 4],
          ['Streets', 38],
        ]) {
          const row = util.el('div', 'map-summary-row', inventory);
          toolIcon(row, label);
          util.el('span', 'map-item-label', row, label);
          util.el('span', '', row, String(count));
        }
        Object.assign(_c, { controlRow, controls, inventory, routeAction, stage, summary, waypoints });
      },
  };

  env.site({
    name: 'design-pan-map-route-03',
    template: 'site/base',
    design: { parts },
  });
})();
