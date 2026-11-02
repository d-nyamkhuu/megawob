// Keeps the reference-pixel picker, numeric readouts, and paired preview swatches.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-swatch-11',
  name: 'design',
  split: 'train',
  scenarios: ['swatch'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    reverseHue: true,
    parts: {
      fit: (base, S) => (ctx, card) => {
        const bounds = card.getBoundingClientRect();
        const W = Math.max(S.task.helpers.MIN_TRACK_PX, Math.round(bounds.width * 400 / 1246));
        const H = Math.max(S.task.helpers.MIN_TRACK_PX, Math.round(bounds.height * .785));
        return {
          W, H, hueH: H - 3, radius: 0,
          hueW: Math.round(bounds.width * .0225),
          knob: Math.max(16, Math.round(W * .085)), bounds,
        };
      },
      axes: () => (ctx, card) => {
        const { util } = ctx;
        const at = (el, x, y, w, h) => {
          el.style.left = x / 1246 * 100 + '%';
          el.style.top = y / 498 * 100 + '%';
          if (w) el.style.width = w / 1246 * 100 + '%';
          if (h) el.style.height = h / 498 * 100 + '%';
          return el;
        };
        const vl = at(util.el('div', 'pk c h', card, 'Value'), 0, 22, 102, 26);
        vl.style.lineHeight = '1.1';
        at(util.el('div', 'pk c h', card, '(brightness)'), 0, 44, 102, 26);
        at(util.el('div', 'pk c l', card, '(brighter)'), 0, 86, 102, 26);
        at(util.el('div', 'pk line vline', card), 38.5, 123, 1.6, 263);
        at(util.el('div', 'pk c l', card, '(darker)'), 0, 402, 102, 26);
        const saturation = at(util.el('div', 'pk pk-sat', card), 118, 444, 400, 26);
        util.el('span', '', saturation, '(low)');
        util.el('span', 'ln', saturation);
        util.el('span', 'b', saturation, 'Saturation');
        util.el('span', 'ln r', saturation);
        util.el('span', '', saturation, '(high)');
        at(util.el('div', 'pk c l', card, 'Hue'), 540, 6, 36, 26);
        at(util.el('div', 'pk c', card, '▲'), 567, 40, 40, 20).style.fontSize = '1.6cqh';
        at(util.el('div', 'pk c', card, '▼'), 567, 402, 40, 20).style.fontSize = '1.6cqh';
      },
      hit: () => (ctx, el, kind, g) => {
        const x = kind === 'sv' ? 108 : 536;
        const y = kind === 'sv' ? 26 : 28;
        Object.assign(el.style, {
          left: Math.round(x / 1246 * g.bounds.width) + 'px',
          top: Math.round(y / 498 * g.bounds.height) + 'px',
        });
      },
      hue: (base) => (ctx, card, g) => {
        const control = base(ctx, card, g);
        const paint = control.paint;
        control.paint = (m) => {
          control.bar.style.background = `linear-gradient(rgba(255,255,255,.65),rgba(255,255,255,0) 55%), hsl(${m.h} 100% 50%)`;
          paint(m);
        };
        return control;
      },
      controlsPaint: (base, S) => (ctx, model, g) => {
        const initial = S.st.initialModel;
        if (model.h !== initial.h || model.s !== initial.s || model.v !== initial.v) S.st.hasMeasured = true;
      },
      layout: (base, S) => (ctx, card) => {
        const { util, spec, size } = ctx;
        const st = S.st;
        const at = (el, x, y, w, h) => {
          el.style.left = x / 1246 * 100 + '%';
          el.style.top = y / 498 * 100 + '%';
          if (w) el.style.width = w / 1246 * 100 + '%';
          if (h) el.style.height = h / 498 * 100 + '%';
          return el;
        };
        at(util.el('div', 'pk l', card, 'Numeric Values (display only)'), 631, 62, 330, 26);
        const nums = {};
        [['H', 116, '°'], ['S', 193, '%'], ['V', 269, '%']].forEach(([k, y, unit]) => {
          at(util.el('div', 'pk l', card, k + ':'), 631, y + 8, 50, 26);
          nums[k] = at(util.el('div', 'pk pk-num', card), 688, y, 93, 44);
          at(util.el('div', 'pk l', card, unit), 797, y + 8, 30, 26);
        });
        const mkSwatch = (label, y) => {
          at(util.el('div', 'pk b h', card, label), 978, y, 220, 26);
          const sw = at(util.el('div', 'pk pk-cur', card), 978, y + 34, 199, 121);
          const hex = at(util.el('div', 'pk l', card), 978, y + 160, 200, 26);
          return { sw, hex };
        };
        const current = mkSwatch('Current', 29);
        const target = mkSwatch(spec.targetLabel, 255);
        const targetHex = S.math.hex(spec.rgb);
        target.sw.style.background = targetHex;
        target.hex.textContent = targetHex;
        const previewTarget = document.querySelector('[data-role="preview-target"]');
        if (previewTarget) previewTarget.style.background = targetHex;

        st.initialModel = { h: ctx.model.h, s: ctx.model.s, v: ctx.model.v };
        st.hasMeasured = false;
        st.controls = S.P.picker(ctx, card, size.height, size.width);
        st.side = {
          anchors: [target.sw, current.sw],
          locators: {},
          paint(model) {
            const rgb = S.math.modelRgb(model);
            const code = S.math.hex(rgb);
            current.sw.style.background = code;
            current.hex.textContent = code;
            const previewCurrent = document.querySelector('[data-role="preview-current"]');
            if (previewCurrent) previewCurrent.style.background = code;
            nums.H.textContent = String(Math.round(model.h));
            nums.S.textContent = String(Math.round(model.s * 100));
            nums.V.textContent = String(Math.round(model.v * 100));
            const delta = document.querySelector('[data-role="color-difference"]');
            if (delta) delta.textContent = st.hasMeasured ? S.task.error(model, spec).toFixed(1) : '−−';
          },
        };
      },
    },
  },
});
