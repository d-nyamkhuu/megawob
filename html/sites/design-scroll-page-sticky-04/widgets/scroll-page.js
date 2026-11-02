// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-sticky-04',
  name: 'design',
  split: 'train',
  scenarios: ['sticky'],
  template: 'scroll-page/longform',
  design: {
    foreground: '#101b43', muted: '#6e7893', accent: '#2868e8', panel: '#fff',
    background: '#fff', line: '#d9dee7', fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
    titleSize: 30, sectionTitleSize: 27, bodySize: 16,
    columnWidth: [1500, 1500], minimumWidth: 420, widthInset: 0,
    rowHeight: [76, 76], siblingRows: [6, 6], radius: 3,
    parts: {
      frame(base) {
        return (st) => {
          const frame = base(st);
          st.helpMain = frame.main;
          const inset = st.ctx.size.width * 0.041;
          Object.assign(frame.wrap.style, {
            width: Math.max(0, st.ctx.size.width - inset * 2) + 'px',
            margin: '0', display: 'block',
          });
          st.helpExtras = st.el('div', 'help-related-content', frame.main);
          if (frame.sideNav) st.helpExtras.append(frame.sideNav);
          for (const rail of frame.wrap.querySelectorAll('.ps-rail')) st.helpExtras.append(rail);
          return frame;
        };
      },
      header(base) {
        return (st) => {
          const original = base(st);
          st.helpExtras.append(original);
          const head = st.el('header', 'help-list-heading', st.main, st.spec.pane.title);
          Object.assign(head.style, { margin: '0 0 12px', lineHeight: '1.2' });
          return head;
        };
      },
      toc(base) {
        return (st) => {
          st.main = st.helpExtras;
          base(st);
          st.main = st.helpMain;
        };
      },
      spacer(base) {
        return (st) => {
          st.main = st.helpExtras;
          const spacer = base(st);
          st.main = st.helpMain;
          return spacer;
        };
      },
      section(base) {
        return (st, s, i) => {
          st.main = st.helpExtras;
          const sec = base(st, s, i);
          st.main = st.helpMain;
          return sec;
        };
      },
      container(base) {
        return (st, sec) => {
          const table = st.el('section', 'help-list-section', st.helpMain);
          base(st, table);
        };
      },
      paneTitle(base) {
        return (st, parent, title) => base(st, st.helpExtras, title);
      },
      scroller(base) {
        return (st, parent, pane, options) => {
          const height = Math.max(120, st.ctx.size.height - 77);
          return base(st, parent, pane, { ...options, height, hh: 37 });
        };
      },
      footer(base) {
        return (st) => {
          st.main.append(st.helpExtras);
          return base(st);
        };
      },
      stickyHeader(base) {
        return (st, list, p, o) => {
          const head = st.el('div', 'ps-shead', list);
          Object.assign(head.style, {
            height: o.hh + 'px', padding: '0 24px', display: 'grid',
            gridTemplateColumns: 'minmax(0,2.15fr) minmax(100px,.65fr) minmax(120px,1.1fr)',
          });
          st.el('b', '', head, 'Article');
          st.el('span', '', head, 'Category');
          st.el('span', '', head, 'Last updated');
          return head;
        };
      },
      row(base, S) {
        return (st, list, r, pitch) => {
          const row = st.el('div', 'ps-row help-article-row', list);
          Object.assign(row.style, {
            height: pitch + 'px', padding: '5px 24px', display: 'grid',
            gridTemplateColumns: 'minmax(0,2.15fr) minmax(100px,.65fr) minmax(120px,1.1fr)',
            gridTemplateRows: 'auto auto', alignContent: 'center', gap: '0 12px',
          });
          const copy = st.el('div', 'help-article-copy', row);
          Object.assign(copy.style, { display: 'flex', flexDirection: 'column', minWidth: '0', gridColumn: '1', gridRow: '1' });
          st.el('span', 't', copy, r.title);
          const meta = st.el('span', 'm', copy, r.meta);
          Object.assign(meta.style, { whiteSpace: 'normal', overflow: 'visible' });
          const acts = st.el('div', 'help-article-actions', row);
          Object.assign(acts.style, { gridColumn: '1', gridRow: '2', display: 'flex', alignItems: 'center' });
          for (const action of r.actions) {
            const button = S.P.action(st, acts, action, 'ps-btn');
            Object.assign(button.style, { minWidth: '110px', minHeight: '28px', padding: '2px 12px' });
          }
          S.P.decorated(st, row, 'row', r);
          return row;
        };
      },
    },
  },
});
