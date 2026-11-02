// Design on use-legacy-app/desktop; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-swing-05',
  name: 'design',
  split: 'train',
  scenarios: ['swing'],
  template: 'use-legacy-app/desktop',
  design: {
    columns: ['ID', 'Name', 'Type', 'Status', 'Department', 'Cost Center'], tabNames: { swing: ['General', 'Operational', 'Scheduling'] }, maxWidth: 2400, maxHeight: 1400, inset: 0, treeWidth: 264, fontSize: 18, inputWidth: 260, inputHeight: 34, labelWidth: 130,
    parts: {
      build: (base, S) => function (ctx) {
        const P = S.P, E = S.els, el = ctx.util.el;
        P.menuFrame(ctx); P.helpDialog(ctx); P.menu(ctx); P.toolbar(ctx); P.breadcrumb(ctx);
        P.workspace(ctx);
        const side = el('section', 'sw-list', E.work);
        el('div', 'sw-bar', side, 'Work Centers');
        P.main(ctx); E.main.classList.add('sw-main');
        P.heading(ctx); P.search(ctx); E.key.placeholder='Search records...'; side.appendChild(E.searchRow);
        const list = el('div', 'sw-list-scroll', side);
        const listTable = el('table', 'sw-side-table', list);
        const lh = el('thead', '', listTable), hr = el('tr', '', lh);
        ['ID','Name','Type'].forEach(x => el('th','',hr,x));
        const lb = el('tbody','',listTable);
        S.spec.records.forEach((r,i) => { const row=el('tr','',lb); el('td','',row,r.key); el('td','',row,r.company); el('td','',row,'WC'); row.addEventListener('click', () => S.recordButtons[i].click()); });
        const task = el('section','sw-task',E.work);
        task.appendChild(E.main);
        const top = el('div','sw-top',E.main);
        P.navigator(ctx); top.appendChild(E.tree);
        const records=el('div','sw-records',top);
        el('div','sw-bar',records,`Records (${S.spec.records.length})`);
        P.directory(ctx); records.appendChild(E.directory);
        P.editor(ctx); P.welcome(ctx);
        P.inspector(ctx); P.dock(ctx); P.actions(ctx); P.status(ctx); P.ready(ctx);
      },
      navigator: (base, S) => function (ctx) {
        const E=S.els, P=S.P, el=ctx.util.el;
        E.tree=el('nav','lg-tree sw-tree',E.work); E.tree.setAttribute('aria-label','Record directory');
        el('div','sw-bar',E.tree,'Record Directory');
        const root=P.button(E.tree,'',()=>P.patch({tree:!ctx.model.tree}),'sw-tree-line');
        S.refs.tree=root; S.refs.treeToggle=P.icon('down',root); P.icon('folder',root); el('span','',root,'Operations');
        E.treeChildren=el('div','sw-tree-children',E.tree);
        for (const name of ['Work Centers','Machines','Labor Codes','Routings','BOMs']) {
          const b=P.button(E.tree,'',()=>P.patch({tree:true}),'sw-tree-line sw-tree-child');
          P.icon('right',b); P.icon('folder',b); el('span','',b,name);
          E.treeChildren.appendChild(b);
        }
        const admin=P.button(E.tree,'',()=>P.patch({tree:true}),'sw-tree-line'); P.icon('down',admin); P.icon('folder',admin); el('span','',admin,'Administration');
        for (const name of ['Departments','Cost Centers','Shifts','Users']) { const b=P.button(E.tree,'',()=>P.patch({tree:true}),'sw-tree-line sw-tree-child'); P.icon('right',b); P.icon('folder',b); el('span','',b,name); }
      },
      record: (base, S) => function (tbody,r,i) {
        const el=S.ctx.util.el, P=S.P;
        const row=el('tr','',tbody); S.els.rowNodes[i]=row;
        const td=el('td','',row); S.recordButtons[i]=P.button(td,r.key,()=>P.update({...env.taskDef.helpers.load(S.ctx.model,S.spec,i),tree:true}),'');
        el('td','',row,r.company); el('td','',row,'WC'); el('td','',row,'Active'); el('td','',row,r.city.slice(0,3).toUpperCase());
        S.refs[`cost:${i}`]=el('td','',row,r.base.cost);
        row.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON') S.recordButtons[i].click();});
      },
      editor: (base, S) => function (ctx) {
        const E=S.els, el=ctx.util.el;
        E.editor=el('div','lg-editor sw-editor',E.main);
        const title=el('div','lg-editor-title',E.editor); S.refs.editorTitle=el('span','',title);
        E.tabstrip=el('div','lg-tabs',E.editor); E.tabstrip.setAttribute('role','tablist');
        E.panes={}; E.sheet=el('div','lg-sheet',E.editor);
        for(let t=0;t<3;t++) S.P.tab(ctx,t);
        el('span','lg-tab sw-faux-tab',E.tabstrip,'Notes');
        el('span','lg-tab sw-faux-tab',E.tabstrip,'Attachments');
      },
      tab: (base, S) => function (ctx,t) {
        const E=S.els,P=S.P,el=ctx.util.el;
        S.tabs[t]=P.button(E.tabstrip,S.D.tabNames.swing[t],()=>{P.patch({tab:t});E.sheet.scrollTop=0;},'lg-tab'); S.tabs[t].setAttribute('role','tab');
        const pane=el('div','sw-form',E.sheet); E.panes[t]=pane;
        const left=el('div','sw-form-col',pane), right=el('div','sw-form-col',pane);
        const staticField=(parent,label)=>{const row=el('div','sw-faux-row',parent);el('label','',row,label);el('span','sw-faux-input',row);};
        staticField(left,'Record ID'); staticField(left,'Name'); staticField(left,'Type'); staticField(left,'Status'); staticField(left,'Department');
        if(t===0) P.field(ctx,left,S.spec.fields[0]); else staticField(left,'Cost center');
        staticField(right,'Location'); staticField(right,'Supervisor');
        if(t===2) P.field(ctx,right,S.spec.fields[2]); else staticField(right,'Retry limit');
        if(t===1) P.field(ctx,right,S.spec.fields[1]); else staticField(right,'Routing note');
        staticField(right,'Safety required'); staticField(right,'Active from'); staticField(right,'Active to');
        if(t===0){ for(const k of ['Owner','Organization','Location']) S.refs[k]=el('span','sw-hidden-ref',pane,'-'); }
      },
      inspector: (base, S) => function () { S.els.info={}; },
      sync: (base, S) => function (m) {
        base(m);
        S.root.querySelectorAll('.sw-side-table tbody tr').forEach((row,i)=>row.classList.toggle('on',i===m.active));
      },
    },
  },
});
