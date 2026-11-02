/*
 * use-smart-home: set thermostats, lights, scenes, playlists and video position in a home console.
 * A connected home and media console. Real-app counterparts: smart thermostats,
 * connected bulb controllers, home automation schedulers, music queues and chaptered video players.
 * Fictional product and media names; no MiniWoB counterpart.
 *
 * Scenarios: thermostat (rotary setpoint + heat/cool), lightcolor (circular hue + brightness),
 * scene (time picker, repeat days, device actions, Save schedule), playlist (drag queue order),
 * scrub (timeline seek, chapter markers and hover preview; playback stays paused).
 *
 * spec: common {scenario, level, ood, startMode, isplit, csplit, home, room, owner, serial,
 *   ambient, humidity, goal}; thermostat {min,max,goal:{temp,mode}}; lightcolor
 *   {goal:{hue,brightness}}; scene {sceneName,devices:[name],goal:{time:minutes,days:[0..6],
 *   states:[null|'on'|'off']}}; playlist {tracks:[{id,title,artist,duration}],goal:{order:[id]}};
 *   scrub {title,duration,chapters:[{title,time}],goal:{position:seconds}}.
 * model: thermostat {temp,mode}; lightcolor {hue,brightness}; scene {time,days,states,saved,
 *   picker:bool,devicePane?:{scroll,height,rows:[[top,bottom]]} (unscored layout)};
 *   playlist {order,scroll:unscored px}; scrub {position,preview:seconds|null}.
 * Inputs: pointer; wheel on scene / playlist for inner panes. All times are local, 24-hour.
 * Error: graded setpoint and mode distance, circular hue and brightness distance, sum of schedule
 * subgoal errors, discordant playlist pairs, or seconds of seek error. No successful action ends a task.
 * Levels: easy / medium narrow temperature and hue goals, reduce devices / days / queue length,
 * and ease continuous tolerances. ood widens temperature limits, counts and media duration.
 * Starts: off, partial (one subgoal or prefix set), wrong (wrong mode / hue / day / reversed queue),
 * solved. The self-test lives in selftest.js (loaded only by the checker and node tests).
 * Helpers (widget API, env.taskDef.helpers):
 *   DAYS: weekday labels, Monday through Sunday.
 *   timeText(minutes): local 24-hour time.
 *   durationText(seconds): media duration in minutes and seconds.
 *   dialAngle(spec, temp): thermostat dial angle in degrees.
 *   chapter(model, spec): chapter at the current video position.
 *   operating(model, spec): Heating, Cooling or Standby status.
 *
 * Targets: {control:'temperature'|'hue',current:true|value:number} (angle for value is degrees);
 * {control:'brightness'|'position',current:true|value:number}; {mode:'heat'|'cool'};
 * {timePicker:true}, {hour:0..23}, {minute:0..55 step 5}, {closePicker:true}, {day:0..6},
 * {device:index,state:null|'on'|'off'}, {save:true}; {item:id}, {slot:index}; {pane:true}.
 * Rotary plans return circular paths with <=18 degree arc segments, including across zero.
 *
 * facts(model,spec): 2-3 page-visible resulting statuses, ambient measurements, power draw,
 *   device counts, queue duration, chapter or time remaining (not copies of requested targets).
 * silent(next,prev,spec,rng): thermostat setpoint snaps back by one degree after a temperature
 *   improvement; returns a cloned, reachable, wrong state only; repeating the drag repairs it.
 * retarget(spec,model,rng): changes only goal fields, keeps devices/media/content and range;
 *   returns a goal unsatisfied by the current state. Disabled for judge episodes.
 * parts(model,spec): preempt=cancel; thermostat Temperature, Mode, Humidity; lightcolor Hue, Brightness; scene Time,
 *   Repeat days, each device by name, Schedule; playlist Queue order (any move shifts the other places, so one part),
 *   Tracks and Queue duration; lightcolor also Connection; scrub Video position and Playback (always paused).
 *   Humidity, Connection, Tracks, Queue duration and Playback never change: naming them in a stop reply is wrong.
 * judgeModes impossible: thermostat requests a temperature outside the printed device range;
 *   other scenarios request an out-of-range brightness, a device that is not connected, a track that is not in the
 *   playlist, or a time past the duration. The instruction reuses the task's normal sentence with the impossible
 *   value seeded (spec.judge.goal, spec.judge.extra); the reply is status impossible naming it (spec.judge.what).
 *   Start at a legal stand-in goal and leave it untouched.
 */
