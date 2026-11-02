// Design on templates/pick-color/base.js: the base site's pick-color widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-palette-01',
  name: 'design',
  split: 'train',
  scenarios: ['palette'],
  template: 'pick-color/base',
  design: {
    parts: {
      // Preserve the template controls and their sampled dimensions. CSS must not
      // resize tracks independently of the geometry captured by their handlers.
      buildPicker: (base, S) => (ctx, card, maxH) => {
        ctx.util.el('style', 'ps-style', ctx.stage, S.paletteCSS);
        const compact = ctx.size.width <= 1200 || ctx.size.height <= 688;
        const width = Math.min(compact ? 820 : 950, ctx.size.width * .81 - 32);
        const height = Math.min(compact ? 490 : 610, ctx.size.height - (compact ? 60 : 72));
        const title = compact ? 43 : 55;
        const padding = compact ? 16 : 24;
        const palette = compact ? 138 : 180;
        const inspector = compact ? 155 : 225;
        const middle = width - 2 * padding - palette - inspector;
        const reference = compact ? 65 : 85;
        const current = ctx.spec.fields === 'both' ? 100 : 82;
        const available = Math.floor(Math.min(height - title - reference - current - 2 * padding - 16, middle - 68));
        const controls = base(ctx, card, Math.min(maxH, available));
        const track = parseFloat(controls.anchors[0].style.height);
        card.classList.add('ps-dialog');
        card.paletteLayout = { compact, width, height, title, padding, palette, inspector, middle, reference, current, track };
        Object.assign(card.style, {
          position: 'absolute', display: 'grid', boxSizing: 'border-box',
          width: width + 'px', height: height + 'px', padding: padding + 'px', gap: '0',
          gridTemplateColumns: `${palette}px minmax(0,1fr) ${inspector}px`,
          gridTemplateRows: `${title}px ${reference}px ${track + 16}px minmax(${current}px,1fr)`,
        });
        const svHit = controls.anchors[0].parentElement;
        const hueHit = controls.anchors[1].parentElement;
        Object.assign(svHit.style, { gridColumn: '2', gridRow: '3', justifySelf: 'start' });
        Object.assign(hueHit.style, { gridColumn: '2', gridRow: '3', justifySelf: 'end' });
        return controls;
      },
      buildSide: (base, S) => (ctx, parent, width, options) => {
        const result = base(ctx, parent, width, options);
        const card = parent.closest('.cp');
        const side = parent.querySelector('.cp-side');
        const L = card.paletteLayout;
        side.classList.add('ps-side');
        const slots = Array.from(side.children);
        const presetBox = slots.find(el => el.querySelector('.cp-presets'));
        const current = slots.find(el => el.querySelector('.cp-swatch.small'));
        const reference = slots.find(el => el !== presetBox && el !== current);
        if (reference) reference.classList.add('ps-reference');
        current.classList.add('ps-current');
        presetBox.classList.add('ps-palette');
        const grid = presetBox.querySelector('.cp-presets');
        const room = L.height - L.title - L.padding * 2 - 32;
        const n = ctx.spec.presets.length;
        const columns = n > Math.floor(room / (L.compact ? 35 : 50)) ? 2 : 1;
        const rows = Math.ceil(n / columns);
        const swatch = Math.min(L.compact ? 31 : 42, Math.floor(room / rows) - (columns > 1 ? 20 : 8));
        Object.assign(grid.style, {
          gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          gap: (L.compact ? 4 : 8) + 'px',
        });
        grid.classList.toggle('ps-preset-columns', columns > 1);
        for (const cell of grid.children) {
          cell.classList.add('ps-preset-cell');
          const sw = cell.querySelector('.cp-preset');
          Object.assign(sw.style, { width: swatch + 'px', height: swatch + 'px' });
          // The title is also visible when the template samples unnamed swatches.
          if (!cell.querySelector('.cp-preset-name')) ctx.util.el('span', 'cp-preset-name', cell, sw.title);
        }
        const inspector = ctx.util.el('div', 'ps-inspector', side);
        const values = ctx.util.el('div', 'ps-values', inspector);
        ctx.util.el('strong', '', values, 'Color Values');
        const numbers = ctx.util.el('div', 'ps-numbers', values);
        const tips = ctx.util.el('div', 'ps-tips', inspector);
        ctx.util.el('strong', '', tips, 'ⓘ  Tips');
        ctx.util.el('p', '', tips, '• Start from the closest preset on the left.');
        ctx.util.el('p', '', tips, '• Drag in the square to adjust saturation and brightness.');
        ctx.util.el('p', '', tips, '• Use the hue strip to change the color family.');
        ctx.util.el('p', '', tips, '• Fine-tune with the value fields for an exact match.');
        const paint = result.paint;
        result.paint = model => {
          paint(model);
          const rgb = S.M().modelRgb(model);
          numbers.textContent = `HEX       ${S.M().hex(rgb)}\nR              ${rgb[0]}\nG              ${rgb[1]}\nB              ${rgb[2]}\n\nH              ${Math.round(model.h)}°\nS              ${Math.round(model.s * 100)}%\nB              ${Math.round(model.v * 100)}%`;
        };
        card.classList.toggle('ps-compact', L.compact);
        return result;
      },
      placeCard: (base, S) => (card, ctx) => {
        // Keep the template's placement draws in their original order.
        base(card, ctx);
        const L = card.paletteLayout;
        card.style.left = (ctx.size.width * .595 - L.width / 2) + 'px';
        card.style.top = Math.max(L.compact ? 30 : 36, ctx.size.height / 2 - (L.compact ? 260 : 340)) + 'px';
      },
      '+0.paletteCSS': () => `
        .design.forum .ps-dialog { z-index:8; border:1px solid #d0d2d6; border-radius:16px;
          background:linear-gradient(#fff,#fbfbfc); box-shadow:0 18px 38px #20293830,0 1px 3px #20293816; }
        .design.forum .ps-side { display:contents; }
        .design.forum .ps-reference { grid-column:2; grid-row:2; padding:0 8px; }
        .design.forum .ps-reference .cp-swatch { width:100px; height:60px; }
        .design.forum .ps-reference .cp-code { height:45px; justify-content:flex-start; }
        .design.forum .ps-palette { grid-column:1; grid-row:2/5; padding:0 12px 0 4px; border-right:1px solid #dedfe2; }
        .design.forum .ps-preset-cell { min-width:0; display:flex; gap:12px; align-items:center; }
        .design.forum .ps-preset-cell .cp-preset { flex:none; }
        .design.forum .ps-preset-cell .cp-preset-name { font:14px Arial,sans-serif; text-align:left; white-space:normal; overflow:visible; }
        .design.forum .ps-preset-columns .ps-preset-cell { flex-direction:column; gap:2px; align-items:flex-start; }
        .design.forum .ps-preset-columns .cp-preset-name { font-size:10px; }
        .design.forum .ps-current { grid-column:2; grid-row:4; display:grid; grid-template-columns:60px minmax(0,1fr);
          grid-template-rows:24px auto; gap:0 10px; padding:10px 8px 0; border-top:1px solid #e0e1e4; align-content:start; }
        .design.forum .ps-current .cp-label { grid-column:1/3; }
        .design.forum .ps-current .cp-swatch { grid-column:1; width:60px; height:46px; }
        .design.forum .ps-current .cp-fields { grid-column:2; margin-top:0; }
        .design.forum .ps-current .cp-hex { grid-column:2; margin:0; padding:12px 8px; border:1px solid #cfd3d9; border-radius:8px; background:#fff; }
        .design.forum .ps-dialog .cp-label { margin-bottom:8px; font:600 16px Arial,sans-serif; letter-spacing:0; text-transform:none; color:#182131; }
        .design.forum .ps-inspector { grid-column:3; grid-row:2/5; padding-left:22px; border-left:1px solid #dedfe2; font:15px/1.45 Arial,sans-serif; color:#182131; }
        .design.forum .ps-numbers { margin:15px 0; padding-bottom:16px; border-bottom:1px solid #dedfe2; white-space:pre; line-height:1.85; }
        .design.forum .ps-tips { color:#4e5869; }
        .design.forum .ps-tips p { margin:7px 0; }
        .design.forum .ps-compact .cp-label { font-size:13px; }
        .design.forum .ps-compact .ps-reference .cp-swatch { width:78px; height:40px; }
        .design.forum .ps-compact .ps-reference .cp-code { height:34px; font-size:14px; }
        .design.forum .ps-compact .ps-inspector { padding-left:12px; font-size:11px; }
        .design.forum .ps-compact .ps-numbers { margin:10px 0; padding-bottom:8px; line-height:1.65; }
        .design.forum .ps-compact .ps-preset-cell { gap:7px; }
        .design.forum .ps-compact .ps-preset-cell .cp-preset-name { font-size:11px; }
        .design.forum .ps-compact .ps-preset-columns .ps-preset-cell { gap:2px; }
        .design.forum .ps-compact .ps-preset-columns .cp-preset-name { font-size:10px; }
        .design.forum .ps-compact .ps-current { grid-template-columns:42px minmax(0,1fr); gap:0 6px; padding-top:8px; }
        .design.forum .ps-compact .ps-current .cp-swatch { width:42px; height:36px; }
        .design.forum .ps-compact .ps-current .cp-hex { padding:8px 5px; font-size:12px; }
      `,
    },
  },
});
