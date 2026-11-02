// Design on templates/pick-color/base.js: the base site's pick-color widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-hex-typed-05',
  name: 'design',
  split: 'train',
  scenarios: ['hex-typed'],
  template: 'pick-color/base',
  design: {
    parts: {
      'ensureStyle': (base, S) => function () {
        S.env.util.css('cpk-style', S.CSS);
        if (document.getElementById('aqua-picker-design')) return;
        const style = document.createElement('style');
        style.id = 'aqua-picker-design';
        style.textContent = `
        .design.aqua .stage .aqua-picker {
          box-sizing:border-box; width:100%; height:100%; padding:0 0 0 20px;
          display:grid; grid-template-columns:var(--target-w) var(--square) var(--strip-w) minmax(0,1fr);
          gap:var(--picker-gap); align-items:center; border:0; border-radius:0;
          background:transparent; box-shadow:none; isolation:isolate;
        }
        .aqua-picker::before { content:''; position:absolute; z-index:-1;
          inset:7% calc(var(--inspector-w) + 12px) 7% 5px;
          border:1px solid #c0cbd5; border-radius:14px;
          background:linear-gradient(135deg,#f9fbfd,#eef3f7); box-shadow:0 1px 2px #71869a44; }
        .aqua-picker .cp-side { display:contents; }
        .aqua-picker .cp-target-card { grid-column:1; grid-row:1; align-self:center;
          box-sizing:border-box; padding:14px; border:1px solid #d0dbe4; border-radius:12px;
          background:linear-gradient(#f2f6f9,#eaf0f5); }
        .aqua-picker .cp-label { margin:0 0 14px; font:600 20px Arial,sans-serif;
          letter-spacing:0; text-transform:none; color:#172638; }
        .aqua-picker .cp-target-swatch { height:var(--target-swatch); margin-bottom:16px;
          border:1px solid #455747; border-radius:3px; }
        .aqua-picker .cp-code { height:auto; padding:0; display:block; border:0;
          font:24px Arial,sans-serif; letter-spacing:0; }
        .aqua-picker .cp-hit { padding:0; }
        .aqua-picker .cp-hit[data-role="sv"] { grid-column:2; grid-row:1; }
        .aqua-picker .cp-hit[data-role="hue"] { grid-column:3; grid-row:1; }
        .aqua-picker .cp-sv { border:1px solid #35424b; }
        .aqua-picker .cp-hue { border:1px solid #566471; }
        .aqua-picker .cp-inspector { grid-column:4; grid-row:1; align-self:stretch;
          box-sizing:border-box; min-width:0; padding:0 18px 18px;
          background:linear-gradient(#e8eff6,#e1e9f1); border-left:1px solid #aabac9; }
        .aqua-picker .cp-inspector-title { margin:0 -18px 12px; padding:10px 16px;
          border-bottom:1px solid #aabac9; font-size:20px; font-weight:600; }
        .aqua-picker .cp-current-card .cp-label { font-weight:400; }
        .aqua-picker .cp-current-card .cp-swatch { height:var(--preview-h);
          border:1px solid #8094a0; border-radius:4px; }
        .aqua-picker .cp-fields { margin-top:14px; padding-top:12px; border-top:1px solid #aabac9; gap:8px; }
        .aqua-picker .cp-fields::before { content:'Color Values'; font-size:19px; margin-bottom:5px; }
        .aqua-picker .cp-frow { gap:6px; }
        .aqua-picker .cp-flab { font-size:16px; font-weight:400; min-width:25px; }
        .aqua-picker .cp-in { height:36px; border:1px solid #aab9c7; border-radius:3px;
          background:#fff; font:17px Arial,sans-serif; }
        .aqua-picker .cp-in.ch { flex:1 1 0; }
        `;
        document.head.append(style);
      },
      'buildPicker': (base, S) => function (ctx, card, maxH) {
        // Budget all four columns from the stage, including its inspector.
        const w = ctx.size.width, h = ctx.size.height;
        const inspector = Math.min(345, Math.max(185, w * .27));
        const target = Math.min(270, Math.max(130, w * .21));
        const gap = w < 850 ? 12 : 24;
        const square = Math.floor(Math.min(maxH, h - 110, w - inspector - target - 30 - 3 * gap - 20));
        card.classList.add('aqua-picker');
        card.style.setProperty('--target-w', target + 'px');
        card.style.setProperty('--inspector-w', inspector + 'px');
        card.style.setProperty('--picker-gap', gap + 'px');
        card.style.setProperty('--target-swatch', Math.min(235, target - 30, h - 180) + 'px');
        card.style.setProperty('--preview-h', Math.min(96, h * .2) + 'px');
        const controls = base(ctx, card, square);
        card.style.setProperty('--square', controls.anchors[0].style.width);
        card.style.setProperty('--strip-w', controls.anchors[1].style.width);
        return controls;
      },
      'placeCard': (base, S) => function (card, ctx) {
        base(card, ctx);
        card.style.left = '0px';
        card.style.top = '0px';
      },
      'buildSide': (base, S) => function buildSide(ctx, parent, width, o = {}) {
        const { M, SCENE_ART, commit, commitRgb, env, tilesArt } = S;
        const { util, spec, rng } = ctx;
        const math = M();
        const side = util.el('div', 'cp-side', parent);
        side.style.width = width + 'px';
        const out = { anchors: [], locators: {} };

        const v = spec.scenario;
        // Judge episodes (ambiguous / impossible) name their colors in the goal text; the stand-in goal's card stays hidden.
        const showTarget = !spec.judge && (v === 'swatch' || (v === 'palette' && spec.ref === 'swatch'));
        const showCode = !spec.judge && (v === 'hex-typed' || (v === 'hex' ? spec.showCode : v === 'palette' && spec.ref === 'hex'));
        if (showTarget || showCode) {
          const t = util.el('div', '', side);
          t.classList.add('cp-target-card');
          util.el('div', 'cp-label', t, v === 'hex-typed' ? 'Target Color:' : spec.targetLabel);
          if (showTarget) util.el('div', 'cp-swatch', t).style.background = spec.hex;
          else {
            if (v === 'hex-typed') util.el('div', 'cp-swatch cp-target-swatch', t).style.background = spec.hex;
            util.el('div', 'cp-code', t, v === 'hex-typed' ? spec.hex : spec.code);
          }
        }

        // Presets (palette).
        let presets = [];
        if (v === 'palette') {
          const box = util.el('div', '', side);
          util.el('div', 'cp-label', box, rng.pick(['Presets', 'Palette', 'Swatches', 'Saved colors']));
          const grid = util.el('div', 'cp-presets', box);
          const n = spec.presets.length;
          const cols = n > 12 ? 6 : n > 8 ? 5 : 4;
          const size = Math.floor((width - 18 - (cols - 1) * 6) / cols);
          const named = rng.bool(0.5) && n <= 12;
          grid.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
          presets = spec.presets.map((p, i) => {
            const cell = util.el('div', '', grid);
            const sw = util.el('div', 'cp-preset', cell);
            Object.assign(sw.style, { width: size + 'px', height: Math.round(size * 0.8) + 'px', background: p.hex });
            sw.title = p.name;
            if (named) util.el('span', 'cp-preset-name', cell, p.name);
            sw.addEventListener('click', () => {
              ctx.log('preset', { i, name: p.name });
              commitRgb(math.fromHex(p.hex), { preset: i });
            });
            return sw;
          });
          out.anchors.push(grid);
          out.locators.preset = (i) => util.center(presets[i]);
        }

        // Illustration with an optional eyedropper (image).
        let svg = null;
        let tool = null;
        if (v === 'image') {
          const sc = spec.scene;
          const art = sc.kind === 'tiles' ? tilesArt(sc.rows, sc.cols) : SCENE_ART[sc.kind];
          const box = util.el('div', '', side);
          util.el('div', 'cp-label', box, rng.pick(['Image', 'Picture', 'Reference image', 'Photo']));
          const W = width - 18;
          const H = Math.round(W * 0.7);
          svg = util.svg('svg', { class: 'cp-img', width: W, height: H, viewBox: '0 0 200 140', preserveAspectRatio: 'none' }, box);
          svg.dataset.role = 'image';
          const fillOf = Object.fromEntries(sc.regions.map((r) => [r.id, r.hex]));
          art.draw((tag, id, attrs) => {
            const el = util.svg(tag, { ...attrs }, svg);
            if (id) {
              el.setAttribute('fill', fillOf[id]);
              el.dataset.region = id;
            } else if (attrs.fill) el.style.fill = attrs.fill;
            return el;
          });
          if (sc.mark === 'pin' && !spec.judge) {
            const [px, py] = art.pick[sc.target];
            const g = util.svg('g', { class: 'pin', transform: `translate(${px},${py})` }, svg);
            util.svg('path', { d: 'M0,0 C-2,-6 -7,-9 -7,-14 a7,7 0 1 1 14,0 C7,-9 2,-6 0,0 Z', fill: '#e8590c', stroke: '#fff', 'stroke-width': 1.5 }, g);
            util.svg('circle', { cx: 0, cy: -14, r: 2.6, fill: '#fff' }, g);
          }
          svg.addEventListener('click', (e) => {
            const m = ctx.model;
            if (!m.picking) return;
            const el = e.target.closest && e.target.closest('[data-region]');
            if (!el) return;
            const r = sc.regions.find((x) => x.id === el.dataset.region);
            ctx.log('eyedropper', { region: r.id });
            commitRgb(math.fromHex(r.hex), { picking: false });
          });
          out.anchors.push(svg);
          const toPx = (p) => {
            const b = svg.getBoundingClientRect();
            return [b.left + (p[0] / 200) * b.width, b.top + (p[1] / 140) * b.height];
          };
          out.locators.region = (id) => toPx(art.pick[id]);
          if (spec.eyedropper) {
            tool = util.el('button', 'cp-tool', box);
            tool.type = 'button';
            tool.style.marginTop = '8px';
            tool.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M9.5 1.5l3 3-1.6 1.6-0.8-0.8-5.6 5.6-2.6 0.8 0.8-2.6 5.6-5.6-0.8-0.8z" fill="currentColor"/></svg>';
            tool.append(rng.pick(['Eyedropper', 'Pick from image', 'Sample color']));
            tool.addEventListener('click', () => commit({ picking: !ctx.model.picking }));
            out.locators.tool = () => util.center(tool);
          }
        }

        // Current color + readout or editable hex field.
        const inspector = v === 'hex-typed' ? util.el('div', 'cp-inspector', side) : side;
        if (v === 'hex-typed') util.el('div', 'cp-inspector-title', inspector, 'Color Properties');
        const values = v === 'hex-typed' ? util.el('div', 'cp-values', side) : null;
        if (values) util.el('div', 'cp-values-title', values, 'Color Values:');
        const cur = util.el('div', '', o.curHost || inspector);
        cur.classList.add('cp-current-card');
        util.el('div', 'cp-label', cur, rng.pick(['Current', 'Selected', 'New color', 'Preview']));
        const current = util.el('div', v === 'image' || v === 'palette' ? 'cp-swatch small' : 'cp-swatch', cur);
        const fields = {};
        const fieldMode = spec.fields;
        let readout = null;
        // Always shown without typed fields: the task's facts() reports this hex code. (The draw stays for the 50% case so
        // later layout draws of an episode are as before.)
        if (!fieldMode) { if (v !== 'hex') rng.bool(0.5); readout = util.el('div', 'cp-hex', cur); }

        function bindField(input, key, accept, maxLength) {
          const h = env.ui.textField(input, {
            value: '',
            accept,
            maxLength,
            label: key,
            onInput(val) {
              if (key === 'hex') {
                const rgb = math.parseColor(val);
                if (rgb) commitRgb(rgb);
                return;
              }
              if (!/^\d{1,3}$/.test(val) || Number(val) > 255) return;
              const c = math.channels(ctx.model);
              c['rgb'.indexOf(key)] = Number(val);
              commitRgb(c);
            },
          });
          fields[key] = { el: input, h };
        }
        if (fieldMode) {
          const box = util.el('div', 'cp-fields', v === 'hex-typed' && !o.curHost ? values : cur);
          if (v !== 'hex-typed' || o.curHost) box.style.marginTop = '6px';
          if (fieldMode === 'hex' || fieldMode === 'both') {
            const row = util.el('div', v === 'hex-typed' ? 'cp-frow cp-typed-hex' : 'cp-frow', v === 'hex-typed' ? inspector : box);
            const pickedLabel = rng.pick(['Hex', 'HEX', '#']);
            util.el('span', 'cp-flab', row, v === 'hex-typed' ? 'Hex:' : pickedLabel);
            const input = util.el('input', 'cp-in hex', row);
            input.spellcheck = false;
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('aria-label', 'Hex color');
            bindField(input, 'hex', /[#0-9a-fA-F]/, 7);
          }
          if (fieldMode === 'rgb' || fieldMode === 'both') {
            const row = util.el('div', 'cp-frow', box);
            for (const k of 'rgb') {
              util.el('span', 'cp-flab', row, k.toUpperCase()).style.minWidth = '12px';
              const spin = util.el('span', 'cp-rgb-spin', row);
              const input = util.el('input', 'cp-in ch', spin);
              input.setAttribute('inputmode', 'numeric');
              input.setAttribute('autocomplete', 'off');
              input.setAttribute('aria-label', k.toUpperCase());
              bindField(input, k, /\d/, 3);
              const arrows = util.el('span', 'cp-rgb-arrows', spin);
              for (const [delta, glyph] of [[1, '▲'], [-1, '▼']]) {
                const button = util.el('button', 'cp-rgb-arrow', arrows, glyph);
                button.type = 'button';
                button.setAttribute('aria-label', (delta > 0 ? 'Increase ' : 'Decrease ') + k.toUpperCase());
                button.addEventListener('click', () => {
                  const channels = math.channels(ctx.model);
                  channels['rgb'.indexOf(k)] = Math.max(0, Math.min(255, channels['rgb'.indexOf(k)] + delta));
                  commitRgb(channels);
                });
              }
            }
          }
          out.anchors.push(box);
          out.locators.field = (k) => util.center(fields[k].el);
        }

        if (v === 'hex-typed' && fieldMode !== 'hex' && fieldMode !== 'both') {
          const row = util.el('div', 'cp-frow cp-typed-hex', inspector);
          util.el('span', 'cp-flab', row, 'Hex:');
          const input = util.el('input', 'cp-in hex', row);
          input.spellcheck = false;
          input.setAttribute('autocomplete', 'off');
          input.setAttribute('aria-label', 'Hex color');
          bindField(input, 'hex', /[#0-9a-fA-F]/, 7);
          out.anchors.push(row);
          out.locators.field = (k) => util.center(fields[k].el);
        }

        // Native HSV numeric readouts accompany the editable RGB and hex fields.
        const hsvBox = v === 'hex-typed' ? util.el('div', 'cp-hsv', values) : null;
        const hsvInputs = {};
        if (hsvBox) for (const [k, label] of [['h', 'H:'], ['s', 'S:'], ['v', 'V:']]) {
          const row = util.el('div', 'cp-hsv-row', hsvBox);
          util.el('span', 'cp-hsv-label', row, label);
          const spin = util.el('div', 'cp-hsv-spin', row);
          const input = util.el('input', 'cp-hsv-input', spin);
          input.type = 'text';
          input.inputMode = 'numeric';
          input.setAttribute('aria-label', label.slice(0, 1) + ' value');
          hsvInputs[k] = input;
          const applyHsv = () => {
            const h = Math.max(0, Math.min(359, Number(hsvInputs.h.value) || 0));
            const s = Math.max(0, Math.min(100, Number(hsvInputs.s.value) || 0)) / 100;
            const val = Math.max(0, Math.min(100, Number(hsvInputs.v.value) || 0)) / 100;
            const chroma = val * s, x = chroma * (1 - Math.abs((h / 60) % 2 - 1)), m = val - chroma;
            const parts = h < 60 ? [chroma, x, 0] : h < 120 ? [x, chroma, 0] : h < 180 ? [0, chroma, x] : h < 240 ? [0, x, chroma] : h < 300 ? [x, 0, chroma] : [chroma, 0, x];
            commitRgb(parts.map(n => Math.round((n + m) * 255)));
          };
          input.addEventListener('change', applyHsv);
          input.addEventListener('keydown', e => { if (e.key === 'Enter') { applyHsv(); input.blur(); } });
          const arrows = util.el('div', 'cp-hsv-arrows', spin);
          for (const [delta, glyph] of [[1, '▲'], [-1, '▼']]) {
            const button = util.el('button', 'cp-hsv-arrow', arrows, glyph);
            button.type = 'button';
            button.setAttribute('aria-label', (delta > 0 ? 'Increase ' : 'Decrease ') + label.slice(0, 1));
            button.addEventListener('click', () => {
              const max = k === 'h' ? 359 : 100;
              input.value = String(Math.max(0, Math.min(max, (Number(input.value) || 0) + delta)));
              applyHsv();
            });
          }
          if (k !== 'h') util.el('span', 'cp-hsv-unit', row, '%');
        }

        out.paint = (m) => {
          const rgb = math.modelRgb(m);
          const code = math.hex(rgb);
          current.style.background = code;
          if (readout) readout.textContent = code;
          const active = document.activeElement;
          if (fields.hex && active !== fields.hex.el) fields.hex.h.set(code);
          for (const k of 'rgb') if (fields[k] && active !== fields[k].el) fields[k].h.set(String(rgb['rgb'.indexOf(k)]));
          if (hsvBox) {
            const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
            const hi = Math.max(r, g, b), lo = Math.min(r, g, b), d = hi - lo;
            let hue = 0;
            if (d) hue = hi === r ? ((g - b) / d) % 6 : hi === g ? (b - r) / d + 2 : (r - g) / d + 4;
            hue = Math.round((hue * 60 + 360) % 360);
            if (document.activeElement !== hsvInputs.h) hsvInputs.h.value = String(hue);
            if (document.activeElement !== hsvInputs.s) hsvInputs.s.value = String(hi ? Math.round(d / hi * 100) : 0);
            if (document.activeElement !== hsvInputs.v) hsvInputs.v.value = String(Math.round(hi * 100));
          }
          presets.forEach((p, i) => p.classList.toggle('on', m.preset === i));
          if (tool) tool.classList.toggle('on', !!m.picking);
          if (svg) svg.classList.toggle('picking', !!m.picking);
        };
        return out;
      },
    },
  },
});
