// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-range-02',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-slider/classic',
  design: {
    sampleLook: false,
    parts: {
      renderPlain: (base, S) => (ctx) => {
        const {util, spec, size} = ctx;
        const scaleFmt = env.taskOf('set-slider').helpers.scale;
        const scale = Math.max(.66, Math.min(1, size.width / 1128));
        const inspectorLabel = document.querySelector('.inspector-range-label');
        inspectorLabel.textContent = spec.sliders[0].label + ' (range)';
        const out = spec.sliders.map((s,i) => {
          const widget = util.el('section','range-widget',ctx.stage);
          if (spec.sliders.length > 1) {
            widget.style.top = (4 + i * 17) + '%';
            widget.style.height = '17%';
          }
          util.el('div','range-caption',widget,s.label);
          const wrap = util.el('div','range-track-wrap',widget);
          const sl = S.P.makeSlider(ctx, wrap, i, s, {
            vertical:false, length:Math.floor(size.width * .925 * .88),
            thumb:44 * scale, thumbBox:[20 * scale,44 * scale], rail:16 * scale,
            standalone:true, labelEl:false, ticks:true, tickCount:8, badges:true,
            onPaint(vals) {
              if (i === 0) {
                document.querySelector('.lower-value').textContent = scaleFmt.fmt(s,vals[0]);
                document.querySelector('.upper-value').textContent = vals.length > 1 ? scaleFmt.fmt(s,vals[1]) : '–';
              }
            }
          });
          const hit = sl.anchor;
          util.el('div','range-minor-ticks',hit);
          const extents = util.el('div','scale-extents',hit);
          util.el('span','',extents,scaleFmt.fmt(s,s.min));util.el('span','',extents,scaleFmt.fmt(s,s.max));
          return sl;
        });
        const preview = util.el('section','preview-box',ctx.stage);
        if (spec.sliders.length > 1) preview.style.top = '46%';
        util.el('h3','preview-heading',preview,'Preview');
        const columns = util.el('div','preview-columns',preview);
        for (const label of ['Original','Adjusted (preview)']) {
          const pane = util.el('div','preview-pane',columns);
          util.el('div','preview-label',pane,label);
          const image = util.el('div','lake-preview',pane);
          image.setAttribute('role','img');image.setAttribute('aria-label','Lake with wooded hills');
        }
        return out;
      },
      beforeThumbs: () => (ctx, w) => {
        w.badges = w.g.badges ? Array.from({ length: w.n }, () => ctx.util.el('output', 'value-field thumb-readout', w.hit)) : [];
      },
      painted: () => (ctx, w, vals, fs) => {
        const { L } = w;
        const badgeWidth = w.badges.length ? w.badges[0].offsetWidth : 0;
        const centers = fs.map(f => Math.max(badgeWidth / 2, Math.min(L - badgeWidth / 2, f * L)));
        if (centers.length === 2 && centers[1] - centers[0] < badgeWidth + 7) {
          const middle = Math.max(badgeWidth + 4, Math.min(L - badgeWidth - 4, (centers[0] + centers[1]) / 2));
          centers[0] = middle - (badgeWidth + 7) / 2;
          centers[1] = middle + (badgeWidth + 7) / 2;
        }
        w.badges.forEach((badge,j) => {
          badge.textContent = env.taskOf('set-slider').helpers.scale.fmt(w.s, vals[j]);
          badge.style.left = centers[j] + 'px';
        });
        if (w.g.onPaint) w.g.onPaint(vals);
      },
    },
  },
});
