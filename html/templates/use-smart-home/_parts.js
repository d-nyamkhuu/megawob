/* use-smart-home/_parts: classic console part registration, grouped by shell, controls and scenario.
 * install*(BASE, S) installs the original part keys in order; S.D and S.P resolve the live design.
 * No DOM work or randomness occurs until a part is called.
 */
(function () {
  'use strict';
  const F = () => env.taskDef;

  function installArtwork(BASE, S) {
    BASE.icon = (R, parent, name) => {
      const { D } = S;
      const svg = env.util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'ah-icon' }, parent);
      env.util.svg('path', { d: D.icons[name] || D.icons.device }, svg);
      return svg;
    };

    BASE.roomArt = (R, parent) => {
      const svg = env.util.svg('svg', { viewBox: '0 0 720 390', preserveAspectRatio: 'xMidYMid slice', class: 'ah-room-art', 'aria-hidden': 'true' }, parent);
      const add = (tag, attrs) => env.util.svg(tag, attrs, svg);
      add('rect', { width: 720, height: 390, fill: '#a8afa0' });
      add('path', { d: 'M0 300H720V390H0Z', fill: '#84745f' });
      add('path', { d: 'M0 0H172V300H0Z', fill: '#c7c7b4' });
      add('rect', { x: 30, y: 20, width: 230, height: 250, fill: '#3a4b49' });
      add('rect', { x: 40, y: 30, width: 210, height: 230, fill: '#c2d2c4' });
      add('path', { d: 'M40 210 98 103 137 165 192 79 250 191V260H40Z', fill: '#90ab9a' });
      add('path', { d: 'M112 30V260M184 30V260M40 149H250', stroke: '#4b5f57', 'stroke-width': 5, fill: 'none' });
      add('path', { d: 'M15 16H48V275H11ZM242 16h38v259h-34Z', fill: '#d9d0b7', opacity: .88 });
      add('path', { d: 'M38 270 230 275 370 390H102Z', fill: '#d1c1a0', opacity: .28 });
      add('ellipse', { cx: 407, cy: 348, rx: 210, ry: 28, fill: '#b7a48b' });
      add('rect', { x: 302, y: 82, width: 107, height: 90, rx: 2, fill: '#594e40' });
      add('rect', { x: 308, y: 88, width: 95, height: 78, fill: '#e0d2ae' });
      add('path', { d: 'M315 154 344 111 363 133 383 104 399 154Z', fill: '#7a8969' });
      add('rect', { x: 281, y: 220, width: 300, height: 91, rx: 23, fill: '#a9977c' });
      add('rect', { x: 272, y: 258, width: 317, height: 62, rx: 12, fill: '#c1b094' });
      add('rect', { x: 285, y: 228, width: 76, height: 53, rx: 9, fill: '#8b947c', transform: 'rotate(-8 323 254)' });
      add('rect', { x: 483, y: 230, width: 65, height: 53, rx: 8, fill: '#cec4a7', transform: 'rotate(7 514 255)' });
      add('path', { d: 'M290 317v17m278-17v17', stroke: '#453f35', 'stroke-width': 7 });
      add('ellipse', { cx: 403, cy: 334, rx: 78, ry: 17, fill: '#625d4a' });
      add('path', { d: 'M351 342v32m100-32v32', stroke: '#393e32', 'stroke-width': 5 });
      add('rect', { x: 382, y: 319, width: 32, height: 9, fill: '#d8c7a6' });
      add('rect', { x: 388, y: 313, width: 32, height: 6, fill: '#819391' });
      add('path', { d: 'M620 290V141m-1 69-38-37m38 13 36-45m-35 111 43-39', stroke: '#4d6148', 'stroke-width': 5, fill: 'none' });
      [[582, 167, -40], [648, 145, 35], [662, 209, 35], [615, 137, -5]].forEach(([cx, cy, rotation]) =>
      add('ellipse', { cx, cy, rx: 14, ry: 29, fill: '#526e4d', transform: `rotate(${rotation} ${cx} ${cy})` }));
      add('path', { d: 'M597 280h49l-8 49h-33Z', fill: '#9f7d62' });
      add('path', { d: 'M456 208V110m-20 0h40l-6-39h-28Z', stroke: '#645e49', 'stroke-width': 3, fill: '#c9b986' });
      add('rect', { x: 18, y: 318, width: 172, height: 8, fill: '#574e3d' });
      for (let i = 0; i < 7; i++) add('rect', { x: 29 + i * 19, y: 288 - i % 3 * 6, width: 14, height: 29 + i % 3 * 6, fill: ['#62796f', '#b7987a', '#d3c5a6'][i % 3] });
      return svg;
    };
  }

  function installChrome(BASE, S) {
    BASE.frame = (R) => {
      const { D } = S;
      const { ctx, size, e } = R;
      const compact = size.height < D.compactHeight || size.width < D.compactWidth;
      const app = e('div', 'ah-app' + (compact ? ' ah-compact' : '') + (size.width < D.narrowWidth ? ' ah-narrow' : ''), ctx.stage);
      app.style.width = Math.max(D.minWidth, size.width - D.frameInset) + 'px';
      app.style.height = Math.max(D.minHeight, size.height - D.frameInset) + 'px';
      for (const [key, value] of Object.entries(D.palette)) app.style.setProperty('--' + key, value);
      if (D.fontFamily !== null) app.style.fontFamily = D.fontFamily;
      if (D.fontSize !== null) app.style.fontSize = D.fontSize;
      return app;
    };

    BASE.showInfo = (R, title, lines) => {
      const { P } = S;
      const { ctx, e, inspector } = R;
      inspector.replaceChildren(); inspector.hidden = false;
      const header = e('div', 'ah-head', inspector); e('h3', 'ah-grow', header, title);
      const close = e('button', 'ah-utility', header); close.type = 'button'; close.setAttribute('aria-label', 'Close panel'); P.icon(R, close, 'close');
      close.addEventListener('click', () => { inspector.hidden = true; });
      lines.forEach(([label, detail]) => { const row = e('div', 'ah-run', inspector); e('strong', '', row, label); e('br', '', row); e('small', '', row, detail); });
      ctx.log('panel', { title });
    };

    BASE.utility = (R, parent, name, label, lines, cls = '') => {
      const { P } = S;
      const { e } = R;
      const b = e('button', 'ah-utility ' + cls, parent); b.type = 'button'; b.setAttribute('aria-label', label); b.title = label;
      if (name) P.icon(R, b, name);
      if (label && !cls.includes('icon-only')) e('span', 'ah-side-label', b, label);
      b.addEventListener('click', () => P.showInfo(R, label, lines || [['Nothing new', 'Your home hub is up to date.']]));
      return b;
    };

    BASE.top = (R) => {
      const { D, P } = S;
      const { s, e, media, app } = R;
      const top = e('div', 'ah-top', app);
      P.icon(R, e('div', 'ah-logo', top), media ? 'music' : 'home');
      e('div', 'ah-brand', top, media ? D.mediaBrand : D.homeBrand);
      e('span', 'ah-muted ah-grow', top, media ? D.mediaTagline : s.home);
      P.utility(R, top, 'search', media ? 'Search your library' : 'Find a device', media ? [['Albums', 'Amber Lines / Quiet Rooms'], ['Playlists', 'Slow living, Night shift, Weekend journal'], ['Videos', 'Home stories / 4 episodes']] : [['Rooms', 'Living room, Kitchen, Bedroom, Studio'], ['Devices', '12 connected devices across 4 rooms']], 'ah-search');
      P.utility(R, top, 'bell', 'Notifications', media ? [['Library sync paused', 'Listening history is stored on this device.'], ['New in your library', 'Quiet Rooms by Amber Lines is ready.']] : [['Hallway sensor', 'Battery low: 15%. Last reported 2 hours ago.'], ['Hub firmware 3.9', 'An update is available for the home hub.'], ['No critical alerts', 'Your home is operating normally.']], 'icon-only');
      const connection = e('span', 'ah-pill', top); e('i', 'ah-dot', connection); connection.append(media ? 'Local library' : 'Connected');
      e('div', 'ah-avatar', top, s.owner.split(' ').map(w => w[0]).slice(0, 2).join('')).title = s.owner;
    };

    BASE.navigation = (R) => {
      const { P } = S;
      const { s, e, media, app } = R;
      const nav = e('div', 'ah-nav', app);
      const navs = media ? ['Overview', 'Music library', 'Playlists', 'Videos'] : ['Overview', 'Rooms', 'Automations', 'Activity'];
      navs.forEach((name, i) => P.utility(R, nav, null, name, [[name, media ? 'Browse your saved collection and recently added media.' : 'Manage the rooms, devices and routines in this home.']], i === (s.scenario === 'scene' ? 2 : media ? s.scenario === 'scrub' ? 3 : 2 : 1) ? 'selected' : ''));
    };

    BASE.shell = (R) => {
      const { e, app } = R;
      return e('div', 'ah-shell', app);
    };

    BASE.sidebar = (R, shell) => {
      const { P } = S;
      const { s, e, media } = R;
      const sidebar = e('aside', 'ah-sidebar', shell);
      e('div', 'ah-side-heading', sidebar, media ? 'Your library' : 'Household');
      (media ? [['home', 'Home'], ['search', 'Browse'], ['heart', 'Liked songs'], ['list', 'Slow living'], ['list', 'Night shift'], ['list', 'Weekend journal'], ['video', 'Home stories']] :
      [['grid', 'Favorites'], ['device', 'All devices'], ['home', s.room], ['clock', 'Automations'], ['activity', 'Activity log']]).forEach(([name, label]) =>
      P.utility(R, sidebar, name, label, [[label, media ? 'Saved locally / available offline' : 'Home hub / devices connected'], ['Last updated', 'Today at 08:42']], label === s.room || label === (s.scenario === 'playlist' ? 'Slow living' : s.scenario === 'scrub' ? 'Home stories' : s.scenario === 'scene' ? 'Automations' : '') ? 'current' : ''));
      e('div', 'ah-side-heading', sidebar, media ? 'Recently added' : 'Other rooms');
      (media ? [['Quiet Rooms', 'Album'], ['Blue hour', 'Mix'], ['Sunday notes', 'Playlist']] : [['Kitchen', '3'], ['Bedroom', '4'], ['Studio', '2']]).forEach(([name, count]) => {
        const row = e('div', 'ah-side-row', sidebar); P.icon(R, row, media ? 'music' : 'home'); e('span', '', row, name); e('b', '', row, count);
      });
      const hub = e('div', 'ah-hub', sidebar);
      if (media) { P.icon(R, hub, 'screen'); e('span', '', hub, ' This computer'); e('div', '', hub, 'Offline listening enabled'); }
      else { e('i', 'ah-dot', hub); e('strong', '', hub, 'Home hub online'); e('div', '', hub, '12 devices / 4 rooms'); const warning = e('div', '', hub); e('i', 'ah-dot warning', warning); warning.append('1 accessory needs attention'); }
    };

    BASE.body = (R, shell) => {
      const { D } = S;
      const { size, e } = R;
      const body = e('div', 'ah-body', shell);
      body.style.gridTemplateColumns = `minmax(0,1fr) ${Math.min(D.asideMax, Math.max(D.asideMin, size.width * D.asideFraction))}px`;
      const main = e('div', 'ah-main', body), aside = e('aside', 'ah-aside', body);
      return { main, aside };
    };

    BASE.heading = (R) => {
      const { P } = S;
      const { s, e, media, main } = R;
      const head = e('div', 'ah-head', main), titleBox = e('div', 'ah-grow', head);
      e('div', 'ah-eyebrow', titleBox, media ? 'LIBRARY / ' + (s.scenario === 'playlist' ? 'PLAYLIST' : 'HOME STORIES') : 'MY HOME / ' + s.room.toUpperCase());
      e('h2', '', titleBox, s.scenario === 'thermostat' ? 'Climate control' : s.scenario === 'lightcolor' ? 'Ambient light' : s.scenario === 'scene' ? s.sceneName : s.scenario === 'playlist' ? 'Slow living' : s.title);
      e('div', 'ah-description', titleBox, s.scenario === 'thermostat' ? 'Lumen T2 / ' + s.room : s.scenario === 'lightcolor' ? 'Ceiling bulb / Lumen Colour A19' : s.scenario === 'scene' ? 'Time-based routine / Home hub' : s.scenario === 'playlist' ? `By ${s.owner} / Private playlist` : 'Stillwave Films / Home stories / Episode 04');
      P.utility(R, head, 'more', 'More options', [['Details', media ? 'Private collection. Available on this computer.' : s.serial + ' / Connected through the home hub.'], ['Help', 'Your changes are stored locally.']], 'icon-only');
    };

    BASE.toolbar = (R) => {
      const { P } = S;
      const { s, e, media, main } = R;
      const toolbar = e('div', 'ah-toolbar', main);
      const tabs = e('div', '', toolbar);
      const tabDetails = {
        Temperature: [['Temperature control', 'Manual hold is active until the next scheduled change.']],
        Schedule: [['Comfort / 18:00', 'Every weekday / Home local time'], ['Sleep / 22:30', 'Every day / Energy saving']],
        History: [['Today, 07:00', 'Comfort schedule started'], ['Yesterday, 22:30', 'Sleep schedule started']],
        Colour: [['Colour control', 'Full colour / 0 to 359 degrees'], ['Brightness', 'Dimmable / 0 to 100%']],
        White: [['Warm white', '2700 K / Relaxed evenings'], ['Daylight', '6500 K / Clear, cool light']],
        Effects: [['Candlelight', 'A warm, gently changing glow'], ['Prism', 'A slow cycle through the colour spectrum']],
        Configuration: [['Time-based routine', 'Runs on the selected days, even when your phone is offline.']],
        'Run history': [['Yesterday, 18:30', 'Completed / All devices responded'], ['Mon, 18:30', 'Completed / Home hub']],
        Tracks: [['Slow living', 'Custom order / Private playlist']],
        Recommendations: [['Quiet Rooms', 'Album / Amber Lines'], ['Field Notes', 'Album / Moss Circuit'], ['Open Windows', 'Album / Harbor Assembly']],
        Watch: [['Playback position', 'Saved automatically on this computer.']],
        Details: [['Stillwave Films', 'Home stories / Episode 04'], ['Audio and captions', 'English stereo / English captions available']],
      };
      (s.scenario === 'thermostat' ? ['Temperature', 'Schedule', 'History'] : s.scenario === 'lightcolor' ? ['Colour', 'White', 'Effects'] : s.scenario === 'scene' ? ['Configuration', 'Run history'] : s.scenario === 'playlist' ? ['Tracks', 'Recommendations'] : ['Watch', 'Details']).forEach((name, i) =>
      P.utility(R, tabs, null, name, tabDetails[name], 'ah-tab' + (i === 0 ? ' current' : '')));
      P.utility(R, toolbar, media ? 'heart' : 'settings', media ? 'Save to library' : 'Device settings', [[media ? 'Saved collection' : 'Device information', media ? 'This item is available offline.' : s.serial + ' / Firmware 3.8 / Strong signal']], 'icon-only');
    };

    BASE.statusbar = (R) => {
      const { P } = S;
      const { e, media, app } = R;
      const statusbar = e('div', 'ah-statusbar', app); P.icon(R, statusbar, media ? 'screen' : 'wifi');
      e('span', 'ah-grow', statusbar, media ? 'This computer / Local playback' : 'Home hub / All changes sync automatically');
      e('span', '', statusbar, media ? 'Library updated today' : 'Last synced just now');
    };

    BASE.inspector = (R) => {
      const { e, app } = R;
      const inspector = e('section', 'ah-inspector', app); inspector.hidden = true;
      return inspector;
    };
  }

  function installControls(BASE, S) {
    BASE.fact = (R, label) => {
      const { e, aside, facts } = R;
      const row = e('div', 'ah-fact', aside); e('span', '', row, label); facts[label] = e('strong', '', row);
    };

    BASE.infoRow = (R, parent, label, value) => {
      const { e } = R;
      const row = e('div', 'ah-info-row', parent); e('span', '', row, label); return e('strong', '', row, value);
    };

    BASE.button = (R, parent, label, key, action) => {
      const { e, buttons } = R;
      const b = e('button', 'ah-btn', parent, label); b.type = 'button'; b.addEventListener('click', action); buttons[key] = b; return b;
    };

    BASE.patch = (R, value) => {
      const { P } = S;
      const { ctx } = R;
      ctx.patch(value); P.paint(R, ctx.model);
    };

    BASE.paint = (R, m) => {
      const { s, facts, paints } = R;
      for (const f of F().facts(m, s)) if (facts[f.label]) facts[f.label].textContent = f.value;
      for (const fn of paints) fn(m);
    };

    BASE.slider = (R, parent, label) => {
      const { e } = R;
      const track = e('div', 'ah-slider-line', parent);
      e('div', 'ah-rail', track);
      const fill = e('div', 'ah-fill', track), thumb = e('div', 'ah-thumb', track);
      thumb.setAttribute('aria-label', label);
      return { track, fill, thumb };
    };

    BASE.linear = (R, parent, control, max, value, label) => {
      const { P } = S;
      const { controls, paints } = R;
      const { track, fill, thumb } = P.slider(R, parent, label);
      const api = env.ui.slider(track, { thumbs: [thumb], min: 0, max, step: 1, value,
        onInput: ([v]) => P.patch(R, { [control]: v }), label });
      controls[control] = api;
      paints.push(m => { api.set([m[control]]); fill.style.width = 100 * m[control] / max + '%'; });
      return track;
    };

    BASE.ring = (R, area, hue, diameter) => {
      const { s, e } = R;
      const ring = e('div', 'ah-ring ' + (hue ? 'ah-wheel' : 'ah-thermo'), area);
      ring.style.width = ring.style.height = diameter + 'px';
      ring.setAttribute('role', 'slider'); ring.setAttribute('aria-label', hue ? 'Bulb hue' : 'Thermostat setpoint');
      ring.setAttribute('aria-valuemin', hue ? '0' : String(s.min)); ring.setAttribute('aria-valuemax', hue ? '359' : String(s.max));
      const inner = e('div', 'ah-ring-inner', ring);
      e('span', 'ah-muted', inner, hue ? 'COLOUR' : 'SETPOINT');
      const readout = e('span', 'ah-digits', inner);
      const detail = e('span', 'ah-muted', inner);
      const grip = e('span', 'ah-ring-grip', ring);
      return { ring, readout, detail, grip };
    };

    BASE.roomContext = (R, area, hue) => {
      const { P } = S;
      const { s, size, e } = R;
      if (size.width > 1150 && size.height > 580) {
        const context = e('section', 'ah-room-context', area);
        e('h3', '', context, hue ? 'Around the room' : 'Climate in other rooms');
        e('div', 'ah-description', context, hue ? 'Connected lights / Live status' : 'Indoor sensors / Updated just now');
        const otherRooms = ['Living room', 'Kitchen', 'Studio', 'Bedroom', 'Sunroom'].filter(name => name !== s.room).slice(0, 3)
          .map((name, i) => [name, ['21°C / Heating', '20°C / Standby', '18°C / Cooling'][i]]);
        (hue ? [['Reading lamp', 'On / Warm white / 40%'], ['Shelf light', 'On / Soft amber / 25%'], ['Desk lamp', 'Unreachable / Last seen yesterday']] : otherRooms).forEach(([title, detail]) => {
          const row = e('div', 'ah-run', context); e('strong', '', row, title); e('br', '', row); e('small', '', row, detail);
        });
        P.utility(R, context, hue ? 'clock' : 'activity', hue ? 'Room automations' : 'Energy activity', hue ? [['Evening calm', 'Every day / 18:30'], ['Wind down', 'Every day / 22:00']] : [['Runtime today', 'Heating 1 h 24 min / Cooling 0 min'], ['Weekly average', '1 h 38 min per day']]);
      }
    };

    BASE.rotary = (R, control, hue) => {
      const { D, P } = S;
      const { ctx, s, e, main, controls, paints } = R;
      const area = e('div', 'ah-ring-area', main);
      let diameter = hue ? D.hueDiameter : D.temperatureDiameter;
      const { ring, readout, detail, grip } = P.ring(R, area, hue, diameter);
      P.roomContext(R, area, hue);
      if (!hue) { e('span', 'ah-ring-label low', ring, s.min + '°'); e('span', 'ah-ring-label high', ring, s.max + '°'); }
      const radius = () => diameter / 2 - 8;
      const api = env.ui.dial(ring, { angle: hue ? ctx.model.hue : F().helpers.dialAngle(s, ctx.model.temp),
        radius, band: [() => diameter / 2 - 31, () => diameter / 2 + 3], start: hue ? 0 : 225, sweep: hue ? 360 : 270,
        min: hue ? 0 : s.min, max: hue ? 360 : s.max, step: 1,
        label: hue ? 'bulb hue' : 'thermostat dial',
        onInput: (angle, value) => P.patch(R, hue ? { hue: Math.round(value) % 360 } : { temp: Math.round(value) }) });
      controls[control] = api;
      R.fitRing = () => {
        diameter = Math.max(100, Math.min(hue ? D.hueDiameter : D.temperatureDiameter, area.clientHeight - 8, area.clientWidth - 22));
        ring.style.width = ring.style.height = diameter + 'px';
        readout.style.fontSize = Math.min(D.readoutSize, diameter * .23) + 'px';
        detail.style.display = diameter < 145 ? 'none' : '';
      };
      paints.push(m => {
        const angle = hue ? m.hue : F().helpers.dialAngle(s, m.temp);
        api.set(angle);
        grip.style.left = diameter / 2 + radius() * Math.sin(angle * Math.PI / 180) + 'px';
        grip.style.top = diameter / 2 - radius() * Math.cos(angle * Math.PI / 180) + 'px';
        readout.textContent = hue ? m.hue + '°' : m.temp + '°';
        detail.textContent = hue ? 'Full colour' : m.mode === 'heat' ? 'Heat mode' : 'Cool mode';
        ring.setAttribute('aria-valuenow', String(hue ? m.hue : m.temp));
      });
    };
  }

  function installClimate(BASE, S) {
    BASE.thermostatAside = (R) => {
      const { P } = S;
      const { s, util, e, aside } = R;
      const summary = e('div', 'ah-device-summary', aside); P.icon(R, summary, 'heat');
      const summaryText = e('div', '', summary); e('strong', '', summaryText, s.room); e('span', 'ah-muted', summaryText, 'Indoor sensor / Connected');
      ['System status', 'Room temperature', 'Humidity'].forEach(label => P.fact(R, label));
      const note = e('div', 'ah-notice', aside);
      e('strong', '', note, 'Lumen T2 thermostat');
      e('div', '', note, `Supported range ${s.min}–${s.max}°C · 1° increments`);
      e('div', '', note, s.serial + ' · Firmware 3.8');
      e('div', 'ah-subhead', aside, 'Temperature / past 24 hours');
      const chart = util.svg('svg', { viewBox: '0 0 200 48', class: 'ah-chart', 'aria-label': 'Recorded room temperature history' }, aside);
      util.svg('path', { d: 'M0 12H200M0 36H200', stroke: 'var(--line)', 'stroke-width': 1 }, chart);
      util.svg('path', { d: 'M0 32 15 35 30 33 45 38 60 26 75 30 90 18 105 20 120 14 135 22 150 11 165 16 180 20 200 17', stroke: 'currentColor', 'stroke-width': 2, fill: 'none' }, chart);
      const chartLabels = e('div', 'ah-chart-labels', aside); ['00:00', '12:00', 'Now'].forEach(label => e('span', '', chartLabels, label));
      const equipment = e('div', 'ah-extra', aside); e('div', 'ah-subhead', equipment, 'Equipment');
      P.infoRow(R, equipment, 'Fan', 'Automatic'); P.infoRow(R, equipment, 'Connectivity', 'Strong signal');
    };

    BASE.renderThermostat = (R) => {
      const { P } = S;
      const { s, e, main, buttons, paints } = R;
      P.thermostatAside(R);
      P.rotary(R, 'temperature', false);
      const modes = e('div', 'ah-segments', main);
      ['heat', 'cool'].forEach(mode => { const b = P.button(R, modes, mode === 'heat' ? 'Heat' : 'Cool', 'mode:' + mode, () => P.patch(R, { mode })); b.prepend(P.icon(R, null, mode)); });
      const schedule = e('div', 'ah-detail-card', main);
      const hold = P.infoRow(R, schedule, 'Temperature hold', 'Until next scheduled change');
      P.infoRow(R, schedule, 'Next schedule', 'Comfort / 18:00');
      paints.push(m => { hold.textContent = F().helpers.operating(m, s) === 'Standby' ? 'At setpoint / monitoring' : 'Until next scheduled change'; });
      paints.push(m => ['heat', 'cool'].forEach(mode => buttons['mode:' + mode].classList.toggle('on', m.mode === mode)));
    };

    BASE.preset = (R, parent, preset) => {
      const { P } = S;
      const { e } = R;
      const [name, color, hue, brightness] = preset;
      const b = e('button', 'ah-preset', parent); b.type = 'button'; e('span', 'ah-preset-swatch', b).style.background = color; b.append(name);
      b.addEventListener('click', () => P.patch(R, { hue, brightness }));
      return b;
    };

    BASE.lightcolorAside = (R) => {
      const { D, P } = S;
      const { s, e, aside } = R;
      const summary = e('div', 'ah-device-summary', aside); P.icon(R, summary, 'bulb');
      const text = e('div', '', summary); e('strong', '', text, 'Ceiling bulb'); e('span', 'ah-muted', text, s.room);
      ['Power draw', 'Connection'].forEach(label => P.fact(R, label));
      const swatch = e('div', 'ah-swatch', aside); swatch.setAttribute('aria-label', 'Current light colour');
      e('div', 'ah-subhead', aside, 'Scene gallery');
      const presets = e('div', 'ah-presets', aside);
      D.lightingPresets.forEach(preset => P.preset(R, presets, preset));
      e('div', 'ah-notice', aside, `Lumen Colour A19 · ${s.serial}. Hue 0–359° · brightness 0–100%. Changes apply immediately.`);
      const extras = e('div', 'ah-extra', aside); e('div', 'ah-subhead', extras, 'Accessories'); e('div', 'ah-muted', extras, 'No dimmer switch paired');
      return swatch;
    };

    BASE.renderLightcolor = (R) => {
      const { P } = S;
      const { ctx, s, e, main, aside, paints } = R;
      const swatch = P.lightcolorAside(R);
      P.rotary(R, 'hue', true);
      const section = e('div', 'ah-light-controls', main), line = e('div', 'ah-slider-caption', section);
      const label = e('span', '', line); P.icon(R, label, 'heat'); label.append(' Brightness'); const out = e('strong', '', line);
      P.linear(R, section, 'brightness', 100, ctx.model.brightness, 'Bulb brightness');
      const lightInfo = e('div', 'ah-detail-card ah-extra', aside); P.infoRow(R, lightInfo, 'Power-on behaviour', 'Last used colour');
      paints.push(m => { out.textContent = m.brightness + '%'; swatch.style.background = `hsl(${m.hue} 78% ${12 + m.brightness * .45}%)`; });
    };
  }

  function installScene(BASE, S) {
    BASE.sceneAside = (R) => {
      const { P } = S;
      const { e, aside } = R;
      e('h3', '', aside, 'Automation summary');
      ['Schedule status', 'Included devices', 'Devices on'].forEach(label => P.fact(R, label));
      e('div', 'ah-subhead', aside, 'Recent runs');
      [['Yesterday, 18:30', 'Completed / All devices responded'], ['Mon, 18:30', 'Completed / Home hub']].forEach(([time, text]) => { const row = e('div', 'ah-run', aside); e('strong', '', row, time); e('br', '', row); e('small', '', row, text); });
      e('div', 'ah-notice ah-extra', aside, 'Runs locally on your home hub. Excluded devices keep their current state. Times use the home’s local time zone.');
    };

    BASE.sceneLayout = (R) => {
      const { e, main } = R;
      const layout = e('div', 'ah-scene-layout', main);
      const timing = e('div', 'ah-section', layout), devices = e('div', 'ah-section', layout);
      devices.style.display = 'flex'; devices.style.flexDirection = 'column'; devices.style.minHeight = '0';
      return { timing, devices };
    };

    BASE.sceneTiming = (R, timing) => {
      const { P } = S;
      const { ctx, e } = R;
      e('h3', '', timing, 'When');
      const time = P.button(R, timing, '', 'time', () => P.patch(R, { picker: !ctx.model.picker })); time.classList.add('ah-time');
      e('h3', '', timing, 'Repeat on'); const days = e('div', 'ah-days', timing);
      F().helpers.DAYS.forEach((name, i) => P.button(R, days, name, 'day:' + i, () => P.patch(R, { days: ctx.model.days.includes(i) ? ctx.model.days.filter(d => d !== i) : [...ctx.model.days, i].sort(), saved: false })));
      const options = e('div', 'ah-detail-card', timing); P.infoRow(R, options, 'Time zone', 'Home local time'); P.infoRow(R, options, 'When away', 'Run as scheduled');
      return time;
    };

    BASE.deviceRow = (R, pane, name, i) => {
      const { P } = S;
      const { ctx, s, e } = R;
      const row = e('div', 'ah-device', pane), deviceName = e('div', 'ah-device-name', row); P.icon(R, deviceName, name.includes('speaker') ? 'volume' : 'bulb'); deviceName.append(name);
      e('div', 'ah-device-meta', row, s.room + ' / Connected');
      [null, 'on', 'off'].forEach(state => P.button(R, row, state === null ? 'Exclude' : state === 'on' ? 'On' : 'Off', `device:${i}:${state}`, () => {
        const states = [...ctx.model.states]; states[i] = state; P.patch(R, { states, saved: false });
      }));
      return row;
    };

    BASE.sceneDevices = (R, devices) => {
      const { P } = S;
      const { ctx, s, e } = R;
      e('h3', '', devices, 'Device actions');
      const pane = e('div', 'ah-device-pane', devices);
      R.devicePane = pane;
      R.recordDevicePane = () => {
        const r = pane.getBoundingClientRect();
        ctx.patch({ devicePane: { scroll: pane.scrollTop, height: pane.clientHeight,
            rows: [...pane.children].map(row => { const b = row.getBoundingClientRect(); return [b.top - r.top + pane.scrollTop, b.bottom - r.top + pane.scrollTop]; }) } });
      };
      env.ui.scrollPane(pane, { onScroll: R.recordDevicePane });
      s.devices.forEach((name, i) => P.deviceRow(R, pane, name, i));
      return pane;
    };

    BASE.sceneActions = (R) => {
      const { P } = S;
      const { e, main } = R;
      const actions = e('div', 'ah-actions', main);
      const saveState = e('span', 'ah-muted', actions);
      P.button(R, actions, 'Save schedule', 'save', () => P.patch(R, { saved: true })).classList.add('primary');
      return saveState;
    };

    BASE.scenePicker = (R) => {
      const { P } = S;
      const { ctx, e, main } = R;
      const picker = e('div', 'ah-picker', main); picker.hidden = true;
      e('h3', '', picker, 'Choose a time'); e('span', 'ah-muted', picker, 'Hour');
      const hours = e('div', 'ah-picker-grid', picker);
      for (let h = 0; h < 24; h++) P.button(R, hours, String(h).padStart(2, '0'), 'hour:' + h, () => P.patch(R, { time: h * 60 + ctx.model.time % 60, saved: false }));
      e('span', 'ah-muted', picker, 'Minute'); const minutes = e('div', 'ah-picker-grid', picker);
      for (let m = 0; m < 60; m += 5) P.button(R, minutes, String(m).padStart(2, '0'), 'minute:' + m, () => P.patch(R, { time: Math.floor(ctx.model.time / 60) * 60 + m, picker: false, saved: false }));
      P.button(R, picker, 'Done', 'closePicker', () => P.patch(R, { picker: false }));
      return picker;
    };

    BASE.renderScene = (R) => {
      const { P } = S;
      const { s, buttons, paints } = R;
      P.sceneAside(R);
      const { timing, devices } = P.sceneLayout(R);
      const time = P.sceneTiming(R, timing);
      const pane = P.sceneDevices(R, devices);
      const saveState = P.sceneActions(R);
      const picker = P.scenePicker(R);
      paints.push(m => {
        time.replaceChildren(); P.icon(R, time, 'clock'); time.append(F().helpers.timeText(m.time)); P.icon(R, time, 'chevron'); picker.hidden = !m.picker;
        saveState.textContent = m.saved ? 'Saved to home hub' : 'Unsaved changes';
        if (m.devicePane) pane.scrollTop = m.devicePane.scroll;
        F().helpers.DAYS.forEach((_, i) => buttons['day:' + i].classList.toggle('on', m.days.includes(i)));
        s.devices.forEach((_, i) => [null, 'on', 'off'].forEach(state => buttons[`device:${i}:${state}`].classList.toggle('on', m.states[i] === state)));
        for (let h = 0; h < 24; h++) buttons['hour:' + h].classList.toggle('on', Math.floor(m.time / 60) === h);
        for (let v = 0; v < 60; v += 5) buttons['minute:' + v].classList.toggle('on', m.time % 60 === v);
      });
    };
  }

  function installMedia(BASE, S) {
    BASE.playlistAside = (R) => {
      const { P } = S;
      const { s, e, aside, facts } = R;
      e('h3', '', aside, 'Listening plan');
      e('div', 'ah-description', aside, 'Shared by ' + s.owner.split(' ')[0] + ' / Custom sequence');
      const plan = e('ol', 'ah-plan', aside);
      s.goal.order.forEach(id => e('li', '', plan, s.tracks.find(t => t.id === id).title));
      const total = e('div', 'ah-queue-total', aside);
      ['Tracks', 'Queue duration'].forEach(label => { P.fact(R, label); total.append(facts[label].parentElement); });
    };

    BASE.queueHeading = (R) => {
      const { P } = S;
      const { e, main } = R;
      const listHead = e('div', 'ah-queue-head', main); e('span', '', listHead, '#'); e('span', 'ah-grow', listHead, 'Title / Artist'); e('span', 'ah-album', listHead, 'Album'); P.icon(R, listHead, 'clock');
    };

    BASE.playlistFooter = (R) => {
      const { P } = S;
      const { e, main } = R;
      const footer = e('div', 'ah-player-footer', main); const play = e('button', 'ah-play', footer); play.type = 'button'; play.setAttribute('aria-label', 'Play preview'); P.icon(R, play, 'play');
      play.addEventListener('click', () => P.showInfo(R, 'Playback unavailable', [['Audio preview', 'This local collection contains track information only. Connect a media source to listen.']]));
      e('div', 'ah-muted ah-grow', footer, 'Paused / This computer'); P.utility(R, footer, 'shuffle', 'Shuffle', [['Shuffle', 'Off / The playlist uses your custom order.']], 'icon-only'); P.utility(R, footer, 'repeat', 'Repeat', [['Repeat', 'Off / Repeat this playlist from playback settings.']], 'icon-only');
    };

    BASE.trackRow = (R, queue, t, i, rowHeight) => {
      const { D, P } = S;
      const { e } = R;
      const row = e('div', 'ah-track', queue); row.style.height = rowHeight + 'px';
      P.icon(R, e('span', 'ah-grip', row), 'grip').parentElement.setAttribute('aria-label', 'Reorder ' + t.title);
      const number = e('small', '', row);
      const cover = e('div', 'ah-cover', row); P.icon(R, cover, 'music'); cover.style.setProperty('--art', D.artColors[i % D.artColors.length]);
      if (rowHeight < 35) cover.style.width = cover.style.height = '22px';
      const text = e('div', 'ah-grow', row); e('div', 'ah-track-title', text, t.title);
      if (rowHeight < 36) text.classList.add('ah-inline-track');
      e('span', 'ah-track-artist', text, t.artist);
      e('span', 'ah-album', row, D.albums[i % D.albums.length]);
      e('small', '', row, F().helpers.durationText(t.duration));
      return { row, number };
    };

    BASE.renderPlaylist = (R) => {
      const { D, P } = S;
      const { ctx, s, e, main, controls, paints } = R;
      P.playlistAside(R);
      P.queueHeading(R);
      const pane = e('div', 'ah-queue-pane', main), queue = e('div', 'ah-queue', pane);
      P.playlistFooter(R);
      const rowHeight = Math.max(D.rowMin, Math.min(D.rowMax, Math.floor(pane.clientHeight / s.tracks.length)));
      queue.style.height = rowHeight * s.tracks.length + 'px';
      const cards = {}, numbers = {};
      s.tracks.forEach((t, i) => { const { row, number } = P.trackRow(R, queue, t, i, rowHeight); cards[t.id] = row; numbers[t.id] = number; });
      const sortable = env.ui.sortable(queue, { order: ctx.model.order, items: cards, handle: '.ah-grip', axis: 'y', bounds: 'center',
        slotRect: i => [0, i * rowHeight, queue.clientWidth, rowHeight], activeClass: 'dragging', label: 'playlist track',
        onChange: order => P.patch(R, { order }) });
      controls.queue = sortable;
      env.ui.scrollPane(pane, { onScroll: scroll => { ctx.patch({ scroll }); } });
      paints.push(m => { sortable.set(m.order); pane.scrollTop = m.scroll || 0; m.order.forEach((id, i) => { numbers[id].textContent = String(i + 1).padStart(2, '0'); }); });
    };

    BASE.chapterRow = (R, c) => {
      const { e, aside } = R;
      const row = e('div', 'ah-chapter', aside); e('div', 'ah-chapter-thumb', row); const text = e('div', '', row); e('span', '', text, c.title); e('small', '', text, F().helpers.durationText(c.time));
      return row;
    };

    BASE.scrubAside = (R) => {
      const { P } = S;
      const { s, e, aside } = R;
      e('h3', '', aside, 'Chapters'); const chapterRows = [];
      s.chapters.forEach(c => chapterRows.push(P.chapterRow(R, c)));
      ['Chapter', 'Remaining'].forEach(label => P.fact(R, label));
      const related = e('div', 'ah-extra', aside); e('div', 'ah-subhead', related, 'Up next');
      ['Objects with a story', 'The listening room'].forEach(title => { const row = e('div', 'ah-related', related); e('div', 'ah-cover', row); const text = e('div', '', row); e('strong', '', text, title); e('div', 'ah-description', text, 'Stillwave Films / 8 min'); });
      return chapterRows;
    };

    BASE.video = (R) => {
      const { P } = S;
      const { e, main } = R;
      const video = e('div', 'ah-video', main);
      P.roomArt(R, video); e('div', 'ah-film-credit', video, 'STILLWAVE ORIGINALS');
      const caption = e('div', 'ah-video-caption', video);
      return caption;
    };

    BASE.transport = (R) => {
      const { P } = S;
      const { s, e, main } = R;
      const line = e('div', 'ah-player-footer', main);
      P.utility(R, line, 'play', 'Playback', [['Playback paused', 'Position is saved locally so you can resume here later.']], 'icon-only');
      const position = e('strong', '', line); e('span', 'ah-muted ah-grow', line, '/ ' + F().helpers.durationText(s.duration));
      P.utility(R, line, 'volume', 'Volume', [['Volume', '80% / System output']], 'icon-only');
      P.utility(R, line, 'settings', 'Playback quality', [['Quality', '1080p / Original'], ['Captions', 'English / Off'], ['Speed', '1x / Normal']], 'icon-only');
      P.utility(R, line, 'expand', 'Theater mode', [['Theater mode', 'The video is fitted to the current workspace.']], 'icon-only');
      return position;
    };

    BASE.preview = (R, track) => {
      const { P } = S;
      const { e } = R;
      const preview = e('div', 'ah-preview', track); preview.hidden = true;
      P.roomArt(R, e('div', 'ah-preview-art', preview)); const previewText = e('div', 'ah-preview-text', preview);
      return { preview, previewText };
    };

    BASE.renderScrub = (R) => {
      const { P } = S;
      const { ctx, s, e, main, paints } = R;
      const chapterRows = P.scrubAside(R);
      const caption = P.video(R);
      const position = P.transport(R);
      const track = P.linear(R, main, 'position', s.duration, ctx.model.position, 'Video position');
      s.chapters.slice(1).forEach(c => { const marker = e('div', 'ah-marker', track); marker.style.left = c.time / s.duration * 100 + '%'; });
      const { preview, previewText } = P.preview(R, track);
      track.addEventListener('pointermove', event => {
        const r = track.getBoundingClientRect(), fraction = Math.max(0, Math.min(1, (event.clientX - r.left) / r.width));
        P.patch(R, { preview: Math.round(fraction * s.duration) });
      });
      track.addEventListener('pointerleave', () => P.patch(R, { preview: null }));
      paints.push(m => {
        position.textContent = F().helpers.durationText(Math.round(m.position)); const ch = F().helpers.chapter(m, s); caption.textContent = 'Paused / ' + ch.title;
        chapterRows.forEach((row, i) => row.classList.toggle('active', s.chapters[i] === ch));
        preview.hidden = m.preview === null; previewText.textContent = F().helpers.durationText(m.preview || 0) + ' / ' + F().helpers.chapter({ position: m.preview || 0 }, s).title;
        preview.style.left = Math.max(17, Math.min(83, 100 * (m.preview || 0) / s.duration)) + '%';
      });
    };
  }

  function installLocate(BASE, S) {
    BASE.locate = (R, t) => {
      const { controls, buttons, main, devicePane } = R;
      const center = el => env.util.center(el);
      if (t.control) {
        const api = controls[t.control];
        if (t.control === 'temperature' || t.control === 'hue') return t.current ? api.locateGrip() : api.locate(t.value);
        return t.current ? api.locateThumb(0) : api.locate(t.value, 0);
      }
      if (t.item !== undefined) return controls.queue.locate(t.item);
      if (t.slot !== undefined) return controls.queue.locateSlot(t.slot);
      if (t.mode) return center(buttons['mode:' + t.mode]);
      if (t.timePicker) return center(buttons.time);
      if (t.closePicker) return center(buttons.closePicker);
      if (t.hour !== undefined) return center(buttons['hour:' + t.hour]);
      if (t.minute !== undefined) return center(buttons['minute:' + t.minute]);
      if (t.day !== undefined) return center(buttons['day:' + t.day]);
      if (t.device !== undefined) return center(buttons[`device:${t.device}:${t.state}`]);
      if (t.save) return center(buttons.save);
      if (t.pane) return center(devicePane || main);
      throw new Error('use-smart-home: unknown target ' + JSON.stringify(t));
    };

    BASE.rendered = (R) => {};
  }

  env.template('use-smart-home/_parts', () => ({
    installArtwork, installChrome, installControls, installClimate, installScene, installMedia, installLocate,
  }));
})();
