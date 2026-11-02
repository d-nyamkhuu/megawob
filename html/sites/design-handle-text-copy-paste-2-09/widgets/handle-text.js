// Preserve this site's seeded source-line fitting after the shared editor is laid out.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-2-09',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste-2'],
  template: 'handle-text/editor',
  design: {
    parts: {
      copyBuilt: (base, S) => (ctx, card, sources) => {
        base(ctx, card, sources);
        S.st.fitSources = () => {
          sources.querySelectorAll('.ut-text.lines').forEach((text) => {
            const rows = text.querySelectorAll('.ut-ln');
            if (!rows.length) return;
            const lineHeight = rows[0].getBoundingClientRect().height;
            const band = sources.getBoundingClientRect();
            const available = Math.min(
              text.clientHeight,
              band.bottom - text.getBoundingClientRect().top - parseFloat(getComputedStyle(sources).paddingBottom),
            );
            if (available > 0 && rows.length * lineHeight > available) {
              const fit = Math.floor(available / rows.length);
              text.style.setProperty('--snippet-line-height', fit + 'px');
              text.style.setProperty(
                '--snippet-font-size',
                Math.min(parseFloat(getComputedStyle(text).fontSize), fit * 0.9) + 'px',
              );
            }
          });
        };
      },
      buildCopy: (base, S) => (ctx, look) => {
        const view = base(ctx, look);
        if (ctx.spec.scenario === 'copy-paste-2') {
          const after = view.after;
          view.after = () => {
            if (after) after();
            if (S.st.fitSources) S.st.fitSources();
          };
        }
        return view;
      },
    },
  },
});
