// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-12',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    locateError: 'Unknown photo slider', settings: false, rows: 4, order: 'scoredLast', ticks: null, fill: true,
    parts: {
      rows: () => (ctx) => {
        const u = ctx.util;
        const canvas=u.el('div','photo-canvas',ctx.stage);const photo=u.el('img','photo',canvas);photo.src='sites/design-set-slider-horizontal-12/assets/mountains.webp';photo.alt='Snowy mountains and evergreen forest reflected in a blue alpine lake';
        const panel=u.el('section','adjustments',ctx.stage);u.el('h2','',panel,'Image Adjustments');const rows=u.el('div','adjustment-rows',panel);
        return rows;
      },
      entries: () => (ctx) => {
        const entries=ctx.spec.sliders.map((s,i)=>({s,i}));const labels=['Brightness','Contrast','Saturation','Opacity'].filter(label=>!entries.some(({s})=>s.label===label));
        while(entries.length<4)entries.push({s:{label:labels.shift(),min:-100,max:100,step:1},i:null});
        const scored=entries.filter(({i,s})=>i!==null&&s.target);const arranged=entries.filter(e=>!scored.includes(e)).concat(scored);
        return arranged;
      },
      row: () => (ctx, rows, s, i) => {
        const u = ctx.util, S = env.taskOf('set-slider').helpers.scale;
        const row=u.el('div','adjustment-row'+(i!==null&&s.target?' scored':''),rows);u.el('label','',row,s.label);
        const body=u.el('div','slider-line',row);const hit=u.el('div','slider-hit',body);hit.setAttribute('aria-label',s.label);hit.dataset.role='track';const rail=u.el('div','slider-rail',hit);const fill=u.el('div','slider-fill',hit);const thumb=u.el('div','slider-thumb',hit);thumb.dataset.role='thumb';const readout=u.el('output','slider-value',body);
        if (i === null) return { row, body, hit, fill, thumb, readout };
        const scale=u.el('div','scale-endpoints',row);u.el('span','',scale,S.fmtU(s,s.min));u.el('span','',scale,S.fmtU(s,s.max));
        return { row, body, hit, fill, thumb, readout };
      },
      decorative: () => (ctx, w) => {
        w.thumb.style.left = '58%'; w.readout.textContent = '0'; w.row.classList.add('decorative');
      },
      place: () => (ctx, w, s, i, t, p, f) => { t.style.left = (f * 100) + '%'; },
      paint: (base) => (ctx, w, s, i, values) => {
        base(ctx, w, s, i, values);
        w.fill.style.width = (env.taskOf('set-slider').helpers.scale.frac(s, values[0]) * 100) + '%';
      },
    },
  },
});
