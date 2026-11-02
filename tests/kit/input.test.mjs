// The window capture listeners: undeclared input kinds are rejected (or void the episode under undeclaredInput=void),
// modifiers are pointer input, click runs, and the dragSteps=split atomic-drag check.
import test from 'node:test';
import assert from 'node:assert/strict';
import { testEnv } from './stubdom.mjs';
import { lineTask, same } from './fixtures.mjs';

function page(knobs = {}, task = {}, widget = {}) {
  const { win, env } = testEnv({ task: lineTask(task), widget });
  env.reset(1, knobs);
  const fire = (type, props = {}) => {
    const e = { type, target: win.document.body, button: 0, buttons: 0, clientX: 0, clientY: 0, defaultPrevented: false,
      _stopped: false, preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this._stopped = true; },
      ...props };
    win.dispatchEvent(e);
    return e;
  };
  return { win, env, fire };
}

test('pointer-only page: keys and wheel are swallowed, counted and reported once', () => {
  const { env, fire } = page();
  const k = fire('keydown', { key: 'ArrowLeft', code: 'ArrowLeft' });
  assert.deepEqual([k.defaultPrevented, k._stopped], [true, true]);
  const up = fire('keyup', { key: 'ArrowLeft', code: 'ArrowLeft' });
  assert.equal(up._stopped, true); // the keyup of a swallowed key goes too
  assert.equal(fire('keyup', { key: 'a', code: 'KeyA' })._stopped, false);
  fire('wheel', { deltaY: 100 });
  same(env.state().rejected, { keyboard: 1, wheel: 1 });
  assert.equal(env.inputFeedback(), 'Keyboard input is not available on this page; use the mouse. '
    + 'The mouse wheel is not available on this page; use the mouse to click or drag instead.');
  assert.equal(env.inputFeedback(), '');
  assert.equal(env.done, false);
});

test('modifier keys are pointer input; declared kinds pass through', () => {
  let { env, fire } = page();
  assert.equal(fire('keydown', { key: 'Shift', code: 'ShiftLeft' })._stopped, false);
  assert.equal(env.state().rejected.keyboard, 0);
  ({ env, fire } = page({}, { inputs: ['pointer', 'keyboard'] }));
  assert.equal(fire('keydown', { key: 'a' })._stopped, false);
  assert.equal(fire('beforeinput', { inputType: 'insertText' })._stopped, false);
  assert.equal(fire('wheel', { deltaY: 5 })._stopped, true);
  ({ env, fire } = page({}, { inputs: (spec) => (spec.scenario === 'a' ? ['pointer', 'wheel'] : ['pointer']) }));
  assert.equal(fire('wheel', { deltaY: 5 })._stopped, env.spec.scenario !== 'a');
});

test('scrollable pages accept the wheel', () => {
  const { fire, env } = page({}, {}, { scrollable: true });
  assert.equal(fire('wheel', { deltaY: 5 })._stopped, false);
  same(env.inputs(), ['pointer', 'wheel']);
});

test('beforeinput: typed text is keyboard input, drops are pointer input', () => {
  const { env, fire } = page();
  assert.equal(fire('beforeinput', { inputType: 'insertText' })._stopped, true);
  assert.equal(fire('beforeinput', { inputType: 'insertFromDrop' })._stopped, false);
  assert.equal(env.state().rejected.keyboard, 1);
});

test('undeclaredInput=void: an undeclared key or wheel ends the episode with reward 0', () => {
  let { env, fire } = page({ undeclaredInput: 'void', startState: 'solved' });
  fire('keydown', { key: 'x' });
  assert.deepEqual([env.done, env.status().end_reason, env.status().reward_dense], [true, 'violation:keyboard', 0]);
  ({ env, fire } = page({ undeclaredInput: 'void' }));
  fire('wheel', { deltaY: 1 });
  assert.equal(env.status().end_reason, 'violation:wheel');
  ({ env, fire } = page({ undeclaredInput: 'void' }));
  fire('beforeinput', { inputType: 'insertText' }); // counted, not a violation
  assert.deepEqual([env.done, env.state().rejected.keyboard], [false, 1]);
});

test('click runs: left presses on one spot within one action count up; stepClock ends the run', () => {
  const { win, env, fire } = page();
  const press = (x = 10) => fire('pointerdown', { clientX: x, clientY: 10, buttons: 1 });
  press();
  press();
  press(12);
  assert.equal(win.env.util.clickCount({ detail: 1 }), 3);
  press(30); // too far: a new run
  assert.equal(win.env.util.clickCount({ detail: 0 }), 1);
  press(30);
  env.stepClock();
  press(30);
  assert.equal(win.env.util.clickCount({}), 1);
  assert.equal(env.presses, 6);
  fire('pointerdown', { clientX: 30, clientY: 10, button: 2 });
  assert.equal(env._rt.input.clickRun, null);
});

test('dragSteps=split: press and release far apart in one action is an atomic drag', () => {
  let { env, fire } = page({ dragSteps: 'split' });
  fire('pointerdown', { clientX: 10, clientY: 10, buttons: 1 });
  const up = fire('pointerup', { clientX: 60, clientY: 10 });
  assert.equal(up._stopped, true);
  assert.equal(env.status().end_reason, 'violation:atomic-drag');
  ({ env, fire } = page({ dragSteps: 'split' }));
  fire('pointerdown', { clientX: 10, clientY: 10, buttons: 1 });
  fire('pointerup', { clientX: 15, clientY: 10 }); // a click, not a drag
  assert.equal(env.done, false);
  fire('pointerdown', { clientX: 10, clientY: 10, buttons: 1 });
  env.stepClock();
  fire('pointerup', { clientX: 90, clientY: 10 }); // released in a later action
  assert.equal(env.done, false);
  fire('pointerdown', { clientX: 10, clientY: 10, buttons: 1 });
  const drop = fire('drop', {});
  assert.deepEqual([drop.defaultPrevented, env.status().end_reason], [true, 'violation:atomic-drag']);
  ({ env, fire } = page({ dragSteps: 'atomic' }));
  fire('pointerdown', { clientX: 10, clientY: 10, buttons: 1 });
  fire('pointerup', { clientX: 60, clientY: 10 });
  assert.equal(env.done, false);
});

test('pointer events track the cursor', () => {
  const { env, fire } = page();
  fire('pointermove', { clientX: 5, clientY: 6, buttons: 1 });
  same(env.lastPointer, { clientX: 5, clientY: 6, buttons: 1 });
  assert.equal(env.events().at(-1).type, 'move');
});
