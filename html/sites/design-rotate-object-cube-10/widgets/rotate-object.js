// Smaller centered cube, larger labels, and a legend populated from the seeded faces.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-cube-10',
  name: 'design',
  split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .44,
    edgeWidth: .34,
    edgeMax: 310,
    x: .5,
    y: .5,
    labelMax: .48,
    background: 'backgroundColor',
    parts: {
      legend: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const legend = spec.faces.slice().sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }));
        document.querySelectorAll('.face-row').forEach((row, i) => {
          const data = legend[i];
          const chip = row.querySelector('.chip');
          chip.textContent = data.label;
          chip.style.background = data.color;
          chip.style.color = ['white', 'yellow'].includes(data.colorName) ? '#172542' : '#fff';
          const name = data.colorName.charAt(0).toUpperCase() + data.colorName.slice(1);
          row.querySelector('span').textContent = `${name} face — ${data.label}`;
        });
      },
    },
  },
});
