/*
 * use-desktop-tools / prefs: change settings in a modal Preferences dialog with tabs and save.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { C, freshPick, I, LV, othersOf, say, tpl } = fam.lib;
  const { cap, clamp, quote: q, sameJson } = env.util;

  function numStep(s) {
    const span = s.max - s.min;
    return span <= 20 ? 1 : span <= 100 ? 5 : span <= 500 ? 10 : span <= 2000 ? 50 : 100;
  }

  function samplePrefs(rng, opts) {
    const crng = rng.fork('content');
    const groups = [...new Set(C.SETTINGS.map((s) => s.group))];
    for (;;) {
      const nTabs = opts.level === 'easy' ? 2 : opts.level === 'medium' ? 3 : opts.ood ? rng.int(5, 6) : rng.int(3, 4);
      const chosen = rng.sample(groups, nTabs);
      const tabs = [];
      const settings = {};
      const init = {};
      for (const g of chosen) {
        const pool = C.SETTINGS.filter((s) => s.group === g);
        const k = Math.min(pool.length, LV(opts) ? 3 : opts.ood ? rng.int(5, 6) : rng.int(3, 5));
        const picked = C.sample(crng, pool, k, { csplit: opts.csplit });
        const tab = { id: C.slug(g), label: g, ids: [] };
        for (const s of picked) {
          const e = { label: s.label, tab: tab.id, kind: s.kind, negated: s.negated, desc: s.description };
          if (s.kind === 'toggle') {
            e.ctl = rng.bool(0.65) ? 'switch' : 'check';
            init[s.id] = rng.bool(0.45);
          } else if (s.kind === 'select') {
            e.options = s.options.slice();
            e.ctl = e.options.length <= 3 && rng.bool(0.6) ? 'seg' : 'dropdown';
            init[s.id] = rng.pick(e.options);
          } else {
            e.min = s.min;
            e.max = s.max;
            e.unit = s.unit || '';
            e.step = numStep(s);
            e.ctl = 'number';
            const n = Math.floor((s.max - s.min) / e.step);
            init[s.id] = s.min + e.step * rng.int(0, n);
          }
          settings[s.id] = e;
          tab.ids.push(s.id);
        }
        tabs.push(tab);
      }
      const all = tabs.flatMap((t) => t.ids);
      const nT = Math.min(all.length, LV(opts) ? 1 : opts.ood ? rng.int(3, 4) : rng.int(1, 2));
      const goal = {};
      for (const id of rng.sample(all, nT)) {
        const s = settings[id];
        if (s.kind === 'toggle') goal[id] = !init[id];
        else if (s.kind === 'select') goal[id] = rng.pick(s.options.filter((o) => o !== init[id]));
        else {
          const n = Math.floor((s.max - s.min) / s.step);
          const cur = Math.round((init[id] - s.min) / s.step);
          let k = cur;
          for (let t = 0; t < 20 && k === cur; t++) k = clamp(cur + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 6, 10]), 0, n);
          if (k === cur) continue;
          goal[id] = s.min + s.step * k;
        }
      }
      if (!Object.keys(goal).length) continue;
      return {
        tabs, settings, init, goal,
        opener: rng.bool(0.6) ? 'gear' : 'menu',
        tabStyle: rng.bool(0.5) ? 'top' : 'side',
        numRoute: rng.bool(0.5) ? 'type' : 'stepper',
        saveLabel: rng.pick(['Save', 'Save changes', 'OK', 'Done', 'Save it']),
        apply: rng.bool(0.5),
      };
    }
  }

  function prefsInit(spec, rng) {
    const saved = { ...spec.init };
    const m = { dlg: false, tab: spec.tabs[0].id, draft: { ...saved }, saved, dd: null, menu: false, view: null };
    const ids = Object.keys(spec.goal);
    if (spec.startMode === 'scene') return { ...m, dlg: true, tab: spec.settings[ids[0]].tab };
    if (spec.startMode === 'partial') {
      const id = ids[0];
      if (ids.length > 1) {
        const s2 = { ...saved, [id]: spec.goal[id] };
        return { ...m, saved: s2, draft: { ...s2 } };
      }
      return { ...m, dlg: true, tab: spec.settings[id].tab, draft: { ...saved, [id]: spec.goal[id] } };
    }
    if (spec.startMode === 'wrong') {
      const others = Object.keys(spec.settings).filter((id) => !(id in spec.goal));
      if (others.length) {
        const w = rng.pick(others);
        const s = spec.settings[w];
        let v;
        if (s.kind === 'toggle') v = !saved[w];
        else if (s.kind === 'select') v = s.options.find((o) => o !== saved[w]);
        else v = saved[w] + s.step <= s.max ? saved[w] + s.step : saved[w] - s.step;
        const s2 = { ...saved, [w]: v };
        return { ...m, saved: s2, draft: { ...s2 } };
      }
    }
    return m;
  }

  const pfWant = (spec, id) => (id in spec.goal ? spec.goal[id] : spec.init[id]);
  function prefsError(m, spec) {
    const draft = m.dlg ? m.draft : m.saved;
    let e = 0;
    for (const id of Object.keys(spec.settings)) {
      const w = pfWant(spec, id);
      e += (draft[id] !== w ? 0.4 : 0) + (m.saved[id] !== w ? 0.6 : 0);
    }
    return Math.min(1, e / Object.keys(spec.goal).length);
  }

  const pfOpen = (m) => (m.dlg ? m : { ...m, dlg: true, draft: { ...m.saved }, dd: null, menu: false });
  const pfClose = (m) => ({ ...m, dlg: false, draft: { ...m.saved }, dd: null });
  const pfTab = (m, tab) => ({ ...m, tab, dd: null });
  const pfDd = (m, id) => ({ ...m, dd: m.dd === id ? null : id });
  function pfSet(m, spec, id, value) {
    const s = spec.settings[id];
    let v = value;
    if (s.kind === 'number') {
      v = Number(value);
      if (!Number.isFinite(v)) return { ...m, dd: null };
    }
    return { ...m, draft: { ...m.draft, [id]: v }, dd: null };
  }
  function pfStep(m, spec, id, dir) {
    const s = spec.settings[id];
    const cur = Number(m.draft[id]);
    return pfSet(m, spec, id, clamp(cur + dir * s.step, s.min, s.max));
  }
  const pfDirty = (m) => m.dlg && !sameJson(m.draft, m.saved);
  const pfApply = (m) => ({ ...m, saved: { ...m.draft }, dd: null });
  const pfSave = (m) => ({ ...m, saved: { ...m.draft }, dlg: false, dd: null });

  function prefsPlan(m, spec) {
    if (prefsError(m, spec) === 0) return null;
    const draft = m.dlg ? m.draft : m.saved;
    const order = spec.tabs.flatMap((t) => t.ids);
    const fixes = order.filter((id) => draft[id] !== pfWant(spec, id));
    if (!fixes.length) return { click: { footer: 'save' } };
    if (!m.dlg) {
      if (spec.opener === 'menu') return { click: { open: m.menu ? 'item' : 'menu' } };
      return { click: { open: 'gear' } };
    }
    const id = fixes[0];
    const s = spec.settings[id];
    const want = pfWant(spec, id);
    if (m.tab !== s.tab) return { click: { tab: s.tab } };
    const v = m.view;
    if (v && v.tab === m.tab && v.ids) {
      const idx = spec.tabs.find((t) => t.id === m.tab).ids.indexOf(id);
      if (idx < v.first || idx > v.last) return { wheel: [{ pane: 'prefs' }, (idx < v.first ? -1 : 1) * Math.max(60, 50 * Math.abs(idx < v.first ? v.first - idx : idx - v.last))] };
    }
    if (m.dd !== null && m.dd !== id) return { click: { setting: m.dd } };
    if (s.kind === 'toggle') return { click: { setting: id } };
    if (s.ctl === 'seg') return { click: { option: [id, want] } };
    if (s.kind === 'select') return m.dd === id ? { click: { option: [id, want] } } : { click: { setting: id } };
    const diff = Math.round((want - Number(m.draft[id])) / s.step);
    if (spec.numRoute === 'stepper' && Math.abs(diff) <= 4 && Number.isInteger((want - Number(m.draft[id])) / s.step)) {
      return { click: { stepper: [id, Math.sign(diff)] } };
    }
    return { type: [{ setting: id }, String(want)] };
  }

  const T_PREFS = ['Open the preferences and {goals}.', 'Open Preferences, {goals}, then save.',
    'Change these settings: {goals}. Save when done.', 'Go to the app settings and {goals}.',
    'Update your preferences: {goals}.', 'I need you to {goals} in the app preferences and save the change.',
    '{Goals} using the Preferences dialog.',
    'Please {goals} and save your preferences.',
    'Save the preferences after you {goals}.',
    '{Goals}. Save your preferences afterward.',
    'Please save the preference changes: {goals}.',
    'Preferences update: {goals}, then save.',
    'The preferences need changing: {goals}. Save.',
    'Use Preferences to {goals} and save.',
    'For my preferences, {goals}, then save.',
    'Make and save this update: {goals}.',
    '{Goals}. Save this update in Preferences.',
    'Make these changes in Preferences and save: {goals}.',
    'What I want saved in Preferences: {goals}.',
    '{Goals}, saving the result in Preferences.'];

  function prefsGoalText(rng, spec, id) {
    const s = spec.settings[id];
    const label = q(I.alias(rng, s.label, [], 0.3));
    const v = spec.goal[id];
    if (s.kind === 'toggle') {
      const on = v === true;
      const verbs = on ? ['turn on', 'enable', 'switch on', s.ctl === 'check' ? 'check' : 'turn on']
        : ['turn off', 'disable', 'switch off', s.ctl === 'check' ? 'uncheck' : 'turn off'];
      const verb = rng.pick(verbs);
      return rng.bool(0.25) ? `make sure ${label} is ${on ? 'on' : 'off'}` : `${verb} ${label}`;
    }
    const val = s.kind === 'number' ? `${v}${s.unit ? ` ${s.unit}` : ''}` : v;
    return rng.pick([`set ${label} to ${val}`, `change ${label} to ${val}`, `choose ${val} for ${label}`]);
  }

  // A setting's value as the dialog shows it (switch / check: On / Off; numbers with their unit).
  function pfShown(spec, id, v) {
    const s = spec.settings[id];
    if (s.kind === 'toggle') return [v ? 'On' : 'Off', v ? ['on', 'enabled', 'checked'] : ['off', 'disabled', 'unchecked']];
    if (s.kind === 'number') return [`${v}${s.unit ? ` ${s.unit}` : ''}`, [String(v)]];
    return [String(v), []];
  }

  // prefs: other settings to change (at least one different from the current goal).
  function retargetPrefs(s, spec, rng) {
    const all = spec.tabs.flatMap((t) => t.ids);
    const n = Object.keys(spec.goal).length;
    const fresh = all.filter((id) => !(id in spec.goal));
    for (let tries = 0; tries < 30; tries++) {
      const ids = (fresh.length >= n ? rng.sample(fresh, n) : rng.sample(all, n));
      const goal = {};
      for (const id of ids) {
        const d = spec.settings[id];
        const init = spec.init[id];
        if (d.kind === 'toggle') goal[id] = !init;
        else if (d.kind === 'select') goal[id] = rng.pick(d.options.filter((o) => o !== init));
        else {
          const nn = Math.floor((d.max - d.min) / d.step);
          const cur = Math.round((init - d.min) / d.step);
          let k = cur;
          for (let t = 0; t < 20 && k === cur; t++) k = clamp(cur + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 6, 10]), 0, nn);
          if (k === cur) continue;
          goal[id] = d.min + d.step * k;
        }
      }
      if (Object.keys(goal).length !== n || sameJson(goal, spec.goal)) continue;
      s.goal = goal;
      return true;
    }
    return false;
  }

  // Exposed for widgets.
  Object.assign(fam.helpers, { pfOpen, pfClose, pfTab, pfSet, pfStep, pfDd, pfSave, pfApply, pfDirty });

  const changed = (m, spec) => !sameJson(m.saved, spec.init);

  env.scenario('use-desktop-tools', {
    name: 'prefs',
    sample: samplePrefs,
    init: prefsInit,
    error: prefsError,
    plan: prefsPlan,
    lead: 0.5,
    solve(spec, m) {
      const saved = { ...spec.init, ...spec.goal };
      return { ...m, saved, draft: { ...saved }, dlg: false, dd: null };
    },
    instruction(spec, rng) {
      const ids = Object.keys(spec.goal);
      const parts = ids.map((id) => prefsGoalText(rng, spec, id));
      const goals = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
      return say(rng, spec, tpl(rng, spec, T_PREFS, { goals, Goals: cap(goals) }), parts.join('; '), ['open the preferences', ...parts, 'save']);
    },
    changed,
    prepared(m, spec, e) {
      if (!m.dlg || !m.draft) return e;
      const right = Object.keys(spec.settings).every((id) => m.draft[id] === pfWant(spec, id));
      return right && !changed(m, spec) ? 0 : e;
    },
    confirmVerb: 'save the changes',
    ambiguous(jr, spec) {
      const toggles = Object.keys(spec.settings).filter((id) => spec.settings[id].kind === 'toggle');
      const a = jr.pick(toggles);
      const bs = toggles.filter((id) => spec.settings[id].tab !== spec.settings[a].tab);
      if (!bs.length) return undefined;
      const b = jr.pick(bs);
      spec.settings[b].label = spec.settings[a].label;
      const tabLabel = (id) => spec.tabs.find((t) => t.id === spec.settings[id].tab).label;
      const label = q(spec.settings[a].label);
      const words = (id) => [tabLabel(id), tabLabel(id).split(/[ &,]/)[0]];
      const onoff = jr.pick(['on', 'off']);
      return { mode: 'ambiguous', cands: [words(a), words(b)],
        others: othersOf(spec.tabs.flatMap((t) => [t.label, t.label.split(/[ &,]/)[0]]), words(a), words(b)),
        message: `There are two settings called ${label}: one on the ${tabLabel(a)} tab and one on the ${tabLabel(b)} tab. Which one do you mean?`,
        templates: [
          'Open the preferences and turn {onoff} {label}.', 'In Preferences, switch {onoff} {label} and save.',
          'Turn {onoff} {label} in the app settings.', 'Set {label} to {onoff} in Preferences and save.',
          '{label} should be {onoff} in Preferences. Save.'
        ],
        vars: { onoff, label }, terse: `turn ${onoff} ${label}` };
    },
    impossible(jr, spec) {
      const name = freshPick(jr, C.SETTINGS.map((x) => x.label), new Set(Object.values(spec.settings).map((x) => x.label.toLowerCase())));
      const label = q(name);
      return { mode: 'impossible', what: [name], message: `I can't do that: there is no setting called ${name} in Preferences.`,
        templates: [
          'Open the preferences and turn on {label}.', 'In Preferences, switch on {label} and save.',
          'Turn on {label} in the app settings.', '{label} should be on in Preferences. Save.'
        ],
        vars: { label }, terse: `turn on ${label}` };
    },
    facts(model, spec, add) {
      const ids = Object.keys(spec.goal);
      const first = ids[0];
      const [val, al] = pfShown(spec, first, model.saved[first]);
      add(spec.settings[first].label, val, al);
      const other = spec.tabs.find((t) => t.id === spec.settings[first].tab).ids.find((id) => !(id in spec.goal));
      const any = other || Object.keys(spec.settings).find((id) => !(id in spec.goal));
      if (any) {
        const [v2, al2] = pfShown(spec, any, model.saved[any]);
        add(spec.settings[any].label, v2, al2);
      }
      add('Tabs in Preferences', spec.tabs.length, null, ['number of tabs']);
    },
    silent(next, prev, spec, rng, cands) {
      const ids = Object.keys(spec.goal).filter((id) => next.saved[id] !== prev.saved[id]);
      if (ids.length) {
        const id = rng.pick(ids);
        cands.push((m) => { m.saved[id] = prev.saved[id]; if (!m.dlg) m.draft = { ...m.saved }; });
        const s = spec.settings[id];
        if (s.kind === 'number' && Number(next.saved[id]) % 10 !== 0) {
          const r = clamp(Math.round(Number(next.saved[id]) / 10) * 10, s.min, s.max);
          cands.push((m) => { m.saved[id] = r; if (!m.dlg) m.draft = { ...m.saved }; });
        }
      }
    },
    retarget: (s, spec, model, rng) => retargetPrefs(s, spec, rng),
    simulate(m, spec, step, now, t) {
      if (step.type) m = pfSet(m, spec, step.type[0].setting, step.type[1]);
      else if (t.open === 'menu') m = { ...m, menu: !m.menu };
      else if (t.open) m = pfOpen(m);
      else if (t.tab) m = pfTab(m, t.tab);
      else if (t.footer === 'save') m = pfSave(m);
      else if (t.footer === 'apply') m = pfApply(m);
      else if (t.footer === 'cancel') m = pfClose(m);
      else if (t.stepper) m = pfStep(m, spec, t.stepper[0], t.stepper[1]);
      else if (t.option) m = pfSet(m, spec, t.option[0], t.option[1]);
      else if (t.setting) {
        const s = spec.settings[t.setting];
        m = s.kind === 'toggle' ? pfSet(m, spec, t.setting, !m.draft[t.setting]) : pfDd(m, t.setting);
      }
      return m;
    },
  });
})();
