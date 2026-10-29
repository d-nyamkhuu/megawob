// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-lightcolor-01',
  name: 'design',
  split: 'train',
  scenarios: ['lightcolor'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0,
    minWidth: 0,
    minHeight: 0,
    hueDiameter: 344,
    readoutSize: 34,
    palette: { bg: '#141a20', panel: '#191f26', fg: '#f1f3f7', muted: '#b0bbcc', line: '#2c3640', accent: '#8af168' },
    parts: {
      icon: base => (R, parent, name) => {
        const paths = {
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
        R.e('h2', '', text, R.s.room + ' Light');
        R.e('div', 'bulb-subtitle', text, R.s.room + '  ·  Smart Bulb');
      },
      roomContext: () => () => {},
      rotary: (base, S) => (R, control, hue) => {
        if (!hue) return base(R, control, hue);
        const { ctx, e, main, controls, paints } = R;
        const offset = -130;
        const physical = value => (value + offset + 360) % 360;
        const area = e('div', 'ah-ring-area', main);
        let diameter = S.D.hueDiameter;
        const { ring, readout, detail, grip } = S.P.ring(R, area, true, diameter);
        const radius = () => diameter / 2 - 16;
        const api = env.ui.dial(ring, {
          angle: physical(ctx.model.hue), radius,
          band: [() => diameter / 2 - 31, () => diameter / 2 + 3],
          start: 0, sweep: 360, min: 0, max: 360, step: 1, label: 'bulb hue',
          onInput: (angle, value) => S.P.patch(R, { hue: (Math.round(value) - offset + 360) % 360 }),
        });
        controls[control] = { ...api, locate: value => api.locate(physical(value)) };
        R.fitRing = () => {
          diameter = Math.max(100, Math.min(S.D.hueDiameter, area.clientHeight - 8, area.clientWidth - 22));
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
        const layout = e('div', 'bulb-layout', main);
        const wheel = e('div', 'bulb-wheel-panel', layout);
        R.main = wheel;
        S.P.rotary(R, 'hue', true);
        R.main = main;
        const info = e('div', 'bulb-info', layout);
        const power = e('div', 'bulb-power', info);
        S.P.icon(R, e('div', 'bulb-power-icon', power), 'power');
        const powerText = e('div', 'bulb-power-text', power);
        e('span', '', powerText, 'Power');
        e('strong', '', powerText, 'On');
        const toggle = e('button', 'home-toggle on', power);
        toggle.type = 'button'; toggle.setAttribute('aria-label', 'Bulb power');
        toggle.setAttribute('aria-pressed', 'true');
        toggle.addEventListener('click', () => { const on = toggle.classList.toggle('on'); toggle.setAttribute('aria-pressed', String(on)); powerText.lastChild.textContent = on ? 'On' : 'Off'; });
        const section = e('div', 'bulb-brightness', info);
        const caption = e('div', 'bulb-caption', section);
        S.P.icon(R, caption, 'sun');
        e('span', '', caption, 'Brightness');
        const out = e('strong', '', caption);
        S.P.linear(R, section, 'brightness', 100, ctx.model.brightness, 'Bulb brightness');
        const rows = e('div', 'bulb-facts', info);
        const fact = (icon, label, value) => {
          const row = e('div', 'bulb-fact', rows);
          S.P.icon(R, row, icon); e('span', '', row, label);
          return e('strong', '', row, value);
        };
        const hue = fact('palette', 'Hue', '');
        R.facts['Power draw'] = fact('bolt', 'Power Draw', '');
        R.facts.Connection = fact('wifi', 'Connection', '');
        paints.push(m => { out.textContent = m.brightness + '%'; hue.textContent = m.hue + '°'; wheel.querySelector('.ah-ring-inner .ah-muted').textContent = 'Hue'; });
      },
    },
  },
});
