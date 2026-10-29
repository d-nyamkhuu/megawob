// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-dblrename-04',
  name: 'design',
  split: 'train',
  scenarios: ['dblrename'],
  template: 'use-file-manager/explorer',
  design: {
    fontSize: 15,
    nameFontSize: 16,
    detailFontSize: 14,
    windowRadius: 6,
    titleHeight: 0,
    toolbarHeight: 50,
    statusHeight: 48,
    margin: 0,
    parts: {
      // This design presents the default content as a civic records details table.
      // Keep the shared builder and all row callbacks; only select its list rendering path.
      buildMain: (base, S) => (model) => {
        const view = S.spec.view;
        S.spec.view = 'list';
        try { return base(model); }
        finally { S.spec.view = view; }
      },
      body: (base, S) => (ctx) => {
        base(ctx);
        const util = ctx.util;
        const inspector = util.el('aside', 'fm-inspector', S.els.bodyEl);
        util.el('div', 'fm-inspector-heading', inspector, '');
        util.el('div', 'fm-inspector-kind', inspector, 'File folder');
        util.el('div', 'fm-inspector-rule', inspector);
        const line = (label) => {
          const row = util.el('div', 'fm-inspector-line', inspector);
          util.el('span', '', row, `${label}:`);
          return util.el('strong', '', row, '');
        };
        inspector._name = inspector.querySelector('.fm-inspector-heading');
        inspector._location = line('Location');
        inspector._items = line('Items');
        inspector._size = line('Size');
        const folder = env.taskDef.helpers.itemOf(S.spec, ctx.model.cwd);
        inspector._name.textContent = folder.name;
        inspector._location.textContent = env.taskDef.helpers.itemOf(S.spec,
          env.taskDef.helpers.parentOf(ctx.model, S.spec, ctx.model.cwd) || ctx.model.cwd).name;
        inspector._items.textContent = `${env.taskDef.helpers.childrenOf(ctx.model, S.spec, ctx.model.cwd).length} items`;
        inspector._size.textContent = '—';
        S.els.inspector = inspector;
      },
      draw: (base, S) => (model, ...args) => {
        const result = base(model, ...args);
        const panel = S.els.inspector;
        if (panel) {
          const folder = env.taskDef.helpers.itemOf(S.spec, model.cwd);
          panel._name.textContent = folder.name;
          panel._location.textContent = env.taskDef.helpers.itemOf(S.spec, env.taskDef.helpers.parentOf(model, S.spec, model.cwd) || model.cwd).name;
          const children = env.taskDef.helpers.childrenOf(model, S.spec, model.cwd);
          panel._items.textContent = `${children.length} items`;
          panel._size.textContent = '—';
        }
        return result;
      },
    },
  },
});
