// Keep the reference task wiring and tabs; bound each pane to the available stage.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-fix-01',
  name: 'design',
  split: 'train',
  scenarios: ['fix'],
  template: 'fill-form/base',
  design: {
    parts: {
      renderWorkspace: (base) => (ctx, render) => base(ctx, (child) => {
        // The surrounding app already supplies the workspace frame's space.
        if (ctx.spec.layout.long) {
          child.size = { ...child.size, height: Math.min(ctx.size.height, child.stage.clientHeight) };
        }
        return render(child);
      }),
      buildFrame: (base) => {
        return (ctx, formBuilder) => {
          ctx.css('docufill-frame', `
            .ds-stage .ff-root { height:${Math.max(0, ctx.size.height - 24)}px; box-sizing:border-box; min-height:0; }
            .ds-stage .ff-root:not(.tabs) { flex-direction:row-reverse; align-items:stretch; }
            .ds-stage .ff-formpane, .ds-stage .ff-docpane { min-height:0; overflow:auto; box-sizing:border-box; max-height:100%; }
            .ds-stage .ff-root.tabs .ff-panels { flex:1; min-height:0; }
            .ds-stage .ff-tabs .ff-tab { font-weight:600; }
          `);
          const view = base(ctx, formBuilder);
          const [root, ...anchors] = view.anchors;
          const panes = ctx.spec.layout.tabs ? root.querySelectorAll('.ff-formpane') : anchors;
          let size = parseFloat(root.style.fontSize);
          // Grid panels can extend below the fixed-height root. Fit the form
          // even when its tab is hidden; source documents retain pane scrolling.
          const overflows = () => [...panes].some(pane => {
            const available = Math.min(pane.clientHeight,
              root.getBoundingClientRect().bottom - pane.getBoundingClientRect().top);
            return pane.scrollHeight > available + 1;
          });
          while (size > 9 && overflows()) {
            size = Math.max(9, size - 0.5);
            root.style.fontSize = `${size}px`;
          }
          if (ctx.spec.layout.tabs) {
            view.anchors[1].addEventListener('click', () => ctx.reanchor());
          }
          return view;
        };
      },
      showList: (base) => (dd, btn, list, open) => {
        base(dd, btn, list, open);
        if (!open || dd.closest('.ff-scan')) return;
        const r = btn.getBoundingClientRect();
        list.style.cssText = `position:fixed;left:${r.left}px;right:auto;width:${r.width}px;bottom:auto;z-index:100;max-height:${window.innerHeight - 12}px;overflow:auto`;
        const h = list.getBoundingClientRect().height;
        const top = r.bottom + 4 + h <= window.innerHeight - 6
          ? r.bottom + 4 : Math.max(6, r.top - h - 4);
        list.style.top = `${top}px`;
      },
    },
  },
});
