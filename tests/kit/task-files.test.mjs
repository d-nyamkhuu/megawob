// Multi-file tasks (task contract: files): logic.js lists more files (shared code, then scenarios/<scenario>.js), which
// boot loads in order. A task whose files register per-scenario objects (env.scenario(task, def)) registers one
// for every listed scenario, and logic.js dispatches through env.scenariosOf(task). selftest.js is not one of them:
// only the checker and the node tests load it (kit/selftest.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { HTML, bootPage, loadKit } from './stubdom.mjs';
import { lineTask } from './fixtures.mjs';

// tasks with files besides logic.js and selftest.js
const multiFile = fs.readdirSync(path.join(HTML, 'tasks'))
  .filter((f) => fs.readdirSync(path.join(HTML, 'tasks', f)).some((x) => x !== 'logic.js' && x !== 'selftest.js'));

test('every multi-file task loads its files; one with scenario objects has one per listed scenario', async () => {
  assert.ok(multiFile.length > 0);
  for (const task of multiFile) {
    const { env } = await bootPage({ task, site: 'base', seed: 0 });
    const def = env.taskDef;
    assert.ok((def.files || []).length > 0, `${task}: files besides logic.js that logic.js does not list`);
    assert.ok(!(def.files || []).includes('selftest.js'), `${task}: selftest.js is loaded by the checks only`);
    for (const file of def.files) assert.ok(fs.existsSync(path.join(HTML, 'tasks', task, file)), `${task}: ${file}`);
    const own = Object.keys(env.scenariosOf(task));
    if (own.length) assert.deepEqual(own.sort(), [...def.scenarios].sort(), task);
    for (const [name, v] of Object.entries(env.scenariosOf(task))) assert.equal(v.name, name);
  }
});

test('env.scenario needs a registered task; scenariosOf is one live object per task', () => {
  const { env } = loadKit();
  assert.throws(() => env.scenario('unit', { name: 'a' }), /not registered/);
  const reg = env.scenariosOf('unit');
  env.task(lineTask({ name: 'unit', scenarios: ['a'] }));
  env.scenario('unit', { name: 'a', sample: () => ({}) });
  assert.equal(reg.a.name, 'a');
  assert.equal(env.scenariosOf('unit'), reg);
});
