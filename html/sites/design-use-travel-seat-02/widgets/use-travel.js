env.widget({
  task: 'use-travel',
  site: 'design-use-travel-seat-02',
  name: 'design',
  split: 'train',
  scenarios: ['seat'],
  template: 'use-travel/portal',
  design: {
    parts: {
      seats: (base, S) => (main, model) => {
        base(main, model);
        const rail = S.content.querySelector('.seat-info');
        const legend = main.querySelector('.at-legend');
        const panel = S.P.el('section', 'at-selection-info', rail);
        S.P.el('h3', '', panel, 'Seat information');
        const selected = S.spec.seats.find((seat) => seat.id === model.seat);
        S.P.el('strong', 'at-selection-status', panel, selected ? `Seat ${selected.id}` : 'No seat selected');
        const rows = S.P.el('dl', '', panel);
        const values = [
          ['Row', selected ? String(selected.row) : '—'],
          ['Seat', selected ? selected.id.slice(-1) : '—'],
          ['Seat type', selected ? (/[AF]$/.test(selected.id) ? 'Window' : /[CD]$/.test(selected.id) ? 'Aisle' : 'Middle') : '—'],
          ['Features', selected ? 'Standard' : '—'],
        ];
        for (const [label, value] of values) {
          S.P.el('dt', '', rows, label);
          S.P.el('dd', '', rows, value);
        }
        if (legend) {
          const extras = [['companion', 'Companion seat'], ['unavailable', 'Unavailable seat'], ['exit', 'Exit row'], ['aisle', 'Aisle']];
          for (const [kind, label] of extras) {
            const item = S.P.el('span', '', legend);
            S.P.el('i', kind, item);
            S.P.el('span', '', item, ` ${label}`);
          }
          rail.append(legend);
        }
      },
    },
  },
});
