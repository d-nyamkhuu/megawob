// Design on templates/set-date/base.js: the base site's set-date widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-date',
  site: 'design-set-date-month-03',
  name: 'design',
  split: 'train',
  scenarios: ['month'],
  template: 'set-date/base',
  design: { parts: {
    renderCard: (base) => function renderCard(ctx, look) {
      const result = base(ctx, look);
      const card = ctx.stage.querySelector('.fd-card');
      const row = card.querySelector('.fd-row:has(.fd-control)');
      const control = row.querySelector('.fd-control');
      const pop = card.querySelector('.fd-pop');
      for (const child of [...card.children]) if (child !== row && child !== pop) child.remove();
      for (const child of [...row.children]) if (child !== control) child.remove();
      const live = document.querySelector('.ds-live');
      const stageBox = ctx.stage.getBoundingClientRect();
      const liveBox = live.getBoundingClientRect();
      const left = liveBox.left - stageBox.left;
      const top = liveBox.top - stageBox.top;
      Object.assign(card.style, {
        left: `${left}px`, top: `${top}px`, width: `${liveBox.width}px`,
        height: `${Math.min(ctx.size.height - top, 46 + pop.offsetHeight + 2)}px`,
        padding: '0', border: '0', borderRadius: '0', boxShadow: 'none',
        background: 'transparent', pointerEvents: 'auto',
      });
      card.style.setProperty('left', `${left}px`, 'important');
      card.style.setProperty('top', `${top}px`, 'important');
      card.style.setProperty('padding', '0', 'important');
      row.style.setProperty('margin', '0', 'important');
      row.style.display = 'block';
      row.style.width = '100%';
      Object.assign(control.style, {
        width: '100%', height: `${liveBox.height}px`, padding: '0 44px 0 14px',
        font: liveBox.height < 40 ? '13px Arial,Helvetica,sans-serif' : '19px Arial,Helvetica,sans-serif',
        border: '1px solid #b7c9dc', borderRadius: '5px',
        background: 'linear-gradient(#fff,#fdfefe)',
        boxShadow: 'inset 0 1px 2px #edf2f7',
      });
      control.style.setProperty('font', liveBox.height < 40 ? '13px Arial,Helvetica,sans-serif' : '19px Arial,Helvetica,sans-serif', 'important');
      control.style.setProperty('height', `${liveBox.height}px`, 'important');
      Object.assign(pop.style, {
        left: '0px', top: `${liveBox.height + 2}px`, maxWidth: `${Math.max(liveBox.width, pop.offsetWidth)}px`,
      });
      return result;
    },
  } },
});
