/*
 * use-hr: move candidates, edit the org chart, handle time off and onboard new hires.
 * Fictional recruiting and people operations (ATS / HRIS workflows).
 * Real-app counterparts: applicant tracking boards, employee reporting trees, leave management,
 * and new-hire provisioning. No MiniWoB counterpart; all people and organizations are fictional.
 *
 * Scenarios: pipeline (route candidates by experience, skill and interview score); orgchart (move a
 * reporting branch, retaining its descendants); timeoff (decide requests using balance, blackout
 * overlap and independent team-coverage forecasts); onboarding (checklist, equipment, start date).
 * Spec: common {scenario, level, ood, isplit, csplit, startMode, company, people}; pipeline adds
 * candidates, rule {years, skill, score}; orgchart adds parents, employee, manager; timeoff adds
 * requests, policy {coverage, blackoutStart, blackoutEnd}; onboarding adds tasks, required, equipment,
 * kit, date, hire. Goal fields are rule / employee+manager / policy / required+kit+date respectively.
 * Model: {stages, parents, decisions, checked, kit, date, selected, draft, sent, view}; only fields for
 * the active workflow are scored. view is unscored geometry supplied by the widget for inner scrolling.
 * Targets: {candidate:id}, {stage:name}, {employee:id}, {manager:id}, {decision:id,value},
 * {task:id}, {equipment:id}, {date:true}, {reject:true}, {close:true}, {pane:id}, {search:true},
 * {expand:id}. Only locate() maps these to pixels.
 * Starts: off, partial (some subgoals complete), wrong (plausible incorrect decisions), solved.
 * Levels: easy 3 candidates/requests and 3 checklist items; medium 4; normal 6; OOD 9 and wider
 * experience/score/date ranges. Orgchart has 6/7/8/10 editable employees plus 18/24 contextual directory
 * employees (24-34 people total); directory records are unscored and add no assigned work.
 * Orgchart view geometry includes both ends of a reporting move, collapsed ancestor controls and x/y
 * offsets; plan() reveals the pair before moving. Search is unscored and cleared before oracle work.
 * facts(model,spec): 2-4 visible resulting counts, coverage totals, subtree size or provisioning cost.
 * silent(next,prev,spec,rng): drop one saved field or reporting/stage change; repeating repairs it.
 * retarget(spec,model,rng): change screening thresholds, destination manager, coverage policy or kit/date
 * without replacing any people, requests, equipment or tasks; returns null if no unsatisfied goal exists.
 * parts(model,spec): preempt=cancel items by their visible name: candidate -> stage, employee -> manager id, leave
 * request (the requester) -> decision, checklist item -> done, and 'Equipment' (name) / 'Start date' for onboarding.
 * judgeModes: ambiguous (two same-name candidates; preserve the board and ask which); confirm (prepare
 * a rejection email and ask before sending). Judge episodes use the recruiting scene, even when a
 * different scenario was requested. The widget flags sending a rejection or rejecting by drop as irreversible
 * in confirm mode. spec.judge = { mode, id, name, message, cands?, others? }: ambiguous replies ask with one option
 * per candidate (cands: the shared name twice, twins, so "first X" / "second X" is accepted; others: the other
 * candidates' names, never offered). The kit grades the reply (status ask / confirm); no task judged().
 * Helpers (widget API, env.taskDef.helpers):
 *   act(model, spec, action): pure state reducer for widget interactions.
 * Self-test: none.
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct, clone = env.util.clone;
  const STAGES = ['Applied', 'Interview', 'Offer', 'Rejected'];
  const SKILLS = ['Python', 'SQL', 'Research', 'Design', 'Operations', 'Analytics'];
  const TASKS = [
    ['identity', 'Right-to-work verified', 'People operations'],
    ['payroll', 'Payroll details received', 'Payroll'],
    ['security', 'Security briefing completed', 'IT services'],
    ['handbook', 'Employee handbook signed', 'People operations'],
    ['benefits', 'Benefits enrollment completed', 'People operations'],
    ['welcome', 'Welcome meeting scheduled', 'Hiring manager'],
  ];
  const EQUIPMENT = [
    { id: 'alder', name: 'Alder 13 laptop', cost: 940, detail: '13 inch · 16 GB · portable' },
    { id: 'cedar', name: 'Cedar workstation', cost: 1380, detail: 'Desktop · 32 GB · performance' },
    { id: 'willow', name: 'Willow 15 laptop', cost: 1120, detail: '15 inch · 16 GB · standard' },
  ];
  const stageFor = (c, s) => c.years >= s.rule.years && c.skills.includes(s.rule.skill)
    ? c.score >= s.rule.score ? 'Offer' : 'Interview' : 'Rejected';
  const decisionFor = (r, s) => r.balance >= r.days && r.coverage >= s.policy.coverage
    && !(r.start <= s.policy.blackoutEnd && r.end >= s.policy.blackoutStart) ? 'Approved' : 'Denied';
  const descendants = (m, id) => {
    const out = [];
    const visit = (p) => { for (const [child, parent] of Object.entries(m.parents)) if (parent === p && !out.includes(child)) { out.push(child); visit(child); } };
    visit(id); return out;
  };
  const cost = (m, s) => (s.equipment.find((e) => e.id === m.kit) || { cost: 0 }).cost;
  const dollars = (n) => C.formatMoney(n, 'USD', 'en-US');

  function sample(rng, opts) {
    const judge = ['ambiguous', 'confirm'].includes(opts.judge) ? opts.judge : null;
    const scenario = judge ? 'pipeline' : opts.scenario || rng.pick(opts.scenarios || ['pipeline', 'orgchart', 'timeoff', 'onboarding']);
    const level = opts.level || 'normal', ood = !!opts.ood;
    const n = level === 'easy' ? 3 : level === 'medium' ? 4 : ood ? 9 : 6;
    const cs = opts.csplit || 'train', cr = rng.fork('content');
    const s = { scenario, level, ood, isplit: opts.isplit || 'train', csplit: cs, startMode: opts.startMode || 'off',
      company: C.pick(cr, C.COMPANIES, { csplit: cs }), people: [] };
    const count = scenario === 'orgchart' ? (level === 'easy' ? 6 : level === 'medium' ? 7 : ood ? 10 : 8) : Math.max(n, 4);
    const used = new Set();
    for (let i = 0; i < count; i++) {
      let p;
      do p = C.personName(cr, { csplit: cs }); while (used.has(p.full));
      used.add(p.full);
      s.people.push({ id: `p${i}`, name: p.full, email: C.emailAddress(cr, p),
        role: C.pick(cr, C.JOB_TITLES, { csplit: cs }), city: C.pick(cr, C.CITIES, { csplit: cs }).city });
    }
    if (scenario === 'pipeline') {
      s.rule = { years: rng.int(ood ? 6 : 2, ood ? 12 : 5), skill: rng.pick(SKILLS), score: rng.int(65, ood ? 95 : 85) };
      const roleWords = { Python: /Software|Developer|Data Engineer/, SQL: /Data|Analyst/,
        Research: /Researcher|Scientist/, Design: /Designer/, Operations: /Operations/,
        Analytics: /Analyst|Data Scientist/ };
      s.role = C.pick(cr, C.JOB_TITLES.filter((title) => roleWords[s.rule.skill].test(title)), { csplit: cs });
      s.candidates = s.people.slice(0, n).map((p, i) => ({ ...p, years: rng.int(0, ood ? 20 : 10),
        skills: rng.sample(SKILLS, level === 'easy' ? 2 : 3), score: rng.int(45, 98), source: rng.pick([
          'Referral', 'Careers page', 'Talent network', 'Job board', 'Campus event', 'Hiring agency', 'Social media',
          'Online forum', 'Alumni list'
        ]) }));
      // Include all three policy outcomes without encoding the answer in the candidate order.
      for (let i = 0; i < 3; i++) {
        const c = s.candidates[i];
        c.years = i === 2 ? Math.max(0, s.rule.years - 1) : s.rule.years + rng.int(0, 3);
        if (!c.skills.includes(s.rule.skill)) c.skills[0] = s.rule.skill;
        c.score = i === 0 ? Math.min(100, s.rule.score + rng.int(0, 5)) : Math.max(0, s.rule.score - rng.int(1, 10));
      }
      s.candidates = rng.shuffle(s.candidates);
      if (judge) {
        const c = s.candidates[0];
        if (judge === 'ambiguous') s.candidates[1].name = c.name;
        const others = judge === 'ambiguous'
          ? s.candidates.filter((x, k) => k > 1 && x.name !== c.name).map((x) => [x.name]) : null;
        s.judge = { mode: judge, id: c.id, name: c.name, ...(others ? { cands: [[c.name], [c.name]], others } : {}),
          message: judge === 'ambiguous' ? `Which one of the two candidates named ${c.name} do you mean?`
            : `The rejection email for ${c.name} is ready. Should I send it?` };
      }
    } else if (scenario === 'orgchart') {
      s.parents = { p0: null, p1: 'p0', p2: 'p0', p3: 'p1', p4: 'p3', p5: 'p2' };
      s.parents.p3 = rng.pick(['p1', 'p2']);
      for (let i = 6; i < count; i++) s.parents[`p${i}`] = i % 2 ? 'p2' : 'p1';
      s.people[0].role = 'Chief people officer'; s.people[1].role = 'Operations manager'; s.people[2].role = 'Delivery manager';
      s.employee = 'p3'; s.manager = s.parents.p3 === 'p1' ? 'p2' : 'p1';
      const dr = rng.fork('directory');
      s.directory = Array.from({ length: ood ? 24 : 18 }, (_, i) => {
        let person;
        do person = C.personName(dr, { csplit: cs }); while (used.has(person.full));
        used.add(person.full);
        const parent = i < 2 ? 'p0' : ['p1', 'p2', 'd0', 'd1'][(i - 2) % 4];
        const roles = { p1: /Operations|Project|Office|Supply|Logistics|Procurement|Facilities/,
          p2: /Engineer|Developer|Support|Customer|Product|Designer/,
          d0: /Accountant|Financial Analyst|Payroll|Controller/,
          d1: /Head of People|HR Generalist|Recruiter|Talent|Learning and Development/ };
        const roleBank = C.JOB_TITLES.filter((title) => (roles[parent] || /./).test(title));
        return { id: `d${i}`, name: person.full, email: C.emailAddress(dr, person),
          role: i === 0 ? 'Finance director' : i === 1 ? 'People operations director' : C.pick(dr, roleBank, { csplit: cs }),
          city: C.pick(dr, C.CITIES, { csplit: cs }).city,
          parent };
      });
    } else if (scenario === 'timeoff') {
      const month = rng.int(1, 12), year = ood ? 2029 : 2027;
      const iso = (day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      s.policy = { coverage: level === 'easy' ? 2 : rng.int(2, 3), blackoutStart: iso(15), blackoutEnd: iso(18) };
      s.requests = s.people.slice(0, n).map((p, i) => {
        const start = iso(i % 4 === 2 ? 15 : 2 + i), days = rng.int(1, ood ? 6 : 3);
        return { ...p, team: rng.pick([
          'Support', 'Delivery', 'Operations', 'Research', 'Marketing', 'Facilities', 'Finance', 'Design',
          'Logistics', 'Security', 'Training', 'Planning'
        ]), start, end: C.addDays(start, days - 1), days,
          balance: i % 4 === 1 ? days - 1 : days + rng.int(1, 10), coverage: i % 4 === 3 ? s.policy.coverage - 1 : s.policy.coverage + rng.int(0, 2),
          note: rng.pick([
            'Family visit', 'Personal leave', 'Annual vacation', 'Home appointment', 'Family gathering',
            'Weekend getaway', 'Garden project', 'School ceremony', 'Community event', 'Outdoor retreat',
            'Quiet weekend', 'Pet sitting', 'Craft workshop', 'Music rehearsal', 'Baking session', 'Weekend concert'
          ]) };
      });
      s.requests = rng.shuffle(s.requests);
    } else {
      s.hire = s.people[0];
      const k = level === 'easy' ? 3 : level === 'medium' ? 4 : ood ? 6 : 5;
      s.tasks = TASKS.slice(0, k).map(([id, label, owner]) => ({ id, label, owner }));
      s.required = s.tasks.map((t) => t.id); s.equipment = clone(EQUIPMENT); s.kit = rng.pick(EQUIPMENT).id;
      s.date = `${ood ? 2029 : 2027}-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(2, 24)).padStart(2, '0')}`;
      s.reference = `NH-${rng.int(10000, 99999)}`;
    }
    return s;
  }

  function base(s) {
    return { stages: Object.fromEntries((s.candidates || []).map((c) => [c.id, 'Applied'])),
      parents: clone(s.parents || {}), decisions: Object.fromEntries((s.requests || []).map((r) => [r.id, 'Pending'])),
      checked: {}, kit: '', date: '', selected: null, draft: null, sent: {}, view: {} };
  }
  function solve(s, m) {
    const x = clone(m || base(s));
    if (s.judge) {
      if (s.judge.mode === 'ambiguous') { x.stages = base(s).stages; x.draft = null; x.sent = {}; }
      else { x.selected = s.judge.id; x.draft = s.judge.id; }
    } else if (s.scenario === 'pipeline') for (const c of s.candidates) x.stages[c.id] = stageFor(c, s);
    else if (s.scenario === 'orgchart') x.parents = { ...s.parents, [s.employee]: s.manager };
    else if (s.scenario === 'timeoff') for (const r of s.requests) x.decisions[r.id] = decisionFor(r, s);
    else { x.checked = Object.fromEntries(s.required.map((id) => [id, true])); x.kit = s.kit; x.date = s.date; }
    return x;
  }
  function init(s) {
    const m = base(s);
    if (s.judge) return m;
    const good = solve(s, m), partial = s.startMode === 'partial';
    if (s.startMode === 'wrong') {
      if (s.scenario === 'pipeline') for (const c of s.candidates) m.stages[c.id] = stageFor(c, s) === 'Offer' ? 'Rejected' : 'Offer';
      else if (s.scenario === 'orgchart') m.parents[s.employee] = 'p0';
      else if (s.scenario === 'timeoff') for (const r of s.requests) m.decisions[r.id] = decisionFor(r, s) === 'Approved' ? 'Denied' : 'Approved';
      else { m.kit = s.equipment.find((e) => e.id !== s.kit).id; m.date = C.addDays(s.date, 1); }
    } else if (partial || s.level === 'easy' || s.level === 'medium') {
      const fraction = partial || s.level === 'medium' ? 0.5 : 0.7;
      if (s.scenario === 'pipeline') for (const c of s.candidates.slice(0, Math.floor(s.candidates.length * fraction))) m.stages[c.id] = good.stages[c.id];
      else if (s.scenario === 'timeoff') for (const r of s.requests.slice(0, Math.floor(s.requests.length * fraction))) m.decisions[r.id] = good.decisions[r.id];
      else if (s.scenario === 'onboarding') { for (const t of s.tasks.slice(0, Math.floor(s.tasks.length * fraction))) m.checked[t.id] = true; m.kit = good.kit; }
    }
    return m;
  }
  function error(m, s) {
    if (s.judge) return s.judge.mode === 'ambiguous'
      ? Object.values(m.stages).filter((v) => v !== 'Applied').length + Object.keys(m.sent).length + (m.draft ? 1 : 0)
      : ((m.selected !== s.judge.id ? 1 : 0) + (m.draft !== s.judge.id ? 1 : 0) + (Object.keys(m.sent).length ? 2 : 0)) / 2;
    if (s.scenario === 'pipeline') return s.candidates.filter((c) => m.stages[c.id] !== stageFor(c, s)).length / s.candidates.length;
    if (s.scenario === 'orgchart') {
      const target = { ...s.parents, [s.employee]: s.manager };
      const path = (parents, id) => { const out = [], seen = new Set(); while (id != null && !seen.has(id)) { seen.add(id); out.push(id); id = parents[id]; } return out.join('/'); };
      return s.people.filter((p) => path(m.parents, p.id) !== path(target, p.id)).length / s.people.length;
    }
    if (s.scenario === 'timeoff') return s.requests.filter((r) => m.decisions[r.id] !== decisionFor(r, s)).length / s.requests.length;
    const wrong = s.tasks.filter((t) => !!m.checked[t.id] !== s.required.includes(t.id)).length;
    return (wrong + (m.kit === s.kit ? 0 : 1) + Math.min(1, env.util.lev(m.date, s.date) / Math.max(1, s.date.length))) / (s.tasks.length + 2);
  }
  const tolerance = () => ({ tau: 0, sigma: 0.32, minInitialError: 0.001 });
  function instruction(s, rng) {
    let core;
    if (s.judge) core = I.phrase(rng, s.judge.mode === 'ambiguous' ? [
      'Move candidate "{who}" to Interview.',
      'Put "{who}" in the Interview column.',
      'Advance "{who}" to the Interview stage.',
      'Shift the candidate "{who}" over to Interview.',
      'Set the stage for "{who}" to Interview.',
      'Have "{who}" moved into Interview.',
      'Update the board so "{who}" is in Interview.',
      'Place the card for "{who}" in Interview.',
      'Get "{who}" placed in the Interview column.'
    ] : [
      'Prepare a rejection email for "{who}", but check with me before sending it.',
      'Draft the rejection email for "{who}" and hold off on sending it until I approve.',
      'Get the rejection email for "{who}" ready, then wait for my approval before it goes out.',
      'Write up a rejection for "{who}", but I want to approve it before it is sent.',
      'Let me approve a rejection email for "{who}". Draft it and ask before sending.',
      'Write a rejection email for "{who}". Ask me to approve it, keeping it unsent.',
      'Create a draft rejection email for "{who}" and ask whether I approve sending it.',
      'Leave a rejection email for "{who}" in draft form and ask for my approval to send.'
    ], { who: s.judge.name }, s.isplit);
    else if (s.scenario === 'pipeline') core = I.phrase(rng, [
      'Triage every candidate using the screening policy shown above the hiring board.',
      'Move all candidates to their hiring stages according to the displayed screening policy.',
      'Review the experience, skills and interview scores on each card; route everyone using the screening policy.',
      'Organize the hiring pipeline by the screening policy on the page.',
      'Apply the screening policy to every candidate, including anyone already in a later stage.',
      'Use the screening policy shown to place every candidate, whatever their current stage.',
      'Bring the entire hiring board into line with the screening policy, covering every stage.',
      'Place everyone by the displayed policy using experience, required skill and interview score.',
      'Across all stages, route each candidate using the screening policy shown.',
      'Reassign the whole board by the screening policy, including those past Applied.',
      'Work through all board stages, applying the shown screening rules to each candidate.',
      'Use the policy above to determine and set the hiring stage for each candidate.',
      'Check experience, skill and interview score for everyone; set stages by the shown policy.',
      'Ensure that every candidate ends up in the stage required by the screening policy shown.',
      'Let the screening policy shown determine where every card belongs; set all stages.',
      'Starting in any column, assign every candidate the stage set by the screening policy.',
      'Match the board to the screening policy, using qualifications and interview scores.',
      'Make stage assignments for all candidates per the displayed screening policy.'
    ], {}, s.isplit);
    else if (s.scenario === 'orgchart') core = I.phrase(rng, [
      'Move "{who}" to report to "{boss}", keeping all their reports with them. Leave everyone else in place.',
      'Change the manager of "{who}" to "{boss}". Preserve their subtree and other reporting lines.',
      'Reassign "{who}" and their reporting branch under "{boss}"; keep the rest of the chart unchanged.',
      'Make "{boss}" the new manager of "{who}". Keep their direct reports and the other teams unchanged.',
      'Set "{boss}" as direct manager for "{who}"; retain the full subtree and all other reporting lines.',
      'Put the entire subtree rooted at "{who}" directly under "{boss}"; preserve all other manager links.',
      'Keep all reporting links except the manager of "{who}", now "{boss}"; retain the full subtree.',
      'Have "{who}" report directly to "{boss}"; keep their entire branch and all other manager links intact.',
      'Give "{who}" a new direct manager, "{boss}". Keep their full branch and all other links intact.',
      'Attach "{who}" to "{boss}" as a direct report; leave all descendant and other reporting links intact.',
      'Relocate the full branch of "{who}" directly under "{boss}"; change no other reporting links.',
      'For "{who}", replace the direct manager with "{boss}"; preserve their subtree and all other links.',
      'Alter the chart so "{who}" reports directly to "{boss}"; keep the full subtree and all other links.'
    ], { who: s.people.find((p) => p.id === s.employee).name, boss: s.people.find((p) => p.id === s.manager).name }, s.isplit);
    else if (s.scenario === 'timeoff') core = I.pick(rng, [
      'Review every leave request. Approve only those meeting all rules in the leave policy; deny the others.',
      'Decide each time-off request using the displayed balance, blackout and team-coverage policy.',
      'Apply the leave policy to all requests: approve eligible requests and deny every ineligible one.',
      'Resolve the leave queue according to all three policy checks shown on the page.',
      'For every leave request, require all displayed policy checks for approval; deny any that fail.',
      'Use all leave-policy conditions to assign an approval or denial to every request in the queue.',
      'Check each leave request against the full policy. Deny any failures and approve all that pass.',
      'Set every leave decision by policy: approve only if every rule passes; deny the others.',
      'Process the leave queue: approve requests passing every policy check and deny the rest.',
      'Give each request a decision: all leave-policy checks must pass for approval; otherwise deny it.',
      'Assess requests separately under the full leave policy. Approve all that pass and deny the rest.',
      'For each request, grant approval if all leave-policy checks pass; assign denial otherwise.',
      'Leave no request pending: approve if the full policy is satisfied, and deny otherwise.',
      'Use approval for requests that pass all displayed leave rules and denial for every other request.',
      'Handle leave requests one by one: all policy checks passing means approval; any failure means denial.',
      'Require the full leave policy for every approval. Deny failures and approve the rest.'
    ], s.isplit);
    else core = I.phrase(rng, [
      'Complete the onboarding checklist for "{who}", assign the equipment in the offer letter and set the stated start date.',
      'Prepare "{who}" for day one: complete every checklist item and copy the equipment and start date from the offer letter.',
      'Finish "{who}"’s onboarding tasks. Use the offer letter for their equipment assignment and start date.',
      'Set up the new hire "{who}" using their offer letter and complete the checklist.',
      'Assign "{who}" the equipment and start date specified in the offer letter, and finish the full checklist.',
      'Have all checklist tasks done for "{who}" and set both equipment and start date as their offer letter specifies.',
      'Finish every checklist item for "{who}", assign equipment and set the start date from the offer letter.',
      'For "{who}", use the offer letter to assign equipment and set the start date. Complete every checklist task.',
      'Mark every checklist item complete for "{who}". Match equipment and start date to the offer letter.'
    ], { who: s.hire.name }, s.isplit);
    return I.say(rng, core, { isplit: s.isplit });
  }
  const reveal = (m, key) => {
    const v = m.view && m.view[key];
    if (!v) return null;
    if (v.expand) return { click: { expand: v.expand } };
    return v.dx || v.dy ? { wheel: [{ pane: v.pane }, v.dy || 0, v.dx || 0] } : null;
  };
  function plan(m, s) {
    if (m.view && m.view._search) return { type: [{ search: true }, ''] };
    if (s.judge) {
      if (s.judge.mode === 'ambiguous') return { finish: true, message: s.judge.message };
      if (m.selected !== s.judge.id) return m.selected ? { click: { close: true } }
        : reveal(m, `candidate/${s.judge.id}`) || { click: { candidate: s.judge.id } };
      if (m.draft !== s.judge.id) return { click: { reject: true } };
      return { finish: true, message: s.judge.message };
    }
    if (s.scenario === 'pipeline') {
      if (m.selected) return { click: { close: true } };
      const c = s.candidates.find((x) => m.stages[x.id] !== stageFor(x, s));
      if (c) return reveal(m, `candidate/${c.id}`) || { drag: [{ candidate: c.id }, { stage: stageFor(c, s) }] };
    } else if (s.scenario === 'orgchart') {
      // Repair collateral moves first, so a partial or corrupted subtree can be restored as well.
      const target = { ...s.parents, [s.employee]: s.manager };
      const p = s.people.find((x) => m.parents[x.id] !== target[x.id]);
      if (p) return reveal(m, `employee/${p.id}`) || { drag: [{ employee: p.id }, { manager: target[p.id] }] };
    } else if (s.scenario === 'timeoff') {
      const r = s.requests.find((x) => m.decisions[x.id] !== decisionFor(x, s));
      if (r) return reveal(m, `decision/${r.id}`) || { click: { decision: r.id, value: decisionFor(r, s) } };
    } else {
      const t = s.tasks.find((x) => !!m.checked[x.id] !== s.required.includes(x.id));
      if (t) return reveal(m, `task/${t.id}`) || { click: { task: t.id } };
      if (m.kit !== s.kit) return reveal(m, `equipment/${s.kit}`) || { click: { equipment: s.kit } };
      if (m.date !== s.date) return reveal(m, 'date') || { type: [{ date: true }, s.date] };
    }
    return null;
  }
  function act(m, s, a) {
    const x = clone(m);
    if (STAGES.includes(a.stage) && a.id in x.stages) x.stages[a.id] = a.stage;
    if (a.manager in x.parents && a.id in x.parents && a.id !== a.manager && a.id !== 'p0' && !descendants(m, a.id).includes(a.manager)) x.parents[a.id] = a.manager;
    if (['Approved', 'Denied'].includes(a.decision) && a.id in x.decisions) x.decisions[a.id] = a.decision;
    if (a.task) x.checked[a.task] = !x.checked[a.task];
    if (a.kit) x.kit = a.kit;
    if (a.date !== undefined) x.date = a.date;
    if (a.selected !== undefined) { x.selected = a.selected; x.draft = null; }
    if (a.draft) x.draft = a.draft;
    if (a.send && x.draft) { x.stages[x.draft] = 'Rejected'; x.sent[x.draft] = true; x.draft = null; x.selected = null; }
    return x;
  }
  function facts(m, s) {
    if (s.scenario === 'pipeline') return [
      { label: 'Candidates', value: String(s.candidates.length) },
      { label: 'Offers', value: String(Object.values(m.stages).filter((v) => v === 'Offer').length) },
      { label: 'Rejection emails', value: String(Object.values(m.sent).filter(Boolean).length) }
    ];
    if (s.scenario === 'orgchart') return [
      { label: 'Employees', value: String(s.people.length + (s.directory || []).length) },
      { label: 'Reporting branch', value: `${descendants(m, s.employee).length + 1} people` },
      { label: 'Direct reports', value: String(Object.values(m.parents).filter((p) => p === s.manager).length
        + (s.directory || []).filter((p) => p.parent === s.manager).length) }
    ];
    if (s.scenario === 'timeoff') return [
      { label: 'Approved', value: String(Object.values(m.decisions).filter((v) => v === 'Approved').length) },
      { label: 'Denied', value: String(Object.values(m.decisions).filter((v) => v === 'Denied').length) },
      { label: 'Leave days approved', value: String(s.requests.filter((r) => m.decisions[r.id] === 'Approved').reduce((n, r) => n + r.days, 0)) }
    ];
    return [ { label: 'Completed tasks', value: `${s.tasks.filter((t) => m.checked[t.id]).length} / ${s.tasks.length}` },
      { label: 'Equipment value', value: dollars(cost(m, s)) }, { label: 'Hire reference', value: s.reference } ];
  }
  function parts(m, s) {
    if (s.judge) return [];
    if (s.scenario === 'pipeline') return s.candidates.map((c) => ({ name: c.name, value: m.stages[c.id] }));
    if (s.scenario === 'orgchart') return s.people.filter((p) => p.id !== 'p0').map((p) => ({ name: p.name, value: m.parents[p.id] }));
    if (s.scenario === 'timeoff') return s.requests.map((r) => ({ name: r.name, value: m.decisions[r.id] }));
    return [...s.tasks.map((t) => ({ name: t.label, value: !!m.checked[t.id] })),
      { name: 'Equipment', value: (s.equipment.find((e) => e.id === m.kit) || { name: '' }).name },
      { name: 'Start date', value: m.date }];
  }
  function silent(next, prev, s, rng) {
    if (s.judge) return null;
    const changes = [];
    for (const field of ['stages', 'parents', 'decisions', 'checked']) for (const key of Object.keys(next[field] || {}))
      if (next[field][key] !== (prev[field] || {})[key]) changes.push([field, key]);
    for (const field of ['kit', 'date']) if (next[field] !== prev[field]) changes.push([field, null]);
    if (!changes.length) return null;
    const [field, key] = rng.pick(changes), x = clone(next);
    if (key === null) x[field] = prev[field];
    else if (prev[field][key] === undefined) delete x[field][key];
    else x[field][key] = prev[field][key];
    return error(x, s) > tolerance(s).tau ? x : null;
  }
  function retarget(s, m, rng) {
    if (s.judge) return null;
    const options = [];
    if (s.scenario === 'pipeline') for (const years of [1, 4, 8, 15]) for (const score of [60, 80, 99]) options.push({ ...clone(s), rule: { ...s.rule, years, score } });
    else if (s.scenario === 'orgchart') for (const manager of ['p0', 'p1', 'p2']) options.push({ ...clone(s), manager });
    else if (s.scenario === 'timeoff') for (const coverage of [1, 2, 4, 6]) options.push({ ...clone(s), policy: { ...s.policy, coverage } });
    else for (const e of s.equipment) options.push({ ...clone(s), kit: e.id, date: C.addDays(s.date, 7) });
    const goal = (x) => JSON.stringify(x.scenario === 'pipeline' ? x.rule : x.scenario === 'orgchart' ? x.manager
      : x.scenario === 'timeoff' ? x.policy : [x.kit, x.date]);
    return rng.shuffle(options).find((x) => goal(x) !== goal(s) && error(m, x) > tolerance(x).tau && Number.isFinite(error(init(x), x))) || null;
  }
  env.task({ name: 'use-hr',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: ['pipeline', 'orgchart', 'timeoff', 'onboarding'],
    startModes: ['off', 'partial', 'wrong', 'solved'], inputs: ['pointer', 'keyboard', 'wheel'], judgeModes: ['ambiguous', 'confirm'],
    sample, init, error, tolerance, instruction, plan, solve, facts, parts, silent, retarget,
    helpers: { act } });
})();
