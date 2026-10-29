// Keeps this design's single range field, inert adjacent days, and seeded briefing fit.
(function () {
let clearCtx;
let clearPaint;

env.widget({
  task: 'set-date',
  site: 'design-set-date-range-08',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-date/calendar',
  design: {
    rangeLayout: null,
    adjacentDays: false,
    parts: {
      begin: (base, S) => (ctx) => {
        clearCtx = ctx;
        clearPaint = () => S.P.paint();
        return base(ctx);
      },
      heading: (base, S) => (ctx, extras) => {
        const heading = document.querySelector('.ds-header-note .ds-instruction');
        if (heading) {
          let fontSize = parseFloat(getComputedStyle(heading).fontSize);
          for (let i = 0; i < 16 && heading.offsetHeight > fontSize * 2.08; i++) {
            fontSize *= 0.96;
            heading.style.fontSize = fontSize + 'px';
          }
        }
        return base(ctx, extras);
      },
      blankDay: (base, S) => (grid, day, util) => {
        util.el('div', 'fd-day out fd-adjacent', grid, String(day));
      },
      rangeReadout: (base, S) => (ctx, model, txt, fields) => {
        base(ctx, model, txt, fields);
        const start = txt.querySelector('[data-part="start"]');
        if (start) start.dataset.cap = S.spec.scene.label;
        const arrow = txt.querySelector('.fd-arrowr');
        if (arrow) arrow.textContent = '';
        const end = Array.from(txt.children).find((el) => el !== start && el !== arrow);
        if (end) end.dataset.cap = S.spec.scene.label2;

        const { fam, geo } = S;
        const startValue = model.start ? S.P.fmtLocal(model.start, geo.disp) : 'Not selected';
        const endValue = model.end ? S.P.fmtLocal(model.end, geo.disp) : 'Not selected';
        const vs = document.querySelector('.ds-v-start');
        const ve = document.querySelector('.ds-v-end');
        const vl = document.querySelector('.ds-v-len');
        if (vs) vs.textContent = startValue;
        if (ve) ve.textContent = endValue;
        if (vl) vl.textContent = model.start && model.end
          ? `${fam.helpers.days(model.end) - fam.helpers.days(model.start)} days`
          : '—';
      },
    },
  },
  clear() {
    if (!clearCtx) return;
    clearCtx.update({ ...clearCtx.model, start: null, end: null });
    clearPaint();
  },
});
})();
