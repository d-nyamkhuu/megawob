// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-range-03',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      title: (base, S) => (ctx) => {
        base(ctx);
        S.els.title.classList.add('lisa-caption');
      },
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const { bar, backBtn, upBtn, crumbs } = S.els;
        bar.classList.add('lisa-toolbar');
        backBtn.classList.add('lisa-back');
        upBtn.classList.add('lisa-up');
        crumbs.classList.add('lisa-breadcrumb');
        ctx.util.el('span', 'lisa-forward', bar, '➜');
        const views = ctx.util.el('div', 'lisa-views', bar);
        for (const symbol of ['☰', '⊞', '▣']) ctx.util.el('span', '', views, symbol);
      },
      treeRow: (base, S) => (model, folder, depth, children, over) => {
        const result = base(model, folder, depth, children, over);
        const { row } = result;
        row.classList.add('lisa-tree-line');
        const indent = parseFloat(row.style.paddingLeft) * 1.4;
        row.style.paddingLeft = `${indent}px`;
        row.style.setProperty('--lisa-branch-left', `${Math.max(8, indent - 10)}px`);
        if (!depth) {
          row.classList.add('lisa-tree-root');
          row.lastElementChild.previousElementSibling.classList.add('lisa-drive-icon');
        }
        return result;
      },
      // The design presents every item as a details row, including icon-view episodes.
      // Fit that actual row count into the pane before creating any oracle targets.
      tileSize: (base, S) => (model, groups) => {
        base(model, groups);
        const { pane, main } = S.els;
        pane.classList.remove('compact');
        const style = getComputedStyle(pane);
        const count = Math.max(1, groups.reduce((n, group) => n + group.ids.length, 0));
        const headings = S.spec.grouped ? groups.length * 26 : 0;
        const groupPadding = groups.length * (S.spec.view === 'list' ? 8 : 12);
        const available = pane.clientHeight - parseFloat(style.paddingTop)
          - parseFloat(style.paddingBottom) - headings - groupPadding - 4;
        const maximum = parseFloat(getComputedStyle(main).fontSize) <= 18 ? 42 : 48;
        const tileH = Math.min(maximum, Math.floor(available / count));
        S.sizes = { rowH: tileH };
        return { tileH, iconPx: Math.max(14, Math.min(36, tileH - 6)), lines: 1 };
      },
      group: (base) => (model, group) => {
        const box = base(model, group);
        box.classList.add('lisa-files-layout');
        return box;
      },
      row: (_base, S) => (model, id, box) => {
        const height = S.sizes.rowH;
        return S.P.tile(model, id, height, Math.max(14, Math.min(36, height - 6)), 1, box);
      },
      listHead: () => () => {},
      buildMain: (base, S) => (model) => {
        const { main, pane } = S.els;
        pane.classList.add('lisa-files-layout');
        main.classList.add('lisa-details-ready');
        base(model);
        if (!main.querySelector(':scope > .lisa-details-head')) {
          const head = S.ctx.util.el('div', 'lisa-details-head', main);
          for (const text of ['Name  ▴', 'Size', 'Kind', 'Date Modified']) {
            S.ctx.util.el('span', '', head, text);
          }
        }
      },
      item: (base, S) => (ctx, row, id) => {
        base(ctx, row, id);
        const filename = S.P.itemName(ctx.model, id);
        const ext = (filename.match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
        row.classList.add('lisa-file-row');
        row.style.flexShrink = '0';
        row.dataset.lisaExt = ext || 'folder';
        row._icon.classList.add('lisa-file-icon');
        const kinds = { txt:'Plain Text Document', doc:'Word Processing Document', docx:'Word Processing Document',
          rtf:'Word Processing Document', xls:'Spreadsheet Document', xlsx:'Spreadsheet Document', ods:'Spreadsheet Document',
          csv:'Spreadsheet Document', jpg:'JPEG Image', jpeg:'JPEG Image', png:'PNG Image', gif:'GIF Image',
          pdf:'PDF Document', key:'Presentation', ppt:'Presentation', pptx:'Presentation', mov:'Movie', mp4:'Movie',
          zip:'ZIP Archive', ics:'Calendar Document' };
        ctx.util.el('span', 'lisa-meta lisa-size', row, '—');
        ctx.util.el('span', 'lisa-meta lisa-kind', row, kinds[ext] || (ext ? `${ext.toUpperCase()} Document` : 'Folder'));
        ctx.util.el('span', 'lisa-meta lisa-modified', row, '—');
      },
      draw: (base, S) => {
        let previous;
        let window;
        return (model, light) => {
          const layout = JSON.stringify([S.P.keyOf(model), model.expanded]);
          base(model, light);
          if (layout !== previous) {
            const rendered = window === S.els.win;
            previous = layout;
            if (rendered) S.ctx.reanchor?.();
          }
          window = S.els.win;
        };
      },
    },
  },
});
