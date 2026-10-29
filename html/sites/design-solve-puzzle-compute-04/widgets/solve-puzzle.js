// Keep the ledger's spacing inside the template's measured, stage-sized build.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-compute-04',
  name: 'design',
  split: 'train',
  scenarios: ['compute'],
  template: 'solve-puzzle/base',
  design: {
    parts: {
      build: (base) => (ctx, box, squeeze) => {
        const card = base(ctx, box, squeeze);
        const compact = box.w < 760;
        const short = box.h < 470;
        const head = card.querySelector('.pz-head');
        const body = card.querySelector('.pz-body');
        const calc = card.querySelector('.pz-calc');
        const table = card.querySelector('.pz-tbl');
        const side = card.querySelector('.pz-side');
        const field = card.querySelector('.pz-in');
        const title = card.querySelector('.pz-title');
        const label = card.querySelector('.pz-label');
        const cells = [...card.querySelectorAll('.pz-tbl td')];
        const headings = [...card.querySelectorAll('.pz-tbl th')];
        let scale = 1;
        const size = () => {
          const px = (n) => `${n * scale}px`;
          card.style.boxSizing = 'border-box';
          card.style.padding = `${px(compact ? 16 : 24)} ${px(compact ? 20 : 34)}`;
          head.style.padding = `0 0 ${px(short ? 5 : 10)}`;
          body.style.padding = '0';
          title.style.fontSize = px(short ? 29 : compact ? 34 : 43);
          if (calc) Object.assign(calc.style, {display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'stretch'});
          if (table) Object.assign(table.style, {width: '100%', flex: 'none'});
          for (const th of headings) Object.assign(th.style, {
            height: px(short ? 32 : 44), padding: `${px(6)} ${px(compact ? 8 : 15)}`,
            fontSize: px(short || compact ? 17 : 23),
          });
          for (const td of cells) Object.assign(td.style, {
            height: px(short ? 29 : 43), padding: `${px(2)} ${px(compact ? 8 : 15)}`,
            maxWidth: 'none', fontSize: px(short ? 16 : compact ? 17 : 22),
          });
          if (side) Object.assign(side.style, {
            paddingTop: px(short ? 10 : 26), display: 'flex', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'center', gap: px(compact ? 12 : 28),
          });
          if (label) label.style.fontSize = px(short ? 21 : compact ? 23 : 32);
          if (field) {
            field.style.setProperty('--pz-fw', px(compact ? 190 : 264));
            field.style.setProperty('--pz-fh', px(short ? 42 : 56));
            field.style.fontSize = px(28);
          }
        };
        // Fit before the template freezes its card and control anchors. No transforms
        // or post-render DOM changes: locate() continues to use the real field.
        for (let pass = 0; pass < 4; pass++) {
          size();
          const rect = card.getBoundingClientRect();
          const ratio = Math.min(1,
            (box.w - 12) / Math.max(rect.width, card.scrollWidth),
            (box.h - 12) / Math.max(rect.height, card.scrollHeight));
          if (ratio >= 1) break;
          scale *= ratio * .97;
        }
        return card;
      },
    },
  },
});
