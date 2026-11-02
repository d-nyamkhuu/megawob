// Site design on the shared act-in-time/arena template.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-11',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    clearView: true,
    parts: {
      hover: () => (ctx, b, up) => {
        let pointerMoved = false;
        const markPointerMove = () => {
          pointerMoved = true;
        };
        b.svg.addEventListener('pointermove', markPointerMove, true);
        const hov = env.ui.hover(b.svg, {
          clock: ctx.clock,
          label: 'board',
          onMove: ({ x, y }) => {
            if (!pointerMoved) return;
            pointerMoved = false;
            const p = b.toBoard([x, y]).map((v) => Math.round(v * 10000) / 10000);
            up({ p });
          },
          onLeave: () => {
            if (ctx.model.p !== null) up({ p: null });
          },
        });
        return {
          detach() {
            b.svg.removeEventListener('pointermove', markPointerMove, true);
            hov.detach();
          },
        };
      },
      rendered: (base) => (ctx, f) => {
        base(ctx, f);
        const board = f.body.querySelector('.ut-board');
        if (board && ctx.spec.scenario === 'chase') {
          const main = board.parentElement.getBoundingClientRect();
          const box = board.getBoundingClientRect();
          const safe = { left: main.left + 12, right: main.right - 12, top: main.top + 12, bottom: main.bottom - 12 };
          const positions = [];
          for (let t = 0; t <= ctx.spec.dur; t += Math.max(1, ctx.spec.beat / 20))
            positions.push(env.taskDef.helpers.chasePos(ctx.spec, t));
          positions.push(env.taskDef.helpers.chasePos(ctx.spec, ctx.spec.dur));
          const xs = positions.map((p) => p[0]),
            ys = positions.map((p) => p[1]),
            r = ctx.spec.r;
          const bounds = {
            left: box.left + ((Math.min(...xs) - r) / ctx.spec.A) * box.width,
            right: box.left + ((Math.max(...xs) + r) / ctx.spec.A) * box.width,
            top: box.top + (Math.min(...ys) - r) * box.height,
            bottom: box.top + (Math.max(...ys) + r) * box.height,
          };
          const scale = Math.min(
            1,
            (safe.right - safe.left) / (bounds.right - bounds.left),
            (safe.bottom - safe.top) / (bounds.bottom - bounds.top),
          );
          const cx = box.left + box.width / 2,
            cy = box.top + box.height / 2;
          const left = cx + (bounds.left - cx) * scale,
            right = cx + (bounds.right - cx) * scale;
          const upper = cy + (bounds.top - cy) * scale,
            lower = cy + (bounds.bottom - cy) * scale;
          const dx = Math.max(safe.left - left, Math.min(0, safe.right - right));
          const dy = Math.max(safe.top - upper, Math.min(0, safe.bottom - lower));
          board.style.setProperty('--chase-fit-scale', scale);
          board.style.setProperty('--chase-fit-x', dx + 'px');
          board.style.setProperty('--chase-fit-y', dy + 'px');
        }
      },
    },
  },
});
