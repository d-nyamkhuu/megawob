// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-route-01',
  name: 'design',
  split: 'train',
  scenarios: ['route'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      editorWorld(base, S) {
        return (ctx, port, W, H) => {
          const out = base(ctx, port, W, H);
          const world = out.world;
          const ns = 'http://www.w3.org/2000/svg';
          const cx = ctx.spec.world.W / 2, cy = ctx.spec.world.H / 2;
          world.replaceChildren();
          const node = (tag, attrs, parent = world) => {
            const el = document.createElementNS(ns, tag);
            for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
            parent.appendChild(el); return el;
          };
          const path = (d, cls, extra = {}, parent = world) => node('path', { d, class: cls, ...extra }, parent);
          const text = (value, x, y, cls, extra = {}) => {
            const t = node('text', { x, y, class: cls, ...extra }); t.textContent = value; return t;
          };
          const left = cx - 2100, right = cx + 2100, top = cy - 1800, bottom = cy + 1800;
          // Irregular shore and broad river establish the map's geography first.
          path(`M${left} ${top}H${cx-980} Q${cx-850} ${cy-1450} ${cx-1040} ${cy-1120} T${cx-910} ${cy-650} Q${cx-790} ${cy-360} ${cx-1010} ${cy-60} T${cx-900} ${cy+530} Q${cx-810} ${cy+900} ${cx-1030} ${bottom}H${left}Z`, 'route-water');
          path(`M${cx+1160} ${top-100} C${cx+810} ${cy-1290} ${cx+1540} ${cy-980} ${cx+1190} ${cy-670} S${cx+940} ${cy-80} ${cx+1210} ${cy+190} S${cx+1470} ${cy+800} ${cx+1110} ${cy+1090} S${cx+990} ${cy+1540} ${cx+1240} ${bottom+100}`, 'route-river-casing');
          path(`M${cx+1160} ${top-100} C${cx+810} ${cy-1290} ${cx+1540} ${cy-980} ${cx+1190} ${cy-670} S${cx+940} ${cy-80} ${cx+1210} ${cy+190} S${cx+1470} ${cy+800} ${cx+1110} ${cy+1090} S${cx+990} ${cy+1540} ${cx+1240} ${bottom+100}`, 'route-river');
          // Parks have soft, surveyed edges instead of regular polygon corners.
          path(`M${cx-920} ${cy-1040} Q${cx-700} ${cy-1180} ${cx-450} ${cy-1060} T${cx-180} ${cy-880} Q${cx-250} ${cy-650} ${cx-520} ${cy-630} T${cx-900} ${cy-730} Q${cx-1080} ${cy-850} ${cx-920} ${cy-1040}Z`, 'route-park');
          path(`M${cx+70} ${cy+660} Q${cx+260} ${cy+470} ${cx+530} ${cy+580} T${cx+880} ${cy+700} Q${cx+930} ${cy+950} ${cx+700} ${cy+1110} T${cx+270} ${cy+1150} Q${cx+50} ${cy+1000} ${cx+70} ${cy+660}Z`, 'route-park');
          path(`M${cx-1690} ${cy+870} Q${cx-1530} ${cy+700} ${cx-1350} ${cy+800} L${cx-1270} ${cy+1110} Q${cx-1450} ${cy+1270} ${cx-1660} ${cy+1120}Z`, 'route-park');
          for (let i = 0; i < 7; i++) {
            const y = cy - 430 + i * 145, x = cx - 900 + (i % 2) * 50;
            path(`M${x} ${y} l-150 -44 l-22 16 l158 58 M${x-35} ${y+12} l-12 38 M${x-82} ${y-2} l-13 38 M${x-128} ${y-18} l-13 38`, 'route-pier');
          }

          const defs = node('defs', {});
          const clip = node('clipPath', { id: 'route-city-clip', clipPathUnits: 'userSpaceOnUse' }, defs);
          node('path', { d: `M${cx-900} ${top} L${cx+1000} ${top} C${cx+840} ${cy-1250} ${cx+1120} ${cy-800} ${cx+930} ${cy-430} S${cx+840} ${cy+260} ${cx+1030} ${cy+610} S${cx+830} ${cy+1280} ${cx+1050} ${bottom} L${cx-950} ${bottom} C${cx-820} ${cy+950} ${cx-1130} ${cy+400} ${cx-910} ${cy+40} S${cx-1080} ${cy-1080} ${cx-900} ${top}Z` }, clip);
          const city = node('g', { class: 'route-city', 'clip-path': 'url(#route-city-clip)' });

          // The city grid bends and shifts block by block. Footprints are deterministic
          // functions of their cell, so this decoration adds no random draws.
          const blocks = node('g', { class: 'route-buildings' });
          const streetPaths = [];
          const stepX = Math.max(62, ctx.spec.spacing[0] / 5.1), stepY = Math.max(58, ctx.spec.spacing[1] / 5.0);
          for (let col = -15; col <= 15; col++) {
            const x = cx + col * stepX;
            if (x < cx - 880) continue;
            const bend = (col % 2 ? 1 : -1) * stepX * (.55 + (Math.abs(col) % 3) * .09);
            streetPaths.push(`M${x} ${top} C${x+bend} ${cy-1150} ${x-bend*.8} ${cy-300} ${x+bend*.45} ${cy+300} S${x-bend*.7} ${cy+1250} ${x+bend*.3} ${bottom}`);
          }
          for (let row = -14; row <= 14; row++) {
            const y = cy + row * stepY;
            const bend = (row % 2 ? -1 : 1) * stepY * (.5 + (Math.abs(row) % 3) * .08);
            streetPaths.push(`M${cx-860} ${y} C${cx-1000} ${y+bend} ${cx-300} ${y-bend*.8} ${cx+150} ${y+bend*.35} S${cx+1100} ${y-bend} ${right} ${y+bend*.3}`);
          }
          for (let col = -14; col <= 14; col++) for (let row = -13; row <= 13; row++) {
            if (cx + col * stepX < cx - 880) continue;
            const seed = Math.abs((col * 73856093) ^ (row * 19349663));
            const bx = cx + col * stepX + 12 + seed % 17, by = cy + row * stepY + 11 + (seed >> 4) % 15;
            const count = 1 + seed % 3;
            for (let n = 0; n < count; n++) {
              const ox = (seed >> (n + 2)) % Math.max(12, stepX * .22) + n * 5;
              const oy = (seed >> (n + 5)) % Math.max(12, stepY * .22) + n * 5;
              const bw = 10 + (seed >> (n + 8)) % Math.max(13, stepX * .23);
              const bh = 10 + (seed >> (n + 11)) % Math.max(13, stepY * .22);
              node('rect', { x: bx + ox, y: by + oy, width: bw, height: bh, rx: 2 + seed % 3,
                class: `route-building tone-${seed % 4}` }, blocks);
            }
          }
          city.appendChild(blocks);
          path(streetPaths.join(''), 'route-street-casing', {}, city);
          path(streetPaths.join(''), 'route-local-streets', {}, city);

          // The named arterials are curved, gold-cased avenues over the minor grid.
          const arterial = [
            `M${cx-1950} ${cy-1170} C${cx-1100} ${cy-980} ${cx-520} ${cy-1100} ${cx+100} ${cy-1010} S${cx+1210} ${cy-770} ${right} ${cy-620}`,
            `M${cx-1850} ${cy+620} C${cx-1120} ${cy+500} ${cx-620} ${cy+720} ${cx-80} ${cy+620} S${cx+900} ${cy+520} ${right} ${cy+360}`,
            `M${cx-420} ${top} C${cx-250} ${cy-840} ${cx+20} ${cy-480} ${cx+80} ${cy-70} S${cx+220} ${cy+890} ${cx+40} ${bottom}`,
          ];
          for (const d of arterial) { path(d, 'route-avenue-casing', {}, city); path(d, 'route-avenue', {}, city); }
          for (const r of ctx.spec.world.roads) {
            const d = r.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');
            path(d, 'route-avenue-casing', {}, city); path(d, 'route-avenue', {}, city);
            const first = r.pts[0], last = r.pts[r.pts.length - 1];
            const t = text(r.name, (first[0] + last[0]) / 2, (first[1] + last[1]) / 2 - 12, 'route-road-label'); city.appendChild(t);
          }
          world.appendChild(city);
          world.querySelectorAll('.route-park').forEach((p) => world.appendChild(p));
          world.querySelectorAll('.route-district-label,.route-park-label,.route-water-label').forEach((t) => world.appendChild(t));
          text('Northview Park', cx-650, cy-850, 'route-park-label');
          text('Meadowbrook Park', cx+470, cy+820, 'route-park-label');
          text('West End', cx-670, cy-480, 'route-district-label');
          text('Midtown', cx-110, cy+360, 'route-district-label');
          text('Hillcrest', cx+540, cy+100, 'route-district-label');
          text('Southgate', cx+120, cy+820, 'route-district-label');
          text('Brightwater Bay', cx-1450, cy+120, 'route-water-label');
          text('Maple River', cx+1230, cy-820, 'route-water-label');
          text('Market Ave', cx-480, cy+620, 'route-road-label', { transform: `rotate(7 ${cx-480} ${cy+620})` });
          text('Maple St', cx+220, cy+450, 'route-road-label', { transform: `rotate(-79 ${cx+220} ${cy+450})` });
          text('Oak St', cx+280, cy-260, 'route-road-label');
          text('Pine St', cx-350, cy-1060, 'route-road-label');
          return out;
        };
      },
    },
  },
});