(function () {
  'use strict';
  const C = env.content;
  const clone = env.util.clone;
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const ROOMS = [
    'Living room', 'Bedroom', 'Studio', 'Kitchen', 'Reading room', 'Sunroom', 'Dining room', 'Guest room', 'Entryway',
    'Playroom', 'Craft room', 'Music room', 'Pantry', 'Mudroom', 'Laundry room', 'Study', 'Attic', 'Basement',
    'Workshop', 'Conservatory', 'Box room', 'Tea room', 'Pool room', 'Safe room'
  ];
  const TITLES = ['Paper Lanterns', 'Quiet Current', 'After the Rain', 'Velvet Horizon', 'Soft Geometry',
    'The Long Way Home', 'Glass Gardens', 'Distant Signals', 'Morning Atlas', 'Silver Orchard', 'Window Seat', 'Slow Orbit',
    'Apricot Weather', 'The Spare Key', 'Porcelain Echo', 'Copper Meadow', 'Driftwood Waltz', 'An Hour Unfolds',
    'Blue Thread', 'The Last Ferry', 'Moss on the Stair', 'A Room for Clouds', 'Laneway Reverie', 'Faint Ink',
    'Pebble Choir', 'Ribbon Roads', 'Folded Wings', 'Ochre Season', 'Linen Skies', 'Wandering Meter',
    'Pocketful of Dusk', 'Underpass Lullaby', 'Chalk Dust Parade', 'Seven Small Hours', 'Bramble Interlude',
    'A Sigh in Stereo', 'The Open Gate', 'Teacup Avalanche', 'The Unlit Arcade', 'Almost September',
    'Dandelion Static', 'Crescent Workshop', 'Turnstile Dreams', 'A Mile of Hush', 'Cardboard Castles',
    'Jigsaw Afternoon', 'The Ninth Landing', 'Thistle and Twine', 'Crickets at Noon', 'The Saffron Door',
    'Air Between Notes', 'Juniper Footpath', 'Dust on the Dial', 'Hearthside Polka', 'Monday in Reverse',
    'The Moth Hotel', 'Amber Semaphore', 'The Brass Compass', 'Tangerine Shadows', 'Perfume of Cedar',
    'Roundabout Rondo', 'A Jar of Thunder', 'Hollow Acorn', 'Flicker and Hum', 'Third Floor Tango', 'Painted Halos',
    'Auburn Haze', 'Castaway Picnic', 'Willow Switchback', 'Puddles of Gold', 'Cobalt Zigzag'];
  const ARTISTS = [
    'Moss Circuit', 'June & the Satellites', 'Harbor Assembly', 'Lowland Radio', 'Amber Lines', 'Juniper Relay',
    'Quiet Avenue', 'Copper Weather', 'Lantern Theory', 'Low Tide Assembly', 'Fieldglass Radio', 'Cinder Ensemble',
    'Mosslight Parade', 'Harbor Signals', 'Paper Coastline', 'Rooftop Measure', 'Willow Transit', 'Fable Weather'
  ];
  const timeText = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  const durationText = n => `${Math.floor(n / 60)}:${String(Math.round(n) % 60).padStart(2, '0')}`;
  const hueDistance = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
  const dialAngle = (s, temp) => 225 + (temp - s.min) * 270 / (s.max - s.min);
  const chapter = (m, s) => [...s.chapters].reverse().find(c => m.position >= c.time) || s.chapters[0];
  const operating = (m, s) => m.mode === 'heat' ? (m.temp > s.ambient ? 'Heating' : 'Standby') : (m.temp < s.ambient ? 'Cooling' : 'Standby');
  const watts = m => (0.5 + m.brightness * 0.085).toFixed(1) + ' W';
  function circle(control, from, to, wrap) {
    let delta = to - from;
    if (wrap) delta = ((delta + 540) % 360) - 180;
    const n = Math.max(1, Math.ceil(Math.abs(delta) / 18));
    return { path: Array.from({ length: n + 1 }, (_, i) => i === 0 ? { control, current: true } : { control, value: from + delta * i / n }) };
  }
  const task = {
    name: 'use-smart-home', reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: ['thermostat', 'lightcolor', 'scene', 'playlist', 'scrub'],
    startModes: ['off', 'partial', 'wrong', 'solved'], judgeModes: ['impossible'],
    inputs: s => ['pointer', ...(['scene', 'playlist'].includes(s.scenario) ? ['wheel'] : [])],
    helpers: { DAYS, timeText, durationText, dialAngle, chapter, operating },
    sample(rng, opts) {
      const scenario = opts.scenario || rng.pick(opts.scenarios || task.scenarios);
      const level = opts.level || 'normal';
      const easy = level === 'easy', medium = level === 'medium';
      const cr = rng.fork('content'), cs = { csplit: opts.csplit };
      const s = { scenario, level, ood: !!opts.ood, startMode: opts.startMode || 'off', isplit: opts.isplit,
        csplit: opts.csplit, home: C.pick(cr, C.STREET_NAMES, cs) + ' home', room: C.pick(cr, ROOMS, cs),
        owner: C.personName(cr, cs).full, serial: 'LN-' + C.digits(cr, 6),
        ambient: rng.int(18, 25), humidity: rng.int(35, 59) };
      if (scenario === 'thermostat') {
        s.min = opts.ood ? 5 : 10; s.max = opts.ood ? 35 : 30;
        s.goal = { temp: rng.int(easy ? 19 : medium ? 16 : s.min + 1, easy ? 24 : medium ? 27 : s.max - 1), mode: rng.pick(['heat', 'cool']) };
      } else if (scenario === 'lightcolor') {
        s.goal = { hue: rng.int(0, easy ? 5 : medium ? 11 : 35) * (easy ? 60 : medium ? 30 : 10), brightness: rng.int(opts.ood ? 1 : 3, 19) * 5 };
      } else if (scenario === 'scene') {
        s.sceneName = C.pick(cr, [
          'Evening calm', 'Welcome home', 'Morning routine', 'Movie night', 'Wind down', 'Focus time', 'Late day',
          'Soft landing', 'First light', 'After supper', 'Cloud watching', 'Easy morning', 'Porch lights',
          'Night settles', 'Quiet corner', 'Gentle arrival', 'Dusk lights', 'Early quiet', 'Still evening',
          'Rainy light', 'Quiet glow'
        ], cs);
        s.devices = ['Ceiling light', 'Reading lamp', 'Media speaker', 'Hall light', 'Desk lamp', 'Shelf light'].slice(0, easy ? 2 : medium ? 3 : opts.ood ? 6 : 4);
        s.goal = { time: rng.int(0, 23) * 60 + rng.int(0, 11) * 5,
          days: rng.sample([0, 1, 2, 3, 4, 5, 6], easy ? 1 : medium ? 2 : rng.int(2, 5)).sort(),
          states: s.devices.map((_, i) => i === 0 || rng.bool(.75) ? rng.pick(['on', 'off']) : null) };
      } else if (scenario === 'playlist') {
        s.tracks = C.sample(cr, TITLES, easy ? 4 : medium ? 5 : opts.ood ? 10 : 7, cs).map((title, i) =>
          ({ id: 't' + i, title, artist: C.pick(cr, ARTISTS, cs), duration: cr.int(125, 328) }));
        s.goal = { order: rng.shuffle(s.tracks.map(t => t.id)) };
      } else {
        s.title = C.pick(cr, [
          'A quieter way to live', 'Spaces for slow mornings', 'Inside the listening room', 'A home in harmony',
          'The quiet shape of home', 'Notes from a slower home', 'A room to return to', 'Life between the walls',
          'Rooms made for quiet', 'Homes for unhurried days', 'A home at its own pace', 'Windows hold the daylight',
          'Small rituals at home', 'Light across the rooms', 'Corners of a calm home'
        ], cs);
        s.duration = opts.ood ? rng.int(20, 40) * 60 : rng.int(easy ? 3 : 6, easy ? 5 : 15) * 60;
        s.chapters = ['Opening', 'The space', 'Small details', 'Daily rituals', 'Closing notes'].map((title, i) => ({ title, time: Math.floor(i * s.duration / 5) }));
        s.goal = { position: rng.int(1, Math.floor(s.duration / (easy ? 30 : 5)) - 1) * (easy ? 30 : 5) };
      }
      if (opts.judge === 'impossible') {
        const jr = rng.fork('impossible');
        let goal = null, extra = null, request = null, what;
        if (scenario === 'thermostat') {
          goal = { temp: s.max + jr.int(3, 8), mode: jr.pick(['heat', 'cool']) }; what = [`${goal.temp}°C`, String(goal.temp)];
        } else if (scenario === 'lightcolor') {
          goal = { hue: s.goal.hue, brightness: jr.int(21, 40) * 5 }; what = [`${goal.brightness}%`, String(goal.brightness)];
        } else if (scenario === 'scene') {
          extra = jr.pick(['Garden fountain', 'Patio heater', 'Sprinkler valve', 'Pool pump', 'Porch camera', 'Garage door']);
          goal = { ...s.goal, states: [...s.goal.states, jr.pick(['on', 'off'])] }; what = [extra];
        } else if (scenario === 'playlist') {
          const absent = jr.pick(['Neon Tides', 'Salt and Static', 'Paper Moons', 'Harbor Lights', 'Cinder Bloom', 'Low Tide Radio']);
          request = jr.pick([`Move the track "${absent}" to the first position in this playlist.`, `Put "${absent}" at the top of the queue.`,
            `Make "${absent}" the first song in this playlist.`]);
          what = [absent];
        } else {
          goal = { position: s.duration + jr.int(30, 300) }; what = [durationText(goal.position)];
        }
        s.judge = { mode: 'impossible', goal, extra, request, what, message: scenario === 'thermostat' ? `I cannot set that temperature: the device range is ${s.min}–${s.max}°C.` :
          scenario === 'lightcolor' ? 'I cannot set 140% brightness: the bulb supports 0–100%.' :
          scenario === 'scene' ? 'I cannot schedule the garden fountain: that device is not connected.' :
          scenario === 'playlist' ? 'I cannot move Neon Tides: that track is not in this playlist.' :
          `I cannot seek past the video duration of ${durationText(s.duration)}.` };
      }
      return s;
    },
    init(s, rng) {
      let m;
      if (s.scenario === 'thermostat') m = { temp: s.goal.temp < (s.min + s.max) / 2 ? s.max : s.min, mode: s.goal.mode === 'heat' ? 'cool' : 'heat' };
      else if (s.scenario === 'lightcolor') m = { hue: (s.goal.hue + 150) % 360, brightness: s.goal.brightness > 50 ? 15 : 90 };
      else if (s.scenario === 'scene') m = { time: (s.goal.time + 180) % 1440, days: [], states: s.devices.map(() => null), saved: false, picker: false };
      else if (s.scenario === 'playlist') m = { order: [...s.goal.order].reverse(), scroll: 0 };
      else m = { position: s.goal.position < s.duration / 2 ? s.duration - 10 : 0, preview: null };
      if (s.judge || s.startMode === 'solved') return task.solve(s, m);
      if (s.startMode === 'partial') {
        if (s.scenario === 'thermostat') m.mode = s.goal.mode;
        else if (s.scenario === 'lightcolor') m.hue = s.goal.hue;
        else if (s.scenario === 'scene') { m.time = s.goal.time; m.days = [...s.goal.days]; }
        else if (s.scenario === 'playlist') { m.order = [...s.goal.order]; [m.order[0], m.order[1]] = [m.order[1], m.order[0]]; }
        else m.position = Math.round((m.position + s.goal.position) / 2);
      } else if (s.startMode === 'wrong') {
        if (s.scenario === 'thermostat') m.temp = s.goal.temp;
        else if (s.scenario === 'lightcolor') m.brightness = s.goal.brightness;
        else if (s.scenario === 'scene') { m.time = s.goal.time; m.states = [...s.goal.states]; m.days = s.goal.days.map(d => (d + 1) % 7).sort(); m.saved = true; }
      }
      return m;
    },
    error(m, s) {
      const g = s.goal;
      if (s.scenario === 'thermostat') return Math.abs(m.temp - g.temp) + (m.mode === g.mode ? 0 : 4);
      if (s.scenario === 'lightcolor') return hueDistance(m.hue, g.hue) / 8 + Math.abs(m.brightness - g.brightness) / 4;
      if (s.scenario === 'scene') return Math.min(2, Math.abs(m.time - g.time) / 60) + DAYS.reduce((n, _, d) => n + (m.days.includes(d) === g.days.includes(d) ? 0 : 1), 0) +
        g.states.reduce((n, state, i) => n + (m.states[i] === state ? 0 : 1), 0) + (m.saved ? 0 : 1);
      if (s.scenario === 'playlist') {
        let pairs = 0;
        for (let i = 0; i < m.order.length; i++) for (let j = i + 1; j < m.order.length; j++) if (g.order.indexOf(m.order[i]) > g.order.indexOf(m.order[j])) pairs++;
        return pairs / (m.order.length * (m.order.length - 1) / 2);
      }
      return Math.abs(m.position - g.position);
    },
    tolerance(s) {
      const tau = s.scenario === 'thermostat' ? .1 : s.scenario === 'lightcolor' ? (s.level === 'easy' ? 1.2 : s.level === 'medium' ? .9 : .7) :
        s.scenario === 'scrub' ? Math.max(2, s.duration * (s.level === 'easy' ? .012 : .006)) : 0;
      const sigma = s.scenario === 'playlist' ? .3 : s.scenario === 'scene' ? 2 : s.scenario === 'thermostat' ? 4 : s.scenario === 'lightcolor' ? 8 : s.duration * .12;
      return { tau, sigma, minInitialError: s.scenario === 'playlist' ? .01 : tau * 3 + .1 };
    },
    instruction(s, rng) {
      const g = s.judge && s.judge.goal ? s.judge.goal : s.goal;
      let core;
      if (s.judge && s.judge.request) core = s.judge.request;
      else if (s.scenario === 'thermostat') core = env.instruct.phrase(rng, [
        'Set the {room} thermostat to {temp}°C in {mode} mode.',
        'Use {mode} mode and turn the {room} thermostat to {temp}°C.',
        'Adjust the {room} setpoint to {temp}°C with {mode} selected.',
        'The {room} thermostat should target {temp}°C in {mode} mode.'
      ], { room: s.room, temp: g.temp, mode: g.mode }, s.isplit);
      else if (s.scenario === 'lightcolor') core = env.instruct.phrase(rng, [
        'Set the {room} bulb to hue {hue}° and brightness {brightness}%.',
        'Adjust the {room} light: hue {hue}°, brightness {brightness}%.',
        'I want the {room} bulb at hue {hue}° with {brightness}% brightness.',
        'For the {room} bulb, use {brightness}% brightness and hue {hue}°.',
        'For {room}, the bulb needs {hue}° hue, {brightness}% brightness.',
        'Use {brightness}% brightness. Give the {room} light hue {hue}°.',
        'Please give the {room} bulb {brightness}% brightness at hue {hue}°.'
      ], { room: s.room, ...g }, s.isplit);
      else if (s.scenario === 'scene') core = env.instruct.phrase(rng, [
        'Schedule "{name}" at {time} on {days}, with {devices}. Save the schedule.',
        'Save a schedule for "{name}": {days} at {time}; {devices}.',
        'Configure "{name}" to run at {time} every {days}: {devices}. Save this schedule.',
        'I need "{name}" saved to repeat on {days} at {time}, applying {devices}.',
        'Make "{name}" repeat on {days} at {time} with {devices}, and save it.',
        '"{name}" should run on {days} at {time}: {devices}. Save the schedule.',
        'Use {devices} for "{name}" at {time} on {days}. Please save the schedule.',
        'Please save "{name}" with these settings: {time} on {days}; {devices}.'
      ],
        { name: s.sceneName, time: timeText(g.time), days: g.days.map(d => DAYS[d]).join(', '), devices: [...s.devices, ...(s.judge && s.judge.extra ? [s.judge.extra] : [])].map((name, i) => `${name} ${g.states[i] === null ? 'excluded' : g.states[i]}`).join('; ') }, s.isplit);
      else if (s.scenario === 'playlist') core = env.instruct.phrase(rng, [
        'Put the playlist in the order listed in Listening plan.',
        'I want these songs to play in the Listening plan order.',
        'Arrange this queue in the order listed in Listening plan.',
        'Use Listening plan as the guide to reorder this playlist.',
        'Match every track in this queue to Listening plan order.'
      ], {}, s.isplit);
      else core = env.instruct.phrase(rng, [
        'Leave the video paused at {time}.', 'Set the video position to {time}.',
        'I want to resume this video from {time}.', 'Seek to {time} with playback paused.',
        'The video must be paused at {time}.', 'Cue this video at {time} and pause.',
        'Move the paused video to {time}.'
      ], { time: durationText(g.position) }, s.isplit);
      return env.instruct.say(rng, core, { isplit: s.isplit });
    },
    plan(m, s) {
      if (s.judge) return { finish: true, message: s.judge.message };
      if (task.error(m, s) <= task.tolerance(s).tau) return null;
      const g = s.goal;
      if (s.scenario === 'thermostat') return m.mode !== g.mode ? { click: { mode: g.mode } } : circle('temperature', dialAngle(s, m.temp), dialAngle(s, g.temp), false);
      if (s.scenario === 'lightcolor') return hueDistance(m.hue, g.hue) > 2 ? circle('hue', m.hue, g.hue, true) : { drag: [{ control: 'brightness', current: true }, { control: 'brightness', value: g.brightness }] };
      if (s.scenario === 'scene') {
        if (m.time !== g.time) {
          if (!m.picker) return { click: { timePicker: true } };
          if (Math.floor(m.time / 60) !== Math.floor(g.time / 60)) return { click: { hour: Math.floor(g.time / 60) } };
          return { click: { minute: g.time % 60 } };
        }
        if (m.picker) return { click: { closePicker: true } };
        const d = DAYS.findIndex((_, i) => m.days.includes(i) !== g.days.includes(i));
        if (d !== -1) return { click: { day: d } };
        const i = g.states.findIndex((state, j) => m.states[j] !== state);
        if (i !== -1) {
          const p = m.devicePane;
          if (p) {
            const [top, bottom] = p.rows[i];
            if (top < p.scroll || bottom > p.scroll + p.height + 1) {
              return { wheel: [{ pane: true }, top < p.scroll ? top - p.scroll : bottom - p.height - p.scroll + 4] };
            }
          }
          return { click: { device: i, state: g.states[i] } };
        }
        return { click: { save: true } };
      }
      if (s.scenario === 'playlist') {
        const i = g.order.findIndex((id, j) => m.order[j] !== id);
        return { drag: [{ item: g.order[i] }, { slot: i }] };
      }
      return { drag: [{ control: 'position', current: true }, { control: 'position', value: g.position }] };
    },
    solve(s, m) {
      const g = clone(s.goal), next = { ...m };
      if (s.scenario === 'thermostat' || s.scenario === 'lightcolor' || s.scenario === 'scrub') return { ...next, ...g };
      if (s.scenario === 'scene') return { ...next, ...g, saved: true, picker: false };
      return { ...next, order: g.order, scroll: 0 };
    },
    parts(m, s) {
      if (s.scenario === 'thermostat') return [{ name: 'Temperature', value: m.temp }, { name: 'Mode', value: m.mode }, { name: 'Humidity', value: s.humidity }];
      if (s.scenario === 'lightcolor') return [{ name: 'Hue', value: m.hue }, { name: 'Brightness', value: m.brightness }, { name: 'Connection', value: 'Connected' }];
      if (s.scenario === 'scene') return [{ name: 'Time', value: m.time }, { name: 'Repeat days', value: m.days },
        ...s.devices.map((name, i) => ({ name, value: m.states[i] })), { name: 'Schedule', value: m.saved }];
      if (s.scenario === 'playlist') return [{ name: 'Queue order', value: m.order }, { name: 'Tracks', value: m.order.length },
        { name: 'Queue duration', value: s.tracks.reduce((n, t) => n + t.duration, 0) }];
      return [{ name: 'Video position', value: Math.round(m.position) }, { name: 'Playback', value: 'paused' }];
    },
    facts(m, s) {
      if (s.scenario === 'thermostat') return [{ label: 'System status', value: operating(m, s) }, { label: 'Room temperature', value: `${s.ambient}°C` }, { label: 'Humidity', value: `${s.humidity}%` }];
      if (s.scenario === 'lightcolor') return [{ label: 'Power draw', value: watts(m) }, { label: 'Connection', value: 'Connected' }];
      if (s.scenario === 'scene') return [{ label: 'Schedule status', value: m.saved ? 'Scheduled' : 'Draft' }, { label: 'Included devices', value: String(m.states.filter(x => x !== null).length) }, { label: 'Devices on', value: String(m.states.filter(x => x === 'on').length) }];
      if (s.scenario === 'playlist') return [{ label: 'Tracks', value: String(m.order.length) }, { label: 'Queue duration', value: durationText(s.tracks.reduce((n, t) => n + t.duration, 0)) }];
      return [{ label: 'Chapter', value: chapter(m, s).title }, { label: 'Remaining', value: durationText(Math.max(0, s.duration - Math.round(m.position))) }];
    },
    silent(next, prev, s, rng) {
      if (s.judge || s.scenario !== 'thermostat' || Math.abs(next.temp - s.goal.temp) >= Math.abs(prev.temp - s.goal.temp)) return null;
      const m = clone(next);
      m.temp = Math.max(s.min, m.temp - 1);
      return task.error(m, s) > task.tolerance(s).tau && m.temp !== next.temp ? m : null;
    },
    retarget(s, m, rng) {
      if (s.judge) return null;
      const n = clone(s), g = n.goal;
      if (s.scenario === 'thermostat') { g.temp = m.temp <= (s.min + s.max) / 2 ? s.max - 1 : s.min + 1; g.mode = m.mode === 'heat' ? 'cool' : 'heat'; }
      else if (s.scenario === 'lightcolor') { g.hue = (Math.round(m.hue / 10) * 10 + 120) % 360; g.brightness = m.brightness > 50 ? 25 : 85; }
      else if (s.scenario === 'scene') { g.time = (m.time + 120) % 1440; g.days = [rng.int(0, 6)]; }
      else if (s.scenario === 'playlist') g.order = [...m.order.slice(1), m.order[0]];
      else g.position = m.position < s.duration / 2 ? Math.floor(s.duration * .8 / 5) * 5 : Math.floor(s.duration * .2 / 5) * 5;
      return task.error(m, n) > task.tolerance(n).tau ? n : null;
    },
  };
  env.task(task);
})();
