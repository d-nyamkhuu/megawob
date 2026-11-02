// Keeps the workstation's minimum board height and mirrors puzzle feedback into its hint panel.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-hot-cold-12',
  name: 'design',
  split: 'train',
  scenarios: ['hot-cold'],
  template: 'solve-puzzle/hot-cold',
  design: {
    minHeight: 48,
    parts: {
      status: (base, S) => (m, last, geo) => {
        base(m, last, geo);
        const hints = document.querySelector('.hint-box');
        const previous = document.querySelector('.prior-feedback');
        if (hints) hints.textContent = last ? S.st.trend.textContent : 'Click the map to begin.';
        if (previous) {
          previous.textContent = last
            ? `${last.band === 'hot' ? '♨' : '❄'}　 ${last.label}${last.trend ? '　(' + last.trend + ')' : ''}`
            : '—　 No clicks yet';
          previous.style.color = last ? S.D.colors[last.band] : '';
        }
      },
    },
  },
});
