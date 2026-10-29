// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#f3f6f8', panel: '#ffffff', fg: '#172130', muted: '#657591', line: '#e0e6ed' },
    dark: { bg: '#f3f6f8', panel: '#ffffff', fg: '#172130', muted: '#657591', line: '#e0e6ed' },
    warm: { bg: '#f3f6f8', panel: '#ffffff', fg: '#172130', muted: '#657591', line: '#e0e6ed' },
  };

  const ACCENTS = ['#ff781c', '#ff781c', '#ff781c', '#ff781c', '#ff781c', '#ff781c'];

  const parts = {
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('ref-has-header-note', display === 'header');
        document.body.dataset.instruction = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const navDraw = rng.bool(0.5);
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'DevWorkspace');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const navLabels = ['Code', 'Builds', 'Pipelines', 'Logs', 'Database', 'Feature Flags', 'Environments'];
          for (const item of navLabels) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const lineIcon = (parent, name, cls) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('class', cls || 'orion-svg');
          parent.appendChild(svg);
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('aria-hidden', 'true');
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
          svg.setAttribute('stroke-width', '1.8');
          svg.setAttribute('stroke-linecap', 'round');
          svg.setAttribute('stroke-linejoin', 'round');
          const paths = {
            chevron: 'm6 9 6 6 6-6',
            bell: 'M6 9a6 6 0 0 1 12 0v6l2 3H4l2-3Zm4 12h4',
            people: 'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-2a6 6 0 0 1 12 0v2m2-17a4 4 0 0 1 0 8m2 3a6 6 0 0 1 4 6',
            external: 'M14 3h7v7m0-7-10 10M10 5H4v15h15v-6',
            home: 'M3 10.5 12 3l9 7.5M5.5 9v11h13V9M9 20v-6h6v6',
            cube: 'm12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12v9m0-9L4 7.5',
            deploy: 'M12 20V4m0 0-6 6m6-6 6 6M5 20h14',
            pipeline: 'M5 5h5v5H5zM14 14h5v5h-5zM10 7.5h4a3 3 0 0 1 3 3V14',
            flag: 'M5 21V4m0 1h13l-2.5 4L18 13H5',
            infra: 'M4 5h16v14H4zM8 9h8M8 13h8M8 17h4',
            database: 'M4 6c0-3 16-3 16 0v12c0 3-16 3-16 0V6Zm0 0c0 3 16 3 16 0M4 12c0 3 16 3 16 0',
            pulse: 'M3 12h4l3-7 4 14 3-7h4',
            gear: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4',
            code: 'm8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18',
            build: 'M4 19h16M6 16V8l6-4 6 4v8M9 12h6',
            data: 'M4 6c0-3 16-3 16 0v12c0 3-16 3-16 0V6Zm0 0c0 3 16 3 16 0M4 12c0 3 16 3 16 0',
          };
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', paths[name] || paths.cube);
          svg.appendChild(path);
          return svg;
        };
        const appnav = util.el('aside', 'orion-nav', body);
        util.el('div', 'orion-brand-mark', appnav, '');
        util.el('div', 'orion-brand', appnav, 'OrionPay');
        util.el('div', 'orion-env', appnav, 'production');
        lineIcon(util.el('span', 'orion-workspace-chevron', appnav), 'chevron');
        for (const [icon, item] of [
          ['home', 'Overview'],
          ['cube', 'Services'],
          ['deploy', 'Deployments'],
          ['pipeline', 'Pipeline'],
          ['flag', 'Feature flags'],
          ['infra', 'Infrastructure'],
          ['database', 'Databases'],
          ['pulse', 'Observability'],
          ['gear', 'Settings'],
        ]) {
          const a = util.el('div', `orion-navitem${item === 'Services' ? ' active' : ''}`, appnav);
          lineIcon(a, icon, 'orion-navicon');
          util.el('span', '', a, item);
        }
        const service = util.el('aside', 'orion-service', body);
        util.el('h2', '', service, 'Service details');
        const identity = util.el('div', 'orion-service-identity', service);
        lineIcon(util.el('span', 'orion-service-icon', identity), 'cube');
        const identityText = util.el('div', 'orion-service-identity-text', identity);
        util.el('div', 'orion-service-name', identityText, 'billing-worker');
        util.el('div', 'orion-service-sub', identityText, 'Background job processor');
        util.el('div', 'orion-healthy', identityText, '●  Healthy');
        util.el('span', 'orion-service-menu', identity, '···');
        const serviceTabs = util.el('div', 'orion-tabs', service);
        for (const label of ['Summary', 'Configuration', 'Environment', 'Releases'])
          util.el('span', '', serviceTabs, label);
        const meta = util.el('section', 'orion-card', service);
        const field = (label, value) => {
          const row = util.el('div', 'orion-field', meta);
          util.el('span', '', row, label);
          util.el('code', '', row, value);
        };
        field('Service name', 'billing-worker');
        field('Type', 'Worker');
        field('Repository', 'orionpay/billing-worker');
        field('Runtime', 'Python 3.12');
        field('Region', 'us-east-1');
        field('Instances', '6');
        field('Last deploy', '2026-03-02 11:17:09');
        field('Commit', '9f3a1c4');
        const resources = util.el('section', 'orion-card', service);
        util.el('h3', '', resources, 'Resources');
        for (const [label, value] of [
          ['CPU (avg)', '32%'],
          ['Memory (avg)', '1.4 GB'],
          ['Disk (avg)', '18%'],
        ]) {
          const row = util.el('div', 'orion-resource', resources);
          util.el('span', '', row, label);
          util.el('b', '', row, value);
        }
        const links = util.el('section', 'orion-card', service);
        util.el('h3', '', links, 'Links');
        for (const [icon, label] of [
          ['infra', 'Runbook'],
          ['pulse', 'Service dashboard'],
          ['bell', 'Alerts'],
          ['people', 'On-call'],
        ]) {
          const row = util.el('div', 'orion-linkrow', links);
          lineIcon(row, icon, 'orion-linkicon');
          util.el('span', '', row, label);
          lineIcon(row, 'external', 'orion-external');
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, {
          appnav,
          body,
          field,
          identity,
          identityText,
          lineIcon,
          links,
          meta,
          resources,
          service,
          serviceTabs,
        });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, lineIcon, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const dock = util.el('div', 'orion-dock', document.body);
        const dockBrand = util.el('strong', '', dock);
        util.el('span', 'orion-dock-brand-mark', dockBrand);
        util.el('span', '', dockBrand, 'OrionPay');
        for (const [icon, item] of [
          ['home', 'Home'],
          ['code', 'Code'],
          ['build', 'Build & Deploy'],
          ['pulse', 'Observability'],
          ['data', 'Data'],
          ['flag', 'Feature Flags'],
          ['cube', 'Environments'],
        ]) {
          const d = util.el('div', `orion-dock-item${item === 'Observability' ? ' active' : ''}`, dock);
          lineIcon(d, icon, 'orion-dock-icon');
          util.el('span', '', d, item);
        }
        Object.assign(_c, { dock, dockBrand, submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-dev-tools-logs-04',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
