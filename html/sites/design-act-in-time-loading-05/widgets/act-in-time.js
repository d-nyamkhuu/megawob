// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-loading-05',
  name: 'design',
  split: 'train',
  scenarios: ['loading'],
  template: 'act-in-time/base',
  design: {
    parts: {
      frame: (base, S) => function (ctx) {
        const f = base(ctx);
        f.arena.classList.add('market-task-arena');
        f.arena.classList.add('market-task-full');
        for (const [name, value] of Object.entries({position:'absolute', left:'0px', top:'0px', width:'100%', height:'100%', 'max-width':'none', 'max-height':'none'}))
          f.arena.style.setProperty(name, value, 'important');
        return f;
      },
      buildLoading: (base, S) => function (ctx, f) {
        const view = base(ctx, f);
        const col = f.body.querySelector('.ut-col');
        const row = col && col.querySelector('.ut-searchrow');
        if (col && row) {
          col.classList.add('market-search-column');
          const title = ctx.util.el('h1', 'market-widget-title', col, 'Search');
          col.insertBefore(title, row);
          col.style.left = '0px';
          col.style.top = '0px';
          col.style.width = '100%';
          col.style.height = '100%';
          const empty = col.querySelector('.ut-empty');
          if (empty) {
            empty.textContent = '';
            const icon = ctx.util.el('div', 'market-widget-icon', empty);
            icon.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="45" cy="45" r="39.5" fill="none" stroke="#b4bac0" stroke-width="11"/><path d="M77 78l31 31" fill="none" stroke="#b4bac0" stroke-width="11" stroke-linecap="square"/></svg>';
            ctx.util.el('span', '', empty, 'Enter a search term and click Search to see results.');
          }
          const resultRows = [...col.querySelectorAll('.ut-row2')];
          const count = Math.max(1, ctx.spec.results.length);
          const compact = Math.max(31, Math.min(52, Math.floor((ctx.size.height - 340) / count)));
          if (ctx.size.height <= 700) resultRows.forEach((r) => { r.style.height = compact + 'px'; });
          const originalLocate = view.locate;
          view.locate = function (target) {
            if (target && target.result !== undefined) {
              const targetRow = col.querySelectorAll('[data-role="result"]')[target.result];
              if (targetRow) {
                targetRow.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                const rowBox = targetRow.getBoundingClientRect();
                const stageBottom = ctx.stage.getBoundingClientRect().bottom - 8;
                if (rowBox.bottom > stageBottom) {
                  const oldTop = parseFloat(f.arena.style.top) || 0;
                  f.arena.style.top = Math.round(oldTop - (rowBox.bottom - stageBottom)) + 'px';
                }
              }
            }
            return originalLocate(target);
          };
        }
        return view;
      },
    },
  },
});
