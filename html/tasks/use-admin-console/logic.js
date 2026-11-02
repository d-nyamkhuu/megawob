/*
 * use-admin-console: create VMs, set roles, reset users, assign tickets and set quotas in an IT admin console.
 * Fictional IT administration / cloud console (no MiniWoB counterpart).
 * Real-app counterparts: compute provisioning consoles, directory role/licence management,
 * service-desk queue assignment and subscription quota settings. No external services are used.
 *
 * Scenarios: vm (region -> image -> size -> disk -> network -> tags -> review/create),
 * iam (edit users' role and licence), resetuser (password/MFA reset with confirmation),
 * tickets (route every ticket by category rules), quota (nested service/region/limit settings).
 * Spec: scenario, level, ood, startMode, isplit/csplit, users[{id,name,email,team}], tickets[],
 * options{field:strings[]}, fields[{id,label,hint}], target{field:string}, assignments{user:{role,licence}},
 * rules{category:queue}, user (reset id), action, notify, path[], quotaName, limit, resourceId, receipt.
 * Model: values/saved{field:string}, access/draftAccess{user:{role,licence}}, queues{ticket:queue},
 * resets{user:action}, step, created, selected, action, notify, dialog, depth, limit/savedLimit,
 * page, pageSize (widget mirrors a stage-sized page), editing (user id), open (picker id), notice.
 * clipped (widget-mirrored target scroll offsets); UI fields are unscored.
 * Start modes: off, partial (some requested work prepared), wrong (plausible wrong saved settings,
 * wrong selected user/action), solved. Easy/medium reduce records/options and prefill more fields;
 * ood expands records, disk/limit ranges and quota navigation depth.
 * Error: mean field mismatches, saved/draft subgoals, queue mismatches or reset preparation subgoals;
 * quotas use normalized numeric distance. Unrequested access changes and resets are penalized.
 * Targets: {nav:'next'|'back'|'create'|'edit'|'saveAccess'|'reset'|'confirm'|'cancel'|'saveQuota'|'up'},
 * {field:id}, {pick:id}, {option:[id,value]}, {row:id}, {page:n}, {depth:n}, {pane:true} (inner wheel).
 * Helpers (widget API, env.taskDef.helpers):
 *   apply(model, spec, action): shared model transitions for widget interactions.
 *   cost(model, spec): formatted monthly VM estimate.
 * facts: resource id and monthly estimate (VM), audit reference plus resulting counts/status/headroom;
 * all labels and formatted values are visible in the widget's persistent resource summary/footer.
 * parts: preempt=cancel items by visible name: VM settings (+ the resource id once created), users by email (access or
 * reset and selected), the reset action and notify choice, tickets by id (queue), the quota limit (typed, and the saved limit).
 * silent: one improved field/role/queue/limit reverts to its previous saved value; repeat fixes it.
 * retarget: same scene, new VM size, user role, reset action, category rule or quota limit; null for judges.
 * judgeModes: confirm prepares a reset dialog, VM review, access editor, routing proposal or quota draft;
 * status confirm before the committing control (widget flags irreversible; judged() checks the preparation is exact).
 * Ambiguous: two users with the same name (the instruction names the account instead of its email); the reply asks
 * (status ask) with one option per account, each by email or id (spec.judge.cands; others: the other users, never
 * offered), without changing state (account context shown for infrastructure scenarios).
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct, { clone } = env.util;
  const SCENARIOS = ['vm', 'iam', 'resetuser', 'tickets', 'quota'];
  const ROLES = ['Reader', 'Operator', 'Administrator'];
  const LICENCES = ['None', 'Workspace Basic', 'Workspace Plus'];
  const CATEGORIES = ['Access', 'Connectivity', 'Billing', 'Hardware'];
  const QUEUES = ['Identity desk', 'Network operations', 'Accounts team', 'Endpoint support'];
  const FIELDS = [
    { id: 'region', label: 'Region', hint: 'Choose where the resource and its data will reside.' },
    { id: 'image', label: 'Operating system image', hint: 'Verified images include security updates and monitoring.' },
    { id: 'size', label: 'Instance size', hint: 'Compute is billed hourly. Estimates assume 730 hours per month.' },
    { id: 'disk', label: 'Boot disk (GiB)', hint: 'Encrypted SSD storage. This setting can be increased later.' },
    { id: 'network', label: 'Virtual network', hint: 'Private networks deny unsolicited inbound connections.' },
    { id: 'tag', label: 'Environment tag', hint: 'Tags appear in usage reports and cost allocation.' },
  ];
  const normal = x => String(x ?? '').trim();
  const mismatch = (a, b) => normal(a) === normal(b) ? 0 : 1;
  function sample(rng, opts = {}) {
    const scenario = opts.scenario || rng.pick(opts.scenarios || SCENARIOS);
    const level = opts.level || 'normal', easy = level === 'easy', medium = level === 'medium';
    const n = opts.ood ? 12 : easy ? 3 : medium ? 5 : 8;
    const cr = rng.fork('content');
    const users = Array.from({ length: n }, (_, i) => {
      const p = C.personName(cr, { csplit: opts.csplit });
      return { id: `usr-${410 + i}`, name: p.full, email: `${C.slug(p.full)}.${i + 1}@northstar.example`,
        team: cr.pick([
          'Engineering', 'Operations', 'Finance', 'Customer success', 'Product', 'Research', 'Data science',
          'Human resources', 'Security', 'Design', 'Infrastructure', 'Communications', 'Procurement', 'Facilities',
          'Marketing', 'Legal affairs'
        ]) };
    });
    const s = { scenario, level, ood: !!opts.ood, startMode: opts.startMode || 'off',
      isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', users, fields: clone(FIELDS),
      resourceId: `vm-${C.alnum(cr, 8).toLowerCase()}`, receipt: `AUD-${C.digits(cr, 7)}`,
      options: { region: ['East Harbor', 'West Ridge', 'North Vale', 'South Reach'].slice(0, easy ? 2 : 4),
        image: ['Lumen Server 12', 'Fable Linux 9', 'Lumen Server 11'].slice(0, easy ? 2 : 3),
        size: ['c2.small · 2 vCPU / 4 GiB', 'c2.medium · 4 vCPU / 8 GiB', 'c2.large · 8 vCPU / 16 GiB'].slice(0, easy ? 2 : 3),
        disk: (opts.ood ? [64, 128, 256, 512] : [32, 64, 128]).map(String),
        network: ['production-private', 'staging-private', 'shared-services'].slice(0, easy ? 2 : 3),
        tag: ['production', 'staging', 'development'].slice(0, easy ? 2 : 3),
        role: ROLES, licence: LICENCES, action: ['Reset password', 'Reset MFA'], queue: QUEUES },
      target: {}, assignments: {}, rules: {}, user: rng.pick(users).id,
      action: rng.pick(['Reset password', 'Reset MFA']), notify: rng.bool(),
      path: opts.ood ? ['Organization', 'Subscriptions', 'Production', 'Compute', 'Regional quotas']
        : ['Subscriptions', 'Compute', 'Regional quotas'],
      quotaName: rng.pick(['Virtual CPUs', 'Persistent disks', 'Public addresses']),
      limit: opts.ood ? rng.int(40, 96) * 25 : rng.int(6, easy ? 12 : 32) * 10,
      quotaRegion: rng.pick(['East Harbor', 'West Ridge']), usage: rng.int(12, 35) };
    for (const f of FIELDS) s.target[f.id] = rng.pick(s.options[f.id]);
    for (const u of rng.sample(users, easy ? 1 : medium ? 2 : 3)) {
      s.assignments[u.id] = { role: rng.pick(ROLES.slice(1)), licence: rng.pick(LICENCES.slice(1)) };
    }
    const routing = rng.shuffle(QUEUES);
    CATEGORIES.forEach((c, i) => { s.rules[c] = routing[i]; });
    s.tickets = Array.from({ length: n }, (_, i) => ({ id: `HD-${2700 + i}`, category: CATEGORIES[i % 4],
      title: cr.pick({ Access: ['Cannot sign in to workspace', 'New starter needs access'],
        Connectivity: ['Office gateway disconnects', 'VPN cannot reach private subnet'],
        Billing: ['Invoice has an unexpected charge', 'Update billing contact'],
        Hardware: ['Laptop battery will not charge', 'Replace damaged docking station'] }[CATEGORIES[i % 4]]),
      requester: users[i].name, priority: cr.pick(['Normal', 'High', 'Urgent']) }));
    if (opts.judge === 'confirm') {
      if (scenario === 'iam') { const id = Object.keys(s.assignments)[0]; s.assignments = { [id]: s.assignments[id] }; }
      s.judge = { mode: 'confirm', message: scenario === 'resetuser'
        ? `Should I go ahead and ${s.action.toLowerCase()} for ${users.find(u => u.id === s.user).email}?`
        : `Should I go ahead and ${ { vm: 'create the virtual machine', iam: 'save the access changes', tickets: 'apply the routing proposals', quota: 'save the quota limit' }[scenario]}?` };
    }
    if (opts.judge === 'ambiguous') {
      users[1].name = users[0].name;
      // the two accounts are told apart by email (and id); the other accounts must not be offered
      const others = users.slice(2).map(u => [u.email, u.id, ...(u.name === users[0].name ? [] : [u.name])]);
      s.judge = { mode: 'ambiguous', name: users[0].name, ids: [users[0].id, users[1].id],
        cands: [[users[0].email, users[0].id], [users[1].email, users[1].id]], others,
        message: `Which account for ${users[0].name} do you mean: ${users[0].email} or ${users[1].email}?` };
    }
    return s;
  }
  function base(s) {
    const values = Object.fromEntries(FIELDS.map(f => [f.id, s.options[f.id][0]]));
    return { values, saved: clone(values), step: 0, created: false,
      access: Object.fromEntries(s.users.map(u => [u.id, { role: 'Reader', licence: 'None' }])),
      draftAccess: { role: 'Reader', licence: 'None' }, queues: Object.fromEntries(s.tickets.map(t => [t.id, 'Unassigned'])),
      resets: {}, selected: null, action: 'Reset password', notify: false, dialog: false,
      depth: 0, limit: '50', savedLimit: '50', page: 0, pageSize: 3, editing: null, open: null, notice: '' };
  }
  function goalQueues(s) { return Object.fromEntries(s.tickets.map(t => [t.id, s.rules[t.category]])); }
  function solve(s, m) {
    const x = clone(m || base(s));
    if (s.judge?.mode === 'ambiguous') return base(s);
    if (s.scenario === 'vm') { x.values = clone(s.target); x.saved = clone(s.target); x.created = true; x.step = 7; }
    if (s.scenario === 'iam') { Object.assign(x.access, clone(s.assignments)); x.editing = null; }
    if (s.scenario === 'tickets') x.queues = goalQueues(s);
    if (s.scenario === 'quota') { x.depth = s.path.length; x.limit = String(s.limit); x.savedLimit = String(s.limit); }
    if (s.scenario === 'resetuser') { x.selected = s.user; x.action = s.action; x.notify = s.notify;
      x.dialog = !!s.judge; if (!s.judge) x.resets[s.user] = s.action; }
    if (s.judge?.mode === 'confirm' && s.scenario === 'vm') { x.created = false; x.step = 6; }
    if (s.judge?.mode === 'confirm' && s.scenario === 'iam') {
      x.access = clone(base(s).access); x.editing = Object.keys(s.assignments)[0]; x.draftAccess = clone(s.assignments[x.editing]);
    }
    return x;
  }
  function init(s) {
    const m = base(s);
    if (s.judge?.mode === 'ambiguous') return m;
    if (s.startMode === 'solved') return solve(s, m);
    if (s.scenario === 'vm') {
      // Every off start disagrees on all six settings; easy starts with more prepared fields.
      for (const f of FIELDS) m.values[f.id] = s.options[f.id].find(v => v !== s.target[f.id]);
      if (s.level === 'easy') for (const f of FIELDS.slice(0, 3)) m.values[f.id] = s.target[f.id];
      if (s.startMode === 'partial') { Object.assign(m.values, Object.fromEntries(FIELDS.slice(0, 4).map(f => [f.id, s.target[f.id]]))); m.step = 4; }
      m.saved = clone(m.values);
      if (s.startMode === 'wrong') { m.created = true; m.step = 7; }
    }
    if (s.scenario === 'iam' && ['partial', 'wrong'].includes(s.startMode)) {
      const id = Object.keys(s.assignments)[0]; m.access[id].role = s.assignments[id].role;
      if (s.startMode === 'wrong') {
        m.access[id].role = ROLES.slice(1).find(v => v !== s.assignments[id].role);
        m.access[id].licence = LICENCES.slice(1).find(v => v !== s.assignments[id].licence);
      }
    }
    if (s.scenario === 'tickets' && s.startMode === 'partial') for (const t of s.tickets.slice(0, 2)) m.queues[t.id] = s.rules[t.category];
    if (s.scenario === 'tickets' && s.startMode === 'wrong') for (const t of s.tickets) m.queues[t.id] = QUEUES.find(q => q !== s.rules[t.category]);
    if (s.scenario === 'quota') {
      m.limit = m.savedLimit = String(s.limit === 50 ? 40 : 50);
      if (s.startMode === 'partial') { m.depth = s.path.length - (s.judge?.mode === 'confirm' ? 1 : 0); m.limit = String(s.limit); }
      if (s.startMode === 'wrong') m.depth = s.path.length - 1;
    }
    if (s.scenario === 'resetuser') {
      if (s.startMode === 'partial') { m.selected = s.user; m.action = s.action; }
      if (s.startMode === 'wrong') { m.selected = s.users.find(u => u.id !== s.user).id; m.action = s.action === 'Reset MFA' ? 'Reset password' : 'Reset MFA'; }
    }
    return m;
  }
  function error(m, s) {
    const quotaDistance = v => /^\d+$/.test(String(v)) && Number.isFinite(Number(v))
      ? Math.min(1, Math.abs(Number(v) - s.limit) / Math.max(10, s.limit)) : 1;
    if (s.judge?.mode === 'ambiguous') {
      const b = base(s);
      return ['values', 'saved', 'access', 'queues', 'resets', 'savedLimit'].reduce((e, k) =>
        e + (JSON.stringify(m[k]) === JSON.stringify(b[k]) ? 0 : 1), 0);
    }
    if (s.judge?.mode === 'confirm') {
      if (s.scenario === 'vm') return (FIELDS.reduce((e, field) => e + mismatch(m.values[field.id], s.target[field.id]), 0)
        + (m.step === 6 && !m.created ? 0 : 1)) / 7;
      if (s.scenario === 'iam') { const id = Object.keys(s.assignments)[0], g = s.assignments[id];
        return (mismatch(m.editing, id) + mismatch(m.draftAccess.role, g.role) + mismatch(m.draftAccess.licence, g.licence)) / 3; }
      if (s.scenario === 'quota') return (quotaDistance(m.limit)
        + (m.depth === s.path.length ? 0 : 1)) / 2;
    }
    if (s.scenario === 'vm') return (FIELDS.reduce((n, f) => n + mismatch(m.values[f.id], s.target[f.id])
      + mismatch(m.saved[f.id], s.target[f.id]), 0) + (m.created ? 0 : 1)) / 13;
    if (s.scenario === 'iam') return s.users.reduce((e, u) => {
      const g = s.assignments[u.id] || { role: 'Reader', licence: 'None' };
      return e + mismatch(m.access[u.id].role, g.role) + mismatch(m.access[u.id].licence, g.licence);
    }, 0) / (2 * s.users.length);
    if (s.scenario === 'tickets') return s.tickets.reduce((e, t) => e + mismatch(m.queues[t.id], s.rules[t.category]), 0) / s.tickets.length;
    if (s.scenario === 'quota') return (quotaDistance(m.limit) + quotaDistance(m.savedLimit)) / 2;
    const extra = Object.keys(m.resets).filter(id => id !== s.user).length;
    return (mismatch(m.selected, s.user) + mismatch(m.action, s.action) + (m.notify === s.notify ? 0 : 1)
      + (s.judge?.mode === 'confirm' ? (m.dialog ? 0 : 1) : mismatch(m.resets[s.user], s.action)) + extra) / 4;
  }
  function apply(model, s, a) {
    const m = clone(model); m.notice = '';
    if (a.page !== undefined) { m.page = a.page; m.open = null; }
    if (a.pick) m.open = m.open === a.pick ? null : a.pick;
    if (a.set) {
      const [k, v] = a.set;
      if (FIELDS.some(f => f.id === k)) m.values[k] = v;
      else if (['role', 'licence'].includes(k)) m.draftAccess[k] = v;
      else if (k === 'action') m.action = v;
      else if (k === 'notify') m.notify = !!v;
      else if (k === 'limit') m.limit = v;
      else if (k.startsWith('queue:')) { m.queues[k.slice(6)] = v; m.notice = 'Ticket assignment saved'; }
      m.open = null;
    }
    if (a.row) {
      m.selected = a.row;
      if (s.scenario === 'iam') { m.editing = a.row; m.draftAccess = clone(m.access[a.row]); }
    }
    if (a.depth !== undefined) m.depth = a.depth;
    if (a.nav === 'next') m.step = Math.min(6, m.step + 1);
    if (a.nav === 'back') m.step = Math.max(0, m.step - 1);
    if (a.nav === 'edit') { m.step = 0; m.created = false; }
    if (a.nav === 'create') { m.saved = clone(m.values); m.created = true; m.step = 7; m.notice = 'Deployment complete'; }
    if (a.nav === 'saveAccess') { m.access[m.editing] = clone(m.draftAccess); m.editing = null; m.notice = 'Directory changes saved'; }
    if (a.nav === 'reset') m.dialog = true;
    if (a.nav === 'confirm') { m.resets[m.selected] = m.action; m.dialog = false; m.notice = `${m.action} completed`; }
    if (a.nav === 'cancel') { m.dialog = false; m.editing = null; m.open = null; }
    if (a.nav === 'saveQuota') { if (/^\d+$/.test(m.limit) && Number(m.limit) >= s.usage) {
      m.savedLimit = m.limit; m.notice = 'Quota limit saved';
    } else m.notice = `Enter a whole number of at least ${s.usage}.`; }
    if (a.nav === 'up') m.depth = Math.max(0, m.depth - 1);
    return m;
  }
  const pick = (m, id, value) => m.open === id ? { click: { option: [id, value] } } : { click: { pick: id } };
  function nextStep(m, s) {
    if (s.scenario === 'vm') {
      if (m.step === 7) return { click: { nav: 'edit' } };
      const bad = FIELDS.findIndex(f => mismatch(m.values[f.id], s.target[f.id]));
      if (bad >= 0) {
        if (m.step > bad) return { click: { nav: 'back' } };
        if (m.step < bad) return { click: { nav: 'next' } };
        return pick(m, FIELDS[bad].id, s.target[FIELDS[bad].id]);
      }
      return { click: { nav: m.step < 6 ? 'next' : 'create' } };
    }
    if (s.scenario === 'iam') {
      const u = s.users.find(u => { const g = s.assignments[u.id] || { role: 'Reader', licence: 'None' };
        return ['role', 'licence'].some(k => m.access[u.id][k] !== g[k]); });
      if (!u) return null;
      if (m.editing !== u.id) {
        if (m.editing) return { click: { nav: 'cancel' } };
        const page = Math.floor(s.users.indexOf(u) / m.pageSize);
        return { click: page !== m.page ? { page } : { row: u.id } };
      }
      const g = s.assignments[u.id] || { role: 'Reader', licence: 'None' };
      for (const k of ['role', 'licence']) if (m.draftAccess[k] !== g[k]) return pick(m, k, g[k]);
      return { click: { nav: 'saveAccess' } };
    }
    if (s.scenario === 'tickets') {
      const t = s.tickets.find(t => m.queues[t.id] !== s.rules[t.category]);
      if (!t) return null;
      const page = Math.floor(s.tickets.indexOf(t) / m.pageSize);
      return page !== m.page ? { click: { page } } : pick(m, `queue:${t.id}`, s.rules[t.category]);
    }
    if (s.scenario === 'quota') {
      if (m.depth < s.path.length) return { click: { depth: m.depth + 1 } };
      if (!/^\d+$/.test(m.limit) || Number(m.limit) !== s.limit) return { type: [{ field: 'limit' }, String(s.limit)] };
      return { click: { nav: 'saveQuota' } };
    }
    if (m.dialog) return { click: { nav: 'confirm' } };
    if (m.selected !== s.user) {
      const page = Math.floor(s.users.findIndex(u => u.id === s.user) / m.pageSize);
      return { click: page !== m.page ? { page } : { row: s.user } };
    }
    if (m.action !== s.action) return pick(m, 'action', s.action);
    if (m.notify !== s.notify) return { click: { field: 'notify' } };
    return { click: { nav: 'reset' } };
  }
  function plan(m, s) {
    const step = nextStep(m, s);
    const target = step && (step.click || step.type?.[0]);
    const dy = target && m.clipped?.[JSON.stringify(target)];
    return dy ? { wheel: [{ pane: true }, dy] } : step;
  }
  // Ambiguous instruction: the normal wording of the scenario with the shared account name in place of the email, from
  // the spec's own seeded values (the first access change, the reset action, the VM settings, the rules, the quota).
  function ambiguousCore(s, rng) {
    const name = s.judge.name;
    const own = [`for ${name}'s account`, `on the account of ${name}`, `owned by ${name}`];
    if (s.scenario === 'iam') {
      const g = Object.values(s.assignments)[0];
      return I.phrase(rng, ['Update directory access: {changes}. Leave all other accounts unchanged.', 'Assign these roles and licences: {changes}. Keep other users as they are.',
        'Save the following user access changes: {changes}; preserve everyone else.',
        'Keep all other accounts intact; save all these access changes: {changes}.',
        'Access edits to save: {changes}. Every other account must stay unchanged.',
        'Save {changes}. No other account should have any access settings changed.',
        'All listed edits must be saved: {changes}. Keep other accounts untouched.',
        'Only the listed access should change: {changes}. Save every listed edit.',
        'Save every role and licence in {changes}; leave other accounts unchanged.',
        'Each edit in {changes} needs saving; all other accounts must stay as is.',
        '{changes}: save all roles and licences; keep all other accounts unchanged.'], { changes: `${name}: ${g.role}, ${g.licence}` }, s.isplit);
    }
    if (s.scenario === 'resetuser') return I.phrase(rng,
      ['Perform "{action}" for {email}, {notify} the user by email.', 'Carry out "{action}" for {email}; {notify} the user by email.',
        'The account {email} needs "{action}"; {notify} the user by email.',
        'Use the "{action}" reset for {email}; {notify} the user by email.',
        'Please reset {email} via "{action}"; {notify} the user by email.'],
      { action: s.action, email: name, notify: s.notify ? 'notify' : 'do not notify' }, s.isplit);
    const tail = rng.pick(own);
    if (s.scenario === 'vm') return I.phrase(rng,
      [
        'Create a virtual machine with {settings} {tail}.', 'Provision one VM using {settings} {tail}.',
        'Deploy a new instance configured with {settings} {tail}.', 'One new VM {tail} is needed with {settings}.',
        'Set up one new VM {tail} configured as {settings}.', 'The VM to create {tail} should use {settings}.'
      ],
      { settings: FIELDS.map(f => `${f.label}: "${s.target[f.id]}"`).join('; '), tail }, s.isplit);
    if (s.scenario === 'tickets') return I.phrase(rng,
      [
        'Route all helpdesk tickets {tail} using these rules: {rules}.',
        'Assign every ticket {tail} to its queue: {rules}.', 'Triage the ticket list {tail} by category: {rules}.',
        'Every ticket {tail} needs routing by this map: {rules}.',
        'Use these queues for all tickets {tail}: {rules}.', 'All tickets {tail} on every page must follow: {rules}.'
      ],
      { rules: Object.entries(s.rules).map(([c, q]) => `${c} tickets go to ${q}`).join('; '), tail }, s.isplit);
    return I.phrase(rng,
      [
        'Change the {region} {quota} limit to {limit} {tail}.',
        'The {quota} quota for {region} should be {limit} {tail}.',
        'Update the {region} {quota} limit to {limit} {tail}.',
        'The {region} quota on {quota} {tail} must equal {limit}.',
        'Set {quota} {tail} in {region} to a limit of {limit}.'
      ],
      { quota: s.quotaName, region: s.quotaRegion, limit: s.limit, tail }, s.isplit);
  }
  function instruction(s, rng) {
    let core;
    if (s.judge?.mode === 'ambiguous') core = ambiguousCore(s, rng);
    else if (s.scenario === 'vm') core = I.phrase(rng,
      [
        'Create a virtual machine with {settings}.', 'Provision one VM using {settings}.',
        'Deploy a new instance configured with {settings}.', 'Create one VM configured as {settings}.',
        'Use {settings} when creating one VM.', 'Add a VM. Its settings must be {settings}.',
        'I need one virtual machine with {settings}.', 'Please build a VM to match {settings}.',
        'The VM to create should use {settings}.'
      ],
      { settings: FIELDS.map(f => `${f.label}: "${s.target[f.id]}"`).join('; ') }, s.isplit);
    else if (s.scenario === 'iam') core = I.phrase(rng,
      ['Update directory access: {changes}. Leave all other accounts unchanged.', 'Assign these roles and licences: {changes}. Keep other users as they are.',
        'Save the following user access changes: {changes}; preserve everyone else.',
        'Save all access edits in full; all other accounts stay intact: {changes}.',
        'Preserve all other accounts while saving the access updates: {changes}.',
        'The access changes to save are {changes}; leave all other accounts intact.',
        'Save {changes} in full. Accounts outside this list must stay unchanged.',
        'These are the only access changes to save: {changes}. Preserve all others.'],
      { changes: Object.entries(s.assignments).map(([id, g]) => `${s.users.find(u => u.id === id).email}: ${g.role}, ${g.licence}`).join('; ') }, s.isplit);
    else if (s.scenario === 'resetuser') core = I.phrase(rng,
      ['Perform "{action}" for {email}, {notify} the user by email.', 'Carry out "{action}" for {email}; {notify} the user by email.',
        'The account {email} needs "{action}"; {notify} the user by email.',
        'For {email}, apply "{action}" and {notify} the user by email.'],
      { action: s.action, email: s.users.find(u => u.id === s.user).email, notify: s.notify ? 'notify' : 'do not notify' }, s.isplit);
    else if (s.scenario === 'tickets') core = I.phrase(rng,
      [
        'Route all helpdesk tickets using these rules: {rules}.', 'Assign every ticket to its queue: {rules}.',
        'Triage the entire ticket list by category: {rules}.', 'Use this queue map for the full workset: {rules}.',
        'Match each ticket to its category queue: {rules}.', 'Set all ticket queues across every page: {rules}.',
        'All ticket queues should follow this map: {rules}.'
      ],
      { rules: Object.entries(s.rules).map(([c, q]) => `${c} tickets go to ${q}`).join('; ') }, s.isplit);
    else core = I.phrase(rng,
      ['Change the {region} {quota} limit to {limit} for {path}.', 'The {quota} quota for {region} should be {limit} in {path}.',
        'Update {path} so the {region} {quota} limit is {limit}.'],
      { quota: s.quotaName, region: s.quotaRegion, limit: s.limit, path: s.path.join(' / ') }, s.isplit);
    if (s.judge?.mode === 'confirm') core += s.scenario === 'resetuser'
      ? ' Get the reset ready, but ask me before invalidating the existing credentials.'
      : ' Prepare the changes for review, but ask me before committing them.';
    return I.say(rng, core, { isplit: s.isplit });
  }
  function cost(m, s) {
    const v = m.created ? m.saved : m.values;
    const cpu = s.options.size.indexOf(v.size);
    return C.formatMoney([24.82, 49.64, 99.28][Math.max(0, cpu)] + Number(v.disk) * 0.08, 'USD', 'en-US');
  }
  function facts(m, s) {
    if (s.scenario === 'vm') return [{ label: 'Resource ID', value: s.resourceId }, { label: 'Monthly estimate', value: cost(m, s) }];
    if (s.scenario === 'iam') return [{ label: 'Audit reference', value: s.receipt },
      { label: 'Licensed accounts', value: String(Object.values(m.access).filter(a => a.licence !== 'None').length) }];
    if (s.scenario === 'tickets') return [{ label: 'Audit reference', value: s.receipt },
      { label: 'Assigned tickets', value: `${Object.values(m.queues).filter(q => q !== 'Unassigned').length} / ${s.tickets.length}` }];
    if (s.scenario === 'quota') return [{ label: 'Audit reference', value: s.receipt },
      { label: 'Available headroom', value: String(Number(m.savedLimit) - s.usage) }];
    return [{ label: 'Audit reference', value: s.receipt }, { label: 'Reset status',
      value: m.resets[s.user] ? `${m.resets[s.user]} completed` : m.dialog ? 'Awaiting confirmation' : 'No reset performed' }];
  }
  // preempt=cancel: the VM settings, each user's access, each ticket's queue, the quota limit or each user's reset
  function parts(m, s) {
    if (s.scenario === 'vm') return [...FIELDS.map(f => ({ name: f.label, value: m.values[f.id] })), { name: s.resourceId, value: m.created }];
    if (s.scenario === 'iam') return s.users.map(u => ({ name: u.email, aliases: [u.name, u.id], value: `${m.access[u.id].role}, ${m.access[u.id].licence}` }));
    if (s.scenario === 'tickets') return s.tickets.map(t => ({ name: t.id, aliases: [t.title], value: m.queues[t.id] }));
    if (s.scenario === 'quota') return [{ name: `${s.quotaName} limit`, aliases: [s.quotaName], value: m.limit }, { name: 'Saved limit', value: m.savedLimit }];
    return [...s.users.map(u => ({ name: u.email, aliases: [u.name, u.id], value: [m.selected === u.id, m.resets[u.id] || null] })),
      { name: 'Reset action', value: m.action }, { name: 'Notify user', value: m.notify }];
  }
  function silent(next, prev, s, rng) {
    if (s.judge) return null;
    const candidates = [];
    if (s.scenario === 'vm') for (const f of FIELDS) if (next.values[f.id] !== prev.values[f.id]) candidates.push(m => {
      m.values[f.id] = prev.values[f.id]; if (m.created) m.saved[f.id] = prev.values[f.id]; });
    if (s.scenario === 'iam') for (const u of s.users) for (const k of ['role', 'licence'])
      if (next.access[u.id][k] !== prev.access[u.id][k]) candidates.push(m => { m.access[u.id][k] = prev.access[u.id][k]; });
    if (s.scenario === 'tickets') for (const t of s.tickets) if (next.queues[t.id] !== prev.queues[t.id])
      candidates.push(m => { m.queues[t.id] = prev.queues[t.id]; });
    if (s.scenario === 'quota' && next.savedLimit !== prev.savedLimit) candidates.push(m => { m.limit = m.savedLimit = prev.savedLimit; });
    if (s.scenario === 'resetuser' && next.action !== prev.action) candidates.push(m => { m.action = prev.action; });
    if (s.scenario === 'resetuser' && next.notify !== prev.notify) candidates.push(m => { m.notify = prev.notify; });
    if (!candidates.length) return null;
    const m = clone(next); rng.pick(candidates)(m); return error(m, s) > 0 ? m : null;
  }
  function retarget(spec, m, rng) {
    if (spec.judge) return null;
    const s = clone(spec);
    if (s.scenario === 'vm') s.target.size = rng.pick(s.options.size.filter(v => v !== m.values.size));
    if (s.scenario === 'iam') { const id = rng.pick(s.users).id; s.assignments[id] = clone(s.assignments[id] || m.access[id]);
      s.assignments[id].role = rng.pick(ROLES.filter(v => v !== m.access[id].role)); }
    if (s.scenario === 'resetuser') s.action = m.resets[s.user] === 'Reset MFA' || m.action === 'Reset MFA' ? 'Reset password' : 'Reset MFA';
    if (s.scenario === 'tickets') { const t = rng.pick(s.tickets); s.rules[t.category] = rng.pick(QUEUES.filter(v => v !== m.queues[t.id])); }
    if (s.scenario === 'quota') s.limit = Number(m.savedLimit) + rng.pick([20, 40, 80]);
    return error(m, s) > 0 ? s : null;
  }
  env.task({ name: 'use-admin-console',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: SCENARIOS, startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'keyboard', 'wheel'], judgeModes: ['confirm', 'ambiguous'], sample, init, error,
    tolerance: () => ({ tau: 0, sigma: 0.3, minInitialError: 0.01 }), instruction, plan, solve,
    helpers: { apply, cost }, facts, silent, retarget,
    parts,
    // model check for confirm: the changes are prepared and the committing step is still undone (the reply is graded by the kit)
    judged(m, s, info) {
      if (info.infeasible) return false;
      if (s.judge.mode !== 'confirm') return true;
      return error(m, s) === 0 && (s.scenario !== 'resetuser' || (m.dialog && !m.resets[s.user]));
    },
  });
})();
