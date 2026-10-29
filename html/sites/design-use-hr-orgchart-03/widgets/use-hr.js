// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-orgchart-03',
  name: 'design',
  split: 'train',
  scenarios: ['orgchart'],
  template: 'use-hr/workspace',
  design: {
      inset: '0', radius: '0', font: '18px/1.15 Arial,sans-serif',
      panel: '#c0c0c0', foreground: '#111', line: '#808080', accent: '#000080',
      muted: '#111', background: '#c0c0c0',
      tree: { rootX: 62, rootY: 30, columnX: 0, columnGap: 0, columnY: 0,
        depthOffset: 38, rowGap: 44, bottom: 10, minWidth: 500, padding: 12,
        minHeight: 0, cardWidth: 450, cardHeight: 44, busY: 0,
        connectorGap: 0, gripX: 45, gripY: 21 },
    parts: {
      shell: (base, S) => (ctx) => {
        const st = S.current, P = S.P;
        st.main = P.element(ctx, 'div', 'w31-main', st.root);
        P.element(ctx, 'div', 'w31-heading', st.main, 'Organization');
        st.work = P.element(ctx, 'div', 'w31-work', st.main);
        P.toolbar(ctx);
        st.footer = P.element(ctx, 'div', 'w31-facts', st.root);
      },
      toolbar: (base, S) => (ctx) => {
        const st = S.current, P = S.P;
        const bar = P.element(ctx, 'div', 'w31-search', st.main);
        P.element(ctx, 'div', 'w31-search-title', bar, 'Employee Search');
        const fields = P.element(ctx, 'div', 'w31-search-fields', bar);
        P.element(ctx, 'label', '', fields, 'Name:');
        st.search = P.element(ctx, 'input', 'w31-search-input', fields);
        st.search.type = 'search'; st.search.setAttribute('aria-label', 'Find a person or team');
        st.search.addEventListener('input', () => { st.ui.query = st.search.value.trim().toLowerCase(); P.draw(ctx); });
        P.element(ctx, 'label', '', fields, 'Department:');
        P.button(ctx, fields, 'All Departments', () => P.notice(ctx, 'Departments', ['All departments are included in this view.']), 'w31-departments');
        P.button(ctx, fields, 'Search', () => { st.ui.query = st.search.value.trim().toLowerCase(); P.draw(ctx); }, 'w31-search-button', 'search');
      },
      avatar: (base, S) => (ctx, parent, p) => {
        const icon = S.P.element(ctx, 'span', 'w31-icon', parent);
        icon.style.setProperty('--person-color', p.id === 'p0' ? '#000080' : S.ui.directorySelected === p.id ? '#00a96d' : ['p1','p2','p3'].includes(p.id) ? '#ed3030' : '#0878ee');
        icon.innerHTML = '<svg viewBox="0 0 28 34" aria-hidden="true"><circle cx="14" cy="9" r="7"/><path d="M3 32V24Q3 17 10 16L14 19L18 16Q25 17 25 24V32Z"/></svg>';
        return icon;
      },
      orgLayout: (base, S) => (ctx, all) => {
        const st = S.current, parents = { ...ctx.model.parents, ...Object.fromEntries((st.s.directory || []).map(p => [p.id, p.parent])) };
        const byId = Object.fromEntries(all.map(p => [p.id, p]));
        const children = id => all.filter(p => parents[p.id] === id);
        const totalBelow = id => children(id).reduce((n,p) => n + 1 + totalBelow(p.id), 0);
        const compact = st.size.width < 800, rowHeight = compact ? 24 : 44, indent = compact ? 30 : 38;
        st.root.classList.toggle('w31-compact',compact);
        st.root.style.setProperty('--tree-row', rowHeight + 'px');
        const positions = {}; let y = 30;
        const visit = (p, depth) => {
          positions[p.id] = { x: (compact ? 46 : 62) + depth * indent, y }; y += rowHeight;
          if (!st.ui.collapsed.has(p.id) || st.ui.query) children(p.id).forEach(child => visit(child, depth + 1));
        };
        all.filter(p => !byId[parents[p.id]]).forEach(p => visit(p, 0));
        return { byId, parents, positions, direct: children('p0'), totalBelow, width: 620, height: y + 8 };
      },
      orgConnectors: (base, S) => (ctx, surface, geo) => {
        const svg = ctx.util.svg('svg', { class:'w31-lines', width:geo.width, height:geo.height, 'aria-hidden':'true' }, surface);
        for (const [id, pos] of Object.entries(geo.positions)) {
          const parent = geo.positions[geo.parents[id]];
          const x = parent ? parent.x + 8 : 32, y = parent ? parent.y + 21 : 15;
          ctx.util.svg('path', { d: `M${x} ${y}V${pos.y + 21}H${pos.x + 34}` }, svg);
        }
      },
      orgCard: (base, S) => (ctx, surface, p, pos, count, editable) => {
        const P = S.P, card = P.element(ctx, 'article', 'w31-person' + (editable ? ' hr-drag' : '') + (S.ui.directorySelected === p.id ? ' w31-current' : '') + (S.ui.query && !P.match(ctx,p) ? ' w31-dim' : ''), surface);
        card.style.left = pos.x + 'px'; card.style.top = pos.y + 'px';
        P.avatar(ctx, card, p);
        const text = P.element(ctx, 'div', 'w31-person-text', card);
        P.element(ctx, 'div', 'w31-name', text, p.name);
        P.element(ctx, 'div', 'w31-role', text, p.role);
        P.decorated(ctx, card, p, 'employee');
        return card;
      },
      orgToggle: (base, S) => (ctx, card, p) => {
        const P = S.P, st = S.current, collapsed = st.ui.collapsed.has(p.id);
        const b = P.element(ctx, 'button', 'w31-toggle', card, collapsed ? '+' : '−');
        b.type = 'button'; b.setAttribute('aria-expanded', String(!collapsed));
        b.setAttribute('aria-label', (collapsed ? 'Expand ' : 'Collapse ') + p.name);
        b.addEventListener('click', e => { e.stopPropagation(); if (st.ui.collapsed.has(p.id)) st.ui.collapsed.delete(p.id); else st.ui.collapsed.add(p.id); P.draw(ctx); });
        P.addRef(ctx, 'expand/' + p.id, b, 'chart');
      },
      orgchart: (base, S) => (ctx) => {
        const P = S.P, st = S.current, all = [...st.s.people, ...(st.s.directory || [])];
        if (!st.ui.directorySelected) st.ui.directorySelected = st.s.people.find(p => p.id === 'p3')?.id || st.s.people[0].id;
        const viewport = P.pane(ctx, st.work, 'chart', 'w31-viewport');
        const surface = P.element(ctx, 'div', 'w31-surface', viewport);
        const geo = st.geo = P.orgLayout(ctx, all);
        surface.style.height = geo.height + 'px'; surface.style.minWidth = geo.width + 'px';
        P.orgConnectors(ctx, surface, geo);
        const cardRefs = {};
        const company = P.element(ctx, 'div', 'w31-company', surface);
        P.element(ctx, 'span', 'w31-company-toggle', company, '−');
        const building = P.element(ctx, 'span', 'w31-building', company);
        building.innerHTML = '<svg viewBox="0 0 30 32" aria-hidden="true"><path d="M3 29V12l9-4V4l13-3v28Z" fill="#ddd" stroke="#111"/><path d="M5 13v14m4-16v16m5-20v20m5-22v22m4-23v24" stroke="#145fa0" stroke-width="2"/><path d="M2 29h26M11 8v21M5 16h5m-5 5h5m3-10h11m-11 6h11m-11 6h11" fill="none" stroke="#111"/></svg>';
        P.element(ctx, 'span', '', company, st.s.company);
        for (const [id,pos] of Object.entries(geo.positions)) {
          const p = geo.byId[id], editable = id.startsWith('p') && id !== 'p0', count = geo.totalBelow(id);
          const card = P.orgCard(ctx, surface, p, pos, count, editable);
          cardRefs[id] = card;
          P.orgEvents(ctx, card, p, all, count, editable);
        }
        const rail = P.element(ctx,'div','w31-scrollbar',st.work);
        const up = P.button(ctx,rail,'▲',() => { viewport.scrollTop -= 44; },'w31-scroll-arrow');
        up.setAttribute('aria-label','Scroll organization up');
        const track = P.element(ctx,'div','w31-scroll-track',rail), thumb = P.element(ctx,'div','w31-scroll-thumb',track);
        const down = P.button(ctx,rail,'▼',() => { viewport.scrollTop += 44; },'w31-scroll-arrow');
        down.setAttribute('aria-label','Scroll organization down');
        const scrollThumb = () => {
          const h = track.clientHeight, thumbHeight = Math.max(30, h * viewport.clientHeight / Math.max(viewport.clientHeight,viewport.scrollHeight));
          thumb.style.height = thumbHeight + 'px';
          thumb.style.top = ((h - thumbHeight) * viewport.scrollTop / Math.max(1,viewport.scrollHeight - viewport.clientHeight)) + 'px';
        };
        scrollThumb(); viewport.addEventListener('scroll',scrollThumb);
        track.addEventListener('pointerdown', e => { if (e.target === track) viewport.scrollTop += e.clientY < thumb.getBoundingClientRect().top ? -viewport.clientHeight : viewport.clientHeight; });
        thumb.addEventListener('pointerdown', e => { e.preventDefault(); thumb.setPointerCapture(e.pointerId); st.ui.scrollDrag = { y:e.clientY, top:viewport.scrollTop }; });
        thumb.addEventListener('pointermove', e => { if (thumb.hasPointerCapture(e.pointerId) && st.ui.scrollDrag) viewport.scrollTop = st.ui.scrollDrag.top + (e.clientY-st.ui.scrollDrag.y) * viewport.scrollHeight / Math.max(1,track.clientHeight); });
        thumb.addEventListener('pointerup', e => { if (thumb.hasPointerCapture(e.pointerId)) thumb.releasePointerCapture(e.pointerId); st.ui.scrollDrag = null; });
        const mirrorView = () => {
          const view = {}, paneRect = viewport.getBoundingClientRect();
          const delta = (a, b, low, high) => a < low + 6 ? a - low - 6 : b > high - 6 ? b - high + 6 : 0;
          for (const [id, card] of Object.entries(cardRefs)) {
            const rect = card.getBoundingClientRect();
            const pointBox = (node, employee) => {
              const r = node.getBoundingClientRect(), x = employee ? r.left + 45 : (r.left + r.right) / 2, y = employee ? r.top + 28 : (r.top + r.bottom) / 2;
              return { left:x - 6, right:x + 6, top:y - 6, bottom:y + 6 };
            };
            let box = pointBox(card, id.startsWith('p') && id !== 'p0');
            if (id === st.s.employee && cardRefs[st.s.manager]) {
              const boss = pointBox(cardRefs[st.s.manager], false);
              box = { left:Math.min(box.left,boss.left), right:Math.max(box.right,boss.right), top:Math.min(box.top,boss.top), bottom:Math.max(box.bottom,boss.bottom) };
            }
            const dx = Math.round(Math.max(-viewport.scrollLeft, Math.min(viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft, delta(box.left,box.right,paneRect.left,paneRect.right))));
            const dy = Math.round(Math.max(-viewport.scrollTop, Math.min(viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop, delta(box.top,box.bottom,paneRect.top,paneRect.bottom))));
            view['manager/' + id] = { pane:'chart', dx, dy };
            if (id.startsWith('p') && id !== 'p0') view['employee/' + id] = { pane:'chart', dx, dy };
          }
          for (const p of st.s.people) if (!cardRefs[p.id]) {
            let parent = ctx.model.parents[p.id];
            while (parent) {
              if (st.ui.collapsed.has(parent) && cardRefs[parent]) { view['employee/' + p.id] = { expand:parent }; break; }
              parent = ctx.model.parents[parent];
            }
          }
          ctx.patch({ view });
        };
        viewport.addEventListener('scroll', mirrorView);
        mirrorView();
        const selected = geo.byId[st.ui.directorySelected] || all[0];
        const detail = document.querySelector('.org-detail');
        detail.replaceChildren();
        P.element(ctx, 'div', 'org-detail-title', detail, 'Employee Details');
        const profile = P.element(ctx, 'div', 'w31-profile', detail); P.avatar(ctx, profile, selected);
        const title = P.element(ctx, 'div', '', profile);
        P.element(ctx, 'b', 'w31-profile-name', title, selected.name); P.element(ctx, 'div', '', title, selected.role);
        const fields = P.element(ctx, 'div', 'org-detail-fields', detail);
        const boss = geo.byId[geo.parents[selected.id]], reports = all.filter(p => geo.parents[p.id] === selected.id);
        let departmentHead = selected;
        while (geo.byId[geo.parents[departmentHead.id]] && geo.parents[departmentHead.id] !== 'p0') departmentHead = geo.byId[geo.parents[departmentHead.id]];
        const department = selected.department || selected.team || departmentHead.role.replace(/\s+(manager|director)$/i,'');
        for (const [label,value] of [['Employee ID:', selected.employeeId || selected.id.toUpperCase()], ['Department:', department], ['Reports To:', boss?.name || '—'], ['Location:', selected.city], ['Hire Date:', selected.hireDate || selected.date || 'Not recorded'], ['Employment Type:', selected.employmentType || 'Full Time']]) {
          const row = P.element(ctx, 'div', 'org-detail-row', fields);
          P.element(ctx, 'span', '', row, label); P.element(ctx, 'span', '', row, value || '—');
        }
        P.element(ctx, 'div', 'org-detail-section', detail, `Direct Reports (${reports.length})`);
        const table = P.element(ctx, 'div', 'w31-reports', detail);
        const head = P.element(ctx, 'div', 'w31-report-heading', table); P.element(ctx, 'span', '', head, 'Name'); P.element(ctx, 'span', '', head, 'Title');
        for (const p of reports) {
          const row = P.element(ctx, 'div', 'w31-report-row', table); P.avatar(ctx, row, p);
          P.element(ctx, 'span', '', row, p.name); P.element(ctx, 'span', '', row, p.role);
          row.addEventListener('click', () => P.notice(ctx,p.name,[]));
        }
        P.element(ctx, 'div', 'org-detail-section', detail, 'Manager');
        if (boss) { const row = P.element(ctx, 'div', 'w31-profile w31-manager', detail); P.avatar(ctx,row,boss); const text=P.element(ctx,'div','',row); P.element(ctx,'div','',text,boss.name); P.element(ctx,'div','',text,boss.role); }
        const companyLabel = document.querySelector('.win-status-company'); if (companyLabel) companyLabel.textContent = st.s.company;
        const countLabel = document.querySelector('.win-status-count'); if (countLabel) countLabel.textContent = `${st.s.people.length} of ${all.length} employees`;
      },
      notice: (base, S) => (ctx, title, lines) => {
        const st = S.current, person = [...st.s.people, ...(st.s.directory || [])].find(p => p.name === title);
        if (person) { st.ui.directorySelected = person.id; S.P.draw(ctx); }
        else base(ctx, title, lines);
      },
    },
  },
});
