// Design on templates/pick-color/base.js: the base site's pick-color widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-hex-typed-02',
  name: 'design',
  split: 'train',
  scenarios: ['hex-typed'],
  template: 'pick-color/base',
  design: {
    parts: {
      'placeCard': (base) => function placeCard(card, ctx) {
        base(card, ctx);
        card.style.left = Math.round(ctx.size.width * .028) + 'px';
        card.style.top = '18px';
      },
      'buildSide': (base, S) => function buildSide(ctx, parent, width, o = {}) {
        const { M, SCENE_ART, commit, commitRgb, env, tilesArt } = S;
        const { util, spec, rng } = ctx;
        const math = M();
        const side = util.el('div', 'cp-side', parent);
        const layout = parent.closest('.cp').aeroLayout;
        Object.assign(side.style, { display: 'contents', width: 'auto', padding: '0', margin: '0' });
        const out = { anchors: [], locators: {} };

        const v = spec.scenario;
        // Judge episodes (ambiguous / impossible) name their colors in the goal text; the stand-in goal's card stays hidden.
        const showTarget = !spec.judge && (v === 'swatch' || (v === 'palette' && spec.ref === 'swatch'));
        const showCode = !spec.judge && ((v === 'hex' || v === 'hex-typed') ? spec.showCode : v === 'palette' && spec.ref === 'hex');
        if (showTarget || showCode) {
          const t = util.el('div', 'cp-target-card', side);
          Object.assign(t.style, { display: 'grid', gridColumn: '1 / -1', gridRow: '1', height: layout.targetH + 'px', gridTemplateColumns: layout.swatchW + 'px minmax(0,1fr)', gridTemplateRows: '30px minmax(0,1fr)', gap: '0 24px', padding: layout.compact ? '8px 14px' : '14px 20px', alignItems: 'center', boxSizing: 'border-box', minWidth: '0' });
          const label = util.el('div', 'cp-label', t, spec.targetLabel);
          Object.assign(label.style, { gridColumn: '2', gridRow: '1', margin: '0', padding: '0', height: 'auto' });
          if (showTarget) util.el('div', 'cp-swatch', t).style.background = spec.hex;
          else {
            if (v === 'hex-typed') {
              const swatch = util.el('div', 'cp-target-swatch cp-swatch', t);
              Object.assign(swatch.style, { background: spec.hex, gridColumn: '1', gridRow: '1 / -1', width: '100%', height: '100%', margin: '0', boxSizing: 'border-box' });
            }
            const code = util.el('div', 'cp-code', t, spec.code);
            Object.assign(code.style, { display: 'flex', gridColumn: '2', gridRow: '2', justifyContent: 'flex-start', height: 'auto', padding: '0' });
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
        const cur = util.el('div', 'cp-current-card', o.curHost || side);
        Object.assign(cur.style, { gridColumn: '2', gridRow: '2', alignSelf: 'start', minWidth: '0', padding: '10px 0', boxSizing: 'border-box' });
        const currentLabel = util.el('div', 'cp-label', cur, rng.pick(['Current', 'Selected', 'New color', 'Preview']));
        Object.assign(currentLabel.style, { margin: '0 0 8px', padding: '7px', height: 'auto', boxSizing: 'border-box' });
        const current = util.el('div', v === 'image' || v === 'palette' ? 'cp-swatch small' : 'cp-swatch', cur);
        Object.assign(current.style, { height: layout.compact ? '44px' : '60px', width: '100%', margin: '0', boxSizing: 'border-box' });
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
          const box = util.el('div', 'cp-fields', v === 'hex-typed' && !o.curHost ? side : cur);
          Object.assign(box.style, { display: 'flex', flexDirection: 'column', gridColumn: '2', gridRow: '2', alignSelf: 'start', width: '100%', minWidth: '0', marginTop: layout.compact ? '100px' : '126px', padding: '0', gap: layout.compact ? '8px' : '10px', boxSizing: 'border-box' });
          if (v !== 'hex-typed' || o.curHost) box.style.marginTop = '6px';
          if (fieldMode === 'hex' || fieldMode === 'both') {
            const row = util.el('div', 'cp-frow', box);
            Object.assign(row.style, { display: 'grid', gridTemplateColumns: '38px minmax(0,1fr)', alignItems: 'center', gap: '10px' });
            util.el('span', 'cp-flab', row, rng.pick(['Hex', 'HEX', '#']));
            const input = util.el('input', 'cp-in hex', row);
            Object.assign(input.style, { width: '100%', minWidth: '0', height: layout.inputH + 'px', padding: '4px 12px', boxSizing: 'border-box' });
            input.spellcheck = false;
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('aria-label', 'Hex color');
            bindField(input, 'hex', /[#0-9a-fA-F]/, 7);
          }
          if (fieldMode === 'rgb' || fieldMode === 'both') {
            const row = util.el('div', 'cp-frow', box);
            Object.assign(row.style, { display: 'grid', gridTemplateColumns: '38px minmax(0,138px)', alignItems: 'center', gap: '10px' });
            for (const k of 'rgb') {
              util.el('span', 'cp-flab', row, k.toUpperCase()).style.minWidth = '12px';
              const input = util.el('input', 'cp-in ch', row);
              Object.assign(input.style, { width: '100%', minWidth: '0', height: layout.inputH + 'px', padding: '4px 14px', boxSizing: 'border-box', textAlign: 'left' });
              input.setAttribute('inputmode', 'numeric');
              input.setAttribute('autocomplete', 'off');
              input.setAttribute('aria-label', k.toUpperCase());
              bindField(input, k, /\d/, 3);
            }
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
      'buildPicker': (base, scope) => function buildPicker(ctx, card, maxH) {
        const { F, commit, env } = scope;
        const { rng, util, spec } = ctx;
        const minPx = F().helpers.MIN_TRACK_PX;
        const sampledSize = rng.int(500, 560);
        const radius = rng.pick([2, 4, 6]);
        const stripW = rng.int(20, 30);
        const knob = rng.int(12, 16);
        const compact = ctx.size.height < 540;
        const targetH = compact ? 100 : 136;
        const gap = compact ? 8 : 14;
        const hueH = compact ? 24 : 28;
        const width = Math.floor(ctx.size.width * .944);
        const height = Math.floor(ctx.size.height) - 36;
        const leftW = Math.floor((width - 30) * .59);
        const bodyH = height - targetH - hueH - 2 * gap;
        const S = Math.max(minPx, Math.min(Math.floor(sampledSize * .82), leftW, bodyH));
        const hueW = Math.min(459, leftW);
        card.aeroLayout = { compact, targetH, swatchW: compact ? 130 : 190, inputH: compact ? 36 : 48 };
        Object.assign(card.style, { position: 'absolute', display: 'grid', width: width + 'px', height: height + 'px', gridTemplateColumns: leftW + 'px minmax(0,1fr)', gridTemplateRows: targetH + 'px minmax(0,1fr) ' + hueH + 'px', gap: gap + 'px 30px', padding: '0', margin: '0', alignItems: 'start', alignContent: 'start', boxSizing: 'border-box' });

        const svHit = util.el('div', 'cp-hit', card);
        Object.assign(svHit.style, { gridColumn: '1', gridRow: '2', padding: '0', margin: '0', justifySelf: 'start', alignSelf: 'start' });
        svHit.dataset.role = 'sv';
        const sv = util.el('div', 'cp-sv', svHit);
        Object.assign(sv.style, { width: S + 'px', height: S + 'px', borderRadius: radius + 'px' });
        util.el('div', 'cp-sv-layer cp-sv-white', sv);
        util.el('div', 'cp-sv-layer cp-sv-black', sv);
        const svKnob = util.el('div', 'cp-knob', sv);
        Object.assign(svKnob.style, { width: knob + 'px', height: knob + 'px', margin: `${-knob / 2}px 0 0 ${-knob / 2}px` });

        const hueHit = util.el('div', 'cp-hit', card);
        Object.assign(hueHit.style, { gridColumn: '1', gridRow: '3', padding: '0', margin: '0', justifySelf: 'start', alignSelf: 'start' });
        hueHit.dataset.role = 'hue';
        const hue = util.el('div', 'cp-hue', hueHit);
        Object.assign(hue.style, { width: hueW + 'px', height: hueH + 'px', borderRadius: Math.min(radius, 4) + 'px' });
        const hueBar = util.el('div', 'cp-bar', hue);
        Object.assign(hueBar.style, { left: '0', right: 'auto', top: '-5px', bottom: '-5px', width: '12px', height: 'auto', margin: '0 0 0 -6px' });

        // Both controls span S - 1 px from their top-left corner; presses in the padding clamp to the edge.
        const span = (el) => () => {
          const r = el.getBoundingClientRect();
          return { left: r.left, top: r.top, width: S - 1, height: S - 1 };
        };
        const svPad = env.ui.pad(svHit, {
          label: 'sv',
          rect: span(sv),
          value: [ctx.model.s, 1 - ctx.model.v],
          onInput([u, v]) { commit({ s: u, v: 1 - v }); },
        });
        const hueCtl = env.ui.slider(hueHit, {
          label: 'hue',
          thumbs: [hueBar],
          values: [ctx.model.h],
          min: 0,
          max: 360,
          keyboard: !!spec.keys,
          geometry() {
            const r = hue.getBoundingClientRect();
            const y = r.top + r.height / 2;
            return { start: [r.left, y], end: [r.left + hueW - 1, y] };
          },
          place: (bar, point, f) => { bar.style.left = f * (hueW - 1) + 'px'; },
          onInput([h]) { commit({ h }); },
        });
        return {
          anchors: [sv, hue],
          paint(m) {
            sv.style.backgroundColor = `hsl(${m.h} 100% 50%)`;
            Object.assign(svKnob.style, { left: m.s * (S - 1) + 'px', top: (1 - m.v) * (S - 1) + 'px' });
            svPad.set([m.s, 1 - m.v]);
            hueCtl.set([m.h]);
          },
          locate(t, m) {
            if (t.surface === 'sv') {
              const [s, v] = t.current ? [m.s, m.v] : [t.s, t.v];
              return svPad.locate([s, 1 - v]);
            }
            if (t.surface === 'hue') return hueCtl.locate(t.current ? m.h : t.h);
            return null;
          },
        };
      },
    },
  },
});
