// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-modules-05',
  name: 'design',
  split: 'train',
  scenarios: ['modules'],
  template: 'use-course-admin/workspace',
  design: {
    parts: {
      frame: (base, S) => () => {
        const el = S.util.el;
        S.root = el('section', 'academic-workspace', S.ctx.stage);
        S.surface = el('div', 'academic-surface', S.root);
        S.tools = el('div', 'academic-hidden', S.surface);
        S.note = el('span', '', S.tools);
        S.summary = el('span', '', S.tools);
        S.statusText = el('span', '', S.tools);
        S.work = el('div', 'academic-columns', S.surface);
        S.source = el('aside', 'academic-outline', S.work);
        S.main = el('div', 'academic-main', S.work);
        S.P.rail();
      },
      rail: (base, S) => () => {
        const el = S.util.el;
        S.rail = el('nav', 'academic-dock', S.root);
        const paths = [
          'M3 12L12 3l9 9M5 10v12h5v-7h4v7h5V10',
          'M5 2h12l5 5v17H5zM16 2v7h6M8 13h10M8 17h10M8 21h8',
          'M9 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10M1 25v-5c0-9 16-9 16 0v5zM20 12a4 4 0 1 0 0-8M19 15c7 0 7 6 7 10h-7',
          'M3 3h21v23H3zM8 1v7M17 1v7M6 11h15M6 17h15M6 22h15M11 8v17M18 8v17',
          'M12 6C8 2 3 3 1 4v20c4-2 8-1 11 2 3-3 7-4 11-2V4c-3-1-7-2-11 2zM12 6v20M5 8h3M5 12h3M16 8h3M16 12h3',
          'M4 2h17v24H4zM8 7h9M8 11h9M8 15h9M8 19h6M17 20l7 7',
          'M4 3h17v8H4zM2 15h23v12H2zM7 1v4M18 1v4M7 13v4M18 13v4M5 20h17',
          'M3 15h4v12H3zM11 3h4v24h-4zM19 9h4v18h-4z'
        ];
        ['Home', 'Courses', 'Students', 'Assignments', 'Gradebook', 'Quizzes', 'Modules', 'Reports'].forEach((label, i) => {
          const b = el('button', 'academic-dock-item' + (i === 1 ? ' current' : ''), S.rail);
          b.type = 'button';
          const svg = S.util.svg('svg', { viewBox: '0 0 28 30', fill: i === 2 || i === 7 ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': 2 }, b);
          S.util.svg('path', { d: paths[i] }, svg);
          el('span', '', b, label);
          b.addEventListener('click', () => S.P.showPanel(label, ['Art History 101 / Fall 1995', 'Course materials and administration.']));
        });
      },
      // The staff stamp, the "approved lesson sequence" line, recent activity and course resources are not drawn.
      sourceStamp: () => () => {},
      activity: () => () => {},
      resources: () => () => {},
      modulesSource: (base, S) => () => {
        const el = S.util.el;
        el('h3', 'academic-panel-title', S.source, 'Teaching Outline');
        const outline = el('ol', 'academic-outline-list', S.source);
        for (const u of S.spec.units) {
          const li = el('li', '', outline);
          el('b', '', li, u.title);
          const lessons = el('ol', '', li);
          for (const id of S.spec.goalLessons[u.id]) el('li', '', lessons, u.lessons.find(l => l.id === id).title);
          S.P.item(S.ctx, li, 'sourceUnit', u);
        }
      },
      moduleColumns: (base, S) => () => {
        const el = S.util.el;
        const left = el('section', 'academic-module-panel', S.main);
        const title = el('h3', 'academic-panel-title', left, 'Course Modules ');
        el('span', '', title, '(drag to reorder)');
        S.unitList = el('div', 'academic-module-list', left);
        S.unitList.style.setProperty('--module-count', S.spec.units.length);
        const right = el('section', 'academic-index', S.main);
        el('h3', 'academic-panel-title', right, 'Lessons (All Modules)');
        const table = el('table', '', right), head = el('tr', '', el('thead', '', table));
        el('th', '', head, 'Module'); el('th', '', head, 'Lesson Title');
        el('tbody', '', table);
        S.lessonTitle = el('span', 'academic-hidden', right);
        return left;
      },
      buildModules: (base, S) => () => {
        S.note.textContent = 'Course content / Instructor sequence';
        S.P.moduleColumns();
        for (const [i, u] of S.spec.units.entries()) S.P.moduleRow(u, i, 0);
        S.unitSort = env.ui.sortable(S.unitList, {
          order: S.ctx.model.order, items: S.moduleRows, handle: '.academic-module-grip', axis: 'y', activeClass: 'dragging',
          onChange: order => S.P.act({ ...S.ctx.model, order })
        });
      },
      moduleRow: (base, S) => (u, i) => {
        const el = S.util.el;
        const row = el('article', 'academic-module-card', S.unitList);
        row.style.setProperty('--lesson-factor', 1 / (u.lessons.length * 1.2 + 1.75));
        S.moduleRows[u.id] = row;
        el('span', 'academic-module-grip', row, '⠿');
        const head = el('div', 'academic-module-title', row);
        const b = el('button', 'academic-unit-open', head);
        el('span', 'academic-module-number', b, `${i + 1}. `);
        el('b', '', b, u.title);
        b.type = 'button';
        b.addEventListener('click', () => S.P.act({ ...S.ctx.model, unit: u.id }));
        S.editorRefs[`unit:${u.id}`] = b;
        const links = el('span', 'academic-card-links', head);
        const edit = el('a', '', links, 'Edit'); edit.href = '#';
        edit.addEventListener('click', e => { e.preventDefault(); S.P.act({ ...S.ctx.model, unit: u.id }); });
        el('span', '', links, ' | ');
        const del = el('a', '', links, 'Delete'); del.href = '#';
        del.addEventListener('click', e => { e.preventDefault(); S.P.showPanel('Delete module', ['Course modules remain available in the teaching outline.']); });
        el('ol', 'academic-lessons', row);
        S.P.item(S.ctx, row, 'moduleRow', u);
      },
      drawLessons: (base, S) => m => {
        const el = S.util.el;
        if (S.activeUnit !== m.unit) {
          for (const u of S.spec.units) {
            if (u.id === m.unit) continue;
            const list = S.moduleRows[u.id].querySelector('.academic-lessons');
            list.replaceChildren();
            for (const id of m.lessons[u.id]) {
              const lesson = u.lessons.find(l => l.id === id);
              const li = el('li', '', list, lesson.title);
              li.addEventListener('click', () => S.P.act({ ...S.ctx.model, unit: u.id }));
            }
          }
          S.lessonList = S.moduleRows[m.unit].querySelector('.academic-lessons');
        }
        base(m);
        [...S.lessonList.children].forEach((row, i) => {
          const grip = row.querySelector('.academic-lesson-grip');
          if (grip) grip.textContent = `${i + 1}.`;
        });
        const body = S.main.querySelector('tbody'); body.replaceChildren();
        m.order.forEach((id, i) => {
          const u = S.spec.units.find(u => u.id === id);
          const card = S.moduleRows[id];
          card.querySelector('.academic-module-number').textContent = `${i + 1}. `;
          card.style.setProperty('--module-color', ['#cbe5fa', '#cdf0d8', '#fff0b7', '#eee0f8'][i % 4]);
          for (const lessonId of m.lessons[id]) {
            const lesson = u.lessons.find(l => l.id === lessonId);
            const tr = el('tr', '', body); el('td', '', tr, u.title);
            const a = el('a', '', el('td', '', tr), lesson.title); a.href = '#';
            a.addEventListener('click', e => { e.preventDefault(); S.P.act({ ...S.ctx.model, unit: id }); });
          }
        });
      },
      lessonRow: (base, S) => (lesson, i) => {
        const row = S.util.el('li', '', S.lessonList);
        S.lessonRows[lesson.id] = row;
        S.util.el('span', 'lms-grip academic-lesson-grip', row, `${i + 1}.`);
        S.util.el('span', '', row, lesson.title);
        S.P.item(S.ctx, row, 'lessonRow', lesson);
      },
    },
  },
});
