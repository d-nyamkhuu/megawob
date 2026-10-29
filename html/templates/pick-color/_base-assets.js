// pick-color/_base-assets: static CSS and illustration geometry for pick-color/base.
// The base template keeps its CSS, SCENE_ART and tilesArt design hooks around these defaults.
(function () {
  'use strict';
  const CSS = `
      .cp { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 1px solid var(--line);
            border-radius: 12px; background: var(--panel); box-shadow: 0 1px 3px rgba(0,0,0,.06); position: relative; }
      .cp-hit { position: relative; padding: 8px; cursor: crosshair; touch-action: none; }
      /* Own focus style: Chromium's default ring (outline: auto) on a scripted focus() disappears once any native
         control took mouse focus on the page, so episodes reset in place would differ from the first one. */
      .cp-hit:focus { outline: 2px solid var(--accent); outline-offset: -2px; border-radius: 6px; }
      .cp-sv, .cp-hue { position: relative; }
      .cp-sv-layer { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
      .cp-sv-white { background: linear-gradient(to right, #fff, rgba(255,255,255,0)); }
      .cp-sv-black { background: linear-gradient(to top, #000, rgba(0,0,0,0)); }
      .cp-hue { background: linear-gradient(to bottom, #f00 0%, #ff0 16.667%, #0f0 33.333%, #0ff 50%, #00f 66.667%, #f0f 83.333%, #f00 100%); }
      .cp-knob { position: absolute; border: 2px solid #fff; border-radius: 50%;
                 box-shadow: 0 0 0 1px rgba(0,0,0,.6), inset 0 0 0 1px rgba(0,0,0,.25); pointer-events: none; }
      .cp-bar { position: absolute; left: -5px; right: -5px; height: 8px; margin-top: -4px; border: 2px solid #fff;
                border-radius: 4px; box-shadow: 0 0 0 1px rgba(0,0,0,.6); pointer-events: none; }
      .cp-hbar { position: absolute; top: -5px; bottom: -5px; width: 8px; margin-left: -4px; border: 2px solid #fff;
                 border-radius: 4px; box-shadow: 0 0 0 1px rgba(0,0,0,.6); pointer-events: none; }
      .cp-ctl { display: flex; gap: 6px; align-items: flex-start; }
      .cp-ctl.col { flex-direction: column; align-items: center; }
      .cp-disc { position: relative; border-radius: 50%; }
      .cp-disc-layer { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; }
      .cp-ring { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border: 2px solid #fff; border-radius: 50%;
                 box-shadow: 0 0 0 1px rgba(0,0,0,.7); pointer-events: none; }
      .cp-rgb { display: flex; flex-direction: column; gap: 14px; padding: 6px 4px; }
      .cp-rgb.cols { flex-direction: row; gap: 18px; }
      .cp-row { display: flex; align-items: center; gap: 10px; }
      .cp-rgb.cols .cp-row { flex-direction: column-reverse; gap: 6px; }
      .cp-ch { width: 16px; color: var(--muted); font-weight: 700; font-size: 13px; text-align: center; }
      .cp-track { position: relative; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.15); }
      .cp-num { min-width: 34px; font: 13px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; color: var(--fg); text-align: right; }
      .cp-thumb { position: absolute; width: 14px; height: 26px; margin: -13px 0 0 -7px; border-radius: 4px;
                  background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.3); pointer-events: none; }
      .cp-rgb.cols .cp-thumb { width: 26px; height: 14px; margin: -7px 0 0 -13px; }
      .cp-side { display: flex; flex-direction: column; gap: 12px; padding: 6px 6px 6px 12px; }
      .cp-label { margin-bottom: 5px; color: var(--muted); font-size: 12px; font-weight: 600;
                  letter-spacing: .06em; text-transform: uppercase; }
      .cp-swatch { height: 60px; border: 1px solid var(--line); border-radius: 8px;
                   box-shadow: inset 0 0 0 1px rgba(255,255,255,.15); }
      .cp-swatch.small { height: 46px; }
      .cp-code { display: flex; align-items: center; justify-content: center; height: 52px; padding: 0 8px; border: 1px dashed var(--line);
                 border-radius: 8px; font: 600 17px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; letter-spacing: .02em;
                 white-space: nowrap; }
      .cp-hex { margin-top: 6px; color: var(--fg); font: 14px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; }
      .cp-hex::before { content: 'HEX'; margin-right: 8px; color: var(--muted); font-size: 11px; }
      .cp-fields { display: flex; flex-direction: column; gap: 8px; }
      .cp-frow { display: flex; align-items: center; gap: 6px; }
      .cp-flab { color: var(--muted); font-size: 12px; font-weight: 600; min-width: 26px; }
      .cp-in { box-sizing: border-box; height: 30px; padding: 0 8px; border: 1px solid var(--line); border-radius: 6px;
               background: var(--bg); color: var(--fg); font: 14px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; }
      .cp-in:focus { outline: 2px solid var(--accent); outline-offset: 0; }
      .cp-in.hex { width: 100%; }
      .cp-in.ch { flex: 1 1 0; width: 0; min-width: 0; text-align: center; }
      .cp-presets { display: grid; gap: 6px; }
      .cp-preset { position: relative; border-radius: 6px; border: 1px solid rgba(0,0,0,.18); cursor: pointer; }
      .cp-preset.on { outline: 2px solid var(--accent); outline-offset: 2px; }
      .cp-preset-name { display: block; margin-top: 2px; font-size: 10px; color: var(--muted); text-align: center;
                        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .cp-img { display: block; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
      .cp-img.picking { cursor: crosshair; }
      .cp-img .pin { pointer-events: none; }
      .cp-tool { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid var(--line);
                 border-radius: 6px; background: var(--bg); color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; }
      .cp-tool.on { background: var(--accent); border-color: var(--accent); color: #fff; }

      .cp-vanilla { position: relative; }
      .cp-vanilla .picker_wrapper { margin: 0; }
      .cp.pop { align-items: flex-start; }
      .pp-host { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 6px 4px; min-width: 250px; }
      .pp-title { color: var(--muted); font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
      .pp-trigger { display: flex; align-items: center; gap: 10px; align-self: flex-start; padding: 5px 12px 5px 5px; border: 1px solid var(--line);
                    border-radius: 8px; background: var(--bg); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
      .pp-trigger[aria-expanded="true"] { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent); }
      .pp-chip { width: 30px; height: 30px; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.25); }
      .pp-caret { width: 0; height: 0; border: 5px solid transparent; border-top-color: var(--muted); margin-top: 5px; }
      .pp-line { height: 30px; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); color: var(--muted);
                 font-size: 13px; line-height: 28px; padding: 0 10px; width: 210px; }
      .pp-pop { position: absolute; z-index: 5; display: flex; flex-direction: column; gap: 8px; padding: 12px; visibility: hidden;
                border: 1px solid var(--line); border-radius: 10px; background: var(--panel); box-shadow: 0 10px 30px rgba(0,0,0,.28); }
      .pp-pop.open { visibility: visible; }
      .pp-ctl { display: flex; gap: 4px; }
      .cp-alpha { position: relative; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.15);
                  background-color: #fff; background-image: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%),
                    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%); background-size: 10px 10px; background-position: 0 0, 5px 5px; }
      .cp-alpha-fill { position: absolute; inset: 0; border-radius: inherit; }
      `;
  const SCENE_ART = {
        house: {
          pick: { sky: [100, 14], sun: [30, 24], grass: [20, 128], wall: [74, 100], roof: [100, 56], door: [100, 98],
            window: [120, 79], trunk: [170, 101], crown: [170, 70] },
          draw(add) {
            add('rect', 'sky', { x: 0, y: 0, width: 200, height: 140 });
            add('circle', 'sun', { cx: 30, cy: 24, r: 13 });
            add('rect', 'grass', { x: 0, y: 106, width: 200, height: 34 });
            add('rect', 'wall', { x: 64, y: 64, width: 72, height: 46 });
            add('polygon', 'roof', { points: '56,66 100,36 144,66' });
            add('rect', 'door', { x: 92, y: 84, width: 16, height: 26 });
            add('rect', 'window', { x: 113, y: 72, width: 15, height: 14 });
            add('rect', 'trunk', { x: 166, y: 88, width: 8, height: 22 });
            add('circle', 'crown', { cx: 170, cy: 74, r: 18 });
          },
        },
        landscape: {
          pick: { sky: [100, 10], sun: [152, 28], mountain: [64, 66], hill: [168, 82], field: [30, 101], lake: [40, 129],
            hull: [140, 122], sail: [146, 110] },
          draw(add) {
            add('rect', 'sky', { x: 0, y: 0, width: 200, height: 140 });
            add('circle', 'sun', { cx: 152, cy: 28, r: 12 });
            add('polygon', 'mountain', { points: '0,92 66,30 132,92' });
            add('polygon', 'hill', { points: '96,92 150,58 200,68 200,92' });
            add('rect', 'field', { x: 0, y: 92, width: 200, height: 18 });
            add('rect', 'lake', { x: 0, y: 110, width: 200, height: 30 });
            add('polygon', 'sail', { points: '141,96 141,116 160,116' });
            add('polygon', 'hull', { points: '120,117 162,117 155,127 127,127' });
          },
        },
        still: {
          pick: { wall: [180, 14], table: [15, 130], vase: [25, 76], plate: [40, 100], apple: [62, 84], mug: [112, 86],
            book: [165, 90] },
          draw(add) {
            add('rect', 'wall', { x: 0, y: 0, width: 200, height: 140 });
            add('rect', 'table', { x: 0, y: 96, width: 200, height: 44 });
            add('polygon', 'vase', { points: '18,96 32,96 36,72 29,56 21,56 14,72' });
            add('ellipse', 'plate', { cx: 62, cy: 99, rx: 30, ry: 7 });
            add('circle', 'apple', { cx: 62, cy: 86, r: 10 });
            add('path', 'mug', { d: 'M126,78 h6 a8,8 0 0 1 0,16 h-6 v-4 h6 a4,4 0 0 0 0,-8 h-6 z M98,70 h28 v30 h-28 z' });
            add('rect', 'book', { x: 140, y: 84, width: 46, height: 12 });
          },
        },
      };

  function tilesArt(rows, cols) {
    const pick = {};
    const gap = 3;
    const w = (200 - gap * (cols + 1)) / cols;
    const h = (140 - gap * (rows + 1)) / rows;
    const cells = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const x = gap + (c - 1) * (w + gap);
        const y = gap + (r - 1) * (h + gap);
        pick[`t${r}-${c}`] = [x + w / 2, y + h / 2];
        cells.push([`t${r}-${c}`, x, y]);
      }
    }
    return {
      pick,
      draw(add) {
        add('rect', null, { x: 0, y: 0, width: 200, height: 140, fill: 'var(--line)' });
        for (const [id, x, y] of cells) add('rect', id, { x, y, width: w, height: h, rx: 2 });
      },
    };
  }

  env.template('pick-color/_base-assets', () => ({ CSS, SCENE_ART, tilesArt }));
})();
