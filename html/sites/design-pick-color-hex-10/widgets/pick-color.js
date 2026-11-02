// Keeps the external information panel, HSV mirrors, and em-sized picker layout.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-hex-10',
  name: 'design',
  split: 'train',
  scenarios: ['hex'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    css: '',
    measured: false,
    currentClass: '',
    sideCurrentLabel: null,
    sideRows: 'none',
    editableRows: false,
    unitHeight: 78.85,
    resetSelector: '.reset',
    resetScope: 'shell',
    resetLog: ['reset', {}],
    parts: {
      limits: (base, S) => (ctx, sideW) => {
        const unit = parseFloat(getComputedStyle(document.documentElement).fontSize) / 10;
        return {
          maxH: Math.floor(ctx.size.height - 132 * unit),
          maxW: Math.floor(ctx.size.width) - sideW - 80,
        };
      },
      fit: (base, S) => (ctx, card, maxH) => {
        const minPx = S.task.helpers.MIN_TRACK_PX;
        ctx.rng.int(230, 320);
        const unit = parseFloat(getComputedStyle(document.documentElement).fontSize) / 10;
        const W = Math.max(minPx, Math.min(maxH, Math.round(458 * unit)));
        const radius = ctx.rng.pick([2, 4, 6]);
        ctx.rng.int(20, 30);
        const hueW = Math.round(47 * (W / 458));
        ctx.rng.int(12, 16);
        const knob = Math.round(26 * (W / 458));
        return { W, H: W, hueH: W, hueW, radius, knob };
      },
      svStyle: () => (g) => ({ width: g.W + 'px', height: g.H + 'px', borderRadius: g.radius + 'px' }),
      hueStyle: () => (g) => ({ width: g.hueW + 'px', height: g.hueH + 'px', borderRadius: Math.min(g.radius, 4) + 'px' }),
      knobStyle: () => (g) => ({ width: g.knob + 'px', height: g.knob + 'px', margin: `${-g.knob / 2}px 0 0 ${-g.knob / 2}px` }),
      target: (base, S) => (ctx, side, targetHost) => {
        const { util, spec } = ctx;
        if (!spec.showCode) return;
        const target = util.el('div', '', targetHost || side);
        util.el('div', 'cp-label', target, spec.targetLabel);
        if (spec.hex) util.el('div', 'cp-swatch', target).style.background = spec.hex;
        util.el('div', 'cp-code', target, spec.code);
      },
      layout: (base, S) => (ctx, card) => {
        ctx.util.el('div', 'cp-head', card, 'Pick a Color');
        base(ctx, card);
        const { util, spec } = ctx;
        const side = card.querySelector('.cp-side');
        const infoBody = document.querySelector('.info-body') || card;
        if (side) infoBody.append(side);

        const sliders = util.el('div', 'cp-sliders', card);
        const rows = S.st.sliderRows = {};
        for (const [key, name, unit] of [['h', 'Hue', '°'], ['s', 'Saturation', '%'], ['v', 'Value', '%']]) {
          const group = util.el('div', 'cp-sl', sliders);
          util.el('div', 'cp-sl-name', group, name);
          const row = util.el('div', 'cp-sl-row', group);
          const track = util.el('div', 'cp-sl-track', row);
          const thumb = util.el('div', 'cp-sl-thumb', track);
          const value = util.el('div', 'cp-sl-val', row);
          rows[key] = { track, thumb, num: util.el('span', '', value), unit: util.el('span', '', value, unit) };
        }
        if (spec.fields) {
          const fields = infoBody.querySelector('.cp-fields');
          if (fields) sliders.append(fields);
        }
        const actions = document.querySelector('.info-actions');
        if (actions) {
          const reset = util.el('button', 'reset', actions, 'Reset');
          reset.type = 'button';
          actions.insertBefore(reset, actions.firstChild);
        }
      },
      controlsPaint: (base, S) => (ctx, model) => {
        const rows = S.st.sliderRows;
        if (!rows) return;
        const hex = (h, s, v) => S.math.hex(S.math.hsvToRgb(h, s, v));
        rows.h.track.style.background = 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)';
        rows.s.track.style.background = `linear-gradient(to right, ${hex(model.h, 0, model.v)}, ${hex(model.h, 1, model.v)})`;
        rows.v.track.style.background = `linear-gradient(to right, #000, ${hex(model.h, model.s, 1)})`;
        rows.h.thumb.style.left = (model.h / 360) * 100 + '%';
        rows.s.thumb.style.left = model.s * 100 + '%';
        rows.v.thumb.style.left = model.v * 100 + '%';
        rows.h.num.textContent = String(Math.round(model.h));
        rows.s.num.textContent = String(Math.round(model.s * 100));
        rows.v.num.textContent = String(Math.round(model.v * 100));
      },
      rendered: (base, S) => (ctx, card) => {
        const util = ctx.util;
        const side = document.querySelector('.info-body .cp-side');
        if (!side) return;
        const box = util.el('div', 'hsv', side);
        const vals = S.st.hsvValues = {};
        for (const [key, label, unit] of [['h', 'H:', '°'], ['s', 'S:', '%'], ['v', 'V:', '%']]) {
          util.el('div', 'hsv-l', box, label);
          const value = util.el('div', 'hsv-v', box);
          vals[key] = util.el('span', '', value);
          util.el('span', '', value, unit);
        }
      },
      sidePaint: (base, S) => (ctx, view, model) => {
        const vals = S.st.hsvValues;
        if (!vals) return;
        vals.h.textContent = String(Math.round(model.h));
        vals.s.textContent = String(Math.round(model.s * 100));
        vals.v.textContent = String(Math.round(model.v * 100));
      },
      afterPaint: (base, S) => (ctx, card) => {
        base(ctx, card);
        card.style.left = '';
        card.style.top = '';
      },
    },
  },
});
