// Designs on templates/pick-color/base.js: the base site's pick-color widgets, which this composite site embeds by
// name (it carried an edited copy of sites/base/widgets/pick-color.js), with the units it changed as parts. All share
// one parts object: the template runs the reference code once per page.
(function () {
  const parts = {
    'buildPicker': (base, scope) => function buildPicker(ctx, card, maxH) {
      const { F, commit, env } = scope;
      const { rng, util, spec } = ctx;
      const minPx = F().helpers.MIN_TRACK_PX;
      const S = Math.max(minPx, Math.min(rng.int(230, 320), maxH,
        Math.floor(card.clientWidth - 56), card.clientWidth < 240 ? 130 : 180));
      const radius = rng.pick([2, 4, 6]);
      const stripW = rng.int(20, 30);
      const knob = rng.int(12, 16);

      const svHit = util.el('div', 'cp-hit', card);
      svHit.dataset.role = 'sv';
      const sv = util.el('div', 'cp-sv', svHit);
      Object.assign(sv.style, { width: S + 'px', height: S + 'px', borderRadius: radius + 'px' });
      util.el('div', 'cp-sv-layer cp-sv-white', sv);
      util.el('div', 'cp-sv-layer cp-sv-black', sv);
      const svKnob = util.el('div', 'cp-knob', sv);
      Object.assign(svKnob.style, { width: knob + 'px', height: knob + 'px', margin: `${-knob / 2}px 0 0 ${-knob / 2}px` });

      const hueHit = util.el('div', 'cp-hit', card);
      hueHit.dataset.role = 'hue';
      const hue = util.el('div', 'cp-hue', hueHit);
      Object.assign(hue.style, { width: stripW + 'px', height: S + 'px', borderRadius: Math.min(radius, 4) + 'px' });
      const hueBar = util.el('div', 'cp-bar', hue);

      // Both controls span S - 1 px from their top-left corner; presses in the padding clamp to the edge.
      const span = (el) => () => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, width: S - 1, height: S - 1 };
      };
      const svPad = env.ui.pad(svHit, {
        label: 'sv',
        rect: span(sv),
        value: [ctx.model.s, 1 - ctx.model.v],
        onInput([u, v]) { commit({ s: u, v: 1 - v }); },
      });
      const hueCtl = env.ui.slider(hueHit, {
        label: 'hue',
        thumbs: [hueBar],
        values: [ctx.model.h],
        min: 0,
        max: 360,
        keyboard: !!spec.keys,
        geometry() {
          const r = hue.getBoundingClientRect();
          const x = r.left + r.width / 2;
          return { start: [x, r.top], end: [x, r.top + S - 1] };
        },
        place: (bar, point, f) => { bar.style.top = f * (S - 1) + 'px'; },
        onInput([h]) { commit({ h }); },
      });
      return {
        anchors: [sv, hue],
        paint(m) {
          sv.style.backgroundColor = `hsl(${m.h} 100% 50%)`;
          Object.assign(svKnob.style, { left: m.s * (S - 1) + 'px', top: (1 - m.v) * (S - 1) + 'px' });
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
  };
  for (const name of ['picker', 'wheel', 'rgb', 'hsl', 'vanilla', 'popover']) {
    env.widget({ task: 'pick-color', name, template: 'pick-color/base', design: { widget: name, parts } });
  }
})();
