// Keep the template's row geometry and oracle pitch in agreement with the ledger typography.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-flight-04',
  name: 'design',
  split: 'train',
  scenarios: ['flight'],
  template: 'use-shop/store',
  design: {
    parts: {
      flightPitch: (_base, S) => (V) => {
        const { ctx, spec, rng, pane, body, gap } = V;
        const maximum = rng.int(84, 100);
        const available = body.getBoundingClientRect().bottom - pane.getBoundingClientRect().top;
        V.pitch = Math.max(24, Math.min(maximum, Math.floor((available - 2 + gap) / spec.rows)));
        V.res.classList.toggle('compact-results', V.pitch < 60);
        pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
        S.H.mirrorPitch(ctx, V.pitch);
        V.res.style.setProperty('--flight-pitch', V.pitch + 'px');
      },
      resultsSummary: (base, S) => (V, searched) => {
        base(V, searched);
        const date = V.x.resultValues.date;
        const label = date.textContent.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*/, '');
        date.replaceChildren();
        V.util.el('span', 'fl-summary-text', date, label);
        V.util.el('span', 'summary-calendar', date).innerHTML = S.H.ICON.cal;
        V.x.resultValues.passengers.classList.add('passenger-value');
      },
      flightPaint: (base) => (V, model) => {
        base(V, model);
        if (model.date) V.dval.textContent = V.dval.textContent.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*/, '');
      },
      flightRow: (base) => (V, ...args) => {
        const row = base(V, ...args);
        for (const time of row.querySelectorAll('.fl-t')) {
          const text = time.firstChild;
          const match = text && /^(\d{1,2}):(\d{2})$/.exec(text.textContent);
          if (match) {
            const hour = Number(match[1]);
            text.textContent = (hour % 12 || 12) + ':' + match[2] + (hour < 12 ? ' AM' : ' PM');
          }
        }
        return row;
      },
    },
  },
});
