// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
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
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // Route planner controls shown in the reference design. These are display frame;
      // waypoint editing remains on the map so the task's original input path is intact.
      const routeBar = util.el('div', 'route-toolbar', header);
      util.el('strong', 'route-caption', routeBar, 'Route:');
      for (let i = 1; i <= 4; i++) util.el('span', `route-stop route-stop-${i}`, routeBar, String(i));
      const routeControl = (icon, label, disabled) => {
        const b = util.el('button', `route-control${disabled ? ' is-disabled' : ''}`, routeBar);
        b.type = 'button'; b.setAttribute('aria-label', label); b.innerHTML = `<span aria-hidden="true">${icon}</span>${label}`;
        b.addEventListener('click', () => env.log('decoy', { what: 'route-toolbar', label }));
      };
      routeControl('●', 'Add Stop', false);
      routeControl('▤', 'Remove Stop', true);
      routeControl('↶', 'Clear Route', false);
      Object.assign(_c, { routeBar, routeControl });
    },
    'frame.body': (base, S) => function (_c) {
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
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-pan-map-route-01',
    template: 'site/base',
    design: { parts },
  });
})();
