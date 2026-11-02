// Widget templates (kit/env.js widget contract, template?; templates/README.md): a template that returns several widgets
// registers each under its own name, in place; the base site's widget files are designs with no name on
// templates/<task>/base.js and register every base widget its manifest lists; trait-tests derives its widgets
// from them.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { HTML, bootPage, loadKit } from './stubdom.mjs';

const manifest = (site) => JSON.parse(fs.readFileSync(path.join(HTML, 'sites', site, 'manifest.json'), 'utf8'));

test('a template may return several widgets: each takes its own name, in place, with the widget file keys', async () => {
  const { env } = loadKit();
  // Valid widgets (the registration check runs): render is a function tagged with the widget it came from.
  const render = (tag) => Object.assign(() => ({ anchors: {} }), { tag });
  const widget = (name, extra) => ({ name, scenarios: ['v'], render: render(name), locate: () => null, ...extra });
  env.template('fam/multi', (design, def) => (def.name ? widget('ignored', { render: render('one') })
    : [widget('a', { site: 'x' }), widget('b', { site: 'x' })]));
  env.widget({ task: 'fam', site: 'unit', ...widget('first') });
  env.widget({ task: 'fam', site: 'unit', template: 'fam/multi', design: {} });
  env.widget({ task: 'fam', site: 'unit', name: 'one', template: 'fam/multi', design: {} });
  env.widget({ task: 'fam', site: 'unit', ...widget('last') });
  await env._templated('fam', 'unit');
  assert.deepEqual([...env.widgetsFor('fam')], ['first', 'a', 'b', 'one', 'last']);
  assert.equal(env.widgetOf('fam', 'a').site, 'unit');
  assert.equal(env.widgetOf('fam', 'b').render.tag, 'b');
  assert.equal(env.widgetOf('fam', 'one').name, 'one');
  assert.equal(env.widgetOf('fam', 'one').render.tag, 'one');
  assert.equal('design' in env.widgetOf('fam', 'a'), false);
});

test('a template loads the shared template files it uses before it is built; each lib is made once', async () => {
  const { env } = loadKit();
  let made = 0;
  // Registered as if their files had loaded: _template only loads what is not registered yet.
  env.template('fam/_shared', () => { made++; return { word: 'shared' }; });
  env.template('fam/a', () => ({ name: 'a', scenarios: [env.templateLib('fam/_shared').word],
    render: () => ({ anchors: {} }), locate: () => null }), { uses: ['fam/_shared'] });
  env.widget({ task: 'fam', site: 'unit', name: 'a', template: 'fam/a', design: {} });
  await env._templated('fam', 'unit');
  assert.deepEqual([...env.widgetOf('fam', 'a').scenarios], ['shared']);
  assert.equal(env.templateLib('fam/_shared').word, 'shared');
  assert.equal(made, 1);
  assert.throws(() => env.templateLib('fam/missing'), /not loaded/);
});

const REFERENCE = fs.readdirSync(path.join(HTML, 'templates'))
  .filter((f) => f !== 'site' && fs.existsSync(path.join(HTML, 'templates', f, 'base.js')));

test('the base site registers every manifest widget of the tasks with a base template', async () => {
  const widgets = manifest('base').widgets;
  for (const task of REFERENCE) {
    const { env } = await bootPage({ task });
    assert.deepEqual([...env.widgetsFor(task)].sort(), widgets[task].map((s) => s.name).sort(), task);
    for (const name of env.widgetsFor(task)) {
      assert.equal(env.widgetOf(task, name).site, 'base', `${task}/${name}`);
    }
  }
});

test('trait-tests derives its widgets from base widgets on a template', async () => {
  const widgets = manifest('trait-tests').widgets;
  for (const task of Object.keys(widgets).filter((f) => REFERENCE.includes(f))) {
    const { env } = await bootPage({ task, site: 'trait-tests' });
    assert.deepEqual([...env.widgetsFor(task)].sort(), widgets[task].map((s) => s.name).sort(), task);
    for (const name of env.widgetsFor(task)) {
      const s = env.widgetOf(task, name);
      assert.equal(s.site, 'trait-tests', `${task}/${name}`);
      assert.equal(s.split, 'test', `${task}/${name}`);
    }
  }
  // An entry's traits add to the base widget's: sort-into-bins/palette is the base boxes widget with a palette.
  const { env } = await bootPage({ task: 'sort-into-bins', site: 'trait-tests', widget: 'palette' });
  const ref = (await bootPage({ task: 'sort-into-bins' })).env.widgetOf('sort-into-bins', 'boxes');
  const plain = (x) => JSON.parse(JSON.stringify(x));
  const palette = { target: 'blue', distractors: ['black', 'outline'] };
  assert.deepEqual(plain(env.widgetDef.traits), { ...plain(ref.traits), palette });
  assert.deepEqual(plain(env.widgetDef.scenarios), ['collect']);
});
