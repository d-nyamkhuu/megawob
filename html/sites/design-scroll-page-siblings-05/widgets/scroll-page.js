// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-siblings-05',
  name: 'design',
  split: 'train',
  scenarios: ['siblings'],
  template: 'scroll-page/longform',
  design: {
    rowHeight: [54, 54], fontFamily: '"DejaVu Sans Mono", monospace', radius: 0,
    parts: {
      siblings: (base) => (st, sec) => {
        base(st, sec);
        const row = sec.querySelector('.ps-sib');
        const target = st.panes[st.spec.pane.id].box.closest('.ps-sibcol');
        row.prepend(target);
        for (const col of row.children) {
          const icon = st.el('span', 'gem-list-icon', col.querySelector('h3'));
          icon.innerHTML = '<svg viewBox="0 0 24 30" fill="none" stroke="currentColor" stroke-width="2"><path fill="#eee" d="M3 1h12l6 6v22H3z"/><path d="M15 1v7h6M7 12h10M7 16h10M7 20h10M7 24h10"/></svg>';
          col.querySelector('h3').prepend(icon);
          const head = st.el('div', 'gem-columns', col);
          st.el('span', '', head, 'Title');
          st.el('span', '', head, col === target ? 'Updated' : 'Date');
          col.insertBefore(head, col.querySelector('.ps-pane'));
        }
      },
      row: (base) => (st, list, r, pitch) => {
        const row = base(st, list, r, pitch);
        const icon = st.el('span', 'gem-file', row);
        icon.innerHTML = '<svg viewBox="0 0 24 30" fill="none" stroke="currentColor" stroke-width="2"><path fill="#eee" d="M3 1h12l6 6v22H3z"/><path d="M15 1v7h6M7 12h10M7 16h10M7 20h10M7 24h10"/></svg>';
        row.prepend(icon);
        return row;
      },
      fitPage: (base, S) => (st) => {
        if (st.isConfirm) return base(st);
        const workspace = st.el('section', 'gem-workspace', st.wrap);
        const paneArea = st.el('div', 'gem-pane-area', workspace);
        const sibling = st.wrap.querySelector('.ps-sib');
        paneArea.append(sibling);
        const aside = st.el('aside', 'gem-help', workspace);
        const helpTitle = st.el('h2', '', aside, 'Help');
        const info = st.el('span', 'gem-info', helpTitle, 'i'); helpTitle.prepend(info);
        st.el('p', '', aside, 'Browse the knowledge base for helpful articles and guides.');
        st.el('p', '', aside, 'The Help articles panel contains step-by-step instructions, tips and answers to common questions.');
        st.el('p', '', aside, 'Use the scroll bar or the cursor keys to see more articles.');
        const tips = st.el('div', 'gem-tips', aside);
        st.el('strong', '', tips, 'Tips:');
        const ul = st.el('ul', '', tips);
        for (const text of ['Use the mouse wheel or Page Down to scroll.', "Click an article’s Open button to view it.", 'You can also jump between sections using the tabs above.']) st.el('li', '', ul, text);
        const note = st.ctx.stage.parentElement.querySelector('.ref-panel');
        if (note) aside.prepend(note);
        const documents = st.el('div', 'gem-document', st.wrap);
        for (const child of [...st.wrap.children]) if (child !== workspace && child !== documents && !child.classList.contains('ps-away') && !child.classList.contains('ps-float')) documents.append(child);
        st.wrap.prepend(workspace);
        const status = st.el('div', 'gem-status', st.wrap);
        st.el('span', '', status, '⠿');
        workspace.after(status);
        st.wrap.classList.add('gem-root');
        const section = st.spec.sections[st.spec.pane.at];
        if (section) st.secEls[section.id] = workspace;
        base(st);
        for (const pane of Object.values(st.panes)) pane.placeThumb();
      },
      // Keep fixed utility controls outside the direct-child sheet styling.
      floatButton: (base) => (st) => {
        const button = base(st);
        st.wrap.append(button);
        return button;
      },
      away: (base) => (st) => {
        const panel = base(st);
        st.wrap.append(panel.away);
        return panel;
      },
    },
  },
});
