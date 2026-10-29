// Design on the use-smart-home/classic console template.
let closeScenePicker = null;
document.addEventListener('click', event => {
  if (closeScenePicker) closeScenePicker(event);
});

env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-scene-04',
  name: 'design',
  split: 'train',
  scenarios: ['scene'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0,
    minWidth: 0,
    minHeight: 0,
    fontFamily: 'Arial, Helvetica, sans-serif',
    parts: {
      top: () => () => {},
      navigation: () => () => {},
      sidebar: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      sceneAside: () => () => {},
      body: (base, S) => (R, shell) => {
        const main = R.e('div', 'hm-editor', shell);
        const aside = R.e('aside', 'hm-unused', shell);
        return { main, aside };
      },
      heading: (base, S) => R => {
        R.e('div', 'hm-panel-title hm-editor-title', R.main, 'Schedule Editor');
      },
      sceneTiming: (base, S) => (R, timing) => {
        const { e, ctx, s } = R;
        const nameRow = e('div', 'hm-field-row', timing);
        e('span', 'hm-field-label', nameRow, 'Scene name:');
        e('div', 'hm-scene-name', nameRow, s.sceneName);
        const timeRow = e('div', 'hm-field-row', timing);
        e('span', 'hm-field-label', timeRow, 'Time:');
        const time = S.P.button(R, timeRow, '', 'time', () => S.P.patch(R, { picker: !ctx.model.picker }));
        time.classList.add('ah-time');
        closeScenePicker = event => {
          if (ctx.model.picker && !time.contains(event.target) && !event.target.closest('.ah-picker')) {
            S.P.patch(R, { picker: false });
          }
        };
        const repeat = e('div', 'hm-repeat-row', timing);
        e('span', 'hm-field-label', repeat, 'Repeat on:');
        const days = e('div', 'ah-days', repeat);
        const names = env.taskDef.helpers.DAYS;
        [6, 0, 1, 2, 3, 4, 5].forEach(i => {
          const b = S.P.button(R, days, names[i], 'day:' + i, () => S.P.patch(R, {
            days: ctx.model.days.includes(i) ? ctx.model.days.filter(d => d !== i) : [...ctx.model.days, i].sort(), saved: false
          }));
          b.classList.add('hm-day');
        });
        return time;
      },
      sceneLayout: (base, S) => R => {
        const layout = R.e('div', 'hm-scene-layout', R.main);
        const timing = R.e('div', 'hm-scene-timing', layout);
        const devices = R.e('div', 'hm-scene-devices', layout);
        return { timing, devices };
      },
      sceneDevices: (base, S) => (R, devices) => {
        R.e('span', 'hm-field-label hm-devices-label', devices, 'Devices:');
        const table = R.e('div', 'hm-device-table', devices);
        const head = R.e('div', 'hm-table-head', table);
        ['Device', 'Excluded', 'On', 'Off'].forEach(text => R.e('span', '', head, text));
        const pane = base(R, table);
        table.querySelector('h3').remove();
        return pane;
      },
      deviceRow: (base, S) => (R, pane, name, i) => {
        const row = R.e('div', 'ah-device', pane);
        const label = R.e('div', 'ah-device-name', row);
        const kind = /speaker/i.test(name) ? 'speaker' : /lamp/i.test(name) ? 'lamp' : /hall/i.test(name) ? 'lantern' : 'bulb';
        window.homeDeviceIcon(label, kind);
        R.e('span', '', label, name);
        [null, 'on', 'off'].forEach(state => {
          const text = state === null ? 'Excluded' : state === 'on' ? 'On' : 'Off';
          const b = S.P.button(R, row, '', `device:${i}:${state}`, () => {
            const states = [...R.ctx.model.states]; states[i] = state;
            S.P.patch(R, { states, saved: false });
          });
          b.classList.add('hm-radio');
          b.setAttribute('aria-label', name + ': ' + text);
          b.title = text;
        });
        return row;
      },
      sceneActions: (base, S) => R => {
        const actions = R.e('div', 'hm-scene-actions', R.main);
        const saveState = R.e('span', 'hm-save-state', actions);
        saveState.setAttribute('aria-live', 'polite');
        R.paints.push(m => { saveState.hidden = !m.saved; });
        S.P.button(R, actions, 'Save schedule', 'save', () => S.P.patch(R, { saved: true }));
        return saveState;
      }
    }
  },
});
