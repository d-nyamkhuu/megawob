// Design on templates/find-fact/base.js: the base site's find-fact widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-tooltip-03',
  name: 'design',
  split: 'train',
  scenarios: ['tooltip'],
  template: 'find-fact/base',
  design: {
    parts: {
      frame: (base, S) => (ctx) => {
        // Keep the template's seeded draws; the desktop frame supplies its bar.
        const frame = base(ctx);
        const box = S.usable(ctx);
        Object.assign(frame.app.style, {
          left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px',
          border: '0', borderRadius: '0', boxShadow: 'none', background: 'transparent',
        });
        frame.app.querySelector('.rl-bar').remove();
        frame.work.className = 'ds-lookup-work';
        Object.assign(frame.work.style, {
          display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'stretch',
          flex: '1 1 0', minHeight: '0', padding: '0 0.5%', gap: '6px', overflow: 'hidden',
        });
        frame.app.style.setProperty('--ds-answer-height', Math.max(126, box.h * 0.18) + 'px');
        frame.room.w = box.w - 8;
        frame.room.h = box.h;
        return frame;
      },
      card: (base) => (...args) => {
        const result = base(...args);
        result.card.className = 'ds-lookup-card';
        Object.assign(result.card.style, {
          display: 'flex', flexDirection: 'column', flex: '1 1 0', minHeight: '0',
          minWidth: '0', boxSizing: 'border-box', overflow: 'hidden',
        });
        const title = result.card.firstElementChild;
        title.classList.add('ds-lookup-title');
        title.hidden = true;
        title.style.display = 'none';
        result.body.classList.add('ds-lookup-body');
        Object.assign(result.body.style, { flex: '1 1 0', minHeight: '0', padding: '0', overflow: 'auto' });
        return result;
      },
      answerForm: (base) => (...args) => {
        const fields = base(...args);
        const form = args[1].querySelector('.rl-form');
        Object.assign(form.style, { flex: '0 0 auto', height: 'var(--ds-answer-height)' });
        const title = form.firstElementChild;
        title.hidden = false;
        title.textContent = 'Lookup SKU';
        Object.assign(title.style, { display: 'flex', alignItems: 'center', margin: '0', flex: '0 0 47px', boxSizing: 'border-box', padding: '9px 18px' });
        const body = title.nextElementSibling;
        Object.assign(body.style, { display: 'flex', flexDirection: 'column', justifyContent: 'center' });
        for (const field of body.querySelectorAll('.rl-field')) {
          Object.assign(field.style, { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '4px 24px', gap: '18px' });
          const label = args[0].util.el('label', 'ds-lookup-label', null, 'SKU:');
          label.htmlFor = field.querySelector('input').id;
          Object.assign(label.style, { width: '95px', flex: 'none' });
          field.prepend(label);
        }
        for (const input of body.querySelectorAll('.rl-input')) input.style.height = '42px';
        const note = body.querySelector('.rl-note');
        if (note) Object.assign(note.style, { margin: '0 24px 4px', flex: 'none' });
        return fields;
      },
      buildTooltip: (base) => (...args) => {
        const view = base(...args);
        const source = args[1].querySelector('.ds-lookup-card');
        source.style.maxWidth = 'none';
        const table = source.querySelector('.rl-table');
        const rows = table ? Array.from(table.rows) : [];
        const available = source.clientHeight - 6;
        const rowHeight = rows.length ? Math.min(44, Math.floor((available - 36) / Math.max(1, rows.length - 1))) : 44;
        // Put the information column first without clipping any cell's text.
        for (const row of rows) row.prepend(row.lastElementChild);
        for (const cell of source.querySelectorAll('.rl-table th, .rl-table td')) {
          cell.classList.add(cell.tagName === 'TH' ? 'ds-lookup-head' : 'ds-lookup-cell');
          Object.assign(cell.style, { height: (cell.tagName === 'TH' ? Math.min(47, rowHeight) : rowHeight) + 'px', padding: '2px 16px', whiteSpace: 'nowrap' });
        }
        for (const row of rows) {
          Object.assign(row.firstElementChild.style, { width: '48px', padding: '2px', textAlign: 'center' });
        }
        for (const info of source.querySelectorAll('.rl-info')) {
          const size = Math.min(28, rowHeight - 4) + 'px';
          Object.assign(info.style, { width: size, height: size });
        }
        if (table) {
          table.className = 'ds-lookup-table';
          Object.assign(table.style, { width: '100%', borderCollapse: 'collapse' });
        }
        return view;
      },
    },
  },
});
