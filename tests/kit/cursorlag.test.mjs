// cursorLag=1 (page option, K3): the drawn cursor shows where the pointer was at the previous stepClock.
import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPage } from './fixtures.mjs';

const at = (env) => env.cursorEl.style.transform;

test('cursorlag: the cursor moves one stepClock late', async () => {
  const { env, fire } = await roundPage({ knobs: { cursorLag: '1' } });
  fire('pointermove', { clientX: 10, clientY: 20 });
  assert.equal(at(env), '');
  env.stepClock();
  assert.equal(at(env), ''); // there was no pointer at the previous stepClock
  fire('pointermove', { clientX: 30, clientY: 40 });
  env.stepClock();
  assert.equal(at(env), 'translate(10px, 20px)');
  env.stepClock();
  assert.equal(at(env), 'translate(30px, 40px)');
  assert.equal(env.episode.cursorlag, undefined); // a page option, not a randomization parameter
});

test('without cursorlag the cursor follows the pointer at once', async () => {
  const { env, fire } = await roundPage();
  fire('pointermove', { clientX: 10, clientY: 20 });
  assert.equal(at(env), 'translate(10px, 20px)');
});
