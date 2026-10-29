// Keeps list-12's taller Memphis rows and its rule-aware Memphis instructions.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-12',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    monthHint: null,
    listGap: 0.016,
    listHeight: 0.11,
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        const { spec } = ctx;
        if (document.body.classList.contains('memphis')) {
          const heading = document.querySelector('.brief-title');
          if (heading) heading.textContent = 'List Organizer';
          const order = spec.rule.kind === 'alpha'
            ? (spec.rule.dir === 'desc' ? 'Z to A' : 'A to Z')
            : spec.rule.kind === 'month'
              ? (spec.rule.dir === 'desc' ? 'December to January' : 'January to December')
              : 'the requested order';
          const helper = document.querySelector('.brief-copy');
          if (helper) helper.textContent = 'Drag and drop the items to arrange them ' +
            (order === 'the requested order' ? 'in ' : 'from ') + order + '.';
          const tip = document.querySelector('.bz-pal li:nth-child(2)');
          if (tip) tip.textContent = order === 'the requested order'
            ? 'Follow the requested order.' : 'Arrange from ' + order + '.';
          const instruction = document.querySelector('.task-note .instruction');
          if (instruction && instruction.clientWidth && !instruction.closest('.instruction-panel,.instruction-toast')) {
            const style = getComputedStyle(instruction);
            const measure = document.createElement('canvas').getContext('2d');
            measure.font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
            const width = measure.measureText(instruction.textContent).width;
            if (width > instruction.clientWidth)
              instruction.style.setProperty('font-size',
                (parseFloat(style.fontSize) * instruction.clientWidth / width * 0.98) + 'px', 'important');
          }
        }
      },
    },
  },
});
