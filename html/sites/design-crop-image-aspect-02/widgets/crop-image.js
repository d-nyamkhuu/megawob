// Design on templates/crop-image/base.js: the base site's crop-image widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-aspect-02',
  name: 'design',
  split: 'train',
  scenarios: ['aspect'],
  template: 'crop-image/base',
  design: {
    parts: {
      'box.render': (base, S) => function render(ctx) {
        const { ARROWS, HANDLES, NAV_W, drawScene, ensureStyle, env, place, placeIn } = S;
        ensureStyle();
        const { spec, util, rng, size } = ctx;
        const fam = env.taskDef.helpers;
        const tools = spec.scenario === 'aspect' || spec.apply;
        const pan = spec.scenario === 'pan';
        let VW = 0; // pan: the window onto the image, in px (the image is spec.zoom times larger)
        let VH = 0;

        // Legacy image size (H 380..540 px) at the spec's aspect ratio, shrunk to fit the stage with room for
        // the wrap padding (handles overhang the image by 6 px), the toolbar and the readout.
        const availW = Math.floor(size.width - 2 * 8 - 2 * 14 - 4 - (pan ? NAV_W + 12 : 0));
        const availH = Math.floor(size.height - 2 * 8 - 2 * 14 - 24 - 10 - (tools ? 40 : 0));
        S.H = Math.min(rng.int(380, 540), availH);
        S.W = Math.round(S.H * spec.aspect);
        if (pan) {
          // The window keeps the legacy shape (aspect * zoom.y / zoom.x); the image behind it is larger.
          VH = S.H;
          VW = Math.round(VH * spec.aspect * spec.zoom.y / spec.zoom.x);
          if (VW > availW) {
            VW = availW;
            VH = Math.round(VW * spec.zoom.x / (spec.aspect * spec.zoom.y));
          }
          S.W = Math.round(VW * spec.zoom.x);
          S.H = Math.round(VH * spec.zoom.y);
        } else if (S.W > availW) {
          S.W = availW;
          S.H = Math.round(S.W / spec.aspect);
        }
        // The aspect reference design uses a portrait artwork sheet. Keep the scene in
        // normalized image coordinates, but draw it into a portrait pixel surface.
        if (!pan && spec.scenario === 'aspect') {
          S.H = Math.min(684, availH);
          S.W = Math.min(Math.round(S.H * 0.756), availW);
          S.H = Math.min(S.H, Math.round(S.W / 0.756));
        }

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
        S.frame = util.el('div', 'cr-frame', view || wrap);
        Object.assign(S.frame.style, { width: S.W + 'px', height: S.H + 'px' });
        const canvas = util.el('canvas', '', S.frame);
        canvas.dataset.role = 'image';
        canvas.width = S.W;
        canvas.height = S.H;
        drawScene(canvas.getContext('2d'), spec, fam, rng);

        const hole = util.el('div', 'cr-hole', util.el('div', 'cr-dim', S.frame));
        const box = util.el('div', 'cr-box', S.frame);
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
        let nav = null;
        let navRect = null;
        const panTo = (x, y) => {
          view.scrollLeft = Math.round(x * S.W);
          view.scrollTop = Math.round(y * S.H);
          const p = { x: Math.round((view.scrollLeft / S.W) * 1e4) / 1e4, y: Math.round((view.scrollTop / S.H) * 1e4) / 1e4 };
          paintNav(p);
          return p;
        };
        const paintNav = (p) => {
          if (!navRect) return;
          Object.assign(navRect.style, { left: p.x * 100 + '%', top: p.y * 100 + '%', width: spec.view.w * 100 + '%', height: spec.view.h * 100 + '%' });
        };
        if (pan) {
          const side = util.el('div', 'cr-side', row);
          const navH = Math.min(VH - 20, Math.round((NAV_W * S.H) / S.W));
          const navW = Math.min(NAV_W, Math.round((navH * S.W) / S.H));
          nav = util.el('div', 'cr-nav', side);
          nav.dataset.role = 'navigator';
          Object.assign(nav.style, { width: navW + 'px', height: navH + 'px' });
          const thumb = util.el('canvas', '', nav);
          thumb.width = navW;
          thumb.height = navH;
          thumb.getContext('2d').drawImage(canvas, 0, 0, navW, navH);
          navRect = util.el('div', 'cr-navwin', nav);
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
            ctx.update({ ...ctx.model, pan: panTo(view.scrollLeft / S.W + dx / S.W, view.scrollTop / S.H + dy / S.H) });
          }, { passive: false });
        }

        const showBox = () => {
          const off = (spec.scenario === 'marquee' || pan) && !ctx.model.on;
          box.style.display = off ? 'none' : '';
          S.frame.classList.toggle('empty', off);
          S.frame.classList.toggle('cr-locked', !!fam.ratioValue(ctx.model.ratio));
        };
        const paintInspector = (m) => {
          const rows = document.querySelectorAll('.bitmap .aside .property-row');
          const vals = [
            Math.round(m.l * S.W), Math.round(m.t * S.H),
            Math.round((m.r - m.l) * S.W), Math.round((m.b - m.t) * S.H),
          ];
          // The first four rows are file metadata; the next four are the live crop rectangle.
          for (let i = 0; i < 4; i++) {
            const row = rows[i + 4];
            if (row && row.children[1]) row.children[1].textContent = vals[i] + ' px';
          }
          const ratioRow = Array.from(document.querySelectorAll('.bitmap .aside .property-row')).find(x => x.textContent.includes('Aspect Ratio'));
          if (ratioRow) ratioRow.textContent = `Aspect Ratio:     ${m.ratio || 'free'}`;
        };
        let badge = null;
        const paintTools = () => {
          if (S.chips) for (const [r, c] of Object.entries(S.chips)) c.classList.toggle('on', (ctx.model.ratio || 'free') === r);
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

        S.chips = null;
        S.applyBtn = null;
        if (spec.scenario === 'aspect') {
          S.chips = {};
          for (const r of ['free', ...fam.RATIOS]) {
            const c = util.el('button', 'cr-chip', bar, r === 'free' ? 'Free' : r);
            c.type = 'button';
            c.dataset.role = 'preset';
            c.addEventListener('click', () => {
              const m = { ...fam.applyRatio(ctx.model, r, spec), ratio: r };
              S.crop.set(m);
              commit(m);
              env.log('preset', { ratio: r });
            });
            S.chips[r] = c;
          }
        }
        if (spec.apply) {
          if (S.chips) util.el('span', 'cr-sep', bar);
          S.applyBtn = util.el('button', 'cr-apply', bar, rng.pick(['Apply crop', 'Crop', 'Apply', 'Crop image', 'Done cropping']));
          S.applyBtn.type = 'button';
          S.applyBtn.dataset.role = 'apply';
          badge = util.el('span', 'cr-badge', bar);
          S.applyBtn.addEventListener('click', () => {
            const m = ctx.model;
            ctx.update({ ...m, applied: { l: m.l, t: m.t, r: m.r, b: m.b } });
            env.log('apply-crop');
            if (spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible'); // Apply is the step to ask about
            paintTools();
          });
        }

        S.crop = env.ui.cropbox(S.frame, box, {
          value: { l: ctx.model.l, t: ctx.model.t, r: ctx.model.r, b: ctx.model.b },
          handles,
          apply: (r, action, dx, dy) => fam.applyDrag({ ...r, ratio: ctx.model.ratio }, action, dx, dy, spec),
          place: (el, m) => {
            place(hole, m);
            place(el, m);
            const px = (v, s) => Math.round(v * s);
            readout.textContent = (spec.scenario === 'marquee' || pan) && !ctx.model.on ? 'No selection - drag on the image to select'
              : `Crop: ${px(m.r - m.l, S.W)} × ${px(m.b - m.t, S.H)} px at (${px(m.l, S.W)}, ${px(m.t, S.H)})`;
          },
          onInput: (m) => commit(m),
        });

        // Marquee: a press on the image outside the box draws a new selection.
        if (spec.scenario === 'marquee' || pan) {
          S.frame.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || (box.style.display !== 'none' && box.contains(e.target))) return;
            e.preventDefault();
            S.frame.setPointerCapture(e.pointerId);
            const p0 = S.crop.toNorm([e.clientX, e.clientY]);
            env.log('grab', { what: 'marquee' });
            const move = (ev) => {
              const r = fam.marqueeRect(p0, S.crop.toNorm([ev.clientX, ev.clientY]), spec);
              if (!r) return;
              S.crop.set(r);
              commit({ ...r, on: true });
              S.crop.set(r);
            };
            const end = (ev) => {
              move(ev);
              S.frame.removeEventListener('pointermove', move);
              S.frame.removeEventListener('pointerup', end);
              env.log('release', { what: 'marquee' });
            };
            S.frame.addEventListener('pointermove', move);
            S.frame.addEventListener('pointerup', end);
          });
        }

        // Keyboard nudging of the focused box.
        if (spec.keys) {
          box.tabIndex = 0;
          box.addEventListener('pointerdown', () => box.focus({ preventScroll: true }));
          box.addEventListener('keydown', (e) => {
            if (!ARROWS.has(e.key)) return;
            e.preventDefault();
            const m = fam.nudge({ ...ctx.model, px: { W: S.W, H: S.H } }, (e.shiftKey ? 'Shift+' : '') + e.key, spec);
            S.crop.set(m);
            commit({ l: m.l, t: m.t, r: m.r, b: m.b });
          });
          box.addEventListener('focus', () => { if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true }); });
          box.addEventListener('blur', () => { if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false }); });
        }

        showBox();
        paintTools();
        S.crop.set(ctx.model);
        paintInspector(ctx.model);
        // Pin the column at its rendered width and keep the toolbar on one line at its own width: on a narrow image
        // (traits.aspect) the toolbar or readout can be wider than the image, and their text changing (Applied ✓, the
        // size readout) must not shift the image.
        if (bar) bar.style.width = 'max-content';
        wrap.style.width = `${wrap.getBoundingClientRect().width}px`;
        placeIn(ctx, wrap, rng);
        // Mirror the rendered image size (unscored) for the keyboard / pan plan.
        ctx.update({ ...ctx.model, px: { W: S.W, H: S.H }, ...(pan ? { pan: panTo(ctx.model.pan.x, ctx.model.pan.y) } : {}) });
        return {
          anchors: [view || S.frame],
          sync: (m) => {
            S.crop.set(m);
            showBox();
            paintTools();
            paintInspector(m);
            if (pan && m.pan) panTo(m.pan.x, m.pan.y);
          },
        };
      },
    },
  },
});
