// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-idcard-05',
  name: 'design',
  split: 'train',
  scenarios: ['idcard'],
  template: 'fill-form/base',
  design: {
    parts: {
      workspace: (base) => (ctx, scan) => {
        const shell = base(ctx, scan);
        shell.root.classList.add('identity-workspace');
        const tabs = ctx.util.el('div', 'identity-tabs', shell.root);
        shell.root.insertBefore(tabs, shell.root.firstChild);
        [['Identity Document', 'document'], ['Web Form', 'form']].forEach(([label, name]) => {
          const button = ctx.util.el('button', 'identity-tab', tabs);
          button.type = 'button';
          button.innerHTML = '<svg viewBox="0 0 24 26" aria-hidden="true"><path d="M5 2h10l5 5v17H5zM15 2v6h5M8 12h9M8 16h9M8 20h9"/></svg>';
          ctx.util.el('span', '', button, label);
          button.addEventListener('click', () => {
            const selected = shell.root.dataset.page === name;
            shell.root.dataset.page = selected ? '' : name;
            for (const tab of tabs.children) tab.classList.toggle('active', tab === button && !selected);
            for (const pane of shell.root.querySelectorAll('.ff-scan-scroll, .ff-scan-fields')) pane.dispatchEvent(new Event('scroll'));
          });
        });
        return shell;
      },
      scanBitmap: (base) => (ctx, parent) => {
        const bitmap = base(ctx, parent);
        const available = parent.parentElement.clientWidth - 28;
        const scale = Math.min(1, Math.max(160, available) / (bitmap.W * .72));
        return {
          ...bitmap,
          W: bitmap.W * scale,
          H: bitmap.H * scale,
          pos: Object.fromEntries(Object.entries(bitmap.pos).map(([id, y]) => [id, y * scale])),
        };
      },
      addField: (base) => (util, grid, field, value, withErr) => {
        const wrap = base(util, grid, field, value, withErr);
        if (field.kind === 'date') {
          const icon = util.el('span', 'identity-calendar', wrap.querySelector('.ff-inwrap'));
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = '<svg viewBox="0 0 24 26"><path d="M3 5h18v19H3zM3 10h18M7 2v6M17 2v6M7 14h2M11 14h2M15 14h2M7 18h2M11 18h2M15 18h2"/></svg>';
        }
        return wrap;
      },
      renderScan: (base) => (ctx) => {
        const result = base(ctx);
        const root = ctx.stage.querySelector('.identity-workspace');
        const heading = root.querySelector('.ff-scan-entry-head h2');
        if (heading) heading.textContent = 'Personal Details';
        return result;
      },
    },
  },
});
