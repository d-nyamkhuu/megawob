// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-privacy-03',
  name: 'design',
  split: 'train',
  scenarios: ['privacy'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '13.5px/1.38 Georgia, "Times New Roman", serif',
    windowRadius: '0px',
    windowShadow: 'none',
    colors: {
      '--bg': '#f5f5f3', '--panel': '#f3f2fc', '--fg': '#10101a',
      '--muted': '#4b4b60', '--line': '#d0ceeb', '--b': '#aaa7da',
      '--bs': '#d0ceeb', '--bfg': '#10101a',
    },
    parts: {
      fits: (base, S) => () => {
        // A flexed story list can clip its rows while its parent still reports that it fits.
        return base() && [...S.page.querySelectorAll('.sd-list')].every((list) =>
          list.closest('.sd-under') ||
          (list.scrollHeight <= list.clientHeight + 1 && list.scrollWidth <= list.clientWidth + 1));
      },
      frame: (base, S) => (ctx) => {
        const win = base(ctx);
        // The sheet fills its stage, including stages shorter than the browser's default minimum.
        Object.assign(win.style, {
          left: '0px', top: '0px', width: `${ctx.size.width}px`, height: `${ctx.size.height}px`,
        });
        return win;
      },
      tabs: (base, S) => (ctx) => {
        // Keep the template's seeded decoration draws; the IRIX window supplies the title bar.
        base(ctx);
        S.tabTitle.closest('.sd-tabs').remove();
      },
      addressBar: (base, S) => (ctx) => {
        // A visible page-status strip is the stable anchor, independent of content compaction.
        S.bar = ctx.util.el('div', 'irix-page-status', S.win);
        Object.assign(S.bar.style, {
          flex: 'none', height: '22px', display: 'flex', alignItems: 'center',
          gap: '4px', padding: '0 8px', overflow: 'hidden', whiteSpace: 'nowrap',
          borderBottom: '1px solid #d0ceeb', font: '11px Arial, sans-serif', color: '#4b4b60',
        });
        S.hostEl = ctx.util.el('span', '', S.bar);
        S.pathEl = ctx.util.el('span', '', S.bar);
      },
      dialog: (base, S) => (parent, list, m, cls) => {
        const dlg = base(parent, list, m, cls);
        // Keep the original split consent sheet, but size it inside the template's page.
        if (!list.some((b) => b.t === 'check')) {
          dlg.classList.add('irix-consent');
          Object.assign(dlg.style, {
            width: '100%', height: '100%', maxHeight: '100%', padding: '18px',
            display: 'grid', gridTemplateColumns: 'minmax(0,58fr) minmax(0,42fr)',
            gridTemplateRows: 'auto 1fr', columnGap: '18px', borderRadius: '8px',
            textAlign: 'left', boxShadow: 'none', border: '1px solid #d0ceeb',
          });
          for (const child of dlg.children) {
            if (child.classList.contains('sd-btns')) {
              Object.assign(child.style, {
                gridColumn: '2', gridRow: '1 / span 2', alignSelf: 'stretch',
                flexDirection: 'column', justifyContent: 'flex-start', gap: '13px',
                padding: '7px 0 0 22px', borderLeft: '1px solid #c9c7e2',
              });
            } else {
              child.style.gridColumn = '1';
              child.style.alignSelf = child.classList.contains('sd-h') ? 'end' : 'start';
            }
          }
        }
        return dlg;
      },
    },
  },
});
