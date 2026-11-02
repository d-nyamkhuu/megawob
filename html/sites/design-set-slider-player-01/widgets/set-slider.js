// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-player-01',
  name: 'design',
  split: 'train',
  scenarios: ['player'],
  template: 'set-slider/base',
  design: {
    parts: {
      'renderMedia': (base, scope) => function renderMedia(ctx, look) {
        const { CAPTION_LINES, CROSS, SPEAKER, WAVES, env, makeSlider, placeIn } = scope;
        const { spec, rng, util, size } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const [seek, vol] = spec.sliders;
        const player = spec.scenario === 'player';
        const widthDraw = rng.int(560, 900);
        const PW = Math.max(560, Math.min(player ? 966 : 860, Math.floor(size.width) - 40, player ? 966 : widthDraw));
        const heightRatio = rng.float(0.36, 0.56);
        const VH = Math.max(120, Math.min(player ? 530 : 340, Math.floor(size.height) - 150, Math.round(PW * (player ? 0.55 : heightRatio))));
        const box = util.el('div', 'slm-player', ctx.stage);
        box.style.width = PW + 'px';
        const video = util.el('div', 'slm-video', box);
        const hue = rng.int(0, 359);
        Object.assign(video.style, { height: VH + 'px', background: `linear-gradient(135deg, hsl(${hue} 28% 28%), hsl(${(hue + 70) % 360} 32% 15%))` });
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
      },
    },
  },
});
