// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-tooltip-inspect-03',
  name: 'design',
  split: 'train',
  scenarios: ['tooltip-inspect'],
  template: 'click-control/base',
  design: {
    parts: {
      buildTooltip: (base) => (ctx, content, up, page) => {
        const view = base(ctx, content, up, page);
        if (ctx.spec.mode === 'icon') {
          const bar = content.querySelector('.uc-tools');
          const box = bar.parentElement;
          // Fill the pane before laying out its vertical toolbar. Absolute children
          // otherwise leave a zero-height box at the sampled vertical alignment.
          Object.assign(box.style, { flex: '1 1 auto', minHeight: '0', width: '100%' });
          Object.assign(bar.style, {
            position: 'absolute', left: '8px', top: '10px', bottom: '2px',
            display: 'flex', flexDirection: 'column', flexWrap: 'nowrap',
            gap: '7px', width: '55px', margin: '0', padding: '0',
          });
          for (const child of bar.children) {
            if (child.classList.contains('uc-tool')) {
              Object.assign(child.style, {
                width: '50px', height: '52px', flex: '0 1 52px', minHeight: '0',
              });
              const icon = child.querySelector('svg');
              if (icon) Object.assign(icon.style, { width: '30px', height: '30px', maxHeight: '100%' });
            } else {
              Object.assign(child.style, { width: '30px', height: '1px', flex: '0 0 1px', margin: '0' });
            }
          }
        }
        return view;
      },
    },
  },
});
