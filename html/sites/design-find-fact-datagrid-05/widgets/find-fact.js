// Design on templates/find-fact/base.js: the base site's find-fact widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-datagrid-05',
  name: 'design',
  split: 'train',
  scenarios: ['datagrid'],
  template: 'find-fact/base',
  design: {
    parts: {
      buildDatagrid: (base) => (ctx, work, up, room) => {
        work.dataset.gridMode = ctx.spec.mode;
        work.style.setProperty('--ds-rows', ctx.spec.perPage || 8);
        const grid = base(ctx, work, up, room);
        const body = work.querySelector('.rl-grid > .rl-card-b');
        const foot = body.querySelector('.rl-gfoot');
        const answer = foot.querySelector('.rl-ans');
        answer.querySelector('label').textContent = 'Answer:';
        answer.querySelector('input').placeholder = '';
        body.insertBefore(answer, body.firstChild);
        let tools = body.querySelector('.rl-tools');
        if (!tools) tools = ctx.util.el('div', 'rl-tools', body);
        body.insertBefore(tools, answer.nextSibling);
        const search = tools.querySelector('.rl-search');
        if (search) {
          search.querySelector('input').placeholder = '';
          const label = ctx.util.el('label', 'ds-filter-label', tools, 'Filter:');
          label.htmlFor = 'ds-filter';
          search.querySelector('input').id = 'ds-filter';
          tools.insertBefore(label, search);
        }
        tools.querySelectorAll(':scope > .rl-count').forEach((el) => el.remove());
        const count = foot.querySelector('.rl-count');
        tools.appendChild(count);
        const pager = foot.querySelector('.rl-pager');
        if (pager) tools.appendChild(pager);
        foot.remove();
        if (!body.querySelector('.rl-hbar')) {
          const bar = ctx.util.el('div', 'ds-scroll-idle', body);
          bar.setAttribute('aria-hidden', 'true');
          ctx.util.el('span', '', bar, '◀');
          ctx.util.el('i', '', bar);
          ctx.util.el('span', '', bar, '▶');
        }
        return grid;
      },
    },
  },
});
