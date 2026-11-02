/* set-slider/_base-classic-units: default reference units; __scope supplies the original overridable bindings. */
(function () {
  'use strict';
  env.template('set-slider/_base-classic-units', () => {
    function ensureStyle(__scope) {
        const { CSS } = __scope;
        if (document.getElementById('slc-style')) return;
        const s = document.createElement('style');
        s.id = 'slc-style';
        s.textContent = CSS;
        document.head.append(s);
    }

    function placeIn(__scope, ctx, el, rng, pad = 12) {
        const W = ctx.size.width;
        const H = ctx.size.height;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const freeX = Math.max(0, W - w - 2 * pad);
        const freeY = Math.max(0, H - h - 2 * pad);
        const c01 = (f) => Math.min(1, Math.max(0, f));
        const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const st = ctx.stage.getBoundingClientRect();
        const fixed = [...document.querySelectorAll('[data-role="submit"]')]
          .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
        const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
        const cands = [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0], [0.5, 0.5]];
        let [x, y] = [pad + fx * freeX, pad + fy * freeY];
        for (const [ax, ay] of cands) {
          const cx = pad + ax * freeX;
          const cy = pad + ay * freeY;
          if (!hits(cx, cy)) {
            [x, y] = [cx, cy];
            break;
          }
        }
        el.style.left = Math.round(x) + 'px';
        el.style.top = Math.round(y) + 'px';
    }

    function keyboard(__scope, ctx, el, index, s, get, set) {
        const { KEYS, env } = __scope;
        if (!ctx.spec.keys) return;
        el.tabIndex = 0;
        el.addEventListener('pointerdown', () => el.focus({ preventScroll: true }));
        el.addEventListener('keydown', (e) => {
          if (!KEYS.has(e.key)) return;
          e.preventDefault();
          const v = get();
          if (v.length !== 1) return;
          const nv = env.taskOf('set-slider').helpers.scale.keyApply(s, v[0], e.key);
          if (nv !== v[0]) set([nv]);
        });
        el.addEventListener('focus', () => {
          el.classList.add('focused');
          if (ctx.model.focus !== index) ctx.update({ ...ctx.model, focus: index });
        });
        el.addEventListener('blur', () => {
          el.classList.remove('focused');
          if (ctx.model.focus === index) ctx.update({ ...ctx.model, focus: null });
        });
    }

    function tickValues(__scope, s, S, n, L, vertical) {
        if (s.stops) return s.stops.map((_, i) => i);
        if (s.log) {
          const out = [];
          for (let v = s.min; v <= s.max * 1.0001; v *= 10) out.push(Number(v.toPrecision(3)));
          return out;
        }
        const chars = Math.max(S.fmt(s, s.min).length, S.fmt(s, s.max).length);
        const need = vertical ? 22 : chars * 7.5 + 14;
        for (const k of [n, 5, 4, 2, 1]) {
          if (k <= n && L / k >= need) {
            return Array.from({ length: k + 1 }, (_, i) => Number((s.min + (i * (s.max - s.min)) / k).toFixed(S.decimals(s.step))));
          }
        }
        return [s.min, s.max];
    }

    function commit(__scope, ctx, index, vals, patch) {
        const all = ctx.model.values.map((x) => x.slice());
        all[index] = vals;
        ctx.update({ ...ctx.model, values: all, ...(patch ? patch() : null) });
    }

    function makeSlider(__scope, ctx, parent, index, s, g) {
        const { env, tickValues, commit, keyboard } = __scope;
        const { util } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const { vertical } = g;
        const L = g.length;
        const frac = (v) => S.frac(s, v);
        const fmt = g.fmt || ((v) => S.fmtU(s, v));

        const root = util.el('div', (vertical ? 'slc-v' : 'slc-h') + (g.cls ? ' ' + g.cls : ''), parent);
        if (!vertical && !g.standalone) root.style.display = 'contents';
        if (g.labelEl !== false) util.el('div', 'slc-label', root, s.label);
        const body = util.el('div', 'slc-body', root);
        if (!vertical) body.classList.add('slc-h');
        const hit = util.el('div', 'slc-hit', body);
        hit.dataset.role = 'track';
        const cross = Math.max(g.thumb, 24) + 12;
        Object.assign(hit.style, vertical ? { width: cross + 'px', height: L + 'px' } : { width: L + 'px', height: cross + 'px' });
        const rail = util.el('div', 'slc-rail', hit);
        Object.assign(rail.style, vertical ? { top: 0, bottom: 0, width: g.rail + 'px' } : { left: 0, right: 0, height: g.rail + 'px' });
        if (g.buffer) {
          const buf = util.el('div', 'slc-buf', hit);
          Object.assign(buf.style, { left: 0, width: g.buffer * L + 'px', height: g.rail + 'px' });
        }
        const fill = util.el('div', 'slc-fill', hit);
        Object.assign(fill.style, vertical ? { width: g.rail + 'px' } : { height: g.rail + 'px' });

        const n = ctx.model.values[index].length;
        const thumbs = Array.from({ length: n }, (_, j) => {
          const t = util.el('div', 'slc-thumb', hit);
          t.dataset.role = 'thumb';
          t.dataset.j = j;
          Object.assign(t.style, g.thumbBox ? { width: g.thumbBox[0] + 'px', height: g.thumbBox[1] + 'px' } : { width: g.thumb + 'px', height: g.thumb + 'px' });
          return t;
        });

        if (g.ticks || s.stops) {
          const ticks = util.el('div', 'slc-ticks', body);
          for (const v of tickValues(s, S, g.tickCount, L, vertical)) {
            const t = util.el('div', 'slc-tick' + (s.stops ? ' slc-stop' : ''), ticks, S.fmt(s, v));
            t.style[vertical ? 'top' : 'left'] = (vertical ? (1 - frac(v)) * L : frac(v) * L) + 'px';
          }
        }

        const readout = g.readoutEl || (g.readout ? util.el('div', 'slc-readout', root) : null);
        const tw = g.thumbBox ? g.thumbBox[0] : g.thumb;
        const th = g.thumbBox ? g.thumbBox[1] : g.thumb;

        const values = () => ctx.model.values[index];
        function paint(vals) {
          const fs = vals.map(frac);
          const [a, b] = fs.length === 2 ? fs : [0, fs[0]];
          if (vertical) Object.assign(fill.style, { top: (1 - b) * L + 'px', height: (b - a) * L + 'px' });
          else Object.assign(fill.style, { left: a * L + 'px', width: (b - a) * L + 'px' });
          if (readout) readout.textContent = vals.map(fmt).join(' – ');
        }

        const ctl = env.ui.slider(hit, {
          label: s.label,
          thumbs,
          values: values().slice(),
          valueAt: (f) => S.valueAt(s, f),
          fractionOf: frac,
          orientation: vertical ? 'vertical' : 'horizontal',
          place(t, point, f) {
            // The track and thumb as laid out (a design's CSS may resize them; layout px, so a zoomed page keeps
            // its scale): the thumb centre sits on the point locate() gives for its value.
            const len = (vertical ? hit.clientHeight : hit.clientWidth) || L;
            const w = t.offsetWidth || tw;
            const h = t.offsetHeight || th;
            if (vertical) Object.assign(t.style, { left: (cross - tw) / 2 + 'px', top: (1 - f) * len - h / 2 + 'px' });
            else Object.assign(t.style, { top: (cross - th) / 2 + 'px', left: f * len - w / 2 + 'px' });
          },
          // Track clicks jump the nearest thumb, as most real sliders do; the spec may forbid them.
          trackClick() {
            if (!ctx.spec.allowTrackClick) ctx.flag('track-click');
          },
          onStart: (j) => thumbs[j].classList.add('active'),
          onInput(vals) {
            commit(ctx, index, vals, g.patch);
            paint(vals);
          },
          onChange(vals, j) {
            if (j !== null) thumbs[j].classList.remove('active');
          },
        });
        keyboard(ctx, hit, index, s, () => values(), (vals) => {
          ctl.set(vals);
          commit(ctx, index, vals, g.patch);
          paint(vals);
        });

        paint(values());
        return {
          anchor: hit,
          locate: (value, j) => ctl.locate(value, j),
          locateThumb: (j) => ctl.locateThumb(j),
          set: (vals) => { ctl.set(vals); paint(vals); },
        };
    }

    function makeNative(__scope, ctx, parent, index, s, g) {
        const { env, tickValues, commit, keyboard } = __scope;
        const { util } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const N = s.log ? 1000 : Math.round((s.max - s.min) / s.step);
        const toK = (v) => Math.round(S.frac(s, v) * N);
        const fromK = (k) => S.valueAt(s, k / N);
        const L = g.length;
        const T = g.thumb;
        const root = util.el('div', 'slc-h', parent);
        root.style.display = 'contents';
        util.el('div', 'slc-label', root, s.label);
        const body = util.el('div', 'slc-body slc-h', root);
        const input = util.el('input', 'slc-native', body);
        input.type = 'range';
        input.min = 0;
        input.max = N;
        input.step = 1;
        input.dataset.role = 'track';
        input.setAttribute('aria-label', s.label);
        input.style.setProperty('--rail', g.rail + 'px');
        input.style.setProperty('--thumb', T + 'px');
        Object.assign(input.style, { width: L + T + 'px', height: Math.max(T, 24) + 8 + 'px' });
        if (!ctx.spec.keys) input.tabIndex = -1;
        if (g.ticks) {
          const ticks = util.el('div', 'slc-ticks', body);
          ticks.style.left = T / 2 + 'px';
          ticks.style.right = T / 2 + 'px';
          for (const v of tickValues(s, S, g.tickCount, L, false)) {
            const t = util.el('div', 'slc-tick', ticks, S.fmt(s, v));
            t.style.left = S.frac(s, v) * L + 'px';
          }
        }
        const readout = g.readout ? util.el('div', 'slc-readout', root) : null;
        const value = () => ctx.model.values[index][0];
        const paint = (v) => {
          input.value = String(toK(v));
          input.style.setProperty('--pct', (S.frac(s, v) * 100).toFixed(3) + '%');
          if (readout) readout.textContent = S.fmtU(s, v);
        };
        const center = (v) => {
          const r = input.getBoundingClientRect();
          return [r.left + T / 2 + S.frac(s, v) * L, r.top + r.height / 2];
        };
        input.addEventListener('pointerdown', (e) => {
          const [cx, cy] = center(value());
          const onThumb = Math.abs(e.clientX - cx) <= T / 2 + 1 && Math.abs(e.clientY - cy) <= T / 2 + 2;
          if (!onThumb) {
            env.log('track-click', { what: s.label, policy: 'jump' });
            if (!ctx.spec.allowTrackClick) ctx.flag('track-click');
          }
        });
        input.addEventListener('input', () => {
          const v = fromK(Number(input.value));
          input.style.setProperty('--pct', (S.frac(s, v) * 100).toFixed(3) + '%');
          if (readout) readout.textContent = S.fmtU(s, v);
          if (v !== value()) commit(ctx, index, [v]);
        });
        keyboard(ctx, input, index, s, () => ctx.model.values[index], (vals) => {
          paint(vals[0]);
          commit(ctx, index, vals);
        });
        paint(value());
        return {
          anchor: input,
          locate: (v) => center(v),
          locateThumb: () => center(value()),
          set: (vals) => paint(vals[0]),
        };
    }

    function renderPlain(__scope, ctx, look) {
        const { env, makeNative, makeSlider, placeIn } = __scope;
        const { spec, rng, util, size } = ctx;
        const vertical = spec.vertical;
        const n = spec.sliders.length;
        const anyLog = spec.sliders.some((s) => s.log);
        const card = util.el('div', 'slc-card' + (vertical ? ' vertical' : '') + (n >= 4 ? ' tight' : '') + (look.density !== 'normal' ? ' ' + look.density : ''), ctx.stage);
        // Stop names are centered on the track ends: leave room for the longest one.
        const stopPad = Math.max(0, ...spec.sliders.filter((s) => s.stops).map((s) => Math.max(s.stops[0].length, s.stops[s.stops.length - 1].length) * 4.2 - 30));
        if (stopPad && !vertical) card.style.paddingRight = card.style.paddingLeft = 40 + Math.ceil(stopPad) + 'px';
        // Presets card (match): one row per preset, one column per slider.
        if (spec.presets) {
          const box = util.el('div', 'slc-presets', card);
          box.dataset.role = 'presets';
          const table = util.el('table', '', box);
          util.el('caption', '', table, rng.pick(['Presets', 'Saved presets', 'Profiles', 'Scenes']));
          const head = util.el('tr', '', table);
          util.el('th', '', head, 'Preset');
          for (const s of spec.sliders) util.el('th', '', head, s.label);
          for (const p of spec.presets) {
            const tr = util.el('tr', '', table);
            util.el('td', '', tr, p.name);
            p.values.forEach((v, i) => util.el('td', '', tr, env.taskOf('set-slider').helpers.scale.fmtU(spec.sliders[i], v)));
          }
        }
        const presetsH = spec.presets ? 40 + 26 * (spec.presets.length + 1) : 0;
        // Track lengths from the stage: horizontal tracks leave room for label, readout and padding; vertical
        // tracks for the label, ticks and readout above/below.
        const maxV = Math.max(240, Math.min(440, Math.floor(size.height) - 200 - presetsH));
        const room = Math.floor(size.width) - 120 - 96 - 24 - (look.readout ? 152 : 0);
        const maxH = Math.max(320, Math.min(820, room));
        const minH = (s) => (s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320);
        const randLength = (s) => (vertical ? rng.int(240, maxV) : rng.int(Math.min(minH(s), maxH), Math.max(minH(s), maxH)));
        const shared = randLength(anyLog ? { log: true } : spec.sliders.find((s) => s.stops) || {});
        const group = util.el('div', vertical ? 'slc-row' : 'slc-grid', card);
        if (!vertical && !look.readout) group.style.gridTemplateColumns = 'auto auto';
        if (vertical && n >= 3) group.style.gap = '84px';
        if (!vertical && n >= 4) group.style.rowGap = Math.max(40, Math.min(58, Math.floor((size.height - presetsH - 90) / n) - 40)) + 'px';
        else if (!vertical && look.density === 'dense') group.style.rowGap = (look.ticks ? 40 : 22) + 'px';
        const native = look.native && !vertical;
        const out = spec.sliders.map((s, i) => {
          const g = {
            ...look,
            vertical,
            // Multi sliders form one aligned form; a distractor gets its own track length.
            length: spec.norm ? shared : randLength(s),
            tickCount: rng.pick([4, 5, 10]),
          };
          if (native && s.target !== undefined && !s.stops && (!s.target || s.target.length === 1)) return makeNative(ctx, group, i, s, g);
          return makeSlider(ctx, group, i, s, g);
        });
        placeIn(ctx, card, rng);
        return out;
    }

    function renderRating(__scope, ctx, look) {
        const { STAR_PATH, placeIn } = __scope;
        const { spec, util, size, rng } = ctx;
        const { n, half } = spec.stars;
        const big = spec.level === 'easy' ? 8 : spec.level === 'medium' ? 4 : 0;
        const gap = 4;
        const room = Math.floor(size.width) - 120 - 150 - 100;
        const px = Math.max(24, Math.min(n > 5 ? 36 : 52, Math.floor(room / n) - gap, (look.thumb > 20 ? 44 : 34) + big));
        const card = util.el('div', 'slr-card', ctx.stage);
        util.el('div', 'slr-title', card, spec.scene.title);
        util.el('div', 'slr-item', card, spec.scene.item);
        const out = spec.sliders.map((s, i) => {
          const row = util.el('div', 'slr-row', card);
          util.el('div', 'slr-label', row, s.label);
          const box = util.el('div', 'slr-stars', row);
          box.dataset.role = 'track';
          box.setAttribute('role', 'slider');
          box.setAttribute('aria-label', s.label);
          box.style.gap = gap + 'px';
          const cells = Array.from({ length: n }, () => {
            const c = util.el('div', 'slr-star', box);
            c.style.width = c.style.height = px + 'px';
            c.innerHTML = `<svg class="bg" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg><div class="fg"><svg viewBox="0 0 24 24" style="width:${px}px"><path d="${STAR_PATH}"/></svg></div>`;
            return c;
          });
          const readout = util.el('div', 'slr-value', row);
          const unit = half ? 0.5 : 1;
          const paint = (v) => {
            cells.forEach((c, k) => {
              const f = Math.max(0, Math.min(1, v - k));
              c.querySelector('.fg').style.width = f * px + 'px';
            });
            readout.textContent = `${v} / ${n}`;
            box.setAttribute('aria-valuenow', String(v));
          };
          // x within the star row -> value (left half of a star: the half value when half stars are on)
          const valueAtX = (x) => {
            const k = Math.floor(x / (px + gap));
            const inStar = Math.max(0, Math.min(px, x - k * (px + gap)));
            const v = k + (half ? (inStar < px / 2 ? 0.5 : 1) : 1);
            return Math.max(unit, Math.min(n, v));
          };
          let down = false;
          const set = (e) => {
            const r = box.getBoundingClientRect();
            const v = valueAtX(e.clientX - r.left);
            if (v === ctx.model.values[i][0]) return;
            const all = ctx.model.values.map((x) => x.slice());
            all[i] = [v];
            paint(v);
            ctx.update({ ...ctx.model, values: all });
          };
          box.addEventListener('pointerdown', (e) => { down = true; try { box.setPointerCapture(e.pointerId); } catch (_) { /* synthetic */ } set(e); });
          box.addEventListener('pointermove', (e) => { if (down) set(e); });
          const up = () => { down = false; };
          box.addEventListener('pointerup', up);
          box.addEventListener('pointercancel', up);
          paint(ctx.model.values[i][0]);
          const at = (v) => {
            const r = box.getBoundingClientRect();
            const k = Math.max(0, Math.ceil(v) - 1);
            const left = half && v - k === 0.5 ? 0.25 : 0.75;
            return [r.left + k * (px + gap) + left * px, r.top + r.height / 2];
          };
          return { anchor: box, locate: (v) => at(v), locateThumb: () => at(Math.max(0.5, ctx.model.values[i][0])), set: (vals) => paint(vals[0]) };
        });
        placeIn(ctx, card, rng);
        return out;
    }

    function renderMedia(__scope, ctx, look) {
        const { env, makeSlider, SPEAKER, WAVES, CAPTION_LINES, CROSS, placeIn } = __scope;
        const { spec, rng, util, size } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const [seek, vol] = spec.sliders;
        const player = spec.scenario === 'player';
        const PW = Math.max(player ? 560 : 480, Math.min(860, Math.floor(size.width) - 40, rng.int(560, 900)));
        const VH = Math.max(120, Math.min(340, Math.floor(size.height) - 150, Math.round(PW * rng.float(0.36, 0.56))));
        const box = util.el('div', 'slm-player', ctx.stage);
        box.style.width = PW + 'px';
        const video = util.el('div', 'slm-video', box);
        const hue = rng.int(0, 359);
        Object.assign(video.style, { height: VH + 'px', background: `linear-gradient(135deg, hsl(${hue} 35% 22%), hsl(${(hue + 70) % 360} 40% 12%))` });
        util.el('div', 'slm-title', video, spec.title);
        util.el('div', 'slm-big', video);
        const bar = util.el('div', 'slm-bar', box);
        const L = PW - 28;
        const t = rng.int(12, 16);
        const out = [];
        out[0] = makeSlider(ctx, bar, 0, seek, {
          vertical: false, length: L, thumb: t, rail: rng.int(3, 6), ticks: false, standalone: true, labelEl: false, cls: 'slm-seek',
          buffer: rng.float(0.3, 1), fmt: (v) => S.fmt(seek, v),
        });
        const row = util.el('div', 'slm-row', bar);
        const play = util.el('button', 'slm-btn', row, '▶');
        play.type = 'button';
        play.tabIndex = -1;
        const time = util.el('span', 'slm-time', row);
        util.el('span', 'slm-spacer', row);
        if (!player) {
          const icon = util.el('span', 'slm-icon', row);
          icon.innerHTML = `<svg width="18" height="16" viewBox="0 0 18 16">${SPEAKER}${WAVES}</svg>`;
        }
        // player: icon toggles (captions, mute) next to the volume slider; captions show a line on the video.
        const toggles = {};
        let caption = null;
        const button = (name, title) => {
          const b = util.el('button', 'slm-tog', row);
          b.type = 'button';
          b.tabIndex = -1;
          b.dataset.role = name;
          b.title = title;
          b.setAttribute('aria-label', title);
          b.addEventListener('click', () => {
            const key = name === 'mute' ? 'muted' : 'captions';
            ctx.update({ ...ctx.model, [key]: !ctx.model[key] });
          });
          toggles[name] = b;
          return b;
        };
        const cc = () => { button('captions', 'Subtitles/closed captions (c)').innerHTML = '<span class="slm-cc">CC</span>'; };
        const ccLeft = player && rng.bool(0.6);
        if (player) {
          row.style.gap = '10px';
          caption = util.el('div', 'slm-caption', video, rng.pick(CAPTION_LINES));
          if (ccLeft) cc();
          button('mute', 'Mute (m)');
        }
        const pct = util.el('span', 'slm-volpct');
        out[1] = makeSlider(ctx, row, 1, vol, {
          vertical: false, length: player ? rng.int(90, 120) : rng.int(120, 150), thumb: 12, rail: 4, ticks: false, standalone: true, labelEl: false, cls: 'slm-vol',
          readoutEl: pct, fmt: (v) => `${v}%`,
          // Dragging the volume unmutes, as real players do.
          patch: player ? () => (ctx.model.muted ? { muted: false } : null) : null,
        });
        row.append(pct);
        if (player && !ccLeft) cc();
        if (player && PW >= 640) {
          for (const [cls, title] of [['slm-gear', 'Settings'], ['slm-full', 'Full screen (f)']]) {
            const b = util.el('button', 'slm-tog slm-xtra ' + cls, row);
            b.type = 'button';
            b.tabIndex = -1;
            b.title = title;
            b.setAttribute('aria-label', title);
          }
        }
        // Elapsed / total time follows the seek value; the toggles follow muted / captions.
        const paintTime = () => {
          time.textContent = `${S.fmt(seek, ctx.model.values[0][0])} / ${S.fmt(seek, seek.max)}`;
          if (!player) return;
          const m = ctx.model;
          const silent = m.muted || m.values[1][0] === 0;
          toggles.mute.innerHTML = `<svg width="18" height="16" viewBox="0 0 18 16">${SPEAKER}${silent ? CROSS : WAVES}</svg>`;
          toggles.mute.title = toggles.mute.ariaLabel = m.muted ? 'Unmute (m)' : 'Mute (m)';
          toggles.mute.classList.toggle('on', !!m.muted);
          toggles.captions.classList.toggle('on', !!m.captions);
          toggles.captions.setAttribute('aria-pressed', String(!!m.captions));
          caption.style.visibility = m.captions ? 'visible' : 'hidden';
          out[1].anchor.classList.toggle('muted', !!m.muted);
        };
        paintTime();
        const upd = ctx.update;
        ctx.update = (m) => { upd(m); paintTime(); };
        placeIn(ctx, box, rng);
        out.paintTime = paintTime;
        out.toggles = toggles;
        return out;
    }

    function renderMixer(__scope, ctx, look) {
        const { makeSlider, placeIn } = __scope;
        const { spec, rng, util, size } = ctx;
        const mixer = util.el('div', 'slx-mixer', ctx.stage);
        mixer.dataset.role = 'mixer';
        const L = Math.max(200, Math.min(340, Math.floor(size.height) - 170, rng.int(220, 360)));
        const out = spec.sliders.map((s, i) => {
          const strip = util.el('div', 'slx-strip', mixer);
          util.el('div', 'slx-name', strip, s.label).title = s.label;
          const val = util.el('div', 'slx-val', strip);
          const body = util.el('div', 'slx-body', strip);
          const sl = makeSlider(ctx, body, i, s, {
            vertical: true, length: L, thumb: 14, thumbBox: [26, 12], rail: 4, ticks: false, labelEl: false, cls: 'slx-fader',
            readoutEl: val,
          });
          const meter = util.el('div', 'slx-meter', body);
          meter.style.height = L + 'px';
          return sl;
        });
        placeIn(ctx, mixer, rng);
        return out;
    }

    function renderSettings(__scope, ctx) {
        const { env, makeSlider, placeIn } = __scope;
        const { spec, rng, util, size } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const C = env.content || {};
        const kind = rng.pick(['ios', 'material', 'win']);
        const geo = kind === 'ios' ? { thumb: rng.int(24, 28), rail: 4 }
          : kind === 'material' ? { thumb: rng.int(16, 20), rail: rng.int(4, 6) }
            : { thumb: 22, thumbBox: [rng.int(9, 12), 22], rail: rng.int(2, 4) };
        const card = util.el('div', 'sls-card ' + kind, ctx.stage);
        card.dataset.role = 'settings';
        const W = Math.floor(size.width) - 32;
        const cardW = Math.max(520, Math.min(W, rng.int(680, 940)));
        card.style.width = cardW + 'px';
        const decoyPool = (Array.isArray(C.SETTINGS) ? C.SETTINGS : []).filter((x) => x.kind === 'toggle' || (x.kind === 'select' && x.options && x.options.length >= 2));
        const group = decoyPool.length ? rng.pick(decoyPool).group : 'General';
        const head = util.el('div', 'sls-head', card);
        util.el('div', 'sls-title', head, rng.pick([group, 'Settings', 'Preferences', `${group} settings`]));
        if (rng.bool(0.5)) util.el('div', 'sls-sub', head, rng.pick(['Changes are saved automatically.', 'These apply to this device only.', 'Adjust how things look and sound.']));

        // Column widths: the value column fits the widest value text; stop labels hang over the track ends.
        const valueText = (s) => {
          const vals = s.stops ? s.stops.map((_, i) => i) : [s.min, s.max, ...(s.target || [])];
          const w = Math.max(...vals.map((v) => S.fmtU(s, v).length));
          return (s.target && s.target.length === 2 ? 2 * w + 3 : w);
        };
        const valueW = Math.max(56, Math.ceil(Math.max(...spec.sliders.map(valueText)) * 8.2) + 14);
        const hang = Math.max(0, ...spec.sliders.filter((s) => s.stops).map((s) => Math.max(s.stops[0].length, s.stops[s.stops.length - 1].length) * 4.2));
        const gap = Math.max(20, Math.ceil(hang) + 8);
        const padX = kind === 'ios' ? 20 : 24;
        const labelW = rng.int(140, 200);
        const inner = cardW - 2 * padX;
        const room = inner - labelW - valueW - 2 * gap;
        const minL = (s) => (s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320);
        const L = Math.min(room, rng.int(380, 560));

        // Rows: sliders keep their order; decoys go between them, as many as the height allows.
        const rowH = (s) => (s && s.stops ? 84 : s && L < minL(s) ? 84 : 58);
        const used = 90 + spec.sliders.reduce((a, sl) => a + rowH(sl), 0);
        const fit = Math.max(0, Math.floor((Math.floor(size.height) - 40 - used) / 62));
        const nDecoys = Math.min(fit, rng.int(2, 4), decoyPool.length);
        const decoys = rng.sample(decoyPool.filter((x) => !spec.sliders.some((s) => s.label === x.label)), nDecoys);
        const order = spec.sliders.map((_, i) => i);
        for (const d of decoys) order.splice(rng.int(0, order.length), 0, d);

        const list = util.el('div', 'sls-list', card);
        const out = [];
        for (const item of order) {
          const row = util.el('div', 'sls-row', list);
          row.style.padding = `0 ${padX}px`;
          if (typeof item !== 'number') {
            row.classList.add('xtra');
            const lab = util.el('div', 'sls-labelcell', row);
            util.el('div', 'sls-label', lab, item.label);
            if (item.description && rng.bool(0.5)) util.el('div', 'sls-desc', lab, item.description);
            if (item.kind === 'toggle') {
              const sw = util.el('button', 'sls-switch', row);
              sw.type = 'button';
              sw.tabIndex = -1;
              sw.setAttribute('role', 'switch');
              sw.setAttribute('aria-label', item.label);
              const set = (on) => { sw.classList.toggle('on', on); sw.setAttribute('aria-checked', String(on)); };
              set(rng.bool(0.5));
              sw.addEventListener('click', () => set(!sw.classList.contains('on')));
            } else {
              const sel = util.el('select', 'sls-select', row);
              sel.tabIndex = -1;
              sel.setAttribute('aria-label', item.label);
              for (const o of item.options) util.el('option', '', sel, o);
              sel.selectedIndex = rng.int(0, item.options.length - 1);
            }
            continue;
          }
          const i = item;
          const sl = spec.sliders[i];
          const stacked = L < minL(sl);
          const value = util.el('div', 'sls-value');
          if (stacked) {
            row.classList.add('stacked');
            const top = util.el('div', 'sls-top', row);
            util.el('div', 'sls-label', top, sl.label);
            top.append(value);
          } else {
            row.style.gridTemplateColumns = `${labelW}px ${L}px ${valueW}px`;
            row.style.columnGap = gap + 'px';
            util.el('div', 'sls-label', row, sl.label);
          }
          const len = stacked ? Math.max(minL(sl), inner - 2 * Math.ceil(hang)) : L;
          out[i] = makeSlider(ctx, row, i, sl, { ...geo, vertical: false, length: len, ticks: false, standalone: true, labelEl: false,
            cls: 'sls-slider', readoutEl: value });
          if (stacked) out[i].anchor.parentNode.parentNode.style.marginLeft = Math.ceil(hang) + 'px';
          else row.append(value);
        }
        placeIn(ctx, card, rng);
        return out;
    }

    function renderClassic(__scope, ctx) {
        const { ensureStyle, renderRating, renderMedia, renderMixer, renderPlain } = __scope;
          ensureStyle();
          const { spec, rng } = ctx;
          // Page-level look, shared by every slider on the page.
          const look = {
            thumb: rng.int(14, 26),
            rail: rng.int(4, 10),
            ticks: rng.bool(0.6),
            readout: rng.bool(0.6) || spec.showValue || spec.scenario === 'match',
            native: rng.bool(0.3),
          };
          // Density (plain layouts): dense enterprise forms (2 px rails, 8 px thumbs, small type) or touch
          // layouts (28-40 px thumbs, large type). Track lengths keep their minimums either way.
          look.density = rng.pick(['normal', 'normal', 'dense', 'touch']);
          if (look.density === 'dense') Object.assign(look, { thumb: 8, rail: 2 });
          if (look.density === 'touch') Object.assign(look, { thumb: rng.int(28, 40), rail: rng.int(6, 10) });
          // Levels: bigger handles and rails (after the draws, so the page keeps its layout draws).
          if (spec.level) {
            look.thumb = Math.max(look.thumb, spec.level === 'easy' ? 32 : 22);
            look.rail = Math.max(look.rail, spec.level === 'easy' ? 6 : 4);
          }
          if (spec.scenario === 'rating') __scope.sliders = renderRating(ctx, look);
          else if (spec.scenario === 'media' || spec.scenario === 'player') __scope.sliders = renderMedia(ctx, look);
          else if (spec.scenario === 'mixer') __scope.sliders = renderMixer(ctx, look);
          else __scope.sliders = renderPlain(ctx, look);
          return {
            anchors: [...__scope.sliders.map((sl) => sl.anchor), ...Object.values(__scope.sliders.toggles || {})],
            sync(m) {
              __scope.sliders.forEach((sl, i) => sl.set(m.values[i]));
              if (__scope.sliders.paintTime) __scope.sliders.paintTime();
            },
          };
    }

    return { ensureStyle, placeIn, keyboard, tickValues, commit, makeSlider, makeNative, renderPlain, renderRating, renderMedia, renderMixer, renderSettings, renderClassic };
  });
})();
