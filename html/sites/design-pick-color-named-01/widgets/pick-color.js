// Design on templates/pick-color/base.js: the base site's pick-color widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-named-01',
  name: 'design',
  split: 'train',
  scenarios: ['named'],
  template: 'pick-color/base',
  design: {
    parts: {
      // The portal uses a rectangular picker. Its input geometry must use the
      // same dimensions as its visible tracks, rather than the template's S.
      'buildPicker': (base, S) => function buildPicker(ctx, card) {
        const { rng, util, size, spec } = ctx;
        const { F, commit } = S;
        // Preserve the template's four layout draws, in their original order.
        rng.int(230, 320);
        rng.pick([2, 4, 6]);
        rng.int(20, 30);
        rng.int(12, 16);
        const top = Math.min(116, size.height * .15);
        const readoutH = size.height < 570 ? 100 : 145;
        const height = Math.max(F().helpers.MIN_TRACK_PX, Math.min(465, size.height - top - readoutH - 60, size.width * .52));
        const width = Math.min(495, size.width * .55, height * 1.064);
        const strip = Math.min(54, size.width * .06);
        const gap = Math.min(38, size.width * .045);
        const left = (size.width - width - strip - gap) / 2;
        Object.assign(card.style, { width: size.width + 'px', height: size.height + 'px', padding: '0', margin: '0', display: 'block', position: 'relative', border: '0', background: 'transparent' });
        const track = (role, cls, x, w) => {
          const hit = util.el('div', 'cp-hit', card);
          hit.dataset.role = role;
          Object.assign(hit.style, { position: 'absolute', left: x + 'px', top: top + 'px', padding: '0' });
          const el = util.el('div', cls, hit);
          Object.assign(el.style, { width: w + 'px', height: height + 'px', borderRadius: '0' });
          return [hit, el];
        };
        const [svHit, sv] = track('sv', 'cp-sv', left, width);
        util.el('div', 'cp-sv-layer cp-sv-white', sv);
        util.el('div', 'cp-sv-layer cp-sv-black', sv);
        const knob = util.el('div', 'cp-knob', sv);
        Object.assign(knob.style, { width: '24px', height: '24px', margin: '-12px 0 0 -12px' });
        const [hueHit, hue] = track('hue', 'cp-hue', left + width + gap, strip);
        const bar = util.el('div', 'cp-bar', hue);
        Object.assign(bar.style, { height: '18px', marginTop: '-9px' });
        const rect = () => {
          const r = sv.getBoundingClientRect();
          return { left: r.left, top: r.top, width: width - 1, height: height - 1 };
        };
        const pad = env.ui.pad(svHit, { label: 'sv', rect, value: [ctx.model.s, 1 - ctx.model.v], onInput([s, v]) { commit({ s, v: 1 - v }); } });
        const slider = env.ui.slider(hueHit, {
          label: 'hue', thumbs: [bar], values: [ctx.model.h], min: 0, max: 360, keyboard: !!spec.keys,
          geometry() { const r = hue.getBoundingClientRect(); const x = r.left + r.width / 2; return { start: [x, r.top], end: [x, r.top + height - 1] }; },
          place: (el, point, f) => { el.style.top = f * (height - 1) + 'px'; },
          onInput(h) { commit({ h: h[0] }); },
        });
        return {
          anchors: [sv, hue],
          paint(m) {
            sv.style.backgroundColor = `hsl(${m.h} 100% 50%)`;
            Object.assign(knob.style, { left: m.s * (width - 1) + 'px', top: (1 - m.v) * (height - 1) + 'px' });
            pad.set([m.s, 1 - m.v]); slider.set([m.h]);
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
        const compact = ctx.size.height < 570;
        Object.assign(side.style, { position: 'absolute', left: '24px', right: '24px', bottom: '28px', width: 'auto', display: 'block', padding: '0', margin: '0', border: '0', background: 'transparent' });
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
        Object.assign(cur.style, { display: 'grid', gridTemplateColumns: '42% minmax(0,1fr)', columnGap: compact ? '15px' : '36px', alignItems: 'center', padding: '0', border: '0', background: 'transparent' });
        const label = util.el('div', 'cp-label', cur, rng.pick(['Current', 'Selected', 'New color', 'Preview']));
        Object.assign(label.style, { gridColumn: '1 / -1', margin: '0 0 8px' });
        const current = util.el('div', v === 'image' || v === 'palette' ? 'cp-swatch small' : 'cp-swatch', cur);
        Object.assign(current.style, { gridColumn: '1', gridRow: '2 / span 2', height: compact ? '65px' : '104px', margin: '0', borderRadius: '0' });
        const fields = {};
        const fieldMode = spec.fields;
        let readout = null;
        let nameReadout = null;
        // Always shown without typed fields: the task's facts() reports this hex code. (The draw stays for the 50% case so
        // later layout draws of an episode are as before.)
        if (!fieldMode) { if (v !== 'hex') rng.bool(0.5); readout = util.el('div', 'cp-hex', cur); Object.assign(readout.style, { gridColumn: '2', gridRow: '2', display: 'block', alignSelf: 'start' }); if (v === 'named') { nameReadout = util.el('div', 'cp-name', cur); Object.assign(nameReadout.style, { gridColumn: '2', gridRow: '3', display: 'block' }); } }

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

        out.paint = (m) => {
          const rgb = math.modelRgb(m);
          const code = math.hex(rgb);
          current.style.background = code;
          if (readout) readout.textContent = code;
          if (nameReadout) {
            const names = [['Black',[0,0,0]],['White',[255,255,255]],['Red',[255,0,0]],['Green',[0,128,0]],['Blue',[0,0,255]],['Yellow',[255,255,0]],['Orange',[255,165,0]],['Purple',[128,0,128]],['Pink',[255,192,203]],['Brown',[165,42,42]],['Gray',[128,128,128]],['Navy',[0,0,128]],['Teal',[0,128,128]],['Olive',[128,128,0]],['Maroon',[128,0,0]],['Lime',[0,255,0]],['Aqua',[0,255,255]],['Coral',[255,127,80]],['Gold',[255,215,0]],['Indigo',[75,0,130]]];
            let best = names[0], distance = Infinity;
            for (const item of names) { const d = (rgb[0]-item[1][0])**2 + (rgb[1]-item[1][1])**2 + (rgb[2]-item[1][2])**2; if (d < distance) { best = item; distance = d; } }
            nameReadout.textContent = best[0];
          }
          const portal = document.querySelector('.portal-info');
          if (portal) {
            portal.querySelector('.portal-info-swatch').style.background = code;
            const rows = portal.querySelectorAll('.portal-info-row span');
            rows[0].textContent = code.toUpperCase();
            rows[1].textContent = `(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            const c = rgb.map(x => x / 255), hi = Math.max(...c), lo = Math.min(...c), delta = hi - lo;
            let h = 0;
            if (delta) h = hi === c[0] ? 60 * (((c[1] - c[2]) / delta) % 6) : hi === c[1] ? 60 * ((c[2] - c[0]) / delta + 2) : 60 * ((c[0] - c[1]) / delta + 4);
            if (h < 0) h += 360;
            const l = (hi + lo) / 2, s = delta ? delta / (1 - Math.abs(2 * l - 1)) : 0;
            rows[2].textContent = `(${Math.round(h)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
          }
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
