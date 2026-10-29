// Design of this site on the click-control/controls template (templates/click-control/controls.js): the progress readout is the
// page's own (progress bar, status LED), and the page's help texts name the sampled color and time.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-04',
  name: 'design',
  split: 'train',
  scenarios: ['hover'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      hoverMeter: () => (ctx, b, W, H) => {
        const { spec, util } = ctx;
        const caption = util.el('div', 'area-caption', b);
        util.el('span', '', caption, `${spec.color[0].toUpperCase() + spec.color.slice(1)} square moves within this area`);
        util.el('span', '', caption, `${Math.round(W)} × ${Math.round(H)}`);
        const shell = b.closest('.shell');
        const txt = shell.querySelector('.progress-value'),
          bar = shell.querySelector('.progress-bar i');
        const status = shell.querySelector('.status-text'),
          led = shell.querySelector('.led');
        const need = spec.need / 1000,
          color = spec.color[0].toUpperCase() + spec.color.slice(1);
        shell.querySelector('.help p').textContent =
          `The ${spec.color} square will move to different positions within the marked area.`;
        shell.querySelectorAll('.help p')[1].textContent =
          `Your progress only counts while the mouse is over the square. It does not need to be ${need} seconds in a row.`;
        const values = shell.querySelectorAll('.overview .v');
        values[0].textContent = `Hover for ${need} seconds (total)`;
        values[1].textContent = `${color} square (it moves)`;
        const notes = shell.querySelectorAll('.notes li');
        notes[0].textContent = `The ${spec.color} square moves to new positions within the dashed area.`;
        notes[1].textContent = `Keep the mouse over the square for a total of ${need} seconds (it does not need to be continuous).`;
        return (m) => {
          txt.textContent = `${(Math.min(m.got, spec.need) / 1000).toFixed(2)} / ${need.toFixed(2)} seconds`;
          bar.style.width = `${Math.min(1, m.got / spec.need) * 100}%`;
          const hovering = m.over === m.hl;
          status.textContent = hovering ? 'Hovering' : 'Not hovering';
          led.classList.toggle('active', hovering);
        };
      },
    },
  },
});
