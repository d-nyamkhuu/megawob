// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-range-03',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-slider/classic',
  design: {
    parts: {
      renderPlain: (base, S) => (ctx, look) => {
        const { spec, rng } = ctx;
        const { util, size } = ctx;
        const scale = env.taskOf('set-slider').helpers.scale;
        // These are the original renderPlain length/tick/placement draws, in order.
        const maxV = Math.max(240, Math.min(440, Math.floor(size.height) - 200));
        const room = Math.floor(size.width) - 120 - 96 - 24 - (look.readout ? 152 : 0);
        const maxH = Math.max(320, Math.min(820, room));
        const minH = (s) => s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320;
        const randLength = (s) => spec.vertical ? rng.int(240, maxV) : rng.int(Math.min(minH(s), maxH), Math.max(minH(s), maxH));
        randLength(spec.sliders.some((s) => s.log) ? {log: true} : spec.sliders.find((s) => s.stops) || {});
        for (const s of spec.sliders) {
          if (!spec.norm) randLength(s);
          rng.pick([4, 5, 10]);
        }
        rng.pick([0, 0.5, 0.5, 1]); rng.float(-0.15, 0.15);
        rng.pick([0, 0.5, 0.5, 1]); rng.float(-0.15, 0.15);
        const multiple = spec.sliders.length > 1;
        const stageH = Math.max(80, Math.floor(size.height));
        const H = multiple ? stageH * 0.74 : stageH;
        const rowH = stageH * 1.25 / spec.sliders.length;
        const labelSpace = multiple ? Math.round(stageH * 0.68) : 0;
        if (multiple) {
          ctx.stage.style.height = 'calc(var(--u)*11.6)';
          Object.assign(ctx.stage.parentElement.querySelector('.ng-info').style, {
            top: 'calc(var(--u)*18.75)', height: 'calc(var(--u)*4.35)',
            paddingTop: 'calc(var(--u)*.55)', paddingBottom: 'calc(var(--u)*.55)',
          });
        }
        const fz = Math.round(H * (multiple ? 0.145 : 0.13));
        const th = Math.round(H * (multiple ? 0.25 : 0.22));
        const tw = Math.round(H * (multiple ? 0.23 : 0.2));
        const cross = Math.max(th - 12, 24) + 12;
        const bh = Math.round(H * (multiple ? 0.24 : 0.21));
        const L = Math.max(200, Math.floor(size.width) - labelSpace);
        const card = util.el('div', 'ng-slider', ctx.stage);
        card.style.cssText = `position:absolute;left:0;top:${Math.round(H * (multiple ? 0.26 : 0.29))}px;font-size:${fz}px`;
        const bubbles = [];
        const sliders = spec.sliders.map((s, i) => {
          const sl = S.P.makeSlider(ctx, card, i, s, {
            vertical: false, length: L, thumb: th - 12, thumbBox: [tw, th], rail: Math.max(8, Math.round(H * 0.08)),
            ticks: true, tickCount: 6, standalone: true, labelEl: false,
          });
          const body = sl.anchor.parentElement;
          if (multiple) {
            const row = body.parentElement;
            Object.assign(row.style, {position: 'absolute', left: '0', top: Math.round(i * rowH) + 'px'});
            body.style.marginLeft = labelSpace + 'px';
            const label = util.el('div', 'ng-slider-label', row, s.label);
            Object.assign(label.style, {width: labelSpace - 12 + 'px', top: cross / 2 + 'px', fontSize: Math.round(stageH * 0.11) + 'px'});
          }
          const ticks = body.querySelector('.slc-ticks');
          if (ticks) ticks.style.top = cross / 2 + Math.round(H * 0.09) + 'px';
          ctx.model.values[i].forEach((_, j) => {
            const b = util.el('div', 'ng-bubble', body);
            Object.assign(b.style, { height: bh + 'px', minWidth: Math.round(H * 0.34) + 'px', top: (cross - th) / 2 - bubbleGap(H) - bh + 'px', fontSize: Math.round(H * 0.135) + 'px' });
            bubbles.push([b, s, i, j]);
          });
          return sl;
        });
        function bubbleGap(h) { return Math.round(h * 0.04); }
        const paintBubbles = () => {
          for (const [b, s, i, j] of bubbles) {
            const v = ctx.model.values[i][j];
            b.textContent = scale.fmt(s, v);
            b.style.left = scale.frac(s, v) * L + 'px';
          }
        };
        const upd = ctx.update;
        ctx.update = (m) => { upd(m); paintBubbles(); };
        paintBubbles();
        sliders.paintTime = paintBubbles;
        return sliders;
      },
    },
  },
});
