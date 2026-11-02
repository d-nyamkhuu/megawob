/*
 * use-dev-tools: review a pull request, rerun jobs, search logs, edit a record and set feature flags.
 * Fictional developer workspace. Real-app counterparts: pull-request diff reviews,
 * pipeline graphs / job retries, observability log explorers, database record inspectors,
 * and feature-management environment / segment rules. No MiniWoB counterpart.
 * Scenarios: prcomment (line comment + approve), rerun (failed job retry), logs (filter,
 * search and select an entry; Request ID is available for finish reports), dbrow (persist a
 * quota edit), flag (persist a scoped feature toggle).
 * Spec: {scenario, level, ood, startMode, isplit, items[], target, base{}, goal, project,
 * author, revision, runId, file, comment, environments[], segments[], judge?}.
 * Items carry seeded source data (code / jobs / logs / records / flags). goal contains only
 * target values: text, quota, environment, segment, enabled, service, severity, query.
 * Model: {query, service, severity, selected, draft, comments{}, approved, attempts{},
 * values{}, environment, segment, pendingEnabled, prepared, visible[], scrollTop, paneHeight, saves}.
 * Navigation and drafts are controlled; committed values are separate from editor text.
 * Start modes: off, partial (one subgoal / draft prepared), wrong (wrong selection / draft),
 * solved. Levels vary distractor counts and target distance; ood widens counts and quotas.
 * facts: 2–3 visible result facts: review status / thread count, retry attempt / job status,
 * Request ID / timestamp, revision / updated records, active rules / configuration version.
 * silent: a comment is truncated, retry dropped, selection lost, quota clamped or toggle
 * fails to stick. Returns a fresh, repairable model; never changes next or prev.
 * retarget: another comment / quota / scoped boolean, failed job, or log entry in the same
 * source scene. Only goal fields change; the current state must remain unsolved.
 * parts(model,spec): preempt=cancel items by visible name: list rows by label (comment, attempts, record value, flag
 * values), and the controls the scenario edits (Review status, Selected job, Search / Service / Severity, quota_limit,
 * Environment / Segment).
 * judgeModes: confirm (status confirm before merging or deploying production; widget flags the final control
 * irreversible; the rerun job gets a seeded deploy-style name); impossible (a job, record or log message absent from
 * the source scene, named like the real ones: status impossible, what = spec.judge.what, the absent name the instruction
 * gives). No ambiguous mode.
 * Plan targets: {row:id}, {field:'query'|'draft'}, {service:value}, {severity:value},
 * {environment:value}, {segment:value}, {action:'comment'|'approve'|'prepare'|'run'|'save'|
 * 'toggle'|'merge'}, {pane:true}, {detail:true}. Scroll steps use the visible row IDs mirrored by the widget.
 * Helpers (widget API, env.taskDef.helpers):
 *   filtered(model,spec): source rows matching the current search and facets.
 *   flagKey(id,environment,segment): persisted feature-toggle scope key.
 *   act(model,spec,action,value): apply an edit to a cloned model.
 * Widget code also reads the error and facts contract hooks. All edits use act;
 * locate never changes the DOM. This task has no self-test.
 */
