// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-polygon-02',
  name: 'design',
  split: 'train',
  scenarios: ['polygon'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'ICONS': (base, S) => ({
        pen: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17c3-1 4-5 7-6s4 2 7-1"/><path d="M13 3l4 4"/></svg>',
        line: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 16L16 4"/><circle cx="4" cy="16" r="1.6" fill="currentColor"/><circle cx="16" cy="4" r="1.6" fill="currentColor"/></svg>',
        rect: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="13" height="10" rx="1"/></svg>',
        ellipse: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="10" cy="10" rx="7" ry="5"/></svg>',
        eraser: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M8 16l-4-4 8-8 5 5-7 7z"/><path d="M8 16h9"/><path d="M6.5 9.5l5 5"/></svg>',
        undo: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5L3 9l4 4"/><path d="M3 9h9a5 5 0 010 10H9"/></svg>',
        clear: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11"/></svg>',
        polygon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14.8L13.8 4l2.2 2.2L5.2 17H3zM12.6 5.2l2.2 2.2M3 17l2.2-2.2"/></svg>',
      }),
      '+0.drawRisographMap': (base, S) => function drawRisographMap(B) {
        const { util } = B.ctx;
        const { svg, W, H } = B;
        const g = util.svg('g', { transform: `scale(${(W / 1214).toFixed(5)} ${(H / 654).toFixed(5)})`, 'pointer-events': 'none' }, svg);
        util.svg('rect', { x: 0, y: 0, width: 1214, height: 654, fill: '#f3eedf' }, g);
        const forest = '#dce3cb', forest2 = '#cbd7b9';
        for (const d of [
          'M105 0H300Q336 69 390 118L362 173Q300 136 260 168L180 154Q141 111 105 0Z',
          'M0 166Q101 151 190 201L274 268Q249 330 302 390L242 455Q185 416 118 446L0 418Z',
          'M333 0H1214V117Q1132 141 1092 203L1008 240Q922 190 849 231L765 172Q683 162 639 226L569 174Q504 208 452 165L376 125Z',
          'M781 197Q887 148 1004 208Q1124 267 1140 383L1075 473Q1000 508 951 571L830 543Q799 469 734 425L704 326Z',
          'M270 495Q330 444 421 482L501 544Q455 612 412 654H190Q215 578 270 495Z',
          'M574 541Q634 494 719 522L786 581L750 654H524Z',
        ]) util.svg('path', { d, fill: forest, opacity: .85 }, g);
        for (const d of [
          'M22 226Q118 190 208 253T302 337', 'M18 245Q110 209 199 272T283 352', 'M31 267Q111 232 188 286T269 369',
          'M800 36Q873 2 933 48T1051 49T1176 20', 'M797 61Q873 28 931 72T1049 74T1188 44',
          'M807 88Q873 57 930 98T1047 101T1196 68', 'M832 126Q891 99 948 136T1063 137T1207 101',
          'M775 443Q839 408 888 449T991 457T1114 419', 'M769 468Q839 434 887 476T990 483T1127 444',
          'M776 495Q838 462 884 503T986 510T1138 471', 'M238 528Q302 486 360 520T457 541',
          'M226 553Q298 512 358 546T443 567', 'M219 580Q292 539 355 573T426 594',
          'M373 20Q406 66 455 74T515 119', 'M365 39Q396 82 447 92T502 136',
        ]) util.svg('path', { d, fill: 'none', stroke: '#a9b79c', 'stroke-width': 1.4, opacity: .65 }, g);
        // Main river with a second pale edge gives it the printed, irregular bank.
        const river = 'M130 -20C154 44 193 83 243 113S324 151 359 202S392 285 374 341S377 427 431 475S522 515 568 563S618 630 665 680';
        util.svg('path', { d: river, fill: 'none', stroke: '#75c4d9', 'stroke-width': 78, 'stroke-linecap': 'round' }, g);
        util.svg('path', { d: river, fill: 'none', stroke: '#a8dbea', 'stroke-width': 66, 'stroke-linecap': 'round' }, g);
        util.svg('path', { d: 'M336 237C348 260 350 286 340 306S337 340 352 355', fill: 'none', stroke: '#75c4d9', 'stroke-width': 20, 'stroke-linecap': 'round' }, g);
        // A named water body occupies the map's right side like the reference.
        if(B.ctx.spec.mode!=='outline'){
          const lake = 'M794 205C814 187 849 188 872 199C896 210 914 215 934 205C959 191 985 200 1000 221C1017 245 1045 251 1051 276C1057 299 1038 316 1041 337C1045 363 1074 383 1065 410C1057 436 1022 438 1008 459C995 480 1000 507 978 524C954 542 928 524 904 535C878 547 863 570 837 562C812 555 808 529 785 518C758 505 727 515 711 495C695 475 712 452 700 429C687 405 662 394 668 366C674 340 706 332 707 306C708 279 680 260 694 235C706 212 738 218 756 207C770 199 780 202 794 205Z';
          util.svg('path', { d: lake, fill: '#8dcde0', stroke: '#4ca9c4', 'stroke-width': 2.2 }, g);
          for (const d of ['M854 292C866 282 880 286 884 298C888 311 874 321 862 317C852 313 847 302 854 292Z', 'M944 367C956 356 971 363 970 376C969 389 957 399 947 393C938 388 938 375 944 367Z', 'M817 435C825 428 835 432 834 441C833 450 823 454 817 448C813 444 813 439 817 435Z']) util.svg('path', { d, fill: forest, stroke: '#58adc5', 'stroke-width': 1.3 }, g);
        }
        // Park contours frame the lake and carry through the wooded margins.
        for (const [d, sw] of [['M645 182Q720 139 781 165T904 168T1067 151T1200 192',1],['M635 197Q710 154 773 181T901 184T1068 169T1205 209',1],['M637 215Q705 174 766 197T899 201T1065 188T1209 228',1],['M638 430Q686 410 697 449T738 492T783 545',1],['M650 446Q689 431 704 463T745 506T785 560',1]]) util.svg('path',{d,fill:'none',stroke:'#a5b69a','stroke-width':sw,opacity:.8},g);
        // Roads: warm gray casing and cream centerline, plus dashed walking paths.
        const road = (d, width=12) => { util.svg('path',{d,fill:'none',stroke:'#aaa297','stroke-width':width+4,'stroke-linecap':'round','stroke-linejoin':'round'},g); util.svg('path',{d,fill:'none',stroke:'#fffaf0','stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},g); };
        road('M-25 166C69 166 105 214 128 296S142 410 158 465S185 541 227 664',10);
        road('M22 409C133 392 192 376 266 386S390 408 488 385',10);
        road('M545 -20C516 64 508 133 530 209S568 332 548 393S532 470 596 510S720 565 748 680',10);
        road('M1195 106C1153 150 1144 199 1154 257S1170 371 1218 410',9);
        road('M194 652C234 594 278 564 341 550S425 519 466 490',8);
        road('M-15 286C53 280 104 300 159 291S239 274 284 263',7);
        road('M-12 469C58 459 108 447 165 455S240 475 292 462',7);
        road('M63 203C79 270 81 333 73 398S83 499 114 551',7);
        road('M161 182C176 239 195 280 194 332S181 412 207 465',7);
        road('M294 211C321 247 334 278 327 315S307 359 300 391',6);
        road('M372 382C406 376 449 373 486 385',6);
        road('M569 347C595 376 621 397 665 405',6);
        for (const d of ['M240 193Q300 191 330 230T378 272','M842 0Q809 60 830 104T825 164','M552 120Q605 126 640 157T690 168','M210 600Q245 560 283 562T345 581','M708 578Q727 534 779 540T843 580','M1026 0Q1005 49 1014 91T1055 131','M395 655Q415 606 457 587T501 537']) util.svg('path',{d,fill:'none',stroke:'#a36042','stroke-width':2.5,'stroke-dasharray':'8 7','stroke-linecap':'round'},g);
        // Small town blocks and evergreen marks.
        const blocks=[[26,216],[54,255],[19,320],[75,348],[33,454],[108,495],[176,249],[198,286],[463,48],[493,80],[475,121],[1036,182],[1081,224],[1131,277],[1087,510],[1045,556],[973,591]];
        for(let row=0;row<6;row++)for(let col=0;col<5;col++){const x=12+col*43+(row%2)*8,y=204+row*43;if(x<265&&!(row>2&&col>3))blocks.push([x,y]);}
        for (const [x,y] of blocks) util.svg('rect',{x,y,width:13,height:12,fill:'#c9c4b9',opacity:.72,transform:`rotate(-12 ${x+6} ${y+6})`},g);
        for (const [x,y,s] of [[455,96,1],[397,148,.8],[307,380,1],[654,441,1],[724,495,.8],[1118,469,1],[1093,550,.9],[789,83,.8],[355,559,1]]) {
          util.svg('path',{d:`M${x} ${y-12*s}l${-7*s} ${14*s}h${5*s}l${-4*s} ${9*s}h${12*s}l${-4*s} ${-9*s}h${5*s}z`,fill:'#819b83',opacity:.9},g);
        }
        const text=(x,y,value,rotate=0,cls='dw-street')=>{const a={x,y,class:cls};if(rotate)a.transform=`rotate(${rotate} ${x} ${y})`;const t=util.svg('text',a,g);t.textContent=value;};
        const streetNames=B.ctx.spec.streets.map(s=>s.name);
        text(321,121,'Pine River',23); text(461,79,streetNames[0]||'Maple Rd',-23); text(527,300,streetNames[1]||'Cedar Ln',78); text(131,386,streetNames[2]||'Pine St',-4); text(132,583,streetNames[3]||'Ridge Rd',-28); text(610,458,streetNames[4]||'Oak Ave',22); text(1171,300,streetNames[5]||'Willow Rd',78);
        if(B.ctx.spec.mode!=='outline'){const parts=String(B.ctx.spec.name||'Lake Wren').split(' ');text(858,358,parts[0],0,'dw-area');if(parts[1])text(858,383,parts.slice(1).join(' '),0,'dw-area');}
        text(55,98,'N',0,'dw-small');
        util.svg('path',{d:'M73 110L88 80L103 110L88 102Z',fill:'#176475'},g);
        util.svg('path',{d:'M18 132H192M18 126V138M61 126V138M105 126V138M149 126V138M192 126V138',fill:'none',stroke:'#173d48','stroke-width':2},g);
        text(18,157,'0',0,'dw-small'); text(59,157,'0.25',0,'dw-small'); text(103,157,'0.5',0,'dw-small'); text(174,157,'1 Mile',0,'dw-small');
      },
      // Keep the template's polygon interactions and seeded map draws.
      'drawMap': (base, S) => function drawMap(B) {
        base(B);
        S.drawRisographMap(B);
      },
      // The editorial sheet has a wide map and a legend below it. Size both
      // coordinates and SVG pixels here, before the kit records its anchors.
      'renderBoard': (base, S) => function renderBoard(ctx, flavor) {
        S.ensureStyle();
        S.keyHandler = null;
        const { util, rng, size, spec } = ctx;
        const hasTools = S.HAS_BAR(spec);
        rng.int(400, 600); // retain the template's board-size draw
        const compact = size.width < 1200;
        const gap = compact ? 10 : 18;
        const barHeight = compact ? 86 : 116;
        const sheetWidth = Math.floor(Math.min(size.width - 4, 1215,
          (size.height - barHeight - gap - 8) * 1.86 + 4));
        const W = sheetWidth - 4;
        const H = Math.floor(Math.min(W / 1.86, size.height - barHeight - gap - 8));
        const sx = W / spec.board.w;
        const sy = H / spec.board.h;
        const wrap = util.el('div', 'atlas-sheet', ctx.stage);
        Object.assign(wrap.style, {
          position: 'absolute', display: 'flex', flexDirection: 'column',
          alignItems: 'center', width: `${sheetWidth}px`, gap: `${gap}px`,
        });
        const board = util.el('div', 'dw-board', wrap);
        Object.assign(board.style, { width: `${sheetWidth}px`, flex: 'none', boxSizing: 'border-box' });
        const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, board);
        svg.dataset.role = 'board';
        if (hasTools) rng.bool(0.3); // toolbar is always beneath this site's map
        const bar = util.el('div', 'dw-bar', wrap);
        Object.assign(bar.style, {
          width: `${sheetWidth}px`, height: `${barHeight}px`, boxSizing: 'border-box',
          flex: 'none', display: 'flex', flexWrap: 'wrap', alignContent: 'center',
          justifyContent: 'flex-start', gap: compact ? '2px 8px' : '2px 20px',
          padding: compact ? '5px 12px' : '8px 24px',
        });
        const px = p => [p[0] * sx, p[1] * sy];
        const fromBoard = p => {
          const r = svg.getBoundingClientRect();
          const a = px(p);
          return [r.left + a[0], r.top + a[1]];
        };
        const toBoard = p => {
          const r = svg.getBoundingClientRect();
          return [(p[0] - r.left) / sx, (p[1] - r.top) / sy];
        };
        let view;
        let help = '';
        const B = {
          ctx, svg, px, W, H, scale: Math.min(sx, sy), flavor,
          bar: hasTools ? bar : null, foot: null, toBoard,
          frame: { toBoard, fromBoard, bounds: { x0: 0, y0: 0, x1: spec.board.w, y1: spec.board.h } },
          hint(text) { help = text; },
          up(model) { ctx.update(model); if (view) view.sync(ctx.model); },
        };
        view = S.BUILD[spec.scenario](B);
        const key = util.el('div', 'atlas-legend', bar);
        for (const [name, kind] of [['Lake / River', 'water'], ['Park / Forest', 'park'], ['Road', 'road'], ['Trail', 'trail'], ['Building', 'building']]) {
          const item = util.el('span', 'atlas-key', key);
          util.el('i', 'atlas-swatch ' + kind, item);
          util.el('span', '', item, name);
        }
        const hint = util.el('div', 'dw-hint', bar, help);
        Object.assign(hint.style, { flexBasis: '100%', fontSize: compact ? '10px' : '12px', lineHeight: '1.2', justifyContent: 'center' });
        view.sync(ctx.model);
        S.place(wrap, ctx, rng.fork('place'));
        const r = wrap.getBoundingClientRect();
        wrap.style.left = `${Math.max(0, Math.floor((size.width - r.width) / 2))}px`;
        wrap.style.top = `${Math.max(0, Math.floor((size.height - r.height) / 2))}px`;
        S.st = { locate: t => view.locate(t) };
        return { anchors: [svg], sync: m => view.sync(m) };
      },
      'button': (base, S) => function button(util, parent, ...args) {
        const b = base(util, parent, ...args);
        Object.assign(b.style, {
          height: parent.style.height === '86px' ? '54px' : '62px',
          minWidth: parent.style.height === '86px' ? '62px' : '78px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px',
        });
        const icon = b.querySelector('svg');
        if (icon) Object.assign(icon.style, { width: '30px', height: '30px' });
        return b;
      },
    },
  },
});
