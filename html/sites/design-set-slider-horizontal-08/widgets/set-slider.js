// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-08',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    rows: 4, ticks: 4, fill: true, fillFirst: false, fillMode: 'inset',
    parts: {
      begin: () => (ctx) => {
        const u = ctx.util;
        const book=u.el('div','book-cover',ctx.stage);book.setAttribute('role','img');book.setAttribute('aria-label','Photo preview');
        const preview=u.el('img','',book);preview.src='sites/design-set-slider-horizontal-08/assets/mountain-preview.webp';preview.alt='Mountain and forest reflected in a lake';
      },
      entries: () => (ctx) => {
        const entries=ctx.spec.sliders.map((s,i)=>({s,i}));
        const extra=['Brightness','Saturation','Sharpness','Contrast'].filter(label=>!entries.some(({s})=>s.label===label));
        while(entries.length<4){const label=extra.shift();entries.push({s:{label,min:['Brightness','Saturation'].includes(label)?-100:0,max:label==='Contrast'?1000:100,step:1},i:null});}
        if(entries[0].i===0 && ctx.spec.sliders.length===1)[entries[0],entries[1]]=[entries[1],entries[0]];
        return entries;
      },
      decorative: () => (ctx, w, s) => {
        const value = s.label === 'Brightness' ? 12 : s.label === 'Saturation' ? 0 : 25;
        const fraction = (value - s.min) / (s.max - s.min);
        w.thumb.style.left = fraction * 100 + '%';
        w.fill.style.width = `calc(${fraction * 100}% + .8em)`;
        w.readout.textContent = String(value); w.row.classList.add('decorative');
      },
    },
  },
});
