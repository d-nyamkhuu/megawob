// Size the notebook document before the template measures and freezes its anchors.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-compute-01',
  name: 'design',
  split: 'train',
  scenarios: ['compute'],
  template: 'solve-puzzle/base',
  design: {
    parts: {
      build: (base) => (ctx, box, squeeze) => {
        const card = base(ctx, box, squeeze);
        const narrow = box.w < 740;
        const compact = box.h < 470;
        const set = (node, style) => Object.assign(node.style, style);
        set(card, { width: `${box.w - 8}px`, height: `${box.h - 8}px`, boxSizing: 'border-box' });
        const head = card.querySelector('.pz-head');
        set(head, { padding: compact ? '10px 22px' : narrow ? '14px 20px' : '20px 30px 16px', margin: '0' });
        for (const name of ['.pz-badge', '.pz-sub', '.pz-foot']) {
          const node = card.querySelector(name);
          if (node) node.style.display = 'none';
        }
        const body = card.querySelector('.pz-body');
        set(body, { display: 'flex', flexDirection: 'column', flex: '1 1 0', minHeight: '0', minWidth: '0',
          padding: compact ? '14px 22px' : narrow ? '18px 18px 10px' : '30px 30px 20px' });
        const calc = card.querySelector('.pz-calc');
        if (calc) {
          set(calc, { display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start',
            flex: '1 1 0', minWidth: '0', minHeight: '0', gap: '16px' });
          const side = calc.querySelector('.pz-side');
          const sideHeight = compact ? 60 : narrow ? 70 : 88;
          set(side, { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
            alignSelf: 'stretch', gap: '20px', flex: '0 0 auto', height: `${sideHeight}px`, marginTop: 'auto' });
          set(side.querySelector('.pz-in'), { height: '50px', width: '162px', flex: '0 0 auto', boxSizing: 'border-box' });
          const table = calc.querySelector('.pz-tbl');
          set(table, { width: '100%', maxWidth: '100%', tableLayout: 'auto', flex: '0 0 auto' });
          const bodyStyle = getComputedStyle(body);
          const room = box.h - 8 - head.getBoundingClientRect().height
            - parseFloat(bodyStyle.paddingTop) - parseFloat(bodyStyle.paddingBottom) - sideHeight - 16;
          const rowHeight = Math.min(compact ? 34 : 43, Math.floor(room / (ctx.spec.rows.length + 1)));
          for (const cell of table.querySelectorAll('th, td')) {
            set(cell, { height: `${rowHeight}px`, boxSizing: 'border-box', whiteSpace: 'normal', overflowWrap: 'anywhere',
              padding: rowHeight < 30 ? '2px 9px' : narrow ? '5px 9px' : '7px 18px' });
          }
        }
        return card;
      },
    },
  },
});
