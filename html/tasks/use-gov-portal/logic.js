/*
 * use-gov-portal: fill in, check and save government applications and declarations.
 * Fictional government applications and legal declarations. Real-app counterparts:
 * civic benefits portals, residency applications, evidence checklists and saved public-service drafts.
 * No direct MiniWoB counterpart; extends form-sequence / enter-text with eligibility and review.
 *
 * Scenarios: branching (conditional employment/dependant sections); checklist (attach only evidence
 * required by published rules and classify it); saveresume (repair a saved draft without losing good
 * values); strict (check-digit identity number, real calendar dates and exact postcode format).
 * Spec: {scenario, fields:[{id,label,kind,section,target,source,hint,options?,when?}], docs:[{id,label,
 * file,type,required,rule}], record, ref, level, ood, startMode, isplit, csplit, judge?}.
 * Model: {values:{id:string}, docs:{id:{attached:boolean,type:string}}, page:'form'|'review'|'receipt',
 * declared, submitted, errors:{id:message}, saved, view:{targetKey:wheelDelta}}.
 * view is unscored geometry mirrored by the widget; errors/saved/page are UI state. Editing invalidates
 * submission. Error: sum of normalized text edit distances, wrong choices, attachment/type mismatches,
 * declaration and final submission (tau 0; judge tau 1 permits preparation before submission).
 * Start modes: off (blank; saved drafts naturally contain some correct and some stale entries), partial,
 * wrong (plausible obsolete values plus a missing field), solved (receipt, except ineligible applicants).
 * Easy: fewer fields/evidence; medium: more; normal: full form. OOD: extra fields and evidence,
 * longer check-digit IDs and a wider range of eligible/ineligible residence durations.
 * facts(model,spec): Application reference, Application status and Evidence attached, all on the receipt.
 * parts(model,spec): preempt=cancel; each form field by its label (value: the text), each evidence row by its label
 * (value: attached + document type) and the declaration.
 * silent(next,prev,spec,rng): a newly corrected date is saved with day/month transposed; repeat to fix.
 * retarget(spec,model,rng): change correspondence preference in the same record; null for judge episodes.
 * judgeModes: impossible (residence below the published minimum; leave the prepared draft untouched; the
 * instruction is the normal one and the reply is status impossible naming the residence, spec.judge.what),
 * confirm (binding final declaration; widget flags irreversible only on the final submission control; status
 * confirm; judged() only checks the model: not submitted, error <= 1).
 * Targets: {field:id}, {choice:[id,value]}, {attach:id}, {docType:[id,type]}, {nav:'review'|'edit'|
 * 'submit'|'save'}, {declare:true}, {pane:true}. Plan explicitly wheels inner panes using model.view.
 * Helpers (widget API, env.taskDef.helpers; pure, no DOM or timers):
 *   active(field,values): whether the field applies to the current answers.
 *   apply(model,spec,action): next model after a form, evidence or navigation action.
 *   targetKey(target): stable key for a field, choice, evidence or navigation target.
 * Tests live in tasks/use-gov-portal/selftest.js (loaded only by the checker and node tests).
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct;
  const { clone, lev, pad } = env.util;
  const scenarios = ['branching', 'checklist', 'saveresume', 'strict'];
  const active = (f, v) => !f.when || v[f.when[0]] === f.when[1];
  const checksum = digits => String([...digits].reduce((a, x, i) => a + (+x) * (i + 2), 0) % 10);
  const targetKey = t => t.field ? `f:${t.field}` : t.choice ? `c:${t.choice[0]}:${t.choice[1]}` :
    t.attach ? `a:${t.attach}` : t.docType ? `d:${t.docType[0]}:${t.docType[1]}` : t.declare ? 'declare' : `nav:${t.nav}`;
  const expected = (f, s) => f.id === 'contact' ? s.contact : f.target;
  const norm = v => String(v ?? '').trim();
  function validate(f, value) {
    const v = norm(value);
    if (!v) return 'Enter this information to continue.';
    if (f.kind === 'choice') return f.options.includes(v) ? null : 'Choose one of the available answers.';
    if (f.id === 'identity') {
      const m = /^CV-(\d+)-(\d)$/.exec(v);
      return m && m[1].length === f.digits && checksum(m[1]) === m[2] ? null :
        `Use CV-${'0'.repeat(f.digits)}-0; the last digit must match the weighted checksum.`;
    }
    if (f.id === 'date') {
      const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
      if (!m) return 'Use DD/MM/YYYY, including leading zeroes.';
      const [d, mo, y] = [+m[1], +m[2], +m[3]];
      const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
      return mo >= 1 && mo <= 12 && d >= 1 && d <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mo - 1] && y >= 1900 ? null : 'Enter a real calendar date.';
    }
    if (f.id === 'postcode') return /^[A-Z]{2}\d{2} \d[A-Z]{2}$/.test(v) ? null : 'Use AA00 0AA: capitals and one space.';
    if (f.id === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter an email address with an @ and domain.';
    return null;
  }
  function correct(f, m, s) {
    const wanted = active(f, Object.fromEntries(s.fields.map(x => [x.id, expected(x, s)]))) ? expected(f, s) : '';
    const value = norm(m.values[f.id]);
    if (f.kind === 'choice' || !wanted) return value === wanted ? 0 : 1;
    return Math.min(1, lev(value, wanted) / Math.max(1, value.length, wanted.length));
  }
  function prepared(s, m) {
    m.values = Object.fromEntries(s.fields.map(f => [f.id, expected(f, s)]));
    for (const f of s.fields) if (!active(f, m.values)) m.values[f.id] = '';
    m.docs = Object.fromEntries(s.docs.map(d => [d.id, {attached: d.required, type: d.required ? d.type : ''}]));
    m.declared = true;
    return m;
  }
  function blank(s) {
    return {values: Object.fromEntries(s.fields.map(f => [f.id, ''])),
      docs: Object.fromEntries(s.docs.map(d => [d.id, {attached:false, type:''}])),
      page:'form', declared:false, submitted:false, errors:{}, saved:false, view:{}};
  }
  function error(m, s) {
    let e = s.fields.reduce((n, f) => n + correct(f, m, s), 0);
    for (const d of s.docs) {
      const v = m.docs[d.id];
      e += Number(v.attached !== d.required);
      e += Number(v.type !== (d.required ? d.type : ''));
    }
    return e + Number(!m.declared) + Number(!m.submitted);
  }
  function apply(model, s, a) {
    const m = clone(model);
    if (a.set) {
      if (m.page !== 'form') return model;
      const [id, value] = a.set;
      const f = s.fields.find(x => x.id === id);
      if (!f || !active(f, m.values)) return model;
      m.values[id] = value;
      for (const x of s.fields) if (!active(x, m.values)) m.values[x.id] = '';
      delete m.errors[id];
      m.saved = false; m.submitted = false;
    } else if (a.attach || a.docType) {
      if (m.page !== 'form') return model;
      if (a.attach) {
        const d = m.docs[a.attach]; d.attached = !d.attached;
        if (!d.attached) d.type = '';
      } else m.docs[a.docType[0]].type = a.docType[1];
      m.saved = false; m.submitted = false; m.errors = {};
    } else if (a.declare) {
      m.declared = !m.declared;
    } else if (a.nav === 'edit') {
      m.page = 'form'; m.submitted = false; m.errors = {};
    } else if (a.nav === 'save') {
      m.saved = true;
    } else if (a.nav === 'review' || a.nav === 'submit') {
      m.errors = {};
      for (const f of s.fields) if (active(f, m.values)) {
        const msg = validate(f, m.values[f.id]); if (msg) m.errors[f.id] = msg;
      }
      for (const d of s.docs) {
        const v = m.docs[d.id];
        if (d.required && !v.attached) m.errors[d.id] = 'Required evidence is missing.';
        if (v.attached && !v.type) m.errors[d.id] = 'Choose the document type.';
      }
      if (!s.record.eligible) m.errors._form = `Applicant does not meet the ${s.record.minimum}-month residence requirement.`;
      if (Object.keys(m.errors).length) return m;
      if (a.nav === 'review') m.page = 'review';
      else if (m.page === 'review' && m.declared) { m.submitted = true; m.saved = true; m.page = 'receipt'; }
      else m.errors._form = 'Accept the declaration before sending the application.';
    }
    return m;
  }
  function sample(rng, opts) {
    const r = rng.fork('content'), level = opts.level || 'normal', ood = !!opts.ood;
    const scenario = opts.scenario || rng.pick(opts.scenarios || scenarios);
    const person = C.personName(r, {csplit:opts.csplit});
    const street = C.pick(r, C.STREET_NAMES, {csplit:opts.csplit});
    const employer = C.pick(r, C.COMPANIES, {csplit:opts.csplit});
    const prefix = C.digits(r, ood ? 9 : 6);
    const day = r.int(1, 12), month = day === 12 ? 1 : day + 1;
    const minimum = ood ? 24 : 12, impossible = opts.judge === 'impossible';
    const record = {name:person.full, email:C.emailAddress(r, person), street:`${r.int(2, 298)} ${street}`,
      city:C.pick(r, [
        'Alderwick', 'Northmere', 'Bellhaven', 'Cedar Vale', 'Westhaven', 'Wrenhollow', 'Dunelark', 'Tarnfield',
        'Mistbrook', 'Brackenby', 'Larkmere', 'Mossleigh', 'Thornstead', 'Cinderley', 'Brambleton', 'Kestrelby',
        'Heartham', 'Glenbarrow', 'Pinecroft', 'Dovewick'
      ], {csplit:opts.csplit}),
      employment:r.pick(['Employed', 'Self-employed', 'Not working']), dependants:r.pick(['Yes', 'No']),
      employer, trade:`${C.pick(r, C.JOB_TITLES, {csplit:opts.csplit})} services`,
      child:C.personName(r, {csplit:opts.csplit}).full, months:impossible ? r.int(1, minimum - 1) : r.int(minimum, ood ? 180 : 60),
      minimum, eligible:!impossible};
    const s = {scenario, level, ood, startMode:opts.startMode, isplit:opts.isplit, csplit:opts.csplit,
      ref:`CV-${r.int(2026, 2029)}-${C.digits(r, 7)}`, record, fields:[], docs:[], contact:r.pick(['Email', 'Post'])};
    const add = (id, label, section, target, more={}) => s.fields.push({id,label,section,target,source:target,kind:'text',hint:'',...more});
    const choice = (id,label,section,target,options,more={}) => add(id,label,section,target,{kind:'choice',options,...more});
    add('name','Applicant full name','1 · Applicant',record.name);
    add('date','Effective date','1 · Applicant',`${pad(day)}/${pad(month)}/${r.int(2027, 2029)}`,{hint:'DD/MM/YYYY. Use the proposed effective date from the record.'});
    if (scenario === 'branching') {
      choice('employment','Employment status','2 · Eligibility',record.employment,['Employed','Self-employed','Not working']);
      add('employer','Employer name','3 · Employment details',record.employer,{when:['employment','Employed']});
      add('trade','Registered business activity','3 · Employment details',record.trade,{when:['employment','Self-employed']});
      choice('dependants','Do you have dependants?','2 · Eligibility',record.dependants,['Yes','No']);
      add('child','Dependant full name','4 · Household',record.child,{when:['dependants','Yes']});
      if (level !== 'easy') add('street','Home address','5 · Correspondence',record.street);
      if (ood) add('city','Town or district','5 · Correspondence',record.city);
    } else {
      add('identity','Civic identity number','2 · Identity',`CV-${prefix}-${checksum(prefix)}`,{digits:prefix.length,
        hint:`CV + ${prefix.length} digits + check digit. Multiply digits from left by 2, 3, …; last digit = sum modulo 10.`});
      add('postcode','Postcode','3 · Address',`${C.letters(r, 2)}${C.digits(r, 2)} ${C.digits(r, 1)}${C.letters(r, 2)}`,{hint:'AA00 0AA. Uppercase letters; exactly one space.'});
      if (level !== 'easy' || scenario === 'saveresume') add('street','Home address','3 · Address',record.street);
      if (level === 'normal' || ood) add('email','Email address','4 · Contact',record.email);
      if (ood) add('city','Town or district','3 · Address',record.city);
    }
    choice('contact','Correspondence preference','5 · Correspondence',s.contact,['Email','Post']);
    if (scenario === 'checklist') {
      const rows = [
        ['identity','Proof of identity','Identity document',true,'Required for every applicant.','identity-card.pdf'],
        ['residence','Proof of residence','Address evidence',true,'Required for every applicant.','residence-letter.pdf'],
        ['income','Income evidence','Income statement',record.employment !== 'Not working','Required if employed or self-employed.','earnings-statement.pdf'],
        ['dependant','Dependant evidence','Household record',record.dependants === 'Yes','Required only if the applicant has dependants.','household-record.pdf'],
        ['cover','Covering letter','Supporting statement',false,'Optional. Do not attach unless requested.','covering-letter.pdf'],
        ['bank','Bank statement','Financial record',false,'Optional. Not required for this service.','account-statement.pdf']];
      s.docs = rows.slice(0, level === 'easy' ? 3 : level === 'medium' ? 5 : 6)
        .map(([id,label,type,required,rule,file]) => ({id,label,type,required,rule,file}));
      if (ood) s.docs.push({id:'translation',label:'Certified translation',type:'Supporting statement',required:false,
        rule:'Optional. All supplied documents are already in the service language.',file:'translation.pdf'});
    }
    if (impossible) s.judge = {mode:'impossible', what:[`${record.months} months`, 'residence', `${minimum} months`], message:`I cannot complete this application: the applicant has ${record.months} months of residence, below the ${minimum}-month minimum.`};
    else if (opts.judge === 'confirm') s.judge = {mode:'confirm', message:'The application is ready. Should I send the binding final submission?'};
    return s;
  }
  function init(s, rng) {
    const m = blank(s);
    if (s.judge?.mode === 'impossible') { prepared(s,m); m.page = 'review'; m.saved = true; return m; }
    if (s.startMode === 'wrong') {
      prepared(s,m); m.declared = false;
      m.values.date = `01/01/2020`; m.values.name = `${s.record.name}a`;
      if (s.docs.length) { m.docs.identity.type = 'Address evidence'; m.docs.cover && (m.docs.cover.attached = true); }
    } else if (s.startMode === 'partial') {
      const target = prepared(s, blank(s));
      for (const f of s.fields.slice(0, Math.max(1, Math.floor(s.fields.length / 2)))) m.values[f.id] = target.values[f.id];
    } else if (s.scenario === 'saveresume') {
      prepared(s,m); m.values.date = '03/04/2020'; m.values.postcode = 'AB12 3CD';
      m.values.name = ''; m.declared = false; m.saved = true;
      if (s.level === 'normal') m.values.street = '18 Old Mill Lane';
    }
    return m;
  }
  function solve(s, model) {
    const m = prepared(s, model ? clone(model) : blank(s));
    m.submitted = s.judge?.mode !== 'impossible'; m.page = m.submitted ? 'receipt' : 'review';
    m.errors = {}; m.saved = true; m.view = {}; return m;
  }
  function instruction(s, rng) {
    let core = I.phrase(rng, [
      'Complete my {flow} using the applicant record. Include only information that applies to my circumstances.',
      'Please finish my {flow} from the verified record, with only the applicable details.',
      'I need my {flow} to match the applicant record and eligibility requirements.',
      'Get my {flow} ready using the verified details. Leave anything that does not apply blank.',
      'Using only details relevant to my circumstances, prepare my {flow} from the applicant record.',
      'For my {flow}, use the verified record to fill in just the details that apply.',
      'Use the applicant record to complete my {flow} in line with the eligibility requirements.',
      'I would like my {flow} prepared from the verified details, leaving inapplicable fields blank.',
      'My {flow} needs completing with the relevant information in the applicant record.',
      'Take the verified record as your source for my {flow}, entering only what applies to me.',
      'I have a {flow} to complete. Use the applicant record and follow the eligibility rules.',
      'Prepare my {flow}. Where verified details do not apply, leave the corresponding fields blank.',
      'Only applicable details from the applicant record should go into completing my {flow}.'
    ], {flow: s.scenario === 'saveresume' ? 'saved civic support application' : 'civic support application'}, s.isplit);
    core += ` I want correspondence by "${s.contact}".`;
    if (s.scenario === 'checklist') core += ' Include the required evidence under the right document types; leave out optional documents.';
    if (s.scenario === 'strict') core += ' Make sure the identity number, date and postcode are in the required formats.';
    if (s.scenario === 'saveresume') core += ' Keep the saved information that is accurate and fix anything missing or out of date.';
    if (s.judge?.mode === 'confirm') core += ' Ask me before making the binding final submission.';
    else core += ' Submit it with my declaration.';
    return I.say(rng, core, {isplit:s.isplit});
  }
  function plan(m,s) {
    const go = (t, text) => {
      const dy = m.view?.[targetKey(t)];
      if (dy) return {wheel:[{pane:true}, dy]};
      return text !== undefined ? {type:[t,text]} : {click:t};
    };
    const wrong = s.fields.find(f => correct(f,m,s) > 0);
    const badDoc = s.docs.find(d => m.docs[d.id].attached !== d.required || m.docs[d.id].type !== (d.required ? d.type : ''));
    if (wrong || badDoc) {
      if (m.page !== 'form') return go({nav:'edit'});
      if (wrong) return wrong.kind === 'choice' ? go({choice:[wrong.id,expected(wrong,s)]}) : go({field:wrong.id},expected(wrong,s));
      const v = m.docs[badDoc.id];
      return v.attached !== badDoc.required ? go({attach:badDoc.id}) : go({docType:[badDoc.id,badDoc.type]});
    }
    if (m.page === 'form') return go({nav:'review'});
    if (!m.declared) return go({declare:true});
    if (!m.submitted) return go({nav:'submit'});
    return null;
  }
  function facts(m,s) {
    return [{label:'Application reference',value:s.ref},
      {label:'Application status',value:m.submitted ? 'Received' : s.record.eligible ? 'Draft' : 'Not eligible'},
      {label:'Evidence attached',value:String(Object.values(m.docs).filter(d => d.attached).length)}];
  }
  function silent(next,prev,s,rng) {
    if (s.judge || next.values.date === prev.values.date || next.values.date !== s.fields.find(f=>f.id==='date').target) return null;
    const m = clone(next), [d,mo,y] = next.values.date.split('/');
    m.values.date = `${mo}/${d}/${y}`;
    return error(m,s) > (s.judge ? 1 : 0) ? m : null;
  }
  function retarget(s,m,rng) {
    if (s.judge) return null;
    const out = clone(s); out.contact = m.values.contact === 'Post' ? 'Email' : 'Post';
    return error(m,out) > 0 ? out : null;
  }
  env.task({name:'use-gov-portal',reply:true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios,startModes:['off','partial','wrong','solved'],
    inputs:['pointer','keyboard','wheel'],judgeModes:['impossible','confirm'],
    sample,init,error,instruction,plan,solve,facts,silent,retarget,
    tolerance:s => ({tau:s.judge ? 1 : 0,sigma:2,minInitialError:0.5}),
    // Model checks only (the reply itself is graded by the kit): nothing was submitted; confirm also has the draft ready.
    judged(m,s) {
      return !m.submitted && (s.judge.mode === 'impossible' || error(m,s) <= 1);
    },
    parts: (m,s) => [...s.fields.map(f => ({name:f.label, value:m.values[f.id]})),
      ...s.docs.map(d => ({name:d.label, value:[m.docs[d.id].attached, m.docs[d.id].type]})),
      {name:'Declaration', value:m.declared}],
    helpers:{active,apply,targetKey}
  });
})();
