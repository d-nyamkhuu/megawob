// Keep the template's controls and size their rows to the available stage.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-tree-01',
  name: 'design',
  split: 'train',
  scenarios: ['tree'],
  template: 'choose-option/base',
  design: {
    parts: {
      buildTree: (base) => (field, ctx) => {
        base(field, ctx);
        const box = field.querySelector('.fp-tgroups');
        const top = box.getBoundingClientRect().top - ctx.stage.getBoundingClientRect().top;
        let rowHeight = 58;
        for (const group of box.children) {
          const style = getComputedStyle(group);
          const head = group.querySelector('.fp-thead');
          const count = group.querySelectorAll('.fp-tkid').length;
          const frame = head.offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
            + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
          rowHeight = Math.min(rowHeight, (ctx.size.height - top - frame - 4) / count);
        }
        box.style.setProperty('--fp-kid', Math.floor(rowHeight) + 'px');
      },
    },
  },
});
