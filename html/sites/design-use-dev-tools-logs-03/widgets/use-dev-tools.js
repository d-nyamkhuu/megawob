// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-logs-03',
  name: 'design',
  split: 'train',
  scenarios: ['logs'],
  template: 'use-dev-tools/workspace',
  design: {
    inset: 14, bottomInset: 54, font: 'Arial, Helvetica, sans-serif', fontSize: 14,
    parts: {
      top: (base) => (ctx, card) => { base(ctx, card); card.querySelector('.dv-top').remove(); },
      layout: (base) => (ctx, card) => {
        const layout = base(ctx, card);
        layout.sidebar.remove();
        layout.work.querySelector('.dv-tabs').remove();
        layout.work.querySelector('.dv-heading').remove();
        layout.main.prepend(layout.work.querySelector('.dv-tools'));
        return layout;
      },
      tools: (base) => (ctx, work) => {
        const query = base(ctx, work);
        query.placeholder = 'Search logs...';
        const tools = query.parentElement;
        tools.querySelector('small').remove();
        tools.querySelector('.dv-spacer').remove();
        const range = tools.querySelector('button');
        range.replaceChildren(document.createTextNode('Last 1 hour'));
        range.className = 'log-range';
        return query;
      },
      facets: (base, S) => (ctx, main) => {
        base(ctx, main);
        const { el } = S.st;
        S.st.logMenus = {};
        const facets = main.querySelector('.dv-facets');
        for (const [i, name] of ['service', 'severity'].entries()) {
          const line = facets.children[i];
          line.querySelector('label').textContent += ':';
          const chips = [...line.querySelectorAll('button')];
          const trigger = el('button', 'log-select', line);
          trigger.type = 'button'; trigger.setAttribute('aria-label', name === 'service' ? 'Service' : 'Severity');
          trigger.setAttribute('aria-haspopup', 'listbox');
          const menu = el('div', 'log-options', line); menu.hidden = true;
          for (const chip of chips) {
            menu.append(chip);
            const choose = chip.onclick;
            chip.onclick = () => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); choose(); };
          }
          trigger.onclick = () => {
            const open = menu.hidden;
            for (const entry of Object.values(S.st.logMenus)) { entry.menu.hidden = true; entry.trigger.setAttribute('aria-expanded', 'false'); }
            menu.hidden = !open; trigger.setAttribute('aria-expanded', String(open));
          };
          S.st.logMenus[name] = { trigger, menu };
        }
        const host = el('div', 'dv-facet log-host', facets);
        el('label', '', host, 'Host:');
        const hosts = el('button', 'log-select', host, 'All hosts'); hosts.type = 'button';
        hosts.onclick = () => S.P.peek('Hosts', [['All hosts', 'All indexed instances', 'cloud']]);
      },
      columnHead: (base, S) => (ctx, main) => {
        base(ctx, main);
        const head = main.querySelector('.dv-columnhead'); head.replaceChildren();
        for (const text of ['Time  ▾', 'Level', 'Service', 'Message']) S.st.el('span', '', head, text);
      },
      rowContent: (base, S) => (ctx, row, item, rec) => {
        const { el } = S.st;
        el('span', 'log-time', row, item.time);
        el('span', `dv-level ${item.severity.toLowerCase()}`, row, item.severity);
        el('span', 'log-service', row, item.service);
        el('span', 'log-message', row, item.message);
      },
      list: (base, S) => (ctx, main) => {
        const result = base(ctx, main);
        const track = S.st.el('div', 'log-scroll-track', main);
        const thumb = S.st.el('div', 'log-scroll-thumb', track);
        const pane = result.pane;
        S.st.refreshScroll = () => {
          const height = Math.max(24, track.clientHeight * Math.min(1, pane.clientHeight / Math.max(1, pane.scrollHeight)));
          thumb.style.height = height + 'px';
          thumb.style.top = (pane.scrollTop / Math.max(1, pane.scrollHeight - pane.clientHeight) * Math.max(0, track.clientHeight - height)) + 'px';
          thumb.hidden = pane.scrollHeight <= pane.clientHeight;
        };
        pane.addEventListener('scroll', S.st.refreshScroll);
        let dragging = false, offset = 0;
        const move = (event) => {
          const box = track.getBoundingClientRect();
          const travel = track.clientHeight - thumb.clientHeight;
          pane.scrollTop = Math.max(0, Math.min(1, (event.clientY - box.top - offset) / Math.max(1, travel))) * (pane.scrollHeight - pane.clientHeight);
          S.st.refreshScroll();
        };
        track.onpointerdown = (event) => {
          dragging = true;
          offset = event.target === thumb ? event.clientY - thumb.getBoundingClientRect().top : thumb.clientHeight / 2;
          track.setPointerCapture(event.pointerId); move(event);
        };
        track.onpointermove = (event) => { if (dragging) move(event); };
        track.onpointerup = track.onpointercancel = () => { dragging = false; };
        return result;
      },
      detail: (base, S) => (ctx, content) => {
        const result = base(ctx, content);
        const { el } = S.st;
        const title = el('div', 'log-detail-title', result.detail, 'Event Details'); result.detail.prepend(title);
        const empty = el('div', 'log-detail-empty', result.detail);
        el('strong', '', empty, 'No event selected');
        el('p', '', empty, 'Select a log entry from the list to view');
        el('p', '', empty, 'its details, metadata, and related information.');
        return result;
      },
      paint: (base, S) => (model) => {
        base(model);
        S.st.refreshScroll();
        S.st.detail.dataset.selected = String(!!model.selected);
        for (const [name, entry] of Object.entries(S.st.logMenus)) {
          entry.trigger.textContent = model[name] === 'All' ? (name === 'service' ? 'All services' : 'All levels') : model[name];
        }
      },
      locate: (base, S) => (target) => {
        for (const name of ['service', 'severity']) {
          if (target[name] !== undefined && S.st.logMenus[name].menu.hidden) return S.ctx.util.center(S.st.logMenus[name].trigger);
        }
        return base(target);
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const note = document.querySelector('.ref-panel');
        if (note) S.st.detail.querySelector('.log-detail-title').after(note);
      },
    },
  },
});
