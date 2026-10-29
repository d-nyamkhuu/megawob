// Definition checks at registration (kit/runtime/validate.js): env.task / scenario / site / widget throw one error
// naming the file and every problem, and accept what the contract allows.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadKit } from './stubdom.mjs';
import { lineTask } from './fixtures.mjs';

const kitEnv = () => loadKit().env;
const site = (over = {}) => ({ name: 'unit', frame() {}, ...over });
const widget = (over = {}) => ({ task: 'line', site: 'unit', name: 'unit', split: 'train', scenarios: ['a'],
  render() {}, locate() {}, ...over });
const registered = () => {
  const env = kitEnv();
  env.task(lineTask());
  return env;
};

test('a complete task registers; helpers, lib and optional hooks are accepted', () => {
  const env = kitEnv();
  env.task(lineTask({ inputs: ['pointer', 'keyboard'], tickMs: 50, reply: true, faults: false, lib: {}, helpers: { label() {} },
    heldoutScenarios: ['seg'], tick: undefined, judgeModes: ['confirm'], facts: () => [] }));
  env.task(lineTask({ name: 'line2', inputs: () => ['pointer'], faults: () => true, uses: ['line'],
    files: ['a.js', 'scenarios/b-c.js'] }));
  assert.ok(env.taskOf('line'));
});

test('a task is closed: a member that is no contract key is rejected, with where it belongs', () => {
  assert.throws(() => kitEnv().task(lineTask({ ICONS: {} })),
    /unknown key 'ICONS'; a task keeps what widgets read under helpers and what its own files share under lib/);
  assert.throws(() => kitEnv().task(lineTask({ selfTest() { return []; } })), /unknown key 'selfTest'/);
  assert.throws(() => kitEnv().task(lineTask({ helpers: () => ({}) })), /'helpers' must be object, not function/);
});

test('a task missing a contract key names the key and the file', () => {
  for (const key of ['name', 'scenarios', 'startModes', 'sample', 'init', 'error', 'tolerance', 'instruction', 'plan', 'solve']) {
    const env = kitEnv();
    const def = lineTask({ [key]: undefined });
    assert.throws(() => env.task(def), new RegExp(`env\\.task\\(.*\\): missing '${key}'`), key);
  }
  assert.throws(() => kitEnv().task(lineTask({ tolerance: undefined })),
    /^Error: tasks\/line\/logic\.js: env\.task\('line'\)/);
});

test('a task with a wrong type, an empty or repeated list or a bad value is rejected', () => {
  const bad = [
    [{ tolerance: { tau: 2 } }, /'tolerance' must be function, not object/],
    [{ name: 7 }, /'name' must be string, not number/],
    [{ scenarios: 'a' }, /'scenarios' must be array of strings, not string/],
    [{ scenarios: [] }, /'scenarios' is empty/],
    [{ scenarios: ['a', 'a'] }, /'scenarios' repeats a value/],
    [{ scenarios: ['a', 2] }, /'scenarios' must be array of strings/],
    [{ startModes: ['off', 'sometimes'] }, /'startModes' has 'sometimes'/],
    [{ startModes: ['solved'] }, /'startModes' must include 'off'/],
    [{ inputs: ['pointer', 'touch'] }, /'inputs' has 'touch'/],
    [{ inputs: 'pointer' }, /'inputs' must be function or array of strings/],
    [{ judgeModes: ['maybe'] }, /'judgeModes' has 'maybe'/],
    [{ reply: 'yes' }, /'reply' must be boolean/],
    [{ tickMs: '50' }, /'tickMs' must be number/],
    [{ faults: 1 }, /'faults' must be boolean or function/],
    [{ files: ['../x.js'] }, /'files' entry '..\/x.js'/],
    [{ files: ['logic.js'] }, /'files' entry 'logic.js'/],
    [{ files: 'a.js' }, /'files' must be array of strings/],
    [{ uses: [1] }, /'uses' must be array of strings/],
  ];
  for (const [over, re] of bad) assert.throws(() => kitEnv().task(lineTask(over)), re, JSON.stringify(over));
  assert.throws(() => kitEnv().task(null), /the definition must be an object/);
});

test('a misspelled contract key is named; on a site, a key that is another name is not a typo', () => {
  const env = kitEnv();
  assert.throws(() => env.task(lineTask({ tolerence: () => ({}) })), /unknown key 'tolerence' \(did you mean 'tolerance'\?\)/);
  assert.throws(() => env.task(lineTask({ Plan: () => null })), /unknown key 'Plan' \(did you mean 'plan'\?\)/);
  assert.throws(() => env.task(lineTask({ startmodes: ['off'] })), /did you mean 'startModes'/);
  assert.throws(() => env.task(lineTask({ judgeMode: ['confirm'] })), /did you mean 'judgeModes'/);
  // a task is closed (no near miss to name: plain unknown keys); a site is open but for near misses
  assert.throws(() => env.task(lineTask({ baseTolerance() {} })), /unknown key 'baseTolerance';/);
  env.site({ name: 'open', frame: () => ({}), baseTolerance() {}, target() {}, retargets2: 1 });
});

