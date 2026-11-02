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
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarRoll, wantFooter });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // Route planner controls shown in the reference design. These are display frame;
      // waypoint editing remains on the map so the task's original input path is intact.
      // The ordered handles live in the task widget below the map.
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const railItems = ['Home', 'Plan a Trip', 'Find Places', 'Live Info', 'My Itineraries'];
        for (const item of railItems) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      // Right column cards (Tools, Tips) from the reference; inert display frame.
      const right = util.el('aside', 'route-right', body);
      const ico = {
        tool: '<svg viewBox="0 0 16 16" width="16" height="16"><rect x="2" y="1" width="12" height="14" fill="#fff" stroke="#fff"/><path d="M4 4h8M4 7h8M4 10h8" stroke="#17456e" stroke-width="1.5"/></svg>',
        print: '<svg viewBox="0 0 24 24" width="26" height="26"><rect x="6" y="2" width="12" height="7" fill="#fff" stroke="#12335d" stroke-width="1.5"/><rect x="2" y="9" width="20" height="9" fill="#5b86ad" stroke="#12335d" stroke-width="1.5"/><rect x="6" y="14" width="12" height="8" fill="#fff" stroke="#12335d" stroke-width="1.5"/></svg>',
        file: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 2h10l5 5v15H5z" fill="#fff" stroke="#12335d" stroke-width="1.5"/><path d="M8 11h9M8 14h9M8 17h9" stroke="#12335d" stroke-width="1.5"/></svg>',
        erase: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 15l9-11 8 6-8 10H7z" fill="#e8505b" stroke="#12335d" stroke-width="1.5"/><path d="M9 21h12" stroke="#12335d" stroke-width="1.5"/></svg>',
        bulb: '<svg viewBox="0 0 16 16" width="18" height="18"><circle cx="8" cy="6" r="4.5" fill="#ffd34d" stroke="#8a6a00"/><rect x="6" y="11" width="4" height="3" fill="#8a6a00"/></svg>',
      };
      const tools = util.el('div', 'route-card', right);
      util.el('div', 'route-card-head', tools).innerHTML = ico.tool + '<span>Tools</span>';
      for (const [k, t] of [['print', 'Print Map'], ['file', 'Export Route'], ['erase', 'Clear Stops']]) {
        const r = util.el('div', 'route-card-row', tools); r.innerHTML = ico[k] + '<span>' + t + '</span>';
      }
      const tips = util.el('div', 'route-card route-tips', right);
      util.el('div', 'route-card-head', tips).innerHTML = ico.bulb + '<span>Tips</span>';
      const lines = util.el('div', 'route-tip-lines', tips);
      for (const w of [100, 85, 60, 100, 100, 80, 50]) { const l = util.el('i', '', lines); l.style.width = w + '%'; }
      Object.assign(_c, { body });
    },
    'frame.nav': (base, S) => function (_c) {
      const { header, util } = _c;
      const n = util.el('nav', 'ref-nav', header);
      const entries = [['🗺', 'Map'], ['▥', 'Places'], ['▤', 'Transport'], ['▤', 'Itineraries'], ['⚙', 'Preferences']];
      for (let i = 0; i < entries.length; i++) {
        const [icon, label] = entries[i];
        const a = util.el('a', `ref-navlink${i === 0 ? ' is-current' : ''}`, n);
        a.innerHTML = `<span>${icon}</span>${label}`;
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
    },
  };

  env.site({
    name: 'design-pan-map-route-05',
    template: 'site/base',
    design: { parts },
  });
})();
