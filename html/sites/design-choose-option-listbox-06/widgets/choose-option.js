// Willow & Finch listbox: flat rail, inset arrow controls, and viewport-aware rows.
(function () {
  'use strict';

  let clearListbox = null;

  env.widget({
    task: 'choose-option',
    site: 'design-choose-option-listbox-06',
    name: 'design',
    split: 'train',
    scenarios: ['listbox'],
    template: 'choose-option/widgets',
    clear() { if (clearListbox) clearListbox(); },
    design: {
      rowBox: true,
      railClass: null,
      scrollPad: 44,
      integralRows: false,
      parts: {
        rail: () => (ctx, controls) => {
          const track = ctx.util.el('div', 'fp-track', controls.lb);
          track.dataset.role = 'scrollbar';
          const thumb = ctx.util.el('div', 'fp-thumb', track);
          thumb.dataset.role = 'thumb';
          const arrows = [];
          for (const [label, direction] of [['Scroll up', 'up'], ['Scroll down', 'down']]) {
            const arrow = ctx.util.el('button', `fp-scroll-arrow fp-scroll-${direction}`, track);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', label);
            arrows.push(arrow);
          }
          return { track, thumb, up: arrows[0], down: arrows[1] };
        },
        arrowsReady: () => (ctx, controls) => {
          for (const [arrow, direction] of [[controls.up, -1], [controls.down, 1]]) {
            arrow.addEventListener('pointerdown', (event) => event.stopPropagation());
            arrow.addEventListener('click', (event) => {
              event.stopPropagation();
              controls.list.scrollTop += direction * controls.rows[ctx.spec.options[0]].offsetHeight;
              controls.lbx.refresh();
              controls.mirror(controls.lbx.scrollIndex());
            });
          }
        },
        measured: () => (ctx, controls) => {
          const { list, rows, lbx, initialScroll } = controls;
          const inset = parseFloat(getComputedStyle(list).paddingTop) || 0;
          const visiblePitch = Math.max(1, Math.floor((list.clientHeight - inset) / ctx.spec.rows));
          const pitch = Math.min(rows[ctx.spec.options[0]].offsetHeight, visiblePitch);
          list.style.setProperty('--fp-row-height', pitch + 'px');
          const px = rows[ctx.spec.options[1]].offsetTop - rows[ctx.spec.options[0]].offsetTop;
          list.style.paddingBottom = Math.max(0, list.clientHeight - ctx.spec.rows * px) + 'px';
          lbx.refresh();
          lbx.set({ scroll: initialScroll });
          if (px > 0 && px !== ctx.model.px) ctx.update({ ...ctx.model, px });
        },
        ready: (base, S) => (ctx, controls) => {
          clearListbox = () => {
            S.ctx.update({ ...S.ctx.model, values: [] });
            controls.show();
          };
          base(ctx, controls);
        },
      },
    },
  });
})();
