/*
 * use-project-board: move and resize Gantt bars, link tasks and move cards on a project board.
 * A fictional team's release timeline and delivery board.
 * Real-app counterparts: project scheduling tools (Gantt bars, finish-to-start links,
 * milestones) and team kanban boards (swimlanes and work-in-progress policies).
 * Scenarios: gantt-move (start dates), gantt-resize (duration in calendar days), dependency
 * (finish-to-start edges), swimlane (column + team), wip (named moves + column limits),
 * milestone (dated diamonds). No MiniWoB equivalent.
 *
 * spec: {scenario, level, ood, isplit, csplit, startMode, days, month, project, items:
 * [{id,title,owner,points,color}], columns, lanes, limits, initial, goal, changes:[id],
 * judge?}. Dates are integer calendar days in one month; the end
 * boundary is start + duration (a 2-day task starting June 3 occupies June 3 and 4).
 * model: {bars:{id:{start,duration}}, cards:{id:{column,lane}}, edges:[[from,to]],
 * view?:{top,bottom,rows:{id:[top,bottom]},cards?,scroll?,reset?}} (view is
 * unscored pane geometry; board cards carry their cell, offset and viewport size).
 * All records, including unaffected ones, are scored. Error: mean day/duration miss,
 * fraction of wrong column/lane subgoals, or edge symmetric difference; WIP adds
 * excess cards / item count. Exact success (tau 0); sigma supports graded progress.
 * Starts: off (multiple edits; WIP can have imported overflow), partial (one edit
 * remains), wrong (a plausible incorrect edit / an extra valid edge), solved.
 * Easy/medium reduce the item count, edit count and date range; ood widens these.
 *
 * Plan targets: {bar:id, date?} (bar center now / after moving to a start date),
 * {end:id, duration?} (right resize grip), {port:id, side:'in'|'out'},
 * {edge:[from,to]} (remove link), {card:id}, {cell:[column,lane]},
 * {pane:true} (wheel; unscored geometry in model.view), {resetView:true} (clear
 * a user filter/grouping or close a detail panel so the current work is visible).
 * Plans are closed loop, including capacity-aware ordering and scrolling.
 * Helpers (widget API, env.taskDef.helpers):
 *   board(spec): whether the scenario uses a delivery board.
 *   date(spec, day): formatted calendar date in the planning month.
 *   counts(model, spec): number of current-sprint cards in each column.
 *   apply(model, spec, action): {model, reason}, enforcing the scheduling constraints.
 * Actions are {bar,start|duration}, {card,column,lane}, {add:[a,b]} or {remove:[a,b]}.
 * facts(model,spec): 2-3 visible rollups (effort, scheduled span, links / WIP totals).
 * parts(model,spec): preempt=cancel items by the name the page shows: gantt / milestone bars and board cards by title
 * (value: [start, duration] or [column, lane]), dependency: every ordered pair 'A before B' (value: linked or not).
 * silent(next,prev,spec,rng): revert one changed record/edge, like a dropped save;
 * returns null unless the result is unsolved and repeating the action repairs it.
 * retarget(spec,model,rng): another feasible date, duration, edge or card destination
 * in the same scene, preserving the initial records and all content.
 * judgeModes: impossible. A requested move violates a visible WIP limit (other cards
 * must stay put) or finish-to-start dependency (dependency scenario: the two links 'A before B' and 'B before A',
 * a cycle); score preserves the initial state. The request is worded with the normal templates; the dates, durations
 * and which tasks are drawn per seed. spec.judge = { mode, id, message, what, ... }: the reply is status impossible
 * and what names the policy / dependency (what: WIP limit, or the dependency / cycle); the kit grades it, the task
 * judged() only checks that nothing was changed.
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct;
  const clone = env.util.clone;
  const SCENARIOS = ['gantt-move', 'gantt-resize', 'dependency', 'swimlane', 'wip', 'milestone'];
  // Original fictional project work, split with the shared content-bank machinery.
  const TITLES = ['Scope review', 'Access controls', 'Search indexing', 'Import pipeline',
    'Usage dashboard', 'Billing export', 'Onboarding flow', 'Release notes', 'Quality review',
    'Event tracking', 'Preview build', 'Migration guide', 'Service checks', 'Design handoff',
    'Account recovery', 'Rollout checklist', 'Test fixtures', 'Content audit', 'Schema update',
    'Support playbook', 'Invite flow', 'Retention report', 'Navigation polish', 'Launch briefing', 'Data contracts',
    'Queue monitoring', 'Team roster', 'Webhook retries', 'Cache strategy', 'Mobile layouts', 'Audit logging',
    'Sandbox setup', 'Partner feeds', 'Localization pass', 'Error catalog', 'API versioning', 'Feedback widgets',
    'Staging refresh', 'Asset pipeline', 'Usage limits', 'Incident timeline', 'Theme tokens', 'Offline support',
    'Report filters', 'Form validation', 'Archive workflow', 'Task reminders', 'Regional settings', 'Metadata cleanup',
    'Build automation', 'Privacy review', 'Component library', 'Device enrollment', 'Test coverage', 'Batch scheduler',
    'Version history', 'Customer survey', 'Deployment gates', 'Data dictionary', 'Release calendar', 'Field mapping',
    'Identity sync', 'Search relevance', 'Access matrix', 'Data retention', 'Pilot feedback', 'Threat modeling',
    'Usage forecasting', 'File previews', 'Regional pricing', 'Feature flags', 'Dependency map', 'Content templates',
    'Latency targets', 'Vendor assessment', 'Key rotation', 'Email preferences', 'Experiment brief', 'API gateway',
    'Import validation', 'Backup restore', 'Mobile navigation', 'Permission review', 'Dashboard widgets',
    'Webhook signing', 'Incident drills', 'Schema registry', 'Cutover schedule', 'Approval routing', 'Draft autosave',
    'Locale fallback', 'Query tuning', 'Purchase receipts', 'Role assignment', 'Image compression', 'Data lineage',
    'Escalation paths', 'Meeting minutes', 'Research backlog', 'Prototype review', 'Load testing', 'Feature discovery',
    'Task estimates', 'Sprint planning', 'Code ownership', 'Branch protection', 'Audit exports', 'Custom reports',
    'Alert thresholds', 'User segments', 'Product taxonomy', 'Catalog sync', 'Address lookup', 'Bulk editing',
    'Saved searches', 'Print layouts', 'Change requests', 'Review queue', 'Data masking', 'Session timeout',
    'Recovery codes', 'Test matrix', 'Queue cleanup'];
  const PROJECTS = ['Lantern release', 'Orchard workspace', 'Meadow rollout', 'Pebble platform',
    'Juniper refresh', 'Harbor delivery', 'Willow launch', 'Clover roadmap', 'Birch pipeline', 'Summit archive',
    'Mosaic timeline', 'Canyon handbook', 'Garnet registry', 'Amber workbench', 'Cobalt milestone', 'Saffron terminal',
    'Tundra package', 'Cinder workshop', 'Fable services', 'Marble sequence'];
  const COLORS = ['#6485d9', '#319b8d', '#b77bcb', '#d9954a', '#7488a0', '#ce738b'];
  const board = (s) => s.scenario === 'swimlane' || s.scenario === 'wip';
  const date = (s, d) => `${s.month} ${d}`;
  const key = (e) => e.join('>');
  function counts(m, s) {
    return s.columns.map((_, c) => s.items.filter((it) => m.cards[it.id].column === c).length);
  }
  function apply(m, s, a) {
    const n = clone(m);
    let reason = '';
    if (a.bar) {
      const b = n.bars[a.bar];
      if (a.start !== undefined) b.start = Math.round(a.start);
      if (a.duration !== undefined) b.duration = Math.round(a.duration);
      if (b.start < 1 || b.duration < (s.scenario === 'milestone' ? 0 : 1) || b.start + b.duration > s.days + 1) reason = 'Outside the planning window';
      for (const [u, v] of m.edges) {
        if (n.bars[u].start + n.bars[u].duration > n.bars[v].start) reason = 'Blocked by a finish-to-start dependency';
      }
    } else if (a.card) {
      const old = n.cards[a.card];
      if ((s.scenario === 'wip' || s.judge) && old.column !== a.column && counts(m, s)[a.column] >= s.limits[a.column]) {
        reason = `${s.columns[a.column]} WIP limit reached (${s.limits[a.column]})`;
      }
      if (!reason) n.cards[a.card] = { column: a.column, lane: a.lane };
    } else if (a.add) {
      const [u, v] = a.add;
      if (u === v || n.bars[u].start + n.bars[u].duration > n.bars[v].start) reason = 'Finish-to-start dependency would overlap or form a cycle';
      else if (!n.edges.some((e) => key(e) === key(a.add))) n.edges.push(a.add.slice());
    } else if (a.remove) n.edges = n.edges.filter((e) => key(e) !== key(a.remove));
    return { model: reason ? m : n, reason };
  }
  function error(m, s) {
    const g = s.judge ? s.initial : s.goal;
    if (s.scenario === 'dependency') {
      const a = new Set(m.edges.map(key)), b = new Set(g.edges.map(key));
      return [...a].filter((k) => !b.has(k)).length / Math.max(1, b.size)
        + [...b].filter((k) => !a.has(k)).length / Math.max(1, b.size);
    }
    if (board(s)) {
      let bad = 0;
      for (const { id } of s.items) {
        bad += Number(m.cards[id].column !== g.cards[id].column);
        if (s.scenario === 'swimlane') bad += Number(m.cards[id].lane !== g.cards[id].lane);
      }
      const excess = s.scenario === 'wip' ? counts(m, s).reduce((n, c, i) => n + Math.max(0, c - s.limits[i]), 0) : 0;
      return (bad + excess) / s.items.length;
    }
    return s.items.reduce((e, { id }) => e + Math.abs(m.bars[id].start - g.bars[id].start)
      + Math.abs(m.bars[id].duration - g.bars[id].duration), 0) / s.items.length;
  }
  function changed(s) {
    return s.items.filter(({ id }) => JSON.stringify(board(s) ? s.goal.cards[id] : s.goal.bars[id])
      !== JSON.stringify(board(s) ? s.initial.cards[id] : s.initial.bars[id])).map((it) => it.id);
  }
  function core(s, rng) {
    const title = (id) => `“${s.items.find((it) => it.id === id).title}”`;
    if (s.judge) {
      const j = s.judge;
      if (s.scenario === 'dependency') {
        const edges = `${title(j.to)} before ${title(j.from)}; ${title(j.from)} before ${title(j.to)}`;
        return I.phrase(rng, ['Set the finish-to-start links to: {edges}. Remove any other links.',
          'Connect these tasks finish-to-start: {edges}. Keep only these dependencies.',
          'Update the dependency map to contain exactly: {edges}.'], { edges }, s.isplit);
      }
      const edits = board(s) ? `${title(j.id)} to “${s.columns[1]}”${s.scenario === 'swimlane' ? ` in the “${s.lanes[s.initial.cards[j.id].lane]}” lane` : ''}`
        : s.scenario === 'gantt-resize' ? `${title(j.id)} to ${j.duration} days` : `${title(j.id)} to ${date(s, j.start)}`;
      const verb = s.scenario === 'gantt-resize' ? 'Set the duration of' : 'Move';
      const text = I.phrase(rng, ['{verb} {edits}. Keep the other items unchanged.',
        '{verb} these items: {edits}. Leave everything else in place.',
        '{verb} {edits}; preserve the remaining items.'], { verb, edits }, s.isplit);
      return board(s) ? `${text} Leave every column within its WIP limit.` : text;
    }
    if (s.scenario === 'dependency') {
      if (!s.goal.edges.length) return 'Remove all finish-to-start dependencies. Keep the task dates unchanged.';
      const edges = s.goal.edges.map(([a, b]) => `${title(a)} before ${title(b)}`).join('; ');
      return I.phrase(rng, ['Set the finish-to-start links to: {edges}. Remove any other links.',
        'Connect these tasks finish-to-start: {edges}. Keep only these dependencies.',
        'Update the dependency map to contain exactly: {edges}.'], { edges }, s.isplit);
    }
    const edits = s.changes.map((id) => {
      if (board(s)) {
        const c = s.goal.cards[id];
        return `${title(id)} to “${s.columns[c.column]}”${s.scenario === 'swimlane' ? ` in the “${s.lanes[c.lane]}” lane` : ''}`;
      }
      const b = s.goal.bars[id];
      return s.scenario === 'gantt-resize' ? `${title(id)} to ${b.duration} days` : `${title(id)} to ${date(s, b.start)}`;
    }).join('; ');
    const verb = s.scenario === 'gantt-resize' ? 'Set the duration of' : 'Move';
    let text = I.phrase(rng, ['{verb} {edits}. Keep the other items unchanged.',
      '{verb} these items: {edits}. Leave everything else in place.',
      '{verb} {edits}; preserve the remaining items.'], { verb, edits }, s.isplit);
    if (s.scenario === 'wip') text += ' Leave every column within its WIP limit; free capacity first when needed.';
    return text;
  }
  const task = {
    name: 'use-project-board',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: SCENARIOS, startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'wheel'], judgeModes: ['impossible'],
    helpers: { board, date, counts, apply },
    sample(rng, opts) {
      const scenario = opts.scenario || rng.pick(opts.scenarios || SCENARIOS);
      const level = opts.level || 'normal', ood = !!opts.ood;
      const n = level === 'easy' ? 4 : level === 'medium' ? 5 : ood ? 7 : 6;
      const k = level === 'easy' ? 1 : level === 'medium' ? 2 : 3;
      const cr = rng.fork('content'), cs = { csplit: opts.csplit || 'train' };
      const titles = C.sample(cr, TITLES, n, cs);
      // A held-out bank may have fewer titles than the larger ood scene.
      const items = Array.from({ length: n }, (_, i) => ({ id: `p${i}`,
        title: titles[i % titles.length] + (i >= titles.length ? ` ${i + 1}` : ''),
        owner: C.personName(cr, cs).full, points: cr.pick([1, 2, 3, 5, 8]), color: COLORS[i % COLORS.length] }));
      const s = { scenario, level, ood, isplit: opts.isplit, csplit: cs.csplit, startMode: opts.startMode || 'off',
        days: ood ? 28 : level === 'easy' ? 14 : 21, month: cr.pick(['June', 'July', 'August']),
        project: C.pick(cr, PROJECTS, cs), items, columns: ['Ready', 'In progress', 'Done'],
        lanes: scenario === 'swimlane' ? ['Product', 'Platform'] : ['Team delivery'], limits: [n, 2, n] };
      const initial = { bars: {}, cards: {}, edges: [] };
      items.forEach(({ id }, i) => {
        initial.bars[id] = { start: scenario === 'dependency' ? 1 + i * 3 : rng.int(2, s.days - 7),
          duration: scenario === 'milestone' ? 0 : scenario === 'dependency' ? 2 : rng.int(2, 4) };
        initial.cards[id] = { column: i % 3, lane: i % s.lanes.length };
      });
      s.initial = initial;
      s.goal = clone(initial);
      if (scenario === 'wip') {
        const active = level === 'normal' ? 3 : 2;
        items.forEach(({ id }, i) => { initial.cards[id] = { column: i < active ? 1 : 0, lane: 0 }; });
        s.goal = clone(initial);
        s.goal.cards.p0.column = 2;
        if (active === 3) s.goal.cards.p1.column = 0;
        s.goal.cards[`p${active}`].column = 1;
      } else if (scenario === 'swimlane') {
        for (const { id } of rng.sample(items, k)) {
          s.goal.cards[id] = { column: (initial.cards[id].column + rng.int(1, 2)) % 3,
            lane: 1 - initial.cards[id].lane };
        }
      } else if (scenario === 'dependency') {
        for (let i = 0; i < k; i++) s.goal.edges.push([items[i].id, items[i + 1].id]);
      } else {
        for (const { id } of rng.sample(items, k)) {
          if (scenario === 'gantt-resize') s.goal.bars[id].duration = initial.bars[id].duration + (ood ? 4 : 2);
          else s.goal.bars[id].start = Math.min(s.days + 1 - Math.max(1, initial.bars[id].duration),
            initial.bars[id].start + (ood ? 6 : level === 'easy' ? 2 : 4));
        }
      }
      if (opts.judge === 'impossible') {
        const first = items[0].id, last = items[n - 1].id, jr = rng.fork('judge');
        if (board(s)) {
          items.forEach(({ id }, i) => { initial.cards[id] = { column: i < 2 ? 1 : 0, lane: i % s.lanes.length }; });
          s.judge = { mode: 'impossible', id: items[2].id, what: ['WIP limit', 'WIP', 'limit', 'capacity', 'In progress'],
            message: 'I cannot move that card to In progress: its WIP limit is 2 and it already has 2 cards. Another card would need to move first.' };
        } else {
          // seeded dates: first ends before last starts; the request pushes last before first's end, or first past last's start
          const a = jr.int(3, 5), d1 = scenario === 'milestone' ? 0 : jr.int(2, 3), end = a + d1;
          const b = jr.int(end + 1, Math.min(end + 5, s.days - 3));
          initial.bars[first] = { start: a, duration: d1 };
          initial.bars[last] = { start: b, duration: scenario === 'milestone' ? 0 : 2 };
          initial.edges = [[first, last]];
          s.judge = { mode: 'impossible', id: scenario === 'gantt-resize' ? first : last, from: first, to: last,
            start: jr.int(1, end - 1), duration: b - a + jr.int(1, 3),
            what: scenario === 'dependency' ? ['circular dependency', 'cycle', 'circular', 'dependency', 'finish-to-start']
              : ['finish-to-start dependency', 'dependency', 'finish-to-start', 'predecessor'],
            message: 'I cannot make that change: it would break the finish-to-start dependency. The predecessor must finish before its successor starts.' };
        }
        s.goal = clone(initial);
      }
      s.changes = changed(s);
      return s;
    },
    init(s) {
      let m = clone(s.initial);
      if (s.judge) return m;
      if (s.startMode === 'solved') return this.solve(s, m);
      if (s.startMode === 'partial') {
        m = this.solve(s, m);
        if (s.scenario === 'dependency') m.edges.pop();
        else {
          const id = s.changes[0];
          if (board(s)) m.cards[id] = clone(s.initial.cards[id]);
          else if (s.scenario === 'gantt-resize') m.bars[id].duration--;
          else m.bars[id].start--;
        }
      } else if (s.startMode === 'wrong') {
        if (s.scenario === 'dependency') m.edges = [[s.items[0].id, s.items[s.items.length - 1].id]];
        else if (board(s)) {
          const id = s.changes[0];
          m.cards[id].column = (s.goal.cards[id].column + 1) % 3;
        } else {
          const id = s.changes[0];
          if (s.scenario === 'gantt-resize') m.bars[id].duration = 1;
          else m.bars[id].start = 1;
        }
      }
      return m;
    },
    error,
    tolerance: () => ({ tau: 0, sigma: 0.65, minInitialError: 0 }),
    instruction(s, rng) { return I.say(rng, core(s, rng), { isplit: s.isplit, noise: 0, typo: 0 }); },
    solve(s, m) { return { ...clone(m || s.initial), ...clone(s.judge ? s.initial : s.goal) }; },
    plan(m, s) {
      if (s.judge) return { finish: true, message: s.judge.message };
      if (m.view && m.view.reset) return { click: { resetView: true } };
      const ensure = (ids, step) => {
        const v = m.view;
        const ranges = v && (Array.isArray(ids) ? ids : [ids]).map((id) => v.rows[id]).filter(Boolean);
        if (ranges && ranges.length) {
          const a = Math.min(...ranges.map((r) => r[0])), b = Math.max(...ranges.map((r) => r[1]));
          if (a < v.top || b > v.bottom) return { wheel: [{ pane: true }, (a + b - v.top - v.bottom) / 2] };
        }
        return step;
      };
      if (s.scenario === 'dependency') {
        const extra = m.edges.find((e) => !s.goal.edges.some((g) => key(g) === key(e)));
        if (extra) return ensure(`edge:${key(extra)}`, { click: { edge: extra } });
        const missing = s.goal.edges.find((e) => !m.edges.some((g) => key(g) === key(e)));
        if (missing) {
          return ensure(missing, { drag: [{ port: missing[0], side: 'out' }, { port: missing[1], side: 'in' }] });
        }
        return null;
      }
      if (board(s)) {
        const wrong = s.items.filter(({ id }) => m.cards[id].column !== s.goal.cards[id].column || m.cards[id].lane !== s.goal.cards[id].lane);
        const it = wrong.find(({ id }) => apply(m, s, { card: id, ...s.goal.cards[id] }).reason === '');
        if (!it) return null;
        if (m.view && m.view.scroll > 1) return { wheel: [{ pane: true }, -m.view.scroll] };
        const v = m.view && m.view.cards && m.view.cards[it.id];
        if (v && (v.center < v.scroll + 18 || v.center > v.scroll + v.height - 18)) {
          return { wheel: [{ cell: v.cell }, v.center - v.scroll - v.height / 2] };
        }
        return { drag: [{ card: it.id }, { cell: [s.goal.cards[it.id].column, s.goal.cards[it.id].lane] }] };
      }
      for (const { id } of s.items) {
        if (m.bars[id].start !== s.goal.bars[id].start) return ensure(id, { drag: [{ bar: id }, { bar: id, date: s.goal.bars[id].start }] });
        if (m.bars[id].duration !== s.goal.bars[id].duration) return ensure(id, { drag: [{ end: id }, { end: id, duration: s.goal.bars[id].duration }] });
      }
      return null;
    },
    judged(m, s) { return error(m, s) === 0; }, // the reply itself is graded by the kit
    parts(m, s) {
      const name = (id) => s.items.find((it) => it.id === id).title;
      if (s.scenario === 'dependency') return s.items.flatMap((a) => s.items.filter((b) => b !== a).map((b) => ({
        name: `${a.title} before ${b.title}`, aliases: [`${a.title} to ${b.title}`, `${a.title} then ${b.title}`],
        value: m.edges.some((e) => key(e) === key([a.id, b.id])) })));
      if (board(s)) return s.items.map((it) => ({ name: it.title, value: [s.columns[m.cards[it.id].column], s.lanes[m.cards[it.id].lane]] }));
      return s.items.map((it) => ({ name: name(it.id), value: [m.bars[it.id].start, m.bars[it.id].duration] }));
    },
    facts(m, s) {
      const effort = s.items.reduce((n, it) => n + it.points, 0);
      if (board(s)) return [{ label: 'Total effort', value: `${effort} pts` },
        { label: 'In progress', value: `${counts(m, s)[1]} cards` },
        { label: 'Done effort', value: `${s.items.filter((it) => m.cards[it.id].column === 2).reduce((n, it) => n + it.points, 0)} pts` }];
      const starts = s.items.map((it) => m.bars[it.id].start);
      const ends = s.items.map((it) => m.bars[it.id].start + Math.max(1, m.bars[it.id].duration) - 1);
      return [{ label: 'Total effort', value: `${effort} pts` },
        { label: 'Scheduled span', value: `${Math.max(...ends) - Math.min(...starts) + 1} days` },
        { label: 'Dependencies', value: String(m.edges.length) }];
    },
    silent(next, prev, s, rng) {
      if (s.judge) return null;
      const n = clone(next);
      if (s.scenario === 'dependency') {
        const added = n.edges.filter((e) => !prev.edges.some((p) => key(p) === key(e)));
        const removed = prev.edges.filter((e) => !n.edges.some((p) => key(p) === key(e)));
        if (added.length) { const e = rng.pick(added); n.edges = n.edges.filter((p) => key(p) !== key(e)); }
        else if (removed.length) n.edges.push(clone(rng.pick(removed)));
        else return null;
      } else {
        const field = board(s) ? 'cards' : 'bars';
        const ids = s.items.map((it) => it.id).filter((id) => JSON.stringify(next[field][id]) !== JSON.stringify(prev[field][id]));
        if (!ids.length) return null;
        const id = rng.pick(ids);
        n[field][id] = clone(prev[field][id]);
      }
      return error(n, s) > 0 ? n : null;
    },
    retarget(s, m, rng) {
      if (s.judge) return null;
      const n = clone(s);
      n.goal = clone(m);
      delete n.goal.view;
      const ids = rng.shuffle(s.items.map((it) => it.id));
      for (const id of ids) {
        let a;
        if (board(s)) a = { card: id, column: (m.cards[id].column + 1) % 3, lane: m.cards[id].lane };
        else if (s.scenario === 'gantt-resize') a = { bar: id, duration: m.bars[id].duration === 2 ? 3 : 2 };
        else if (s.scenario !== 'dependency') a = { bar: id, start: m.bars[id].start === 2 ? 5 : 2 };
        else {
          const e = [s.items[0].id, s.items[s.items.length - 1].id];
          a = m.edges.some((p) => key(p) === key(e)) ? { remove: e } : { add: e };
        }
        const result = apply(m, s, a);
        if (!result.reason) {
          n.goal = clone(result.model);
          delete n.goal.view;
          // Restoring the original date/column is still an explicit edit to the current
          // scene, even though it no longer differs from the initial snapshot.
          n.changes = [...new Set([...changed(n), id])];
          // Include any current deviation from the initial scene in the replacement instruction.
          if (error(m, n) > 0) return n;
        }
      }
      return null;
    },
  };
  env.task(task);
})();
