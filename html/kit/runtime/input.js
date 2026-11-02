/*
 * kit/runtime/input.js: the input layer. inputs() is the list of input kinds the episode allows; install() adds the
 * window listeners (env.js calls it once, before any page script loads), which track the pointer, count click
 * runs (util.clickCount), log input, end atomic drags in split episodes (split.atomicDrag) and swallow input
 * kinds the episode does not allow (reject, feedback). The listeners survive reset(); they only read env state.
 * State (env._rt.input, made by reset(), and by install() for events before the first episode): clickRun,
 * rejectedNew (kinds since the last feedback()), cursorLag and cursorPrev (cursorLag=1). env.lastPointer, the
 * pointer's last position and buttons, outlives episodes (the drawn cursor stays where it was).
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const S = (env) => env._rt.input;
  const fresh = (cursorLag, cursorPrev) => ({ clickRun: null, rejectedNew: new Set(), cursorLag, cursorPrev });

  // reset() hook. A drag the browser ended without a pointerup (native HTML5 drag and drop) must not leave the
  // button held in the next episode, where overlays and syncs wait for its release. The position stays for the
  // drawn cursor.
  function reset(env) {
    if (env.lastPointer) env.lastPointer = { ...env.lastPointer, buttons: 0 };
    env._rt.input = fresh(kit.knobs.truthy(env.opts.cursorlag), env.lastPointer ? { ...env.lastPointer } : null);
  }

  // The current click run (util.clickCount): { x, y, t, step, n } or null.
  const clickRun = (env) => S(env).clickRun;

  const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock']);
  const xy = (e) => ({ x: Math.round(e.clientX * 10) / 10, y: Math.round(e.clientY * 10) / 10 });
  const role = (el) => (el.closest && el.closest('[data-role]')?.dataset.role) || el.tagName?.toLowerCase();

  function inputs(env) {
    const f = env.taskDef && env.taskDef.inputs;
    const list = (typeof f === 'function' ? f(env.spec) : f) || ['pointer'];
    // A page that scrolls as a whole is scrolled with the wheel, whatever the task's own inputs.
    return env.episode && env.episode.scrollable && !list.includes('wheel') ? [...list, 'wheel'] : list;
  }

  // Undeclared input (see inputs in the env.js header): already swallowed by the listeners; count it and keep
  // it for feedback(). In undeclaredInput=void episodes it is a violation instead.
  function reject(env, kind, data = {}) {
    if (env.done || !env.episode) return;
    if (env.episode.stray === 'void' && kind in env.rejected && !data.input) {
      env.flag(kind, data);
      return;
    }
    env.rejected[kind] = (env.rejected[kind] || 0) + 1;
    S(env).rejectedNew.add(kind);
    env.log('rejected', { kind, ...data });
  }

  // What to tell the agent about input rejected since the last call (BrowserGym's last_action_error).
  function feedback(env) {
    const kinds = [...S(env).rejectedNew];
    S(env).rejectedNew.clear();
    const say = { keyboard: 'Keyboard input is not available on this page; use the mouse.',
      wheel: 'The mouse wheel is not available on this page; use the mouse to click or drag instead.' };
    return kinds.map((k) => say[k] || `${k} input is not available on this page.`).join(' ');
  }

  // Remember the pointer (env.lastPointer) and move the drawn cursor. With the page option cursorLag=1 the cursor
  // is drawn only by lagCursor() (force: the first draw after reset).
  function trackCursor(env, e, force) {
    env.lastPointer = { clientX: e.clientX, clientY: e.clientY, buttons: e.buttons };
    if (S(env).cursorLag && !force) return;
    drawCursor(env, e);
  }

  function drawCursor(env, p) {
    if (!env.cursorEl || !p) return;
    env.cursorEl.style.display = 'block';
    env.cursorEl.style.transform = `translate(${p.clientX}px, ${p.clientY}px)`;
    env.cursorEl.classList.toggle('down', (p.buttons & 1) === 1);
  }

  // cursorLag=1 (page option): at every stepClock the drawn cursor shows where the pointer was at the previous
  // stepClock, as a remote screen that lags one frame behind (K3).
  function lagCursor(env) {
    const s = S(env);
    if (!s.cursorLag) return;
    drawCursor(env, s.cursorPrev);
    s.cursorPrev = env.lastPointer ? { ...env.lastPointer } : null;
  }

  // The left button is held (between agent actions, in a split drag).
  const buttonHeld = (env) => !!(env.lastPointer && (env.lastPointer.buttons & 1));

  function install(env) {
    env._rt.input = fresh(false, null);
    window.addEventListener('pointerdown', (e) => {
      trackCursor(env, e);
      env.presses++;
      // Click runs (util.clickCount): left presses on one spot within one agent action and 500 ms.
      const now = performance.now();
      const s = S(env);
      const run = s.clickRun;
      const step = kit.clock.steps(env);
      if (e.button !== 0) s.clickRun = null;
      else if (run && run.step === step && now - run.t <= 500 && Math.hypot(e.clientX - run.x, e.clientY - run.y) <= 5) {
        run.n++;
        run.t = now;
      } else s.clickRun = { x: e.clientX, y: e.clientY, t: now, step, n: 1 };
      kit.split.press(env, e);
      env.log('down', { ...xy(e), target: role(e.target) });
    }, true);
    window.addEventListener('pointermove', (e) => {
      trackCursor(env, e);
      if (e.buttons) env.log('move', xy(e));
    }, true);
    window.addEventListener('pointerup', (e) => {
      trackCursor(env, e);
      env.log('up', xy(e));
      kit.split.atomicDrag(env, e, true);
    }, true);
    for (const type of ['drop', 'dragend']) window.addEventListener(type, (e) => kit.split.atomicDrag(env, e, false), true);
    // Widgets update the model in their own (bubble-phase) handlers; refresh the debug view afterwards.
    for (const type of ['pointermove', 'pointerup']) window.addEventListener(type, () => env.render());

    // Input kinds the task does not allow (non-pointer routes to the same widget state) are rejected: these
    // window capture listeners are registered before any page script, so stopImmediatePropagation keeps the
    // event from every page handler and preventDefault from every default action (typing, Tab focus, Enter or
    // Space activating a button, arrow keys moving a native control, scrolling).
    const allows = (kind) => !!(env.taskDef && env.spec && env.inputs().includes(kind));
    const swallow = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const swallowedKeys = new Set(); // keys whose keydown was rejected: their keyup is swallowed too
    window.addEventListener('keydown', (e) => {
      // Holding a modifier for a modifier-click is a pointer route, not keyboard input.
      if (MODIFIER_KEYS.has(e.key)) return env.log('modifier', { key: e.key });
      if (allows('keyboard')) return env.log('key', { key: e.key });
      swallow(e);
      swallowedKeys.add(e.code || e.key);
      env.rejectInput('keyboard', { key: e.key });
    }, true);
    window.addEventListener('keyup', (e) => {
      if (!swallowedKeys.delete(e.code || e.key)) return;
      swallow(e);
    }, true);
    // Text inserted without a key event (IME commit, CDP insertText) is keyboard input too; drops are pointer.
    window.addEventListener('beforeinput', (e) => {
      if (allows('keyboard') || /Drop|Drag/.test(e.inputType || '')) return;
      swallow(e);
      env.rejectInput('keyboard', { input: e.inputType });
    }, true);
    window.addEventListener('wheel', (e) => {
      if (allows('wheel')) return;
      swallow(e);
      env.rejectInput('wheel', { dx: e.deltaX, dy: e.deltaY });
    }, { capture: true, passive: false });
    window.addEventListener('contextmenu', (e) => e.preventDefault(), true);
  }

  kit.input = { reset, clickRun, inputs, reject, feedback, trackCursor, lagCursor, buttonHeld, install };
})();
