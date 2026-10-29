// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-01',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    settings: false, rows: 0, order: null,
    parts: {
      rows: () => (ctx) => {
        const u = ctx.util;
        const op=u.el('section','op',ctx.stage);
        u.el('h3','',op,'Operating Parameters');
        const rows=u.el('div','op-grid',op);
        u.el('div','op-hd',rows,'Parameter');u.el('div','op-hd',rows,'Control');u.el('div','op-hd',rows,'Current Value');
        return rows;
      },
      row: () => (ctx, rows, s, i) => {
        const u = ctx.util, S = env.taskOf('set-slider').helpers.scale;
        u.el('div','op-name',rows,s.label);
        const body=u.el('div','op-ctl',rows);
        const hit=u.el('div','slider-hit',body);hit.dataset.role='track';hit.setAttribute('aria-label',s.label);
        u.el('div','slider-rail',hit);
        const scale=u.el('div','slider-scale',body);
        for(let n=0;n<=5;n++){const tick=u.el('i','slider-tick',hit);tick.style.left=(n*20)+'%';
          const lab=u.el('span','',scale,S.fmt(s,s.min+(s.max-s.min)*n/5));lab.style.left=(n*20)+'%';}
        const thumb=u.el('div','slider-thumb',hit);thumb.dataset.role='thumb';
        const readout=u.el('output','op-val',rows);
        return { row: rows, body, hit, thumb, readout };
      },
    },
  },
});
