// Design on templates/set-slider/base.js, with stage-sized player geometry.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-player-04',
  name: 'design',
  split: 'train',
  scenarios: ['player'],
  template: 'set-slider/base',
  design: {
    parts: {
      // Keep the template's controls, model updates and seeded draws; only size
      // the industrial player to the actual stage rather than the viewport.
      makeSlider: (base) => (ctx, parent, index, spec, geometry) => {
        const width = Math.min(960, Math.floor(ctx.size.width) - 24);
        const compact = width < 760;
        const inset = compact ? 8 : 20;
        const length = geometry.cls === 'slm-seek'
          ? width - 2 * inset - 38
          : Math.max(50, Math.floor((width - 80) * .24));
        return base(ctx, parent, index, spec, {...geometry, length});
      },
      'placeIn@0': (base) => (ctx, box, rng, pad) => {
        const width = Math.min(960, Math.floor(ctx.size.width) - 24);
        const compact = width < 760;
        Object.assign(box.style, {
          boxSizing: 'border-box', width: width + 'px',
          padding: compact ? '8px' : '12px 20px 14px',
        });
        const video = box.querySelector('.slm-video');
        const bar = box.querySelector('.slm-bar');
        const row = box.querySelector('.slm-row');
        Object.assign(bar.style, {padding: '8px 8px 0'});
        Object.assign(row.style, {gap: compact ? '6px' : '10px', marginTop: '6px'});
        const label = ctx.util.el('span', 'media-volume-label', null, 'Volume:');
        row.insertBefore(label, row.querySelector('.slm-vol'));
        label.style.fontSize = compact ? '12px' : '16px';
        label.style.order = '3';
        row.querySelector('.slm-spacer').style.order = '2';
        const time = row.querySelector('.slm-time');
        Object.assign(time.style, {width: compact ? '112px' : '150px', flex: 'none'});
        time.style.setProperty('font-size', compact ? '11px' : '16px', 'important');
        for (const button of row.querySelectorAll('button')) {
          const toggle = button.dataset.role === 'mute' || button.dataset.role === 'captions';
          Object.assign(button.style, {
            width: (toggle ? (compact ? 32 : 54) : (compact ? 22 : 28)) + 'px',
            height: (toggle ? (compact ? 34 : 54) : (compact ? 24 : 30)) + 'px',
            padding: '0', flex: 'none',
            order: button.dataset.role === 'mute' ? '1'
              : button.dataset.role === 'captions' ? '6'
              : button.classList.contains('slm-xtra') ? '7' : '0',
          });
        }
        const pct = row.querySelector('.slm-volpct');
        Object.assign(pct.style, {width: compact ? '36px' : '48px', flex: 'none', order: '5'});
        pct.style.setProperty('font-size', compact ? '12px' : '16px', 'important');
        const volume = row.querySelector('.slm-vol');
        volume.style.flex = 'none';
        volume.style.order = '4';
        const metadata = ctx.util.el('div', 'media-metadata', box,
          'Title:        Mountain Lake\nDuration:     3:03\nFormat:       MPEG-4 (H.264)\nVideo:        1280 × 720, 24 fps\nAudio:        AAC, 44.1 kHz, stereo');
        metadata.style.fontSize = compact ? '10px' : '15px';
        // Measure the controls and metadata before placing the player so every
        // anchor stays inside the stage, including with a long instruction.
        video.style.height = '0px';
        const rest = box.offsetHeight;
        video.style.height = Math.max(0, Math.min(compact ? 300 : 450,
          Math.floor(ctx.size.height) - rest - 26)) + 'px';
        base(ctx, box, rng, pad);
      },
    },
  },
});
