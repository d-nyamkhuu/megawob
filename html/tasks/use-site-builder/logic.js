/*
 * use-site-builder: edit pages, emails, SEO fields, social posts and blocks in a publishing app.
 * Fictional CMS, campaign and social publishing workspaces.
 * Real-app counterparts: visual page builders, email campaign composers, SEO metadata
 * editors, social content calendars and block property inspectors. No MiniWoB equivalent.
 *
 * Scenarios: page (palette blocks into numbered two-column page positions), email
 * (ordered sections plus subject/preheader), seo (metadata with enforced character
 * limits and live counters), social (draft posts onto weekday/time calendar cells),
 * blockedit (select one block and edit its text, link, alignment and spacing).
 *
 * Spec: {scenario,level,ood,isplit,csplit,startMode,owner,project,items:[{id,label,type,copy}],
 *   goalSlots:[id], fields:[{id,label,target,limit,alternate}], days, times,
 *   goalSchedule:{id:cell|-1}, baseProps:{id:{title,url,align,padding}}, targetBlock,
 *   goalProps:{title,url,align,padding}, propKeys:[key], actionLabel, audience, revision,
 *   judge?:{mode:'confirm',message}}. Slots are row-major, calendar cells are time-major.
 * Model: {slots:[id|null],fields:{id:string},schedule:{id:cell|-1},props:{id:properties},
 *   selected:id,committed:bool}; pane/scroll fields, if present, are unscored view state.
 * Graded error: mean slot/appointment mismatches and normalized text edit distances;
 * inspector errors include collateral edits to other blocks. Publishing is one final
 * subgoal outside confirm episodes. Exact success (tau 0), partial progress everywhere.
 * Start modes: off (empty draft), partial (some prepared content), wrong (reverse
 * structure, shifted calendar, truncated text or wrong inspector), solved.
 * Difficulty: easy 2 blocks/fields/properties, medium 3, normal 4; OOD up to 6
 * blocks/posts and shorter metadata limits. Every scenario reads level and ood.
 *
 * facts(model,spec): visible publication status, owner, and derived word/character/
 * scheduled-post count (not a target value copied from the instruction).
 * silent(next,prev,spec,rng): truncate a newly improved text field/inspector title or
 * link at a stale length limit; null for structural-only updates. Repeating repairs it.
 * retarget(spec,model,rng): another block order, metadata value, calendar slot or
 * inspector alignment in the same scene; null in judge episodes. Never mutates inputs.
 * parts(model,spec): preempt=cancel items by visible name: page/email slots ('Row 1, left', 'Position 2'; value: block id),
 * email / seo fields by label, social posts by label (value: cell), blockedit blocks by label (value: their properties)
 * and 'Status'.
 * judgeModes: confirm; prepare but ask before Publish / Send campaign / Activate schedule: the reply has status confirm
 * and judged() checks nothing was committed. The widget flags 'irreversible' on that action in confirmation episodes.
 *
 * Plan targets: {palette:id}, {slot:index}, {post:id}, {cell:index}, {drafts:true},
 * {field:id}, {block:id}, {prop:key}, {align:value}, {publish:true}, {pane:id} (wheel).
 * Helpers (widget API, env.taskDef.helpers):
 *   status(model,spec): visible draft/publication status.
 *   wordCount(model,spec): word count of the current content.
 *   cellLabel(spec,index): weekday and time label for a calendar cell.
 */
