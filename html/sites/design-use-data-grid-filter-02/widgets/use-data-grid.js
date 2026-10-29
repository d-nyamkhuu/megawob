// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-filter-02',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Acme Supply Co.',
    navWidth: 0,
    railWidth: 0,
    contextAt: 100000,
    contextWidth: 0,
    cardInsetX: 16,
    cardInsetY: 16,
    cardTop: 0,
    fixedHeight: 72 + 62 + 80 + 72 + 22 + 2,
    rowMin: 24,
    rowMax: 41,
    extraCss: `
      .to-appbar,.to-nav,.to-context,.to-tabs,.to-stream { display:none; }
      .to-workspace { inset:0; border:0; border-radius:0; background:#fff; font:20px/1.2 "Times New Roman",Times,serif; }
      .to-card { border:0; border-radius:0; box-shadow:none; background:#fff; font:20px/1.2 "Times New Roman",Times,serif; }
      .to-head { height:72px; padding:0 4px 8px; gap:12px; border:0; }
      .to-head h2 { font:bold clamp(24px,2.6vw,40px)/1 Georgia,"Times New Roman",serif; }
      .to-head .to-chip { font:12px "Times New Roman",serif; }
      .to-search { width:clamp(130px,18vw,280px); height:40px; border:1px solid #777; border-radius:0; padding:0 7px; }
      .to-search input { font:20px "Times New Roman",Times,serif; }
      .to-head .to-link { padding:7px 12px; border:1px solid #777; background:linear-gradient(#fff,#e8e8e8); font:bold 19px "Times New Roman",serif; }
      .to-tools { min-height:62px; height:auto; padding:8px 14px; gap:12px; flex-wrap:wrap; background:#eee; border:1px solid #c4c4c4; }
      .to-tools .to-btn { height:40px; min-width:94px; padding:0 16px; border:1px solid #777; border-radius:0; background:linear-gradient(#fff,#e8e8e8); color:#111; font: bold 20px "Times New Roman",Times,serif; }
      .to-tools .to-btn.pri { border-color:#777; background:linear-gradient(#fff,#e8e8e8); color:#111; }
      .to-link,.to-selinfo { color:#111; font:20px "Times New Roman",Times,serif; }
      .to-grid { display:flex; flex-direction:column; flex:1 1 auto; min-height:0; overflow:hidden; border:1px solid #aaa; }
      .to-hrow { flex:none; height:80px; background:#eee; }
      .to-body { flex:1 1 auto; min-height:0; overflow:auto; }
      .to-h { display:block; padding:10px 8px; border-left:1px solid #aaa; color:#111; font:bold 20px/1.2 "Times New Roman",Times,serif; text-align:center; white-space:normal; }
      .to-h .lbl { display:block; max-width:100%; white-space:normal; }
      .to-h .arrow { display:none; }
      .to-h .ib { position:absolute; left:50%; bottom:5px; right:auto; transform:translateX(-50%); width:28px; height:28px; padding:3px; border:1px solid #aaa; background:linear-gradient(#fff,#ddd); color:#111; }
      .to-h .ib.dots { left:auto; right:5px; transform:none; }
      .to-h .ib.dots svg { opacity:1; }
      .to-h .ib.dots::before { content:none; }
      .to-h .ib svg { width:100%; height:100%; opacity:0; }
      .to-h .ib::before { content:""; display:block; width:17px; height:18px; background:#222; clip-path:polygon(0 5%,100% 5%,62% 47%,62% 90%,40% 100%,40% 47%); }
      .to-cb { width:62px; }
      .to-cb input { width:23px; height:23px; accent-color:#789dc9; }
      .to-row { border-bottom:1px solid #c6c6c6; background:#fff; }
      .to-c { padding:0 14px; border-left:1px solid #d0d0d0; color:#111; font:20px/1.2 "Times New Roman",Times,serif; }
      .to-c.mono span { font:20px/1.2 "Times New Roman",Times,serif; color:#00e; text-decoration:underline; }
      .to-card.zebra .to-row:nth-child(even) { background:#fff; }
      .to-card .to-row:hover { background:#fff !important; }
      .to-foot { height:60px; margin-top:12px; padding:0 14px; border-top:1px solid #999; color:#111; font:20px "Times New Roman",Times,serif; }
      .to-foot .info { color:#111; font:clamp(12px,1.3vw,20px) "Times New Roman",Times,serif; }
      .to-pager { gap:7px; }
      .to-pg { height:40px; min-width:48px; border:1px solid #888; border-radius:0; background:linear-gradient(#fff,#e8e8e8); font:20px "Times New Roman",Times,serif; }
      .to-pg.cur { border-color:#777; background:#c9dcef; color:#111; }
      .to-pop { border-radius:0; font:17px "Times New Roman",Times,serif; }
      .to-opt,.to-mi { font:17px "Times New Roman",Times,serif; }
      .to-card.dense .to-h { display:block; padding:10px 8px; }
      .to-card.dense .to-h .lbl { line-height:24px; }
      .to-card.dense .to-h .ib { position:absolute; left:50%; bottom:5px; right:auto; width:28px; height:28px; }
      .to-card.dense .to-h .ib.dots { left:auto; right:5px; }
      @media (max-width:1449px) {
        .to-head { gap:6px; }
        .to-head h2 { font-size:24px; }
        .to-head .to-link { font-size:15px; padding:7px; }
        .to-head .to-chip { font-size:10px; }
        .to-tools { gap:6px; padding:6px; }
        .to-tools .to-btn { min-width:0; padding:0 8px; font-size:16px; }
        .to-pg { min-width:30px; font-size:16px; }
        .to-foot { padding:0 4px; gap:6px; }
      }
    `,
    parts: {
      toolbar: (base, S) => function () {
        base();
        // Keep the real title as the oracle's blank target and use the
        // template's search/clear controls in the academic heading.
        if (S.input) S.head.appendChild(S.input.parentElement);
        S.head.appendChild(S.clearAll);
        for (const button of Array.from(S.head.children)) {
          if (button.tagName === 'BUTTON') S.tools.insertBefore(button, S.tools.firstChild);
        }
      },
    },
  },
});
