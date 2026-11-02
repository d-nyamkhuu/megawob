// Keep the end control clear of the answer options when the reference layout overlaps them.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-04',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    parts: {
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const root = S.root,
          scene = S.scene,
          end = env.submitEl;
        if (end && end.classList.contains('end-form')) {
          const er = end.getBoundingClientRect(),
            targets = [...root.querySelectorAll('.controls button,.answer input')],
            overlap = targets.some((e) => {
              const r = e.getBoundingClientRect();
              return r.left < er.right && r.right > er.left && r.top < er.bottom && r.bottom > er.top;
            });
          if (overlap) {
            const bottom = Math.max(...targets.map((e) => e.getBoundingClientRect().bottom)),
              right = end.parentElement.getBoundingClientRect(),
              preview = scene.getBoundingClientRect();
            if (bottom + 8 + er.height <= preview.top - 8) end.style.top = bottom - right.top + 8 + 'px';
            else {
              document.querySelector('.toolbar').append(end);
              end.classList.replace('end-form', 'end-toolbar');
            }
          }
        }
      },
    },
  },
});
