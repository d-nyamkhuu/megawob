// Preserve this site's item count, colored bin headings, and progress status.
(function () {
  let moved = false;
  let lastModel = null;

  env.widget({
    task: 'sort-into-bins',
    site: 'design-sort-into-bins-sort-11',
    name: 'design',
    split: 'train',
    scenarios: ['sort'],
    template: 'sort-into-bins/boxes',
    design: {
      parts: {
        begin: (base) => (ctx) => {
          base(ctx);
          moved = false;
          lastModel = ctx.model;
          const count = document.querySelector('.item-total');
          if (count) count.textContent = String(ctx.spec.items.length);
        },
        box: (base) => (ctx, el, container) => {
          base(ctx, el, container);
          const value = container.label && container.label.toLowerCase();
          if (ctx.spec.rule.kind === 'color' && value && ctx.content.COLORS[value]) {
            const color = ctx.content.COLORS[value];
            const head = el.querySelector('.bx-label');
            head.style.background = `color-mix(in srgb, ${color} 45%, #fff)`;
            head.style.borderColor = `color-mix(in srgb, ${color} 70%, #fff)`;
            el.style.setProperty('--bxc', color);
          }
        },
        shapeSvg: (base, S) => (content, item) =>
          `<svg viewBox="0 0 100 100" fill="${content.COLORS[item.color]}" stroke="#080808" stroke-width="2.3">${S.SHAPES[item.shape]}</svg>`,
        moved: (base) => (ctx) => {
          if (ctx.model !== lastModel) {
            moved = true;
            lastModel = ctx.model;
            const status = document.querySelector('.task-status');
            if (status) status.textContent = 'In progress';
          }
        },
        rendered: (base) => (ctx) => {
          base(ctx);
          const status = document.querySelector('.task-status');
          if (status) status.textContent = moved ? 'In progress' : 'Not complete';
        },
      },
    },
  });
})();
