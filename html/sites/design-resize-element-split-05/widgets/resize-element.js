// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-split-05',
  name: 'design',
  split: 'train',
  scenarios: ['split'],
  template: 'resize-element/base',
  design: {
    parts: {
      'renderSplit': (base, S) => function renderSplit(ctx) {
        const { keyboard, lorem, placeIn } = S;
        const { spec, rng, util } = ctx;
        // The seeded axis still controls the divider, even in the stacked document view.
        const v = spec.orient === 'v';
        const box = util.el('div', 'rzs-box', ctx.stage);
        box.dataset.role = 'split';
        Object.assign(box.style, v ? { width: spec.total + 'px', height: spec.cross + 'px' } : { width: spec.cross + 'px', height: spec.total + 'px' });
        const C = ctx.content || {};
        const items = (k) => {
          const out = [];
          for (let i = 0; i < 14; i++) {
            if (k === 0 && C.fileName) out.push(C.fileName(rng));
            else if (Array.isArray(C.EMAIL_SUBJECTS) && C.EMAIL_SUBJECTS.length) out.push(rng.pick(C.EMAIL_SUBJECTS));
            else out.push(lorem(ctx, rng, 1)[0]);
          }
          return out;
        };
        const paneItems = spec.panes.map((_, k) => items(k));
        const titles = ['Q3 Planning', 'Website Redesign', 'Client Feedback', 'Launch Checklist', 'Meeting Notes', 'Roadmap Draft'];
        const dates = ['Apr 12, 2017  10:24 AM', 'Apr 10, 2017  3:18 PM', 'Apr 09, 2017  9:11 AM', 'Apr 06, 2017  4:02 PM', 'Apr 05, 2017  1:20 PM', 'Apr 03, 2017  11:47 AM'];
        const panes = spec.panes.map((name, k) => {
          const p = util.el('div', 'rzs-pane', box);
          p.dataset.role = 'pane';
          const head = util.el('div', 'rzs-head', p);
          util.el('span', 'pane-title', head, k === 0 ? 'Search Results' : 'Q3 Planning');
          p.setAttribute('aria-label', name);
          const em = util.el('em', '', head);
          const identity = util.el('span', 'pane-name', head, name);
          identity.title = 'Pane';
          em.title = name;
          const content = util.el('div', k === 0 ? 'results-scroll' : 'note-scroll', p);
          if (k === 0) {
            const table = util.el('table', 'results-table', content);
            const th = util.el('tr', '', util.el('thead', '', table));
            for (const label of ['Title', 'Notebook', 'Modified']) util.el('th', '', th, label);
            const tbody = util.el('tbody', '', table);
            for (let i = 0; i < titles.length; i++) {
              const tr = util.el('tr', i === 0 ? 'selected' : '', tbody);
              const td = util.el('td', '', tr);
              const icon = util.svg('svg', {viewBox:'0 0 24 28', fill:'none', stroke:i === 0 ? '#008aff' : '#0764c9', 'stroke-width':'1.8'}, td);
              util.svg('path', {d:'M4 2h10l6 6v17H4z M14 2v7h6 M8 13h8 M8 17h8 M8 21h8'}, icon);
              util.el('span', '', td, titles[i]);
              util.el('td', '', tr, 'Projects');
              util.el('td', '', tr, dates[i]);
            }
          } else {
            util.el('div', 'note-date', content, dates[0]);
            for (const [title, lines] of [['Goals', ['Finalize product roadmap', 'Align on key milestones', 'Identify resource needs']], ['Next Steps', ['Schedule team workshop', 'Prepare draft plan', 'Share with stakeholders']]]) {
              util.el('h3', '', content, title);
              const ul = util.el('ul', '', content);
              for (const line of lines) util.el('li', '', ul, line);
            }
          }
          const scroll = util.el('div', 'scroll-decoration', p);
          util.el('span', '', scroll);
          return { p, em };
        });
        const div = util.el('div', 'rzs-div ' + (v ? 'v' : 'h'), box);
        div.dataset.role = 'divider';
        div.setAttribute('role', 'separator');
        const span = spec.total - spec.div;
        const sideOffset = Math.max(0, ctx.size.width - spec.total - 32);
        const paint = (m) => {
          const a = m.pos;
          const b = span - m.pos;
          if (v) {
            const edge = sideOffset + a;
            Object.assign(panes[0].p.style, { left: 0, top: 0, height: '49%', width: edge + 'px' });
            Object.assign(div.style, { left: edge + 'px', top: 0, bottom: 0, width: spec.div + 'px' });
            Object.assign(panes[1].p.style, { left: 0, top: '51%', bottom: 0, width: edge + 'px' });
          } else {
            Object.assign(panes[0].p.style, { top: 0, left: 0, right: 0, height: a + 'px' });
            Object.assign(div.style, { top: a + 'px', left: 0, right: 0, height: spec.div + 'px' });
            Object.assign(panes[1].p.style, { top: a + spec.div + 'px', left: 0, right: 0, height: b + 'px' });
          }
          panes[0].em.textContent = `${v ? 'Width' : 'Height'}: ${a} px`;
          panes[1].em.textContent = `${v ? 'Width' : 'Height'}: ${b} px`;
        };
        if (v) util.el('div', 'document-divider', box);
        paint(ctx.model);
        const clampP = (p) => Math.max(spec.min, Math.min(span - spec.min, Math.round(p)));
        let p0;
        util.drag(div, {
          start() { p0 = ctx.model.pos; div.classList.add('active'); },
          move(e, dx, dy) {
            const pos = clampP(p0 + (v ? dx : dy));
            if (pos === ctx.model.pos) return;
            ctx.update({ ...ctx.model, pos });
            paint(ctx.model);
          },
          end() { div.classList.remove('active'); },
        }, 'divider');
        keyboard(ctx, div, (m) => {
          ctx.update({ ...ctx.model, pos: clampP(m.pos) });
          paint(ctx.model);
        });
        const cross = rng.float(0.3, 0.7);
        placeIn(ctx, box, rng);
        Object.assign(box.style, { left: '0px', top: '0px', ...(v
          ? { width: spec.total + 'px', height: ctx.size.height + 'px' }
          : { width: ctx.size.width + 'px', height: spec.total + 'px' }) });
        return {
          anchors: [box],
          sync: (m) => paint(m),
          locate(t) {
            const r = div.getBoundingClientRect();
            const p = v ? [r.left + r.width / 2, r.top + cross * r.height] : [r.left + cross * r.width, r.top + r.height / 2];
            if (t.pos === undefined) return p;
            const d = t.pos - ctx.model.pos;
            return v ? [p[0] + d, p[1]] : [p[0], p[1] + d];
          },
        };
      },
    },
  },
});
