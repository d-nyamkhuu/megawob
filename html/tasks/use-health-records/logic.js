/*
 * use-health-records: book appointments, enter orders, reconcile medications, chart vitals and manage beds.
 * Fictional electronic health records; no real patients or medical advice.
 * Real-app counterparts: outpatient scheduling, computerized order entry, medication
 * reconciliation, nursing flowsheets and inpatient bed management with transfer checks.
 *
 * Scenarios: appointment (provider calendar, visit type and duration), order (lab or
 * medication with exact dose/unit/frequency/route), medrec (continue/stop/modify each
 * medication), vitals (BP slash format, temperature/unit, oxygen saturation percent),
 * beds (drag a patient to a bed satisfying isolation, sex cohort and acuity).
 * spec: {scenario,level,ood,isplit,csplit,startMode,patient:{name,dob,mrn,sex,
 * isolation,acuity},providers[],date,code,nextAppointment,fields:[{id,label,options?,
 * hint?,check?}],initial:{id:string},goal:{id:string},meds[],observations[],
 * observation?,slots[],busy[],beds[],occupants[],destination,judge?}.
 * model: {fields:{id:string},saved:null|{id:string},placements:{patientId:bedId},
 * selectedPatient,notice,view:null|{top,height,max,pos:{targetKey:[top,bottom]}}}.
 * Error: graded wrong draft and persisted fields (including collateral edits); bed
 * distance gives credit for a compatible ward transfer before the exact bed. tau=0.
 * startModes: off (blank/default), partial (some fields right / compatible bed),
 * wrong (nearby values / other compatible bed), solved. Levels reduce record count
 * and distractors; ood adds longer shifts, doses, records and alternative units.
 * Targets: {field:id}, {choice:[id,value]}, {slot:[provider,time]}, {save:true},
 * {patient:id}, {bed:id}, {pane:true}. plan() scrolls inner panes before interaction.
 * Helpers (widget API, env.taskDef.helpers):
 *   time(minutes): format minutes since midnight as HH:MM.
 *   valid(fields,spec): return a draft validation notice, or an empty string.
 *   compatible(bed,patient): whether a free bed meets the patient's care requirements.
 *   status(model,spec): visible record status.
 *   save(model,spec): validate and persist a draft, or return its validation notice.
 * Tests live in tasks/use-health-records/selftest.js (loaded only by the checker and node tests).
 * facts(model,spec): visible MRN and next appointment, plus resulting record status
 * and an encounter reference; these are read from the page rather than goal copies.
 * Label paraphrases ('Medical record number') go in labels, never in aliases (spellings of the value).
 * parts(model,spec): preempt=cancel; each field by its page label (value: its draft text), beds: each bed (value: whether the patient is in it).
 * silent(next,prev,spec,rng): a newly improved dose/temperature unit silently changes;
 * returns a copy above tau, repairable by selecting the unit and saving again.
 * retarget(spec,model,rng): another provider time, order frequency, reconciliation
 * dose, existing observation set or compatible bed, preserving all scene content.
 * judgeModes: confirm prepares an order but asks before signing (widget flags signing);
 * ambiguous shows two patients with the same name and different DOBs / MRNs, leaves both
 * records untouched; the reply asks (status ask) with one option per record (spec.judge.cands:
 * [MRN, DOB] of each). The instruction omits the DOB but otherwise reads like a normal one.
 */
