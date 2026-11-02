// crop-image/base: the base site's crop-image widgets (box, corners, cropper) as a template. This file is their source.
// The design-* sites that started from a copy of them, and the composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/crop-image.js). A named
// widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/crop-image.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
(function () {
  const HTML = new URL('../../', document.currentScript.src);
  const UNITS = new Set(); // the part keys of the units below, recorded as they run (__has)
  let widgets = null;
  let parts = null;
  function reference(site, __parts) {
    const assets = window.env.templateLib('crop-image/_base-assets');
    const scenes = window.env.templateLib('crop-image/_base-scene');
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/crop-image.js`, HTML).href };
    /*
     * reference / crop / box: the legacy crop page, all scenarios. A canvas image (gradient, noise, landscape,
     * soft blobs or captioned backgrounds, per spec.bg.style) with a dimmed surround, a crop box with
     * rule-of-thirds guides, 8 square handles, and drag-inside-to-move. The outline scenario adds a dashed target
     * rectangle above the dimming. A readout under the image shows the crop in image px. A toolbar above or
     * below the image holds the ratio presets (aspect: Free, 1:1, 4:3, 16:9, 3:2, 2:3, 9:16; with a preset the
     * edge handles hide and corners keep the ratio) and the in-app Apply button (spec.apply; an "Applied" badge
     * shows while the applied crop is current). marquee: no box until the user presses on the image and drags a
     * selection; pressing outside the box later draws a new one. Keyboard episodes: the box is focusable and
     * arrows nudge it by 1 px (Shift: 10 px). The whole editor sits at a sampled spot inside the stage with
     * room around the handles (they never touch the viewport edge) and away from the floating end button.
     * Mechanics: env.ui.cropbox with the task's applyDrag; the 8 handles are children of the box.
     * pan: the image is zoom times larger than the window (overflow hidden; the view scrolls through its scrollLeft /
     * scrollTop, mirrored into model.pan). The wheel over the window pans when the episode allows wheel input
     * (Shift = horizontal); a navigator thumbnail beside it (click or drag) centres the window at that point. Selection
     * works as in marquee. Faces (content scenario) are yellow circles with canvas-drawn features.
     *
     * reference / crop / corners: a dark photo-editor layout (default, outline, position, content, aspect).
     * The image is SVG, the area outside the crop is washed out (not dimmed), the box has a solid rule-of-thirds
     * grid and only four round corner handles, which live outside the box element (siblings in the frame, moved
     * by place()). A side panel shows the crop as W/H/X/Y fields, the aspect presets (functional) and, in apply
     * mode, the Apply button. The outline target is drawn in amber. Face icons (content) are drawn as SVG.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get HANDLES() { return HANDLES; },
        get ARROWS() { return ARROWS; },
        get NAV_W() { return NAV_W; },
        get frame() { return frame; }, set frame(v) { frame = v; },
        get W() { return W; }, set W(v) { W = v; },
        get H() { return H; }, set H(v) { H = v; },
        get crop() { return crop; }, set crop(v) { crop = v; },
        get chips() { return chips; }, set chips(v) { chips = v; },
        get applyBtn() { return applyBtn; }, set applyBtn(v) { applyBtn = v; },
        get ensureStyle() { return ensureStyle; },
        get placeIn() { return placeIn; },
        get drawScene() { return drawScene; },
        get boxFit() { return boxFit; },
        get boxPanNav() { return boxPanNav; },
        get boxPresets() { return boxPresets; },
        get boxApply() { return boxApply; },
        get boxMarquee() { return boxMarquee; },
        get boxKeys() { return boxKeys; },
        get paintScene() { return paintScene; },
        get paintFace() { return paintFace; },
        get place() { return place; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('ensureStyle@0')) ensureStyle = __parts['ensureStyle@0'](ensureStyle, __scope);
      if (__has('placeIn@0')) placeIn = __parts['placeIn@0'](placeIn, __scope);
      if (__has('boxFit')) boxFit = __parts['boxFit'](boxFit, __scope);
      if (__has('boxPanNav')) boxPanNav = __parts['boxPanNav'](boxPanNav, __scope);
      if (__has('boxPresets')) boxPresets = __parts['boxPresets'](boxPresets, __scope);
      if (__has('boxApply')) boxApply = __parts['boxApply'](boxApply, __scope);
      if (__has('boxMarquee')) boxMarquee = __parts['boxMarquee'](boxMarquee, __scope);
      if (__has('boxKeys')) boxKeys = __parts['boxKeys'](boxKeys, __scope);
      if (__has('drawScene@0')) drawScene = __parts['drawScene@0'](drawScene, __scope);
      if (__has('paintScene')) paintScene = __parts['paintScene'](paintScene, __scope);
      if (__has('paintFace')) paintFace = __parts['paintFace'](paintFace, __scope);
      if (__has('place')) place = __parts['place'](place, __scope);

      const CSS = __has('CSS@0') ? __parts['CSS@0'](undefined, __scope) : (assets.BOX_CSS);
      const HANDLES = __has('HANDLES') ? __parts['HANDLES'](undefined, __scope) : (['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']);
      const ARROWS = __has('ARROWS@0') ? __parts['ARROWS@0'](undefined, __scope) : (new Set(['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']));
      const NAV_W = __has('NAV_W') ? __parts['NAV_W'](undefined, __scope) : (130);

      let frame = __has('frame') ? __parts['frame'](undefined, __scope) : undefined;
      let W = __has('W') ? __parts['W'](undefined, __scope) : undefined;
      let H = __has('H') ? __parts['H'](undefined, __scope) : undefined;
      let crop = __has('crop@0') ? __parts['crop@0'](undefined, __scope) : undefined;
      let chips = __has('chips') ? __parts['chips'](undefined, __scope) : undefined;
      let applyBtn = __has('applyBtn') ? __parts['applyBtn'](undefined, __scope) : undefined;

      function ensureStyle() {
        assets.ensureStyle('cr-style', CSS);
      }

      function placeIn(ctx, el, rng, pad = 8) {
        assets.placeEditor(ctx, el, rng, pad);
      }

      // Background (spec.bg.style) and objects on a 2D canvas of W x H px (also used by the cropper widget).
      function drawScene(g, spec, fam, rng) {
        paintScene(g, spec, fam, rng, W, H);
      }

      function paintScene(g, spec, fam, rng, W, H) {
        scenes.paintScene(g, spec, fam, rng, W, H, paintFace);
      }

      // A face icon's features (taskDef.helpers.facePrims, unit square of the object's cell) on the canvas.
      function paintFace(g, fam, o, W, H) {
        scenes.paintFace(g, fam, o, W, H);
      }

      if (__has('stmt0.0')) __parts['stmt0.0'](undefined, __scope);
      else window.megawobCrop = { paintScene };

      function place(el, r, grow = 0) {
        Object.assign(el.style, {
          left: r.l * W - grow + 'px',
          top: r.t * H - grow + 'px',
          width: (r.r - r.l) * W + 2 * grow + 'px',
          height: (r.b - r.t) * H + 2 * grow + 'px',
        });
      }

      function boxFit(spec, rng, size, tools, pan) {
        let VW = 0; // pan: the window onto the image, in px (the image is spec.zoom times larger)
        let VH = 0;

        // Legacy image size (H 380..540 px) at the spec's aspect ratio, shrunk to fit the stage with room for
        // the wrap padding (handles overhang the image by 6 px), the toolbar and the readout.
        const availW = Math.floor(size.width - 2 * 8 - 2 * 14 - 4 - (pan ? NAV_W + 12 : 0));
        const availH = Math.floor(size.height - 2 * 8 - 2 * 14 - 24 - 10 - (tools ? 40 : 0));
        H = Math.min(rng.int(380, 540), availH);
        W = Math.round(H * spec.aspect);
        if (pan) {
          // The window keeps the legacy shape (aspect * zoom.y / zoom.x); the image behind it is larger.
          VH = H;
          VW = Math.round(VH * spec.aspect * spec.zoom.y / spec.zoom.x);
          if (VW > availW) {
            VW = availW;
            VH = Math.round(VW * spec.zoom.x / (spec.aspect * spec.zoom.y));
          }
          W = Math.round(VW * spec.zoom.x);
          H = Math.round(VH * spec.zoom.y);
        } else if (W > availW) {
          W = availW;
          H = Math.round(W / spec.aspect);
        }
        return { VW, VH };
      }

      function boxPanNav(ctx, spec, util, row, view, canvas, VH, panTo) {
        const side = util.el('div', 'cr-side', row);
        const navH = Math.min(VH - 20, Math.round((NAV_W * H) / W));
        const navW = Math.min(NAV_W, Math.round((navH * W) / H));
        const nav = util.el('div', 'cr-nav', side);
        nav.dataset.role = 'navigator';
        Object.assign(nav.style, { width: navW + 'px', height: navH + 'px' });
        const thumb = util.el('canvas', '', nav);
        thumb.width = navW;
        thumb.height = navH;
        thumb.getContext('2d').drawImage(canvas, 0, 0, navW, navH);
        const navRect = util.el('div', 'cr-navwin', nav);
        util.el('div', 'cr-navcap', side, 'Navigator');
        // A press (or drag) on the thumbnail centres the window at that point.
        const centre = (e) => {
          const r = nav.getBoundingClientRect();
          const u = (e.clientX - r.left) / r.width;
          const v = (e.clientY - r.top) / r.height;
          const x = Math.min(1 - spec.view.w, Math.max(0, u - spec.view.w / 2));
          const y = Math.min(1 - spec.view.h, Math.max(0, v - spec.view.h / 2));
          ctx.update({ ...ctx.model, pan: panTo(x, y) });
        };
        nav.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          nav.setPointerCapture(e.pointerId);
          env.log('grab', { what: 'navigator' });
          centre(e);
          const move = (ev) => centre(ev);
          const end = () => {
            nav.removeEventListener('pointermove', move);
            nav.removeEventListener('pointerup', end);
            env.log('release', { what: 'navigator' });
          };
          nav.addEventListener('pointermove', move);
          nav.addEventListener('pointerup', end);
        });
        view.addEventListener('wheel', (e) => {
          if (!spec.panWheel) return;
          e.preventDefault();
          const k = e.deltaMode === 1 ? 16 : 1;
          let dx = e.deltaX * k;
          let dy = e.deltaY * k;
          if (e.shiftKey && !dx) [dx, dy] = [dy, 0];
          ctx.update({ ...ctx.model, pan: panTo(view.scrollLeft / W + dx / W, view.scrollTop / H + dy / H) });
        }, { passive: false });
        return navRect;
      }

      function boxPresets(ctx, spec, util, fam, bar, commit) {
        const chips = {};
        for (const r of ['free', ...fam.RATIOS]) {
          const c = util.el('button', 'cr-chip', bar, r === 'free' ? 'Free' : r);
          c.type = 'button';
          c.dataset.role = 'preset';
          c.addEventListener('click', () => {
            const m = { ...fam.applyRatio(ctx.model, r, spec), ratio: r };
            crop.set(m);
            commit(m);
            env.log('preset', { ratio: r });
          });
          chips[r] = c;
        }
        return chips;
      }

      function boxApply(ctx, spec, util, rng, bar, paintTools) {
        if (chips) util.el('span', 'cr-sep', bar);
        applyBtn = util.el('button', 'cr-apply', bar, rng.pick(['Apply crop', 'Crop', 'Apply', 'Crop image', 'Done cropping']));
        applyBtn.type = 'button';
        applyBtn.dataset.role = 'apply';
        const badge = util.el('span', 'cr-badge', bar);
        applyBtn.addEventListener('click', () => {
          const m = ctx.model;
          ctx.update({ ...m, applied: { l: m.l, t: m.t, r: m.r, b: m.b } });
          env.log('apply-crop');
          if (spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible'); // Apply is the step to ask about
          paintTools();
        });
        return badge;
      }

      function boxMarquee(spec, fam, box, commit) {
        frame.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 || (box.style.display !== 'none' && box.contains(e.target))) return;
          e.preventDefault();
          frame.setPointerCapture(e.pointerId);
          const p0 = crop.toNorm([e.clientX, e.clientY]);
          env.log('grab', { what: 'marquee' });
          const move = (ev) => {
            const r = fam.marqueeRect(p0, crop.toNorm([ev.clientX, ev.clientY]), spec);
            if (!r) return;
            crop.set(r);
            commit({ ...r, on: true });
            crop.set(r);
          };
          const end = (ev) => {
            move(ev);
            frame.removeEventListener('pointermove', move);
            frame.removeEventListener('pointerup', end);
            env.log('release', { what: 'marquee' });
          };
          frame.addEventListener('pointermove', move);
          frame.addEventListener('pointerup', end);
        });
      }

      function boxKeys(ctx, spec, fam, box, commit) {
        box.tabIndex = 0;
        box.addEventListener('pointerdown', () => box.focus({ preventScroll: true }));
        box.addEventListener('keydown', (e) => {
          if (!ARROWS.has(e.key)) return;
          e.preventDefault();
          const m = fam.nudge({ ...ctx.model, px: { W, H } }, (e.shiftKey ? 'Shift+' : '') + e.key, spec);
          crop.set(m);
          commit({ l: m.l, t: m.t, r: m.r, b: m.b });
        });
        box.addEventListener('focus', () => { if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true }); });
        box.addEventListener('blur', () => { if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false }); });
      }

      env.widget({
        task: 'crop-image',
        site: 'base',
        name: 'box',
        split: 'train',
        scenarios: ['default', 'outline', 'position', 'content', 'aspect', 'marquee', 'pan'],

        render(ctx) {
          ensureStyle();
          const { spec, util, rng, size } = ctx;
          const fam = env.taskDef.helpers;
          const tools = spec.scenario === 'aspect' || spec.apply;
          const pan = spec.scenario === 'pan';
          const { VW, VH } = boxFit(spec, rng, size, tools, pan);

          const wrap = util.el('div', 'cr-wrap', ctx.stage);
          let bar = null;
          if (tools) {
            bar = util.el('div', 'cr-tools', wrap);
            bar.dataset.role = 'toolbar';
          }
          // pan: [window | navigator] row; the frame (whole image) scrolls inside the window.
          const row = pan ? util.el('div', 'cr-row', wrap) : wrap;
          let view = null;
          if (pan) {
            view = util.el('div', 'cr-view', row);
            view.dataset.role = 'image-window';
            Object.assign(view.style, { width: VW + 'px', height: VH + 'px' });
          }
          frame = util.el('div', 'cr-frame', view || wrap);
          Object.assign(frame.style, { width: W + 'px', height: H + 'px' });
          const canvas = util.el('canvas', '', frame);
          canvas.dataset.role = 'image';
          canvas.width = W;
          canvas.height = H;
          drawScene(canvas.getContext('2d'), spec, fam, rng);

          const hole = util.el('div', 'cr-hole', util.el('div', 'cr-dim', frame));
          if (spec.scenario === 'outline') place(util.el('div', 'cr-target', frame), spec.target, 1);
          const box = util.el('div', 'cr-box', frame);
          box.dataset.role = 'crop-move';
          util.el('div', 'cr-grid', box);
          const handles = {};
          for (const name of HANDLES) {
            const h = util.el('div', 'cr-handle', box);
            h.dataset.role = 'handle-' + name;
            const [fx, fy] = fam.handlePoint({ l: 0, t: 0, r: 1, b: 1 }, name);
            Object.assign(h.style, { left: fx * 100 + '%', top: fy * 100 + '%' });
            handles[name] = h;
          }
          const readout = util.el('div', 'cr-readout', wrap);
          if (bar && rng.bool(0.4)) wrap.append(bar);

          // pan: the window position (spec.view-sized, model.pan) is the view's scroll offset; the wheel (when the
          // episode allows it) and a navigator thumbnail move it.
          let navRect = null;
          const panTo = (x, y) => {
            view.scrollLeft = Math.round(x * W);
            view.scrollTop = Math.round(y * H);
            const p = { x: Math.round((view.scrollLeft / W) * 1e4) / 1e4, y: Math.round((view.scrollTop / H) * 1e4) / 1e4 };
            paintNav(p);
            return p;
          };
          const paintNav = (p) => {
            if (!navRect) return;
            Object.assign(navRect.style, { left: p.x * 100 + '%', top: p.y * 100 + '%', width: spec.view.w * 100 + '%', height: spec.view.h * 100 + '%' });
          };
          if (pan) {
            navRect = boxPanNav(ctx, spec, util, row, view, canvas, VH, panTo);
          }

          const showBox = () => {
            const off = (spec.scenario === 'marquee' || pan) && !ctx.model.on;
            box.style.display = off ? 'none' : '';
            frame.classList.toggle('empty', off);
            frame.classList.toggle('cr-locked', !!fam.ratioValue(ctx.model.ratio));
          };
          let badge = null;
          const paintTools = () => {
            if (chips) for (const [r, c] of Object.entries(chips)) c.classList.toggle('on', (ctx.model.ratio || 'free') === r);
            if (badge) {
              const m = ctx.model;
              const ok = m.applied && ['l', 't', 'r', 'b'].every((k) => Math.abs(m.applied[k] - m[k]) <= 0.002);
              badge.textContent = ok ? 'Applied ✓' : '';
            }
          };
          // Every change of the rectangle (drag, marquee, preset, key) un-applies an applied crop.
          const commit = (m) => {
            ctx.update({ ...ctx.model, ...m, ...(spec.apply ? { applied: null } : {}) });
            showBox();
            paintTools();
          };

          chips = null;
          applyBtn = null;
          if (spec.scenario === 'aspect') {
            chips = boxPresets(ctx, spec, util, fam, bar, commit);
          }
          if (spec.apply) {
            badge = boxApply(ctx, spec, util, rng, bar, paintTools);
          }

          crop = env.ui.cropbox(frame, box, {
            value: { l: ctx.model.l, t: ctx.model.t, r: ctx.model.r, b: ctx.model.b },
            handles,
            apply: (r, action, dx, dy) => fam.applyDrag({ ...r, ratio: ctx.model.ratio }, action, dx, dy, spec),
            place: (el, m) => {
              place(hole, m);
              place(el, m);
              const px = (v, s) => Math.round(v * s);
              readout.textContent = (spec.scenario === 'marquee' || pan) && !ctx.model.on ? 'No selection - drag on the image to select'
                : `Crop: ${px(m.r - m.l, W)} × ${px(m.b - m.t, H)} px at (${px(m.l, W)}, ${px(m.t, H)})`;
            },
            onInput: (m) => commit(m),
          });

          // Marquee: a press on the image outside the box draws a new selection.
          if (spec.scenario === 'marquee' || pan) {
            boxMarquee(spec, fam, box, commit);
          }

          // Keyboard nudging of the focused box.
          if (spec.keys) {
            boxKeys(ctx, spec, fam, box, commit);
          }

          showBox();
          paintTools();
          crop.set(ctx.model);
          // Pin the column at its rendered width and keep the toolbar on one line at its own width: on a narrow image
          // (traits.aspect) the toolbar or readout can be wider than the image, and their text changing (Applied ✓, the
          // size readout) must not shift the image.
          if (bar) bar.style.width = 'max-content';
          wrap.style.width = `${wrap.getBoundingClientRect().width}px`;
          placeIn(ctx, wrap, rng);
          // Mirror the rendered image size (unscored) for the keyboard / pan plan.
          ctx.update({ ...ctx.model, px: { W, H }, ...(pan ? { pan: panTo(ctx.model.pan.x, ctx.model.pan.y) } : {}) });
          return {
            anchors: [view || frame],
            sync: (m) => {
              crop.set(m);
              showBox();
              paintTools();
              if (pan && m.pan) panTo(m.pan.x, m.pan.y);
            },
          };
        },

        locate(t) {
          if (t.view) return env.util.center(frame.parentElement);
          if (t.nav) {
            const r = frame.closest('.cr-wrap').querySelector('.cr-nav').getBoundingClientRect();
            return [r.left + t.nav[0] * r.width, r.top + t.nav[1] * r.height];
          }
          if (t.mark) return crop.locate(t.mark);
          if (t.preset) return env.util.center(chips[t.preset]);
          if (t.apply) return env.util.center(applyBtn);
          return crop.locateHandle(t.handle, t.rect);
        },
      });
    })();

    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get CORNERS() { return CORNERS; },
        get ARROWS() { return ARROWS; },
        get crop() { return crop; }, set crop(v) { crop = v; },
        get presetEls() { return presetEls; }, set presetEls(v) { presetEls = v; },
        get applyEl() { return applyEl; }, set applyEl(v) { applyEl = v; },
        get ensureStyle() { return ensureStyle; },
        get placeIn() { return placeIn; },
        get drawScene() { return drawScene; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+1.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('ensureStyle@1')) ensureStyle = __parts['ensureStyle@1'](ensureStyle, __scope);
      if (__has('placeIn@1')) placeIn = __parts['placeIn@1'](placeIn, __scope);
      if (__has('drawScene@1')) drawScene = __parts['drawScene@1'](drawScene, __scope);

      const CSS = __has('CSS@1') ? __parts['CSS@1'](undefined, __scope) : (assets.CORNERS_CSS);
      const CORNERS = __has('CORNERS') ? __parts['CORNERS'](undefined, __scope) : (['nw', 'ne', 'se', 'sw']);
      const ARROWS = __has('ARROWS@1') ? __parts['ARROWS@1'](undefined, __scope) : (new Set(['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']));

      let crop = __has('crop@1') ? __parts['crop@1'](undefined, __scope) : undefined;
      let presetEls = __has('presetEls') ? __parts['presetEls'](undefined, __scope) : undefined;
      let applyEl = __has('applyEl') ? __parts['applyEl'](undefined, __scope) : undefined;

      function ensureStyle() {
        assets.ensureStyle('cc-style', CSS);
      }

      function placeIn(ctx, el, rng, pad = 8) {
        assets.placeEditor(ctx, el, rng, pad);
      }

      function drawScene(svg, spec, fam, W, H, util, rng) {
        scenes.drawSvgScene(svg, spec, fam, W, H, util, rng);
      }

      env.widget({
        task: 'crop-image',
        site: 'base',
        name: 'corners',
        split: 'train',
        scenarios: ['default', 'outline', 'position', 'content', 'aspect'],

        render(ctx) {
          ensureStyle();
          const { spec, util, rng, size } = ctx;
          const fam = env.taskDef.helpers;
          const side = 170;
          const availW = Math.floor(size.width - side - 36 - 2 * 8 - 4);
          const availH = Math.floor(size.height - 36 - 2 * 8 - 4);
          let H = Math.min(rng.int(360, 520), availH);
          let W = Math.round(H * spec.aspect);
          if (W > availW) {
            W = availW;
            H = Math.round(W / spec.aspect);
          }

          const editor = util.el('div', 'cc-editor', ctx.stage);
          const pane = util.el('div', 'cc-canvas', editor);
          const frame = util.el('div', 'cc-frame', pane);
          Object.assign(frame.style, { width: W + 2 + 'px', height: H + 2 + 'px' });
          const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, frame);
          svg.dataset.role = 'image';
          drawScene(svg, spec, fam, W, H, util, rng);

          const px = (el, r, grow = 0) => Object.assign(el.style, {
            left: r.l * W - grow + 'px', top: r.t * H - grow + 'px',
            width: (r.r - r.l) * W + 2 * grow + 'px', height: (r.b - r.t) * H + 2 * grow + 'px',
          });
          const hole = util.el('div', 'cc-hole', util.el('div', 'cc-wash', frame));
          if (spec.scenario === 'outline') px(util.el('div', 'cc-target', frame), spec.target, 1);
          const box = util.el('div', 'cc-box', frame);
          box.dataset.role = 'crop-move';
          const grid = util.svg('svg', { viewBox: '0 0 3 3', preserveAspectRatio: 'none' }, box);
          for (const k of [1, 2]) {
            util.svg('line', { x1: k, y1: 0, x2: k, y2: 3, stroke: 'rgba(255,255,255,.75)', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }, grid);
            util.svg('line', { x1: 0, y1: k, x2: 3, y2: k, stroke: 'rgba(255,255,255,.75)', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }, grid);
          }
          const knobs = {};
          for (const name of CORNERS) {
            const k = util.el('div', 'cc-knob ' + name, frame);
            k.dataset.role = 'handle-' + name;
            knobs[name] = k;
          }

          const panel = util.el('div', 'cc-side', editor);
          util.el('h4', '', panel, 'Crop');
          const presets = util.el('div', 'cc-presets', panel);
          presetEls = {};
          const ratios = spec.scenario === 'aspect' ? ['free', ...fam.RATIOS] : ['free', '1:1', '4:3', '16:9', '3:2'];
          let state = null;
          const paint = () => {
            for (const [r, el] of Object.entries(presetEls)) el.classList.toggle('on', (ctx.model.ratio || 'free') === r);
            if (state) {
              const m = ctx.model;
              const ok = m.applied && ['l', 't', 'r', 'b'].every((k) => Math.abs(m.applied[k] - m[k]) <= 0.002);
              state.textContent = ok ? 'Crop applied ✓' : '';
            }
          };
          const commit = (m) => {
            ctx.update({ ...ctx.model, ...m, ...(spec.apply ? { applied: null } : {}) });
            paint();
          };
          for (const r of ratios) {
            const el = util.el('span', '', presets, r === 'free' ? 'Free' : r);
            el.dataset.role = 'preset';
            presetEls[r] = el;
            // Presets work in the aspect scenario; elsewhere they are decoration.
            if (spec.scenario === 'aspect') {
              el.addEventListener('click', () => {
                const m = { ...fam.applyRatio(ctx.model, r, spec), ratio: r };
                crop.set(m);
                commit(m);
                env.log('preset', { ratio: r });
              });
            }
          }
          util.el('h4', '', panel, 'Selection');
          const fields = {};
          for (const k of ['W', 'H', 'X', 'Y']) {
            const f = util.el('div', 'cc-field', panel);
            util.el('em', '', f, k);
            fields[k] = util.el('span', '', f);
          }
          applyEl = null;
          if (spec.apply) {
            applyEl = util.el('button', 'cc-apply', panel, rng.pick(['Apply crop', 'Crop', 'Apply']));
            applyEl.type = 'button';
            applyEl.dataset.role = 'apply';
            state = util.el('div', 'cc-state', panel);
            applyEl.addEventListener('click', () => {
              const m = ctx.model;
              ctx.update({ ...m, applied: { l: m.l, t: m.t, r: m.r, b: m.b } });
              env.log('apply-crop');
              if (spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible'); // Apply is the step to ask about
              paint();
            });
          }

          crop = env.ui.cropbox(frame, box, {
            value: { l: ctx.model.l, t: ctx.model.t, r: ctx.model.r, b: ctx.model.b },
            handles: knobs,
            apply: (r, action, dx, dy) => fam.applyDrag({ ...r, ratio: ctx.model.ratio }, action, dx, dy, spec),
            place: (el, m) => {
              px(hole, m);
              px(el, m);
              for (const name of CORNERS) {
                const [x, y] = fam.handlePoint(m, name);
                Object.assign(knobs[name].style, { left: x * W + 'px', top: y * H + 'px' });
              }
              const r = (v, s) => Math.round(v * s);
              fields.W.textContent = r(m.r - m.l, W) + ' px';
              fields.H.textContent = r(m.b - m.t, H) + ' px';
              fields.X.textContent = r(m.l, W);
              fields.Y.textContent = r(m.t, H);
            },
            onInput: (m) => commit(m),
          });

          if (spec.keys) {
            box.tabIndex = 0;
            box.addEventListener('pointerdown', () => box.focus({ preventScroll: true }));
            box.addEventListener('keydown', (e) => {
              if (!ARROWS.has(e.key)) return;
              e.preventDefault();
              const m = fam.nudge({ ...ctx.model, px: { W, H } }, (e.shiftKey ? 'Shift+' : '') + e.key, spec);
              crop.set(m);
              commit({ l: m.l, t: m.t, r: m.r, b: m.b });
            });
            box.addEventListener('focus', () => { if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true }); });
            box.addEventListener('blur', () => { if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false }); });
          }
          paint();
          // Pin the editor at its rendered height: on a wide image (traits.aspect) the side panel is the taller column,
          // and the "Crop applied" line growing it must not re-centre the image.
          editor.style.height = `${editor.getBoundingClientRect().height}px`;
          placeIn(ctx, editor, rng);
          ctx.update({ ...ctx.model, px: { W, H } });
          return { anchors: [frame], sync: (m) => { crop.set(m); paint(); } };
        },

        // plan() uses 'move', 'nw', 'se' (corners only when a ratio is locked), presets and Apply.
        locate(t) {
          if (t.preset) return env.util.center(presetEls[t.preset]);
          if (t.apply) return env.util.center(applyEl);
          return crop.locateHandle(t.handle, t.rect);
        },
      });
    })();

    /*
     * reference / crop / cropper: Cropper.js 1.6.2 (vendor/cropperjs-1.6.2, MIT) wrapping an image made from the
     * same procedural scene (a PNG data URL). The library draws everything the agent touches: the dark modal outside
     * the crop, dashed guides, the centre cross, 8 round-edged handles and the move face; dragging outside the box
     * draws a new one (marquee: autoCrop off, no box at first). default, outline (a dashed target overlay above the
     * image), position, content (signs and face icons), aspect (ratio chips call setAspectRatio, which re-centres the
     * box as the library does; model.ratio follows the chip), marquee. An Apply button (spec.apply) and a size readout
     * sit around the image. No keyboard nudging (traits.keys = false) and no pan scenario.
     * The library runs in the page only; zoom, rotate, scale, wheel and double-click mode toggling are off, the model
     * (normalized rect) is read from the `crop` event (natural px) and written with setData.
     * Loading: the widget file adds the library's script and style tags itself when the page URL asks for this widget
     * (the kit has no per-widget script list; see the report), and the Cropper instance appears a few ms after render
     * (image decode), so locate() falls back to the host's centre until then.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get BASE() { return BASE; },
        get CSS() { return CSS; },
        get POINTS() { return POINTS; },
        get near() { return near; },
        get libWait() { return libWait; }, set libWait(v) { libWait = v; },
        get cur() { return cur; }, set cur(v) { cur = v; },
        get loadLib() { return loadLib; },
        get cpPresets() { return cpPresets; },
        get cpApply() { return cpApply; },
        get cpStepIn() { return cpStepIn; },
        get cpOptions() { return cpOptions; },
        get ensureStyle() { return ensureStyle; },
        get placeIn() { return placeIn; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+2.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('cpPresets')) cpPresets = __parts['cpPresets'](cpPresets, __scope);
      if (__has('cpApply')) cpApply = __parts['cpApply'](cpApply, __scope);
      if (__has('cpStepIn')) cpStepIn = __parts['cpStepIn'](cpStepIn, __scope);
      if (__has('cpOptions')) cpOptions = __parts['cpOptions'](cpOptions, __scope);
      if (__has('loadLib')) loadLib = __parts['loadLib'](loadLib, __scope);
      if (__has('ensureStyle@2')) ensureStyle = __parts['ensureStyle@2'](ensureStyle, __scope);
      if (__has('placeIn@2')) placeIn = __parts['placeIn@2'](placeIn, __scope);

      const BASE = __has('BASE') ? __parts['BASE'](undefined, __scope) : (new URL('../vendor/cropperjs-1.6.2/', scriptOf.src).href);
      let libWait = __has('libWait') ? __parts['libWait'](undefined, __scope) : (null);
      function loadLib() {
        if (window.Cropper) return Promise.resolve();
        if (libWait) return libWait;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = BASE + 'cropper.min.css';
        document.head.append(link);
        libWait = new Promise((ok, fail) => {
          const sc = document.createElement('script');
          sc.src = BASE + 'cropper.min.js';
          sc.onload = ok;
          sc.onerror = () => fail(new Error('failed to load cropper.min.js'));
          document.head.append(sc);
        });
        return libWait;
      }
      if (__has('stmt2.0')) __parts['stmt2.0'](undefined, __scope);
      else if (/[?&]skin=cropper(&|$)/.test(location.search)) loadLib();

      const CSS = __has('CSS@2') ? __parts['CSS@2'](undefined, __scope) : (assets.CROPPER_CSS);

      const POINTS = __has('POINTS') ? __parts['POINTS'](undefined, __scope) : (['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']);
      let cur = __has('cur') ? __parts['cur'](undefined, __scope) : (null); // { ctx, host, getCropper() , chips, applyBtn }

      function ensureStyle() {
        assets.ensureStyle('cp-style', CSS);
      }

      function placeIn(ctx, el, rng, pad = 8) {
        assets.placeCropper(ctx, el, rng, pad);
      }

      const near = __has('near') ? __parts['near'](undefined, __scope) : { near: (a, b) => Math.abs(a - b) <= 1e-3 }.near;

      function cpPresets(spec, util, fam, bar, getCropper, rectFrom, commit) {
        const chips = {};
        for (const r of ['free', ...fam.RATIOS]) {
          const c = util.el('button', 'cp-chip', bar, r === 'free' ? 'Free' : r);
          c.type = 'button';
          c.dataset.role = 'preset';
          c.addEventListener('click', () => {
            const cropper = getCropper();
            if (!cropper || !cropper.ready) return;
            cropper.setAspectRatio(fam.ratioValue(r) || NaN);
            env.log('preset', { ratio: r });
            commit({ ...rectFrom(cropper.getData()), ratio: r });
          });
          chips[r] = c;
        }
        return chips;
      }

      function cpApply(ctx, spec, util, rng, bar, chips, paintTools) {
        if (chips) util.el('span', 'cp-sep', bar);
        const applyBtn = util.el('button', 'cp-apply', bar, rng.pick(['Apply crop', 'Crop', 'Apply', 'Crop image', 'Done cropping']));
        applyBtn.type = 'button';
        applyBtn.dataset.role = 'apply';
        const badge = util.el('span', 'cp-badge', bar);
        applyBtn.addEventListener('click', () => {
          const m = ctx.model;
          ctx.update({ ...m, applied: { l: m.l, t: m.t, r: m.r, b: m.b } });
          env.log('apply-crop');
          if (spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible'); // Apply is the step to ask about
          paintTools();
        });
        return { applyBtn, badge };
      }

      function cpStepIn(getCropper) {
        return (e) => {
          const c = getCropper();
          if (!c || e.__megawobStep || c.action !== 'crop' || !c.pointers) return;
          const p = c.pointers[e.pointerId || 0];
          if (!p) return;
          const dx = e.clientX - p.startX;
          const dy = e.clientY - p.startY;
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
          const mid = new PointerEvent('pointermove', {
            bubbles: true, cancelable: true, composed: true, pointerId: e.pointerId, pointerType: e.pointerType,
            isPrimary: e.isPrimary, button: e.button, buttons: e.buttons,
            clientX: p.startX + Math.sign(dx || 1) * 2, clientY: p.startY + Math.sign(dy || 1) * 2,
          });
          mid.__megawobStep = true;
          e.target.dispatchEvent(mid);
        };
      }

      function cpOptions(spec, fam, m, show, natData, paintTools, fromCropper) {
        return {
          viewMode: 1,
          dragMode: 'crop',
          autoCrop: show,
          data: show ? natData(m) : undefined,
          aspectRatio: spec.scenario === 'aspect' ? fam.ratioValue(m.ratio) || NaN : NaN,
          responsive: false,
          restore: false,
          checkCrossOrigin: false,
          checkOrientation: false,
          zoomable: false,
          zoomOnTouch: false,
          zoomOnWheel: false,
          movable: false,
          rotatable: false,
          scalable: false,
          toggleDragModeOnDblclick: false,
          minCropBoxWidth: 20,
          minCropBoxHeight: 20,
          ready() {
            paintTools();
          },
          crop() {
            fromCropper();
          },
        };
      }

      env.widget({
        task: 'crop-image',
        site: 'base',
        name: 'cropper',
        split: 'train',
        scenarios: ['default', 'outline', 'position', 'content', 'aspect', 'marquee'],
        traits: { keys: false },

        render(ctx) {
          ensureStyle();
          const { spec, util, rng, size } = ctx;
          const fam = env.taskDef.helpers;
          const tools = spec.scenario === 'aspect' || spec.apply;
          const availW = Math.floor(size.width - 2 * 8 - 2 * 12 - 4);
          const availH = Math.floor(size.height - 2 * 8 - 2 * 12 - 24 - 10 - (tools ? 40 : 0));
          let H = Math.min(rng.int(380, 540), availH);
          let W = Math.round(H * spec.aspect);
          if (W > availW) {
            W = availW;
            H = Math.round(W / spec.aspect);
          }
          const wrap = util.el('div', 'cp-wrap', ctx.stage);
          const bar = tools ? util.el('div', 'cp-tools', wrap) : null;
          const host = util.el('div', 'cp-host', wrap);
          host.dataset.role = 'image';
          Object.assign(host.style, { width: W + 'px', height: H + 'px' });
          const readout = util.el('div', 'cp-readout', wrap);
          if (bar && rng.bool(0.4)) wrap.append(bar);

          // The scene as a PNG: the canvas is drawn by the box widget's painter and read back once.
          const canvas = document.createElement('canvas');
          canvas.width = W;
          canvas.height = H;
          window.megawobCrop.paintScene(canvas.getContext('2d'), spec, fam, rng, W, H);
          const img = util.el('img', '', host);
          img.alt = 'photo';
          img.src = canvas.toDataURL('image/png');
          if (spec.scenario === 'outline') {
            const t = spec.target;
            const tg = util.el('div', 'cp-target', host);
            Object.assign(tg.style, { left: t.l * 100 + '%', top: t.t * 100 + '%', width: (t.r - t.l) * 100 + '%', height: (t.b - t.t) * 100 + '%' });
          }

          let cropper = null;
          let applied = null;
          const rectFrom = (d) => {
            const nat = cropper.getImageData();
            const r4 = (v) => Math.round(v * 1e4) / 1e4;
            const l = Math.max(0, d.x / nat.naturalWidth);
            const t = Math.max(0, d.y / nat.naturalHeight);
            return { l: r4(l), t: r4(t), r: r4(Math.min(1, l + d.width / nat.naturalWidth)), b: r4(Math.min(1, t + d.height / nat.naturalHeight)) };
          };
          const same = (a, b) => a && b && ['l', 't', 'r', 'b'].every((k) => near(a[k], b[k]));
          let chips = null;
          let applyBtn = null;
          let badge = null;
          const paintTools = () => {
            const m = ctx.model;
            if (chips) for (const [r, c] of Object.entries(chips)) c.classList.toggle('on', (m.ratio || 'free') === r);
            if (badge) badge.textContent = m.applied && same(m.applied, m) ? 'Applied ✓' : '';
            const nat = cropper && cropper.ready ? cropper.getImageData() : null;
            const px = (v, s) => Math.round(v * s);
            const on = !(spec.scenario === 'marquee' && !m.on);
            readout.textContent = !on ? 'No selection - drag on the image to select'
              : `Crop: ${px(m.r - m.l, nat ? nat.naturalWidth : W)} × ${px(m.b - m.t, nat ? nat.naturalHeight : H)} px at (${px(m.l, nat ? nat.naturalWidth : W)}, ${px(m.t, nat ? nat.naturalHeight : H)})`;
          };
          // Every change of the rectangle un-applies an applied crop.
          const commit = (m) => {
            ctx.update({ ...ctx.model, ...m, ...(spec.apply ? { applied: null } : {}) });
            paintTools();
          };
          const fromCropper = () => {
            if (!cropper || !cropper.ready || !cropper.cropped) return;
            const r = rectFrom(cropper.getData());
            const m = ctx.model;
            if (same(r, m) && (spec.scenario !== 'marquee' || m.on)) return;
            commit({ ...r, ...(spec.scenario === 'marquee' ? { on: true } : {}) });
          };

          if (spec.scenario === 'aspect') {
            chips = cpPresets(spec, util, fam, bar, () => cropper, rectFrom, commit);
          }
          if (spec.apply) {
            ({ applyBtn, badge } = cpApply(ctx, spec, util, rng, bar, chips, paintTools));
          }

          const natData = (m) => ({ x: m.l * W, y: m.t * H, width: (m.r - m.l) * W, height: (m.b - m.t) * H });
          const start = () => {
            const m = ctx.model;
            const show = !(spec.scenario === 'marquee' && !m.on);
            cropper = new window.Cropper(img, cpOptions(spec, fam, m, show, natData, paintTools, fromCropper));
          };
          // Cropper.js opens a marquee in two steps: the first pointermove after the press only creates a minimum-size
          // box at the press point and picks the resize direction, later moves resize it. A drag whose first move is
          // already at the end point (one-shot drag actions) would leave that minimum box, so an intermediate move a
          // few px along the drag runs first, as the many small moves of a hand drag would deliver.
          const stepIn = cpStepIn(() => cropper);
          window.addEventListener('pointermove', stepIn, true);
          loadLib().then(() => { if (cur && cur.host === host) start(); });
          cur = { ctx, host, spec, fam, getCropper: () => cropper, chips, applyBtn, size: { W, H } };
          ctx.update({ ...ctx.model, px: { W, H } }); // the task's facts() reads the crop size in image px

          paintTools();
          placeIn(ctx, wrap, rng);
          return {
            anchors: [host],
            sync: (m) => {
              paintTools();
              if (!cropper || !cropper.ready) return;
              if (spec.scenario === 'marquee' && !m.on) {
                if (cropper.cropped) cropper.clear();
                return;
              }
              if (spec.scenario === 'aspect') cropper.setAspectRatio(fam.ratioValue(m.ratio) || NaN);
              if (!cropper.cropped) cropper.crop();
              if (!same(rectFrom(cropper.getData()), m)) cropper.setData(natData(m));
            },
          };
        },

        locate(t) {
          const { host, getCropper, chips, applyBtn, ctx } = cur;
          const cropper = getCropper();
          const hostC = env.util.center(host);
          if (t.preset) return env.util.center(chips[t.preset]);
          if (t.apply) return env.util.center(applyBtn);
          if (!cropper || !cropper.ready) return hostC;
          const cv = host.querySelector('.cropper-canvas').getBoundingClientRect();
          const toView = ([u, v]) => [cv.left + u * cv.width, cv.top + v * cv.height];
          if (t.mark) return toView(t.mark);
          const fam = cur.fam;
          const el = t.handle === 'move' ? host.querySelector('.cropper-face') : host.querySelector(`.cropper-point.point-${t.handle}`);
          if (!el) return hostC;
          const r = el.getBoundingClientRect();
          const at = [r.left + r.width / 2, r.top + r.height / 2];
          if (!t.rect) return at;
          const m = ctx.model;
          const [u0, v0] = fam.handlePoint({ l: m.l, t: m.t, r: m.r, b: m.b }, t.handle);
          const [u1, v1] = fam.handlePoint(t.rect, t.handle);
          return [at[0] + (u1 - u0) * cv.width, at[1] + (v1 - v0) * cv.height];
        },
      });
    })();

    return captured;
  }
  env.template('crop-image/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`crop-image/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('crop-image/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`crop-image/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`crop-image/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['crop-image/_base-assets', 'crop-image/_base-scene'] });
})();
