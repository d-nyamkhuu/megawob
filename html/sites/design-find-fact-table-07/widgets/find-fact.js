// Site design on find-fact/table; shared widget code lives in templates/find-fact/table.js.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-07',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  template: 'find-fact/table',
  design: {
    parts: {
      source: (base, S) => (ctx, tc, body) => {
        tc.classList.add('ds-source');
        tc.querySelector('h3').firstChild.nodeValue = 'Source Table';
        tc.querySelector('h3').title = ctx.spec.title;
      },
      table: (base, S) => (ctx, t, body) => {
        const { spec, util } = ctx;
        t.style.setProperty('--source-rows', spec.rows.length);
        if (spec.kind === 'grid') {
          const lengths = spec.columns.map((label, col) => Math.max(String(label).length,
            ...spec.rows.map(row => String(row[col]).length)));
          if (Math.max(...lengths) > 20) {
            const weights = lengths.map(n => Math.max(9, Math.min(28, n)));
            const total = weights.reduce((a, b) => a + b, 0);
            const cols = util.el('colgroup', '', t);
            weights.forEach(weight => { util.el('col', '', cols).style.width = `${100 * weight / total}%`; });
          } else if (spec.columns.length === 5) {
            const cols = util.el('colgroup', '', t);
            [20, 22, 21, 19, 18].forEach(width => { util.el('col', '', cols).style.width = `${width}%`; });
          }
        }
      },
      answers: (base, S) => (ctx, B) => {
        const { spec, util } = ctx;
        const { form, t, work } = B;
        form.querySelector('h3').textContent = 'Enter the matching information';
        form.classList.add('ds-answer-table');
        const answerBody = form.querySelector('.rl-card-b');
        const answerHead = util.el('div', 'ds-answer-head', answerBody);
        util.el('span', '', answerHead, 'Field');
        util.el('span', '', answerHead, 'Matching value');
        answerBody.prepend(answerHead);
        form.querySelectorAll('.rl-field').forEach(row => {
          if (!row.querySelector('label')) {
            const label = util.el('label', '', row, 'Answer');
            label.htmlFor = row.querySelector('input').id;
            row.prepend(label);
          }
        });
        const guide = document.querySelector('.ds-field-guide');
        if (guide) spec.fields.forEach(f => util.el('li', '', guide, f.label || 'Requested value'));
        if (spec.kind === 'grid' && new Set(spec.fields.map(f => `${f.row}:${f.col}`)).size === spec.fields.length
            && spec.fields.every(f => Number.isInteger(f.row) && Number.isInteger(f.col)
            && spec.rows[f.row] && f.col >= 0 && f.col < spec.columns.length)) {
          // Keep exactly the task's editable fields, arranged at their source coordinates.
          // Other cells are explicitly unavailable, not extra answers or prefilled model values.
          form.classList.add('ds-matrix-form');
          const inputs = Array.from(form.querySelectorAll('input'));
          const labels = Array.from(form.querySelectorAll('.rl-field label'));
          const note = form.querySelector('.rl-note');
          const matrix = util.el('table', 'rl-table ds-answer-matrix', answerBody);
          matrix.style.setProperty('--source-rows', spec.rows.length);
          const sourceCols = t.querySelector('colgroup');
          const longestValue = Math.max(...spec.rows.flat().map(value => String(value).length));
          if (spec.columns.length === 5 && longestValue <= 20) {
            const cols = util.el('colgroup', '', matrix);
            [16.5, 21.2, 22.7, 20.8, 18.8].forEach(width => { util.el('col', '', cols).style.width = `${width}%`; });
          } else if (sourceCols) matrix.append(sourceCols.cloneNode(true));
          const headRow = util.el('tr', '', util.el('thead', '', matrix));
          spec.columns.forEach(label => util.el('th', '', headRow, label));
          const matrixBody = util.el('tbody', '', matrix);
          spec.rows.forEach((row, r) => {
            const tr = util.el('tr', '', matrixBody);
            if (!spec.fields.some(f => f.row === r)) tr.classList.add('ds-unrequested-row');
            row.forEach((value, c) => {
              const cell = util.el('td', '', tr);
              const fieldIndex = spec.fields.findIndex(f => f.row === r && f.col === c);
              if (fieldIndex !== -1) {
                const label = labels[fieldIndex];
                label.classList.add('ds-sr-only');
                cell.append(label, inputs[fieldIndex]);
                inputs[fieldIndex].title = spec.fields[fieldIndex].label || spec.columns[c];
              } else if (c === 0) cell.textContent = value;
              else {
                const unavailable = util.el('span', 'ds-not-requested', cell, '—');
                unavailable.title = 'Not requested';
                unavailable.setAttribute('aria-label', 'Not requested');
              }
            });
          });
          answerBody.replaceChildren(matrix);
          if (note) answerBody.append(note);
        }
      },
      fit: (base, S) => (ctx, B) => {
        const { spec } = ctx;
        const { work, form, room, t, tc, body } = B;
        // Both sections stay in one column. Fit their actual rendered geometry before returning
        // the anchor, including wrapped cells, notes, and unusually large source tables.
        const wr = () => work.getBoundingClientRect();
        const over = () => form.getBoundingClientRect().bottom > wr().bottom - 4
          || work.scrollHeight > work.clientHeight + 1 || work.scrollWidth > work.clientWidth + 1;
        for (let density = 1; density <= 4 && over(); density++) {
          if (density === 3) {
            // Unrequested answer rows are presentation only; keep the complete source table
            // and every editable answer at a readable size in unusually crowded episodes.
            form.querySelectorAll('.ds-unrequested-row').forEach(row => { row.hidden = true; });
            if (!over()) break;
          }
          work.dataset.density = String(density);
        }
        if (over()) {
          // Last-resort fit for out-of-range content. A transform preserves the source and all
          // controls, and textField.locate() continues to use the inputs' live viewport rects.
          const bounds = wr();
          const contentHeight = Math.max(work.scrollHeight,
            form.getBoundingClientRect().bottom - bounds.top) + 6;
          const scale = Math.min(1, (bounds.height - 4) / contentHeight);
          work.style.flex = 'none';
          work.style.height = `${contentHeight}px`;
          work.style.width = `${bounds.width / scale}px`;
          work.style.transformOrigin = 'top left';
          work.style.transform = `scale(${scale})`;
        }
      },
    },
  },
});
