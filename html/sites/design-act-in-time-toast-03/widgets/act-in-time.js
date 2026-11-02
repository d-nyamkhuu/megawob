// Keep the template's model, RNG draws, controls and hit-testing. Size the
// verification sheet during render, before the template freezes its anchors.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-toast-03',
  name: 'design',
  split: 'train',
  scenarios: ['toast'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildToast: (base) => {
        const css = `
        .ds-code-main { position:absolute; inset:0; display:block; padding:0; }
        .ds-code-sheet { display:grid; box-sizing:border-box;
          grid-template-columns:minmax(0,1fr) minmax(90px,30%);
          grid-template-rows:auto var(--delivery) var(--boxes) minmax(0,1fr) 18px var(--verify);
          gap:var(--gap); padding:var(--py) var(--px); border-radius:9px;
          background:linear-gradient(135deg,#282332,#211c2b);
          border:1px solid #373142; box-shadow:0 8px 30px #0002; }
        .ds-code-sheet .ut-vl { display:contents; }
        .ds-code-sheet h3 { grid-area:1/1/2/3; margin:0; font-size:var(--title); }
        .ds-code-sheet .ut-vl > p:first-of-type { grid-area:2/1; align-self:stretch;
          display:flex; align-items:center; margin:0; padding:0 12px 0 var(--icon-space);
          border:1px solid #494155; border-right:0; border-radius:7px 0 0 7px;
          background:#25202e; position:relative; font-size:var(--text); line-height:1.35;
          color:#f1edf6; overflow-wrap:anywhere; }
        .ds-code-sheet .ut-vl > p:first-of-type:before { content:'▯'; position:absolute;
          left:10px; width:var(--icon); height:var(--icon); border-radius:50%;
          background:#403b4d; display:flex; align-items:center; justify-content:center;
          font-size:24px; color:#f7f4fa; }
        .ds-code-sheet .ut-vl > .ut-btn:not(.primary) { grid-area:2/2; align-self:center;
          height:var(--send); padding:0 10px; border-radius:0 7px 7px 0;
          border-color:#ff7274; background:#ff7274; color:#221721;
          font-size:var(--text); font-weight:600; }
        .ds-code-sheet .ut-boxes { grid-area:3/1/4/3; justify-content:center;
          gap:var(--gap); margin:0; min-width:0; }
        .ds-code-sheet .ut-boxes i { flex:1; min-width:0; max-width:var(--cell);
          height:100%; box-sizing:border-box; border-radius:10px;
          border:1.5px solid #a89bbd; background:transparent; }
        .ds-code-sheet .ut-boxes i.cur { border-color:var(--accent); }
        .ds-code-sheet .ut-pad3 { grid-area:4/1/5/3; align-self:center; justify-self:center;
          width:min(100%,var(--pad-width)); height:min(100%,var(--pad-height));
          min-height:0; grid-template-columns:repeat(3,minmax(0,1fr));
          grid-template-rows:repeat(4,minmax(0,1fr)); grid-auto-rows:auto; gap:var(--gap); }
        .ds-code-sheet .ut-pad3 .ut-btn { min-height:0; height:100%; padding:0;
          border:0; border-radius:9px; background:#403b4d; color:#faf8fc; font-size:var(--key); }
        .ds-code-sheet .ut-pad3 .ut-btn:nth-child(10) { grid-area:4/3; }
        .ds-code-sheet .ut-pad3 .ut-btn:nth-child(11) { grid-area:4/2; }
        .ds-code-sheet .ut-pad3 > span { grid-area:4/1; }
        .ds-code-sheet .ut-vl > p:nth-of-type(2) { grid-area:5/1/6/3; margin:0;
          font-size:12px; line-height:18px; }
        .ds-code-sheet .ut-vl > .ut-btn.primary { grid-area:6/1/7/3; height:100%;
          border-radius:8px; background:#514b5e; color:#c5bdce; font-size:var(--text); }
        `;
        return (ctx, frame) => {
        const style = ctx.util.el('style', 'ds-code-style', frame.body);
        style.textContent = css;
        const view = base(ctx, frame);
        const main = frame.body.querySelector('.ut-main');
        const card = main.querySelector('.ut-verify');
        main.classList.add('ds-code-main');
        card.classList.add('ds-code-sheet');
        const bounds = main.getBoundingClientRect();
        const width = Math.min(bounds.width, 830);
        const height = Math.min(bounds.height, 780);
        const scale = Math.min(1, width / 730, height / 690);
        Object.assign(card.style, {
          left: ((bounds.width - width) / 2) + 'px',
          top: ((bounds.height - height) / 2) + 'px',
          width: width + 'px', height: height + 'px',
        });
        const sizes = {px:48, py:36, delivery:76, boxes:73, gap:9,
          verify:57, send:54, title:31, text:18, icon:42,
          'icon-space':70, cell:68, 'pad-width':480, 'pad-height':253, key:25};
        for (const [key, value] of Object.entries(sizes)) {
          card.style.setProperty('--' + key, value * scale + 'px');
        }
        return view;
        };
      },
    },
  },
});
