/* click-point/axis: sampling for the axis scenario. */
(function () {
  'use strict';
  const { r4, scaleValue } = env.taskOf('click-point').lib;

  const SCALES = [
    { min: 0, max: 100, major: 10, minor: 2, dec: 1, q: 0.5, unit: '', name: 'x' },
    { min: 0, max: 50, major: 5, minor: 1, dec: 1, q: 0.5, unit: ' cm', name: 'length' },
    { min: -20, max: 20, major: 5, minor: 1, dec: 1, q: 0.5, unit: ' °C', name: 'temperature' },
    { min: 0, max: 1, major: 0.1, minor: 0.02, dec: 2, q: 0.01, unit: '', name: 'p' },
    { min: 0, max: 12, major: 1, minor: 0.25, dec: 3, q: 0.125, unit: ' in', name: 'length' },
    { min: 1000, max: 2000, major: 100, minor: 20, dec: 0, q: 10, unit: '', name: 'x' },
    { min: 0, max: 240, major: 30, minor: 10, dec: 0, q: 5, unit: ' min', name: 'time' },
  ];

  const OOD_SCALES = [
    { min: -3.5, max: 2.5, major: 0.5, minor: 0.1, dec: 2, q: 0.05, unit: '', name: 'x' },
    { min: 0.2, max: 0.5, major: 0.05, minor: 0.01, dec: 3, q: 0.005, unit: '', name: 'ratio' },
    { min: -450, max: 150, major: 100, minor: 25, dec: 0, q: 5, unit: ' m', name: 'elevation' },
  ];

  const CHART_X = [
    { min: 0, max: 24, major: 4, minor: 1, dec: 1, q: 0.5, unit: ' h', name: 'time', label: 'Time (h)' },
    { min: 0, max: 10, major: 1, minor: 0.5, dec: 2, q: 0.25, unit: ' km', name: 'distance', label: 'Distance (km)' },
    { min: 0, max: 60, major: 10, minor: 2, dec: 0, q: 1, unit: ' s', name: 'time', label: 'Time (s)' },
    { min: 2010, max: 2024, major: 2, minor: 1, dec: 1, q: 0.5, unit: '', name: 'year', label: 'Year' },
    { min: 0, max: 100, major: 20, minor: 5, dec: 0, q: 1, unit: '%', name: 'load', label: 'Load (%)' },
  ];

  const CHART_Y = [
    { min: 0, max: 40, major: 10, minor: 2, dec: 0, q: 1, unit: ' °C', name: 'temperature', label: 'Temperature (°C)' },
    { min: 0, max: 120, major: 20, minor: 5, dec: 0, q: 1, unit: ' km/h', name: 'speed', label: 'Speed (km/h)' },
    { min: 0, max: 500, major: 100, minor: 25, dec: 0, q: 5, unit: '', name: 'sales', label: 'Sales (units)' },
    { min: -10, max: 30, major: 10, minor: 2, dec: 0, q: 1, unit: ' m', name: 'level', label: 'Water level (m)' },
    { min: 0, max: 8, major: 2, minor: 0.5, dec: 1, q: 0.25, unit: ' kW', name: 'power', label: 'Power (kW)' },
  ];

  const CHART_TITLES = ['Daily readings', 'Sensor log', 'Quarterly trend', 'Test run', 'Station data', 'Usage over time',
    'Measurement series', 'Field report', 'Lab results', 'Monitoring', 'Data brief', 'Signal map', 'Sample overview',
    'Metric view', 'Observation log', 'Instrument data', 'Value note', 'Recorded points', 'Study notes',
    'Chart overview', 'Data capture', 'Value profile', 'Signal review', 'Series report', 'Trace record',
    'Result digest', 'Run metrics', 'Output summary', 'Point record', 'Data snapshot', 'Data ledger', 'Activity log',
    'Process notes', 'Plot notes', 'Series catalog', 'Input record', 'Scope review', 'Collected data',
    'Reading summary', 'Reference set'];

  // The aspect trait stretches rulers and the chart's plot rect to the board width (no placement: they span the board).
  function sampleAxis(rng, ood, g) {
    const kind = rng.pick(['ruler', 'ruler', 'line', 'coord']);
    if (kind === 'ruler') {
      const scale = { ...(ood ? rng.pick(OOD_SCALES) : rng.pick(SCALES)) };
      const orient = ood || rng.bool(0.3) ? rng.pick(['h', 'v']) : 'h';
      let from;
      let to;
      if (orient === 'h') {
        const y = r4(rng.float(0.3, 0.7));
        const x0 = r4(rng.float(0.07, 0.14));
        from = [x0, y];
        to = [r4(g.W - rng.float(0.07, 0.14)), y];
      } else {
        const x = r4(g.custom ? g.W * rng.float(0.3, 0.7) : rng.float(0.45, 1.05));
        from = [x, r4(g.H - rng.float(0.06, 0.1))];
        to = [x, r4(rng.float(0.06, 0.1))];
      }
      return { kind, orient, from, to, scale, value: scaleValue(rng, scale), band: 0.035 };
    }
    const xs = { ...rng.pick(CHART_X) };
    const ys = { ...rng.pick(CHART_Y) };
    const plot = { x0: 0.17, y0: 0.08, x1: g.custom ? r4(g.W - 0.06) : 1.44, y1: 0.84 };
    const n = Math.round((xs.max - xs.min) / xs.major);
    const series = [];
    let y = ys.min + rng.float(0.2, 0.8) * (ys.max - ys.min);
    for (let k = 0; k <= n; k++) {
      y = Math.min(ys.max - 0.05 * (ys.max - ys.min), Math.max(ys.min + 0.05 * (ys.max - ys.min), y + rng.float(-0.3, 0.3) * (ys.max - ys.min)));
      series.push([xs.min + k * xs.major, Number(y.toFixed(3))]);
    }
    const spec = { kind, plot, xs, ys, series, value: scaleValue(rng, xs), title: rng.pick(CHART_TITLES) };
    if (kind === 'coord') spec.yvalue = scaleValue(rng, ys);
    return spec;
  }

  env.scenario('click-point', { name: 'axis', sample(rng, ood, tr, g, cs, level) { return sampleAxis(rng, ood, g); } });
})();
