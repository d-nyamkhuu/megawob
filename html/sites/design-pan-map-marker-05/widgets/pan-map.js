// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-marker-05',
  name: 'design',
  split: 'train',
  scenarios: ['marker'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      explorerSearch(base, S) {
        return function (ctx, chrome) {
          const input = base(ctx, chrome);
          const holder = input.parentElement;
          chrome.panel.prepend(holder);
          holder.classList.add('map-directory-search');
          input.placeholder = 'Search places, addresses...';
          return input;
        };
      },
      explorerHeading(base) {
        return function (ctx, panel) {
          const section = ctx.util.el('div', 'mpe-section map-directory-heading', panel);
          panel.insertBefore(section, panel.firstChild);
          ctx.util.el('div', 'mpe-heading', section, `${ctx.spec.places.length} places`);
          ctx.util.el('div', 'map-sort', section, 'Sort: Name ⌄');
          return section;
        };
      },
      explorerRow(base) {
        return function (ctx, list, place) {
          const result = base(ctx, list, place);
          const { row, button } = result;
          const controls = row.closest('.mpp-panel')?.querySelector('.mpp-controls');
          if (controls && !controls.querySelector('.map-extra-filter')) {
            for (const label of ['Stations', 'Shops', 'Health', 'Parks', 'Culture', 'More ⌄']) {
              const chip = ctx.util.el('button', 'map-extra-filter', controls, label);
              chip.type = 'button';
              chip.addEventListener('click', () => env.log('filter', { label }));
            }
          }
          row.classList.add('map-directory-row');
          const kind = String(place.label || place.kind || 'place').toLowerCase();
          const badge = row.querySelector('.mpe-badge');
          if (badge) {
            let icon = 'pin', tone = 'blue';
            if (/station|transit|rail/.test(kind)) { icon = 'train'; tone = 'station'; }
            else if (/park|garden/.test(kind)) { icon = 'tree'; tone = 'green'; }
            else if (/hospital|clinic|medical|pharmacy|health/.test(kind)) { icon = 'cross'; tone = 'rose'; }
            else if (/cafe|restaurant|food|tavern|bar/.test(kind)) { icon = 'cup'; tone = 'orange'; }
            else if (/hotel|lodge/.test(kind)) { icon = 'bed'; tone = 'blue'; }
            else if (/library|school|book/.test(kind)) { icon = 'book'; tone = 'blue'; }
            else if (/museum|theatre|art|culture|gallery/.test(kind)) { icon = 'palette'; tone = 'purple'; }
            else if (/shop|store|market/.test(kind)) { icon = 'cart'; tone = 'blue'; }
            const shapes = {
              pin:'<path d="M12 22s7-7 7-13a7 7 0 0 0-14 0c0 6 7 13 7 13Z"/><circle cx="12" cy="9" r="2" fill="#fff"/>',
              train:'<rect x="5" y="2" width="14" height="17" rx="3"/><path d="M8 6h8M8 13h8M8 19l-2 3m10-3 2 3"/><circle cx="9" cy="16" r="1" fill="#fff"/><circle cx="15" cy="16" r="1" fill="#fff"/>',
              tree:'<path d="M12 2c-3 0-4 2-4 4-2 0-3 2-3 4-2 1-2 4 0 5 1 1 3 1 4 1h6c2 0 4-1 4-3 0-2-1-3-3-4 1-3-1-5-4-7Z"/><path d="M12 15v7"/>',
              cross:'<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7Z"/>',
              cup:'<path d="M3 6h14v7a6 6 0 0 1-12 0V6Zm14 2h3a2 2 0 0 1 0 4h-3M4 20h15"/>',
              bed:'<path d="M2 10v10M22 10v10M2 17h20M5 12h7v5H5zM12 12h8v5h-8z"/>',
              book:'<path d="M12 5C9 3 6 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
              palette:'<path d="M12 2a10 10 0 1 0 0 20h2a3 3 0 0 0 2-5c-1-1 0-2 1-2h2a3 3 0 0 0 3-3A10 10 0 0 0 12 2Z"/><circle cx="7" cy="10" r="1" fill="#fff"/><circle cx="11" cy="6" r="1" fill="#fff"/><circle cx="16" cy="7" r="1" fill="#fff"/>',
              cart:'<path d="M2 4h3l2 11h12l2-8H6M8 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>'
            };
            badge.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${shapes[icon]}</svg>`;
            badge.classList.add(`map-badge-${tone}`);
          }
          button.replaceChildren();
          ctx.util.el('span', 'mpe-name', button, place.name);
          ctx.util.el('span', 'map-place-type', button, place.label || place.kind || 'Place');
          const code = Array.from(place.name).reduce((v, c) => v + c.charCodeAt(0), 0);
          ctx.util.el('span', 'map-distance', row, `${(1.5 + (code % 32) / 10).toFixed(1)} km`);
          return result;
        };
      },
      explorerWorld(base) {
        return function (ctx, port, W, H) {
          const map = base(ctx, port, W, H);
          const scale = env.taskOf('pan-map').helpers.scaleOf(ctx.model.z);
          const cx = ctx.model.c[0], cy = ctx.model.c[1];
          const x0 = cx - W / (2 * scale), x1 = cx + W / (2 * scale);
          const y0 = cy - H / (2 * scale), y1 = cy + H / (2 * scale);
          const x = (f) => x0 + (x1 - x0) * f, y = (f) => y0 + (y1 - y0) * f;
          const svg = 'http://www.w3.org/2000/svg';
          const shape = (cls, d, before) => {
            const e = document.createElementNS(svg, 'path');
            e.setAttribute('class', cls); e.setAttribute('d', d);
            if (before) map.world.insertBefore(e, before); else map.world.appendChild(e);
            return e;
          };
          const streets = map.streets;
          const land = shape('map-land', `M${x(-.9)} ${y(-.9)} H${x(1.9)} V${y(1.9)} H${x(-.9)} Z`, streets);
          const seededBuildings = Array.from(map.world.children).find(e => e.tagName.toLowerCase() === 'g' && e.getAttribute('pointer-events') === 'none');
          if (seededBuildings) land.after(seededBuildings);
          const bay = `M${x(-.08)} ${y(-.08)} H${x(.80)} C${x(.73)} ${y(.04)},${x(.80)} ${y(.13)},${x(.72)} ${y(.19)} C${x(.66)} ${y(.23)},${x(.62)} ${y(.22)},${x(.57)} ${y(.27)} L${x(.53)} ${y(.25)} C${x(.48)} ${y(.29)},${x(.43)} ${y(.29)},${x(.38)} ${y(.26)} C${x(.33)} ${y(.23)},${x(.26)} ${y(.23)},${x(.20)} ${y(.21)} C${x(.14)} ${y(.18)},${x(.10)} ${y(.16)},${x(.04)} ${y(.18)} L${x(-.08)} ${y(.13)} Z`;
          const lake = `M${x(.47)} ${y(.82)} C${x(.51)} ${y(.76)},${x(.65)} ${y(.74)},${x(.73)} ${y(.80)} C${x(.82)} ${y(.86)},${x(.82)} ${y(.98)},${x(.74)} ${y(1.10)} H${x(.44)} C${x(.43)} ${y(1.00)},${x(.42)} ${y(.89)},${x(.47)} ${y(.82)} Z`;
          const lakePark = `M${x(.43)} ${y(.78)} C${x(.51)} ${y(.71)},${x(.67)} ${y(.71)},${x(.76)} ${y(.77)} C${x(.84)} ${y(.84)},${x(.84)} ${y(.99)},${x(.78)} ${y(1.08)} H${x(.40)} C${x(.39)} ${y(.94)},${x(.38)} ${y(.85)},${x(.43)} ${y(.78)} Z`;
          shape('map-lake-park', lakePark, streets);
          shape('mp-sea map-bay', bay, streets);
          shape('mp-sea map-lake', lake, streets);
          for (const [f, g, w, h] of [[.12,.48,.14,.19],[.30,.72,.12,.09],[.54,.69,.12,.16],[.68,.06,.12,.13],[.84,.02,.16,.18],[.74,.82,.13,.12],[.42,.37,.07,.09]]) {
            shape('mp-park map-park', `M${x(f)} ${y(g)} Q${x(f+w*.18)} ${y(g-.05)} ${x(f+w*.45)} ${y(g)} Q${x(f+w*1.12)} ${y(g+h*.12)} ${x(f+w)} ${y(g+h*.52)} Q${x(f+w*.92)} ${y(g+h*1.08)} ${x(f+w*.38)} ${y(g+h)} Q${x(f-.08)} ${y(g+h*.84)} ${x(f)} ${y(g)} Z`, streets);
          }
          const visual = ctx.rng.fork('soft-map-blocks');
          let blocks = '', greens = '';
          for (let i = 0; i < 43; i++) for (let j = 0; j < 27; j++) {
            const fx = i / 42 + visual.float(-.003,.003), fy = .20 + j * .029 + visual.float(-.003,.003);
            if (fy < .27 && fx < .72 || fx > .69 && fx < .80 && fy < .74 || fx > .44 && fx < .66 && fy > .79) continue;
            if (visual.bool(.20)) continue;
            const bw = visual.float(.004,.014), bh = visual.float(.006,.017);
            const d = `M${x(fx)} ${y(fy)} h${x(bw)-x(0)} v${y(bh)-y(0)} h${x(0)-x(bw)} Z `;
            if (visual.bool(.11)) greens += d;
            else blocks += d;
          }
          shape('map-city-blocks', blocks, streets);
          shape('map-small-green', greens, streets);
          let grid = '';
          for (let i = -2; i < 41; i++) {
            const f = i / 39 + visual.float(-.003,.003);
            const bend = visual.float(-.006,.006);
            grid += `M${x(f)} ${y(.17)} L${x(f-.023+bend)} ${y(.40)} L${x(f-.047-bend)} ${y(.62)} L${x(f-.10+bend)} ${y(1.07)} `;
          }
          for (let i = 0; i < 29; i++) {
            const f = .19 + i * .030 + visual.float(-.003,.003);
            const bend = visual.float(-.008,.008);
            grid += `M${x(-.05)} ${y(f)} C${x(.30)} ${y(f+.02+bend)},${x(.66)} ${y(f+.05-bend)},${x(1.06)} ${y(f+.12)} `;
          }
          shape('map-city-grid', grid, streets);
          let eastStreets = '';
          for (let i = 0; i < 8; i++) {
            const f = .73 + i * .052 + visual.float(-.004,.004);
            eastStreets += `M${x(f)} ${y(.21)} C${x(f+.025)} ${y(.40)},${x(f+.11)} ${y(.60)},${x(f+.17)} ${y(.86)} `;
          }
          for (let i = 0; i < 9; i++) {
            const f = .27 + i * .065 + visual.float(-.004,.004);
            eastStreets += `M${x(.67)} ${y(f)} C${x(.84)} ${y(f-.055)},${x(.97)} ${y(f-.14)},${x(1.15)} ${y(f-.16)} `;
          }
          shape('map-east-streets', eastStreets, streets);
          shape('mp-sea map-bay map-water-top', bay, streets);
          shape('map-lake-park', lakePark, streets);
          shape('mp-sea map-lake map-water-top', lake, streets);
          const piers = `M${x(.04)} ${y(.19)} L${x(.08)} ${y(.10)} L${x(.16)} ${y(.13)} M${x(.12)} ${y(.19)} L${x(.16)} ${y(.08)} L${x(.23)} ${y(.11)} M${x(.20)} ${y(.20)} L${x(.24)} ${y(.12)} L${x(.29)} ${y(.14)} M${x(.27)} ${y(.21)} L${x(.31)} ${y(.15)}`;
          shape('map-pier-casing', piers, streets);
          shape('map-pier', piers, streets);
          for (const [f, g, w, h] of [[.12,.48,.14,.19],[.30,.72,.12,.09],[.54,.69,.12,.16],[.68,.06,.12,.13],[.84,.02,.16,.18],[.74,.82,.13,.12],[.42,.37,.07,.09]]) {
            shape('mp-park map-park map-park-top', `M${x(f)} ${y(g)} Q${x(f+w*.18)} ${y(g-.05)} ${x(f+w*.45)} ${y(g)} Q${x(f+w*1.12)} ${y(g+h*.12)} ${x(f+w)} ${y(g+h*.52)} Q${x(f+w*.92)} ${y(g+h*1.08)} ${x(f+w*.38)} ${y(g+h)} Q${x(f-.08)} ${y(g+h*.84)} ${x(f)} ${y(g)} Z`, streets);
          }
          const northRoad = `M${x(-.08)} ${y(.27)} C${x(.19)} ${y(.32)},${x(.34)} ${y(.35)},${x(.53)} ${y(.30)} S${x(.81)} ${y(.16)},${x(1.08)} ${y(.15)}`;
          shape('map-major-casing', northRoad, map.casings[0] || null);
          shape('map-major', northRoad, map.casings[0] || null);
          const southRoad = `M${x(-.08)} ${y(.70)} C${x(.19)} ${y(.78)},${x(.38)} ${y(.80)},${x(.53)} ${y(.95)} S${x(.59)} ${y(1.06)},${x(.69)} ${y(1.09)}`;
          shape('map-major-casing', southRoad, map.casings[0] || null);
          shape('map-major', southRoad, map.casings[0] || null);
          const arteries = `M${x(-.06)} ${y(.42)} C${x(.16)} ${y(.39)},${x(.36)} ${y(.48)},${x(.56)} ${y(.47)} S${x(.86)} ${y(.50)},${x(1.08)} ${y(.43)} M${x(-.06)} ${y(.64)} C${x(.14)} ${y(.58)},${x(.34)} ${y(.69)},${x(.54)} ${y(.66)} S${x(.84)} ${y(.75)},${x(1.06)} ${y(.70)} M${x(.29)} ${y(.17)} C${x(.31)} ${y(.39)},${x(.24)} ${y(.65)},${x(.18)} ${y(1.07)} M${x(.53)} ${y(.23)} C${x(.48)} ${y(.45)},${x(.58)} ${y(.73)},${x(.49)} ${y(1.07)}`;
          shape('map-arterial-casing', arteries, map.casings[0] || null);
          shape('map-arterial', arteries, map.casings[0] || null);
          const riverShape = `M${x(.68)} ${y(-.07)} C${x(.65)} ${y(.05)},${x(.72)} ${y(.15)},${x(.67)} ${y(.24)} C${x(.61)} ${y(.34)},${x(.65)} ${y(.42)},${x(.70)} ${y(.48)} C${x(.75)} ${y(.56)},${x(.75)} ${y(.66)},${x(.81)} ${y(.73)} C${x(.87)} ${y(.85)},${x(.94)} ${y(.91)},${x(1.08)} ${y(1.04)} L${x(1.16)} ${y(1.04)} C${x(1.01)} ${y(.89)},${x(.96)} ${y(.83)},${x(.91)} ${y(.70)} C${x(.85)} ${y(.57)},${x(.82)} ${y(.48)},${x(.76)} ${y(.42)} C${x(.72)} ${y(.37)},${x(.69)} ${y(.34)},${x(.75)} ${y(.25)} C${x(.82)} ${y(.15)},${x(.73)} ${y(.05)},${x(.78)} ${y(-.07)} Z`;
          shape('map-river-fill', riverShape, map.casings[0] || null);
          const bridges = `M${x(.62)} ${y(.42)} L${x(.81)} ${y(.48)} M${x(.68)} ${y(.64)} L${x(.89)} ${y(.67)}`;
          shape('map-bridge-casing', bridges, map.casings[0] || null);
          shape('map-bridge', bridges, map.casings[0] || null);
          return map;
        };
      },
    },
  },
});
