/* choose-option/hooks.js: report, interruption and silent-save hooks. */
(function () {
  'use strict';
  const lib = env.taskOf('choose-option').lib;
  const { uniq, matrixAsked, SET_SCENARIOS, errorOf, lc, prefixFor, suffixFor, tagQuery } = lib;

  function facts(model, spec) {
    const v = spec.scenario;
    const L = spec.label;
    const al = spec.labelAliases || [];
    const out = [];
    // aliases: other spellings of the value; labels: other names of the fact.
    // A value without ', ' (free-text replies split clauses there; words() makes the spellings equal); the original is an alias.
    const push = (label, value, aliases, labels) => {
      const shown = String(value);
      const v = shown.replace(/[,;.]\s+/g, ' ');
      out.push({ label, value: v, aliases: uniq([shown, ...(aliases || []).map(String)].filter((a) => a && a !== v)),
        labels: uniq((labels || []).map(String).filter((a) => a && a !== label)) });
    };
    const opts = spec.options || [];
    if (v === 'dropdown' || v === 'radio' || v === 'autocomplete' || v === 'grouped' || v === 'combobox') {
      push(L, model.value, [], al);
      if (v === 'radio' && spec.details && spec.details[model.value]) {
        const [price, time] = spec.details[model.value].split(' · ');
        push('Price', price, [], ['cost']);
        if (time) push('Delivery time', time, [], ['arrives in', 'delivery']);
      }
      if (v === 'grouped') push('Group', (spec.groups.find((g) => g.options.includes(model.value)) || {}).name || '', [], ['section']);
    } else if (v === 'toggles') {
      const on = model.on.filter(Boolean).length;
      push('Switches on', `${on} of ${model.on.length}`, [String(on)]);
      for (const i of spec.said.slice(0, 2)) push(spec.items[i].label, model.on[i] ? 'On' : 'Off', model.on[i] ? ['enabled', 'on'] : ['disabled', 'off']);
    } else if (v === 'tree') {
      const k = model.values.length;
      push('Options checked', `${k} of ${opts.length}`, [String(k)]);
      for (const g of spec.groups.slice(0, 2)) {
        const c = g.options.filter((o) => model.values.includes(o)).length;
        push(g.name, `${c} of ${g.options.length}`, [String(c)]);
      }
    } else if (v === 'dependent') {
      push(L, model.country, [], al);
      push(spec.label2, model.city, []);
    } else if (v === 'matrix') {
      const answered = model.values.filter(Boolean).length;
      push('Rows answered', `${answered} of ${model.values.length}`, [String(answered)]);
      for (const i of matrixAsked(spec).slice(0, 2)) push(spec.rows[i], model.values[i], []);
    } else {
      const vals = model.values || [];
      push(`Selected ${spec.plural}`, vals.length, []);
      // No comma in the value: free-text replies split clauses at ', ' (the comma spelling is an alias).
      push(L, vals.join(' and '), [vals.join(', ')], al);
    }
    if (out.length < 2) {
      const n = opts.filter((o) => !(spec.disabled || []).includes(o)).length;
      push('Options available', n, [`${n} options`]);
    }
    return out.slice(0, 4);
  }

  function parts(model, spec) {
    const v = spec.scenario;
    const seen = new Set();
    const out = [];
    const add = (name, value, aliases) => {
      if (!name || seen.has(name)) return;
      seen.add(name);
      out.push({ name, value, ...(aliases && aliases.length ? { aliases } : {}) });
    };
    if (v === 'toggles') spec.items.forEach((it, i) => add(it.label, !!model.on[i], it.concept && it.concept !== it.label ? [it.concept] : []));
    else if (v === 'matrix') spec.rows.forEach((r, i) => add(r, (model.values || [])[i] || ''));
    else if (v === 'dependent') {
      spec.options.forEach((o) => add(o, model.country === o));
      for (const c of Object.values(spec.cities).flat()) add(c, model.city === c);
    } else if (SET_SCENARIOS.includes(v)) {
      const on = new Set(model.values || []);
      spec.options.forEach((o) => add(o, on.has(o)));
      // The group headings of a tree are parts that never change (their children do): naming one is not naming a change.
      if (v === 'tree') (spec.groups || []).forEach((g) => add(g.name, 'group'));
    } else spec.options.forEach((o) => add(o, model.value === o));
    return out;
  }

  const neighbours = (list, x) => {
    const i = list.indexOf(x);
    return [list[i - 1], list[i + 1]].filter((o) => o !== undefined);
  };

  function silent(next, prev, spec, rng) {
    const v = spec.scenario;
    const m = env.util.clone(next);
    const off = spec.disabled || [];
    if (v === 'dropdown' || v === 'radio' || v === 'grouped' || v === 'combobox' || v === 'autocomplete') {
      if (next.value !== spec.target) return null;
      const ok = (o) => o !== spec.target && !off.includes(o);
      const near = neighbours(spec.options, spec.target).filter(ok);
      const back = prev && prev.value && ok(prev.value) ? [prev.value] : [];
      const nv = rng.pick(near.concat(back).length ? near.concat(back) : spec.options.filter(ok));
      m.value = nv;
      if (v === 'autocomplete') m.text = nv;
    } else if (SET_SCENARIOS.includes(v)) {
      const have = next.values.filter((x) => spec.targets.includes(x));
      const extras = spec.options.filter((o) => !spec.targets.includes(o) && !next.values.includes(o));
      const fresh = have.filter((x) => !(prev.values || []).includes(x));
      const drop = have.length ? rng.pick(fresh.length ? fresh : have) : null;
      if (drop !== null && (next.values.length === spec.targets.length ? rng.bool(0.75) : true)) m.values = next.values.filter((x) => x !== drop);
      else if (extras.length && have.length === spec.targets.length) m.values = spec.options.filter((o) => o === rng.pick(extras) || next.values.includes(o));
      else return null;
      if (v === 'tags' || v === 'chips') m.values = m.values.slice();
    } else if (v === 'toggles') {
      const right = spec.said.filter((i) => !!next.on[i] === spec.want[i]);
      if (!right.length) return null;
      const fresh = right.filter((i) => !!(prev.on || [])[i] !== spec.want[i]);
      const i = rng.pick(fresh.length ? fresh : right);
      m.on[i] = !m.on[i];
    } else if (v === 'matrix') {
      const right = matrixAsked(spec).filter((i) => next.values[i] === spec.goals[i]);
      if (!right.length) return null;
      const i = rng.pick(right);
      const nb = neighbours(spec.cols, spec.goals[i]);
      m.values[i] = rng.pick(nb);
    } else if (v === 'dependent') {
      const T = spec.target;
      if (next.country === T.country && next.city === T.city) {
        const alt = neighbours(spec.cities[T.country], T.city);
        m.city = rng.pick(alt.length ? alt : spec.cities[T.country].filter((c) => c !== T.city));
      } else if (next.country === T.country && !next.city) {
        m.country = rng.pick(neighbours(spec.options, T.country));
        m.city = '';
      } else return null;
    } else return null;
    return errorOf(m, spec) > 0 ? m : null;
  }

  const priceOf = (t) => (/free/i.test(t) ? 0 : Number((/\$([\d.]+)/.exec(t) || [0, NaN])[1]));

  const daysOf = (t) => {
    const part = String(t).split(' · ')[1] || '';
    if (/today/.test(part)) return 0;
    const n = part.match(/\d+/g);
    return n ? Number(n[n.length - 1]) : NaN;
  };

  function retarget(spec, model, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    const sp = env.util.clone(spec);
    const off = spec.disabled || [];
    const cur = model.value;
    const done = () => (errorOf(model, sp) > 0 ? sp : null);
    const others = (xs, ...not) => xs.filter((o) => !not.includes(o) && !off.includes(o));
    if (v === 'radio' && spec.criterion) {
      const ms = spec.options.map((n) => ({ n, price: priceOf(spec.details[n]), days: daysOf(spec.details[n]) }));
      const kinds = rng.shuffle(['cheapest', 'fastest', 'within']);
      for (const kind of kinds) {
        let pool = ms;
        let d;
        if (kind === 'within') {
          const ds = uniq(ms.map((x) => x.days)).filter((x) => x >= 1);
          if (!ds.length) continue;
          d = rng.pick(ds);
          pool = ms.filter((x) => x.days <= d);
          if (pool.length < 2 || pool.length === ms.length) continue;
        }
        const key = kind === 'fastest' ? (x) => x.days : (x) => x.price;
        const best = Math.min(...pool.map(key));
        const win = pool.filter((x) => key(x) === best);
        if (win.length !== 1 || win[0].n === spec.target || win[0].n === cur) continue;
        sp.criterion = { kind, days: d };
        sp.target = win[0].n;
        return done();
      }
      return null;
    }
    if (v === 'dropdown' || v === 'radio' || v === 'combobox' || v === 'grouped') {
      const pool = others(spec.options, spec.target, cur);
      if (!pool.length) return null;
      const t = rng.pick(pool);
      sp.target = t;
      if (v === 'grouped') {
        sp.group = spec.groups.find((g) => g.options.includes(t)).name;
        sp.criterion = 'name';
      }
      if (v === 'combobox') {
        const words = uniq(t.split(/[\s,()/]+/).filter((w) => w.length >= 3 && /[a-z]/i.test(w)));
        const good = words.filter((w) => {
          const n = spec.options.filter((o) => lc(o).includes(lc(w))).length;
          return n >= 1 && n <= 5;
        });
        sp.query = good.length ? rng.pick(good) : t;
      }
      return done();
    }
    if (v === 'autocomplete') {
      const pool = spec.options;
      for (const t of rng.shuffle(pool.filter((o) => o !== spec.target && o !== cur))) {
        const prefix = prefixFor(pool, t);
        if (!prefix) continue;
        let hint = { kind: 'full', prefix };
        if (rng.bool(0.45)) {
          const suffix = suffixFor(pool, t, prefix);
          if (suffix) hint = { kind: 'affix', prefix, suffix };
        }
        sp.target = t;
        sp.hint = hint;
        sp.typed = prefix;
        return done();
      }
      return null;
    }
    if (v === 'listbox' || v === 'checkbox' || v === 'chips' || v === 'tags') {
      const free = spec.options.filter((o) => !spec.targets.includes(o) && !(model.values || []).includes(o));
      if (!free.length) return null;
      const nt = rng.pick(free);
      const drop = rng.pick(spec.targets);
      const targets = spec.options.filter((o) => (o === nt) || (spec.targets.includes(o) && o !== drop));
      sp.targets = targets;
      if (v === 'listbox' && !spec.multi) sp.target = nt;
      if (v === 'tags') {
        sp.queries = Object.fromEntries(targets.map((t) => [t, spec.queries[t] || tagQuery(sp, t)]));
      }
      return done();
    }
    if (v === 'toggles') {
      for (const j of rng.shuffle(spec.said.map((_, k) => k))) {
        const i = spec.said[j];
        const eff = spec.effect.slice();
        eff[j] = !eff[j];
        const want = spec.want.slice();
        want[i] = spec.items[i].neg ? !eff[j] : eff[j];
        sp.effect = eff;
        sp.want = want;
        const r = done();
        if (r) return r;
      }
      return null;
    }
    if (v === 'tree') {
      for (const gi of rng.shuffle(spec.groups.map((_, k) => k))) {
        const g = spec.groups[gi];
        const m = g.options.length;
        const kinds = (m >= 4 ? ['all', 'except', 'none', 'only'] : ['all', 'except', 'none', 'only']).filter((k) => k !== g.goal.kind);
        const kind = rng.pick(kinds);
        const nl = kind === 'except' || kind === 'only' ? rng.int(1, Math.min(2, m - 2)) : 0;
        const list = rng.sample(g.options, Math.max(0, nl)).sort((a, b) => g.options.indexOf(a) - g.options.indexOf(b));
        sp.groups[gi].goal = { kind, list };
        sp.targets = sp.groups.flatMap((gr) => gr.options.filter((o) => {
          const { kind: kk, list: ll } = gr.goal;
          return kk === 'all' || (kk === 'except' && !ll.includes(o)) || (kk === 'only' && ll.includes(o));
        }));
        if (JSON.stringify(sp.targets) === JSON.stringify(spec.targets)) continue;
        const r = done();
        if (r) return r;
      }
      return null;
    }
    if (v === 'dependent') {
      const T = spec.target;
      const sameCountry = spec.cities[T.country].filter((c) => c !== T.city && c !== model.city);
      if (sameCountry.length && rng.bool(0.5)) { sp.target = { country: T.country, city: rng.pick(sameCountry) }; return done(); }
      const cs = spec.options.filter((c) => c !== T.country && c !== model.country);
      if (!cs.length) return null;
      const country = rng.pick(cs);
      sp.target = { country, city: rng.pick(spec.cities[country]) };
      return done();
    }
    if (v === 'matrix') {
      for (const i of rng.shuffle(matrixAsked(spec))) {
        const cols = spec.cols.filter((c) => c !== spec.goals[i] && c !== model.values[i]);
        if (!cols.length) continue;
        sp.goals[i] = rng.pick(cols);
        return done();
      }
      return null;
    }
    return null;
  }

  Object.assign(lib, { facts, parts, silent, retarget });
})();
