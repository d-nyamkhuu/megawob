// Soundscape's two-pane layout, using the base template's slider mechanics.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-match-03',
  name: 'design',
  split: 'train',
  scenarios: ['match'],
  template: 'set-slider/base',
  design: {
    parts: {
      // Keep the template's RNG draws and slider mechanics; size the two panes
      // and their instruments together, before the kit records the anchors.
      '+0.soundLayout': (_, S) => (ctx) => {
        const w = ctx.size.width, h = ctx.size.height;
        const compact = w < 700;
        const left = Math.round(w * .025);
        const pane = Math.round(w * (compact ? .58 : .60));
        const label = Math.min(compact ? 78 : 96,
          Math.max(compact ? 54 : 80, ...ctx.spec.sliders.map(s => s.label.length * (compact ? 6 : 7))));
        const gap = compact ? 8 : 16;
        const readout = compact ? 58 : 80;
        const thumb = 25;
        return {w, h, left, pane, label, gap, readout, thumb,
          length: Math.max(40, pane - label - readout - gap * 2 - thumb)};
      },
      makeSlider: (base, S) => (ctx, parent, index, slider, geometry) => {
        const g = S.soundLayout(ctx);
        return base(ctx, parent, index, slider,
          {...geometry, length:g.length, thumb:g.thumb, rail:10});
      },
      makeNative: (base, S) => (ctx, parent, index, slider, geometry) => {
        const g = S.soundLayout(ctx);
        return base(ctx, parent, index, slider,
          {...geometry, length:g.length, thumb:g.thumb, rail:10});
      },
      renderPlain: (base, S) => (ctx, look) => {
        const controls = base(ctx, look);
        const g = S.soundLayout(ctx);
        const card = ctx.stage.querySelector('.slc-card');
        Object.assign(card.style, {left:'0', top:'0', width:g.w+'px', height:g.h+'px',
          padding:'0', border:'0', borderRadius:'0', background:'transparent', boxShadow:'none'});
        const group = card.querySelector('.slc-grid');
        const rowHeight = 46;
        const top = Math.min(g.h * .12, 64);
        const pitch = Math.min(Math.max(70, g.h * .28),
          (g.h - top - 34) / ctx.spec.sliders.length);
        Object.assign(group.style, {position:'absolute', left:g.left+'px', top:top+'px',
          width:g.pane+'px', gridTemplateColumns:`${g.label}px ${g.length + g.thumb}px ${g.readout}px`,
          columnGap:g.gap+'px', rowGap:Math.max(0, pitch-rowHeight)+'px', alignItems:'center'});
        for (const label of group.querySelectorAll('.slc-label')) {
          Object.assign(label.style, {minWidth:'0', whiteSpace:'normal', textAlign:'left', padding:'0'});
        }
        for (const value of group.querySelectorAll('.slc-readout')) {
          Object.assign(value.style, {width:g.readout+'px', height:rowHeight+'px', padding:'10px 4px'});
        }
        const presets = card.querySelector('.slc-presets');
        Object.assign(presets.style, {position:'absolute', right:'1.2%', top:'2.7%', bottom:'2.7%',
          width:(g.w < 700 ? '37%' : '35%'), margin:'0', padding:g.w < 700 ? '8px' : '12px', overflow:'auto'});
        const table = presets.querySelector('table');
        Object.assign(table.style, {width:'100%', tableLayout:'fixed', borderCollapse:'separate', borderSpacing:'0 5px'});
        const caption = presets.querySelector('caption');
        caption.classList.add('sound-preset-caption');
        Object.assign(caption.style, {padding:'2px 2px 10px', textTransform:'none', letterSpacing:'0'});
        const cells = presets.querySelectorAll('th,td');
        for (const cell of cells) {
          cell.classList.add(cell.tagName === 'TH' ? 'sound-preset-heading' : 'sound-preset-cell');
          Object.assign(cell.style, {padding:g.w < 700 ? '7px 4px' : '10px 8px',
            whiteSpace:'normal', overflowWrap:'anywhere'});
        }
        table.rows[0].cells[0].style.width = '36%';
        if (table.rows[1]) table.rows[1].classList.add('sound-preset-selected');
        for (const row of table.rows) row.style.height = Math.min(60, Math.max(34,
          (g.h * .86 - 50) / table.rows.length))+'px';
        return controls;
      },
    },
  },
});
