/*
 * click-control / tooltip-inspect: gather information by hovering before acting.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { cap, quote: q } = env.util;
  const C = env.content;
  const { ICONS, norm, personName, pickIn, T, targetCorrect, VERB } = fam.lib;

  // env.content.ICON_NAMES names that the base widgets draw under another name.
  const ICON_ALIASES = { settings: 'gear', 'zoom-in': 'zoomin', 'zoom-out': 'zoomout', 'more-horizontal': 'more', edit: 'pencil',
    inbox: 'mail' };
  // Default tooltips per icon (env.content.ICON_NAMES adds more when its names match).
  const TIPS = {
    plus: [
      'New', 'Add item', 'Create', 'Insert', 'Append', 'Queue'
    ], folder: ['Open folder', 'Browse files', 'Move to folder'], disk: ['Save', 'Save changes'],
    print: ['Print'], trash: ['Delete', 'Move to trash'], gear: ['Settings', 'Preferences'], star: ['Add to favorites', 'Star'],
    zoomin: ['Zoom in'], zoomout: ['Zoom out'], prev: ['Previous track'], stop: ['Stop'], play: ['Play'], next: ['Next track'],
    mail: ['Send by email', 'Messages'], bell: ['Notifications'], user: ['Profile', 'Account'], lock: ['Lock', 'Permissions'],
    home: ['Home'], heart: ['Like'], copy: ['Duplicate', 'Copy'], pencil: ['Edit', 'Rename'], search: ['Search', 'Find'],
    download: ['Download'], upload: ['Upload'], share: ['Share'], link: ['Copy link', 'Insert link'], archive: ['Archive'],
    tag: ['Add label', 'Tag'], pin: ['Pin', 'Pin to top'], flag: ['Flag', 'Report'], refresh: ['Refresh', 'Sync now'],
    undo: ['Undo'], redo: ['Redo'], bold: ['Bold'], italic: ['Italic'], list: ['Bulleted list'], calendar: ['Schedule', 'Calendar'],
    filter: ['Filter'], eye: ['Preview', 'Show'], more: ['More actions', 'More options'], info: ['Details', 'Info'],
    comment: ['Comment', 'Add comment'], cut: ['Cut'], image: ['Insert image'], bookmark: ['Bookmark', 'Save for later'],
    send: ['Send'], paperclip: ['Attach a file'], clock: ['History', 'Recent'], cloud: ['Sync status', 'Back up'],
    check: ['Mark as done', 'Approve'], globe: ['Language', 'Make public'], cart: ['Shopping cart', 'Add to cart'], pause: ['Pause'],
    moon: ['Dark mode'], sun: ['Light mode'], logout: ['Sign out'], grid: ['Grid view'], camera: ['Take a photo'],
  };

  const ID_LABELS = [
    'ID', 'Employee ID', 'Customer #', 'Member no.', 'Account ID', 'Order ref', 'Record #', 'Badge no.', 'Ticket ID',
    'Case ref', 'Roster no.', 'Guest ID'
  ];
  const ID_ACTIONS = [
    'Remove', 'Message', 'Select', 'Assign', 'Invite', 'Block', 'View', 'Approve', 'Archive', 'Enroll', 'Flag',
    'Follow', 'Mute', 'Verify', 'Restore', 'Promote'
  ];

  function iconTips() {
    const tips = {};
    for (const [k, v] of Object.entries(TIPS)) tips[k] = v.slice();
    for (const n of C.ICON_NAMES) {
      const name = n && (ICON_ALIASES[n.name || n.id] || n.name || n.id);
      const tip = n && (n.tooltip || n.label);
      if (name && tip && ICONS[name] && !tips[name].includes(tip)) tips[name].push(tip);
    }
    return tips;
  }

  function sampleTooltip(rng, ctx) {
    const { o, ood } = ctx;
    const delay = rng.pick([300, 500, 700]);
    if (rng.bool(0.5)) {
      const tips = iconTips();
      const n = ood ? rng.int(12, 14) : rng.int(6, 9);
      for (;;) {
        const icons = C.sample(rng, Object.keys(ICONS), n, o);
        const tools = icons.map((icon, i) => ({ key: `t${i}`, icon, tip: rng.pick(tips[icon] || [cap(ICONS[icon])]) }));
        if (new Set(tools.map((t) => norm(t.tip))).size < tools.length) continue;
        const target = rng.pick(tools).key;
        return { mode: 'icon', delay, tools, target, scan: scanOrder(rng, tools.map((t) => t.key), target) };
      }
    }
    // Duplicate names: 2-3 rows share one name; their IDs (shown on hover) tell them apart.
    const n = ood ? rng.int(8, 10) : rng.int(5, 7);
    const dupName = personName(rng.fork('dup'), o);
    const nDup = ood ? rng.int(3, 4) : rng.int(2, 3);
    const names = [];
    for (let i = 0; i < n - nDup; i++) {
      let nm;
      do nm = personName(rng, o); while (nm === dupName || names.includes(nm));
      names.push(nm);
    }
    for (let i = 0; i < nDup; i++) names.splice(rng.int(0, names.length), 0, dupName);
    const ids = new Set();
    const rows = names.map((name, i) => {
      let id;
      do id = String(rng.int(1000, 9899)); while (ids.has(id));
      ids.add(id);
      return { key: `r${i}`, name, id, meta: rng.pick([
        'Berlin', 'Lisbon', 'Toronto', 'Osaka', 'Nairobi', 'Austin', 'Leeds', 'Lyon', 'Pune', 'Bogotá', 'Cairo',
        'Delhi', 'Seoul', 'Tokyo', 'Kyoto', 'Miami', 'Kolkata', 'Milan', 'Accra', 'Dakar', 'Rabat', 'Tbilisi',
        'Jaipur', 'Colombo', 'Jakarta', 'Hanoi', 'Dhaka', 'Macau', 'Bergen', 'Malmö', 'Chennai', 'Coimbra', 'Perth',
        'Quito', 'Cusco', 'Tangier', 'Genoa', 'Cádiz', 'Basel', 'Kampala'
      ]) };
    });
    const dups = rows.filter((r) => r.name === dupName);
    const t = rng.pick(dups);
    return { mode: 'id', delay, rows, action: rng.pick(ID_ACTIONS), idLabel: rng.pick(ID_LABELS), target: t.key,
      scan: scanOrder(rng, dups.map((r) => r.key), t.key) };
  }
  // The oracle hovers 0-2 other candidates before the target (it demonstrates searching by tooltip).
  function scanOrder(rng, keys, target) {
    const others = rng.shuffle(keys.filter((k) => k !== target)).slice(0, rng.int(0, Math.min(2, keys.length - 1)));
    return others.concat([target]);
  }

  env.scenario('click-control', {
    name: 'tooltip-inspect',
    sample: sampleTooltip,
    baseModel(spec, c) {
      return { hover: null, hoverMs: 0, tip: null, seen: [], ...c };
    },
    progress: (model, spec) => model.seen.includes(spec.target) ? 0.5 : 1,
    correct: targetCorrect,
    result(spec, key) {
      if (spec.mode === 'icon') { const t = spec.tools.find((x) => x.key === key); return t ? `${t.tip} applied` : 'Done'; }
      { const r = spec.rows.find((x) => x.key === key); return r ? `${spec.action}: ${r.name} (${spec.idLabel} ${r.id})` : 'Done'; }
    },
    wrongFinal(spec, rng) {
      const list = spec.mode === 'icon' ? spec.tools : spec.rows.filter((r) => r.name === spec.rows.find((x) => x.key === spec.target).name);
      const ks = list.map((x) => x.key).filter((k) => k !== spec.target);
      return ks.length ? { key: rng.pick(ks) } : null;
    },
    planStep(model, spec) {
      const hoverT = spec.mode === 'icon' ? 'tool' : 'tip';
      if (model.seen.includes(spec.target)) return spec.mode === 'icon' ? { click: { tool: spec.target } } : { click: { act: spec.target } };
      const next = spec.scan.find((k) => !model.seen.includes(k)) || spec.target;
      if (model.hover === next) return { wait: true };
      return { move: { [hoverT]: next } };
    },
    settled(m) {
      return { ...m, hover: null, hoverMs: 0, tip: null };
    },
    tick(model, spec, dt) {
      if (model.hover === null || model.tip === model.hover) return model;
      const hoverMs = model.hoverMs + dt;
      if (hoverMs + 1e-9 < spec.delay) return { ...model, hoverMs };
      const seen = model.seen.includes(model.hover) ? model.seen : model.seen.concat([model.hover]);
      return { ...model, hoverMs, tip: model.hover, seen };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      spec.delay = Math.max(100, Math.round((spec.delay * (1 - 0.4 * lv)) / 50) * 50);
      if (spec.mode === 'icon') {
        spec.tools = pickIn(r, spec.tools, (t) => t.key === spec.target || spec.scan.includes(t.key), k(2, 4));
      } else if (easy) {
        const dupName = spec.rows.find((x) => x.key === spec.target).name;
        const dups = spec.rows.filter((x) => x.name === dupName);
        const drop = new Set(dups.filter((x) => x.key !== spec.target).slice(1).map((x) => x.key));
        spec.rows = spec.rows.filter((x) => !drop.has(x.key));
        spec.scan = spec.scan.filter((x) => !drop.has(x));
      }
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      if (spec.mode === 'icon') {
        const t = spec.tools.find((x) => x.key === spec.target);
        core = P(T.tipIcon, { q: q(t.tip) });
        terse = `${q(t.tip)} (toolbar)`;
      } else {
        const r = spec.rows.find((x) => x.key === spec.target);
        const verb = (VERB[spec.action] || [spec.action.toLowerCase()])[0];
        core = P(T.tipId, { A: cap(verb), a: verb, act: q(spec.action), name: r.name, idl: spec.idLabel, id: r.id });
        terse = `${spec.action} ${r.name} #${r.id}`;
      }
      return { core, terse, steps };
    },
    phKind: (spec) => spec.mode === 'icon' ? 'tool' : 'record',
  });
})();
