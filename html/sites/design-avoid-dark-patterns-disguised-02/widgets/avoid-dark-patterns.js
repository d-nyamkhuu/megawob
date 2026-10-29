// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-disguised-02',
  name: 'design',
  split: 'train',
  scenarios: ['disguised'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '13.5px/1.38 Georgia, "Times New Roman", serif',
    windowRadius: '4px',
    windowShadow: 'none',
    colors: {
      '--bg': '#fcfbf9', '--panel': '#fcfbf9', '--fg': '#080808',
      '--muted': '#474747', '--line': '#ccc', '--b': '#474747',
      '--bs': '#e8e7e5', '--bfg': '#fff', '--ad': '#474747',
    },
    parts: {
      // Fitting can restore the tab strip when the next screen needs less room.
      // That legitimately moves the address-bar anchor after a task action.
      paint: (base, S) => {
        let paintedWindow = null;
        return (model) => {
          const initial = paintedWindow !== S.win;
          base(model);
          paintedWindow = S.win;
          if (!initial) S.ctx.reanchor();
        };
      },
    },
  },
});
