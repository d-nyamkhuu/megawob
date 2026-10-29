// Design on use-legacy-app/desktop; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-win95-02',
  name: 'design',
  split: 'train',
  scenarios: ['win95'],
  template: 'use-legacy-app/desktop',
  design: {
    font: '"Lucida Sans", "Lucida Grande", Arial, sans-serif',
    fontSize: 19, inset: 0, maxWidth: 2000, maxHeight: 1400,
    columns: ['Equipment ID', 'Description', 'Cost Center', 'Type', 'Status', 'Location'],
    parts: {
      heading: (base, S) => (ctx) => {
        base(ctx);
        S.refs.heading.parentElement.classList.add('equipment-heading');
        const tile = document.querySelector('.equipment-rail-item');
        if (tile) {
          // Reuse the frame icon after an earlier render moved it into the tree control.
          const picture = tile.querySelector('.equipment-rail-icon');
          const control = S.refs.tree;
          for (const child of control.children) child.setAttribute('hidden', '');
          control.className = 'equipment-tree-control';
          control.setAttribute('aria-label', 'Equipment');
          control.appendChild(picture);
          ctx.util.el('span', '', control, 'Equipment');
          tile.replaceChildren(control);
        }
      },
      search: (base, S) => (ctx) => {
        base(ctx);
        const { el } = ctx.util;
        const row = S.els.searchRow;
        row.classList.add('equipment-search');
        row.querySelector('label').textContent = 'Find:';
        el('span', 'equipment-search-in', row, 'in');
        const criterion = el('span', 'equipment-criterion', row, 'Equipment ID');
        el('span', 'equipment-arrow', criterion, '▼');
        row.insertBefore(S.refs.open, criterion.nextSibling);
        S.refs.equipmentCount = el('span', 'equipment-count', row);
      },
      record: (base, S) => (tbody, r, i) => {
        base(tbody, r, i);
        const row = S.els.rowNodes[i];
        const cells = Array.from(row.children);
        cells[0].remove();
        cells[2].textContent = r.base.memo;
        cells[4].textContent = 'Equipment';
        cells[6].textContent = r.city;
        cells[6].className = '';
        cells[7].remove();
        row.classList.add('equipment-record');
        S.refs[`description:${i}`] = cells[2];
      },
      directory: (base, S) => (ctx) => {
        base(ctx);
        const { el } = ctx.util;
        const directory = S.els.directory;
        const shell = el('div', 'equipment-directory', S.els.main);
        S.els.main.insertBefore(shell, directory);
        shell.appendChild(directory);
        const bar = el('div', 'equipment-scrollbar', shell);
        S.P.button(bar, '▲', () => { directory.scrollTop -= 75; }, 'equipment-scroll-arrow');
        const track = el('div', 'equipment-scroll-track', bar);
        const thumb = el('div', 'equipment-scroll-thumb', track);
        S.P.button(bar, '▼', () => { directory.scrollTop += 75; }, 'equipment-scroll-arrow');
        directory.addEventListener('scroll', () => {
          thumb.style.top = `${Math.min(75, directory.scrollTop / Math.max(1, directory.scrollHeight - directory.clientHeight) * 75)}%`;
        });
        track.addEventListener('click', (e) => {
          const box = track.getBoundingClientRect();
          directory.scrollTop = (e.clientY - box.top) / box.height * (directory.scrollHeight - directory.clientHeight);
        });
      },
      tab: (base, S) => (ctx, t) => {
        const { el } = ctx.util;
        const { P, spec, refs, els } = S;
        const tab = P.button(els.tabstrip, S.D.tabNames[spec.scenario][t], () => {
          P.patch({ tab: t }); els.sheet.scrollTop = 0;
        }, 'lg-tab');
        tab.setAttribute('role', 'tab'); S.tabs[t] = tab;
        const pane = el('div', 'equipment-pane', els.sheet); els.panes[t] = pane;
        const groups = {};
        for (const label of ['Identification', 'Allocation', 'Status', 'Settings']) {
          const group = el('fieldset', 'lg-group equipment-group', pane);
          el('legend', '', group, label); groups[label] = group;
        }
        const summary = (group, label, value, cls = '') => {
          const row = el('div', 'lg-row equipment-summary', groups[group]);
          el('label', '', row, label);
          return el('span', `equipment-value ${cls}`, row, value);
        };
        refs[`equipment-key:${t}`] = summary('Identification', 'Equipment ID:', '', 'equipment-disabled');
        const memo = spec.fields.find(f => f.id === 'memo');
        const cost = spec.fields.find(f => f.id === 'cost');
        const retries = spec.fields.find(f => f.id === 'retries');
        const draw = (f, group) => {
          if (spec.fields[t].id === f.id) P.field(ctx, groups[group], f);
          else refs[`equipment-${f.id}:${t}`] = summary(group, f.label + ':', '', `equipment-${f.id}-summary`);
        };
        draw(memo, 'Identification');
        summary('Identification', 'Type:', 'Equipment', 'equipment-choice');
        draw(cost, 'Allocation');
        const owner = summary('Allocation', 'Department:', '', 'equipment-choice');
        const location = summary('Allocation', 'Location:', '', 'equipment-choice');
        refs[`equipment-owner:${t}`] = owner; refs[`equipment-location:${t}`] = location;
        const locationRow = location.parentElement;
        locationRow.classList.add('equipment-location-row');
        el('span', 'equipment-building-label', locationRow, 'Building:');
        el('span', 'equipment-value equipment-choice equipment-building', locationRow, 'C');
        summary('Status', 'Status:', 'Active', 'equipment-choice');
        const acquired = summary('Status', 'Acquired:', '2021-03-15', 'equipment-date');
        const calendar = el('span', 'equipment-calendar', acquired.parentElement);
        const calendarSvg = ctx.util.svg('svg', {viewBox:'0 0 32 32', 'aria-hidden':'true'}, calendar);
        calendarSvg.innerHTML = '<path fill="#fff" stroke="#111" stroke-width="2" d="M2 6h28v24H2z"/><path fill="#174a9e" d="M3 7h26v7H3z"/><path stroke="#111" stroke-width="2" d="M8 2v8m15-8v8"/><path stroke="#174a9e" stroke-width="3" d="M6 18h4m4 0h4m4 0h4M6 24h4m4 0h4m4 0h4"/>';
        refs[`equipment-order:${t}`] = summary('Status', 'Purchase order:', '');
        draw(retries, 'Settings');
        summary('Settings', 'Warranty (months):', '36', 'equipment-number');
        summary('Settings', 'Service contract:', 'None', 'equipment-choice');
        // Preserve the template's protected-field sync targets.
        if (t === 0) {
          refs.Owner = owner; refs.Location = location;
          refs.Organization = el('span', 'equipment-hidden', pane);
        }
      },
      editor: (base, S) => (ctx) => {
        base(ctx);
        for (const name of ['Notes', 'Attachments']) {
          const b = S.P.button(S.els.tabstrip, name, () => {
            S.P.patch({ help: 'about' });
          }, 'lg-tab equipment-extra-tab');
          b.setAttribute('role', 'tab');
          b.setAttribute('aria-selected', 'false');
        }
      },
      actions: (base, S) => (ctx) => {
        base(ctx);
        S.els.editor.appendChild(S.refs.save.parentElement);
      },
      sync: (base, S) => (m) => {
        base(m);
        const { refs, spec } = S;
        const active = m.active === null ? null : spec.records[m.active];
        refs.heading.textContent = 'Equipment Records';
        refs.editorTitle.textContent = active ? `Equipment Record - ${active.key}${S.inputs.cost && S.inputs.cost.value !== m.stored[m.active].cost ? ' *' : ''}` : 'Equipment Record';
        refs.equipmentCount.textContent = `Records: 1 - 10 of ${spec.records.length}`;
        spec.records.forEach((r, i) => { refs[`description:${i}`].textContent = m.stored[i].memo; });
        for (let t = 0; t < 3; t++) {
          refs[`equipment-key:${t}`].textContent = active ? active.key : '';
          refs[`equipment-owner:${t}`].textContent = active ? active.company : '';
          refs[`equipment-location:${t}`].textContent = active ? active.city : '';
          refs[`equipment-order:${t}`].textContent = active ? active.batch : '';
          for (const f of spec.fields) {
            const out = refs[`equipment-${f.id}:${t}`];
            if (out) out.textContent = S.inputs[f.id].value;
          }
        }
      },
    },
  },
});
