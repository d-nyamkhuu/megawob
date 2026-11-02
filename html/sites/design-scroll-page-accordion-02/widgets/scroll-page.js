// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-accordion-02',
  name: 'design',
  split: 'train',
  scenarios: ['accordion'],
  template: 'scroll-page/longform',
  design: {
      foreground: '#15191f',
      muted: '#30394b',
      accent: '#0054bc',
      panel: '#ffffff',
      background: '#ffffff',
      line: '#cbd3de',
      fontFamily: 'Arial, Helvetica, sans-serif',
      titleSize: 36,
      serifTitleSize: 36,
      sectionTitleSize: 26,
      bodySize: 18,
      radius: 0,
      figureHeight: [130, 130],
    parts: {
      rendered: (base, S) => (st) => {
        base(st);
        const judge = st.spec.judge;
        if (judge?.mode !== 'impossible' || !judge.what) return;
        // Keep the accepted names intact; use the existing declarative alias
        // as the canonical spelling for a free-text impossibility report.
        const index = judge.what.findIndex((name) => !name.includes('?'));
        if (index > 0) {
          judge.what = [judge.what[index], ...judge.what.slice(0, index), ...judge.what.slice(index + 1)];
        }
      },
      faqItem: (base, S) => (st, parent, item) => {
        base(st, parent, item);
        const entry = st.itemEls[item.id];
        Object.assign(entry.q.style, { gap: '8px', minHeight: '34px', padding: '4px 10px' });
        entry.item.lastElementChild.style.padding = '4px 14px 12px 36px';
      },
    },
  },
});
