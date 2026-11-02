// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-scene-01',
  name: 'design',
  split: 'train',
  scenarios: ['scene'],
  template: 'use-smart-home/classic',
  design: {
    parts: {
      frame: (base) => R => {
        const app = base(R);
        app.style.removeProperty('width'); app.style.removeProperty('height');
        app.classList.add('scene-window');
        return app;
      },
      top: () => R => {
        const bar = R.e('div', 'scene-title', R.app);
        R.e('span', 'scene-house', bar, '⌂');
        R.e('strong', '', bar, 'Edit Schedule');
        R.e('span', 'scene-close', bar, '×');
      },
      navigation: () => () => {},
      sidebar: () => () => {},
      heading: () => R => { R.e('h2', 'scene-settings-title', R.main, 'Schedule Settings'); },
      toolbar: () => () => {},
      statusbar: () => () => {},
      sceneAside: () => () => {},
      sceneLayout: () => R => {
        const layout = R.e('div', 'ah-scene-layout', R.main);
        const timing = R.e('div', 'scene-timing', layout);
        const devices = R.e('div', 'scene-devices', layout);
        return { timing, devices };
      },
      sceneTiming: (base, S) => (R, timing) => {
        const { ctx, e, s } = R;
        const identity = e('div', 'scene-field', timing);
        e('label', '', identity, 'Scene name:');
        const name = e('input', 'scene-name', identity); name.value = s.sceneName; name.readOnly = true;
        name.setAttribute('aria-label', 'Scene name');
        const timeRow = e('div', 'scene-field scene-time-row', timing);
        e('span', '', timeRow, 'Time:');
        const time = S.P.button(R, timeRow, '', 'time', () => S.P.patch(R, { picker: !ctx.model.picker }));
        time.classList.add('ah-time');
        const repeat = e('div', 'scene-field scene-repeat', timing);
        e('span', '', repeat, 'Repeat on:');
        const days = e('div', 'ah-days', repeat);
        const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        env.taskDef.helpers.DAYS.forEach((name, i) => {
          const day = S.P.button(R, days, fullDays[i], 'day:' + i, () => S.P.patch(R, {
            days: ctx.model.days.includes(i) ? ctx.model.days.filter(d => d !== i) : [...ctx.model.days, i].sort(), saved: false
          }));
          day.classList.add('scene-day'); day.setAttribute('role', 'checkbox');
          R.paints.push(m => day.setAttribute('aria-checked', String(m.days.includes(i))));
        });
        return time;
      },
      deviceRow: (base, S) => (R, pane, name, i) => {
        const { ctx, s, e } = R;
        const row = e('div', 'ah-device', pane);
        const kind = /speaker/i.test(name) ? 'speaker' : /lamp/i.test(name) ? 'lamp' : /hall/i.test(name) ? 'hall' : 'ceiling';
        e('div', 'device-art ' + kind, row);
        const identity = e('div', 'scene-device-identity', row);
        e('div', 'ah-device-name', identity, name);
        e('div', 'ah-device-meta', identity, /hall/i.test(name) ? 'Hallway' : s.room);
        const states = e('div', 'scene-device-states', row);
        ['on', 'off', null].forEach(state => {
          const b = S.P.button(R, states, state === null ? 'Excluded' : state === 'on' ? 'On' : 'Off', `device:${i}:${state}`, () => {
            const states = [...ctx.model.states]; states[i] = state; S.P.patch(R, { states, saved: false });
          });
          b.setAttribute('role', 'radio');
          R.paints.push(m => b.setAttribute('aria-checked', String(m.states[i] === state)));
        });
        return row;
      },
      sceneDevices: base => (R, devices) => {
        const pane = base(R, devices);
        devices.querySelector('h3').textContent = 'Device States';
        return pane;
      },
      sceneActions: base => R => {
        const status = base(R);
        R.paints.push(m => { status.hidden = !m.saved; });
        return status;
      },
    },
  },
});
