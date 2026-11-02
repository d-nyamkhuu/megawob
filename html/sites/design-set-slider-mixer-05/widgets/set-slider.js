// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-mixer-05',
  name: 'design',
  split: 'train',
  scenarios: ['mixer'],
  template: 'set-slider/base',
  design: {
    parts: {
      renderMixer: (base, S) => (ctx) => {
        const { spec, rng, util, size } = ctx;
        const mixer = util.el('div', 'slx-mixer terrain-mixer', ctx.stage);
        mixer.dataset.role = 'mixer';
        // Retain the original geometry draw and placement draws so seeded tasks stay in step.
        rng.int(220, 360);
        const W = Math.floor(size.width);
        const H = Math.floor(size.height);
        const compact = H < 400;
        const slot = W / spec.sliders.length;
        const L = Math.max(60, H - (compact ? 122 : 166));
        const thumbW = Math.max(36, Math.min(60, Math.floor(slot * .26)));
        const thumbH = compact ? 30 : 42;
        mixer.classList.toggle('is-compact', compact);
        Object.assign(mixer.style, { width: W + 'px', height: H + 'px' });
        mixer.style.setProperty('--channel-name-size', (slot < 140 ? 17 : 24) + 'px');
        mixer.style.setProperty('--channel-value-size', (slot < 140 ? 19 : 26) + 'px');
        const out = spec.sliders.map((s, i) => {
          const strip = util.el('div', 'slx-strip terrain-channel', mixer);
          const val = util.el('div', 'slx-val terrain-channel-value', strip);
          const body = util.el('div', 'slx-body terrain-channel-body', strip);
          const sl = S.makeSlider(ctx, body, i, s, {
            vertical: true, length: L, thumb: thumbW, thumbBox: [thumbW, thumbH],
            rail: slot < 140 ? 18 : 24, ticks: true, tickCount: 5,
            labelEl: false, cls: 'slx-fader terrain-fader', readoutEl: val,
          });
          util.el('div', 'slx-name terrain-channel-name', strip, s.label).title = s.label;
          return sl;
        });
        S.placeIn(ctx, mixer, rng);
        Object.assign(mixer.style, { left: '0px', top: '0px' });
        const count = String(spec.sliders.length);
        document.querySelectorAll('.terrain-stat:nth-of-type(-n+3) span:last-child').forEach((node, i) => {
          if (i < 2) node.textContent = count;
        });
        const meta = document.querySelector('.terrain-session-meta');
        if (meta) meta.textContent = count + ' tracks   |   44.1 kHz   |   24 bit   |   120 BPM';
        return out;
      },
    },
  },
});
