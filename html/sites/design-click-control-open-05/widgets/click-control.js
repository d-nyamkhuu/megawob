// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-open-05',
  name: 'design',
  split: 'train',
  scenarios: ['open'],
  template: 'click-control/base',
  design: {
    parts: {
      // Keep the file pane below the toolbar, including when the template chooses
      // a list rather than a grid. Calling the base preserves its seeded draws.
      box: (base) => function (ctx, content, opts) {
        const box = base(ctx, content, opts);
        Object.assign(box.style, {
          position: 'absolute', left: '12px', right: '12px',
          top: ctx.size.width < 650 ? '61px' : '80px', bottom: '8px',
          minHeight: '0',
        });
        return box;
      },
      fileView: (base) => function (ctx, parent, items, layout, avail) {
        const rect = parent.getBoundingClientRect();
        const stage = ctx.stage.getBoundingClientRect();
        const window = ctx.stage.parentElement.getBoundingClientRect();
        const height = Math.max(24, Math.min(rect.bottom, stage.bottom - 8, window.bottom - 8) - rect.top - 42);
        const capacity = Math.max(1, Math.floor(height / 46));
        const columns = Math.max(1, Math.ceil(items.length / capacity));
        const rowHeight = ctx.size.height <= 680 ? 35 : 46;
        const heading = ctx.util.el('div', 'cal-file-head', parent);
        heading.innerHTML = '<span class="all-box"></span><span>Name</span><span>Date modified</span><span>Type</span><span>Size</span>';
        heading.style.height = '44px';
        const view = base(ctx, parent, items, columns === 1 ? layout : 'grid', { w: rect.width, h: height });
        Object.assign(view.host.style, {
          width: '100%', height: height + 'px', boxSizing: 'border-box',
          overflow: 'auto',
        });
        if (view.host.classList.contains('uc-files')) {
          view.host.style.gridTemplateColumns = 'minmax(0, 1fr)';
          view.host.style.gridAutoRows = rowHeight + 'px';
          let index = 0;
          for (const tile of Object.values(view.els)) {
            Object.assign(tile.style, {
              height: rowHeight + 'px', minHeight: '0',
              gridTemplateColumns: '36px minmax(0, 1fr)',
            });
            const name = (tile.querySelector('.nm')?.textContent || tile.textContent || '').trim();
            const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
            const kind = ({ jpg: 'JPG File', jpeg: 'JPG File', png: 'PNG File', gif: 'GIF File', pdf: 'PDF Document', mp4: 'MP4 File', ods: 'ODS File', odt: 'ODT File', heic: 'HEIC File', '7z': '7Z File' })[ext] || (ext ? ext.toUpperCase() + ' File' : 'File folder');
            const hash = Array.from(name).reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);
            const months = ['Jan', 'Feb', 'Mar', 'Apr'];
            const day = 2 + hash % 24;
            const date = `${months[hash % 4]} ${day}, 2020  ${1 + hash % 12}:${String(hash % 60).padStart(2, '0')} ${hash % 2 ? 'AM' : 'PM'}`;
            const size = ext ? `${(900 + hash % 3200).toLocaleString('en-US')} KB` : '';
            const metadata = ctx.util.el('span', 'file-date', tile, ext ? date : '');
            ctx.util.el('span', 'file-type', tile, kind);
            ctx.util.el('span', 'file-size', tile, size);
            const oldIcon = tile.querySelector('svg');
            if (oldIcon) {
              const drawing = ext === 'gif' || ext === 'mp4'
                ? '<rect x="3" y="2" width="22" height="25"/><path d="M8 2v25m12-25v25M3 7h5m-5 6h5m-5 6h5m12-12h5m-5 6h5m-5 6h5"/>'
                : ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'heic'
                  ? '<rect x="3" y="2" width="22" height="25"/><circle cx="17" cy="9" r="2"/><path d="m5 22 6-8 4 4 3-3 5 7"/>'
                  : ext ? '<path d="M5 2h13l7 7v18H5zM18 2v8h7M9 15h12m-12 4h12m-12 4h8"/>'
                    : '<path d="M2 7h9l3 3h12v16H2z"/>';
              oldIcon.outerHTML = '<svg viewBox="0 0 28 29" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">' + drawing + '</svg>';
            }
            index++;
          }
        }
        const toolbar = ctx.stage.querySelector('.uc-toolbar');
        if (toolbar && !toolbar.querySelector('.address-layout')) {
          const address = ctx.util.el('div', 'address-layout', toolbar);
          address.innerHTML = '<span class="address-arrows">← &nbsp; → &nbsp; ↑</span><span class="address-path"><svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 6h9l3 3h12v16H2z"/></svg><span>› &nbsp; This PC &nbsp; › &nbsp; Pictures &nbsp; ›</span><span class="path-chevron">⌄</span></span><span class="address-refresh">↻</span><span class="address-search">⌕ &nbsp; <span>Search Pictures</span></span>';
        }
        return view;
      },
      buildOpen: (base) => function (...args) {
        const result = base(...args);
        const toolbar = document.querySelector('.industrial .uc-toolbar');
        const bar = document.querySelector('.industrial .app-actions');
        if (toolbar && bar) {
          const slots = [...bar.querySelectorAll('.action-slot')];
          for (const button of [...toolbar.querySelectorAll('.uc-btn')]) {
            const label = button.textContent.trim().toLowerCase();
            const slot = label.includes('folder') ? slots[1] : (label === 'open' || label === 'view' || label.startsWith('open ')) ? slots[0] : bar.querySelector('.action-extras');
            if (slot) slot.appendChild(button);
          }
        }
        return result;
      },
    },
  },
});
