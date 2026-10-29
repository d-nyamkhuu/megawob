// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-checklist-03',
  name: 'design',
  split: 'train',
  scenarios: ['checklist'],
  template: 'use-gov-portal/portal',
  design: {
    fontSize:15, inputHeight:32, insetX:0, insetY:0, maxWidth:2200, maxHeight:1400, shadow:'none',
    parts: {
      fit: (base,S) => v => ({width:v.ctx.size.width,height:v.ctx.size.height,wide:false}),
      heading: (base,S) => v => {
        const h=v.u.el('div','swiss-heading',v.els.app);
        const row=v.u.el('div','swiss-title-row',h);
        v.u.el('h1','',row,'Civic Support Allowance');
        const chrome=v.ctx.stage.swissChrome||{};
        const tools=chrome.tools;
        if(tools)row.append(tools);
        const note=chrome.note;
        if(note)h.append(note);
        else v.u.el('p','',h,'Financial support for residents on a low income.');
        v.els.pill=v.u.el('span','swiss-hidden',h);
      },
      record: (base,S) => v => {
        base(v); // Retain the three case-number draws in their original order.
        const box=v.els.sidePanels.record;
        box.replaceChildren();
        v.u.el('h3','swiss-card-title',box,'Applicant');
        const dl=v.u.el('dl','swiss-record',box);
        const row=(label,value)=>S.P.recordRow(v,dl,label,value);
        row('Name',v.s.record.name);
        for(const f of v.s.fields) if(f.kind==='text'&&f.id!=='name') row(f.label,f.source);
        row('Residence in district',`${v.s.record.months} months`);
        row('Employment',v.s.record.employment);
        row('Dependants',v.s.record.dependants);
      },
      sidebar: (base,S) => v => {
        base(v);
        const cards=v.u.el('div','swiss-cards',v.els.app);
        cards.append(v.els.sidebar);
        v.els.app.insertBefore(cards,v.els.work);
        const rules=v.u.el('section','swiss-eligibility',cards);
        v.u.el('h3','swiss-card-title',rules,'Eligibility requirements');
        for(const [text,pass] of [
          ['At least 18 years old',true],['Resident in Switzerland',true],
          ['Valid residence permit (B, C or L)',true],
          [`At least ${v.s.record.minimum} months of residence`,v.s.record.eligible],
          ['Only provide employment and household details when they apply',null]
        ]) {
          const r=v.u.el('div','swiss-rule',rules);
          v.u.el('span',pass===true?'swiss-check':'swiss-circle',r,pass===true?'✓':'');
          v.u.el('span','',r,text);
        }
      },
      introduction: (base,S) => v => {
        base(v);
        const title=v.u.el('div','swiss-section-title',v.els.form);
        v.u.el('b','',title,'01');v.u.el('h2','',title,'Application form');
      },
      fields: (base,S) => v => {
        const grid=v.u.el('div','swiss-form-grid',v.els.form);
        v.els.fieldGrid=grid;
        base(v);
        const groups=Object.values(v.groups);
        const named=name=>groups.find(g=>g.el.querySelector('legend').textContent===name);
        const applicant=named('Applicant'),identity=named('Identity'),address=named('Address'),contact=named('Contact'),correspondence=named('Correspondence');
        if(applicant&&identity){
          for(const f of identity.fields)applicant.grid.append(v.fields[f.id].wrap);
          identity.el.classList.add('swiss-merged-section');
        }
        for(const [g,title]of [[applicant,'Personal information'],[address,'Address'],[contact,'Contact details'],[correspondence,'Preferred correspondence method']]){
          if(g){g.el.querySelector('legend').textContent=title;grid.append(g.el);}
        }
        for(const g of groups)if(!grid.contains(g.el))grid.append(g.el);
      },
      section: (base,S) => (v,name) => {
        const g=base(v,name);
        g.el.querySelector('legend').textContent=name.replace(/^\d+\s*·\s*/, '');
        return g;
      },
      field: (base,S) => (v,f,g) => {
        const wrap=v.u.el('div','gov-field'+(f.kind==='choice'?' gov-wide':''),g.grid);
        const label=v.u.el('label','gov-label',wrap,f.label);
        wrap.dataset.field=f.id;
        return {wrap,label};
      },
      evidence: (base,S) => v => {
        base(v);
        if(!v.s.docs.length)return;
        const fs=v.docs[v.s.docs[0].id].attach.closest('fieldset');
        fs.classList.add('swiss-evidence');
        const title=v.u.el('div','swiss-section-title',fs);
        v.u.el('b','',title,'02');v.u.el('h2','',title,'Evidence checklist');
        fs.prepend(title);
        const head=v.u.el('div','swiss-evidence-head',fs);
        for(const t of ['Document type','Details','Required','Type','Attachment'])v.u.el('span','',head,t);
        title.after(head);
      },
      evidenceRow: (base,S) => (v,parent,d,size,types) => {
        const w=base(v,parent,d,size,types);
        const row=w.attach.closest('.gov-file');
        row.classList.add('swiss-evidence-row');
        const name=v.u.el('div','swiss-doc-name',row,d.label);
        const detail=v.u.el('div','swiss-doc-detail',row,d.rule);
        const required=v.u.el('div','swiss-required',row);
        v.u.el('span',d.rule.startsWith('Optional')?'optional':'required',required,d.rule.startsWith('Optional')?'Optional':'Required');
        const toggle=S.P.button(v,w.chooser,'swiss-select','Select document type');
        toggle.setAttribute('aria-label',`${d.label} document type`);
        toggle.setAttribute('aria-expanded','false');
        const options=w.chooser.querySelector('.gov-options');
        const positionOptions=()=>{
          Object.assign(options.style,{position:'absolute',left:'6px',right:'6px',top:'100%',bottom:'auto'});
        };
        toggle.addEventListener('click',()=>{
          options.hidden=!options.hidden;toggle.setAttribute('aria-expanded',String(!options.hidden));
          positionOptions();
          S.P.geometry(v);
        });
        w.chooser.prepend(toggle);
        row.append(name,detail,required,w.chooser,w.attach,w.err);
        w.toggle=toggle;w.options=options;w.row=row;w.positionOptions=positionOptions;
        return w;
      },
      sync: (base,S) => (v,m) => {
        base(v,m);
        for(const d of v.s.docs){
          const w=v.docs[d.id],doc=m.docs[d.id];
          w.chooser.hidden=false;
          w.options.hidden=!doc.attached||!!doc.type;
          w.toggle.textContent=doc.type||'Select document type';
          w.toggle.setAttribute('aria-expanded',String(!w.options.hidden));
          w.row.classList.toggle('is-attached',doc.attached);
          w.positionOptions();
        }
        S.P.geometry(v);
      },
      geometry: (base,S) => v => {
        // Closed selectors are the visible targets until their options are opened.
        // Keep the template's scroll geometry and locate() on those same elements.
        for(const d of v.s.docs){
          const w=v.docs[d.id];
          if(!w?.options)continue;
          for(const [type,button] of w.buttons){
            S.P.put(v,{docType:[d.id,type]},w.options.hidden?w.toggle:button);
          }
        }
        base(v);
      },
      rendered: (base,S) => v => {
        base(v);
        const panel=v.ctx.stage.swissChrome?.panel;
        if(panel)v.els.app.querySelector('.swiss-cards').append(panel);
      },
    },
  },
});
