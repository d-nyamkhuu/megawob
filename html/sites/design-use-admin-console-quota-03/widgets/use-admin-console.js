// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-quota-03',
  name: 'design',
  split: 'train',
  scenarios: ['quota'],
  template: 'use-admin-console/console',
  design: {
    inset: 0,
    fontSize: 18,
    fontFamily: 'Tahoma, Arial, sans-serif',
    sidebarWidth: 0,
    narrowSidebarWidth: 0,
    parts: {
      fit: (base) => (ctx) => ({ ...base(ctx), withContext: false }),
      topbar: () => () => {},
      sidebar: () => () => {},
      heading: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      facts: (base, S) => (m) => {
        if (m.depth === S.spec.path.length) base(m);
      },
      folder: (base, S) => (box, name, index, m) => {
        base(box, name, index, m);
        const button = box.lastElementChild;
        const icon = button.firstElementChild;
        if (window.quotaLunaIcon) {
          const art = window.quotaLunaIcon(button, ['compute', 'storage', 'network', 'settings'][index]);
          icon.replaceWith(art);
        }
      },
      quota: (base, S) => (m) => {
        const { spec, ctx, P, main, workspace } = S;
        const el = ctx.util.el;
        const path = el('div', 'xp-current-path');
        path.textContent = (m.depth ? spec.path.slice(0, m.depth) : ['Subscriptions']).join('  /  ');
        main.insertBefore(path, main.firstChild);
        if (m.depth === spec.path.length) {
          base(m);
          return;
        }
        main.classList.add('xp-choice-pane');
        const box = el('div', 'xp-service-choices', main);
        const folders = [spec.path[m.depth], ...['Activity log', 'Billing profiles', 'Policy assignments'].filter(x => x !== spec.path[m.depth])];
        folders.forEach((name, i) => P.folder(box, name, i, m));
        const bar = P.actions();
        bar.classList.add('xp-navigation');
        if (m.depth) P.button(bar, 'Parent settings', { nav: 'up' }, { nav: 'up' }, '', 'back');
        else {
          const back = P.button(bar, 'Back', null, null, '', 'back');
          back.disabled = true;
        }
        P.button(bar, 'Next', null, { depth: m.depth + 1 }, 'xp-next', 'chevron');
      },
    },
  },
});
