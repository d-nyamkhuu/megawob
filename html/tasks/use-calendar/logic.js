/*
 * use-calendar: find free slots and move, resize and schedule events in a team calendar.
 * Team scheduling, with day availability, week and month grids.
 * Real-app counterparts: shared calendar scheduling assistants, calendar event drag/drop,
 * duration handles, secondary time-zone rulers and month-view overflow lists.
 *
 * Scenarios: freeslot (first common free interval, drag to create); move (day/time drag);
 * resize (bottom-edge duration drag); timezone (create using a secondary UTC-offset ruler);
 * month (move an all-day event, including from a '+N more' popover).
 * All timed values are integer minutes since midnight, snapped to 15 minutes. Dates use
 * a fictional work scene in a real, fixed 2027 month; no wall time or DST assumptions.
 * spec: {scenario, level, ood, isplit, csplit, startMode, month, firstWeekday, monthDays,
 *   people[], title, room, code, open, close, date, offset, duration, goal:{day,start,duration},
 *   events:[{id,title,day,start,duration,owner,tone}], target, route, judge?}.
 * model: {events:{id:{day,start,duration}}, created, selected, popover:null|date,
 *   view:{top,bottom,px}, monthLimit?:1|2, browse?:-1|0|1, last:null|{events,created}}. UI fields are unscored.
 * error: summed absolute day/start/end displacement in minutes, including collateral
 * changes to other events; missing new meeting costs one workday. Month days cost 1440 min.
 * startModes: off, partial (correct day or 15 minutes short), wrong (nearby wrong time/date), solved.
 * Hooks: facts reports visible End, Room and Booking reference (not goal copies).
 * silent (timed scenarios; month returns null) returns a copy with the changed event's start/end snapped back 15 minutes.
 * retarget changes only goal fields to another free interval/date/duration in the same scene.
 * Judge requests for other scenarios use the matching move/freeslot scene.
 * parts(model,spec): preempt=cancel items: the meeting by title and every event by title, original date and time;
 * value: where it is now (day, start, duration).
 * judgeModes: ambiguous creates two same-title events; the reply asks (status ask) with one option per event, told
 * apart by date and time (spec.judge.cands; others: the titles of the other events, never offered); impossible
 * makes freeslot's attendee calendars fully busy: status impossible, what names the date or the meeting
 * (spec.judge.what), without changing any events.
 * Targets: {event:id}, {edge:id}, {cell:[day,minute]}, {end:[day,minute]},
 * {date:n}, {more:n}, {today:true} (restore the shared dates after browsing),
 * {pane:true}, {thumb:true}, {scroll:px}. plan is closed-loop;
 * scrollbar drags and wheel routes scroll the inner grid before event gestures.
 * Helpers (widget API, env.taskDef.helpers):
 *   time(minutes): format minutes as a 24-hour clock, wrapping at midnight.
 *   dateLabel(spec, day): format a date in the fixed scene month.
 *   endLabel(spec, event): format the event end date/time or all-day label.
 *   change(model, id, patch, spec): snap/clamp an event edit and record its undo state.
 * Self-test: selftest.js (loaded only by the checker and node tests).
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct, U = env.util;
  const scenarios = ['freeslot', 'move', 'resize', 'timezone', 'month'];
  const TITLES = [
    'Release planning', 'Design review', 'Research debrief', 'Sprint kickoff', 'Partner check-in', 'Budget review',
    'Studio standup', 'Roadmap workshop', 'Project handoff', 'Team retrospective', 'Client onboarding',
    'Quality sync', 'Workflow mapping', 'Content review', 'Training session', 'Capacity check', 'Prototype lab',
    'Process alignment', 'Feature showcase', 'Knowledge exchange', 'Launch readiness', 'Usability session',
    'Security briefing', 'Planning clinic', 'Metrics discussion', 'Editorial sync', 'Support huddle',
    'Risk assessment', 'Growth planning', 'Delivery review', 'Leadership forum', 'Customer summit', 'Data governance',
    'Incident review', 'Creative jam', 'Learning circle', 'Service blueprint', 'Quarterly sync', 'Team learning',
    'Product showcase'
  ];
  const MONTHS = [{name:'March', first:0, days:31}, {name:'June', first:1, days:30}, {name:'September', first:2, days:30}, {name:'November', first:0, days:30}];
  const time = n => `${String(Math.floor(((n % 1440) + 1440) % 1440 / 60)).padStart(2, '0')}:${String(((n % 60) + 60) % 60).padStart(2, '0')}`;
  const dateLabel = (s, d) => `${s.month} ${d}, 2027`;
  const endLabel = (s, e) => s.scenario === 'month' ? `${dateLabel(s, e.day)} · All day` : `${dateLabel(s, e.day)} · ${time(e.start + e.duration)}`;
  const original = e => ({day:e.day, start:e.start, duration:e.duration});
  const createScenario = s => s.scenario === 'freeslot' || s.scenario === 'timezone';
  const distance = (a, b) => Math.abs(a.day-b.day)*1440 + Math.abs(a.start-b.start) + Math.abs(a.start+a.duration-b.start-b.duration);
  function freeSlots(s, duration = s.duration) {
    const out = [];
    for (let t=s.open; t+duration<=s.close; t+=15) {
      if (!s.events.some(e => e.id!==s.target && e.day===s.date && t<e.start+e.duration && t+duration>e.start)) out.push(t);
    }
    return out;
  }
  function changed(m, s) {
    let n = createScenario(s) && m.created ? 480 : 0;
    for (const e of s.events) n += distance(m.events[e.id], original(e));
    return n;
  }
  function error(m, s) {
    if (s.judge) return changed(m,s);
    const e = m.events[s.target];
    let n = createScenario(s) && !m.created ? s.close-s.open : distance(e, s.goal);
    for (const o of s.events) if (o.id!==s.target) n += distance(m.events[o.id], original(o));
    return n;
  }
  function base(s) {
    const events = Object.fromEntries(s.events.map(e => [e.id, original(e)]));
    if (createScenario(s)) events[s.target] = {day:s.date, start:s.open, duration:30};
    return {events, created:!createScenario(s), selected:s.target, popover:null,
      view:{top:s.open, bottom:s.open+300, px:0}, last:null};
  }
  function change(m, id, patch, s) {
    const old = m.events[id];
    const e = {...old, ...patch};
    e.day = U.clamp(Math.round(e.day), 1, s.scenario==='month' ? s.monthDays : 12);
    e.duration = U.clamp(Math.round(e.duration/15)*15, 15, s.close-s.open);
    e.start = s.scenario==='month' ? 0 : U.clamp(Math.round(e.start/15)*15, s.open, s.close-e.duration);
    if (s.scenario==='month') e.duration=1440;
    return {...m, events:{...m.events,[id]:e}, created:id===s.target ? true : m.created,
      selected:id, popover:null, last:{events:U.clone(m.events),created:m.created}};
  }
  function scrollPlan(m,s,lo,hi) {
    const v=m.view, span=v.bottom-v.top, margin=12;
    if (lo>=v.top+margin && hi<=v.bottom-margin) return null;
    const max=(s.close-s.open)*0.8-(span*0.8);
    const px=U.clamp(((lo+hi)/2-span/2-s.open)*0.8,0,Math.max(0,max));
    if (Math.abs(px-v.px)<1) return null;
    return s.route==='wheel' ? {wheel:[{pane:true},px-v.px]} : {drag:[{thumb:true},{scroll:px}]};
  }
  const fam = {
    name:'use-calendar',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios, startModes:['off','partial','wrong','solved'],
    inputs:['pointer','wheel'], judgeModes:['ambiguous','impossible'],
    helpers: {time,dateLabel,endLabel,change},
    sample(rng, opts) {
      const cr=rng.fork('content'), level=opts.level||'normal';
      let v=opts.scenario||rng.pick(opts.scenarios||scenarios);
      if(opts.judge==='impossible') v='freeslot';
      if(opts.judge==='ambiguous' && !['move','resize','month'].includes(v)) v='move';
      const mo=rng.pick(v==='month'?MONTHS:MONTHS.filter(m=>m.first===0));
      const s={scenario:v,level,ood:!!opts.ood,isplit:opts.isplit,csplit:opts.csplit,
        startMode:opts.startMode||'off',month:mo.name,firstWeekday:mo.first,monthDays:mo.days,
        people:Array.from({length:level==='easy'?2:level==='medium'?3:4},()=>C.personName(cr,{csplit:opts.csplit}).full),
        title:C.pick(cr,TITLES,{csplit:opts.csplit}),room:C.pick(cr,C.VENUES,{csplit:opts.csplit}),
        code:`BK-${C.alnum(cr,6)}`,open:opts.ood?480:540,close:opts.ood?1140:1020,
        date:8,offset:rng.pick(level==='easy'?[60,120]:[-300,-210,90,330,540]),
        duration:rng.pick(level==='easy'?[30,60]:opts.ood?[45,75,105,150]:[30,45,60,90]),
        target:'meeting',events:[],route:opts.route==='wheel'?'wheel':opts.route==='pointer'?'thumb':rng.pick(['wheel','thumb'])};
      const add=(day,start,duration,title,owner=0)=>s.events.push({id:`e${s.events.length}`,day,start,duration,title,owner,tone:owner%4});
      if(v==='freeslot') {
        const hole=s.open+rng.int(4,12)*15;
        s.people.forEach((p,i)=>{
          add(s.date,s.open,hole-s.open-(i%2)*15,C.pick(cr,TITLES,{csplit:opts.csplit}),i);
          add(s.date,hole+s.duration+rng.int(0,3)*15,60,'Project focus',i);
          if(level!=='easy') add(s.date,s.close-90,60,'Office hours',i);
        });
        s.goal={day:s.date,start:freeSlots(s)[0],duration:s.duration};
      } else if(v==='month') {
        const source=rng.int(6,11), dest=rng.int(16,25);
        for(let k=0;k<4;k++) add(source,0,1440,k===2?s.title:C.pick(cr,TITLES,{csplit:opts.csplit}),k);
        s.target='e2';
        for(let k=0;k<(opts.ood?16:level==='easy'?4:9);k++) add(1+(k*3)%s.monthDays,0,1440,C.pick(cr,TITLES,{csplit:opts.csplit}),k);
        s.goal={day:dest,start:0,duration:1440};
      } else {
        const ar=rng.fork('appointments'), ac=cr.fork('appointments');
        const otherTitles=[
          'Customer feedback', 'Documentation hour', 'Operations review', 'Office hours', 'Research notes',
          'Partner briefing', 'Hiring panel', 'Vendor check-in', 'Workspace setup', 'Access walkthrough',
          'Invoice review', 'Equipment pickup', 'Portfolio tour', 'Facilities check', 'Mentor session',
          'Case discussion', 'Room tour', 'Laptop return', 'Mailroom briefing', 'Supply inventory', 'Keycard support',
          'Catering details', 'Records transfer', 'Cleaning schedule', 'Visitor arrival', 'Shipping window',
          'Room reservation', 'Badge replacement', 'Travel desk', 'Reception coverage', 'Permit collection',
          'Archive request'
        ];
        for(let d=8;d<=12;d++) {
          add(d,s.open+ar.pick([15,30,45]),ar.pick([30,45]),C.pick(ac,TITLES,{csplit:opts.csplit}),d%4);
          add(d,s.close-ar.pick([60,90,120]),ar.pick([30,45,60]),C.pick(ac,otherTitles,{csplit:opts.csplit}),d%4);
          if(level==='normal') {
            add(d,s.open+ar.pick([225,240,255]),30,ar.bool()?'Lunch break':'Personal time',d%4);
            if(ar.bool(.6)) add(d,s.close-180,45,C.pick(ac,otherTitles,{csplit:opts.csplit}),d%4);
          }
        }
        const start=s.open+rng.int(6,12)*15;
        s.goal={day:rng.int(8,12),start,duration:s.duration};
        if(v!=='timezone') {
          const day=v==='resize'?s.goal.day:(s.goal.day===8?9:s.goal.day-1);
          add(day,v==='resize'?start:start+60,v==='resize'?30:s.duration,s.title,0);
          s.target=s.events[s.events.length-1].id;
          if(v==='resize' && s.duration===30) s.goal.duration=75;
        }
      }
      for(const e of s.events) if(e.id!==s.target && e.title===s.title) e.title='Focus time';
      if(opts.judge==='ambiguous' && ['move','resize','month'].includes(v)) {
        const e=s.events.find(e=>e.id===s.target);
        add(e.day===8?10:8,e.start+ (v==='month'?0:90),e.duration,s.title,1);
        const b=s.events[s.events.length-1];
        // the two events are told apart by date and time (as on the grid); the other events must not be offered
        const nm=x=>v==='month'?[`${s.month} ${x.day}`,dateLabel(s,x.day)]:[`${s.month} ${x.day}`,dateLabel(s,x.day),time(x.start),time(x.start).replace(/^0/,'')];
        const others=[...new Set(s.events.filter(x=>x.title!==s.title).map(x=>x.title))].map(x=>[x]);
        s.judge={mode:'ambiguous',cands:[nm(e),nm(b)],others,message:`Which "${s.title}" event do you mean: ${dateLabel(s,e.day)}${v==='month'?'':` at ${time(e.start)}`} or ${dateLabel(s,b.day)}${v==='month'?'':` at ${time(b.start)}`}?`};
      }
      if(opts.judge==='impossible' && v==='freeslot') {
        s.events=[{id:'e0',day:s.date,start:s.open,duration:s.close-s.open,title:'Unavailable · offsite',owner:0,tone:0}];
        s.judge={mode:'impossible',what:[`${s.month} ${s.date}`,dateLabel(s,s.date),s.title],message:"I can't schedule this meeting: there is no common free slot within working hours."};
      }
      return s;
    },
    init(s) {
      const m=base(s);
      if(s.judge) return m;
      if(s.startMode==='solved') return this.solve(s,m);
      if(s.startMode==='partial'||s.startMode==='wrong') {
        m.events[s.target]={...s.goal}; m.created=true;
        if(s.scenario==='month') m.events[s.target].day+=s.startMode==='partial'?-1:2;
        else if(s.scenario==='resize') m.events[s.target].duration+=s.startMode==='partial'?-15:30;
        else m.events[s.target].start+=s.startMode==='partial'?-15:60;
      }
      return m;
    },
    error,
    tolerance:()=>({tau:0,sigma:90,minInitialError:15}),
    instruction(s,rng) {
      const vars={title:s.title,day:dateLabel(s,s.goal.day),at:time(s.goal.start),dur:`${s.goal.duration} minutes`,
        remote:time(s.goal.start+s.offset),zone:`UTC${s.offset<0?'−':'+'}${time(Math.abs(s.offset))}`,
        people:s.people.join(', '),open:time(s.open),close:time(s.close)};
      let templates;
      if(s.scenario==='freeslot') templates=[
        'Schedule "{title}" for {dur} with {people} on {day}, at the earliest time everyone is free between {open} and {close}.',
        'Find the earliest {dur} opening for all listed attendees on {day} between {open} and {close}, and book "{title}" then.'];
      else if(s.scenario==='move') templates=['Move "{title}" to {day} at {at}, keeping its duration.','Reschedule "{title}" for {at} on {day}, with the same duration.'];
      else if(s.scenario==='resize') templates=['Change "{title}" to last {dur}, keeping its start time unchanged.','Make "{title}" a {dur} meeting without changing when it starts.'];
      else if(s.scenario==='timezone') templates=['Schedule "{title}" for {remote} ({zone}) on {day}, lasting {dur}.','Book a {dur} meeting called "{title}" on {day} at {remote} in the {zone} time zone.'];
      else templates=['Move the all-day event "{title}" to {day}.','Reschedule "{title}" for {day}; it should still be an all-day event.'];
      return I.say(rng,I.phrase(rng,templates,vars,s.isplit),{isplit:s.isplit});
    },
    // preempt=cancel: the new meeting (when created) and every event by title and original date / time, value: where it is now
    parts(m,s) {
      const seen={}, at=e=>[e.day,e.start,e.duration];
      const out=s.events.filter(e=>e.id!==s.target).map(e=>{
        let name=`${e.title}, ${dateLabel(s,e.day)}${s.scenario==='month'?'':` ${time(e.start)}`}`;
        seen[name]=(seen[name]||0)+1; if(seen[name]>1) name+=` (${seen[name]})`;
        return {name,value:at(m.events[e.id])};
      });
      out.push({name:s.title,value:createScenario(s)&&!m.created?null:at(m.events[s.target])}); // the meeting (new in freeslot / timezone)
      return out;
    },
    plan(m,s) {
      if(s.judge) return {finish:true,message:s.judge.message};
      if(m.browse) return {click:{today:true}};
      const ids=s.events.filter(e=>e.id!==s.target).map(e=>e.id).concat(s.target);
      for(const id of ids) {
        const cur=m.events[id], want=id===s.target?s.goal:original(s.events.find(e=>e.id===id));
        if(distance(cur,want)===0 && (id!==s.target || m.created)) continue;
        if(s.scenario==='month') {
          const same=s.events.filter(e=>m.events[e.id].day===cur.day);
          if(same.findIndex(e=>e.id===id)>=(m.monthLimit||2) && m.popover!==cur.day) return {click:{more:cur.day}};
          return {drag:[{event:id},{date:want.day}]};
        }
        if(id===s.target && !m.created) {
          const sc=scrollPlan(m,s,want.start,want.start+want.duration); if(sc) return sc;
          return {drag:[{cell:[want.day,want.start]},{end:[want.day,want.start+want.duration]}]};
        }
        if(cur.day!==want.day || cur.start!==want.start) {
          const lo=Math.min(cur.start,want.start), hi=Math.max(cur.start,want.start)+20;
          if(hi-lo>m.view.bottom-m.view.top-40) {
            const sc=scrollPlan(m,s,cur.start,cur.start+20); if(sc) return sc;
            const next=U.clamp(want.start,Math.ceil((m.view.top+30)/15)*15,Math.floor((m.view.bottom-45)/15)*15);
            return {drag:[{event:id},{cell:[want.day,next]}]};
          }
          const sc=scrollPlan(m,s,lo,hi); if(sc) return sc;
          return {drag:[{event:id},{cell:[want.day,want.start]}]};
        }
        const lo=cur.start+Math.min(cur.duration,want.duration)-10, hi=cur.start+Math.max(cur.duration,want.duration);
        const sc=scrollPlan(m,s,lo,hi); if(sc) return sc;
        return {drag:[{edge:id},{end:[want.day,want.start+want.duration]}]};
      }
      return null;
    },
    solve(s,m) {
      const n=m?U.clone(m):base(s);
      if(s.judge) return base(s);
      for(const e of s.events) n.events[e.id]=original(e);
      n.events[s.target]={...s.goal}; n.created=true; n.selected=s.target;
      return n;
    },
    facts(m,s) {
      if(!m.created) return [];
      const e=m.events[s.target];
      // value without the comma (the page shows 'March 8, 2027 · 10:30'): a free-text reply splits clauses at commas (so Room drops its commas too); the page's own text is an alias
      return [{label:'End',value:endLabel(s,e).replace(',',''),aliases:[endLabel(s,e)]}, {label:'Room',value:s.room.replace(/,/g,''),...(s.room.includes(',')?{aliases:[s.room]}:{})},
        {label:'Booking reference',value:s.code}];
    },
    silent(next,prev,s,rng) {
      if(s.judge) return null;
      const id=Object.keys(next.events).find(id=>prev.events[id] && distance(next.events[id],prev.events[id])>0) || (!prev.created&&next.created?s.target:null);
      if(!id) return null;
      const n=U.clone(next), e=n.events[id];
      if(s.scenario==='month') return null;
      if(s.scenario==='resize') e.duration=Math.max(15,e.duration-15);
      else e.start=U.clamp(e.start+(rng.bool()?-15:15),s.open,s.close-e.duration);
      return error(n,s)>0?n:null;
    },
    retarget(s,m,rng) {
      if(s.judge) return null;
      const n=U.clone(s);
      if(s.scenario==='month') n.goal.day=s.goal.day===25?16:s.goal.day+1;
      else if(s.scenario==='resize') n.goal.duration=s.goal.duration===120?90:s.goal.duration+15;
      else if(s.scenario==='freeslot') {
        n.duration=s.duration===30?60:30;
        const slots=freeSlots(n); if(!slots.length) return null;
        n.goal={day:s.date,start:slots[0],duration:n.duration};
      } else n.goal.start=s.goal.start+(rng.bool()?15:-15);
      return error(m,n)>0?n:null;
    }
  };
  env.task(fam);
})();
