// Restores this site's brief preview, preferences mirror and unboxed hex readouts.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-hex-12',
    name: 'design',
    split: 'train',
    scenarios: ['hex'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      targetClass: '',
      targetLabel: null,
      currentClass: '',
      sideCurrentLabel: null,
      drawCurrentLabel: true,
      sideRows: 'none',
      editableRows: false,
      measured: false,
      svStyle: null,
      hueStyle: null,
      knobStyle: null,
      unitHeight: null,
      resetEvent: null,
      css: `
        .design .cp { position: relative; inset: auto; display: flex; align-items: flex-start; gap: 12px;
          padding: 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
          box-shadow: 0 1px 3px rgba(0,0,0,.06); }
        .design .cp .cp-hit { position: relative; padding: 8px; top: auto; height: auto; }
        .design .cp .cp-hit[data-role=sv], .design .cp .cp-hit[data-role=hue] { left: auto; width: auto; }
        .design .cp .cp-side { position: static; inset: auto; width: auto !important; padding: 6px 6px 6px 12px;
          display: flex; pointer-events: auto; }
        .design .cp .cp-knob { border: 3px solid #fff; box-shadow: 0 0 0 1px #2a2a6a; }
        .design .cp .cp-bar { left: -5px; right: -5px; height: 14px; margin-top: -7px; border: 3px solid #fff;
          border-radius: 8px; background: transparent; box-shadow: 0 0 0 1px #333; }
        .design .cp .cp-label { margin: 0 0 5px; color: #222; font-size: 2.2cqh; font-weight: 600;
          letter-spacing: .06em; text-transform: uppercase; line-height: normal; }
        .design .cp .cp-swatch { height: 60px; border: 0; border-radius: 0;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.15); }
        .design .cp .cp-hex { display: block; }
      `,
      parts: {
        side: (base) => (ctx, parent, width, targetHost) => {
          const result = base(ctx, parent, width, targetHost);
          parent.querySelector('.cp-side').style.setProperty('width', width + 'px', 'important');
          return result;
        },
        target: (base) => (ctx, side, targetHost) => {
          if (ctx.spec.scenario === 'hex') {
            const brief = document.querySelector('.brief');
            const preview = ctx.util.el('div', 'target-preview');
            ctx.util.el('div', '', preview, 'Target color (hex):');
            const row = ctx.util.el('div', 'target-preview-row', preview);
            ctx.util.el('div', 'target-preview-swatch', row).style.background = ctx.spec.hex;
            ctx.util.el('div', 'target-preview-code', row, ctx.spec.hex.toUpperCase());
            brief.insertBefore(preview, brief.querySelector('.brief-after'));
          }
          base(ctx, side, targetHost);
        },
        sidePaint: (base, S) => (ctx, view, model, rgb) => {
          base(ctx, view, model, rgb);
          const preview = document.querySelector('.prefs');
          if (!preview) return;
          const code = S.math.hex(rgb);
          const channels = rgb.map((x) => Math.round(x));
          const high = Math.max(...rgb) / 255, low = Math.min(...rgb) / 255;
          const lightness = (high + low) / 2;
          const saturation = high === low ? 0 : (high - low) / (1 - Math.abs(2 * lightness - 1));
          preview.querySelector('.cur-sw').style.background = code;
          const values = preview.querySelectorAll('.cur-vals div span:last-child');
          values[0].textContent = code.toUpperCase();
          values[1].textContent = channels.join(', ');
          values[2].textContent = `${Math.round(model.h)}°, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%`;
          const ring = preview.querySelector('.hs-ring');
          ring.style.left = (model.h / 360 * 100) + '%';
          ring.style.top = ((1 - model.v) * 100) + '%';
          preview.querySelector('.hs-thumb').style.top = ((1 - model.v) * 100) + '%';
          preview.querySelector('.hs-strip').style.background = `linear-gradient(#fff, hsl(${model.h} 100% 50%) 40%, #000)`;
        },
        locate: (base, S) => (target) => {
          const preferences = document.querySelector('.prefs');
          if (preferences && !preferences.hidden) return S.ctx.util.center(document.querySelector('.tab'));
          return base(target);
        },
      },
    },
  });
})();
