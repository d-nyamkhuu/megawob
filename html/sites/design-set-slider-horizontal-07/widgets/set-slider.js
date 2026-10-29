// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-07',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    settings: false, rows: 0, order: null,
    parts: {
      rows: () => (ctx) => {
        const u = ctx.util;
        const head=u.el('div','perf-head',ctx.stage);
        env.icon(head,'gauge','gauge');
        const ht=u.el('div','',head);u.el('h2','',ht,'Performance Settings');u.el('p','',ht,'Adjust system performance options.');
        u.el('hr','perf-rule',ctx.stage);
        const rows=u.el('div','slider-rows',ctx.stage);
        return rows;
      },
      prepared: () => (ctx) => { if (ctx.spec.sliders.length > 1) ctx.stage.classList.add('multi'); },
      row: () => (ctx, rows, s, i) => {
        const u = ctx.util, S = env.taskOf('set-slider').helpers.scale;
        const row=u.el('div','slider-row',rows);
        const info=u.el('div','slider-info',row);
        u.el('label','slider-label',info,s.label);
        u.el('p','slider-desc',info,s.label==='Speed'?'Controls processing speed.':'Controls '+String(s.label).toLowerCase()+'.');
        const body=u.el('div','slider-body',row);
        const hit=u.el('div','slider-hit',body);hit.dataset.role='track';hit.setAttribute('aria-label',s.label);
        u.el('div','slider-rail',hit);
        for(let k=0;k<=8;k++){const tick=u.el('i','slider-tick',hit);tick.style.left=(k*12.5)+'%';}
        const thumb=u.el('div','slider-thumb',hit);thumb.dataset.role='thumb';
        const endpoints=u.el('div','slider-endpoints',body);u.el('span','',endpoints,S.fmt(s,s.min));u.el('span','',endpoints,S.fmt(s,s.max));
        const box=u.el('div','readout-box',row);
        u.el('div','readout-head',box,'Current Value');
        const readout=u.el('output','slider-readout',box);
        return { row, body, hit, thumb, readout };
      },
      rendered: () => (ctx) => {
        const u = ctx.util, S = env.taskOf('set-slider').helpers.scale;
        const s0=ctx.spec.sliders[0];
        const info=u.el('div','info-box',ctx.stage);
        env.icon(info,'info','info');
        const it=u.el('div','',info);
        u.el('p','',it,'Available range: '+S.fmt(s0,s0.min)+' – '+S.fmt(s0,s0.max));
        u.el('p','',it,'Drag the handle to set the value.');
      },
    },
  },
});
