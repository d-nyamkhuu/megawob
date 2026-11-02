// Design of this site on the click-control/controls template (templates/click-control/controls.js): the links sit in the Links column of a project-notes table, below a notes bar.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-09',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      linkDecor: (base, S) => (ctx, art, links) => {
        const { util } = ctx;
        S.P.clearArticle(art);
        const sheet = util.el('div', 'nb-sheet', art);
        const bar = util.el('div', 'nb-bar', sheet);
        util.el('span', '', bar, 'Project Notes');
        util.el('em', '', bar, 'Last updated: Apr 24, 2000');
        const tbl = util.el('table', 'nb-table', sheet);
        const hr = util.el('tr', '', util.el('thead', '', tbl));
        ['Date', 'Subject', 'Details', 'Links', 'Status'].forEach((h) => util.el('th', '', hr, h));
        const tb = util.el('tbody', '', tbl);
        const dates = ['Apr 03', 'Apr 05', 'Apr 07', 'Apr 10', 'Apr 12', 'Apr 17', 'Apr 20', 'Apr 24', 'Apr 26', 'Apr 28'];
        const subj = ['Kickoff materials', 'Requirements', 'Design draft', 'Review', 'Test plan', 'Deployment', 'Follow up', 'Sign-off', 'Archive', 'Retrospective'];
        const det = ['Initial documentation and overview.', 'Summary of customer requests.', 'Preliminary diagrams and notes.', 'Feedback from stakeholders.', 'Test cases and schedule.', 'Production rollout steps.', 'Action items and next steps.', 'Final approvals.', 'Files moved to storage.', 'Lessons learned.'];
        const lead = ['View:', 'Read:', 'Open:', 'See:', 'Docs:', 'Ref:', 'More:', 'Also:', 'Link:', 'Info:'];
        const stat = ['Complete', 'In Progress', 'In Progress', 'Pending', 'Pending', 'Not Started', 'Not Started', 'Not Started', 'Not Started', 'Not Started'];
        const nrows = Math.max(7, Math.ceil(links.length / 3));
        for (let r = 0; r < nrows; r++) {
          const tr = util.el('tr', '', tb);
          const k = r % 10;
          util.el('td', '', tr, dates[k] + ', 2000');
          util.el('td', '', tr, subj[k]);
          util.el('td', '', tr, det[k]);
          const lc = util.el('td', 'nb-links', tr);
          lc.append(lead[k] + ' ');
          const mine = links.filter((_, li) => li % nrows === r).slice(0, 3);
          mine.forEach((a, j) => {
            if (j) util.el('i', '', lc, '|');
            lc.append(a);
          });
          if (!mine.length) lc.append('—');
          util.el('td', '', tr, stat[k]);
        }
        const nd = util.el('div', 'nb-sheet nb-details', art);
        util.el('div', 'nb-bar', nd, 'Note Details');
        util.el('p', '', nd, 'Select a link above to view more information about the related topic.');
      },
    },
  },
});
