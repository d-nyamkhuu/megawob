// Fixed CSS-scaled listbox dimensions with the reference design's proportional scrolling.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-05',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    keyboard: true,
    railClass: null,
    arrows: false,
    parts: {
      geometry: () => (ctx, controls, sampledRowH) => {
        const view = ctx.stage.ownerDocument.defaultView;
        const scale = Math.min(view.innerWidth / 1672, view.innerHeight / 941);
        return { rowH: 33 * scale, H: 222 * scale, border: 4 * scale };
      },
      list: (base) => (ctx, controls) => {
        const list = base(ctx, controls);
        list.style.height = 'calc(222 * var(--u))';
        return list;
      },
      row: (base) => (ctx, controls, option, index) => {
        const row = base(ctx, controls, option, index);
        row.style.height = 'calc(33 * var(--u))';
        return row;
      },
      prepare: () => (ctx, controls) => {
        const { list, rows } = controls;
        const options = ctx.spec.options;
        const visibleRowHeight =
          rows[options[1]].getBoundingClientRect().top - rows[options[0]].getBoundingClientRect().top;
        ctx.spec.rows = Math.max(1, Math.floor(list.clientHeight / visibleRowHeight));
        controls.logicalMax = Math.max(0, options.length - ctx.spec.rows);
        controls.maxTop = () => Math.max(0, list.scrollHeight - list.clientHeight);
        controls.physicalRow = () => rows[options[1]].offsetTop - rows[options[0]].offsetTop;
      },
      mirror: (base, S) => (ctx, controls) => {
        const i = controls.maxTop() ? (controls.list.scrollTop / controls.maxTop()) * controls.logicalMax : 0;
        const scroll = Math.round(i * 1000) / 1000;
        if (scroll !== S.ctx.model.scroll) S.ctx.update({ ...S.ctx.model, scroll });
      },
      toPhysical: () => (ctx, controls, index) =>
        controls.maxTop() && controls.logicalMax
          ? (index * controls.maxTop()) / controls.logicalMax / controls.physicalRow()
          : 0,
      wheel: (base, S) => (ctx, controls) => {
        controls.list.addEventListener(
          'wheel',
          (event) => {
            event.preventDefault();
            const k = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? controls.list.clientHeight : 1;
            controls.list.scrollTop += event.deltaY * k;
            controls.lbx.refresh();
            controls.mirror(controls.lbx.scrollIndex());
          },
          { passive: false },
        );
      },
      measured: (base) => (ctx, controls) => {
        const px = controls.logicalMax && controls.maxTop()
          ? controls.maxTop() / controls.logicalMax
          : controls.physicalRow();
        if (px > 0 && px !== ctx.model.px) ctx.update({ ...ctx.model, px });
      },
    },
  },
});
