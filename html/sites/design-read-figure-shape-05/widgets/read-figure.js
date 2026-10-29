// Keeps the FA frame's menu, recovery placement, and selection status behavior.
(function () {
  'use strict';
  let count, selection, clearButtons, spec;
  env.widget({
    task: 'read-figure',
    site: 'design-read-figure-shape-05',
    name: 'design',
    split: 'train',
    scenarios: ['shape'],
    template: 'read-figure/scene',
    design: {
      menuLabels: null,
      recoveryParent: '.fa-main',
      parts: {
        rendered: (base, S) => (ctx) => {
          base(ctx);
          spec = S.spec;
          count = document.querySelector('.fa-count');
          selection = document.querySelector('.fa-selected');
          clearButtons = document.querySelectorAll('.fa-clear,.fa-reset');
          if (count) count.textContent = 'Shapes: ' + spec.items.length;
          clearButtons.forEach((button) => button.addEventListener('click', () => {
            if (spec.recoverable) S.P.set({ answer: null });
          }));
        },
        synced: (base, S) => (model) => {
          base(model);
          if (selection) {
            const item = S.spec.items[model.answer];
            selection.textContent = 'Selected: ' + (item ? String(item.text).replace(/^./, (c) => c.toUpperCase()) : 'None');
          }
          clearButtons.forEach((button) => {
            button.disabled = !S.spec.recoverable && model.answer !== null && model.answer !== undefined;
          });
        },
      },
    },
  });
})();
