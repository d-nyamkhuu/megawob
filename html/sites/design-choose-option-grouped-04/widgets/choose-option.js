// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-grouped-04',
  name: 'design',
  split: 'train',
  scenarios: ['grouped'],
  template: 'choose-option/base',
  design: {
    parts: {
      place: (base) => (card, ctx, popup) => {
        base(card, ctx, popup);
        // Open upward when the lower form has too little room for the menu.
        const menu = card.querySelector('.fp-gpop');
        if (!menu) return;
        const list = menu.querySelector('.fp-glist');
        const trigger = card.querySelector('.fp-trigger');
        const stageBox = ctx.stage.getBoundingClientRect();
        const triggerBox = trigger.getBoundingClientRect();
        const menuHeight = parseFloat(list.style.height) + 12;
        if (triggerBox.bottom - stageBox.top + menuHeight > ctx.size.height) {
          menu.style.top = 'auto';
          menu.style.bottom = 'calc(100% + 4px)';
        }
      },
    },
  },
});
