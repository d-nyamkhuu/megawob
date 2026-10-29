/*
 * draw / connect: connect nodes of a diagram port to port.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { C, NODE, r4, T } = fam.lib;

  const edgeKey = (e) => `${e[0]}>${e[1]}`;

  function edgeDiff(model, spec) {
    const want = new Set(spec.keep.concat(spec.want).map(edgeKey));
    const have = new Set((model.edges || []).map(edgeKey));
    const extra = [...have].filter((k) => !want.has(k));
    const missing = [...want].filter((k) => !have.has(k));
    return { extra, missing };
  }

  const PIPELINE = ['Ingest', 'Validate', 'Transform', 'Enrich', 'Store', 'Notify', 'Review', 'Approve', 'Publish',
    'Archive', 'Deploy', 'Build', 'Test', 'Merge', 'Schedule', 'Invoice', 'Ship', 'Refund', 'Escalate', 'Triage',
    'Label', 'Export', 'Backup', 'Audit', 'Sign off', 'Draft', 'Translate', 'Index', 'Cache', 'Monitor', 'Parse',
    'Normalize', 'Classify', 'Segment', 'Partition', 'Compress', 'Encrypt', 'Decrypt', 'Redact', 'Anonymize', 'Hash',
    'Tokenize', 'Extract', 'Aggregate', 'Calculate', 'Forecast', 'Route', 'Dispatch', 'Queue', 'Retry', 'Throttle',
    'Reconcile', 'Allocate', 'Assign', 'Resolve', 'Request', 'Capture', 'Scan', 'Probe', 'Poll', 'Subscribe',
    'Refresh', 'Replicate', 'Migrate', 'Provision', 'Configure', 'Activate', 'Inspect', 'Clean', 'Filter', 'Sort',
    'Match', 'Compare', 'Summarize', 'Convert', 'Format', 'Render', 'Preview', 'Connect', 'Pause', 'Resume', 'Reject',
    'Cancel', 'Remove', 'Update', 'Edit', 'Read', 'Write', 'Send', 'Attach', 'Detach', 'Rank', 'Measure', 'Record',
    'Report', 'Estimate', 'Batch', 'Buffer', 'Rollback', 'Unpack', 'Encode', 'Recover', 'Await', 'Evaluate', 'Release',
    'Receive', 'Renew', 'Trigger', 'Start', 'Finish', 'Launch', 'Shutdown', 'Discover', 'Confirm', 'Post', 'Fetch',
    'Load', 'Split', 'Link', 'Unlink', 'Pair', 'Unpair', 'Map', 'Bundle', 'Expand', 'Collapse', 'Upload', 'Download',
    'Import', 'Persist', 'Search', 'Watch', 'Track', 'Pin', 'Alert', 'Page', 'Sign in', 'Invoke', 'Expire', 'Open',
    'Close', 'Lock', 'Unlock', 'Handoff'];

  function sampleDiagram(rng, opts, bd) {
    let n = opts.ood ? rng.int(7, 9) : rng.int(4, 6);
    if (opts.level) n = opts.level === 'easy' ? 4 : 5;
    const cr = rng.fork('content');
    const cs = { csplit: opts.csplit };
    const theme = rng.pick(['pipeline', 'org', 'cities']);
    let pool = PIPELINE;
    if (theme === 'org') pool = C.DEPARTMENTS;
    if (theme === 'cities') pool = C.CITIES.map((c) => c.city);
    pool = pool.filter((s) => s.length <= 12);
    const labels = C.sample(cr, [...new Set(pool)], n, cs);
    while (labels.length < n) labels.push(rng.pick(PIPELINE.filter((p) => !labels.includes(p))));
    // Layout: n distinct cells of a cols x rows lattice, jittered; ports stay inside the board. Narrow boards
    // (traits.aspect) take fewer columns and more rows.
    let cols = n <= 6 ? 3 : 4;
    let rows = n <= 6 ? 2 : 3;
    while (cols > 1 && (bd.w - 0.06) / cols < NODE.w + 0.08) cols--;
    rows = Math.max(rows, Math.ceil(n / cols));
    const cw = (bd.w - 0.06) / cols;
    const ch = (bd.h - 0.06) / rows;
    const cells = rng.sample([...Array(cols * rows).keys()], n);
    const nodes = cells.map((k, i) => {
      const c = k % cols;
      const r = Math.floor(k / cols);
      const jx = Math.max(0, cw - NODE.w - 0.1);
      const jy = Math.max(0, ch - NODE.h - 0.06);
      return {
        label: labels[i],
        x: r4(0.03 + c * cw + NODE.w / 2 + 0.05 + rng.float(0, jx)),
        y: r4(0.03 + r * ch + NODE.h / 2 + 0.03 + rng.float(0, jy)),
      };
    });
    return { nodes, theme };
  }

  function sampleConnectDiagram(rng, opts, bd) {
    for (;;) {
      const { nodes, theme } = sampleDiagram(rng, opts, bd);
      const n = nodes.length;
      const all = [];
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) all.push([i, j]);
      const orphanMode = rng.bool(0.3) && opts.level !== 'easy';
      let nw = orphanMode ? 1 : opts.ood ? 3 : rng.pick([1, 1, 2]);
      if (opts.level === 'easy') nw = 1;
      const orphan = orphanMode ? rng.int(0, n - 1) : -1;
      const pool = rng.shuffle(all.filter(([i, j]) => i !== orphan && j !== orphan));
      const keep = [];
      for (const e of pool) {
        if (keep.length >= (n <= 6 ? n - 2 : Math.ceil(n / 2) + 1)) break;
        if (keep.some(([i, j]) => i === e[1] && j === e[0])) continue;
        keep.push(e);
      }
      const used = new Set(keep.flatMap((e) => [edgeKey(e), edgeKey([e[1], e[0]])]));
      let want;
      if (orphanMode) {
        const other = rng.pick([...Array(n).keys()].filter((i) => i !== orphan));
        want = [rng.bool() ? [orphan, other] : [other, orphan]];
      } else {
        want = rng.shuffle(all.filter((e) => !used.has(edgeKey(e)))).slice(0, nw);
        if (want.some((e, k) => want.some((f, l) => l !== k && f[0] === e[1] && f[1] === e[0]))) continue;
      }
      if (want.length < nw) continue;
      // Every node but the orphan has an edge in orphan mode (so "the node with no connections" is unique).
      const deg = new Array(n).fill(0);
      for (const [i, j] of keep) { deg[i]++; deg[j]++; }
      if (orphanMode && deg.some((d, i) => i !== orphan && d === 0)) continue;
      return { nodes, theme, keep, want, mode: orphanMode ? 'orphan' : 'named', orphan };
    }
  }

  env.scenario('draw-shape', {
    name: 'connect',
    sample(rng, { o, board }) {
      return sampleConnectDiagram(rng, o, board);
    },
    tolerance() {
      return { tau: 0, sigma: 0.5, minInitialError: 0.4 };
    },
    init(spec, rng, mode) {
      const edges = spec.keep.map((e) => e.slice());
      if (mode === 'partial' && spec.want.length >= 2) edges.push(spec.want[0].slice());
      if (mode === 'wrong') {
        const n = spec.nodes.length;
        const bad = new Set(spec.keep.concat(spec.want).flatMap((e) => [edgeKey(e), edgeKey([e[1], e[0]])]));
        const [i] = spec.want[0];
        const cands = [...Array(n).keys()].filter((j) => j !== i && !bad.has(edgeKey([i, j])));
        if (cands.length) edges.push([i, rng.pick(cands)]);
      }
      return { edges };
    },
    error(model, spec) {
      const d = edgeDiff(model, spec);
      return (d.extra.length + d.missing.length) / spec.want.length;
    },
    solve(spec) {
      return { edges: spec.keep.concat(spec.want).map((e) => e.slice()) };
    },
    plan(model, spec) {
      const d = edgeDiff(model, spec);
      if (d.extra.length) return { click: { edgeDel: d.extra[0].split('>').map(Number) } };
      if (d.missing.length) {
        const [i, j] = d.missing[0].split('>').map(Number);
        return { drag: [{ port: [i, 'out'] }, { port: [j, 'in'] }] };
      }
      return null;
    },
    figurePts(spec) {
      return spec.nodes.flatMap((n) => [[n.x - NODE.w / 2, n.y - NODE.h / 2], [n.x + NODE.w / 2, n.y + NODE.h / 2]]);
    },
    instruction(spec, rng, say, tolP) {
      const L = (i) => `"${spec.nodes[i].label}"`;
      if (spec.mode === 'orphan') {
        const [i, j] = spec.want[0];
        const into = i === spec.orphan;
        const other = into ? j : i;
        return say(T(rng, spec, into ? [
          'Connect the node that has no connections to {b}.',
          'One node is not linked to anything yet; draw a connection from it to {b}.',
          'Find the unconnected node and wire it into {b}.',
          'Draw an arrow from the isolated node to {b}.',
          'Add a link from the node with no edges to {b}.',
          'Hook the stray node up to {b} (it should point to {b}).',
          '{b} needs an arrow from the node with no connections.',
          'The isolated node is the source; aim its arrow at {b}.',
          'Keep other links; the node with no edges must point to {b}.',
          'Start at the node with no links and drag into {b}.',
          'An arrow should leave the unconnected node and enter {b}.',
          'Leave all links intact; wire the isolated node to {b}.',
          'The only node without edges should feed into {b}.',
          'Give the isolated node an outgoing connection to {b}.',
        ] : [
          'Connect {b} to the node that has no connections.',
          'One node is not linked to anything yet; draw a connection from {b} to it.',
          'Find the unconnected node and wire {b} into it.',
          'Draw an arrow from {b} to the isolated node.',
          'Add a link from {b} to the node with no edges.',
          'Hook {b} up to the stray node (the arrow starts at {b}).',
          'The node with no links needs an arrow from {b}.',
          'Keep all links; {b} must point to the node with no edges.',
          'The isolated node is the endpoint; start at {b}.',
          'Drag from {b} into the input port of the isolated node.',
          'Drag from the output of {b} to the isolated node.',
          'Give {b} an outgoing arrow to the isolated node.',
          'An arrow should leave {b} and enter the unconnected node.',
          'Keep all arrows; link {b} to the isolated node.',
          'The node without edges should receive a link from {b}.',
          'Route a new arrow from {b} into the node with no links.',
          'Make the isolated node the endpoint of a link from {b}.',
          'Keep links; add the isolated node as a target for {b}.',
          'The missing link runs from {b} to the unlinked node.',
        ], { b: L(other) }), `link orphan ${into ? '->' : '<-'} ${spec.nodes[other].label}`);
      }
      const parts = spec.want.map(([i, j]) => `${L(i)} to ${L(j)}`);
      const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
      const arrows = spec.want.map(([i, j]) => `${spec.nodes[i].label} → ${spec.nodes[j].label}`).join(', ');
      const core = T(rng, spec, [
        'Connect {list}.',
        'In the diagram, draw a connection from {list}.',
        'Add {n} from {list} by dragging between the ports.',
        'Link {list} (arrows point to the second node).',
        'Wire up the diagram: {arrows}.',
        'Draw {n}: {arrows}.',
        'Create {n} {list}; leave the existing links as they are.',
        'Finish linking these nodes: {list}.',
        'Only draw what is shown: {arrows}.',
        'Use the ports to join {list}.',
        'Keep current links and add {n}: {arrows}.',
        'For each pair, link {list} in that order.',
        'Put {n} from {list} in the diagram.',
        'Follow these directions when linking: {arrows}.',
        'Drag output to input for {list}.',
        '{arrows}: add these connections.',
        'The diagram needs {n} from {list}.',
        'Leave existing arrows; connect {list}.',
        'Make {n} by wiring {list} in the given order.',
        'With other links intact, add {n}: {arrows}.',
        '{list}: drag each source to its target.',
        'Turn this plan into connections: {arrows}.',
        'Use {arrows} as a guide for adding {n}.',
        'The wiring to add is {arrows}.',
        'Trace out {arrows} between the ports.',
      ], { list, arrows, n: spec.want.length === 1 ? 'a link' : 'links' });
      return say(core, arrows, spec.want.length > 1 ? spec.want.map(([i, j]) => `connect ${L(i)} to ${L(j)}`) : null);
    },
    facts(model, spec, out) {
      const N = (i) => spec.nodes[i].label;
      const edges = model.edges || [];
      const [i, j] = spec.want[0];
      out.push({ label: 'Connections', value: String(edges.length), labels: [
        'Links', 'Arrows', 'Connectors', 'Edges', 'Ties', 'Wires', 'Arcs', 'Couplings'
      ] });
      out.push({ label: `Links into ${N(j)}`, value: String(edges.filter((e) => e[1] === j).length), labels: [`Arrows into ${N(j)}`, `Incoming links of ${N(j)}`] });
      out.push({ label: `Links out of ${N(i)}`, value: String(edges.filter((e) => e[0] === i).length), labels: [`Arrows out of ${N(i)}`, `Outgoing links of ${N(i)}`] });
    },
    parts(model, spec) {
      const edges = model.edges || [];
      return spec.nodes.map((n, i) => ({ name: n.label,
        value: edges.filter((e) => e[0] === i || e[1] === i).map((e) => (e[0] === i ? `>${e[1]}` : `<${e[0]}`)).sort() }));
    },
    silent(next, prev, spec, rng, cands) {
      const C = env.util.clone;
      const p = prev || {};
      const had = new Set((p.edges || []).map(edgeKey));
      const has = new Set((next.edges || []).map(edgeKey));
      const added = (next.edges || []).filter((e) => !had.has(edgeKey(e)));
      const removed = (p.edges || []).filter((e) => !has.has(edgeKey(e)));
      if (added.length) {
        const e = rng.pick(added);
        cands.push(() => ({ ...C(next), edges: C(next.edges.filter((f) => edgeKey(f) !== edgeKey(e))) }));
      }
      if (removed.length) {
        const e = rng.pick(removed);
        cands.push(() => ({ ...C(next), edges: C(next.edges.concat([e])) }));
      }
    },
    retarget(spec, model, rng, ok) {
      const n = spec.nodes.length;
      const have = new Set((model.edges || []).map(edgeKey));
      const cur = new Set(spec.want.map(edgeKey));
      if (spec.mode === 'orphan') {
        const o = spec.orphan;
        if ((model.edges || []).some((e) => e[0] === o || e[1] === o)) return null;
        const opts = [];
        for (let k = 0; k < n; k++) if (k !== o) opts.push([o, k], [k, o]);
        const pool = opts.filter((e) => !cur.has(edgeKey(e)));
        return pool.length ? ok({ ...spec, want: [rng.pick(pool)] }) : null;
      }
      const used = new Set(spec.keep.flatMap((e) => [edgeKey(e), edgeKey([e[1], e[0]])]));
      const pool = [];
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const e = [i, j];
        if (i !== j && !used.has(edgeKey(e)) && !cur.has(edgeKey(e)) && !have.has(edgeKey(e))) pool.push(e);
      }
      const want = [];
      for (const e of rng.shuffle(pool)) {
        if (want.length >= spec.want.length) break;
        if (want.some((f) => f[0] === e[1] && f[1] === e[0])) continue;
        want.push(e);
      }
      return want.length === spec.want.length ? ok({ ...spec, want }) : null;
    },
    simulate(m, spec, step) {
      if (step.drag) {
        const i = step.drag[0].port[0];
        const j = step.drag[1].port[0];
        if (!m.edges.some((e) => e[0] === i && e[1] === j)) m.edges.push([i, j]);
      } else if (step.click.edgeDel) {
        const d = step.click.edgeDel;
        m.edges = m.edges.filter((e) => !(e[0] === d[0] && e[1] === d[1]));
      }
      return m;
    },
  });
})();
