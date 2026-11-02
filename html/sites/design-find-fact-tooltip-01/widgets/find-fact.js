// Keep the source pane scrollable when the Motif sub-window is short.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-tooltip-01',
  name: 'design',
  split: 'train',
  scenarios: ['tooltip'],
  template: 'find-fact/base',
  design: {
    parts: {
      buildTooltip: (base) => (ctx, work, up, room) => {
        const view = base(ctx, work, up, room);
        const source = work.firstElementChild;
        source.style.flex = '0 1 auto';
        source.style.minHeight = '0';
        source.style.overflow = 'auto';
        // The template locates every hover target directly. Keep all rows in
        // view, reserving the answer form's full height before sizing them.
        if (ctx.spec.mode === 'icon') {
          const rows = source.querySelectorAll('tr');
          const count = rows.length - 1;
          if (count && source.scrollHeight > source.clientHeight) {
            const firstCell = rows[1].firstElementChild;
            const height = Math.min(firstCell.offsetHeight, Math.floor(
              (source.clientHeight - source.firstElementChild.offsetHeight - rows[0].offsetHeight - 2) / count
            ));
            source.style.setProperty('--motif-row-height', height + 'px');
            source.style.setProperty('--motif-row-font', Math.min(parseFloat(getComputedStyle(firstCell).fontSize), Math.max(12, height - 8)) + 'px');
            source.style.setProperty('--motif-row-padding', '1px 12px');
            source.style.setProperty('--motif-info-size', Math.min(30, height - 4) + 'px');
            source.style.setProperty('--motif-info-glyph', Math.min(25, height - 6) + 'px');
          }
        }
        return view;
      },
    },
  },
});
