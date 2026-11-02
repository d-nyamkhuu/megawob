/*
 * use-accounting: reconcile bank lines, post journals, file expenses and route approvals in an accounting app.
 * A fictional accounting workspace, akin to a bank-feed reconciler,
 * general ledger, receipt expense tool and accounts-payable approval desk.
 * Scenarios: reconcile (drag exact date/payee/amount matches; leave unmatched lines),
 * journal (account pickers, balanced debit/credit lines and memo, then post),
 * expense (copy receipt date/merchant/category/amount/project, then file),
 * approve (ordered approval route determined by a visible threshold policy).
 *
 * spec: {scenario,level,ood,startMode,isplit,csplit,company,ref,accounts,projects,
 * bank,ledger,receipts,voucher,invoices,staff,policy,goal,judge?}.
 * All monetary data are integer cents. goal: matches {bankId:ledgerId|null},
 * journal {rows:[{account,debit,credit}],memo}, expense {project:null|code},
 * approve {invoice:id}. Sources are always visible in the workspace.
 * model: {matches,rows,memo,selected,active,final,open,notice,view}.
 * rows hold editable strings; selected is an ordered staff-id array. active is the
 * receipt/invoice index; final records an in-app save/post/file/approval (never ends
 * the episode). view mirrors inner pane geometry, ignored by scoring.
 * Start modes: off, partial, wrong, solved. Easy/medium reduce line counts;
 * ood adds lines, larger values, and tighter look-alikes. Error grades each match
 * or each editable field, plus a final-operation subgoal; journal also grades balance.
 * Targets: {bank:id}, {ledger:id}, {unlink:id}, {field:[row,key]}, {memo:true},
 * {pick:[row,key]}, {option:value}, {receipt:index}, {invoice:index}, {person:id},
 * {remove:index}, {commit:true}, {pane:name}, {thumb:name}, {thumbAt:[name,px]}.
 * Helpers (widget API, env.taskDef.helpers):
 * money(cents): format a USD amount for display.
 * cents(value): parse an editable decimal amount into integer cents.
 * totals(model,spec): visible debit/credit, expense total or reconciliation balance.
 * status(model,spec): visible draft/final workflow status.
 * apply(model,spec,action): pure model transition for workspace interactions.
 * facts(model,spec): visible balance, counts, totals and resulting workflow status.
 * silent(next,prev,spec,rng): round a saved amount or drop one match/approver;
 * a repeated edit repairs it. Never mutates inputs, never returns a solved state.
 * retarget(spec,model,rng): leave one bank item unmatched, reverse the journal,
 * override the expense project, or route another existing invoice in the same scene.
 * judgeModes confirm: prepare without posting/approving (or filing/reconciling),
 * then ask; widget flags irreversible. impossible: unavailable required account makes
 * the journal unpostable; other scenarios have a missing match/project/authority.
 * Impossible starts untouched within tau; the reply must be status impossible naming what is missing (spec.judge.what:
 * the locked Accounts payable account, the bank line with no exact ledger entry, project PRJ-999, the unavailable
 * Finance director) and the data stay untouched (judged() checks the model only). confirm: status confirm.
 * parts(model,spec): preempt=cancel; reconcile each bank line by id (value: its ledger match), journal each line and
 * the memo, expense each receipt's fields, approve the invoice and the approvers.
 * Local fictional data supplies chart of accounts, projects and policy roles;
 * people, merchants, places and finance prose come from env.content banks.
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct, { clone, lev } = env.util;
  const SCENARIOS = ['reconcile', 'journal', 'expense', 'approve'];
  const ACCOUNTS = ['6100 · Office supplies', '6200 · Travel', '6300 · Software', '6400 · Professional services', '1000 · Operating cash', '2000 · Accounts payable'];
  const CATEGORIES = ['Office supplies', 'Travel', 'Software', 'Professional services'];
  const PROJECTS = ['PRJ-104', 'PRJ-208', 'PRJ-316'];
  const money = n => C.formatMoney(n / 100, 'USD', 'en-US');
  const cents = v => /^\d+(\.\d{0,2})?$/.test(String(v).trim()) ? Math.round(Number(v) * 100) : NaN;
  const decimal = n => (n / 100).toFixed(2);
  const norm = v => String(v || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const textError = (a, b) => norm(a) === norm(b) ? 0 : Math.max(0.15, lev(norm(a), norm(b)) / Math.max(1, norm(b).length, norm(a).length));
  const numError = (a, b) => cents(a) === b ? 0 : !Number.isFinite(cents(a)) ? 1 : Math.min(1, Math.max(.15, Math.abs(cents(a) - b) / Math.max(100, b)));

  function expectedRows(s) {
    if (s.scenario === 'journal') return s.goal.rows.map(r => ({ account: r.account, debit: decimal(r.debit), credit: decimal(r.credit) }));
    if (s.scenario === 'expense') return s.receipts.map(r => ({ date: r.date, merchant: r.merchant, category: r.category, amount: decimal(r.amount), project: s.goal.project || r.project }));
    return [];
  }
  function approvalRoute(s, invoice) {
    const inv = s.invoices.find(r => r.id === (invoice || s.goal.invoice));
    return s.staff.filter(p => p.role === 'Budget owner' || (p.role === 'Controller' && inv.amount >= s.policy.controller) || (p.role === 'Finance director' && inv.amount >= s.policy.director)).map(p => p.id);
  }
  function totals(m, s) {
    if (s.scenario === 'journal') return { debit: m.rows.reduce((a, r) => a + (cents(r.debit) || 0), 0), credit: m.rows.reduce((a, r) => a + (cents(r.credit) || 0), 0) };
    if (s.scenario === 'expense') return { total: m.rows.reduce((a, r) => a + (cents(r.amount) || 0), 0) };
    const matched = s.bank.filter(r => m.matches[r.id]);
    return { count: matched.length, balance: s.opening - matched.reduce((a, r) => a + r.amount, 0) };
  }
  function bodyError(m, s) {
    if (s.scenario === 'reconcile') return s.bank.reduce((a, r) => a + ((m.matches[r.id] || null) === s.goal.matches[r.id] ? 0 : 1), 0);
    if (s.scenario === 'approve') {
      const route = approvalRoute(s);
      return (s.invoices[m.active].id === s.goal.invoice ? 0 : 1) + Array.from({ length: Math.max(route.length, m.selected.length) }, (_, i) => route[i] === m.selected[i] ? 0 : 1).reduce((a, b) => a + b, 0);
    }
    const wanted = expectedRows(s);
    let e = wanted.reduce((sum, row, i) => sum + Object.keys(row).reduce((a, k) => a + (['debit', 'credit', 'amount'].includes(k) ? numError(m.rows[i][k], cents(row[k])) : textError(m.rows[i][k], row[k])), 0), 0);
    if (s.scenario === 'journal') { const t = totals(m, s); e += textError(m.memo, s.goal.memo) + (t.debit === t.credit && t.debit > 0 ? 0 : 1); }
    return e;
  }
  const units = s => s.scenario === 'reconcile' ? s.bank.length : s.scenario === 'approve' ? approvalRoute(s).length + 1 : expectedRows(s).length * (s.scenario === 'journal' ? 3 : 5) + (s.scenario === 'journal' ? 2 : 0);
  function errorOf(m, s) {
    if (s.judge && s.judge.mode === 'impossible') return JSON.stringify(payload(m)) === JSON.stringify(payload(blank(s))) ? 0 : 1;
    return (bodyError(m, s) + (s.judge && s.judge.mode === 'confirm' ? (m.final ? 1 : 0) : m.final ? 0 : 1)) / (units(s) + 1);
  }
  const payload = m => ({ matches: m.matches, rows: m.rows, memo: m.memo, selected: m.selected, active: m.active, final: m.final });
  function blank(s) {
    return { matches: {}, rows: expectedRows(s).map(r => Object.fromEntries(Object.keys(r).map(k => [k, s.scenario === 'expense' && k === 'category' ? CATEGORIES[0] : s.scenario === 'expense' && k === 'project' ? PROJECTS[0] : '']))), memo: '', selected: [], active: 0, final: false, open: null, notice: '', view: {} };
  }
  function solveOf(s, model) {
    if (s.judge && s.judge.mode === 'impossible') return blank(s);
    const m = { ...blank(s), ...(model ? clone(model) : {}), open: null, notice: '' };
    m.matches = Object.fromEntries(Object.entries(s.goal.matches || {}).filter(([, v]) => v));
    m.rows = expectedRows(s); m.memo = s.goal.memo || '';
    m.active = s.scenario === 'approve' ? s.invoices.findIndex(r => r.id === s.goal.invoice) : 0;
    m.selected = s.scenario === 'approve' ? approvalRoute(s) : [];
    m.final = !(s.judge && s.judge.mode === 'confirm');
    return m;
  }
  function initOf(s) {
    let m = blank(s);
    if (s.judge && s.judge.mode === 'impossible') return m;
    if (s.startMode === 'solved') return solveOf(s, m);
    if (s.startMode === 'partial') {
      const good = solveOf(s, m);
      if (s.scenario === 'reconcile') { const k = Object.keys(good.matches)[0]; m.matches[k] = good.matches[k]; }
      else if (s.scenario === 'approve') { m.active = good.active; m.selected = good.selected.slice(0, 1); }
      else m.rows[0] = good.rows[0];
    }
    if (s.startMode === 'wrong') {
      m = solveOf(s, m); m.final = false;
      if (s.scenario === 'reconcile') m.matches[s.bank[0].id] = s.ledger.find(r => r.id !== s.goal.matches[s.bank[0].id]).id;
      else if (s.scenario === 'approve') m.selected = [s.staff[s.staff.length - 1].id];
      else if (s.scenario === 'journal') { m.rows[0].debit = decimal(s.goal.rows[0].debit + 100); m.rows[0].account = s.accounts[1]; }
      else m.rows.forEach(r => { r.project = s.projects.find(p => p !== r.project); r.amount = decimal(cents(r.amount) + 100); });
    }
    if (s.judge && s.judge.mode === 'confirm' && bodyError(m, s) === 0) {
      if (s.scenario === 'approve') m.selected = [];
      else if (s.scenario === 'reconcile') m.matches = {};
      else m.rows[0] = blank(s).rows[0];
    }
    return m;
  }
  function ready(m, s) {
    if (s.judge && s.judge.mode === 'impossible') return false;
    if (s.scenario === 'journal') {
      const t = totals(m, s);
      return t.debit > 0 && t.debit === t.credit && !!m.memo.trim() && m.rows.every(r => s.accounts.includes(r.account) && !s.disabled.includes(r.account) && Number.isFinite(cents(r.debit)) && Number.isFinite(cents(r.credit)) && ((cents(r.debit) > 0) !== (cents(r.credit) > 0)));
    }
    if (s.scenario === 'expense') return m.rows.every(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.merchant.trim() && s.categories.includes(r.category) && s.projects.includes(r.project) && cents(r.amount) > 0);
    if (s.scenario === 'approve') return m.selected.length > 0;
    return Object.values(m.matches).filter(Boolean).length > 0;
  }
  function apply(m, s, action) {
    const n = clone(m); n.notice = '';
    if (action.field) { const [i, key] = action.field; n.rows[i][key] = action.value; n.final = false; }
    if (action.memo !== undefined) { n.memo = action.memo; n.final = false; }
    if (action.match) {
      const [bank, ledger] = action.match;
      for (const id of Object.keys(n.matches)) if (n.matches[id] === ledger) delete n.matches[id];
      n.matches[bank] = ledger; n.final = false;
    }
    if (action.unlink) { delete n.matches[action.unlink]; n.final = false; }
    if (action.person) { if (!n.selected.includes(action.person)) n.selected.push(action.person); n.final = false; }
    if (action.remove !== undefined) { n.selected.splice(action.remove, 1); n.final = false; }
    if (action.active !== undefined) { n.active = action.active; n.open = null; if (s.scenario === 'approve') { n.selected = []; n.final = false; } }
    if (action.open !== undefined) n.open = action.open;
    if (action.commit) { n.final = ready(n, s); n.notice = n.final ? 'Saved to the activity log' : 'Review required: complete the fields and balance the entry.'; }
    return n;
  }
  function seek(m, s, pane, key) {
    const v = m.view[pane], p = v && v.pos[key];
    if (!v || !p || (p[0] >= v.top - .5 && p[1] <= v.top + v.height + .5)) return null;
    const to = Math.max(0, Math.min(v.max, (p[0] + p[1] - v.height) / 2));
    return s.route === 'wheel' ? { wheel: [{ pane }, to - v.top] } : { drag: [{ thumb: pane }, { thumbAt: [pane, to] }] };
  }
  function plan(m, s) {
    if (s.judge && s.judge.mode === 'impossible') return { finish: true, message: s.judge.message };
    if (s.scenario === 'reconcile') {
      for (const r of s.bank) if ((m.matches[r.id] || null) !== s.goal.matches[r.id]) {
        const wanted = s.goal.matches[r.id];
        const scroll = seek(m, s, 'bank', r.id) || (wanted && seek(m, s, 'ledger', wanted));
        if (scroll) return scroll;
        return wanted ? { drag: [{ bank: r.id }, { ledger: wanted }] } : { click: { unlink: r.id } };
      }
    } else if (s.scenario === 'approve') {
      const idx = s.invoices.findIndex(r => r.id === s.goal.invoice);
      if (m.active !== idx) return seek(m, s, 'source', 'invoice:' + idx) || { click: { invoice: idx } };
      const route = approvalRoute(s);
      const bad = m.selected.findIndex((id, i) => id !== route[i]);
      if (bad >= 0) return { click: { remove: bad } };
      if (m.selected.length < route.length) return seek(m, s, 'editor', route[m.selected.length]) || { click: { person: route[m.selected.length] } };
    } else {
      const wanted = expectedRows(s);
      for (let i = 0; i < wanted.length; i++) for (const key of Object.keys(wanted[i])) {
        if ((['amount', 'debit', 'credit'].includes(key) ? cents(m.rows[i][key]) === cents(wanted[i][key]) : norm(m.rows[i][key]) === norm(wanted[i][key]))) continue;
        if (s.scenario === 'expense' && m.active !== i) return { click: { receipt: i } };
        const scroll = seek(m, s, 'editor', s.scenario === 'expense' ? i + ':' + key : String(i)); if (scroll) return scroll;
        if (['account', 'category', 'project'].includes(key)) {
          if (!m.open || m.open[0] !== i || m.open[1] !== key) return { click: { pick: [i, key] } };
          return { click: { option: wanted[i][key] } };
        }
        return { type: [{ field: [i, key] }, wanted[i][key]] };
      }
      if (s.scenario === 'journal' && norm(m.memo) !== norm(s.goal.memo)) return seek(m, s, 'editor', 'memo') || { type: [{ memo: true }, s.goal.memo] };
    }
    if (!m.final && !(s.judge && s.judge.mode === 'confirm')) return { click: { commit: true } };
    return null;
  }
  const status = (m, s) => m.final ? ({ reconcile: 'Reconciled', journal: 'Posted', expense: 'Filed', approve: 'Approved for payment' }[s.scenario]) : s.scenario === 'journal' && totals(m, s).debit !== totals(m, s).credit ? 'Out of balance' : 'Draft';

  env.task({
    name: 'use-accounting', reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: SCENARIOS, startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'keyboard', 'wheel'], judgeModes: ['confirm', 'impossible'],
    helpers: { money, cents, totals, status, apply },
    sample(rng, opts) {
      const cr = rng.fork('content'), cs = { csplit: opts.csplit };
      const n = opts.level === 'easy' ? 2 : opts.level === 'medium' ? 3 : opts.ood ? 5 : 4;
      const s = { scenario: opts.scenario || rng.pick(opts.scenarios || SCENARIOS), level: opts.level || 'normal', ood: !!opts.ood,
        startMode: opts.startMode || 'off', isplit: opts.isplit, csplit: opts.csplit,
        company: C.pick(cr, C.COMPANIES, cs), ref: 'FN-' + C.digits(cr, 5),
        accounts: ACCOUNTS.slice(), disabled: [], categories: CATEGORIES.slice(), projects: PROJECTS.slice(),
        route: opts.route === 'wheel' ? 'wheel' : opts.route === 'pointer' ? 'thumb' : rng.pick(['wheel', 'thumb']),
        note: C.pick(cr, C.SENTENCE_GROUPS.finance, cs), opening: rng.int(20000, 60000) * 100,
        bank: [], ledger: [], receipts: [], invoices: [], staff: [], policy: { controller: 100000, director: 500000 }, goal: {} };
      const base = rng.int(opts.ood ? 10000 : 30, opts.ood ? 60000 : 900) * 100 + rng.int(11, 89);
      for (let i = 0; i < n; i++) {
        const merchant = C.pick(cr, C.COMPANIES, cs), date = '2026-09-' + String(10 + i * 2).padStart(2, '0');
        const amount = base + i * 100 + (i % 2 ? 1 : 0);
        s.bank.push({ id: 'B' + (i + 1), merchant, date, amount });
        s.ledger.push({ id: 'L' + (i + 1), merchant, date, amount });
        s.receipts.push({ id: 'R' + (i + 1), merchant, date, amount, category: CATEGORIES[i % 4], project: PROJECTS[i % 3], city: C.pick(cr, C.CITIES, cs).city });
      }
      s.bank.push({ ...s.bank[0], id: 'B' + (n + 1), amount: base + 2 });
      s.ledger.push({ ...s.ledger[0], id: 'L' + (n + 1), date: '2026-09-11' });
      if (opts.level !== 'easy') { s.bank.push({ ...s.bank[0], id: 'B' + (n + 2), date: '2026-09-09' }); s.ledger.push({ ...s.ledger[0], id: 'L' + (n + 2), merchant: s.ledger[0].merchant + ' Services' }); }
      s.goal.matches = Object.fromEntries(s.bank.map((r, i) => [r.id, i < n ? 'L' + (i + 1) : null]));
      s.ledger = rng.shuffle(s.ledger);
      const lines = Math.min(n, 4) - 1;
      s.voucher = { memo: 'September accrual / ' + s.ref, rows: Array.from({ length: lines }, (_, i) => ({ account: ACCOUNTS[i], debit: base + i * 101, credit: 0 })) };
      s.voucher.rows.push({ account: ACCOUNTS[5], debit: 0, credit: s.voucher.rows.reduce((a, r) => a + r.debit, 0) });
      s.goal.rows = clone(s.voucher.rows); s.goal.memo = s.voucher.memo; s.goal.project = null;
      const names = new Set();
      for (const [i, role] of ['Budget owner', 'Controller', 'Finance director', 'AP assistant'].entries()) {
        let name = C.personName(cr, cs).full; if (names.has(name)) name += ' ' + (i + 1); names.add(name);
        s.staff.push({ id: 'P' + i, name, role, available: true });
      }
      s.invoices = [99999, 100000, 500000].map((amount, i) => ({ id: 'INV-' + C.digits(cr, 4) + '-' + (i + 1), merchant: s.receipts[i % n].merchant, amount: amount + (opts.ood ? 200000 : 0), due: '2026-10-' + (12 + i) }));
      s.goal.invoice = rng.pick(s.invoices).id;
      if (opts.judge === 'confirm') s.judge = { mode: 'confirm', message: `The ${s.ref} draft is ready. Should I ${s.scenario === 'journal' ? 'post the journal' : s.scenario === 'approve' ? 'approve payment' : 'save this accounting record'}?` };
      if (opts.judge === 'impossible') {
        s.disabled = [ACCOUNTS[5]]; s.staff[2].available = false;
        s.blocked = { journal: 'The required Accounts payable account is locked for this period; the source entry cannot balance using the available accounts.', reconcile: 'The requested statement line has no exact ledger counterpart.', expense: 'The required project PRJ-999 is not available in the project picker.', approve: 'The Finance director is unavailable and this invoice requires director authority.' }[s.scenario];
        if (s.scenario === 'expense') s.goal.project = 'PRJ-999';
        if (s.scenario === 'approve') s.goal.invoice = s.invoices[2].id;
        const what = { journal: ['Accounts payable', ACCOUNTS[5], '2000'], reconcile: [s.bank[s.bank.length - 1].id], expense: ['PRJ-999'], approve: [s.staff[2].name, 'Finance director'] }[s.scenario];
        s.judge = { mode: 'impossible', what, message: `I cannot complete ${s.ref}: ${s.blocked}` };
      }
      return s;
    },
    init: initOf, solve: solveOf, error: errorOf,
    tolerance: () => ({ tau: 0, sigma: .3, minInitialError: .01 }),
    plan,
    instruction(s, rng) {
      let core;
      if (s.scenario === 'reconcile') {
        core = I.pick(rng, [
          'Reconcile the operating account against the ledger, using exact dates, payees and amounts.',
          'Match the bank statement to the ledger; the date, payee and amount must all agree.',
          'Reconcile the operating account, matching payee, date and amount exactly.',
          'Use date, payee and amount to pair operating bank lines with exact ledger matches.',
          'Reconcile operating bank lines where ledger dates, payees and amounts are equal.'
        ], s.isplit);
        core += ' Leave unmatched lines in the bank feed.' + (s.goal.omit ? ` Also leave ${s.goal.omit} unreconciled.` : '') + ' Save the reconciliation.';
      } else if (s.scenario === 'journal') {
        core = I.pick(rng, [
          'Post the journal from the source voucher, including its memo.',
          'Create and post a balanced journal entry from the voucher shown.',
          'Enter the voucher account by account, copy its memo and post the entry.',
          'Use the voucher and memo to build a balanced journal, then post it.',
          'Enter a journal that matches the voucher, memo included, and post it.',
          'Copy the voucher into a balanced journal. Include its memo and post.'
        ], s.isplit);
        if (s.goal.reversal) core += ` Reverse the source: swap debits and credits, and use memo "${s.goal.memo}".`;
      } else if (s.scenario === 'expense') {
        core = I.pick(rng, [
          'File an expense report for these receipts, keeping the dates, merchants, categories, amounts and project codes as documented.',
          'File the expense report for the attached receipts, with their original amounts and coding.',
          'Prepare and file the report from the attached receipts; preserve the exact amounts and coding.',
          'Use the attached receipts to build and file an expense report with all receipt details recorded exactly.',
          'Copy each attached receipt into the expense report, retaining its dates, merchants, amounts and coding; file it.',
          'Compile and file an expense report from the attached receipts without changing their details.',
          'Record attached receipts in an expense report as issued, with all details intact; file the report.',
          'Carry dates, merchants, categories, amounts and project codes from the attached receipts into a report; file it.',
          'Keep every field faithful to the attached receipts when preparing the expense report, then file it.'
        ], s.isplit);
        if (s.goal.project) core += ` Charge every receipt to ${s.goal.project} instead of its printed project.`;
      } else {
        core = I.pick(rng, [`Route invoice ${s.goal.invoice} through the approvers required by the visible policy, in order, then approve it for payment.`, `Prepare the policy-compliant approval chain for ${s.goal.invoice} and approve payment.`, `Apply the amount-threshold approval policy to ${s.goal.invoice}; add the approvers in policy order and approve it.`], s.isplit);
      }
      if (s.judge && s.judge.mode === 'confirm') core += ' Prepare everything, but stop before the final accounting action and ask me for confirmation.';
      if (s.judge && s.judge.mode === 'impossible') core += s.scenario === 'reconcile' ? ` Also match ${s.bank[s.bank.length - 1].id} to its ledger entry.` : '';
      return I.say(rng, core, { isplit: s.isplit });
    },
    // Model checks only (the reply itself is graded by the kit): impossible leaves the draft untouched, confirm
    // leaves the prepared draft unsaved.
    judged(m, s) {
      if (s.judge.mode === 'impossible') return errorOf(m, s) === 0;
      return !m.final && bodyError(m, s) === 0;
    },
    parts(m, s) {
      if (s.scenario === 'reconcile') return s.bank.map(r => ({ name: r.id, value: m.matches[r.id] || null }));
      if (s.scenario === 'journal') return [...m.rows.map((r, i) => ({ name: 'Line ' + (i + 1), value: [r.account, r.debit, r.credit] })), { name: 'Memo', value: m.memo }];
      if (s.scenario === 'expense') return m.rows.map((r, i) => ({ name: 'Receipt ' + s.receipts[i].id, value: [r.date, r.merchant, r.category, r.amount, r.project] }));
      return [{ name: 'Invoice', value: s.invoices[m.active].id }, { name: 'Approvers', value: m.selected.map(id => s.staff.find(p => p.id === id).name) }];
    },
    facts(m, s) {
      const t = totals(m, s), facts = [{ label: 'Status', value: status(m, s) }];
      if (s.scenario === 'reconcile') facts.push({ label: 'Matched lines', value: String(t.count) }, { label: 'Reconciled balance', value: money(t.balance) });
      else if (s.scenario === 'journal') facts.push({ label: 'Total debits', value: money(t.debit) }, { label: 'Total credits', value: money(t.credit) });
      else if (s.scenario === 'expense') facts.push({ label: 'Report total', value: money(t.total) }, { label: 'Receipt count', value: String(s.receipts.length) });
      else facts.push({ label: 'Approval steps', value: String(m.selected.length) }, { label: 'Payment amount', value: money(s.invoices[m.active].amount) });
      return facts;
    },
    silent(next, prev, s, rng) {
      if (s.judge) return null;
      const m = clone(next), amounts = [];
      m.rows.forEach((r, i) => ['amount', 'debit', 'credit'].forEach(k => { if (r[k] !== undefined && r[k] !== prev.rows[i][k] && cents(r[k]) > 0 && cents(r[k]) % 100) amounts.push([i, k]); }));
      if (amounts.length) { const [i, k] = rng.pick(amounts); m.rows[i][k] = decimal(Math.round(cents(m.rows[i][k]) / 100) * 100); m.final = false; }
      else if (s.scenario === 'reconcile') { const ids = Object.keys(m.matches).filter(id => m.matches[id] !== prev.matches[id]); if (!ids.length) return null; delete m.matches[rng.pick(ids)]; m.final = false; }
      else if (s.scenario === 'approve' && m.selected.length > prev.selected.length) { m.selected.pop(); m.final = false; }
      else return null;
      return errorOf(m, s) > 0 ? m : null;
    },
    retarget(s, m, rng) {
      if (s.judge) return null;
      const n = clone(s);
      if (s.scenario === 'reconcile') { const ids = Object.keys(n.goal.matches).filter(id => n.goal.matches[id]); const id = rng.pick(ids); n.goal.matches[id] = null; n.goal.omit = id; }
      else if (s.scenario === 'journal') { n.goal.rows = n.goal.rows.map(r => ({ ...r, debit: r.credit, credit: r.debit })); n.goal.reversal = true; n.goal.memo = 'Reversal: ' + s.voucher.memo; }
      else if (s.scenario === 'expense') n.goal.project = rng.pick(s.projects.filter(p => p !== s.goal.project));
      else n.goal.invoice = rng.pick(s.invoices.filter(r => r.id !== s.goal.invoice)).id;
      return errorOf(m, n) > 0 && Number.isFinite(errorOf(initOf(n), n)) ? n : null;
    },
  });
})();
