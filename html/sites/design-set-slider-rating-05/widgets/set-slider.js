// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
(function () {
let ratingGeometry = [];
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-rating-05',
  name: 'design',
  split: 'train',
  scenarios: ['rating'],
  template: 'set-slider/base',
  design: {
    parts: {
      renderRating: (base) => (ctx, look) => {
        const result = base(ctx, { ...look, thumb: Math.max(24, look.thumb || 0) });
        const rows = [...ctx.stage.querySelectorAll('.slr-row')];
        ratingGeometry = [];
        rows.forEach((row, index) => {
          if (index === 0) {
            const label = row.querySelector('.slr-label');
            label.textContent = `${ctx.spec.scene.item} (${label.textContent})`;
          }
          const box = row.querySelector('.slr-stars');
          const cells = [...box.querySelectorAll('.slr-star')];
          const px = parseFloat(cells[0].style.width);
          ratingGeometry.push({ box, cells, px });
          const desired = Math.min(64, Math.max(32, ctx.size.width * .07));
          const heightLimit = rows.length > 2 ? Math.max(22, (ctx.size.height - 70) / rows.length - 80) : desired;
          const cellSize = Math.min(desired, heightLimit, (ctx.size.width - 60) / (cells.length * 1.34));
          const gap = cellSize * .34;
          const zoom = cellSize / px;
          box.style.zoom = String(zoom);
          box.style.setProperty('gap', `${gap / zoom}px`, 'important');
          box.setAttribute('aria-valuemax', String(cells.length));
          let dragging = false;
          const mapPointer = (event) => {
            if (event.type === 'pointerdown') dragging = true;
            if (!dragging) return;
            const rect = box.getBoundingClientRect();
            const star = cells[0].getBoundingClientRect();
            const stride = cells.length > 1 ? cells[1].getBoundingClientRect().left - star.left : star.width;
            const x = event.clientX - rect.left;
            const index = Math.floor(x / stride);
            const fraction = Math.max(0, Math.min(1, (x - index * stride) / star.width));
            Object.defineProperty(event, 'clientX', { configurable: true, value: rect.left + index * (px + 4) + fraction * px });
            if (event.type === 'pointerup' || event.type === 'pointercancel') dragging = false;
          };
          for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) box.addEventListener(type, mapPointer, true);
          const readout = row.querySelector('.slr-value');
          const formatValue = () => {
            const text = `${box.getAttribute('aria-valuenow')} out of ${cells.length} stars`;
            if (readout.textContent !== text) readout.textContent = text;
          };
          const observer = new MutationObserver(formatValue);
          observer.observe(box, { attributes: true, attributeFilter: ['aria-valuenow'] });
          formatValue();
        });
        return result;
      },
      'classic.locate': (base) => (target) => {
        const point = base(target);
        const geometry = ratingGeometry[target.slider];
        if (!geometry || target.value === undefined) return point;
        const { box, cells, px } = geometry;
        const rect = box.getBoundingClientRect();
        const star = cells[0].getBoundingClientRect();
        const stride = cells.length > 1 ? cells[1].getBoundingClientRect().left - star.left : star.width;
        const oldX = Array.isArray(point) ? point[0] : point.x;
        const local = oldX - rect.left;
        const index = Math.floor(local / (px + 4));
        const fraction = (local - index * (px + 4)) / px;
        const x = rect.left + index * stride + fraction * star.width;
        const y = star.top + star.height / 2;
        return Array.isArray(point) ? [x, y] : { ...point, x, y };
      },
    },
  },
});
})();
