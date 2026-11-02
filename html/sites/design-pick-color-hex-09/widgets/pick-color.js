// Preserves this site's proportional picker geometry and standalone numeric readouts.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-hex-09',
    name: 'design',
    split: 'train',
    scenarios: ['hex'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      css: '.design .cp .cp-hit[data-role=sv]{left:28.9%;top:7.6%;width:auto;height:auto;padding:8px}' +
        '.design .cp .cp-hit[data-role=hue]{left:69.7%;top:8.3%;width:auto;height:auto;padding:8px}' +
        '.design .cp .cp-side{position:static;inset:auto;width:auto!important;padding:0;display:contents;pointer-events:auto}' +
        '.design .cp .cp-knob{border:2px solid #fff;box-shadow:0 0 0 1px #000,inset 0 0 0 1px #000}' +
        '.design .cp .cp-bar{left:-5px;right:-5px;height:2.2cqh;margin-top:-1.1cqh;border:2px solid;border-color:#fff #404040 #404040 #fff;background:#c0c0c0;border-radius:0;box-shadow:inset -1px -1px #808080,0 0 0 1px #000}' +
        '.design .cp .cp-cur .cp-swatch{position:absolute;left:3.5%;width:21%;top:8.4%;height:21.2%;margin:0;border:1px solid #111;border-radius:0;box-shadow:none}' +
        '.design .cp .cp-original .cp-label{position:absolute;left:80.8%;top:38%;margin:0;font-size:2.9cqh;font-weight:400;color:#000;text-transform:none;letter-spacing:0;line-height:normal}',
      reverseHue: true,
      sideCurrentLabel: null,
      drawCurrentLabel: true,
      currentClass: 'cp-cur',
      targetClass: 'cp-original',
      targetLabel: 'Original',
      sideRows: 'none',
      editableRows: false,
      unitHeight: null,
      resetEvent: null,
      parts: {
        fit: (base, S) => (ctx) => {
          const minPx = S.task.helpers.MIN_TRACK_PX;
          ctx.rng.int(230, 320); // Retain the original size draw; this design uses proportional dimensions.
          const radius = ctx.rng.pick([2, 4, 6]);
          ctx.rng.int(20, 30); // Retain the original strip-width draw.
          const knob = ctx.rng.int(12, 16);
          const W = Math.max(minPx, Math.round(ctx.size.width * 0.38));
          const H = Math.max(minPx, Math.round(ctx.size.height * 0.565));
          return { W, H, hueH: H, hueW: Math.round(ctx.size.width * 0.038), radius, knob };
        },
        svStyle: (base) => (g) => ({ width: g.W + 'px', height: g.H + 'px', borderRadius: g.radius + 'px' }),
        hueStyle: (base) => (g) => ({ width: g.hueW + 'px', height: g.hueH + 'px', borderRadius: Math.min(g.radius, 4) + 'px' }),
        knobStyle: (base, S) => () => {
          const size = Math.round(S.ctx.size.height * 0.04);
          return { width: size + 'px', height: size + 'px', margin: `${-size / 2}px 0 0 ${-size / 2}px` };
        },
        svRect: (base) => (el, g) => {
          const r = el.getBoundingClientRect();
          return { left: r.left, top: r.top, width: g.W - 1, height: g.H - 1 };
        },
        target: (base, S) => (ctx, side, targetHost) => {
          // Preserve the preview layout using the starting selection, never the goal.
          const code = S.math.hex(S.math.modelRgb(ctx.model));
          const original = ctx.util.el('div', 'cp-original', targetHost || side);
          ctx.util.el('div', 'cp-label', original, 'Original');
          ctx.util.el('div', 'cp-original-preview', original).style.background = code;
          ctx.util.el('div', 'cp-code', original, code.toUpperCase());
        },
        readout: (base, S) => (ctx, view) => {
          const el = !ctx.spec.fields && ctx.spec.scenario === 'hex'
            ? ctx.util.el('div', 'cp-hex', view.cur)
            : null;
          const rows = [];
          if (el || ctx.spec.scenario === 'hex') {
            const nums = ctx.util.el('dl', 'cp-nums', view.cur);
            for (const key of ['Hex', 'R', 'G', 'B', 'H', 'S', 'V']) {
              ctx.util.el('dt', '', nums, key + ':');
              rows.push(ctx.util.el('dd', '', nums, ''));
            }
            ctx.util.el('div', 'cp-plabel', view.cur, 'Current');
            view.previewSwatch = ctx.util.el('div', 'cp-pswatch', view.cur);
          }
          return {
            el,
            paint(model, rgb) {
              if (el) el.textContent = S.math.hex(rgb);
              if (view.previewSwatch) view.previewSwatch.style.background = S.math.hex(rgb);
              if (rows.length) {
                const [r, g, b] = rgb;
                [S.math.hex(rgb).toUpperCase(), r, g, b, Math.round(model.h) % 360,
                  Math.round(model.s * 100), Math.round(model.v * 100)]
                  .forEach((value, i) => { rows[i].textContent = String(value); });
              }
            },
          };
        },
        rendered: (base, S) => (ctx, card) => {
          const { util } = ctx;
          const before = card.firstChild;
          for (const [cls, text] of [
            ['g-left', 'Current Color'],
            ['g-mid', 'Select Color'],
            ['g-right', 'Preview'],
          ]) {
            const group = util.el('div', 'grp ' + cls);
            util.el('span', 'legend', group, text);
            card.insertBefore(group, before);
          }
          const presetBox = util.el('div', 'grp g-presets');
          util.el('span', 'legend', presetBox, 'Preset Colors');
          const presetRow = util.el('div', 'preset-row', presetBox);
          for (const hex of ['#ff0000', '#ff8000', '#ffff00', '#008000', '#00ffff',
            '#0000ff', '#800080', '#ff00ff', '#ffffff', '#000000']) {
            const swatch = util.el('button', 'quick-preset', presetRow);
            swatch.type = 'button';
            swatch.setAttribute('aria-label', 'Preset ' + hex);
            swatch.style.setProperty('--swatch', hex);
            swatch.onclick = () => S.commitRgb(S.math.fromHex(hex));
          }
          card.insertBefore(presetBox, before);
        },
      },
    },
  });
})();
