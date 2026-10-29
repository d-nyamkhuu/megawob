// Node layer of the golden-snapshot harness (python -m megawob.golden): for every widget, boot its page with the
// stub DOM (stubdom.mjs) and record what reset() produces for a fixed list of seeds and randomization parameters: the
// randomization parameters as drawn, spec, model, instruction, inputs, the score at the start and the task's first plan
// step. No browser, so all ~1,450 widgets take about a minute.
//
//   node tests/kit/snapshot.mjs <config.json>
//   config: { out, cells: [[task, site, widget], ...], seeds, knobMix, fullMix, sweep: [...], scene: {...},
//             judge: {mode: {...}} }
//
// The run list per widget follows megawob/check.py check_skin: seeds 0..seeds-1 with knobMix and 500.. with fullMix
// (every knob draws), one run per scenario (seed 1000 + i), then the sweep (seed 2000 + i, cycling scenarios), plus
// startState=scene and judge runs where the task lists them. Writes gzipped JSON lines, one per widget:
// { cell, runs: [{ key, ... }] } or { cell, error }.
import fs from 'node:fs';
import zlib from 'node:zlib';
import { bootPage } from './stubdom.mjs';

const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// JSON with -0 / NaN / Infinity kept distinguishable, so a change between them is a diff. Undefined fields stay as
// null, as Playwright returns them, so records compare with the browser layer's.
const clean = (v) => JSON.parse(JSON.stringify(v, (k, x) => (x === undefined ? null
  : typeof x === 'number' && !Number.isFinite(x) ? String(x) : Object.is(x, -0) ? '-0' : x)));

function runsFor(env) {
  const fam = env.taskDef;
  const scenarios = (env.widgetDef.scenarios || fam.scenarios || []).filter((v) => !fam.scenarios || fam.scenarios.includes(v));
  const vs = scenarios.length ? scenarios : [null];
  const runs = [];
  for (let s = 0; s < cfg.seeds; s++) runs.push([s, null, cfg.knobMix]);
  for (let s = 0; s < cfg.seeds; s++) runs.push([500 + s, null, cfg.fullMix]);
  scenarios.forEach((v, i) => runs.push([1000 + i, v, cfg.knobMix]));
  let sweep = cfg.sweep.slice();
  if ((fam.startModes || []).includes('scene')) sweep.push(cfg.scene, cfg.scene);
  for (const m of fam.judgeModes || []) if (cfg.judge[m]) sweep.push(cfg.judge[m], cfg.judge[m]);
  const n = Math.max(sweep.length, 2 * vs.length);
  for (let i = 0; i < n; i++) runs.push([2000 + i, vs[i % vs.length], sweep[i % sweep.length]]);
  return runs;
}

function record(env, seed, scenario, knobs) {
  const name = knobs === cfg.knobMix ? 'mix' : knobs === cfg.fullMix ? 'full' : JSON.stringify(knobs);
  const key = `${seed}${scenario ? ' ' + scenario : ''} ${name}`;
  try {
    const start = env.reset(seed, scenario, knobs);
    let plan;
    try {
      plan = env.taskDef.plan(env.model, env.spec);
    } catch (err) {
      plan = `throws: ${err && err.message}`;
    }
    const st = env.state();
    return clean({ key, scenario: st.scenario, episode: st.episode, spec: st.spec, model: st.model,
      instruction: env.instruction(), plain: env.plainInstructionText, inputs: env.inputs(),
      error0: env.error0, score: start, plan });
  } catch (err) {
    return { key, error: String(err && err.message || err) };
  }
}

const gz = zlib.createGzip();
const outStream = fs.createWriteStream(cfg.out);
gz.pipe(outStream);
let failed = 0;
for (const [task, site, widget] of cfg.cells) {
  const cell = `${task}/${site}/${widget}`;
  let line;
  try {
    const { env } = await bootPage({ task, site, widget, seed: 0 });
    line = { cell, runs: runsFor(env).map(([s, v, k]) => record(env, s, v, k)) };
  } catch (err) {
    failed++;
    line = { cell, error: String(err && err.message || err).slice(0, 2000) };
  }
  gz.write(JSON.stringify(line) + '\n');
}
gz.end();
await new Promise((ok) => outStream.on('finish', ok));
console.log(`node snapshot: ${cfg.cells.length} widgets, ${failed} failed to boot -> ${cfg.out}`);
