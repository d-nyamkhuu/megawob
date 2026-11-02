/*
 * use-form-builder: add, reorder and configure questions, branching and validation in a form builder.
 * A fictional form/survey authoring product, not a form for respondents.
 * Real-app counterparts: visual survey builders, section routing, field validation and response policies.
 *
 * Scenarios: addq (append typed questions/options), branching (answer -> section rules), reorder
 * (drag sections and questions within sections), validation (range, length, email/pattern and required),
 * settings (email collection, one-response policy, scheduled closing).
 * Spec: {scenario, level, ood, startMode, isplit, csplit, title, owner, ref, sections:[{id,title}],
 * initial:[question], goal:{add?,routes?,sectionOrder?,orders?,validation?,settings?}, judge?}.
 * Question: {id,section,title,type,options:[],validation:{preset,min,max,required}}; numbers are strings.
 * Model: {questions:[], sectionOrder:[], orders:{section:[questionId]}, rules:{question:{answer:section}},
 * settings:{emails,one,closeEnabled,closeDate}, serial, ui:{tab,section,selected,open}, view?}.
 * ui/view are unscored. view.hidden maps serialized targets to {pane,dir}, mirrored by the widget after
 * align-layout/scroll; the closed-loop oracle wheels an inner pane before reaching an off-screen control.
 * Starts: off (existing draft/default policies), partial (some requested edits), wrong (plausible bad
 * settings/options/order), solved. Easy/medium reduce requested edits; OOD widens counts and limits.
 * Error: mean discrete/edit-distance subgoal error, with penalties for extra questions and accidental
 * changes to existing fields; exact tau 0. In-app actions save drafts, never end the episode.
 * Targets: {tab:name}, {section:id}, {question:id}, {add:true}, {remove:id}, {field:name},
 * {toggle:name}, {open:name}, {pick:[name,value]}, {pane:name},
 * {list:'sections'|'questions',item:id} / {list,slot:index,item:id} for drag endpoints.
 * Helpers (widget API, env.taskDef.helpers):
 *   apply(model,spec,action): clone the model and apply one authoring action.
 *   question(model,id): find a question by its stable ID.
 *   types: supported question type labels, in picker order.
 *   presets: supported validation preset labels, in picker order.
 *   targetKey(target): serialize a model target for geometry lookup.
 * Self-test: tasks/use-form-builder/selftest.js (checker and node tests only).
 * apply actions: {ui:patch}, {add:type}, {remove:id}, {field:[name,value]}, {toggle:name},
 * {pick:[name,value]}, {order:[list,ids]}; the widget and oracle share these transitions.
 * Round-2 hooks:
 * facts(model,spec): visible Form ID, aggregate Response fields and Estimated time (not goal copies).
 * silent(next,prev,spec,rng): one saved field/routing/policy/order edit fails to stick; cloned and retryable.
 * retarget(spec,model,rng): change goal fields only, keeping all questions, sections and option banks.
 * parts(model,spec): preempt=cancel; each question by its title (value: type, options, validation), the section
 * order, each section's question order, each question's routing and the four settings by their page labels.
 * judgeModes ['impossible']: unsupported external checks, verification codes or digital signatures;
 * the draft starts within tau; the reply must be status impossible naming the unavailable rule (spec.judge.what).
 * The instruction reads like a validation brief ("Configure response validation: "<question>": <rule>, required.").
 */
