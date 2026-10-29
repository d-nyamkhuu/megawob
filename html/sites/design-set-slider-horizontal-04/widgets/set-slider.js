// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-04',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    settings: false, rows: 0, order: null, ticks: null, fill: true,
    parts: {
      prepared: () => (ctx, rows, entries) => {
        // Crowded episodes must keep every track and its readout inside the supplied stage.
        const stageStyle=getComputedStyle(ctx.stage);
        const stageHeight=ctx.size.h || ctx.size.height || ctx.stage.clientHeight;
        const available=stageHeight-parseFloat(stageStyle.paddingTop)-parseFloat(stageStyle.paddingBottom);
        const fontSize=parseFloat(stageStyle.fontSize);
        const rowFont=(available-(entries.length-1)*fontSize*.8)/entries.length/8.6;
        if(rowFont<fontSize){rows.style.fontSize=Math.max(1,rowFont)+'px';rows.classList.add('slider-rows-compact');}
        const csSpeed=document.querySelector('.cs-speed');
        if(csSpeed&&entries.length)csSpeed.previousElementSibling.textContent=entries[0].s.label;
      },
      row: () => (ctx, rows, s, i) => {
        const u = ctx.util, S = env.taskOf('set-slider').helpers.scale;
        const block=u.el('div','slider-block',rows);
        u.el('h3','',block,s.label);
        u.el('div','desc',block,'Adjust the '+(s.label==='Speed'?'playback speed of the video.':s.label.toLowerCase()+' of the video.'));
        const row=u.el('div','slider-row'+(s.target?' scored':''),block);
        u.el('span','slider-end',row,S.fmt(s,s.min));
        const body=u.el('div','slider-body',row);
        const hit=u.el('div','slider-hit',body);hit.dataset.role='track';hit.setAttribute('aria-label',s.label);
        u.el('div','slider-rail',hit);
        const fill=u.el('div','slider-fill',hit);
        const thumb=u.el('div','slider-thumb',hit);thumb.dataset.role='thumb';
        u.el('span','slider-end',row,S.fmt(s,s.max));
        const readout=u.el('output','slider-readout',thumb);
        return { row, body, hit, thumb, fill, readout };
      },
      paint: (base) => (ctx, w, s, i, vals) => {
        base(ctx, w, s, i, vals);
        const csSpeed = document.querySelector('.cs-speed');
        if (csSpeed && i === 0) csSpeed.textContent = w.readout.textContent;
      },
    },
  },
});
