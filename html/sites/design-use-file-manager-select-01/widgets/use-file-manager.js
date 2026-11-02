// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-select-01',
  name: 'design',
  split: 'train',
  scenarios: ['select'],
  template: 'use-file-manager/explorer',
  design: {
    titleHeight: 0,
    toolbarHeight: 56,
    statusHeight: 48,
    windowRadius: 16,
    parts: (() => {
      let inspector;
      const syncInspector = (S) => {
        const { model, els, P } = S;
        if ((!inspector || inspector.parentElement !== els.win.parentElement) && els.win && els.win.parentElement) {
          inspector = document.createElement('aside');
          inspector.className = 'fm-inspector';
          els.win.parentElement.appendChild(inspector);
        }
        if (!inspector) return;
        inspector.replaceChildren();
        const picked = model.selected || [];
        const folder = model.cwd ? P.itemName(model, model.cwd) : 'Files';
        const heading = document.createElement('h2');
        heading.textContent = picked.length === 1 ? P.itemName(model, picked[0]) : picked.length ? `${picked.length} items selected` : folder;
        inspector.appendChild(heading);
        const summary = document.createElement('div');
        summary.className = 'fm-inspector-summary';
        summary.textContent = picked.length ? picked.map((id) => P.itemName(model, id)).join(' · ') : 'Current folder';
        inspector.appendChild(summary);
        const rule = document.createElement('div');
        rule.className = 'fm-inspector-rule';
        inspector.appendChild(rule);
        const section = document.createElement('h3');
        section.textContent = 'Details';
        inspector.appendChild(section);
        const line = document.createElement('div');
        line.className = 'fm-inspector-detail';
        line.textContent = picked.length ? `Selected · ${picked.length} item${picked.length === 1 ? '' : 's'}` : 'Kind     Folder';
        inspector.appendChild(line);
      };
      return {
        // Consume the template's seeded geometry draws before fitting the split view.
        fit: (base, S) => (ctx) => {
          base(ctx);
          S.geo = { left: 0, top: 0, winW: Math.round(ctx.size.width * 0.75), winH: ctx.size.height };
        },
        paneSize: (base, S) => (ctx) => {
          base(ctx);
          const treeW = Math.round(S.geo.winW * 0.27);
          S.geo = { treeW, paneW: S.geo.winW - treeW - 3 };
        },
        title: (base, S) => (ctx) => {
          base(ctx);
          S.els.title.style.display = 'none';
        },
        // Keep a genuine background gutter for rubber-band selection and fit every
        // row to the pane, rather than leaving oracle targets under the status bar.
        tileSize: (base, S) => (model, groups) => {
          base(model, groups);
          const count = Math.max(1, groups.reduce((n, g) => n + g.ids.length, 0));
          const headers = S.spec.grouped ? groups.length : 0;
          const available = S.geo.paneH - 8 - groups.length * 12;
          const headerH = Math.min(39, Math.max(20, Math.floor(available / (count + headers))));
          const tileH = Math.min(48, Math.floor((available - headers * headerH) / count));
          const iconPx = Math.max(8, Math.min(30, tileH - 4));
          S.els.pane.style.setProperty('--fm-header-height', `${headerH}px`);
          S.els.pane.style.setProperty('--fm-name-size', `${Math.min(16, Math.max(11, tileH - 4))}px`);
          S.sizes = { rowH: tileH };
          return { tileH, iconPx, lines: 1 };
        },
        css: (base) => (ctx) => base(ctx) + `
          .fm-bar { padding:0 18px; gap:9px; }
          .fm-crumbs { height:40px; }
          .fm-tree { padding:12px 8px; }
          .fm-tr { min-height:42px; }
          .fm-tr svg.fi { width:22px; height:22px; }
          .fm-pane { padding:0 0 4px; overflow:auto; }
          .fm-ghdr, .fm-pane.compact .fm-ghdr {
            height:var(--fm-header-height, 39px); margin:0; padding:0 18px;
          }
          .fm-tiles, .fm-pane.compact .fm-tiles { display:block; padding:6px; }
          .fm-tile, .fm-pane.compact .fm-tile {
            display:grid; grid-template-columns:40px minmax(0,1fr);
            align-items:center; justify-items:start; gap:0; padding:0 12px;
          }
          .fm-tile .ic { width:32px; justify-content:flex-start; }
          .fm-tile .nm, .fm-pane.compact .fm-tile .nm {
            text-align:left; font-size:var(--fm-name-size, 16px); line-height:1.2;
            display:block; white-space:nowrap; text-overflow:ellipsis;
          }
          .fm-status { padding:0 18px; }
          .fm-row { padding:0 18px; }
        `,
        rendered: (base, S) => (ctx) => { base(ctx); syncInspector(S); },
        drawStatus: (base, S) => (model) => { base(model); syncInspector(S); },
      };
    })(),
  },
});