test('all problems of one definition come in one error', () => {
  const env = kitEnv();
  assert.throws(() => env.task(lineTask({ sample: undefined, init: 3, startModes: ['x'] })),
    (e) => /missing 'sample'/.test(e.message) && /'init' must be function/.test(e.message) && /'startModes' has 'x'/.test(e.message));
});

test('the error names the running script when there is one', () => {
  const { env, win } = loadKit();
  win.document.currentScript = { src: 'file:///x/html/tasks/other/logic.js' };
  assert.throws(() => env.task(lineTask({ plan: 1 })), /^Error: tasks\/other\/logic\.js: env\.task\('line'\)/);
  win.document.currentScript = { src: 'file:///x/html/sites/foo/widgets/bar.js' };
  assert.throws(() => env.widget(widget({ render: 1 })), /^Error: sites\/foo\/widgets\/bar\.js: env\.widget\(line\/unit\)/);
  win.document.currentScript = null;
});

test('env.scenario: a registered task, a listed name once, hooks of the right type', () => {
  const env = registered();
  env.scenario('line', { name: 'a', sample: () => ({}), inputs: ['pointer'], prepared: () => 1, ICONS: {} });
  assert.throws(() => env.scenario('line', { name: 'a' }), /env\.scenario\('line'\): 'a' is registered twice/);
  assert.throws(() => env.scenario('line', { name: 'c' }), /env\.scenario\('line', 'c'\): 'c' is not one of the task's scenarios \(a, b\)/);
  assert.throws(() => env.scenario('line', {}), /missing 'name'/);
  env.scenario('line', { name: 'b', judge: () => ({}) });
  assert.throws(() => env.scenario('line', { name: 'b', judge: 1 }), /'judge' must be function/);
  assert.throws(() => env.scenario('line', { name: 'b', plan: 'x' }), /'plan' must be function, not string/);
  assert.throws(() => env.scenario('line', { name: 'b', inputs: ['mouse'] }), /'inputs' has 'mouse'/);
  assert.throws(() => env.scenario('line', { name: 'b', sampel: () => 1 }), /unknown key 'sampel' \(did you mean 'sample'\?\)/);
  assert.throws(() => env.scenario('line', 5), /the definition must be an object/);
  assert.throws(() => env.scenario('nope', { name: 'a' }), /not registered/);
});

test('a site needs a name and frame (a template site needs the template instead)', () => {
  const env = kitEnv();
  env.site(site({ styles: ['site.css'], scripts: [], langs: ['en', 'de'], overlay() {}, fault() {}, hazard() {}, notice() {},
    pauseOnOverlay: true, initialOverlay: { kind: 'chat', p: 0.5, at: 1 }, frameOld() {} }));
  env.site({ name: 'tpl', template: 'site/base', design: { accent: 'red' } });
  assert.throws(() => env.site({ name: 'x' }), /^Error: sites\/x\/site\.js: env\.site\('x'\): missing 'frame' \(function\)/);
  assert.throws(() => env.site({ frame() {} }), /missing 'name'/);
  assert.throws(() => env.site({ template: 'site/base' }), /missing 'name'/);
  assert.throws(() => env.site({ name: 'x', design: {} }), /'design' needs a 'template'/);
  assert.throws(() => env.site({ name: 'x', template: 'base' }), /'template' must be 'site\/<name>'/);
  assert.throws(() => env.site(null), /the definition must be an object/);
});

test('a site with a wrong type, a bad initialOverlay or a misspelled key is rejected', () => {
  const env = kitEnv();
  const bad = [
    [{ frame: 'x' }, /'frame' must be function, not string/],
    [{ styles: 'a.css' }, /'styles' must be array of strings/],
    [{ scripts: [1] }, /'scripts' must be array of strings/],
    [{ langs: 'en' }, /'langs' must be array of strings/],
    [{ overlay: {} }, /'overlay' must be function, not object/],
    [{ pauseOnOverlay: 1 }, /'pauseOnOverlay' must be boolean/],
    [{ initialOverlay: { p: 1 }, overlay() {} }, /'initialOverlay' needs a string 'kind'/],
    [{ initialOverlay: { kind: 'chat', after: 2 }, overlay() {} }, /'initialOverlay' has unknown key 'after'/],
    [{ initialOverlay: { kind: 'chat', p: '1' }, overlay() {} }, /'initialOverlay\.p' must be a number/],
    [{ initialOverlay: { kind: 'chat' } }, /'initialOverlay' needs an overlay\(\) function/],
    [{ overlays() {} }, /unknown key 'overlays' \(did you mean 'overlay'\?\)/],
    [{ Frame() {} }, /unknown key 'Frame' \(did you mean 'frame'\?\)/],
    [{ initialOverlays: {} }, /did you mean 'initialOverlay'/],
  ];
  for (const [over, re] of bad) assert.throws(() => env.site(site(over)), re, JSON.stringify(Object.keys(over)));
});

test('a template site is checked whole after its template filled it in', () => {
  const { win, env } = loadKit();
  const { validate } = win.__megawobKit;
  const raw = { name: 'tpl', template: 'site/base', design: {} };
  env.site(raw);
  assert.throws(() => validate.site(raw, { resolved: true }), /missing 'frame'/);
  validate.site({ ...raw, frame() {} }, { resolved: true });
});

test('a widget needs task, site, name, scenarios, render and locate; its keys are closed', () => {
  const env = registered();
  env.widget(widget({ split: undefined, name: 'nosplit' }));
  env.widget(widget({ split: 'test', name: 'trait-tests' }));
  env.widget(widget({ scrollable: () => true, uses: [['set-slider', 'a'], ['../vendor/x/min'], ['slider-react']], traits: {}, answerReply: true, clear() {}, scenarios: ['a', 'b'] }));
  for (const key of ['task', 'site', 'name', 'scenarios', 'render', 'locate']) {
    assert.throws(() => env.widget(widget({ [key]: undefined })), new RegExp(`env\\.widget\\(.*\\): missing '${key}'`), key);
  }
  assert.throws(() => env.widget(widget({ render: undefined })),
    /^Error: sites\/unit\/widgets\/line\.js: env\.widget\(line\/unit\): missing 'render' \(function\)/);
  assert.throws(() => env.widget(null), /the definition must be an object/);
});

test('a widget with a wrong type, value or key is rejected', () => {
  const env = registered();
  const bad = [
    [{ render: {} }, /'render' must be function, not object/],
    [{ locate: 'x' }, /'locate' must be function/],
    [{ name: 3 }, /'name' must be string/],
    [{ split: 'dev' }, /'split' must be train, heldout or test, not 'dev'/],
    [{ scenarios: [] }, /'scenarios' is empty/],
    [{ scenarios: 'a' }, /'scenarios' must be array of strings/],
    [{ scenarios: ['a', 'zzz'] }, /'scenarios' has zzz, not among the task's \(a, b\)/],
    [{ scrollable: 'yes' }, /'scrollable' must be boolean or function/],
    [{ traits: [] }, /'traits' must be object, not array/],
    [{ answerReply: 1 }, /'answerReply' must be boolean/],
    [{ uses: [[]] }, /'uses' entries must be arrays that start with a widget file name/],
    [{ uses: ['set-slider'] }, /'uses' entries must be arrays/],
    [{ scenario: ['a'] }, /unknown key 'scenario' \(did you mean 'scenarios'\?\)/],
    [{ scrollabel: true }, /unknown key 'scrollabel' \(did you mean 'scrollable'\?\)/],
    [{ inputs: ['pointer'] }, /unknown key 'inputs'/],
    [{ parts: {} }, /unknown key 'parts'/],
    [{ design: {} }, /'design' needs a 'template'/],
    [{ template: 'base' }, /'template' must be '<task>\/<name>'/],
  ];
  for (const [over, re] of bad) assert.throws(() => env.widget(widget(over)), re, JSON.stringify(Object.keys(over)));
});

test('a template widget registers with task and template; the resolved widget is checked whole', () => {
  const { win, env } = loadKit();
  const { validate } = win.__megawobKit;
  env.task(lineTask());
  env.widget({ task: 'line', template: 'line/basic' });
  env.widget({ task: 'line', name: 'one', template: 'line/basic', design: { parts: { head: (base) => base } } });
  assert.throws(() => env.widget({ name: 'x', template: 'line/basic' }), /missing 'task'/);
  assert.throws(() => env.widget({ task: 'line', name: 'x', template: 'line/basic', design: 5 }), /'design' must be object, not number/);
  assert.throws(() => env.widget({ task: 'line', name: 'x', template: 'line/basic', design: { parts: { head: 1 } } }),
    /'design\.parts' must map part names to functions/);
  assert.throws(() => env.widget({ task: 'line', name: 'x', template: 'line/basic', rendr: 1 }), /did you mean 'render'/);
  const made = { task: 'line', site: 'unit', name: 'one', template: 'line/basic', render() {}, locate() {} };
  assert.throws(() => validate.widget(made, { resolved: true }), /missing 'scenarios' \(array of strings\)/);
  validate.widget({ ...made, scenarios: ['a'] }, { resolved: true }, env.taskOf('line'));
  assert.throws(() => validate.widget({ ...made, scenarios: ['q'] }, { resolved: true }, env.taskOf('line')),
    /'scenarios' has q/);
});