(function () {
  'use strict';
  const { clone, lev } = env.util;
  const C = env.content;
  const SCENARIOS = ['prcomment', 'rerun', 'logs', 'dbrow', 'flag'];
  const SERVICES = ['edge-api', 'billing-worker', 'session-cache'];
  const SEVERITIES = ['INFO', 'WARN', 'ERROR'];
  const ENVS = ['Development', 'Staging', 'Production'];
  const SEGMENTS = ['All users', 'Internal team', 'Early access'];
  const JOBS = {Validate:['lint-source','typecheck','schema-check','dependency-audit','format-check','policy-check'],
    Test:['unit-tests','integration-api','integration-worker','contract-tests','browser-tests','migration-tests','coverage-report','snapshot-tests'],
    Release:['build-image','package-assets','publish-artifacts','deploy-preview','smoke-tests','generate-sbom','sign-release','verify-bundle']};
  const FLAGS = ['streaming-search', 'compact-console', 'batch-export', 'request-tracing', 'smart-retries', 'new-billing', 'audit-events', 'fast-index', 'live-metrics', 'parallel-builds', 'session-rotation', 'export-compression', 'background-sync', 'edge-routing', 'webhook-signatures', 'schema-validation', 'query-cache', 'usage-limits', 'rate-limit-v2', 'region-failover', 'role-inheritance', 'bulk-import', 'retention-policy', 'api-version-pins'];
  const FLAG_DESCRIPTIONS = [
    'Stream partial search results as each shard responds.', 'Use the condensed layout in the developer console.',
    'Build large data exports in background batches.', 'Attach trace context to outgoing service requests.',
    'Retry transient failures with exponential backoff.', 'Use the revised metering and invoice calculation.',
    'Write administrative changes to the audit stream.', 'Enable incremental updates in the search index.',
    'Show live service latency and error-rate charts.', 'Run independent build steps concurrently.',
    'Rotate session credentials before they expire.', 'Compress exported datasets before delivery.',
    'Reconcile offline changes in a background worker.', 'Route API traffic through the closest edge region.',
    'Verify webhook signatures before processing events.', 'Validate incoming payloads against the current schema.',
    'Cache read-only database queries for a short period.', 'Enforce workspace usage limits before accepting a job.',
    'Use token-bucket limits for bursty clients.', 'Fail over to a healthy region after repeated errors.',
    'Resolve team permissions through inherited roles.', 'Import records in resumable background batches.',
    'Apply per-workspace retention rules to stored events.', 'Pin API responses to the client version header.'
  ];
  const CODE = [
    'export async function resolveSession(request) {', '  const token = request.headers.get("x-session");',
    '  const requestId = request.headers.get("x-request-id");', '  const timeout = config.sessionTimeout;',
    '  const session = await store.lookup(token, { timeout });', '  if (!session) {',
    '    await audit.record({ requestId, reason: "missing" });', '    return response.unauthorized();',
    '  }', '  const profile = await profiles.get(session.userId);',
    '  if (!profile) return response.notFound();', '  const permissions = await roles.forUser(profile.id);',
    '  await audit.record({ requestId, userId: profile.id });', '  return response.json({',
    '    profile,', '    permissions,', '    requestId,', '    expiresAt: session.expiresAt,',
    '  });', '}', '', 'export function sessionHeaders(session) {',
    '  return {', '    "cache-control": "no-store",', '    "x-session-id": session.id,',
    '    "x-content-type-options": "nosniff",', '  };', '}'
  ];
  const COMMENTS = [
    'Please add a regression test for the empty response.', 'Use the shared timeout constant here.',
    'Please handle the missing request identifier.', 'Add a guard for an expired session.',
    'Reject tokens that contain only spaces.', 'Check the role lookup failure path.',
    'Keep session credentials out of audit logs.', 'Please cover session lookup errors in tests.',
    'Clarify the units used for session timeouts.', 'Return only the permissions this client needs.',
    'Explain why missing profiles return not found.', 'Check that expiry timestamps serialize cleanly.',
    'Please pass cancellation to session lookups.', 'Define how audit errors affect the response.',
    'Omit private profile fields from responses.', 'Verify cache headers on error responses.'
  ];
  const ABSENT_JOBS = ['restore-backup', 'rollback-schema', 'rebuild-index', 'sync-replicas', 'archive-logs', 'verify-restore', 'purge-cache', 'rotate-keys'];
  const ABSENT_MESSAGES = [
    'disk quota exceeded', 'certificate mismatch', 'schema drift detected', 'replica lag', 'handshake failed',
    'out of memory', 'thread pool deadlock', 'lease owner conflict', 'route not found', 'clock skew detected',
    'write lock held', 'buffer overflow', 'watchdog fired', 'mount unavailable', 'journal corrupted',
    'socket not bound', 'worker stalled', 'segment missing', 'snapshot rejected', 'file handle leak',
    'port already bound', 'storage pool full', 'node unreachable'
  ];
  const DEPLOY_JOBS = ['deploy-production', 'promote-release', 'deploy-prod-eu', 'deploy-prod-us', 'release-production'];
  const MESSAGES = [
    'upstream timeout', 'token expired', 'connection refused', 'queue limit exceeded', 'invalid payload',
    'cache miss', 'request canceled', 'retry scheduled', 'rate cap reached', 'access denied', 'dependency missing',
    'response truncated', 'duplicate event', 'batch incomplete', 'stream closed', 'work deferred', 'input too large',
    'record is locked', 'header malformed', 'version unsupported', 'write interrupted', 'endpoint moved',
    'key not found', 'resource busy'
  ];
  const flagKey = (id, e, g) => `${id}|${e}|${g}`;
  const textError = (a, b) => lev(String(a), String(b)) / Math.max(1, String(b).length, String(a).length);
  const targetItem = s => s.items.find(x => x.id === s.target);

  function sample(rng, opts) {
    const scenario = opts.scenario || rng.pick(opts.scenarios || SCENARIOS);
    const level = opts.level || 'normal';
    const cr = rng.fork('content');
    const counts = { prcomment: [10, 14, 20], rerun: [8, 12, 18], logs: [18, 30, 48], dbrow: [12, 24, 36], flag: [10, 16, 24] };
    const n = counts[scenario][level === 'easy' ? 0 : level === 'medium' ? 1 : 2] + (opts.ood ? 8 : 0);
    const s = { scenario, level, ood: !!opts.ood, startMode: opts.startMode || 'off', isplit: opts.isplit, csplit: opts.csplit,
      project: C.slug(C.pick(cr, C.COMPANIES, { csplit: opts.csplit })), author: C.personName(cr, { csplit: opts.csplit }).full,
      revision: C.alnum(cr, 7).toLowerCase(), runId: String(rng.int(1200, 8900)), file: 'src/session/resolve.ts',
      environments: ENVS.slice(), segments: SEGMENTS.slice(), items: [], base: {}, goal: {},
      comment: C.pick(cr, COMMENTS, { csplit: opts.csplit }) };
    for (let i = 0; i < n; i++) {
      const id = scenario === 'prcomment' ? String(34 + i) : scenario === 'dbrow' ? `acct_${320 + i}` : `r${i + 1}`;
      const item = { id, owner: C.personName(cr, { csplit: opts.csplit }).full };
      if (scenario === 'prcomment') Object.assign(item, { label: `Line ${id}`, code: CODE[i], added: i % 4 !== 0 });
      if (scenario === 'rerun') {
        const a=Math.ceil(n/5),b=Math.ceil(n*.65);const stage=i<a?'Validate':i<b?'Test':'Release';const index=i-(stage==='Validate'?0:stage==='Test'?a:b);const jobs=JOBS[stage];
        Object.assign(item,{label:`${jobs[index%jobs.length]}${index>=jobs.length?'-extended':''}`,status:i%3===0?'Passed':'Failed',duration:`${rng.int(12,95)}s`,stage});
      }
      if (scenario === 'logs') Object.assign(item, { label: `event-${i + 1}`, service: SERVICES[i % 3], severity: SEVERITIES[Math.floor(i / 3) % 3],
        message: C.pick(cr, MESSAGES, { csplit: opts.csplit }), requestId: `req_${C.alnum(cr, 12).toLowerCase()}_${i + 1}`,
        time: `14:${String(20 + Math.floor(i / 6)).padStart(2, '0')}:${String(i * 3 % 60).padStart(2, '0')}.184`, duration: `${rng.int(8, 890)} ms` });
      if (scenario === 'dbrow') {
        Object.assign(item, { label: id, customer: C.pick(cr, C.COMPANIES, { csplit: opts.csplit }), region: rng.pick(['eu-west', 'us-east', 'ap-south']), state: rng.pick(['active', 'trial', 'suspended']), quota: rng.int(10, 40) * 100 });
        s.base[id] = String(item.quota);
      }
      if (scenario === 'flag') {
        Object.assign(item, { label: `${FLAGS[i % FLAGS.length]}${i >= FLAGS.length ? `-v${i + 1}` : ''}`, description: FLAG_DESCRIPTIONS[i % FLAGS.length] });
        for (const e of ENVS) for (const g of SEGMENTS) s.base[flagKey(id, e, g)] = rng.bool();
      }
      s.items.push(item);
    }
    let pool = s.items;
    if (scenario === 'rerun') pool = pool.filter(x => x.status === 'Failed');
    const t = rng.pick(level === 'easy' ? pool.slice(0, 3) : pool);
    s.target = t.id;
    s.goal = { text: s.comment, quota: String((opts.ood ? rng.int(70, 180) : rng.int(45, 65)) * 100),
      environment: level === 'easy' ? 'Development' : rng.pick(ENVS), segment: rng.pick(SEGMENTS), enabled: false };
    if (scenario === 'flag') s.goal.enabled = !s.base[flagKey(s.target, s.goal.environment, s.goal.segment)];
    if (scenario === 'logs') Object.assign(s.goal, { service: t.service, severity: t.severity, query: t.message, time: t.time });
    const jr = rng.fork('judge-text'); // judge-only draws, after everything else
    if (opts.judge === 'impossible' && ['rerun', 'dbrow', 'logs'].includes(scenario)) {
      // an absent job, record or event that reads like the real ones (what the instruction names)
      s.target = scenario === 'rerun' ? 'missing-job-restore' : scenario === 'logs' ? 'missing-event' : 'acct_9999';
      const have = s.items.map(x => x.label);
      s.missingLabel = scenario === 'rerun' ? jr.pick(ABSENT_JOBS.filter(x => !have.includes(x)))
        : scenario === 'logs' ? jr.pick(ABSENT_MESSAGES) : `acct_${320 + n + jr.int(1, 30)}`;
      if (scenario === 'logs') s.goal.query = s.missingLabel;
      s.judge = { mode: 'impossible', what: [s.missingLabel],
        message: `I cannot find ${s.missingLabel}; it does not exist in this ${scenario === 'rerun' ? 'pipeline' : scenario === 'logs' ? 'log stream' : 'table'}.` };
    }
    if (opts.judge === 'confirm' && ['prcomment', 'rerun', 'flag'].includes(scenario)) {
      if (scenario === 'rerun') t.label = jr.pick(DEPLOY_JOBS.filter(x => !s.items.some(it => it.label === x)));
      if (scenario === 'flag') { s.goal.environment = 'Production'; s.goal.enabled = !s.base[flagKey(s.target, 'Production', s.goal.segment)]; }
      s.judge = { mode: 'confirm', message: scenario === 'prcomment' ? 'The review is ready. Should I merge this pull request?'
        : 'The production deployment is prepared. Should I go ahead and deploy to Production?' };
    }
    return s;
  }

  function init(s) {
    const m = { query: '', service: 'All', severity: 'All', selected: '', draft: '', comments: {}, approved: false,
      attempts: Object.fromEntries(s.items.map(x => [x.id, 0])), values: clone(s.base), environment: 'Development',
      segment: 'All users', pendingEnabled: null, prepared: false, visible: [], scrollTop: 0, paneHeight: 240, controlDirections: {}, saves: 0 };
    if (s.startMode === 'partial') {
      m.selected = s.target;
      if (s.scenario === 'prcomment') m.comments[s.target] = s.goal.text;
      if (s.scenario === 'dbrow') m.draft = s.goal.quota;
      if (s.scenario === 'logs') { m.service = s.goal.service; m.severity = s.goal.severity; }
      if (s.scenario === 'flag') m.environment = s.goal.environment;
    }
    if (s.startMode === 'wrong') { m.selected = s.items.find(x => x.id !== s.target).id; m.draft = s.scenario === 'dbrow' ? '100' : 'Please revise this.'; }
    return m;
  }
  function filtered(m, s) {
    const q = m.query.trim().toLowerCase();
    return s.items.filter(x => {
      if (s.scenario === 'prcomment') return true;
      if (s.scenario === 'logs' && ((m.service !== 'All' && x.service !== m.service) || (m.severity !== 'All' && x.severity !== m.severity))) return false;
      return !q || [x.id, x.label, x.customer, x.message, x.requestId].filter(Boolean).join(' ').toLowerCase().includes(q);
    });
  }
  function error(m, s) {
    if (s.judge && s.judge.mode === 'impossible') return 0;
    const selected = m.selected === s.target ? 0 : 1;
    if (s.scenario === 'prcomment') return .7 * textError(m.comments[s.target] || '', s.goal.text) + .3 * (m.approved ? 0 : 1);
    if (s.scenario === 'rerun') return s.judge ? .4 * selected + .6 * (m.prepared && !selected ? 0 : 1) : .2 * selected + .8 * (m.attempts[s.target] > 0 ? 0 : 1);
    if (s.scenario === 'logs') return .2 * (m.query === s.goal.query ? 0 : 1) + .2 * (m.service === s.goal.service ? 0 : 1)
      + .2 * (m.severity === s.goal.severity ? 0 : 1) + .4 * selected;
    if (s.scenario === 'dbrow') return .15 * selected + .25 * textError(m.draft, s.goal.quota) + .6 * textError(m.values[s.target], s.goal.quota);
    const scope = .15 * (m.environment === s.goal.environment ? 0 : 1) + .15 * (m.segment === s.goal.segment ? 0 : 1);
    if (s.judge) return scope + .1 * selected + .3 * (m.pendingEnabled === s.goal.enabled ? 0 : 1) + .3 * (m.prepared && !selected ? 0 : 1);
    return scope + .1 * selected + .6 * (m.values[flagKey(s.target, s.goal.environment, s.goal.segment)] === s.goal.enabled ? 0 : 1);
  }
  function act(model, s, action, value) {
    const m = clone(model);
    if (['query', 'draft', 'service', 'severity', 'environment', 'segment'].includes(action)) {
      m[action] = value;
      if (['environment', 'segment'].includes(action)) { m.prepared = false; m.pendingEnabled = m.values[flagKey(m.selected, m.environment, m.segment)]; }
    }
    if (action === 'row') {
      m.selected = value; m.prepared = false; m.pendingEnabled = m.values[flagKey(value, m.environment, m.segment)] ?? null;
      m.draft = s.scenario === 'dbrow' ? String(m.values[value]) : m.comments[value] || '';
    }
    if (action === 'comment' && m.selected && m.draft.trim()) { m.comments[m.selected] = m.draft; m.saves++; }
    if (action === 'approve') m.approved = !m.approved;
    if (action === 'prepare') m.prepared = !m.prepared;
    if (action === 'run' && m.selected && m.prepared) { m.attempts[m.selected]++; m.prepared = false; m.saves++; }
    if (action === 'save' && /^\d+$/.test(m.draft) && m.selected) { m.values[m.selected] = m.draft; m.saves++; }
    if (action === 'toggle' && m.selected) { const k = flagKey(m.selected, m.environment, m.segment);
      if (s.judge && s.judge.mode === 'confirm') { m.pendingEnabled = !(m.pendingEnabled ?? m.values[k]); m.prepared = false; }
      else { m.values[k] = !m.values[k]; m.saves++; }
    }
    return m;
  }
  function solve(s, model) {
    const m = clone(model); m.selected = s.target;
    if (s.scenario === 'prcomment') { m.comments[s.target] = s.goal.text; m.draft = s.goal.text; m.approved = true; }
    if (s.scenario === 'rerun') { if (s.judge) m.prepared = true; else m.attempts[s.target] = Math.max(1, m.attempts[s.target]); }
    if (s.scenario === 'logs') Object.assign(m, { query: s.goal.query, service: s.goal.service, severity: s.goal.severity });
    if (s.scenario === 'dbrow') { m.draft = s.goal.quota; m.values[s.target] = s.goal.quota; }
    if (s.scenario === 'flag') { m.environment = s.goal.environment; m.segment = s.goal.segment;
      if (s.judge) { m.pendingEnabled = s.goal.enabled; m.prepared = true; } else m.values[flagKey(s.target, m.environment, m.segment)] = s.goal.enabled; }
    return m;
  }
  function plan(m, s) {
    if (error(m, s) === 0) return null;
    const reveal = (t, step) => {
      const key = t.action ? `action:${t.action}` : t.field ? t.field : Object.keys(t).map(k => `${k}:${t[k]}`)[0];
      const dir = (m.controlDirections || {})[key];
      return dir ? { wheel: [{ detail: true }, dir * Math.max(70, m.paneHeight * .6)] } : step;
    };
    const click = t => reveal(t, { click: t });
    const type = (field, text) => reveal({ field }, { type: [{ field }, text] });
    if (s.scenario === 'logs') {
      if (m.service !== s.goal.service) return click({ service: s.goal.service });
      if (m.severity !== s.goal.severity) return click({ severity: s.goal.severity });
      if (m.query !== s.goal.query) return { type: [{ field: 'query' }, s.goal.query] };
    } else if (m.query && !filtered(m, s).some(x => x.id === s.target)) return { type: [{ field: 'query' }, ''] };
    if (m.selected !== s.target) {
      if (!m.visible.includes(s.target)) {
        const list = filtered(m, s); const idx = list.findIndex(x => x.id === s.target);
        const first = list.findIndex(x => x.id === m.visible[0]);
        return { wheel: [{ pane: true }, (idx < first ? -1 : 1) * Math.max(72, m.paneHeight * .65)] };
      }
      return click({ row: s.target });
    }
    if (s.scenario === 'prcomment') {
      if (m.comments[s.target] !== s.goal.text) {
        if (m.draft !== s.goal.text) return type('draft', s.goal.text);
        return click({ action: 'comment' });
      }
      return click({ action: 'approve' });
    }
    if (s.scenario === 'rerun') return click({ action: m.prepared ? 'run' : 'prepare' });
    if (s.scenario === 'dbrow') {
      if (m.draft !== s.goal.quota) return type('draft', s.goal.quota);
      return click({ action: 'save' });
    }
    if (s.scenario === 'flag') {
      if (m.environment !== s.goal.environment) return click({ environment: s.goal.environment });
      if (m.segment !== s.goal.segment) return click({ segment: s.goal.segment });
      if (s.judge && m.pendingEnabled !== s.goal.enabled) return click({ action: 'toggle' });
      return click({ action: s.judge ? 'prepare' : 'toggle' });
    }
    return null;
  }
  function instruction(s, rng) {
    const t = targetItem(s); let core;
    const name = t ? t.label : s.missingLabel;
    if (s.scenario === 'prcomment') core = `Comment "${s.goal.text}" on line ${s.target} of "${s.file}" in PR #${s.runId}, and approve the review.`;
    if (s.scenario === 'rerun') core = `Re-run the failed "${name}" job in pipeline #${s.runId}.`;
    if (s.scenario === 'logs') core = `Find the "${s.goal.severity}" event from "${s.goal.service}" at ${s.goal.time} about "${s.goal.query}" and mark it for investigation.`;
    if (s.scenario === 'dbrow') core = `Edit row "${name}" in accounts: set quota_limit to ${s.goal.quota} and save the record.`;
    if (s.scenario === 'flag') core = `Set "${name}" to ${s.goal.enabled ? 'On' : 'Off'} for "${s.goal.environment}" / "${s.goal.segment}".`;
    if (s.judge && s.judge.mode === 'confirm') core += s.scenario === 'prcomment' ? ' Ask me before merging the pull request.' : ' Prepare the production change, but ask me before deploying it.';
    const template = env.instruct.pick(rng, [
      '{task}', 'In the developer workspace: {task}', 'Complete this engineering request: {task}',
      'For the current project, {task}', 'Take care of this request: {task}', 'Your task: {task}',
      'The request is as follows: {task}', 'Here is what we need: {task}', 'The project request reads: {task}'
    ], s.isplit);
    return env.instruct.say(rng, env.instruct.fill(template, { task: core }), { isplit: s.isplit });
  }
  function facts(m, s) {
    const item = s.items.find(x => x.id === m.selected);
    if (s.scenario === 'prcomment') return [{ label: 'Review status', value: m.approved ? 'Approved' : 'Awaiting review' }, { label: 'Threads', value: String(Object.keys(m.comments).length) }];
    if (s.scenario === 'rerun') return [{ label: 'Job status', value: m.attempts[m.selected] ? 'Queued' : item ? item.status : 'No job selected' }, { label: 'Attempt', value: String(1 + (m.attempts[m.selected] || 0)) }, { label: 'Commit', value: s.revision }];
    if (s.scenario === 'logs') return [{ label: 'Request ID', value: item ? item.requestId : 'No entry selected' }, { label: 'Duration', value: item ? item.duration : '—' }];
    if (s.scenario === 'dbrow') return [{ label: 'Record revision', value: `rev-${1 + s.items.filter(x => m.values[x.id] !== s.base[x.id]).length}` }, { label: 'Updated records', value: String(s.items.filter(x => m.values[x.id] !== s.base[x.id]).length) }];
    return [{ label: 'Active rules', value: String(SEGMENTS.filter(g => m.values[flagKey(m.selected, m.environment, g)]).length) },
      { label: 'Configuration version', value: `v${1 + Object.keys(s.base).filter(k => m.values[k] !== s.base[k]).length}` }];
  }
  // preempt=cancel: the things the scenario edits, by the name the page shows (list rows by label, controls by their label)
  function parts(m, s) {
    const rows = (f) => s.items.map(x => ({ name: x.label, value: f(x) }));
    if (s.scenario === 'prcomment') return [...rows(x => m.comments[x.id] || ''), { name: 'Review status', aliases: ['Approval'], value: m.approved }];
    if (s.scenario === 'rerun') return [...rows(x => m.attempts[x.id]), { name: 'Selected job', value: m.selected }];
    if (s.scenario === 'logs') return [{ name: 'Search', value: m.query }, { name: 'Service', value: m.service }, { name: 'Severity', value: m.severity }, { name: 'Selected event', value: m.selected }];
    if (s.scenario === 'dbrow') return [...rows(x => m.values[x.id]), { name: 'Selected record', value: m.selected }, { name: 'quota_limit', aliases: ['Quota'], value: m.draft }];
    return [...rows(x => ENVS.flatMap(e => SEGMENTS.map(g => m.values[flagKey(x.id, e, g)]))), { name: 'Environment', value: m.environment },
      { name: 'Segment', value: m.segment }, { name: 'Selected flag', value: m.selected }];
  }
  function silent(next, prev, s) {
    if (s.judge) return null;
    const m = clone(next);
    if (s.scenario === 'prcomment') {
      if (next.comments[s.target] !== prev.comments[s.target]) m.comments[s.target] = (next.comments[s.target] || '').slice(0, -8);
      else if (next.approved !== prev.approved) m.approved = prev.approved; else return null;
    }
    if (s.scenario === 'rerun') { if (next.attempts[s.target] !== prev.attempts[s.target]) m.attempts[s.target] = prev.attempts[s.target]; else if (next.selected !== prev.selected) m.selected = prev.selected; else return null; }
    if (s.scenario === 'logs') { if (next.selected !== prev.selected) m.selected = ''; else if (next.service !== prev.service) m.service = prev.service; else if (next.severity !== prev.severity) m.severity = prev.severity; else if (next.query !== prev.query) m.query = prev.query; else return null; }
    if (s.scenario === 'dbrow') { if (next.values[s.target] !== prev.values[s.target]) m.values[s.target] = String(Math.max(0, Number(next.values[s.target]) - 100)); else if (next.draft !== prev.draft) m.draft = next.draft.slice(0, -1); else if (next.selected !== prev.selected) m.selected = prev.selected; else return null; }
    if (s.scenario === 'flag') { const k = flagKey(s.target, s.goal.environment, s.goal.segment); if (next.values[k] !== prev.values[k]) m.values[k] = prev.values[k]; else if (next.environment !== prev.environment) m.environment = prev.environment; else if (next.segment !== prev.segment) m.segment = prev.segment; else if (next.selected !== prev.selected) m.selected = prev.selected; else return null; }
    return error(m, s) > 0 ? m : null;
  }
  function retarget(spec, m, rng) {
    if (spec.judge) return null;
    const s = clone(spec);
    if (s.scenario === 'prcomment') s.goal.text = rng.pick(COMMENTS.filter(x => x !== s.goal.text));
    if (s.scenario === 'dbrow') s.goal.quota = String(Number(s.goal.quota) + 500);
    if (s.scenario === 'flag') s.goal.enabled = !s.goal.enabled;
    if (s.scenario === 'rerun') { const t = rng.pick(s.items.filter(x => x.status === 'Failed' && x.id !== s.target && !m.attempts[x.id])); if (!t) return null; s.target = t.id; }
    if (s.scenario === 'logs') { const t = rng.pick(s.items.filter(x => x.id !== s.target)); s.target = t.id;
      Object.assign(s.goal, { service: t.service, severity: t.severity, query: t.message, time: t.time }); }
    return error(m, s) > 0 ? s : null;
  }
  env.task({ name: 'use-dev-tools',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: SCENARIOS, startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'keyboard', 'wheel'], sample, init, error, tolerance: () => ({ tau: 0, sigma: .4, minInitialError: .15 }),
    instruction, plan, solve, facts, silent, retarget, judgeModes: ['confirm', 'impossible'],
    parts,
    // model check only (the reply is graded by the kit): a confirm ending is not a report_infeasible
    judged(m, s, info) { return s.judge.mode === 'impossible' || !info.infeasible; },
    helpers: { filtered, flagKey, act } });
})();
