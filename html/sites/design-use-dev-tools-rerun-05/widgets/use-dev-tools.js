// Reference workspace design (GEM desktop); shared widget: templates/use-dev-tools/workspace.js.
(function () {
  'use strict';
  const OK = '<svg viewBox="0 0 24 24" class="gj-svg"><path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="square"/></svg>';
  const NO = '<svg viewBox="0 0 24 24" class="gj-svg"><path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="square"/></svg>';
  const WAIT = '<svg viewBox="0 0 24 24" class="gj-svg"><path d="M12 6v6l4 3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"/></svg>';
  const glyph = (item, m) => (m.attempts[item.id] ? WAIT : item.status === 'Passed' ? OK : NO);

  const parts = {
    top: () => function () {},
    tabs: () => function () {},
    context: () => function () {},
    graph: () => function () {},
    histogram: () => function () {},
    facets: () => function () {},
    footer: (base) => function (ctx, work) { return base(ctx, work); },
    layout: () => function (ctx, card) {
      const { st } = S_();
      const { el } = st;
      const shell = el('div', 'dv-shell', card);
      const sidebar = el('aside', 'dv-sidebar', document.createElement('div'));
      const work = el('div', 'dv-work', shell);
      const badge = S_().P.heading(ctx, work);
      const query = S_().P.tools(ctx, work);
      const content = el('div', 'dv-content', work);
      const main = el('div', 'dv-main', content);
      return { shell, sidebar, work, badge, query, content, main };
    },
    heading: () => function (ctx, work) {
      const { st } = S_();
      const { s, el } = st;
      const bar = el('div', 'gj-sum', work);
      const left = el('div', 'gj-sum-l', bar);
      el('b', 'gj-run', left, `Pipeline #${s.runId}`);
      el('span', 'gj-br', left, '⑂ main');
      el('span', '', left, '-');
      el('span', 'gj-rev', left, `◯ ${s.revision}`);
      el('span', 'gj-msg', left, 'Add user export endpoint');
      el('span', 'gj-trig', left, 'Triggered 2024-06-12 14:03');
      el('span', '', left, '◷ 8m 24s');
      const right = el('div', 'gj-sum-r', bar);
      st.sum = { ok: el('span', '', right), bad: el('span', '', right), skip: el('span', '', right) };
      return el('span', 'dv-badge gj-hide', bar);
    },
    tools: () => function (ctx, work) {
      const { st, P } = S_();
      const query = st.el('input', 'dv-input dv-search gj-hide', work);
      st.refs.query = query; query.type = 'text'; query.autocomplete = 'off'; query.spellcheck = false;
      query.setAttribute('aria-label', 'Search'); query.oninput = () => P.change('query', query.value);
      return query;
    },
    columnHead: () => function (ctx, main) {
      const { st } = S_();
      const ch = st.el('div', 'dv-columnhead gj-head', main, `Jobs (${st.s.items.length})`);
    },
    rowContent: () => function (ctx, row, item, rec) {
      const { el } = S_().st;
      row.style.gridTemplateColumns = '46px minmax(0,1fr) auto';
      rec.icon = el('span', 'gj-ico', row);
      el('span', 'gj-lbl', row, item.label);
      rec.status = el('span', 'dv-status gj-hide', row);
      el('small', 'gj-dur', row, item.duration);
    },
    detail: () => function (ctx, content) {
      const { st } = S_();
      const { el } = st;
      const detail = el('aside', 'dv-detail gj-detail', content);
      const head = el('div', 'gj-dhead', detail);
      const dh = el('h3', '', head, 'Select an item');
      st.count = el('span', 'gj-count', head);
      const status = el('div', 'gj-status', detail);
      st.bigIco = el('span', 'gj-big', status);
      const txt = el('div', 'gj-stxt', status);
      st.stat = el('b', 'gj-stat', txt);
      const meta = el('p', 'dv-muted gj-meta', txt);
      st.stxt = txt;
      st.holder = el('div', 'gj-hold', status);
      st.statusBox = status;
      return { detail, dh, meta };
    },
    controlsRerun: () => function (ctx, detail) {
      const { st, P } = S_();
      const { el, refs, selectionOnly } = st;
      let draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue;
      prepare = P.button(st.holder, 'prepare', 'Re-run job', true);
      prepare.classList.add('gj-rerun');
      confirmBox = el('div', 'dv-confirm gj-confirm', detail); el('p', '', confirmBox, 'A new attempt will use the same commit and pipeline variables.');
      run = P.button(confirmBox, 'run', 'Run job', true);
      const tabs = el('div', 'gj-tabs', detail);
      const names = ['Logs', 'Details', 'Artifacts', 'Environment'];
      names.forEach((n, i) => {
        const b = el('button', `gj-tab${i ? '' : ' on'}`, tabs, n); b.type = 'button';
        b.onclick = () => { for (const x of tabs.children) x.classList.toggle('on', x === b); };
      });
      const log = el('div', 'dv-terminal gj-log', detail, ''); refs.jobOutput = log;
      selectionOnly.push(st.statusBox, tabs, log);
      return { draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue };
    },
    facts: () => function (ctx, detail) {
      const { st } = S_();
      return st.el('div', 'dv-facts gj-facts', st.stxt);
    },
    detailExtra: () => function () {},
    paint: (base) => function (m) {
      base(m);
      const { st } = S_();
      const { s, rows, sum, stat, bigIco, count } = st;
      let ok = 0; let bad = 0;
      for (const item of s.items) {
        const q = m.attempts[item.id];
        if (!q && item.status === 'Passed') ok++; else if (!q) bad++;
        const r = rows[item.id];
        if (r && r.icon) r.icon.innerHTML = glyph(item, m);
      }
      sum.ok.textContent = `● ${ok} succeeded`; sum.bad.textContent = `⊗ ${bad} failed`; sum.skip.textContent = '○ 0 skipped';
      const item = s.items.find((x) => x.id === m.selected);
      if (item) {
        const q = m.attempts[item.id];
        stat.textContent = q ? 'Queued' : item.status;
        bigIco.innerHTML = glyph(item, m);
        count.textContent = `Job #${s.items.indexOf(item) + 1} of ${s.items.length}`;
      } else { count.textContent = ''; }
    },
  };

  let cur = null;
  function S_() { return cur; }

  env.widget({
    task: 'use-dev-tools',
    site: 'design-use-dev-tools-rerun-05',
    name: 'design',
    split: 'train',
    scenarios: ['rerun'],
    template: 'use-dev-tools/workspace',
    design: {
      inset: 6,
      bottomInset: 14,
      parts: Object.fromEntries(Object.entries(parts).map(([k, f]) => [k, (base, S) => { cur = S; return f(base, S); }])),
    },
  });
})();
