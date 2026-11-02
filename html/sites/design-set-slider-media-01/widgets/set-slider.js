// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-media-01',
  name: 'design',
  split: 'train',
  scenarios: ['media'],
  template: 'set-slider/base',
  design: {
    parts: {
      'renderMedia': (base, scope) => function renderMedia(ctx, look) {
        const { CAPTION_LINES, CROSS, SPEAKER, WAVES, env, makeSlider, placeIn } = scope;
        const { spec, rng, util, size } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const [seek, vol] = spec.sliders;
        const player = spec.scenario === 'player';
        const PW = Math.max(player ? 560 : 480, Math.min(860, Math.floor(size.width) - 40, rng.int(560, 900)));
        const VH = Math.max(120, Math.min(340, Math.floor(size.height) - 150, Math.round(PW * rng.float(0.36, 0.56))));
        const box = util.el('div', 'slm-player', ctx.stage);
        box.style.width = PW + 'px';
        // Keep the original layout RNG draws, but size this design to the actual stage.
        box.style.setProperty('--media-footer', Math.min(138, Math.max(110, Math.round(size.height * .16))) + 'px');
        const footerReserved = Math.ceil(document.querySelector('.end-actions')?.getBoundingClientRect().width || 0);
        box.style.setProperty('--end-space', footerReserved + 'px');
        const video = util.el('div', 'slm-video', box);
        const hue = rng.int(0, 359);
        Object.assign(video.style, { height: VH + 'px', background: `linear-gradient(135deg, hsl(${hue} 35% 22%), hsl(${(hue + 70) % 360} 40% 12%))` });
        util.el('div', 'slm-title', video, spec.title);
        util.el('div', 'slm-big', video);
        const bar = util.el('div', 'slm-bar', box);
        const L = Math.max(160, Math.floor(size.width) - 40 - footerReserved);
        const t = rng.int(12, 16);
        const out = [];
        out[0] = makeSlider(ctx, bar, 0, seek, {
          vertical: false, length: L, thumb: Math.max(32, t), rail: Math.max(10, rng.int(3, 6)), ticks: false, standalone: true, labelEl: false, cls: 'slm-seek',
          buffer: rng.float(0.3, 1), fmt: (v) => S.fmt(seek, v),
        });
        const row = util.el('div', 'slm-row', bar);
        const play = util.el('button', 'slm-btn', row, '▶');
        play.type = 'button';
        play.tabIndex = -1;
        const time = util.el('span', 'slm-time', row);
        let overlayTime = null;
        if (!player) {
          const controls = util.el('div', 'video-controls', video);
          controls.append(play);
          play.title = 'Play';
          play.setAttribute('aria-label', 'Play');
          const speaker = util.el('span', 'video-speaker', controls);
          speaker.innerHTML = `<svg width="30" height="28" viewBox="0 0 18 16">${SPEAKER}${WAVES}</svg>`;
          overlayTime = util.el('span', 'overlay-time', controls);
          util.el('span', 'video-controls-spacer', controls);
          const controlIcons = [
            ['Captions', '<span class="video-cc">CC</span>'],
            ['Settings', '<svg viewBox="0 0 24 24"><path d="m10 2-.6 2.5-2.1.9L5 4.1 2.8 7.9l1.8 1.7-.3 2.4L2 13l1.5 4.2 2.5-.3 1.7 1.7-.3 2.5 4.2 1.1 1-2.3 2.4-.3 1.7 1.8 3.8-2.2-1.3-2.3.9-2.1 2.5-.6v-4.4l-2.5-.6-.9-2.1 1.3-2.3-3.8-2.2-1.7 1.8-2.4-.3L12 2Z" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="#16202b"/></svg>'],
            ['Picture in picture', '<svg viewBox="0 0 28 24"><rect x="1" y="2" width="26" height="20" rx="1" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M14 11h10v8H14Z" fill="currentColor"/></svg>'],
            ['Full screen', '<svg viewBox="0 0 24 24"><path d="M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6" fill="none" stroke="currentColor" stroke-width="3"/></svg>'],
          ];
          for (const [title, markup] of controlIcons) {
            const b = util.el('button', 'video-tool', controls);
            b.type = 'button'; b.tabIndex = -1; b.title = title; b.setAttribute('aria-label', title); b.innerHTML = markup;
          }
        }
        util.el('span', 'slm-spacer', row);
        if (!player) {
          const icon = util.el('span', 'slm-icon', row);
          icon.innerHTML = `<svg width="28" height="26" viewBox="0 0 18 16">${SPEAKER}${WAVES}</svg>`;
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
          vertical: false, length: Math.max(player ? rng.int(90, 120) : rng.int(120, 150), Math.min(210, Math.floor(size.width * .13))), thumb: 26, rail: 9, ticks: false, standalone: true, labelEl: false, cls: 'slm-vol',
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
          if (overlayTime) overlayTime.textContent = time.textContent;
          const detailDuration = document.querySelector('.media-duration');
          if (detailDuration) detailDuration.textContent = `${S.fmt(seek, seek.max)}  •  2020`;
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
