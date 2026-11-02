// This design adds the project section heading and uses a narrow outlined accordion chevron.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-03',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    modTitle: null,
    chevron: '<svg viewBox="0 0 16 21" aria-hidden="true"><path d="M3 2L13 10.5L3 19"/></svg>',
    parts: {
      colTitle: () => (ctx, b) => {
        const { util, spec } = ctx;
        const mt = util.el('div', 'module-title', b);
        util.el('h2', '', mt, 'Project Sections');
        util.el('span', 'mt-count', mt, spec.sections.length + ' sections');
        util.el('p', 'mt-sub', mt, 'Review the sections below. Click a section to expand and view its contents.');
      },
    },
  },
});