(function () {
  'use strict';

  const { sameJson } = env.util;
  const C = env.content, I = env.instruct, {clone, lev} = env.util;
  const types = ['Short text', 'Paragraph', 'Multiple choice', 'Checkboxes', 'Number'];
  const presets = ['None', 'Number range', 'Text length', 'Email address', 'Pattern: letters only', 'Pattern: website URL'];
  const choice = t => t === 'Multiple choice' || t === 'Checkboxes';
  const targetKey = t => JSON.stringify(t);
  const question = (m, id) => m.questions.find(q => q.id === id);
  const textError = (a, b) => lev(String(a ?? ''), String(b ?? '')) / Math.max(1, String(a ?? '').length, String(b ?? '').length);
  const blankValidation = () => ({preset:'None', min:'', max:'', required:false});
  const countError = (a,b) => Math.max(a.length,b.length) ? Array.from({length:Math.max(a.length,b.length)}, (_,i) => a[i] === b[i] ? 0 : 1).reduce((x,y)=>x+y,0)/Math.max(a.length,b.length) : 0;
  const estimate = m => `${Math.max(1, Math.ceil(m.questions.reduce((s,q)=>s+(q.type === 'Paragraph' ? 45 : choice(q.type) ? 20 : 15),0)/60))} min`;
  function sample(rng, opts = {}) {
    const level = opts.level || 'normal', ood = !!opts.ood;
    const n = level === 'easy' ? 1 : level === 'medium' ? 2 : ood ? 4 : 3;
    const cr = rng.fork('content'), co = {csplit:opts.csplit};
    const company = C.pick(cr,C.COMPANIES,co);
    const sectionNames = ['About you', 'Your experience', 'Follow-up', 'Final details'];
    const sections = sectionNames.slice(0, level === 'easy' ? 2 : ood ? 4 : 3).map((title,i)=>({id:`s${i}`,title}));
    const departments = C.sample(cr,C.DEPARTMENTS, ood ? 5 : 3,co);
    const labels = [C.pick(cr,C.FIELD_LABELS.filter(f=>f.kind==='email' && /^(e-?mail|work e-?mail)/i.test(f.label)),co).label,
      'Which team are you part of?', 'How many visits this month?', 'Tell us about your experience',
      'Preferred contact method', 'Would you join another session?', 'Feedback summary', 'Contact name',
      'Follow-up notes', 'Reference number', 'Additional comments', 'Availability'];
    const initial = [];
    sections.forEach((s,si) => {
      const k = level === 'easy' ? 2 : 3;
      for(let i=0;i<k;i++) {
        const j = si*k+i;
        const type = j === 1 ? 'Multiple choice' : j === 2 ? 'Number' : j === 3 ? 'Paragraph' : 'Short text';
        initial.push({id:`q${j}`,section:s.id,title:labels[j],type,options:choice(type)?departments.slice():[],validation:blankValidation()});
      }
    });
    const s = {scenario:opts.scenario || rng.pick(opts.scenarios || ['addq','branching','reorder','validation','settings']),
      level,ood,startMode:opts.startMode || 'off',isplit:opts.isplit,csplit:opts.csplit,
      title:`${company} · ${cr.pick([
        'Member feedback', 'Workshop survey', 'Participant intake', 'Service feedback', 'Group enrollment',
        'Event evaluation', 'Attendee details', 'Program insights', 'Guest experience', 'Visit preferences'
      ])}`,
      owner:C.personName(cr,co).full, ref:`FM-${C.letters(cr,3)}-${C.digits(cr,4)}`,sections,initial,goal:{}};
    if(s.scenario === 'addq') {
      const cities = C.sample(cr,C.CITIES,ood?5:3,co).map(c=>c.city);
      const topics = C.sample(cr,C.TOPICS,ood?5:3,co);
      const templates = [
        {title:'Preferred workshop location',type:'Multiple choice',options:cities},
        {title:'Topics you would like covered',type:'Checkboxes',options:topics},
        {title:'What would make the next session better?',type:'Paragraph',options:[]},
        {title:'Number of colleagues attending',type:'Number',options:[]}
      ];
      s.goal.add = cr.shuffle(templates).slice(0,n).map(q=>({...q,section:'s0'}));
    } else if(s.scenario === 'branching') {
      const q = initial[1];
      s.goal.routes = q.options.slice(0,Math.min(n,q.options.length)).map((answer,i)=>({id:q.id,answer,to:sections[1+i%(sections.length-1)].id}));
    } else if(s.scenario === 'reorder') {
      s.goal.sectionOrder = sections.map(x=>x.id).reverse();
      s.goal.orders = {};
      sections.slice(0,n).forEach(sec=>{s.goal.orders[sec.id]=initial.filter(q=>q.section===sec.id).map(q=>q.id).reverse();});
    } else if(s.scenario === 'validation') {
      // Every run exposes every supported validator; difficulty changes how many fields need editing.
      const rules = [
        {preset:'Number range',min:String(rng.int(ood?-100:1,ood?-10:8)),max:String(rng.int(ood?1000:20,ood?5000:90)),required:true},
        {preset:'Text length',min:String(rng.int(2,8)),max:String(rng.int(ood?500:80,ood?2000:180)),required:true},
        {preset:rng.pick(['Email address','Pattern: letters only','Pattern: website URL']),min:'',max:'',required:rng.bool()}
      ];
      s.goal.validation = {};
      const candidates = [initial.find(q=>q.type==='Number') || initial[0], initial.find(q=>q.type==='Paragraph') || initial[initial.length-1], initial[0]];
      rules.slice(0,Math.min(n,3)).forEach((rule,i)=> {
        const q = candidates[i];
        q.type = rule.preset === 'Number range' ? 'Number' : i===1 ? 'Paragraph' : 'Short text';
        s.goal.validation[q.id] = rule;
      });
    } else {
      s.goal.settings = {emails:true,one:level==='easy'?false:true,closeEnabled:true,
        closeDate:C.randomDate(rng,{from:ood?'2030-01-01':'2027-01-01',to:ood?'2034-12-28':'2028-12-28'})};
    }
    if(opts.judge === 'impossible') {
      const rule = rng.pick([
        'one-time email verification codes', 'live inventory checks', 'digital signature verification',
        'postal address deliverability', 'membership registry matching', 'external ticket validity checks',
        'calendar overlap detection', 'remote file malware scanning', 'employee directory verification',
        'reservation status lookup', 'domain ownership verification', 'database duplicate checks'
      ]);
      s.judge = {mode:'impossible',rule,what:[rule],required:rng.bool(),message:`I cannot configure ${rule}: this builder only supports built-in validation rules.`};
    }
    return s;
  }
  function init(s, rng) {
    let m = {questions:clone(s.initial),sectionOrder:s.sections.map(x=>x.id),orders:{},rules:{},
      settings:{emails:false,one:false,closeEnabled:false,closeDate:''},serial:0,
      ui:{tab:'questions',section:'s0',selected:s.initial[0].id,open:null}};
    s.sections.forEach(sec=>{m.orders[sec.id]=m.questions.filter(q=>q.section===sec.id).map(q=>q.id);});
    if(s.judge || s.startMode === 'solved') return solve(s,m);
    if(s.startMode === 'partial') {
      if(s.scenario==='addq') {
        const q=s.goal.add[0]; m=apply(m,s,{add:q.type}); m=apply(m,s,{field:['title',q.title]});
        // A partially authored question still lacks options or its final type.
        if(!q.options.length) question(m,m.ui.selected).type=types.find(t=>t!==q.type);
      } else if(s.scenario==='branching') {const r=s.goal.routes[0];m.rules[r.id]={[r.answer]:r.to};if(s.goal.routes.length===1)m.rules[r.id][r.answer]='next';}
      else if(s.scenario==='reorder') m.sectionOrder=clone(s.goal.sectionOrder);
      else if(s.scenario==='validation') {const id=Object.keys(s.goal.validation)[0];question(m,id).validation.preset=s.goal.validation[id].preset;}
      else m.settings.emails=true;
    }
    if(s.startMode === 'wrong') {
      m=solve(s,m);
      if(s.scenario==='addq') question(m,'new0').options.length ? question(m,'new0').options[0]+=' (old)' : question(m,'new0').title+=' (old)';
      else if(s.scenario==='branching') {const r=s.goal.routes[0];m.rules[r.id][r.answer]='next';}
      else if(s.scenario==='reorder') {const a=m.sectionOrder;[a[0],a[1]]=[a[1],a[0]];}
      else if(s.scenario==='validation') {const id=Object.keys(s.goal.validation)[0];question(m,id).validation.max='1';}
      else m.settings.closeDate=C.addDays(s.goal.settings.closeDate,1);
    }
    return m;
  }
  function solve(s, model) {
    const m=clone(model);
    if(s.goal.add) {
      m.questions=m.questions.filter(q=>s.initial.some(b=>b.id===q.id));
      s.goal.add.forEach((q,i)=>m.questions.push({...clone(q),id:`new${i}`,validation:blankValidation()}));
      m.serial=s.goal.add.length;
      s.sections.forEach(sec=>{m.orders[sec.id]=m.questions.filter(q=>q.section===sec.id).map(q=>q.id);});
    }
    if(s.goal.routes)s.goal.routes.forEach(r=>{(m.rules[r.id] ||= {})[r.answer]=r.to;});
    if(s.goal.sectionOrder)m.sectionOrder=clone(s.goal.sectionOrder);
    if(s.goal.orders)Object.assign(m.orders,clone(s.goal.orders));
    if(s.goal.validation)Object.entries(s.goal.validation).forEach(([id,v])=>{question(m,id).validation=clone(v);});
    if(s.goal.settings)m.settings=clone(s.goal.settings);
    return m;
  }
  function error(m,s) {
    const errors=[];
    // Existing question identity, content and membership must survive every editing workflow.
    for(const base of s.initial) {
      const q=question(m,base.id);
      errors.push(!q?1:(textError(q.title,base.title)+(q.type!==base.type?1:0)+countError(q.options,base.options)+(q.section!==base.section?1:0))/4);
      if(q && !s.goal.validation?.[q.id]) errors.push(...Object.keys(base.validation).map(k=>q.validation[k]===base.validation[k]?0:1));
    }
    const added=m.questions.filter(q=>!s.initial.some(b=>b.id===q.id));
    if(s.goal.add) {
      const expected=s.goal.add;
      errors.push(Math.min(1,Math.abs(added.length-expected.length)/Math.max(1,expected.length)));
      expected.forEach((b,i)=>{
        const q=added[i];
        errors.push(!q?1:(textError(q.title,b.title)+(q.type===b.type?0:1)+countError(q.options,b.options)+(q.section===b.section?0:1))/4);
      });
    } else errors.push(added.length?1:0);
    const expectedRules={};
    (s.goal.routes||[]).forEach(r=>{(expectedRules[r.id] ||= {})[r.answer]=r.to;});
    for(const q of s.initial.filter(q=>choice(q.type))) for(const option of q.options)
      errors.push((m.rules[q.id]?.[option]||'next')===(expectedRules[q.id]?.[option]||'next')?0:1);
    errors.push(countError(m.sectionOrder,s.goal.sectionOrder||s.sections.map(x=>x.id)));
    for(const sec of s.sections) {
      const target=s.goal.orders?.[sec.id] || m.questions.filter(q=>q.section===sec.id).map(q=>q.id);
      errors.push(countError(m.orders[sec.id]||[],target));
    }
    if(s.goal.validation)Object.entries(s.goal.validation).forEach(([id,v])=>{const q=question(m,id);Object.keys(v).forEach(k=>errors.push(q?.validation[k]===v[k]?0:1));});
    const settings=s.goal.settings||{emails:false,one:false,closeEnabled:false,closeDate:''};
    Object.keys(settings).forEach(k=>errors.push(m.settings[k]===settings[k]?0:1));
    return errors.reduce((a,b)=>a+b,0)/Math.max(1,errors.length);
  }
  function apply(model,s,a) {
    const m=clone(model);
    if(a.ui) {Object.assign(m.ui,a.ui);m.ui.open=a.ui.open ?? null;}
    if(a.add) {
      const id=`new${m.serial++}`,section=m.ui.section;
      m.questions.push({id,section,title:'Untitled question',type:a.add,options:choice(a.add)?['Option 1']:[],validation:blankValidation()});
      m.orders[section].push(id);m.ui.selected=id;m.ui.open=null;
    }
    if(a.remove) {
      const q=question(m,a.remove);if(q){m.questions=m.questions.filter(q=>q.id!==a.remove);m.orders[q.section]=m.orders[q.section].filter(id=>id!==a.remove);m.ui.selected=m.orders[q.section][0]||null;}
    }
    if(a.field) {
      const [k,v]=a.field,q=question(m,m.ui.selected);
      if(k==='closeDate')m.settings.closeDate=v;
      else if(q) {if(k==='title')q.title=v;else if(k==='options')q.options=v.split('\n').filter(x=>x.trim());else q.validation[k]=v;}
    }
    if(a.toggle) {const k=a.toggle;if(k==='required') {const q=question(m,m.ui.selected);if(q)q.validation.required=!q.validation.required;} else m.settings[k]=!m.settings[k];}
    if(a.pick) {
      const [k,v]=a.pick,q=question(m,m.ui.selected);
      if(q && k==='type'){q.type=v;if(!choice(v))q.options=[];else if(!q.options.length)q.options=['Option 1'];}
      else if(q && k==='preset'){q.validation.preset=v;if(!['Number range','Text length'].includes(v)){q.validation.min='';q.validation.max='';}}
      else if(q && k.startsWith('route:')) {(m.rules[q.id] ||= {})[q.options[Number(k.slice(6))]]=v;}
      m.ui.open=null;
    }
    if(a.order){const [list,ids]=a.order;if(list==='sections')m.sectionOrder=ids.slice();else m.orders[m.ui.section]=ids.slice();}
    return m;
  }
  function rawPlan(m,s) {
    const tab=t=>m.ui.tab!==t?{click:{tab:t}}:null;
    const select=id=>{const q=question(m,id);if(m.ui.section!==q.section)return {click:{section:q.section}};if(m.ui.selected!==id)return {click:{question:id}};return null;};
    const pick=(k,v)=>m.ui.open===k?{click:{pick:[k,v]}}:{click:{open:k}};
    if(s.judge)return {finish:true,message:s.judge.message};
    if(s.scenario==='addq') {
      const t=tab('questions');if(t)return t;
      if(m.ui.section!=='s0')return {click:{section:'s0'}};
      const added=m.questions.filter(q=>!s.initial.some(b=>b.id===q.id));
      if(added.length>s.goal.add.length)return {click:{remove:added[added.length-1].id}};
      for(let i=0;i<s.goal.add.length;i++) {
        const b=s.goal.add[i],q=added[i];
        if(!q)return m.ui.open==='add'?{click:{pick:['add',b.type]}}:{click:{add:true}};
        if(q.title!==b.title || q.type!==b.type || !sameJson(q.options,b.options)) {
          const sel=select(q.id);if(sel)return sel;
          if(q.title!==b.title)return {type:[{field:'title'},b.title]};
          if(q.type!==b.type)return pick('type',b.type);
          return {type:[{field:'options'},b.options.join('\n')]};
        }
      }
    } else if(s.scenario==='branching') {
      const t=tab('logic');if(t)return t;
      for(const r of s.goal.routes)if((m.rules[r.id]?.[r.answer]||'next')!==r.to) {
        const sel=select(r.id);if(sel)return sel;
        return pick(`route:${question(m,r.id).options.indexOf(r.answer)}`,r.to);
      }
    } else if(s.scenario==='reorder') {
      const t=tab('arrange');if(t)return t;
      const reorder=(list,current,target)=>{const i=target.findIndex((id,j)=>current[j]!==id);return i<0?null:{drag:[{list,item:target[i]},{list,slot:i,item:target[i]}]};};
      const p=reorder('sections',m.sectionOrder,s.goal.sectionOrder);if(p)return p;
      for(const [sec,ids]of Object.entries(s.goal.orders))if(!sameJson(m.orders[sec],ids)) {
        if(m.ui.section!==sec)return {click:{section:sec}};
        return reorder('questions',m.orders[sec],ids);
      }
    } else if(s.scenario==='validation') {
      const t=tab('questions');if(t)return t;
      for(const [id,v]of Object.entries(s.goal.validation)) {
        const q=question(m,id);
        if(!sameJson(q.validation,v)) {
          const sel=select(id);if(sel)return sel;
          if(q.validation.preset!==v.preset)return pick('preset',v.preset);
          for(const k of ['min','max'])if(q.validation[k]!==v[k])return {type:[{field:k},v[k]]};
          if(q.validation.required!==v.required)return {click:{toggle:'required'}};
        }
      }
    } else {
      const t=tab('settings');if(t)return t;
      for(const k of ['emails','one','closeEnabled'])if(m.settings[k]!==s.goal.settings[k])return {click:{toggle:k}};
      if(m.settings.closeDate!==s.goal.settings.closeDate)return {type:[{field:'closeDate'},s.goal.settings.closeDate]};
    }
    return null;
  }
  function plan(m,s) {
    const p=rawPlan(m,s);if(!p)return p;
    const targets=p.drag || (p.type?[p.type[0]]:p.click?[p.click]:[]);
    for(const t of targets) {const hidden=m.view?.hidden?.[targetKey(t)];if(hidden)return {wheel:[{pane:hidden.pane},hidden.dir*160]};}
    return p;
  }
  function instruction(s,rng) {
    let details;
    const title=id=>s.initial.find(q=>q.id===id).title;
    if(s.judge)details=`Configure response validation: "${title(s.initial[0].id)}": ${s.judge.rule}, ${s.judge.required?'required':'optional'}.`;
    else if(s.scenario==='addq')details=`Add these questions in order to "${s.sections[0].title}": ${s.goal.add.map(q=>`"${q.title}" (${q.type}${q.options.length?`; options in order: ${q.options.map(x=>`"${x}"`).join(', ')}`:''})`).join('; ')}. Keep the existing questions.`;
    else if(s.scenario==='branching')details=`Set answer routing: ${s.goal.routes.map(r=>`for "${title(r.id)}", if the answer is "${r.answer}", go to "${s.sections.find(x=>x.id===r.to).title}"`).join('; ')}. Let everyone else continue to the next section.`;
    else if(s.scenario==='reorder')details=`Arrange sections in this order: ${s.goal.sectionOrder.map(id=>`"${s.sections.find(x=>x.id===id).title}"`).join(', ')}. ${Object.entries(s.goal.orders).map(([id,qs])=>`In "${s.sections.find(x=>x.id===id).title}", order questions: ${qs.map(q=>`"${title(q)}"`).join(', ')}.`).join(' ')}`;
    else if(s.scenario==='validation')details=`Configure response validation: ${Object.entries(s.goal.validation).map(([id,v])=>`"${title(id)}": ${v.preset}${v.min!==''?` from ${v.min} to ${v.max} inclusive`:''}, ${v.required?'required':'optional'}`).join('; ')}.`;
    else details=`${s.goal.settings.emails?'Collect respondents’ email addresses':'Do not collect respondents’ email addresses'}, ${s.goal.settings.one?'limit each person to one response':'allow multiple responses per person'}, and close the form after ${s.goal.settings.closeDate} (YYYY-MM-DD).`;
    return I.say(rng,I.phrase(rng,[
      'Update "{form}". {details}', 'Edit the draft "{form}": {details}', 'Make these changes in "{form}". {details}',
      'Prepare "{form}" using this brief: {details}', 'Revise "{form}" as follows. {details}',
      '"{form}" needs these edits: {details}', '{details} Apply this to "{form}".',
      'Your assignment for "{form}": {details}', 'Bring "{form}" into line: {details}',
      'Work on "{form}" as directed: {details}', 'The task concerns "{form}": {details}',
      '{details} This is for "{form}".'
    ],{form:s.title,details},s.isplit),{isplit:s.isplit});
  }
  function silent(next,prev,s,rng) {
    if(s.judge)return null;
    const candidates=[];
    for(const q of next.questions) {
      const old=question(prev,q.id);
      if(!old) {const m=clone(next);m.questions=m.questions.filter(x=>x.id!==q.id);m.orders[q.section]=m.orders[q.section].filter(id=>id!==q.id);m.ui.selected=prev.ui.selected;candidates.push(m);continue;}
      for(const k of ['title','type','options','validation'])if(!sameJson(q[k],old[k])) {const m=clone(next);question(m,q.id)[k]=clone(old[k]);candidates.push(m);}
    }
    for(const k of ['rules','settings','sectionOrder','orders'])if(!sameJson(next[k],prev[k])) {const m=clone(next);m[k]=clone(prev[k]);if(k!=='orders'||sameJson(m.questions.map(q=>q.id),prev.questions.map(q=>q.id)))candidates.push(m);}
    const valid=candidates.filter(m=>error(m,s)>0);return valid.length?rng.pick(valid):null;
  }
  function retarget(spec,m,rng) {
    if(spec.judge)return null;
    const s=clone(spec),g=s.goal;
    if(g.add) {const q=g.add[0];q.type=q.type==='Short text'?'Paragraph':'Short text';q.options=[];}
    else if(g.routes) {const r=g.routes[0];r.to=rng.pick(s.sections.map(x=>x.id).filter(id=>id!==(m.rules[r.id]?.[r.answer]||'next')));}
    else if(g.sectionOrder) {g.sectionOrder=clone(m.sectionOrder);g.sectionOrder.push(g.sectionOrder.shift());}
    else if(g.validation) {const id=Object.keys(g.validation)[0];g.validation[id].required=!question(m,id).validation.required;}
    else g.settings.emails=!m.settings.emails;
    return error(m,s)>0?s:null;
  }
  function parts(m,s) {
    const t=id=>question(m,id)?.title||id,sec=id=>s.sections.find(x=>x.id===id).title;
    return [...m.questions.map(q=>({name:q.title,value:[q.type,q.options,q.validation]})),
      {name:'Section order',value:m.sectionOrder.map(sec)},
      ...s.sections.map(x=>({name:`Questions in "${x.title}"`,value:(m.orders[x.id]||[]).map(t)})),
      ...Object.entries(m.rules).filter(([,r])=>Object.keys(r).length).map(([id,r])=>({name:`Routing for "${t(id)}"`,value:r})),
      {name:'Collect email addresses',value:m.settings.emails},{name:'Limit to one response',value:m.settings.one},
      {name:'Close on a date',value:m.settings.closeEnabled},{name:'Closing date',value:m.settings.closeDate}];
  }
  env.task({name:'use-form-builder',reply:true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios:['addq','branching','reorder','validation','settings'],
    inputs:['pointer','keyboard','wheel'],startModes:['off','partial','wrong','solved'],judgeModes:['impossible'],
    sample,init,error,tolerance:()=>({tau:0,sigma:0.12,minInitialError:0.0001}),instruction,plan,solve,
    facts:(m,s)=>[{label:'Form ID',value:s.ref},{label:'Response fields',value:String(m.questions.length)},{label:'Estimated time',value:estimate(m)}],
    silent,retarget,parts,
    helpers:{apply,question,types,presets,targetKey}});
})();
