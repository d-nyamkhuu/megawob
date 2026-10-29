/*
 * use-course-admin/workspace: shared course administration workspace for grades, modules, quiz and rubric.
 * design: {} reproduces design-use-course-admin-grades-01, design-use-course-admin-modules-01, design-use-course-admin-quiz-01 and
 * design-use-course-admin-rubric-01 for their respective scenarios. No scenario presets: all use TOKENS below.
 * Main/source panes accept wheel input; only root is anchored. locate never mutates the DOM.
 * Tokens (defaults; object/array tokens replace whole values):
 *   css = CSS: structural lms-* stylesheet (use-course-admin/_theme.js).
 *   colors = { panel: 'var(--panel)', line: 'var(--line)', accent: 'var(--accent)', muted: 'var(--muted)', fg: 'var(--fg)', bg: 'var(--bg)' }: CSS palette; replace the whole object.
 *   font = 'inherit': control font.
 *   fontSize = 12: workspace base font size in px.
 *   inset = 10: workspace inset in px.
 *   radius = 5: workspace border radius in px.
 *   railWidth = 148: full course rail width in px.
 *   sourceWidth = 27: source pane flex basis in percent.
 *   sourceMin = 170: source pane minimum width in px.
 *   sourceMax = 265: source pane maximum width in px.
 *   narrowAt = 920: stage width below which compact/slim classes apply.
 *   brand = 'Scholar': course rail brand.
 *   names = { grades: 'Gradebook', quiz: 'Quizzes', modules: 'Modules', rubric: 'Rubrics' }: scenario titles.
 *   icons = PATHS: complete SVG path table in _theme.js; replace whole object.
 *   concludedCount = 9: concluded gradebook rows; changing it changes RNG draw count.
 *   rowMax = 73: maximum module/lesson row height in px.
 *   rowMin = 22: minimum row height in px.
 *   rowReserve = 81: height reserved above/below rows in px.
 *   rowGap = 5: row spacing allowance in px.
 *   rowDetailsAt = 40: row height at which metadata appears in px.
 *   resourcesAt = 440: main pane height above which resources appear in px.
 *   activity = three reference activity text/time pairs in _theme.js: recent activity text/time pairs.
 *   quizSettings = six reference setting pairs in _theme.js: quiz setting label/value pairs.
 * Parts: overrides are (base, S) => replacement; calls always go through P.
 * S.ctx/spec/util/rng read the live episode; S.D/P read resolved tokens/parts.
 * S exposes live, settable node/controller fields listed in its definition below, including targets,
 * editorRefs, unitSort/lessonSort, moduleRows/lessonRows and unitList/lessonList/lessonTitle.
 * Unless a return value is documented, a part builds or synchronizes in place and returns nothing.
 *   remember(key, node): -> node: register a visible/editor target.
 *   showPanel(title, lines): open supporting workspace panel, updating workspacePanel; close clears it.
 *   mirror(): mirror visible/registered target keys into the model; no-op while drawing or for modules.
 *   act(m): update model and call P.draw with the resulting model.
 *   updateQuestion(field, value): clone model, update active question field and call P.act.
 *   makeInput(parent, key, value, onInput, cls = '', tag = 'input'): -> input/textarea: initialize, label and register editable text control.
 *   drawSource(): dispatch source stamp, scenario reference contents and recent activity.
 *   gradeTools(): student search, enrollment filters and export controls.
 *   gradeTable(): -> { table, body, caption }: gradebook table and column headings.
 *   buildGrades(): gradebook controls, table, active rows and concluded enrollments.
 *   buildQuiz(m): rebuild question navigation; rebuild editor only when active/count/type changes.
 *   quizSettings(parent): supporting quiz configuration rows.
 *   moduleColumns(): -> left column: progression header, module and lesson panes; sets list/title nodes.
 *   buildModules(): module/lesson columns, measured unit sortable and optional resources.
 *   drawLessons(m): switch the active lesson sortable or synchronize its order.
 *   rubricIntro(): assessment title, learner and instructions.
 *   rubricTable(): -> tbody: criterion table and level headings.
 *   buildRubric(): assessment introduction, criterion table and feedback.
 *   draw(m): sync values, selection, validation, totals and visible-target metadata.
 *   icon(parent, name): -> SVG: draw the named icon, falling back to file.
 *   initials(name): -> string: first two initials.
 *   button(parent, label, action, cls = ''): -> button: label, optional click handler and extra classes.
 *   root(): -> section: responsive workspace anchor in ctx.stage.
 *   rail(): course rail, other courses and workspace-panel links.
 *   header(): course heading, notifications, instructor avatar and scenario tabs.
 *   toolbar(): workspace title, status note and actions menu.
 *   context(): section selector, term and publishing status.
 *   roster(): judge-only matching-student controls.
 *   questionRail(): quiz question list and supporting item banks; no-op for other scenarios.
 *   panes(): create the working and reference panes.
 *   footer(): summary and persistent saved status.
 *   sourceStamp(): reference revision or submission stamp.
 *   gradesSource(): reference contents for grades.
 *   quizSource(): reference contents for quiz.
 *   modulesSource(): reference contents for modules.
 *   rubricSource(): reference contents for rubric.
 *   activity(): recent course activity beneath the reference contents.
 *   sourceStudent(row): student grading-sheet block, excluding locked cells.
 *   sourceQuestion(q, i): question brief card including its answer key.
 *   sourceUnit(u): module outline card and approved lesson order.
 *   gradeRow(body, row, i): active student row; registers total and editable cells.
 *   gradeCell(tr, row, a): locked score or registered editable grade input.
 *   concludedRow(body, seen, i): concluded enrollment; draws one personName, then one int per assignment, in order.
 *   questionNav(q, i, m): question navigation button with points and title.
 *   quizHeading(): draft quiz heading.
 *   emptyQuiz(): empty-quiz message and settings.
 *   quizEditor(m): question editor; calls type, rich-text and option controls.
 *   questionTypes(types, type): one question-type button and model update.
 *   richbar(editor): rich-text formatting controls and supporting panels.
 *   questionOption(editor, q, i): answer radio, option letter and registered option input.
 *   moduleRow(u, i, h): module grip/open button/state; records moduleRows and unit controls.
 *   resources(left): supporting course resource list.
 *   lessonRow(lesson, i, h): lesson grip, type, title and state; records lessonRows.
 *   criterionRow(body, c, i): criterion label, description and rating cells.
 *   ratingCell(tr, c, i, j): weighted rating button; registers row and individual rating targets.
 *   feedback(): read-only feedback box and submission conversation button.
 *   quizToolbar(): add/delete question controls and model updates.
 *   locate(t): -> [x,y]: read-only target resolution through controls/sortables; throws if missing.
 *   frame(): assemble rail, heading, toolbar, context, roster, work panes and footer.
 *   begin(ctx): before CSS and frame construction (default no-op).
 *   rendered(ctx): after initial sync and scroll wiring (default no-op).
 *   item(ctx, node, kind, data): after a row/card/control is constructed (default no-op).
 *   rowHeight(count): -> px: fit module/lesson rows to the working pane.
 *   styles(): -> CSS: structural stylesheet with palette, font and size tokens.
 * Preserve RNG calls and order when overriding concludedRow/buildGrades or rubricSource/drawSource.
 * Additional randomness must use ctx.rng.fork with a new label.
 */
