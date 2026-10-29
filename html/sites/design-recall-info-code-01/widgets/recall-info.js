// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-code-01',
  name: 'design',
  split: 'train',
  scenarios: ['code'],
  template: 'recall-info/classic',
  design: {
    width: 100000,
    frameRadius: '0px',
    parts: {
      usable(base) {
        return function (ctx) {
          const box = base(ctx);
          const rail = ctx.size.height < 440 ? 90 : Number(getComputedStyle(ctx.stage).getPropertyValue('--booking-rail'));
          return { ...box, y: box.y + rail, h: Math.max(0, box.h - rail) };
        };
      },
      placeFrame(base, S) {
        return function (ctx, app, W, H) {
          const box = S.P.usable(ctx);
          base(ctx, app, W, Math.max(H, box.y < 148 ? 250 : 360));
          app.style.top = `${box.y}px`;
        };
      },
      styles(base) {
        return function (ctx) {
          base(ctx);
          const compact = ctx.size.height < 440 || Number(getComputedStyle(ctx.stage).getPropertyValue('--booking-rail')) < 148;
          ctx.css('ur-booking-layout', `
            ${compact ? `
              .ref-stage::before { top:0; height:72px; padding-top:24px; font-size:15px; }
              .ur-classic-booking-panel h3 { font-size:20px!important; }
              .ur-classic-booking-panel .ur-code { font-size:44px!important; }
              .ur-classic-booking-panel .ur-p, .ur-classic-booking-panel .ur-hint { font-size:15px!important; }
            ` : ''}
            .ur-app .ur-work { gap:0; padding:${compact ? '10px 14px' : '22px 26px 16px'}; }
            .ur-app .ur-body { flex:1; min-height:0; overflow:auto; }
            .ur-classic-booking-panel h3 { margin:0 0 ${compact ? 8 : 20}px; }
            .ur-classic-booking-panel .ur-codebox {
              display:block; box-sizing:border-box; width:min(535px,100%); max-width:100%;
              margin:${compact ? '7px 0' : '18px 0 20px'}; padding:${compact ? '5px 24px' : '13px 46px'};
            }
            .ur-classic-booking-panel .ur-code { margin:0; }
            .ur-app .ur-foot { min-height:${compact ? 48 : 76}px; padding:${compact ? 7 : 12}px 0 0; }
            .ur-foot .ur-btn.primary { min-width:${compact ? 150 : 222}px; height:${compact ? 40 : 62}px; padding:8px 24px; }
          `);
        };
      },
      bar(base) {
        return function (ctx, app, title) {
          base(ctx, app, title);
          app.lastElementChild.style.display = 'none';
        };
      },
      progress(base) {
        return function (ctx, work, s) {
          base(ctx, work, s);
          work.lastElementChild.style.display = 'none';
        };
      },
      codeBox(base) {
        return function (ctx, p, s) {
          base(ctx, p, s);
          p.querySelector('.ur-codelabel').hidden = true;
        };
      },
      panel(base, S) {
        return function (ctx, body, st, i, s, apply) {
          const p = base(ctx, body, st, i, s, apply);
          const heading = p.querySelector('h3');
          if (heading && i === 0) heading.textContent = 'Your Booking Reference';
          if (i === 0) p.querySelector('.ur-p').hidden = true;
          p.classList.add('ur-classic-booking-panel');
          return p;
        };
      },
    },
  },
});
