// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-lightcolor-05',
  name: 'design',
  split: 'train',
  scenarios: ['lightcolor'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0,
    minWidth: 0,
    minHeight: 0,
    hueDiameter: 352,
    readoutSize: 34,
    palette: { bg: '#eef4fa', panel: '#ffffff', fg: '#101735', muted: '#00367d', line: '#9db4d1', accent: '#235eae' },
    parts: {
      icon: base => (R, parent, name) => {
        const paths = {
          bulb: 'M9 18h6m-5 3h4M8.2 14.5a7 7 0 1 1 7.6 0c-1.1.8-1.3 1.5-1.3 3.5h-5c0-2-.2-2.7-1.3-3.5Z',
          power: 'M12 2v10M6 5a9 9 0 1 0 12 0',
          sun: 'M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
          palette: 'M21 11a9 9 0 1 0-9 10h1a2 2 0 0 0 1-4c-2-1-1-4 1-4h4a2 2 0 0 0 2-2ZM7 8h.01M11 5h.01M16 7h.01M6 13h.01',
          bolt: 'm14 1-9 13h6l-1 9 9-14h-6Z',
        };
        if (!paths[name]) return base(R, parent, name);
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor'); icon.setAttribute('stroke-width', '1.7');
        icon.setAttribute('stroke-linecap', 'round'); icon.setAttribute('stroke-linejoin', 'round');
        icon.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', paths[name]); icon.append(path); parent.append(icon); return icon;
      },
      top: () => () => {},
      navigation: () => () => {},
      sidebar: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      shell: () => R => R.app,
      body: () => R => ({ main: R.e('div', 'bulb-main', R.app), aside: R.e('div', 'bulb-unused', R.app) }),
      heading: (base, S) => R => {
        const head = R.e('div', 'bulb-heading', R.main);
        const icon = R.e('div', 'bulb-heading-icon', head);
        S.P.icon(R, icon, 'bulb');
        const text = R.e('div', '', head);
        R.e('h2', '', text, R.s.room + ' – Light Controls');
      },
      roomContext: () => () => {},
      rotary: (base, S) => (R, control, hue) => {
        if (!hue) return base(R, control, hue);
        const { ctx, e, main, controls, paints } = R;
        const offset = 65;
        const physical = value => (value + offset + 360) % 360;
        const area = e('div', 'ah-ring-area', main);
        let diameter = S.D.hueDiameter;
        const { ring, readout, detail, grip } = S.P.ring(R, area, true, diameter);
        const radius = () => diameter * .425;
        const api = env.ui.dial(ring, {
          angle: physical(ctx.model.hue), radius,
          band: [() => diameter * .29, () => diameter / 2 + 3],
          start: 0, sweep: 360, min: 0, max: 360, step: 1, label: 'bulb hue',
          onInput: (angle, value) => S.P.patch(R, { hue: (Math.round(value) - offset + 360) % 360 }),
        });
        controls[control] = { ...api, locate: value => api.locate(physical(value)) };
        R.fitRing = () => {
          diameter = Math.max(100, Math.min(S.D.hueDiameter, area.clientHeight - 32, area.clientWidth - 40));
          ring.style.width = ring.style.height = diameter + 'px';
          readout.style.fontSize = Math.min(S.D.readoutSize, diameter * .23) + 'px';
          detail.style.display = diameter < 145 ? 'none' : '';
        };
        paints.push(m => {
          const angle = physical(m.hue);
          api.set(angle);
          grip.style.left = diameter / 2 + radius() * Math.sin(angle * Math.PI / 180) + 'px';
          grip.style.top = diameter / 2 - radius() * Math.cos(angle * Math.PI / 180) + 'px';
          readout.textContent = m.hue + '°'; detail.textContent = 'Hue';
          ring.setAttribute('aria-valuenow', String(m.hue));
        });
      },
      ring: (base) => (R, area, hue, diameter) => {
        const face = base(R, area, hue, diameter);
        face.readout.previousElementSibling.remove();
        R.paints.push(m => { face.detail.textContent = 'Hue'; face.grip.style.background = `hsl(${m.hue} 100% 55%)`; });
        return face;
      },
      renderLightcolor: (base, S) => R => {
        const { e, main, ctx, paints } = R;
        const room = R.s.room, name = room + ' Ceiling Bulb';
        const status = e('div', 'bulb-status', main);
        e('span', '', status, 'Device:'); e('span', 'bulb-device-name', status, name);
        e('span', 'bulb-status-label', status, 'Status:');
        e('span', 'bulb-status-lamp', status); e('strong', 'connected', status, 'Connected');
        const layout = e('div', 'bulb-layout', main);
        const wheel = e('div', 'bulb-wheel-panel', layout);
        e('div', 'console-section-title', wheel, 'Hue');
        R.main = wheel;
        S.P.rotary(R, 'hue', true);
        R.main = main;
        const info = e('div', 'bulb-info', layout);
        e('div', 'console-section-title', info, 'Brightness');
        const section = e('div', 'bulb-brightness', info);
        const slider = e('div', 'bulb-vertical-slider', section);
        slider.setAttribute('role', 'slider'); slider.setAttribute('aria-label', 'Bulb brightness');
        slider.setAttribute('aria-valuemin', '0'); slider.setAttribute('aria-valuemax', '100');
        slider.setAttribute('aria-orientation', 'vertical'); slider.tabIndex = 0;
        const fill = e('div', 'bulb-slider-fill', slider);
        const thumb = e('div', 'bulb-slider-thumb', slider);
        const out = e('strong', 'bulb-brightness-value', section);
        const setFromPointer = event => {
          const rect = slider.getBoundingClientRect();
          S.P.patch(R, { brightness: Math.max(0, Math.min(100, Math.round((rect.bottom - event.clientY) / rect.height * 100))) });
        };
        slider.addEventListener('pointerdown', event => { event.preventDefault(); slider.setPointerCapture(event.pointerId); setFromPointer(event); });
        slider.addEventListener('pointermove', event => { if (slider.hasPointerCapture(event.pointerId)) setFromPointer(event); });
        slider.addEventListener('pointerup', event => { if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId); });
        slider.addEventListener('keydown', event => { if (['ArrowUp', 'ArrowDown'].includes(event.key)) { event.preventDefault(); S.P.patch(R, {brightness: Math.max(0, Math.min(100, ctx.model.brightness + (event.key === 'ArrowUp' ? 1 : -1)))}); } });
        const locateBrightness = value => { const rect = slider.getBoundingClientRect(); return [rect.left + rect.width / 2, rect.bottom - rect.height * Number(value) / 100]; };
        R.controls.brightness = { locate: locateBrightness, locateThumb: () => locateBrightness(ctx.model.brightness) };
        const facts = e('section', 'bulb-device-information', main);
        e('div', 'console-section-title', facts, 'Device Information');
        const fact = (label, value) => { const row = e('div', 'console-table-row', facts); e('span', '', row, label + ':'); return e('span', value === 'Connected' ? 'connected' : '', row, value); };
        fact('Name', name); fact('Room', room); fact('Type', 'Color Bulb');
        R.facts.Connection = fact('Connection', 'Connected');
        fact('Last Updated', 'Apr 21, 2003 10:24 AM');
        R.facts['Power draw'] = e('span', 'bulb-hidden', facts);
        paints.push(m => {
          out.textContent = m.brightness + '%'; fill.style.height = m.brightness + '%'; thumb.style.bottom = m.brightness + '%';
          slider.setAttribute('aria-valuenow', String(m.brightness));
          const hue = document.querySelector('.inspect-hue'), bright = document.querySelector('.inspect-brightness');
          if (hue) hue.textContent = m.hue + '°'; if (bright) bright.textContent = m.brightness + '%';
        });
      },
    },
  },
});
