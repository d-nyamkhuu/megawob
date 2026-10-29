// Design on the choose-option/widgets template.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-07',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    railClass: null,
    arrows: false,
    integralRows: false,
    syncScroll: true,
    scrollPad: null,
    parts: {
      geometry: () => (ctx, controls) => {
        const { field, lb } = controls;
        const label = field.querySelector('.fp-label');
        const labelSpace = label
          ? label.getBoundingClientRect().height + parseFloat(getComputedStyle(label).marginBottom)
          : 0;
        const style = getComputedStyle(lb);
        const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        const rowH = Math.floor((ctx.size.height - labelSpace - border) / ctx.spec.rows);
        return { rowH, H: ctx.spec.rows * rowH, border };
      },
    },
  },
});
