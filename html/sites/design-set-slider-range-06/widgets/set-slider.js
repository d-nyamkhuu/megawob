// Range guide design: wide labeled handles, compact full-width tracks, and target values in the guide.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-range-06',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-slider/classic',
  design: {
    parts: {
      look: (base) => (ctx) => {
        const look = base(ctx);
        look.thumb = Math.max(27, Math.min(44, ctx.size.width * 0.051));
        look.rail = 28;
        look.ticks = true;
        look.readout = true;
        look.native = false;

        const guide = document.querySelector('.ref-card');
        const s = ctx.spec.sliders.find((slider) => Array.isArray(slider.target) && slider.target.length === 2)
          || ctx.spec.sliders[0];
        if (guide && Array.isArray(s.target)) {
          const scale = env.taskOf('set-slider').helpers.scale;
          const [lo, hi] = s.target;
          const description = guide.querySelector('p');
          description.textContent = `Set the lower handle to ${scale.fmtU(s, lo)} and the upper handle to ${scale.fmtU(s, hi)}.`;
          guide.classList.toggle('long-guide', description.textContent.length > 75);
          const guideTitle = document.querySelector('.ref-body h2');
          guideTitle.textContent = `${s.label} Guide`;
          guideTitle.classList.toggle('long-title', guideTitle.textContent.length > 18);
          const mini = guide.querySelector('.mini');
          const a = scale.frac(s, lo);
          const b = scale.frac(s, hi);
          Object.assign(mini.querySelector('.mini-fill').style, { left: a * 100 + '%', width: (b - a) * 100 + '%' });
          mini.querySelectorAll('.mini-thumb').forEach((el, j) => {
            el.style.left = (j ? b : a) * 100 + '%';
            el.dataset.v = scale.fmt(s, j ? hi : lo);
            el.classList.toggle('wide-value', el.dataset.v.length > 2);
          });
          const ticks = guide.querySelector('.mini-ticks');
          ticks.replaceChildren();
          const count = scale.fmt(s, s.min).length > 3 || scale.fmt(s, s.max).length > 3 ? 4 : 5;
          for (let j = 0; j <= count; j++) {
            const tick = ctx.util.el('i', '', ticks, scale.fmt(s, scale.valueAt(s, j / count)));
            tick.style.left = (j * 100) / count + '%';
          }
        }
        return look;
      },
      card: (base) => (ctx, layout) => {
        const card = base(ctx, layout);
        const { n, size, look } = layout;
        const inset = Math.max(13, Math.ceil(look.thumb / 2) + 2);
        if (n > 1) {
          card.style.setProperty('--slider-inset', inset + 'px');
          card.classList.add('compact');
          const font = parseFloat(getComputedStyle(ctx.stage).fontSize);
          card.style.setProperty('--slider-font', Math.min(font,
            Math.max(10, (size.height / n - Math.max(look.thumb, 24) - 12) / 5.2)) + 'px');
        }
        return card;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (!layout.vertical) {
          const inset = Math.max(13, Math.ceil(layout.look.thumb / 2) + 2);
          g.length = Math.max(1, Math.floor(layout.size.width) - (layout.n > 1 ? 2 * inset : 26));
        }
      },
      sliderOptions: (base) => (ctx, w) => {
        const options = base(ctx, w);
        if (!w.g.vertical && (ctx.opts.instr === 'toast' || ctx.opts.route === 'wheel')) {
          options.geometry = () => {
            const rect = w.hit.getBoundingClientRect();
            return {
              length: w.L,
              point: (f) => [rect.left + f * w.L, rect.top + rect.height / 2 - 4],
              project: ([x]) => x - rect.left,
            };
          };
        }
        return options;
      },
      painted: (base) => (ctx, w, vals, fractions) => {
        base(ctx, w, vals, fractions);
        w.thumbs.forEach((thumb, j) => {
          thumb.dataset.v = w.fmt(vals[j]);
          thumb.classList.toggle('wide-value', thumb.dataset.v.length > 2);
        });
      },
    },
  },
});