(function () {
  'use strict';
  const C=env.content, I=env.instruct, U=env.util;
  const scenarios=['appointment','order','medrec','vitals','beds'];
  // Original fictional formulary names, used only in this simulated chart.
  const MEDS=['Avenol','Belvex','Ceralin','Dovarel','Elunex','Ferenil','Gavora','Hesorin', 'Povelin'];
  const LABS=[
    'Complete blood count', 'Basic metabolic panel', 'Hepatic function panel', 'Thyroid screening panel',
    'Renal function panel', 'Celiac serology panel', 'Autoimmune liver panel'
  ];
  const TYPES=['Follow-up','New consultation','Procedure review','Annual review'];
  const time=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
  const snapshot=m=>U.clone(m.fields);
  const ambiguous=s=>s.judge?.mode==='ambiguous';
  const confirm=s=>s.judge?.mode==='confirm';
  function compatible(b,p) {
    return !b.occupied && (b.sex==='Any'||b.sex===p.sex) &&
      (p.isolation==='None'||b.isolation===p.isolation) && b.acuity>=p.acuity;
  }
  function bedError(m,s) {
    const id=m.placements.patient;
    if(id===s.destination) return 0;
    const b=s.beds.find(b=>b.id===id);
    return b&&compatible(b,s.patient)?0.4:1;
  }
  function base(s) {
    return {fields:U.clone(s.initial),saved:null,placements:{patient:'ED-01'},
      selectedPatient:0,notice:'',view:null};
  }
  function error(m,s) {
    if(ambiguous(s)) {
      let n=m.selectedPatient!==0?1:0;
      for(const f of s.fields) n+=m.fields[f.id]!==s.initial[f.id]?1:0;
      return n+(m.saved?1:0)+(m.placements.patient!=='ED-01'?1:0);
    }
    if(s.scenario==='beds') return bedError(m,s);
    let n=0;
    for(const f of s.fields) {
      n+=m.fields[f.id]!==s.goal[f.id]?1:0;
      if(!confirm(s)) n+=m.saved?.[f.id]!==s.goal[f.id]?1:0;
    }
    return n/(s.fields.length*(confirm(s)?1:2));
  }
  function valid(fields,s) {
    for(const f of s.fields) {
      const v=fields[f.id];
      if(!v || (f.options&&!f.options.includes(v))) return `${f.label}: choose a value.`;
      if(f.check==='number'&&(!/^\d+(\.\d+)?$/.test(v)||Number(v)<=0)) return `${f.label}: use a positive number.`;
      if(f.check==='bp'&&!/^\d{2,3}\/\d{2,3}$/.test(v)) return 'Blood pressure: use systolic/diastolic, e.g. 120/80.';
      if(f.check==='temp'&&!/^\d{2,3}\.\d$/.test(v)) return 'Temperature: use one decimal place.';
      if(f.check==='spo2'&&!/^(100|[1-9]\d)%$/.test(v)) return 'SpO2: include the percent sign, e.g. 98%.';
      if(f.check==='integer'&&!/^\d{1,3}$/.test(v)) return `${f.label}: use whole digits.`;
    }
    if(s.scenario==='appointment') {
      const start=Number(fields.slot),duration=Number(fields.duration);
      if(!s.slots.includes(start)||start+duration>s.close||s.busy.some(b=>b.provider===fields.provider&&start<b.start+b.duration&&start+duration>b.start))
        return 'Scheduling conflict: choose a free interval for the full visit duration.';
    }
    return '';
  }
  function save(m,s) {
    const notice=valid(m.fields,s);
    return notice?{...m,notice}:{...m,saved:snapshot(m),notice:''};
  }
  function status(m,s) {
    if(ambiguous(s)) return 'Patient identification pending';
    if(s.scenario==='beds') return m.placements.patient==='ED-01'?'Awaiting placement':'Transfer recorded';
    if(!m.saved) return confirm(s)?'Unsigned draft':'Unsaved changes';
    if(s.fields.some(f=>m.fields[f.id]!==m.saved[f.id])) return 'Unsaved changes';
    return {appointment:'Scheduled',order:'Signed',medrec:'Reconciled',vitals:'Charted'}[s.scenario];
  }
  function reveal(m,key) {
    const v=m.view,p=v?.pos[key];
    if(!p||v.max<1) return null;
    // A scrolled calendar slides its sticky provider header over the top of the pane: keep slots below it.
    const top=key.startsWith('slot:')&&v.top>0?40:2;
    if(p[0]>=v.top+top&&p[1]<=v.top+v.height-2) return null;
    const target=U.clamp((p[0]+p[1]-v.height)/2,0,v.max);
    return Math.abs(target-v.top)>2?{wheel:[{pane:true},target-v.top]}:null;
  }
  function sample(rng,opts) {
    const cr=rng.fork('content'),level=opts.level||'normal';
    const pick=list=>C.pick(cr,list,{csplit:opts.csplit});
    const name=()=>C.personName(cr,{csplit:opts.csplit}).full;
    const scenario=opts.judge==='confirm'?'order':opts.scenario||rng.pick(opts.scenarios||scenarios);
    const s={scenario,level,ood:!!opts.ood,isplit:opts.isplit,csplit:opts.csplit,
      startMode:opts.startMode||'off',patient:{name:name(),dob:`${rng.int(1954,2003)}-0${rng.int(1,9)}-${rng.int(10,28)}`,
        mrn:`FH-${rng.int(100000,999999)}`,sex:rng.pick(['Female','Male']),isolation:rng.pick(['None','Contact','Airborne']),acuity:rng.int(1,3)},
      providers:Array.from({length:level==='easy'?2:3},()=>`Dr. ${name()}`),
      date:'18 Oct 2027',code:`ENC-${C.alnum(cr,7)}`,nextAppointment:`${rng.int(21,28)} Nov 2027 · ${time(rng.int(9,15)*60)}`,
      fields:[],initial:{},goal:{},meds:[],observations:[],slots:[],busy:[],beds:[],occupants:[]};
    const add=(id,label,value,options,hint,check,initial='')=>{
      s.fields.push({id,label,options,hint,check});s.initial[id]=initial;s.goal[id]=String(value);
    };
    if(scenario==='appointment') {
      s.open=opts.ood?480:540;s.close=opts.ood?1080:960;
      for(let t=s.open;t<s.close;t+=30) s.slots.push(t);
      for(const [i,provider] of s.providers.entries())
        for(const start of [s.open+30,s.open+90+i*30,s.open+180,s.open+270-(i%2)*30,s.open+330,s.close-60])
          s.busy.push({provider,start,duration:30,name:name()});
      const duration=rng.pick(level==='easy'?[30]:opts.ood?[45,90]:[30,60]);
      const provider=rng.pick(s.providers);
      const candidates=s.slots.filter(t=>t+duration<=s.close&&!s.busy.some(b=>b.provider===provider&&t<b.start+b.duration&&t+duration>b.start));
      add('provider','Provider',provider,s.providers);
      add('type','Visit type',pick(TYPES),level==='easy'?TYPES.slice(0,2):TYPES);
      if(!s.fields[1].options.includes(s.goal.type)) s.goal.type=s.fields[1].options[0];
      add('duration','Duration (minutes)',duration,['15','30','45','60','90']);
      add('slot','Start time',rng.pick(candidates),null,'Choose an interval on the calendar.');
    } else if(scenario==='order') {
      s.orderKind=rng.bool()?'Medication':'Laboratory';
      const lab=s.orderKind==='Laboratory';
      // 4 choices (2 easy) either way: the designs' item lists show four rows
      const catalog=lab?cr.sample(LABS,level==='easy'?2:4):C.sample(cr,MEDS,level==='easy'?2:4,{csplit:opts.csplit});
      add('item',lab?'Lab panel':'Medication',rng.pick(catalog),catalog);
      add('dose',lab?'Quantity':'Dose',lab?'1':rng.pick(opts.ood?['0.25','7.5','125']:['5','10','25']),null,lab?'Number of panels':'Numeric dose only','number');
      add('unit','Dose unit',lab?'panel':rng.pick(opts.ood?['mcg','mL']:['mg','mcg']),lab?['panel','sample']:['mg','mcg','mL']);
      add('frequency','Frequency',lab?'Once':rng.pick(['Once daily','Twice daily','Every 8 hours']),lab?['Once','Daily']:['Once daily','Twice daily','Every 8 hours','At bedtime']);
      add('route','Route',lab?'Venous':rng.pick(['Oral','Subcutaneous']),lab?['Venous','Capillary']:['Oral','Subcutaneous','Topical']);
      add('priority','Priority',level==='easy'?'Routine':rng.pick(['Routine','Urgent']),['Routine','Urgent']);
    } else if(scenario==='medrec') {
      const n=level==='easy'?3:level==='medium'?4:opts.ood?6:5;
      const meds=C.sample(cr,MEDS,n,{csplit:opts.csplit});
      const actions=rng.shuffle(meds.map((m,i)=>['Continue','Stop','Modify'][i%3]));
      meds.forEach((name,i)=>{
        const id=`m${i}`,dose=String((i+1)*5),unit=i%3===2?'mcg':'mg',action=actions[i];
        s.meds.push({id,name,dose,unit,frequency:i%2?'Twice daily':'Once daily'});
        add(`${id}-action`,`${name} action`,action,['Continue','Stop','Modify'],null,null,'Unreviewed');
        add(`${id}-dose`,`${name} dose`,action==='Modify'?String((i+2)*5):dose,null,'Numeric dose','number',dose);
        add(`${id}-unit`,`${name} unit`,action==='Modify'&&opts.ood?'mL':unit,['mg','mcg','mL'],null,null,unit);
      });
    } else if(scenario==='vitals') {
      s.observations=Array.from({length:2},(_,i)=>({id:i,time:i?'14:30':'09:15',
        bp:`${rng.int(110,139)}/${rng.int(65,89)}`,temp:(rng.int(362,378)/10).toFixed(1),
        tunit:'°C',spo2:`${rng.int(94,100)}%`,pulse:String(rng.int(62,98)),resp:String(rng.int(12,20))}));
      if(opts.ood) {s.observations[1].temp=(rng.int(975,1002)/10).toFixed(1);s.observations[1].tunit='°F';}
      s.observation=rng.int(0,1);const o=s.observations[s.observation];
      add('time','Observed at',o.time,s.observations.map(o=>o.time));
      add('bp','Blood pressure',o.bp,null,'120/80 · mmHg','bp');
      add('temp','Temperature',o.temp,null,'One decimal place','temp');
      add('tunit','Temperature unit',o.tunit,['°C','°F']);
      add('spo2','SpO2',o.spo2,null,'98% · include %','spo2');
      if(level!=='easy') add('pulse','Pulse',o.pulse,null,'bpm · whole digits','integer');
      if(level==='normal') add('resp','Respiratory rate',o.resp,null,'/min · whole digits','integer');
    } else {
      const p=s.patient;
      p.acuity=rng.pick([2,3]);
      const bed=(id,sex,isolation,acuity,occupied=false)=>({id,sex,isolation,acuity,occupied});
      s.beds=[bed('N-101',p.sex,p.isolation,3),bed('N-102','Any',p.isolation,3),
        bed('N-103',p.sex==='Female'?'Male':'Female',p.isolation,3),
        bed('N-104',p.sex,'None',3),
        bed('S-201',p.sex,p.isolation,Math.max(0,p.acuity-1)),bed('S-202',p.sex,p.isolation,3,true)];
      // The general room is an isolation distractor even when the patient needs no precautions.
      if(p.isolation==='None') s.beds[3].occupied=true;
      if(level==='easy') s.beds=s.beds.filter(b=>['N-101','N-102','N-103','S-202'].includes(b.id));
      if(opts.ood) s.beds.push(bed('S-203','Any','Contact',1),bed('S-204','Any','Airborne',2));
      s.occupants=s.beds.filter(b=>b.occupied).map(b=>({bed:b.id,name:name(),mrn:`FH-${rng.int(100000,999999)}`}));
      s.destination=rng.pick(['N-101','N-102']);
    }
    if(opts.judge==='ambiguous') {
      s.duplicate={...s.patient,dob:`${Number(s.patient.dob.slice(0,4))-7}${s.patient.dob.slice(4)}`,mrn:`FH-${rng.int(100000,999999)}`};
      s.judge={mode:'ambiguous',slot:'date of birth',cands:[[s.patient.mrn,s.patient.dob],[s.duplicate.mrn,s.duplicate.dob]],
        message:`Which ${s.patient.name} do you mean: MRN ${s.patient.mrn} or MRN ${s.duplicate.mrn}?`};
    } else if(opts.judge==='confirm') s.judge={mode:'confirm',slot:'sign',message:`The order is prepared for ${s.patient.name}. Should I sign it now?`};
    return s;
  }
  function solve(s,m) {
    const n=m?U.clone(m):base(s);
    if(ambiguous(s)) return base(s);
    n.fields=U.clone(s.goal);n.saved=confirm(s)?null:U.clone(s.goal);
    if(s.scenario==='beds') n.placements.patient=s.destination;
    n.notice='';return n;
  }
  const task={name:'use-health-records',scenarios,startModes:['off','partial','wrong','solved'],
    inputs:['pointer','keyboard','wheel'],judgeModes:['confirm','ambiguous'],
    reply:true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    helpers:{time,valid,compatible,status,save},sample,error,
    init(s) {
      const m=base(s);
      if(ambiguous(s)) return m;
      if(s.startMode==='solved') return solve(s,m);
      if(s.startMode==='partial'||s.startMode==='wrong') {
        if(s.scenario==='beds') m.placements.patient=s.destination==='N-101'?'N-102':'N-101';
        else if(s.startMode==='partial') s.fields.slice(0,Math.ceil(s.fields.length/2)).forEach(f=>{m.fields[f.id]=s.goal[f.id];});
        else {
          m.fields=U.clone(s.goal);
          const f=s.fields.find(f=>f.options&&f.options.length>1)||s.fields[0];
          m.fields[f.id]=f.options?f.options.find(v=>v!==s.goal[f.id]):`${s.goal[f.id]}0`;
          if(!confirm(s)) m.saved=snapshot(m);
        }
      }
      return m;
    },
    tolerance:()=>({tau:0,sigma:0.5,minInitialError:0.001}),
    instruction(s,rng) {
      const vars={patient:s.patient.name,dob:s.patient.dob,details:''};let templates;
      if(s.scenario==='appointment') {
        vars.details=`${s.goal.type}, ${s.goal.duration} minutes, with ${s.goal.provider} on ${s.date} at ${time(Number(s.goal.slot))}`;
        templates=['Schedule {patient} (DOB {dob}) for {details}.','Book this visit for {patient}, born {dob}: {details}.'];
      } else if(s.scenario==='order') {
        vars.details=`${s.goal.item}, ${s.goal.dose} ${s.goal.unit}, ${s.goal.frequency}, route ${s.goal.route}, priority ${s.goal.priority}`;
        templates=confirm(s)?['Prepare an order for {patient} (DOB {dob}): {details}. Ask for my confirmation before signing it.',
          'Enter {details} for {patient}, born {dob}. Leave it unsigned and ask whether to sign.']:
          ['Enter and sign this order for {patient} (DOB {dob}): {details}.','Place a signed order for {patient}, born {dob}: {details}.'];
      } else if(s.scenario==='medrec') {
        vars.details=s.meds.map(m=>`${s.goal[`${m.id}-action`]} ${m.name}${s.goal[`${m.id}-action`]==='Modify'?` to ${s.goal[`${m.id}-dose`]} ${s.goal[`${m.id}-unit`]}`:''}`).join('; ');
        templates=['Reconcile medications for {patient} (DOB {dob}): {details}. Keep unmentioned doses and frequencies unchanged.',
          'Complete medication review for {patient}, born {dob}: {details}. Preserve all other medication details.'];
      } else if(s.scenario==='vitals') {
        vars.details=s.observations[s.observation].time;
        templates=['Chart the {details} nursing observations for {patient} (DOB {dob}), retaining the recorded units.',
          'Add the nursing observations taken at {details} to the encounter for {patient}, born {dob}. Keep the original units.'];
      } else {
        vars.details=s.destination;
        templates=['Transfer {patient} (DOB {dob}) to bed {details}, maintaining their isolation precautions and required level of care.',
          'Assign bed {details} to {patient}, born {dob}. The placement must meet the sex cohort, isolation and acuity requirements.'];
      }
      // Ambiguous: the same sentence without the date of birth, so the name matches two records.
      if(ambiguous(s)) templates=templates.map(t=>t.replace(' (DOB {dob})','').replace(', born {dob}',''));
      return I.say(rng,I.phrase(rng,templates,vars,s.isplit),{isplit:s.isplit,noise:0});
    },
    plan(m,s) {
      if(ambiguous(s)) return {finish:true,message:s.judge.message};
      if(s.scenario==='beds') {
        if(m.placements.patient===s.destination) return null;
        const sc=reveal(m,`bed:${s.destination}`)||reveal(m,'patient');if(sc) return sc;
        return {drag:[{patient:'patient'},{bed:s.destination}]};
      }
      for(const f of s.fields) if(m.fields[f.id]!==s.goal[f.id]) {
        if(s.scenario==='appointment'&&f.id==='slot') {
          const key=`slot:${s.goal.provider}:${s.goal.slot}`,cal=reveal(m,key);if(cal) return cal;
          return {click:{slot:[s.goal.provider,s.goal.slot]}};
        }
        const sc=reveal(m,f.id);if(sc) return sc;
        return f.options?{click:{choice:[f.id,s.goal[f.id]]}}:{type:[{field:f.id},s.goal[f.id]]};
      }
      if(confirm(s)) return {finish:true,message:s.judge.message};
      return s.fields.some(f=>m.saved?.[f.id]!==s.goal[f.id])?{click:{save:true}}:null;
    },solve,
    facts(m,s) {
      if(ambiguous(s)) return [{label:'Matching records',value:'2'}, {label:'Record status',value:status(m,s)}];
      return [{label:'MRN',value:s.patient.mrn,labels:['Medical record number']},
        {label:'Next appointment',value:s.scenario==='appointment'&&m.saved?`${s.date} · ${time(Number(m.saved.slot))}`:s.nextAppointment},
        {label:'Record status',value:status(m,s)}, {label:'Encounter reference',value:s.code}];
    },
    parts(m,s) {
      if(s.scenario==='beds') return ['ED-01',...s.beds.map(b=>b.id)].map(id=>({name:`Bed ${id}`,value:m.placements.patient===id}));
      return s.fields.map(f=>({name:f.label,value:m.fields[f.id]}));
    },
    silent(next,prev,s,rng) {
      if(s.judge) return null;
      const units=s.fields.filter(f=>/unit$/.test(f.id)&&f.options?.length>1&&next.fields[f.id]===s.goal[f.id]&&
        (prev.fields[f.id]!==next.fields[f.id]||(!prev.saved&&next.saved)));
      if(!units.length) return null;
      const f=rng.pick(units),n=U.clone(next),other=f.options.filter(v=>v!==s.goal[f.id]);
      n.fields[f.id]=rng.pick(other);
      if(n.saved) n.saved[f.id]=n.fields[f.id];
      return error(n,s)>0?n:null;
    },
    retarget(s,m,rng) {
      if(s.judge) return null;
      const n=U.clone(s);
      if(s.scenario==='beds') n.destination=s.destination==='N-101'?'N-102':'N-101';
      else if(s.scenario==='appointment') {
        const f=s.fields.find(f=>f.id==='type');n.goal.type=rng.pick(f.options.filter(x=>x!==s.goal.type));
        const slots=s.slots.filter(t=>String(t)!==s.goal.slot&&!valid({...s.goal,slot:String(t)},s));
        if(slots.length) n.goal.slot=String(rng.pick(slots));
      } else if(s.scenario==='order') {
        const f=s.fields.find(f=>f.id==='frequency');n.goal.frequency=rng.pick(f.options.filter(x=>x!==s.goal.frequency));
      } else if(s.scenario==='medrec') {
        const med=s.meds.find(m=>s.goal[`${m.id}-action`]==='Modify')||s.meds[0];
        n.goal[`${med.id}-action`]='Modify';n.goal[`${med.id}-dose`]=String(Number(s.goal[`${med.id}-dose`])+5);
      } else {
        n.observation=1-s.observation;const o=n.observations[n.observation];
        for(const f of n.fields) n.goal[f.id]=o[f.id];
      }
      return error(m,n)>0?n:null;
    }
  };
  env.task(task);
})();
