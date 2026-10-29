// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-scene-03',
  name: 'design',
  split: 'train',
  scenarios: ['scene'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0,
    minWidth: 0,
    minHeight: 0,
    parts: {
      frame: (base, S) => R => R.e('div', 'hm-editor', R.ctx.stage),
      top: () => () => {},
      navigation: () => () => {},
      shell: () => R => R.app,
      sidebar: () => () => {},
      body: () => R => ({ main: R.e('div', 'hm-form', R.app), aside: R.e('div', 'hm-unused', R.app) }),
      heading: () => R => {
        const head = R.e('div', 'hm-form-heading', R.main);
        R.e('h1', '', head, 'Create Schedule');
        R.e('p', '', head, 'Set a time, choose repeat days, and control your devices.');
      },
      toolbar: () => () => {},
      statusbar: () => R => {
        let fitted = false;
        R.paints.push(() => {
          if (fitted) return;
          const picker = R.main.querySelector('.ah-picker');
          if (!picker) return;
          fitted = true;
          picker.classList.add('hm-time-picker');
          Object.assign(picker.style, {
            top: '0px', left: '0px', width: Math.min(360, R.ctx.size.width) + 'px',
            maxWidth: '100%', maxHeight: '100%', overflow: 'auto', padding: '10px',
          });
          picker.querySelectorAll('.ah-picker-grid').forEach(grid => {
            grid.style.gridTemplateColumns = `repeat(${R.ctx.size.height < 300 ? 12 : 8}, minmax(0, 1fr))`;
          });
          picker.querySelectorAll('.ah-btn').forEach(button => {
            Object.assign(button.style, { minHeight: '25px', height: '25px', padding: '2px' });
          });
        });
      },
      sceneAside: () => () => {},
      sceneLayout: () => R => ({ timing: R.e('div', 'hm-timing', R.main), devices: R.e('div', 'hm-devices', R.main) }),
      sceneTiming: (base, S) => (R, timing) => {
        const time = base(R, timing);
        const labels = [...timing.querySelectorAll('h3')];
        labels[0].textContent = 'Time';
        const name = R.e('div', 'hm-name-field', timing);
        R.e('label', '', name, 'Scene name');
        R.e('div', 'hm-name-value', name, R.s.sceneName);
        timing.prepend(name);
        const fields = R.e('div', 'hm-timing-fields', timing);
        const clock = R.e('div', 'hm-time-field', fields);
        clock.append(labels[0], time);
        const repeat = R.e('div', 'hm-repeat-field', fields);
        repeat.append(labels[1], timing.querySelector('.ah-days'));
        timing.querySelector('.ah-detail-card').remove();
        const overflow = () => Math.max(0, timing.scrollHeight - timing.clientHeight);
        const trim = (node, property, minimum) => {
          const current = parseFloat(getComputedStyle(node)[property]);
          if (overflow() > 0) node.style[property] = Math.max(minimum, current - overflow()) + 'px';
        };
        trim(timing, 'gap', 0);
        trim(name.querySelector('.hm-name-value'), 'height', 36);
        trim(name.querySelector('label'), 'marginBottom', 0);
        const extra = overflow();
        if (extra > 0) labels.forEach(label => {
          label.style.marginBottom = Math.max(0, parseFloat(getComputedStyle(label).marginBottom) - extra) + 'px';
        });
        return time;
      },
      deviceRow: (base, S) => (R, pane, name, i) => {
        const row = base(R, pane, name, i);
        const title = row.querySelector('.ah-device-name');
        title.querySelector('svg').remove();
        const meta = row.querySelector('.ah-device-meta');
        meta.textContent = R.s.room;
        const identity = R.e('div', 'hm-device-identity', row);
        const glyph = R.e('span', 'hm-device-icon', identity);
        const paths = name.toLowerCase().includes('speaker') ? '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="7" r="1.5"/><circle cx="12" cy="15" r="3.5"/>' : name.toLowerCase().includes('lamp') ? '<path d="m6 3-3 12h18L18 3ZM12 15v7m-5 0h10"/>' : name.toLowerCase().includes('hall') ? '<path d="M12 2v7m-9 9a9 9 0 0 1 18 0ZM8 18c0 6 8 6 8 0"/>' : '<path d="M8 17c0-3-4-4-4-8a8 8 0 1 1 16 0c0 4-4 5-4 8Zm0 3h8m-6 3h4"/>';
        glyph.innerHTML = `<svg viewBox="0 0 24 26" aria-hidden="true">${paths}</svg>`;
        const text = R.e('div', 'hm-device-text', identity);
        text.append(title, meta);
        row.prepend(identity);
        const actions = R.e('div', 'hm-device-options', row);
        actions.append(R.buttons[`device:${i}:off`], R.buttons[`device:${i}:on`], R.buttons[`device:${i}:null`]);
        return row;
      },
      sceneDevices: (base, S) => (R, devices) => {
        const pane = base(R, devices);
        devices.querySelector('h3').textContent = 'Devices';
        return pane;
      },
      sceneActions: (base, S) => R => {
        const state = base(R);
        R.paints.push(m => { state.hidden = !m.saved; });
        const tip = R.e('div', 'hm-tip', R.main);
        const glyph = R.e('div', 'hm-tip-icon', tip);
        glyph.innerHTML = '<svg viewBox="0 0 32 44" aria-hidden="true"><path d="M16 1C2 1-1 15 7 24c3 3 3 6 3 8h12c0-3 0-5 3-8C34 14 29 1 16 1ZM10 35h12v3H10Zm3 6h6l-1 3h-4Z" fill="#df001b"/><path d="M7 13c0-4 3-7 7-8" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
        const text = R.e('div', '', tip);
        R.e('strong', '', text, 'Tip');
        R.e('p', '', text, 'Use schedules to automatically set the mood, control your devices, and start your media at the right time.');
        return state;
      },
    },
  },
});
