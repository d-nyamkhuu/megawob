// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-claim-05',
  name: 'design',
  split: 'train',
  scenarios: ['claim'],
  template: 'fill-form/base',
  design: { parts: {
    workspace: (base) => function (...args) {
      const r=base(...args);
      const root=args[0].stage.querySelector('.ff-workspace');
      if(root)root.classList.add('claim-workspace');
      return r;
    },
    renderScan: (base) => function (ctx) {
      const result=base(ctx), root=result.anchors[0], u=ctx.util;
      root.classList.add('claim-workspace');
      root.classList.toggle('claim-short',root.clientHeight<760);
      const sidebar=document.querySelector('.claim-sidebar');
      const queue=root.querySelector('.ff-queue');
      if(queue&&sidebar){const d=u.el('details','claim-collection',sidebar);u.el('summary','',d,'Recent Documents');d.appendChild(queue);}
      const app=root.querySelector('.ff-appbar'), context=root.querySelector('.ff-contextbar');
      if(sidebar){const d=u.el('details','claim-collection',sidebar);u.el('summary','',d,'Workspace');if(app)d.appendChild(app);if(context)d.appendChild(context);}
      const view=root.querySelector('.ff-scan-view'), entry=root.querySelector('.ff-scan-entry');
      const inspector=root.querySelector('.ff-inspector')||u.el('aside','ff-inspector',root.querySelector('.ff-workbody'));
      const main=root.querySelector('.ff-workcenter');
      const tabs=u.el('div','claim-segments',main);
      const docButton=u.el('button','selected',tabs,'Document');
      const formButton=u.el('button','',tabs,'Form');
      const refresh=()=>{const pane=root.querySelector('.ff-scan-fields');if(pane)pane.dispatchEvent(new Event('scroll'));};
      const select=(form)=>{root.classList.toggle('claim-form-active',form);docButton.classList.toggle('selected',!form);formButton.classList.toggle('selected',form);docButton.setAttribute('aria-selected',String(!form));formButton.setAttribute('aria-selected',String(form));refresh();};
      docButton.addEventListener('click',()=>select(false));formButton.addEventListener('click',()=>select(true));
      docButton.setAttribute('aria-selected','true');formButton.setAttribute('aria-selected','false');
      const canvas=view.querySelector('.ff-scan-scroll canvas');
      if(canvas){
        const c=canvas.getContext('2d'), W=660,H=734; c.save();c.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
        c.fillStyle='#fafafa';c.fillRect(0,0,W,H);
        for(let y=0;y<H;y+=3){c.fillStyle='rgba(130,140,150,'+(0.008+(Math.sin(y*1.7)+1)*0.004)+')';c.fillRect(0,y,W,1);}
        c.fillStyle='rgba(60,65,70,.016)';for(let yy=0;yy<H;yy+=4)for(let xx=0;xx<W;xx+=4){if(Math.sin(xx*17.3+yy*23.1)>.3)c.fillRect(xx,yy,1,1);}
        const rows=ctx.spec.doc.rows||[], data=Object.fromEntries(rows.map(r=>[r.id,r]));
        const line=(y,x=30,x2=626)=>{c.strokeStyle='#666';c.lineWidth=.8;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y);c.stroke();};
        const text=(s,x,y,size=17,bold=false)=>{c.font=(bold?'600 ':'')+size+'px Arial';c.fillStyle='#151515';c.fillText(s,x,y);};
        const hand=(s,x,y,size=23)=>{c.font='italic '+size+'px '+(size>=29?'Georgia':'Arial');c.fillStyle='#173581';let offset=0;Array.from(String(s)).forEach((ch,i)=>{const advance=c.measureText(ch).width+.55;c.save();c.translate(x+offset,y+Math.sin(i*1.7)*.65);c.rotate(Math.sin(i*2.3)*.024);c.fillText(ch,0,0);c.restore();offset+=advance;});};
        c.fillStyle='#545b61';for(let n=0;n<3;n++){c.beginPath();c.moveTo(34,51+n*11);c.bezierCurveTo(62,12+n*11,85,83+n*7,111,49+n*8);c.bezierCurveTo(91,93+n*8,66,46+n*11,34,62+n*11);c.fill();}
        c.strokeStyle='#fafafa';c.lineWidth=5;for(let n=0;n<2;n++){c.beginPath();c.moveTo(33,61+n*13);c.bezierCurveTo(60,36+n*13,77,91+n*13,113,62+n*13);c.stroke();}
        const issuer=ctx.spec.doc.issuer||'Insurance';const words=issuer.split(' ');c.fillStyle='#51575e';c.font='bold 29px Georgia';c.fillText(words.slice(0,-1).join(' ')||issuer,128,62);c.fillText(words.length>1?words.slice(-1)[0]:'Insurance',128,89);
        text('Property Loss Notice',393,80,20,true);
        if(data.claimNo){text('Claim No.',370,132,16);hand(data.claimNo.value,464,132,23);line(139,449,621);}
        text('Insured Information',30,188,18,true);line(195);
        let y=224;
        if(data.email){text('Contact Email:',34,124,12);hand(data.email.value,34,145,17);}
        ['customer','policy','phone'].forEach(id=>{if(!data[id])return;text(id==='customer'?'Name:':id==='policy'?'Policy Number:':'Phone:',30,y,16);hand(data[id].value,id==='policy'?172:145,y,23);line(y+7,90,625);y+=33;});
        y=Math.max(326,y+3);text('Incident Details',30,y,18,true);line(y+7);y+=37;
        ['lossDate','location','cause'].forEach(id=>{if(!data[id])return;const label=id==='lossDate'?'Date of Loss:':id==='location'?'Location of Loss:':'Description of Incident:';text(label,30,y,16);const x=id==='lossDate'?172:id==='location'?191:48;if(id==='cause')y+=33;hand(data[id].value,x,y,23);line(y+8,id==='cause'?30:150,625);y+=36;});
        const drawn=new Set(['claimNo','customer','policy','phone','email','lossDate','location','cause','amount']);
        if(data.cause&&!rows.some(r=>!drawn.has(r.id))){line(y+6);line(y+40);}
        rows.filter(r=>!drawn.has(r.id)).forEach(r=>{text(r.label+':',30,y,16);hand(r.value,220,y,21);line(y+7);y+=32;});
        const amountY=Math.max(580,Math.min(610,y+32));text('Estimated Loss',30,amountY,18,true);line(amountY+7);
        if(data.amount){text('Estimated Amount:',30,amountY+37,16);hand(data.amount.value,253,amountY+37,25);line(amountY+44,229,390);}
        if(data.customer){hand(data.customer.value,55,704,30);c.strokeStyle='#173581';c.lineWidth=1.3;c.beginPath();c.moveTo(52,707);c.bezierCurveTo(105,696,170,718,250,699);c.stroke();line(710,30,326);text('Insured Signature',30,727,13);}
        line(710,405,625);text('Date',493,727,13);c.restore();
      }
      if(inspector){
        const old=u.el('details','claim-original-info');u.el('summary','',old,'Record information');
        Array.from(inspector.children).forEach(n=>old.appendChild(n));
        const metadata=u.el('div','claim-metadata',inspector);u.el('h2','',metadata,'▤  Document Details');
        [['File Name',ctx.spec.layout.pdf.file],['Document Type','Insurance Claim'],['Date Added','Mar 14, 2024, 4:27 PM'],['File Size','1.2 MB']].forEach(([label,value])=>{u.el('div','claim-meta-label',metadata,label);u.el('div','claim-meta-value',metadata,value);});
        if(canvas){const thumb=u.el('canvas','claim-document-thumb',metadata);thumb.width=230;thumb.height=282;thumb.getContext('2d').drawImage(canvas,0,0,230,282);}
        metadata.appendChild(old);
        if(entry)inspector.appendChild(entry);
      }
      if(canvas){
        const w=parseFloat(canvas.style.width)||canvas.width/2;
        root.claimFit=()=>{const width=parseFloat(canvas.style.width)||w;const scale=Math.min(1.355,(view.clientHeight-60)/(width*734/660),(view.clientWidth-20)/width);root.style.setProperty('--claim-paper-scale',String(Math.max(.25,scale)));};
        root.claimFit();
        const zoom=root.querySelector('.ff-scan-zoom');
        if(zoom)zoom.textContent='100%';
        const toolbar=root.querySelector('.ff-scan-toolbar');
        if(toolbar)toolbar.addEventListener('click',(e)=>{const b=e.target.closest('button');const label=b?(b.title||b.getAttribute('aria-label')||''):'';if(/fit/i.test(label)){root.claimFit();if(zoom)zoom.textContent='100%';}else if(zoom)zoom.textContent=Math.round(parseFloat(canvas.style.width)/w*100)+'%';});
      }
      refresh();
      return result;
    }
  } },
});
