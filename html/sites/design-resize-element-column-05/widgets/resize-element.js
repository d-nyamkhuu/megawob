// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-column-05',
  name: 'design',
  split: 'train',
  scenarios: ['column'],
  template: 'resize-element/base',
  design: {},
});

// Add the directory's read-only width ruler after the shared widget renders.
// All model updates, anchors, drag events, clear and locate stay with that widget.
function employeeColumnRenderer(sharedRender) {
return function (ctx) {
  const result = sharedRender.call(this, ctx);
  const u = ctx.util;
  const decorate = () => {
    const table = ctx.stage.querySelector('.rzc-table');
    if (!table) return;
    let ruler = ctx.stage.querySelector('.community-ruler');
    if (!ruler) ruler = u.el('div', 'community-ruler', ctx.stage);
    ruler.setAttribute('aria-hidden', 'true');
    const headers = [...table.querySelectorAll('th')];
    const bar = ctx.stage.querySelector('.rzc-bar');
    const labels = (bar ? bar.textContent.replace(/^Column widths:\s*/, '').split(/\s*[·•]\s*/) : [])
      .map((value) => value.match(/^(.*?)\s+(\d+)\s*px\s*$/));
    ruler.replaceChildren();
    ruler.style.width = table.getBoundingClientRect().width + 'px';
    for (const [i, th] of headers.entries()) {
      const item = u.el('div', 'column-measure', ruler);
      item.style.width = th.getBoundingClientRect().width + 'px';
      u.el('span', 'column-name', item, labels[i] ? labels[i][1] : th.textContent);
      u.el('span', 'column-value', item, (labels[i] ? labels[i][2] : Math.round(th.getBoundingClientRect().width)) + ' px');
    }
  };
  if (result && typeof result.sync === 'function') {
    const sharedSync = result.sync;
    result.sync = function (...args) {
      const value = sharedSync.apply(this, args);
      decorate();
      return value;
    };
  }
  decorate();
  return result;
};
}
