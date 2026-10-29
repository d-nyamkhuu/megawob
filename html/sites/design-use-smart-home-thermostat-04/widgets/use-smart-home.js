// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-thermostat-04',
  name: 'design',
  split: 'train',
  scenarios: ['thermostat'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0, minWidth: 100, minHeight: 100, temperatureDiameter: 330, readoutSize: 38,
    fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18,
    parts: {
      top: () => () => {},
      navigation: () => () => {},
      sidebar: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      roomContext: () => () => {},
      icon: (base, S) => (R, parent, name) => {
        if (name !== 'heat') return base(R, parent, name);
        const svg = R.util.svg('svg', { viewBox:'0 0 32 32', class:'ah-icon', fill:'none', stroke:'currentColor', 'stroke-width':2.8, 'aria-hidden':'true' }, parent);
        R.util.svg('path', { d:'M8 2C0 12 15 17 6 30M17 2C9 12 24 17 15 30M26 2C18 12 33 17 24 30' }, svg);
        return svg;
      },
      body: (base, S) => (R, shell) => {
        const main = R.e('div', 'ah-main', shell);
        const aside = R.e('aside', 'ah-aside', shell);
        return { main, aside };
      },
      ring: (base, S) => (R, area, hue, diameter) => {
        const face = base(R, area, hue, diameter);
        face.ring.classList.add('classic-dial');
        face.readout.previousElementSibling.remove();
        const ticks = R.util.svg('svg', { viewBox: '0 0 330 330', class: 'classic-ticks', 'aria-hidden': 'true' }, face.ring);
        R.util.svg('path', { d:'M71.7 258.3A132 132 0 1 1 258.3 258.3', fill:'none', stroke:'#333', 'stroke-width':1 }, ticks);
        for (let i = 0; i <= 54; i++) {
          const angle = 225 + i * 5;
          const a = angle * Math.PI / 180;
          const major = angle % 90 === 0, medium = angle % 30 === 0;
          const inner = major ? 112 : medium ? 119 : 125;
          R.util.svg('line', { x1: 165 + inner * Math.sin(a), y1: 165 - inner * Math.cos(a),
            x2: 165 + 132 * Math.sin(a), y2: 165 - 132 * Math.cos(a), stroke: '#111', 'stroke-width': major ? 4 : medium ? 2 : 1 }, ticks);
        }
        R.classicFace = face;
        return face;
      },
      thermostatAside: (base, S) => R => {
        const box = R.e('div', 'classic-measurements', null);
        const row = (label, value, fact) => {
          const line = R.e('div', 'classic-measurement', box);
          R.e('span', '', line, label + ':');
          const output = R.e('span', '', line, value || '');
          if (fact) R.facts[fact] = output;
          return output;
        };
        row('Room', R.s.room);
        row('Current Temperature', '', 'Room temperature');
        const setpoint = row('Setpoint');
        row('Humidity', '', 'Humidity');
        row('Status', '', 'System status');
        R.paints.push(m => { setpoint.textContent = m.temp + '°C'; });
        R.measurements = box;
      },
      renderThermostat: (base, S) => R => {
        base(R);
        R.main.querySelector('.ah-detail-card').remove();
        const range = R.e('div', 'classic-range', R.main);
        R.e('span', '', range, 'Temperature Range:');
        R.e('span', '', range, R.s.min + '°C　–　' + R.s.max + '°C');
        R.main.append(R.measurements);
        R.paints.push(m => {
          R.classicFace.readout.textContent = m.temp + '°C';
          R.classicFace.detail.textContent = 'Setpoint';
        });
        const fit = R.fitRing;
        R.fitRing = () => {
          fit();
          const d = R.classicFace.ring.clientWidth;
          R.classicFace.readout.style.fontSize = Math.min(38, d * .12) + 'px';
          R.classicFace.detail.style.fontSize = Math.min(18, d * .058) + 'px';
          R.classicFace.detail.style.display = '';
        };
      },
      rendered: (base, S) => R => {
        base(R);
        R.ctx.stage.dataset.title = R.s.room + ' — Climate Control';
        const rows = document.querySelectorAll('.nestora-room-copy strong');
        const first = rows[0].textContent;
        rows.forEach((row, i) => {
          if (i && row.textContent.toLowerCase() === R.s.room.toLowerCase()) {
            row.textContent = first;
            const firstIcon = rows[0].closest('.nestora-room').querySelector('svg');
            const otherIcon = row.closest('.nestora-room').querySelector('svg');
            const oldIcon = firstIcon.innerHTML;
            firstIcon.innerHTML = otherIcon.innerHTML;
            otherIcon.innerHTML = oldIcon;
          }
        });
        rows[0].textContent = R.s.room;
        const group = document.querySelector('.nestora-light-legend');
        if (group) group.textContent = R.s.room + ' Lights';
      },
    },
  },
});