(function () {
  'use strict';

  const { quote: q } = env.util;
  const C = env.content, I = env.instruct, U = env.util;
  const scenarios = ['page', 'email', 'seo', 'social', 'blockedit'];
  const types = ['Heading', 'Image', 'Text', 'Button', 'Divider', 'Quote', 'Columns', 'Spacer'];
  const alignments = ['Left', 'Center', 'Right'];
  const textError = (a, b) => U.lev(String(a || ''), String(b || '')) / Math.max(1, String(b || '').length, String(a || '').length);
  const confirm = (s) => s.judge && s.judge.mode === 'confirm';
  const cellLabel = (s, i) => `${s.days[i % s.days.length]} at ${s.times[Math.floor(i / s.days.length)]}`;
  const status = (m, s) => !m.committed ? 'Draft' : s.scenario === 'email' ? 'Sent' : s.scenario === 'social' ? 'Scheduled' : 'Published';
  function wordCount(m, s) {
    let text = '';
    if (s.scenario === 'page' || s.scenario === 'email') text = m.slots.map((id) => s.items.find((it) => it.id === id && !['Divider', 'Spacer'].includes(it.type))?.copy || '').join(' ');
    else if (s.scenario === 'social') text = s.items.filter((it) => m.schedule[it.id] >= 0).map((it) => it.copy).join(' ');
    else if (s.scenario === 'blockedit') text = Object.values(m.props).map((p) => p.title).join(' ');
    else text = Object.values(m.fields).join(' ');
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }
  function errParts(m, s) {
    const out = [];
    if (s.scenario === 'page' || s.scenario === 'email') s.goalSlots.forEach((id, i) => out.push(m.slots[i] === id ? 0 : 1));
    if (s.scenario === 'email' || s.scenario === 'seo') s.fields.forEach((f) => out.push(textError(m.fields[f.id], f.target)));
    if (s.scenario === 'social') s.items.forEach((it) => out.push(m.schedule[it.id] === s.goalSchedule[it.id] ? 0 : 1));
    if (s.scenario === 'blockedit') {
      s.items.forEach((it) => {
        const desired = it.id === s.targetBlock ? { ...s.baseProps[it.id], ...s.goalProps } : s.baseProps[it.id];
        for (const key of ['title', 'url', 'align', 'padding']) {
          const a = m.props[it.id][key], b = desired[key];
          out.push(key === 'title' || key === 'url' ? textError(a, b) : key === 'padding' ? Math.min(1, Math.abs(Number(a) - Number(b)) / 32) : a === b ? 0 : 1);
        }
      });
    }
    if (!confirm(s)) out.push(m.committed ? 0 : 1);
    return out;
  }
  const error = (m, s) => { const xs = errParts(m, s); return xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length); };
  // preempt=cancel: what the page shows and the agent edits: the slots by position, the text fields by label, the posts by
  // label (value: the cell), each block's properties by block label, and the publication status
  function parts(m, s) {
    const out = [];
    const label = (id) => (id ? s.items.find((it) => it.id === id).label : null);
    if (s.scenario === 'page' || s.scenario === 'email') {
      m.slots.forEach((id, i) => out.push({ name: s.scenario === 'page' ? `Row ${Math.floor(i / 2) + 1}, ${i % 2 ? 'right' : 'left'}` : `Position ${i + 1}`, value: id }));
    }
    if (s.scenario === 'email' || s.scenario === 'seo') s.fields.forEach((f) => out.push({ name: f.label, value: m.fields[f.id] }));
    if (s.scenario === 'social') s.items.forEach((it) => out.push({ name: it.label, value: m.schedule[it.id] }));
    if (s.scenario === 'blockedit') s.items.forEach((it) => out.push({ name: it.label, value: ['title', 'url', 'align', 'padding'].map((k) => String(m.props[it.id][k])) }));
    out.push({ name: 'Status', aliases: [s.actionLabel], value: status(m, s) });
    return out;
  }
  function solve(s, m) {
    const n = m ? U.clone(m) : { slots: [], fields: {}, schedule: {}, props: {}, selected: s.items[0].id, committed: false };
    n.slots = s.goalSlots.slice();
    n.fields = Object.fromEntries(s.fields.map((f) => [f.id, f.target]));
    n.schedule = { ...s.goalSchedule };
    n.props = U.clone(s.baseProps);
    if (s.scenario === 'blockedit') Object.assign(n.props[s.targetBlock], s.goalProps);
    n.committed = !confirm(s);
    return n;
  }
  function init(s) {
    let m = { slots: s.goalSlots.map(() => null), fields: Object.fromEntries(s.fields.map((f) => [f.id, ''])),
      schedule: Object.fromEntries(s.items.map((it) => [it.id, -1])), props: U.clone(s.baseProps),
      selected: s.items[0].id, committed: false };
    if (s.startMode === 'solved') return solve(s, m);
    if (s.startMode === 'partial' || s.level === 'easy' && s.startMode === 'off') {
      const done = solve(s, m);
      m.slots = done.slots.map((id, i) => i < Math.floor(done.slots.length / 2) ? id : null);
      if (s.fields.length > 1) m.fields[s.fields[0].id] = s.fields[0].target;
      s.items.slice(0, Math.floor(s.items.length / 2)).forEach((it) => { m.schedule[it.id] = done.schedule[it.id]; });
      if (s.scenario === 'blockedit') { m.props[s.targetBlock].title = done.props[s.targetBlock].title; m.selected = s.targetBlock; }
    }
    if (s.startMode === 'wrong') {
      m.slots = s.goalSlots.slice().reverse();
      s.fields.forEach((f) => { m.fields[f.id] = f.target.slice(0, Math.max(1, f.target.length - 7)); });
      s.items.forEach((it) => { m.schedule[it.id] = s.goalSchedule[it.id] < 0 ? -1 : (s.goalSchedule[it.id] + 1) % (s.days.length * s.times.length); });
      if (s.scenario === 'blockedit') { m.props[s.targetBlock].align = 'Right'; m.props[s.targetBlock].title = 'Untitled section'; }
    }
    return m;
  }
  function sample(rng, opts) {
    const cr = rng.fork('content'), co = { csplit: opts.csplit };
    const scenario = opts.scenario || rng.pick(opts.scenarios || scenarios);
    const level = opts.level || 'normal';
    const n = level === 'easy' ? 2 : level === 'medium' ? 3 : opts.ood ? 6 : 4;
    const count = scenario === 'blockedit' ? (level === 'easy' ? 2 : opts.ood ? 5 : 3) : n;
    const headline = C.pick(cr, C.HEADLINES, co), subject = C.pick(cr, C.EMAIL_SUBJECTS, co);
    const company = C.pick(cr, C.COMPANIES, co);
    const posts = C.sample(cr, C.POST_TEXTS, count, co);
    const items = Array.from({ length: count + (scenario === 'page' || scenario === 'email' ? 2 : 0) }, (_, i) => ({
      id: `b${i}`, type: types[i % types.length], label: scenario === 'social' ? `Post ${i + 1}` : `${types[i % types.length]} ${i + 1}`,
      copy: scenario === 'social' ? posts[i] : i === 0 ? headline : i === 3 ? C.pick(cr, C.LINK_TEXTS, co) : C.pick(cr, C.SENTENCES, co),
    }));
    const s = { scenario, level, ood: !!opts.ood, isplit: opts.isplit, csplit: opts.csplit, startMode: opts.startMode || 'off',
      owner: C.personName(cr, co).full, project: `${company} / ${scenario === 'email' ? 'Monthly dispatch' : scenario === 'social' ? 'Content calendar' : 'Studio page'}`,
      items, goalSlots: [], fields: [], days: ['Mon 18', 'Tue 19', 'Wed 20', 'Thu 21', 'Fri 22'], times: ['09:00', '12:00', '15:00'],
      goalSchedule: Object.fromEntries(items.map((it) => [it.id, -1])), baseProps: {}, targetBlock: items[Math.min(1, items.length - 1)].id,
      goalProps: {}, propKeys: [], audience: cr.int(850, 9400), revision: cr.int(12, 89),
      actionLabel: scenario === 'email' ? 'Send campaign' : scenario === 'social' ? 'Activate schedule' : 'Publish changes' };
    if (scenario === 'page' || scenario === 'email') s.goalSlots = rng.shuffle(items).slice(0, n).map((it) => it.id);
    if (scenario === 'email') s.fields = [
      { id: 'subject', label: 'Subject', target: subject.slice(0, opts.ood ? 55 : 80), limit: opts.ood ? 55 : 80, alternate: headline.slice(0, opts.ood ? 55 : 80) },
      { id: 'preheader', label: 'Preheader', target: C.pick(cr, C.SENTENCES, co).slice(0, opts.ood ? 75 : 120), limit: opts.ood ? 75 : 120, alternate: 'See what is new in our latest dispatch.' },
    ];
    if (scenario === 'seo') {
      const titleLimit = opts.ood ? 42 : 60, descLimit = opts.ood ? 110 : 160;
      s.fields = [
        { id: 'title', label: 'SEO title', target: headline.slice(0, titleLimit), limit: titleLimit, alternate: subject.slice(0, titleLimit) },
        { id: 'description', label: 'Meta description', target: C.paragraph(cr, level === 'easy' ? 1 : 2, co).slice(0, descLimit), limit: descLimit, alternate: 'Explore our collection and find something new.' },
      ];
      if (level !== 'easy') s.fields.push({ id: 'slug', label: 'URL slug', target: C.slug(headline).slice(0, opts.ood ? 38 : 65), limit: opts.ood ? 38 : 65, alternate: 'latest-news' });
    }
    if (scenario === 'social') {
      const cells = rng.shuffle(Array.from({ length: 15 }, (_, i) => i));
      items.forEach((it, i) => { s.goalSchedule[it.id] = cells[i]; });
    }
    items.forEach((it) => { s.baseProps[it.id] = { title: it.copy.slice(0, 72), url: '/discover', align: 'Left', padding: 16 }; });
    if (scenario === 'blockedit') {
      s.propKeys = ['title', 'align', 'url', 'padding'].slice(0, level === 'easy' ? 2 : level === 'medium' ? 3 : 4);
      const goal = { title: subject.slice(0, opts.ood ? 48 : 72), align: 'Center', url: `/${C.slug(company).slice(0, 25)}`, padding: opts.ood ? 48 : rng.pick([24, 32]) };
      s.goalProps = Object.fromEntries(s.propKeys.map((key) => [key, goal[key]]));
    }
    if (opts.judge === 'confirm') s.judge = { mode: 'confirm', message: `The draft is ready. Should I ${s.actionLabel.toLowerCase()}?` };
    return s;
  }
  function instruction(s, rng) {
    let task;
    if (s.scenario === 'page' || s.scenario === 'email') {
      const order = s.goalSlots.map((id, i) => `${q(s.items.find((it) => it.id === id).label)} ${s.scenario === 'page' ? `in row ${Math.floor(i / 2) + 1}, ${i % 2 ? 'right' : 'left'}` : `at position ${i + 1}`}`).join('; ');
      task = I.phrase(rng, [
        'Build the draft using these blocks: {order}.', 'Use this page layout: {order}.',
        'Include these sections in this order: {order}.', 'Create this layout: {order}.',
        'Place each block as listed: {order}.', 'Give blocks these positions: {order}.',
        'Match each block to its slot: {order}.', 'Assemble the draft to match: {order}.',
        'Follow the block placement plan: {order}.', 'Use {order} to position the blocks.',
        'Put the draft together with {order}.', 'Reproduce this arrangement: {order}.',
        'Make sure the blocks go here: {order}.', 'Use the following block map: {order}.'
      ], { order }, s.isplit);
      if (s.scenario === 'email') task += ' ' + s.fields.map((f) => `Set ${q(f.label)} to ${q(f.target)}.`).join(' ');
    } else if (s.scenario === 'seo') {
      task = I.phrase(rng, [
        'Update the search listing: {fields}.', 'Fill the SEO metadata with {fields}.',
        'Edit these search settings: {fields}.', 'Prepare the page metadata: {fields}.',
        'Set each SEO field to match {fields}.', 'Use {fields} as the SEO field values.',
        'Make SEO values equal to {fields}.', 'Enter the SEO data exactly: {fields}.',
        'Copy these values into SEO: {fields}.', 'Let {fields} define the SEO metadata.',
        'Bring SEO into line with {fields}.'
      ],
        { fields: s.fields.map((f) => `${q(f.label)} = ${q(f.target)}`).join('; ') }, s.isplit);
    } else if (s.scenario === 'social') {
      task = I.phrase(rng, [
        'Schedule the posts: {posts}.', 'Plan these posts for the following times: {posts}.',
        'Set up this publishing calendar: {posts}.', 'Arrange the social schedule as follows: {posts}.',
        'Place each post in its slot: {posts}.', 'Give the posts the slots shown: {posts}.',
        'Match posts to these calendar cells: {posts}.', 'Use these dates and times for posts: {posts}.',
        'Book the calendar slots as listed: {posts}.', 'Follow this plan for post timing: {posts}.',
        'Use {posts} to fill the post calendar.', 'Put posts on the calendar as given: {posts}.',
        'Assign every post its listed time: {posts}.', 'Prepare post timings according to {posts}.',
        'Reserve these times for the posts: {posts}.', 'Make the post calendar reflect {posts}.'
      ],
        { posts: s.items.map((it) => `${q(it.label)} on ${cellLabel(s, s.goalSchedule[it.id])}`).join('; ') }, s.isplit);
    } else {
      const labels = { title: 'Text', url: 'Link URL', align: 'Alignment', padding: 'Padding' };
      task = I.phrase(rng, [
        'Update block {block}: {props}.', 'For {block}, use {props}.', 'Update the properties of {block}: {props}.',
        'Change {block} to use {props}.', 'Apply {props} to {block}.', 'Make {block} match {props}.',
        'Set only these on {block}: {props}.', 'In {block}, enter these values: {props}.',
        'Use {props} for editing {block}.', 'Bring {block} into line: {props}.',
        'Give {block} these values: {props}.', 'Let {props} define {block}.', 'On {block}, set {props} exactly.',
        'Edit {block} as follows: {props}.', 'Configure {block} with {props}.'
      ],
        { block: q(s.items.find((it) => it.id === s.targetBlock).label), props: s.propKeys.map((key) => `${labels[key]} = ${q(s.goalProps[key])}`).join('; ') }, s.isplit) + ' Leave other blocks unchanged.';
    }
    return I.say(rng, task, { isplit: s.isplit }) + (confirm(s) ? ` Ask me for approval before you ${s.actionLabel.toLowerCase()}.` : ` Then ${s.actionLabel.toLowerCase()}.`);
  }
  function plan(m, s) {
    if (s.scenario === 'page' || s.scenario === 'email') {
      for (let i = 0; i < s.goalSlots.length; i++) if (m.slots[i] !== s.goalSlots[i]) return { drag: [{ palette: s.goalSlots[i] }, { slot: i }] };
    }
    if (s.scenario === 'email' || s.scenario === 'seo') for (const f of s.fields) if (m.fields[f.id] !== f.target) return { type: [{ field: f.id }, f.target] };
    if (s.scenario === 'social') for (const it of s.items) if (m.schedule[it.id] !== s.goalSchedule[it.id]) return { drag: [{ post: it.id }, s.goalSchedule[it.id] < 0 ? { drafts: true } : { cell: s.goalSchedule[it.id] }] };
    if (s.scenario === 'blockedit') {
      for (const it of s.items) {
        const desired = it.id === s.targetBlock ? { ...s.baseProps[it.id], ...s.goalProps } : s.baseProps[it.id];
        for (const key of ['title', 'url', 'align', 'padding']) if (m.props[it.id][key] !== desired[key]) {
          if (m.selected !== it.id) return { click: { block: it.id } };
          return key === 'align' ? { click: { align: desired[key] } } : { type: [{ prop: key }, String(desired[key])] };
        }
      }
    }
    return !confirm(s) && !m.committed ? { click: { publish: true } } : null;
  }
  function silent(next, prev, s, rng) {
    const n = U.clone(next);
    const fs = s.fields.filter((f) => next.fields[f.id] !== prev.fields[f.id] && textError(next.fields[f.id], f.target) < textError(prev.fields[f.id], f.target) && next.fields[f.id].length > 1);
    if (fs.length) { const f = rng.pick(fs); n.fields[f.id] = n.fields[f.id].slice(0, Math.max(1, n.fields[f.id].length - rng.int(1, 5))); }
    else if (s.scenario === 'blockedit') {
      const choices = s.items.flatMap((it) => ['title', 'url'].filter((k) => next.props[it.id][k] !== prev.props[it.id][k] && next.props[it.id][k].length > 1).map((k) => [it.id, k]));
      if (!choices.length) return null;
      const [id, key] = rng.pick(choices); n.props[id][key] = n.props[id][key].slice(0, Math.max(1, n.props[id][key].length - rng.int(1, 4)));
    } else return null;
    n.committed = false;
    return error(n, s) > 0 ? n : null;
  }
  function retarget(s, m, rng) {
    if (s.judge) return null;
    const n = U.clone(s);
    if (s.scenario === 'page' || s.scenario === 'email') {
      for (let i = 0; i < n.goalSlots.length; i++) { n.goalSlots.push(n.goalSlots.shift()); if (error(m, n) > 0 && n.goalSlots.some((id, k) => id !== s.goalSlots[k])) return n; }
      return null;
    }
    if (s.scenario === 'seo') { const f = rng.pick(n.fields); f.target = f.target === f.alternate ? f.target.slice(0, -1) : f.alternate; }
    if (s.scenario === 'social') {
      const it = rng.pick(s.items), used = Object.values(n.goalSchedule);
      n.goalSchedule[it.id] = rng.pick(Array.from({ length: 15 }, (_, i) => i).filter((i) => !used.includes(i) && i !== m.schedule[it.id]));
    }
    if (s.scenario === 'blockedit') n.goalProps.align = rng.pick(alignments.filter((v) => v !== m.props[s.targetBlock].align && v !== s.goalProps.align));
    return error(m, n) > 0 ? n : null;
  }
  env.task({ name: 'use-site-builder',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios, startModes: ['off', 'partial', 'wrong', 'solved'], inputs: ['pointer', 'keyboard', 'wheel'], judgeModes: ['confirm'],
    sample, init, error, tolerance: () => ({ tau: 0, sigma: 0.22, minInitialError: 0.015 }), instruction, plan(m, s) {
      const step = plan(m, s);
      const targets = !step ? [] : step.drag || (step.type ? [step.type[0]] : step.click ? [step.click] : []);
      for (const target of targets) {
        const clipped = m.view && m.view.hidden[JSON.stringify(target)];
        if (clipped) return { wheel: [{ pane: clipped.pane }, clipped.dy] };
      }
      return step;
    }, solve, silent, retarget,
    facts(m, s) {
      return [{ label: 'Status', value: status(m, s) }, { label: 'Owner', value: s.owner },
        s.scenario === 'social' ? { label: 'Scheduled posts', value: String(Object.values(m.schedule).filter((v) => v >= 0).length) } :
        s.scenario === 'seo' ? { label: 'Metadata characters', value: String(Object.values(m.fields).join('').length) } : { label: 'Words', value: String(wordCount(m, s)) }];
    },
    parts,
    // model check (the reply is graded by the kit): nothing was published / sent / activated
    judged: (m, s, info) => !m.committed && !info.infeasible,
    helpers: { status, wordCount, cellLabel },
  });
})();