(function () {
  'use strict';
  function installControls(BASE, S) {
    BASE.remember = (key, node) => { S.targets.set(key, node); return node; };

    BASE.showPanel = (title, lines) => {
      if (S.pop) S.pop.remove();
      S.ctx.update({ ...S.ctx.model, workspacePanel: title });
      S.pop = S.el('aside', 'lms-pop', S.root); S.el('h4', '', S.pop, title);
      for (const line of lines) S.el('p', '', S.pop, line);
      S.P.button(S.pop, 'Close', () => { S.pop.remove(); S.pop = null; S.ctx.update({ ...S.ctx.model, workspacePanel: null }); });
    };

    BASE.mirror = () => {
      if (S.drawing || S.spec.scenario === 'modules') return;
      const r = S.main.getBoundingClientRect(), visible = [], keys = [...S.targets.keys()];
      for (const [key, node] of S.targets) {
        const b = node.getBoundingClientRect();
        if (b.height > 0 && b.top >= r.top + 1 && b.bottom <= r.bottom - 1) visible.push(key);
      }
      if (JSON.stringify(visible) !== JSON.stringify(S.ctx.model.visible) || JSON.stringify(keys) !== JSON.stringify(S.ctx.model.targets))
        S.ctx.update({ ...S.ctx.model, visible, targets: keys });
    };

    BASE.act = (m) => {
      S.ctx.update(m); S.P.draw(S.ctx.model);
    };

    BASE.updateQuestion = (field, value) => {
      const m = env.util.clone(S.ctx.model), q = m.questions[m.active];
      if (!q) return;
      q[field] = value; S.P.act(m);
    };

    BASE.makeInput = (parent, key, value, onInput, cls = '', tag = 'input') => {
      const input = S.el(tag, cls, parent); if (tag === 'input') input.type = 'text';
      input.value = String(value ?? ''); input.setAttribute('aria-label', key);
      S.P.remember(key, input); input.addEventListener('input', () => onInput(input.value)); return input;
    };

    BASE.drawSource = () => {
      S.P.sourceStamp();
      S.P[`${S.spec.scenario}Source`]();
      S.P.activity();
    };
  }

  function installBuilders(BASE, S) {
    BASE.gradeTools = () => {
      const find = S.P.button(S.context, 'Student name or ID', () => S.P.showPanel('Find students', S.spec.students.map(x => `${x.name} / ${x.id}`)), 'lms-filter'); S.P.icon(find, 'search');
      const filter = S.P.button(S.context, 'Filters', () => S.P.showPanel('Gradebook filters', ['Section: A', 'Enrollment: Active and concluded', 'Assignment group: All assignments', 'Grading period: Autumn term']), 'lms-filter'); S.P.icon(filter, 'filter');
      S.P.icon(S.P.button(S.tools, 'Export', () => S.P.showPanel('Gradebook export', ['Current gradebook / CSV format', 'Includes active and concluded enrollments.', 'Last export: Yesterday, 15:40']), 'lms-iconbtn'), 'download');
    };

    BASE.gradeTable = () => {
      const table = S.el('table', 'lms-table', S.main), tr = S.el('tr', '', S.el('thead', '', table));
      const caption = S.el('caption', 'lms-table-caption', table, `${S.spec.students.length} active students / Concluded enrollments shown below / Finalized scores are locked`);
      S.el('th', '', tr, 'Student'); for (const a of S.spec.assignments) { const h = S.el('th', '', tr, a.title); S.el('small', 'lms-id', h, `out of ${a.max}`); }
      S.el('th', 'lms-status-col', tr, 'Submission'); S.el('th', '', tr, 'Total');
      const body = S.el('tbody', '', table);
      return { table, body, caption };
    };

    BASE.buildGrades = () => {
      S.note.textContent = 'All students / Points';
      S.P.gradeTools();
      const { body, caption } = S.P.gradeTable();
      for (const [i, row] of S.spec.students.entries()) {
        S.P.gradeRow(body, row, i);
      }
      const seen = new Set(S.spec.students.map(x => x.name)), extras = S.D.concludedCount;
      for (let i = 0; i < extras; i++) {
        S.P.concludedRow(body, seen, i);
      }
      caption.textContent = `${S.spec.students.length + extras} enrollments / ${S.spec.students.length} active / Concluded grades are read-only`;
    };

    BASE.buildQuiz = (m) => {
      const shape = `${m.active}/${m.questions.length}/${m.questions[m.active]?.type || ''}`;
      S.list.replaceChildren();
      m.questions.forEach((q, i) => {
        S.P.questionNav(q, i, m);
      });
      if (shape === S.lastEditor) return;
      S.lastEditor = shape; S.main.replaceChildren(); S.targets = new Map(); S.editorRefs = {};
      S.main.scrollTop = 0;
      S.P.quizHeading();
      if (!m.questions.length) { S.P.emptyQuiz(); return; }
      S.P.quizEditor(m);
    };

    BASE.quizSettings = (parent) => {
      const settings = S.el('div', 'lms-settings', parent); S.el('h4', '', settings, 'Quiz settings');
      for (const [key, value] of S.D.quizSettings) {
        const row = S.el('div', 'lms-setting-row', settings); S.el('span', '', row, key); S.el('b', '', row, value);
      }
    };

    BASE.moduleColumns = () => {
      const mh = S.el('div', 'lms-module-head', S.main); S.P.icon(mh, 'layers'); S.el('span', '', mh, 'Student progression');
      S.el('span', 'lms-tag', mh, 'Sequential requirements');
      const cols = S.el('div', 'lms-modules', S.main), left = S.el('div', 'lms-unit-col', cols), right = S.el('div', 'lms-lesson-col', cols);
      S.el('h3', 'lms-col-title', left, 'Course modules'); S.unitList = S.el('div', '', left);
      S.lessonTitle = S.el('h3', 'lms-col-title', right); S.lessonList = S.el('div', '', right);
      return left;
    };

    BASE.buildModules = () => {
      S.note.textContent = 'Course content / Instructor sequence';
      const left = S.P.moduleColumns();
      const h = S.P.rowHeight(Math.max(S.spec.units.length, S.spec.units[0].lessons.length));
      for (const [i, u] of S.spec.units.entries()) {
        S.P.moduleRow(u, i, h);
      }
      S.unitSort = env.ui.sortable(S.unitList, { order: S.ctx.model.order, items: S.moduleRows, handle: '.lms-grip', axis: 'y', activeClass: 'dragging',
        onChange: order => S.P.act({ ...S.ctx.model, order }) });
      if (S.main.clientHeight > S.D.resourcesAt) S.P.resources(left);
    };

    BASE.drawLessons = (m) => {
      if (S.activeUnit === m.unit) { S.lessonSort.set(m.lessons[m.unit]); return; }
      if (S.lessonSort) S.lessonSort.detach(); S.activeUnit = m.unit; S.lessonList.replaceChildren(); S.lessonRows = {};
      const u = S.spec.units.find(u => u.id === m.unit); S.lessonTitle.textContent = `Lessons / ${u.title}`;
      const h = S.P.rowHeight(u.lessons.length);
      for (const [i, lesson] of u.lessons.entries()) {
        S.P.lessonRow(lesson, i, h);
      }
      S.lessonSort = env.ui.sortable(S.lessonList, { order: m.lessons[u.id], items: S.lessonRows, handle: '.lms-grip', axis: 'y', activeClass: 'dragging',
        onChange: order => S.P.act({ ...S.ctx.model, lessons: { ...S.ctx.model.lessons, [u.id]: order } }) });
    };

    BASE.rubricIntro = () => {
      const intro = S.el('div', 'lms-rubric-intro', S.main); S.el('h3', '', intro, 'Project report: assessment rubric');
      S.el('p', '', intro, `${S.spec.students.find(x => x.id === S.spec.student).name} / Section A / Attempt 1`);
      S.el('p', '', intro, 'Assess evidence, reasoning and communication against the course learning outcomes. Scores are weighted by criterion.');
    };

    BASE.rubricTable = () => {
      const table = S.el('table', 'lms-rubric', S.main), tr = S.el('tr', '', S.el('thead', '', table));
      S.el('th', '', tr, 'Criterion'); for (const name of S.spec.levels) S.el('th', '', tr, name);
      const body = S.el('tbody', '', table);
      return body;
    };

    BASE.buildRubric = () => {
      S.note.textContent = 'Project report / Assessment';
      S.P.rubricIntro();
      const body = S.P.rubricTable();
      S.spec.criteria.forEach((c, i) => {
        S.P.criterionRow(body, c, i);
      });
      S.P.feedback();
    };
  }

  function installSync(BASE, S) {
    BASE.draw = (m) => {
      S.drawing = true;
      if (S.spec.scenario === 'grades') {
        let pending = 0, invalid = 0;
        for (const [key, node] of S.targets) if (key.startsWith('cell:')) {
          const k = key.slice(5), v = m.marks[k]; if (node.value !== v) node.value = v;
          const a = S.spec.assignments.find(a => k.endsWith(`:${a.id}`));
          const bad = v !== '' && (!Number.isFinite(Number(v)) || Number(v) < 0 || Number(v) > a.max);
          node.setAttribute('aria-invalid', String(bad)); node.title = bad ? `Enter a score from 0 to ${a.max}` : `${a.title} / Points`;
          if (v === '') pending++; if (bad) invalid++;
        }
        S.note.textContent = invalid ? `${invalid} invalid scores` : pending ? `${pending} awaiting grades` : 'All active grades recorded';
        for (const row of S.spec.students) S.targets.get(`total:${row.id}`).textContent = String(S.f.helpers.total(m, S.spec, row.id));
      } else if (S.spec.scenario === 'quiz') {
        S.P.buildQuiz(m); const q = m.questions[m.active];
        if (q) {
          for (const key of ['title', 'points']) { const n = S.targets.get(key); if (n.value !== String(q[key])) n.value = q[key]; }
          q.options.forEach((v, i) => { const n = S.targets.get(`option:${i}`); if (n.value !== v) n.value = v; S.targets.get(`answer:${i}`).checked = q.correct === i; });
          for (const type of ['Multiple choice', 'True / false']) S.editorRefs[type].classList.toggle('on', type === q.type);
          const missing = [!q.title.trim() && 'Question text required', q.options.some(x => !x.trim()) && 'Complete all options', q.correct < 0 && 'Answer key not set',
            (!String(q.points).trim() || !Number.isFinite(Number(q.points)) || Number(q.points) <= 0) && 'Points required'].filter(Boolean);
          S.editorRefs.validation.textContent = missing.length ? missing.join(' / ') : 'Question complete / Ready for review';
        }
        S.note.textContent = 'Draft quiz / Not published';
      } else if (S.spec.scenario === 'modules') {
        S.unitSort.set(m.order); S.P.drawLessons(m);
        for (const u of S.spec.units) S.moduleRows[u.id].classList.toggle('current', m.unit === u.id);
      } else {
        S.spec.criteria.forEach((c, i) => S.spec.levels.forEach((v, j) => { const b = S.editorRefs[`rating:${i}:${j}`]; b.classList.toggle('on', m.ratings[i] === j); b.setAttribute('aria-pressed', String(m.ratings[i] === j)); }));
      }
      S.summary.textContent = S.f.facts(m, S.spec).map(x => `${x.label}: ${x.value}`).join('  ·  ');
      S.statusText.textContent = m.learner ? `Viewing student ${m.learner}` : 'All changes saved';
      S.drawing = false; S.P.mirror();
    };

    BASE.icon = (parent, name) => {
      const svg = S.util.svg('svg', { viewBox: '0 0 24 24', class: 'lms-icon', 'aria-hidden': 'true' }, parent);
      S.util.svg('path', { d: S.D.icons[name] || S.D.icons.file }, svg); return svg;
    };

    BASE.initials = (name) => {
      return name.split(' ').map(x => x[0]).slice(0, 2).join('');
    };

    BASE.button = (parent, label, action, cls = '') => {
      const b = S.el('button', `lms-btn ${cls}`, parent, label); b.type = 'button'; if (action) b.addEventListener('click', action); return b;
    };
  }

  function installFrame(BASE, S) {
    BASE.root = () => {
      return S.el('section', `lms ${S.spec.scenario}${S.ctx.size.width < S.D.narrowAt ? ' compact slim' : ''}`, S.ctx.stage);
    };

    BASE.rail = () => {
      S.rail = S.el('aside', 'lms-rail', S.root); const brand = S.el('div', 'lms-rail-brand', S.rail);
      S.P.icon(brand, 'book'); S.el('span', '', brand, S.D.brand);
      S.el('div', 'lms-rail-label', S.rail, 'Teaching / Autumn');

      const links = [['home', 'Course home', 'home'], ['announcements', 'Announcements', 'bell'], ['modules', 'Modules', 'layers'],
        ['assignments', 'Assignments', 'file'], ['quiz', 'Quizzes', 'quiz'], ['grades', 'Gradebook', 'grid'],
        ['rubric', 'Rubrics', 'grid'], ['discussions', 'Discussions', 'message'], ['people', 'People', 'users'], ['calendar', 'Calendar', 'calendar']];
      for (const [id, label, pict] of links) {
        const b = S.P.button(S.rail, '', () => S.P.showPanel(label, id === 'announcements'
          ? ['Week 6: project feedback is available.', 'Library workshop: Wednesday, 14:00.', 'Office hours have moved to Room 204.']
          : ['Current course: ' + S.spec.course, 'Course materials and settings are available to teaching staff.']), id === S.spec.scenario ? 'current' : '');
        b.title = label; S.P.icon(b, pict); S.el('span', '', b, label);
        if (id === 'announcements' || id === 'discussions') S.el('span', 'lms-rail-count', b, id === 'announcements' ? '3' : '8');
      }
      const railBottom = S.el('div', 'lms-rail-bottom', S.rail); S.el('div', 'lms-rail-label', railBottom, 'Other courses');
      for (const course of ['Research Studio II', 'Portfolio Seminar']) {
        const c = S.el('div', 'lms-rail-course', railBottom); S.el('b', '', c, course); S.el('span', 'lms-muted', c, 'Autumn term / Staff');
      }
    };

    BASE.header = () => {
      const head = S.el('header', 'lms-head', S.surface), title = S.el('div', '', head);
      const crumb = S.el('div', 'lms-crumb', title); S.el('span', '', crumb, 'My courses'); S.P.icon(crumb, 'chevron'); S.el('span', '', crumb, 'Autumn / Section A');
      S.el('h2', '', title, S.spec.course);
      const headActions = S.el('div', 'lms-head-actions', head); S.el('span', 'lms-badge', headActions, 'Instructor view');
      const notices = S.P.button(headActions, '', () => S.P.showPanel('Notifications', ['2 submissions were received in Project report.', 'Grade moderation is due Friday.', 'A student replied to the Week 6 discussion.']), 'lms-iconbtn');
      notices.title = 'Notifications'; S.P.icon(notices, 'bell'); S.el('span', '', notices, '3');
      S.el('span', 'lms-avatar', headActions, S.P.initials(S.spec.instructor)).title = S.spec.instructor;
      const nav = S.el('nav', 'lms-nav', S.surface);
      for (const [id, name] of Object.entries(S.D.names)) S.el('span', id === S.spec.scenario ? 'current' : '', nav, name);
      S.el('span', 'lms-extra-nav', nav, 'Course settings');
    };

    BASE.toolbar = () => {
      S.tools = S.el('div', 'lms-tools', S.surface);
      S.el('strong', '', S.tools, S.D.names[S.spec.scenario]);
      S.note = S.el('span', 'lms-muted', S.tools);
      const menu = S.P.button(S.tools, 'Actions', () => S.P.showPanel(`${S.D.names[S.spec.scenario]} actions`, S.spec.scenario === 'grades'
        ? ['Import a grade file (.csv)', 'Export the current gradebook', 'View grade change history', 'Manage grading periods']
        : ['View revision history', 'Manage availability', 'Copy to another course', 'Open course help']), 'lms-iconbtn'); S.P.icon(menu, 'down');
    };

    BASE.context = () => {
      S.context = S.el('div', 'lms-context', S.surface);
      const scope = S.P.button(S.context, 'Section A', () => S.P.showPanel('Course sections', ['Section A / Current workspace', 'Section B / 24 enrollments', 'Concluded enrollments are read-only.']), 'lms-filter'); S.P.icon(scope, 'down');
      S.el('span', '', S.context, 'Autumn term'); S.el('span', 'right', S.context, S.spec.scenario === 'grades' ? 'Grade posting: Manual' : 'Course status: Published');
    };

    BASE.roster = () => {
      if (S.spec.judge) {
        S.roster = S.el('div', 'lms-roster', S.surface); S.el('b', '', S.roster, 'Course roster / 2 matching students');
        for (const who of S.spec.students.slice(0, 2)) S.P.button(S.roster, `${who.name} · ${who.id}`, () => S.P.act({ ...S.ctx.model, learner: who.id }));
      }
    };

    BASE.questionRail = () => {
      if (S.spec.scenario === 'quiz') {
        const qr = S.el('aside', 'lms-qrail', S.work); S.el('h4', '', qr, 'Questions'); S.list = S.el('div', 'lms-question-list', qr);
        S.el('h4', '', qr, 'Item banks');
        for (const [i, label] of ['Research foundations', 'Evidence review', 'Previous assessments'].entries()) {
          const item = S.el('div', 'lms-library-item', qr); S.P.icon(item, 'quiz'); S.el('b', '', item, label); S.el('small', '', item, `${[12, 8, 16][i]} items / Private`);
        }
      }
    };

    BASE.panes = () => {
      S.main = S.el('div', 'lms-main', S.work); S.source = S.el('aside', 'lms-source', S.work);
    };

    BASE.footer = () => {
      const foot = S.el('footer', 'lms-foot', S.surface); S.summary = S.el('span', '', foot); const status = S.el('span', 'saved', foot);
      S.P.icon(status, 'check'); S.statusText = S.el('span', '', status, 'All changes saved');
    };
  }

  function installSources(BASE, S) {
    BASE.sourceStamp = () => {
      const stamp = S.el('div', 'lms-source-stamp', S.source);
      S.el('span', 'lms-tag', stamp, S.spec.scenario === 'rubric' ? 'Attempt 1 / Submitted' : 'Staff reference / Revision 3');
      S.el('p', 'lms-muted', stamp, S.spec.scenario === 'rubric' ? 'Project report / PDF submission' : `Prepared by ${S.spec.instructor}`);
    };

    BASE.gradesSource = () => {
      S.P.icon(S.el('h3', '', S.source, 'Grading sheet'), 'file');
      S.el('p', 'lms-muted', S.source, S.spec.components ? 'Add the two rubric components for each score. Locked entries are already final.' : 'Approved marks · points. Locked entries are already final.');
      for (const row of S.spec.students) {
        S.P.sourceStudent(row);
      }
    };

    BASE.quizSource = () => {
      S.P.icon(S.el('h3', '', S.source, 'Question brief'), 'file'); S.el('p', 'lms-muted', S.source, 'Approved question content. Correct answers are marked below.');
      S.spec.bank.forEach((q, i) => {
        S.P.sourceQuestion(q, i);
      });
    };

    BASE.modulesSource = () => {
      S.P.icon(S.el('h3', '', S.source, 'Teaching outline'), 'layers'); S.el('p', 'lms-muted', S.source, 'Approved lesson sequence / Course design review');
      for (const u of S.spec.units) {
        S.P.sourceUnit(u);
      }
    };

    BASE.rubricSource = () => {
      S.el('h3', '', S.source, 'Project assessment');
      S.el('p', '', S.source, S.spec.students.find(x => x.id === S.spec.student).name);
      S.el('small', '', S.source, `Assessor: ${S.spec.instructor}`);
      const paper = S.el('div', 'lms-paper', S.source); S.P.icon(paper, 'file'); S.el('h4', '', paper, 'Project report');
      S.el('small', 'lms-muted', paper, 'Submission preview / Page 1 of 4');
      S.el('p', '', paper, 'Our investigation examines how small changes in the study design affect the reliability of the findings.');
      S.el('p', '', paper, env.content.paragraph(S.rng.fork('submission'), 2, { ...S.cs, domain: 'science' }));
      S.el('p', 'lms-muted', S.source, 'Assessment guide');
      for (const [i, level] of S.spec.levels.entries()) {
        const a = S.el('article', '', S.source); S.el('b', '', a, `${level} · ${i} × weight`);
        S.el('p', 'lms-muted', a, ['Evidence is absent or does not address the criterion.', 'Some relevant work; substantial gaps remain.', 'Clear and relevant work meeting the expected standard.', 'Consistent, thoughtful work exceeding the expected standard.'][i]);
      }
    };

    BASE.activity = () => {
      const activity = S.el('div', 'lms-activity', S.source); S.el('h4', '', activity, 'Recent activity');
      for (const [text, when] of S.D.activity) {
        const p = S.el('p', '', activity, text); S.el('small', 'lms-id', p, when);
      }
    };

    BASE.sourceStudent = (row) => {
      const r = S.el('div', 'lms-source-row', S.source); S.el('b', '', r, row.name); S.el('small', 'lms-id', r, row.id);
      for (const a of S.spec.assignments) {
        const k = S.f.helpers.cellKey(row.id, a.id); if (S.spec.locked[k] !== undefined) continue;
        S.el('p', '', r, a.title);
        const scores = S.el('div', 'lms-score', r);
        for (const scheme of ['Recorded', 'Moderated']) {
          const v = S.el('div', '', scores); S.el('small', '', v, scheme); S.el('b', '', v, S.spec.records[k][scheme].join(' + '));
        }
      }
      S.P.item(S.ctx, r, 'sourceStudent', row);
    };

    BASE.sourceQuestion = (q, i) => {
      const a = S.el('article', '', S.source); S.el('small', '', a, `BRIEF ${i + 1} · ${q.type} · ${q.points} pts`); S.el('p', '', a, q.title);
      const ol = S.el('ol', '', a); q.options.forEach((o, j) => { const li = S.el('li', j === q.correct ? 'key' : '', ol, o); if (j === q.correct) S.P.icon(li, 'check'); });
      S.P.item(S.ctx, a, 'sourceQuestion', q);
    };

    BASE.sourceUnit = (u) => {
      const a = S.el('article', '', S.source); S.el('b', '', a, u.title); const ol = S.el('ol', '', a);
      for (const id of S.spec.goalLessons[u.id]) S.el('li', '', ol, u.lessons.find(l => l.id === id).title);
      S.P.item(S.ctx, a, 'sourceUnit', u);
    };
  }

  function installGradeRows(BASE, S) {
    BASE.gradeRow = (body, row, i) => {
      const tr = S.el('tr', '', body), who = S.el('td', 'lms-person', tr), person = S.el('div', 'lms-student', who);
      S.el('span', 'lms-avatar', person, S.P.initials(row.name));
      const label = S.el('div', '', person, row.name); S.el('small', 'lms-id', label, `${row.id} / Section A`);
      for (const a of S.spec.assignments) {
        S.P.gradeCell(tr, row, a);
      }
      const submission = S.el('td', 'lms-status-col', tr); S.el('span', `lms-tag ${i === 1 ? 'warn' : 'good'}`, submission, i === 1 ? 'Late' : 'Submitted');
      S.P.remember(`total:${row.id}`, S.el('td', '', tr));
      S.P.item(S.ctx, tr, 'gradeRow', row);
    };

    BASE.gradeCell = (tr, row, a) => {
      const td = S.el('td', '', tr), key = S.f.helpers.cellKey(row.id, a.id);
      if (S.spec.locked[key] !== undefined) { const lock = S.el('div', 'lms-lock', td, String(S.spec.locked[key])); S.P.icon(lock, 'lock'); lock.title = 'Locked final grade'; }
      else S.P.makeInput(td, `cell:${key}`, S.ctx.model.marks[key], value => S.P.act({ ...S.ctx.model, marks: { ...S.ctx.model.marks, [key]: value } }), 'lms-mark');
    };

    BASE.concludedRow = (body, seen, i) => {
      let name = env.content.personName(S.rng, S.cs).full;
      if (seen.has(name)) name += ` ${i + 1}`; seen.add(name);
      const tr = S.el('tr', 'lms-concluded', body), td = S.el('td', 'lms-person', tr, name);
      S.el('small', 'lms-id', td, `C${700 + i} / Concluded`);
      let total = 0;
      for (const a of S.spec.assignments) { const value = S.rng.int(Math.ceil(a.max * .6), a.max); total += value; S.el('td', '', tr, String(value)); }
      S.el('td', 'lms-status-col', tr, 'Finalized'); S.el('td', '', tr, String(total));
      S.P.item(S.ctx, tr, 'concludedRow', i);
    };
  }

  function installQuizEditor(BASE, S) {
    BASE.questionNav = (q, i, m) => {
      const b = S.P.button(S.list, `Q${i + 1}`, () => S.P.act({ ...S.ctx.model, active: i }), `lms-qnav${i === m.active ? ' current' : ''}`);
      b.title = q.title || 'Untitled question'; S.el('small', '', b, `${q.points || '0'} pts`);
      S.el('small', '', b, q.title ? q.title.slice(0, 32) : 'Untitled'); S.editorRefs[`nav:${i}`] = b;
    };

    BASE.quizHeading = () => {
      const banner = S.el('div', 'lms-pane-heading', S.main), heading = S.el('div', '', banner);
      S.el('b', '', heading, 'Course knowledge check'); S.el('small', '', heading, 'Graded quiz / Assignment group: Assessments');
      S.el('span', 'lms-tag warn', banner, 'Draft');
    };

    BASE.emptyQuiz = () => {
      const e = S.el('div', 'lms-empty', S.main); S.P.icon(e, 'quiz'); S.el('b', '', e, 'This quiz has no questions yet');
      S.el('span', '', e, 'Questions can be authored here or reused from your private item banks.');
      S.P.quizSettings(S.main);
    };

    BASE.quizEditor = (m) => {
      const q = m.questions[m.active], editor = S.el('div', 'lms-editor', S.main);
      S.el('b', '', editor, `Question ${m.active + 1}`); S.el('span', 'lms-id', editor, 'Saved draft / Student response required');
      S.el('label', '', editor, 'Question type');
      const types = S.el('div', 'lms-types', editor); S.P.remember('type', types);
      for (const type of ['Multiple choice', 'True / false']) {
        S.P.questionTypes(types, type);
      }
      S.el('label', '', editor, 'Question text');
      S.P.richbar(editor);
      S.P.makeInput(editor, 'title', q.title, value => S.P.updateQuestion('title', value), '', 'textarea');
      S.el('label', '', editor, 'Options · select the correct answer');
      for (let i = 0; i < q.options.length; i++) {
        S.P.questionOption(editor, q, i);
      }
      S.el('label', '', editor, 'Points'); S.P.makeInput(editor, 'points', q.points, value => S.P.updateQuestion('points', value), 'lms-points');
      S.editorRefs.validation = S.el('p', 'lms-form-message', editor);
      S.P.quizSettings(S.main);
    };

    BASE.questionTypes = (types, type) => {
      const b = S.P.button(types, type, () => {
        const next = env.util.clone(S.ctx.model), q = next.questions[next.active]; q.type = type;
        q.options = type === 'True / false' ? ['True', 'False'] : ['', '', '']; q.correct = -1; S.P.act(next);
      }); S.editorRefs[type] = b;
    };

    BASE.richbar = (editor) => {
      const bar = S.el('div', 'lms-richbar', editor);
      for (const [label, name] of [['Bold', null], ['Italic', null], ['Insert link', 'link'], ['Insert image', 'image']]) {
        const b = S.P.button(bar, name ? '' : label[0], () => S.P.showPanel(label, ['Rich content editor', 'Formatting and embedded media are available for course authors.']));
        b.title = label; if (name) S.P.icon(b, name); else if (label === 'Bold') b.style.fontWeight = '750'; else b.style.fontStyle = 'italic';
      }
      S.el('span', '', bar, 'Paragraph');
    };

    BASE.questionOption = (editor, q, i) => {
      const row = S.el('div', 'lms-opt', editor), radio = S.el('input', '', row); radio.type = 'radio'; radio.name = 'answer';
      radio.setAttribute('aria-label', `Correct answer ${i + 1}`); S.P.remember(`answer:${i}`, radio); radio.addEventListener('change', () => S.P.updateQuestion('correct', i));
      S.el('span', 'lms-answer-letter', row, String.fromCharCode(65 + i));
      const input = S.P.makeInput(row, `option:${i}`, q.options[i], value => { const options = S.ctx.model.questions[S.ctx.model.active].options.slice(); options[i] = value; S.P.updateQuestion('options', options); });
      if (q.type === 'True / false') input.readOnly = true;
      S.P.item(S.ctx, row, 'questionOption', i);
    };
  }

  function installModuleRows(BASE, S) {
    BASE.moduleRow = (u, i, h) => {
      const row = S.el('div', 'lms-dragrow', S.unitList); row.style.height = `${h}px`; S.moduleRows[u.id] = row;
      S.P.icon(S.el('span', 'lms-grip', row), 'grip'); const b = S.el('button', 'lms-unit-open', row, u.title); b.type = 'button';
      if (h >= S.D.rowDetailsAt) S.el('small', '', b, `${u.lessons.length} items / ${i ? 'Prerequisite set' : 'No prerequisite'}`);
      S.P.icon(S.el('span', 'lms-row-state', row), i === S.spec.units.length - 1 ? 'clock' : 'check');
      b.addEventListener('click', () => S.P.act({ ...S.ctx.model, unit: u.id })); S.editorRefs[`unit:${u.id}`] = b;
      S.P.item(S.ctx, row, 'moduleRow', u);
    };

    BASE.resources = (left) => {
      const resources = S.el('div', 'lms-resources', left); S.el('h4', '', resources, 'Course resources');
      for (const [name, meta] of [['Course handbook.pdf', 'PDF / 420 KB'], ['Reading list', 'Library collection / 12 sources'], ['Assessment calendar', 'Course information / Updated yesterday']]) {
        const row = S.el('div', 'lms-resource', resources); S.P.icon(row, 'file'); const label = S.el('div', '', row, name); S.el('small', '', label, meta);
      }
    };

    BASE.lessonRow = (lesson, i, h) => {
      const row = S.el('div', 'lms-dragrow', S.lessonList); row.style.height = `${h}px`; S.lessonRows[lesson.id] = row;
      S.P.icon(S.el('span', 'lms-grip', row), 'grip'); S.P.icon(row, i === 2 ? 'quiz' : i === 3 ? 'message' : 'file');
      const label = S.el('span', 'lms-dragtext', row, lesson.title);
      if (h >= S.D.rowDetailsAt) S.el('small', '', label, `${i === 2 ? 'Assignment / 10 pts' : 'Learning resource'} / ${i === 1 ? 'Complete to continue' : 'Published'}`);
      S.P.icon(S.el('span', 'lms-row-state', row), 'check');
      S.P.item(S.ctx, row, 'lessonRow', lesson);
    };
  }

  function installRubric(BASE, S) {
    BASE.criterionRow = (body, c, i) => {
      const tr = S.el('tr', '', body), td = S.el('td', '', tr, c.title); S.el('small', 'lms-id', td, `Weight x ${c.weight}`);
      S.el('div', 'lms-criterion-desc', td, ({ 'Use of evidence': 'Support claims with relevant sources.', 'Clarity of argument': 'Develop a clear, defensible position.',
        Organization: 'Structure ideas in a logical sequence.', 'Original insight': 'Show independent analysis and reflection.', 'Source attribution': 'Credit sources consistently.', 'Visual communication': 'Present information clearly and accessibly.' })[c.title]);
      for (let j = 0; j < S.spec.levels.length; j++) {
        S.P.ratingCell(tr, c, i, j);
      }
      S.P.item(S.ctx, tr, 'criterionRow', c);
    };

    BASE.ratingCell = (tr, c, i, j) => {
      const cell = S.el('td', '', tr), b = S.P.button(cell, `${j * c.weight}`, () => { const ratings = S.ctx.model.ratings.slice(); ratings[i] = j; S.P.act({ ...S.ctx.model, ratings }); }, 'lms-rating');
      b.setAttribute('aria-label', `${c.title}: ${S.spec.levels[j]}`); S.el('small', '', b, 'points'); S.editorRefs[`rating:${i}:${j}`] = b;
      if (j === 0) S.P.remember(`rating:${i}`, b);
      S.P.item(S.ctx, b, 'ratingCell', { criterion: c, level: j });
    };

    BASE.feedback = () => {
      const feedback = S.el('div', 'lms-settings', S.main); S.el('h4', '', feedback, 'Overall feedback');
      const comment = S.el('textarea', 'lms-comment', feedback); comment.placeholder = 'Add a comment for the student...';
      comment.readOnly = true; comment.title = 'Feedback is managed in the submission conversation';
      S.P.button(feedback, 'Submission comments', () => S.P.showPanel('Submission conversation', ['Student: I revised the comparison section and added the source notes.', 'Instructor: Thank you. The assessment will be released after moderation.']));
    };
  }

  function installActions(BASE, S) {
    BASE.quizToolbar = () => {
      S.editorRefs.add = S.P.button(S.tools, 'Add question', () => {
        const m = env.util.clone(S.ctx.model); m.questions.push(S.f.helpers.blankQuestion()); m.active = m.questions.length - 1; S.P.act(m);
      }, 'primary');
      S.P.icon(S.editorRefs.add, 'plus');
      S.editorRefs.remove = S.P.button(S.tools, 'Delete question', () => {
        const m = env.util.clone(S.ctx.model); m.questions.splice(m.active, 1); m.active = Math.max(0, Math.min(m.active, m.questions.length - 1)); S.P.act(m);
      });
    };

    BASE.locate = (t) => {
      if (t.pane) return S.util.center(t.pane === 'source' ? S.source : S.main);
      if (t.cell) return S.util.center(S.targets.get(`cell:${t.cell}`));
      if (t.add) return S.util.center(S.add);
      if (t.remove) return S.util.center(S.remove);
      if (t.question !== undefined) return S.util.center(S.list.children[t.question]);
      if (t.field) return S.util.center(S.targets.get(t.field));
      if (t.option !== undefined) return S.util.center(S.targets.get(`option:${t.option}`));
      if (t.answer !== undefined) return S.util.center(S.targets.get(`answer:${t.answer}`));
      if (t.type) return S.util.center(S.editorRefs[t.type]);
      if (t.unit) return S.util.center(S.editorRefs[`unit:${t.unit}`]);
      if (t.item && t.slot === undefined) return (t.group === 'modules' ? S.unitSort : S.lessonSort).locate(t.item);
      if (t.slot !== undefined) return (t.group === 'modules' ? S.unitSort : S.lessonSort).locateSlot(t.slot, undefined, t.item);
      if (t.rating) return S.util.center(S.editorRefs[`rating:${t.rating[0]}:${t.rating[1]}`]);
      throw new Error(`use-course-admin cannot locate ${JSON.stringify(t)}`);
    };

    BASE.frame = () => {
      S.root = S.P.root();
      S.P.rail();
      S.surface = S.el('div', 'lms-surface', S.root);
      S.P.header(); S.P.toolbar(); S.P.context(); S.P.roster();
      S.work = S.el('div', 'lms-work', S.surface);
      S.P.questionRail(); S.P.panes(); S.P.footer();
    };

    BASE.begin = (ctx) => {};

    BASE.rendered = (ctx) => {};

    BASE.item = (ctx, node, kind, data) => {};

    BASE.rowHeight = (count) => {
      return Math.min(S.D.rowMax, Math.max(S.D.rowMin, Math.floor((S.main.clientHeight - S.D.rowReserve) / count) - S.D.rowGap));
    };

    BASE.styles = () => {
      return S.D.css
        .replace(/var\(--(panel|line|accent|muted|fg|bg)\)/g, (value, key) => S.D.colors[key])
        .replace(/font:inherit/g, `font:${S.D.font}`)
        .replace('inset:10px;', `inset:${S.D.inset}px;`)
        .replace('flex-direction:row; border-radius:5px; font-size:12px;', `flex-direction:row; border-radius:${S.D.radius}px; font-size:${S.D.fontSize}px;`)
        .replace('width:148px;', `width:${S.D.railWidth}px;`)
        .replace('flex-basis:27%; max-width:265px; min-width:170px;', `flex-basis:${S.D.sourceWidth}%; max-width:${S.D.sourceMax}px; min-width:${S.D.sourceMin}px;`);
    };
  }

  env.template('use-course-admin/workspace', (design, def) => {
    const { TOKENS } = env.templateLib('use-course-admin/_theme');
    let D, P, ctx, s, util, f, el, rng, cs;
    let root, rail, surface, tools, note, context, roster;
    let work, list, main, source, summary, statusText, pop;
    let targets, lastEditor, editorRefs, unitSort, lessonSort, activeUnit, moduleRows;
    let lessonRows, unitList, lessonList, lessonTitle, drawing, add, remove;
    const BASE = {};
    const S = {
      get ctx() { return ctx; }, get spec() { return s; },
      get util() { return util; }, get rng() { return rng; },
      get f() { return f; }, get el() { return el; }, get cs() { return cs; },
      get D() { return D; }, get P() { return P; },
      get root() { return root; }, set root(value) { root = value; },
      get rail() { return rail; }, set rail(value) { rail = value; },
      get surface() { return surface; }, set surface(value) { surface = value; },
      get tools() { return tools; }, set tools(value) { tools = value; },
      get note() { return note; }, set note(value) { note = value; },
      get context() { return context; }, set context(value) { context = value; },
      get roster() { return roster; }, set roster(value) { roster = value; },
      get work() { return work; }, set work(value) { work = value; },
      get list() { return list; }, set list(value) { list = value; },
      get main() { return main; }, set main(value) { main = value; },
      get source() { return source; }, set source(value) { source = value; },
      get summary() { return summary; }, set summary(value) { summary = value; },
      get statusText() { return statusText; }, set statusText(value) { statusText = value; },
      get pop() { return pop; }, set pop(value) { pop = value; },
      get targets() { return targets; }, set targets(value) { targets = value; },
      get lastEditor() { return lastEditor; }, set lastEditor(value) { lastEditor = value; },
      get editorRefs() { return editorRefs; }, set editorRefs(value) { editorRefs = value; },
      get unitSort() { return unitSort; }, set unitSort(value) { unitSort = value; },
      get lessonSort() { return lessonSort; }, set lessonSort(value) { lessonSort = value; },
      get activeUnit() { return activeUnit; }, set activeUnit(value) { activeUnit = value; },
      get moduleRows() { return moduleRows; }, set moduleRows(value) { moduleRows = value; },
      get lessonRows() { return lessonRows; }, set lessonRows(value) { lessonRows = value; },
      get unitList() { return unitList; }, set unitList(value) { unitList = value; },
      get lessonList() { return lessonList; }, set lessonList(value) { lessonList = value; },
      get lessonTitle() { return lessonTitle; }, set lessonTitle(value) { lessonTitle = value; },
      get drawing() { return drawing; }, set drawing(value) { drawing = value; },
      get add() { return add; }, set add(value) { add = value; },
      get remove() { return remove; }, set remove(value) { remove = value; },
    };

    installControls(BASE, S);
    installBuilders(BASE, S);
    installSync(BASE, S);
    installFrame(BASE, S);
    installSources(BASE, S);
    installGradeRows(BASE, S);
    installQuizEditor(BASE, S);
    installModuleRows(BASE, S);
    installRubric(BASE, S);
    installActions(BASE, S);

    ({ D, P } = env.templateDesign('use-course-admin/workspace', design, def, {
      tokens: TOKENS, base: BASE, state: S,
    }));
    return {
      render(nextCtx) {
        ctx = nextCtx; s = ctx.spec; util = ctx.util; f = env.taskDef; el = util.el;
        targets = new Map(); lastEditor = ''; editorRefs = {}; unitSort = null; lessonSort = null; activeUnit = null;
        moduleRows = {}; lessonRows = {}; unitList = null; lessonList = null; lessonTitle = null;
        drawing = false; pop = null; roster = null; list = null; add = null; remove = null;
        P.begin(ctx);
        ctx.css('app-lms-classic', P.styles());
        rng = ctx.rng.fork('lms-polish'); cs = { csplit: s.csplit };
        P.frame();
        P.drawSource();
        if (s.scenario === 'grades') P.buildGrades();
        else if (s.scenario === 'quiz') P.quizToolbar();
        else if (s.scenario === 'modules') P.buildModules();
        else P.buildRubric();
        // Keep toolbar references separate from dynamically rebuilt editor controls.
        add = tools.querySelector('.primary');
        remove = [...tools.querySelectorAll('button')].find(b => b.textContent === 'Delete question');
        env.ui.scrollPane(main, { onScroll: () => P.mirror() }); env.ui.scrollPane(source, {});
        main.addEventListener('scroll', () => P.mirror());
        P.draw(ctx.model);
        P.rendered(ctx);
        return { anchors: [root], sync: m => P.draw(m) };
      },
      locate(t) { return P.locate(t); },
    };
  }, { uses: ['use-course-admin/_theme'] });
})();
