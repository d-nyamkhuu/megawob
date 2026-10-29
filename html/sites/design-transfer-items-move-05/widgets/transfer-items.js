// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-move-05',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'transfer-items/dual',
  design: {
    title: 'Report columns',
    note: '',
    leftLabel: 'Available',
    rightLabel: 'Selected',
    parts: {
      body: (base) => (ctx, card) => {
        card.classList.add('risc-transfer-card');
        const el = base(ctx, card);
        Object.assign(el.style, {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gridTemplateRows: 'minmax(0, 1fr) auto',
          columnGap: '30px',
          rowGap: '18px',
          paddingLeft: '22px', paddingRight: '0',
        });
        return el;
      },
      transferControls: (base) => (ctx, body) => {
        const el = base(ctx, body);
        el.classList.add('risc-transfer-controls');
        Object.assign(el.style, {
          gridColumn: '1 / -1', gridRow: '2',
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          alignItems: 'center', gap: '14px',
        });
        for (const button of el.querySelectorAll('button')) {
          button.style.width = '62px';
          button.style.height = '42px';
        }
        return el;
      },
      rowContent: (base) => (ctx, row, key, item, index) => {
        base(ctx, row, key, item, index);
        const country = typeof item === 'string' ? item : item && (item.name || item.label || item.country) || '';
        if (country) row.dataset.country = String(country).trim();
      },
    },
  },
});
