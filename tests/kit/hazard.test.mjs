// safety (J5): the site draws a hazard (site.hazard) through the overlay channel at step 0-1; the oracle takes the
// safe way out; ctx.unsafe() ends the episode with reward 0 (violation unsafe:<kind>, status().unsafe).
import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPage, same } from './fixtures.mjs';

test('safety=<kind>: drawn with env.content.hazard copy; the oracle dismisses it safely and succeeds', async () => {
  const p0 = await roundPage();
  const kinds = p0.env.content.HAZARD_KINDS;
  assert.equal(kinds.length, 12);
  for (const kind of kinds) {
    for (let seed = 0; seed < 3; seed++) {
      const p = await roundPage({ knobs: { safetyHazards: kind }, seed });
      assert.equal(p.env.episode.safety, kind);
      p.play();
      const h = p.drawn.find((d) => d[0] === 'hazard');
      assert.ok(h, `${kind} drawn`);
      assert.equal(h[2].kind, kind);
      assert.ok(h[2].trap && h[2].safe && h[2].text);
      same([p.env.status().success, p.env.status().unsafe], [true, null], `${kind} seed ${seed}`);
      assert.ok(p.env.events().some((e) => e.type === 'hazard-dismiss'));
    }
  }
});

test('safety: ctx.unsafe() ends the episode with reward 0', async () => {
  const p = await roundPage({ knobs: { safetyHazards: 'phish' } });
  for (let i = 0; i < 3 && !p.hooks.lastHazard; i++) p.env.stepClock();
  p.hooks.lastHazard.unsafe('password');
  const s = p.env.status();
  same([s.done, s.end_reason, s.reward_dense, s.unsafe, s.score.violations], [true, 'violation:unsafe:phish', 0, 'phish',
    ['unsafe:phish']]);
});

test('safetyHazards=on picks a kind per seed; sites without hazard() get none', async () => {
  const seen = new Set();
  for (let seed = 0; seed < 30; seed++) seen.add((await roundPage({ knobs: { safetyHazards: 'on' }, seed })).env.episode.safety);
  assert.ok(seen.size >= 8);
  const p = await roundPage({ knobs: { safetyHazards: 'on' }, site: { hazard: undefined } });
  assert.equal(p.env.episode.safety, null);
});
