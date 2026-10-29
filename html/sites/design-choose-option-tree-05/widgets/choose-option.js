// Preserve the shared tree controls while fitting their editorial spacing to the pane.
let fieldnoteContext;
function fitFieldnoteTree() {
  const ctx = fieldnoteContext;
  if (!ctx) return;
  const card = ctx.stage.querySelector('.fp-card');
  if (!card) return;
  const groups = card.querySelectorAll('.fp-tg').length;
  const kids = card.querySelectorAll('.fp-tkid').length;
  if (!kids) return;
  const pane = ctx.stage.closest('.ref-stage');
  const paneStyle = pane && getComputedStyle(pane);
  const rootStyle = getComputedStyle(ctx.stage);
  const rootTop = parseFloat(rootStyle.paddingTop);
  const rootBottom = parseFloat(rootStyle.paddingBottom);
  const bottom = pane ? pane.getBoundingClientRect().bottom - parseFloat(paneStyle.paddingBottom) : ctx.stage.getBoundingClientRect().bottom;
  const available = Math.min(ctx.stage.clientHeight - rootTop - rootBottom, bottom - ctx.stage.getBoundingClientRect().top - rootTop) - 8;
  const scale = Math.min(1, Math.max(.3, (available - 28 * Math.max(0, groups - 1)) / (40 * kids + 98 * groups)));
  card.style.setProperty('--form-scale', scale);
  card.querySelectorAll('.fp-link').forEach(link => { if (link.textContent === 'All') link.textContent = 'Select all'; });
  ctx.stage.scrollTop = 0;
}
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-tree-05',
  name: 'design',
  split: 'train',
  scenarios: ['tree'],
  template: 'choose-option/base',
  design: {
    parts: {
      renderCard: (base) => function(...args) {
        const ctx = args.find(arg => arg && arg.stage && arg.util);
        if (ctx) {
          fieldnoteContext = ctx;
          ctx.stage.classList.add('fieldnote-task-root');
        }
        const result = base.apply(this, args);
        fitFieldnoteTree();
        return result;
      },
      buildTree: (base) => function(...args) {
        const result = base.apply(this, args);
        fitFieldnoteTree();
        return result;
      },
    },
  },
});
