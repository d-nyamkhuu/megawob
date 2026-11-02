// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-lightcolor-03',
  name: 'design',
  split: 'train',
  scenarios: ['lightcolor'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0,
    minWidth: 100,
    minHeight: 100,
    hueDiameter: 316,
    readoutSize: 42,
    palette: { bg: '#cececc', panel: '#cececc', fg: '#111210', muted: '#111210', line: '#111210', accent: '#737471' },
    parts: {
      icon: (base) => (R, parent, name) => {
        const paths = {
          activity: 'M11 2h7l-6 8h5L7 23l3-11H6Z',
          device: 'M9 15V5a3 3 0 0 1 6 0v10a5 5 0 1 1-6 0ZM12 6v12m-1 1h2',
        };
        if (!paths[name]) return base(R, parent, name);
        const svg = R.util.svg('svg', { viewBox:'0 0 24 24', fill:name === 'activity' ? 'currentColor' : 'none', stroke:'currentColor', 'stroke-width':1.8, class:'ah-icon', 'aria-hidden':'true' }, parent);
        R.util.svg('path', { d:paths[name] }, svg);
        return svg;
      },
      top: () => () => {},
      navigation: () => () => {},
      sidebar: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      body: () => R => {
        const body = R.e('div', 'gem-console-body', R.app);
        return { main: R.e('div', 'ah-main gem-light-workspace', body), aside: R.e('aside', 'ah-aside gem-light-inspector', body) };
      },
      heading: (base, S) => R => {
        const head = R.e('div', 'gem-light-heading', R.main);
        S.P.icon(R, head, 'bulb');
        const text = R.e('div', 'gem-light-identity', head);
        R.e('h2', '', text, R.s.room + ' Light');
        R.e('div', '', text, R.s.room);
        R.e('span', 'gem-light-on', head, 'On');
      },
      roomContext: () => () => {},
      ring: (base, S) => (R, area, hue, diameter) => {
        const face = base(R, area, hue, diameter);
        face.ring.classList.add('gem-hue-dial');
        face.readout.previousElementSibling.hidden = true;
        for (const angle of [0, 60, 120, 180, 240, 300]) {
          const label = R.e('span', 'gem-dial-tick', face.ring, angle + '°');
          label.style.left = (50 + 60 * Math.sin(angle * Math.PI / 180)) + '%';
          label.style.top = (50 - 57 * Math.cos(angle * Math.PI / 180)) + '%';
        }
        return face;
      },
      lightcolorAside: (base, S) => R => {
        const { e, aside, facts } = R;
        e('h2', 'gem-inspector-title', aside, 'Light Details');
        const row = (parent, label, value) => {
          const line = e('div', 'gem-inspector-row', parent);
          e('span', '', line, label + ':');
          return e('span', '', line, value);
        };
        const identity = e('section', 'gem-inspector-section gem-device-properties', aside);
        row(identity, 'Name', R.s.room + ' Light');
        row(identity, 'Room', R.s.room);
        row(identity, 'Type', 'Smart Bulb');
        row(identity, 'Status', 'On');
        const settings = e('section', 'gem-inspector-section', aside);
        e('h3', '', settings, 'Current Settings');
        const hue = row(settings, 'Hue', '');
        const brightness = row(settings, 'Brightness', '');
        facts['Power draw'] = row(settings, 'Power Draw', '');
        row(settings, 'Room Temp', '21°C');
        const schedule = e('section', 'gem-inspector-section gem-schedule', aside);
        e('h3', '', schedule, 'Schedule');
        for (const [time, action] of [['06:00', 'Turn On  (30%)'], ['12:00', 'Set to 60°  (70%)'], ['22:00', 'Turn Off']]) {
          const line = e('div', 'gem-schedule-row', schedule);
          e('span', '', line, time); e('span', '', line, action);
        }
        const swatch = e('span', 'gem-hidden-swatch', aside); swatch.hidden = true;
        R.paints.push(m => { hue.textContent = m.hue + '°'; brightness.textContent = m.brightness + '%'; });
        return swatch;
      },
      renderLightcolor: (base, S) => R => {
        S.P.lightcolorAside(R);
        S.P.rotary(R, 'hue', true);
        const detail = R.main.querySelector('.ah-ring-inner .ah-muted:last-child');
        R.paints.push(() => { detail.textContent = 'Hue'; });
        const section = R.e('div', 'ah-light-controls gem-brightness-panel', R.main);
        const line = R.e('div', 'gem-brightness-label', section);
        S.P.icon(R, line, 'heat'); R.e('strong', '', line, 'Brightness');
        const sliderRow = R.e('div', 'gem-brightness-slider', section);
        S.P.linear(R, sliderRow, 'brightness', 100, R.ctx.model.brightness, 'Bulb brightness');
        const out = R.e('strong', 'gem-brightness-value', sliderRow);
        const info = R.e('div', 'gem-bulb-info', section);
        const row = (icon, label, value) => {
          const line = R.e('div', 'gem-bulb-row', info);
          S.P.icon(R, line, icon); R.e('span', '', line, label + ': ');
          return R.e('span', '', line, value);
        };
        row('bulb', 'Room', R.s.room);
        const power = row('activity', 'Power Draw', '');
        row('home', 'Status', 'On');
        row('device', 'Room Temperature', '21°C');
        R.paints.push(m => { out.textContent = m.brightness + '%'; power.textContent = R.facts['Power draw'].textContent; });
      },
    },
  },
});
