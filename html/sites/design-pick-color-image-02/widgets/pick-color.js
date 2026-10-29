// Design on templates/pick-color/base.js: the base site's pick-color widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-image-02',
  name: 'design',
  split: 'train',
  scenarios: ['image'],
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
        let inspector = null;
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
          inspector = util.el('div', 'cp-inspector', side);
          util.el('div', 'cp-label', inspector, 'Color Properties');
          const props = util.el('div', 'cp-inspector-rows', inspector);
          const propValue = {};
          for (const [key, label] of [['hex','HEX'],['rgb','RGB'],['hsl','HSL']]) {
            const row = util.el('div', 'cp-inspector-row', props);
            util.el('span', '', row, label);
            propValue[key] = util.el('span', 'cp-inspector-value', row);
          }
          inspector._values = propValue;
          const swatches = util.el('div', 'cp-inspector-swatches', side);
          util.el('div', 'cp-label', swatches, 'Swatches');
          const grid = util.el('div', 'cp-inspector-grid', swatches);
          for (const color of ['#292929','#777777','#bcbcbc','#fbfaf7','#f45e52','#ff8b4b','#ffdf4b','#82bd62','#2a7f83','#3973d0','#8e46c8','#c79bdf']) {
            const sw = util.el('span', 'cp-inspector-swatch', grid);
            sw.style.background = color;
          }
        }

        // Current color + readout or editable hex field.
        const cur = util.el('div', '', o.curHost || side);
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
          if (inspector) {
            const h = ((m.h % 360) + 360) % 360;
            const s = Math.max(0, Math.min(1, m.s));
            const v = Math.max(0, Math.min(1, m.v));
            const light = v * (1 - s / 2);
            const sat = light === 0 || light === 1 ? 0 : (v - light) / Math.min(light, 1 - light);
            inspector._values.hex.textContent = code;
            inspector._values.rgb.textContent = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
            inspector._values.hsl.textContent = `${Math.round(h)}°, ${Math.round(sat * 100)}%, ${Math.round(light * 100)}%`;
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
      'buildPicker': (base, scope) => function buildPicker(ctx, card, maxH) {
        const { F, commit, env } = scope;
        const { rng, util, spec } = ctx;
        const minPx = F().helpers.MIN_TRACK_PX;
        const sampledSize = rng.int(230, 320);
        const S = Math.max(minPx, Math.min(Math.max(sampledSize, Math.floor(maxH * 0.86)), maxH));
        const radius = rng.pick([2, 4, 6]);
        const stripW = rng.int(20, 30);
        const knob = rng.int(12, 16);

        const svHit = util.el('div', 'cp-hit', card);
        svHit.dataset.role = 'sv';
        const sv = util.el('div', 'cp-sv', svHit);
        Object.assign(sv.style, { width: S + 'px', height: S + 'px', borderRadius: radius + 'px' });
        util.el('div', 'cp-sv-layer cp-sv-white', sv);
        util.el('div', 'cp-sv-layer cp-sv-black', sv);
        const svKnob = util.el('div', 'cp-knob', sv);
        Object.assign(svKnob.style, { width: knob + 'px', height: knob + 'px', margin: `${-knob / 2}px 0 0 ${-knob / 2}px` });

        const hueHit = util.el('div', 'cp-hit', card);
        hueHit.dataset.role = 'hue';
        const hue = util.el('div', 'cp-hue', hueHit);
        Object.assign(hue.style, { width: S + 'px', height: stripW + 'px', borderRadius: Math.min(radius, 4) + 'px' });
        const hueBar = util.el('div', 'cp-hbar', hue);

        // The design stretches the controls independently; input and markers share their rendered bounds.
        const span = (el) => () => {
          const r = el.getBoundingClientRect();
          return { left: r.left, top: r.top, width: r.width - 1, height: r.height - 1 };
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
            return { start: [r.left, y], end: [r.right - 1, y] };
          },
          place: (bar, point, f) => { bar.style.left = f * (hue.getBoundingClientRect().width - 1) + 'px'; },
          onInput([h]) { commit({ h }); },
        });
        return {
          anchors: [sv, hue],
          paint(m) {
            sv.style.backgroundColor = `hsl(${m.h} 100% 50%)`;
            const r = span(sv)();
            Object.assign(svKnob.style, { left: m.s * r.width + 'px', top: (1 - m.v) * r.height + 'px' });
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
      'renderPopover': (base, S) => function renderPopover(ctx) {
        const { F, M, buildAlpha, buildPicker, buildSide, ensureStyle, paintAll, placeCard } = S;
        ensureStyle();
        const { util, size, rng, spec } = ctx;
        if (S.offOutside) S.offOutside();
        const card = util.el('div', 'cp pop', ctx.stage);
        card.style.fontFamily = 'inherit';
        const v = spec.scenario;
        const sampledSideW = v === 'image' ? rng.int(200, 236) : v === 'palette' ? rng.int(190, 220) : v === 'hex-typed' ? rng.int(196, 214) : rng.int(160, 190);
        const sideW = v === 'image' ? Math.max(sampledSideW, Math.min(Math.floor(size.width * 0.29), 440)) : sampledSideW;
        const host = util.el('div', 'pp-host', card);
        util.el('div', 'pp-title', host, rng.pick(['Accent color', 'Theme color', 'Highlight', 'Brand color', 'Label color']));
        const trigger = util.el('button', 'pp-trigger', host);
        trigger.type = 'button';
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.dataset.role = 'swatch-button';
        const chip = util.el('span', 'pp-chip', trigger);
        util.el('span', '', trigger, rng.pick(['Choose color', 'Pick…', 'Change', 'Edit']));
        util.el('span', 'pp-caret', trigger);
        const lines = rng.int(1, 2);
        for (let i = 0; i < lines; i++) util.el('div', 'pp-line', host, rng.pick(['Label', 'Description (optional)', 'Alt text', 'Notes']));

        const pop = util.el('div', 'pp-pop', host);
        pop.setAttribute('role', 'dialog');
        const ctl = util.el('div', 'pp-ctl', pop);
        const maxH = Math.min(Math.floor(size.height) - 76 - 190, 280);
        const picker = buildPicker(ctx, ctl, Math.max(F().helpers.MIN_TRACK_PX, maxH));
        let alpha = null;
        if (rng.bool(0.6)) {
          const row = util.el('div', 'cp-row', pop);
          const w = ctl.firstChild.offsetWidth + ctl.lastChild.offsetWidth + 4;
          alpha = buildAlpha(ctx, row, w - 16 - 40, 14, false);
        }
        const curHost = util.el('div', '', pop);
        S.st = { ctx, controls: null, side: null, trigger, pop };
        S.st.side = buildSide(ctx, card, sideW, { curHost });
        S.st.controls = {
          anchors: [trigger, ...(alpha ? [alpha.track] : [])],
          paint(m) {
            picker.paint(m);
            if (alpha) alpha.paint(m);
            pop.classList.toggle('open', !!m.open);
            trigger.setAttribute('aria-expanded', String(!!m.open));
            chip.style.background = M().hex(M().modelRgb(m));
          },
          locate: (t, m) => picker.locate(t, m),
        };
        trigger.addEventListener('click', () => {
          ctx.update({ ...ctx.model, open: !ctx.model.open });
          paintAll();
        });
        // A press outside the popover and its button closes it.
        const outside = (e) => {
          if (!ctx.model.open || pop.contains(e.target) || trigger.contains(e.target)) return;
          ctx.update({ ...ctx.model, open: false });
          paintAll();
        };
        document.addEventListener('pointerdown', outside, true);
        S.offOutside = () => { document.removeEventListener('pointerdown', outside, true); S.offOutside = null; };
        // The side column goes after the host (or before it).
        if (rng.bool(0.4)) card.insertBefore(card.lastChild, host);
        // The host column is as wide as the popover, so the popover opens over blank form rows and never over the
        // side column (the target, presets, the image); vertically it is clamped into the stage below.
        host.style.width = pop.offsetWidth + 'px';
        const below = trigger.offsetTop + trigger.offsetHeight + 8;
        pop.style.left = '0px';
        pop.style.top = below + 'px';
        paintAll();
        placeCard(card, ctx);
        const sr = ctx.stage.getBoundingClientRect();
        const pr = pop.getBoundingClientRect();
        const dy = Math.min(0, sr.bottom - 4 - pr.bottom) || Math.max(0, sr.top + 4 - pr.top);
        pop.style.top = below + dy + 'px';
        return { anchors: [...S.st.controls.anchors, ...S.st.side.anchors], sync: () => paintAll() };
      },
      'render': (base, S) => function render(ctx, build) {
        const { buildSide, ensureStyle, paintAll, placeCard } = S;
        ensureStyle();
        const { util, size, rng, spec } = ctx;
        const card = util.el('div', 'cp', ctx.stage);
        card.style.fontFamily = 'inherit';
        const v = spec.scenario;
        const sampledSideW = v === 'image' ? rng.int(200, 236) : v === 'palette' ? rng.int(190, 220) : v === 'hex-typed' ? rng.int(196, 214) : rng.int(160, 190);
        const sideW = v === 'image' ? Math.max(sampledSideW, Math.min(Math.floor(size.width * 0.29), 440)) : sampledSideW;
        const maxH = Math.floor(size.height) - 76;
        const maxW = Math.floor(size.width) - sideW - 80;
        S.st = { ctx, controls: null, side: null };
        const left = rng.bool(0.25);
        let sideHost = null;
        if (left) sideHost = util.el('div', '', card);
        S.st.controls = build(ctx, card, maxH, maxW);
        S.st.side = buildSide(ctx, sideHost || card, sideW);
        if (sideHost) sideHost.replaceWith(sideHost.firstChild);
        paintAll();
        placeCard(card, ctx);
        return { anchors: [...S.st.controls.anchors, ...S.st.side.anchors], sync: () => paintAll() };
      },
    },
  },
});
