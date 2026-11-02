// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-stops-05',
  name: 'design',
  split: 'train',
  scenarios: ['stops'],
  template: 'set-slider/base',
  design: {
    parts: {
      // The sprinkler picture takes room beside the sliders: size the tracks from what is left, and drop it when the stage is narrow.
      renderPlain: (base) => (ctx, look) => {
        const art = ctx.size.width >= 560;
        const size = { ...ctx.size, width: ctx.size.width - (art ? 260 : 0) };
        const proxy = new Proxy(ctx, { get: (t, k) => (k === 'size' ? size : Reflect.get(t, k)) });
        const out = base(proxy, look);
        const card = ctx.stage.querySelector('.slc-card');
        if (card && !art) card.classList.add('noart');
        let grid = ctx.stage.querySelector('.slc-grid');
        const hGrid = !!grid;
        const vrow = ctx.stage.querySelector('.slc-row');
        if (!grid && vrow && card) {
          grid = document.createElement('div');
          grid.className = 'slc-grid mac-d-own';
          card.insertBefore(grid, vrow);
          vrow.classList.add('mac-d-vtask');
        }
        if (grid && art && Math.min(ctx.size.height, ctx.stage.clientHeight || 9999) >= (hGrid ? 480 : 300)) {
          // Decorative stop sliders (inert) so the card matches the three-slider reference.
          const mk = (cls, parent, text) => { const e = document.createElement('div'); e.className = cls; if (text != null) e.textContent = text; parent.appendChild(e); return e; };
          [['Spray pattern', ['Jet', 'Fan', 'Mist'], 0, ''], ['Spray distance', ['Short', 'Medium', 'Long'], 50, '20 ft'], ['Water flow', ['Low', 'Medium', 'High'], 0, '2 gal/min']].forEach(([name, stops, pos, read]) => {
            const lab = mk('slc-label mac-d-label', grid, name);
            lab.setAttribute('aria-hidden', 'true');
            const tr = mk('mac-d-track', grid); tr.setAttribute('aria-hidden', 'true');
            mk('mac-d-rail', tr);
            const th = mk('mac-d-thumb', tr); th.style.left = pos + '%';
            stops.forEach((s, i) => { const t = mk('mac-d-tick', tr, s); t.style.left = (i * 50) + '%'; });
            const rd = mk('mac-d-read', grid, read); rd.setAttribute('aria-hidden', 'true');
          });
        }
        return out;
      },
    },
  },
});
