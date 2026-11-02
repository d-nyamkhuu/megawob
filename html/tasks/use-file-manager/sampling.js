/* use-file-manager/sampling.js: shared sampling; loaded through logic.js files before the scenarios. */
(function () {
  'use strict';
  const lib = env.taskOf('use-file-manager').lib;
  const { C, ROOTS, V, genTree, countOk, judgeOf } = lib;

  function sampleSpec(rng, opts) {
    const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : env.taskOf('use-file-manager').scenarios;
    const scenario = opts.scenario || rng.pick(list);
    for (let tries = 0; tries < 80; tries++) {
      const spec = { scenario, startMode: opts.startMode || 'off', isplit: opts.isplit || 'train', csplit: opts.csplit || 'train',
        ood: !!opts.ood, keys: false, route: null, upRoute: rng.bool(0.5), grouped: false, rootName: rng.pick(ROOTS) };
      if (opts.level === 'easy' || opts.level === 'medium') spec.level = opts.level;
      spec.cols = spec.ood ? rng.int(5, 7) : rng.int(4, 6);
      spec.view = rng.bool(0.35) ? 'list' : 'icons';
      const tree = genTree(rng, spec);
      spec.folders = tree.folders;
      spec.files = tree.files; // shared: tree.addFile appends here
      if (!V[scenario].goal(rng, spec, tree)) continue;
      if (!countOk(spec)) continue;
      spec.recoverable = typeof opts.recover === 'boolean' ? opts.recover : rng.bool(0.5);
      forceRoute(spec, opts.route, rng);
      if (['ambiguous', 'impossible', 'confirm'].includes(opts.judge)) {
        const sm = spec.startMode;
        const j = judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) spec.judge = j;
        else spec.startMode = sm;
      }
      return spec;
    }
    throw new Error(`use-file-manager: could not sample ${scenario}`);
  }

  // opts.route (episode knob): override the drawn keyboard share after everything else is drawn (undefined
  // changes nothing). Only rename and delete have a keyboard route; no scenario has a wheel route.
  function forceRoute(spec, route, rng) {
    const v = spec.scenario;
    if (v !== 'rename' && v !== 'delete') return; // dblrename / multidelete have no keyboard route
    if (route === 'keyboard') {
      spec.keys = true;
      spec.route = v === 'rename' ? 'f2' : 'key';
    } else if (route === 'pointer') {
      spec.keys = false;
      if (spec.route === 'f2') spec.route = 'menu';
      // A forked stream, so the pick does not shift anything drawn from rng.
      if (spec.route === 'key') spec.route = rng.fork('route').pick(['menu', 'menu', 'toolbar']);
    } else return;
    spec.forcedRoute = route;
  }

  Object.assign(lib, { sampleSpec });
})();
