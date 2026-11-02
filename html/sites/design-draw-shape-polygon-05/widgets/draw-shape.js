// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-polygon-05',
  name: 'design',
  split: 'train',
  scenarios: ['polygon'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'drawMap': (base, S) => function drawMap(B) {
        const { fmtPx } = S;
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const land = rng.pick(['#a9cf86', '#b0d38c', '#a4cb82']);
        svg.setAttribute('preserveAspectRatio', 'none');
        const artwork = util.svg('g', { class: 'survey-art', transform: `scale(${W / 1660} ${H / 640})`, 'pointer-events': 'none' }, svg);
        artwork.innerHTML = `<defs>
          <radialGradient id="terrain"><stop stop-color="#bdd49a"/><stop offset="1" stop-color="#a8c58b"/></radialGradient>
          <linearGradient id="lake-water" x2=".65" y2="1"><stop stop-color="#91caeb"/><stop offset="1" stop-color="#79b9e5"/></linearGradient>
          <filter id="terrain-grain"><feTurbulence type="fractalNoise" baseFrequency=".024" numOctaves="3" seed="12"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".075"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter>
          <g id="pine-tree"><path d="M0 0L-8 22L-3 21L-3 27L3 27L3 21L8 22Z" fill="#668c58"/><path d="M0 0L0 22L8 22Z" fill="#789a64"/></g>
        </defs><rect width="1660" height="640" fill="url(#terrain)" filter="url(#terrain-grain)"/>
        <path d="M0 0H155L181 59L192 90L159 116L151 158L112 189L53 183L0 192Z M1200 0H1660V226L1558 194L1442 178L1346 122L1266 125L1220 74Z M1380 430L1472 414L1545 453L1660 455V640H1270L1325 555Z" fill="#91b27a" opacity=".36"/>
        <path d="M1070 411C1120 411 1147 340 1192 334C1230 334 1235 297 1285 321C1333 325 1328 350 1358 365C1401 395 1432 403 1450 439C1475 490 1494 490 1521 480C1550 470 1578 502 1660 548 M1114 531C1190 528 1180 566 1228 574C1255 579 1246 601 1288 607C1316 611 1315 628 1320 640" fill="none" stroke="#579dc7" stroke-width="19"/>
        <path d="M1070 411C1120 411 1147 340 1192 334C1230 334 1235 297 1285 321C1333 325 1328 350 1358 365C1401 395 1432 403 1450 439C1475 490 1494 490 1521 480C1550 470 1578 502 1660 548 M1114 531C1190 528 1180 566 1228 574C1255 579 1246 601 1288 607C1316 611 1315 628 1320 640" fill="none" stroke="#83c1e7" stroke-width="15"/>
        <path class="landmark-lake" d="M486 163C462 146 447 157 413 168L391 177C367 201 374 215 393 242C399 263 416 280 444 288C470 296 497 286 491 313C477 334 473 350 491 372C512 394 525 391 547 408C582 432 592 408 622 412C647 414 656 415 658 443C661 469 666 472 690 480C709 490 702 509 731 509C754 506 755 523 772 513C793 495 800 512 810 525C830 541 861 548 886 541C920 533 934 523 965 520C990 519 998 500 1018 524C1029 549 1035 554 1062 548C1092 552 1104 540 1108 511C1110 482 1091 458 1086 477C1080 491 1093 505 1079 516C1060 514 1066 491 1070 479C1082 450 1050 453 1050 431C1050 416 1072 409 1064 403C1052 397 1021 410 1008 398C986 382 1003 361 1007 347C1004 333 1029 340 1028 319C1027 302 1012 291 997 286C975 271 974 246 958 219C942 207 945 195 934 190C932 172 918 159 898 161C880 160 878 190 862 190C845 191 849 175 838 176C825 178 837 194 821 188C806 184 792 181 798 169C808 150 843 170 850 146C857 130 846 109 834 104C811 99 789 101 779 97C756 91 754 105 742 105L718 98C713 83 705 82 695 79C690 67 703 59 695 47C688 34 685 23 678 32C672 49 676 59 670 69C666 75 662 87 674 93C666 98 669 112 653 116C637 120 618 98 607 91C587 71 562 85 556 105C548 126 541 149 528 164C512 181 503 172 486 163Z" fill="url(#lake-water)" stroke="#589fc8" stroke-width="1.7"/>
        <path d="M851 226C844 238 837 252 850 259C863 264 876 265 882 278C892 297 908 286 906 272C904 259 888 260 885 242C882 228 861 207 851 226Z M745 406C738 414 748 417 741 427C731 440 739 447 753 451C769 453 769 461 783 453C799 444 816 457 824 446C829 435 818 434 820 425C816 408 800 419 784 410C772 403 756 392 745 406Z" fill="#b6d093" stroke="#6fa6a6" stroke-width="1.5"/>
        <path d="M1289 0C1268 47 1285 64 1301 90C1311 113 1348 111 1354 137C1361 165 1399 173 1436 175C1472 176 1456 197 1482 209C1524 234 1562 211 1585 210L1660 236 M1130 64C1148 99 1134 150 1165 180C1171 202 1175 211 1203 219L1250 240L1280 252 M1165 180C1202 165 1180 218 1221 237C1249 258 1290 241 1309 273C1327 292 1301 317 1327 332 M1381 380C1422 391 1452 373 1476 390C1502 408 1534 378 1554 357C1591 348 1617 349 1660 327" fill="none" stroke="#a39388" stroke-width="3" stroke-dasharray="7 6" opacity=".7"/>`;
        // The terrain artwork uses fixed coordinates; all original random draws below stay in order.
        // Blocks.
        const blocks = util.svg('g', { opacity: 0.55 }, svg);
        for (let i = 0; i < 14; i++) {
          const x = rng.float(0, W - 40);
          const y = rng.float(0, H - 30);
          util.svg('rect', { x, y, width: rng.float(24, 70), height: rng.float(18, 50), rx: 3, fill: rng.pick(['#e2ddd2', '#dcd8cd', '#e6e1d6']), visibility: 'hidden' }, blocks);
        }
        // A denser, quiet residential grid gives this Vista map the detailed city fabric
        // visible around its task region. These ornaments are fixed to the canvas and do
        // not consume random values or overlap the task's target geometry deliberately.
        for (let row = 0; row < 18; row++) for (let col = 0; col < 30; col++) {
          const x = 33 + col * 56 + Math.sin(row * 17 + col * 9) * 22;
          const y = 12 + row * 37 + Math.cos(col * 3 + row * 8) * 16;
          const water = x > 360 && x < 1135 && y > 78 && y < 560;
          const village = x > 145 && x < 340 && y > 90 && y < 570;
          if (water || village || (row + col * 7) % 5 === 0) continue;
          const h = .55 + ((row * 11 + col * 3) % 9) / 17;
          util.svg('use', { href: '#pine-tree', transform: `translate(${x} ${y}) scale(${h})`, opacity: .35 + ((row + col) % 4) * .055 }, artwork);
        }
        const roads = [
          'M178 -10C228 30 275 48 316 61S404 59 463 50L543 39Q572 34 586 -10',
          'M351 -10C326 51 301 102 276 163S273 238 282 291L305 385C321 441 365 455 420 463C546 480 643 519 752 551S861 590 960 617C1021 637 1062 585 1151 643',
          'M-10 302Q116 240 260 211 M58 270L86 186Q91 158 121 152L198 130Q224 122 278 143 M25 291Q31 316 39 319L76 329',
          'M165 249L190 329L221 430 M-10 503Q86 441 149 430L309 394 M313 416L317 475Q322 514 373 535L410 552Q442 571 462 650 M752 650L778 577',
          'M681 9Q706 12 717 29Q727 60 755 60C809 61 839 72 861 96Q899 151 939 125L1018 87L1128 63Q1160 63 1164 26L1170 -10',
          'M939 -10C924 48 934 83 958 115C988 159 994 202 1024 250C1057 303 1098 328 1120 376C1148 432 1144 484 1127 535C1112 574 1102 611 1096 650 M1083 -10Q1078 40 1083 77 M1060 305Q1100 284 1127 301'
        ];
        for (const d of roads) {
          util.svg('path', { d, fill: 'none', stroke: '#98a28d', 'stroke-width': 12, 'stroke-linejoin': 'round' }, artwork);
          util.svg('path', { d, fill: 'none', stroke: '#eeeede', 'stroke-width': 9, 'stroke-linejoin': 'round' }, artwork);
        }
        for (let i = 0; i < 68; i++) {
          let x, y;
          if (i < 28) { x = 96 + (i % 6) * 38 + Math.sin(i * 4) * 10; y = 170 + Math.floor(i / 6) * 69 + Math.cos(i * 7) * 9; }
          else if (i < 48) { const t = (i - 28) / 20; x = 340 + t * 750; y = 454 + t * 164 + (i % 2 ? 28 : -28); }
          else { const t = (i - 48) / 20; x = 826 + t * 310; y = 24 + t * 340 + (i % 2 ? 28 : -23); }
          const w = 13 + i % 3 * 4, h = 14 + i % 4 * 3;
          util.svg('rect', { x, y, width: w, height: h, fill: '#d3d3b6', stroke: '#a2aa8e', 'stroke-width': 1.6, transform: `rotate(${18 + i % 4 * 9} ${x} ${y})`, opacity: .9 }, artwork);
        }
        for (let i = 0; i < 29; i++) {
          const x = 1151 + (i * 47 % 160), y = 359 + (i * 71 % 248);
          util.svg('path', { d: `M${x} ${y}l-3 -15m3 15v-23m0 23l5 -17m-1 17l7 -13`, stroke: '#679fbe', 'stroke-width': 1.5, fill: 'none', opacity: .8 }, artwork);
        }
        util.svg('text', { x: 731, y: 290, fill: '#12477f', 'font-family': 'Arial,sans-serif', 'font-size': 25, 'font-style': 'italic', 'font-weight': 600, 'text-anchor': 'middle', 'letter-spacing': 1 }, artwork).textContent = 'Mirror Lake';
        const labels = [[426,67,-9],[1018,104,-18],[990,210,65],[283,300,79],[566,498,17]];
        const fixedNames = ['Pine Rd','Forest Rd','Maple Ave','Lakeside Dr','Cedar Ln'];
        fixedNames.forEach((name, i) => { const [x,y,a] = labels[i]; util.svg('text', { x, y, class: 'survey-road-label', transform: `rotate(${a} ${x} ${y})` }, artwork).textContent = name; });
        artwork.insertAdjacentHTML('beforeend', `<g class="survey-scale" fill="#101d20" font-family="Arial,sans-serif" font-size="14"><text x="38" y="577" font-size="19" font-weight="bold" text-anchor="middle">N</text><path d="M38 586L28 618L38 611L48 618Z" fill="#e4eacb" stroke="#101d20" stroke-width="2"/><path d="M38 586L38 611L28 618Z"/><path d="M88 594H340M88 586V602M151 586V602M214 586V602M277 586V602M340 586V602" fill="none" stroke="#101d20" stroke-width="2"/><text x="88" y="617" text-anchor="middle">0</text><text x="151" y="617" text-anchor="middle">250</text><text x="214" y="617" text-anchor="middle">500</text><text x="277" y="617" text-anchor="middle">750</text><text x="323" y="617">1,000 Feet</text></g>`);
        // A decorative park.
        const [pxx, pyy] = [rng.float(0.1, 0.9) * W, rng.float(0.1, 0.9) * H];
        util.svg('ellipse', { cx: pxx, cy: pyy, rx: rng.float(30, 60), ry: rng.float(20, 40), fill: '#cfe3c1', visibility: 'hidden' }, svg);
        for (const s of spec.streets) {
          const a = px(s.a);
          const b = px(s.b);
          {
            const dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy) || 1;
            // Keep the seeded geometry available without the old full-board stripes.
          }
          util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#eeeedd', 'stroke-width': rng.pick([7, 9, 11]), visibility: 'hidden' }, svg);
          const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
          const t = rng.float(0.15, 0.3);
          const at = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
          const rot = Math.abs(ang) > 90 ? ang + 180 : ang;
          util.svg('text', { x: at[0], y: at[1] - 7, class: 'dw-street', visibility: 'hidden', transform: `rotate(${rot.toFixed(1)} ${at[0].toFixed(1)} ${at[1].toFixed(1)})` }, svg).textContent = s.name;
        }
        const mini = document.querySelector('.xt-mini');
        if (mini) {
          const overview = util.svg('svg', { viewBox: '-410 -170 2480 980', preserveAspectRatio: 'none', 'aria-hidden': 'true' }, mini);
          const copy = artwork.cloneNode(true);
          copy.removeAttribute('transform');
          copy.querySelector('.survey-scale')?.remove();
          util.svg('rect', { x: -410, y: -170, width: 2480, height: 980, fill: 'url(#terrain)' }, overview);
          for(let row=0;row<17;row++) for(let col=0;col<39;col++) {
            const x=-390+col*65+Math.sin(row*9+col*4)*18, y=-145+row*59+Math.cos(col*9+row*3)*20;
            if(x>0&&x<1660&&y>0&&y<640) continue;
            util.svg('use',{href:'#pine-tree',transform:`translate(${x} ${y}) scale(1.6)`,opacity:.38},overview);
          }
          for(const d of ['M-410 98Q-100 240 100 170','M-95 -170Q90 -40 62 190','M830 -170Q900 -90 939 0','M1140 640Q1200 780 1360 810','M1850 -170Q1760 200 1660 280','M1660 180Q1870 120 2070 210']) {
            util.svg('path',{d,fill:'none',stroke:'#e8e9db','stroke-width':17},overview);
          }
          util.svg('path',{d:'M-30 540Q-40 480 20 465Q50 445 73 477Q108 503 72 543Q42 584 8 578Z M1680 480Q1710 411 1792 460Q1819 474 1870 491Q1902 538 1885 561Q1805 564 1750 541Z',fill:'#80bee5',stroke:'#5b9fb9','stroke-width':5},overview);
          overview.appendChild(copy);
          util.svg('rect', { x: 380, y: 30, width: 770, height: 510, fill: 'none', stroke: '#ed3329', 'stroke-width': 12 }, overview);
        }
        const refreshProgress = () => {
          svg.querySelectorAll('.dw-pin').forEach(pin => {
            const label = pin.querySelector('text');
            if(!label || pin.querySelector('.survey-pin-disc')) return;
            const box = label.getBBox(), cx = box.x + box.width/2, cy = box.y + box.height/2;
            const stem = util.svg('line', {x1:cx,y1:cy+9,x2:cx,y2:cy+25,stroke:'#172b34','stroke-width':1.5,'pointer-events':'none'},pin);
            const disc = util.svg('circle', {cx,cy,r:10,class:'survey-pin-disc','pointer-events':'none'},pin);
            pin.insertBefore(stem,label);
            pin.insertBefore(disc,label);
          });
          const cells = document.querySelectorAll('.xt-prog .v');
          const m = ctx.model;
          const points = m.pts || [];
          if(cells.length !== 3) return;
          let area = 0;
          for(let i=0;i<points.length;i++) {
            const a=points[i], b=points[(i+1)%points.length];
            area += a[0]*b[1]-b[0]*a[1];
          }
          const acres = Math.abs(area)/2*(1660/spec.board.w)*(640/spec.board.h)*Math.pow(1000/252,2)/43560;
          cells[0].textContent = String(points.length);
          cells[1].textContent = String(Math.max(0,points.length-1)+(m.closed&&points.length>2?1:0));
          cells[2].textContent = points.length>2 ? acres.toFixed(1) : '0.0';
        };
        new MutationObserver(refreshProgress).observe(svg,{subtree:true,childList:true,attributes:true});
        refreshProgress();
      },
    },
  },
});
