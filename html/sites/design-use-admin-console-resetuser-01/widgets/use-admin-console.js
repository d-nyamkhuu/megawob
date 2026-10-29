// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-resetuser-01',
  name: 'design',
  split: 'train',
  scenarios: ['resetuser'],
  template: 'use-admin-console/console',
  design: {
    // A focused floating utility window: no service sidebar, no context rail, no toolbar, one tab.
    sidebarWidth: 0, narrowSidebarWidth: 0, contextAt: 100000,
    parts: {
      sidebar: () => () => {},
      toolbar: () => () => {},
      heading: (base, S) => () => {
        const el = S.ctx.util.el;
        const head = el('header', 'aa-header', S.workspace);
        const row = el('div', 'aa-heading-row aqua-task-heading', head);
        el('span', 'aqua-task-glyph', row, '▣');
        el('h2', '', row, 'Account Actions');
        el('div', 'aa-sub', head, 'Operations pilot / northstar.example / Member accounts');
      },
      tabs: (base, S) => () => {
        const tabs = S.ctx.util.el('div', 'aa-tabs', S.workspace);
        S.P.button(tabs, 'Accounts', null, null, 'aa-tab on').setAttribute('aria-current', 'page');
      },
    },
  },
});
