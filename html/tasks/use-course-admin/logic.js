/*
 * use-course-admin: enter grades and edit quizzes, modules and rubrics in a course admin app.
 * Course administration, inspired by real gradebooks, quiz builders, module editors and
 * assessment rubrics (no MiniWoB counterpart).
 *
 * Scenarios: grades (Recorded / Moderated marks, sometimes component totals, with locked cells),
 * quiz (add ordered questions, types, options, answer keys and points from an on-page brief),
 * modules (drag course modules and their nested lessons), rubric (one performance level per criterion).
 * Spec: common {scenario, course, instructor, students:[{id,name}], level, ood, startMode, isplit, csplit};
 * grades {assignments, records:{cell:{Recorded:[numbers],Moderated:[numbers]}}, locked, scheme};
 * quiz {bank:[{title,type,options,correct,points}], wanted:[bank indices]};
 * modules {units:[{id,title,lessons:[{id,title}]}], goalOrder, goalLessons};
 * rubric {criteria:[{title,weight}], levels, ratings:[level indices], student}.
 * Model: {marks:{cell:string}, questions:[{title,type,options:[string],correct,points:string}],
 * order:[unit ids], lessons:{unit:[lesson ids]}, ratings:[index|-1], active, unit, learner:null|id,
 * visible:[target keys] (unscored pane geometry mirrored by widget)}. Only the current scenario is scored.
 * Targets: {cell:key}, {add:true}, {question:index}, {field:'title'|'points'}, {option:index},
 * {type:'Multiple choice'|'True / false'}, {answer:index}, {remove:true}, {unit:id},
 * {item:id,group:'modules'|unitId}, {slot:index,group,item}, {rating:[criterion,level]},
 * {pane:'main'|'source',dy:number}. Plans use wheel steps when fields are outside the inner pane.
 * Start modes off / partial / wrong / solved; exact grading with edit-distance, numeric and order
 * partial credit. Levels reduce students/questions/units/criteria; ood expands counts and point ranges.
 * facts(model,spec): 2-3 visible computed totals/counts, including a student's gradebook or rubric total.
 * parts(model,spec): preempt=cancel items by the name the page shows: grades '<student> <assignment>' -> mark (unlocked
 * cells), quiz 'Question n' (a slot for every wanted question) -> the question, modules unit and lesson titles -> place (moving one also changes those it
 * passes), rubric criterion title -> level. [] in judge episodes.
 * silent(next,prev,spec,rng): restore one improved field/order/rating to its previous value, retry repairs it.
 * retarget(spec,model,rng): alternate score sheet, quiz question selection, module order or rubric rating;
 * only goal fields change, never the scene's content. Null in judge episodes.
 * judgeModes ambiguous: two students share a name and the requested learner record is unspecified;
 * ask which student ID, leave the page untouched. spec.judge = { mode, name, ids, message, cands, others }: cands are
 * the two student IDs (the roster shows 'name . ID'), others the other students (ID, name); the kit grades the
 * reply, the task judged() only checks that no learner record was opened. The same course roster is available in all scenarios.
 * Helpers (widget API, env.taskDef.helpers):
 *   cellKey(student, assignment): gradebook cell key.
 *   blankQuestion(): empty multiple-choice question model.
 *   total(model, spec, student?): visible grade, quiz, rubric or lesson total.
 * Self-test: tasks/use-course-admin/selftest.js (loaded only by the checker and node tests).
 * Local fictional course/assessment banks supplement env.content people; course/question picks honor csplit.
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct;
  const { clone, lev } = env.util;
  const COURSES = ['Field Research Methods', 'Designing Sustainable Cities', 'Introduction to Data Stories',
    'Ecology in Practice', 'Foundations of Visual Design', 'Community Project Studio', 'Evidence and Argument',
    'Applied Statistics Lab', 'Creative Systems', 'Digital Archives', 'Mapping Our World', 'Writing for Discovery',
    'Principles of Sound', 'The Living Landscape', 'Materials and Meaning', 'Reading Ancient Worlds',
    'Networks and Society', 'Learning Through Making', 'Climate and Culture', 'The Art of Observation',
    'Language in Context', 'Patterns in Nature', 'Ethics of Innovation', 'Visualizing Information', 'Sound and Space',
    'Histories of Everyday Life', 'Thinking with Models', 'The Moving Image', 'Foodways and Place',
    'Robotics in the Workshop', 'Public Spaces Workshop', 'Narrative Across Media', 'Plants and People',
    'Design for Learning', 'Numbers in the Wild', 'Material Culture Studies', 'Curating Local Histories',
    'Motion and Meaning', 'Water in the Landscape', 'Making with Textiles', 'Explorations in Geometry',
    'Urban Forms and Functions', 'Listening to Landscapes', 'Everyday Architecture', 'The Chemistry of Materials',
    'Stories in the Night Sky', 'Performance and Place', 'Objects and Their Stories', 'Games and Decision Making',
    'Tides and Coastal Life', 'The Grammar of Images', 'Stories of Migration', 'Sound Recording Workshop',
    'Gardens through History', 'Mathematics of Change', 'Craft and Community', 'Weather and Water',
    'Poetry in Translation', 'Fungi and Forests', 'Light in the Studio', 'Field Notes in Biology',
    'Rituals and Daily Life', 'Introduction to Paleontology', 'Designing for Accessibility', 'Archives of the Future',
    'Drawing from Observation', 'Agriculture and Society', 'Writing the Natural World', 'Ceramics and Kiln Practice',
    'Theater of the Everyday', 'Birds of Open Country', 'Typography and Meaning', 'Sound Design for Spaces',
    'The Science of Soil', 'Folklore and Storytelling', 'Energy in Living Systems', 'Making a Community Museum',
    'Geometry of the City', 'Photography and Presence', 'Textile Traditions Workshop', 'The Structure of Music',
    'Rivers and Civilizations', 'Conservation and Change', 'Introduction to Astronomy', 'Design and Everyday Behavior',
    'Data Ethics and Society', 'Microbes and Their Worlds', 'Sculpture and Spatial Form', 'Music Pattern and Culture',
    'Mathematics of Games', 'Reading Environmental Change', 'Writing for Digital Media', 'The Craft of Bookmaking',
    'Introduction to Linguistics', 'Experiments in Plant Science', 'Cities and Transportation',
    'Memory in the Modern World', 'Visual Storytelling Studio', 'Design of Everyday Objects', 'Principles of Geology',
    'Wildlife on the Move', 'Practice of Oral History', 'Color Perception and Form', 'The Logic of Proof',
    'Plants in Urban Places', 'The World of Insects', 'The Life of the Ocean', 'Ways of Seeing Sculpture',
    'Making Digital Exhibits', 'Food Science and Society', 'The Mathematics of Music', 'Introduction to Archaeology',
    'Mapping Biodiversity', 'Design and Movement', 'Water Quality and Watersheds', 'Writing Across Genres',
    'Materials of the Modern Home', 'The Study of Clouds'];
  const TOPICS = ['Getting started', 'Asking good questions', 'Gathering evidence', 'Making comparisons',
    'Testing assumptions', 'Presenting findings', 'Peer review', 'Reflection and next steps', 'Defining key terms',
    'Mapping relationships', 'Organizing ideas', 'Interpreting patterns', 'Building explanations', 'Useful feedback',
    'Revising a draft', 'Applying new ideas', 'Listening for texture', 'Shapes in common spaces',
    'Visual symbols and signs', 'Stories about objects', 'Sound and place', 'Public space uses', 'Images and meaning',
    'Movement in form', 'Materials over time', 'Language patterns', 'Landscape and place', 'Daily rituals',
    'Sketching ideas', 'Design constraints', 'Architectural details', 'Object journeys'];
  const QUESTIONS = [
    { title: 'Which source is primary evidence?', type: 'Multiple choice', options: ['An interview transcript', 'A textbook summary', 'A review article'], correct: 0 },
    { title: 'A larger sample always removes selection bias.', type: 'True / false', options: ['True', 'False'], correct: 1 },
    { title: 'What should a chart axis include?', type: 'Multiple choice', options: ['Units of measurement', 'The author biography', 'A decorative border'], correct: 0 },
    { title: 'Peer review can identify gaps in an argument.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'Which measure describes the middle observation?', type: 'Multiple choice', options: ['Median', 'Range', 'Maximum'], correct: 0 },
    { title: 'A correlation proves a causal relationship.', type: 'True / false', options: ['True', 'False'], correct: 1 },
    { title: 'Which practice supports reproducibility?', type: 'Multiple choice', options: ['Documenting methods', 'Removing raw data', 'Hiding assumptions'], correct: 0 },
    { title: 'A citation helps readers trace a source.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'How is an arithmetic mean calculated?', type: 'Multiple choice', options: ['Sum divided by count', 'Largest value', 'Largest minus smallest'], correct: 0 },
    { title: 'What does the mode of a dataset describe?', type: 'Multiple choice', options: ['Middle position', 'Most frequent value', 'Largest difference'], correct: 1 },
    { title: 'Missing research values always stand for zero.', type: 'True / false', options: ['True', 'False'], correct: 1 },
    { title: 'Quotations should preserve the source wording.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'Which variable is changed in a test?', type: 'Multiple choice', options: ['Independent', 'Dependent', 'Controlled'], correct: 0 },
    { title: 'A histogram always has gaps between its bins.', type: 'True / false', options: ['True', 'False'], correct: 1 },
    { title: 'Which plot displays paired numeric data?', type: 'Multiple choice', options: ['Pie chart', 'Scatterplot', 'Frequency table'], correct: 1 },
    { title: 'Random assignment uses chance to form groups.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'All websites are equally reliable as sources.', type: 'True / false', options: ['True', 'False'], correct: 1 },
    { title: 'Which example contains qualitative data?', type: 'Multiple choice', options: ['Written descriptions', 'Distances', 'Temperatures'], correct: 0 },
    { title: 'A single outlier can affect the sample mean.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'What makes a scientific claim testable?', type: 'Multiple choice', options: ['Popular wording', 'Evidence can test it', 'Neat handwriting'], correct: 1 },
    { title: 'A percentage can never exceed one hundred.', type: 'True / false', options: ['True', 'False'], correct: 1 },
    { title: 'A control group gives a basis for comparison.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'All research data must consist of numbers.', type: 'True / false', options: ['True', 'False'], correct: 1 },
    { title: 'What does negative correlation show?', type: 'Multiple choice', options: ['Matching units', 'Opposing trends', 'Equal samples'], correct: 1 },
    { title: 'A table can organize data into rows.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'A literature review lists only new data.', type: 'True / false', options: ['True', 'False'], correct: 1 },
    { title: 'What measure describes data dispersion?', type: 'Multiple choice', options: ['Standard deviation', 'Arithmetic mean', 'Sample median'], correct: 0 },
    { title: 'What does a chart legend describe?', type: 'Multiple choice', options: ['Colors or symbols', 'The sample size', 'The study duration'], correct: 0 },
    { title: 'A bar chart can compare category frequencies.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'A sample can be smaller than its population.', type: 'True / false', options: ['True', 'False'], correct: 0 },
    { title: 'A prediction is the same as an observation.', type: 'True / false', options: ['True', 'False'], correct: 1 },
  ];
  const CRITERIA = ['Use of evidence', 'Clarity of argument', 'Organization', 'Original insight', 'Source attribution', 'Visual communication'];
  const cellKey = (r, c) => `${r}:${c}`;
  const sum = a => a.reduce((n, v) => n + (Number.isFinite(Number(v)) ? Number(v) : 0), 0);
  const gradeValue = (s, key) => sum(s.records[key][s.scheme]);
  const blankQuestion = () => ({ title: '', type: 'Multiple choice', options: ['', '', ''], correct: -1, points: '' });
  const textError = (a, b) => lev(String(a ?? ''), String(b)) / Math.max(1, String(a ?? '').length, String(b).length);
  const numberError = (a, b) => String(a).trim() === '' || !Number.isFinite(Number(a)) ? 1 : Math.min(1, Math.abs(Number(a) - Number(b)) / Math.max(1, Number(b)));
  function questionError(q, target) {
    if (!q) return 1;
    return (textError(q.title, target.title) + Number(q.type !== target.type)
      + target.options.reduce((e, x, i) => e + textError(q.options[i], x), 0) / target.options.length
      + Number(q.correct !== target.correct) + numberError(q.points, target.points)
      + Number(q.options.length !== target.options.length)) / 6;
  }
  function orderError(a, b) {
    if (a.length !== b.length || new Set(a).size !== b.length || b.some(id => !a.includes(id))) return 1;
    let bad = 0;
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (b.indexOf(a[i]) > b.indexOf(a[j])) bad++;
    return bad / Math.max(1, a.length * (a.length - 1) / 2);
  }
  function total(m, s, student = s.students[0].id) {
    if (s.scenario === 'grades') return sum(s.assignments.map(a => m.marks[cellKey(student, a.id)]));
    if (s.scenario === 'quiz') return sum(m.questions.map(q => q.points));
    if (s.scenario === 'rubric') return sum(m.ratings.map((v, i) => v < 0 ? 0 : v * s.criteria[i].weight));
    return sum(s.units.map(u => m.lessons[u.id].length));
  }
  function error(m, s) {
    let e;
    if (s.scenario === 'grades') {
      const keys = Object.keys(s.records);
      e = sum(keys.map(key => numberError(m.marks[key], s.locked[key] ?? gradeValue(s, key)))) / keys.length;
    } else if (s.scenario === 'quiz') {
      e = (sum(s.wanted.map((id, i) => questionError(m.questions[i], s.bank[id]))) + Math.max(0, m.questions.length - s.wanted.length))
        / Math.max(s.wanted.length, m.questions.length);
    } else if (s.scenario === 'modules') {
      e = (orderError(m.order, s.goalOrder) + sum(s.units.map(u => orderError(m.lessons[u.id], s.goalLessons[u.id])))) / (s.units.length + 1);
    } else e = sum(s.ratings.map((v, i) => m.ratings[i] < 0 ? 1 : Math.abs(m.ratings[i] - v) / 3)) / s.ratings.length;
    return e + (s.judge && m.learner !== null ? 1 : 0);
  }
  function facts(m, s) {
    if (s.scenario === 'grades') return [{ label: `${s.students[0].name} total`, value: `${total(m, s)} pts` },
      { label: 'Grades entered', value: String(Object.values(m.marks).filter(v => v !== '').length) },
      { label: 'Locked cells', value: String(Object.keys(s.locked).length) }];
    if (s.scenario === 'quiz') return [{ label: 'Quiz points', value: `${total(m, s)} pts` }, { label: 'Questions', value: String(m.questions.length) }];
    if (s.scenario === 'modules') return [{ label: 'Modules', value: String(m.order.length) }, { label: 'Lessons', value: String(total(m, s)) }];
    return [{ label: 'Assessment total', value: `${total(m, s)} / ${sum(s.criteria.map(c => c.weight * 3))} pts` },
      { label: 'Criteria assessed', value: `${m.ratings.filter(v => v >= 0).length} / ${s.criteria.length}` }];
  }
  function reveal(m, key) {
    if (!m.visible || m.visible.includes(key)) return null;
    const i = m.targets ? m.targets.indexOf(key) : -1;
    const first = m.targets && m.visible.length ? m.targets.indexOf(m.visible[0]) : 0;
    return { wheel: [{ pane: 'main' }, i < first ? -170 : 170] };
  }
  const task = {
    name: 'use-course-admin',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: ['grades', 'quiz', 'modules', 'rubric'],
    inputs: s => ['pointer', 'wheel', ...(['grades', 'quiz'].includes(s.scenario) ? ['keyboard'] : [])],
    startModes: ['off', 'partial', 'wrong', 'solved'], judgeModes: ['ambiguous'],
    helpers: { cellKey, blankQuestion, total },
    facts,
    sample(rng, opts) {
      const cr = rng.fork('content'), cs = { csplit: opts.csplit || 'train' };
      const level = opts.level || 'normal', ood = !!opts.ood;
      const s = { scenario: opts.scenario || rng.pick(opts.scenarios || this.scenarios), level, ood,
        startMode: opts.startMode, isplit: opts.isplit || 'train', csplit: cs.csplit,
        course: C.pick(cr, COURSES, cs), instructor: C.personName(cr, cs).full, students: [] };
      const n = ood ? 6 : level === 'easy' ? 3 : level === 'medium' ? 4 : 5;
      for (let i = 0; i < n; i++) {
        let name = C.personName(cr, cs).full;
        if (s.students.some(x => x.name === name)) name += ` ${i + 1}`;
        s.students.push({ id: `S${rng.int(10, 99)}${i + 1}`, name });
      }
      if (s.scenario === 'grades') {
        s.assignments = [{ id: 'a0', title: 'Field notes', max: 20 }, { id: 'a1', title: 'Project report', max: ood ? 150 : 40 }];
        if (ood) s.assignments.push({ id: 'a2', title: 'Peer reflection', max: 30 });
        s.records = {}; s.locked = {}; s.scheme = rng.pick(['Recorded', 'Moderated']); s.components = rng.bool();
        for (const row of s.students) for (const a of s.assignments) {
          const k = cellKey(row.id, a.id), v = rng.int(Math.ceil(a.max * .4), a.max - 2);
          const parts = x => s.components ? [Math.floor(x / 2), x - Math.floor(x / 2)] : [x];
          s.records[k] = { Recorded: parts(v), Moderated: parts(v + 2) };
          if (a.id === 'a0' || (row === s.students[n - 1] && a.id === 'a1')) s.locked[k] = v;
        }
      } else if (s.scenario === 'quiz') {
        const count = ood ? 3 : level === 'easy' ? 1 : 2;
        // Both question types occur in normal episodes; an extra source question supports retargeting.
        const mc = C.pick(cr, QUESTIONS.filter(q => q.type === 'Multiple choice'), cs);
        const tf = C.pick(cr, QUESTIONS.filter(q => q.type === 'True / false'), cs);
        const rest = cr.shuffle(C.split(QUESTIONS, cs.csplit).filter(q => q !== mc && q !== tf));
        while (rest.length < count - 1) {
          const base = C.pick(cr, QUESTIONS, cs);
          rest.push({ ...clone(base), title: `Review check ${rest.length + 1}: ${base.title}` });
        }
        s.bank = clone([mc, tf, ...rest].slice(0, count + 1)).map(q => ({ ...q, points: rng.int(ood ? 10 : 2, ood ? 25 : 8) }));
        s.wanted = Array.from({ length: count }, (_, i) => i);
      } else if (s.scenario === 'modules') {
        const count = ood ? 5 : level === 'easy' ? 2 : 3, lessons = ood ? 5 : level === 'easy' ? 2 : 3;
        const names = C.sample(cr, TOPICS, count, cs);
        while (names.length < count) names.push(`Workshop ${names.length + 1}`);
        s.units = names.map((title, i) => ({ id: `u${i}`, title, lessons: Array.from({ length: lessons }, (_, j) => ({
          id: `u${i}l${j}`, title: `${['Read', 'Explore', 'Practice', 'Discuss', 'Reflect'][j]}: ${title.toLowerCase()}` })) }));
        s.goalOrder = rng.shuffle(s.units.map(u => u.id));
        s.goalLessons = Object.fromEntries(s.units.map(u => [u.id, rng.shuffle(u.lessons.map(l => l.id))]));
      } else {
        const count = ood ? 6 : level === 'easy' ? 3 : level === 'medium' ? 4 : 5;
        s.criteria = rng.sample(CRITERIA, count).map(title => ({ title, weight: rng.int(1, ood ? 8 : 4) }));
        s.levels = ['Not yet', 'Developing', 'Proficient', 'Exemplary'];
        s.ratings = s.criteria.map(() => rng.int(1, 3)); s.student = s.students[0].id;
      }
      if (opts.judge === 'ambiguous') {
        s.students[1].name = s.students[0].name;
        s.judge = { mode: 'ambiguous', name: s.students[0].name, ids: s.students.slice(0, 2).map(x => x.id),
          cands: s.students.slice(0, 2).map(x => [x.id]), others: s.students.slice(2).map(x => [x.id, x.name]),
          message: `Which student record for ${s.students[0].name} do you mean: ${s.students[0].id} or ${s.students[1].id}?` };
      }
      return s;
    },
    init(s, rng) {
      let m = { marks: {}, questions: [], order: [], lessons: {}, ratings: [], active: 0, unit: s.units ? s.units[0].id : null, learner: null };
      if (s.scenario === 'grades') for (const key of Object.keys(s.records)) m.marks[key] = s.locked[key] === undefined ? '' : String(s.locked[key]);
      if (s.scenario === 'modules') {
        m.order = s.goalOrder.slice().reverse();
        for (const u of s.units) m.lessons[u.id] = s.goalLessons[u.id].slice().reverse();
      }
      if (s.scenario === 'rubric') m.ratings = s.ratings.map(() => -1);
      if (s.judge || s.startMode === 'solved') return this.solve(s, m);
      if (s.startMode === 'partial') {
        if (s.scenario === 'grades') {
          const keys = Object.keys(s.records).filter(k => s.locked[k] === undefined);
          for (const k of keys.slice(0, Math.max(1, keys.length - 1))) m.marks[k] = String(gradeValue(s, k));
        } else if (s.scenario === 'quiz') { m.questions = [clone(s.bank[s.wanted[0]])]; m.questions[0].points = ''; }
        else if (s.scenario === 'modules') { m = this.solve(s, m); [m.order[0], m.order[1]] = [m.order[1], m.order[0]]; }
        else m.ratings = s.ratings.map((v, i) => i ? -1 : v);
      } else if (s.startMode === 'wrong') {
        if (s.scenario === 'grades') {
          for (const k of Object.keys(s.records)) if (s.locked[k] === undefined) m.marks[k] = String(Math.max(0, gradeValue(s, k) - 3));
        }
        else if (s.scenario === 'quiz') m.questions = [{ ...clone(s.bank[s.wanted[0]]), correct: (s.bank[s.wanted[0]].correct + 1) % 2, points: '1' }];
        else if (s.scenario === 'rubric') m.ratings = s.ratings.map(v => (v + 1) % 4);
      }
      return m;
    },
    error,
    tolerance: () => ({ tau: 0, sigma: .3, minInitialError: .00001 }),
    instruction(s, rng) {
      if (s.judge) return I.say(rng, I.phrase(rng, ['Open the student record for "{name}".',
        'Go to the learner profile for "{name}".', 'Find and open "{name}" in the course roster.',
        'The student profile to open is "{name}".'], { name: s.judge.name }, s.isplit), { isplit: s.isplit });
      let core;
      if (s.scenario === 'grades') core = I.phrase(rng, ['Bring the gradebook up to date with the {scheme} scores in the grading sheet.',
        'Record the {scheme} marks from the score sheet for all active students.',
        'Update the active students\' grades to match the {scheme} marks in the grading sheet.',
        'Refer to the grading sheet and enter {scheme} scores for all active students.',
        'Make active students\' gradebook marks agree with {scheme} in the score sheet.'], { scheme: `"${s.scheme}"` }, s.isplit) + ' Keep finalized grades unchanged.';
      else if (s.scenario === 'quiz') core = I.phrase(rng, ['Build a quiz using these brief items in order: {items}.',
        'Create questions from the question brief in this sequence: {items}.',
        'Assemble a quiz containing only {items}, in that order.',
        'Use just these brief questions for the quiz, in sequence: {items}.',
        'The quiz must contain exactly this ordered list: {items}.',
        'Populate the quiz with just this exact sequence: {items}.',
        'Make {items} the complete quiz, keeping the order shown.'], { items: s.wanted.map(id => `"${s.bank[id].title}"`).join('; ') }, s.isplit)
        + ' Match each question type, options, answer key and points to the brief.';
      else if (s.scenario === 'modules') {
        const name = id => s.units.find(u => u.id === id).title;
        core = I.phrase(rng, ['Arrange the course modules in this order: {order}.', 'Reorder the modules to follow {order}.',
          'Set the module sequence to {order}.',
          'Follow {order} when arranging the modules.',
          'Make the course module order match {order}.',
          'Put modules into the sequence {order}.',
          'The modules should run in order: {order}.'], { order: s.goalOrder.map(id => `"${name(id)}"`).join(', then ') }, s.isplit);
        core += ' Within each module, follow the numbered lesson sequence in the teaching outline.';
      } else core = I.phrase(rng, ['Assess "{student}" with these rubric levels: {ratings}.',
        'Fill the rubric for "{student}" as follows: {ratings}.', 'Record these performance ratings for "{student}": {ratings}.',
        'Use {ratings} when completing the rubric for "{student}".',
        'Set each rubric rating for "{student}" to match {ratings}.',
        'The rubric for "{student}" must read as follows: {ratings}.',
        'Assign "{student}" a level per rubric criterion: {ratings}.',
        'Apply {ratings} across the full rubric for "{student}".',
        '"{student}" needs these rubric levels entered: {ratings}.'],
        { student: s.students.find(x => x.id === s.student).name, ratings: s.criteria.map((c, i) => `"${c.title}": "${s.levels[s.ratings[i]]}"`).join('; ') }, s.isplit);
      return I.say(rng, core, { isplit: s.isplit, terse: core });
    },
    // the reply is graded by the kit; the model check: no learner record was opened
    judged(m) { return m.learner === null; },
    parts(m, s) {
      if (s.judge) return [];
      if (s.scenario === 'grades') return Object.keys(s.records).filter(k => s.locked[k] === undefined).map(k => {
        const [row, col] = k.split(':');
        return { name: `${s.students.find(x => x.id === row).name} ${s.assignments.find(a => a.id === col).title}`, value: m.marks[k] };
      });
      if (s.scenario === 'quiz') return Array.from({ length: Math.max(s.wanted.length, m.questions.length) },
        (_, i) => ({ name: `Question ${i + 1}`, value: m.questions[i] || null }));
      if (s.scenario === 'modules') return [...s.units.map(u => ({ name: u.title, value: m.order.indexOf(u.id) })),
        ...s.units.flatMap(u => u.lessons.map(l => ({ name: l.title, value: m.lessons[u.id].indexOf(l.id) })))];
      return s.criteria.map((c, i) => ({ name: c.title, value: m.ratings[i] }));
    },
    plan(m, s) {
      if (s.judge) return { finish: true, message: s.judge.message };
      if (s.scenario === 'grades') {
        for (const k of Object.keys(s.records)) if (s.locked[k] === undefined && numberError(m.marks[k], gradeValue(s, k)))
          return reveal(m, `cell:${k}`) || { type: [{ cell: k }, String(gradeValue(s, k))] };
      } else if (s.scenario === 'quiz') {
        if (m.questions.length > s.wanted.length) return m.active === m.questions.length - 1 ? { click: { remove: true } } : { click: { question: m.questions.length - 1 } };
        for (let i = 0; i < s.wanted.length; i++) {
          const q = m.questions[i], target = s.bank[s.wanted[i]];
          if (!q) return { click: { add: true } };
          if (!questionError(q, target)) continue;
          if (m.active !== i) return { click: { question: i } };
          if (q.type !== target.type || q.options.length !== target.options.length)
            return reveal(m, 'type') || { click: { type: target.type } };
          if (q.title !== target.title) return reveal(m, 'title') || { type: [{ field: 'title' }, target.title] };
          for (let j = 0; j < target.options.length; j++) if (q.options[j] !== target.options[j])
            return reveal(m, `option:${j}`) || { type: [{ option: j }, target.options[j]] };
          if (q.correct !== target.correct) return reveal(m, `answer:${target.correct}`) || { click: { answer: target.correct } };
          if (numberError(q.points, target.points)) return reveal(m, 'points') || { type: [{ field: 'points' }, String(target.points)] };
        }
      } else if (s.scenario === 'modules') {
        for (let i = 0; i < s.goalOrder.length; i++) if (m.order[i] !== s.goalOrder[i]) return { drag: [{ item: s.goalOrder[i], group: 'modules' }, { slot: i, group: 'modules', item: s.goalOrder[i] }] };
        for (const u of s.units) for (let i = 0; i < s.goalLessons[u.id].length; i++) if (m.lessons[u.id][i] !== s.goalLessons[u.id][i]) {
          if (m.unit !== u.id) return { click: { unit: u.id } };
          return { drag: [{ item: s.goalLessons[u.id][i], group: u.id }, { slot: i, group: u.id, item: s.goalLessons[u.id][i] }] };
        }
      } else for (let i = 0; i < s.ratings.length; i++) if (m.ratings[i] !== s.ratings[i])
        return reveal(m, `rating:${i}`) || { click: { rating: [i, s.ratings[i]] } };
      return null;
    },
    solve(s, model) {
      const m = clone(model || { marks: {}, questions: [], order: [], lessons: {}, ratings: [], active: 0, unit: null, learner: null });
      if (s.scenario === 'grades') m.marks = Object.fromEntries(Object.keys(s.records).map(k => [k, String(s.locked[k] ?? gradeValue(s, k))]));
      else if (s.scenario === 'quiz') m.questions = s.wanted.map(id => ({ ...clone(s.bank[id]), points: String(s.bank[id].points) }));
      else if (s.scenario === 'modules') { m.order = s.goalOrder.slice(); m.lessons = clone(s.goalLessons); m.unit = m.unit || m.order[0]; }
      else m.ratings = s.ratings.slice();
      return m;
    },
    silent(next, prev, s, rng) {
      if (s.judge || error(next, s) >= error(prev, s)) return null;
      const m = clone(next), choices = [];
      if (s.scenario === 'grades') {
        for (const k of Object.keys(s.records)) if (s.locked[k] === undefined && next.marks[k] !== prev.marks[k]) choices.push(() => { m.marks[k] = prev.marks[k]; });
      }
      else if (s.scenario === 'quiz') {
        if (next.questions.length !== prev.questions.length) choices.push(() => { m.questions = clone(prev.questions); m.active = Math.max(0, m.questions.length - 1); });
        else next.questions.forEach((q, i) => {
          // A type change updates its option schema as one transaction. Revert it atomically so a
          // true/false item can never retain the previous multiple-choice options or read-only blanks.
          if (q.type !== prev.questions[i].type) choices.push(() => { m.questions[i] = clone(prev.questions[i]); });
          else for (const field of ['title', 'options', 'correct', 'points']) if (JSON.stringify(q[field]) !== JSON.stringify(prev.questions[i][field]))
            choices.push(() => { m.questions[i][field] = clone(prev.questions[i][field]); });
        });
      } else if (s.scenario === 'modules') {
        if (next.order.join() !== prev.order.join()) choices.push(() => { m.order = prev.order.slice(); });
        for (const u of s.units) if (next.lessons[u.id].join() !== prev.lessons[u.id].join()) choices.push(() => { m.lessons[u.id] = prev.lessons[u.id].slice(); });
      } else next.ratings.forEach((v, i) => { if (v !== prev.ratings[i]) choices.push(() => { m.ratings[i] = prev.ratings[i]; }); });
      if (!choices.length) return null;
      rng.pick(choices)();
      return error(m, s) > 0 ? m : null;
    },
    retarget(s, m, rng) {
      if (s.judge) return null;
      const out = clone(s);
      if (s.scenario === 'grades') out.scheme = s.scheme === 'Recorded' ? 'Moderated' : 'Recorded';
      else if (s.scenario === 'quiz') out.wanted[0] = s.bank.findIndex((q, i) => !s.wanted.includes(i) && questionError(m.questions[0], q) > 0);
      else if (s.scenario === 'modules') { out.goalOrder = s.goalOrder.slice(1).concat(s.goalOrder[0]); }
      else {
        const i = rng.int(0, s.ratings.length - 1);
        out.ratings[i] = rng.pick([0, 1, 2, 3].filter(v => v !== m.ratings[i] && v !== s.ratings[i]));
      }
      return error(m, out) > 0 ? out : null;
    },
  };
  env.task(task);
})();
