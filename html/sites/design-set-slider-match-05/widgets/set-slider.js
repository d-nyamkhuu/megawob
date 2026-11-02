// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-match-05',
  name: 'design',
  split: 'train',
  scenarios: ['match'],
  template: 'set-slider/base',
  design: {parts: {
    makeSlider: (base) => (ctx,parent,index,s,g) => {
      const width=document.documentElement.clientWidth;
      const ui=Math.max(.78,width/1536);
      return base(ctx,parent,index,s,{
        ...g,standalone:true,thumb:30,rail:6,ticks:true,tickCount:2,readout:true,
        length:Math.max(105,Math.floor(ctx.size.width*(width<1260?.30:.2665)-125*ui)),
      });
    },
    makeNative: (base,S) => (ctx,parent,index,s,g) => S.makeSlider(ctx,parent,index,s,g),
    renderPlain: (base,S) => (ctx,look) => {
      const result=base(ctx,look);
      const card=ctx.stage.querySelector('.slc-card');
      card.className='fluent-workspace';card.removeAttribute('style');
      const preview=ctx.util.el('div','photo-preview',card);
      const img=ctx.util.el('img','lake-photo',preview);
      img.src=new URL('../assets/lake-preview.webp',S.scriptOf.src).href;img.alt='A misty mountain lake surrounded by evergreen forest';
      card.prepend(preview);
      const group=card.querySelector('.slc-grid');
      group.className='adjustment-list';group.removeAttribute('style');
      const ui=Math.max(.78,document.documentElement.clientWidth/1536);
      group.style.setProperty('--setting-spacing',Math.min(167*ui,(ctx.size.height-107*ui-20)/result.length)+'px');
      const heading=ctx.util.el('h1','adjustment-heading',group,'Adjustments');group.prepend(heading);
      const preset=card.querySelector('.slc-presets');
      if(preset){
        const rows=[...preset.querySelectorAll('tr')];
        const labels=[...rows[0].children].slice(1).map(n=>n.textContent);
        const data=rows.slice(1).map(row=>[...row.children].map(n=>n.textContent));
        preset.replaceChildren();preset.className='preset-pane';
        ctx.util.el('h2','preset-heading',preset,'Presets');
        const list=ctx.util.el('div','preset-list',preset);
        data.forEach((values,i)=>{
          const tile=ctx.util.el('div','preset-tile',list);
          const photo=ctx.util.el('img','preset-photo',tile);
          photo.src=new URL('../assets/preset-'+(i%4)+'.webp',S.scriptOf.src).href;photo.alt='';
          const copy=ctx.util.el('div','preset-copy',tile);
          ctx.util.el('div','preset-name',copy,values[0]);
          values.slice(1).forEach((v,j)=>{
            const row=ctx.util.el('div','preset-value',copy);
            ctx.util.el('span','',row,labels[j]);ctx.util.el('span','',row,v);
          });
        });
        card.append(preset);
      }
      return result;
    },
  }},
});
