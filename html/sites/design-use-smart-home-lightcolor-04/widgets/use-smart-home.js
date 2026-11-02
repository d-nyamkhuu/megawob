// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-lightcolor-04',
  name: 'design',
  split: 'train',
  scenarios: ['lightcolor'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0,
    hueDiameter: 386,
    readoutSize: 40,
    fontFamily: '"Courier New", "Liberation Mono", monospace',
    palette: { bg: '#aaaaaa', panel: '#aaaaaa', fg: '#000000', muted: '#111111', line: '#555555', accent: '#003ba8' },
    parts: {
      frame: (base, S) => R => {
        const app = base(R);
        app.classList.add('wb-light');
        app.style.width = Math.max(300, R.size.width - 4) + 'px';
        app.style.height = Math.max(250, R.size.height - 4) + 'px';
        app.style.setProperty('--u', Math.min((R.size.height - 4) / 828, (R.size.width - 4) / 1120));
        app.workbenchFit = () => {
          const width = R.ctx.stage.clientWidth, height = R.ctx.stage.clientHeight;
          app.style.width = width + 'px';
          app.style.height = height + 'px';
          app.style.setProperty('--u', Math.min(height / 828, width / 1120));
          if (R.fitRing) { R.fitRing(); S.P.paint(R, R.ctx.model); }
        };
        return app;
      },
      top: () => () => {},
      navigation: () => () => {},
      sidebar: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      roomContext: () => () => {},
      body: () => R => {
        const main = R.e('div', 'wb-control-surface', R.app);
        const aside = R.e('div', 'wb-bulb-card', main);
        return { main, aside };
      },
      ring: () => (R, area, hue, diameter) => {
        R.e('div', 'wb-hue-label', R.main, 'Hue');
        const ring = R.e('div', 'ah-ring ah-wheel wb-hue-ring', area);
        ring.style.width = ring.style.height = diameter + 'px';
        ring.setAttribute('role', 'slider');
        ring.setAttribute('aria-label', 'Bulb hue');
        ring.setAttribute('aria-valuemin', '0');
        ring.setAttribute('aria-valuemax', '359');
        const bitmap = R.e('canvas', 'wb-wheel-bitmap', ring);
        bitmap.width = bitmap.height = 128;
        bitmap.setAttribute('aria-hidden', 'true');
        const ink = bitmap.getContext('2d');
        const edges = [24,48,66,84,108,132,156,180,204,228,252,276,294,312,336,360];
        const colors = ['#ffff00','#ffbf00','#ff7900','#ff3e00','#ff0030','#ff008d','#ed00f2','#ba00f5','#7d00ee','#4a00ee','#2400f5','#008cff','#00cde2','#00e2a1','#04ee13','#6cf900'];
        for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
          const dx = x - 63.5, dy = y - 63.5, distance = Math.hypot(dx, dy);
          if (distance > 64) continue;
          const angle = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
          let color = colors[edges.findIndex(edge => angle < edge)];
          if (distance > 62.8 || distance < 37.8 && distance > 36.8) color = '#000';
          if (distance <= 36.8) color = '#aaa';
          if (distance <= 37.9 && distance > 37.1 && dx + dy < -10) color = '#eee';
          ink.fillStyle = color;
          ink.fillRect(x, y, 1, 1);
        }
        const inner = R.e('div', 'ah-ring-inner', ring);
        const readout = R.e('span', 'ah-digits', inner);
        const detail = R.e('span', 'wb-ring-detail', inner);
        const grip = R.e('span', 'ah-ring-grip', ring);
        return { ring, readout, detail, grip };
      },
      rotary: (base, S) => (R, control, hue) => {
        const { ctx, e, main, controls, paints } = R;
        let unit = Math.min((R.size.height - 4) / 828, (R.size.width - 4) / 1120);
        let diameter = 386 * unit;
        const area = e('div', 'ah-ring-area', main);
        const { ring, readout, grip } = S.P.ring(R, area, hue, diameter);
        const radius = () => diameter * .425;
        const api = env.ui.dial(ring, {
          angle: ctx.model.hue, radius,
          band: [() => diameter * .28, () => diameter / 2 + 3],
          start: 0, sweep: 360, min: 0, max: 360, step: 1, label: 'bulb hue',
          onInput: (angle, value) => S.P.patch(R, { hue: Math.round(value) % 360 }),
        });
        controls[control] = api;
        R.fitRing = () => {
          unit = Number(R.app.style.getPropertyValue('--u'));
          diameter = Math.min(386 * unit, area.clientHeight - 8 * unit, area.clientWidth - 22 * unit);
          ring.style.width = ring.style.height = diameter + 'px';
        };
        paints.push(m => {
          api.set(m.hue);
          grip.style.left = diameter / 2 + radius() * Math.sin(m.hue * Math.PI / 180) + 'px';
          grip.style.top = diameter / 2 - radius() * Math.cos(m.hue * Math.PI / 180) + 'px';
          grip.style.background = `hsl(${m.hue} 100% 40%)`;
          readout.textContent = m.hue + '°';
          ring.setAttribute('aria-valuenow', String(m.hue));
        });
      },
      renderLightcolor: (base, S) => R => {
        const { ctx, e, main, aside, paints, facts } = R;
        S.P.rotary(R, 'hue', true);
        const section = e('div', 'wb-brightness', main);
        e('div', 'wb-brightness-label', section, 'Brightness');
        S.P.linear(R, section, 'brightness', 100, ctx.model.brightness, 'Bulb brightness');
        const out = e('strong', 'wb-brightness-value', section);
        const art = e('div', 'wb-bulb-art', aside);
        const svg = env.util.svg('svg', { viewBox: '0 0 120 160', 'shape-rendering': 'crispEdges', 'aria-label': 'Connected bulb' }, art);
        const add = (tag, attrs) => env.util.svg(tag, attrs, svg);
        add('path', { d: 'M46 149H76V155H68V159H54V155H46Z', fill: '#111' });
        add('path', { d: 'M30 100H90V121H84V143H77V150H44V144H36V123H30Z', fill: '#b8b8b8', stroke: '#000', 'stroke-width': 3 });
        add('path', { d: 'M39 124H83M38 136H81M44 146H77', fill: 'none', stroke: '#111', 'stroke-width': 5 });
        add('path', { d: 'M37 105V118H44V106M42 127H52V132H42M45 139H54V143H45', fill: '#f0f0f0' });
        const globe = add('path', { d: 'M40 6H78V10H91V18H101V29H109V40H113V70H109V83H101V94H91V103H30V98H22V89H14V77H9V43H13V29H21V19H31V11H40Z', fill: '#a35ced', stroke: '#000', 'stroke-width': 3 });
        const mid = add('path', { d: 'M38 15H76V20H89V29H98V42H104V68H98V82H87V91H34V85H23V73H18V46H23V32H30V23H38Z', fill: '#c98bff' });
        const glow = add('path', { d: 'M43 29H68V33H79V41H86V66H80V75H69V80H43V75H32V65H28V45H34V35H43Z', fill: '#dfb0ff' });
        const text = e('div', 'wb-bulb-facts', aside);
        e('strong', 'wb-room-name', text, R.s.room);
        const row = (label) => { const line = e('div', 'wb-property', text); e('span', '', line, label + ': '); return e('span', '', line); };
        const power = row('Power'), hueValue = row('Hue'), brightness = row('Brightness');
        facts['Power draw'] = row('Power Draw');
        paints.push(m => {
          out.textContent = m.brightness + '%';
          power.textContent = m.brightness ? 'On' : 'Off';
          hueValue.textContent = m.hue + '°';
          brightness.textContent = m.brightness + '%';
          globe.setAttribute('fill', `hsl(${m.hue} 73% 62%)`);
          mid.setAttribute('fill', `hsl(${m.hue} 90% 74%)`);
          glow.setAttribute('fill', `hsl(${m.hue} 100% 84%)`);
        });
      },
    },
  },
});
