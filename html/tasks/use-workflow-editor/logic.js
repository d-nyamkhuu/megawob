/*
 * use-workflow-editor: connect, place, reroute, remove and configure nodes in a workflow editor.
 * Fictional Relayboard workflow editor. Real-app counterparts: visual automation builders,
 * integration pipelines and node-graph editors. No MiniWoB counterpart.
 * Scenarios: connect (named port-to-port edges); place (palette node + outgoing connection); reroute
 * (drag an existing edge's input end); remove (named edge or node); configure (node inspector fields).
 * spec: {scenario, level, ood, isplit, csplit, startMode, title, owner, nodes:[{id,label,type,x,y}],
 *   initialEdges:[[from,to]], goalEdges:[[from,to]], goalNodes:[ids], add:{id,label,type,x,y},
 *   fields:[{key,label,kind}], defaults:{id:{key:string}}, configId, values:{key:string},
 *   remove:{node:id}|{edge:[from,to]}, judge?}. Coordinates are world px, nodes 148 x 76.
 * model: {nodes:[same node records], edges:[[from,to]], settings:{id:{key:string}}, pan:[x,y],
 *   selected:null|{node:id}|{edge:[from,to]}, panel:id|null, draft:{key:string}, menu:id|null,
 *   view:{w,h,zoom?,edgePoints?}, history:[{nodes,edges,settings}]}. View and selection are unscored scene state.
 * Score: one unit per missing/extra node or edge, wrong node type, and normalized edit distance per
 * required field. Exact graph required (tau 0); preserved baseline nodes/edges count too. No early ending.
 * Starts: off, partial (some requested work), wrong (extra edge or wrong fields), solved.
 * Levels: easy one added edge / one field, medium two, normal three. OOD adds nodes, edges and a field.
 * Inputs: pointer, keyboard (fields and Delete), wheel (long palette and inspector panes).
 * Targets: {port:[id,'out'|'in']}, {edge:[a,b]}, {edgeEnd:[a,b]}, {node:id}, {palette:type},
 * {world:[x,y]}, {pan:true,sx?,sy?,dx?,dy?}, {control:'delete'|'menuDelete'|'save'|'close'|'undo'}, {field:key}, {pane:'palette'|'fields'}.
 * plan() is closed-loop, panning by empty canvas drags before locating off-screen geometry.
 * Hooks: facts reports visible Nodes, Connections, Configured nodes counts and Workflow status.
 * silent drops a newly added edge without mutating inputs; repeating the connection repairs it.
 * retarget changes only goal fields within the same scene (edges, palette type, removal or field values).
 * parts(model, spec): preempt=cancel; every node by its label (value: type + saved settings) and every connection
 * as "<from> to <to>" (value: true), so an added, removed or rerouted item changes the list.
 * judgeModes ambiguous: a seeded label (the second node's name from the content) is copied onto the first two
 * non-start nodes, which differ by type; the instruction is a normal configure sentence for that label. The reply
 * asks with one option per node (spec.judge.cands: the node types; others: the other nodes' types).
 * Tests: selftest.js (loaded only by the checker and node tests).
 * Helpers (widget API, env.taskDef.helpers):
 *   TYPES: palette component types in display order.
 *   edgeKey(edge): stable directed-edge key.
 *   port(node, kind): input/output port position in world px.
 *   configuredCount(model): number of nodes with a saved destination.
 */
