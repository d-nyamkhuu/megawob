// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-branching-05',
  name: 'design',
  split: 'train',
  scenarios: ['branching'],
  template: 'use-form-builder/editor',
  design: {
    accent: '#83cf24', background: '#fafafa', panel: '#ffffff', text: '#10141b',
    muted: '#6c7180', line: '#d6d9df', fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '18px', radius: '0px', inset: 12, noteGap: 8,
    parts: {
      topbar: (base, S) => st => {
        const P = S.P;
        st.top = P.el(st, 'div', 'ns-hooks', st.root);
        const caption = document.querySelector('.ns-window-title');
        if (caption) caption.textContent = st.ctx.spec.title;
      },
      layout: (base, S) => st => {
        const P = S.P;
        st.workspace = P.el(st, 'div', 'af-workspace ns-workspace', st.root);
        st.editor = P.el(st, 'div', 'af-editor ns-editor', st.workspace);
        const left = P.el(st, 'aside', 'ns-section-pane', st.editor);
        P.el(st, 'div', 'ns-heading', left, 'Sections');
        st.sections = P.el(st, 'div', 'af-sections', left);
        const tools = P.el(st, 'div', 'ns-section-tools', left);
        ['+', '−', '⌃', '⌄'].forEach((text, i) => {
          const b = P.button(st, text, tools, null, null);
          b.setAttribute('aria-label', ['Add section', 'Remove section', 'Move section up', 'Move section down'][i]);
          b.addEventListener('click', () => env.log('decoy', {what:'section-tool', label:text}));
        });
        st.body = P.el(st, 'div', 'af-body ns-body', st.editor);
        st.foot = P.el(st, 'div', 'af-foot ns-hooks', st.root);
        P.tabs(st);
      },
      tabs: (base, S) => st => {
        const P = S.P;
        const tabs = P.el(st, 'nav', 'af-tabs ns-dock', st.root);
        tabs.setAttribute('aria-label', 'Form editor');
        const tabButtons = {};
        const dockIcon = (name, parent) => {
          if(name==='form') return P.el(st,'span','ns-document',parent);
          if(name==='palette') {
            const svg=st.ctx.util.svg('svg',{viewBox:'0 0 34 34',width:32,height:34,class:'ns-dock-symbol','aria-hidden':'true'},parent);
            st.ctx.util.svg('ellipse',{cx:17,cy:17,rx:14,ry:15,fill:'#bfc1c3',stroke:'#333'},svg);
            [[11,10],[20,8],[25,17],[18,25],[9,21]].forEach(([cx,cy])=>st.ctx.util.svg('circle',{cx,cy,r:3,fill:'#454749'},svg));
            return svg;
          }
          const paths={play:['M5 2 27 17 5 32Z'],route:['M13 2h8v8h-8zM2 24h8v8H2zM23 24h8v8h-8z','M17 10v8H6v6M17 18h10v6'],results:['M3 19h6v13H3zM14 10h6v22h-6zM25 1h6v31h-6z']};
          if(!paths[name]) return P.icon(st,name,parent,30);
          const svg=st.ctx.util.svg('svg',{viewBox:'0 0 34 34',width:32,height:34,class:'ns-dock-symbol','aria-hidden':'true'},parent);
          paths[name].forEach(d=>st.ctx.util.svg('path',{d,fill:name==='route'?'#bbb':'#d4d5d6',stroke:'#eee','stroke-width':1},svg));
          return svg;
        };
        const item = (id, label, name, icon) => {
          const b = P.button(st, '', tabs, {tab:id}, {ui:{tab:id}});
          b.setAttribute('role', 'tab'); b.setAttribute('aria-label', name); b.title = name;
          dockIcon(icon, b); P.el(st, 'span', '', b, label);
          tabButtons[id] = b;
        };
        item('questions', 'Survey', 'Questions', 'form');
        item('arrange', 'Design', 'Arrange', 'palette');
        item('logic', 'Logic', 'Logic', 'route');
        const preview = P.button(st, '', tabs, {preview:true}, null);
        dockIcon('play', preview); P.el(st, 'span', '', preview, 'Preview');
        preview.addEventListener('click', () => P.commit(st, {ui:{preview:!st.ctx.model.ui.preview}}));
        st.previewButton=preview;
        item('settings', 'Results', 'Settings', 'results');
        Object.assign(st, {tabs, tabButtons});
      },
      sectionButton: (base, S) => (st, id) => {
        const P = S.P, m = st.ctx.model, sec = st.ctx.spec.sections.find(s => s.id === id);
        const b = P.button(st, '', st.sections, {section:id}, {ui:{section:id, selected:m.orders[id][0] || null}}, m.ui.section === id ? 'on' : '');
        P.el(st, 'span', 'ns-document', b);
        P.el(st, 'span', '', b, `${m.sectionOrder.indexOf(id)+1}.  ${sec.title}`);
        b.title = sec.title;
      },
      questionPanels: (base, S) => st => {
        const P = S.P, F = env.taskDef, m = st.ctx.model;
        const main = P.el(st, 'div', 'ns-main', st.body);
        const list = P.el(st, 'section', 'ns-question-pane', main);
        const head = P.el(st, 'div', 'ns-list-heading', list);
        P.el(st, 'strong', '', head, 'Questions in this section');
        P.addControl(st, head);
        const viewport=P.el(st,'div','ns-list-viewport',list);
        const a = P.pane(st, 'canvas', 'af-canvas ns-question-table', viewport);
        P.canvas(st, a);
        const b = P.pane(st, 'inspector', 'af-inspector ns-properties', st.body);
        const q = F.helpers.question(m, m.ui.selected);
        if(m.ui.tab==='logic'&&q) P.routing(st,b,q);
        else P.inspector(st, b);
      },
      canvas: (base, S) => (st, parent) => {
        const m = st.ctx.model, sec = st.ctx.spec.sections.find(s => s.id === m.ui.section);
        for(const id of m.orders[sec.id]) {
          const q = env.taskDef.helpers.question(m, id);
          if(q) S.P.questionCard(st, parent, sec, id, q);
        }
      },
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const P = S.P, m = st.ctx.model;
        const row = P.el(st, 'div', 'ns-question-row' + (m.ui.selected === id ? ' selected' : ''), parent);
        row.tabIndex = 0; row.setAttribute('role', 'button'); row.setAttribute('aria-label', q.title);
        P.register(st, {question:id}, row, 'canvas');
        const select = () => P.commit(st, {ui:{selected:id}});
        row.addEventListener('click', select);
        row.addEventListener('keydown', e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});
        P.el(st, 'span', 'ns-grip', row);
        P.el(st, 'span', 'ns-card-number', row, String(m.orders[sec.id].indexOf(id)+1)+'.');
        const copy=P.el(st,'div','ns-card-copy',row);
        const title = P.el(st, 'strong', 'ns-card-title', copy, q.title);
        const summary=now=>now.type+(now.options.length?' · '+now.options.length+' options':'');
        const type = P.el(st, 'span', 'ns-card-type', copy, summary(q));
        const more=P.button(st,'•••',row,null,null,'ns-card-more');
        more.setAttribute('aria-label','Question actions');
        more.addEventListener('click',e=>{
          e.stopPropagation();
          const rect=more.getBoundingClientRect();select();
          if(st.actionsMenu){
            st.actionsMenu.hidden=false;
            st.actionsMenu.style.left=Math.min(rect.left,st.ctx.size.width-190)+'px';
            st.actionsMenu.style.top=Math.min(rect.bottom,st.ctx.size.height-220)+'px';
          }
        });
        st.syncers.push(() => {
          const now = env.taskDef.helpers.question(st.ctx.model, id);
          if(now){title.textContent=now.title;type.textContent=summary(now);}
        });
        P.questionDecorated(st, row, q);
        return row;
      },
      addControl: (base, S) => (st, parent) => {
        const P=S.P, m=st.ctx.model, q=env.taskDef.helpers.question(m,m.ui.selected);
        const tools=P.el(st,'div','ns-question-tools',parent);
        const add=P.button(st,'＋ Add question',tools,{add:true},{ui:{open:m.ui.open==='add'?null:'add'}});
        P.register(st,{add:true},add,'canvas');
        const menu=P.el(st,'div','ns-actions-menu',tools);menu.hidden=true;st.actionsMenu=menu;
        const duplicate=P.button(st,'Duplicate',menu,null,null,'ns-secondary-action');
        duplicate.addEventListener('click',()=>env.log('decoy',{what:'duplicate-question'}));
        if(q) P.button(st,'Delete',menu,{remove:q.id},{remove:q.id},'ns-secondary-action');
        const moves=P.el(st,'div','ns-moves ns-secondary-action',menu);
        ['⌃','⌄'].forEach((text,i)=>{
          const b=P.button(st,text,moves,null,null);
          b.setAttribute('aria-label',i?'Move question down':'Move question up');
          b.addEventListener('click',()=>{
            const ids=[...st.ctx.model.orders[st.ctx.model.ui.section]],at=ids.indexOf(st.ctx.model.ui.selected),to=at+(i?1:-1);
            if(at>=0&&to>=0&&to<ids.length){[ids[at],ids[to]]=[ids[to],ids[at]];P.commit(st,{order:['questions',ids]});}
          });
        });
        if(st.previewButton)menu.append(st.previewButton);
        const close=P.button(st,'Close',menu,null,null);
        close.addEventListener('click',()=>{menu.hidden=true;});
      },
      inspector: (base, S) => (st, p) => {
        const P=S.P, q=env.taskDef.helpers.question(st.ctx.model,st.ctx.model.ui.selected);
        const heading=P.el(st,'div','ns-details-heading',p);
        P.el(st,'strong','',heading,'Question details');
        const tools=P.el(st,'div','ns-detail-tools',heading);
        ['arrange','settings'].forEach((name,i)=>{
          const b=st.tabButtons[name];b.textContent=i?'⌄':'⌃';b.classList.add('ns-detail-tool');tools.append(b);
          P.register(st,{tab:name},b,'inspector');
        });
        if(!q) return;
        const content=P.el(st,'div','ns-property-content',p);
        P.properties(st,content,q);
        const rows=P.el(st,'div','ns-detail-rows',p);
        const validation=P.el(st,'details','ns-disclosure',rows);
        const vhead=P.el(st,'summary','ns-detail-row',validation);
        const shield=st.ctx.util.svg('svg',{viewBox:'0 0 24 24',width:25,height:25,'aria-hidden':'true'},vhead);
        st.ctx.util.svg('path',{d:'M4 4 12 1l8 3v8c0 5-8 10-8 10S4 17 4 12Z',fill:'none',stroke:'currentColor','stroke-width':2},shield);
        P.el(st,'strong','',vhead,'Response validation');
        P.el(st,'span','ns-detail-status',vhead,q.validation.required?'Answer required':'No rules set');P.el(st,'span','ns-chevron',vhead,'›');
        const vbody=P.el(st,'div','ns-disclosure-body',validation);
        const preset=P.select(st,'Rule','preset',q.validation.preset,vbody,'inspector');
        preset.setAttribute('aria-label',`Validation rule: ${q.validation.preset}`);
        if(['Number range','Text length'].includes(q.validation.preset)) {
          const pair=P.el(st,'div','af-pair',vbody);
          P.field(st,'Minimum','min',q.validation.min,pair,'inspector');P.field(st,'Maximum','max',q.validation.max,pair,'inspector');
        }
        P.toggle(st,'Require an answer','','required',q.validation.required,vbody,'inspector');
        const routing=st.tabButtons.logic;
        routing.classList.add('ns-detail-row');routing.replaceChildren();
        const routeIcon=st.ctx.util.svg('svg',{viewBox:'0 0 24 24',width:25,height:25,'aria-hidden':'true'},routing);
        st.ctx.util.svg('path',{d:'M6 4v16M6 15c10 0 12-3 12-11',fill:'none',stroke:'currentColor','stroke-width':2},routeIcon);
        [ [6,4],[6,20],[18,4] ].forEach(([cx,cy])=>st.ctx.util.svg('circle',{cx,cy,r:3,fill:'currentColor'},routeIcon));
        P.el(st,'strong','',routing,'Answer routing');
        const count=Object.values(st.ctx.model.rules[q.id]||{}).filter(x=>x!=='next').length;
        P.el(st,'span','ns-detail-status',routing,count?count+' rules set':'No rules set');P.el(st,'span','ns-chevron',routing,'›');rows.append(routing);
        P.register(st,{tab:'logic'},routing,'inspector');
        const display=P.el(st,'details','ns-disclosure',rows);
        const dhead=P.el(st,'summary','ns-detail-row',display);
        const eye=st.ctx.util.svg('svg',{viewBox:'0 0 26 24',width:26,height:25,'aria-hidden':'true'},dhead);
        st.ctx.util.svg('path',{d:'M1 12S6 4 13 4s12 8 12 8-5 8-12 8S1 12 1 12Z',fill:'none',stroke:'currentColor','stroke-width':2},eye);
        st.ctx.util.svg('circle',{cx:13,cy:12,r:4,fill:'none',stroke:'currentColor','stroke-width':2},eye);
        P.el(st,'strong','',dhead,'Display logic');P.el(st,'span','ns-detail-status',dhead,'Always show');P.el(st,'span','ns-chevron',dhead,'›');
        const dbody=P.el(st,'div','ns-disclosure-body',display);P.el(st,'div','',dbody,'Show this question to everyone.');
      },
      properties: (base, S) => (st,p,q) => {
        const P=S.P;
        const type=P.select(st,'Question type','type',q.type,p,'inspector');
        if(q.type==='Multiple choice')type.classList.add('ns-type-choice');
        const title=P.field(st,'Question text','title',q.title,p,'inspector',true);
        title.classList.add('ns-title-input');
        const box=P.el(st,'div','ns-answer-field',p);
        P.el(st,'span','af-label',box,'Answer options');
        const list=P.el(st,'div','ns-answer-list',box);
        const options=P.field(st,'Answer options','options',q.options.join('\n'),p,'inspector',true);
        options.classList.add('ns-options-source');options.parentNode.classList.add('ns-options-source-field');
        options.setAttribute('aria-label','Answer options · one per line');
        const update=()=>{options.value=[...list.querySelectorAll('input')].map(x=>x.value).join('\n');options.dispatchEvent(new Event('input',{bubbles:true}));};
        q.options.forEach((answer,i)=>{
          const row=P.el(st,'div','ns-answer-row',list);
          P.el(st,'span','ns-grip',row);P.el(st,'span','ns-choice-circle',row);
          const input=P.el(st,'input','ns-answer-input',row);input.value=answer;input.setAttribute('aria-label','Answer option '+(i+1));input.addEventListener('input',update);
          const more=P.button(st,'•••',row,null,null,'ns-option-more');more.title='Option actions';
          const remove=P.button(st,'',row,null,null,'ns-option-remove');remove.setAttribute('aria-label','Remove answer option '+(i+1));
          const bin=st.ctx.util.svg('svg',{viewBox:'0 0 20 24',width:19,height:23,'aria-hidden':'true'},remove);
          st.ctx.util.svg('path',{d:'M3 6h14M7 6V3h6v3M5 7l1 15h8l1-15M8 10v9M12 10v9',fill:'none',stroke:'currentColor','stroke-width':1.8},bin);
          remove.addEventListener('click',()=>{row.remove();update();});
          st.syncers.push(()=>{const now=env.taskDef.helpers.question(st.ctx.model,q.id);if(document.activeElement!==input&&now?.options[i]!==undefined)input.value=now.options[i];});
        });
        if(!q.options.length)P.el(st,'div','ns-no-options',list,'No answer options for this question type.');
        const add=P.button(st,'＋ Add option',list,null,null,'ns-add-option');
        if(!q.options.length&&!['Multiple choice','Checkboxes'].includes(q.type))add.hidden=true;
        add.addEventListener('click',()=>{
          options.value=[...list.querySelectorAll('input')].map(x=>x.value).concat('New option').join('\n');
          options.dispatchEvent(new Event('input',{bubbles:true}));
          P.commit(st,{ui:{selected:q.id}});
        });
      },
      toggle: (base, S) => (st,label,hint,name,on,parent,paneName) => {
        const P=S.P, row=P.el(st,'div','ns-check-row',parent);
        const b=P.button(st,on?'✓':'',row,{toggle:name},{toggle:name},'ns-check');
        b.setAttribute('role','checkbox');b.setAttribute('aria-label',label);b.setAttribute('aria-checked',String(on));
        P.register(st,{toggle:name},b,paneName);P.el(st,'span','',row,label);return b;
      },
      routing: (base, S) => (st,parent,q) => {
        const P=S.P,m=st.ctx.model,spec=st.ctx.spec;
        const panel=P.el(st,'section','ns-routing',parent);
        const heading=P.el(st,'div','ns-route-heading',panel);
        P.el(st,'strong','',heading,'Answer routing');
        const back=st.tabButtons.questions;back.textContent='‹ Question details';back.classList.add('ns-back');heading.append(back);
        P.register(st,{tab:'questions'},back,'inspector');
        const content=P.el(st,'div','ns-route-content',panel);
        const rules=m.rules[q.id]||{}, count=Object.values(rules).filter(x=>x!=='next').length;
        const enable=P.el(st,'div','ns-check-row',content);
        const cb=P.button(st,count||m.ui.tab==='logic'?'✓':'',enable,null,null,'ns-check');
        cb.setAttribute('role','checkbox');cb.setAttribute('aria-label','Enable answer-based routing for this question');
        cb.setAttribute('aria-checked',String(Boolean(count||m.ui.tab==='logic')));
        cb.addEventListener('click',()=>P.commit(st,{ui:{tab:m.ui.tab==='logic'?'questions':'logic'}}));
        P.el(st,'span','',enable,'Enable answer-based routing for this question');
        const grid=P.el(st,'div','ns-route-grid',content), table=P.el(st,'div','ns-route-table',grid);
        const head=P.el(st,'div','ns-route-head',table);
        P.el(st,'span','',head,'Answer option');P.el(st,'span','',head,'Go to section');
        const rows=P.pane(st,'routes','ns-route-rows',table);
        const visible=m.ui.tab==='logic'?q.options:q.options.filter(a=>rules[a]&&rules[a]!=='next');
        if(!visible.length)P.el(st,'div','ns-route-empty',rows,'No answer routes defined.');
        visible.forEach(answer=>P.routingRule(st,rows,q,answer,q.options.indexOf(answer)));
        const tools=P.el(st,'div','ns-route-tools',grid);
        const open=()=>{
          const choice=q.options.length?q:m.questions.find(x=>x.options.length);
          if(choice)P.commit(st,{ui:{tab:'logic',section:choice.section,selected:choice.id}});
        };
        const add=P.button(st,'Add Route…',tools,null,null);add.addEventListener('click',open);
        const edit=P.button(st,'Edit…',tools,null,null);edit.disabled=!count;
        edit.addEventListener('click',()=>{const i=q.options.findIndex(a=>rules[a]&&rules[a]!=='next');if(i>=0)P.commit(st,{ui:{tab:'logic',open:`route:${i}`}});});
        const remove=P.button(st,'Remove',tools,null,null);remove.disabled=!count;
        remove.addEventListener('click',()=>{const i=q.options.findIndex(a=>rules[a]&&rules[a]!=='next');if(i>=0)P.commit(st,{pick:[`route:${i}`,'next']});});
        const defaults=P.el(st,'div','ns-defaults',content);
        P.el(st,'div','',defaults,'Default behavior');
        const next=P.el(st,'div','ns-radio-row',defaults);P.el(st,'span','ns-radio on',next);P.el(st,'span','',next,'Continue to next section');
        const go=P.el(st,'div','ns-radio-row',defaults);P.el(st,'span','ns-radio',go);P.el(st,'span','',go,'Go to section:');const dest=P.button(st,'⌄',go,null,null,'ns-default-dest');dest.disabled=true;
      },
      routingRule: (base, S) => (st,p,q,answer,i) => {
        const P=S.P,dest=st.ctx.model.rules[q.id]?.[answer]||'next';
        const row=P.el(st,'div','ns-route-row',p);P.el(st,'span','',row,answer);
        P.select(st,'Go to section',`route:${i}`,dest==='next'?'Continue to next section':st.ctx.spec.sections.find(s=>s.id===dest)?.title||dest,row,'routes');
      },
    },
  },
});
