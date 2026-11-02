// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
function releaseMetadata(S, parent, it, i) {
  const types = ['Feature', 'Improvement', 'Spike', 'Bug'];
  const colors = ['#1680ff', '#2c9a61', '#864bc8', '#ce2c55'];
  const type = i % types.length;
  const dot = S.ctx.util.el('span', 'release-type-dot', parent);
  dot.style.background = colors[type];
  S.ctx.util.el('span', 'pj-grow', parent, types[type]);
  const day = (it.start ?? (18 + i)) + (it.duration ?? 1) - 1;
  S.ctx.util.el('span', 'release-date', parent, `${S.spec.month.slice(0, 3)} ${day}`);
}
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-swimlane-05',
  name: 'design',
  split: 'train',
  scenarios: ['swimlane'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0,
    radius: 12,
    font: '18px/1.25 "Segoe UI",Arial,sans-serif',
    laneMin: 0,
    laneTitleHeight: 0,
    boardHeadHeight: 54,
    cardMin: 64,
    cardMax: 88,
    cardInset: 16,
    cardGap: 10,
    parts: {
      icon: (base, S) => (parent, name) => {
        const svg = base(parent, name);
        const filled = {
          people: '<circle cx="8" cy="7" r="3.6"/><circle cx="17" cy="7" r="3"/><path d="M1 21v-3a7 7 0 0 1 14 0v3zm15-1v-3a8 8 0 0 0-2-5c5-1 9 2 9 6v2z"/>',
          folder: '<path d="M2 5a2 2 0 0 1 2-2h5l3 3h8a2 2 0 0 1 2 2v2H2zm0 6h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>',
          check: '<rect x="2" y="2" width="20" height="20" rx="4"/><path d="m6 12 4 4 8-9" fill="none" stroke="white" stroke-width="2"/>',
        };
        if (filled[name]) { svg.innerHTML = filled[name]; svg.style.fill = 'currentColor'; svg.style.stroke = 'none'; }
        return svg;
      },
      heading: (base, S) => () => {
        base();
        const { el } = S.ctx.util;
        const head = S.els.main.querySelector('.pj-head');
        const controls = el('div', 'release-search-tools', head);
        const search = el('button', 'release-search', controls);
        S.P.icon(search, 'search'); el('span', '', search, 'Search tasks...');
        search.onclick = () => S.els.findBtn.click();
        controls.append(S.els.notifications);
        el('span', 'release-profile', controls, 'JS');
        const tabs = el('nav', 'release-top-tabs', S.els.main);
        for (const label of ['Board', 'Timeline', 'Roadmap', 'Reports']) {
          const tab = el('button', label === 'Board' ? 'selected' : '', tabs, label);
          if (label !== 'Board') tab.onclick = () => S.P.drawer(label);
        }
      },
      tabs: (base, S) => () => {
        base();
        const tabs = S.els.main.querySelector('.pj-tabs');
        const labels = ['Projects', 'My tasks', 'Calendar', 'Teams'];
        const icons = ['folder', 'check', 'calendar', 'people'];
        [...tabs.children].forEach((button, i) => {
          button.replaceChildren();
          button.classList.toggle('active', i === 0);
          S.P.icon(button, icons[i]);
          S.ctx.util.el('span', '', button, labels[i]);
        });
        const settings = S.ctx.util.el('button', 'pj-tab', tabs);
        const icon = S.P.icon(settings, 'project');
        icon.innerHTML = '<path d="m10 2-1 3-3 1-3-1-2 4 2 2v3l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-3l2-2-2-4-3 1-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>';
        S.ctx.util.el('span', '', settings, 'Settings');
        settings.onclick = () => S.P.drawer('Settings');
      },
      boardFrame: (base, S) => () => {
        base();
        S.scene.laneH = (S.scene.wrap.clientHeight - S.D.boardHeadHeight) / S.spec.lanes.length;
        const { el } = S.ctx.util;
        const backlog = el('div', 'pj-colhead release-backlog-head', null);
        el('span', 'release-heading-label', backlog, 'Backlog');
        el('span', 'release-heading-count', backlog, String(S.related.length));
        S.scene.heads.prepend(backlog);
        S.scene.laneCounts = [];
      },
      lane: (base, S) => (label, l) => {
        const row = base(label, l);
        const { el } = S.ctx.util;
        const title = row.querySelector('.pj-lane-title');
        title.replaceChildren();
        el('strong', '', title, label);
        const members = el('div', 'release-members', title);
        S.P.icon(members, 'people');
        S.scene.laneCounts[l] = el('span', '', members);
        return row;
      },
      card: (base, S) => (it) => {
        const card = base(it);
        card.querySelector('.pj-card-top').remove();
        const bottom = card.querySelector('.pj-card-bottom');
        bottom.replaceChildren();
        releaseMetadata(S, bottom, it, S.active.findIndex(x => x.id === it.id));
        return card;
      },
      backlog: (base, S) => () => {
        base();
        S.scene.backlogLanes = S.spec.lanes.map(() => S.ctx.util.el('div', 'release-backlog-lane', S.scene.backlog));
      },
      backlogCard: (base, S) => (it, i) => {
        const card = base(it, i);
        card.querySelector('.pj-muted').remove();
        const bottom = card.querySelector('.pj-card-bottom');
        bottom.replaceChildren();
        releaseMetadata(S, bottom, it, i);
        return card;
      },
      boardRefresh: (base, S) => () => {
        base();
        [...S.scene.backlogGrid.children].forEach((card, i) => S.scene.backlogLanes[i % S.spec.lanes.length].append(card));
      },
      boardPaint: (base, S) => (m) => {
        base(m);
        S.scene.laneCounts.forEach((count, l) => {
          count.textContent = String(S.active.filter(it => m.cards[it.id].lane === l).length);
        });
      },
      footer: (base, S) => (m) => {
        const { el } = S.ctx.util;
        S.els.foot.replaceChildren();
        const labels = ['Total work items', 'Features', 'Improvements', 'Spikes', 'Bugs'];
        const colors = ['', '#1680ff', '#2c9a61', '#864bc8', '#ce2c55'];
        labels.forEach((label, i) => {
          const box = el('div', 'release-rollup', S.els.foot);
          const heading = el('div', 'release-rollup-label', box);
          if (i) { const dot = el('span', 'release-type-dot', heading); dot.style.background = colors[i]; }
          el('span', '', heading, label);
          const count = i ? S.active.filter((it, j) => j % 4 === i - 1).length : S.active.length;
          el('strong', '', box, String(count));
        });
      },
      say: (base, S) => (text) => {
        base(text);
        if (!text) {
          S.els.hint.replaceChildren();
          S.P.icon(S.els.hint, 'info');
          S.ctx.util.el('span', '', S.els.hint, 'Drag tasks between columns to update their status. Each column has a work-in-progress limit per team.');
        }
      },
    },
  },
});
