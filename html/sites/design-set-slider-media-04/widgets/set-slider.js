// Keep the reference mechanics; lay out the newspaper player within the stage.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-media-04',
  name: 'design',
  split: 'train',
  scenarios: ['media'],
  template: 'set-slider/base',
  design: {
    parts: {
      makeSlider: (base) => (ctx, parent, index, spec, geometry) => {
        const width = Math.floor(ctx.size.width * .96);
        if (geometry.cls === 'slm-seek' || geometry.cls === 'slm-vol') {
          geometry = { ...geometry,
            length: Math.max(12, width - (index === 0 ? 131 : 128)),
            thumb: index === 0 ? 23 : 29,
            rail: 10,
          };
        }
        return base(ctx, parent, index, spec, geometry);
      },
      renderMedia: (base) => (ctx, look) => {
        const sliders = base(ctx, look);
        const seek = sliders[0].anchor.closest('.slm-seek');
        const box = seek.closest('.slm-player');
        const video = box.querySelector('.slm-video');
        const bar = box.querySelector('.slm-bar');
        const row = box.querySelector('.slm-row');
        const time = row.querySelector('.slm-time');
        const play = row.querySelector('.slm-btn');
        const width = Math.floor(ctx.size.width * .96);
        const top = Math.round(ctx.size.height * .13);
        Object.assign(box.style, {
          left: Math.floor(ctx.size.width * .02) + 'px', top: top + 'px',
          width: width + 'px', borderRadius: '0', boxShadow: 'none',
        });
        Object.assign(video.style, {
          height: Math.max(80, ctx.size.height - top - 130) + 'px',
        });
        // The headline is supplied by the newspaper frame; the play control
        // occupies the dark strip at the foot of the picture.
        video.querySelector('.slm-title').remove();
        video.querySelector('.slm-big').remove();
        const strip = ctx.util.el('div', 'chronicle-video-strip', video);
        Object.assign(strip.style, {
          position: 'absolute', left: '0', right: '0', bottom: '0',
          height: '42px', background: '#202020', display: 'flex', alignItems: 'center',
        });
        strip.append(play);
        Object.assign(play.style, {
          width: '34px', height: '34px', marginLeft: '12px', borderRadius: '0',
          background: 'transparent', fontSize: '25px',
        });
        Object.assign(bar.style, {
          padding: '0 12px 8px', background: '#faf9f7', color: '#111',
        });
        const seekRow = ctx.util.el('div', 'chronicle-seek-row');
        Object.assign(seekRow.style, {
          display: 'flex', alignItems: 'center', gap: '12px', height: '52px',
        });
        bar.prepend(seekRow);
        seekRow.append(time, seek);
        Object.assign(time.style, { width: '95px', flex: 'none', color: '#111' });
        Object.assign(row.style, {
          height: '56px', margin: '0', gap: '12px', borderTop: '1px solid #ddd',
        });
        row.querySelector('.slm-spacer').remove();
        Object.assign(row.querySelector('.slm-icon').style, {
          width: '32px', flex: 'none', color: '#333',
        });
        Object.assign(row.querySelector('.slm-volpct').style, {
          width: '48px', flex: 'none', color: '#111',
        });
        return sliders;
      },
    },
  },
});
