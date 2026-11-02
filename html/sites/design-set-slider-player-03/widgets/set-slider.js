// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-player-03',
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
        const sampledWidth = rng.int(560, 900);
        const PW = Math.min(1100, Math.floor(size.width) - 40, player ? 1100 : sampledWidth);
        const sampledHeight = rng.float(0.36, 0.56);
        const VH = Math.max(0, Math.min(600, Math.floor(size.height) - 150, Math.round(PW * (player ? 0.58 : sampledHeight))));
        const box = util.el('div', 'slm-player', ctx.stage);
        Object.assign(box.style, { width: PW + 'px', border: '0', borderRadius: '0', background: 'transparent', boxShadow: 'none', overflow: 'visible' });
        const video = util.el('div', 'slm-video', box);
        const hue = rng.int(0, 359);
        Object.assign(video.style, { height: VH + 'px', boxSizing: 'border-box', background: `linear-gradient(135deg, hsl(${hue} 35% 22%), hsl(${(hue + 70) % 360} 40% 12%))` });
        const bar = util.el('div', 'slm-bar', box);
        Object.assign(bar.style, { position: 'relative', display: 'block', boxSizing: 'border-box', height: '126px', padding: '7px 12px 8px' });
        const seekSlot = util.el('div', 'navigator-seek-slot', bar);
        Object.assign(seekSlot.style, { position: 'absolute', left: '165px', top: '14px' });
        const L = PW - 205;
        const t = rng.int(12, 16);
        const sampledRail = rng.int(3, 6);
        const out = [];
        out[0] = makeSlider(ctx, seekSlot, 0, seek, {
          vertical: false, length: L, thumb: t, thumbBox: [22, 31], rail: Math.max(14, sampledRail), ticks: false, standalone: true, labelEl: false, cls: 'slm-seek',
          buffer: rng.float(0.3, 1), fmt: (v) => S.fmt(seek, v),
        });
        const row = util.el('div', 'slm-row', bar);
        Object.assign(row.style, { position: 'relative', display: 'flex', alignItems: 'center', gap: '9px', height: '54px', margin: '58px 0 0', width: '100%' });
        const play = util.el('button', 'slm-btn', row, '▶');
        play.type = 'button';
        play.tabIndex = -1;
        Object.assign(play.style, { position: 'absolute', left: '0', top: '-58px', width: '70px', height: '51px' });
        const time = util.el('span', 'slm-time', row);
        Object.assign(time.style, { position: 'absolute', left: '82px', top: '-43px' });
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
          Object.assign(b.style, { flex: 'none', width: '70px', height: '50px', order: name === 'mute' ? '1' : '4' });
          if (name === 'captions') b.style.marginLeft = 'auto';
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
          caption = util.el('div', 'slm-caption', video, rng.pick(CAPTION_LINES));
          if (ccLeft) cc();
          button('mute', 'Mute (m)');
        }
        const pct = util.el('span', 'slm-volpct');
        const sampledVolumeLength = rng.int(90, 120);
        const volumeSlot = util.el('div', 'navigator-volume-slot', row);
        Object.assign(volumeSlot.style, { display: 'flex', alignItems: 'center', gap: '10px', order: '2', flex: 'none' });
        const volumeLabel = util.el('span', 'navigator-volume-label', volumeSlot, 'Volume');
        volumeLabel.style.font = '18px Georgia, serif';
        const volumeLength = Math.min(258, Math.max(40, PW - (PW >= 640 ? 420 : 330)));
        out[1] = makeSlider(ctx, volumeSlot, 1, vol, {
          vertical: false, length: player ? volumeLength : sampledVolumeLength, thumb: 12, thumbBox: [22, 31], rail: 15, ticks: false, standalone: true, labelEl: false, cls: 'slm-vol',
          readoutEl: pct, fmt: (v) => `${v}%`,
          // Dragging the volume unmutes, as real players do.
          patch: player ? () => (ctx.model.muted ? { muted: false } : null) : null,
        });
        // Keep the readout used by the slider; the thumb and track remain the visible volume control.
        if (player && !ccLeft) cc();
        if (player && PW >= 640) {
          for (const [cls, title] of [['slm-gear', 'Settings'], ['slm-full', 'Full screen (f)']]) {
            const b = util.el('button', 'slm-tog slm-xtra ' + cls, row);
            b.type = 'button';
            b.tabIndex = -1;
            b.title = title;
            b.setAttribute('aria-label', title);
            Object.assign(b.style, { order: '3', flex: 'none', width: '26px', height: '30px' });
          }
        }
        // Elapsed / total time follows the seek value; the toggles follow muted / captions.
        const paintTime = () => {
          time.textContent = `${S.fmt(seek, ctx.model.values[0][0])} / ${S.fmt(seek, seek.max)}`;
          if (!player) return;
          const m = ctx.model;
          const silent = m.muted || m.values[1][0] === 0;
          toggles.mute.innerHTML = `<svg width="30" height="27" viewBox="0 0 18 16">${SPEAKER}${silent ? CROSS : WAVES}</svg>`;
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
