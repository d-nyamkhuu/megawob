// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-pin-03',
  name: 'design',
  split: 'train',
  scenarios: ['pin'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    brand: 'City Explorer',
    maxWidth: 2400,
    maxHeight: 1600,
    widthInset: 0,
    heightInset: 0,
    panelWidth: 390,
    editorSearch: 'Search for a place, address or neighborhood…',
    editLabels: { pin: 'Add Pin', route: 'Route', zone: 'Draw Area', zoomto: 'Explore' },
    parts: {
      fit: (base, S) => (ctx) => ({ width: ctx.size.width, height: ctx.size.height }),
      shellHeader: (base) => (ctx, root, editor) => {
        const out = base(ctx, root, editor);
        out.bar.remove();
        return out;
      },
      shellPanels: (base) => (ctx, root) => {
        const out = base(ctx, root);
        out.rail.hidden = true;
        out.foot.hidden = true;
        out.work.style.position = 'relative';
        out.panel.style.position = 'absolute';
        out.panel.style.zIndex = '30';
        out.panel.style.top = '66px';
        out.panel.style.right = '14px';
        out.panel.style.maxHeight = '54%';
        out.panel.style.overflow = 'hidden';
        return out;
      },
      editorHeading: (base, S) => (ctx, panel) => {
        const section = base(ctx, panel);
        const s = ctx.spec;
        const kicker = section.querySelector('.mpe-kicker');
        const heading = section.querySelector('.mpe-heading');
        const help = section.querySelector('.mpe-help');
        if (kicker) kicker.remove();
        if (heading) heading.textContent = `Places (${s.places.length})`;
        if (help) help.remove();
        const tabs = ctx.util.el('div', 'city-list-tabs', section);
        for (const label of ['Places', 'Saved Pins', 'Routes', 'Areas']) {
          const tab = ctx.util.el('span', label === 'Places' ? 'active' : '', tabs, label);
          if (label === 'Places') tab.setAttribute('aria-current', 'page');
        }
        return section;
      },
      editorWorld: (base) => (ctx, port, W, H) => {
        const out = base(ctx, port, W, H);
        const world = out.world, spec = ctx.spec;
        const streetPaths = world.querySelectorAll('.mp-streets');
        if (streetPaths.length > 1) streetPaths[0].classList.add('city-grid');
        const cx = spec.world.W / 2, cy = spec.world.H / 2;
        const path = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');
        const sea = ctx.util.svg('path', { class: 'city-water', d:
          `M${cx-W*.62} ${cy-H*1.3} L${cx-W*.40} ${cy-H*1.3} C${cx-W*.39} ${cy-H*.9},${cx-W*.36} ${cy-H*.72},${cx-W*.38} ${cy-H*.5} C${cx-W*.40} ${cy-H*.34},${cx-W*.31} ${cy-H*.28},${cx-W*.32} ${cy-H*.18} C${cx-W*.33} ${cy-.05*H},${cx-W*.43} ${cy-.02*H},${cx-W*.39} ${cy+.08*H} C${cx-W*.35} ${cy+.19*H},${cx-W*.31} ${cy+.2*H},${cx-W*.34} ${cy+.3*H} C${cx-W*.37} ${cy+.46*H},${cx-W*.45} ${cy+.48*H},${cx-W*.42} ${cy+.64*H} L${cx-W*.37} ${cy+H*1.3} L${cx-W*.62} ${cy+H*1.3} Z` });
        const parks = world.querySelector('.mp-park');
        world.insertBefore(sea, parks);
        const river = ctx.util.svg('path', { class: 'city-river', d:
          `M${cx-W} ${cy+H*.28} C${cx-W*.62} ${cy+H*.18},${cx-W*.35} ${cy+H*.47},${cx-W*.08} ${cy+H*.32} S${cx+W*.54} ${cy+H*.18},${cx+W} ${cy+H*.42}`, 'stroke-width':Math.max(46,H*.105) });
        world.insertBefore(river, world.querySelector('.mp-casing'));
        return out;
      },
    },
  },
});
