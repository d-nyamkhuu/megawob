// Design on templates/pick-color/base.js: the base site's pick-color widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-hex-typed-04',
  name: 'design',
  split: 'train',
  scenarios: ['hex-typed'],
  template: 'pick-color/base',
  design: {
    parts: {
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
          else {
            const targetSwatch = util.el('div', 'cp-swatch cp-target-swatch', t);
            targetSwatch.style.background = spec.hex;
            const rgb = math.fromHex(spec.hex);
            util.el('div', 'cp-code', t, `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
            const values = util.el('dl', 'color-values target-values', t);
            for (const [key, value] of [['R', rgb[0]], ['G', rgb[1]], ['B', rgb[2]]]) {
              util.el('dt', '', values, key); util.el('dd', '', values, String(value));
            }
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
        const cur = util.el('div', '', o.curHost || side);
        // The preview is decorative in this layout; typed controls have their own
        // column below the picker, independent of whether a target card exists.
        if (v === 'hex-typed' && !o.curHost) cur.style.display = 'none';
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
          const belowPicker = v === 'hex-typed' && !o.curHost;
          const box = util.el('div', 'cp-fields', belowPicker ? parent.closest('.cp') : cur);
          if (belowPicker) {
            Object.assign(box.style, {
              position: 'absolute', right: '0', bottom: '22px',
              width: 'calc(70% - 28px)', margin: '0', padding: '0',
              boxSizing: 'border-box',
            });
          }
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
          // RGB-only and combined episodes share the available field width.
          for (const input of box.querySelectorAll('.cp-in')) {
            Object.assign(input.style, { flex: '1 1 0', minWidth: '0', width: '0', boxSizing: 'border-box' });
          }
          out.anchors.push(box);
          out.locators.field = (k) => util.center(fields[k].el);
        }

        out.paint = (m) => {
          const rgb = math.modelRgb(m);
          const code = math.hex(rgb);
          current.style.background = code;
          if (readout) readout.textContent = code;
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
