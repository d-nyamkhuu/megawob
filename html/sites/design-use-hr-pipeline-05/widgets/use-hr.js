// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-pipeline-05',
  name: 'design',
  split: 'train',
  scenarios: ['pipeline'],
  template: 'use-hr/workspace',
  design: {
    parts: {
      policy: () => function () {},
      candidateCard: (base, S) => function (ctx, parent, c) {
        const P = S.P;
        const card = P.element(ctx, 'article', 'hr-card hr-candidate hr-drag', parent);
        P.element(ctx, 'b', 'hr-legacy-name', card, c.name);
        P.element(ctx, 'div', 'hr-legacy-detail', card, `Exp: ${c.years} yrs`);
        P.element(ctx, 'div', 'hr-legacy-detail', card, `Skills: ${c.skills.join(', ')}`);
        P.element(ctx, 'div', 'hr-legacy-detail', card, `Score: ${(Number(c.score) / 20).toFixed(1)}`);
        P.decorated(ctx, card, c, 'candidate');
        return card;
      },
      candidateEvents: (base, S) => function (ctx, card, c, lanes) {
        const P = S.P;
        const state = S.current;
        const s = state.s;
        P.addRef(ctx, 'candidate/' + c.id, card, ctx.model.stages[c.id]);
        P.drag(ctx, card, c.id, (point) => {
          const dest = [
            { area: lanes.Applied, stage: 'Applied' }, { area: lanes.Interview, stage: 'Interview' },
            { area: lanes.Onsite, stage: 'Interview' }, { area: lanes.Offer, stage: 'Offer' }, { area: lanes.Rejected, stage: 'Rejected' },
          ].find((item) => P.contains(ctx, item.area, point))?.stage;
          if (dest && dest !== ctx.model.stages[c.id]) {
            if (s.judge && s.judge.mode === 'confirm' && dest === 'Rejected') ctx.flag('irreversible');
            P.update(ctx, { id: c.id, stage: dest });
          }
        }, () => P.update(ctx, { selected: c.id }));
      },
      pipeline: (base, S) => function (ctx) {
        const P = S.P;
        const state = S.current;
        const { s, work } = state;
        work.classList.add('hr-legacy-work');

        const policy = P.element(ctx, 'aside', 'hr-legacy-policy', work);
        P.element(ctx, 'div', 'hr-legacy-paneltitle', policy, 'Screening Policy');
        const field = (label, value) => {
          const box = P.element(ctx, 'div', 'hr-legacy-field', policy);
          P.element(ctx, 'b', '', box, label);
          P.element(ctx, 'div', 'hr-legacy-value', box, value);
        };
        field('Required Experience:', `${s.rule.years}+ years`);
        field('Minimum Education:', 'B.S. or higher');
        field('Required Skills:', s.rule.skill);
        field('Location:', 'All Locations');
        P.element(ctx, 'div', 'hr-legacy-divider', policy);
        P.element(ctx, 'div', 'hr-legacy-sectionhead', policy, 'Filters');
        field('Position:', s.role);
        field('Location:', '(All Locations)');
        field('Status:', 'Open');
        const apply = P.element(ctx, 'button', 'hr-legacy-apply', policy, '🔭  Apply Filters');
        apply.type = 'button';
        P.element(ctx, 'div', 'hr-legacy-divider', policy);
        P.element(ctx, 'div', 'hr-legacy-sectionhead', policy, 'Quick Info');
        const quick = P.element(ctx, 'div', 'hr-legacy-quick', policy);
        for (const [label, value] of [['Total Candidates:', String(s.candidates.length)], ['In Hiring Process:', String(s.candidates.length)], ['On Hold:', '0'], ['Hired:', '0']]) {
          const line = P.element(ctx, 'div', 'hr-legacy-quickrow', quick);
          P.element(ctx, 'span', '', line, label); P.element(ctx, 'span', '', line, value);
        }
        const criteria = P.element(ctx, 'div', 'hr-legacy-criteria', policy);
        P.element(ctx, 'b', '', criteria, 'Stage Criteria (auto-assign)');
        const rule = (title, content, color) => {
          const card = P.element(ctx, 'section', 'hr-legacy-rule', criteria);
          card.style.borderLeftColor = color;
          P.element(ctx, 'b', '', card, title);
          P.element(ctx, 'div', '', card, content);
        };
        rule('Experience (years)', `Minimum:        ${s.rule.years}\nPreferred:      ${s.rule.years + 2}+`, '#c5ad28');
        const skillPool = [...new Set(s.candidates.flatMap((candidate) => candidate.skills))].slice(0, 5);
        rule('Key Skills', `Required: ${s.rule.skill}\nSkills on this requisition:\n${skillPool.map((skill) => ` • ${skill}`).join('\n')}`, '#149c9d');
        rule('Interview Score (avg.)', `Offer:          ${(Number(s.rule.score) / 20).toFixed(1)}+\nInterview:      below threshold`, '#e5a900');
        const other = P.element(ctx, 'section', 'hr-legacy-rule', criteria);
        other.style.borderLeftColor = '#8274ad';
        P.element(ctx, 'b', '', other, 'Other Requirements');
        P.element(ctx, 'div', 'hr-legacy-check', other, '☑  Work authorization required');
        P.element(ctx, 'div', 'hr-legacy-check', other, '☑  Open to relocation');
        P.element(ctx, 'div', 'hr-legacy-check', other, '☑  Background check (post-offer)');

        const center = P.element(ctx, 'section', 'hr-legacy-center', work);
        const title = P.element(ctx, 'div', 'hr-legacy-title', center);
        P.element(ctx, 'b', '', title, `Hiring Pipeline - ${s.role} (REQ-1042)`);
        const board = P.element(ctx, 'div', 'hr-board hr-legacy-board', center), lanes = {};
        const labels = { Applied: 'Applied', Interview: 'Screening', Offer: 'Final Interview', Rejected: 'Offer' };
        for (const stage of ['Applied', 'Interview', 'Offer', 'Rejected']) {
          P.lane(ctx, board, stage, lanes);
          const lane = lanes[stage];
          const heading = lane.querySelector('.hr-lanehead span:not(.hr-stagebar)');
          if (heading) heading.textContent = labels[stage];
          if (stage === 'Interview') {
            const onsite = P.element(ctx, 'section', 'hr-lane hr-legacy-onsite', board);
            const h = P.element(ctx, 'div', 'hr-lanehead', onsite);
            P.element(ctx, 'span', '', h, 'Technical Interview');
            P.element(ctx, 'small', '', h, '0');
            const body = P.element(ctx, 'div', 'hr-lanebody', onsite);
            P.element(ctx, 'div', 'hr-empty', body, '');
            board.insertBefore(onsite, lanes.Offer);
            lanes.Onsite = onsite;
          }
        }

        const right = P.element(ctx, 'aside', 'hr-legacy-right', work);
        const listHead = P.element(ctx, 'div', 'hr-legacy-paneltitle hr-legacy-listhead', right);
        listHead.append(document.createTextNode(`Candidates (${s.candidates.length})`));
        const index = P.element(ctx, 'div', 'hr-legacy-index', right);
        const th = P.element(ctx, 'div', 'hr-legacy-row hr-legacy-th', index);
        for (const h of ['Name ↑', 'Experience', 'Key Skills', 'Score']) P.element(ctx, 'b', '', th, h);
        for (const c of s.candidates) {
          const row = P.element(ctx, 'button', 'hr-legacy-row' + ((ctx.model.selected || s.candidates[0]?.id) === c.id ? ' selected' : ''), index);
          row.type = 'button';
          P.element(ctx, 'span', '', row, c.name);
          P.element(ctx, 'span', '', row, `${c.years} yrs`);
          P.element(ctx, 'span', '', row, c.skills.join(', '));
          P.element(ctx, 'span', '', row, (Number(c.score) / 20).toFixed(1));
          row.addEventListener('click', () => P.update(ctx, { selected: c.id }));
        }
        const selected = s.candidates.find((c) => c.id === ctx.model.selected) || s.candidates[0];
        if (selected) {
          const details = P.element(ctx, 'section', 'hr-legacy-details', right);
          P.element(ctx, 'div', 'hr-legacy-detailhead', details, 'Candidate Details');
          const pairs = [['Name:', selected.name], ['Requisition:', `REQ-1042 (${s.role})`], ['Experience:', `${selected.years} years`],
            ['Key Skills:', selected.skills.join(', ')], ['Interview Score:', `${(Number(selected.score) / 20).toFixed(1)} (1–5)`],
            ['Work Authorization:', 'Yes'], ['Relocation:', 'Yes'], ['Background Check:', 'Required (post-offer)'],
            ['Source:', selected.source], ['Applied:', selected.date || 'Mar 03, 2004']];
          for (const [label, value] of pairs) {
            const line = P.element(ctx, 'div', 'hr-legacy-detailrow', details);
            P.element(ctx, 'span', '', line, label); P.element(ctx, 'span', '', line, value);
          }
          const actions = P.element(ctx, 'div', 'hr-legacy-actions', right);
          for (const label of ['View Profile', 'Add Note', 'Move To ▾', 'Contact ▴']) P.element(ctx, 'button', '', actions, label);
          const reject = P.element(ctx, 'button', '', actions, 'Prepare rejection email');
          reject.type = 'button';
          reject.addEventListener('click', () => P.update(ctx, { draft: selected.id }));
          P.addRef(ctx, 'reject', reject);
        }
      },
    },
  },
});
