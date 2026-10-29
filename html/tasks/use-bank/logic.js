/*
 * use-bank: pay bills, schedule transfers, categorise transactions, dispute charges and set card limits.
 * Fictional retail banking, modelled on bill-pay portals, recurring bank transfers,
 * transaction categorisation, card chargeback forms and card-control dashboards. No MiniWoB equivalent.
 *
 * Scenarios: paybill (biller/account/amount/date), schedule (from/to/amount/frequency/start/end),
 * categorise (inline transaction category pickers), dispute (transaction/reason/details),
 * limits (card spending limit or freeze/unfreeze). All changes require review then application.
 * Spec: {scenario, accounts[], payees[], cards[], transactions[], fields:[{id,label,kind,options?,hint?}],
 * target:{field:value}, reference, customer, effective, level, ood, startMode, isplit, csplit, judge?}.
 * Amounts are decimal strings with exactly two places, no grouping/sign/currency/exponents; cents
 * are integers internally. Dates are real YYYY-MM-DD dates. Wrong-but-valid values can be saved.
 * Model: {values, saved, view:'edit'|'review'|'receipt', open:null|fieldId, search, invalid, touched}.
 * values hold drafts/current saved values; any edit invalidates saved. UI state is unscored except
 * review is required for confirm. off empty, partial half filled, wrong review with one wrong value,
 * solved receipt (confirm: prepared review). Error averages field errors plus an application/review unit; amounts and details
 * receive graded distance, choices exact. Unrequested transactions must retain their categories.
 * Targets: {field:id} input/picker; {option:value}; {nav:'review'|'apply'|'edit'|'close'};
 * {search:true}; {transaction:id} (open dispute); {pane:true}/{choicePane:true} (wheel).
 * bankUI and bankScroll are unscored widget state; clipped controls are wheeled into view by plan().
 * locate never changes DOM.
 * Helpers (widget API, env.taskDef.helpers):
 *   apply(model,spec,action): immutable {set:[id,value]}, {nav}, {open}, {search}, {transaction} actions.
 *   money(cents): format integer cents as USD with two decimal places.
 *   cents(text): parse a strict decimal amount, or return null.
 * Self-test: selftest.js, loaded only by the checker and node tests.
 * No DOM, clock, network or unseeded randomness.
 * facts(model,spec): confirmation number plus resulting available balance/status/uncategorised count,
 * all displayed by the receipt; none require copying the instruction's target.
 * silent(next,prev,spec,rng): a newly entered amount is rounded to whole dollars (or a category is
 * dropped / freeze fails to stick); immutable, remains wrong and repeating the edit repairs it.
 * retarget(spec,model,rng): change amount, category, dispute reason or freeze intent in the same scene;
 * returns null in judge episodes, otherwise guarantees the current model is off the new target.
 * parts(model,spec): preempt=cancel items: each form field by its label (value: its text) and the receipt
 * ('Confirmation number', value: applied).
 * judgeModes: spec.judge = {mode, message, payee, amount, from, date, cands?, others?, what?}. The instruction is the
 * paybill wording with seeded values. ambiguous = two billers share a name; the reply asks (status ask) with one
 * option per biller (cands: label or suffix; others: the other billers, never offered); impossible = requested
 * payment exceeds the source's visible available funds; status impossible, what names the amount (or the account);
 * both leave values alone. confirm = prepare review and ask (status confirm) before Pay/Transfer/Apply; widget flags
 * irreversible on application. judged() keeps only the model check (nothing touched / applied).
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct, { clone, lev } = env.util;
  const scenarios = ['paybill', 'schedule', 'categorise', 'dispute', 'limits'];
  const categories = ['Groceries', 'Transport', 'Dining', 'Utilities', 'Shopping', 'Health', 'Travel'];
  const reasons = ['Duplicate charge', 'Goods not received', 'Incorrect amount', 'Unrecognised charge'];
  const money = n => '$' + (n / 100).toFixed(2);
  const cents = v => /^(0|[1-9]\d{0,7})\.\d{2}$/.test(String(v)) ? Math.round(Number(v) * 100) : null;
  function validDate(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
    if (!m) return false;
    const y = +m[1], mo = +m[2], d = +m[3];
    return y >= 2020 && y <= 2099 && mo >= 1 && mo <= 12 && d >= 1 && d <= [31, y % 4 === 0 ? 29 : 28,31,30,31,30,31,31,30,31,30,31][mo - 1];
  }
  function fieldError(f, value, target) {
    if (value === target) return 0;
    if (f.kind === 'amount') {
      const a = cents(value), b = cents(target);
      return a === null ? 1 : Math.min(1, Math.max(0.15, Math.abs(a - b) / Math.max(100, b)));
    }
    if (f.kind === 'details') return Math.max(0.1, lev(String(value || ''), target) / Math.max(target.length, String(value || '').length, 1));
    return 1;
  }
  function error(m, s) {
    if (s.judge && s.judge.mode !== 'confirm') return m.touched ? 1 : 0;
    let e = s.fields.reduce((n, f) => n + fieldError(f, m.values[f.id], s.target[f.id]), 0);
    e += s.judge ? (m.view === 'review' && !m.saved ? 0 : 1) : (m.saved ? 0 : 1);
    return e / (s.fields.length + 1);
  }
  function validation(m, s) {
    const invalid = {};
    for (const f of s.fields) {
      const v = m.values[f.id];
      if (!v) invalid[f.id] = 'This field is required.';
      else if (f.kind === 'amount' && (cents(v) === null || cents(v) <= 0)) invalid[f.id] = 'Use a positive amount, e.g. 125.50 (no commas or currency symbol).';
      else if (f.kind === 'date' && !validDate(v)) invalid[f.id] = 'Enter a valid date as YYYY-MM-DD.';
      else if (f.options && !f.options.includes(v)) invalid[f.id] = 'Choose an available option.';
    }
    if (s.scenario === 'schedule' && validDate(m.values.start) && validDate(m.values.end) && m.values.end <= m.values.start) invalid.end = 'End date must follow the start date.';
    if (s.scenario === 'schedule' && m.values.from && m.values.from === m.values.to) invalid.to = 'Choose a different destination account.';
    if (['paybill','schedule'].includes(s.scenario)) {
      const a = s.accounts.find(x => x.label === m.values.from);
      if (a && cents(m.values.amount) > a.balance) invalid.amount = 'Insufficient available funds in this account.';
    }
    return invalid;
  }
  function apply(m, s, a) {
    const n = clone(m);
    if (a.set) { n.values[a.set[0]] = a.set[1]; n.saved = false; n.touched = true; delete n.invalid[a.set[0]]; n.open = null; }
    if ('open' in a) n.open = a.open;
    if ('search' in a) n.search = a.search;
    if (a.transaction) { n.values.transaction = a.transaction; n.touched = true; n.saved = false; n.view = 'edit'; n.search = ''; }
    if (a.nav === 'edit') { n.view = 'edit'; n.saved = false; n.open = null; }
    if (a.nav === 'close') n.open = null;
    if (a.nav === 'review' || a.nav === 'apply') {
      n.invalid = validation(n, s);
      if (!Object.keys(n.invalid).length) { n.view = a.nav === 'review' ? 'review' : 'receipt'; n.saved = a.nav === 'apply'; }
    }
    return n;
  }
  function sample(rng, opts) {
    const r = rng.fork('content'), level = opts.level || 'normal', ood = !!opts.ood;
    const s = {scenario: opts.scenario || rng.pick(opts.scenarios || scenarios), level, ood, startMode: opts.startMode,
      isplit: opts.isplit, csplit: opts.csplit, reference: 'PB-' + C.alnum(r, 8), customer: C.personName(r, {csplit:opts.csplit}).full,
      effective:'2027-03-01', fields:[], target:{}};
    s.accounts = ['Everyday checking', 'Reserve savings', 'Household checking'].slice(0, level === 'easy' ? 2 : 3).map((name,i) => ({label:`${name} •${r.int(1000,9999)}`, balance:r.int(1000000,3000000) + i * 100000}));
    s.payees = C.sample(r, C.COMPANIES, level === 'easy' ? 3 : ood ? 7 : 5, {csplit:opts.csplit}).map(name => ({name, suffix:String(r.int(1000,9999))}));
    s.payees.forEach(p => { p.label = `${p.name} •${p.suffix}`; });
    s.cards = ['Everyday debit', 'Travel credit'].map(name => `${name} •${r.int(1000,9999)}`);
    s.transactions = C.sample(r, C.COMPANIES, ood ? 14 : level === 'easy' ? 5 : 9, {csplit:opts.csplit}).map((name,i) => ({id:`TX-${4100+i}`, name, amount:r.int(1250,42000), date:`2027-02-${String(25-i).padStart(2,'0')}`, category:i % 3 === 0 ? 'Uncategorised' : r.pick(categories)}));
    const add = (id,label,kind,target,options,hint) => { s.fields.push({id,label,kind,options,hint}); s.target[id] = target; };
    const amount = (rng.int(20, ood ? 5000 : level === 'easy' ? 200 : 1200) + rng.int(11,89)/100).toFixed(2);
    const acct = s.accounts.map(a => a.label);
    if (s.scenario === 'paybill') {
      add('payee','Pay to','choice',r.pick(s.payees).label,s.payees.map(p => p.label));
      add('from','Pay from','choice',r.pick(acct),acct); add('amount','Amount','amount',amount,null,'USD · 0.00, no commas');
      add('date','Deliver on','date',`2027-03-${String(rng.int(2,26)).padStart(2,'0')}`,null,'YYYY-MM-DD');
    } else if (s.scenario === 'schedule') {
      add('from','From account','choice',acct[0],acct); add('to','To account','choice',acct[1],acct);
      add('amount','Amount','amount',amount,null,'USD · 0.00, no commas');
      add('frequency','Frequency','choice',rng.pick(level === 'easy' ? ['Monthly','Weekly'] : ['Weekly','Every two weeks','Monthly','Quarterly']),['Weekly','Every two weeks','Monthly','Quarterly']);
      add('start','Start date','date',`2027-03-${String(rng.int(2,25)).padStart(2,'0')}`,null,'YYYY-MM-DD'); add('end','End date','date',ood ? '2029-12-20' : '2027-12-20',null,'YYYY-MM-DD');
    } else if (s.scenario === 'categorise') {
      const count = level === 'easy' ? 2 : level === 'medium' ? 3 : ood ? 6 : 4;
      s.transactions.forEach((t,i) => add(t.id,`${t.name} (${t.id})`,'category',i < count ? r.pick(categories.filter(c => c !== t.category)) : t.category,[...categories,'Uncategorised']));
      s.requested = s.transactions.slice(0,count).map(t => t.id);
    } else if (s.scenario === 'dispute') {
      add('transaction','Transaction','transaction',r.pick(s.transactions).id,s.transactions.map(t => t.id));
      add('reason','Dispute reason','choice',rng.pick(reasons),reasons);
      add('details','Supporting details','details',['The merchant charged me twice for a single order.','The parcel never arrived and the merchant has not resolved it.','The receipt total differs from the amount charged.','I did not authorise this purchase.'][reasons.indexOf(s.target.reason)]);
    } else {
      add('card','Card','choice',r.pick(s.cards),s.cards);
      s.limitAction = rng.bool() ? 'limit' : 'freeze';
      if (s.limitAction === 'limit') add('amount','Daily spending limit','amount',amount,null,'USD · 0.00, no commas');
      else add('frozen','Card status','choice','Frozen',['Active','Frozen']);
    }
    if (['ambiguous','impossible','confirm'].includes(opts.judge)) {
      const mode = opts.judge;
      if (mode === 'ambiguous') { if (s.payees[1].suffix === s.payees[0].suffix) s.payees[1].suffix = String(+s.payees[0].suffix === 9999 ? 1000 : +s.payees[0].suffix + 1); s.payees[1].name = s.payees[0].name; s.payees[1].label = `${s.payees[1].name} •${s.payees[1].suffix}`; }
      // seeded judge text (own fork, so nothing else shifts): amount, date, source account and the biller of a failing payment
      const jr = rng.fork('judgetext'), from = jr.pick(s.accounts);
      const amt = (jr.int(2000, 30000) / 100).toFixed(2), date = `2027-03-${String(jr.int(2, 26)).padStart(2, '0')}`;
      const over = money(from.balance + 50000), payee = mode === 'ambiguous' ? s.payees[0] : jr.pick(s.payees);
      s.judge = {mode, from: from.label, payee: mode === 'ambiguous' ? payee.name : payee.label, amount: mode === 'ambiguous' ? amt : over.slice(1), date,
        message: mode === 'confirm' ? 'The review is ready. Should I apply these banking changes?' : mode === 'ambiguous' ? `Which ${s.payees[0].name} biller account do you mean: ${s.payees[0].suffix} or ${s.payees[1].suffix}?` : `I cannot pay that amount: ${from.label} has insufficient available funds.`};
      // ambiguous: the two billers are told apart by label or suffix; the other billers must not be offered.
      // impossible: the amount (or the account) that cannot be paid.
      if (mode === 'ambiguous') {
        s.judge.cands = s.payees.slice(0, 2).map(p => [p.label, p.suffix]);
        s.judge.others = s.payees.slice(2).map(p => [p.label, p.name]);
      }
      if (mode === 'impossible') s.judge.what = [over, over.slice(1), from.label];
    }
    return s;
  }
  function init(s) {
    const m = {values:{}, saved:false, view:'edit', open:null, search:'', invalid:{}, touched:false};
    s.fields.forEach(f => { m.values[f.id] = f.kind === 'category' ? s.transactions.find(t => t.id === f.id).category : ''; });
    if (s.startMode === 'partial') s.fields.slice(0,Math.max(1,Math.floor(s.fields.length/2))).forEach(f => { m.values[f.id] = s.target[f.id]; });
    if (s.startMode === 'wrong') { m.values = clone(s.target); const f = s.fields[0]; m.values[f.id] = f.options ? f.options.find(v => v !== s.target[f.id]) : '0.00'; m.view = 'review'; }
    return m;
  }
  function facts(m,s) {
    const out = [{label:'Confirmation number',value:m.saved ? s.reference : 'Not applied'}];
    if (['paybill','schedule'].includes(s.scenario)) {
      const a = s.accounts.find(x => x.label === m.values.from);
      out.push({label:'Available balance',value:money((a ? a.balance : 0) - (m.saved && s.scenario === 'paybill' ? cents(m.values.amount) || 0 : 0))});
      out.push({label:'Status',value:m.saved ? s.scenario === 'paybill' ? 'Payment scheduled' : 'Recurring transfer active' : 'Draft'});
    } else if (s.scenario === 'categorise') out.push({label:'Uncategorised transactions',value:String(s.transactions.filter(t => m.values[t.id] === 'Uncategorised').length)});
    else if (s.scenario === 'dispute') { out.push({label:'Case status',value:m.saved ? 'Under review' : 'Draft'}); out.push({label:'Provisional credit',value:'Pending investigation'}); }
    else out.push({label:'Effective date',value:s.effective});
    return out;
  }
  const payTemplates = (rng, v, isplit) => I.phrase(rng,['Pay {payee} ${amount} from {from} on {date}.','Arrange a bill payment of ${amount} to {payee}, using {from}, for {date}.','Schedule ${amount} from {from} to biller {payee} on {date}.','Use {from} to pay {payee} ${amount}, delivered {date}.'],v,isplit);
  // preempt=cancel: each field of the form (a transaction's category, the card, an amount...) by its label, then the application
  const parts = (m, s) => [...s.fields.map(f => ({ name: f.label, value: m.values[f.id] })), { name: 'Confirmation number', aliases: ['Receipt'], value: m.saved }];
  function instruction(s,rng) {
    const t = s.target;
    let core;
    if (s.judge && s.judge.mode !== 'confirm') core = payTemplates(rng, { payee: s.judge.payee, amount: s.judge.amount, from: s.judge.from, date: s.judge.date }, s.isplit);
    else if (s.scenario === 'paybill') core = payTemplates(rng, t, s.isplit);
    else if (s.scenario === 'schedule') core = I.phrase(rng,['Set up a {frequency} transfer of ${amount} from {from} to {to}, starting {start} and ending {end}.','Schedule ${amount} from {from} to {to}: {frequency}, {start} through {end}.','Create a recurring transfer: {from} to {to}, ${amount}, {frequency}; first {start}, last {end}.','Move ${amount} {frequency} from {from} to {to} between {start} and {end}.'],t,s.isplit);
    else if (s.scenario === 'categorise') core = I.phrase(rng,[
      'Categorise these transactions: {list}. Leave all other categories unchanged.',
      'Assign the following categories: {list}; keep the remaining transactions as they are.',
      'Update transaction categories as follows: {list}. Preserve the other categories.',
      'Organise these entries: {list}. Do not recategorise other entries.',
      'Keep unlisted categories unchanged; for these entries use: {list}.',
      'Each listed entry needs its stated category: {list}. Leave all others unchanged.',
      'Only these category mappings should change: {list}. Retain all other categories.',
      'Use {list} as the category mapping; leave unlisted transaction categories intact.',
      '{list}. Make the category edits without changing any unlisted category.',
      'Give these entries their categories: {list}; other categories stay as is.'
    ],{list:s.requested.map(id => `${id} (${s.transactions.find(x => x.id === id).name}) as ${t[id]}`).join('; ')},s.isplit);
    else if (s.scenario === 'dispute') { const x = s.transactions.find(x => x.id === t.transaction); core = I.phrase(rng,[
      'Dispute {tx} for "{reason}". Add these details exactly: "{details}".',
      'Open a dispute for {tx}, reason "{reason}", with details "{details}".',
      'Challenge {tx} for "{reason}". The supporting details are "{details}".',
      'File a charge dispute for {tx} with reason "{reason}" and supporting details "{details}".',
      'Use "{reason}" to dispute {tx}. Supply these exact details: "{details}".',
      'Raise a dispute for {tx}. Reason: "{reason}". Copy the details: "{details}".',
      'The dispute is for {tx}: choose "{reason}" and enter "{details}" exactly.',
      'Start a dispute: transaction {tx}, reason "{reason}", exact details "{details}".',
      'Enter "{details}" verbatim in a dispute over {tx} for "{reason}".',
      'Report {tx} as disputed, using "{reason}" and the exact text "{details}".',
      'Put {tx} into dispute for "{reason}". Use "{details}" as the full details.',
      'I want to dispute {tx} for "{reason}". Enter "{details}" without changes.'
    ],{...t,tx:`${x.id} (${x.name}, ${money(x.amount)}, ${x.date})`},s.isplit); }
    else core = s.limitAction === 'limit' ? I.phrase(rng,['Set the daily spending limit on {card} to ${amount}.','Change {card} to a ${amount} daily spending limit.','Update the daily limit for {card} to ${amount}.','Apply a daily purchase limit of ${amount} to {card}.'],t,s.isplit) : I.phrase(rng,['Freeze {card}.','Set {card} to Frozen.','Temporarily freeze the card {card}.','Pause spending by freezing {card}.'],t,s.isplit);
    if (s.scenario === 'limits' && s.limitAction === 'freeze' && t.frozen === 'Active' && !s.judge) core = `Unfreeze ${t.card}; set its card status to Active.`;
    core = I.say(rng,core,{isplit:s.isplit});
    if (s.judge && s.judge.mode === 'confirm') core += ' Have everything ready, but ask me before any money is sent or changes take effect.';
    return core;
  }
  function planStep(m,s) {
    if (s.judge && s.judge.mode !== 'confirm') return {finish:true,message:s.judge.message};
    const f = s.fields.find(f => fieldError(f,m.values[f.id],s.target[f.id]) > 0);
    if (f) {
      if (m.view !== 'edit') return {click:{nav:'edit'}};
      if (f.kind === 'category' && m.search !== f.id) return {type:[{search:true},f.id]};
      if (f.kind === 'transaction') {
        if (m.values.transaction) return {click:{field:'transaction'}};
        if (m.search !== s.target[f.id]) return {type:[{search:true},s.target[f.id]]};
        return {click:{transaction:s.target[f.id]}};
      }
      if (f.options) return m.open === f.id ? {click:{option:s.target[f.id]}} : {click:{field:f.id}};
      return {type:[{field:f.id},s.target[f.id]]};
    }
    if (m.view === 'edit') return {click:{nav:'review'}};
    if (s.judge) return {finish:true,message:s.judge.message};
    if (!m.saved) return {click:{nav:'apply'}};
    return {finish:true};
  }
  function plan(m,s) {
    if (m.bankUI?.popup) return {click:{nav:'dismiss'}};
    if (m.bankUI?.preview) return {click:{nav:'return'}};
    const step=planStep(m,s), target=step.click || step.type?.[0];
    const need=target && m.bankScroll?.[JSON.stringify(target)];
    return need ? {wheel:[need.choices?{choicePane:true}:{pane:true},need.dy]} : step;
  }
  function silent(next,prev,s,rng) {
    if (s.judge) return null;
    const f = rng.pick(s.fields.filter(f => next.values[f.id] !== prev.values[f.id] && next.values[f.id] === s.target[f.id] && (['amount','category'].includes(f.kind) || f.id === 'frozen')));
    if (!f) return null;
    const n = clone(next);
    n.values[f.id] = f.kind === 'amount' ? Math.floor(cents(next.values[f.id])/100).toFixed(2) : f.id === 'frozen' ? 'Active' : prev.values[f.id];
    return error(n,s) > 0 ? n : null;
  }
  function retarget(s,m,rng) {
    if (s.judge) return null;
    const candidates = [];
    for (const f of s.fields.filter(f => f.kind !== 'transaction')) {
      const values = f.kind === 'amount' ? [((cents(s.target[f.id]) + 101)/100).toFixed(2)]
        : f.options ? f.options
        : f.kind === 'date' ? [f.id === 'end' ? '2028-12-21' : '2027-03-27','2027-03-26']
        : ['Please investigate this charge and contact me with the result.'];
      for (const value of values) {
        if (value === s.target[f.id] || value === m.values[f.id]) continue;
        const n = clone(s); n.target[f.id] = value;
        if (s.scenario === 'categorise' && !n.requested.includes(f.id)) n.requested.push(f.id);
        const solved = {values:n.target};
        if (!Object.keys(validation(solved,n)).length && error(m,n) > 0) candidates.push(n);
      }
    }
    return candidates.length ? rng.pick(candidates) : null;
  }
  function solve(s,m) {
    if (s.judge && s.judge.mode !== 'confirm') return {...init(s), touched:false};
    return {...init(s),...m,values:clone(s.target),saved:!s.judge,view:s.judge ? 'review' : 'receipt',open:null,invalid:{},touched:true};
  }


  env.task({name:'use-bank',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios,startModes:['off','partial','wrong','solved'],inputs:['pointer','keyboard','wheel'],judgeModes:['confirm','ambiguous','impossible'],
    sample,init,error,tolerance:() => ({tau:0,sigma:0.3,minInitialError:0.01}),instruction,plan,
    solve,
    parts,
    // model check: nothing was changed (ambiguous / impossible) or applied (all modes); the reply is graded by the kit
    judged(m,s,info) { if (m.saved) return false; if (s.judge.mode !== 'impossible' && info.infeasible) return false; return s.judge.mode === 'confirm' || !m.touched; },
    facts,silent,retarget,helpers:{apply,money,cents},lib:{validDate,validation}});
})();
