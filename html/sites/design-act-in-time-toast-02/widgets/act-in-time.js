// Keep the shared task behavior and RNG draws; size the record's layout during render.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-toast-02',
  name: 'design',
  split: 'train',
  scenarios: ['toast'],
  template: 'act-in-time/base',
  design: {parts: {
    frame: (base) => (ctx) => {
      const f = base(ctx);
      // The record's own tabs and heading supply the console frame.
      f.arena.querySelector('.ut-bar').remove();
      Object.assign(f.arena.style, {left:'0px', top:'0px', width:'100%', height:'100%',
        border:'0', borderRadius:'0', boxShadow:'none', background:'#fff'});
      Object.assign(f.body.style, {display:'block', position:'relative', width:'100%',
        height:'100%', padding:'0', margin:'0'});
      return f;
    },
    buildToast: (base) => (ctx, f) => {
      const view = base(ctx, f);
      const main = f.body.querySelector('.ut-main');
      const card = main.querySelector('.ut-verify');
      const vl = card.querySelector('.ut-vl');
      const boxes = card.querySelector('.ut-boxes');
      const pad = card.querySelector('.ut-pad3');
      const send = vl.querySelector('.ut-btn');
      const verify = vl.querySelector('.primary');
      const toast = f.body.querySelector('.ut-ctoast');
      const w = ctx.size.width, h = ctx.size.height;
      const compact = h < 400;
      const boxTop = compact ? 38 : 92;
      const boxH = compact ? 40 : 54;
      const gap = compact ? 5 : 7;
      const padTop = boxTop + boxH + (compact ? 16 : 23);
      const verifyH = compact ? 36 : 52;
      const bottom = compact ? 10 : 18;
      const keyH = Math.min(50, Math.floor((h - padTop - verifyH - bottom - 20 - 3 * gap) / 4));
      Object.assign(main.style, {position:'relative', display:'block', width:'100%', height:'100%'});
      Object.assign(card.style, {left:'0px', top:'0px', width:'100%', height:'100%',
        boxSizing:'border-box', padding:'20px 22px', display:'block', overflow:'hidden',
        border:'1px solid #d7e1e9', borderRadius:'6px', boxShadow:'none'});
      Object.assign(vl.style, {width:'48%', height:'100%', boxSizing:'border-box',
        padding:compact?'18px 15px 12px 20px':'18px 28px 20px 35px',
        gap:compact?'6px':'12px', borderRight:'1px solid #d9e2e9'});
      Object.assign(vl.querySelector('h3').style, {fontSize:compact?'20px':'28px',
        lineHeight:'1.2', marginBottom:compact?'8px':'26px'});
      Object.assign(send.style, {height:compact?'36px':'55px', flexShrink:'0', marginTop:'7px'});
      Object.assign(boxes.style, {position:'absolute', left:'60%', top:boxTop+'px', width:'36%', gap:'8px'});
      for (const cell of boxes.children) Object.assign(cell.style, {maxWidth:'none', height:boxH+'px'});
      Object.assign(pad.style, {position:'absolute', left:'61%', top:padTop+'px', width:'34%',
        gridTemplateColumns:'repeat(3,minmax(0,1fr))', gridAutoRows:keyH+'px', gap:gap+'px'});
      Object.assign(pad.children[9].style, {gridColumn:'3', gridRow:'4'});
      Object.assign(pad.children[10].style, {gridColumn:'2', gridRow:'4'});
      pad.lastElementChild.remove();
      Object.assign(verify.style, {position:'absolute', left:'60%', bottom:bottom+'px',
        width:'36%', height:verifyH+'px', marginTop:'0'});
      // Keep the transient code clear of Send, the entered digits and every key.
      Object.assign(toast.style, {left:'14px', right:'auto', top:'14px', bottom:'auto',
        width:Math.min(270, w * .48 - 28)+'px', boxSizing:'border-box'});
      return view;
    },
  }},
});
