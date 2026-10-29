// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-player-05',
  name: 'design',
  split: 'train',
  scenarios: ['player'],
  template: 'set-slider/base',
  design: {
    parts: {
      // One control row under a full-width video: play, time, seek, speaker, volume, mute, CC.
      renderMedia: (base, S) => function renderMedia(ctx, look) {
        const { env, makeSlider, SPEAKER, WAVES, CAPTION_LINES, CROSS, placeIn } = S;
        const { spec, rng, util, size } = ctx;
        const F = env.taskOf('set-slider').helpers.scale;
        const [seek, vol] = spec.sliders;
        const W = Math.floor(size.width);
        const H = Math.floor(size.height);
        const BAR = 96;
        const PW = W;
        // Same draws as the template, in the same order (sizes below ignore them).
        rng.int(560, 900);
        rng.float(0.36, 0.56);
        const box = util.el('div', 'slm-player', ctx.stage);
        box.style.width = PW + 'px';
        const video = util.el('div', 'slm-video', box);
        rng.int(0, 359);
        video.style.height = Math.max(100, H - BAR - 6) + 'px';
        util.el('div', 'slm-title', video, spec.title);
        util.el('div', 'slm-big', video);
        const bar = util.el('div', 'slm-bar', box);
        bar.style.height = BAR + 'px';
        const t = rng.int(12, 16);
        const out = [];
        const row = util.el('div', 'slm-row', bar);
        const play = util.el('button', 'slm-btn', row, '▶');
        play.type = 'button';
        play.tabIndex = -1;
        const time = util.el('span', 'slm-time', row);
        const L = Math.max(80, PW - (PW < 900 ? 585 : 610));
        out[0] = makeSlider(ctx, row, 0, seek, {
          vertical: false, length: L, thumb: 20, rail: rng.int(3, 6), ticks: false, standalone: true, labelEl: false, cls: 'slm-seek',
          buffer: rng.float(0.3, 1), fmt: (v) => F.fmt(seek, v),
        });
        const spk = util.el('span', 'slm-icon', row);
        spk.innerHTML = `<svg width="26" height="24" viewBox="0 0 18 16">${SPEAKER}${WAVES}</svg>`;
        const toggles = {};
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
        rng.bool(0.6);
        const caption = util.el('div', 'slm-caption', video, rng.pick(CAPTION_LINES));
        const pct = util.el('span', 'slm-volpct');
        out[1] = makeSlider(ctx, row, 1, vol, {
          vertical: false, length: (PW < 900 ? 100 : 170) + 0 * rng.int(90, 120), thumb: 20, rail: 4, ticks: false, standalone: true, labelEl: false, cls: 'slm-vol',
          readoutEl: pct, fmt: (v) => `${v}%`,
          patch: () => (ctx.model.muted ? { muted: false } : null),
        });
        row.append(pct);
        button('mute', 'Mute (m)');
        button('captions', 'Subtitles/closed captions (c)').innerHTML = '<span class="slm-cc">CC</span>';
        const paintTime = () => {
          time.textContent = `${F.fmt(seek, ctx.model.values[0][0])} / ${F.fmt(seek, seek.max)}`;
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
        placeIn(ctx, box, rng, 0);
        out.paintTime = paintTime;
        out.toggles = toggles;
        return out;
      },
    },
  },
});
