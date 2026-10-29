/*
 * use-file-manager / dblrename: rename a file by double-clicking its name.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { fill, itemOf, pathText, pick, say } = fam.lib;
  const { quote: q } = env.util;

  const V = env.scenariosOf('use-file-manager');

  env.scenario('use-file-manager', {
    name: 'dblrename',
    keyboard: true,
    goal(rng, spec, tree) {
    if (!V.rename.goal(rng, spec, tree)) return false;
    spec.keys = true;
    spec.route = 'dbl';
    return true;
    },
    init: V.rename.init,
    result: V.rename.result,
    solve: V.rename.solve,
    plan: V.rename.plan,
    instruction(spec, rng) {
      const g = spec.goal;
      const F = itemOf(spec, g.file);
      const vars = { file: q(F.name), new: q(g.name), path: q(pathText(rng, spec, F.parent)), folder: q(itemOf(spec, F.parent).name) };
      const T = ['Rename {file} in {path} to {new}: double-click its name to edit it.', 'Double-click the name of {file} (in {folder}) and change it to {new}.',
        'Edit the name of {file} in place so it reads {new}.', 'In {folder}, double-click {file} to rename it {new}.',
        '{file} should be called {new}; rename it by double-clicking the name.',
        'Find {file} in {folder}; double-click its name and enter {new}.',
        '{new} is the new name for {file} in {folder}; double-click its name.',
        '{file}: alter its name in place, replacing it with {new}.',
        'Give {file} the name {new} through the inline name editor.',
        'Set the inline filename field for {file} to {new}.',
        'Use {new} for {file}: double-click its name to edit it in place.',
        'With {file} in {folder}, double-click its name; type {new} in place.',
        'At {path}, give {file} the name {new} by double-clicking its name.',
        'Change {file} to {new} in {path} by double-clicking the file name.',
        'For {file} in {folder}, enter {new} after double-clicking its name.',
        'An inline name edit for {file} should leave it named {new}.'];
      return say(rng, spec, fill(pick(rng, spec, T), vars), { terse: `${F.name} → ${g.name}` });
    },
    silent: V.rename.silent,
    retarget: V.rename.retarget,
  });
})();
