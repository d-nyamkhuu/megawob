/*
 * click-control / menu: mode 'bar' (click-menu.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { iconFor, ICONS, keepIdxOf, leafKeysOf, menuAncestors, menuNode, menuProgressError, menuResult,
    menuWrongFinal, norm, T, targetCorrect, walk } = fam.lib;

  function sampleMenu(rng, ctx) {
    const { o, ood, opts } = ctx;
    const modes = (opts.traits && opts.traits.menuOpen) || ['hover', 'click'];
    const openBy = rng.pick([].concat(modes));
    const aim = openBy === 'hover' && rng.bool(0.5);
    const extra = { openBy, aim, aimDelay: aim ? rng.pick([300, 500, 700]) : 0 };
    const maxDepth = ood ? 3 : 2;
    if (rng.bool(0.5)) {
      for (;;) {
        const names = rng.shuffle(C.sample(rng, [...new Set(C.FIRST_NAMES)].filter((s) => s.length <= 10 && !/[>|]/.test(s)), 80, o));
        let p = 0;
        const build = (depth, prefix) => {
          const n = ood ? rng.int(3, 5) : rng.int(2, 4);
          const out = [];
          for (let i = 0; i < n && p < names.length; i++) {
            const label = names[p++];
            const key = prefix ? `${prefix}>${label}` : label;
            const node = { key, label };
            if (depth < maxDepth && rng.bool(ood ? 0.6 : 0.5)) node.children = build(depth + 1, key);
            out.push(node);
          }
          return out;
        };
        const tree = build(0, '');
        const leaves = [];
        walk(tree, (n) => { if (!n.children) leaves.push(n.key); });
        if (!tree.some((n) => n.children)) continue;
        const deep = leaves.filter((k) => k.split('>').length >= (ood ? 3 : 2));
        const target = deep.length && rng.bool(0.8) ? rng.pick(deep) : rng.pick(leaves);
        return { mode: 'bar', ...extra, tree, target, by: 'path' };
      }
    }
    // App menu from MENU_ITEMS: top-level items of one menu, 1-2 submenus named after other menus.
    const menus = C.MENU_ITEMS.map((m) => ({ menu: m.menu || m.name, items: (m.items || []).map((it) => (typeof it === 'string' ? { label: it } : it))
      .filter((it) => it.label && !/[>|]/.test(it.label) && it.label.length <= 24) })).filter((m) => m.menu && m.items.length >= 3);
    for (;;) {
      const picked = C.sample(rng, menus, ood ? 4 : 3, o);
      if (picked.length < 2) continue;
      const [main, ...subs] = picked;
      const leaf = (it, prefix) => ({ key: prefix ? `${prefix}>${it.label}` : it.label, label: it.label, shortcut: it.shortcut, icon: iconFor(it.label) });
      const tree = rng.sample(main.items, Math.min(main.items.length, ood ? rng.int(5, 6) : rng.int(3, 5))).map((it) => leaf(it, ''));
      const nSub = ood ? Math.min(subs.length, rng.int(2, 3)) : rng.int(1, 2);
      for (const g of subs.slice(0, nSub)) {
        if (tree.some((n) => norm(n.label) === norm(g.menu))) continue;
        const kids = rng.sample(g.items, Math.min(g.items.length, rng.int(3, 4))).map((it) => leaf(it, g.menu));
        if (ood && subs.length > nSub && rng.bool(0.7)) {
          const deeper = subs[subs.length - 1];
          const pk = `${g.menu}>${deeper.menu}`;
          if (!kids.some((k) => k.key === pk)) {
            kids.splice(rng.int(0, kids.length), 0, { key: pk, label: deeper.menu,
              children: rng.sample(deeper.items, Math.min(deeper.items.length, 3)).map((it) => leaf(it, pk)) });
          }
        }
        tree.splice(rng.int(0, tree.length), 0, { key: g.menu, label: g.menu, children: kids });
      }
      // Unique keys / labels among siblings.
      let dup = false;
      const check = (nodes) => {
        const seen = new Set();
        for (const n of nodes) {
          if (seen.has(norm(n.label))) dup = true;
          seen.add(norm(n.label));
          if (n.children) check(n.children);
        }
      };
      check(tree);
      if (dup || !tree.some((n) => n.children)) continue;
      // A disabled leaf (never the target).
      const tops = tree.filter((n) => !n.children);
      if (tops.length > 1 && rng.bool(0.7)) rng.pick(tops).disabled = true;
      // Icons must be unique for icon targets.
      const seen = new Set();
      walk(tree, (n) => {
        if (!n.icon) return;
        if (seen.has(n.icon)) delete n.icon;
        else seen.add(n.icon);
      });
      const leaves = [];
      walk(tree, (n) => { if (!n.children && !n.disabled) leaves.push(n); });
      const deep = leaves.filter((n) => n.key.includes('>'));
      const t = deep.length && rng.bool(0.6) ? rng.pick(deep) : rng.pick(leaves);
      const by = t.icon && rng.bool(0.35) ? 'icon' : t.key.includes('>') && rng.bool(0.4) ? 'path' : 'label';
      return { mode: 'button', ...extra, tree, target: t.key, by };
    }
  }

  env.scenario('click-control', {
    name: 'menu',
    sample: sampleMenu,
    baseModel(spec, c) {
      return { path: spec.mode === 'button' ? null : [], out: false, outMs: 0, ...c };
    },
    progress: menuProgressError,
    correct: targetCorrect,
    result: menuResult,
    wrongFinal: menuWrongFinal,
    wrongNav(spec, rng) {
      const anc = menuAncestors(spec.target);
      const parents = [];
      walk(spec.tree, (n) => { if (n.children && !anc.includes(n.key) && !n.disabled) parents.push(n.key); });
      if (!parents.length) return null;
      const p = rng.pick(parents);
      return { path: menuAncestors(p).concat([p]) };
    },
    partial(spec) {
      const anc = menuAncestors(spec.target);
      if (spec.mode === 'button') return { path: anc.length > 1 ? anc.slice(0, 1) : [] };
      return anc.length ? { path: anc.slice(0, Math.max(1, anc.length - 1)) } : null;
    },
    scene(spec) {
      const anc = menuAncestors(spec.target);
      if (spec.mode === 'button') return { path: anc };
      return anc.length ? { path: anc } : null;
    },
    planStep(model, spec) {
      if (spec.mode === 'button' && model.path === null) return { click: { trigger: 'menu' } };
      const anc = menuAncestors(spec.target);
      for (let i = 0; i < anc.length; i++) {
        if (model.path[i] !== anc[i]) return spec.openBy === 'hover' ? { move: { item: anc[i] } } : { click: { item: anc[i] } };
      }
      return { click: { item: spec.target } };
    },
    tick(model, spec, dt) {
      if (!spec.aim) return model;
      const base = 0;
      if (!model.out || !model.path || model.path.length <= base) return model.outMs ? { ...model, outMs: 0 } : model;
      const outMs = model.outMs + dt;
      if (outMs + 1e-9 < spec.aimDelay) return { ...model, outMs };
      return { ...model, outMs: 0, path: [] };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const path = (key) => key === spec.target || spec.target.startsWith(key + '>');
      const prune = (nodes) => {
        const keep = new Set(keepIdxOf(r, nodes, (n) => path(n.key), k(1, 2)));
        return nodes.filter((_, i) => keep.has(i)).map((n) => (n.children && path(n.key) ? { ...n, children: prune(n.children) } : n));
      };
      spec.tree = prune(spec.tree);
      spec.aim = false;
      spec.aimDelay = 0;
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const anc = menuAncestors(spec.target);
      const labels = anc.concat([spec.target]).map((k) => menuNode(spec, k).label);
      const leaf = labels[labels.length - 1];
      const vars = { path: spec.target, arrow: q(labels.join(' › ')), words: labels.slice(0, -1).join(', then '), leaf, leafq: q(leaf), q: q(leaf) };
      if (spec.mode === 'bar') core = anc.length ? P(T.menuBar, vars) : P(T.menuBar.slice(0, 2), vars);
      else if (spec.by === 'icon') {
        const icon = ICONS[menuNode(spec, spec.target).icon];
        core = P(T.menuIcon, { icon, aicon: `${/^[aeiou]/i.test(icon) ? 'an' : 'a'} ${icon}` });
      }
      else if (spec.by === 'path') core = P(T.menuPath, vars);
      else core = P(T.menuLabel, vars);
      terse = labels.join(' › ');
      if (anc.length) steps = (spec.mode === 'button' ? ['open the menu'] : []).concat(labels.slice(0, -1).map((l) => `open ${l}`), [`click ${leaf}`]);
      return { core, terse, steps };
    },
    phKind: () => 'menu',
    retarget(spec, model, rng, out, other) {
      let t = null;
      t = other(leafKeysOf(spec.tree), spec.target); if (t !== null) out.by = 'path';
                                                                return t;
    },
  });
})();
