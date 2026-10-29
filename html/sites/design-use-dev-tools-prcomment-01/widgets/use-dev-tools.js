// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-prcomment-01',
  name: 'design',
  split: 'train',
  scenarios: ['prcomment'],
  template: 'use-dev-tools/workspace',
  design: {
    inset: 0, bottomInset: 0, minHeight: 0, radius: 0,
    font: 'Arial, "Liberation Sans", sans-serif', fontSize: 14,
    parts: {
      frame: (base) => (ctx) => {
        const card = base(ctx);
        Object.assign(card.style, {position:'relative', left:'0', top:'0', width:'100%', height:'100%'});
        return card;
      },
      top: () => () => {},
      icon: (base, S) => (parent, name) => {
        const paths = {
          settings: 'M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
          comment: 'M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-9l-5 5v-5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z',
          branch: 'M6 5v14 M18 5v5a6 6 0 0 1-6 6H6 M9 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M9 20a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M21 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
        };
        if (!paths[name]) return base(parent, name);
        const svg = S.st.U.svg('svg', {viewBox:'0 0 24 24',class:'dv-icon','aria-hidden':'true'}, parent);
        S.st.U.svg('path', {d:paths[name]}, svg);
        return svg;
      },
      sidebar: (base, S) => (ctx, sidebar) => {
        const {el, s, colleagues} = S.st;
        const filter = el('button', 'gtk-queue-filter', sidebar, 'Open pull requests');
        el('span', 'gtk-arrow', filter, '');
        filter.onclick = () => S.P.peek('Pull requests', [['Open pull requests', 'Current project', 'review'], ['Closed pull requests', 'Review history', 'check']]);
        const search = el('div', 'gtk-queue-search', sidebar);
        S.P.icon(search, 'search');
        const input = el('input', '', search); input.placeholder = 'Search pull requests...'; input.setAttribute('aria-label', 'Search pull requests');
        const queue = el('div', 'gtk-queue-list', sidebar);
        const titles = ['Improve session handling', 'Update dependencies', 'Add audit logging', 'Fix redirect after login', 'Improve error messages', 'Refactor user model', 'Add timezone support', 'Clean up warnings', 'Update build scripts', 'Add metrics for sessions'];
        const offsets = [0,4,11,18,26,31,34,41,43,50];
        const counts = [3,5,2,4,1,6,3,1,2,4];
        const records = [];
        titles.forEach((title, i) => {
          const row = el('button', 'gtk-queue-row' + (i === 0 ? ' current' : ''), queue);
          el('span', 'gtk-pr-id', row, '#' + (s.runId - offsets[i]));
          const text = el('span', 'gtk-pr-caption', row); el('span', '', text, title);
          el('small', '', text, [s.author, colleagues[0], colleagues[1], s.author, colleagues[2]][i % 5]);
          const count = el('span', 'gtk-pr-count', row); S.P.icon(count, 'comment'); el('span', '', count, counts[i]);
          row.onclick = () => { if(i) S.P.peek('#' + (s.runId - offsets[i]), [[title, 'Open pull request', 'review']]); };
          records.push({row, title});
        });
        input.oninput = () => records.forEach(({row,title}) => { row.hidden = !title.toLowerCase().includes(input.value.toLowerCase()); });
      },
      layout: (base, S) => (ctx, card) => {
        const {el} = S.st;
        const shell = el('div', 'dv-shell gtk-review-shell', card);
        const sidebar = el('aside', 'gtk-queue', shell); S.P.sidebar(ctx, sidebar);
        const work = el('div', 'dv-work', shell);
        const badge = S.P.heading(ctx, work);
        S.P.tabs(ctx, work);
        const region = el('div', 'gtk-files-region', work);
        const query = S.P.tools(ctx, region);
        const content = el('div', 'dv-content', region);
        const main = el('div', 'dv-main', content);
        return {shell, sidebar, work, badge, query, content, main};
      },
      heading: (base, S) => (ctx, work) => {
        const {el, s} = S.st;
        const head = el('div', 'gtk-pr-heading', work);
        const title = el('h2', '', head);
        el('span', 'gtk-header-number', title, '#' + s.runId);
        el('span', '', title, 'Improve session handling');
        const note = document.querySelector('.ref-task .ref-instruction');
        if (note) {head.classList.add('gtk-has-instruction'); head.appendChild(note);}
        const view = el('button', 'gtk-view-git', head, 'View on Git'); el('span', 'gtk-arrow', view);
        view.onclick = () => S.P.peek('Repository', [[s.project, 'Commit ' + s.revision, 'branch']]);
        const sub = el('div', 'gtk-pr-subtitle', head);
        const badge = el('span', 'dv-badge gtk-open', sub, 'Open');
        el('span', '', sub, `${s.author} opened this 3 days ago`);
        el('span', '', sub, '•'); el('span', '', sub, '2 commits'); el('span', '', sub, '•');
        el('span', '', sub, 'base:'); el('a', '', sub, 'main'); el('span', '', sub, '→');
        el('span', '', sub, 'compare:'); el('a', '', sub, 'feature/session-handling');
        el('span', 'gtk-revision', sub, s.revision);
        return badge;
      },
      tabs: (base, S) => (ctx, work) => {
        const {el} = S.st;
        const nav = el('nav', 'gtk-review-tabs', work);
        [['Conversation',3],['Files',4],['Commits',2],['Checks',4]].forEach(([title,count],i) => {
          const tab = el('button', 'gtk-review-tab' + (i === 1 ? ' active' : ''), nav, title);
          el('small', '', tab, count);
          tab.onclick = () => { if(i !== 1) S.P.peek(title, [['Review activity', 'Current pull request', 'review']]); };
        });
      },
      tools: (base, S) => (ctx, work) => {
        const query = base(ctx, work);
        const tools = query.parentElement; tools.classList.add('gtk-file-tools');
        const path = tools.querySelector('.dv-mono'); path.classList.add('gtk-file-picker'); elArrow(path);
        const note = tools.querySelector('small'); note.textContent = '4 of 4 files';
        const diff = tools.querySelector('.dv-toolbtn'); diff.remove();
        for(const glyph of ['‹','›']) { const b = S.st.el('button','gtk-file-step',tools,glyph); b.onclick = () => S.P.peek('Files', [[S.spec.file,'Modified / TypeScript','file']]); }
        return query;
        function elArrow(parent) { S.st.el('span','gtk-arrow',parent); }
      },
      context: (base, S) => (ctx, main) => {
        const {el, s} = S.st;
        const bar = el('div', 'gtk-code-heading', main); S.P.icon(bar, 'file'); el('span', '', bar, s.file);
        const normal = el('button','gtk-normal-view',bar,'Normal view'); el('span','gtk-arrow',normal);
        normal.onclick = () => S.P.peek('Diff options', [['Normal view', 'Unified source diff', 'code']]);
      },
      columnHead: () => () => {},
      detail: (base, S) => (ctx, content) => {
        const result = base(ctx, content); content.insertBefore(result.detail, content.firstChild);
        result.detail.classList.add('gtk-comment-pane');
        const status = S.st.el('section','gtk-review-status',result.detail);
        S.st.el('h3','',status,'Review status');
        const line = S.st.el('div','gtk-status-line',status); S.st.el('i','gtk-orange-dot',line);
        S.st.el('b','',line,'Changes requested'); const threads = S.st.el('a','',line,'3 threads');
        threads.onclick = () => S.P.peek('Review threads', [['Current review', 'Select a line to leave a comment', 'comment']]);
        S.st.el('p','',status,'1 of 2 reviewers approved');
        return result;
      },
      controlsPrcomment: (base, S) => (ctx, detail) => {
        const controls = base(ctx, detail);
        const {el, refs} = S.st;
        const editor = el('section','gtk-comment-section',detail); el('h3','',editor,'Add a comment');
        const box = el('div','gtk-comment-box',editor);
        const tabs = el('div','gtk-editor-tabs',box); el('span','active',tabs,'Write'); el('span','',tabs,'Preview');
        controls.draft.classList.add('gtk-comment-draft'); controls.draft.placeholder = '';
        box.appendChild(controls.draft);
        const format = el('div','gtk-formatting',box);
        for(const [text,path] of [['B'],['I'],['','M8 6l-5 6 5 6M16 6l5 6-5 6M14 3l-4 18'],['','M10 14l4-4M8 16l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0'],['','M3 6h1M3 12h1M3 18h1M8 6h13M8 12h13M8 18h13'],['1 ≡'],['','M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6M3 3l6 6M21 3l-6 6M21 21l-6-6M3 21l6-6']]) {
          const glyph=el('span','',format,text);
          if(path){const svg=S.st.U.svg('svg',{viewBox:'0 0 24 24',class:'dv-icon','aria-hidden':'true'},glyph);S.st.U.svg('path',{d:path},svg);}
        }
        const bottom = el('div','gtk-editor-bottom',box); el('a','',bottom,'Attach files...');
        const add = refs['action:comment']; add.classList.add('gtk-post-comment'); bottom.appendChild(add);
        editor.appendChild(controls.savedComment);
        const approval = el('section','gtk-approval',detail); el('h3','',approval,'Approve review');
        controls.approve.classList.add('gtk-approve-choice'); approval.appendChild(controls.approve);
        el('small','gtk-choice-help',approval,'These changes look good to me.');
        const request = el('div','gtk-review-choice selected',approval,'Request changes');
        el('small','',request,'This change needs more work.');
        const comment = el('div','gtk-review-choice',approval,'Comment'); el('small','',comment,'Leave a comment without approving.');
        const merge = refs['action:merge']; merge.classList.add('gtk-merge'); approval.appendChild(merge);
        return controls;
      },
      detailExtra: (base, S) => (ctx) => {
        const {el, s, colleagues} = S.st;
        const inspector = document.querySelector('.gtk-inspector');
        const tabs = el('div','gtk-inspector-tabs',inspector); el('span','active',tabs,'Details'); el('span','',tabs,'Checks');
        const body = el('div','gtk-properties',inspector);
        const section = (title, gear) => {const node = el('section','gtk-property-section',body); const h = el('h3','',node,title); if(gear) {const g=el('span','gtk-property-gear',h); S.P.icon(g,'settings');} return node;};
        const pr = section('Pull request'); const caption=el('div','gtk-property-caption',pr); el('b','',caption,'#'+s.runId); el('span','',caption,'Improve session handling');
        for(const [key,value] of [['Author',s.author],['Opened','Apr 18, 2024'],['Base','main'],['Compare','feature/session-handling']]) {
          const row=el('div','gtk-property-line',pr); el('span','',row,key); el(key==='Base'||key==='Compare'?'a':'span','',row,value);
        }
        const reviewers=section('Reviewers'); colleagues.slice(0,2).forEach((name,i)=>{const row=el('div','gtk-reviewer',reviewers); const face=el('span','gtk-face',row); face.title=name;
          face.innerHTML=`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${i?'#c6c9c5':'#3b7c68'}"/><path d="M3 24v-4c2-5 16-5 18 0v4" fill="${i?'#526470':'#a9b6a3'}"/><path d="M9 16v4h6v-4" fill="#c99878"/><ellipse cx="12" cy="10" rx="6" ry="8" fill="#d6ad87"/><path d="M6 11C3-1 21-2 18 11l-2-6-8 1z" fill="#37413d"/><path d="M8 10h3m2 0h3M11 14h3" stroke="#665348" stroke-width=".8"/></svg>`;
          el('span','',row,name); el('i',i?'gtk-orange-dot':'gtk-green-dot',row,i?'':'✓'); el('span','gtk-reviewer-status',row,i?'Changes requested':'Approved'); const gear=el('span','gtk-property-gear',row); S.P.icon(gear,'settings');});
        const labels=section('Labels',true); el('span','gtk-label-pill',labels,'area: auth');
        el('p','',section('Milestone',true),'v1.4'); el('p','gtk-muted',section('Assignees',true),'Unassigned');
        const timeline=section('Timeline');
        [[s.author+' opened this pull request','Apr 18, 2024, 9:14 AM','branch'],[s.author+' pushed 2 commits','Apr 18, 2024, 10:03 AM','branch'],[colleagues[0]+' approved these changes','Apr 19, 2024, 2:11 PM','comment'],[colleagues[1]+' requested changes','Apr 20, 2024, 11:27 AM','comment']].forEach(([text,time,icon])=>{const row=el('div','gtk-history-row',timeline); S.P.icon(row,icon); const label=el('div','',row,text); el('time','',label,time);});
      },
      footer: (base) => (ctx, work) => {const result=base(ctx,work); result.footCount.parentElement.classList.add('gtk-work-footer'); return result;},
      paint: (base, S) => (model) => {
        base(model);
        const status = S.st.detail.querySelector('.gtk-status-line');
        status.querySelector('b').textContent = model.approved ? 'Review approved' : 'Changes requested';
        status.querySelector('i').className = model.approved ? 'gtk-green-dot' : 'gtk-orange-dot';
        status.querySelector('a').textContent = (3 + Object.keys(model.comments || {}).length) + ' threads';
        status.parentElement.querySelector('p').textContent = model.approved ? '2 of 2 reviewers approved' : '1 of 2 reviewers approved';
        S.st.detail.querySelector('.gtk-approve-choice').classList.toggle('approved', !!model.approved);
        S.st.detail.querySelector('.gtk-review-choice').classList.toggle('selected', !model.approved);
      },
    },
  },
});
