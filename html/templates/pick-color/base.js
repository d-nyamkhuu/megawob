// pick-color/base: the base site's pick-color widgets (picker, wheel, rgb, hsl, vanilla, popover) as a template. This
// file is their source. The design-* sites that started from a copy of them, and the composite sites that embed them,
// are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/pick-color.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/pick-color.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
// Side-panel section hooks: buildSideTarget, buildSidePresets, buildSideImage, buildSideCurrent.
(function () {
  const HTML = new URL('../../', document.currentScript.src);
  const UNITS = new Set(); // the part keys of the units below, recorded as they run (__has)
  let widgets = null;
  let parts = null;
  function reference(site, __parts) {
    const captured = [];
    let scopeNow = null;
    const __has = (key) => { UNITS.add(key); return key in __parts; };
    const env = new Proxy(window.env, {
      get: (t, k) => (k === 'widget' ? (d) => {
        for (const key of Object.keys(__parts)) {
          const dot = key.indexOf('.');
          if (!key.startsWith('stmt') && !key.startsWith('+') && dot > 0 && key.slice(0, dot) === d.name) d[key.slice(dot + 1)] = __parts[key](d[key.slice(dot + 1)], scopeNow);
        }
        captured.push(d);
      } : Reflect.get(t, k)),
    });
    const scriptOf = { src: new URL(`sites/${site}/widgets/pick-color.js`, HTML).href };
    /*
     * reference / color: pointer layouts (traits.controls) sharing one side panel.
     *   picker  'sv+hue'       the classic saturation/value square with a vertical hue strip (Photoshop-style).
     *                          Pointer-down anywhere on a control (or a few px around it) jumps the marker there,
     *                          dragging refines it (env.ui.pad for the square, env.ui.slider for the strip).
     *   wheel   'wheel+value'  a hue/saturation disc (hue = angle; the zero direction and the turning sense vary
     *                          per seed) plus a value strip (vertical beside the disc or horizontal below it).
     *   rgb     'rgb'          three R, G, B sliders (rows or columns) with live channel gradients and numbers.
     *   hsl     'hsl'          three H, S, L sliders (rows or columns; hue rainbow, saturation / lightness gradients that
     *                          follow the other channels), numbers in degrees / percent; per seed an alpha slider as an
     *                          unscored distractor (local state, never in the model). HSL sets write back to the HSV model.
     *   vanilla 'sl+hue'       the vendored vanilla-picker 2.12.3 (ISC, vendor/vanilla-picker-2.12.3; stands in for iro.js,
     *                          MPL-2.0), inline: HSL square (x saturation, y lightness) under a hue strip, its own alpha
     *                          strip (per seed, a distractor) and an inert Ok button. Library em-sizes are scaled so the
     *                          square and strip are >= MIN_TRACK_PX + 6 px. The model follows its onChange; the library's
     *                          editor field is hidden (typed routes use the side fields). Loaded through `uses`.
     *   popover 'sv+hue' + traits.popover   a form row with a swatch button ("Choose color"); the button opens a popover
     *                          holding the square, the hue strip, an optional alpha strip (distractor), the current color
     *                          and the typed fields. A press outside closes it (presets, eyedropper, image, end control).
     *                          The plan opens it first ({ popover: 'open' }); model.open is unscored. The popover is
     *                          always laid out (visibility), so geometry never changes; its host column is as wide as the
     *                          popover so it never covers the target / presets / image in the side column.
     * Side panel (all widgets, by scenario): the target card (swatch, or the code for hex), a preset grid (palette),
     * an illustration with an optional eyedropper button (image), the current color with a hex readout (an
     * editable hex field in keyboard episodes), and hex / R, G, B input fields (hex-typed). The whole card sits at
     * a sampled offset inside the stage.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get ensureStyle() { return ensureStyle; },
        get F() { return F; },
        get M() { return M; },
        get commitRgb() { return commitRgb; },
        get SCENE_ART() { return SCENE_ART; },
        get HUE_CSS() { return HUE_CSS; },
        get centerOf() { return centerOf; },
        get SCENARIOS() { return SCENARIOS; },
        get st() { return st; }, set st(v) { st = v; },
        get offOutside() { return offOutside; }, set offOutside(v) { offOutside = v; },
        get commit() { return commit; },
        get paintAll() { return paintAll; },
        get placeCard() { return placeCard; },
        get tilesArt() { return tilesArt; },
        get buildSideTarget() { return buildSideTarget; },
        get buildSidePresets() { return buildSidePresets; },
        get buildSideImage() { return buildSideImage; },
        get buildSideCurrent() { return buildSideCurrent; },
        get buildSide() { return buildSide; },
        get buildPicker() { return buildPicker; },
        get buildWheel() { return buildWheel; },
        get buildRgb() { return buildRgb; },
        get buildAlpha() { return buildAlpha; },
        get buildHsl() { return buildHsl; },
        get buildVanilla() { return buildVanilla; },
        get renderPopover() { return renderPopover; },
        get render() { return render; },
        get locate() { return locate; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('commit')) commit = __parts['commit'](commit, __scope);
      if (__has('paintAll')) paintAll = __parts['paintAll'](paintAll, __scope);
      if (__has('placeCard')) placeCard = __parts['placeCard'](placeCard, __scope);
      if (__has('tilesArt')) tilesArt = __parts['tilesArt'](tilesArt, __scope);
      if (__has('buildSideTarget')) buildSideTarget = __parts['buildSideTarget'](buildSideTarget, __scope);
      if (__has('buildSidePresets')) buildSidePresets = __parts['buildSidePresets'](buildSidePresets, __scope);
      if (__has('buildSideImage')) buildSideImage = __parts['buildSideImage'](buildSideImage, __scope);
      if (__has('buildSideCurrent')) buildSideCurrent = __parts['buildSideCurrent'](buildSideCurrent, __scope);
      if (__has('buildSide')) buildSide = __parts['buildSide'](buildSide, __scope);
      if (__has('buildPicker')) buildPicker = __parts['buildPicker'](buildPicker, __scope);
      if (__has('buildWheel')) buildWheel = __parts['buildWheel'](buildWheel, __scope);
      if (__has('buildRgb')) buildRgb = __parts['buildRgb'](buildRgb, __scope);
      if (__has('buildAlpha')) buildAlpha = __parts['buildAlpha'](buildAlpha, __scope);
      if (__has('buildHsl')) buildHsl = __parts['buildHsl'](buildHsl, __scope);
      if (__has('buildVanilla')) buildVanilla = __parts['buildVanilla'](buildVanilla, __scope);
      if (__has('renderPopover')) renderPopover = __parts['renderPopover'](renderPopover, __scope);
      if (__has('render')) render = __parts['render'](render, __scope);
      if (__has('locate')) locate = __parts['locate'](locate, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('pick-color/_base-assets').CSS);

      let st = __has('st') ? __parts['st'](undefined, __scope) : undefined; // per-render state shared by the active widget, its side panel and locate()

      const ensureStyle = __has('ensureStyle') ? __parts['ensureStyle'](undefined, __scope) : { ensureStyle: () => env.util.css('cpk-style', CSS) }.ensureStyle;

      const F = __has('F') ? __parts['F'](undefined, __scope) : { F: () => env.taskDef }.F;
      const M = __has('M') ? __parts['M'](undefined, __scope) : { M: () => env.taskDef.helpers.math }.M;

      // Commit a color (HSV or 8-bit/float RGB channels), keeping the unscored model fields (picking, preset).
      function commit(part) {
        const m = st.ctx.model;
        st.ctx.update({ ...m, ...part });
        paintAll();
      }
      const commitRgb = __has('commitRgb') ? __parts['commitRgb'](undefined, __scope) : { commitRgb: (rgb, extra = {}) => commit({ ...M().rgbToHsv(rgb), ...extra }) }.commitRgb;

      function paintAll() {
        if (!st) return;
        st.controls.paint(st.ctx.model);
        st.side.paint(st.ctx.model);
      }

      // Shift the card to a sampled spot inside the stage (the site already varies the stage alignment).
      function placeCard(card, ctx) {
        const s = ctx.stage.getBoundingClientRect();
        const r = card.getBoundingClientRect();
        const lo = [s.left - r.left + 4, s.top - r.top + 4];
        const hi = [s.right - r.right - 4, s.bottom - r.bottom - 4];
        const pick = (a, b) => (b > a ? Math.round(ctx.rng.float(Math.max(a, -90), Math.min(b, 90))) : 0);
        card.style.left = pick(lo[0], hi[0]) + 'px';
        card.style.top = pick(lo[1], hi[1]) + 'px';
      }

      // ---------------------------------------------------------------- illustrations (viewBox 200 x 140)

      // Each scene: draw(g, fill(id)) and pick points (a spot inside each region not covered by another one).
      const SCENE_ART = __has('SCENE_ART') ? __parts['SCENE_ART'](undefined, __scope) : (env.templateLib('pick-color/_base-assets').SCENE_ART);

      function tilesArt(rows, cols) {
        return env.templateLib('pick-color/_base-assets').tilesArt(rows, cols);
      }

      // ---------------------------------------------------------------- side panel

      // These sections keep their DOM work and rng draws in the original side-panel order.
      function buildSideTarget(ctx, side) {
        const { util, spec } = ctx;
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
      }

      function buildSidePresets(ctx, side, width, out) {
        const { util, spec, rng } = ctx;
        const math = M();
        const v = spec.scenario;
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
        return presets;
      }

      function buildSideImage(ctx, side, width, out) {
        const { util, spec, rng } = ctx;
        const math = M();
        const v = spec.scenario;
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
        return { svg, tool };
      }

      function buildSideCurrent(ctx, side, o, out) {
        const { util, spec, rng } = ctx;
        const math = M();
        const v = spec.scenario;
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
        return { current, fields, readout };
      }

      // o.curHost puts the current-color section and typed fields inside the popover instead of the side column.
      function buildSide(ctx, parent, width, o = {}) {
        const { util } = ctx;
        const math = M();
        const side = util.el('div', 'cp-side', parent);
        side.style.width = width + 'px';
        const out = { anchors: [], locators: {} };

        buildSideTarget(ctx, side);
        const presets = buildSidePresets(ctx, side, width, out);
        const { svg, tool } = buildSideImage(ctx, side, width, out);
        const { current, fields, readout } = buildSideCurrent(ctx, side, o, out);

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
      }

      // ---------------------------------------------------------------- pointer controls

      // sv+hue: saturation/value square + vertical hue strip.
      function buildPicker(ctx, card, maxH) {
        const { rng, util, spec } = ctx;
        const minPx = F().helpers.MIN_TRACK_PX;
        const S = Math.max(minPx, Math.min(rng.int(230, 320), maxH));
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
        Object.assign(hue.style, { width: stripW + 'px', height: S + 'px', borderRadius: Math.min(radius, 4) + 'px' });
        const hueBar = util.el('div', 'cp-bar', hue);

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
            const x = r.left + r.width / 2;
            return { start: [x, r.top], end: [x, r.top + S - 1] };
          },
          place: (bar, point, f) => { bar.style.top = f * (S - 1) + 'px'; },
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
      }

      // wheel+value: hue/saturation disc + value strip.
      function buildWheel(ctx, card, maxH) {
        const { rng, util, spec } = ctx;
        const fam = F();
        const R = Math.max(fam.helpers.MIN_WHEEL_RADIUS, Math.min(rng.int(100, 135), Math.floor((maxH - 4) / 2)));
        const below = rng.bool(0.4) && 2 * R + 60 <= maxH;
        const L = Math.max(fam.helpers.MIN_TRACK_PX, 2 * R);
        const zero = rng.pick([0, 90, 180, 270, rng.int(0, 359)]); // screen angle (clockwise from 12) of hue 0
        const dir = rng.pick([1, -1]); // 1: hue increases clockwise
        const thick = rng.int(18, 26);
        const mod360 = (a) => ((a % 360) + 360) % 360;

        const wrap = util.el('div', below ? 'cp-ctl col' : 'cp-ctl', card);
        const hit = util.el('div', 'cp-hit', wrap);
        hit.dataset.role = 'wheel';
        const disc = util.el('div', 'cp-disc', hit);
        Object.assign(disc.style, { width: 2 * R + 'px', height: 2 * R + 'px' });
        const hues = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00'];
        const stops = (dir === 1 ? hues : hues.slice().reverse()).join(', ');
        disc.style.background = `conic-gradient(from ${zero}deg, ${stops})`;
        util.el('div', 'cp-disc-layer', disc).style.background = 'radial-gradient(circle closest-side, #fff, rgba(255,255,255,0))';
        const shade = util.el('div', 'cp-disc-layer', disc);
        shade.style.background = '#000';
        const ring = util.el('div', 'cp-ring', disc);

        const vHit = util.el('div', 'cp-hit', wrap);
        vHit.dataset.role = 'value';
        const strip = util.el('div', 'cp-track', vHit);
        Object.assign(strip.style, below ? { width: L + 'px', height: thick + 'px' } : { width: thick + 'px', height: L + 'px' });
        const bar = util.el('div', below ? 'cp-hbar' : 'cp-bar', strip);

        const box = () => {
          const r = disc.getBoundingClientRect();
          return { left: r.left, top: r.top, width: 2 * R, height: 2 * R };
        };
        const pad = env.ui.pad(hit, {
          label: 'wheel',
          rect: box,
          value: [0.5, 0.5],
          onInput([u, v]) {
            const dx = (u - 0.5) * 2 * R;
            const dy = (v - 0.5) * 2 * R;
            const r = Math.hypot(dx, dy);
            const theta = Math.atan2(dx, -dy) * 180 / Math.PI;
            commit({ h: r === 0 ? ctx.model.h : mod360((theta - zero) * dir), s: Math.min(1, r / R) });
          },
        });
        const uvOf = (h, s) => {
          const th = (zero + dir * h) * Math.PI / 180;
          return [0.5 + (s * Math.sin(th)) / 2, 0.5 - (s * Math.cos(th)) / 2];
        };
        // Value 0 at the bottom (vertical) or left (horizontal) end.
        const vCtl = env.ui.slider(vHit, {
          label: 'value',
          thumbs: [bar],
          values: [ctx.model.v],
          min: 0,
          max: 1,
          keyboard: !!spec.keys,
          geometry() {
            const r = strip.getBoundingClientRect();
            if (below) return { start: [r.left, r.top + r.height / 2], end: [r.left + L - 1, r.top + r.height / 2] };
            return { start: [r.left + r.width / 2, r.top + L - 1], end: [r.left + r.width / 2, r.top] };
          },
          place: (el, point, f) => {
            if (below) el.style.left = f * (L - 1) + 'px';
            else el.style.top = (1 - f) * (L - 1) + 'px';
          },
          onInput([v]) { commit({ v }); },
        });
        return {
          anchors: [disc, strip],
          paint(m) {
            const s = Math.min(1, Math.max(0, m.s));
            const [u, v] = uvOf(m.h, s);
            Object.assign(ring.style, { left: u * 2 * R + 'px', top: v * 2 * R + 'px' });
            pad.set([u, v]);
            shade.style.opacity = (1 - Math.min(1, Math.max(0, m.v))).toFixed(3);
            const top = M().hex(M().hsvToRgb(m.h, s, 1));
            strip.style.background = `linear-gradient(${below ? 'to right' : 'to top'}, #000, ${top})`;
            vCtl.set([m.v]);
          },
          locate(t, m) {
            if (t.surface === 'wheel') {
              const [h, s] = t.current ? [m.h, Math.min(1, Math.max(0, m.s))] : [t.h, t.s];
              return pad.locate(uvOf(h, s));
            }
            if (t.surface === 'value') return vCtl.locate(t.current ? m.v : t.v);
            return null;
          },
        };
      }

      // rgb: three channel sliders.
      function buildRgb(ctx, card, maxH, maxW) {
        const { rng, util, spec } = ctx;
        const fam = F();
        const cols = rng.bool(0.35) && maxH >= fam.helpers.MIN_TRACK_PX + 70;
        const L = cols
          ? Math.max(fam.helpers.MIN_TRACK_PX, Math.min(rng.int(220, 300), maxH - 70))
          : Math.max(fam.helpers.MIN_TRACK_PX, Math.min(rng.int(240, 340), maxW - 90));
        const thick = rng.int(14, 22);
        const box = util.el('div', cols ? 'cp-rgb cols' : 'cp-rgb', card);
        const names = rng.pick([['R', 'G', 'B'], ['Red', 'Green', 'Blue']]);
        const ctl = {};
        const tracks = {};
        const nums = {};
        for (const [i, k] of ['r', 'g', 'b'].entries()) {
          const row = util.el('div', 'cp-row', box);
          const lab = util.el('span', 'cp-ch', row, cols ? names[i][0] : names[i]);
          if (!cols && names[i].length > 1) lab.style.width = '44px';
          const hit = util.el('div', 'cp-hit', row);
          hit.dataset.role = k;
          const track = util.el('div', 'cp-track', hit);
          Object.assign(track.style, cols ? { width: thick + 'px', height: L + 'px' } : { width: L + 'px', height: thick + 'px' });
          const thumb = util.el('div', 'cp-thumb', track);
          if (cols) thumb.style.left = thick / 2 + 'px';
          else thumb.style.top = thick / 2 + 'px';
          nums[k] = util.el('span', 'cp-num', row);
          tracks[k] = track;
          ctl[k] = env.ui.slider(hit, {
            label: k,
            thumbs: [thumb],
            values: [M().channels(ctx.model)[i]],
            min: 0,
            max: 255,
            keyboard: !!spec.keys,
            geometry() {
              const r = track.getBoundingClientRect();
              if (cols) return { start: [r.left + r.width / 2, r.top + L - 1], end: [r.left + r.width / 2, r.top] };
              return { start: [r.left, r.top + r.height / 2], end: [r.left + L - 1, r.top + r.height / 2] };
            },
            place: (el, point, f) => {
              if (cols) el.style.top = (1 - f) * (L - 1) + 'px';
              else el.style.left = f * (L - 1) + 'px';
            },
            onInput([val]) {
              const c = M().channels(ctx.model);
              c[i] = val;
              commitRgb(c);
            },
          });
        }
        return {
          anchors: Object.values(tracks),
          paint(m) {
            const c = M().channels(m);
            const r8 = c.map((x) => Math.round(x));
            ['r', 'g', 'b'].forEach((k, i) => {
              const lo = r8.slice();
              const hi = r8.slice();
              lo[i] = 0;
              hi[i] = 255;
              tracks[k].style.background = `linear-gradient(${cols ? 'to top' : 'to right'}, rgb(${lo}), rgb(${hi}))`;
              nums[k].textContent = String(r8[i]);
              ctl[k].set([c[i]]);
            });
          },
          locate(t, m) {
            if (!(t.surface in ctl)) return null;
            const i = 'rgb'.indexOf(t.surface);
            return ctl[t.surface].locate(t.current ? M().channels(m)[i] : t.value);
          },
        };
      }


      // ---------------------------------------------------------------- HSL sliders, vanilla-picker, popover

      const HUE_CSS = __has('HUE_CSS') ? __parts['HUE_CSS'](undefined, __scope) : ('#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00');

      // An unscored alpha slider (transparency distractor): local state, never in the model or the error.
      function buildAlpha(ctx, parent, L, thick, cols) {
        const { util, rng } = ctx;
        const hit = util.el('div', 'cp-hit', parent);
        hit.dataset.role = 'alpha';
        const track = util.el('div', 'cp-alpha', hit);
        Object.assign(track.style, cols ? { width: thick + 'px', height: L + 'px' } : { width: L + 'px', height: thick + 'px' });
        const fill = util.el('div', 'cp-alpha-fill', track);
        const thumb = util.el('div', 'cp-thumb', track);
        if (cols) thumb.style.left = thick / 2 + 'px';
        else thumb.style.top = thick / 2 + 'px';
        let a = rng.int(55, 100) / 100;
        const num = util.el('span', 'cp-num', parent);
        const ctl = env.ui.slider(hit, {
          label: 'alpha',
          thumbs: [thumb],
          values: [a],
          min: 0,
          max: 1,
          geometry() {
            const r = track.getBoundingClientRect();
            if (cols) return { start: [r.left + r.width / 2, r.top + L - 1], end: [r.left + r.width / 2, r.top] };
            return { start: [r.left, r.top + r.height / 2], end: [r.left + L - 1, r.top + r.height / 2] };
          },
          place: (el, point, f) => {
            if (cols) el.style.top = (1 - f) * (L - 1) + 'px';
            else el.style.left = f * (L - 1) + 'px';
          },
          onInput([v]) {
            a = v;
            ctx.log('distractor', { what: 'alpha', value: Number(v.toFixed(2)) });
            num.textContent = Math.round(a * 100) + '%';
          },
        });
        return {
          track,
          paint(m) {
            fill.style.background = `linear-gradient(${cols ? 'to top' : 'to right'}, rgba(0,0,0,0), ${M().hex(M().modelRgb(m))})`;
            ctl.set([a]);
            num.textContent = Math.round(a * 100) + '%';
          },
        };
      }

      // hsl: three H, S, L sliders (rows or columns), optionally with an alpha slider as a distractor.
      function buildHsl(ctx, card, maxH, maxW) {
        const { rng, util, spec } = ctx;
        const fam = F();
        const cols = rng.bool(0.3) && maxH >= fam.helpers.MIN_TRACK_PX + 70;
        const L = cols
          ? Math.max(fam.helpers.MIN_TRACK_PX, Math.min(rng.int(220, 300), maxH - 70))
          : Math.max(fam.helpers.MIN_TRACK_PX, Math.min(rng.int(240, 340), maxW - 110));
        const thick = rng.int(14, 22);
        const box = util.el('div', cols ? 'cp-rgb cols' : 'cp-rgb', card);
        const names = rng.pick([['H', 'S', 'L'], ['Hue', 'Sat', 'Light'], ['Hue', 'Saturation', 'Lightness']]);
        const withAlpha = rng.bool(0.5);
        const KEYS = ['hue', 'sat', 'light'];
        const MAX = { hue: 360, sat: 1, light: 1 };
        const ctl = {};
        const tracks = {};
        const nums = {};
        const rowOf = (name) => {
          const row = util.el('div', 'cp-row', box);
          const lab = util.el('span', 'cp-ch', row, cols ? name[0] : name);
          if (!cols && name.length > 1) lab.style.width = Math.max(...names.map((n) => n.length)) * 8 + 'px';
          return row;
        };
        KEYS.forEach((k, i) => {
          const row = rowOf(names[i]);
          const hit = util.el('div', 'cp-hit', row);
          hit.dataset.role = k;
          const track = util.el('div', 'cp-track', hit);
          Object.assign(track.style, cols ? { width: thick + 'px', height: L + 'px' } : { width: L + 'px', height: thick + 'px' });
          const thumb = util.el('div', 'cp-thumb', track);
          if (cols) thumb.style.left = thick / 2 + 'px';
          else thumb.style.top = thick / 2 + 'px';
          nums[k] = util.el('span', 'cp-num', row);
          nums[k].style.minWidth = '44px';
          tracks[k] = track;
          ctl[k] = env.ui.slider(hit, {
            label: k,
            thumbs: [thumb],
            values: [0],
            min: 0,
            max: MAX[k],
            keyboard: !!spec.keys,
            geometry() {
              const r = track.getBoundingClientRect();
              if (cols) return { start: [r.left + r.width / 2, r.top + L - 1], end: [r.left + r.width / 2, r.top] };
              return { start: [r.left, r.top + r.height / 2], end: [r.left + L - 1, r.top + r.height / 2] };
            },
            place: (el, point, f) => {
              if (cols) el.style.top = (1 - f) * (L - 1) + 'px';
              else el.style.left = f * (L - 1) + 'px';
            },
            onInput([val]) {
              const hsl = M().modelHsl(ctx.model);
              hsl[i] = val;
              commit(M().hslToHsv(hsl[0], hsl[1], hsl[2]));
            },
          });
        });
        const dir = cols ? 'to top' : 'to right';
        tracks.hue.style.background = `linear-gradient(${dir}, ${HUE_CSS})`;
        let alpha = null;
        if (withAlpha) {
          const row = rowOf(names[0].length > 1 ? 'Alpha' : 'A');
          alpha = buildAlpha(ctx, row, L, thick, cols);
        }
        return {
          anchors: [...Object.values(tracks), ...(alpha ? [alpha.track] : [])],
          paint(m) {
            const [h, s, l] = M().modelHsl(m);
            const hs = (S, Lg) => `hsl(${h} ${(S * 100).toFixed(2)}% ${(Lg * 100).toFixed(2)}%)`;
            tracks.sat.style.background = `linear-gradient(${dir}, ${hs(0, l)}, ${hs(1, l)})`;
            tracks.light.style.background = `linear-gradient(${dir}, #000, ${hs(s, 0.5)}, #fff)`;
            nums.hue.textContent = Math.round(h) + '°';
            nums.sat.textContent = Math.round(s * 100) + '%';
            nums.light.textContent = Math.round(l * 100) + '%';
            ctl.hue.set([h]);
            ctl.sat.set([s]);
            ctl.light.set([l]);
            if (alpha) alpha.paint(m);
          },
          locate(t, m) {
            if (!(t.surface in ctl)) return null;
            const [h, s, l] = M().modelHsl(m);
            const cur = { hue: h, sat: s, light: l }[t.surface];
            const v = t.current ? cur : { hue: t.h, sat: t.s, light: t.l }[t.surface];
            return ctl[t.surface].locate(v);
          },
        };
      }

      // sl+hue with the vendored vanilla-picker (inline): HSL square (x saturation, y lightness), hue strip along
      // the top, optionally its own alpha strip (distractor) and Ok button (inert). Its editor field is hidden; typed
      // routes use the side panel's fields. The model follows the library's onChange (HSL -> HSV).
      function buildVanilla(ctx, card, maxH, maxW) {
        const { rng, util } = ctx;
        const fam = F();
        const host = util.el('div', 'cp-vanilla', card);
        let busy = false;
        const alpha = rng.bool(0.7);
        const picker = new Picker({
          parent: host,
          popup: false,
          alpha,
          editor: false,
          cancelButton: false,
          color: M().hex(M().modelRgb(ctx.model)),
        });
        // Set after construction: the initial color would fire it before the widget is ready.
        picker.onChange = (col) => {
          const [h, s, l] = col.hsla;
          busy = true;
          commit(M().hslToHsv(h * 360, s, l));
          busy = false;
        };
        const wrap = host.querySelector('.picker_wrapper');
        const sl = wrap.querySelector('.picker_sl');
        const hue = wrap.querySelector('.picker_hue');
        // Library sizes are in em: pick a font size so the square and the strip are at least MIN_TRACK_PX + 6.
        let px = rng.pick([10.5, 11, 11.5, 12]);
        for (;;) {
          wrap.style.fontSize = px + 'px';
          const ok = sl.offsetWidth >= fam.helpers.MIN_TRACK_PX + 6 && hue.offsetWidth >= fam.helpers.MIN_TRACK_PX + 6;
          if (ok || px >= 14) break;
          px += 0.25;
        }
        return {
          anchors: [sl, hue],
          paint(m) {
            if (busy) return;
            const [h, s, l] = M().modelHsl(m);
            picker._setHSLA(h / 360, s, l, null, { silent: true });
          },
          locate(t, m) {
            const [h0, s0, l0] = M().modelHsl(m);
            if (t.surface === 'hue') {
              const r = hue.getBoundingClientRect();
              return [r.left + ((t.current ? h0 : t.h) / 360) * r.width, r.top + r.height / 2];
            }
            if (t.surface === 'sl') {
              const r = sl.getBoundingClientRect();
              const [s, l] = t.current ? [s0, l0] : [t.s, t.l];
              return [r.left + s * r.width, r.top + (1 - l) * r.height];
            }
            return null;
          },
        };
      }

      // ---------------------------------------------------------------- popover picker

      // A form row with a swatch button; the button opens a popover (sv+hue square, hue strip, optional alpha strip,
      // the current-color block and the typed fields). The popover is always laid out (hidden with visibility) so
      // geometry never changes; a press outside it closes it. model.open is the unscored state.
      let offOutside = __has('offOutside') ? __parts['offOutside'](undefined, __scope) : (null);

      function renderPopover(ctx) {
        ensureStyle();
        const { util, size, rng, spec } = ctx;
        if (offOutside) offOutside();
        const card = util.el('div', 'cp pop', ctx.stage);
        card.style.fontFamily = 'inherit';
        const v = spec.scenario;
        const sideW = v === 'image' ? rng.int(200, 236) : v === 'palette' ? rng.int(190, 220) : v === 'hex-typed' ? rng.int(196, 214) : rng.int(160, 190);
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
        st = { ctx, controls: null, side: null, trigger, pop };
        st.side = buildSide(ctx, card, sideW, { curHost });
        st.controls = {
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
        offOutside = () => { document.removeEventListener('pointerdown', outside, true); offOutside = null; };
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
        return { anchors: [...st.controls.anchors, ...st.side.anchors], sync: () => paintAll() };
      }

      // ---------------------------------------------------------------- widgets

      function render(ctx, build) {
        ensureStyle();
        const { util, size, rng, spec } = ctx;
        const card = util.el('div', 'cp', ctx.stage);
        card.style.fontFamily = 'inherit';
        const v = spec.scenario;
        const sideW = v === 'image' ? rng.int(200, 236) : v === 'palette' ? rng.int(190, 220) : v === 'hex-typed' ? rng.int(196, 214) : rng.int(160, 190);
        const maxH = Math.floor(size.height) - 76;
        const maxW = Math.floor(size.width) - sideW - 80;
        st = { ctx, controls: null, side: null };
        const left = rng.bool(0.25);
        let sideHost = null;
        if (left) sideHost = util.el('div', '', card);
        st.controls = build(ctx, card, maxH, maxW);
        st.side = buildSide(ctx, sideHost || card, sideW);
        if (sideHost) sideHost.replaceWith(sideHost.firstChild);
        paintAll();
        placeCard(card, ctx);
        return { anchors: [...st.controls.anchors, ...st.side.anchors], sync: () => paintAll() };
      }

      const centerOf = __has('centerOf') ? __parts['centerOf'](undefined, __scope) : { centerOf: (el) => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      } }.centerOf;

      function locate(t) {
        const m = st.ctx.model;
        const L = st.side.locators;
        if (t.popover) return centerOf(st.trigger);
        if (t.field) return L.field(t.field);
        if (t.preset !== undefined) return L.preset(t.preset);
        if (t.tool) return L.tool();
        if (t.region) return L.region(t.region);
        const p = st.controls.locate(t, m);
        if (!p) throw new Error(`pick-color/${st.ctx.spec.controls} cannot locate ${JSON.stringify(t)}`);
        return p;
      }

      const SCENARIOS = __has('SCENARIOS') ? __parts['SCENARIOS'](undefined, __scope) : (['swatch', 'hex', 'named', 'palette', 'image', 'hex-typed']);
      if (__has('stmt0.0')) __parts['stmt0.0'](undefined, __scope);
      else for (const [name, controls, build, extra] of [['picker', 'sv+hue', buildPicker], ['wheel', 'wheel+value', buildWheel], ['rgb', 'rgb', buildRgb],
        ['hsl', 'hsl', buildHsl],
        ['vanilla', 'sl+hue', buildVanilla, { uses: [['../vendor/vanilla-picker-2.12.3/vanilla-picker']] }]]) {
        env.widget({
          task: 'pick-color',
          site: 'base',
          name,
          split: 'train',
          scenarios: SCENARIOS,
          traits: { controls },
          render: (ctx) => render(ctx, build),
          locate,
          ...extra,
        });
      }

      env.widget({
        task: 'pick-color',
        site: 'base',
        name: 'popover',
        split: 'train',
        scenarios: SCENARIOS,
        traits: { controls: 'sv+hue', popover: true },
        render: renderPopover,
        locate,
      });
    })();

    return captured;
  }
  env.template('pick-color/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`pick-color/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('pick-color/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`pick-color/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`pick-color/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['pick-color/_base-assets'] });
})();
