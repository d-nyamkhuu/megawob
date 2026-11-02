// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-code-05',
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
          const box = p.querySelector('.ur-codebox');
          const label = p.querySelector('.ur-codelabel');
          if (box && label) {
            label.hidden = false;
            label.textContent = 'Registration Key:';
            const row = env.util.el('div', 'mac-code-row', p);
            p.insertBefore(row, box);
            row.append(label, box);
          }
        };
      },
      panel(base, S) {
        return function (ctx, body, st, i, s, apply) {
          const p = base(ctx, body, st, i, s, apply);
          const heading = p.querySelector('h3');
          if (heading && i === 0) heading.textContent = 'Step 1 of 3: Get Your Registration Key';
          if (i === 0) p.querySelector('.ur-p').hidden = true;
          if (i === 0) p.classList.add('mac-first-step');
          p.classList.add('ur-classic-booking-panel');
          return p;
        };
      },
      rendered(base) {
        return function (ctx, app, work, view) {
          base(ctx, app, work, view);
          const el = env.util.el;
          const list = el('aside', 'mac-device-list', ctx.stage);
          el('div', 'mac-list-title', list, 'Devices');
          const devices = [
            ['Macintosh II', 'F4201ZX93'], ['Macintosh SE', 'S8820LM14'],
            ['Macintosh Plus', 'P3190AA27'], ['Macintosh IIci', 'C7648KD01'],
            ['Macintosh Classic', 'T1002BK44'], ['Macintosh LC', 'L5527QJ19'],
            ['Macintosh IIsi', 'H8931MP66'], ['Macintosh Quadra', 'Q4020RD33']
          ];
          const scroll = el('div', 'mac-list-scroll', list);
          for (const [name, serial] of devices) {
            const item = el('div', 'mac-list-item', scroll);
            if (name === 'Macintosh II') item.classList.add('selected');
            el('span', 'mac-small-computer', item);
            const words = el('span', 'mac-device-words', item);
            el('span', '', words, name);
            el('span', '', words, serial);
          }
          const scrollbar = el('div', 'mac-list-bar', list);
          el('div', 'mac-list-up', scrollbar, '⇧');
          el('div', 'mac-list-thumb', scrollbar);
          el('div', 'mac-list-down', scrollbar, '⇩');
          const history = el('section', 'mac-history', app);
          el('h4', '', history, 'Recent Registrations');
          const table = el('table', '', history);
          const heads = ['Date', 'Device', 'Serial Number', 'Registration Key', 'Status'];
          const thead = el('thead', '', table);
          const hr = el('tr', '', thead);
          for (const head of heads) el('th', '', hr, head);
          const tbody = el('tbody', '', table);
          const rows = [
            ['Apr 10, 1988','Macintosh SE','S8820LM14','4H6P-1Q9N-8Z2V','Completed'],
            ['Apr  9, 1988','Macintosh IIci','C7648KD01','9B5T-3F0K-7J1M','Completed'],
            ['Apr  8, 1988','Macintosh Classic','T1002BK44','2L9V-8D4Q-6P0H','Completed'],
            ['Apr  6, 1988','Macintosh LC','L5527QJ19','6M1Z-0K3B-9T5F','Expired'],
            ['Apr  3, 1988','Macintosh IIsi','H8931MP66','8Q2D-5V7M-1C3K','Completed']
          ];
          for (const row of rows) {
            const tr = el('tr', '', tbody);
            for (const cell of row) el('td', '', tr, cell);
          }
        };
      },
    },
  },
});
