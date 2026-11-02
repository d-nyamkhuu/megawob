// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-logs-02',
  name: 'design',
  split: 'train',
  scenarios: ['logs'],
  template: 'use-dev-tools/workspace',
  design: {
    inset: 0, bottomInset: 0, font: 'Arial, "Segoe UI", sans-serif', fontSize: 15,
    parts: {
      // This design has no workspace top bar or scenario tab strip.
      top: () => () => {},
      tabs: () => () => {},
      layout: (base, S) => (ctx, card) => {
        const out = base(ctx, card);
        const { el } = S.st;
        const filters = el('section', 'log-filter-column', out.shell);
        out.shell.insertBefore(filters, out.work);
        S.st.filters = filters;
        const heading = out.work.querySelector('.dv-heading');
        filters.appendChild(heading);
        heading.querySelector('h2').textContent = 'Log Explorer';
        const note = document.querySelector('.ref-panel');
        if (note) filters.appendChild(note);
        const tools = out.work.querySelector('.dv-tools');
        filters.appendChild(tools);
        out.query.placeholder = 'Search logs...';
        const time = tools.querySelector('.dv-toolbtn');
        S.st.timeControl = time;
        if (time) time.remove();
        return out;
      },
      facets: (base, S) => (ctx, main) => {
        base(ctx, main);
        const { el, filters, timeControl } = S.st;
        const facets = main.querySelector('.dv-facets');
        filters.appendChild(facets);
        const severity = facets.children[1];
        const all = severity.querySelector('.dv-chip');
        all.classList.add('log-severity-all');
        for (const text of ['DEBUG', 'TRACE']) {
          const b = el('button', 'log-unused-level', severity, text);
          b.type = 'button';
          b.onclick = () => env.log('decoy', {label: text});
          severity.insertBefore(b, all.nextSibling);
        }
        const label = (text) => el('label', 'log-filter-label', filters, text);
        label('Environment');
        const envButton = el('button', 'log-select', filters, 'All environments');
        envButton.type = 'button';
        envButton.onclick = () => S.P.peek('Environment', [['All environments', 'Search across the current project', 'cloud']]);
        label('Time range');
        if (timeControl) {
          timeControl.className = 'log-select';
          timeControl.replaceChildren(document.createTextNode('Last 1 hour'));
          filters.appendChild(timeControl);
        }
        label('Text contains');
        const text = el('input', 'dv-input log-text-filter', filters);
        text.placeholder = 'e.g. request id, user id...';
        text.setAttribute('aria-label', 'Text contains');
        text.oninput = () => S.P.change('query', text.value);
        const more = el('button', 'log-more', filters, 'More filters  ﹀');
        more.type = 'button';
        more.onclick = () => S.P.peek('More filters', [['Request ID', 'Filter by a request identifier', 'filter'], ['Host', 'Application worker', 'cloud']]);
      },
      columnHead: (base, S) => (ctx, main) => {
        base(ctx, main);
        const head = main.querySelector('.dv-columnhead');
        head.replaceChildren();
        for (const text of ['Time  ▾', 'Service', 'Severity', 'Message']) S.st.el('span', '', head, text);
      },
      rowContent: (base, S) => (ctx, row, item, rec) => {
        const { el } = S.st;
        el('span', 'log-time', row, item.time);
        el('span', 'log-service', row, item.service);
        el('span', `log-level ${item.severity.toLowerCase()}`, row, item.severity);
        el('span', 'log-message', row, item.message);
      },
      list: (base, S) => (ctx, main) => {
        const out = base(ctx, main);
        const track = S.st.el('div', 'log-scrollbar', main);
        const thumb = S.st.el('div', 'log-scroll-thumb', track);
        track.setAttribute('aria-label', 'Scroll log events');
        const sync = () => {
          const total = Math.max(1, out.pane.scrollHeight);
          track.hidden = total <= out.pane.clientHeight;
          const height = Math.max(28, track.clientHeight * out.pane.clientHeight / total);
          thumb.style.height = height + 'px';
          thumb.style.top = (out.pane.scrollTop / Math.max(1, total - out.pane.clientHeight) * Math.max(0, track.clientHeight - height)) + 'px';
        };
        let drag = null;
        track.onpointerdown = (e) => {
          e.preventDefault();
          track.setPointerCapture(e.pointerId);
          const rect = thumb.getBoundingClientRect();
          drag = { y:e.clientY, scroll:out.pane.scrollTop };
          if (e.target !== thumb) {
            const r = track.getBoundingClientRect();
            out.pane.scrollTop = (e.clientY - r.top - rect.height / 2) / Math.max(1, r.height - rect.height) * (out.pane.scrollHeight - out.pane.clientHeight);
            drag.scroll = out.pane.scrollTop;
          }
        };
        track.onpointermove = (e) => {
          if (!drag) return;
          out.pane.scrollTop = drag.scroll + (e.clientY - drag.y) * (out.pane.scrollHeight - out.pane.clientHeight) / Math.max(1, track.clientHeight - thumb.offsetHeight);
        };
        track.onpointerup = track.onpointercancel = () => { drag = null; };
        out.pane.addEventListener('scroll', sync);
        S.st.syncLogScrollbar = sync;
        return out;
      },
      detail: (base, S) => (ctx, content) => {
        const out = base(ctx, content);
        const icon = S.st.el('div', 'log-empty-icon', out.detail);
        icon.setAttribute('aria-hidden', 'true');
        out.detail.insertBefore(icon, out.dh);
        return out;
      },
      footer: (base, S) => (ctx, work) => {
        const out = base(ctx, work);
        const foot = out.footCount.parentNode;
        foot.classList.add('log-summary');
        work.insertBefore(foot, work.firstChild);
        const counts = S.st.el('div', 'log-counts', foot);
        for (const level of ['INFO', 'WARN', 'ERROR']) {
          const n = S.spec.items.filter(x => x.severity === level).length;
          const span = S.st.el('span', 'log-count ' + level.toLowerCase(), counts, String(n));
          span.title = level;
        }
        return out;
      },
      paint: (base, S) => (model) => {
        base(model);
        const { dh, meta, detail, footCount, s } = S.st;
        detail.dataset.selected = String(!!model.selected);
        if (!model.selected) {
          dh.textContent = 'No log event selected';
          meta.textContent = 'Select a log entry above to view its details, raw content and related context.';
        }
        footCount.textContent = footCount.textContent.split(' · ')[0];
        S.st.filters.classList.toggle('log-all-levels', model.severity === 'All');
        S.st.syncLogScrollbar();
      },
    },
  },
});
