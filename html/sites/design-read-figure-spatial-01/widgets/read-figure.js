// Design on templates/read-figure/base.js: the base site's read-figure widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-spatial-01',
  name: 'design',
  split: 'train',
  scenarios: ['spatial'],
  template: 'read-figure/base',
  design: {
    parts: {
      'panel.traits': (base, S) => ({ glyphs: ['line', 'line', 'symbol', 'emoji'], contrast: ['normal'] }),
      resultBar: (base) => (ctx, panel, up) => {
        const body = panel.lastElementChild;
        const result = base(ctx, panel, up);
        // The full-size board needs a separate row for the template's recovery control.
        body.style.bottom = '44px';
        Object.assign(panel.lastElementChild.style, {
          position: 'absolute', left: '0', right: '0', bottom: '0',
          height: '44px', boxSizing: 'border-box',
        });
        return result;
      },
    },
  },
});
