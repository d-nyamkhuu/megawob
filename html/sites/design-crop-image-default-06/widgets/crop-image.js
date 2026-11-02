env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-06',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 896 / 644 },
  template: 'crop-image/box',
  design: {
    parts: {
      style: (base) => () => base()
        .replace(`  .cr-frame { position: relative; flex: none; box-shadow: 0 4px 18px rgba(0,0,0,.18); border-radius: 2px; touch-action: none; }
`, `  .cr-frame { position: relative; flex: none; box-shadow: none; border: 1px solid #c5ccd4; border-radius: 0; background:linear-gradient(135deg,#f1f2f3,#e9ecef); touch-action: none; }
`)
        .replace(`  .cr-box { position: absolute; outline: 1px solid rgba(255,255,255,.95); box-shadow: 0 0 0 1px rgba(0,0,0,.35); cursor: move; touch-action: none; }
`, `  .cr-box { position: absolute; outline: 2px solid #1768c8; box-shadow: none; cursor: move; touch-action: none; }
`)
        .replace(`    position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px;
    background: var(--accent); border: 1.5px solid #fff; border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.35);
`, `    position: absolute; width: 21px; height: 21px; margin: -10.5px 0 0 -10.5px;
    background: #fff; border: 3px solid #1768c8; border-radius: 0;
    box-shadow: none;
`)
        .replace(/  $/, `  body.design.civic-transfer{--ink:#10264d;--accent:#1768c8;color:var(--ink);font-family:Arial,"Segoe UI",sans-serif;background:#fff}
  .civic-transfer .shell{height:100vh;padding:0;gap:0;background:#fff}
  .civic-transfer .head{height:62px;min-height:62px;padding:0 40px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(105deg,#23466f,#17375e);color:#fff}
  .civic-transfer .title{font-size:30px;font-weight:700;line-height:1}
  .civic-transfer .subtitle{margin:0;color:#fff;font-size:18px}
  .civic-transfer .content{position:relative;flex:1;min-height:0;padding:10px 5px 9px 8px;display:block;overflow:hidden}
  .civic-transfer .stage{position:absolute;left:8px;top:10px;bottom:9px;width:57.5%;border:1px solid #d3dbe4;background:#fff;display:flex;align-items:center;justify-content:center}
  .civic-transfer .stage::before{content:"Image";position:absolute;top:20px;left:31px;color:#10264d;font-size:32px;font-weight:700;z-index:2}
  .civic-transfer .task-note{position:absolute;right:5px;top:10px;width:42.5%;height:178px;padding:42px 34px 22px;border:1px solid #d3dbe4;border-bottom:0;background:#fff;display:block}
  .civic-transfer .instruction{font-size:clamp(27px,2.2vw,37px);line-height:1.28;font-weight:700;color:#10264d}
  .civic-transfer .note-label{display:none}
  .civic-transfer .aside{position:absolute;right:5px;top:188px;bottom:9px;width:42.5%;min-height:0;padding:0 34px 32px;border:1px solid #d3dbe4;border-top:0;background:#fff;display:flex;flex-direction:column;line-height:1.4}
  .civic-transfer .aside h3{border-top:2px solid #d3dbe4;padding-top:18px;margin:0 0 20px;color:#10264d;font-size:28px;font-weight:700}
  .civic-transfer .civic-steps{list-style:none;counter-reset:civic-step;padding:0;margin:0;border-bottom:2px solid #d3dbe4;padding-bottom:18px;flex:1}
  .civic-transfer .civic-steps{margin-bottom:112px}
  .civic-transfer .civic-steps li{counter-increment:civic-step;position:relative;padding:0 0 0 66px;margin:0 0 21px;color:#182b4c;font-size:22px;line-height:1.45}
  .civic-transfer .civic-steps li::before{content:counter(civic-step);position:absolute;left:0;top:0;width:44px;height:44px;border-radius:50%;background:#10284f;color:#fff;font-weight:700;text-align:center;line-height:44px;font-size:23px}
  .civic-transfer .reset,.civic-transfer .aside .submit{position:absolute;bottom:clamp(72px,12.5vh,118px);height:80px;min-width:0;width:calc(50% - 44px);margin:0;padding:10px;border:2px solid #aab8ca;border-radius:4px;background:linear-gradient(#fff,#f4f6f8);color:#10264d;font-size:27px;font-weight:700}
  .civic-transfer .reset{left:34px}
  .civic-transfer .aside .submit{right:29px;background:#1768c8;border:1px solid #1768c8;color:#fff}
  .civic-transfer .aside .cr-tools{position:absolute;left:34px;right:34px;bottom:235px;display:flex;justify-content:flex-start;gap:10px;margin:0}
  .civic-transfer .aside .cr-apply{padding:10px 22px;border:1px solid #aab8ca;border-radius:4px;background:#fff;color:#10264d;font-size:18px;font-weight:700}
  .civic-transfer .footer{height:67px;min-height:67px;padding:0 40px;border-top:1px solid #d3dbe4;background:#fff;color:#24466d;justify-content:flex-start;font-size:17px}
  .civic-transfer .footer-copy{font-weight:600}
  .civic-transfer .footer-copy::after{content:"　　Help　 |　 Privacy　 |　 Terms";position:fixed;right:40px;bottom:24px;font-weight:400;color:#1768c8;text-decoration:underline}
  .civic-transfer .stage .cr-wrap{left:50%!important;top:50%!important;transform:translate(-50%,-47%)}
  .civic-transfer .stage .cr-box{outline:3px solid #1768c8!important;border:0!important}
  @media(max-width:1150px){.civic-transfer .task-note{height:150px;padding:28px 22px 15px}.civic-transfer .instruction{font-size:clamp(23px,2.4vw,30px)}.civic-transfer .aside{top:160px;padding:0 22px 24px}.civic-transfer .aside h3{font-size:23px}.civic-transfer .civic-steps{margin-bottom:90px}.civic-transfer .civic-steps li{font-size:17px;padding-left:52px;margin-bottom:14px}.civic-transfer .civic-steps li::before{width:36px;height:36px;line-height:36px;font-size:20px}.civic-transfer .reset,.civic-transfer .aside .submit{height:62px;font-size:21px;bottom:30px}.civic-transfer .reset{left:22px}.civic-transfer .aside .submit{right:22px}.civic-transfer .aside .cr-tools{left:22px;right:22px;bottom:175px}}
  `),
      fit: (base, S) => (ctx, tools) => base({ ...ctx, size: ctx.stage.getBoundingClientRect() }, tools),
      locateHandle: (base, S) => (name, rect) => {
        const point = base(name, rect);
        if (!S.els.handles[name]) return point;
        const center = S.ctx.util.center(S.els.handles[name]);
        const current = S.crop.locateHandle(name, S.ctx.model);
        return [point[0] + center[0] - current[0], point[1] + center[1] - current[1]];
      },
    },
  },
});
