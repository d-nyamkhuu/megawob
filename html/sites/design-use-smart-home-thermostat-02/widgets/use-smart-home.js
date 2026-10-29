// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-thermostat-02',
  name: 'design',
  split: 'train',
  scenarios: ['thermostat'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0, temperatureDiameter: 490, readoutSize: 148,
    parts: {
      frame: (base) => R => {
        const app = base(R);
        app.classList.add('precision-app');
        const footer = document.querySelector('.ref-foot');
        const height = R.size.height + (footer ? footer.getBoundingClientRect().height : 0);
        R.ctx.stage.parentNode.style.setProperty('--workspace-height', height + 'px');
        return app;
      },
      top: () => () => {},
      navigation: () => () => {},
      sidebar: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      roomContext: () => () => {},
      shell: () => R => R.e('section', 'precision-shell', R.app),
      body: () => (R, shell) => ({
        main: R.e('section', 'precision-main', shell),
        aside: R.e('aside', 'precision-unused', shell),
      }),
      ring: (base, S) => (R, area, hue, diameter) => {
        const face = base(R, area, hue, diameter);
        const { ring, readout, detail, grip } = face;
        ring.querySelector('.ah-ring-inner > .ah-muted').textContent = 'Set to';
        detail.classList.add('precision-mode-detail');
        R.e('span', 'precision-unit', readout.parentNode, '°C');
        const svg = R.util.svg('svg', {
          viewBox: '0 0 100 100', class: 'precision-ring-art', 'aria-hidden': 'true',
        }, ring);
        const arc = 'M16.412 83.588 A47.5 47.5 0 1 1 83.588 83.588';
        R.util.svg('path', { d: arc, class: 'precision-track' }, svg);
        const fill = R.util.svg('path', { d: arc, class: 'precision-fill', pathLength: 100 }, svg);
        const adjustment = R.e('div', 'precision-adjustment', ring);
        for (const [symbol, delta, label] of [['−', -1, 'Decrease temperature'], ['+', 1, 'Increase temperature']]) {
          const button = R.e('button', 'precision-step', adjustment, symbol);
          button.type = 'button';
          button.setAttribute('aria-label', label);
          button.addEventListener('pointerdown', event => event.stopPropagation());
          button.addEventListener('click', event => {
            event.stopPropagation();
            S.P.patch(R, { temp: Math.max(R.s.min, Math.min(R.s.max, R.ctx.model.temp + delta)) });
          });
        }
        R.precisionFace = { ring, readout, fill, grip };
        return face;
      },
      rotary: (base) => (R, control, hue) => {
        base(R, control, hue);
        R.paints.push(m => {
          const { ring, readout, fill } = R.precisionFace;
          readout.textContent = m.temp;
          ring.style.setProperty('--instrument-size', ring.style.width);
          fill.style.strokeDasharray = `${100 * (m.temp - R.s.min) / (R.s.max - R.s.min)} 100`;
          fill.style.opacity = m.temp === R.s.min ? '0' : '1';
          ring.querySelector('.low').textContent = R.s.min + '°C';
          ring.querySelector('.high').textContent = R.s.max + '°C';
        });
      },
      renderThermostat: (base, S) => R => {
        S.P.rotary(R, 'temperature', false);
        const modes = R.e('div', 'ah-segments', R.main);
        for (const mode of ['heat', 'cool']) {
          const button = S.P.button(R, modes, mode === 'heat' ? 'Heat' : 'Cool', 'mode:' + mode,
            () => S.P.patch(R, { mode }));
          const icon = S.P.icon(R, null, mode);
          if (mode === 'heat') icon.querySelector('path').setAttribute('d', 'M12 2c2 5-5 7-5 12a6 6 0 0 0 12 0c0-3-1-5-3-7 0 3-2 4-2 4s2-5-2-9Z');
          else icon.querySelector('path').setAttribute('d', 'M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M8 4l4 3 4-3M8 20l4-3 4 3M3 11l4-1 1-4M21 13l-4 1-1 4M3 13l4 1 1 4M21 11l-4-1-1-4');
          button.prepend(icon);
        }
        R.paints.push(m => {
          for (const mode of ['heat', 'cool']) R.buttons['mode:' + mode].classList.toggle('on', m.mode === mode);
          const workspace = R.ctx.stage.parentNode;
          workspace.querySelector('.nestora-inspector-room strong').textContent = R.s.room;
          const values = workspace.querySelectorAll('.nestora-detail strong');
          const facts = Object.fromEntries(env.taskDef.facts(m, R.s).map(f => [f.label, f.value]));
          const status = env.taskDef.helpers.operating(m, R.s);
          const ambient = facts['Room temperature'];
          const humidity = facts.Humidity;
          [m.temp + '°C', m.mode === 'heat' ? 'Heat' : 'Cool', R.s.min + '°C – ' + R.s.max + '°C', ambient, humidity, status]
            .forEach((value, i) => { values[i].textContent = value; });
          [ambient, humidity, status].forEach((value, i) => {
            workspace.querySelectorAll('.nestora-measurement-copy strong')[i].textContent = value;
          });
        });
      },
    },
  },
});
