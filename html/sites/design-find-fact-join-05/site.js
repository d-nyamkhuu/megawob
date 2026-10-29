(function () {
  'use strict';
  env.site({
    name: 'design-find-fact-join-05',
    template: 'site/base',
    styles: ['site.css'],
    design: {
      parts: {
        frame: (_base, S) => (ctx) => {
          const u = ctx.util;
          const root = u.el('div', 'nw-shell', document.body);
          const rail = u.el('aside', 'nw-rail', root);
          const brand=u.el('div', 'nw-brand', rail);u.el('span','nw-mark',brand,'⬡');u.el('b','',brand,'Northwind');
          const nav = u.el('nav', 'nw-nav', rail);
          [['▦','Orders'],['♙','Customers'],['⬡','Products'],['▥','Reports'],['⚙','Settings']].forEach((x,i) => {
            const a = u.el('div', i === 0 ? 'nw-navitem active' : 'nw-navitem', nav);
            u.el('span', 'nw-navicon', a, x[0]); u.el('span', '', a, x[1]);
          });
          const backdrop = u.el('div', 'nw-workspace', root);
          const ghost = u.el('div', 'nw-ghost', backdrop);
          const left = u.el('div', 'nw-ghostcol', ghost);
          u.el('h3', '', left, 'Recent Orders');
          const mini = u.el('div', 'nw-minitable', left);
          ['Order ID','O7719','O7718','O7717','O7716','O7715','O7714','O7713','O7712'].forEach((t,i)=>u.el('div', i?'':'head',mini,t));
          u.el('h3', '', left, 'Top Products');
          ['Product','Wireless Mouse','Mechanical Keyboard','USB-C Hub','27” Monitor','Laptop Stand'].forEach((t,i)=>u.el('div',i?'nw-minirow':'nw-minirow head',left,t));
          const stats = u.el('aside', 'nw-stats', ghost);
          function card(title, icon, rows) { const c=u.el('section','nw-stat',stats); const h=u.el('h3','',c);u.el('i','',h,icon);u.el('span','',h,title); rows.forEach((r)=>{const q=u.el('div','nw-statrow',c);u.el('span','',q,r[0]);u.el('b','',q,r[1]);}); }
          card('Orders','🛒',[['Total orders','8'],['Shipped','3'],['Processing','3'],['Delivered','2']]);
          card('Customers','♟',[['Total customers','10'],['Countries','7'],['New this month','2']]);
          card('Revenue','▥',[['Total (USD)','$2,193.90'],['Average order','$274.24']]);
          u.el('div','nw-art',stats);
          let display = ctx.display || 'header';
          if ((display === 'panel' || display === 'toast') && window.innerWidth < 1450) display = 'header';
          if (display === 'toast' && window.innerHeight < 700) display = 'header';
          root.classList.add(`mode-${display}`);
          const shell = u.el('section','nw-window',backdrop);
          const header = u.el('header','nw-windowhead',shell);
          u.el('h1','',header,'Customer Directory and Orders');
          const tr=ctx.rng.fork('chrome/end');
          const labels=((ctx.content&&ctx.content.END_LABELS)||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(x=>typeof x==='string'?x:x.label||x.text||x.name);
          const placement=ctx.finish?null:(tr.bool(.62)?'header':tr.pick(['footer','link']));
          const label=ctx.finish?'':(placement==='header'&&tr.bool(.55)?'OK':tr.pick(labels));
          if (display==='header') u.el('div','nw-note',header,ctx.instruction);
          const controls=u.el('div','nw-controls',header);
          const coll=ctx.rng.fork('chrome/collide');
          let collide=null;
          if(!ctx.finish&&coll.bool(.3)){const opts=labels.filter(x=>x.toLowerCase()!==label.toLowerCase());if(opts.length)collide=coll.pick(opts);}
          if(collide){const b=u.el('button','nw-secondary',controls,collide);b.type='button';b.addEventListener('click',()=>env.log('decoy',{label:collide,collide:true}));}
          let submit=null;
          const finishButton=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.title=label;b.setAttribute('aria-label',label);b.addEventListener('click',()=>ctx.submit());return b;};
          if(placement==='header')submit=finishButton(controls,'nw-ok',label);
          if(display==='panel'){const note=u.el('aside','nw-panel',backdrop);u.el('b','',note,'Instructions');u.el('div','',note,ctx.instruction);}
          if(display==='toast'){const note=u.el('aside','nw-toast',backdrop,ctx.instruction);const x=u.el('button','',note,'×');x.type='button';x.setAttribute('aria-label','Close');x.addEventListener('click',()=>{note.remove();env.log('note-close');});}
          const stage=u.el('main','nw-stage',shell);
          if(placement==='footer'||placement==='link'){
            const foot=u.el('footer','nw-foot',shell);u.el('span','',foot,'Order date');
            const filler=u.el('div','nw-footcontrols',foot);
            if(placement==='footer')submit=finishButton(filler,'nw-ok',label);
            else {submit=u.el('a','nw-link',filler,`${label} ›`);submit.href='#';submit.dataset.role='submit';submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});}
          }
          if(ctx.finish) submit=null;
          return {stage,submit};
        },
      },
    },
  });
})();
