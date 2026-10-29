// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-mixer-01',
  name: 'design',
  split: 'train',
  scenarios: ['mixer'],
  template: 'set-slider/base',
  design: {
    parts: {
      'renderMixer': (base, S) => function renderMixer(ctx, look) {
        const { makeSlider, placeIn } = S;
        const { spec, rng, util, size } = ctx;
        const status=document.querySelector('.mixer-status');
        if(status)status.textContent=`${spec.sliders.length} channels active`;
        const mixer = util.el('div', 'slx-mixer', ctx.stage);
        mixer.dataset.role = 'mixer';
        const L = Math.max(1, Math.min(650, Math.floor(size.height) - 150, Math.round(rng.int(220, 360) * 1.8)));
        const stripWidth = Math.min(250, Math.max(150, size.width * .15), (size.width - 2) / spec.sliders.length);
        const out = spec.sliders.map((s, i) => {
          const strip = util.el('div', 'slx-strip', mixer);
          util.el('div', 'slx-name', strip, s.label).title = s.label;
          const val = util.el('div', 'slx-val', strip);
          const body = util.el('div', 'slx-body', strip);
          const sl = makeSlider(ctx, body, i, s, {
            vertical: true, length: L, thumb: 24, thumbBox: [42, 34], rail: 8, ticks: true, tickCount: 10, labelEl: false, cls: 'slx-fader',
            readoutEl: val,
          });
          const meter = util.el('div', 'slx-meter', body);
          meter.style.height = L + 'px';
          meter.style.display = 'none';
          strip.appendChild(val);
          Object.assign(strip.style,{boxSizing:'border-box',minWidth:'0',width:`${stripWidth}px`,flex:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'11px',padding:'8px 8px 12px',borderRight:i===spec.sliders.length-1?'0':'1px solid #393247',borderRadius:'0',background:'transparent'});
          const name=strip.querySelector('.slx-name');Object.assign(name.style,{font:'500 20px "Segoe UI",Arial,sans-serif',color:'#e8e3f2',whiteSpace:'nowrap',maxWidth:'100%',overflow:'hidden',textOverflow:'ellipsis'});
          Object.assign(body.style,{display:'block',position:'relative',width:'76px',height:L+'px',overflow:'visible'});
          const hit=body.querySelector('.slc-hit');Object.assign(hit.style,{position:'absolute',left:'17px',top:'0',width:'42px',height:L+'px',margin:'0',touchAction:'none'});
          const rail=hit.querySelector('.slc-rail');Object.assign(rail.style,{left:'50%',transform:'translateX(-50%)',width:'8px',background:'#171321',border:'1px solid #42384f',borderRadius:'5px'});
          const fill=hit.querySelector('.slc-fill');Object.assign(fill.style,{left:'50%',transform:'translateX(-50%)',width:'6px',background:'#f0525b',borderRadius:'2px'});
          const thumb=hit.querySelector('.slc-thumb');Object.assign(thumb.style,{width:'42px',height:'34px',border:'0',borderRadius:'8px',background:'linear-gradient(#ff686e,#e4424e)',boxShadow:'0 2px 5px #130e1d88'});
          const ticks=body.querySelector('.slc-ticks');if(ticks){Object.assign(ticks.style,{left:'0',right:'auto',top:'0',bottom:'0',width:'76px',overflow:'visible',color:'#aaa1bd',font:'14px "Segoe UI",Arial,sans-serif'});for(const tick of ticks.children){tick.style.left='0';tick.style.transform='translate(-100%,-50%)';tick.style.color='#c9c1d8';}}
          Object.assign(val.style,{boxSizing:'border-box',width:`${Math.min(stripWidth - 16,150,Math.max(110,size.width*.09))}px`,minWidth:'0',padding:'7px 8px',borderRadius:'7px',border:'1px solid #3c344b',background:'#211b2b',color:'#f0ecf7',font:'19px "Segoe UI",Arial,sans-serif',textAlign:'center',whiteSpace:'nowrap'});
          return sl;
        });
        placeIn(ctx, mixer, rng);
        Object.assign(mixer.style,{boxSizing:'border-box',position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',display:'flex',gap:'0',padding:'18px 0 20px',border:'1px solid #40364f',borderRadius:'9px',background:'linear-gradient(135deg,#292337,#262134)',boxShadow:'0 2px 8px #100c1b55'});
        return out;
      },
      'renderFaders': (base, S) => function renderFaders(ctx, look, colors) {
        const { spec, rng, util, size } = ctx;
        const th = rng.pick([90, 120, 150]);
        const ratio = 1;
        const maxV = Math.max(240, Math.min(440, Math.floor(size.height) - 200));
        const card = util.el('div', 'sla-card', ctx.stage);
        const row = util.el('div', 'sla-row', card);
        if (spec.sliders.length >= 3) row.style.gap = '28px';
        const shared = rng.int(260, Math.max(260, Math.floor(maxV / ratio)));
        const out = spec.sliders.map((s, i) => {
          const L = Math.max(s.log ? 450 : 260, spec.norm ? shared : rng.int(260, Math.max(260, Math.floor(maxV / ratio))));
          const sl = makeSlider(ctx, row, i, s, { vertical:true, standalone:true, length:L, thumb:24, rail:4, ticks:true, tickCount:10, readout:true, cls:'mixer-fader' });
          const root = row.lastElementChild;
          root.classList.add('sla-col');
          Object.assign(root.style,{width:`${Math.min(214,Math.max(120,size.width*.128))}px`,gap:'12px',padding:'5px 10px 0',borderRight:i===spec.sliders.length-1?'0':'1px solid #393247'});
          root.querySelector('.slc-label').classList.add('sla-label');
          root.querySelector('.slc-label').style.color='#e8e3f2';
          const hit=root.querySelector('.slc-hit');hit.dataset.role='track';
          hit.style.width='42px';hit.style.height=L+'px';hit.style.margin='0 42px';
          const rail=root.querySelector('.slc-rail');Object.assign(rail.style,{left:'50%',transform:'translateX(-50%)',width:'8px',background:'#171321',border:'1px solid #42384f',borderRadius:'5px'});
          const fill=root.querySelector('.slc-fill');Object.assign(fill.style,{left:'50%',transform:'translateX(-50%)',width:'6px',background:'#f0525b',borderRadius:'2px'});
          const thumb=root.querySelector('.slc-thumb');Object.assign(thumb.style,{width:'42px',height:'34px',border:'0',borderRadius:'8px',background:'linear-gradient(#ff686e,#e4424e)',boxShadow:'0 2px 5px #130e1d88'});
          const readout=root.querySelector('.slc-readout');readout.classList.add('sla-readout');Object.assign(readout.style,{width:'100%',padding:'7px 8px',borderRadius:'7px',border:'1px solid #3c344b',background:'#211b2b',color:'#f0ecf7',fontSize:'19px',textAlign:'center'});
          for(const tick of root.querySelectorAll('.slc-tick')){tick.style.color='#c9c1d8';tick.style.fontSize='14px';tick.style.left='-22px';tick.style.transform='translateY(-50%)';}
          return sl;
        });
        card.style.position='fixed';card.style.left='50vw';card.style.top='50vh';card.style.transform='translate(-50%,-50%)';
        Object.assign(card.style,{padding:'18px 0 20px',border:'1px solid #40364f',borderRadius:'9px',background:'#292337',boxShadow:'0 2px 8px #100c1b55',zIndex:'2'});
        row.style.gap='0';
        return out;
      },
    },
  },
});
