// Design on the choose-option/widgets template.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-10',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      choiceBeforeText: () => (ctx, lab, inp, o, index) => {
        const { util } = ctx;
        const badge = util.el('img', 'fp-badge', lab);
        const badges = [
          'gardening',
          'music',
          'cooking',
          'finance',
          'sports',
          'travel',
          'pets',
          'art',
          'technology',
          'reading',
          'photography',
          'volunteering',
        ];
        const icon = badges.includes(o.toLowerCase()) ? o.toLowerCase() : badges[index % badges.length];
        badge.src = 'sites/design-choose-option-checkbox-10/assets/' + icon + '.webp';
        badge.alt = '';
      },
      choicesReady: () => (ctx, controls) => {
        const { util } = ctx;
        const set = controls.set,
          show = controls.show;
        const multi = true;
        if (multi) {
          const footer = document.querySelector('.ds-footer');
          const clear = util.el('button', 'ds-clear', footer, 'Clear All');
          clear.type = 'button';
          footer.insertBefore(clear, footer.firstChild);
          clear.addEventListener('click', () => {
            set({ values: [] });
            show();
          });
        }
      },
    },
  },
});
