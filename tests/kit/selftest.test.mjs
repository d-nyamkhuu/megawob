// Every task's self-test (tasks/<f>/selftest.js, run by kit/selftest.js) must report no failures. Each task
// boots on the base site with the stub DOM (one worker thread per task: the heavy ones take a minute) and runs
// the task's checks of sampling, scoring, oracle and instructions in model terms.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { HTML, bootPage, runFile } from './stubdom.mjs';

if (!isMainThread) {
  const { task } = workerData;
  const { win, env } = await bootPage({ task, site: 'base', seed: 0 });
  runFile(win, 'kit/selftest.js');
  if (fs.existsSync(path.join(HTML, 'tasks', task, 'selftest.js'))) runFile(win, `tasks/${task}/selftest.js`);
  parentPort.postMessage([...env.runSelfTest(task)].map(String));
} else {
  const tasks = fs.readdirSync(path.join(HTML, 'tasks')).sort();
  const run = (task) => new Promise((resolve, reject) => {
    const w = new Worker(fileURLToPath(import.meta.url), { workerData: { task } });
    w.once('message', resolve);
    w.once('error', reject);
  });
  // start all workers now; each test then waits for its own task
  const results = new Map(tasks.map((f) => [f, run(f)]));
  for (const task of tasks) {
    test(`selfTest: ${task}`, async () => {
      const fails = await results.get(task);
      assert.equal(fails.length, 0, fails.join('\n'));
    });
  }
}
