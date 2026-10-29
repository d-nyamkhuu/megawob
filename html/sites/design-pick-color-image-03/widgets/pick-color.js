// Keep pointer geometry aligned with the controls' responsive rendered dimensions.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-image-03',
  name: 'design',
  split: 'train',
  scenarios: ['image'],
  template: 'pick-color/base',
  design: {
    parts: {
      buildPicker: (base, scope) => function (ctx, card, maxH) {
        const { rng, util, spec } = ctx;
        const size = Math.max(scope.F().helpers.MIN_TRACK_PX, Math.min(rng.int(230, 320), maxH));
        const radius = rng.pick([2, 4, 6]);
        const stripW = rng.int(20, 30);
        const knob = rng.int(12, 16);
        const svHit = util.el('div', 'cp-hit', card);
        svHit.dataset.role = 'sv';
        const sv = util.el('div', 'cp-sv', svHit);
        Object.assign(sv.style, { width: size + 'px', height: size + 'px', borderRadius: radius + 'px' });
        util.el('div', 'cp-sv-layer cp-sv-white', sv);
        util.el('div', 'cp-sv-layer cp-sv-black', sv);
        const svKnob = util.el('div', 'cp-knob', sv);
        Object.assign(svKnob.style, { width: knob + 'px', height: knob + 'px', margin: `${-knob / 2}px 0 0 ${-knob / 2}px` });
        const hueHit = util.el('div', 'cp-hit', card);
        hueHit.dataset.role = 'hue';
        const hue = util.el('div', 'cp-hue', hueHit);
        Object.assign(hue.style, { width: stripW + 'px', height: size + 'px', borderRadius: Math.min(radius, 4) + 'px' });
        const hueBar = util.el('div', 'cp-bar', hue);
        const span = () => {
          const r = sv.getBoundingClientRect();
          return { left: r.left, top: r.top, width: r.width - 1, height: r.height - 1 };
        };
        const svPad = scope.env.ui.pad(svHit, {
          label: 'sv', rect: span, value: [ctx.model.s, 1 - ctx.model.v],
          onInput([u, v]) { scope.commit({ s: u, v: 1 - v }); },
        });
        const hueCtl = scope.env.ui.slider(hueHit, {
          label: 'hue', thumbs: [hueBar], values: [ctx.model.h], min: 0, max: 360,
          keyboard: !!spec.keys,
          geometry() {
            const r = hue.getBoundingClientRect();
            const x = r.left + r.width / 2;
            return { start: [x, r.top], end: [x, r.bottom - 1] };
          },
          place(bar, point, f) { bar.style.top = f * (hue.getBoundingClientRect().height - 1) + 'px'; },
          onInput([h]) { scope.commit({ h }); },
        });
        return {
          anchors: [sv, hue],
          paint(m) {
            const r = span();
            sv.style.backgroundColor = `hsl(${m.h} 100% 50%)`;
            Object.assign(svKnob.style, { left: m.s * r.width + 'px', top: (1 - m.v) * r.height + 'px' });
            svPad.set([m.s, 1 - m.v]);
            hueCtl.set([m.h]);
          },
          locate(t, m) {
            if (t.surface === 'sv') {
              const [s, v] = t.current ? [m.s, m.v] : [t.s, t.v];
              return svPad.locate([s, 1 - v]);
            }
            if (t.surface === 'hue') return hueCtl.locate(t.current ? m.h : t.h);
            return null;
          },
        };
      },
    },
  },
});
