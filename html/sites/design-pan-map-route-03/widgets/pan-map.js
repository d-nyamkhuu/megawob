// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-route-03',
  name: 'design',
  split: 'train',
  scenarios: ['route'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      editorWorld: (base) => function (ctx, port, W, H) {
        const out = base(ctx, port, W, H);
        const world = out && out.world;
        if (world && world.namespaceURI === 'http://www.w3.org/2000/svg') {
          const ns = 'http://www.w3.org/2000/svg';
          const shape = (tag, attrs) => {
            const node = document.createElementNS(ns, tag);
            for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
            return node;
          };
          const w = 1200;
          const h = 600;
          const art = document.createElementNS(ns, 'g');
          art.setAttribute('class', 'route03-cartography');
          const add = (tag, attrs, parent = art) => { const el = shape(tag, attrs); parent.appendChild(el); return el; };
          const coast = 'M0 170 L82 145 103 169 Q96 201 119 220 Q170 254 252 225 Q349 198 396 138 Q454 87 450 0 H1200 V600 H0 Z';
          const river = 'M490 -20 C485 46 550 84 649 118 S776 170 850 169 S1003 185 1030 245 S1006 308 1023 361 S989 420 1039 456 S1147 476 1215 544';
          const hills = 'M0 316 Q59 287 116 319 T250 377 Q309 394 322 449 Q359 493 327 539 L370 600 H0 Z';
          const reserve = 'M565 600 Q571 526 624 472 T722 450 Q759 459 789 429 Q849 402 886 426 Q927 454 994 448 Q1067 479 1200 540 V600 Z';
          const defs = add('defs', {});
          const clip = add('clipPath', {id:'route03-land'}, defs); add('path', {d:coast}, clip);
          const parkClip = add('clipPath', {id:'route03-parks'}, defs);
          add('path', {d:hills}, parkClip); add('path', {d:reserve}, parkClip);
          add('path', {d:'M782 40 Q820 36 845 70 L885 133 Q845 159 783 140 L731 101 Z'}, parkClip);
          add('path', {d:'M799 183 Q854 167 892 196 L943 278 Q897 276 858 257 L789 249 Z'}, parkClip);
          const water = add('linearGradient', {id:'route03-water',x2:'.8',y2:'1'}, defs);
          add('stop', {offset:0,'stop-color':'#8dcef0'}, water); add('stop', {offset:1,'stop-color':'#86c6ec'}, water);
          add('rect', {x:-1200,y:-600,width:3600,height:1800,fill:'#e7e6e0'});
          add('rect', {x:0,y:0,width:w,height:h,fill:'url(#route03-water)'});
          add('path', {d:coast,fill:'#e7e6e0',stroke:'#dfdfd3','stroke-width':3});
          const land = add('g', {'clip-path':'url(#route03-land)'});
          add('path', {d:hills,fill:'#c7dfac'}, land);
          add('path', {d:reserve,fill:'#c5dda7'}, land);
          add('path', {d:'M782 40 Q820 36 845 70 L885 133 Q845 159 783 140 L731 101 Z',fill:'#c4dda9'}, land);
          add('path', {d:'M799 183 Q854 167 892 196 L943 278 Q897 276 858 257 L789 249 Z',fill:'#c5dda9'}, land);
          add('path', {d:'M1055 0 H1200 V143 Q1168 145 1148 101 L1090 80 Z',fill:'#c5dda9'}, land);
          add('path', {d:'M431 457 Q493 426 551 459 L581 517 529 556 445 540 Z',fill:'#c8dfb5'}, land);
          // Fine footprints and garden plots vary by block without consuming episode randomness.
          const blocks = add('g', {'clip-path':'url(#route03-land)'}, land);
          for (let col = 0; col < 50; col++) for (let row = 0; row < 28; row++) {
            const x = col * 25 + 3, y = row * 23 + 3;
            if ((x < 330 && y > 330) || (x > 580 && y > 450) || (x > 765 && x < 940 && y > 170 && y < 265)) continue;
            const n = (col * 17 + row * 31) % 19;
            add('rect', {x:x+n*.14,y:y+n*.12,width:11+n*.36,height:10+(n%7),fill:['#e0dfda','#e5e3dd','#ddded8','#eeece7'][n%4],stroke:'#efeee9','stroke-width':.7}, blocks);
            if (n%3) add('rect', {x:x+17,y:y+2,width:5,height:15,fill:n%4?'#dcded6':'#c7d6b7',opacity:.45}, blocks);
            add('path',{d:`M${x+7} ${y}v20 M${x} ${y+9}h23`,fill:'none',stroke:'#f8f7f3','stroke-width':.65,opacity:.8},blocks);
          }
          const foliage = add('g', {'clip-path':'url(#route03-parks)'});
          for (let i = 0; i < 1100; i++) {
            const x = (i * 173 + (i%9)*13) % 1200, y = (i * 97 + (i%13)*9) % 600;
            add('path', {d:`M${x} ${y} q${-9-i%8} ${-12-i%5} -3 -17 q13 -7 17 5 q12 9 -1 18 Z`,fill:['#b4d397','#bcd99e','#a5ca88','#d7e5b4'][i%4],opacity:.32}, foliage);
          }
          // Wetland pools, inlets and pale contour tracks in the reserve.
          for (let i = 0; i < 18; i++) {
            const x=620+(i*61)%410, y=476+(i*37)%135;
            add('path', {d:`M${x} ${y} l-5 -6 4 -8 9 2 5 -8 8 4 -3 8 5 7 -8 6 3 7 -9 3 -4 -10 Z`,fill:'#96cdea',opacity:.9}, foliage);
          }
          add('path',{d:'M660 481q-28 21-14 43t31 43q15 23-5 43 M880 454q-22 17-10 33t-13 29q-23 14-11 38',fill:'none',stroke:'#9bcfe8','stroke-width':7,'stroke-linejoin':'round'},foliage);
          const lane = (d, width=3, parent=land) => {
            add('path',{d,fill:'none',stroke:'#d6d5cd','stroke-width':width+1.4,'stroke-linejoin':'round'},parent);
            add('path',{d,fill:'none',stroke:'#fff','stroke-width':width,'stroke-linejoin':'round'},parent);
          };
          for (let i=0;i<28;i++) {
            const x=85+i*40;
            lane(`M${x} -20 Q${x+9} 112 ${x-3} 205 L${x-3} 342 Q${x-2} 410 ${x+12} 463 L${x+12} 620`,i%4===0?5.2:1.8);
          }
          for (let i=0;i<21;i++) {
            const y=26+i*28;
            lane(`M-20 ${y} Q154 ${y-3} 273 ${y+7} L746 ${y+7} Q889 ${y+4} 970 ${y+18} T1220 ${y+2}`,i%4===0?5.2:1.8);
          }
          // Curving residential lanes replace the street grid on the hills.
          add('path', {d:hills,fill:'#c5dfac'}, land);
          add('path', {d:reserve,fill:'#c5dda7'}, land);
          add('path', {d:'M782 40 Q820 36 845 70 L885 133 Q845 159 783 140 L731 101 Z',fill:'#c4dda9'}, land);
          add('path', {d:'M799 183 Q854 167 892 196 L943 278 Q897 276 858 257 L789 249 Z',fill:'#c5dda9'}, land);
          land.appendChild(foliage);
          for(let i=0;i<7;i++) {
            const x=-45+i*54;
            lane(`M${x} 328 Q${x+57} ${348+i%3*9} ${x+23} 372 T${x+72} ${424+i%4*8} Q${x+97} 447 ${x+66} 478 T${x+83} 553 L${x+60} 620`,2.7);
          }
          lane('M0 552 Q72 495 152 528 T313 520 Q338 485 310 446 Q293 407 222 389 T120 362 L46 342',3);
          lane('M586 600 Q594 537 573 507 L532 456',3);
          lane('M772 600 Q750 558 727 542 Q700 506 724 459',3);
          lane('M1018 600 Q978 564 955 540 Q925 509 945 457',3);
          // Water covers the urban grid, with thin pale banks at crossings.
          add('path', {d:river,fill:'none',stroke:'#d0dfb9','stroke-width':37,'stroke-linecap':'round'});
          add('path', {d:river,fill:'none',stroke:'#fafbf4','stroke-width':29,'stroke-linecap':'round'});
          add('path', {d:river,fill:'none',stroke:'url(#route03-water)','stroke-width':25,'stroke-linecap':'round'});
          const roads = [
            'M-20 407 L44 318 Q62 301 119 288 Q235 257 324 207 T450 91 Q489 52 499 -20',
            'M-20 354 Q129 319 235 354 L302 391 Q321 401 330 425 Q341 448 373 443 L488 431 Q532 429 573 416 L721 409 Q792 408 835 392 Q876 371 915 390 L1026 405 Q1077 428 1110 447 L1220 459',
          ];
          for (const d of roads) {
            add('path', { d, fill: 'none', stroke: '#d9bb60', 'stroke-width': 10, 'stroke-linecap': 'round' });
            add('path', { d, fill: 'none', stroke: '#fffdf1', 'stroke-width': 9, 'stroke-linecap': 'round' });
            add('path', { d, fill: 'none', stroke: '#ffe597', 'stroke-width': 6.5, 'stroke-linecap': 'round' });
          }
          lane('M881 6 Q947 99 947 164 L993 214 Q1019 239 1060 236 L1200 231',5,art);
          lane('M1160 0 L1100 167 Q1087 213 1058 274 L1038 309 Q1019 321 979 342',5,art);
          // Marina breakwaters and narrow piers along the bay.
          for(let i=0;i<7;i++) {
            const x=38+i*10,y=164-i*2.8;
            add('path',{d:`M${x} ${y} l-3 -17 m-2 2 h11`,fill:'none',stroke:'#f8f9f2','stroke-width':4});
          }
          for(let i=0;i<6;i++) add('path',{d:`M${365+i*9} ${149-i*10} l-12 -9 l4 -8`,fill:'none',stroke:'#fff','stroke-width':4});
          for(let i=0;i<100;i++) {
            const x=(i*79)%450,y=(i*43)%210;
            if(y < 140 && x < 400) add('path',{d:`M${x} ${y} q3 -2 6 0 t6 0`,fill:'none',stroke:'#c8e8f7','stroke-width':.7,opacity:.5});
          }
          const label=(text,x,y,size=18,color='#45516b')=>{
            const el=add('text',{x,y,fill:color,'font-size':size,'font-family':'Arial, sans-serif','text-anchor':'middle',stroke:'#f7f8f1','stroke-width':3,'paint-order':'stroke','stroke-linejoin':'round'}); el.textContent=text; return el;
          };
          const positions=[[64,267],[292,341],[643,27],[995,36],[1117,330],[140,560]];
          for(const [i,d] of (ctx.spec.world.districts||[]).entries()) {
            const [x,y]=positions[i%positions.length];
            const node=label('',x,y); const words=d.name.split(' '), half=Math.ceil(words.length/2);
            add('tspan',{x,dy:0},node).textContent=words.slice(0,half).join(' ');
            add('tspan',{x,dy:20},node).textContent=words.slice(half).join(' ');
          }
          const bayLabel=label('North Bay',190,77,16,'#246296'); bayLabel.setAttribute('font-style','italic'); bayLabel.setAttribute('stroke','none'); bayLabel.setAttribute('letter-spacing','2');
          const riverLabel=label('Clearwater River',990,263,13,'#246296'); riverLabel.setAttribute('font-style','italic'); riverLabel.setAttribute('stroke','none');
          const parkPositions=[[830,106],[850,219],[831,555],[155,468],[480,531],[1118,546]];
          for(const [i,p] of ctx.spec.world.parks.entries()) {
            if(i>=parkPositions.length) break;
            const [x,y]=parkPositions[i];
            add('path',{d:`M${x-18} ${y-12} l-4 -6 2 -6 -5 -8 -4 5 -3 6 -4 6 3 3 -4 7 7 2 v7 h3 v-7 l8 -1Z`,fill:'#72965c',stroke:'#fafcf5','stroke-width':1.3});
            const text=label(p.name,x+5,y+4,14,'#2d4733'); text.setAttribute('text-anchor','start');
          }
          for(const [i,r] of ctx.spec.world.roads.entries()) {
            const p=[[427,117,-48],[431,441,-5],[1129,456,4],[686,258,0]][i%4];
            label(r.name,p[0],p[1],13,'#343b35').setAttribute('transform',`rotate(${p[2]} ${p[0]} ${p[1]})`);
          }
          world.appendChild(art);
        }
        return out;
      },
      editorPaint: (base) => function(ctx, E, model) {
        const result=base(ctx,E,model);
        const art=E.world.querySelector('.route03-cartography');
        if(art && !art.hasAttribute('transform')) {
          const numbers=E.world.getAttribute('transform').match(/-?\d*\.?\d+(?:e[-+]?\d+)?/g).map(Number);
          const [tx,ty,sc]=numbers;
          art.setAttribute('transform',`translate(${-tx/sc} ${-ty/sc}) scale(${E.W/sc/1200} ${E.H/sc/600})`);
        }
        return result;
      },
      editorPin: (base,S) => function(ctx,labels,place,index) {
        const pin=base(ctx,labels,place,index);
        const dot=pin.querySelector('.mp-dot');
        dot.textContent=''; S.P.icon(dot,['building','food','star','map','building','food','star','building','map'][index%9],24);
        return pin;
      },
    },
  },
});
