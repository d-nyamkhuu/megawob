// Design on templates/click-control/base.js: the base site's click-control widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-control',
  site: 'design-click-control-open-04',
  name: 'design',
  split: 'train',
  scenarios: ['open'],
  template: 'click-control/base',
  design: {
    parts: {
      'fileView': (base, S) => function fileView(ctx, parent, items, layout, avail) {
        const { fileIcon } = S;
        const { util } = ctx;
        const els = {};
        let host;
        if (layout === 'list') {
          host = util.el('div', 'uc-card', parent);
          host.style.padding = '6px';
          host.style.width = Math.min(560, avail.w) + 'px';
          host.style.boxSizing = 'border-box';
          const rh = Math.max(24, Math.min(34, Math.floor((avail.h - 20) / items.length)));
          for (const it of items) {
            const row = util.el('div', 'uc-frow', host);
            row.style.height = rh + 'px';
            row.innerHTML = fileIcon(it.kind);
            util.el('span', 'nm', row, it.name);
            util.el('span', 'sz', row, it.size);
            row.dataset.role = 'file';
            els[it.key] = row;
          }
        } else {
          host = util.el('div', 'uc-files', parent);
          const tw = 104;
          const cols = Math.max(3, Math.min(7, Math.floor((Math.min(avail.w, 760) + 8) / (tw + 8))));
          host.style.gridTemplateColumns = `repeat(${cols}, ${tw}px)`;
          for (const it of items) {
            const t = util.el('div', 'uc-ftile', host);
            t.innerHTML = fileIcon(it.kind);
            util.el('span', 'nm', t, it.name);
            util.el('span', 'type', t, String(it.kind || '').toUpperCase());
            util.el('span', 'sz', t, it.size || '');
            t.dataset.role = 'file';
            t.title = it.name;
            els[it.key] = t;
          }
        }
        // Bound scrolling to the stage's remaining space below the toolbar.
        const content = parent.parentElement.getBoundingClientRect();
        const top = host.getBoundingClientRect().top - content.top;
        const paneHeight = Math.max(0, Math.min(ctx.size.height, content.height) - top);
        host.style.maxHeight = paneHeight + 'px';
        if (layout !== 'list' && items.length) {
          const header = getComputedStyle(host, '::before');
          const headerHeight = parseFloat(header.height) +
            (header.boxSizing === 'border-box' ? 0 :
              parseFloat(header.paddingTop) + parseFloat(header.paddingBottom) +
              parseFloat(header.borderTopWidth) + parseFloat(header.borderBottomWidth));
          const preferred = parseFloat(getComputedStyle(els[items[0].key])
            .getPropertyValue('--lightning-row-height')) || 44;
          const rowHeight = Math.max(24, Math.min(preferred,
            Math.floor((paneHeight - headerHeight - 2) / items.length)));
          for (const it of items) els[it.key].style.height = rowHeight + 'px';
        }
        return { els, host };
      },
    },
  },
});
