// The task widget API (kit/env.js task contract, helpers): widget code (templates, site widgets and site files) reads
// a task only through env.taskDef.helpers / env.taskOf(f).helpers and the contract hooks the kit itself
// calls; a member that is no contract key reads as undefined (tasks are closed), and lib is the task's own.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { HTML } from './stubdom.mjs';

const validate = fs.readFileSync(path.join(HTML, 'kit/runtime/validate.js'), 'utf8');
const table = (name) => validate.slice(validate.indexOf(`const ${name} = {`), validate.indexOf('};', validate.indexOf(`const ${name} = {`)));
const CONTRACT = new Set([...`${table('HOOKS')}${table('TASK')}`.matchAll(/(\w+):\s*'/g)].map((m) => m[1]));
CONTRACT.delete('lib');

function* widgetFiles() {
  for (const dir of ['templates', 'sites']) {
    for (const f of fs.readdirSync(path.join(HTML, dir), { recursive: true })) {
      if (f.endsWith('.js') && !f.includes('vendor') && !f.includes('assets')) yield `${dir}/${f}`;
    }
  }
}

test('widget code reads a task only through helpers and contract keys', () => {
  const bad = [];
  const read = /\b(?:taskDef|taskOf\(\s*['"][\w-]+['"]\s*\))\s*\.\s*([A-Za-z_$][\w$]*)/g;
  for (const f of widgetFiles()) {
    const src = fs.readFileSync(path.join(HTML, f), 'utf8');
    for (const m of src.matchAll(read)) {
      if (m[1] !== 'helpers' && !CONTRACT.has(m[1])) bad.push(`${f}: .${m[1]}`);
    }
  }
  assert.deepEqual(bad, [], `widget code reading task members that are not its widget API:\n${bad.slice(0, 40).join('\n')}`);
});
