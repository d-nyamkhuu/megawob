// Preserves this site's viewport-scaled picker, current-color preview, read-only mirrors and footer.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-hex-08',
    name: 'design',
    split: 'train',
    scenarios: ['hex'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      css: '',
      currentClass: 'cp-cur',
      sideCurrentLabel: 'Current color',
      drawCurrentLabel: true,
      sideRows: 'none',
      editableRows: false,
      parts: {
        fit: (base, S) => (ctx, card, maxH) => {
          const minPx = S.task.helpers.MIN_TRACK_PX;
          const sw = ctx.size.width, sh = ctx.size.height;
          ctx.rng.int(230, 320);
          const W = Math.max(minPx, Math.min(Math.round(0.2976 * sw), maxH));
          const H = Math.max(minPx, Math.min(Math.round(0.771 * sh), maxH));
          const radius = ctx.rng.pick([2, 4, 6]);
          ctx.rng.int(20, 30);
          const hueW = Math.round(sw * 0.03);
          ctx.rng.int(12, 16);
          const knob = Math.round(sw * 0.017);
          return { W, H, hueH: H, hueW, radius: 0, knob };
        },
        svStyle: (base, S) => (g) => ({ width: g.W + 'px', height: g.H + 'px', borderRadius: g.radius + 'px' }),
        hueStyle: (base, S) => (g) => ({ width: g.hueW + 'px', height: g.hueH + 'px', borderRadius: Math.min(g.radius, 4) + 'px' }),
        knobStyle: (base, S) => (g) => ({ width: g.knob + 'px', height: g.knob + 'px', margin: `${-g.knob / 2}px 0 0 ${-g.knob / 2}px` }),
        target: (base, S) => (ctx, side, targetHost) => {
          const { util } = ctx;
          const target = util.el('div', 'cp-target', targetHost || side);
          util.el('div', 'cp-label', target, 'Color preview (read-only)');
          const row = util.el('div', 'cp-trow', target);
          const swatch = util.el('div', 'cp-tsw', row);
          const info = util.el('div', 'cp-tinfo', row);
          const code = util.el('div', 'cp-code', info);
          util.el('div', 'cp-tnote', info, 'Current selection.');
          S.preview = { swatch, code };
        },
        current: (base, S) => (ctx, side) => {
          const view = base(ctx, side);
          view.hsv = ctx.util.el('div', 'cp-hsv', view.cur);
          const ctrls = ctx.util.el('div', 'cp-ctrls', side);
          ctx.util.el('div', 'cp-ctitle', ctrls).innerHTML = '<b>Controls</b> (read-only values)';
          view.controlRows = ['Hue', 'Saturation', 'Value'].map((name) => {
            const row = ctx.util.el('div', 'cp-crow', ctrls);
            ctx.util.el('span', 'cp-cname', row, name);
            const track = ctx.util.el('div', 'cp-ctrack', row);
            const thumb = ctx.util.el('div', 'cp-cthumb', track);
            const num = ctx.util.el('span', 'cp-cnum', row);
            return { track, thumb, num };
          });
          const host = document.querySelector('[data-role=selected-host]');
          if (host) {
            const row = ctx.util.el('div', 'sel-row', host);
            view.selectedSwatch = ctx.util.el('div', 'sel-sw', row);
            view.selectedText = ctx.util.el('div', 'sel-txt', row);
          }
          return view;
        },
        sidePaint: (base, S) => (ctx, view, model, rgb) => {
          S.preview.swatch.style.background = S.math.hex(rgb);
          S.preview.code.textContent = S.math.hex(rgb);
          const hp = Math.round(model.h), sp = Math.round(model.s * 100), vp = Math.round(model.v * 100);
          view.hsv.textContent = `H: ${hp}°\nS: ${sp}%\nV: ${vp}%`;
          const cc = `hsl(${model.h} ${sp}% 58%)`;
          view.controlRows[0].track.style.background = 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)';
          view.controlRows[1].track.style.background = `linear-gradient(to right,#fff,${cc})`;
          view.controlRows[2].track.style.background = `linear-gradient(to right,#000,${cc} 70%,#fff)`;
          view.controlRows.forEach((row, i) => {
            row.thumb.style.background = i === 0 ? cc : '#faf8f3';
          });
          [model.h / 360, model.s, model.v].forEach((f, i) => {
            view.controlRows[i].thumb.style.left = (Math.min(1, Math.max(0, f)) * 100) + '%';
          });
          view.controlRows[0].num.textContent = hp + '°';
          view.controlRows[1].num.textContent = sp + '%';
          view.controlRows[2].num.textContent = vp + '%';
          if (view.selectedSwatch) {
            view.selectedSwatch.style.background = S.math.hex(rgb);
            view.selectedText.textContent = `${S.math.hex(rgb)}\nH: ${hp}°  S: ${sp}%  V: ${vp}%`;
          }
        },
      },
    },
  });
})();
