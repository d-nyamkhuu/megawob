// Design on templates/crop-image/base.js: the base site's crop-image widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-pan-04',
  name: 'design',
  split: 'train',
  scenarios: ['pan'],
  template: 'crop-image/base',
  design: {
    parts: {
      'paintScene': (base, S) => function paintScene(g, spec, fam, rng, W, H) {
        const { paintFace } = S;
        const bg = spec.bg;
        const grad = g.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, `hsl(${bg.hue} 30% 88%)`);
        grad.addColorStop(1, `hsl(${bg.hue2} 30% 70%)`);
        g.fillStyle = grad;
        g.fillRect(0, 0, W, H);
        const r = rng.fork('bg');
        if (bg.style === 'landscape') {
          const sky = g.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, `hsl(${bg.hue} 45% 78%)`);
          sky.addColorStop(1, `hsl(${bg.hue} 35% 92%)`);
          g.fillStyle = sky;
          g.fillRect(0, 0, W, H);
          g.fillStyle = 'rgba(255, 240, 200, .8)';
          g.beginPath();
          g.arc(r.float(0.1, 0.9) * W, r.float(0.1, 0.3) * H, H * 0.07, 0, 2 * Math.PI);
          g.fill();
          for (const [k, light] of [[0, 62], [1, 48]]) {
            g.fillStyle = `hsl(${(bg.hue2 + 60 * k) % 360} 25% ${light}%)`;
            g.beginPath();
            g.moveTo(0, H);
            const base = H * (0.55 + 0.15 * k);
            for (let x = 0; x <= W; x += W / 8) g.lineTo(x, base - r.float(0, H * 0.18));
            g.lineTo(W, H);
            g.closePath();
            g.fill();
          }
        } else if (bg.style === 'blobs') {
          for (let i = 0, n = r.int(5, 8); i < n; i++) {
            const cx = r.float(0, W);
            const cy = r.float(0, H);
            const rad = r.float(0.15, 0.4) * H;
            const rg = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
            rg.addColorStop(0, `hsla(${r.int(0, 359)} 55% 70% / .55)`);
            rg.addColorStop(1, 'hsla(0 0% 100% / 0)');
            g.fillStyle = rg;
            g.fillRect(0, 0, W, H);
          }
        } else if (bg.style === 'noise') {
          const img = g.getImageData(0, 0, W, H);
          const d = img.data;
          const n = r.fork('px');
          for (let i = 0; i < d.length; i += 4) {
            const v = (n.next() - 0.5) * 46;
            d[i] += v;
            d[i + 1] += v;
            d[i + 2] += v;
          }
          g.putImageData(img, 0, 0);
        } else if (bg.style === 'text') {
          g.save();
          g.fillStyle = 'rgba(255, 255, 255, .35)';
          g.font = `700 ${Math.round(H * 0.11)}px system-ui, sans-serif`;
          g.textAlign = 'center';
          g.translate(W / 2, H / 2);
          g.rotate(-0.35);
          g.fillText(bg.text, 0, 0);
          g.restore();
          g.fillStyle = 'rgba(0, 0, 0, .35)';
          g.fillRect(0, H - 26, W, 26);
          g.fillStyle = 'rgba(255, 255, 255, .9)';
          g.font = '13px system-ui, sans-serif';
          g.textAlign = 'left';
          g.fillText(`${bg.text} · ${W}×${H}`, 10, H - 9);
        }
        // GEM's bitmap editor uses a flat monochrome work plane. Keep the seeded
        // background sampling above intact, then paint the editor's display surface.
        g.fillStyle = '#c4c4c4';
        g.fillRect(0, 0, W, H);
        for (const o of spec.objects) {
          const { x, y, w, h } = o.sq;
          if (o.kind === 'label') {
            const px = [x * W, y * H, w * W, h * H];
            g.fillStyle = o.hex;
            g.beginPath();
            g.roundRect(px[0], px[1], px[2], px[3], Math.min(8, px[3] / 4));
            g.fill();
            g.fillStyle = '#fff';
            g.font = `650 ${Math.round(px[3] * 0.42)}px system-ui, -apple-system, "Segoe UI", sans-serif`;
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText(o.text, px[0] + px[2] / 2, px[1] + px[3] / 2 + 1, px[2] * 0.88);
            continue;
          }
          g.fillStyle = o.hex;
          g.beginPath();
          const pts = fam.shapePoints(o);
          if (pts) {
            pts.forEach(([px, py], k) => (k ? g.lineTo(px * W, py * H) : g.moveTo(px * W, py * H)));
            g.closePath();
          } else {
            g.ellipse((x + w / 2) * W, (y + h / 2) * H, (w / 2) * W, (h / 2) * H, 0, 0, 2 * Math.PI);
          }
          g.fill();
          g.strokeStyle = '#000';
          g.lineWidth = Math.max(2, Math.min(W, H) * 0.005);
          g.lineJoin = 'miter';
          g.stroke();
          if (o.kind === 'face') paintFace(g, fam, o, W, H);
        }
      },
      'box.render': (base, S) => function render(ctx) {
        const { ARROWS, HANDLES, NAV_W, drawScene, ensureStyle, env, place, placeIn } = S;
        ensureStyle();
        const { spec, util, rng, size } = ctx;
        const fam = env.taskDef.helpers;
        const tools = spec.scenario === 'aspect' || spec.apply;
        const pan = spec.scenario === 'pan';
        const gem = document.body.classList.contains('atari-gem');
        let gemSideWidth = 0;
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

        if (pan && gem) {
          const style = getComputedStyle(ctx.stage);
          const inset = parseFloat(style.getPropertyValue('--gem-inset')) || 14;
          const gap = parseFloat(style.getPropertyValue('--gem-gap')) || 18;
          const scroll = parseFloat(style.getPropertyValue('--gem-scroll')) || 36;
          const rowWidth = size.width * (1 - 0.074) - 2 * inset;
          gemSideWidth = rowWidth * 0.272;
          VW = Math.max(180, Math.round(rowWidth - gemSideWidth - gap - scroll - 4));
          VH = Math.max(180, Math.round(size.height - 2 * inset - scroll - 4));
          S.W = Math.round(VW * spec.zoom.x);
          S.H = Math.round(VH * spec.zoom.y);
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
        let scenePane = null;
        if (pan) {
          scenePane = gem ? util.el('div', 'gem-scene-window', row) : row;
          view = util.el('div', 'cr-view', scenePane);
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
        if (spec.scenario === 'outline') place(util.el('div', 'cr-target', S.frame), spec.target, 1);
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
        let scrollX = null, scrollY = null;
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
          if (scrollX) Object.assign(scrollX.style, {left:p.x*100+'%',width:spec.view.w*100+'%'});
          if (scrollY) Object.assign(scrollY.style, {top:p.y*100+'%',height:spec.view.h*100+'%'});
        };
        if (pan) {
          const side = util.el('div', 'cr-side', row);
          let navW = gem ? Math.max(110, Math.floor(gemSideWidth - 40)) : Math.min(NAV_W, Math.round((Math.min(VH - 20, Math.round((NAV_W * S.H) / S.W)) * S.W) / S.H));
          let navH = gem ? Math.round(navW * 0.76) : Math.min(VH - 20, Math.round((NAV_W * S.H) / S.W));
          if (gem && (document.body.classList.contains('gem-instr-panel') || document.body.classList.contains('gem-instr-toast'))) {
            const panelHeight=document.body.classList.contains('gem-instr-panel') ? (parseFloat(getComputedStyle(ctx.stage).getPropertyValue('--gem-panel-height'))||150) : 0;
            const maxNavHeight=Math.max(110,size.height-panelHeight-398);
            if(navH>maxNavHeight){navH=Math.floor(maxNavHeight);navW=Math.round(navH/.76);}
          }
          nav = util.el('div', 'cr-nav', side);
          nav.dataset.role = 'navigator';
          Object.assign(nav.style, { width: navW + 'px', height: navH + 'px' });
          const thumb = util.el('canvas', '', nav);
          thumb.width = navW;
          thumb.height = navH;
          thumb.getContext('2d').drawImage(canvas, 0, 0, navW, navH);
          navRect = util.el('div', 'cr-navwin', nav);
          util.el('div', 'cr-navcap', side, 'Navigator');
          if (gem) {
            const vw = Math.round(spec.view.w * 640), vh = Math.round(spec.view.h * 480);
            util.el('div', 'gem-image-stats', side, `Image: SHAPES.PI1\nSize:  640 × 480\nView:  ${vw} × ${vh}`);
            const slot = util.el('div', 'gem-apply-slot', side);
            if (bar) slot.append(bar);
            else {
              const apply = util.el('button', 'cr-apply', slot, 'Apply Crop');
              apply.type = 'button';
              apply.addEventListener('click', () => {
                const m = ctx.model;
                if (!m.on) return;
                ctx.update({ ...m, applied: { l:m.l, t:m.t, r:m.r, b:m.b } });
                env.log('apply-crop');
              });
            }
            const status = document.querySelector('.gem-view-status');
            if (status) status.textContent = `View: ${vw} × ${vh}  (of 640 × 480)`;
            const count = document.querySelector('.gem-object-status');
            if (count) count.textContent = `Objects: ${spec.objects.length}`;
          }
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
          if (gem) {
            const scrollbar = (axis) => {
              const vertical=axis==='y',bar=util.el('div','gem-scrollbar gem-scroll-'+axis,scenePane);
              const prev=util.el('button','gem-scroll-arrow',bar,vertical?'▲':'◀');prev.type='button';prev.title=vertical?'Pan up':'Pan left';
              const track=util.el('div','gem-scroll-track',bar),thumb=util.el('div','gem-scroll-thumb',track);
              const next=util.el('button','gem-scroll-arrow',bar,vertical?'▼':'▶');next.type='button';next.title=vertical?'Pan down':'Pan right';
              const moveTo=(value)=>{const p={...ctx.model.pan,[axis]:Math.max(0,Math.min(1-(vertical?spec.view.h:spec.view.w),value))};ctx.update({...ctx.model,pan:panTo(p.x,p.y)});};
              prev.onclick=()=>moveTo(ctx.model.pan[axis]-.04);next.onclick=()=>moveTo(ctx.model.pan[axis]+.04);
              track.addEventListener('pointerdown',(e)=>{
                if(e.button!==0)return;e.preventDefault();track.setPointerCapture(e.pointerId);
                const bounds=track.getBoundingClientRect(),length=vertical?bounds.height:bounds.width,start=vertical?e.clientY:e.clientX;
                const atThumb=thumb.contains(e.target),initial=ctx.model.pan[axis];
                const point=(ev)=>vertical?ev.clientY:ev.clientX;
                if(!atThumb)moveTo((start-(vertical?bounds.top:bounds.left))/length-(vertical?spec.view.h:spec.view.w)/2);
                const origin=ctx.model.pan[axis];
                const move=(ev)=>moveTo((atThumb?initial:origin)+(point(ev)-start)/length);
                const end=()=>{track.removeEventListener('pointermove',move);track.removeEventListener('pointerup',end);};
                track.addEventListener('pointermove',move);track.addEventListener('pointerup',end);
              });
              return thumb;
            };
            scrollX=scrollbar('x');scrollY=scrollbar('y');util.el('div','gem-scroll-corner',scenePane);
          }
        }

        const showBox = () => {
          const off = (spec.scenario === 'marquee' || pan) && !ctx.model.on;
          box.style.display = off ? 'none' : '';
          S.frame.classList.toggle('empty', off);
          S.frame.classList.toggle('cr-locked', !!fam.ratioValue(ctx.model.ratio));
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
            if (pan && m.pan) panTo(m.pan.x, m.pan.y);
          },
        };
      },
    },
  },
});
