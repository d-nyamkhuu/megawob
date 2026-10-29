// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-branching-05',
  name: 'design',
  split: 'train',
  scenarios: ['branching'],
  template: 'use-gov-portal/portal',
  design: {
      fontFamily: '"Courier New",monospace', fontSize: 18, lineHeight: 1.25,
      insetX: 0, insetY: 0, maxWidth: 3000, maxHeight: 2000,
      inputHeight: 35, controlRadius: 0, shadow: 'none',
      twoColumnsAt: 500, sidebarWidth: 68, compactSidebarWidth: 68, narrowSidebarWidth: 60,
    parts: {
      heading: (base, S) => v => {
        const pill = v.u.el('span', 'gem-state', v.els.app); pill.hidden = true; v.els.pill = pill;
      },
      workflow: (base, S) => v => {
        const strip = v.u.el('div', 'gem-tabs', v.els.app);
        v.els.steps = v.u.el('div', 'gem-tab-items', strip);
        v.els.guide = S.P.button(v, strip, 'gem-hidden', 'Application guidance');
      },
      steps: (base, S) => (v, m) => {
        const row = v.els.steps; row.replaceChildren();
        for (const [i, label] of ['Applicant Details','Eligibility','Evidence','Review'].entries()) {
          const tab = S.P.button(v,row,'gem-tab' + ((m.page === 'form' ? i === 0 : i === 3) ? ' current' : ''), `${i+1}. ${label}`);
          tab.addEventListener('click', () => {
            if (i === 3) S.P.act(v,{nav:'review'});
            else if (m.page !== 'form') S.P.act(v,{nav:'edit'});
            else {
              const group = Object.entries(v.groups).find(([name]) => name.toLowerCase().includes(i === 0 ? 'applicant' : i === 1 ? 'eligibility' : 'evidence'));
              if (group) { v.els.pane.scrollTop += group[1].el.getBoundingClientRect().top - v.els.pane.getBoundingClientRect().top; S.P.geometry(v); }
            }
          });
        }
      },
      main: (base, S) => v => {
        const {u,els} = v;
        const main = u.el('div','gov-main',els.work), pane = u.el('div','gov-scroll',main);
        pane.setAttribute('aria-label','Application details'); pane.tabIndex = 0;
        const contextLabel = u.el('span','gem-hidden',main);
        const form = u.el('div','gov-form',pane), review = u.el('div','gov-review',pane), receipt = u.el('div','gov-receipt',pane);
        Object.assign(els,{main,pane,contextLabel,form,review,receipt});
      },
      introduction: (base, S) => v => {
        const notice = v.u.el('div','gov-alert',v.els.form);
        const errorBox = v.u.el('div','gov-alert bad',v.els.form); errorBox.setAttribute('role','alert');
        Object.assign(v.els,{notice,errorBox});
      },
      section: (base, S) => (v, name) => {
        const el = v.u.el('fieldset','gov-section gem-section-' + name.replace(/[^a-z]/gi,'').toLowerCase(),v.els.form);
        const title = name.replace(/^\d+\s*[·.]\s*/,'');
        v.u.el('legend','',el,title === 'Applicant' ? 'Applicant Details' : title);
        const status = v.u.el('span','gem-hidden',el);
        return {el,status,grid:v.u.el('div','gov-fields',el),fields:[]};
      },
      field: (base, S) => (v,f,group) => {
        const wrap = v.u.el('div','gov-field' + (f.kind === 'choice' ? ' gem-choice-field' : ' gem-text-field'),group.grid);
        const label = v.u.el('label','gov-label',wrap,f.label);
        return {wrap,label};
      },
      advice: (base, S) => v => { v.els.adviceItems = undefined; },
      declaration: (base, S) => (v,parent) => {
        const box = v.u.el('div','gov-declaration',parent);
        v.u.el('h3','gem-declaration-title',box,'Declaration');
        const label = v.u.el('label','gov-check',box);
        const check = v.u.el('input','',label); check.type = 'checkbox';
        v.u.el('span','',label,'I declare that the information I have given is correct and complete to the best of my knowledge.');
        return check;
      },
      sync: (base, S) => (v,m) => {
        base(v,m);
        if (v.els.formCheck) v.els.formCheck.checked = m.declared;
      },
      rendered: (base, S) => v => {
        const {els,u} = v;
        els.app.classList.toggle('gem-compressed',v.geo.height < 720);
        const applicant = Object.values(v.groups).find(g => g.fields.some(f => f.id === 'name'));
        const fieldRow = (parent,label,kind) => {
          const row = u.el('div','gem-extra-field gem-text-field',parent);
          const caption = u.el('label','gov-label',row,label);
          if (kind === 'title') {
            const shell = u.el('div','gem-title-control',row);
            const control = S.P.button(v,shell,'gem-title-button','');
            control.setAttribute('aria-label','Title'); control.setAttribute('aria-expanded','false');
            u.el('span','gem-select-arrow',control,'▼');
            const list = u.el('div','gem-title-list',shell); list.hidden = true;
            for (const title of ['Mr','Mrs','Miss','Ms','Mx','Dr']) {
              const option = S.P.button(v,list,'',title);
              option.addEventListener('click',() => { control.firstChild.nodeValue = title; list.hidden = true; control.setAttribute('aria-expanded','false'); });
            }
            control.prepend(document.createTextNode(''));
            control.addEventListener('click',() => { list.hidden = !list.hidden; control.setAttribute('aria-expanded',String(!list.hidden)); });
          } else if (kind === 'dob') {
            const boxes = u.el('div','gem-birth-boxes',row);
            for (const [i,name] of ['Day','Month','Year'].entries()) {
              if (i) u.el('span','',boxes,'/');
              const input = u.el('input','gov-input',boxes); input.type = 'text'; input.inputMode = 'numeric'; input.maxLength = i === 2 ? 4 : 2; input.setAttribute('aria-label','Date of birth: '+name);
            }
          } else {
            const input = u.el('input','gov-input',row); input.type = 'text'; input.setAttribute('aria-label',label.replace(':','')); caption.addEventListener('click',() => input.focus());
          }
          return row;
        };
        if (applicant) {
          applicant.el.classList.add('gem-applicant-layout');
          const left = u.el('div','gem-applicant-column',applicant.grid);
          const right = u.el('div','gem-applicant-column',applicant.grid);
          const titleRow = fieldRow(left,'Title:','title'); titleRow.classList.add('gem-title-row');
          const name = v.fields.name; if (name) left.append(name.wrap);
          fieldRow(left,'Last name:');
          fieldRow(left,'Date of birth:','dob');
          fieldRow(left,'National Insurance No:');
          const date = v.fields.date; if (date) { date.wrap.classList.add('gem-effective-date'); titleRow.append(date.wrap); }
          const address = v.s.fields.find(f => /address/i.test(f.label) && v.fields[f.id]);
          if (address) right.append(v.fields[address.id].wrap); else fieldRow(right,'Address line 1:');
          fieldRow(right,'Address line 2:'); fieldRow(right,'Town / City:');
          fieldRow(right,'Postcode:').classList.add('gem-postcode'); fieldRow(right,'Phone (optional):');
        }
        const eligibility = Object.values(v.groups).find(g => g.fields.some(f => f.kind === 'choice' && /employment/i.test(f.label)));
        if (eligibility) {
          eligibility.el.classList.add('gem-eligibility-layout');
          const support = u.el('div','gem-support-field',eligibility.grid);
          u.el('div','gov-label',support,'What type of support are you applying for?');
          const options = S.P.choiceGroup(v,support,'Support type');
          for (const value of ['Housing Support','Council Tax Support','Cost of Living Support','Disability Support']) {
            const button = S.P.choice(v,options,value,true); button.setAttribute('aria-checked','false');
            button.addEventListener('click',() => { for (const other of options.children) other.setAttribute('aria-checked',String(other === button)); });
          }
          eligibility.grid.prepend(support);
          for (const f of eligibility.fields) if (/employment/i.test(f.label)) v.fields[f.id].wrap.classList.add('gem-employment-field');
        }
        const correspondence = Object.values(v.groups).find(g => g.fields.some(f => /correspondence/i.test(f.label)));
        if (correspondence) {
          correspondence.el.classList.add('gem-correspondence-layout');
          for (const f of correspondence.fields) if (f.kind === 'choice') {
            const wrap = v.fields[f.id].wrap;
            wrap.querySelector('.gov-label').textContent = 'How would you like us to contact you?';
          }
        }
        const declaration = els.check.closest('.gov-declaration');
        const declarationPreview = declaration.cloneNode(true); declarationPreview.classList.add('gem-form-declaration');
        const previewCheck = declarationPreview.querySelector('input'); previewCheck.removeAttribute('id');
        els.formCheck = previewCheck; previewCheck.checked = v.ctx.model.declared;
        previewCheck.addEventListener('change',() => { if (previewCheck.checked !== v.ctx.model.declared) S.P.act(v,{declare:true}); });
        if (correspondence) correspondence.el.after(declarationPreview); else els.form.append(declarationPreview);
        els.work.append(els.sidebar);
        const title = S.P.button(v,els.sidebar,'gem-record-toggle','Ap…');
        title.setAttribute('aria-label','Applicant record'); title.title = 'Applicant record';
        els.sidebar.prepend(title);
        title.addEventListener('click', () => { els.sidebar.classList.toggle('gem-record-open'); S.P.geometry(v); });
        const preview = u.el('div','gem-record-preview',els.sidebar);
        for (let i=0;i<9;i++) u.el('span','gem-preview-dash',preview,'—');
        u.el('b','gem-preview-title',preview,'Ap…');
        for (let i=0;i<5;i++) u.el('span','gem-preview-dash',preview,'—');
        u.el('b','gem-preview-title',preview,'Ev…');
        for (let i=0;i<4;i++) u.el('span','gem-preview-cell',preview,'No…');
        u.el('b','gem-preview-title',preview,'Notes');
        u.el('div','gem-preview-scroll',preview,'▲\n▒\n▼');
        const library = els.form.querySelector('.gov-library');
        if (library) { const drawer = u.el('details','gem-library-drawer',els.form); u.el('summary','',drawer,'Account files'); drawer.append(library); }
        S.P.geometry(v);
      },
    },
  },
});
