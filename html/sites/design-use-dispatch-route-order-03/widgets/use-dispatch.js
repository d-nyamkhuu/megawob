// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-route-order-03',
  name: 'design',
  split: 'train',
  scenarios: ['route-order'],
  template: 'use-dispatch/workspace',
  design: {
    parts: {
      // Console window: no Activity/Documents tab strip, exception dock or plan-fact footer; the
      // route figures and vehicle details live in the site frame.
      // The brand toolbar is replaced by the route figures (static: stops, total load, spare capacity).
      toolbar: (base, S) => () => {
        base();
        const bar = S.app.querySelector(':scope > .ad-toolbar');
        const items = S.spec.items;
        const load = items.reduce((sum, item) => sum + item.weight, 0);
        const figures = document.createElement('div');
        figures.className = 'carbon-route-figures';
        figures.style.cssText = 'display:flex;width:50%;height:100%;align-items:center';
        for (const [label, key, value] of [['Stops', 'distance', String(items.length)], ['Total Load', 'load', `${load} kg`],
          ['Remaining Capacity', 'remaining', `${S.spec.routeCapacity - load} kg`]]) {
          const box = document.createElement('div');
          box.className = `carbon-route-figure carbon-route-${key}`;
          box.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 12px;white-space:nowrap;overflow:hidden';
          const name = document.createElement('span');
          name.className = 'carbon-route-label';
          name.textContent = label;
          const number = document.createElement('strong');
          number.className = 'carbon-route-value';
          number.textContent = value;
          box.append(name, number);
          figures.append(box);
        }
        bar.replaceChildren(figures);
      },
      navigation: () => () => {},
      footer: () => () => {},
      facts: () => () => {},
      activity: (base, S) => () => {
        // paint() still writes the exception summary; give it a detached node.
        S.refs.dock = null;
        S.refs.issue = document.createElement('span');
      },
      routeList: (base) => (body) => {
        base(body);
        body.querySelector('.ad-route-box > .ad-route-head').remove();
      },
      matrix: (base) => (body) => {
        base(body);
        body.querySelector('.ad-matrix-box > .ad-route-head').remove();
      },
    },
  },
});
