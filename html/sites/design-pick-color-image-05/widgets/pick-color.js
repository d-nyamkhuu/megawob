// Design on templates/pick-color/base.js: the base site's pick-color widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-image-05',
  name: 'design',
  split: 'train',
  scenarios: ['image'],
  template: 'pick-color/base',
  design: {
    parts: {
      // The studio stretches the picker to its grid cell. Use that same geometry
      // for input, marker placement and the template's oracle locators.
      'buildPicker': (base, S) => function buildPicker(ctx, card, maxH) {
        const { rng, util, spec } = ctx;
        const size = Math.max(S.F().helpers.MIN_TRACK_PX, Math.min(rng.int(230, 320), maxH));
        const radius = rng.pick([2, 4, 6]);
        const stripW = rng.int(20, 30);
        const knob = rng.int(12, 16);
        const svHit = util.el('div', 'cp-hit', card);
        svHit.dataset.role = 'sv';
        const sv = util.el('div', 'cp-sv', svHit);
        Object.assign(sv.style, { width: size + 'px', height: size + 'px', borderRadius: radius + 'px' });
        util.el('div', 'cp-sv-layer cp-sv-white', sv);
        util.el('div', 'cp-sv-layer cp-sv-black', sv);
        const marker = util.el('div', 'cp-knob', sv);
        Object.assign(marker.style, { width: knob + 'px', height: knob + 'px', margin: `${-knob / 2}px 0 0 ${-knob / 2}px` });
        const hueHit = util.el('div', 'cp-hit', card);
        hueHit.dataset.role = 'hue';
        const hue = util.el('div', 'cp-hue', hueHit);
        Object.assign(hue.style, { width: stripW + 'px', height: size + 'px', borderRadius: Math.min(radius, 4) + 'px' });
        const bar = util.el('div', 'cp-bar', hue);
        const rect = () => {
          const r = sv.getBoundingClientRect();
          return { left: r.left, top: r.top, width: r.width - 1, height: r.height - 1 };
        };
        const pad = S.env.ui.pad(svHit, {
          label: 'sv', rect, value: [ctx.model.s, 1 - ctx.model.v],
          onInput([s, y]) { S.commit({ s, v: 1 - y }); },
        });
        const slider = S.env.ui.slider(hueHit, {
          label: 'hue', thumbs: [bar], values: [ctx.model.h], min: 0, max: 360, keyboard: !!spec.keys,
          geometry() {
            const r = hue.getBoundingClientRect();
            const x = r.left + r.width / 2;
            return { start: [x, r.top], end: [x, r.bottom - 1] };
          },
          place(el, point, f) { el.style.top = f * (hue.getBoundingClientRect().height - 1) + 'px'; },
          onInput([h]) { S.commit({ h }); },
        });
        const wheel = util.el('div', 'cp-wheel', card);
        wheel.setAttribute('aria-label', 'Hue wheel');
        const wheelMarker = util.el('div', 'cp-wheel-marker', wheel);
        const wheelRect = () => {
          const b = wheel.getBoundingClientRect();
          return { left: b.left, top: b.top, width: b.width - 1, height: b.height - 1 };
        };
        const wheelPad = S.env.ui.pad(wheel, {
          label: 'color wheel', rect: wheelRect, value: [.5, .1],
          onInput([x, y]) { S.commit({ h: (Math.atan2(x - .5, .5 - y) * 180 / Math.PI + 360) % 360 }); },
        });
        const lightHit = util.el('div', 'cp-light-hit', card);
        const light = util.el('div', 'cp-light', lightHit);
        const lightBar = util.el('div', 'cp-bar', light);
        const lightSlider = S.env.ui.slider(lightHit, {
          label: 'brightness', thumbs: [lightBar], values: [1 - ctx.model.v], min: 0, max: 1, keyboard: !!spec.keys,
          geometry() { const b = light.getBoundingClientRect(); return { start: [b.left + b.width / 2, b.top], end: [b.left + b.width / 2, b.bottom - 1] }; },
          place(el, point, f) { el.style.top = f * (light.getBoundingClientRect().height - 1) + 'px'; },
          onInput([v]) { S.commit({ v: 1 - v }); },
        });
        return {
          anchors: [sv, hue],
          paint(m) {
            sv.style.backgroundColor = `hsl(${m.h} 100% 50%)`;
            const r = rect();
            Object.assign(marker.style, { left: m.s * r.width + 'px', top: (1 - m.v) * r.height + 'px' });
            pad.set([m.s, 1 - m.v]);
            slider.set([m.h]);
            const angle = m.h * Math.PI / 180;
            const wx = .5 + Math.sin(angle) * .39, wy = .5 - Math.cos(angle) * .39;
            wheelMarker.style.left = wx * 100 + '%';
            wheelMarker.style.top = wy * 100 + '%';
            wheelPad.set([wx, wy]);
            lightSlider.set([1 - m.v]);
          },
          locate(t, m) {
            if (t.surface === 'sv') return pad.locate(t.current ? [m.s, 1 - m.v] : [t.s, 1 - t.v]);
            if (t.surface === 'hue') return slider.locate(t.current ? m.h : t.h);
            return null;
          },
        };
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
        const showCode = !spec.judge && ((v === 'hex' || v === 'hex-typed') ? spec.showCode : v === 'palette' && spec.ref === 'hex');
        if (showTarget || showCode) {
          const t = util.el('div', '', side);
          util.el('div', 'cp-label', t, spec.targetLabel);
          if (showTarget) util.el('div', 'cp-swatch', t).style.background = spec.hex;
          else util.el('div', 'cp-code', t, spec.code);
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
          const tiles = sc.kind === 'tiles';
          const scenePick = Object.fromEntries(sc.regions.map((region) => {
            const p = art.pick[region.id];
            return [region.id, tiles ? [10 + p[0] * .82, 96 + p[1] * .23] : p];
          }));
          {
            const photo = util.svg('image', { href: 'sites/design-pick-color-image-05/assets/lighthouse.png', x: 0, y: 0, width: 200, height: 140, preserveAspectRatio: 'none' }, svg);
            photo.setAttribute('pointer-events', 'none');
          }
          art.draw((tag, id, attrs) => {
            const el = util.svg(tag, { ...attrs }, svg);
            if (id) {
              el.setAttribute('fill', 'transparent');
              el.setAttribute('stroke', 'transparent');
              el.setAttribute('pointer-events', 'all');
              el.dataset.region = id;
            } else { el.style.opacity = '0'; el.setAttribute('pointer-events', 'none'); }
            return el;
          });
          // Painted color samples remain at the scene's original hit coordinates.
          // Their solid centers preserve each seeded color within the illustration.
          for (const region of sc.regions) {
            const p = scenePick[region.id];
            if (!p) continue;
            const [x, y] = p;
            const rock = util.svg('path', { d: `M${x-2},${y+2} L${x-2.3},${y-.7} L${x-1.2},${y-2.7} L${x+1.1},${y-2.5} L${x+2.2},${y-.4} L${x+1.8},${y+2.2} Z`, fill: region.hex, 'data-region': region.id }, svg);
            rock.setAttribute('stroke', '#000');
            rock.setAttribute('stroke-opacity', '.15');
            rock.setAttribute('stroke-width', '.2');
            util.svg('path', { d: `M${x-2.3},${y-.7} L${x-1.2},${y-2.7} L${x+1.1},${y-2.5} L${x+.6},${y-1.4} L${x-1.3},${y-1.2} Z`, fill: '#fff', opacity: '.25', 'pointer-events': 'none' }, svg);
            util.svg('path', { d: `M${x-2},${y+2} L${x+1.8},${y+2.2} L${x+2.2},${y-.4} L${x+1.1},${y+1} Z`, fill: '#000', opacity: '.25', 'pointer-events': 'none' }, svg);
          }
          if (sc.mark === 'pin' && !spec.judge) {
            const [px, py] = scenePick[sc.target];
            const g = util.svg('svg', { class: 'pin', x: px-3, y: py-14, width: 6, height: 15, viewBox: '-10 -25 20 30', preserveAspectRatio: 'none', overflow: 'visible', 'pointer-events': 'none' }, svg);
            util.svg('path', { d: 'M0,0 L-3,-9 A9,9 0 1 1 3,-9 Z', fill: '#f5f1df', stroke: '#151515', 'stroke-width': 1.5 }, g);
            util.svg('circle', { cx: 0, cy: -17, r: 6.5, fill: '#ee0805', stroke: '#fff', 'stroke-width': 1.3 }, g);
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
          out.locators.region = (id) => toPx(scenePick[id]);
          if (spec.eyedropper) {
            tool = util.el('button', 'cp-tool', box);
            tool.type = 'button';
            tool.style.marginTop = '8px';
            tool.innerHTML = '<svg width="40" height="40" viewBox="0 0 40 40"><path d="M25 13 8 30l-1 4 4-1 17-17" fill="#dedbd0" stroke="#111" stroke-width="2.2"/><path d="m20 12 4-4 3 2 5-6c4-3 8 2 5 5l-6 5 2 3-4 4z" fill="#454545" stroke="#111" stroke-width="1.7"/><path d="m8 30 3 3" stroke="#111" stroke-width="2"/></svg>';
            tool.append(rng.pick(['Eyedropper', 'Pick from image', 'Sample color']));
            tool.addEventListener('click', () => commit({ picking: !ctx.model.picking }));
            out.locators.tool = () => util.center(tool);
          }
        }

        // Current color + readout or editable hex field.
        const cur = util.el('div', '', o.curHost || side);
        util.el('div', 'cp-label', cur, rng.pick(['Current', 'Selected', 'New color', 'Preview']));
        cur.classList.add('cp-selected');
        if (v === 'image') cur.querySelector('.cp-label').textContent = 'Selected Color';
        const current = util.el('div', v === 'image' || v === 'palette' ? 'cp-swatch small' : 'cp-swatch', cur);
        const fields = {};
        const fieldMode = spec.fields;
        let readout = null;
        // Always shown without typed fields: the task's facts() reports this hex code. (The draw stays for the 50% case so
        // later layout draws of an episode are as before.)
        let rgbReadout = null;
        if (!fieldMode) { if (v !== 'hex') rng.bool(0.5); readout = util.el('div', 'cp-hex', cur); if (v === 'image') rgbReadout = util.el('div', 'cp-rgb-readout', cur); }
        const values = util.el('div', 'cp-values', cur);
        const displayFields = {};
        for (const k of ['Hex', 'R', 'G', 'B']) {
          const row = util.el('div', 'cp-value-row', values);
          util.el('span', '', row, k + ':');
          displayFields[k] = util.el('span', 'cp-value', row);
        }
        if (tool) { tool.classList.add('cp-eyedropper'); cur.append(tool); }

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
          const box = util.el('div', 'cp-fields', v === 'hex-typed' && !o.curHost ? side : cur);
          if (v !== 'hex-typed' || o.curHost) box.style.marginTop = '6px';
          if (fieldMode === 'hex' || fieldMode === 'both') {
            const row = util.el('div', 'cp-frow', box);
            util.el('span', 'cp-flab', row, rng.pick(['Hex', 'HEX', '#']));
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
              const input = util.el('input', 'cp-in ch', row);
              input.setAttribute('inputmode', 'numeric');
              input.setAttribute('autocomplete', 'off');
              input.setAttribute('aria-label', k.toUpperCase());
              bindField(input, k, /\d/, 3);
            }
          }
          out.anchors.push(box);
          out.locators.field = (k) => util.center(fields[k].el);
        }
        cur.append(values);

        out.paint = (m) => {
          const rgb = math.modelRgb(m);
          const code = math.hex(rgb);
          displayFields.Hex.textContent = code;
          for (const [i, k] of ['R', 'G', 'B'].entries()) displayFields[k].textContent = rgb[i];
          const lightness = m.v * (1 - m.s / 2);
          const saturation = lightness === 0 || lightness === 1 ? 0 : (m.v - lightness) / Math.min(lightness, 1 - lightness);
          const colorNames = { '#4682b4': 'Steel Blue', '#000000': 'Black', '#ffffff': 'White', '#ff0000': 'Red', '#008000': 'Green', '#0000ff': 'Blue', '#ffa500': 'Orange', '#800080': 'Purple', '#ffc0cb': 'Pink', '#ffff00': 'Yellow', '#808080': 'Gray', '#00ffff': 'Cyan', '#a52a2a': 'Brown', '#008080': 'Teal', '#000080': 'Navy', '#c0c0c0': 'Silver', '#800000': 'Maroon', '#f0e68c': 'Khaki' };
          let name = 'Custom Color', distance = Infinity;
          for (const [hex, label] of Object.entries(colorNames)) {
            const c = math.fromHex(hex);
            const d = c.reduce((sum, value, i) => sum + (value - rgb[i]) ** 2, 0);
            if (d < distance) { name = label; distance = d; }
          }
          const inspector = document.querySelector('.insp-sheet');
          if (inspector) {
            const data = { name, hex: code, rgb: `R: ${rgb[0]}    G: ${rgb[1]}    B: ${rgb[2]}`, hsl: `H: ${Math.round(m.h)}°    S: ${Math.round(saturation*100)}%    L: ${Math.round(lightness*100)}%`, hue: `${Math.round(m.h)}°`, saturation: `${Math.round(m.s*100)}%`, brightness: `${Math.round(m.v*100)}%` };
            for (const el of inspector.querySelectorAll('[data-value]')) {
              if (el.dataset.value === 'swatch') el.style.backgroundColor = code;
              else el.textContent = data[el.dataset.value];
            }
          }
          current.style.background = code;
          if (readout) readout.textContent = code;
          if (rgbReadout) rgbReadout.textContent = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
          const active = document.activeElement;
          if (fields.hex && active !== fields.hex.el) fields.hex.h.set(code);
          for (const k of 'rgb') if (fields[k] && active !== fields[k].el) fields[k].h.set(String(rgb['rgb'.indexOf(k)]));
          presets.forEach((p, i) => p.classList.toggle('on', m.preset === i));
          if (tool) tool.classList.toggle('on', !!m.picking);
          if (svg) svg.classList.toggle('picking', !!m.picking);
        };
        return out;
      },
    },
  },
});
