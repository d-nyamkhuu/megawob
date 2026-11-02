// Design on templates/pick-color/base.js: 2008 ribbon-era paint application (picker on the left, palette table and
// details on the right, preset row beneath the picker).
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-palette-05',
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
        const compact = ctx.size.width <= 1200 || ctx.size.height <= 520;
        const width = ctx.size.width;
        const height = ctx.size.height;
        const padding = compact ? 8 : 12;
        const inspector = Math.round(width * 0.25);
        const n = ctx.spec.presets.length;
        const columns = n <= 8 ? Math.max(n, 1) : Math.ceil(n / 2);
        const rows = Math.ceil(n / columns);
        const swatchH = compact ? 24 : 42;
        const cellH = swatchH + (compact ? 18 : 24) + 6;
        const presetsH = (compact ? 22 : 30) + rows * cellH + 8;
        const leftW = width - inspector - 3 * padding;
        const hueW = compact ? 18 : 26;
        const lead = compact ? 24 : 34;
        const byHeight = height - 2 * padding - presetsH - lead - 16;
        const byWidth = leftW - 2 * (compact ? 90 : 120) - hueW - 40;
        const available = Math.floor(Math.min(byHeight, byWidth));
        const controls = base(ctx, card, Math.min(maxH, available));
        const track = parseFloat(controls.anchors[0].style.height);
        const strip = parseFloat(controls.anchors[1].style.width) || hueW;
        const col1 = track + Math.max(hueW, strip) + 58;
        const row1 = track + lead + 12;
        card.classList.add('ps-dialog');
        card.paletteLayout = { compact, width, height, padding, inspector, columns, swatchH, track, hueW };
        Object.assign(card.style, {
          position: 'absolute', display: 'grid', boxSizing: 'border-box',
          width: width + 'px', height: height + 'px', padding: padding + 'px', gap: '0',
          gridTemplateColumns: `${col1}px minmax(0,1fr) minmax(0,1fr) ${inspector}px`,
          gridTemplateRows: `${row1}px minmax(0,1fr)`,
        });
        const panelW = width - inspector - 2 * padding - 12;
        const panelH = height - 2 * padding;
        const rect = (c, w, h, x, y) => [`linear-gradient(${c},${c}) ${x}px ${y}px/${w}px ${h}px no-repeat`];
        card.style.background = [
          ...rect('#f7faff', panelW - 2, panelH - 2, padding + 1, padding + 1),
          ...rect('#b9c9de', panelW, panelH, padding, padding),
        ].join(',');
        const svHit = controls.anchors[0].parentElement;
        const hueHit = controls.anchors[1].parentElement;
        Object.assign(svHit.style, { gridColumn: '1', gridRow: '1', justifySelf: 'start', alignSelf: 'start', margin: '14px 0 0 14px' });
        Object.assign(hueHit.style, { gridColumn: '1', gridRow: '1', justifySelf: 'end', alignSelf: 'start', margin: '14px 14px 0 0' });
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
        Object.assign(grid.style, {
          gridTemplateColumns: `repeat(${L.columns}, minmax(0,1fr))`,
          gap: (L.compact ? 4 : 8) + 'px ' + (L.compact ? 6 : 12) + 'px',
        });
        const styled = new Set();
        const styleCells = () => {
          const out = [];
          const live = presetBox.querySelector('.cp-presets') || grid;
          if (live !== grid) {
            live.style.gridTemplateColumns = grid.style.gridTemplateColumns;
            live.style.gap = grid.style.gap;
          }
          for (const cell of live.children) {
            const sw = cell.querySelector('.cp-preset');
            if (!sw) continue;
            if (!styled.has(cell)) {
              styled.add(cell);
              cell.classList.add('ps-preset-cell');
              Object.assign(sw.style, { width: '100%', height: L.swatchH + 'px' });
              // The title is also visible when the template samples unnamed swatches.
              if (!cell.querySelector('.cp-preset-name')) ctx.util.el('span', 'cp-preset-name', cell, sw.title);
            }
            out.push({ name: sw.title || '', color: sw.style.backgroundColor || sw.style.background || '' });
          }
          return out;
        };
        styleCells();
        const parseColor = text => {
          let m = /^#([0-9a-f]{6})/i.exec(text.trim());
          if (m) return [0, 2, 4].map(i => parseInt(m[1].substr(i, 2), 16));
          m = /rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i.exec(text);
          return m ? [+m[1], +m[2], +m[3]] : null;
        };
        const el = ctx.util.el;
        const inspector = el('div', 'ps-inspector', side);
        el('div', 'ps-head', inspector, 'Color Palette');
        const table = el('div', 'ps-table', inspector);
        const head = el('div', 'ps-row ps-row-head', table);
        ['Name', 'Hex', 'R', 'G', 'B'].forEach(t => el('span', '', head, t));
        let built = 0;
        const buildRows = () => {
          const palette = styleCells();
          if (!palette.length || built === palette.length) return;
          Array.from(table.querySelectorAll('.ps-row:not(.ps-row-head)')).forEach(r => r.remove());
          built = palette.length;
          for (const p of palette) {
            const rgb = parseColor(p.color);
            const row = el('div', 'ps-row', table);
            const name = el('span', 'ps-name', row);
            const chip = el('i', 'ps-chip', name);
            chip.style.background = p.color;
            el('b', '', name, p.name);
            el('span', '', row, rgb ? S.M().hex(rgb) : '');
            el('span', '', row, rgb ? String(rgb[0]) : '');
            el('span', '', row, rgb ? String(rgb[1]) : '');
            el('span', '', row, rgb ? String(rgb[2]) : '');
          }
        };
        buildRows();
        new MutationObserver(buildRows).observe(presetBox, { childList: true, subtree: true });
        const details = el('div', 'ps-details', inspector);
        el('div', 'ps-head', details, 'Color Details');
        const body = el('div', 'ps-detail-body', details);
        const chip = el('div', 'ps-detail-chip', body);
        const lines = el('div', 'ps-detail-lines', body);
        const hexLine = el('div', '', lines), rgbLine = el('div', '', lines), hslLine = el('div', '', lines);
        const paint = result.paint;
        result.paint = model => {
          paint(model);
          buildRows();
          const rgb = S.M().modelRgb(model);
          chip.style.background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
          const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
          const d = mx - mn;
          const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
          hexLine.textContent = `Hex: ${S.M().hex(rgb)}`;
          rgbLine.textContent = `RGB: ${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
          hslLine.textContent = `HSL: ${Math.round(model.h)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
        };
        card.classList.toggle('ps-compact', L.compact);
        return result;
      },
      placeCard: (base, S) => (card, ctx) => {
        // Keep the template's placement draws in their original order.
        base(card, ctx);
        card.style.left = '0px';
        card.style.top = '0px';
      },
      '+0.paletteCSS': () => `
        .ribbon8 .ps-dialog { z-index:8; border:0; border-radius:0; box-shadow:none; font-family:"Segoe UI",Tahoma,Arial,sans-serif; color:#1b2430; }
        .ribbon8 .ps-panel { z-index:0; grid-column:1/4; grid-row:1/3; background:#f7faff; border:1px solid #b9c9de; border-radius:4px; margin-right:12px; }
        .ribbon8 .ps-side { display:contents; }
        .ribbon8 .ps-dialog .cp-label { margin:0 0 6px; font:600 16px "Segoe UI",Tahoma,Arial,sans-serif; letter-spacing:0; text-transform:none; color:#1b2430; }
        .ribbon8 .ps-current { grid-column:2; grid-row:1; padding:14px 6px 0 6px; display:flex; flex-direction:column; align-items:stretch; position:relative; z-index:1; min-width:0; }
        .ribbon8 .ps-reference { grid-column:3; grid-row:1; padding:14px 6px 0 6px; display:flex; flex-direction:column; align-items:stretch; position:relative; z-index:1; min-width:0; }
        .ribbon8 .ps-dialog .ps-current .cp-swatch, .ribbon8 .ps-dialog .ps-reference .cp-swatch { width:100%; max-width:150px; height:84px; }
        .ribbon8 .ps-reference .cp-code { margin-top:8px; font-size:15px; }
        .ribbon8 .ps-current .cp-fields { margin-top:8px; }
        .ribbon8 .ps-current .cp-hex { margin:6px 0 0; padding:5px 8px; border:1px solid #aab8cc; border-radius:2px; background:#fff; font-size:15px; }
        .ribbon8 .ps-palette { grid-column:1/4; grid-row:2; align-self:end; margin-right:12px; padding-bottom:12px; padding:4px 14px 0; border-top:1px solid #dbe4f0; position:relative; z-index:1; margin-top:0; }
        .ribbon8 .ps-palette .cp-label { margin:8px 0 6px; }
        .ribbon8 .ps-preset-cell { min-width:0; display:flex; flex-direction:column; align-items:stretch; gap:2px; }
        .ribbon8 .ps-preset-cell .cp-preset { flex:none; border:1px solid #6d7683; border-radius:1px; box-sizing:border-box; }
        .ribbon8 .ps-preset-cell .cp-preset-name { font:15px "Segoe UI",Tahoma,Arial,sans-serif; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#1b2430; }
        .ribbon8 .ps-inspector { grid-column:4; grid-row:1/3; align-self:stretch; height:100%; box-sizing:border-box; display:flex; flex-direction:column; min-height:0; gap:10px; font:14px "Segoe UI",Tahoma,Arial,sans-serif; color:#1b2430; position:relative; z-index:1; }
        .ribbon8 .ps-head { padding:7px 12px; font:600 17px "Segoe UI",Tahoma,Arial,sans-serif; background:linear-gradient(#e8f0fa,#d3e1f2); border:1px solid #b9c9de; border-radius:4px 4px 0 0; color:#1b2430; }
        .ribbon8 .ps-table { flex:1 1 0; min-height:0; overflow:hidden; background:#fff; border:1px solid #b9c9de; border-top:0; margin-top:-10px; padding:4px 6px; }
        .ribbon8 .ps-row { display:grid; grid-template-columns:minmax(0,1.5fr) 1.1fr .6fr .6fr .6fr; align-items:center; height:26px; font-size:14px; border-bottom:1px solid #eef2f8; }
        .ribbon8 .ps-row-head { height:24px; color:#44505f; border-bottom:1px solid #d3dbe7; font-size:13px; }
        .ribbon8 .ps-name { display:flex; align-items:center; gap:7px; min-width:0; }
        .ribbon8 .ps-name b { font-weight:400; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .ribbon8 .ps-chip { flex:none; width:18px; height:18px; border:1px solid #6d7683; box-sizing:border-box; }
        .ribbon8 .ps-details { flex:none; background:#fff; border:1px solid #b9c9de; border-radius:4px; }
        .ribbon8 .ps-details .ps-head { border:0; border-bottom:1px solid #b9c9de; }
        .ribbon8 .ps-detail-body { display:flex; gap:14px; align-items:center; padding:10px 12px 12px; }
        .ribbon8 .ps-detail-chip { flex:none; width:62px; height:56px; border:1px solid #6d7683; }
        .ribbon8 .ps-detail-lines { line-height:1.75; white-space:nowrap; font-size:14px; }
        .ribbon8.instruction-mode-panel .ps-details, .ribbon8.instruction-mode-toast .ps-details { display:none; }
        .ribbon8 .ps-compact .cp-label, .ribbon8 .ps-compact.ps-dialog .cp-label { font-size:13px; }
        .ribbon8 .ps-compact .ps-dialog .cp-swatch { height:50px; }
        .ribbon8 .ps-compact.ps-dialog .ps-current .cp-swatch, .ribbon8 .ps-compact.ps-dialog .ps-reference .cp-swatch { height:50px; }
        .ribbon8 .ps-compact .ps-preset-cell .cp-preset-name { font-size:11px; }
        .ribbon8 .ps-compact .ps-inspector { font-size:11px; gap:6px; }
        .ribbon8 .ps-compact .ps-head { padding:4px 8px; font-size:13px; }
        .ribbon8 .ps-compact .ps-row { height:19px; font-size:11px; }
        .ribbon8 .ps-compact .ps-row-head { height:18px; font-size:10px; }
        .ribbon8 .ps-compact .ps-chip { width:12px; height:12px; }
        .ribbon8 .ps-compact .ps-detail-chip { width:40px; height:40px; }
        .ribbon8 .ps-compact .ps-detail-lines { font-size:11px; line-height:1.6; }
        .ribbon8 .ps-compact .ps-detail-body { padding:6px 8px; gap:8px; }
      `,
    },
  },
});
