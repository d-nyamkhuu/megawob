// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-marker-01',
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
          return input;
        };
      },
      explorerHeading(base) {
        return function (ctx, panel) {
          const section = ctx.util.el('div', 'mpe-section map-directory-heading', panel);
          panel.insertBefore(section, panel.firstChild);
          ctx.util.el('div', 'mpe-heading', section, `Places (${ctx.spec.places.length})`);
          return section;
        };
      },
      explorerRow(base) {
        return function (ctx, list, place) {
          const result = base(ctx, list, place);
          const { row, button } = result;
          row.classList.add('map-directory-row');
          button.replaceChildren();
          ctx.util.el('span', 'mpe-name', button, place.name);
          ctx.util.el('span', 'map-place-type', button, place.label || place.kind || 'Place');
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
          const first = map.world.firstElementChild;
          shape('mp-sea map-bay', `M${x(0)} ${y(0)} L${x(.28)} ${y(0)} C${x(.23)} ${y(.12)},${x(.32)} ${y(.2)},${x(.24)} ${y(.31)} C${x(.18)} ${y(.42)},${x(.33)} ${y(.53)},${x(.25)} ${y(.64)} C${x(.18)} ${y(.77)},${x(.32)} ${y(.87)},${x(.2)} ${y(1)} L${x(0)} ${y(1)} Z`, first);
          const streets = map.streets;
          for (const [f, g, w, h] of [[.38,.18,.11,.16],[.3,.69,.16,.13],[.58,.45,.09,.12],[.8,.75,.1,.14]]) {
            shape('mp-park map-park', `M${x(f)} ${y(g)} Q${x(f+w*.18)} ${y(g-.05)} ${x(f+w*.45)} ${y(g)} Q${x(f+w*1.12)} ${y(g+h*.12)} ${x(f+w)} ${y(g+h*.52)} Q${x(f+w*.92)} ${y(g+h*1.08)} ${x(f+w*.38)} ${y(g+h)} Q${x(f-.08)} ${y(g+h*.84)} ${x(f)} ${y(g)} Z`, streets);
          }
          const riverPath = `M${x(.77)} ${y(0)} C${x(.68)} ${y(.17)},${x(.84)} ${y(.27)},${x(.75)} ${y(.43)} C${x(.68)} ${y(.58)},${x(.84)} ${y(.7)},${x(.76)} ${y(.85)} C${x(.7)} ${y(.94)},${x(.78)} ${y(.97)},${x(.73)} ${y(1)}`;
          shape('mp-river map-river', riverPath, map.casings[0] || null).setAttribute('stroke-width', Math.max(52, 68 / scale));
          return map;
        };
      },
    },
  },
});
