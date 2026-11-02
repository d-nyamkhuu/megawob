/*
 * trait-tests: a TEST-ONLY site (manifest "split": "test"; never produces a task name, see megawob/catalog.py).
 * `python -m megawob.check --site trait-tests` exercises opt-in widget traits that no base widget declares
 * (traits.sort, splitCals, noTabs, ...) so a regression in a task's trait logic fails the regular checker.
 *
 * It owns no frame and no widget code. Chrome, overlays, languages and styles are the base site's: the site is
 * the design {} on templates/site/base.js, with the base site.css. It loads
 * sites/base/widgets/<task>.js (as the site's `scripts`) and swallows its env.widget registrations. Each
 * widgets/<task>.js then calls env.trait-tests.derive(task, [...]) to register base widgets again under a
 * trait-tests name with extra `traits` (and optionally a narrower `scenarios` list):
 *   { name, base: '<base widget>', traits: {...}, scenarios?: [...] }
 * A trait that the base widget does not render fails the checker; pick another base widget or drop the entry.
 * A base widget file that is a design on a template (templates/<task>/base.js) registers no widgets
 * itself: derive() registers the entry on that template, and the template, when the kit builds it, makes the
 * entry from the base widget it builds for the base site (env.template below).
 */
(function () {
  'use strict';

  const task = new URLSearchParams(location.search).get('task');
  const baseWidgets = {}; // '<task>/<name>': base widgets as registered
  const refDesigns = {}; // task: the base widget file's design on a template
  const registerWidget = env.widget;
  const registerTemplate = env.template;

  env.widget = function (def) {
    if (def.site !== 'base') return registerWidget.call(env, def);
    if (def.template && !def.name) refDesigns[def.task] = def;
    else baseWidgets[`${def.task}/${def.name}`] = def;
    return undefined;
  };

  // The trait-tests widget of entry e on base widget base.
  function derived(fam, base, e) {
    const missing = (e.scenarios || []).filter((v) => !(base.scenarios || []).includes(v));
    if (missing.length) throw new Error(`trait-tests: ${fam}/${e.base} has no scenario ${missing.join(', ')} (has ${(base.scenarios || []).join(', ')})`);
    return {
      ...base,
      site: 'trait-tests',
      name: e.name,
      split: 'test',
      scenarios: e.scenarios || base.scenarios,
      traits: { ...(base.traits || {}), ...e.traits },
    };
  }

  // A derived widget on a template (design.trait-tests: its reference design and entry) is built from the base widget
  // the template makes for that design, as the kit would register it on the base site.
  env.template = function (name, make, opts) {
    return registerTemplate.call(env, name, (design, def) => {
      if (!design || !design.traitTests) return make(design, def);
      const { fam, ref, e } = design.traitTests;
      const { design: refDesign, ...own } = ref;
      const base = [].concat(make(refDesign || {}, own)).find((d) => d.name === e.base);
      if (!base) throw new Error(`trait-tests: no base widget ${fam}/${e.base} on ${own.template}`);
      return derived(fam, { ...base, ...own }, e);
    }, opts);
  };

  env.traitTests = {
    derive(fam, entries) {
      for (const e of entries) {
        const base = baseWidgets[`${fam}/${e.base}`];
        const ref = refDesigns[fam];
        if (base) registerWidget.call(env, derived(fam, base, e));
        else if (ref) registerWidget.call(env, { task: fam, site: 'trait-tests', name: e.name, split: 'test', template: ref.template, design: { traitTests: { fam, ref, e } } });
        else throw new Error(`trait-tests: no base widget ${fam}/${e.base} (have ${Object.keys(baseWidgets).join(', ')})`);
      }
    },
  };

  env.site({
    name: 'trait-tests',
    template: 'site/base',
    design: {},
    styles: ['sites/base/site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css'],
    scripts: [`sites/base/widgets/${task}.js`],
  });
})();