(function () {
  'use strict';

  const { clone } = env.util;
  const NODE = { w: 148, h: 76 };
  const TYPES = ['Webhook', 'Filter', 'Transform', 'Send message', 'Create record', 'Delay'];
  const FIELD_DEFS = [
    { key: 'destination', label: 'Destination', kind: 'text' },
    { key: 'operation', label: 'Operation', kind: 'text' },
    { key: 'retries', label: 'Retry attempts', kind: 'number' },
    { key: 'timeout', label: 'Timeout (seconds)', kind: 'number' },
  ];
  const edgeKey = (e) => e.join('>');
  const has = (edges, e) => edges.some((f) => edgeKey(f) === edgeKey(e));
  const port = (n, kind) => [n.x + (kind === 'out' ? NODE.w : 0), n.y + NODE.h / 2];
  function desiredSettings(s) {
    const out = clone(s.defaults);
    if (s.scenario === 'configure') Object.assign(out[s.configId], s.values);
    if (s.scenario === 'place') out[s.add.id] = { destination: '', operation: 'Create', retries: '0', timeout: '30' };
    return out;
  }
  const configuredCount = (m) => m.nodes.filter((n) => !!m.settings[n.id]?.destination).length;
  function error(m, s) {
    if (s.judge) {
      // The ambiguous request must leave the actual graph and saved fields untouched.
      return error(m, { ...s, judge: null, goalNodes: s.nodes.map((n) => n.id), goalEdges: s.initialEdges, scenario: 'connect' });
    }
    let e = 0;
    const expected = s.goalNodes;
    for (const id of expected) {
      const n = m.nodes.find((n) => n.id === id);
      const def = id === s.add.id ? s.add : s.nodes.find((n) => n.id === id);
      if (!n || n.type !== def.type) e++;
    }
    e += m.nodes.filter((n) => !expected.includes(n.id)).length;
    for (const edge of s.goalEdges) if (!has(m.edges, edge)) e++;
    const seen = new Set();
    for (const edge of m.edges) {
      const key = edgeKey(edge);
      if (!has(s.goalEdges, edge) || seen.has(key)) e++;
      seen.add(key);
    }
    const settings = desiredSettings(s);
    for (const id of expected) {
      if (!m.nodes.some((n) => n.id === id)) continue;
      for (const f of s.fields) {
        const a = String(m.settings[id]?.[f.key] ?? '');
        const b = String(settings[id]?.[f.key] ?? '');
        e += env.util.lev(a, b) / Math.max(1, a.length, b.length);
      }
    }
    return e;
  }
  function solve(s, m) {
    const base = m || { pan: [0, 0], selected: null, panel: null, draft: {}, menu: null, view: { w: 600, h: 300 }, history: [] };
    const ids = s.judge ? s.nodes.map((n) => n.id) : s.goalNodes;
    return { ...clone(base), nodes: [...s.nodes, s.add].filter((n) => ids.includes(n.id)).map(clone),
      edges: clone(s.judge ? s.initialEdges : s.goalEdges), settings: s.judge ? clone(s.defaults) : desiredSettings(s) };
  }
  function sample(rng, opts) {
    const cr = rng.fork('content'), C = env.content;
    const level = opts.level || 'normal';
    const n = level === 'easy' ? 4 : level === 'medium' ? 5 : opts.ood ? 7 : 6;
    const names = [['Incoming request', 'New order', 'Account created'], ['Check details', 'Valid request', 'Match customer'], ['Format payload', 'Normalize fields', 'Prepare summary'], ['Notify team', 'Email owner', 'Send receipt'], ['Store result', 'Record activity', 'Create contact'], ['Wait for reply', 'Pause delivery', 'Wait before retry']];
    const labels = Array.from({ length: n }, (_, i) => names[i % TYPES.length][i >= TYPES.length ? 2 : rng.int(0, 1)]);
    const nodes = labels.map((label, i) => ({ id: `n${i}`, label, type: TYPES[i % TYPES.length], x: 40 + 220 * i, y: 66 + (i % 2) * 106 }));
    const scenario = opts.scenario || rng.pick(opts.scenarios || ['connect', 'place', 'reroute', 'remove', 'configure']);
    const s = { scenario, level, ood: !!opts.ood, isplit: opts.isplit, csplit: opts.csplit, startMode: opts.startMode || 'off',
      title: `${C.pick(cr, C.COMPANIES, opts)} · Intake`, owner: C.personName(cr, opts).full, nodes,
      initialEdges: [], goalEdges: [], goalNodes: nodes.map((n) => n.id), fields: FIELD_DEFS.slice(0, opts.ood ? 4 : 3),
      defaults: {}, configId: rng.pick(nodes.slice(1)).id, values: {},
      add: { id: 'added', label: 'New step', type: rng.pick(TYPES.slice(1)), x: 40 + 220 * n, y: 66 + (n % 2) * 106 } };
    for (const node of nodes) s.defaults[node.id] = { destination: C.emailAddress(cr, C.personName(cr, opts)), operation: 'Create', retries: '0', timeout: '30' };
    const chain = nodes.slice(1).map((node, i) => [nodes[i].id, node.id]);
    s.initialEdges = clone(chain);
    if (scenario === 'connect') {
      const k = Math.min(chain.length, level === 'easy' ? 1 : level === 'medium' ? 2 : opts.ood ? 4 : 3);
      s.want = rng.sample(chain, k);
      s.initialEdges = chain.filter((e) => !has(s.want, e));
      s.goalEdges = clone(chain);
    } else if (scenario === 'place') {
      s.after = nodes[n - 1].id;
      s.add.label = s.add.type;
      s.goalNodes.push('added');
      s.goalEdges = [...clone(chain), [s.after, 'added']];
    } else if (scenario === 'reroute') {
      s.oldEdge = clone(chain[0]);
      s.newEdge = [nodes[0].id, nodes[2].id];
      s.goalEdges = [s.newEdge, ...clone(chain.slice(1))];
    } else if (scenario === 'remove') {
      s.remove = rng.bool() ? { node: nodes[n - 1].id } : { edge: clone(chain[rng.int(0, chain.length - 1)]) };
      if (s.remove.node) s.goalNodes = s.goalNodes.filter((id) => id !== s.remove.node);
      s.goalEdges = chain.filter((e) => s.remove.node ? !e.includes(s.remove.node) : !has([s.remove.edge], e));
    } else {
      s.goalEdges = clone(chain);
      const target = { destination: C.emailAddress(cr, C.personName(cr, opts)), operation: rng.pick([
        'Update', 'Append', 'Replace', 'Merge', 'Queue', 'Inspect', 'Forward', 'Archive', 'Execute'
      ]), retries: String(rng.int(2, opts.ood ? 12 : 5)), timeout: String(rng.int(4, 12) * 10) };
      const keys = s.fields.slice(0, level === 'easy' ? 1 : level === 'medium' ? 2 : s.fields.length);
      s.values = Object.fromEntries(keys.map((f) => [f.key, target[f.key]]));
    }
    if (opts.judge === 'ambiguous') {
      const label = s.nodes[1].label, [a, b] = [s.nodes[1].type, s.nodes[2].type];
      s.nodes[2].label = label;
      const dest = C.emailAddress(cr, C.personName(cr, opts));
      s.judge = { mode: 'ambiguous', label, values: { [s.fields[0].key]: dest },
        cands: [[a], [b]], others: [...new Set(s.nodes.map((n) => n.type).filter((t) => t !== a && t !== b))].map((t) => [t]),
        message: `Which "${label}" node do you mean: the ${a} or the ${b} node?` };
    }
    return s;
  }
  function init(s) {
    const m = { nodes: clone(s.nodes), edges: clone(s.initialEdges), settings: clone(s.defaults), pan: [0, 0], selected: null,
      panel: null, draft: {}, menu: null, view: { w: 600, h: 300 }, history: [] };
    if (s.judge || s.startMode === 'solved') return solve(s, m);
    if (s.startMode === 'partial') {
      if (s.scenario === 'connect' && s.want.length > 1) m.edges.push(clone(s.want[0]));
      if (s.scenario === 'place') { m.nodes.push(clone(s.add)); m.settings.added = desiredSettings(s).added; }
      if (s.scenario === 'configure' && Object.keys(s.values).length > 1) {
        const k = Object.keys(s.values)[0]; m.settings[s.configId][k] = s.values[k];
      }
    }
    if (s.startMode === 'wrong') {
      if (s.scenario === 'configure') m.settings[s.configId].destination = 'unassigned@relayboard.example';
      else m.edges.push([s.nodes[1].id, s.nodes[0].id]);
    }
    return m;
  }
  const label = (s, id) => id === 'added' ? s.add.label : s.nodes.find((n) => n.id === id).label;
  function instruction(s, rng) {
    if (s.judge) return env.instruct.say(rng, `Update the settings of "${s.judge.label}" to ${Object.entries(s.judge.values).map(([k, v]) => `${s.fields.find((f) => f.key === k).label} = "${v}"`).join('; ')}. Keep the rest of the workflow unchanged.`, { isplit: s.isplit });
    const edge = (e) => `"${label(s, e[0])}" to "${label(s, e[1])}"`;
    let core;
    if (s.scenario === 'connect') core = env.instruct.phrase(rng, [
      'Connect {edges}.', 'Add the following directed connections: {edges}.',
      'Route data through these connections: {edges}.', 'Link each source to its destination: {edges}.',
      'Add {edges} as workflow links.', 'Make data flow from {edges}.', 'Give every pair a directed link: {edges}.',
      'Extend the workflow with links: {edges}.', 'Wire {edges} in the directions shown.',
      'Set up data paths listed here: {edges}.'
    ], { edges: s.want.map(edge).join('; ') }, s.isplit);
    if (s.scenario === 'place') core = `Add a "${s.add.type}" step after "${label(s, s.after)}" and connect the two steps.`;
    if (s.scenario === 'reroute') core = `Change ${edge(s.oldEdge)} so it goes to "${label(s, s.newEdge[1])}" instead.`;
    if (s.scenario === 'remove') core = s.remove.node ? `Delete the node "${label(s, s.remove.node)}" and its attached connections.` : `Delete the connection ${edge(s.remove.edge)}.`;
    if (s.scenario === 'configure') core = `Update the settings of "${label(s, s.configId)}" to ${Object.entries(s.values).map(([k, v]) => `${s.fields.find((f) => f.key === k).label} = "${v}"`).join('; ')}.`;
    return env.instruct.say(rng, `${core} Keep the rest of the workflow unchanged.`, { isplit: s.isplit });
  }
  function plan(m, s) {
    if (s.judge) return { finish: true, message: s.judge.message };
    if (m.menu) return { click: { control: 'menuDelete' } };
    const aim = (points, action) => {
      const v = m.view, p = m.pan;
      const off = points.some(([x, y]) => x + p[0] < 24 || x + p[0] > v.w - 24 || y + p[1] < 32 || y + p[1] > v.h - 48);
      if (!off) return action;
      const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
      const dx = (v.w - Math.min(...xs) - Math.max(...xs)) / 2 - p[0];
      const dy = (v.h - 16 - Math.min(...ys) - Math.max(...ys)) / 2 - p[1];
      const limit = (x, n) => Math.max(-n, Math.min(n, Math.round(x)));
      const sx = limit(dx, Math.max(40, v.w / 2 - 35)), sy = limit(dy, Math.max(40, v.h / 2 - 40));
      return { drag: [{ pan: true, sx, sy }, { pan: true, sx, sy, dx: sx, dy: sy }] };
    };
    if (m.panel) {
      const target = desiredSettings(s)[m.panel];
      if (target) for (const f of s.fields) {
        if (String(m.draft[f.key] ?? '') !== String(target[f.key] ?? '')) {
          if (m.view.fields && !m.view.fields.includes(f.key)) return { wheel: [{ pane: 'fields' }, m.view.fieldTop[f.key] < 0 ? -140 : 140] };
          return { type: [{ field: f.key }, target[f.key] || ''] };
        }
      }
      if (target && s.fields.some((f) => m.settings[m.panel]?.[f.key] !== target[f.key])) return { click: { control: 'save' } };
      return { click: { control: 'close' } };
    }
    const surplus = m.nodes.find((n) => !s.goalNodes.includes(n.id) || (n.id === 'added' && n.type !== s.add.type));
    if (surplus) return aim([[surplus.x + 74, surplus.y + 22]], { rightclick: { node: surplus.id } });
    if (s.goalNodes.some((id) => id !== 'added' && !m.nodes.some((n) => n.id === id))) return { click: { control: 'undo' } };
    if (s.scenario === 'place' && !m.nodes.some((n) => n.id === 'added')) {
      if (m.view.palette && !m.view.palette.includes(s.add.type)) return { wheel: [{ pane: 'palette' }, m.view.paletteTop[s.add.type] < 0 ? -140 : 140] };
      return aim([[s.add.x, s.add.y]], { drag: [{ palette: s.add.type }, { world: [s.add.x, s.add.y] }] });
    }
    const extra = m.edges.find((e) => !has(s.goalEdges, e));
    if (extra) {
      const missing = s.goalEdges.find((e) => e[0] === extra[0] && !has(m.edges, e));
      if (missing && s.scenario === 'reroute') {
        const b = port(m.nodes.find((n) => n.id === extra[1]), 'in');
        const c = port(m.nodes.find((n) => n.id === missing[1]), 'in');
        return aim([b, c], { drag: [{ edgeEnd: extra }, { port: [missing[1], 'in'] }] });
      }
      const a = port(m.nodes.find((n) => n.id === extra[0]), 'out'), b = port(m.nodes.find((n) => n.id === extra[1]), 'in');
      if (!m.selected?.edge || !has([m.selected.edge], extra)) return aim([m.view.edgePoints?.[edgeKey(extra)] || [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]], { click: { edge: extra } });
      return { click: { control: 'delete' } };
    }
    for (const e of s.goalEdges) if (!has(m.edges, e)) {
      const a = port(m.nodes.find((n) => n.id === e[0]), 'out'), b = port(m.nodes.find((n) => n.id === e[1]), 'in');
      return aim([a, b], { drag: [{ port: [e[0], 'out'] }, { port: [e[1], 'in'] }] });
    }
    const want = desiredSettings(s);
    for (const node of m.nodes) if (s.fields.some((f) => m.settings[node.id]?.[f.key] !== want[node.id]?.[f.key])) {
      return aim([[node.x + 74, node.y + 22]], { click: { node: node.id } });
    }
    return null;
  }
  function retarget(s, m, rng) {
    if (s.judge) return null;
    const t = clone(s);
    if (s.scenario === 'connect') {
      const pool = s.nodes.slice(1).map((n, i) => [s.nodes[i].id, n.id]);
      const e = rng.pick(pool);
      t.goalEdges = has(m.edges, e) ? m.edges.filter((f) => !has([e], f)) : [...clone(m.edges), e];
      t.want = t.goalEdges.filter((f) => !has(m.edges, f));
      // Keep connect instructions additions-only, even if the current graph is complete.
      if (!t.want.length) { const a = [s.nodes[0].id, s.nodes[2].id]; t.goalEdges = [...clone(m.edges), a]; t.want = [a]; }
    } else if (s.scenario === 'configure') {
      t.values.destination = `team-${rng.int(10, 99)}@relayboard.example`;
    } else if (s.scenario === 'place') {
      t.add.type = rng.pick(TYPES.filter((v) => v !== s.add.type)); t.add.label = t.add.type;
    } else if (s.scenario === 'reroute') {
      t.newEdge = [s.nodes[0].id, s.nodes[1].id];
      t.goalEdges = [t.newEdge, ...s.initialEdges.slice(1)];
      const actual = m.edges.find((e) => e[0] === t.newEdge[0]);
      if (actual) t.oldEdge = clone(actual);
    } else {
      if (s.remove.node || m.nodes.length !== s.nodes.length) return null;
      const choices = s.initialEdges.filter((e) => !has([s.remove.edge], e));
      t.remove = { edge: clone(rng.pick(choices)) };
      t.goalEdges = s.initialEdges.filter((e) => !has([t.remove.edge], e));
    }
    return error(m, t) > 0 ? t : null;
  }
  env.task({ name: 'use-workflow-editor', reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: ['connect', 'place', 'reroute', 'remove', 'configure'],
    startModes: ['off', 'partial', 'wrong', 'solved'], inputs: ['pointer', 'keyboard', 'wheel'], judgeModes: ['ambiguous'],
    helpers: { TYPES, edgeKey, port, configuredCount },
    sample, init, error, tolerance: () => ({ tau: 0, sigma: 2, minInitialError: 0.01 }), instruction, plan, solve,
    parts: (m, s) => [...m.nodes.map((n) => ({ name: n.label, value: [n.type, m.settings[n.id] || null] })),
      ...m.edges.map((e) => ({ name: `${m.nodes.find((n) => n.id === e[0]).label} to ${m.nodes.find((n) => n.id === e[1]).label}`, value: true }))],
    facts: (m) => [{ label: 'Nodes', value: String(m.nodes.length) }, { label: 'Connections', value: String(m.edges.length) },
      { label: 'Configured nodes', value: String(configuredCount(m)) }, { label: 'Workflow status', value: 'Draft' }],
    silent(next, prev, s, rng) {
      const added = next.edges.filter((e) => !has(prev.edges, e));
      if (!added.length) return null;
      const out = clone(next), lost = rng.pick(added);
      out.edges = out.edges.filter((e) => !has([lost], e));
      // A destination edit that did not stick keeps its old connection, so the same drag repairs it.
      for (const edge of prev.edges) if (edge[0] === lost[0] && !has(next.edges, edge)) out.edges.push(clone(edge));
      return error(out, s) > 0 ? out : null;
    }, retarget,
  });
})();
