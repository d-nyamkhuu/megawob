// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-thermostat-01',
  name: 'design',
  split: 'train',
  scenarios: ['thermostat'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0,
    minHeight: 0,
    temperatureDiameter: 344,
    readoutSize: 96,
    parts: {
      frame: base => R => {
        const app = base(R);
        app.classList.toggle('nestora-tight', R.size.height < 490);
        return app;
      },
      top: () => () => {},
      navigation: () => () => {},
      sidebar: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      shell: () => R => R.e('div', 'nestora-console', R.app),
      body: () => R => {
        const main = R.e('div', 'nestora-thermostat', R.app);
        const aside = R.e('div', 'nestora-unused', R.app);
        aside.hidden = true;
        return { main, aside };
      },
      heading: () => R => {
        const heading = R.e('div', 'nestora-thermostat-heading', R.main);
        R.e('h2', '', heading, R.s.room);
        R.e('div', '', heading, 'Thermostat');
      },
      roomContext: () => () => {},
      ring: () => (R, area, hue, diameter) => {
        const { e, s, util } = R;
        const ring = e('div', 'ah-ring nestora-dial', area);
        ring.style.width = ring.style.height = diameter + 'px';
        ring.setAttribute('role', 'slider');
        ring.setAttribute('aria-label', 'Thermostat setpoint');
        ring.setAttribute('aria-valuemin', String(s.min));
        ring.setAttribute('aria-valuemax', String(s.max));
        const svg = util.svg('svg', { viewBox: '0 0 344 344', class: 'nestora-dial-arcs', 'aria-hidden': 'true' }, ring);
        const d = 'M56.034 287.966 A164 164 0 1 1 287.966 287.966';
        util.svg('path', { d, fill: 'none', stroke: '#d8e0e9', 'stroke-width': 16, 'stroke-linecap': 'round' }, svg);
        const active = util.svg('path', { d, fill: 'none', stroke: '#0755ff', 'stroke-width': 16, 'stroke-linecap': 'round', pathLength: 270 }, svg);
        const inner = e('div', 'nestora-dial-center', ring);
        const number = e('div', 'nestora-dial-number', inner);
        const readout = e('span', 'ah-digits', number);
        e('span', 'nestora-dial-unit', number, '°C');
        const detail = e('span', 'nestora-setpoint', inner, 'Setpoint');
        const adjustments = e('div', 'nestora-adjustments', ring);
        for (const [label, step] of [['−', -1], ['+', 1]]) {
          const b = e('button', '', adjustments, label);
          b.type = 'button';
          b.setAttribute('aria-label', step < 0 ? 'Decrease temperature' : 'Increase temperature');
          b.addEventListener('pointerdown', ev => ev.stopPropagation());
          b.addEventListener('click', ev => {
            ev.stopPropagation();
            R.sitePatch({ temp: Math.max(s.min, Math.min(s.max, R.ctx.model.temp + step)) });
          });
        }
        const limits = e('div', 'nestora-device-limits', ring);
        e('strong', '', limits, `${s.min}°C – ${s.max}°C`);
        e('span', '', limits, 'Device limits');
        const grip = e('span', 'ah-ring-grip', ring);
        R.nestoraDial = { active, readout, detail };
        return { ring, readout, detail, grip };
      },
      renderThermostat: (base, S) => R => {
        const { e, main, s, paints, facts, buttons } = R;
        const P = S.P;
        R.sitePatch = value => P.patch(R, value);
        const content = e('div', 'nestora-thermostat-content', main);
        // Keep the shared rotary binding and its temperature locate target.
        P.rotary(R, 'temperature', false);
        content.appendChild(main.querySelector('.ah-ring-area'));
        const fit = R.fitRing;
        R.fitRing = () => {
          fit();
          R.nestoraDial.readout.style.fontSize = Math.round(main.querySelector('.ah-ring').clientWidth * .28) + 'px';
        };
        const right = e('div', 'nestora-thermostat-info', content);
        e('div', 'nestora-mode-label', right, 'Mode');
        const modes = e('div', 'nestora-modes', right);
        for (const mode of ['heat', 'cool']) {
          const b = P.button(R, modes, mode === 'heat' ? 'Heat' : 'Cool', 'mode:' + mode, () => P.patch(R, { mode }));
          b.prepend(P.icon(R, null, mode));
        }
        const readings = e('div', 'nestora-live-readings', right);
        const paths = [
          'M10 14.8V5a2 2 0 0 1 4 0v9.8a4 4 0 1 1-4 0ZM12 9v9m0 0h.01',
          'M12 2S4 10 4 15a8 8 0 0 0 16 0c0-5-8-13-8-13Z',
          'M2 6q5-5 10 0t10 0M2 12q5-5 10 0t10 0M2 18q5-5 10 0t10 0',
          'M4 20 17 7M4 16C0 5 11 2 21 3c0 11-5 19-15 15',
        ];
        ['Room temperature', 'Humidity', 'Operating status', 'Device status'].forEach((label, i) => {
          const row = e('div', 'nestora-reading', readings);
          const icon = R.util.svg('svg', { viewBox: '0 0 24 24', class: 'nestora-reading-icon', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, row);
          R.util.svg('path', { d: paths[i] }, icon);
          e('span', 'nestora-reading-label', row, label);
          const value = e('strong', 'nestora-reading-value', row, i === 3 ? 'Online' : '');
          if (i < 3) facts[i === 2 ? 'System status' : label] = value;
        });
        const activeRoom = R.ctx.stage.parentElement.querySelector('.nestora-room.active');
        if (activeRoom) activeRoom.querySelector('strong').textContent = s.room;
        paints.push(m => {
          for (const mode of ['heat', 'cool']) buttons['mode:' + mode].classList.toggle('on', m.mode === mode);
          const { active, readout, detail } = R.nestoraDial;
          active.setAttribute('stroke-dasharray', `${270 * (m.temp - s.min) / (s.max - s.min)} 270`);
          active.style.visibility = m.temp === s.min ? 'hidden' : '';
          readout.textContent = String(m.temp);
          detail.textContent = 'Setpoint';
          if (activeRoom) activeRoom.querySelector('.nestora-room-temp').textContent = facts['Room temperature'].textContent;
        });
      },
    },
  },
});
